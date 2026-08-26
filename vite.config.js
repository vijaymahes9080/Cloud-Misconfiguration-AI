import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Enables seamless deployment on GitHub Pages & custom subpaths
  server: {
    port: 3000,
    open: false
  }
});
