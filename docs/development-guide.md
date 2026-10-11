# Development Guide

## Prerequisites

- Node.js >= 20
- npm >= 10
- Windows 10/11

## Initial Setup

```bash
# Clone and install
cd attendance-desktop
npm install

# Generate Prisma client (runs on postinstall)
npm run db:generate

# Build shared packages and backend
npm run build -w @attendance/config
npm run build -w @attendance/shared
npm run build -w @attendance/backend
```

## Development Commands

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start Electron in development mode |
| `npm run electron:dev` | Same as `dev`                      |
| `npm run lint`         | Run ESLint                         |
| `npm run lint:fix`     | Auto-fix ESLint issues             |
| `npm run format`       | Format with Prettier               |
| `npm run format:check` | Check formatting                   |
| `npm run typecheck`    | TypeScript type checking           |
| `npm run test`         | Run tests                          |
| `npm run test:watch`   | Run tests in watch mode            |

## Database Commands

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `npm run db:generate` | Generate Prisma Client              |
| `npm run db:migrate`  | Create/apply development migrations |
| `npm run db:studio`   | Open Prisma Studio GUI              |

## Build Commands

| Command                  | Description                        |
| ------------------------ | ---------------------------------- |
| `npm run build`          | Build all workspaces               |
| `npm run electron:build` | Build production Windows installer |

## Project Conventions

### Backend

- One module per domain under `apps/backend/src/modules/`
- Each module contains: `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.module.ts`
- Never put Prisma queries in controllers or services
- Use `@Injectable()` and constructor injection throughout

### Frontend

- Feature-based structure under `renderer/src/features/`
- Global reusable components in `renderer/src/components/ui/`
- API calls through `services/api-client.ts` (IPC proxy)
- State management via Zustand stores
- Server state via TanStack Query

### Shared

- Types and schemas in `apps/shared/src/`
- Constants in `packages/config/src/`
- Import as `@attendance/shared` and `@attendance/config`

## Environment Variables

Copy `.env.example` to `.env` (already provided with empty values):

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
APP_PORT=
APP_ENV=
COMPANY_NAME=
BACKUP_DIRECTORY=
```

Do not set `DATABASE_URL` manually — Electron resolves it at runtime.

## Adding a New Backend Module

1. Create folder: `apps/backend/src/modules/my-feature/`
2. Add files: `my-feature.controller.ts`, `my-feature.service.ts`, `my-feature.repository.ts`, `my-feature.module.ts`
3. Register `MyFeatureModule` in `app.module.ts`
4. Add Prisma models to `schema.prisma` and run `npm run db:migrate`

## Adding a New Frontend Feature

1. Create folder: `renderer/src/features/my-feature/`
2. Add subfolders as needed: `components/`, `hooks/`, `services/`, `pages/`
3. Export from `features/my-feature/index.ts`
4. Add route/navigation entry in sidebar and App.tsx

## Troubleshooting

| Issue                   | Solution                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| Backend won't start     | Run `npm run build -w @attendance/backend` first                       |
| Prisma client not found | Run `npm run db:generate`                                              |
| Port 3847 in use        | Stop other backend instances or change `APP_PORT`                      |
| Electron build fails    | Ensure `electronVersion` is set in desktop `package.json` build config |
