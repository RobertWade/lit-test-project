import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    mimeTypes: {
      'ts': 'application/javascript'
    }
  }
});