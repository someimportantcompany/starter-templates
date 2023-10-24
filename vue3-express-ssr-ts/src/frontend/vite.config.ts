/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    vue(),
  ],
  ssr: {
    target: 'node',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    watch: false,
  },
});
