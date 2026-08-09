#!/usr/bin/env node

require('dotenv').config();
const pkg = require('./package.json');
const { execFileSync } = require('child_process');

function parseArgs(argv = process.argv.slice(2)) {
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    version: argv.includes('--version') || argv.includes('-v'),
    yes: argv.includes('--yes') || argv.includes('-y')
  };
}

function formatHelp() {
  return `
  Usage: lol [options]

  Git CLI tool that writes your commit messages for you.

  Commands:
    lol          Generate an AI commit message and commit
    logline      Same as 'lol'

  Options:
    -h, --help       Show this help message
    -v, --version    Show the current version
    -y, --yes        Skip the confirmation prompt and commit immediately
  `;
}

function runGit(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    ...options
  });
}

function resolveModelName() {
  return process.env.GEMINI_MODEL || 'gemini-2.0-flash';
}

async function generateCommitMessageWithAI(diff, files) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('Warning: GEMINI_API_KEY not set, using fallback generation');
      return generateFallbackMessage(files);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `Analyze this git diff and generate a concise, conventional commit message.

Rules:
- Use conventional commit format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore, ci
- Keep description under 50 characters
- Be specific about what changed
- Don't mention file names unless crucial

Files changed: ${files.join(', ')}

Git diff:
${diff.length > 4000 ? `${diff.substring(0, 4000)}\n... (truncated)` : diff}

Generate only the commit message, nothing else.`;

    const candidates = [resolveModelName(), 'gemini-1.5-flash', 'gemini-1.5-pro'];
    const uniqueCandidates = [...new Set(candidates.filter(Boolean))];

    let lastError;
    for (const modelName of uniqueCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let message = response.text().trim();
        message = message.replace(/^['"`]+|['"`]+$/g, '').trim();

        return message || generateFallbackMessage(files);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Unable to generate a message with Gemini');
  } catch (error) {
    console.log('AI generation failed, using fallback:', error.message);
    return generateFallbackMessage(files);
  }
}

function generateFallbackMessage(files = []) {
  const normalized = (files || []).filter(Boolean).map((file) => file.toLowerCase());

  if (normalized.some((file) => /package(-lock)?\.json$|pnpm-lock\.yaml$/.test(file))) {
    return 'chore: update dependencies or tooling';
  }

  if (normalized.some((file) => file.startsWith('src/') || file.includes('/src/'))) {
    return 'feat: update source implementation';
  }

  if (normalized.some((file) => /(^|\/)(test|tests|spec)(\/|$)/.test(file) || /test/i.test(file))) {
    return 'test: add or update tests';
  }

  if (normalized.some((file) => /\.(md|txt|rst)$/.test(file))) {
    return 'docs: update documentation';
  }

  if (normalized.some((file) => /\.json$/.test(file))) {
    return 'chore: update configuration';
  }

  return 'chore: update project files';
}

async function promptForCommitMessage(header, autoApprove) {
  if (autoApprove || !process.stdin.isTTY || !process.stdout.isTTY) {
    return { use: true, message: header };
  }

  const prompts = require('prompts');
  const response = await prompts({
    type: 'confirm',
    name: 'use',
    message: 'Use this commit message?',
    initial: true
  });

  if (response.use === undefined) {
    return { cancelled: true };
  }

  if (response.use) {
    return { use: true, message: header };
  }

  const custom = await prompts({
    type: 'text',
    name: 'msg',
    message: 'Enter your commit message (leave blank to abort):'
  });

  if (custom.msg === undefined) {
    return { cancelled: true };
  }

  return { use: Boolean(custom.msg && custom.msg.trim()), message: custom.msg.trim() };
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);

  if (options.help) {
    console.log(formatHelp());
    return 0;
  }

  if (options.version) {
    console.log(pkg.version);
    return 0;
  }

  try {
    console.log('Staging all changes...');
    runGit(['add', '.'], { stdio: 'inherit' });

    const output = runGit(['diff', '--staged', '--name-only'], { encoding: 'utf8' }).trim();
    if (!output) {
      console.log('No changes to commit. Working directory clean.');
      return 1;
    }

    const files = output.split('\n').filter(Boolean);
    const diff = runGit(['diff', '--staged'], { encoding: 'utf8' });

    console.log('Generating commit message...');
    const header = await generateCommitMessageWithAI(diff, files);

    console.log('\nSuggested commit message:');
    console.log(`   ${header}\n`);

    const promptResult = await promptForCommitMessage(header, options.yes);
    if (promptResult.cancelled) {
      console.log('\nOperation cancelled.');
      return 0;
    }

    if (!promptResult.use || !promptResult.message) {
      console.log('Commit aborted.');
      return 0;
    }

    runGit(['commit', '-m', promptResult.message], { stdio: 'inherit' });
    console.log('Commit successful!');
    return 0;
  } catch (error) {
    console.error('Error:', error.message);
    return 1;
  }
}

if (require.main === module) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error('Error:', error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  generateFallbackMessage,
  generateCommitMessageWithAI,
  parseArgs,
  main,
  resolveModelName
};
