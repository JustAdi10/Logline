# Logline

Logline is a small Git CLI helper that generates conventional commit messages and can commit them for you. The project has been refreshed so it works again on modern Node.js and npm.

## Features

- AI-powered commit message generation with Google Gemini when a key is available
- Fallback message generation when AI is unavailable
- Automatic staging with `git add .`
- Interactive confirmation, or `--yes` to skip the prompt
- Basic regression tests for the CLI helpers

## Installation

```bash
npm install
```

For a global install:

```bash
npm install -g .
```

## Setup

Create a `.env` file with your Gemini API key:

```bash
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

You can also export it directly in your shell.

## Usage

```bash
# Make changes, then run
lol
```

Useful flags:

```bash
lol --help
lol --version
lol --yes
```

## Development

```bash
npm test
```

## License

Licensed under the ISC License. See [LICENSE](LICENSE).
