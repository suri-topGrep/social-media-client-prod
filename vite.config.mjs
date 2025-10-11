// vite.config.mjs
import { defineConfig } from 'vite';

// No plugin needed for plain React if you handle JSX with Babel/ESBuild
export default defineConfig({
  build: {
    outDir: 'dist'
  },
});