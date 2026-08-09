const test = require('node:test');
const assert = require('node:assert/strict');

const { generateFallbackMessage, parseArgs, resolveModelName, getModelCandidates } = require('../index.js');

test('generateFallbackMessage chooses a feature label for source changes', () => {
  const message = generateFallbackMessage(['src/index.js']);
  assert.match(message, /^feat:/);
});

test('generateFallbackMessage chooses a docs label for documentation changes', () => {
  const message = generateFallbackMessage(['README.md']);
  assert.match(message, /^docs:/);
});

test('parseArgs recognizes help and version flags', () => {
  assert.deepEqual(parseArgs(['--help']), { help: true, version: false, yes: false });
  assert.deepEqual(parseArgs(['--version']), { help: false, version: true, yes: false });
});

test('resolveModelName uses the configured override when present', () => {
  process.env.GEMINI_MODEL = 'gemini-2.5-flash';
  assert.equal(resolveModelName(), 'gemini-2.5-flash');
  delete process.env.GEMINI_MODEL;
});

test('getModelCandidates avoids deprecated Gemini 1.5 names', () => {
  process.env.GEMINI_MODEL = 'gemini-1.5-flash';
  const candidates = getModelCandidates();
  assert.ok(candidates.every((name) => !name.includes('gemini-1.5')));
  delete process.env.GEMINI_MODEL;
});
