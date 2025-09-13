#!/usr/bin/env node

const { execSync } = require("child_process");
const prompts = require("prompts");

try {
  const output = execSync("git diff --staged --name-only").toString().trim();
  if (!output) {
    console.log("No staged files found. Did you run `git add`?");
    process.exit(1);
  }

  const files = output.split("\n");

  // crude type guesser (use your improved rules here)
  let type = "chore";
  if (files.some(f => f.endsWith("package.json"))) type = "chore";
  else if (files.some(f => f.startsWith("src/"))) type = "feat";
  else if (files.some(f => f.match(/test/i))) type = "test";
  else if (files.some(f => f.match(/\.(md|txt)$/))) type = "docs";

  const header = `${type}: update ${files.length === 1 ? files[0] : files.length + " files"}`;

  console.log("\nSuggested commit message:");
  console.log("   " + header + "\n");

  (async () => {
    const response = await prompts({
      type: "confirm",
      name: "use",
      message: "Use this commit message?",
      initial: true
    });

    if (response.use) {
      execSync(`git commit -m "${header}"`, { stdio: "inherit" });
    } else {
      // Prompt user to enter their own commit message
      const custom = await prompts({
        type: "text",
        name: "msg",
        message: "Enter your commit message (leave blank to abort):"
      });
      if (custom.msg && custom.msg.trim() !== "") {
        execSync(`git commit -m "${custom.msg.replace(/\"/g, '\\"')}"`, { stdio: "inherit" });
      } else {
        console.log("Commit aborted.");
      }
    }
  })();

} catch (err) {
  console.error("Error:", err.message);
}
