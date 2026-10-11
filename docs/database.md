# Database Architecture

## Overview

The application uses **SQLite** as its sole database, accessed exclusively through **Prisma ORM**. No external database server is required.

## Database Location

The production database is stored in Electron's application data directory:

```text
%APPDATA%/AttendanceApp/
├── data/
│   └── attendance.db
├── backups/
└── logs/
```

The path is resolved programmatically:

```typescript
const userData = app.getPath('userData');
const dbPath = path.join(userData, 'data', 'attendance.db');
const databaseUrl = `file:${dbPath.replace(/\\/g, '/')}`;
```

The database is **never** stored inside the project repository.

## Prisma Configuration

**Schema location:** `apps/backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## PrismaService

A single `PrismaService` extends `PrismaClient` and is registered as a global NestJS provider:

```text
apps/backend/src/database/
├── prisma.module.ts    # Global module, exports PrismaService
└── prisma.service.ts   # Single PrismaClient instance
```

### Dependency Injection

```text
PrismaModule (Global)
    └── PrismaService
            └── Injected into Repositories
                    └── Used by Services
                            └── Called by Controllers
```

Controllers never instantiate Prisma directly. All database access flows through the repository layer.

## Migrations

Prisma migrations are used for all schema changes:

| Command                 | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `npm run db:generate`   | Generate Prisma Client                             |
| `npm run db:migrate`    | Create/apply dev migrations                        |
| `prisma migrate deploy` | Apply migrations in production (via Electron init) |

### Startup Migration Flow

On application startup, Electron main process:

1. Resolves `userData` path
2. Creates `data/`, `backups/`, and `logs/` directories
3. Sets `DATABASE_URL` environment variable
4. Runs `prisma migrate deploy` (non-destructive)
5. Starts NestJS backend with the configured `DATABASE_URL`

Existing databases are never deleted or overwritten.

## Phase 0 Schema

Phase 0 includes only infrastructure models. Business models (User, Employee, Attendance, etc.) will be added in future phases.

Current model:

- `AppMeta` — Key-value store for application metadata

## Environment Variable

```env
DATABASE_URL=
```

Leave empty in `.env`. The value is resolved at runtime by Electron and passed to the backend process.
