// Passcode sessions for the client portal.
//
// A client enters a shared passcode once; the portal then sets an HttpOnly cookie holding an
// expiry and an HMAC signature over `<slug>.<expiry>`, so the cookie can't be forged or moved
// to another client's space. Passcodes live in PORTAL_PASSCODES (a JSON object of slug to
// passcode); the signing key is PORTAL_SESSION_SECRET. Both are server-only (astro:env).
import { PORTAL_PASSCODES, PORTAL_SESSION_SECRET } from 'astro:env/server';
import type { AstroCookies } from 'astro';

const SESSION_DAYS = 30;
const COOKIE_PREFIX = 'portal_';

const encoder = new TextEncoder();

/** True when both the passcodes and the signing secret are present. */
export const authConfigured = (): boolean =>
  Boolean(PORTAL_SESSION_SECRET && PORTAL_SESSION_SECRET.length >= 32 && PORTAL_PASSCODES);

function passcodeFor(slug: string): string | undefined {
  if (!PORTAL_PASSCODES) return undefined;
  try {
    const parsed: unknown = JSON.parse(PORTAL_PASSCODES);
    if (typeof parsed !== 'object' || parsed === null) return undefined;
    const value = (parsed as Record<string, unknown>)[slug];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

const toBase64Url = (bytes: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');

async function sign(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(PORTAL_SESSION_SECRET ?? ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toBase64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/** Compares two strings in time that depends only on their length, via fixed-size digests. */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [da, db] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  const ua = new Uint8Array(da);
  const ub = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= (ua[i] ?? 0) ^ (ub[i] ?? 0);
  return diff === 0;
}

export async function verifyPasscode(slug: string, attempt: string): Promise<boolean> {
  const expected = passcodeFor(slug);
  if (!expected) return false;
  return safeEqual(expected, attempt.trim());
}

const cookieName = (slug: string) => `${COOKIE_PREFIX}${slug}`;

export async function createSession(cookies: AstroCookies, slug: string): Promise<void> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const signature = await sign(`${slug}.${expires}`);
  cookies.set(cookieName(slug), `${expires}.${signature}`, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function hasSession(cookies: AstroCookies, slug: string): Promise<boolean> {
  if (!authConfigured()) return false;
  const raw = cookies.get(cookieName(slug))?.value;
  if (!raw) return false;
  const dot = raw.indexOf('.');
  if (dot < 1) return false;
  const expires = Number(raw.slice(0, dot));
  const signature = raw.slice(dot + 1);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  return safeEqual(await sign(`${slug}.${expires}`), signature);
}

export function clearSession(cookies: AstroCookies, slug: string): void {
  cookies.delete(cookieName(slug), { path: '/' });
}
