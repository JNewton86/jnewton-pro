// schema.org structured data (JSON-LD), built only from data the pages already show:
// site.config.ts, resume.ts, and the projects collection. Entities link to each other
// by @id so search engines and AI systems can tell they all describe the same person.
import type { CollectionEntry } from 'astro:content';
import { education } from '../data/resume';
import { site } from '../site.config';

type Node = Record<string, unknown>;

const absolute = (path: string) => new URL(path, site.url).href;

export const ids = {
  person: absolute('/#person'),
  website: absolute('/#website'),
};

export function person(): Node {
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    url: absolute('/'),
    jobTitle: site.jobTitle,
    description: site.description,
    email: `mailto:${site.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    // Only finished programs count as alumniOf.
    alumniOf: education
      .filter((entry) => entry.completed)
      .map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.org })),
    knowsAbout: [...site.expertise],
    sameAs: [site.social.linkedin.url, site.social.github.url],
  };
}

export function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: absolute('/'),
    name: site.name,
    description: site.description,
    inLanguage: 'en-US',
    publisher: { '@id': ids.person },
  };
}

/** The home page is a profile page about the person. */
export function profilePage(): Node {
  return {
    '@type': 'ProfilePage',
    '@id': absolute('/#profile'),
    url: absolute('/'),
    name: site.title,
    isPartOf: { '@id': ids.website },
    mainEntity: { '@id': ids.person },
  };
}

export function project(entry: CollectionEntry<'projects'>): Node {
  const url = absolute(`/projects/${entry.id}/`);
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    url,
    name: entry.data.title,
    description: entry.data.summary,
    genre: entry.data.category,
    keywords: entry.data.stack.join(', '),
    creator: { '@id': ids.person },
    isPartOf: { '@id': ids.website },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function graph(nodes: Node[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
