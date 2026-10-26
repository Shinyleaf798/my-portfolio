// Quarantines content files whose frontmatter would abort the build.
//
// Astro stops at the first invalid entry, so one malformed file in the
// notes repo takes the whole site offline. Content there is edited by
// hand and pushed without a build step, so this removes the bad files,
// warns loudly, and lets everything else deploy.
//
// Run after injecting the notes repo; never exits non-zero.

import { readdir, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { load as parseYaml } from 'js-yaml';

const CONTENT_ROOT = 'src/content';

// Mirrors the required fields in src/content.config.ts. `either` lists
// field groups where at least one member must be present.
const RULES = {
  notes: { required: ['title', 'date'], either: [['summary', 'description']] },
  projects: { required: ['title', 'date'], either: [['summary', 'description']] },
  news: {
    required: ['title', 'date', 'sourceUrl'],
    either: [['summary', 'description']],
  },
};

async function markdownFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const found = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await markdownFiles(path)));
    else if (/\.mdx?$/.test(entry.name)) found.push(path);
  }
  return found;
}

function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { error: '缺少 frontmatter (--- 开头的那一段)' };
  if (!match[1].trim()) return { error: 'frontmatter 是空的' };
  try {
    const data = parseYaml(match[1]);
    if (!data || typeof data !== 'object') return { error: 'frontmatter 不是键值对' };
    return { data };
  } catch (err) {
    return { error: `YAML 语法错误: ${err.message.split('\n')[0]}` };
  }
}

function problems(data, rule) {
  const missing = rule.required.filter((f) => data[f] === undefined || data[f] === null);
  for (const group of rule.either) {
    if (group.every((f) => data[f] === undefined || data[f] === null)) {
      missing.push(group.join(' 或 '));
    }
  }
  const issues = missing.map((f) => `缺少 ${f}`);
  if (data.date !== undefined && Number.isNaN(new Date(data.date).getTime())) {
    issues.push(`date 不是有效日期: ${JSON.stringify(data.date)}`);
  }
  return issues;
}

const skipped = [];
let checked = 0;
let drafts = 0;

for (const [collection, rule] of Object.entries(RULES)) {
  for (const file of await markdownFiles(join(CONTENT_ROOT, collection))) {
    checked++;
    const raw = await readFile(file, 'utf8');
    const { data, error } = frontmatter(raw);
    // Drafts stay in the notes repo but never reach the site; not an error
    if (data?.draft === true) {
      await rm(file);
      drafts++;
      continue;
    }
    const issues = error ? [error] : problems(data, rule);
    if (issues.length === 0) continue;
    await rm(file);
    skipped.push({ file: relative(process.cwd(), file).replace(/\\/g, '/'), issues });
  }
}

// Handed to the deploy job, which turns the run red once the site is up -
// a skipped file is easy to miss when the only trace is a warning.
async function reportCount(n) {
  if (!process.env.GITHUB_OUTPUT) return;
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_OUTPUT, `skipped=${n}\n`);
}

if (skipped.length === 0) {
  console.log(`内容检查通过: ${checked} 个文件 (草稿 ${drafts} 个, 不发布)`);
  await reportCount(0);
  process.exit(0);
}

// GitHub renders ::warning:: on the run page; the summary survives in the
// job output so the reason is still there days later.
const summary = [
  `### 跳过了 ${skipped.length} 个内容文件`,
  '',
  '这些文件的 frontmatter 不合格, 已从本次构建中排除。网站其余部分照常部署。',
  '',
  '| 文件 | 问题 |',
  '| --- | --- |',
];

for (const { file, issues } of skipped) {
  console.log(`::warning file=${file}::跳过 ${file} — ${issues.join('; ')}`);
  summary.push(`| \`${file}\` | ${issues.join('<br>')} |`);
}

console.log(`\n内容检查: ${checked} 个文件, 草稿 ${drafts} 个, 跳过 ${skipped.length} 个`);

await reportCount(skipped.length);

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary.join('\n') + '\n');
}
