import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_ENABLE_START_TRANSITION': true,
    'process.env.REACT_APP_ENABLE_RELATIVE_SPLAT_PATH': true,
  },
});
