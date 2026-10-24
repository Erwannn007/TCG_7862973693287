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

function bricks(g, y0, y1, lights, w = SW) {
  for (let y = y0; y < y1; y++) {
    const row = Math.floor((y - y0) / 7), off = row % 2 ? 6 : 0;
    for (let x = 0; x < w; x++) {
      const lv = light(lights, x, y);
      const bx = (x + off) % 12, by = (y - y0) % 7;
      if (bx === 0 || by === 0) { px(g, x, y, MORTAR[lv]); continue; }
      const id = Math.floor((x + off) / 12) * 31 + row;
      let c = lv;
      if (hash(id, 7) < 0.25 && c > 0) c--;
      if (by === 1 && c < 3) c++;
      if (by === 6 && c > 0) c--;
      px(g, x, y, WALL[c]);
    }
  }
}

function flags(g, y0, y1, lights, w = SW) {
  for (let y = y0; y < y1; y++) {
    const row = Math.floor((y - y0) / 8), off = row % 2 ? 9 : 0;
    for (let x = 0; x < w; x++) {
      const lv = light(lights, x, y);
      const bx = (x + off) % 18, by = (y - y0) % 8;
      if (bx === 0 || by === 0) px(g, x, y, FLOOR_LINE[lv]);
      else px(g, x, y, FLOOR[hash(Math.floor((x + off) / 18), row) < 0.2 && lv > 0 ? lv - 1 : lv]);
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
  const lights = opts.lights, w = opts.w || SW;
  bricks(g, 0, 72, lights, w);
  // plinthe
  g.fillStyle = '#140d11';
  g.fillRect(0, 72, w, 2);
  flags(g, 74, SH, lights, w);
  for (const p of opts.pillars || []) pillar(g, p, lights);
  if (opts.gate) gate(g, opts.gate);
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

function cloud(g, x, y, s) {
  const cells = new Set();
  for (const [dx, dy, r] of [[0, 0, 4], [6, -3, 5], [13, -1, 4], [-6, 1, 3], [19, 1, 3]]) {
    circleCells(cells, x + Math.round(dx * s), y + Math.round(dy * s), Math.max(2, Math.round(r * s)), y + 3);
  }
  blob(g, cells, '#eef4fc', '#ffffff', '#c4d4ee');
}

function mountains(g, w, base, peaks, pal) {
  for (let x = 0; x < w; x++) {
    let h = 0, dom = null;
    for (const p of peaks) {
      const v = p.h - Math.abs(x - p.x) * p.s;
      if (v > h) { h = v; dom = p; }
    }
    if (!dom) continue;
    const top = Math.round(base - h), lit = x < dom.x;
    for (let y = top; y < base; y++) {
      let c = lit ? pal.lit : pal.dark;
      if (dom.h > pal.snowAt && y < base - dom.h + 6 + ((x * 7) % 3)) c = lit ? pal.snow : pal.snowDark;
      if (y === top && lit) c = pal.edge;
      px(g, x, y, c);
    }
  }
}

function pine(g, x, base, h) {
  for (let j = 0; j < h; j++) {
    const half = Math.floor(((j + 2) / h) * 4 * (j % 3 === 2 ? 0.8 : 1));
    const y = base - h + j;
    px(g, x - half - 1, y, '#1c3626');
    for (let i = -half; i <= half; i++) px(g, x + i, y, i < 0 ? '#3e7246' : '#2c5a38');
    px(g, x + half + 1, y, '#1c3626');
  }
  px(g, x, base - h - 1, '#1c3626');
}

function roundTree(g, x, base, r) {
  const cells = new Set();
  circleCells(cells, x, base - r, r);
  circleCells(cells, x - r + 1, base - r + 2, r - 1);
  circleCells(cells, x + r - 1, base - r + 1, r - 1);
  blob(g, cells, '#356a3e', '#4e8a4a', '#24502e');
}

function prairie(g, w) {
  // ciel en bandes, tramées à chaque frontière
  const SKY = ['#3a5ab8', '#4668c2', '#5278ca', '#5e88d2', '#6c98da', '#7ea8e0', '#94bae6', '#aecbea', '#cadbe8'];
  SKY.forEach((c, i) => {
    g.fillStyle = c;
    g.fillRect(0, i * 6, w, 6);
    if (i) dither(g, i * 6, w, c, SKY[i - 1]);
  });
  // soleil
  disc(g, w - 44, 14, 8, '#fff0b0');
  disc(g, w - 44, 14, 6, '#fff8dc');
  disc(g, w - 45, 13, 3, '#ffffff');
  // nuages
  for (const [x, y, s] of [[26, 12, 1], [w * 0.42, 8, 1.3], [w * 0.7, 22, 0.8], [w - 30, 32, 0.6], [w * 0.2, 34, 0.6]]) cloud(g, Math.round(x), y, s);
  // montagnes lointaines puis proches
  const far = [], near = [];
  for (let i = -1; i * 46 < w + 46; i++) far.push({ x: i * 46 + Math.floor(hash(i, 21) * 20), h: 18 + hash(i, 22) * 10, s: 0.7 + hash(i, 23) * 0.3 });
  for (let i = -1; i * 58 < w + 58; i++) near.push({ x: i * 58 + 20 + Math.floor(hash(i, 31) * 24), h: 22 + hash(i, 32) * 12, s: 0.8 + hash(i, 33) * 0.4 });
  mountains(g, w, 56, far, { lit: '#9aa6d0', dark: '#8a94c2', edge: '#aab6dc', snow: '#eef2fa', snowDark: '#d4dcee', snowAt: 23 });
  mountains(g, w, 58, near, { lit: '#7a7eb4', dark: '#64689e', edge: '#8a8ec0', snow: '#f4f6fc', snowDark: '#c8d0e8', snowAt: 28 });
  // collines bleutées
  for (let x = 0; x < w; x++) {
    const top = Math.round(58 - (4 + 3 * Math.sin(x / 17) + 2 * Math.sin(x / 7 + 2)));
    for (let y = top; y < 64; y++) px(g, x, y, y === top ? '#76aa82' : '#5e9270');
  }
  // lisière de forêt
  for (let x = -4, i = 0; x < w + 6; i++) {
    const b = 66 + Math.floor(hash(i, 41) * 2);
    if (hash(i, 42) < 0.55) pine(g, x, b, 9 + Math.floor(hash(i, 43) * 6));
    else roundTree(g, x, b, 4 + Math.floor(hash(i, 44) * 2));
    x += 5 + Math.floor(hash(i, 45) * 4);
  }
  // sol : bandes plus claires au loin, plus saturées devant
  const GROUND = [[66, '#76ae50'], [74, '#68a248'], [86, '#5a963f'], [100, '#4e8a38']];
  GROUND.forEach(([y0, c], i) => {
    const y1 = i + 1 < GROUND.length ? GROUND[i + 1][0] : SH;
    g.fillStyle = c;
    g.fillRect(0, y0, w, y1 - y0);
    if (i) dither(g, y0, w, c, GROUND[i - 1][1]);
  });
  g.fillStyle = '#2a4e30';
  g.fillRect(0, 66, w, 1);
  // chemin de terre en perspective
  const pathAt = (y) => ({ cx: Math.round(w / 2 + Math.sin((y - 66) / 14) * 6), hw: Math.round(3 + (y - 66) * 0.5) });
  for (let y = 67; y < SH; y++) {
    const { cx, hw } = pathAt(y);
    g.fillStyle = '#a8845a';
    g.fillRect(cx - hw, y, hw * 2, 1);
    px(g, cx - hw - 1, y, '#7a5e3e');
    px(g, cx + hw, y, '#8a6a48');
    if (y % 3 === 0) px(g, cx - hw + ((y * 7) % Math.max(1, hw * 2)), y, '#c4a274');
  }
  for (let i = 0; i < 30; i++) {
    const y = 72 + Math.floor(hash(i, 51) * 46), { cx, hw } = pathAt(y);
    const x = cx - hw + 1 + Math.floor(hash(i, 52) * Math.max(1, hw * 2 - 2));
    px(g, x, y, '#d8bc8c');
    px(g, x + 1, y, '#8a6a48');
  }
  const onPath = (x, y) => { const { cx, hw } = pathAt(y); return x >= cx - hw - 2 && x <= cx + hw + 1; };
  // touffes d'herbe (plus grandes devant), fleurs, cailloux
  for (let i = 0; i < w * 0.9; i++) {
    const x = Math.floor(hash(i, 61) * w), y = 69 + Math.floor(hash(i, 62) * 50);
    if (onPath(x, y)) continue;
    const big = y > 92;
    px(g, x, y, '#3e7a30');
    px(g, x - 1, y - 1, '#7ec050');
    px(g, x + 1, y - 1, '#6aae46');
    if (big) { px(g, x, y - 2, '#9ad060'); px(g, x - 1, y, '#3e7a30'); px(g, x + 1, y, '#3e7a30'); }
  }
  const FLOWERS = ['#ffffff', '#fbe08a', '#e2334a', '#c89af0', '#ffb030'];
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(hash(i, 71) * w), y = 72 + Math.floor(hash(i, 72) * 44);
    if (onPath(x, y)) continue;
    const c = FLOWERS[Math.floor(hash(i, 73) * FLOWERS.length)];
    px(g, x, y, c);
    px(g, x + 2, y + 1, c);
    px(g, x + 1, y + 2, '#3e7a30');
  }
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(hash(i, 81) * w), y = 80 + Math.floor(hash(i, 82) * 34);
    if (onPath(x, y)) continue;
    g.fillStyle = '#2e2a30';
    g.fillRect(x - 1, y - 1, 6, 4);
    g.fillStyle = '#8a8a96';
    g.fillRect(x, y, 4, 2);
    g.fillStyle = '#b4b4c0';
    g.fillRect(x, y, 2, 1);
  }
  // hautes herbes au premier plan
  for (let x = 0; x < w; x++) {
    const h = 1 + Math.floor(hash(x, 91) * 4);
    for (let j = 0; j < h; j++) px(g, x, SH - 1 - j, j === h - 1 ? '#5a9a42' : '#2e5e2a');
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

function crypte(g, w) {
  const c = w / 2, lights = [{ x: c - 30, y: 30, r: [6, 14, 26] }, { x: c + 30, y: 30, r: [6, 14, 26] }, { x: c, y: 86, r: [10, 24, 46] }];
  dungeon(g, { w, lights, pillars: [c - 114, c + 106] });
  alcove(g, c - 72, 26);
  alcove(g, c + 72, 26);
  banner(g, c, 6, 22, '#8a1a28', '#6a1420');
  // toiles d'araignée dans les coins
  for (let i = 0; i < 9; i++) { px(g, i, 9 - i, '#8a8088'); px(g, w - 1 - i, 9 - i, '#8a8088'); }
  for (let i = 0; i < 6; i++) { px(g, i, 4, '#6a6068'); px(g, 4, i, '#6a6068'); px(g, w - 1 - i, 4, '#6a6068'); px(g, w - 5, i, '#6a6068'); }
}

// ---------------------------------------------------------------- volcan

function volcan(g, sw) {
  const lights = [{ x: sw / 2, y: 120, r: [20, 40, 70] }, { x: 30, y: 70, r: [6, 14, 26] }, { x: sw - 30, y: 66, r: [6, 14, 26] }];
  const ROCK = ['#1c1216', '#2c1a1c', '#44221e', '#6a2e1e'];
  for (let y = 0; y < SH; y++)
    for (let x = 0; x < sw; x++) {
      const lv = light(lights, x, y);
      const cell = hash(Math.floor(x / 10 + Math.floor(y / 8) * 0.5), Math.floor(y / 8));
      let c = ROCK[lv];
      if (y < 70 && (x + Math.floor(cell * 10)) % 10 === 0) c = '#120a0c';
      if (y >= 70 && (y - 70) % 9 === 0) c = '#120a0c';
      px(g, x, y, c);
    }
  // stalactites
  for (let i = 0; i * 14 < sw; i++) {
    const x = i * 14 + Math.floor(hash(i, 101) * 8), h = 6 + Math.floor(hash(i, 102) * 14);
    for (let j = 0; j < h; j++) {
      const half = Math.max(0, Math.floor((1 - j / h) * 3));
      for (let k = -half; k <= half; k++) px(g, x + k, j, k < 0 ? '#2c1a1c' : '#140c0e');
    }
  }
  // cascades de lave au fond
  for (const lx of [sw * 0.22, sw * 0.78]) {
    const x0 = Math.round(lx);
    g.fillStyle = '#ff6a1f';
    g.fillRect(x0 - 2, 10, 5, 52);
    g.fillStyle = '#ffb030';
    g.fillRect(x0 - 1, 10, 2, 52);
  }
  // fissures de lave
  g.fillStyle = '#ff6a1f';
  for (let i = 0; i < 9; i++) {
    let x = Math.floor(hash(i, 9) * sw), y = 72 + Math.floor(hash(i, 8) * 40);
    for (let k = 0; k < 8; k++) {
      g.fillRect(x, y, 1, 1);
      x += 1;
      y += hash(i, k) < 0.5 ? 0 : hash(i, k + 3) < 0.5 ? 1 : -1;
    }
  }
  // rivière de lave
  for (let x = 0; x < sw; x++) {
    const h = 3 + Math.round(Math.sin(x / 6) * 1.5);
    g.fillStyle = '#ff6a1f';
    g.fillRect(x, 64 - h, 1, h);
    g.fillStyle = '#ffb030';
    if (x % 7 < 3) g.fillRect(x, 64 - h, 1, 1);
  }
  // rochers sombres au premier plan
  for (const [x0, dir] of [[0, 1], [sw - 1, -1]]) {
    for (let j = 0; j < 22; j++) {
      const h = Math.max(0, 14 - Math.floor(j * 0.7) + (j % 3));
      for (let y = SH - h; y < SH; y++) px(g, x0 + dir * j, y, y === SH - h ? '#3a2228' : '#100a0c');
    }
  }
}

// ---------------------------------------------------------------- pièces du camp

// Salle de l'équipe : râtelier d'armes, armure, bannière.
function teamRoom(g) {
  const lights = [{ x: 90, y: 28, r: [6, 14, 26] }, { x: 210, y: 28, r: [6, 14, 26] }];
  dungeon(g, { w: CAMP_W, lights, pillars: [40, 252] });
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

// Salle d'invocation : cercle de runes, bougies, bannières violettes.
const RUNE = { x: 110, y: 101, rx: 40, ry: 9 };
function summonRoom(g) {
  const lights = [{ x: 60, y: 28, r: [6, 14, 26] }, { x: 240, y: 28, r: [6, 14, 26] }, { x: 110, y: 74, r: [10, 22, 40] }];
  dungeon(g, { w: CAMP_W, lights, pillars: [20, 196] });
  // lueur violette tramée autour du cristal et du cercle
  for (let y = 30; y < SH; y++)
    for (let x = 50; x < 170; x++) {
      const d = Math.hypot((x - 110) / 1.6, y - 80);
      if (d < 22 ? (x + y) % 2 === 0 : d < 34 && (x + y) % 4 === 0) px(g, x, y, d < 14 ? '#4a2c5c' : '#3a2448');
    }
  banner(g, 78, 8, 24, '#62349a', '#4a2386');
  banner(g, 142, 8, 24, '#62349a', '#4a2386');
  // estrade de pierre
  g.fillStyle = '#1a1114';
  g.fillRect(84, 88, 53, 8);
  g.fillStyle = '#6a6068';
  g.fillRect(85, 88, 51, 6);
  g.fillStyle = '#8a8088';
  g.fillRect(85, 88, 51, 1);
  g.fillStyle = '#4a4048';
  g.fillRect(85, 93, 51, 1);
  // cercle de runes au sol
  for (let a = 0; a < 360; a += 2) {
    const r = (a * Math.PI) / 180;
    px(g, Math.round(RUNE.x + Math.cos(r) * RUNE.rx), Math.round(RUNE.y + Math.sin(r) * RUNE.ry), '#62349a');
    px(g, Math.round(RUNE.x + Math.cos(r) * (RUNE.rx - 4)), Math.round(RUNE.y + Math.sin(r) * (RUNE.ry - 2)), '#4a2386');
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

const CANDLES = [[72, 104], [84, 110], [136, 110], [148, 104], [96, 96], [124, 96]];

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

const SCENES = {
  // Le camp est plus large (300) pour remplir les écrans très allongés ; centre en x = 150.
  camp: {
    fixed: CAMP_W,
    lights: [{ x: 108, y: 28, r: [6, 14, 26] }, { x: 192, y: 28, r: [6, 14, 26] }, { x: 150, y: 88, r: [14, 30, 52] }],
    draw(g) { dungeon(g, { w: CAMP_W, lights: this.lights, pillars: [56, 236], gate: { x: 135, w: 30 } }); },
    anim(g, step) {
      torch(g, 108, 28, step);
      torch(g, 192, 28, step + 1);
      campfire(g, 150, 92, step);
    },
  },
  teamRoom: {
    fixed: CAMP_W,
    draw: teamRoom,
    anim(g, step) { torch(g, 90, 28, step); torch(g, 210, 28, step + 1); },
  },
  summonRoom: {
    fixed: CAMP_W,
    draw: summonRoom,
    anim(g, step) {
      torch(g, 60, 28, step);
      torch(g, 240, 28, step + 1);
      CANDLES.forEach(([x, y], i) => candle(g, x, y, step + i));
      // runes qui s'allument tour à tour sur le cercle
      for (let i = 0; i < 6; i++) {
        const a = ((step * 8 + i * 60) * Math.PI) / 180;
        const x = Math.round(RUNE.x + Math.cos(a) * (RUNE.rx - 2)), y = Math.round(RUNE.y + Math.sin(a) * (RUNE.ry - 1));
        px(g, x, y, '#c89af0');
        px(g, x + 1, y, '#ffffff');
      }
    },
  },
  // Les décors de combat s'adaptent à la largeur de l'écran (centre en x = w / 2).
  prairie: { draw: prairie, anim() {} },
  crypte: {
    draw: crypte,
    anim(g, step, w) {
      torch(g, w / 2 - 30, 30, step);
      torch(g, w / 2 + 30, 30, step + 1);
      brazier(g, w / 2, 86, step);
      candle(g, w / 2 - 68, 52, step);
      candle(g, w / 2 + 76, 52, step + 1);
    },
  },
  volcan: {
    draw: volcan,
    anim(g, step, w) {
      for (let i = 0; i < 7; i++) {
        const t = (step + i * 4) % 14, x = Math.round((w / 7) * i + 16 + (t % 3));
        px(g, x, 66 - t * 4, t < 8 ? '#ffb030' : '#ff6a1f');
      }
      // reflets qui descendent dans les cascades de lave
      for (const lx of [w * 0.22, w * 0.78]) for (let k = 0; k < 3; k++) px(g, Math.round(lx), 10 + ((step * 3 + k * 17) % 52), '#fbe08a');
    },
  },
};

// Décor fixe (mis en cache), à redessiner à chaque image avant les éléments animés.
export function sceneBackground(name, w = SW) {
  const sc = SCENES[name], width = sc.fixed || w, key = name + width;
  if (!STATIC[key]) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = SH;
    sc.draw(c.getContext('2d'), width);
    STATIC[key] = c;
  }
  return STATIC[key];
}

export function sceneAnim(name, g, step, w = SW) {
  SCENES[name].anim(g, step, w);
}

// Zone de la porte du camp (pixels d'art), pour savoir si on la touche.
export const GATE = { x0: 132, y0: 16, x1: 168, y1: 76 };
