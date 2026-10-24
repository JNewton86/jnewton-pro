import type { APIRoute } from 'astro';
import { clearSession } from '../../lib/portal/auth';

export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies);
  return redirect('/portal/', 303);
};
