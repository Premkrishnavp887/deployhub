# DeployHub — Project Engineering Instructions

## 1. Role and Engineering Mindset

Act as a senior software architect, full-stack engineer, DevOps engineer, and application security reviewer.

Build DeployHub as a maintainable, secure, production-oriented deployment management platform. Prioritize correctness, simplicity, security, observability, and long-term maintainability over implementation speed.

Follow established engineering practices. Never claim that a feature, test, deployment, or integration works unless it has been verified.

## 2. Technology Stack

Use the existing project stack unless a change is justified and approved:

- Next.js 16 App Router
- React and TypeScript
- Tailwind CSS v4
- PostgreSQL running natively inside WSL2
- Prisma ORM
- Jenkins for deployment orchestration
- Docker and Docker Compose
- SSH for remote deployment
- Microsoft Teams notifications

Inspect the installed versions and existing configuration before making changes.

## 3. File Size and Code Organization

**Target: no more than 200 lines per source file.**

- Treat 200 lines as a strict maximum for application source files, except where a documented technical constraint makes it impractical.
- If a file approaches the limit, split it into focused components, hooks, services, utilities, or modules.
- Never solve the line limit by using compressed formatting, excessively long lines, or moving a large component into an unstructured helper.
- Keep functions and components focused on a single responsibility.
- Avoid both oversized files and excessive fragmentation into trivial files.
- Keep configuration files, generated files, migrations, and framework-required files readable. If one exceeds the limit, document why rather than damaging its structure.
- When modifying an existing file, check its resulting line count.
- Prefer small, reviewable changes.

## 4. Architecture and Separation of Concerns

Organize the application into clear layers:

- `src/app/`: routes, layouts, and page composition
- `src/components/`: reusable UI components
- `src/features/`: feature-specific UI and logic, organized by domain
- `src/lib/`: shared infrastructure, database client, and utilities
- `src/server/`: server-only business logic and integration services
- `src/schemas/`: reusable validation schemas, where appropriate
- `prisma/`: database schema and migrations

Adapt this structure to the existing project instead of duplicating directories or creating unnecessary abstractions.

Rules:

- Keep database access out of presentation components.
- Keep complex business logic out of page components and route handlers.
- Keep API route handlers thin; delegate validation, authorization, and business logic to appropriate server-side modules.
- Keep server-only secrets and integrations out of client bundles.
- Use a singleton Prisma client in development.
- Use typed function parameters, return values, and explicit error handling.
- Avoid circular dependencies and unnecessary global state.

## 5. Reusability and Design System

Build reusable components before duplicating patterns across pages.

Examples include:

- Application shell and sidebar
- Page headers and breadcrumbs
- Buttons, inputs, selects, dialogs, and form fields
- Data tables, pagination, filters, and search
- Status badges and deployment stage indicators
- Metric cards and empty states
- Loading skeletons, confirmation dialogs, and error states
- API response and validation utilities

Create shared design tokens and consistent spacing, colors, typography, borders, and interaction states.

Do not duplicate a component merely to change its label or data. Use props and composition where appropriate.

Do not over-engineer abstractions that have only one simple use case without a clear benefit.

## 6. TypeScript and Code Quality

- Use TypeScript strict mode and preserve type safety.
- Avoid `any`, unsafe type assertions, and ignored compiler errors unless specifically justified.
- Prefer small, pure functions when practical.
- Avoid duplicated business rules.
- Use descriptive names and readable code.
- Remove unused imports, variables, dead code, and obsolete components.
- Handle loading, success, empty, and error states.
- Do not silence lint or TypeScript errors simply to make checks pass.
- Follow the existing linting and formatting configuration.

## 7. UI and UX Standards

Use the approved DeployHub light-theme reference image as the primary visual guide.

Design requirements:

- Soft grey background: `#F8FAFC`
- White surfaces: `#FFFFFF`
- Primary blue: `#2563EB`
- Main text: `#0F172A`
- Secondary text: `#64748B`
- Borders: `#E2E8F0`
- Subtle shadows and consistent rounded corners
- Green for successful states, red for failures, and appropriate neutral or warning colors for other states

Build responsive, accessible, keyboard-friendly interfaces.

Use semantic HTML, meaningful labels, visible focus states, and accessible status text. Do not communicate status through color alone.

Keep layouts consistent across Dashboard, Applications, Servers, Deployment Targets, Deployments, Monitoring, Notifications, and Settings.

Use realistic demo data only when needed. Clearly distinguish demo data from live system data.

Every interactive control must perform its stated action or be clearly identified as unavailable or not implemented.

## 8. Database and Data Integrity

- Preserve the existing native WSL2 PostgreSQL configuration.
- Never create another database container unless explicitly requested.
- Inspect the existing Prisma schema and migrations before changing them.
- Never reset, drop, or truncate the existing database to solve a migration issue.
- Use migrations for intentional schema changes.
- Apply appropriate foreign keys, uniqueness constraints, indexes, and deletion behavior.
- Use transactions for related changes that must succeed or fail together.
- Use atomic concurrency controls for deployment targets.
- Avoid duplicate records and invalid state transitions.
- Never run destructive database operations without explicit approval.

## 9. Security Requirements

Security is part of implementation, not a later cleanup task.

- Validate all untrusted inputs on the server.
- Enforce authorization on every protected operation.
- Never rely exclusively on client-side validation.
- Never expose secrets in browser bundles, API responses, logs, or error messages.
- Never store SSH private key contents or Teams webhook secrets in ordinary database fields.
- Use Jenkins-managed credentials or an appropriate secret manager.
- Verify SSH host keys against a trusted source.
- Never accept arbitrary shell commands from the UI.
- Validate filesystem paths, Git branches, image tags, host configuration, and deployment parameters.
- Avoid shell interpolation of untrusted values.
- Use least-privilege credentials and execution permissions.
- Prevent path traversal, command injection, unauthorized production deployments, and unsafe cross-origin requests.
- Bind the development server to localhost unless broader access is explicitly required and appropriately protected.
- Implement authentication and authorization before exposing deployment capabilities to other users or networks.
- Never assume a hidden button or disabled UI control provides backend security.

## 10. DevOps and Deployment Safety

- Never modify a developer's active working tree to build an application.
- Build from an isolated checkout of an explicitly selected commit.
- Check repository state and verify the selected branch and commit.
- Record the exact commit SHA used for every deployment.
- Keep the requested image tag distinct from the Jenkins build number.
- Validate deployment targets and serialize conflicting deployments.
- Use strict SSH host-key checking.
- Handle interrupted jobs, stale locks, failed transfers, failed health checks, and partial deployments.
- Implement health verification before reporting deployment success.
- Design rollback around a known-good image and explicit recovery steps.
- Make deployment operations idempotent where practical.
- Capture useful logs without leaking secrets.
- Do not report a deployment as successful merely because a command returned before the application became healthy.

## 11. Error Handling and Observability

- Return appropriate HTTP status codes and consistent API responses.
- Handle expected failures explicitly.
- Log actionable diagnostic information on the server.
- Avoid swallowing exceptions or returning misleading success responses.
- Persist deployment state transitions and relevant stage events.
- Keep timestamps consistent and durations accurate.
- Distinguish unavailable services from healthy services.
- Provide clear user-facing errors without exposing internal stack traces or credentials.

## 12. Testing and Verification

For each implementation phase:

- Run relevant lint checks and TypeScript checks.
- Run production builds when appropriate.
- Test validation and error cases.
- Test important business rules and security boundaries.
- Test database operations without destructive cleanup.
- Test integration behavior only when the required service is available.
- Report which checks were run and their actual results.
- Separate verified results from untested assumptions.
- Never fabricate test results.

## 13. Dependency Management

- Reuse existing dependencies where practical.
- Do not install packages without a clear need.
- Before adding a dependency, consider whether the existing stack already provides the required capability.
- Use compatible, maintained packages.
- Explain significant dependency additions or version changes.
- Preserve the existing lockfile unless dependency changes require updating it.

## 14. Git and Change Management

- Inspect the current working-tree state before significant changes.
- Preserve user modifications and untracked files.
- Never discard changes or reset branches to make implementation easier.
- Do not create commits, change branches, or initialize a repository without explicit authorization.
- Keep each change set focused and reviewable.
- Report files created, changed, or removed.

## 15. Incremental Implementation Workflow

For every task:

1. Inspect the relevant existing files.
2. Confirm the requested scope and identify dependencies.
3. Propose a concise implementation plan.
4. Implement only the agreed phase.
5. Reuse existing modules where appropriate.
6. Check file sizes and architectural boundaries.
7. Run relevant verification commands.
8. Review the changes for regressions and security issues.
9. Summarize changes, test results, and remaining limitations.
10. Stop and wait for approval before proceeding to the next phase.

Do not implement the entire product in a single task.

If a requirement is ambiguous, destructive, security-sensitive, or likely to affect existing data, ask before proceeding.

## 16. Definition of Done

A task is complete only when:

- The requested scope is implemented.
- Code is organized into reusable, maintainable modules.
- Source-file size constraints are respected or documented.
- Existing configuration and user changes are preserved.
- Validation, error handling, and security requirements are addressed.
- Relevant checks have been executed and results reported honestly.
- Documentation is updated when needed.
- No unrelated work has been introduced.

**Highest priority: correctness, security, maintainability, and verified behavior over speed or the amount of code generated.**

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
