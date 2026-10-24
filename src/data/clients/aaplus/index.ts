import type { ClientPortal } from '..';
import { discovery } from './discovery';

export const aaplus: ClientPortal = {
  slug: 'aaplus',
  name: 'AA Plus Bonding Services',
  project: 'Website rebuild and instant-issue bonds',
  summary:
    'A redesign of aaplusbonding.com with a logo refresh, audience and bond-type landing pages, and an online quote-and-buy flow for instant-issue surety bonds through the CapSpecialty Surety API. Quotes that start but do not finish are captured for follow-up.',
  workstreams: [
    'Logo clean-up',
    'AI hardening',
    'Website landing pages',
    'Website design',
    'CapSpecialty API integration',
  ],
  discovery,
  links: [
    {
      label: 'Current site',
      href: 'https://aaplusbonding.com/',
      note: 'What we are replacing.',
    },
    {
      label: 'Homepage pattern explorations',
      href: 'https://claude.ai/artifact/6EijijVuzTFS3zsz5X7dsP',
      note: 'Interactive canvas with five directions; exported images are in Files.',
    },
  ],
};
