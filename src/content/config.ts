import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    model: z.string().optional(),
    category: z.string(),
    shortDesc: z.string(),
    heroImage: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    specs: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
    order: z.number().optional(),
    lang: z.enum(['ko','en']).default('ko')
  })
});

const solutions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortDesc: z.string(),
    coverImage: z.string().optional(),
    bodyImage: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    order: z.number().optional(),
    lang: z.enum(['ko','en']).default('ko')
  })
});

export const collections = { products, solutions };