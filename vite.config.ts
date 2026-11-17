import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localD1MockPlugin } from './plugins/localD1Mock';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localD1MockPlugin()],
  server: {
    port: 5193,
    host: true,
    strictPort: false
  }
});
