# Workflow Contract: deploy-web.yml

**Contract Type**: GitHub Actions Workflow Definition
**Version**: 1.0.0
**File**: `.github/workflows/deploy-web.yml`

## Overview

This document defines the contract for the `deploy-web` GitHub Actions workflow. The workflow is the sole mechanism for deploying the Tourist Destination Manager static site to GitHub Pages. Any change to the workflow YAML must maintain this contract.

## Schema

```yaml
name: string                    # "Deploy to GitHub Pages"

on:
  push:
    branches: [string]          # ["main"]
  workflow_dispatch: {}         # Manual trigger (no inputs)

permissions:
  contents: read                # Required: checkout source
  pages: write                  # Required: publish to Pages
  id-token: write               # Required: OIDC auth for deploy

concurrency:
  group: "pages"                # Fixed value
  cancel-in-progress: true      # Cancel stale runs

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "."              # Repository root
      - uses: actions/deploy-pages@v4
        id: deployment
```

## Contract Rules

| Rule | Enforcement |
|------|-------------|
| Workflow MUST trigger on push to `main` | Schema validation |
| Workflow MUST support `workflow_dispatch` | Schema validation |
| Workflow MUST use `deploy-pages@v4` as final step | Schema validation |
| `concurrency.group` MUST be `pages` | Ensures only one Pages deploy at a time |
| `concurrency.cancel-in-progress` MUST be `true` | Stale deploys are cancelled |
| `permissions.pages` MUST be `write` | Required by GitHub Pages API |
| `permissions.id-token` MUST be `write` | Required by `deploy-pages@v4` OIDC |
| Artifact `path` MUST be `"."` (repo root) | All static assets at root |
| Environment `name` MUST be `github-pages` | GitHub Pages standard environment |
| Environment `url` MUST reference `steps.deployment.outputs.page_url` | Dynamic URL from deploy step |
