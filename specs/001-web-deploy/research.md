# Research: Web Deploy

**Feature**: 001-web-deploy
**Date**: 2026-07-10

## Research Tasks

### 1. GitHub Pages Deployment Pattern (deploy-pages@v4)

**Context**: The spec requires deploying a static site to GitHub Pages using `deploy-pages@v4`.

**Decision**: Use the standard 3-action GitHub Pages pipeline:
1. `actions/configure-pages@v4` — configures Pages settings and sets up artifact retention
2. `actions/upload-pages-artifact@v3` — packages the static files into a deployable artifact
3. `actions/deploy-pages@v4` — publishes the artifact to GitHub Pages

**Rationale**: These are the official GitHub-maintained actions for Pages deployment. The 3-step pipeline is the documented best practice from GitHub's own "Deploy to GitHub Pages" starter workflow. Each action has a single responsibility (configure → package → publish).

**Alternatives considered**:
- `peaceiris/actions-gh-pages@v3` (third-party): Rejected — GitHub's official actions are simpler and maintained by the platform vendor.
- Custom `git push` to `gh-pages` branch: Rejected — the Actions-based approach is cleaner, doesn't pollute the commit history, and is the recommended method since GitHub Pages added Actions support.
- Single composite action: Rejected — the 3-step pipeline is more transparent and debuggable.

---

### 2. GitHub Actions Concurrency Control

**Context**: FR-009 requires cancelling in-progress deployments when a new push arrives.

**Decision**: Use the built-in `concurrency` key in the workflow YAML:

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: true
```

**Rationale**: GitHub Actions' native concurrency groups are purpose-built for this. Setting `cancel-in-progress: true` ensures only the latest deployment completes. The `pages` group name scopes cancellation to Pages deployments only.

**Alternatives considered**:
- Custom `workflow_run` with queue logic: Over-engineered for this use case.
- No concurrency control: Rejected — violates FR-009 and could result in stale deployments winning.

---

### 3. GitHub Pages Permissions Model

**Context**: FR-008 requires minimum permissions for Pages deployment.

**Decision**: Set workflow-level permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**Rationale**:
- `contents: read` — needed to check out the repository code
- `pages: write` — needed to publish to GitHub Pages
- `id-token: write` — needed for OIDC-based authentication to the Pages deployment service (required by `deploy-pages@v4`)

These are the documented minimum permissions for GitHub Pages deployment via Actions. No broader `contents: write` or `actions: write` is needed.

**Alternatives considered**:
- Default (`write-all`) permissions: Rejected — violates security best practices and the principle of least privilege.
- `contents: write`: Rejected — unnecessary; the workflow only reads source, never writes to the repository.

---

### 4. Workflow Trigger on Main Branch

**Context**: FR-001 requires triggering on push to `main`, FR-002 requires manual dispatch.

**Decision**: Configure dual triggers:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

**Rationale**: `push: branches: [main]` scopes the trigger to only the main branch, preventing accidental deployments from feature branches. `workflow_dispatch` is the standard manual trigger mechanism with no additional parameters needed for a simple static deploy.

**Alternatives considered**:
- `push` without branch filter: Rejected — would trigger on every branch push, wasting Actions minutes.
- `workflow_run` chaining: Rejected — unnecessary complexity for a single-job deployment.
- Adding `inputs` to `workflow_dispatch` (e.g., environment selector): Rejected — YAGNI; only one deployment target exists.

---

### 5. Branch Protection & Constitution Compliance

**Context**: The constitution requires PRs for all changes to `main`. The workflow triggers on push to main, which is the *effect* of a merged PR — but direct pushes would also trigger it unless branch protection is enabled.

**Decision**: Document branch protection as a mandatory prerequisite in `quickstart.md`. The workflow itself cannot enforce branch protection — this is a GitHub repository setting.

**Recommended branch protection rules** (per constitution):
- Require a pull request before merging to `main`
- Require at least 1 approving review
- Dismiss stale reviews when new commits are pushed
- (Optional) Require status checks to pass before merging

**Rationale**: Branch protection is the only mechanism GitHub provides to enforce the constitution's "no direct commits to main" rule. The workflow's push trigger is correct — it deploys the *result* of a merge — but it cannot determine *how* the code reached main. This separation of concerns (workflow = deploy, branch protection = gate merges) is standard GitHub practice.

**Alternatives considered**:
- Checking `github.event.before` in a pre-deploy script to detect direct pushes: Unreliable and fragile; branch protection rules are the correct mechanism.
- Triggering on `pull_request: closed: [merged]`: Non-standard for Pages deployment and would miss other legitimate pushes (e.g., tag-based releases).

---

### 6. Content Security Policy for Static Sites

**Context**: The constitution recommends a Content Security Policy header for production deployments to mitigate XSS.

**Decision**: Add a CSP `<meta>` tag to `index.html` as a baseline:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; script-src 'self';">
```

**Rationale**: The app loads Google Fonts (fonts.googleapis.com, fonts.gstatic.com) and may display external images (user-uploaded destination images via `imageUrlInput`). A `<meta>` tag is simpler than configuring custom HTTP headers on GitHub Pages (which requires a `_headers` file or custom 404-based approach). The policy is scoped to the minimum needed:
- `default-src 'self'` — only load from same origin by default
- `style-src 'self' https://fonts.googleapis.com` — allow Google Fonts CSS
- `font-src https://fonts.gstatic.com` — allow Google Fonts files
- `img-src 'self' data: https:` — allow same-origin images, data URIs, and external HTTPS images (destination photos)
- `script-src 'self'` — only inline scripts already present (no external scripts)

**This is a recommendation, not a requirement for the deploy workflow.** Implementation is a separate concern from the deployment pipeline itself.

**Alternatives considered**:
- HTTP header via `_headers` file: GitHub Pages doesn't natively support custom headers without complex workarounds.
- No CSP: Rejected — the constitution recommends it, and it's a security best practice even for static sites.
