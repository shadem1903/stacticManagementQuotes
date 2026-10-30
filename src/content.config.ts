import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    version: z.string(),
    /** null mientras no exista fecha real de entrada en vigor */
    effectiveDate: z.string().nullable(),
    lastUpdated: z.string(),
    /** true solo cuando un abogado revisó el documento y los datos del titular están completos */
    legalReviewed: z.boolean().default(false),
    scope: z.string(),
    related: z.array(z.string()).default([]),
    history: z.array(z.object({ version: z.string(), date: z.string(), changes: z.string() })).default([]),
  }),
});

export const collections = { legal };
