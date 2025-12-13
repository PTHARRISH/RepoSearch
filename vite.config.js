import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: "/RepoSearch/",   // ⭐ EXACT CASE-SENSITIVE FOLDER NAME
  build: {
    chunkSizeWarningLimit: 1500
  },
  plugins: [react(),
    tailwindcss(),
  ],
});