import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: base 設為 GitHub Pages 的 repo 名稱子路徑
export default defineConfig({
  plugins: [react()],
  base: '/HoYo_card/',
});
