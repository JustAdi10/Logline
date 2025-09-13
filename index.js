#!/usr/bin/env node

require('dotenv').config();
const { execSync } = require("child_process");
const prompts = require("prompts");

async function generateCommitMessageWithAI(diff, files) {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    
    // You'll need to set your API key as an environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("Warning: GEMINI_API_KEY not set, falling back to simple generation");
      return generateFallbackMessage(files);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this git diff and generate a concise, conventional commit message. 

Rules:
- Use conventional commit format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore, ci
- Keep description under 50 characters
- Be specific about what changed
- Don't mention file names unless crucial

Files changed: ${files.join(', ')}

Git diff:
${diff.length > 4000 ? diff.substring(0, 4000) + '\n... (truncated)' : diff}

Generate only the commit message, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let message = response.text().trim();
    
    // Clean up the response - remove quotes, extra whitespace, etc.
    message = message.replace(/^["']|["']$/g, '').trim();
    
    return message;
  } catch (error) {
    console.log("AI generation failed, using fallback:", error.message);
    return generateFallbackMessage(files);
  }
}

function generateFallbackMessage(files) {
  let type = "chore";
  if (files.some(f => f.endsWith("package.json"))) type = "chore";
  else if (files.some(f => f.startsWith("src/"))) type = "feat";
  else if (files.some(f => f.match(/test/i))) type = "test";
  else if (files.some(f => f.match(/\.(md|txt)$/))) type = "docs";

  return `${type}: update ${files.length === 1 ? files[0] : files.length + " files"}`;
}

(async () => {
  try {
    const output = execSync("git diff --staged --name-only").toString().trim();
    if (!output) {
      console.log("No staged files found. Did you run `git add`?");
      process.exit(1);
    }

    const files = output.split("\n");
    
    // Get the full diff for AI analysis
    const diff = execSync("git diff --staged").toString();
    
    console.log("Generating commit message with AI...");
    const header = await generateCommitMessageWithAI(diff, files);

    console.log("\nSuggested commit message:");
    console.log("   " + header + "\n");

    const response = await prompts({
      type: "confirm",
      name: "use",
      message: "Use this commit message?",
      initial: true
    });

    if (response.use === undefined) {
      console.log("\nOperation cancelled.");
      process.exit(0);
    }

    if (response.use) {
      execSync(`git commit -m "${header}"`, { stdio: "inherit" });
      console.log("Commit successful!");
      process.exit(0);
    }

    const custom = await prompts({
      type: "text",
      name: "msg",
      message: "Enter your commit message (leave blank to abort):"
    });

    if (custom.msg === undefined) {
      console.log("\nOperation cancelled.");
      process.exit(0);
    }

    if (custom.msg && custom.msg.trim() !== "") {
      execSync(`git commit -m "${custom.msg.replace(/\"/g, '\\"')}"`, { stdio: "inherit" });
      console.log("Commit successful!");
    } else {
      console.log("Commit aborted.");
    }
    
    process.exit(0);
    
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();