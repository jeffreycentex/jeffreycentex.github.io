import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['Security', 'Healthcare Informatics', 'Projects', 'Radio']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Install guides, setup and radio/emergency reference.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['Software', 'Radio', 'Emergency']),
    order: z.number().default(100),
    repo: z.string().url().optional(),
    image: z.string().optional(), // logo shown beside the title
    imageAlt: z.string().optional(),
  }),
});

// Project overview pages: features, screenshots, links. Install steps live in docs.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    repo: z.string().url(),
    docs: z.string().optional(), // slug of the install guide in the docs collection
    tags: z.array(z.string()).default([]),
    platforms: z.array(z.string()).default([]),
    license: z.string().optional(),
    order: z.number().default(100),
    screenshots: z
      .array(z.object({ src: z.string(), alt: z.string(), caption: z.string() }))
      .default([]),
  }),
});

export const collections = { blog, docs, projects };
