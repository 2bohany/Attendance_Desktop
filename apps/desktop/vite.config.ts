import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import path from 'path';

const desktopRoot = __dirname;
const rendererRoot = path.resolve(desktopRoot, 'renderer');
const enableElectron = process.env.VITE_ELECTRON !== 'false';

export default defineConfig({
  plugins: [
    react(),
    ...(enableElectron
      ? [
          electron({
            main: {
              entry: path.resolve(desktopRoot, 'electron/main.ts'),
              vite: {
                build: {
                  outDir: path.resolve(desktopRoot, 'dist-electron'),
                  rollupOptions: {
                    external: ['electron', '@attendance/config', '@attendance/shared'],
                  },
                },
              },
            },
            preload: {
              input: path.resolve(desktopRoot, 'electron/preload.ts'),
              vite: {
                build: {
                  outDir: path.resolve(desktopRoot, 'dist-electron'),
                },
              },
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(rendererRoot, 'src'),
      '@attendance/shared': path.resolve(desktopRoot, '../shared/src/index.ts'),
      '@attendance/config': path.resolve(desktopRoot, '../../packages/config/src/index.ts'),
    },
  },
  root: rendererRoot,
  build: {
    outDir: path.resolve(desktopRoot, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
