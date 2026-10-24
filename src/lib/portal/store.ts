// Server-side storage for the client portal: discovery-board notes and the passcode
// rate limit. Backed by Upstash Redis through the Vercel Marketplace integration, which
// injects KV_REST_API_URL and KV_REST_API_TOKEN. Without them the portal still renders;
// saving is reported as unavailable and the rate limit is skipped.
import { KV_REST_API_TOKEN, KV_REST_API_URL } from 'astro:env/server';
import { Redis } from '@upstash/redis';

export const ANSWER_STATUSES = ['open', 'answered', 'followup', 'na'] as const;
export type AnswerStatus = (typeof ANSWER_STATUSES)[number];

export interface Answer {
  status: AnswerStatus;
  answer: string;
  updatedAt: string;
}

export interface MeetingMeta {
  date: string;
  attendees: string;
  notes: string;
  updatedAt: string;
}

export interface DiscoveryState {
  answers: Record<string, Answer>;
  meta: MeetingMeta | null;
}

export const ANSWER_MAX_LENGTH = 5000;
export const META_MAX_LENGTH = 10_000;

let client: Redis | null | undefined;

/** The Redis client, or null when the integration isn't configured. */
export function redis(): Redis | null {
  if (client === undefined) {
    client =
      KV_REST_API_URL && KV_REST_API_TOKEN
        ? new Redis({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN })
        : null;
  }
  return client;
}

export const storeConfigured = (): boolean => redis() !== null;

const discoveryKey = (slug: string) => `portal:${slug}:discovery`;
const ANSWER_FIELD = 'q:';
const META_FIELD = 'meta';

const isStatus = (value: unknown): value is AnswerStatus =>
  typeof value === 'string' && (ANSWER_STATUSES as readonly string[]).includes(value);

function parseAnswer(value: unknown): Answer | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  if (!isStatus(record['status']) || typeof record['answer'] !== 'string') return null;
  return {
    status: record['status'],
    answer: record['answer'],
    updatedAt: typeof record['updatedAt'] === 'string' ? record['updatedAt'] : '',
  };
}

function parseMeta(value: unknown): MeetingMeta | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  const text = (key: string) => (typeof record[key] === 'string' ? (record[key] as string) : '');
  return {
    date: text('date'),
    attendees: text('attendees'),
    notes: text('notes'),
    updatedAt: text('updatedAt'),
  };
}

export async function readDiscovery(slug: string): Promise<DiscoveryState> {
  const db = redis();
  const state: DiscoveryState = { answers: {}, meta: null };
  if (!db) return state;
  const fields = await db.hgetall<Record<string, unknown>>(discoveryKey(slug));
  for (const [field, value] of Object.entries(fields ?? {})) {
    if (field === META_FIELD) {
      state.meta = parseMeta(value);
    } else if (field.startsWith(ANSWER_FIELD)) {
      const answer = parseAnswer(value);
      if (answer) state.answers[field.slice(ANSWER_FIELD.length)] = answer;
    }
  }
  return state;
}

export async function writeAnswer(slug: string, id: string, answer: Answer): Promise<void> {
  const db = redis();
  if (!db) throw new Error('store not configured');
  await db.hset(discoveryKey(slug), { [`${ANSWER_FIELD}${id}`]: answer });
}

export async function writeMeta(slug: string, meta: MeetingMeta): Promise<void> {
  const db = redis();
  if (!db) throw new Error('store not configured');
  await db.hset(discoveryKey(slug), { [META_FIELD]: meta });
}

export async function clearDiscovery(slug: string): Promise<void> {
  const db = redis();
  if (!db) throw new Error('store not configured');
  await db.del(discoveryKey(slug));
}

/**
 * Sliding-window-ish rate limit: `limit` hits per `windowSeconds` for a key.
 * Returns true when the request is allowed. Allows everything when Redis is absent.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const db = redis();
  if (!db) return true;
  const redisKey = `portal:ratelimit:${key}`;
  const count = await db.incr(redisKey);
  if (count === 1) await db.expire(redisKey, windowSeconds);
  return count <= limit;
}
