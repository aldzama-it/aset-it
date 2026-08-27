# Repository Guidelines

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This repository uses `next@16.2.9`, which may differ from common Next.js assumptions in APIs, conventions, and generated file structure. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Structure & Module Organization

This is a Next.js App Router application for IT asset management. Route UI lives in `app/`, including `app/page.tsx`, `app/login/`, `app/(app)/assets/[categoryId]/`, and API handlers under `app/api/**/route.ts`. Shared React UI is grouped in `components/`: `dashboard/`, `forms/`, `layout/`, `login/`, `shared/`, `tables/`, `transition/`, and reusable primitives in `components/ui/`. Shared logic lives in `lib/`, including Prisma access, session handling, Excel import/export, asset configuration, history, and utility helpers. Static assets are in `public/`, operational docs are in `docs/`, migration/refactor helpers are in `scripts/`, and Docker configuration is in the root Compose file plus `docker/`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: build the production application.
- `npm run start`: serve the built Next.js app.
- `npm run lint`: run ESLint with Next core web vitals and TypeScript rules.
- `docker compose up --build`: start the MySQL-backed production-style stack described in `README.md`.
- `docker compose down`: stop the Compose stack.

There is no committed `npm test` script or test directory at this time. Add test commands to `package.json` before documenting them as standard workflow.

## Coding Style & Naming Conventions

Use TypeScript with strict mode, ES modules, React 19, and the App Router. Use the `@/` path alias for repo-root imports. Keep route components focused on UI and request orchestration; place reusable data access and business logic in `lib/` or focused helper modules. Use PascalCase for React components, camelCase for functions and variables, and kebab-case for docs and standalone scripts. Follow existing component patterns from `components/ui/` and prefer `lucide-react` icons where the UI already uses icons. Keep comments short and only for non-obvious behavior.

## Testing Guidelines

No formal test framework is currently configured. For runtime changes, at minimum run `npm run lint` and `npm run build`. When adding tests, colocate them in a clear `tests/` structure or beside the affected module using `*.test.ts` / `*.test.tsx`, then add an `npm test` script. For UI changes, validate the affected route manually in the browser and include screenshots in the pull request when layout or visual behavior changes.

## Implementation Plan Tracking

When working from an implementation plan, keep the plan document synchronized with the implementation. Every actionable task, nested task, acceptance criterion, validation step, and planned commit must have a Markdown checkbox. Change `[ ]` to `[x]` only after the corresponding work is completed and verified. Leave incomplete, unverified, blocked, or out-of-scope items unchecked; never mark a parent item complete while any required child item remains incomplete.

## Database Safety & Test Isolation

This project uses Prisma and a MySQL service in Docker. Never run migrations, seeders, schema resets, or tests that write to a database unless the target database has been verified as isolated or the user explicitly approves the exact command after the target is shown. Do not drop, truncate, rebuild, or disable foreign keys against shared or production-like data. Reading metadata or row counts is acceptable for investigation; writes require clear isolation.

## Commit & Pull Request Guidelines

Recent history mostly follows Conventional Commits, for example `feat(tables): ...`, `fix(ui): ...`, and `refactor(layout): ...`. Use:

```text
type(scope): description
```

Use valid types such as `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`, `perf`, `build`, or `ci`. Keep the description concise, lowercase, imperative, and in English. Prefer focused commits that separate UI, backend/API, database, and docs changes. Before committing, review the diff and stage only the files related to the commit.

For each planned commit, provide the commit message, purpose, files to stage, exact `git add` command, and exact `git commit -m "..."` command. Pull requests should include a summary, validation performed, linked issue or decision record when available, and screenshots for UI changes.

## Security & Configuration Tips

Never commit real secrets from `.env` files or local Docker configuration. Use example environment files and document required variables instead. Treat uploads, exported spreadsheets, generated assets, and database dumps as sensitive unless proven otherwise.
