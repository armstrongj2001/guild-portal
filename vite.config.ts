import { copyFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Pages serves project sites from /<repo>/, so the base path has to match
 * whichever fork is building. GITHUB_REPOSITORY is set by Actions; locally
 * there is no prefix.
 */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

/** Pages has no rewrite rules; 404.html is how a deep link survives a refresh. */
const spaFallback = {
  name: 'spa-fallback',
  closeBundle() {
    copyFileSync('dist/index.html', 'dist/404.html');
  },
};

export default defineConfig({
  base: repo ? `/${repo}/` : '/',
  plugins: [react(), spaFallback],
});
