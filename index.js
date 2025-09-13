#! /usr/bin/env node

const { execSync } = require('child_process');

try {
    const stagedFiles = execSync('git diff --staged --name-only', { encoding: 'utf-8' })
        .split('\n')
        .filter(file => file.trim() !== '');

    if (stagedFiles.length === 0) {
        console.log('No files are staged for commit.');
        process.exit(0);
    }

    console.log('Staged files:');
    stagedFiles.forEach(file => console.log(file));
} catch (error) {
    console.error('Error executing git command:', error.message);
    process.exit(1);
}