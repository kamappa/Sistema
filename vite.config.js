import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serve o Sistema em kamappa.github.io/Sistema/ — o base path tem
// de bater certo para os assets resolverem. O deploy passa a ter build step
// (Fase final da Missão 25: workflow GitHub Actions).
export default defineConfig({
  plugins: [react()],
  base: '/Sistema/',
});
