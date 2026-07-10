# Deployment & Security Checklist: Web Deploy

**Purpose**: Validate the quality, clarity, completeness, and consistency of deployment and security requirements across spec, plan, and tasks
**Created**: 2026-07-10
**Feature**: [spec.md](../spec.md)

**Note**: This checklist tests the REQUIREMENTS themselves — not whether the implementation works. Each item evaluates whether requirements are well-written, complete, unambiguous, and ready for implementation.

---

## Requirement Completeness

- [ ] CHK001 Are deployment trigger requirements fully defined for both the automatic (`push`) and manual (`workflow_dispatch`) paths, including which branch(es) trigger deployment? [Completeness, Spec §FR-001, §FR-002]
- [ ] CHK002 Is the complete deployment lifecycle (configure Pages → package assets → publish) defined in requirements, or only implied by the contract? [Completeness, Spec §FR-003, §FR-004, §FR-005]
- [ ] CHK003 Are rollback and recovery requirements defined for when a deployment fails mid-pipeline? [Gap, Spec §SC-004]
- [ ] CHK004 Are branch protection requirements explicitly stated in the spec (not just the plan/constitution), given the constitution mandates PR-only merges to `main`? [Gap, Constitution §Development Workflow]
- [ ] CHK005 Are access control requirements defined for who can trigger manual deployments (write access, admin, specific teams)? [Completeness, Spec §SC-005]
- [ ] CHK006 Are requirements defined for deployment notifications (success/failure) to stakeholders? [Gap]
- [ ] CHK007 Is the artifact upload scope unambiguously defined — are only web assets deployed, or the entire repository root? [Completeness, Spec §FR-007 vs Plan T005]

---

## Requirement Clarity

- [ ] CHK008 Is "minimum required permissions" (FR-008) quantified with specific permission levels (`contents: read`, `pages: write`, `id-token: write`), or does it rely on the contract for clarification? [Clarity, Spec §FR-008]
- [ ] CHK009 Is "quick succession" (FR-009) quantified with a specific concurrency group name and cancellation behavior? [Clarity, Spec §FR-009]
- [ ] CHK010 Is "standard CI/CD configuration directory" (FR-006) explicitly named as `.github/workflows/` within the requirements? [Clarity, Spec §FR-006]
- [ ] CHK011 Is the 5-minute deployment window (SC-001) measured from push start or from push completion? [Clarity, Spec §SC-001]
- [ ] CHK012 Is "deployment failure" (SC-004) scoped — does it include network timeouts, authentication errors, Pages misconfiguration, or only action step failures? [Clarity, Spec §SC-004]
- [ ] CHK013 Is the term "publishes" (FR-003) unambiguous — does it mean the site is live and publicly accessible, or merely that the artifact is uploaded? [Ambiguity, Spec §FR-003]

---

## Requirement Consistency

- [ ] CHK014 Do trigger requirements align across documents: spec (FR-001 push, FR-002 manual), contract (both in one schema), and tasks (T005 push-only, T007 adds manual)? [Consistency, Spec §FR-001/FR-002 vs Tasks §Phase 3–4]
- [ ] CHK015 Do permissions requirements match across spec (FR-008), plan (Technical Context), contract (schema), and tasks (T005 bullet list)? [Consistency, Cross-document]
- [ ] CHK016 Is the workflow file naming consistent across all documents — spec input says `001-deploy-web.yml.yml`, plan says `deploy-web.yml`, tasks say `deploy-web.yml`? [Consistency, Cross-document]
- [ ] CHK017 Does the asset scope align: FR-007 lists specific files (`index.html`, `styles.css`, `app.js`), but T005 uploads the entire root (`path: "."`)? [Conflict, Spec §FR-007 vs Tasks T005]
- [ ] CHK018 Do deployment environment requirements (FR-005 "configure the Pages environment") align with the contract's `environment: github-pages` specification? [Consistency, Spec §FR-005 vs Contract]

---

## Acceptance Criteria Quality

- [ ] CHK019 Can SC-001 (5-minute deploy) be objectively measured without external timing instrumentation? [Measurability, Spec §SC-001]
- [ ] CHK020 Can SC-003 ("deployed site matches main branch exactly") be objectively verified without a file-comparison tool or hash-checking mechanism? [Measurability, Spec §SC-003]
- [ ] CHK021 Can SC-004 ("failure does not take down previous version") be verified without intentionally breaking a production deployment? [Measurability, Spec §SC-004]
- [ ] CHK022 Is SC-005 ("any team member with write access can trigger") independently testable without provisioning multiple GitHub accounts with varying permission levels? [Measurability, Spec §SC-005]
- [ ] CHK023 Are acceptance criteria defined for each of the 9 functional requirements, or do some FRs lack explicit pass/fail conditions? [Acceptance Criteria, Spec §FR-001 through §FR-009]

---

## Scenario Coverage

- [ ] CHK024 Are requirements defined for the scenario where GitHub Pages has not been enabled in repository settings? [Coverage, Gap]
- [ ] CHK025 Are requirements defined for the scenario where a push contains no changes to static assets (e.g., documentation-only commit)? [Coverage, Spec §Edge Cases]
- [ ] CHK026 Are requirements defined for the scenario where a manual dispatch is triggered simultaneously with an automatic push? [Coverage, Gap — concurrency handling]
- [ ] CHK027 Are requirements defined for the scenario where the workflow file itself is accidentally deleted from `main`? [Coverage, Gap — self-referential failure]
- [ ] CHK028 Are requirements defined for deployment from a branch other than `main` (e.g., a hotfix branch needing immediate deploy)? [Coverage, Gap — scope boundary]
- [ ] CHK029 Are requirements defined for the scenario where GitHub Actions experiences a platform outage during deployment? [Coverage, Gap — external dependency failure]

---

## Edge Case Coverage

- [ ] CHK030 Are edge cases defined for an empty repository root (all `.html` files accidentally removed)? [Edge Case, Gap]
- [ ] CHK031 Are edge cases defined for oversized static assets exceeding GitHub Pages' 1 GB artifact limit? [Edge Case, Gap]
- [ ] CHK032 Are edge cases defined for deployment URL collisions (e.g., two repositories with the same name under different owners)? [Edge Case, Gap]
- [ ] CHK033 Are edge cases defined for special characters or non-ASCII filenames in the deployed asset set? [Edge Case, Gap]
- [ ] CHK034 Is the fallback behavior specified when the GitHub Pages custom domain (if configured) fails DNS resolution? [Edge Case, Gap]

---

## Non-Functional Requirements (Security & Performance)

- [ ] CHK035 Are HTTPS enforcement requirements explicitly specified for the deployed site, or is it assumed from GitHub Pages defaults? [Security, Spec §Assumptions]
- [ ] CHK036 Are secret detection requirements specified for the CI/CD pipeline (e.g., scanning workflow logs for accidentally exposed tokens)? [Security, Constitution §Security-First]
- [ ] CHK037 Are Content Security Policy (CSP) requirements specified for the deployed static site? [Security, Constitution §Security & Compliance]
- [ ] CHK038 Are deployment audit trail requirements specified — should workflow run logs be retained for a defined period? [Security, Gap]
- [ ] CHK039 Are OIDC token scope requirements defined — is the `id-token: write` permission scoped to only the Pages deployment job? [Security, Spec §FR-008]
- [ ] CHK040 Are performance requirements for the deployment pipeline itself specified (e.g., time from push to live, artifact upload bandwidth)? [Performance, Spec §SC-001, §SC-002]
- [ ] CHK041 Are availability/uptime requirements specified for the deployed GitHub Pages site? [Non-Functional, Gap]

---

## Dependencies & Assumptions

- [ ] CHK042 Is the GitHub Pages enablement prerequisite documented as an explicit dependency with a verification step? [Dependency, Spec §Assumptions]
- [ ] CHK043 Is the "GitHub Actions" Pages source setting documented as a required dependency, with a clear error message if misconfigured? [Dependency, Spec §Edge Cases]
- [ ] CHK044 Is the branch protection prerequisite validated anywhere in the requirements or tasks, or only noted as a plan-level concern? [Assumption, Plan §Constitution Violations]
- [ ] CHK045 Are GitHub Actions free-tier limits (2,000 minutes/month for private repos, artifact retention) documented as constraints? [Assumption, Gap]
- [ ] CHK046 Is the assumption that `index.html`, `styles.css`, and `app.js` live at repository root validated or only asserted? [Assumption, Spec §Assumptions]

---

## Ambiguities & Conflicts

- [ ] CHK047 Is the double file extension in the spec input (`.yml.yml`) resolved, and does the canonical filename appear consistently in all downstream documents? [Ambiguity, Spec Input]
- [ ] CHK048 Does "Deploy to GitHub Pages" (workflow name) conflict with any other workflow that might be added later in the same repository? [Ambiguity, Tasks T005]
- [ ] CHK049 Is the concurrency group name `"pages"` sufficiently scoped, or could it conflict with a future workflow that also deploys to Pages (e.g., a preview/staging workflow)? [Ambiguity, Plan/Contract]
