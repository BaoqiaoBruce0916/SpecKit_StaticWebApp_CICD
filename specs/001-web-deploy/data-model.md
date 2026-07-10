# Data Model: Web Deploy

**Feature**: 001-web-deploy
**Date**: 2026-07-10

## Entities

### 1. Workflow

The GitHub Actions workflow that orchestrates deployment. Defined as a single YAML file.

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `name` | string | Human-readable workflow name | Must be unique within the repository |
| `on.push.branches` | string[] | Trigger branches | Must include `main` |
| `on.workflow_dispatch` | object | Manual trigger config | Must be present (no required inputs) |
| `permissions.contents` | string | Repo read access | Must be `read` |
| `permissions.pages` | string | Pages publish access | Must be `write` |
| `permissions.id-token` | string | OIDC auth for deploy | Must be `write` |
| `concurrency.group` | string | Concurrency scope | Must be `pages` |
| `concurrency.cancel-in-progress` | boolean | Cancel stale runs | Must be `true` |
| `jobs.deploy.runs-on` | string | Runner environment | Must be `ubuntu-latest` |
| `jobs.deploy.environment.name` | string | Deployment environment | Must be `github-pages` |
| `jobs.deploy.environment.url` | string | Public URL | Dynamically set to `${{ steps.deployment.outputs.page_url }}` |
| `jobs.deploy.steps` | array | Deployment steps | Must contain: configure-pages → upload-artifact → deploy-pages |

**Lifecycle States**:
```
[Created] → [Triggered] → [Configuring] → [Uploading] → [Deploying] → [Succeeded]
                                                                      → [Failed]
```

- **Created**: Workflow file committed to `.github/workflows/`
- **Triggered**: Push to main or manual dispatch fires the workflow
- **Configuring**: `configure-pages` step running
- **Uploading**: `upload-pages-artifact` step running
- **Deploying**: `deploy-pages` step running
- **Succeeded**: Artifact published, site live at URL
- **Failed**: Any step errors; previous deployment remains active

### 2. StaticAsset

A file in the repository root that is deployed as part of the static site.

| Attribute | Type | Description |
|-----------|------|-------------|
| `path` | string | Relative path from repository root |
| `type` | enum | `html`, `css`, `javascript`, `other` |
| `size` | number | File size in bytes |

**Current Assets**:

| File | Type |
|------|------|
| `index.html` | html |
| `styles.css` | css |
| `app.js` | javascript |

**Deployment Rule**: All files at repository root are included. The upload step packages the entire root directory.

### 3. DeploymentEnvironment

The GitHub Pages environment that hosts the deployed site.

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | string | Always `github-pages` |
| `url` | string | Public URL (e.g., `https://<owner>.github.io/<repo>/`) |
| `source` | enum | Always `github-actions` (set in repo Settings) |
| `branch` | string | Not used (Actions-based deployment) |

### Relationships

```
Workflow --deploys--> StaticAsset[*]
Workflow --publishes to--> DeploymentEnvironment
DeploymentEnvironment --serves--> StaticAsset[*]
```
