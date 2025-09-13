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

  //curude type guessing
  let type  = "chore";
  if(FileSystem.some(f => f.includes("test"))) type = "test";
  else if (FileSystem.some(f => f.includes("package.json"))) type = "chore";
  else if (FileSystem.some(f => f.includes("src/") || f.includes("lib/"))) type = "feat";
  else if (FileSystem.some(f => f.includes("docs/") || f.includes("README.md"))) type = "docs";
  else if (FileSystem.some(f => f.includes("fix") || f.includes("bug"))) type = "fix";

} catch (error) {
  console.error("Error executing git command:", error.message);
  process.exit(1);
}
