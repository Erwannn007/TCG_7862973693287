// Décors en pixel art dessinés en code : donjon (camp), prairie, crypte, volcan.
// Lumière « par paliers » : chaque surface a 4 teintes, choisies selon la distance aux
// sources de lumière (torches, feu, lave), avec un tramage aux frontières. Aucun dégradé doux.
import { OUTLINE } from './spr.js';

export const SW = 240, SH = 120; // taille d'un décor en pixels d'art
export const CAMP_W = 300;

const WALL = ['#21171d', '#33242a', '#4c3335', '#6e4639'];
const MORTAR = ['#140d11', '#1c1217', '#28191b', '#382320'];
const FLOOR = ['#1d1517', '#2b2023', '#40302d', '#5c4032'];
const FLOOR_LINE = ['#120c0e', '#1a1214', '#261b1b', '#352520'];

const hash = (x, y) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function px(g, x, y, c) {
  g.fillStyle = c;
  g.fillRect(x, y, 1, 1);
}

// Niveau de lumière 0..3 d'un point, avec tramage ordonné aux bords des halos.
function light(lights, x, y) {
  let lv = 0;
  for (const l of lights) {
    const d = Math.hypot((x - l.x) * 0.9, y - l.y);
    for (let i = 0; i < l.r.length; i++) {
      const edge = d - l.r[i];
      const lit = edge < 0 || (edge < 2 && (x + y) % 2 === 0);
      if (lit) lv = Math.max(lv, 3 - i);
    }
  }
  return lv;
}

const MOSS = ['#1e2a1c', '#27361f', '#324626', '#3e582c'];
// Mur de briques éclairé par paliers : grain de la pierre, briques fêlées ou plus sombres,
// mousse qui monte du sol, ombre tramée au pied du mur. x0 < 0 : déborde à gauche (marge des plans).
function bricks(g, y0, y1, lights, w = SW, x0 = 0) {
  for (let y = y0; y < y1; y++) {
    const row = Math.floor((y - y0) / 7), off = row % 2 ? 6 : 0;
    for (let x = x0; x < w; x++) {
      const lv = light(lights, x, y);
      const bx = (((x + off) % 12) + 12) % 12, by = (y - y0) % 7;
      if (bx === 0 || by === 0) { px(g, x, y, MORTAR[lv]); continue; }
      const id = Math.floor((x + off) / 12) * 31 + row;
      let c = lv;
      if (hash(id, 7) < 0.25 && c > 0) c--;
      if (by === 1 && c < 3) c++;
      if (by === 6 && c > 0) c--;
      if (hash(x, y * 3) < 0.07 && c > 0) c--; // grain
      // brique fêlée : un trait en diagonale
      if (hash(id, 9) < 0.08 && bx - by === 3) { px(g, x, y, MORTAR[lv]); continue; }
      // ombre tramée au pied du mur
      if (y > y1 - 6 && (x + y) % 2 && c > 0) c--;
      // mousse dans les rangées du bas
      if (y > y1 - 14 && noise2(x / 7, y / 3 + 9) > 0.72 - (y - (y1 - 14)) * 0.01 && noise2(x / 23, 4) > 0.45) { px(g, x, y, MOSS[lv]); continue; }
      px(g, x, y, WALL[c]);
    }
  }
}

// Plafond : poutre de bois sombre en haut, pénombre tramée dessous.
function ceiling(g, w, x0 = 0) {
  for (let x = x0; x < w; x++) {
    for (let y = 0; y < 4; y++) px(g, x, y, y === 3 ? '#140d11' : y === 0 ? '#3a2618' : (x + y) % 7 ? '#2a1a12' : '#3a2618');
    for (let y = 4; y < 10; y++) if ((x + y) % 2 === 0 && y < 4 + ((x * 7) % 3) + 4) px(g, x, y, '#140d11');
  }
}

// Dallage éclairé par paliers : grain, dalles fêlées, reflet clair sur le bord haut de chaque dalle.
function flags(g, y0, y1, lights, w = SW, x0 = 0) {
  for (let y = y0; y < y1; y++) {
    const row = Math.floor((y - y0) / 8), off = row % 2 ? 9 : 0;
    for (let x = x0; x < w; x++) {
      const lv = light(lights, x, y);
      const bx = (((x + off) % 18) + 18) % 18, by = (y - y0) % 8, tile = Math.floor((x + off) / 18) * 13 + row;
      if (bx === 0 || by === 0) { px(g, x, y, FLOOR_LINE[lv]); continue; }
      let c = hash(tile, row) < 0.2 && lv > 0 ? lv - 1 : lv;
      if (by === 1 && c < 3 && lv > 1) c++;
      if (hash(x * 3, y) < 0.06 && c > 0) c--;
      if (hash(tile, 5) < 0.12 && (bx + by * 2) % 9 === 0) { px(g, x, y, FLOOR_LINE[lv]); continue; }
      px(g, x, y, FLOOR[c]);
    }
  }
}

// Paille et poussière au pied des murs, et une flaque qui reflète la lumière.
function floorDetails(g, w, x0, puddle) {
  // paille en touffes éparses (là où le bruit le permet), brins en biais
  for (let i = 0; i < (w - x0) * 0.6; i++) {
    const x = x0 + Math.floor(hash(i, 201) * (w - x0)), y = 74 + Math.floor(hash(i, 202) * 9);
    if (noise2(x / 14, 3) < 0.58) continue;
    const c = hash(i, 203) < 0.5 ? '#8a6a3a' : '#a8844a';
    px(g, x, y, c);
    px(g, x + (hash(i, 204) < 0.5 ? 1 : -1), y - 1, c);
    if (hash(i, 205) < 0.3) px(g, x + 2, y, '#6a5030');
  }
  if (puddle) {
    const [cx, cy, rx] = puddle;
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -rx; dx <= rx; dx++) {
        const d = (dx / rx) ** 2 + (dy / 2.6) ** 2;
        if (d > 1) continue;
        px(g, cx + dx, cy + dy, d > 0.6 ? '#1a1418' : dy < 0 && dx < 0 && (dx + dy) % 3 === 0 ? '#6a5a6a' : '#241c24');
      }
  }
}

// ---------------------------------------------------------------- éléments animés

const FLAME = [
  ['..y..', '.yoy.', '.ooo.', 'orrro', '.rrr.'],
  ['.y...', '.yy..', '.ooo.', 'oorro', '.rrr.'],
  ['...y.', '..yy.', '.ooo.', 'orroo', '.rrr.'],
];
const FCOL = { y: '#fbe08a', o: '#ffb030', r: '#e2552a' };

function flame(g, cx, by, frame, big = false) {
  const f = FLAME[frame % 3], k = big ? 2 : 1;
  f.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === '.') return;
    g.fillStyle = FCOL[ch];
    g.fillRect(cx - 2 * k + i * k, by - (f.length - j) * k, k, k);
  }));
}

function torch(g, x, y, step) {
  g.fillStyle = OUTLINE;
  g.fillRect(x - 2, y - 1, 5, 6);
  g.fillStyle = '#5a5258';
  g.fillRect(x - 1, y + 3, 3, 1);
  g.fillStyle = '#6a4428';
  g.fillRect(x, y, 1, 4);
  g.fillStyle = '#8a8478';
  g.fillRect(x - 1, y, 3, 1);
  flame(g, x, y, step);
}

function campfire(g, x, y, step) {
  // pierres
  for (const [dx, c] of [[-8, '#6a6068'], [-5, '#8a8088'], [5, '#6a6068'], [8, '#8a8088']]) {
    g.fillStyle = OUTLINE;
    g.fillRect(x + dx - 2, y - 2, 5, 4);
    g.fillStyle = c;
    g.fillRect(x + dx - 1, y - 1, 3, 2);
  }
  // bûches croisées
  g.fillStyle = OUTLINE;
  g.fillRect(x - 6, y - 4, 13, 4);
  g.fillStyle = '#7a5030';
  g.fillRect(x - 5, y - 3, 11, 2);
  g.fillStyle = '#a8703a';
  g.fillRect(x - 5, y - 3, 11, 1);
  flame(g, x, y - 3, step, true);
  // étincelles qui montent par paliers
  for (let i = 0; i < 3; i++) {
    const t = (step + i * 3) % 9;
    px(g, x - 3 + i * 3 + (t % 2), y - 14 - t * 2, t < 6 ? '#fbe08a' : '#ffb030');
  }
}

// ---------------------------------------------------------------- décors

function dungeon(g, opts) {
  dungeonWall(g, opts);
  dungeonFloor(g, opts);
}

// Le mur du fond : briques, plafond, plinthe, piliers, porte. opts.x0 < 0 : déborde dans la marge.
function dungeonWall(g, opts) {
  const lights = opts.lights, w = opts.w || SW, x0 = opts.x0 || 0;
  bricks(g, 0, 72, lights, w, x0);
  if (opts.ceiling) ceiling(g, w, x0);
  g.fillStyle = '#140d11';
  g.fillRect(x0, 72, w - x0, 2);
  for (const p of opts.pillars || []) pillar(g, p, lights);
  if (opts.gate) gate(g, opts.gate);
}

function dungeonFloor(g, opts) {
  const w = opts.w || SW, x0 = opts.x0 || 0;
  flags(g, 74, opts.h || SH, opts.lights, w, x0);
  if (opts.details) floorDetails(g, w, x0, opts.puddle);
}

function pillar(g, x, lights) {
  for (let y = 0; y < 74; y++) {
    const lv = light(lights, x + 4, y);
    for (let i = 0; i < 9; i++) {
      let c = WALL[Math.min(3, lv + (i < 2 ? 1 : 0))];
      if (i === 0 || i === 8) c = MORTAR[lv];
      if (i > 6 && lv > 0) c = WALL[lv - 1];
      px(g, x + i, y, c);
    }
    if (y % 14 === 0) { g.fillStyle = MORTAR[lv]; g.fillRect(x, y, 9, 1); }
  }
}

// Porte du donjon en arche, qui mène vers les étapes.
function gate(g, { x, w }) {
  const top = 22, bottom = 74;
  for (let y = top - 4; y < bottom; y++) {
    for (let i = -3; i < w + 3; i++) {
      const cx = i - w / 2, arch = y - top < 0 ? Math.sqrt(Math.max(0, (w / 2 + 3) ** 2 - cx * cx)) : 99;
      const inside = i >= 0 && i < w && (y >= top || Math.abs(cx) < Math.sqrt(Math.max(0, (w / 2) ** 2 - (top - y) ** 2 * 4)));
      if (inside) px(g, x + i, y, y > bottom - 10 ? '#0e080b' : '#120a0e');
      else if (arch !== 99 && Math.abs(cx) < w / 2 + 3 && top - y < (w / 2 + 3) / 2) px(g, x + i, y, '#6a5a5e');
    }
  }
  // grille de herse levée
  for (let i = 3; i < w; i += 5) {
    g.fillStyle = '#3a3036';
    g.fillRect(x + i, top - 2, 1, 8);
  }
  g.fillStyle = '#3a3036';
  g.fillRect(x, top + 5, w, 1);
  // marches
  g.fillStyle = '#4a3a3a';
  g.fillRect(x - 2, bottom, w + 4, 2);
  g.fillStyle = '#5c4640';
  g.fillRect(x - 4, bottom + 2, w + 8, 2);
}

// ---------------------------------------------------------------- outils de peinture

function dither(g, y, w, a, b) {
  for (let x = 0; x < w; x++) px(g, x, y, (x + y) % 2 ? a : b);
}

function disc(g, cx, cy, r, c) {
  g.fillStyle = c;
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy));
    g.fillRect(cx - half, cy + dy, half * 2 + 1, 1);
  }
}

// Remplit un masque de pixels avec reflet en haut et ombre en bas (nuages, feuillages…).
function blob(g, cells, body, top, bottom) {
  const has = (x, y) => cells.has(x + ',' + y);
  for (const k of cells) {
    const [x, y] = k.split(',').map(Number);
    px(g, x, y, !has(x, y + 1) ? bottom : !has(x, y - 1) ? top : body);
  }
}
function circleCells(cells, cx, cy, r, maxY = Infinity) {
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy) + 0.3);
    for (let dx = -half; dx <= half; dx++) if (cy + dy <= maxY) cells.add(cx + dx + ',' + (cy + dy));
  }
}

// ---------------------------------------------------------------- prairie
// Trois couches : le ciel (dessiné à part, avec nuages et oiseaux qui bougent), le décor fixe
// (montagnes → château → collines → forêt → champ), puis les petites animations par-dessus.

const P_SKY = ['#2e4fa8', '#3a5eb6', '#466cc0', '#547bc8', '#6290d2', '#74a2da', '#8ab4e2', '#a2c4e6', '#bcd4e8', '#d6e2e4'];
const GRASS = ['#3f7a32', '#4e8c3a', '#5e9e44', '#70b04e', '#86c25c'];
const P_SUN = (w) => [w - 44, 16];
const backHill = (x) => Math.round(60 - (6 + 4 * Math.sin(x / 23) + 2 * Math.sin(x / 9 + 1)));
const frontHill = (x) => Math.round(64 - (3 + 2.5 * Math.sin(x / 15 + 3) + 1.5 * Math.sin(x / 6)));
const castleX = (w) => Math.round(w * 0.3);

function cloud(g, x, y, s) {
  const cells = new Set();
  for (const [dx, dy, r] of [[0, 0, 4], [6, -3, 5], [13, -1, 4], [-6, 1, 3], [19, 1, 3]]) {
    circleCells(cells, x + Math.round(dx * s), y + Math.round(dy * s), Math.max(2, Math.round(r * s)), y + 3);
  }
  blob(g, cells, '#eef4fc', '#ffffff', '#c4d4ee');
  // ventre ombré, tramé
  for (const k of cells) {
    const [cx, cy] = k.split(',').map(Number);
    if (cy >= y + 1 && (cx + cy) % 2 === 0 && cells.has(cx + ',' + (cy + 1))) px(g, cx, cy, '#d6e2f4');
  }
}

function prairieSky(g, w) {
  P_SKY.forEach((c, i) => {
    g.fillStyle = c;
    g.fillRect(0, i * 6, w, 6);
    if (i) dither(g, i * 6, w, c, P_SKY[i - 1]);
  });
  const [sx, sy] = P_SUN(w);
  // halo tramé en deux anneaux autour du soleil
  for (let y = 0; y < 44; y++)
    for (let x = sx - 30; x < sx + 30; x++) {
      const d = Math.hypot(x - sx, y - sy);
      if (d < 12 && (x + y) % 2 === 0) px(g, x, y, '#cfe0f2');
      else if (d < 18 && (x + 3 * y) % 5 === 0) px(g, x, y, '#a8c6ea');
    }
  // rais de lumière obliques qui descendent vers la gauche
  g.fillStyle = '#ffffff';
  g.globalAlpha = 0.16;
  for (const [a, wd] of [[2.45, 0.05], [2.7, 0.035], [2.95, 0.05], [3.25, 0.03]]) {
    for (let y = 0; y < 60; y++)
      for (let x = 0; x < sx; x++) {
        const d = Math.hypot(x - sx, y - sy), th = Math.atan2(y - sy, x - sx);
        if (d > 14 && Math.abs(th - a) < wd * (1 + d / 120) && (x + 2 * y) % 3 === 0) g.fillRect(x, y, 1, 1);
      }
  }
  g.globalAlpha = 1;
  disc(g, sx, sy, 9, '#fff0b0');
  disc(g, sx, sy, 7, '#fff8dc');
  disc(g, sx - 1, sy - 1, 4, '#ffffff');
}

// Montagnes avec arêtes obliques, neige déchiquetée et brume au pied.
function mountains(g, w, base, peaks, pal) {
  for (let x = 0; x < w; x++) {
    let h = 0, dom = null;
    for (const p of peaks) {
      const v = p.h - Math.abs(x - p.x) * p.s;
      if (v > h) { h = v; dom = p; }
    }
    if (!dom) continue;
    const top = Math.round(base - h), lit = x < dom.x;
    const snow = base - dom.h + 5 + Math.floor(hash(x, 7) * 3) + (Math.abs(x - dom.x) % 4 === 0 ? 2 : 0);
    for (let y = top; y < base; y++) {
      let c = lit ? pal.lit : pal.dark;
      if (y > top + 2 && (x + (lit ? y : -y) + 99) % 11 === 0) c = lit ? pal.dark : pal.mid;
      if (dom.h > pal.snowAt && y < snow) c = lit ? pal.snow : pal.snowDark;
      if (y === top && lit) c = pal.edge;
      if (y >= base - 2 || (y >= base - 5 && (x + y) % 2 === 0)) c = pal.haze;
      px(g, x, y, c);
    }
  }
}

// Château lointain sur la colline, bleui par la distance.
function castle(g, cx, base) {
  const C = { wall: '#8c92c0', lit: '#a8aed4', dark: '#70789e', roof: '#7a5a8a', win: '#4a4c74' };
  const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  rect(cx - 9, base - 12, 18, 14, C.wall);
  rect(cx - 9, base - 12, 6, 14, C.lit);
  rect(cx + 5, base - 12, 4, 14, C.dark);
  for (let i = 0; i < 9; i++) if (i % 2 === 0) rect(cx - 9 + i * 2, base - 14, 2, 2, C.wall);
  // donjon et tours à toit pointu
  for (const [tx, th, tw] of [[cx - 13, 20, 5], [cx + 9, 18, 5], [cx - 2, 25, 6]]) {
    rect(tx, base - th, tw, th + 2, C.wall);
    rect(tx, base - th, 2, th + 2, C.lit);
    rect(tx + tw - 1, base - th, 1, th + 2, C.dark);
    for (let j = 0; j <= tw >> 1; j++) rect(tx + j, base - th - 1 - j, tw - j * 2, 1, C.roof);
    rect(tx + (tw >> 1), base - th + 4, 1, 2, C.win);
  }
  rect(cx - 2, base - 4, 4, 6, C.win);
}

function pine(g, x, base, h, pal = ['#1c3626', '#3e7246', '#2c5a38', '#5a9058']) {
  for (let j = 0; j < h; j++) {
    const half = Math.floor(((j + 2) / h) * 4 * (j % 3 === 2 ? 0.8 : 1));
    const y = base - h + j;
    px(g, x - half - 1, y, pal[0]);
    for (let i = -half; i <= half; i++) px(g, x + i, y, i < 0 ? pal[1] : pal[2]);
    if (j % 3 === 0 && half > 0) px(g, x - half, y, pal[3]);
    px(g, x + half + 1, y, pal[0]);
  }
  px(g, x, base - h - 1, pal[0]);
}

function roundTree(g, x, base, r) {
  const cells = new Set();
  circleCells(cells, x, base - r, r);
  circleCells(cells, x - r + 1, base - r + 2, r - 1);
  circleCells(cells, x + r - 1, base - r + 1, r - 1);
  blob(g, cells, '#356a3e', '#4e8a4a', '#24502e');
  for (const k of cells) {
    const [cx, cy] = k.split(',').map(Number);
    if (cx < x && cy < base - r && hash(cx, cy) < 0.3) px(g, cx, cy, '#629c58');
  }
}

// Buisson : masse de feuillage avec reflets (premier plan et coins).
function bush(g, x, y, r, pal) {
  const cells = new Set();
  circleCells(cells, x, y, r);
  circleCells(cells, x - r, y + 2, r - 2);
  circleCells(cells, x + r, y + 1, r - 1);
  blob(g, cells, pal[1], pal[2], pal[0]);
  for (const k of cells) {
    const [cx, cy] = k.split(',').map(Number);
    if (hash(cx, cy * 3) < 0.12) px(g, cx, cy, pal[2]);
    else if (hash(cx * 5, cy) < 0.1) px(g, cx, cy, pal[0]);
  }
}

// Bruit lissé (valeurs aléatoires sur une grille, interpolées) et matrice de tramage ordonné 4×4.
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((v) => v / 16));
function noise2(x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0 + 500), b = hash(x0 + 1, y0 + 500), c = hash(x0, y0 + 501), d = hash(x0 + 1, y0 + 501);
  return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
}

// Chaque plan est une image à part ; ils glissent à des vitesses différentes (parallaxe).
function prairieFar(g, w) {
  const far = [];
  for (let i = -1; i * 46 < w + 46; i++) far.push({ x: i * 46 + Math.floor(hash(i, 21) * 20), h: 18 + hash(i, 22) * 10, s: 0.7 + hash(i, 23) * 0.3 });
  mountains(g, w, 56, far, { lit: '#a2acd4', dark: '#9098c6', mid: '#9aa2cc', edge: '#b4bee0', snow: '#eef2fa', snowDark: '#d4dcee', snowAt: 23, haze: '#b8c8e2' });
}

function prairieMid(g, w) {
  const near = [];
  for (let i = -1; i * 58 < w + 58; i++) near.push({ x: i * 58 + 20 + Math.floor(hash(i, 31) * 24), h: 22 + hash(i, 32) * 12, s: 0.8 + hash(i, 33) * 0.4 });
  mountains(g, w, 58, near, { lit: '#7e82b8', dark: '#666aa0', mid: '#7276ac', edge: '#9094c4', snow: '#f4f6fc', snowDark: '#c8d0e8', snowAt: 28, haze: '#9ab0d0' });
  // collines : une rangée lointaine (avec le château), une plus proche
  const cxs = castleX(w);
  for (let x = 0; x < w; x++) {
    const top = backHill(x);
    for (let y = top; y < 66; y++) px(g, x, y, y === top ? '#a6cca0' : (x + y) % 2 && y > top + 3 ? '#7aa880' : '#88b68c');
  }
  castle(g, cxs, backHill(cxs) + 1);
}

function prairieForest(g, w) {
  for (let x = 0; x < w; x++) {
    const top = frontHill(x);
    for (let y = top; y < 66; y++) px(g, x, y, y === top ? '#86bc76' : y < top + 2 ? '#70a866' : '#62995c');
  }
  // forêt : une rangée de sapins bleutés au fond, puis la lisière
  for (let x = -2, i = 0; x < w + 4; i++) {
    pine(g, x, 64, 6 + Math.floor(hash(i, 47) * 4), ['#2a4a44', '#4a7464', '#3a6050', '#5a8670']);
    x += 4 + Math.floor(hash(i, 48) * 3);
  }
  for (let x = -4, i = 0; x < w + 6; i++) {
    const b = 67 + Math.floor(hash(i, 41) * 2);
    if (hash(i, 42) < 0.55) pine(g, x, b, 9 + Math.floor(hash(i, 43) * 6));
    else roundTree(g, x, b, 4 + Math.floor(hash(i, 44) * 2));
    x += 5 + Math.floor(hash(i, 45) * 4);
  }
}

function prairieGround(g, w, h) {
  // champ : herbe en taches douces (bruit lissé puis tramé), plus claire au loin, ombres de nuages
  for (let y = 67; y < h; y++)
    for (let x = 0; x < w; x++) {
      let lv = y < 74 ? 3 : y < 104 ? 2 : 1;
      const n = noise2(x / 14, y / 5) - 0.5 + (BAYER[y % 4][x % 4] - 0.5) * 0.18;
      if (n < -0.17) lv--;
      else if (n > 0.2) lv++;
      const shade = [[w * 0.2, 96, 34, 7], [w * 0.75, 80, 28, 5]].some(([cx, cy, rx, ry]) => {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        return d < 0.8 || (d < 1 && (x + y) % 2 === 0);
      });
      if (shade) lv--;
      px(g, x, y, GRASS[Math.max(0, Math.min(4, lv))]);
    }
  // ombre de la lisière sur l'herbe
  for (let x = 0; x < w; x++) {
    px(g, x, 67, '#2a4e30');
    if (x % 2) px(g, x, 68, '#3f7a32');
  }
  // chemin de terre en perspective, avec ornières et bords mangés par l'herbe
  const pathAt = (y) => ({ cx: Math.round(w / 2 + Math.sin((y - 66) / 14) * 6), hw: Math.round(3 + (y - 66) * 0.5) });
  for (let y = 68; y < h; y++) {
    const { cx, hw } = pathAt(y);
    g.fillStyle = '#b08c5e';
    g.fillRect(cx - hw, y, hw * 2, 1);
    if (hw > 6) {
      px(g, cx - (hw >> 1), y, '#94744c');
      px(g, cx + (hw >> 1), y, '#94744c');
    }
    px(g, cx - hw - 1, y, '#6e5236');
    px(g, cx + hw, y, '#86664a');
    if (hash(y, 3) < 0.5) px(g, cx - hw + (y % 2), y, GRASS[2]);
    if (hash(y, 4) < 0.5) px(g, cx + hw - 1 - (y % 2), y, GRASS[1]);
    if (y % 3 === 0) px(g, cx - hw + ((y * 7) % Math.max(1, hw * 2)), y, '#cfae7e');
  }
  for (let i = 0; i < 34; i++) {
    const y = 72 + Math.floor(hash(i, 51) * 46), { cx, hw } = pathAt(y);
    const x = cx - hw + 1 + Math.floor(hash(i, 52) * Math.max(1, hw * 2 - 2));
    px(g, x, y, '#dcc094');
    px(g, x + 1, y, '#86664a');
  }
  const onPath = (x, y) => { const { cx, hw } = pathAt(y); return x >= cx - hw - 2 && x <= cx + hw + 1; };
  // barrière de bois au loin, à gauche du chemin
  const fy = 74;
  for (let x = 6; x < w / 2 - 22; x++) {
    if ((x - 6) % 7 === 0) {
      g.fillStyle = '#3a2a1c';
      g.fillRect(x, fy - 6, 2, 7);
      px(g, x, fy - 6, '#8a6a48');
    } else {
      px(g, x, fy - 5, '#7a5a38');
      px(g, x, fy - 3, '#7a5a38');
      px(g, x, fy - 2, '#4a3624');
    }
  }
  // panneau au bord du chemin
  const sx = w / 2 + 14;
  g.fillStyle = '#3a2a1c';
  g.fillRect(sx, 66, 1, 7);
  g.fillRect(sx - 4, 64, 10, 4);
  g.fillStyle = '#a8784a';
  g.fillRect(sx - 3, 65, 8, 2);
  px(g, sx + 5, 65, '#a8784a');
  // touffes d'herbe (plus grandes devant), fleurs en bouquets, cailloux moussus
  for (let i = 0; i < w * 1.1; i++) {
    const x = Math.floor(hash(i, 61) * w), y = 70 + Math.floor(hash(i, 62) * 49);
    if (onPath(x, y)) continue;
    const big = y > 92;
    px(g, x, y, '#2f6428');
    px(g, x - 1, y - 1, '#7ec050');
    px(g, x + 1, y - 1, '#6aae46');
    if (big) { px(g, x, y - 2, '#9ad060'); px(g, x - 1, y, '#2f6428'); px(g, x + 1, y, '#2f6428'); px(g, x + 2, y - 2, '#86c25c'); }
  }
  const FLOWERS = ['#ffffff', '#fbe08a', '#e2334a', '#c89af0', '#ffb030', '#7ab8ff'];
  for (let i = 0; i < 16; i++) {
    const x0 = Math.floor(hash(i, 71) * w), y0 = 74 + Math.floor(hash(i, 72) * 40);
    const c = FLOWERS[Math.floor(hash(i, 73) * FLOWERS.length)];
    for (let k = 0; k < 4; k++) {
      const x = x0 + Math.floor(hash(i, 74 + k) * 9) - 4, y = y0 + Math.floor(hash(i, 80 + k) * 5) - 2;
      if (onPath(x, y)) continue;
      px(g, x, y + 1, '#2f6428');
      px(g, x, y, c);
      if (y > 90) { px(g, x - 1, y, c); px(g, x + 1, y, c); px(g, x, y - 1, c); px(g, x, y, '#fbe08a'); }
    }
  }
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(hash(i, 81) * w), y = 80 + Math.floor(hash(i, 82) * 34);
    if (onPath(x, y)) continue;
    g.fillStyle = '#2e2a30';
    g.fillRect(x - 1, y - 1, 7, 4);
    g.fillStyle = '#8a8a96';
    g.fillRect(x, y, 5, 2);
    g.fillStyle = '#b4b4c0';
    g.fillRect(x, y, 2, 1);
    g.fillStyle = '#5e9a44';
    g.fillRect(x + 2, y - 1, 3, 1);
  }
  // hautes herbes tout en bas
  for (let x = 0; x < w; x++) {
    const th = 1 + Math.floor(hash(x, 91) * 4);
    for (let j = 0; j < th; j++) px(g, x, h - 1 - j, j === th - 1 ? '#5a9a42' : '#2e5e2a');
  }
}

// Premier plan, devant les combattants : buissons sombres en bas, feuillage qui pend en haut.
function prairieFront(g, w, h) {
  const FG = ['#183a1c', '#24502a', '#356a34'];
  // les plans sont plus larges que l'écran de LAYER_M de chaque côté : on cale les coins dessus
  const m = LAYER_M - 4;
  bush(g, m + 6, h - 4, 9, FG);
  bush(g, w - m - 7, h - 3, 8, FG);
  const LEAF = ['#163420', '#21462a', '#2f5e34'];
  for (const [x0, dir] of [[m, 1], [w - 1 - m, -1]]) {
    const cells = new Set();
    for (let i = 0; i < 6; i++) circleCells(cells, x0 + dir * (i * 5), Math.round(2 + Math.sin(i * 1.3) * 2 + i * 0.6), 5 - (i >> 1));
    blob(g, cells, LEAF[1], LEAF[2], LEAF[0]);
    for (const k of cells) {
      const [cx, cy] = k.split(',').map(Number);
      if (hash(cx, cy) < 0.14) px(g, cx, cy, LEAF[2]);
    }
    // feuilles qui pendent au bout
    for (let i = 0; i < 4; i++) {
      const x = x0 + dir * (4 + i * 6), y = 8 + Math.floor(hash(i, x0) * 5);
      px(g, x, y, LEAF[1]);
      px(g, x, y + 1, LEAF[0]);
    }
  }
}

// Ciel animé : nuages qui dérivent (les petits, plus loin, vont moins vite) et vol d'oiseaux.
const CLOUDS = [[26, 12, 1, 1], [0.42, 8, 1.3, 1.2], [0.7, 22, 0.8, 0.8], [-30, 32, 0.6, 0.6], [0.2, 36, 0.6, 0.55], [0.86, 6, 0.9, 0.9]];
function cloudSprite(s) {
  const key = 'cloud' + s;
  if (!STATIC[key]) {
    const c = document.createElement('canvas');
    c.width = Math.ceil(36 * s) + 8;
    c.height = Math.ceil(14 * s) + 6;
    cloud(c.getContext('2d'), Math.ceil(8 * s), Math.ceil(9 * s), s);
    STATIC[key] = c;
  }
  return STATIC[key];
}
function prairieClouds(g, step, w, h, t) {
  for (const [x0, y, s, v] of CLOUDS) {
    const img = cloudSprite(s), span = w + img.width;
    const start = x0 < 0 ? w + x0 : x0 < 1 ? x0 * w : x0; // en px, ou en fraction de la largeur
    const x = Math.floor((start + img.width + (t / 700) * v) % span) - img.width;
    g.drawImage(img, x, y - Math.ceil(9 * s));
  }
  // trois oiseaux traversent le ciel de temps en temps
  const cyc = (t / 70) % (w * 4), flap = Math.floor(t / 180) % 2;
  if (cyc < w + 30) {
    g.fillStyle = '#2a3050';
    [[0, 0], [-7, 3], [-12, -2]].forEach(([dx, dy], i) => {
      const x = Math.round(cyc - 10 + dx), y = 24 + dy + Math.round(Math.sin(t / 400 + i) * 2);
      const f = (flap + i) % 2;
      for (const [ox, oy] of f ? [[-2, -1], [-1, 0], [0, 0], [1, 0], [2, -1]] : [[-2, 0], [-1, -1], [0, 0], [1, -1], [2, 0]]) g.fillRect(x + ox, y + oy, 1, 1);
    });
  }
}

function castleFlag(g, step, w) {
  const cx = castleX(w), top = backHill(cx) + 1 - 25 - 4;
  g.fillStyle = '#4a4c74';
  g.fillRect(cx, top - 5, 1, 5);
  g.fillStyle = '#c84a5a';
  g.fillRect(cx + 1, top - 5, 3, 2);
  px(g, cx + 4, top - 5 + (step % 2), '#c84a5a');
}

// Vie du sol : herbes qui ondulent, papillons, pollen.
function prairieAnim(g, step, w, h) {
  // brins d'herbe qui se balancent devant
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(hash(i, 93) * w), lean = (Math.floor(step / 3) + i) % 4 < 2 ? 0 : 1;
    const y = h - 2 - Math.floor(hash(i, 94) * 3);
    px(g, x, y, '#4e8c3a');
    px(g, x + lean, y - 1, '#6aae46');
    px(g, x + lean * 2, y - 2, '#9ad060');
  }
  // papillons qui volettent
  [[0.3, 84, '#ffffff'], [0.68, 92, '#fbe08a']].forEach(([fx, fy, c], i) => {
    const x = Math.round(w * fx + Math.sin(step / 11 + i * 3) * 26), y = Math.round(fy + Math.sin(step / 5 + i) * 5);
    px(g, x, y, '#2e2a30');
    g.fillStyle = c;
    if ((step + i) % 2) {
      g.fillRect(x - 2, y - 1, 2, 2);
      g.fillRect(x + 1, y - 1, 2, 2);
    } else {
      g.fillRect(x - 1, y - 2, 1, 2);
      g.fillRect(x + 1, y - 2, 1, 2);
    }
  });
  // pollen qui flotte dans la lumière
  for (let i = 0; i < 12; i++) {
    const x = Math.floor((hash(i, 97) * w + step * (0.3 + hash(i, 98) * 0.4)) % w);
    const y = 60 + Math.floor(hash(i, 99) * 50) + Math.round(Math.sin(step / 7 + i) * 2);
    if ((step + i * 5) % 11 < 8) px(g, x, y, (step + i) % 3 ? '#fff8dc' : '#fbe08a');
  }
}

// ---------------------------------------------------------------- crypte

function alcove(g, cx, y0) {
  // niche voûtée avec un crâne et une bougie
  for (let y = y0; y < y0 + 26; y++)
    for (let x = -8; x <= 8; x++) {
      const inArch = y - y0 >= 6 || x * x + (y - y0 - 6) ** 2 * 1.4 <= 64;
      if (!inArch) continue;
      const edge = Math.abs(x) === 8 || (y - y0 < 6 && x * x + (y - y0 - 6) ** 2 * 1.4 > 44);
      px(g, cx + x, y, edge ? '#5c4448' : '#0e080b');
    }
  g.fillStyle = '#4a3a3a';
  g.fillRect(cx - 9, y0 + 26, 19, 2);
  // crâne
  g.fillStyle = '#d8d0bc';
  g.fillRect(cx - 5, y0 + 19, 5, 4);
  g.fillRect(cx - 4, y0 + 23, 3, 2);
  px(g, cx - 4, y0 + 20, '#1a1114');
  px(g, cx - 2, y0 + 20, '#1a1114');
  // bougie
  g.fillStyle = '#f2ead6';
  g.fillRect(cx + 3, y0 + 20, 2, 6);
}

function banner(g, cx, y0, h, cloth, dark) {
  g.fillStyle = '#5a3a22';
  g.fillRect(cx - 6, y0 - 1, 13, 2);
  g.fillStyle = cloth;
  g.fillRect(cx - 5, y0 + 1, 11, h);
  g.fillStyle = dark;
  g.fillRect(cx + 3, y0 + 1, 3, h);
  for (let i = 0; i < 6; i++) px(g, cx - 5 + i * 2, y0 + h + 1 - (i % 2), cloth);
  g.fillStyle = '#e0a93a';
  g.fillRect(cx - 5, y0 + 2, 11, 1);
  g.fillRect(cx - 2, y0 + 6, 5, 5);
  px(g, cx, y0 + 8, '#fbe08a');
}

// Assombrit les bords de l'image par tramage ordonné : le regard reste au centre.
function vignette(g, w, h, col, strength = 1) {
  g.fillStyle = col;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = ((x - w / 2) / (w * 0.56)) ** 2 + ((y - h / 2 - 4) / (h * 0.65)) ** 2 - 1;
      if (d > 0 && d * 3 * strength > BAYER[y % 4][x % 4]) g.fillRect(x, y, 1, 1);
    }
}

function chain(g, x, len) {
  for (let y = 0; y < len; y++) {
    px(g, x, y, y % 3 === 2 ? '#2a2228' : '#6a6068');
    if (y % 3 === 1) px(g, x + 1, y, '#4a4048');
  }
  // anneau au bout
  g.fillStyle = '#6a6068';
  g.fillRect(x - 1, len, 3, 1);
  g.fillRect(x - 1, len + 2, 3, 1);
  px(g, x - 1, len + 1, '#6a6068');
  px(g, x + 1, len + 1, '#6a6068');
}

// Sarcophage de pierre, vu de face, avec un gisant sculpté sur le couvercle.
function sarcophagus(g, cx, by) {
  const r = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  r(cx - 15, by - 12, 30, 13, OUTLINE);
  r(cx - 14, by - 7, 28, 7, '#4a4048');
  r(cx - 14, by - 7, 28, 1, '#6a6068');
  r(cx - 14, by - 1, 28, 1, '#2a2228');
  for (let i = -10; i <= 10; i += 5) r(cx + i, by - 5, 1, 3, '#2a2228');
  // couvercle
  r(cx - 15, by - 11, 30, 4, '#5c5258');
  r(cx - 15, by - 11, 30, 1, '#8a8088');
  // gisant
  r(cx - 9, by - 13, 18, 2, '#7a7078');
  r(cx - 9, by - 13, 18, 1, '#9a9098');
  r(cx - 11, by - 14, 3, 3, '#9a9098');
  // mousse et fissure
  px(g, cx + 6, by - 6, '#2a2228');
  px(g, cx + 7, by - 5, '#2a2228');
  px(g, cx + 7, by - 4, '#2a2228');
  r(cx - 14, by - 2, 4, 1, '#3a5a3a');
}

function bones(g, x, y, k) {
  if (k % 2) {
    // crâne
    g.fillStyle = '#1a1114';
    g.fillRect(x - 1, y - 1, 6, 5);
    g.fillStyle = '#c8bca8';
    g.fillRect(x, y, 4, 3);
    g.fillStyle = '#e4dccc';
    g.fillRect(x, y, 2, 1);
    px(g, x + 1, y + 1, '#1a1114');
    px(g, x + 3, y + 1, '#1a1114');
  } else {
    // os en travers
    for (let i = 0; i < 6; i++) px(g, x + i, y + (i >> 1), '#b8ac98');
    px(g, x - 1, y - 1, '#d8ccb8');
    px(g, x + 6, y + 3, '#d8ccb8');
  }
}

const crypteLights = (c) => [{ x: c - 30, y: 30, r: [6, 14, 26] }, { x: c + 30, y: 30, r: [6, 14, 26] }, { x: c, y: 86, r: [10, 24, 46] }];

// Mur du fond (plan qui glisse moins que le sol).
function crypteWall(g, w) {
  const c = w / 2, lights = crypteLights(c);
  bricks(g, 0, 72, lights, w);
  g.fillStyle = '#140d11';
  g.fillRect(0, 72, w, 2);
  for (const p of [c - 114, c + 106]) pillar(g, p, lights);
  // voûte : nervures en arc qui retombent sur les piliers
  for (const [x0, x1] of [[c - 114, c - 4], [c + 4, c + 114]]) {
    const mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
    for (let x = Math.round(x0); x <= x1; x++) {
      const y = Math.round(10 - Math.sqrt(Math.max(0, 1 - ((x - mid) / half) ** 2)) * 8);
      px(g, x, y + 1, '#140d11');
      px(g, x, y, '#5c4448');
      for (let yy = 0; yy < y; yy++) if ((x + yy) % 2 === 0) px(g, x, yy, '#140d11');
    }
  }
  alcove(g, c - 72, 26);
  alcove(g, c + 72, 26);
  banner(g, c, 6, 22, '#8a1a28', '#6a1420');
  chain(g, c - 46, 18);
  chain(g, c + 50, 12);
  sarcophagus(g, c - 52, 77);
  sarcophagus(g, c + 52, 77);
}

function crypteFloor(g, w, h) {
  flags(g, 74, h, crypteLights(w / 2), w);
  // fissures des dalles, ossements
  g.fillStyle = '#120c0e';
  for (let i = 0; i < 8; i++) {
    let x = Math.floor(hash(i, 111) * w), y = 80 + Math.floor(hash(i, 112) * 36);
    for (let k = 0; k < 7; k++) {
      g.fillRect(x, y, 1, 1);
      x += hash(i, k + 113) < 0.5 ? 1 : -1;
      y += 1;
    }
  }
  for (let i = 0; i < 7; i++) bones(g, Math.floor(hash(i, 121) * (w - 10)) + 2, 84 + Math.floor(hash(i, 122) * 30), i);
}

// Toiles d'araignée dans les coins de l'écran (fixes, comme collées à l'objectif).
function crypteFront(g, w) {
  for (const [x0, dir] of [[LAYER_M, 1], [w - 1 - LAYER_M, -1]]) {
    for (let i = 0; i < 16; i++) {
      px(g, x0 + dir * i, 15 - i, '#8a8088');
      if (i < 12) px(g, x0 + dir * i, 6, i % 2 ? '#6a6068' : '#8a8088');
      if (i < 12) px(g, x0 + dir * 6, i, i % 2 ? '#6a6068' : '#8a8088');
    }
    for (let i = 0; i < 9; i++) px(g, x0 + dir * (10 - Math.abs(i - 4)), 3 + i, '#6a6068');
  }
}

// Torches, bougies et feux follets du mur.
function crypteWallAnim(g, step, w) {
  torch(g, w / 2 - 30, 30, step);
  torch(g, w / 2 + 30, 30, step + 1);
  candle(g, w / 2 - 68, 52, step);
  candle(g, w / 2 + 76, 52, step + 1);
  [[w / 2 - 52, 58], [w / 2 + 58, 62]].forEach(([x0, y0], i) => {
    const x = Math.round(x0 + Math.sin(step / 9 + i * 2) * 6), y = Math.round(y0 + Math.sin(step / 4 + i) * 3);
    g.globalAlpha = 0.35;
    g.fillStyle = '#7af0c8';
    g.fillRect(x - 2, y - 1, 5, 4);
    g.globalAlpha = 1;
    g.fillRect(x - 1, y, 3, 2);
    px(g, x, y - 1 - (step % 2), '#7af0c8');
    px(g, x, y, '#ffffff');
  });
}

// Brasero et brume qui rampe au sol.
function crypteFloorAnim(g, step, w, h) {
  brazier(g, w / 2, 86, step);
  g.fillStyle = '#9a90b0';
  g.globalAlpha = 0.16;
  for (let y = h - 20; y < h; y++)
    for (let x = 0; x < w; x++) {
      const n = noise2((x + step * 0.7) / 16, y / 4 + 20) + (y - h + 20) / 60;
      if (n > 0.66 && BAYER[y % 4][x % 4] < (n - 0.66) * 2.5) g.fillRect(x, y, 1, 1);
    }
  g.globalAlpha = 1;
}

// ---------------------------------------------------------------- volcan

// Failles de lave du sol, gardées pour les faire pulser.
const CRACKS = {};
function volcanCracks(sw) {
  if (CRACKS[sw]) return CRACKS[sw];
  const out = [];
  for (let i = 0; i < 12; i++) {
    let x = Math.floor(hash(i, 9) * sw), y = 74 + Math.floor(hash(i, 8) * 42);
    for (let k = 0; k < 10; k++) {
      out.push([x, y, i]);
      x += 1;
      y += hash(i, k) < 0.5 ? 0 : hash(i, k + 3) < 0.5 ? 1 : -1;
    }
  }
  return (CRACKS[sw] = out);
}

// Cristal sombre qui rougeoie.
function crystal(g, x, by, h, dir) {
  for (let j = 0; j < h; j++) {
    const half = Math.max(0, Math.floor((j / h) * 3));
    const y = by - h + j;
    for (let i = -half; i <= half; i++) px(g, x + i + Math.round((dir * (h - j)) / 4), y, i < 0 ? '#5a1a2a' : i === 0 ? '#c83040' : '#3a1020');
  }
  px(g, x + Math.round((dir * h) / 4), by - h, '#ff8a9a');
}

const volcanLights = (sw) => [{ x: sw / 2, y: 120, r: [20, 40, 70] }, { x: 30, y: 70, r: [6, 14, 26] }, { x: sw - 30, y: 66, r: [6, 14, 26] }, { x: sw * 0.22, y: 40, r: [5, 10, 18] }, { x: sw * 0.78, y: 40, r: [5, 10, 18] }];

// Roche : lumière de la lave par paliers, veines et fissures tirées d'un bruit lissé.
function volcanRock(g, sw, y0, y1) {
  const lights = volcanLights(sw), ROCK = ['#1c1216', '#2c1a1c', '#44221e', '#6a2e1e'];
  for (let y = y0; y < y1; y++)
    for (let x = 0; x < sw; x++) {
      let lv = light(lights, x, y);
      const n = noise2(x / 9, y / 6 + 40);
      if (n > 0.7 && lv < 3) lv++;
      let c = ROCK[lv];
      if (Math.abs(noise2(x / 7 + 30, y / 5) - 0.5) < 0.025) c = '#120a0c';
      if (y >= 70 && Math.abs(noise2(x / 12 + 70, y / 3) - 0.5) < 0.03) c = '#120a0c';
      px(g, x, y, c);
    }
}

// Fond de la caverne : voûte, cascades et rivière de lave.
function volcanBack(g, sw) {
  volcanRock(g, sw, 0, 66);
  // stalactites
  for (let i = 0; i * 14 < sw; i++) {
    const x = i * 14 + Math.floor(hash(i, 101) * 8), h = 6 + Math.floor(hash(i, 102) * 14);
    for (let j = 0; j < h; j++) {
      const half = Math.max(0, Math.floor((1 - j / h) * 3));
      for (let k = -half; k <= half; k++) px(g, x + k, j, k < 0 ? '#2c1a1c' : k === -half ? '#44221e' : '#140c0e');
    }
  }
  // cascades de lave au fond, avec leur lueur tramée et un bassin qui fume
  for (const lx of [sw * 0.22, sw * 0.78]) {
    const x0 = Math.round(lx);
    for (let y = 8; y < 64; y++) for (let dx = -6; dx <= 6; dx++) if (Math.abs(dx) > 2 && (dx + y) % 2 === 0 && Math.abs(dx) < 6 - (y % 3)) px(g, x0 + dx, y, '#7a321c');
    g.fillStyle = '#ff6a1f';
    g.fillRect(x0 - 2, 10, 5, 52);
    g.fillStyle = '#ffb030';
    g.fillRect(x0 - 1, 10, 2, 52);
    g.fillStyle = '#5a2418';
    g.fillRect(x0 - 3, 8, 7, 2);
  }
  // rivière de lave et sa lueur sur la roche au-dessus
  for (let x = 0; x < sw; x++) {
    const h = 3 + Math.round(Math.sin(x / 6) * 1.5);
    for (let y = 64 - h - 6; y < 64 - h; y++) if ((x + y) % 2 === 0 && y > 64 - h - 6 + ((x * 3) % 3)) px(g, x, y, '#8a3a1c');
    g.fillStyle = '#ff6a1f';
    g.fillRect(x, 64 - h, 1, h);
    g.fillStyle = '#ffb030';
    if (x % 7 < 3) g.fillRect(x, 64 - h, 1, 1);
    g.fillStyle = '#5a2418';
    g.fillRect(x, 64, 1, 1);
  }
  // rebord du sol, éclairé par la lave
  for (let x = 0; x < sw; x++) {
    px(g, x, 65, '#120a0c');
    px(g, x, 66, x % 3 ? '#8a3a1c' : '#6a2e1e');
  }
}

function volcanFloor(g, sw, h) {
  volcanRock(g, sw, 67, h);
  // failles de lave du sol (repeintes en pulsant par l'animation)
  for (const [x, y] of volcanCracks(sw)) {
    px(g, x, y, '#ff6a1f');
    if (hash(x, y) < 0.4) px(g, x, y - 1, '#8a3a1c');
  }
  // cristaux de part et d'autre
  for (const [x, ch, d] of [[11, 20, 1], [18, 12, 1], [5, 11, -1], [-12, 21, -1], [-19, 12, -1], [-6, 10, 1]]) {
    crystal(g, x < 0 ? sw - LAYER_M + x : LAYER_M + x, 74, ch, d);
  }
}

// Rochers sombres au premier plan, liserés de rouge.
function volcanFront(g, sw, h) {
  // depuis le bord de l'écran (LAYER_M) vers l'intérieur, et pleine hauteur dans la marge
  for (const [x0, dir] of [[LAYER_M, 1], [sw - 1 - LAYER_M, -1]]) {
    for (let j = -LAYER_M; j < 24; j++) {
      const rh = Math.max(0, 14 - Math.floor(Math.max(0, j) * 0.65) + (((j % 3) + 3) % 3));
      for (let y = h - rh; y < h; y++) px(g, x0 + dir * j, y, y === h - rh ? '#a83a1c' : y === h - rh + 1 ? '#3a2228' : '#100a0c');
    }
  }
}

// Lave qui pulse dans les failles, braises qui montent.
function volcanFloorAnim(g, step, w) {
  for (const [x, y, i] of volcanCracks(w)) if ((step + i * 2) % 8 < 3) px(g, x, y, (step + i) % 2 ? '#ffb030' : '#fbe08a');
  for (let i = 0; i < 9; i++) {
    const t = (step + i * 4) % 16, x = Math.round((w / 9) * i + 12 + (t % 3) + Math.sin(t / 3) * 2);
    px(g, x, 70 - t * 4, t < 8 ? '#ffb030' : t < 12 ? '#ff6a1f' : '#8a3a1c');
  }
  // cristaux qui scintillent
  if (step % 6 === 0) px(g, LAYER_M + 15, 56, '#ffffff');
  if (step % 6 === 3) px(g, w - LAYER_M - 17, 55, '#ffffff');
}

// Bulles qui éclatent, reflets des cascades, fumée sous la voûte.
function volcanBackAnim(g, step, w) {
  for (let i = 0; i < 4; i++) {
    const t = (step + i * 5) % 12, x = Math.floor(hash(i, 131) * w);
    if (t < 4) {
      const y = 62 - (t > 1 ? 1 : 0);
      g.fillStyle = t === 3 ? '#fbe08a' : '#ffb030';
      if (t < 3) g.fillRect(x - (t >> 1), y - t, 1 + t, 1 + (t >> 1));
      else { px(g, x - 2, y - 3, '#fbe08a'); px(g, x + 2, y - 3, '#fbe08a'); px(g, x, y - 4, '#ffb030'); }
    }
  }
  // reflets qui descendent dans les cascades de lave
  for (const lx of [w * 0.22, w * 0.78]) for (let k = 0; k < 3; k++) px(g, Math.round(lx), 10 + ((step * 3 + k * 17) % 52), '#fbe08a');
  // fumée sombre qui glisse sous la voûte
  g.fillStyle = '#3a2a30';
  g.globalAlpha = 0.5;
  for (let y = 0; y < 22; y++)
    for (let x = 0; x < w; x++) {
      const n = noise2((x - step * 0.5) / 14, y / 5 + 60) - y / 40;
      if (n > 0.5 && BAYER[y % 4][x % 4] < (n - 0.5) * 3) g.fillRect(x, y, 1, 1);
    }
  g.globalAlpha = 1;
}

// ---------------------------------------------------------------- pièces du camp

// Salle de l'équipe : râtelier d'armes, armure, bannière.
const TEAM_LIGHTS = [{ x: 90, y: 28, r: [6, 14, 26] }, { x: 210, y: 28, r: [6, 14, 26] }];
function teamRoom(g) {
  dungeonWall(g, { w: CAMP_W + LAYER_M, x0: -LAYER_M, lights: TEAM_LIGHTS, pillars: [40, 252], ceiling: true });
  banner(g, 150, 8, 26, '#8a1a28', '#6a1420');
  // râtelier
  g.fillStyle = '#4a2e1c';
  g.fillRect(104, 44, 30, 3);
  g.fillRect(104, 64, 30, 3);
  for (const [x, c, h] of [[108, '#b9c6d2', 26], [114, '#8e99a4', 22], [120, '#b9c6d2', 28], [126, '#e0a93a', 24], [130, '#8e99a4', 20]]) {
    g.fillStyle = '#5a3a22';
    g.fillRect(x, 66 - 6, 1, 6);
    g.fillStyle = c;
    g.fillRect(x, 66 - h, 1, h - 6);
    g.fillStyle = '#e0a93a';
    g.fillRect(x - 1, 60, 3, 1);
  }
  // armure sur son support
  g.fillStyle = '#5a3a22';
  g.fillRect(180, 40, 2, 34);
  g.fillStyle = '#8e99a4';
  g.fillRect(175, 36, 12, 6);
  g.fillRect(174, 44, 14, 12);
  g.fillStyle = '#b9c6d2';
  g.fillRect(175, 44, 5, 10);
  g.fillRect(176, 36, 4, 2);
  g.fillStyle = '#1a1114';
  g.fillRect(178, 39, 6, 1);
  g.fillStyle = '#c8323c';
  g.fillRect(174, 56, 14, 3);
}

// Salle d'invocation : murs, piliers et bannières. L'autel (cristal, socle, cercle de runes,
// bougies) est dessiné à part par altar(), à une position choisie selon l'écran.
const SUMMON_LIGHTS = [{ x: 60, y: 28, r: [6, 14, 26] }, { x: 240, y: 28, r: [6, 14, 26] }];
function summonRoom(g) {
  dungeonWall(g, { w: CAMP_W + LAYER_M, x0: -LAYER_M, lights: SUMMON_LIGHTS, pillars: [20, 196], ceiling: true });
  banner(g, 78, 8, 24, '#62349a', '#4a2386');
  banner(g, 142, 8, 24, '#62349a', '#4a2386');
}

// Grand cristal facetté (losange de 23 × 41 px) : facettes claires à gauche, sombres à droite,
// arête centrale et ceinture lumineuses, cœur qui pulse.
function bigCrystal(g, cx, cy, step) {
  const TOP = 22, BOT = 18, W = 11;
  const half = (dy) => (dy <= 0 ? Math.round(W * (1 + dy / TOP)) : Math.round(W * (1 - dy / BOT)));
  for (let dy = -TOP - 1; dy <= BOT + 1; dy++) {
    const hw = half(Math.max(-TOP, Math.min(BOT, dy))) + 1;
    g.fillStyle = OUTLINE;
    g.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
  }
  for (let dy = -TOP; dy <= BOT; dy++) {
    const hw = half(dy);
    for (let dx = -hw; dx <= hw; dx++) {
      const up = dy < 0;
      let c = dx < 0 ? (up ? '#e6d0ff' : '#a878e8') : (up ? '#9a62d8' : '#6a3aa8');
      if (Math.abs(dx) === Math.round(hw * 0.55) && hw > 2) c = dx < 0 ? (up ? '#c8a0f0' : '#8a58d0') : (up ? '#7a48c0' : '#4e2888');
      if (dx === 0) c = up ? '#ffffff' : '#c8a0f0';
      if (dy === 0) c = dx < 0 ? '#ffffff' : '#e6d0ff';
      if (dx === -hw) c = up ? '#f4e8ff' : '#c8a0f0';
      g.fillStyle = c;
      g.fillRect(cx + dx, cy + dy, 1, 1);
    }
  }
  // cœur qui pulse
  const p = step % 6 < 3 ? 2 : 3;
  g.globalAlpha = 0.7;
  g.fillStyle = '#ffffff';
  for (let dy = -p - 2; dy <= p; dy++) {
    const w = p - Math.abs(dy + 1);
    if (w >= 0) g.fillRect(cx - w, cy - 4 + dy, w * 2 + 1, 1);
  }
  g.globalAlpha = 1;
  // reflets qui scintillent sur les facettes
  if (step % 8 === 0) px(g, cx - 5, cy - 9, '#ffffff');
  if (step % 8 === 4) px(g, cx + 4, cy + 6, '#ffffff');
}

// Petit éclat de cristal (3 × 5) en orbite.
function shard(g, x, y, lit) {
  g.fillStyle = OUTLINE;
  g.fillRect(x - 2, y - 2, 5, 5);
  g.fillRect(x - 1, y - 3, 3, 7);
  g.fillStyle = lit ? '#e6d0ff' : '#9a62d8';
  g.fillRect(x - 1, y - 2, 3, 5);
  g.fillRect(x, y - 3, 1, 7);
  px(g, x - 1, y - 1, '#ffffff');
}

// L'autel au complet, centré en x (pixels d'art) : lueur au sol, cercle de runes, bougies,
// socle de pierre gravé, rai de lumière, grand cristal flottant et ses éclats, poussière de magie.
// charge : pendant le rituel (plus de lumière, anneaux qui partent du cristal).
export const ALTAR_Y = 50; // centre du cristal
export function altar(g, x, step, charge = false) {
  x = Math.round(x);
  const cy = ALTAR_Y - (step % 8 < 4 ? 0 : 1), fy = 101;
  // lueur violette tramée au sol et sur le mur
  for (let y = 30; y < SH; y++)
    for (let dx = -62; dx <= 62; dx++) {
      const d = Math.hypot(dx / 1.6, y - 82);
      if (d < 22 ? (dx + y) % 2 === 0 : d < 36 && (dx + y) % 4 === 0) px(g, x + dx, y, d < 14 ? '#4a2c5c' : '#3a2448');
    }
  // rai de lumière qui tombe sur le cristal, élargi par bandes de 4 px
  g.fillStyle = '#e8d0ff';
  g.globalAlpha = charge ? 0.16 : 0.08;
  for (let y = 0; y < 92; y += 4) {
    const w = 14 + Math.floor((y / 92) * 9) * 2;
    g.fillRect(x - (w >> 1), y, w, 4);
  }
  g.globalAlpha = 1;
  // cercle de runes au sol, runes qui s'allument tour à tour
  const RX = 46, RY = 9;
  for (let a = 0; a < 360; a += 2) {
    const r = (a * Math.PI) / 180;
    px(g, Math.round(x + Math.cos(r) * RX), Math.round(fy + Math.sin(r) * RY), '#62349a');
    px(g, Math.round(x + Math.cos(r) * (RX - 5)), Math.round(fy + Math.sin(r) * (RY - 2)), '#4a2386');
  }
  for (let i = 0; i < 6; i++) {
    const a = ((step * 8 + i * 60) * Math.PI) / 180;
    const rx = Math.round(x + Math.cos(a) * (RX - 2)), ry = Math.round(fy + Math.sin(a) * (RY - 1));
    px(g, rx, ry, '#c89af0');
    px(g, rx + 1, ry, '#ffffff');
  }
  // bougies autour du cercle (celles du fond d'abord)
  [[-30, 94], [30, 94], [-44, 100], [44, 100], [-34, 108], [34, 108]].forEach(([dx, y], i) => candle(g, x + dx, y, step + i));
  // socle de pierre : plateau, fût gravé de runes, base évasée
  const R = (rx, ry, w, h, c) => { g.fillStyle = c; g.fillRect(x + rx, ry, w, h); };
  R(-14, 96, 29, 5, OUTLINE); R(-13, 96, 27, 4, '#5c5258'); R(-13, 96, 27, 1, '#8a8088');
  R(-7, 80, 15, 16, OUTLINE); R(-6, 80, 13, 16, '#6a6068'); R(-6, 80, 3, 16, '#8a8088'); R(4, 80, 3, 16, '#4a4048');
  R(-11, 75, 23, 6, OUTLINE); R(-10, 75, 21, 5, '#7a7078'); R(-10, 75, 21, 1, '#a8a0a8'); R(-10, 79, 21, 1, '#4a4048');
  for (const [rx, ry] of [[-2, 83], [1, 86], [-2, 89], [1, 92]]) R(rx, ry, 2, 1, (step + ry) % 4 < 2 || charge ? '#c89af0' : '#62349a');
  // éclats en orbite : derrière le cristal quand ils passent au fond
  const shards = [0, 1, 2].map((i) => {
    const a = step * 0.18 + (i * Math.PI * 2) / 3;
    return { x: Math.round(x + Math.cos(a) * 20), y: Math.round(cy + 2 + Math.sin(a) * 6), front: Math.sin(a) > 0 };
  });
  for (const s of shards) if (!s.front) shard(g, s.x, s.y, false);
  // halo tramé autour du cristal
  for (let dy = -28; dy <= 24; dy++)
    for (let dx = -18; dx <= 18; dx++) {
      const d = Math.hypot(dx * 1.4, dy * 0.8);
      if (d > 16 && d < 21 && (dx + dy + step) % 3 === 0) px(g, x + dx, cy + dy, charge ? '#e6d0ff' : '#7a4ab8');
    }
  bigCrystal(g, x, cy, step);
  for (const s of shards) if (s.front) shard(g, s.x, s.y, true);
  // poussière de magie qui monte
  for (let i = 0; i < 9; i++) {
    const t = (step + i * 5) % 26, mx = x - 18 + ((i * 13) % 37) + (t % 4 < 2 ? 0 : 1);
    if (t < 22) px(g, mx, 94 - t * 3, t < 12 ? '#c89af0' : '#7a4ab8');
  }
  // pendant le rituel : anneaux de lumière qui partent du cristal
  if (charge) {
    for (const r of [6 + ((step * 3) % 24), 6 + ((step * 3 + 12) % 24)]) {
      g.fillStyle = step % 2 ? '#c89af0' : '#ffffff';
      for (let i = 0; i < 32; i++) {
        const t = (i / 32) * Math.PI * 2;
        g.fillRect(Math.round(x + Math.cos(t) * r), Math.round(cy - 2 + Math.sin(t) * r * 0.8), 1, 1);
      }
    }
  }
}

// Brasero sur pied (crypte).
function brazier(g, x, y, step) {
  g.fillStyle = OUTLINE;
  g.fillRect(x - 6, y - 4, 13, 5);
  g.fillRect(x - 1, y, 3, 8);
  g.fillRect(x - 4, y + 7, 9, 2);
  g.fillStyle = '#5a5258';
  g.fillRect(x - 5, y - 3, 11, 3);
  g.fillRect(x, y, 1, 7);
  g.fillStyle = '#8a8478';
  g.fillRect(x - 5, y - 3, 11, 1);
  flame(g, x, y - 3, step, true);
}

function candle(g, x, y, step) {
  g.fillStyle = '#1a1114';
  g.fillRect(x - 1, y - 6, 4, 7);
  g.fillStyle = '#f2ead6';
  g.fillRect(x, y - 5, 2, 5);
  px(g, x + (step % 2), y - 7, '#ffb030');
  px(g, x + (step % 2), y - 8, '#fbe08a');
}

// ---------------------------------------------------------------- API

const STATIC = {};

// ---------------------------------------------------------------- pièces du camp en plans

const CAMP_LIGHTS = [{ x: 108, y: 28, r: [6, 14, 26] }, { x: 192, y: 28, r: [6, 14, 26] }, { x: 150, y: 88, r: [14, 30, 52] }];

function campWall(g) {
  dungeonWall(g, { w: CAMP_W + LAYER_M, x0: -LAYER_M, lights: CAMP_LIGHTS, pillars: [56, 236], gate: { x: 135, w: 30 }, ceiling: true });
  noticeBoard(g);
}

// Panneau d'affichage en bois sur le mur de gauche (on le touche pour aller à l'Équipe).
function noticeBoard(g) {
  g.fillStyle = OUTLINE;
  g.fillRect(71, 33, 30, 22);
  g.fillStyle = '#6a4228';
  g.fillRect(72, 34, 28, 20);
  g.fillStyle = '#8a5a32';
  g.fillRect(72, 34, 28, 2);
  for (const [x, y, c] of [[75, 38, '#f2e2b8'], [85, 37, '#e8d4a4'], [92, 40, '#f2e2b8'], [78, 45, '#e8d4a4']]) {
    g.fillStyle = c;
    g.fillRect(x, y, 6, 7);
    g.fillStyle = '#8a6a4a';
    g.fillRect(x + 1, y + 2, 4, 1);
    g.fillRect(x + 1, y + 4, 3, 1);
    g.fillStyle = '#e2334a';
    g.fillRect(x + 2, y, 1, 1);
  }
}

// Tonneau cerclé de fer, vu de face.
function barrel(g, x, by, h = 14) {
  const R = (rx, ry, w, hh, c) => { g.fillStyle = c; g.fillRect(x + rx, by - h + ry, w, hh); };
  R(-1, 0, 13, h, OUTLINE);
  R(0, 1, 11, h - 2, '#7a4e2c');
  R(0, 1, 3, h - 2, '#9a6a3a');
  R(8, 1, 3, h - 2, '#5a3820');
  for (const ry of [3, h - 4]) { R(0, ry, 11, 1, '#4a4650'); R(0, ry, 3, 1, '#8a8490'); }
  R(1, 1, 9, 1, '#b07a42');
}

// Caisse de bois en planches.
function crate(g, x, by, s = 14) {
  const R = (rx, ry, w, hh, c) => { g.fillStyle = c; g.fillRect(x + rx, by - s + ry, w, hh); };
  R(-1, -1, s + 2, s + 1, OUTLINE);
  R(0, 0, s, s - 1, '#8a5a32');
  R(0, 0, s, 1, '#b07a42');
  R(0, 0, 1, s - 1, '#a06c3e');
  R(0, (s >> 1) - 1, s, 1, '#5a3820');
  for (let i = 1; i < s - 1; i++) R(i, i - 1, 1, 1, '#6a4228');
}

// Premier plan du camp : tonneaux et caisses dans les coins bas.
// (le cadrage coupe environ 20 px de chaque côté de la pièce : on reste au-delà)
function campFront(g) {
  crate(g, 14, SH + 1, 16);
  barrel(g, 30, SH + 1, 15);
  barrel(g, 18, SH - 15, 12);
  crate(g, CAMP_W - 32, SH + 1, 16);
  barrel(g, CAMP_W - 46, SH + 1, 14);
  // sac de grain
  g.fillStyle = OUTLINE;
  g.fillRect(CAMP_W - 58, SH - 9, 12, 10);
  g.fillStyle = '#c8a870';
  g.fillRect(CAMP_W - 57, SH - 8, 10, 8);
  g.fillStyle = '#e8d4a4';
  g.fillRect(CAMP_W - 57, SH - 8, 3, 6);
  g.fillStyle = '#8a6a4a';
  g.fillRect(CAMP_W - 53, SH - 9, 2, 2);
}

// Lueur d'une torche qui vacille : disques empilés très transparents dont le rayon tremble.
function torchGlow(g, x, y, step, col = '#ffb050') {
  const f = Math.floor(hash(step, x) * 3);
  g.fillStyle = col;
  for (const [r, a] of [[26 + f, 0.04], [18 + f, 0.05], [10 + f, 0.07]]) {
    g.globalAlpha = a;
    disc(g, x, y, r, col);
  }
  g.globalAlpha = 1;
}

// Poussière qui flotte dans la lumière autour d'un point.
function dust(g, cx, cy, step, n = 8, col = '#fff2c0') {
  g.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const t = (step + i * 7) % 40;
    const x = Math.round(cx - 20 + hash(i, 61) * 40 + Math.sin((step + i * 5) / 9) * 3);
    const y = Math.round(cy + 12 - t * 0.8 + hash(i, 62) * 6);
    if ((step + i) % 5) {
      g.globalAlpha = t < 30 ? 0.7 : 0.35;
      g.fillRect(x, y, 1, 1);
    }
  }
  g.globalAlpha = 1;
}

// Goutte d'eau qui tombe du plafond et fait un rond dans la flaque.
function drip(g, x, y1, step) {
  const t = step % 30;
  g.fillStyle = '#9ab0c8';
  if (t < 4) g.fillRect(x, 4, 1, 1 + (t >> 1));
  else if (t < 12) g.fillRect(x, 4 + Math.floor(((t - 4) / 8) * (y1 - 4)), 1, 2);
  else if (t < 18) {
    const r = t - 11;
    g.globalAlpha = 0.6;
    g.fillRect(x - r * 2, y1, 1, 1);
    g.fillRect(x + r * 2, y1, 1, 1);
    g.fillRect(x - r, y1 - 1, 1, 1);
    g.fillRect(x + r, y1 - 1, 1, 1);
    g.globalAlpha = 1;
  }
}

// Plans des pièces : mur du fond (glisse moins vite), sol, premier plan, vignettage.
// Coordonnées des pièces : 0..CAMP_W ; chaque plan déborde de LAYER_M de chaque côté.
const ROOM_LAYERS = {
  camp: [
    { d: 0.7, draw: campWall, anim(g, step) {
      torchGlow(g, 108, 28, step);
      torchGlow(g, 192, 28, step + 1);
      torch(g, 108, 28, step);
      torch(g, 192, 28, step + 1);
      drip(g, 214, 104, step);
    } },
    { d: 1, draw: (g) => dungeonFloor(g, { w: CAMP_W + LAYER_M, x0: -LAYER_M, lights: CAMP_LIGHTS, details: true, puddle: [214, 104, 9] }), anim(g, step) {
      torchGlow(g, 150, 86, step, '#ff9a3a');
      campfire(g, 150, 92, step);
      dust(g, 150, 70, step, 10);
    } },
    { d: 1.4, draw: campFront, front: true },
    { d: 1, draw: (g) => vignette(g, CAMP_W + LAYER_M * 2, SH, '#0a0609', 0.7), raw: true, front: true },
  ],
  teamRoom: [
    { d: 0.7, draw: teamRoom, anim(g, step) {
      torchGlow(g, 90, 28, step);
      torchGlow(g, 210, 28, step + 1);
      torch(g, 90, 28, step);
      torch(g, 210, 28, step + 1);
      drip(g, 262, 100, step + 9);
    } },
    { d: 1, draw: (g) => dungeonFloor(g, { w: CAMP_W + LAYER_M, x0: -LAYER_M, lights: TEAM_LIGHTS, details: true, puddle: [262, 100, 8] }), anim(g, step) {
      dust(g, 90, 46, step, 6);
      dust(g, 210, 46, step + 13, 6);
    } },
    { d: 1, draw: (g) => vignette(g, CAMP_W + LAYER_M * 2, SH, '#0a0609', 0.7), raw: true, front: true },
  ],
  summonRoom: [
    { d: 0.7, draw: summonRoom, anim(g, step) {
      torchGlow(g, 60, 28, step);
      torchGlow(g, 240, 28, step + 1);
      torch(g, 60, 28, step);
      torch(g, 240, 28, step + 1);
      drip(g, 226, 106, step + 17);
    } },
    { d: 1, draw: (g) => dungeonFloor(g, { w: CAMP_W + LAYER_M, x0: -LAYER_M, lights: SUMMON_LIGHTS, details: true, puddle: [226, 106, 9] }) },
    { d: 1, draw: (g) => vignette(g, CAMP_W + LAYER_M * 2, SH, '#0a0609', 0.7), raw: true, front: true },
  ],
};

// Plans d'une pièce (mis en cache) : { canvas, d, anim, front, raw }. Le canvas fait CAMP_W + 2·LAYER_M
// de large ; le point 0 de la pièce y est à x = LAYER_M.
export function roomLayers(name) {
  const key = 'room-' + name;
  if (!STATIC[key]) {
    STATIC[key] = ROOM_LAYERS[name].map((l) => {
      const c = document.createElement('canvas');
      c.width = CAMP_W + LAYER_M * 2;
      c.height = SH;
      const g = c.getContext('2d');
      if (!l.raw) g.translate(LAYER_M, 0); // raw : dessiné sur toute la largeur du plan
      l.draw(g, CAMP_W, SH);
      return { ...l, canvas: c };
    });
  }
  return STATIC[key];
}

// Dessine les plans d'une pièce (front : ceux de devant ou ceux du fond), décalés selon pan :
// pendant un passage d'une pièce à l'autre, le mur glisse moins vite et le premier plan plus vite.
export function drawRoomLayers(name, g, step, pan, front) {
  for (const l of roomLayers(name)) {
    if (!!l.front !== front) continue;
    const x = Math.round(pan * (1 - l.d)) - LAYER_M;
    g.drawImage(l.canvas, x, 0);
    if (!l.anim) continue;
    g.save();
    g.translate(x + LAYER_M, 0);
    l.anim(g, step);
    g.restore();
  }
}

// Décors de combat : une pile de plans. d = profondeur (0 : à l'infini, 1 : le sol où se tiennent
// les combattants, > 1 : devant eux). front : dessiné par-dessus les combattants.
// Chaque plan est dessiné plus large que l'écran (LAYER_M de chaque côté) pour pouvoir glisser.
const LAYERS = {
  prairie: [
    { d: 0, draw: prairieSky, anim: prairieClouds },
    { d: 0.15, draw: prairieFar },
    { d: 0.35, draw: prairieMid, anim: castleFlag },
    { d: 0.6, draw: prairieForest },
    { d: 1, draw: prairieGround, anim: prairieAnim },
    { d: 1.6, draw: prairieFront, front: true },
  ],
  crypte: [
    { d: 0.6, draw: crypteWall, anim: crypteWallAnim },
    { d: 1, draw: crypteFloor, anim: crypteFloorAnim },
    { d: 1, draw: crypteFront, front: true },
    { d: 1, draw: (g, w, h) => vignette(g, w, h, '#0a0609'), front: true },
  ],
  volcan: [
    { d: 0.5, draw: volcanBack, anim: volcanBackAnim },
    { d: 1, draw: volcanFloor, anim: volcanFloorAnim },
    { d: 1.6, draw: volcanFront, front: true },
    { d: 1, draw: (g, w, h) => vignette(g, w, h, '#0e0608', 0.8), front: true },
  ],
};
export const LAYER_M = 16;

// Images des plans d'un décor pour un écran de w × h pixels d'art (mises en cache).
// shade : silhouette sombre du plan, pour l'assombrir avec le reste pendant la mise en scène.
export function sceneLayers(name, w, h) {
  const key = `L-${name}-${w}-${h}`;
  if (!STATIC[key]) {
    const lw = w + LAYER_M * 2;
    STATIC[key] = LAYERS[name].map((l) => {
      const c = document.createElement('canvas');
      c.width = lw;
      c.height = h;
      l.draw(c.getContext('2d'), lw, h);
      let shade = null;
      if (l.front) {
        shade = document.createElement('canvas');
        shade.width = lw;
        shade.height = h;
        const sg = shade.getContext('2d');
        sg.drawImage(c, 0, 0);
        sg.globalCompositeOperation = 'source-in';
        sg.fillStyle = OUTLINE;
        sg.fillRect(0, 0, lw, h);
      }
      return { ...l, canvas: c, shade, lw };
    });
  }
  return STATIC[key];
}

// Fond d'une pièce du camp sans décalage, plans du fond assemblés (portraits de la salle d'armes).
export function sceneBackground(name) {
  const key = 'flat-' + name;
  if (!STATIC[key]) {
    const c = document.createElement('canvas');
    c.width = CAMP_W;
    c.height = SH;
    const g = c.getContext('2d');
    for (const l of roomLayers(name)) if (!l.front) g.drawImage(l.canvas, -LAYER_M, 0);
    STATIC[key] = c;
  }
  return STATIC[key];
}

// Zone de la porte du camp (pixels d'art), pour savoir si on la touche.
export const GATE = { x0: 132, y0: 16, x1: 168, y1: 76 };
