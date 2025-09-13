#  LoglineLogline



**Git CLI tool that writes your commit messages for you.**Git CLI tool that writes your commit messages for you.



[![npm version]](https://www.npmjs.com/package/@justadi10/logline)Logline makes committing code frictionless and consistent. It automatically generates meaningful, conventional commit messages using AI, so you don’t have to waste time remembering formats or writing vague messages.

[![GitHub issues](https://img.shields.io/github/issues/JustAdi10/Logline)](https://github.com/JustAdi10/Logline/issues)

[![GitHub stars](https://img.shields.io/github/stars/JustAdi10/Logline)](https://github.com/JustAdi10/Logline/stargazers)Features



Logline makes committing code frictionless and consistent. It automatically generates meaningful, conventional commit messages using AI, so you don't have to waste time remembering formats or writing vague messages.AI-powered commit message generation using Google Gemini



##  FeaturesConventional Commits format enforced automatically (type(scope): description)



-  **AI-powered commit message generation** using Google GeminiInteractive CLI with option to edit or override messages

-  **Conventional Commits format** enforced automatically (`type(scope): description`)

-  **Interactive CLI** with option to edit or override messages  Smart analysis of actual code changes, not just filenames

-  **Smart analysis** of actual code changes, not just filenames

-  **Works out of the box** with minimal setupWorks out of the box with minimal setup

-  **Fallback mode** for when AI is unavailable

-  **Auto-staging** - automatically runs `git add .` for youFallback mode for when AI is unavailable



##  InstallationInstallation

Global Install

```bashnpm install -g @justadi10/logline

npm install -g @justadi10/logline

```Local Development

git clone https://github.com/JustAdi10/Logline.git

##  Setupcd Logline

npm install

1. Get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)npm link   # Makes 'lol' command available globally



2. Set your API key:Setup



```bashGet a free Gemini API key from Google AI Studio

# Option A: Use .env file

echo "GEMINI_API_KEY=your-api-key-here" > .env  Set your API key:



# Option B: Export directly# Option A: Use .env

export GEMINI_API_KEY="your-api-key-here"echo "GEMINI_API_KEY=your-api-key-here" > .env  

```

# Option B: Export directly

##  Usageexport GEMINI_API_KEY="your-api-key-here"



### Basic WorkflowUsage

Basic Workflow

```bash# Stage changes

# Make your changesgit add .

echo "new feature" >> app.js

# Generate commit with AI

# That's it! Just run:lol   # or 'logline'

lol   # or 'logline'

```

Example:

*No need for `git add` - Logline does it automatically!*

Generating commit message with AI...

### Example Output

Suggested commit message:

```   feat: add AI-powered commit message generation

Staging all changes...

Generating commit message with AI...✔ Use this commit message? › (Y/n)



Suggested commit message:

   feat: add AI-powered commit message generationOptions:



✔ Use this commit message? › (Y/n)Yes → Commits with the AI suggestion

```

No → Lets you enter your own message

### Your Options

Ctrl+C → Cancels the commit

- **Yes** → Commits with the AI suggestion

- **No** → Lets you enter your own message  Example Flow

- **Ctrl+C** → Cancels the commitecho "console.log('Hello World')" >> app.js

git add app.js

##  Example Messageslol



Instead of generic messages, Logline generates contextual ones:Example Messages

Traditional	Logline Generated

| Traditional | Logline Generated |update app.js	feat: add hello world logging functionality

|------------|-------------------|fix bug	fix: resolve undefined variable error in auth

| `update app.js` | `feat: add hello world logging functionality` |change readme	docs: update installation instructions

| `fix bug` | `fix: resolve undefined variable error in auth` |Configuration

| `change readme` | `docs: update installation instructions` |Environment Variables

Variable	Description	Required

##  ConfigurationGEMINI_API_KEY	Google Gemini API key	Yes (for AI features)

Fallback Behavior

### Environment Variables

When AI is unavailable, Logline generates file-based commit messages:

| Variable | Description | Required |

|----------|-------------|----------|feat → New files or major additions

| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI features) |

fix → Patches with “fix”, “bug”, or error handling

### Fallback Behavior

docs → Documentation changes

When AI is unavailable, Logline generates file-based commit messages:

test → Test file changes

- **feat** → New files or major additions

- **fix** → Patches with "fix", "bug", or error handling  chore → Config, dependencies, or maintenance

- **docs** → Documentation changes

- **test** → Test file changesContributing

- **chore** → Config, dependencies, or maintenance

Fork the repository

##  Contributing

Create a branch: git checkout -b feature/awesome-feature

1. Fork the repository

2. Create a branch: `git checkout -b feature/awesome-feature`Make changes and test them

3. Make changes and test them

4. Use `lol` to commit 😉Use lol to commit

5. Push and open a pull request

Push and open a pull request

##  License

License

Licensed under the ISC License – see [LICENSE](LICENSE).

Licensed under the ISC License – see LICENSE

##  Acknowledgments.



- **Google Gemini** for AI-powered commit generationAcknowledgments

- **Conventional Commits** for the commit message format

- The developer community for inspiration on improving git workflowsGoogle Gemini for AI-powered commit generation



##  Issues & SupportConventional Commits for the commit message format



- [Open an issue](https://github.com/JustAdi10/Logline/issues)The developer community for inspiration on improving git workflows

- Include OS, Node.js version, and errors when reporting

Issues & Support

---

Open an issue

**Built for developers who want better commit messages without the hassle.**
Include OS, Node.js version, and errors when reporting

Project Stats






Built for developers who want better commit messages without the hassle.