// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import astroIcon from 'astro-icon';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), astroIcon({ include: { mdi: ['*'] } }), tailwind()]
});