/**
 * Procedural artwork generator.
 *
 * Produces every original illustration used by the site (florals, sakura)
 * as static SVG files. Output is deterministic
 * (seeded RNG), so re-running the script yields identical files.
 *
 *   npm run art
 *
 * Output:
 *   public/illustrations/*.svg              decorative florals used across sections
 *   src/components/art/sakura-branch.json   the hero branch as data, grown on arrival
 *   src/components/art/sakura-sprigs.json   side sprigs that grow in as the guest scrolls
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ILLU = join(root, "public", "illustrations");
mkdirSync(ILLU, { recursive: true });

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Number(n.toFixed(1));
const svg = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">` +
  `<defs>${defs}</defs>${body}</svg>\n`;

const C = {
  obsidian: "#090708",
  burgundy: "#400D20",
  wine: "#5C1029",
  crimson: "#741D35",
  gold: "#D5B98A",
  ivory: "#F1E7D9",
  rose: "#A77B82",
};

/* Shared gradient definitions ------------------------------------- */
const PETAL_PALETTES = {
  crimson: ["#1E050C", "#5C1029", "#9A3350"],
  wine: ["#16040A", "#400D20", "#7A2440"],
  blush: ["#3B1A22", "#8A5B64", "#D7B2B3"],
  ivory: ["#5E5045", "#CDBCA6", "#F6EDE1"],
};
function petalDefs() {
  return Object.entries(PETAL_PALETTES)
    .map(
      ([k, [a, b, c]]) =>
        `<linearGradient id="p-${k}" x1="0" y1="1" x2="0" y2="0">` +
        `<stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`,
    )
    .join("");
}
const commonDefs = () =>
  petalDefs() +
  `<linearGradient id="leaf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#12080B"/><stop offset="1" stop-color="#3A1620"/></linearGradient>` +
  `<linearGradient id="sakura" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#8E5A66"/><stop offset=".6" stop-color="#D3A9AF"/><stop offset="1" stop-color="#F4E2E0"/></linearGradient>` +
  `<radialGradient id="glow-gold"><stop offset="0" stop-color="${C.gold}" stop-opacity=".9"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="moon" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#E9B7A6"/><stop offset=".35" stop-color="#B8455A"/><stop offset=".75" stop-color="#741D35"/><stop offset="1" stop-color="#3A0A18"/></radialGradient>` +
  `<radialGradient id="moon-halo"><stop offset=".45" stop-color="#9A2C47" stop-opacity=".55"/><stop offset=".7" stop-color="#5C1029" stop-opacity=".2"/><stop offset="1" stop-color="#5C1029" stop-opacity="0"/></radialGradient>` +
  `<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>` +
  `<filter id="mist" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>`;

/* ------------------------------------------------------------------ */
/* Botanical primitives                                                */
/* ------------------------------------------------------------------ */

function petalPath(l, w) {
  return `M0 0C${f(w * 1.15)} ${f(-l * 0.3)} ${f(w * 0.95)} ${f(-l * 1.04)} 0 ${f(-l * 0.93)}C${f(-w * 0.95)} ${f(-l * 1.04)} ${f(-w * 1.15)} ${f(-l * 0.3)} 0 0Z`;
}

/** Layered rose/peony bloom. */
function bloom(cx, cy, r, palette, seed, opts = {}) {
  const R = rng(seed);
  const rings = opts.rings ?? 4;
  let out = `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(R() * 360)})">`;
  // soft shadow
  out += `<circle r="${f(r * 1.02)}" fill="#050304" opacity=".55" filter="url(#soft)"/>`;
  for (let ring = 0; ring < rings; ring++) {
    const t = ring / rings;
    const count = Math.max(5, Math.round(8 - ring * 0.8));
    const len = r * (1 - t * 0.62);
    const wid = len * (0.5 + R() * 0.08);
    const offset = R() * 360;
    for (let i = 0; i < count; i++) {
      const a = offset + (360 / count) * i + (R() - 0.5) * 14;
      const s = 0.92 + R() * 0.16;
      out += `<path d="${petalPath(len * s, wid * s)}" transform="rotate(${f(a)})" fill="url(#p-${palette})" stroke="#0B0507" stroke-opacity=".45" stroke-width=".8"/>`;
      // light catching the petal edge
      out += `<path d="M${f(-wid * 0.55 * s)} ${f(-len * 0.82 * s)}Q0 ${f(-len * 1.0 * s)} ${f(wid * 0.55 * s)} ${f(-len * 0.82 * s)}" transform="rotate(${f(a)})" stroke="#F1E7D9" stroke-opacity="${palette === "ivory" ? 0.35 : 0.14}" stroke-width="1"/>`;
    }
  }
  // cupped spiral heart
  const core = r * 0.3;
  for (let i = 0; i < 5; i++) {
    const rr = core * (1 - i * 0.18);
    const a0 = R() * 360;
    out += `<path d="M${f(-rr)} 0A${f(rr)} ${f(rr * 0.82)} 0 0 1 ${f(rr)} 0" transform="rotate(${f(a0)})" stroke="${PETAL_PALETTES[palette][0]}" stroke-width="${f(1.6 - i * 0.2)}" stroke-linecap="round" opacity=".9"/>`;
    out += `<path d="M${f(-rr * 0.9)} 2A${f(rr)} ${f(rr * 0.8)} 0 0 1 ${f(rr * 0.9)} 2" transform="rotate(${f(a0)})" stroke="${PETAL_PALETTES[palette][2]}" stroke-opacity=".35" stroke-width=".7"/>`;
  }
  out += `<circle r="${f(core * 0.22)}" fill="${PETAL_PALETTES[palette][0]}"/>`;
  return out + `</g>`;
}

function leaf(x, y, len, angle, opts = {}) {
  const w = len * (opts.ratio ?? 0.32);
  const d = `M0 0C${f(w)} ${f(-len * 0.25)} ${f(w * 0.8)} ${f(-len * 0.8)} 0 ${f(-len)}C${f(-w * 0.8)} ${f(-len * 0.8)} ${f(-w)} ${f(-len * 0.25)} 0 0Z`;
  let out = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})">`;
  if (opts.line) {
    out += `<path d="${d}" stroke="${C.gold}" stroke-opacity="${opts.opacity ?? 0.55}" stroke-width="1"/>`;
  } else {
    out += `<path d="${d}" fill="url(#leaf)" stroke="#5A2A35" stroke-opacity=".5" stroke-width=".8"/>`;
  }
  out += `<path d="M0 ${f(-len * 0.05)}Q${f(w * 0.12)} ${f(-len * 0.5)} 0 ${f(-len * 0.95)}" stroke="${C.gold}" stroke-opacity="${opts.line ? 0.45 : 0.35}" stroke-width=".7"/>`;
  return out + `</g>`;
}

function bud(x, y, r, angle, palette = "crimson") {
  return (
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})">` +
    `<path d="M0 0C${f(r * 0.9)} ${f(-r * 0.4)} ${f(r * 0.6)} ${f(-r * 1.7)} 0 ${f(-r * 2)}C${f(-r * 0.6)} ${f(-r * 1.7)} ${f(-r * 0.9)} ${f(-r * 0.4)} 0 0Z" fill="url(#p-${palette})" stroke="#0B0507" stroke-opacity=".5" stroke-width=".7"/>` +
    `<path d="M0 0C${f(r * 0.6)} ${f(-r * 0.2)} ${f(r * 0.7)} ${f(-r * 0.8)} ${f(r * 0.3)} ${f(-r * 1.1)}M0 0C${f(-r * 0.6)} ${f(-r * 0.2)} ${f(-r * 0.7)} ${f(-r * 0.8)} ${f(-r * 0.3)} ${f(-r * 1.1)}" stroke="#2A121A" stroke-width="1.6" stroke-linecap="round"/>` +
    `</g>`
  );
}

/** `lite` draws the stamens as dots only (fewer elements, for the many small side sprigs). */
function sakura(x, y, r, angle, seed, opacity = 1, lite = false) {
  const R = rng(seed);
  let out = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})" opacity="${opacity}">`;
  for (let i = 0; i < 5; i++) {
    const s = 0.9 + R() * 0.2;
    const l = r * s;
    out += `<path d="M0 0C${f(l * 0.62)} ${f(-l * 0.22)} ${f(l * 0.6)} ${f(-l * 0.88)} ${f(l * 0.2)} ${f(-l)}L0 ${f(-l * 0.84)}L${f(-l * 0.2)} ${f(-l)}C${f(-l * 0.6)} ${f(-l * 0.88)} ${f(-l * 0.62)} ${f(-l * 0.22)} 0 0Z" transform="rotate(${i * 72})" fill="url(#sakura)" stroke="#5C1029" stroke-opacity=".35" stroke-width=".6"/>`;
  }
  out += `<circle r="${f(r * 0.22)}" fill="${C.crimson}"/>`;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + R();
    const sl = r * (0.38 + R() * 0.12);
    if (lite && i % 2) continue;
    if (!lite) out += `<line x1="0" y1="0" x2="${f(Math.cos(a) * sl)}" y2="${f(Math.sin(a) * sl)}" stroke="${C.gold}" stroke-width=".7" stroke-opacity=".8"/>`;
    out += `<circle cx="${f(Math.cos(a) * sl)}" cy="${f(Math.sin(a) * sl)}" r="${f(r * 0.05 + 0.6)}" fill="${C.gold}"/>`;
  }
  return out + `</g>`;
}

function petal(x, y, s, angle, opacity = 0.85) {
  return `<path d="M0 0C${f(s * 0.7)} ${f(-s * 0.3)} ${f(s * 0.6)} ${f(-s)} ${f(s * 0.15)} ${f(-s * 1.1)}L0 ${f(-s * 0.95)}L${f(-s * 0.15)} ${f(-s * 1.1)}C${f(-s * 0.6)} ${f(-s)} ${f(-s * 0.7)} ${f(-s * 0.3)} 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})" fill="url(#sakura)" opacity="${opacity}"/>`;
}

/**
 * Recursive organic branch (stroked bezier segments that taper).
 * `rec`, when given, records each segment and how far along the branch it
 * starts and ends (for the growing hero branch); it never touches the RNG, so
 * the artwork is identical with or without it.
 */
function branch(x, y, angle, len, width, depth, R, blossoms, color = "#1A0B10", rec = null, dist = 0) {
  if (depth === 0 || len < 8) return "";
  const rad = (angle * Math.PI) / 180;
  const bend = (R() - 0.5) * 40;
  const mx = x + Math.cos(rad + (bend * Math.PI) / 360) * len * 0.5;
  const my = y + Math.sin(rad + (bend * Math.PI) / 360) * len * 0.5;
  const ex = x + Math.cos(rad) * len;
  const ey = y + Math.sin(rad) * len;
  const d = `M${f(x)} ${f(y)}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
  const hd = `M${f(x)} ${f(y - width * 0.25)}Q${f(mx)} ${f(my - width * 0.25)} ${f(ex)} ${f(ey - width * 0.25)}`;
  const hw = f(Math.max(0.6, width * 0.22));
  let out = `<path d="${d}" stroke="${color}" stroke-width="${f(width)}" stroke-linecap="round"/>`;
  out += `<path d="${hd}" stroke="#4A2530" stroke-opacity=".55" stroke-width="${hw}" stroke-linecap="round"/>`;
  rec?.segments.push({ d, hd, w: f(width), hw, color, from: f(dist), to: f(dist + len) });
  if (depth <= 2 || R() > 0.55) blossoms.push([ex, ey, depth, dist + len]);
  const kids = depth > 3 ? 2 : 1 + (R() > 0.4 ? 1 : 0);
  for (let i = 0; i < kids; i++) {
    const na = angle + (i === 0 ? -1 : 1) * (14 + R() * 26) + (R() - 0.5) * 10;
    out += branch(ex, ey, na, len * (0.62 + R() * 0.16), width * 0.66, depth - 1, R, blossoms, color, rec, dist + len);
  }
  return out;
}

function sakuraTree(x, y, angle, len, width, depth, seed, blossomScale = 1, color, rec = null, lite = false) {
  const R = rng(seed);
  const blossoms = [];
  const out = branch(x, y, angle, len, width, depth, R, blossoms, color, rec);
  return out + blossomsAt(blossoms, R, blossomScale, rec, lite);
}

/** Sakura (and the odd bud) clustered around each branch tip. */
function blossomsAt(blossoms, R, blossomScale, rec, lite) {
  let out = "";
  for (const [bx, by, d, at] of blossoms) {
    const n = d <= 1 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const ox = bx + (R() - 0.5) * 34 * blossomScale;
      const oy = by + (R() - 0.5) * 30 * blossomScale;
      const markup =
        R() > 0.82
          ? bud(ox, oy, 4 * blossomScale, R() * 360, "blush")
          : sakura(ox, oy, (8 + R() * 8) * blossomScale, R() * 72, Math.floor(R() * 1e6), 0.85 + R() * 0.15, lite);
      out += markup;
      rec?.blossoms.push({ markup, at: f(at) });
    }
  }
  return out;
}

function fillerSpray(x, y, angle, len, R, color = C.gold) {
  let out = `<path d="M${f(x)} ${f(y)}q${f(Math.cos((angle * Math.PI) / 180) * len * 0.5 + 6)} ${f(Math.sin((angle * Math.PI) / 180) * len * 0.5 - 6)} ${f(Math.cos((angle * Math.PI) / 180) * len)} ${f(Math.sin((angle * Math.PI) / 180) * len)}" stroke="${color}" stroke-opacity=".45" stroke-width=".8"/>`;
  for (let i = 0; i < 9; i++) {
    const t = 0.3 + (i / 9) * 0.75;
    const px = x + Math.cos((angle * Math.PI) / 180) * len * t + (R() - 0.5) * 14;
    const py = y + Math.sin((angle * Math.PI) / 180) * len * t + (R() - 0.5) * 14;
    out += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(1.2 + R() * 1.8)}" fill="${color}" opacity="${f(0.45 + R() * 0.4)}"/>`;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Decorative illustrations                                            */
/* ------------------------------------------------------------------ */

function floralCorner() {
  const W = 640;
  const H = 640;
  const R = rng(11);
  let b = "";
  // stems / gold line work
  b += `<path d="M-20 40C120 70 250 170 330 330C380 430 420 520 520 600" stroke="${C.gold}" stroke-opacity=".35" stroke-width="1.1"/>`;
  b += `<path d="M30 -20C70 120 120 220 210 300" stroke="${C.gold}" stroke-opacity=".25" stroke-width=".9"/>`;
  b += fillerSpray(170, 170, 40, 260, R);
  b += fillerSpray(130, 220, 75, 200, R, C.rose);
  b += fillerSpray(260, 100, 10, 220, R);
  // leaves behind the blooms
  const leaves = [
    [230, 250, 120, 140], [300, 180, 110, 100], [110, 320, 130, 190], [360, 120, 90, 70],
    [60, 260, 100, 210], [260, 330, 95, 160], [400, 260, 80, 120], [160, 390, 80, 200],
  ];
  for (const [x, y, l, a] of leaves) b += leaf(x, y, l, a);
  b += leaf(340, 330, 90, 135, { line: true });
  b += leaf(120, 430, 80, 190, { line: true });
  b += leaf(450, 170, 70, 95, { line: true });
  // sakura sprig
  b += sakuraTree(420, 60, 20, 90, 4, 3, 21, 0.9, "#22121A");
  // blooms
  b += bloom(150, 140, 112, "crimson", 1);
  b += bloom(310, 70, 78, "wine", 2);
  b += bloom(70, 330, 70, "blush", 3, { rings: 3 });
  b += bloom(270, 230, 48, "ivory", 4, { rings: 3 });
  b += bloom(30, 40, 60, "wine", 5, { rings: 3 });
  b += bud(380, 210, 13, 120);
  b += bud(200, 330, 11, 170, "blush");
  b += bud(420, 160, 9, 80, "wine");
  for (let i = 0; i < 6; i++) b += petal(300 + R() * 260, 260 + R() * 320, 10 + R() * 6, R() * 360, 0.6);
  return svg(W, H, commonDefs(), b);
}

function floralGarland() {
  const W = 1400;
  const H = 360;
  const R = rng(31);
  let b = "";
  b += `<path d="M40 210C300 150 500 260 700 200C900 140 1100 250 1360 190" stroke="${C.gold}" stroke-opacity=".35" stroke-width="1"/>`;
  b += `<path d="M120 230C380 200 560 290 700 240C860 190 1040 280 1280 230" stroke="${C.gold}" stroke-opacity=".2" stroke-width=".8"/>`;
  for (let i = 0; i < 14; i++) {
    const side = i % 2 ? 1 : -1;
    const x = 700 + side * (60 + R() * 520);
    b += leaf(x, 200 + (R() - 0.5) * 60, 60 + R() * 60, side * (60 + R() * 60) + (R() - 0.5) * 40, { line: R() > 0.6 });
  }
  b += fillerSpray(700, 200, 200, 380, R);
  b += fillerSpray(700, 200, -20, 380, R);
  b += fillerSpray(700, 210, 170, 300, R, C.rose);
  b += fillerSpray(700, 210, 10, 300, R, C.rose);
  b += sakuraTree(560, 210, 195, 120, 4, 3, 41, 0.8, "#22121A");
  b += sakuraTree(840, 210, -15, 120, 4, 3, 42, 0.8, "#22121A");
  b += bloom(620, 200, 66, "wine", 32, { rings: 3 });
  b += bloom(780, 205, 70, "blush", 33, { rings: 3 });
  b += bloom(700, 180, 92, "crimson", 34);
  b += bloom(700, 262, 40, "ivory", 35, { rings: 3 });
  b += bud(520, 230, 10, -110);
  b += bud(880, 230, 10, 110, "blush");
  return svg(W, H, commonDefs(), b);
}

function sakuraBranch(rec = null) {
  const W = 900;
  const H = 560;
  let b = sakuraTree(920, 80, 165, 260, 14, 6, 51, 1.15, undefined, rec);
  const R = rng(52);
  for (let i = 0; i < 10; i++) {
    const markup = petal(80 + R() * 700, 200 + R() * 340, 9 + R() * 7, R() * 360, 0.55 + R() * 0.3);
    b += markup;
    rec?.petals.push(markup);
  }
  return svg(W, H, commonDefs(), b);
}

/**
 * The hero's sakura branch as data, so the site can grow it on scroll:
 * branch segments (with where along the branch each starts and ends) and
 * blossoms (with when the branch reaches them). Ids are prefixed to stay
 * unique when inlined into the page.
 */
const prefixUrls = (m) => m.replace(/url\(#/g, "url(#sb-");
/** Only the gradients the sakura and buds use, ids prefixed for inlining. */
const sakuraDefs = () =>
  (
    petalDefs() +
    `<linearGradient id="sakura" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#8E5A66"/><stop offset=".6" stop-color="#D3A9AF"/><stop offset="1" stop-color="#F4E2E0"/></linearGradient>`
  ).replace(/id="/g, 'id="sb-');

function sakuraBranchData() {
  const rec = { segments: [], blossoms: [], petals: [] };
  sakuraBranch(rec);
  const length = Math.max(...rec.segments.map((s) => s.to));
  return (
    JSON.stringify({
      viewBox: [0, 0, 900, 560],
      length,
      defs: sakuraDefs(),
      segments: rec.segments,
      blossoms: rec.blossoms.map((b) => ({ ...b, markup: prefixUrls(b.markup) })),
      petals: rec.petals.map(prefixUrls),
    }) + "\n"
  );
}

/**
 * A long, low sakura vine: a gently wavering stem running in from the left
 * edge, with short twigs alternating up and down and blossoms along it. Low
 * enough to sit in the empty padding between two sections on a phone.
 */
function sakuraVine(seed) {
  const R = rng(seed);
  const rec = { segments: [], blossoms: [], petals: [] };
  const blossoms = [];
  const color = "#2A1620";
  let x = -10;
  let y = 70;
  let angle = -3;
  let width = 6.5;
  let dist = 0;
  for (let i = 0; i < 7; i++) {
    const len = 58 + R() * 18;
    const rad = (angle * Math.PI) / 180;
    const bend = (R() - 0.5) * 30;
    const mx = x + Math.cos(rad + (bend * Math.PI) / 360) * len * 0.5;
    const my = y + Math.sin(rad + (bend * Math.PI) / 360) * len * 0.5;
    const ex = x + Math.cos(rad) * len;
    const ey = y + Math.sin(rad) * len;
    const d = `M${f(x)} ${f(y)}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
    const hd = `M${f(x)} ${f(y - width * 0.25)}Q${f(mx)} ${f(my - width * 0.25)} ${f(ex)} ${f(ey - width * 0.25)}`;
    const hw = f(Math.max(0.6, width * 0.22));
    rec.segments.push({ d, hd, w: f(width), hw, color, from: f(dist), to: f(dist + len) });
    dist += len;
    // a short twig, alternately up and down, flattened so the vine stays low
    const up = i % 2 ? 1 : -1;
    branch(ex, ey, angle + up * (22 + R() * 18), 24 + R() * 14, width * 0.55, 2, R, blossoms, color, rec, dist);
    if (R() > 0.35) blossoms.push([ex, ey, 1, dist]);
    x = ex;
    y = ey;
    width *= 0.9;
    angle = Math.max(-9, Math.min(9, angle + (R() - 0.5) * 14 - (y - 70) * 0.25));
  }
  // Only the recorded data is used (the site draws the vine itself).
  blossomsAt(blossoms, R, 0.9, rec, true);
  const xs = [];
  const ys = [];
  for (const sg of rec.segments) {
    const n = sg.d.match(/-?\d+(\.\d+)?/g).map(Number);
    for (let i = 0; i < n.length; i += 2) {
      xs.push(n[i]);
      ys.push(n[i + 1]);
    }
  }
  const pad = 24;
  const y0 = Math.floor(Math.min(...ys) - pad);
  return {
    viewBox: [0, y0, Math.ceil(Math.max(...xs) + pad), Math.ceil(Math.max(...ys) + pad) - y0],
    length: dist,
    segments: rec.segments,
    blossoms: rec.blossoms.map((b) => ({ ...b, markup: prefixUrls(b.markup) })),
    petals: [],
  };
}

/**
 * Small sakura sprigs that grow in from the left edge of a section as the
 * guest scrolls (mirrored on the right). Lighter than the hero branch so
 * several can sit on one page, even on phones.
 */
function sakuraSprigsData() {
  const fitted = (seed, angle, len, width, depth, scale) => {
    const rec = { segments: [], blossoms: [], petals: [] };
    sakuraTree(-10, 220, angle, len, width, depth, seed, scale, "#2A1620", rec, true);
    // Fit the viewBox to what was drawn (blossoms reach ~20px past their twig).
    const xs = [];
    const ys = [];
    for (const sg of rec.segments) {
      const n = sg.d.match(/-?\d+(\.\d+)?/g).map(Number);
      for (let i = 0; i < n.length; i += 2) {
      xs.push(n[i]);
      ys.push(n[i + 1]);
    }
    }
    const pad = 32;
    const x0 = 0;
    const y0 = Math.floor(Math.min(...ys) - pad);
    const x1 = Math.ceil(Math.max(...xs) + pad);
    const y1 = Math.ceil(Math.max(...ys) + pad);
    return {
      viewBox: [x0, y0, x1 - x0, y1 - y0],
      length: Math.max(...rec.segments.map((sg) => sg.to)),
      segments: rec.segments,
      blossoms: rec.blossoms.map((b) => ({ ...b, markup: prefixUrls(b.markup) })),
      petals: [],
    };
  };
  const variants = [
    { seed: 71, angle: -24, len: 150, width: 8 },
    { seed: 74, angle: -6, len: 160, width: 8 },
    { seed: 77, angle: 14, len: 140, width: 7 },
  ].map(({ seed, angle, len, width }) => fitted(seed, angle, len, width, 5, 1));
  // Long, low vines for the gaps between sections on phones.
  const vines = [91, 94].map((seed) => sakuraVine(seed));
  return JSON.stringify({ defs: sakuraDefs(), variants, vines }) + "\n";
}

function floralSpray() {
  // tall vertical cascade for hero flanks
  const W = 420;
  const H = 980;
  const R = rng(61);
  let b = "";
  b += `<path d="M300 -10C250 200 330 380 230 560C160 690 200 850 140 990" stroke="${C.gold}" stroke-opacity=".3" stroke-width="1"/>`;
  b += fillerSpray(250, 300, 120, 260, R);
  b += fillerSpray(230, 560, 110, 300, R, C.rose);
  const leaves = [
    [300, 160, 120, 210], [230, 260, 110, 150], [340, 420, 110, 240], [190, 470, 120, 140],
    [280, 640, 100, 220], [160, 720, 110, 150], [240, 860, 90, 200],
  ];
  for (const [x, y, l, a] of leaves) b += leaf(x, y, l, a);
  b += leaf(360, 300, 80, 250, { line: true });
  b += leaf(130, 600, 80, 130, { line: true });
  b += bloom(300, 80, 96, "crimson", 62);
  b += bloom(250, 360, 80, "wine", 63);
  b += bloom(330, 560, 56, "blush", 64, { rings: 3 });
  b += bloom(210, 700, 70, "crimson", 65);
  b += bloom(170, 880, 52, "ivory", 66, { rings: 3 });
  b += bud(160, 300, 12, -40);
  b += bud(360, 760, 11, 30, "blush");
  b += sakuraTree(320, 470, 20, 80, 3, 3, 67, 0.8, "#22121A");
  return svg(W, H, commonDefs(), b);
}

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */

const files = {
  [join(ILLU, "floral-corner.svg")]: floralCorner(),
  [join(ILLU, "floral-garland.svg")]: floralGarland(),
  [join(ILLU, "sakura-branch.svg")]: sakuraBranch(),
  [join(ILLU, "floral-spray.svg")]: floralSpray(),
  [join(root, "src", "components", "art", "sakura-branch.json")]: sakuraBranchData(),
  [join(root, "src", "components", "art", "sakura-sprigs.json")]: sakuraSprigsData(),
};
for (const [p, content] of Object.entries(files)) {
  writeFileSync(p, content);
  console.log(`${(content.length / 1024).toFixed(1).padStart(6)} KB  ${p.replace(root + "/", "")}`);
}
