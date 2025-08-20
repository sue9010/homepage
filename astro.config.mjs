// @ts-check
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
dotenv.config();

import mdx from '@astrojs/mdx';
import astroIcon from 'astro-icon';
import tailwind from '@astrojs/tailwind';
// import react from '@astrojs/react'; // Removed

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), astroIcon({ include: { mdi: ['*'] } }), tailwind()],
});