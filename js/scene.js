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

function prairie(g, sw) {
  const sky = ['#5a86d8', '#6a96e0', '#7aa6e8', '#8ab6ee', '#a8c8f0', '#f0d8a8'];
  sky.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, i * 8, sw, 8); });
  // montagnes en paliers
  for (let x = 0; x < sw; x++) {
    const h = 14 + Math.round(8 * Math.sin(x / 19) + 5 * Math.sin(x / 7.3));
    g.fillStyle = '#6a74a8';
    g.fillRect(x, 48 - h, 1, h);
    g.fillStyle = '#8a94c0';
    if ((x + h) % 5 === 0) g.fillRect(x, 48 - h, 1, 2);
  }
  // collines
  for (let x = 0; x < sw; x++) {
    const h = 6 + Math.round(4 * Math.sin(x / 13 + 1));
    g.fillStyle = '#3e7a3a';
    g.fillRect(x, 58 - h, 1, h + 4);
  }
  // arbres
  for (let i = 0; i < 14; i++) {
    const x = (i * 41 + 7) % sw, y = 54 + (i % 3) * 2;
    g.fillStyle = OUTLINE;
    g.fillRect(x - 4, y - 9, 9, 9);
    g.fillStyle = '#2e6a32';
    g.fillRect(x - 3, y - 8, 7, 7);
    g.fillStyle = '#4a8a3a';
    g.fillRect(x - 3, y - 8, 4, 3);
    g.fillStyle = '#5a3a22';
    g.fillRect(x, y - 1, 1, 3);
  }
  // sol
  g.fillStyle = '#4a8a3a';
  g.fillRect(0, 60, sw, SH - 60);
  g.fillStyle = '#3e7a34';
  for (let y = 60; y < SH; y += 6) g.fillRect(0, y, sw, 1);
  // chemin
  for (let y = 60; y < SH; y++) {
    const w = 10 + (y - 60), cx = sw / 2 + Math.round(Math.sin(y / 9) * 4);
    g.fillStyle = (y % 4 === 0) ? '#8a6a4a' : '#9a7a52';
    g.fillRect(cx - w, y, w * 2, 1);
  }
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(hash(i, 1) * sw), y = 62 + Math.floor(hash(i, 2) * (SH - 63));
    g.fillStyle = hash(i, 3) < 0.5 ? '#6aaa4a' : '#5a9a42';
    g.fillRect(x, y, 2, 1);
    g.fillRect(x + 1, y - 1, 1, 1);
    if (hash(i, 4) < 0.15) { g.fillStyle = hash(i, 5) < 0.5 ? '#f0d040' : '#e2334a'; g.fillRect(x, y - 2, 1, 1); }
  }
}

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
  // rivière de lave au fond
  for (let x = 0; x < sw; x++) {
    const h = 3 + Math.round(Math.sin(x / 6) * 1.5);
    g.fillStyle = '#ff6a1f';
    g.fillRect(x, 64 - h, 1, h);
    g.fillStyle = '#ffb030';
    if (x % 7 < 3) g.fillRect(x, 64 - h, 1, 1);
  }
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
  // Les décors de combat s'adaptent à la largeur de l'écran (centre en x = w / 2).
  prairie: { draw: prairie, anim() {} },
  crypte: {
    lights: (w) => [{ x: w / 2 - 60, y: 30, r: [6, 14, 26] }, { x: w / 2 + 60, y: 30, r: [6, 14, 26] }],
    draw(g, w) { dungeon(g, { w, lights: this.lights(w), pillars: [w / 2 - 100, w / 2 - 4, w / 2 + 92] }); },
    anim(g, step, w) { torch(g, w / 2 - 60, 30, step); torch(g, w / 2 + 60, 30, step + 1); },
  },
  volcan: {
    draw: volcan,
    anim(g, step, w) {
      for (let i = 0; i < 7; i++) {
        const t = (step + i * 4) % 14, x = Math.round((w / 7) * i + 16 + (t % 3));
        px(g, x, 66 - t * 4, t < 8 ? '#ffb030' : '#ff6a1f');
      }
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
