import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage, type OgCard } from '../../lib/og-image';
import { site } from '../../site.config';

// One preview image per page: /og/home.png, /og/projects.png, /og/projects/<id>.png.
export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  return [
    {
      params: { slug: 'home' },
      props: { title: site.name, subtitle: site.jobTitle, kicker: site.location },
    },
    {
      params: { slug: 'projects' },
      props: {
        title: 'Projects',
        subtitle: "AI tools, automation systems, and engineering work I've built and shipped.",
        kicker: site.name,
      },
    },
    ...projects.map((project) => ({
      params: { slug: `projects/${project.id}` },
      props: {
        title: project.data.title,
        subtitle: project.data.tagline,
        kicker: project.data.category,
      },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as OgCard);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
