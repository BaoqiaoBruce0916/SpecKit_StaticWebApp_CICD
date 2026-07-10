# Quickstart: Web Deploy

**Feature**: 001-web-deploy
**Date**: 2026-07-10

## Prerequisites

Before the deployment workflow can run, you must complete these one-time setup steps:

### 1. Enable GitHub Pages

1. Go to your repository on GitHub → **Settings** → **Pages**
2. Under **Build and Deployment**, set **Source** to **GitHub Actions**
3. Save the setting

> ⚠️ If Source is set to anything other than "GitHub Actions," the `deploy-pages@v4` action will fail.

### 2. Enable Branch Protection on `main`

The constitution requires all changes to go through pull requests. Configure branch protection:

1. Go to **Settings** → **Branches** → **Add branch protection rule**
2. Set **Branch name pattern** to `main`
3. Check **Require a pull request before merging**
4. Check **Require approvals** (set to at least 1)
5. (Optional) Check **Dismiss stale pull request approvals when new commits are pushed**
6. Click **Create**

### 3. Verify Workflow File

The workflow file is at `.github/workflows/deploy-web.yml`. It will be created as part of this feature implementation. After merging the feature branch to `main`, the workflow will appear in the **Actions** tab.

## Usage

### Automatic Deployment (Push to Main)

1. Create a feature branch → make changes → open a pull request
2. After review and approval, merge the PR to `main`
3. The merge triggers the deployment automatically
4. Monitor progress in the **Actions** tab → **Deploy to GitHub Pages** workflow
5. Once complete, visit `https://<owner>.github.io/TouristDestinationMgr/`

### Manual Deployment

1. Go to the **Actions** tab
2. Select **Deploy to GitHub Pages** from the workflow list
3. Click **Run workflow** → select branch `main` → click the green **Run workflow** button
4. Monitor the run; the site updates on completion

## Verification

After any deployment:

1. Open `https://<owner>.github.io/TouristDestinationMgr/` in a browser
2. Confirm the page loads without errors (open DevTools console to check)
3. Verify the application features work (add a destination, search, filter)
4. Check that styles and fonts render correctly

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Workflow doesn't appear in Actions tab | File not on `main` branch yet | Merge feature branch to `main` |
| `deploy-pages` step fails with 403 | Pages source not set to "GitHub Actions" | Go to Settings → Pages → set Source to GitHub Actions |
| `deploy-pages` step fails with permissions error | Workflow permissions too restrictive | Verify `permissions: pages: write, id-token: write` in workflow YAML |
| Site shows 404 | Pages not yet published | Wait 1-2 minutes; first deploy may take longer |
| Site loads but styles are broken | Asset paths incorrect | All files must be at repository root; check `index.html` references `styles.css` (not `/styles.css`) |
| Changes not visible after deploy | Browser cache | Hard-refresh (Ctrl+Shift+R) or open in incognito window |
