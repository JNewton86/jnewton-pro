import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project in src/content/projects/. The file name is the URL slug.
// The body is the project overview; everything structured lives in frontmatter so the
// build fails loudly if a project is missing something a page needs.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One sentence for project cards. */
    tagline: z.string(),
    /** Two or three sentences for the project page header and the featured card. */
    summary: z.string(),
    category: z.string(),
    status: z.enum(['live', 'wip', 'concept']),
    featured: z.boolean().default(false),
    /** Display order, lowest first. */
    order: z.number().int(),
    stack: z.array(z.string()).min(1),
    features: z
      .array(
        z.object({
          /** Optional short name used by the product itself, e.g. "Agent 01". */
          label: z.string().optional(),
          title: z.string(),
          description: z.string(),
        }),
      )
      .default([]),
    outcome: z.string().optional(),
    /** How a visitor can see it: a public demo, access on request, or not at all. */
    demo: z
      .discriminatedUnion('type', [
        z.object({ type: z.literal('public'), url: z.url() }),
        z.object({ type: z.literal('on-request') }),
      ])
      .optional(),
    repo: z.url().optional(),
  }),
});

export const collections = { projects };
