import { getCollection } from 'astro:content';

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));

export const categories = ['Security', 'Healthcare Informatics', 'Projects', 'Radio', 'Health'] as const;
