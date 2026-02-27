import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: base 設為 './' 以支援 GitHub Pages 部署
export default defineConfig({
  plugins: [react()],
  base: './',
});
