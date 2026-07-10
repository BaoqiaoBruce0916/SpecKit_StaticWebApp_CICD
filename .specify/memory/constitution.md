<!--
  Sync Impact Report
  ==================
  Version change: [unset] → 1.0.0 (initial constitution)
  Modified principles: N/A (first real constitution; all 4 principles are new)
  Added sections:
    - Core Principles (4 principles: Security-First, CI/CD-Driven, Simplicity, Demo-Ready)
    - Security & Compliance Requirements
    - Development Workflow
    - Governance
  Removed sections: None (template placeholders replaced)
  Templates requiring updates:
    - .specify/templates/plan-template.md         ✅ no changes needed (Constitution Check section is generic)
    - .specify/templates/spec-template.md          ✅ no changes needed (requirements structure is compatible)
    - .specify/templates/tasks-template.md         ✅ no changes needed (task phases are principle-agnostic)
    - .specify/templates/checklist-template.md     ✅ no changes needed (generic checklist format)
    - .specify/templates/commands/                 ⚠ directory does not exist — no command files to review
  Follow-up TODOs: None
-->

# Tourist Destination Manager Constitution

## Core Principles

### I. Security-First

Security is non-negotiable. All deployments MUST be served exclusively over HTTPS.
No secrets, API keys, tokens, or credentials of any kind MAY be embedded in
source code, committed to the repository, or stored in client-side code.
Configuration values that vary by environment MUST be injected at build or deploy
time via environment variables or a secure secrets manager — never hardcoded.

**Rationale**: Even for a static web app, exposing secrets in client-side code or
version control creates an irreversible security breach. HTTPS is a baseline
requirement for any production deployment.

### II. CI/CD-Driven

Every merge to the `main` branch MUST trigger an automated build and deployment
pipeline. The pipeline MUST include at minimum: (a) a clean build step,
(b) static validation (linting, if configured), and (c) deployment to the target
environment. Manual deployment steps are prohibited for production releases.
The CI/CD configuration (e.g., GitHub Actions workflow) MUST be versioned
alongside the source code.

**Rationale**: Automated CI/CD eliminates human error in deployment, ensures
reproducible builds, and enforces that only validated code reaches production.

### III. Simplicity

Prefer standard, built-in browser APIs and vanilla technologies over frameworks
and libraries unless a framework is clearly justified by project complexity.
Avoid over-engineering: do not introduce abstractions, patterns, or dependencies
that are not directly required by current features. YAGNI ("You Aren't Gonna
Need It") is the guiding rule. Every dependency added MUST have a documented
justification.

**Rationale**: The project is a static web application. Keeping the stack simple
(vanilla HTML, CSS, JavaScript) reduces maintenance burden, onboarding friction,
and attack surface while maximizing long-term sustainability for a demo-oriented
project.

### IV. Demo-Ready

The application MUST remain in a demonstrable state at all times on the `main`
branch. The development process MUST use common, widely-adopted practices:
feature branches for changes, pull requests for review, and semantic versioning
for releases. Avoid experimental workflows, niche tooling, or unconventional
conventions that would confuse contributors or demo audiences. Every feature
MUST be independently demonstrable and have clear, visible functionality.

**Rationale**: As a demo-oriented project, the ability to showcase working
features at any point is critical. Common practices lower the barrier for
collaboration and ensure the project is approachable.

## Security & Compliance Requirements

- **HTTPS Enforcement**: All deployments (production, staging, preview) MUST
  use HTTPS. HTTP endpoints MUST redirect to HTTPS.
- **No Secrets in Code**: Automated scanning (e.g., Git hooks, CI checks) SHOULD
  be configured to detect and block commits containing potential secrets.
- **Content Security Policy**: A Content Security Policy (CSP) header SHOULD be
  configured for production deployments to mitigate XSS risks.
- **Dependency Audit**: Dependencies (if any are introduced) MUST be audited
  for known vulnerabilities before each release.

## Development Workflow

- **Branching**: All changes MUST be made in feature branches branched from
  `main`. Direct commits to `main` are prohibited.
- **Pull Requests**: Every change MUST be proposed via a pull request. PRs MUST
  be reviewed and pass CI checks before merging.
- **Commit Convention**: Use descriptive, imperative-tense commit messages
  (e.g., "Add search filter for destinations"). Conventional Commits format is
  recommended but not mandatory.
- **Testing**: Manual verification of features before merge is the minimum bar.
  Automated tests SHOULD be added as the project matures.
- **Local Development**: The application MUST be runnable locally by opening
  `index.html` in a browser or via a simple static file server (e.g.,
  `npx serve .`). No build step is required for local development.

## Governance

This Constitution supersedes all other development practices and conventions
for this project. Any deviation from these principles MUST be documented,
justified in the relevant pull request, and approved by a project maintainer.

**Amendment Process**:
1. Propose changes via a pull request to this file.
2. Discuss and reach consensus among active contributors.
3. Update `LAST_AMENDED_DATE` and increment `CONSTITUTION_VERSION` per
   semantic versioning rules:
   - **MAJOR**: Backward-incompatible governance/principle removals or
     redefinitions.
   - **MINOR**: New principle/section added or materially expanded guidance.
   - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements.

**Compliance Review**: All pull requests MUST include a brief constitution
compliance check confirming alignment with Core Principles. The plan template's
"Constitution Check" section serves as the formal gate.

**Version**: 1.0.0 | **Ratified**: 2026-07-10 | **Last Amended**: 2026-07-10
