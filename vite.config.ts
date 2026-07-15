import { execSync } from 'node:child_process';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Progressive build number derived from the total commit count, injected at build time.
  let buildNumber = 'dev';
  try {
    buildNumber = execSync('git rev-list --count HEAD', { cwd: __dirname }).toString().trim();
  } catch (_) {
    // git history not available in this environment (e.g. shallow clone/no .git) — fall back gracefully
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    define: { __BUILD_NUMBER__: JSON.stringify(buildNumber) },
  };
});
