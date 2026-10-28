// Discovery-board notes for the signed-in client. The middleware has already checked the session and set
// locals.client, so this only validates the payload and talks to the store.
import type { APIRoute } from 'astro';
import {
  ANSWER_MAX_LENGTH,
  ANSWER_STATUSES,
  META_MAX_LENGTH,
  clearDiscovery,
  readDiscovery,
  storeConfigured,
  writeAnswer,
  writeMeta,
  type Answer,
  type AnswerStatus,
  type MeetingMeta,
} from '../../../lib/portal/store';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const GET: APIRoute = async ({ locals }) => {
  const client = locals.client;
  if (!client) return json({ error: 'not found' }, 404);
  const state = await readDiscovery(client.slug);
  return json({ configured: storeConfigured(), ...state }, state.available ? 200 : 503);
};

const isStatus = (value: unknown): value is AnswerStatus =>
  typeof value === 'string' && (ANSWER_STATUSES as readonly string[]).includes(value);

const text = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.length <= max ? value : null;

export const PUT: APIRoute = async ({ locals, request }) => {
  const client = locals.client;
  if (!client) return json({ error: 'not found' }, 404);
  if (!storeConfigured()) return json({ error: 'storage is not configured' }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }
  if (typeof body !== 'object' || body === null) return json({ error: 'invalid body' }, 400);
  const payload = body as Record<string, unknown>;
  const updatedAt = new Date().toISOString();

  if (payload['kind'] === 'answer') {
    const id = payload['id'];
    const known =
      typeof id === 'string' &&
      client.discovery.some((section) => section.questions.some((q) => q.id === id));
    if (!known) return json({ error: 'unknown question id' }, 400);
    const answerText = text(payload['answer'], ANSWER_MAX_LENGTH);
    if (!isStatus(payload['status']) || answerText === null)
      return json({ error: 'invalid answer' }, 400);
    const answer: Answer = { status: payload['status'], answer: answerText, updatedAt };
    await writeAnswer(client.slug, id, answer);
    return json({ ok: true, updatedAt });
  }

  if (payload['kind'] === 'meta') {
    const date = text(payload['date'], 40);
    const attendees = text(payload['attendees'], 500);
    const notes = text(payload['notes'], META_MAX_LENGTH);
    if (date === null || attendees === null || notes === null)
      return json({ error: 'invalid meeting details' }, 400);
    const meta: MeetingMeta = { date, attendees, notes, updatedAt };
    await writeMeta(client.slug, meta);
    return json({ ok: true, updatedAt });
  }

  return json({ error: 'unknown kind' }, 400);
};

export const DELETE: APIRoute = async ({ locals }) => {
  const client = locals.client;
  if (!client) return json({ error: 'not found' }, 404);
  if (!storeConfigured()) return json({ error: 'storage is not configured' }, 503);
  await clearDiscovery(client.slug);
  return json({ ok: true });
};
