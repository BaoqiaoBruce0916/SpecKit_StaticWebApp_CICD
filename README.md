# Tourist Destination Manager

[![Deploy to GitHub Pages](https://github.com/BaoqiaoBruce0916/SpecKit_StaticWebApp_CICD/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/BaoqiaoBruce0916/SpecKit_StaticWebApp_CICD/actions/workflows/deploy-web.yml)

A static web application for discovering and managing tourist destinations around the world. Built with vanilla HTML, CSS, and JavaScript.

## Deployment

The application is automatically deployed to GitHub Pages on every push to `main`.

- **Live Site**: [https://BaoqiaoBruce0916.github.io/SpecKit_StaticWebApp_CICD/](https://BaoqiaoBruce0916.github.io/SpecKit_StaticWebApp_CICD/)
- **Workflow**: [`.github/workflows/deploy-web.yml`](.github/workflows/deploy-web.yml)
- **Manual Deploy**: Go to the [Actions tab](https://github.com/BaoqiaoBruce0916/SpecKit_StaticWebApp_CICD/actions/workflows/deploy-web.yml) and click "Run workflow"

### Prerequisites for Deployment

1. GitHub Pages must be enabled in repository **Settings → Pages**
2. **Source** must be set to **GitHub Actions**
3. Branch protection on `main` is recommended (require PR + 1 reviewer)

## Local Development

Open `index.html` in a browser, or serve with a static file server:

```bash
npx serve .
```

## Project Structure

```
.
├── index.html          # Static entry point
├── styles.css          # Stylesheet
├── app.js              # Application logic
├── .github/
│   └── workflows/
│       └── deploy-web.yml  # GitHub Actions deployment workflow
└── specs/              # Feature specifications and documentation
```
