// Client portal registry. Each client gets a passcode-gated space under /clients/<slug>/ with a
// project overview, a discovery board whose notes persist server-side, and gated files.
// Passcodes are NOT here (they're in the PORTAL_PASSCODES environment variable); this file holds
// only what the portal shows once someone is in.
import { aaplus } from './aaplus';

export interface DiscoveryQuestion {
  /** Stable id; notes are stored against it, so never reuse one for a different question. */
  id: string;
  question: string;
  /** Why the answer matters, shown under the question. */
  why: string;
}

export interface DiscoverySection {
  id: string;
  title: string;
  lead: string;
  /** A finding the questions hinge on, shown as a callout above them. */
  callout?: string;
  questions: DiscoveryQuestion[];
}

export interface PortalLink {
  label: string;
  href: string;
  note?: string;
}

export interface ClientPortal {
  slug: string;
  /** Client organization name. */
  name: string;
  /** Short project title, used in headings and the browser tab. */
  project: string;
  summary: string;
  /** Workstreams the engagement covers, in the client's own words where possible. */
  workstreams: string[];
  discovery: DiscoverySection[];
  links: PortalLink[];
}

export const clients: Record<string, ClientPortal> = {
  [aaplus.slug]: aaplus,
};

export const getClient = (slug: string | undefined): ClientPortal | undefined =>
  slug && Object.hasOwn(clients, slug) ? clients[slug] : undefined;
