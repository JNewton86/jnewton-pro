// Builds the 1200×630 link-preview (Open Graph) images at build time.
// Satori lays out an element tree as SVG; resvg rasterizes it to PNG. Fonts are read from
// the same Fontsource packages the site uses (Satori needs .woff, not .woff2, and static
// weights rather than variable fonts — hence @fontsource/dm-sans alongside the variable one).
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  title: string;
  subtitle: string;
  /** Short context line above the title, e.g. a project category. */
  kicker?: string;
}

const colors = {
  bg: '#080d17',
  grid: 'rgba(0, 207, 195, 0.07)',
  border: '#1c2d47',
  cyan: '#00cfc3',
  amber: '#f0a030',
  heading: '#edf2fb',
  muted: '#8a9dba',
};

const fontFile = (pkg: string, file: string) =>
  readFile(resolve('node_modules', pkg, 'files', file));

let fontsPromise: ReturnType<typeof loadFonts> | undefined;

async function loadFonts() {
  const [bebas, dmSans400, dmSans700] = await Promise.all([
    fontFile('@fontsource/bebas-neue', 'bebas-neue-latin-400-normal.woff'),
    fontFile('@fontsource/dm-sans', 'dm-sans-latin-400-normal.woff'),
    fontFile('@fontsource/dm-sans', 'dm-sans-latin-700-normal.woff'),
  ]);
  return [
    { name: 'Bebas Neue', data: bebas, weight: 400 as const, style: 'normal' as const },
    { name: 'DM Sans', data: dmSans400, weight: 400 as const, style: 'normal' as const },
    { name: 'DM Sans', data: dmSans700, weight: 700 as const, style: 'normal' as const },
  ];
}

type El = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
  type,
  props: { style, children },
});

function layout({ title, subtitle, kicker }: OgCard): El {
  const titleSize = title.length > 30 ? 92 : title.length > 18 ? 116 : 148;

  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      backgroundColor: colors.bg,
      backgroundImage: `linear-gradient(${colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)`,
      backgroundSize: '52px 52px',
      borderLeft: `10px solid ${colors.cyan}`,
      fontFamily: 'DM Sans',
    },
    [
      el('div', { display: 'flex', fontFamily: 'Bebas Neue', fontSize: 40, letterSpacing: 6 }, [
        el('span', { color: colors.cyan }, 'JNEWTON'),
        el('span', { color: colors.muted }, '.PRO'),
      ]),
      el('div', { display: 'flex', flexDirection: 'column' }, [
        ...(kicker
          ? [el('div', { color: colors.amber, fontSize: 30, marginBottom: 12 }, kicker)]
          : []),
        el(
          'div',
          {
            color: colors.heading,
            fontFamily: 'Bebas Neue',
            fontSize: titleSize,
            lineHeight: 0.95,
            letterSpacing: 2,
          },
          title,
        ),
        el(
          'div',
          { color: colors.muted, fontSize: 34, lineHeight: 1.35, marginTop: 24, maxWidth: 980 },
          subtitle,
        ),
      ]),
    ],
  );
}

export async function renderOgImage(card: OgCard): Promise<Buffer> {
  fontsPromise ??= loadFonts();
  const svg = await satori(layout(card) as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await fontsPromise,
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
