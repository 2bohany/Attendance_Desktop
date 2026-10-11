import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { APP_NAME } from '@attendance/config';
import { DatabasePathService } from './services/database-path.service';
import { DatabaseInitService } from './services/database-init.service';
import { BackendProcessService } from './services/backend-process.service';
import { SecretsService } from './services/secrets.service';
import { registerIpcHandlers } from './ipc/handlers';

app.setName(APP_NAME);

let mainWindow: BrowserWindow | null = null;
let backendProcessService: BackendProcessService | null = null;

const isDev = !app.isPackaged;

async function initializeApplication(): Promise<void> {
  const databasePathService = new DatabasePathService();
  const databaseInitService = new DatabaseInitService(databasePathService);
  const secretsService = new SecretsService(databasePathService);
  backendProcessService = new BackendProcessService();

  await databaseInitService.initialize();
  const databaseUrl = databasePathService.getDatabaseUrl();
  const jwtSecret = secretsService.getOrCreateJwtSecret();
  const backupDirectory = databasePathService.getBackupDirectory();
  await backendProcessService.start(databaseUrl, jwtSecret, backupDirectory);
  registerIpcHandlers(databasePathService, backendProcessService);
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    title: APP_NAME,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await initializeApplication();
    createWindow();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  backendProcessService?.stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  backendProcessService?.stop();
});
