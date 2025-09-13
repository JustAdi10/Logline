#! /usr/bin/env node

const { execSync } = require("child_process");

// Find and list all staged files
try {
  const stagedFiles = execSync("git diff --staged --name-only", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter((file) => file.trim() !== "");

  if (stagedFiles.length === 0) {
    console.log("No files are staged for commit.");
    process.exit(0);
  }

  console.log("Staged files:");
  stagedFiles.forEach((file) => console.log(file));

  // basic type guessing
  const typeChecks = [
    { type: "test", match: (f) => f.match(/test/i) },
    { type: "chore", match: (f) => f.endsWith("package.json") },
    {
      type: "feat",
      match: (f) => f.startsWith("src/") || f.startsWith("lib/"),
    },
    { type: "docs", match: (f) => f.startsWith("docs/") || f === "README.md" },
    { type: "fix", match: (f) => f.match(/fix|bug/i) },
    { type: "style", match: (f) => f.match(/style|format/i) },
    { type: "refactor", match: (f) => f.match(/refactor/i) },
    { type: "perf", match: (f) => f.match(/perf|performance/i) },
    { type: "other", match: (f) => f.match(/index/i) },
  ];
  let type = "chore";
  for (const check of typeChecks) {
    if (stagedFiles.some(check.match)) {
      type = check.type;
      break;
    }
  }
  console.log("Guessed commit type:", type);
} catch (error) {
  console.error("Error executing git command:", error.message);
  process.exit(1);
}
