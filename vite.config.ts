import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/job-feeds/remotive': {
        target: 'https://remotive.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/job-feeds\/remotive/, '/api/remote-jobs'),
      },
      '/api/job-feeds/greenhouse': {
        target: 'https://boards-api.greenhouse.io',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/job-feeds\/greenhouse/, '/v1/boards'),
      },
      '/api/job-feeds/lever': {
        target: 'https://api.lever.co',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/job-feeds\/lever/, '/v0/postings'),
      },
      '/api/job-feeds/arbeitnow': {
        target: 'https://www.arbeitnow.com',
        changeOrigin: true,
        rewrite: () => '/api/job-board-api',
      },
    },
  },
});
