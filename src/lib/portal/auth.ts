// Sign-in sessions for the client portal.
//
// A visitor signs in at /portal/ with a client code and that client's passcode. The portal then
// sets one HttpOnly cookie holding the client code, an expiry and an HMAC signature over both, so
// the cookie can't be forged or edited to point at another client. The URL never names the
// client; every portal page reads it from the session. Passcodes live in PORTAL_PASSCODES (a JSON
// object of client code to passcode); the signing key is PORTAL_SESSION_SECRET. Both are
// server-only (astro:env).
import { PORTAL_PASSCODES, PORTAL_SESSION_SECRET } from 'astro:env/server';
import type { AstroCookies } from 'astro';
import { getClient, type ClientPortal } from '../../data/clients';

const SESSION_DAYS = 30;
const COOKIE = 'portal_session';

const encoder = new TextEncoder();

/** True when both the passcodes and the signing secret are present. */
export const authConfigured = (): boolean =>
  Boolean(PORTAL_SESSION_SECRET && PORTAL_SESSION_SECRET.length >= 32 && PORTAL_PASSCODES);

function passcodeFor(code: string): string | undefined {
  if (!PORTAL_PASSCODES) return undefined;
  try {
    const parsed: unknown = JSON.parse(PORTAL_PASSCODES);
    if (typeof parsed !== 'object' || parsed === null) return undefined;
    const value = (parsed as Record<string, unknown>)[code];
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

/** Client codes are the registry slugs: short, lowercase, URL-safe. */
export const normalizeCode = (value: string): string => value.trim().toLowerCase();

/**
 * Checks a client code and passcode together. An unknown code is compared against a dummy value
 * so the response time doesn't reveal which codes exist.
 */
export async function verifyCredentials(
  code: string,
  attempt: string,
): Promise<ClientPortal | null> {
  const client = getClient(code);
  const expected = (client && passcodeFor(code)) || `no-such-client:${crypto.randomUUID()}`;
  const matches = await safeEqual(expected, attempt.trim());
  return matches && client ? client : null;
}

export async function createSession(cookies: AstroCookies, code: string): Promise<void> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const signature = await sign(`${code}.${expires}`);
  cookies.set(COOKIE, `${code}.${expires}.${signature}`, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/** The signed-in client, or null when there is no valid session. */
export async function readSession(cookies: AstroCookies): Promise<ClientPortal | null> {
  if (!authConfigured()) return null;
  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return null;
  const [code, expiresText, signature, ...rest] = raw.split('.');
  if (!code || !expiresText || !signature || rest.length > 0) return null;
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;
  if (!(await safeEqual(await sign(`${code}.${expires}`), signature))) return null;
  return getClient(code) ?? null;
}

export function clearSession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: '/' });
}
