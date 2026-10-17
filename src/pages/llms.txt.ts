import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../site.config';

// A plain-text summary for AI assistants, following the llms.txt proposal (llmstxt.org).
// Generated from the same data as the pages, so it can't drift from them.
export const GET: APIRoute = async () => {
  const url = (path: string) => new URL(path, site.url).href;
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} (${site.jobTitle}, based in ${site.location}). This site covers ${site.name}'s background, the AI and automation projects built, and contact details.`,
    '',
    '## Projects',
    '',
    ...projects.map((p) => `- [${p.data.title}](${url(`/projects/${p.id}/`)}): ${p.data.tagline}`),
    '',
    '## About',
    '',
    `- [Home](${url('/')}): Background, skills, experience, education, and certifications`,
    `- [Résumé (PDF)](${url(site.resume)}): Full résumé`,
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- [LinkedIn](${site.social.linkedin.url})`,
    `- [GitHub](${site.social.github.url})`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
