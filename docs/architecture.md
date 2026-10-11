# Architecture Overview

## System Architecture

The Attendance Desktop App follows a local-first, offline-capable architecture:

```text
┌──────────────────────────────────────────────┐
│              Electron Main Process           │
│                                              │
│  ┌─────────────┐    ┌─────────────────────┐  │
│  │  Database    │    │  Backend Process    │  │
│  │  Init Service│    │  (NestJS)           │  │
│  └──────┬──────┘    └──────────┬──────────┘  │
│         │                      │             │
│  ┌──────▼──────────────────────▼──────────┐  │
│  │           IPC Handlers                 │  │
│  └──────────────────┬─────────────────────┘  │
│                     │                        │
│  ┌──────────────────▼─────────────────────┐  │
│  │         Preload Script (Bridge)        │  │
│  └──────────────────┬─────────────────────┘  │
│                     │                        │
│  ┌──────────────────▼─────────────────────┐  │
│  │         React Renderer (Vite)          │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer        | Technology         | Responsibility                             |
| ------------ | ------------------ | ------------------------------------------ |
| Renderer     | React + Vite       | UI, user interaction, display logic        |
| Preload      | Electron           | Secure API bridge to main process          |
| IPC          | Electron           | Controlled communication channel           |
| Main Process | Electron + Node.js | App lifecycle, DB init, backend management |
| Backend      | NestJS             | Business logic, validation, API            |
| Data Access  | Prisma ORM         | Database queries via repositories          |
| Storage      | SQLite             | Local persistent data                      |

## Monorepo Structure

```text
attendance-desktop/
├── apps/
│   ├── desktop/     # Electron + React
│   ├── backend/     # NestJS + Prisma
│   └── shared/      # Shared types and schemas
├── packages/
│   ├── config/      # Application constants
│   └── ui/          # Shared UI (future)
├── docs/            # Documentation
├── scripts/         # Build scripts
└── tests/           # Integration tests
```

## Key Design Decisions

1. **Local-first** — All data stored in SQLite on the user's machine
2. **No direct DB access from UI** — React never touches Prisma or SQLite
3. **IPC proxy pattern** — Renderer communicates via preload → IPC → backend
4. **MVC-inspired backend** — Controller → Service → Repository → PrismaService
5. **Feature-based frontend** — Organized by domain for scalability
6. **Single PrismaClient** — One instance injected globally via NestJS DI

## Offline Operation

The application requires no internet connection after installation. All core functionality operates against the local SQLite database.
