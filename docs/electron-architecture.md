# Electron Architecture

## Process Model

The application uses Electron's multi-process architecture:

| Process  | Role                                            |
| -------- | ----------------------------------------------- |
| Main     | App lifecycle, DB init, backend management, IPC |
| Renderer | React UI (sandboxed, no Node.js access)         |
| Preload  | Secure bridge between main and renderer         |
| Backend  | NestJS child process (spawned by main)          |

## Security Configuration

```typescript
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,    // Mandatory
  nodeIntegration: false,    // Mandatory
  sandbox: true,
}
```

### Security Rules

The renderer process must **never** directly access:

- `fs`, `path`, `child_process`
- Prisma or SQLite
- Any Node.js APIs

All communication flows through the controlled preload bridge.

## IPC Architecture

```text
React Component
      ↓
window.electronAPI (preload)
      ↓
ipcRenderer.invoke(channel, data)
      ↓
ipcMain.handle(channel, handler)  [Main Process]
      ↓
Backend HTTP Request (localhost) or Direct Service
      ↓
NestJS → Prisma → SQLite
```

### IPC Channels

| Channel                 | Direction                 | Purpose                  |
| ----------------------- | ------------------------- | ------------------------ |
| `app:get-info`          | Renderer → Main           | Application metadata     |
| `app:get-database-info` | Renderer → Main           | Database path and status |
| `backend:request`       | Renderer → Main → Backend | Proxied API requests     |

### Preload API

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
  getDatabaseInfo: () => ipcRenderer.invoke('app:get-database-info'),
  backendRequest: (request) => ipcRenderer.invoke('backend:request', request),
});
```

## Database Initialization

The main process handles all database setup before the UI loads:

```text
app.whenReady()
      ↓
app.setName('AttendanceApp')
      ↓
DatabasePathService.ensureDirectories()
      ↓
Set process.env.DATABASE_URL
      ↓
DatabaseInitService.runMigrations()
      ↓
BackendProcessService.start(databaseUrl)
      ↓
registerIpcHandlers()
      ↓
createWindow()
```

### Directory Structure Created

```text
app.getPath('userData')/
├── data/
│   ├── attendance.db
│   └── backups/
└── logs/
```

## Backend Process Management

NestJS runs as a child process spawned by Electron main:

- Uses `ELECTRON_RUN_AS_NODE=1` to run Node.js from Electron binary
- Listens on `127.0.0.1:3847` (localhost only)
- Receives `DATABASE_URL` via environment variables
- Stopped gracefully on `before-quit`

## Content Security Policy

The renderer enforces CSP via meta tag in `index.html`, restricting script sources and network connections to localhost only.

## Production Packaging

Electron Builder packages:

- Renderer build (`dist/`)
- Main/preload build (`dist-electron/`)
- Backend build (`backend/`)
- Prisma schema and client

Output: Windows NSIS installer in `apps/desktop/release/`.
