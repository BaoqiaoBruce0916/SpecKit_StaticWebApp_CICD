# Implementation Plan: Web Deploy

**Branch**: `001-web-deploy` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-web-deploy/spec.md`

## Summary

Deploy the static Tourist Destination Manager web application to GitHub Pages via a GitHub Actions workflow. The workflow triggers automatically on every push to `main` and supports manual dispatch. It packages the root-level static assets (`index.html`, `styles.css`, `app.js`) and publishes them using GitHub's official Pages deployment actions. Constitution compliance requires branch protection on `main` (PR-only merges), HTTPS enforcement (inherent in GitHub Pages), and no embedded secrets (verified: app uses localStorage only).

## Technical Context

**Language/Version**: HTML5, CSS3, ES6+ JavaScript (vanilla — no framework/transpiler)
**Primary Dependencies**: None (zero external runtime dependencies; uses only `actions/configure-pages@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` as CI/CD tooling)
**Storage**: localStorage (client-side only, no backend database)
**Testing**: Manual browser verification after deployment
**Target Platform**: GitHub Pages (static hosting, HTTPS by default)
**Project Type**: static-web-app
**Performance Goals**: Site loads within 3 seconds on average broadband connection (~10 KB total payload)
**Constraints**: No build step (vanilla HTML/CSS/JS), zero external runtime deps, HTTPS-only, must preserve existing `localStorage`-based data model
**Scale/Scope**: Single-page application, 3 static files at repository root, public GitHub Pages URL

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Security-First** | ✅ PASS | GitHub Pages enforces HTTPS. No secrets in source (`app.js` uses `localStorage` only, zero API keys). No environment-specific configuration needed. |
| **II. CI/CD-Driven** | ✅ PASS | Workflow triggers on push to `main` (auto-deploy). Workflow file is version-controlled in `.github/workflows/`. Static validation (linting) not yet configured — optional per "if configured" clause. No traditional "build" step needed (vanilla static site); `upload-pages-artifact` serves as the packaging step. |
| **III. Simplicity** | ✅ PASS | Vanilla HTML/CSS/JS — no frameworks, no build toolchain, zero runtime dependencies. YAGNI: only what the feature requires. |
| **IV. Demo-Ready** | ✅ PASS | Auto-deploy ensures `main` is always live. Feature branch workflow (`001-web-deploy`). PRs required per constitution — branch protection must be enabled on `main` as a prerequisite. |

### Constitution Violations

⚠️ **Branch protection not yet enforced**: The constitution requires "Direct commits to `main` are prohibited" and all changes "MUST be proposed via a pull request." The workflow itself does not enforce this — it is a repository settings prerequisite (GitHub branch protection rules). This is documented in the spec's Assumptions section and in `quickstart.md` as a mandatory setup step.

**Resolution**: The spec already assumes this. No code change needed — documented as a prerequisite in `quickstart.md`. This is a process/configuration gate, not a code gate.

## Project Structure

### Documentation (this feature)

```text
specs/001-web-deploy/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: technical research & decisions
├── data-model.md        # Phase 1: entity definitions
├── quickstart.md        # Phase 1: quickstart guide
├── contracts/           # Phase 1: (empty — no external interfaces)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── deploy-web.yml      # GitHub Actions deployment workflow (TO BE CREATED)

index.html                   # Static entry point (existing)
styles.css                   # Stylesheet (existing)
app.js                       # Application logic (existing)
```

**Structure Decision**: Single static site at repository root. No `src/`, `build/`, or `dist/` directories needed — the vanilla HTML/CSS/JS files are deployed directly via `upload-pages-artifact`. The only new file is `.github/workflows/deploy-web.yml`.

## Complexity Tracking

No unjustified complexity. The deployment uses GitHub's official, minimal Pages actions (3 steps: configure → upload → deploy). No extra tooling, no custom scripts, no third-party actions beyond GitHub's own.
