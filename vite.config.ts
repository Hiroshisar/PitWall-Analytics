import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/openf1': {
        target: 'https://api.openf1.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/openf1/, ''),
      },
    },
  },
});
