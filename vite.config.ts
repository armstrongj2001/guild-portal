import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Pages serves project sites from /<repo>/, so the base path has to match
 * whichever fork is building. GITHUB_REPOSITORY is set by Actions; locally
 * there is no prefix.
 */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: repo ? `/${repo}/` : '/',
  plugins: [react()],
  define: { BUILD_TIME: JSON.stringify(new Date().toISOString()) },
});
