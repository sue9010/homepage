import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    model: z.string().optional(),
    category: z.string(),
    shortDesc: z.string(),
    mainDesc: z.string().optional(), // New field
    heroImage: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    specs: z.array(
      z.union([
        z.object({
          type: z.literal('section'),
          title: z.string(),
        }),
        z.object({
          type: z.literal('item'),
          key: z.string(),
          value: z.string(),
        })
      ])
    ).optional(),
    relatedDocuments: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    ).optional(),
    order: z.number().optional(),
    resolution: z.string().optional(), // New field
    sensor_size: z.string().optional(), // New field
    output: z.array(z.string()).optional(), // New field
    lang: z.enum(['ko','en']).default('ko')
  })
});

const solutions = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(), // title -> name 으로 변경하여 통일
    shortDesc: z.string(),
    heroImage: z.string(), // coverImage -> heroImage 로 변경
    gallery: z.array(z.string()).optional(),
    features: z.array( // 'specs'와 유사한 'features' 필드 추가
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(), // 아이콘 필드 추가
      })
    ).optional(),
    relatedProducts: z.array(z.string()).optional(), // 관련 제품 slug 배열
    order: z.number().optional(),
    lang: z.enum(['ko','en']),
  })
});

export const collections = { products, solutions };