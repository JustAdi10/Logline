#  Logline

**Git CLI tool that writes my commit messages for me.**

Logline makes committing code frictionless and consistent without forcing you to remember Conventional Commit rules or manually type messages every time. It uses AI to analyze your code changes and generates meaningful commit messages automatically.

##  Features

- ** AI-Powered Messages**: Uses Google Gemini to analyze your git diff and generate contextually relevant commit messages
- ** Conventional Commits**: Automatically follows conventional commit format (`type(scope): description`)
- ** Interactive CLI**: Simple yes/no prompts with option to customize messages
- ** Smart Analysis**: Understands code changes, not just filenames
- ** Zero Configuration**: Works out of the box with minimal setup
- ** Fallback Support**: Works even without AI when API is unavailable

##  Installation

### Global Installation
```bash
npm install -g logline
```

### Local Development
```bash
git clone https://github.com/JustAdi10/Logline.git
cd Logline
npm install
npm link  # Makes 'lol' command available globally
```

## 🔑 Setup

1. Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env` file in your project directory:
```bash
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

3. Or set it as an environment variable:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

##  Usage

### Basic Usage

1. Stage your changes as usual:
```bash
git add .
```

2. Run Logline instead of `git commit`:
```bash
lol  # or `logline` if you prefer
```

3. Review the AI-generated commit message:
```
Generating commit message with AI...

Suggested commit message:
   feat: add AI-powered commit message generation

✔ Use this commit message? › (Y/n)
```

4. Choose your action:
   - **Yes**: Commits with the suggested message
   - **No**: Prompts you to enter a custom message
   - **Ctrl+C**: Cancels the operation

### Example Workflow

```bash
# Make your changes
echo "console.log('Hello World')" >> app.js

# Stage changes
git add app.js

# Let Logline handle the commit
lol
```

##  Example Messages

Instead of generic messages, Logline generates contextual ones:

| Traditional | Logline Generated |
|------------|-------------------|
| `update app.js` | `feat: add hello world logging functionality` |
| `fix bug` | `fix: resolve undefined variable error in auth` |
| `change readme` | `docs: update installation instructions` |

##  How It Works

1. **Analyzes Changes**: Reads your `git diff --staged` to understand what actually changed
2. **AI Processing**: Sends the diff to Gemini AI with specialized prompts for commit message generation
3. **Format Enforcement**: Ensures output follows conventional commit standards
4. **User Control**: Always gives you the final say on the commit message

##  Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Required for AI features |

### Fallback Behavior

When AI is unavailable (no API key, network issues, etc.), Logline falls back to intelligent file-based analysis:

- `feat`: New source files or significant additions
- `fix`: Changes containing "fix", "bug", or error handling
- `docs`: Documentation file changes
- `test`: Test file modifications  
- `chore`: Configuration, dependency, or maintenance changes

##  Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Use Logline to commit: `lol` 😉
5. Push and create a pull request

##  License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **Google Gemini** for powering the AI commit message generation
- **Conventional Commits** for the commit message format standards
- The developer community for inspiration on making git workflows more enjoyable

##  Issues & Support

Found a bug or have a feature request? 
- [Open an issue](https://github.com/JustAdi10/Logline/issues)
- Check existing issues before creating a new one
- Include your OS, Node version, and error messages

##  Stats

[![npm version](https://badge.fury.io/js/logline.svg)](https://www.npmjs.com/package/logline)
[![GitHub issues](https://img.shields.io/github/issues/JustAdi10/Logline)](https://github.com/JustAdi10/Logline/issues)
[![GitHub stars](https://img.shields.io/github/stars/JustAdi10/Logline)](https://github.com/JustAdi10/Logline/stargazers)

---

**Made with ❤️ by developers, for developers who want better commit messages without the hassle.**
