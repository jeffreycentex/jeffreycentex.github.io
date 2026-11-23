import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// When jeffreyrandow.org goes live: change `site`, and add public/CNAME with the domain.
export default defineConfig({
  site: 'https://jeffreycentex.github.io',
  integrations: [sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark-dimmed' } },
});
