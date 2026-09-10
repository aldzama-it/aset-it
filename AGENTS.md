# Aset IT (inventaris-it) — AI Agent Instructions

## 1. Project Overview

Project name: **Aset IT (inventaris-it)**

This application is an internal enterprise IT asset management and telemetry platform designed to track the full lifecycle of physical hardware, digital accounts, operational telemetry, and support requests.

### Primary Users

* **Super Admin / IT Admin** — full system access, user management, system configurations, and system-wide asset control.
* **IT Support / Staff** — execute asset handovers, process return requests, manage mutations, handle ticketing, and update asset telemetry.
* **General Employee / Requester** — view assigned assets, request repairs, or submit IT support tickets.

### Technology Stack

* **Framework**: Next.js (v16.2.9) — App Router
* **UI Library**: React (v19.2.4) & TypeScript (v5)
* **Styling & Components**: Tailwind CSS (v4), Radix UI / Shadcn UI primitives, Lucide React, Framer Motion
* **Database & ORM**: MySQL (v8.4) via Prisma ORM (v6.4.1)
* **Forms & Validation**: React Hook Form, Zod
* **Auth & Security**: Jose (custom JWT session cookies), Bcryptjs, Next.js Middleware
* **Processing & File Handling**: Multer, Sharp (image optimization), SheetJS / XLSX (import/export)
* **Visualization**: Recharts

---

## 2. Core Development Principles

### 2.1 Inspect Before Coding

**Always inspect the existing project before making any code changes.**

Before implementing a task, analyze:

* Next.js App Router structure (`app/(app)/*`, `app/api/*`)
* Existing components (`components/ui`, `components/shared`, `components/tables`, `components/forms`)
* Existing Prisma schema definitions (`prisma/schema.prisma`)
* Existing API route handlers and Server Actions
* Route protection rules in `middleware.ts`
* Existing validation schemas in `lib/` or feature folders
* Active dependencies inside `package.json`

Do not create new files or components before verifying whether similar functionality already exists.

---

### 2.2 Follow Existing Patterns

Follow the project's established conventions, architecture, and implementation style:

* Respect the **Next.js App Router** paradigm (distinguish Server Components from Client Components with `'use client'`).
* Use **TypeScript** strictly. Avoid using `any` or disabling type checks.
* Use **Shadcn UI + Radix UI primitives** styled with **Tailwind CSS v4**.
* Manage forms using **React Hook Form** paired with **Zod validation schemas**.
* Follow the established **Prisma ORM** query patterns via the singleton instance in `lib/prisma.ts`.

> Follow the existing pattern unless the existing pattern is clearly problematic.

If an existing pattern is flawed, raise the issue and outline a solution before proceeding.

---

## 3. UI Architecture & Reusability

### 3.1 Reusable UI Templates

Common interface elements must be reused across different asset categories:

* **Data Tables** (`components/tables/`): Paginated, filterable tables for asset listings.
* **Asset Form Templates** (`components/forms/`): Dynamic forms with standard base fields (Serial Number, Status, Location).
* **Shared Modals & Dialogs** (`components/shared/`):
  * Asset Transfer / Mutation Dialog
  * Asset Handover / Return Modal
  * Condition Inspection Dialog
  * History Timeline Modal
* **Dashboard Widgets**: KPI metric cards, condition breakdown pie charts, and branch distribution graphs.

### Important Rule

**Do not duplicate UI components just because the asset type or category is different.**

Reuse base components (`DataTable`, `AssetFormWrapper`, `KPICard`, `StatusBadge`) across different asset types (Laptops, Printers, Cameras, CCTV, Digital Accounts). Customizations should be driven by props, configuration schemas, or field definitions—not separate components.

---

## 4. Data Source & ORM Handling

When displaying new asset metrics, tables, or telemetry:

1. Inspect `prisma/schema.prisma` to verify existing models and relations.
2. Check existing API routes (`app/api/*`) or Server Actions (`lib/actions/*`).
3. Re-use existing query services instead of rewriting raw queries.
4. Apply Prisma select/include filters carefully to prevent over-fetching data.
5. If new fields are required, follow standard Prisma migration steps.

### Data Source Rule

* If the required database field or relation is established: **Use it.**
* If the relationship or data source is ambiguous: **Do not guess.** Present the schema findings and confirm the approach first.

---

## 5. Asset Lifecycle & Business Logic

### 5.1 Never Guess Business Logic

Asset management systems enforce strict mutation, condition, and status requirements. AI agents must **never assume business rules or status definitions**, including:

* **Asset Condition Changes**: Rules dictating how an asset moves between *Baik*, *Perlu Perbaikan*, or *Rusak*.
* **Asset Mutation Workflows**: Approval steps for reassigning an asset between branches, divisions, or employees.
* **Audit Trail Rules**: Data requirements when recording an event in `AssetHistory`.
* **Digital Asset Lifecycle**: Credential rotation policies, seat allocation, and license revocation.
* **Telemetry Thresholds**: Health status logic for the Network Analyzer module.

If business requirements are unclear:
1. Inspect the existing Prisma enum definitions and handler logic.
2. Report the available states and workflows.
3. Ask the user for confirmation before implementing changes.

---

## 6. Change Planning

### 6.1 Pre-implementation Planning

Before writing code, outline:

* Which files need changes
* Why each file needs changes
* Any new files to be created
* Any schema changes or Prisma migrations required

Example:

```text
Implementation Plan

1. prisma/schema.prisma
   Reason: Add 'macAddress' field to the NetworkDevice model.

2. lib/validations/asset.ts
   Reason: Update Zod schema to validate the MAC address format.

3. components/forms/NetworkDeviceForm.tsx
   Reason: Add the MAC address input field using the updated schema.

4. app/api/assets/network-devices/route.ts
   Reason: Process the new field during asset registration and update.

```

---

## 7. Large Changes Require Approval

Small bug fixes or isolated feature tweaks can be implemented directly. However, **explicit user approval is required** before starting:

* Changes to authentication flows (`jose`, cookie handling, session lifecycle)
* Changes to `middleware.ts` impacting route protection
* Destructive Prisma schema modifications (dropping columns/tables)
* Refactoring centralized components used across multiple asset pages (e.g., `components/shared/TransferDialog.tsx`)
* Modifying file upload and image processing pipelines (`multer`, `sharp`)
* Altering Excel import/export structures (`xlsx`) that affect batch operations

---

## 8. Database Schema & Prisma Migrations

### 8.1 Schema Modification Rules

To preserve data integrity:

* **Never alter historical migration folders directly.**
* Update `prisma/schema.prisma` and run standard migration commands.
* Avoid breaking changes on active enum types (e.g., changing `AssetStatus` values without migration data mapping).
* Always log asset state transitions to the `AssetHistory` table when altering asset records.

### Migration Commands

For local schema synchronization:

```bash
# Push schema directly in development (if using non-migration workflow)
npx prisma db push

# Generate migration file for production readiness
npx prisma migrate dev --name <descriptive_migration_name>

# Always regenerate client after schema modifications
npx prisma generate

```

---

## 9. Error Handling & Form Validation

* **Validation**: All user inputs must pass schema validation using **Zod** on both the client (via React Hook Form) and the server (inside API routes/actions).
* **API Responses**: Return standard JSON error structures (`{ success: false, message: string, errors?: any }`).
* **Optimistic Updates**: For UI actions (e.g., ticking items, quick status toggles), ensure fallback states exist if the server request fails.

---

## 10. Git Rules

### 10.1 Push

Never run `git push` automatically. Let the user push commits to remote branches.

---

### 10.2 Commit Workflow

When preparing commits:

1. Check current status and staged files:
```bash
git status

```


2. Group changes logically (e.g., separate database schema migrations from UI components).
3. Use semantic commit messages in **English**:
```text
type(scope): description

```


Examples:
* `feat(assets): add barcode scanning support for CCTV units`
* `fix(auth): correct token expiration check in middleware`
* `refactor(tables): extract shared filter bar for laptop inventory`
* `chore(prisma): add migration for starlink device fields`


4. Provide the exact Git commands for the user to execute:
```bash
git add <files>
git commit -m "type(scope): description"

```



---

## 11. Project Execution Guide

### 11.1 Local Development Environment

1. **Install Dependencies**:
```bash
npm install

```


2. **Environment Variables Configuration**:
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://user:password@localhost:3306/aset_it_db"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```


3. **Database Initialization**:
```bash
npx prisma generate
npx prisma db push
# If seed script exists:
npm run seed # or npx tsx prisma/seed.ts

```


4. **Run Development Server**:
```bash
npm run dev

```


Access the dashboard at `http://localhost:3000`.

---

### 11.2 Docker Orchestration

To run the complete stack (Next.js application + MySQL database):

1. Start all containers:
```bash
docker compose up -d

```


2. Verify database connection and apply migrations inside the app container:
```bash
docker compose exec app npx prisma migrate deploy

```


3. Stop services:
```bash
docker compose down

```
