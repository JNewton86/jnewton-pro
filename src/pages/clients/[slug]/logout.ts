import type { APIRoute } from 'astro';
import { clearSession } from '../../../lib/portal/auth';

export const prerender = false;

export const POST: APIRoute = ({ locals, cookies, redirect }) => {
  const client = locals.client;
  if (!client) return new Response('Not found', { status: 404 });
  clearSession(cookies, client.slug);
  return redirect(`/clients/${client.slug}/unlock/`, 303);
};
