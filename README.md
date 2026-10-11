# Attendance Desktop App

A production-quality, local-first Attendance Management Desktop Application for Windows.

All data is stored locally in SQLite — no internet connection, cloud services, or external database servers required.

## Technology Stack

| Layer    | Technologies                                                            |
| -------- | ----------------------------------------------------------------------- |
| Desktop  | Electron, Electron Builder, TypeScript                                  |
| Frontend | React, Vite, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query, Zustand |
| Backend  | NestJS, TypeScript                                                      |
| Database | SQLite, Prisma ORM                                                      |
| Fonts    | Inter, Cairo                                                            |

## Architecture

```text
Electron
   │
   ├── React Renderer
   │
   ├── Secure Preload / IPC
   │
   └── NestJS Backend
            │
            ├── Controllers
            ├── Services
            ├── Repositories
            └── PrismaService
                  │
                  ▼
              SQLite (attendance.db)
```

### MVC Architecture (Backend)

```text
Controller → Service → Repository → PrismaService → SQLite
```

See [docs/mvc-architecture.md](docs/mvc-architecture.md) for details.

## Local Database

The SQLite database is stored in Electron's application data directory:

```text
%APPDATA%/AttendanceApp/
├── data/
│   └── attendance.db
├── backups/
└── logs/
```

The path is resolved via `app.getPath('userData')` — never hardcoded, never stored in the project repository.

See [docs/database.md](docs/database.md) for Prisma configuration and migration details.

## Prerequisites

- Node.js >= 20
- npm >= 10

## Installation

```bash
npm install
npm run db:generate
npm run build -w @attendance/config
npm run build -w @attendance/shared
npm run build -w @attendance/backend
```

## Environment Setup

`.env` and `.env.example` are provided with empty values:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
APP_PORT=
APP_ENV=
COMPANY_NAME=
BACKUP_DIRECTORY=
```

`DATABASE_URL` is resolved at runtime by Electron — do not set it manually.

## Development

```bash
npm run dev              # Start Electron + React + NestJS
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run test             # Vitest
npm run format           # Prettier
```

## Database Commands

```bash
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Development migrations
npm run db:studio        # Prisma Studio GUI
```

## Build

```bash
npm run build            # Build all workspaces
npm run electron:build   # Windows NSIS installer
```

## Project Structure

```text
attendance-desktop/
├── apps/
│   ├── desktop/              # Electron + React
│   │   ├── electron/         # Main process, preload, IPC, services
│   │   └── renderer/src/     # React UI
│   │       ├── components/   # Reusable UI components
│   │       ├── features/     # Feature-based modules
│   │       ├── layouts/      # App shell, sidebar, top bar
│   │       ├── hooks/        # Custom React hooks
│   │       ├── services/     # API client (IPC)
│   │       └── stores/       # Zustand state
│   ├── backend/              # NestJS + Prisma
│   │   ├── prisma/           # Schema and migrations
│   │   └── src/
│   │       ├── common/       # Filters, guards, logging
│   │       ├── config/       # App configuration
│   │       ├── database/     # PrismaModule + PrismaService
│   │       └── modules/      # Feature modules (MVC)
│   └── shared/               # Shared types and schemas
├── packages/
│   ├── config/               # App constants
│   └── ui/                   # Shared UI package
├── docs/                     # Architecture documentation
├── scripts/                  # Build scripts
└── tests/                    # Integration tests
```

## Security

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Controlled IPC via preload script
- Renderer never accesses filesystem, Prisma, or SQLite directly

See [docs/electron-architecture.md](docs/electron-architecture.md) for details.

## Documentation

| Document                                                  | Description                     |
| --------------------------------------------------------- | ------------------------------- |
| [architecture.md](docs/architecture.md)                   | System architecture overview    |
| [database.md](docs/database.md)                           | SQLite and Prisma configuration |
| [mvc-architecture.md](docs/mvc-architecture.md)           | Backend MVC pattern             |
| [electron-architecture.md](docs/electron-architecture.md) | Electron security and IPC       |
| [development-guide.md](docs/development-guide.md)         | Development workflow            |

## Phase 0 Status

Foundation phase — project infrastructure only. Business features (auth, employees, attendance, etc.) will be implemented in subsequent phases.

## License

Private — All rights reserved.
