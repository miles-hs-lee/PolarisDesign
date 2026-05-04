import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.GITHUB_PAGES === 'true' ? '/PolarisDesign/' : '/';

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 5173,
    strictPort: false,
  },
});
