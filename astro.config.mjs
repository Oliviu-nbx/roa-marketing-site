import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://roa-marketing.com',
  integrations: [tailwind()],
  output: 'static'
});
