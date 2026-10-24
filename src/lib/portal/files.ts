// Gated files for the client portal (design exports, documents the client has agreed to share).
// Files live in a private Vercel Blob store under `clients/<slug>/<name>` and are streamed through
// /api/clients/<slug>/files/<name> after the passcode check. Nothing is committed to the repo
// (it's public) and nothing sits in /public (the CDN serves that before any check runs).
import { BLOB_READ_WRITE_TOKEN } from 'astro:env/server';
import { get, list } from '@vercel/blob';

export type FileKind = 'image' | 'pdf' | 'other';

export interface PortalFile {
  /** File name within the client's folder, safe to use in a URL path. */
  name: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  kind: FileKind;
}

export const filesConfigured = (): boolean => Boolean(BLOB_READ_WRITE_TOKEN);

/** One path segment: letters, digits, dot, dash, underscore. Rejects traversal and nesting. */
export const isSafeFileName = (name: string): boolean =>
  /^[\w-]+(?:\.[\w-]+)*$/.test(name) && name.length <= 200;

const kindOf = (name: string): FileKind => {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'other';
};

const folder = (slug: string) => `clients/${slug}/`;

export async function listFiles(slug: string): Promise<PortalFile[]> {
  if (!BLOB_READ_WRITE_TOKEN) return [];
  const files: PortalFile[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({
      prefix: folder(slug),
      token: BLOB_READ_WRITE_TOKEN,
      ...(cursor ? { cursor } : {}),
    });
    for (const blob of page.blobs) {
      const name = blob.pathname.slice(folder(slug).length);
      if (!isSafeFileName(name)) continue; // nested folders and odd names are skipped
      files.push({
        name,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        kind: kindOf(name),
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

export interface OpenedFile {
  stream: ReadableStream;
  contentType: string;
  size: number;
}

export async function openFile(slug: string, name: string): Promise<OpenedFile | null> {
  if (!BLOB_READ_WRITE_TOKEN || !isSafeFileName(name)) return null;
  const result = await get(`${folder(slug)}${name}`, {
    access: 'private',
    token: BLOB_READ_WRITE_TOKEN,
  });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return {
    stream: result.stream,
    contentType: result.blob.contentType || 'application/octet-stream',
    size: result.blob.size,
  };
}
