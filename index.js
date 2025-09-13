#!/usr/bin/env node

const { execSync } = require("child_process");
const prompts = require("prompts");

function analyzeChanges(diffOutput) {
  const lines = diffOutput.split('\n');
  let addedLines = 0;
  let deletedLines = 0;
  let addedContent = [];
  let deletedContent = [];
  let currentFile = '';
  
  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      currentFile = line.split(' ')[3]?.replace('b/', '') || '';
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      addedLines++;
      addedContent.push(line.substring(1).trim());
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletedLines++;
      deletedContent.push(line.substring(1).trim());
    }
  }
  
  return {
    addedLines,
    deletedLines,
    addedContent: addedContent.filter(l => l.length > 0),
    deletedContent: deletedContent.filter(l => l.length > 0),
    currentFile
  };
}

function generateCommitMessage(files, changes) {
  const { addedLines, deletedLines, addedContent } = changes;
  
  // Determine type based on files and changes
  let type = "chore";
  let scope = "";
  let description = "";
  
  // File-based type detection (enhanced)
  if (files.some(f => f.includes('test') || f.includes('spec'))) {
    type = "test";
  } else if (files.some(f => f.match(/\.(md|txt|rst)$/))) {
    type = "docs";
  } else if (files.some(f => f.includes('package.json'))) {
    type = "chore";
  } else if (files.some(f => f.includes('.github') || f.includes('ci') || f.includes('build'))) {
    type = "ci";
  } else if (files.length === 1 && files[0].includes('README')) {
    type = "docs";
  }
  
  // Content-based analysis for better type detection
  const contentText = addedContent.join(' ').toLowerCase();
  
  if (contentText.includes('function') || contentText.includes('const') || contentText.includes('class')) {
    if (addedLines > deletedLines * 2) {
      type = "feat";
    } else if (deletedLines > addedLines) {
      type = "refactor";
    }
  }
  
  if (contentText.includes('fix') || contentText.includes('bug') || contentText.includes('error')) {
    type = "fix";
  }
  
  if (contentText.includes('todo') || contentText.includes('fixme')) {
    type = "chore";
  }
  
  // Generate description based on changes
  if (files.length === 1) {
    const fileName = files[0].split('/').pop();
    
    if (addedLines > deletedLines * 3) {
      description = `add new functionality to ${fileName}`;
    } else if (deletedLines > addedLines * 2) {
      description = `remove unused code from ${fileName}`;
    } else if (Math.abs(addedLines - deletedLines) < 5) {
      description = `refactor ${fileName}`;
    } else {
      description = `update ${fileName}`;
    }
  } else {
    if (addedLines > deletedLines * 2) {
      description = `add new features across ${files.length} files`;
    } else if (deletedLines > addedLines * 2) {
      description = `clean up code across ${files.length} files`;
    } else {
      description = `update ${files.length} files`;
    }
  }
  
  // Detect scope from file paths
  const commonPaths = files.map(f => f.split('/')[0]);
  const uniquePaths = [...new Set(commonPaths)];
  if (uniquePaths.length === 1 && uniquePaths[0] !== files[0]) {
    scope = uniquePaths[0];
  }
  
  // Format final message
  const scopeString = scope ? `(${scope})` : "";
  return `${type}${scopeString}: ${description}`;
}

(async () => {
  try {
    const stagedFiles = execSync("git diff --staged --name-only").toString().trim();
    if (!stagedFiles) {
      console.log("No staged files found. Did you run `git add`?");
      process.exit(1);
    }

    const files = stagedFiles.split("\n");
    
    // Get the actual diff content
    const diffOutput = execSync("git diff --staged").toString();
    const changes = analyzeChanges(diffOutput);
    
    const header = generateCommitMessage(files, changes);

    console.log("\nSuggested commit message:");
    console.log("   " + header);
    console.log(`\nChanges: +${changes.addedLines} -${changes.deletedLines} lines\n`);

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