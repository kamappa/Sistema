import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serve o Sistema em kamappa.github.io/Sistema/ — o base path tem
// de bater certo para os assets resolverem. O deploy passa a ter build step
// (Fase final da Missão 25: workflow GitHub Actions).
export default defineConfig({
  plugins: [react()],
  base: '/Sistema/',
  build: {
    rollupOptions: {
      output: {
        // React em chunk próprio: muda muito menos vezes que o código da app,
        // portanto sobrevive ao cache do browser entre deploys.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
    // O maior chunk é o Three.js (~506 KB) e é ASSÍNCRONO — só desce quando o
    // palco monta, nunca bloqueia o primeiro paint (Missão 26 · Fase 1).
    // O aviso dos 500 KB seria ruído permanente; o limite sobe com a razão
    // documentada, não para esconder o problema.
    chunkSizeWarningLimit: 600,
  },
});
