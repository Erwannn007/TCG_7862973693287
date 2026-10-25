// Effets de combat en pixel art : poses animées des combattants, et effets visuels propres à
// chaque personnage (attaque, compétence, garde). Pour un nouveau héros : ajouter sa fiche dans
// HERO_FX (couleurs, attaque, compétence, distance) — ses poses sont fabriquées automatiquement.
// Règles : pixels entiers, animations par paliers, effets courts (moins d'une demi-seconde).
import { OUTLINE } from './spr.js';

// ---------------------------------------------------------------- poses

// Une pose penche le sprite rangée par rangée (les pieds restent au sol) : tout reste net, et ça
// marche pour n'importe quel sprite (rangs, tenues, futurs héros).
//   lean : décalage de la tête en pixels (vers l'avant si > 0) ; lift : saut vers le haut.
export const POSES = {
  windup: { lean: -2, lift: 0 }, // il prend son élan, penché en arrière
  strike: { lean: 3, lift: 0 }, // il frappe, penché en avant
  cast: { lean: -1, lift: 2 }, // il lève les bras (incantation)
  guard: { lean: -1, lift: -1 }, // il se ramasse derrière sa garde
  hurt: { lean: -3, lift: 0 }, // il encaisse
};
const poseCache = new WeakMap();
export const POSE_PAD = 4; // marge de chaque côté de l'image posée

// Image posée (mise en cache) d'un bitmap { canvas, w, h } ; dir = 1 (regarde à droite) ou -1.
export function posed(bm, pose, dir) {
  let m = poseCache.get(bm.canvas);
  if (!m) poseCache.set(bm.canvas, (m = new Map()));
  const key = pose + dir;
  if (m.has(key)) return m.get(key);
  const P = POSES[pose], c = document.createElement('canvas');
  c.width = bm.w + POSE_PAD * 2;
  c.height = bm.h;
  const g = c.getContext('2d');
  for (let y = 0; y < bm.h; y++) {
    const k = 1 - y / (bm.h - 1); // 1 en haut, 0 aux pieds
    const dx = Math.round(P.lean * dir * k);
    g.drawImage(bm.canvas, 0, y, bm.w, 1, POSE_PAD + dx, y - (y < bm.h - 3 ? P.lift : 0), bm.w, 1);
  }
  m.set(key, c);
  return c;
}

// ---------------------------------------------------------------- petits outils de dessin

const px = (g, x, y, c, s = 1) => {
  g.fillStyle = c;
  g.fillRect(Math.round(x), Math.round(y), s, s);
};
const lerp = (a, b, q) => a + (b - a) * q;

// Gerbe d'étincelles qui part d'un point en 8 directions.
function burst(g, x, y, q, cols, r = 9) {
  if (q > 0.9) return;
  const d = 2 + q * r;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + (i % 2) * 0.3;
    px(g, x + Math.cos(a) * d, y + Math.sin(a) * d, i % 2 ? cols[0] : cols[1], q < 0.5 ? 2 : 1);
    if (q < 0.4) px(g, x + Math.cos(a) * d * 0.5, y + Math.sin(a) * d * 0.5, '#ffffff');
  }
}

// Anneau qui s'élargit (onde de choc).
function ring(g, x, y, q, col, r = 14) {
  const rr = 2 + q * r;
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    if (q < 0.85 || i % 2) px(g, x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6, col);
  }
}

// Croissant de lame qui balaie : la tête est blanche, la traînée prend la couleur du héros.
function slash(g, x, y, q, dir, cols, r = 10, a0 = -110, a1 = 70) {
  const head = a0 + (a1 - a0) * Math.min(1, q * 1.4), tail = Math.max(a0, head - 90);
  if (q > 0.85) return;
  for (let a = tail; a <= head; a += 7) {
    const t = (a - tail) / Math.max(1, head - tail), rad = (a * Math.PI) / 180;
    const c = t > 0.85 ? '#ffffff' : t > 0.5 ? cols[1] : cols[0];
    const sx = x + Math.cos(rad) * r * dir, sy = y + Math.sin(rad) * r;
    px(g, sx, sy, c, t > 0.5 ? 2 : 1);
    if (t > 0.3) px(g, x + Math.cos(rad) * (r - 2) * dir, y + Math.sin(rad) * (r - 2), cols[0]);
  }
}

// ---------------------------------------------------------------- effets par personnage

// Chaque effet : (g, q, e) où q va de 0 à 1 par paliers, e = { a, d (cibles), dir, rank, cols }.
// Les positions viennent de l'unité : centre e.x / e.y, cible e.tx / e.ty.

const FX = {
  // --- Kael : lame d'acier
  slash(g, q, e) {
    slash(g, e.tx, e.ty, q, e.dir, e.cols, 9 + e.rank);
    if (q > 0.35) burst(g, e.tx, e.ty, (q - 0.35) / 0.65, e.cols, 6 + e.rank);
  },
  // Taille croisée : deux entailles en X, puis le X s'illumine
  cross(g, q, e) {
    const r = 11 + e.rank;
    slash(g, e.tx, e.ty, Math.min(1, q * 2), e.dir, e.cols, r, -135, 45);
    if (q > 0.3) slash(g, e.tx, e.ty, Math.min(1, (q - 0.3) * 2), -e.dir, e.cols, r, -135, 45);
    if (q > 0.6) {
      const k = Math.round((1 - q) * 10);
      for (let i = -k; i <= k; i++) {
        px(g, e.tx + i, e.ty + i, '#ffffff');
        px(g, e.tx + i, e.ty - i, '#ffffff');
      }
      burst(g, e.tx, e.ty, (q - 0.6) / 0.4, e.cols, 12);
    }
  },
  // --- Lyra : flèche
  arrow(g, q, e) {
    const x = lerp(e.x + 8 * e.dir, e.tx, q), y = lerp(e.y - 2, e.ty, q) - Math.sin(q * Math.PI) * 6;
    // pointe blanche, hampe de bois, empennage de la couleur du héros
    for (let i = 0; i < 9; i++) px(g, x - i * e.dir, y, i < 2 ? '#ffffff' : i < 7 ? '#d8b878' : e.cols[0]);
    px(g, x - 1 * e.dir, y - 1, '#ffffff');
    px(g, x - 1 * e.dir, y + 1, '#ffffff');
    for (const o of [-1, 1]) {
      px(g, x - 7 * e.dir, y + o, e.cols[1]);
      px(g, x - 8 * e.dir, y + o * 2, e.cols[0]);
    }
    for (let i = 1; i < 4; i++) px(g, lerp(e.x, e.tx, q - i * 0.06), lerp(e.y - 2, e.ty, q - i * 0.06), e.cols[1]);
  },
  // Flèche sonnante : grosse flèche lumineuse, puis onde qui assomme
  ringArrow(g, q, e) {
    FX.arrow(g, Math.min(1, q * 1.5), e);
    if (q < 0.66) for (let i = 0; i < 3; i++) px(g, lerp(e.x, e.tx, q * 1.5) - i * 3 * e.dir, lerp(e.y, e.ty, q * 1.5) + (i % 2 ? -2 : 2), e.cols[1]);
    if (q > 0.6) {
      const k = (q - 0.6) / 0.4;
      ring(g, e.tx, e.ty, k, e.cols[1], 16);
      ring(g, e.tx, e.ty, Math.max(0, k - 0.25), '#ffffff', 12);
    }
  },
  // --- Elio : orbe magique
  bolt(g, q, e) {
    const x = lerp(e.x + 10 * e.dir, e.tx, q), y = lerp(e.y - 8, e.ty, q);
    for (let i = 1; i < 5; i++) px(g, lerp(e.x + 10 * e.dir, e.tx, q - i * 0.05), lerp(e.y - 8, e.ty, q - i * 0.05) + ((i * 3) % 3) - 1, e.cols[i % 2]);
    g.fillStyle = e.cols[0];
    g.fillRect(Math.round(x) - 2, Math.round(y) - 1, 5, 3);
    g.fillRect(Math.round(x) - 1, Math.round(y) - 2, 3, 5);
    px(g, x, y, '#ffffff');
  },
  // Météore : un rocher de feu tombe sur chaque ennemi, puis explose
  meteor(g, q, e) {
    for (const [i, d] of e.d.entries()) {
      const k = Math.max(0, Math.min(1, q * 1.6 - i * 0.18));
      if (k <= 0) continue;
      if (k < 0.65) {
        const f = k / 0.65, x = lerp(d.tx - 30, d.tx, f), y = lerp(-8, d.ty, f);
        for (let j = 1; j < 7; j++) px(g, x - j * 2.5, y - j * 4, j < 3 ? '#fbe08a' : j < 5 ? '#ff6a1f' : '#8a3a1c', j < 3 ? 2 : 1);
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7);
        g.fillStyle = '#ff6a1f';
        g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
        px(g, x - 1, y - 1, '#fbe08a', 2);
      } else {
        const f = (k - 0.65) / 0.35;
        burst(g, d.tx, d.ty, f, ['#ff6a1f', '#fbe08a'], 14);
        ring(g, d.tx, d.ty + 6, f, '#ffb030', 18);
      }
    }
  },
  // --- Séra : lumière sacrée
  holy(g, q, e) {
    const x = lerp(e.x + 6 * e.dir, e.tx, q), y = lerp(e.y - 10, e.ty, q), f = Math.round(q * 8) % 2;
    // orbe de lumière en losange, scintillement en croix qui tourne
    g.fillStyle = e.cols[0];
    g.fillRect(Math.round(x) - 2, Math.round(y) - 1, 5, 3);
    g.fillRect(Math.round(x) - 1, Math.round(y) - 2, 3, 5);
    px(g, x - 1, y - 1, e.cols[1], 3);
    px(g, x, y, '#ffffff');
    for (let i = 3; i <= 5; i++) {
      px(g, f ? x + i : x + i * 0.7, f ? y : y + i * 0.7, e.cols[1]);
      px(g, f ? x - i : x - i * 0.7, f ? y : y - i * 0.7, e.cols[1]);
    }
    for (let i = 1; i < 4; i++) px(g, lerp(e.x + 6 * e.dir, e.tx, q - i * 0.07), lerp(e.y - 10, e.ty, q - i * 0.07), e.cols[0]);
    if (q > 0.8) burst(g, e.tx, e.ty, (q - 0.8) / 0.2, e.cols, 8);
  },
  // Bénédiction : une colonne de lumière tombe sur chaque allié, des croix montent
  pillars(g, q, e) {
    for (const d of e.d) {
      const w = q < 0.3 ? 2 + Math.round(q * 20) : Math.max(0, Math.round(8 - (q - 0.3) * 10));
      g.globalAlpha = 0.45;
      g.fillStyle = e.cols[1];
      g.fillRect(Math.round(d.tx - w / 2), 0, w, Math.round(d.ty + 10));
      g.globalAlpha = 1;
      for (let i = 0; i < 4; i++) {
        const t = (q * 2 + i * 0.25) % 1, cx = d.tx - 8 + i * 5, cy = d.ty + 8 - t * 22;
        if (q < 0.15) continue;
        px(g, cx, cy, '#ffffff');
        px(g, cx - 1, cy, e.cols[0]);
        px(g, cx + 1, cy, e.cols[0]);
        px(g, cx, cy - 1, e.cols[0]);
        px(g, cx, cy + 1, e.cols[0]);
      }
    }
  },
  // --- Volt : lame plasma
  plasma(g, q, e) {
    if (q > 0.8) return;
    const L = 12 + e.rank * 2;
    for (const s of [-1, 1]) {
      const k = Math.min(1, q * 2.5 - (s > 0 ? 0.4 : 0));
      if (k <= 0) continue;
      for (let i = 0; i < L * k; i++) {
        const x = e.tx - (L / 2) * e.dir + i * e.dir, y = e.ty - L / 2 * s * 0.6 + i * s * 0.6;
        px(g, x, y, i > L * k - 3 ? '#ffffff' : e.cols[0]);
        px(g, x, y + 1, e.cols[1]);
      }
    }
  },
  // Lame plasma (compétence) : ruée en ligne de néon et images rémanentes
  dash(g, q, e) {
    if (q < 0.5) {
      const x0 = e.x, x1 = lerp(e.x, e.tx, q * 2);
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x += 1) {
        px(g, x, e.ty, (x | 0) % 3 ? e.cols[0] : '#ffffff');
        if ((x | 0) % 4 === 0) px(g, x, e.ty - 3 + ((x | 0) % 7), e.cols[1]);
      }
    }
    FX.plasma(g, Math.max(0, (q - 0.3) / 0.7), e);
    if (q > 0.5) burst(g, e.tx, e.ty, (q - 0.5) / 0.5, e.cols, 10);
  },
  // --- garde : bouclier de lumière devant le héros
  shield(g, q, e) {
    const a = q < 0.2 ? q / 0.2 : 1 - (q - 0.2) / 0.8, x = e.x + 9 * e.dir;
    if (a <= 0) return;
    for (let y = -10; y <= 8; y++) {
      const w = Math.round(Math.sqrt(Math.max(0, 1 - (y / 10) ** 2)) * 3);
      px(g, x + w * e.dir, e.y + y, (y + Math.round(q * 20)) % 4 ? e.cols[0] : '#ffffff');
      if (q < 0.5) px(g, x + (w - 1) * e.dir, e.y + y, e.cols[1]);
    }
  },
  // --- ennemis
  splat(g, q, e) {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2, d = 3 + q * 10;
      px(g, e.tx + Math.cos(a) * d, e.ty + Math.sin(a) * d * 0.7 + q * q * 8, i % 2 ? e.cols[0] : e.cols[1], 2);
    }
  },
  claw(g, q, e) {
    if (q > 0.8) return;
    for (let s = 0; s < 3; s++) {
      const k = Math.min(1, q * 3 - s * 0.4);
      for (let i = 0; i < 10 * k; i++) px(g, e.tx - 5 + s * 4 - i * e.dir * 0.5 + i * 0.3, e.ty - 6 + i, i > 10 * k - 2 ? '#ffffff' : e.cols[0]);
    }
  },
  // Séisme du golem : le sol se fend sous chaque héros
  quake(g, q, e) {
    for (const d of e.d) {
      for (let i = -14; i <= 14; i++) if (Math.abs(i) < q * 20) px(g, d.tx + i, d.ty + 10 + ((i * 7) % 3) - 1, i % 3 ? '#3a2228' : '#8a7068');
      if (q > 0.3) burst(g, d.tx, d.ty + 8, (q - 0.3) / 0.7, ['#8a7068', '#c8b8a8'], 12);
    }
  },
  // Souffle de feu du dragon : un flot de flammes vers chaque héros
  fire(g, q, e) {
    for (const d of e.d)
      for (let i = 0; i < 18; i++) {
        const k = Math.min(1, q * 1.4) - i * 0.04;
        if (k <= 0 || k > 1) continue;
        const x = lerp(e.x - 10, d.tx, k), y = lerp(e.y - 6, d.ty, k) + Math.sin(i * 2.3 + q * 9) * 3;
        px(g, x, y, i % 3 === 0 ? '#fbe08a' : i % 3 === 1 ? '#ff6a1f' : '#c83020', i % 2 ? 2 : 3);
      }
  },
};

// ---------------------------------------------------------------- fiches des personnages

// cols : [couleur principale, éclat] ; ranged : attaque à distance (le héros ne s'avance pas) ;
// sound : son de son attaque.
export const HERO_FX = {
  kael: { cols: ['#c8323c', '#ffd0c8'], attack: 'slash', skill: 'cross', ranged: false, sound: 'slash', skillSound: 'slash' },
  lyra: { cols: ['#4f9e3c', '#c8f0a0'], attack: 'arrow', skill: 'ringArrow', ranged: true, sound: 'arrow', skillSound: 'arrow' },
  elio: { cols: ['#5ab4ff', '#d8f4ff'], attack: 'bolt', skill: 'meteor', ranged: true, sound: 'zap', skillSound: 'boom' },
  sera: { cols: ['#ff9ac8', '#fff4c0'], attack: 'holy', skill: 'pillars', ranged: true, sound: 'holy', skillSound: 'heal' },
  volt: { cols: ['#4ff0e8', '#c8fff8'], attack: 'plasma', skill: 'dash', ranged: false, sound: 'plasma', skillSound: 'plasma' },
};
export const ENEMY_FX = {
  slime: { cols: ['#5cc85a', '#d8ffd0'], attack: 'splat', sound: 'hit' },
  goblin: { cols: ['#c8a870', '#ffffff'], attack: 'claw', sound: 'hit' },
  skeleton: { cols: ['#d8d0bc', '#ffffff'], attack: 'slash', sound: 'slash' },
  golem: { cols: ['#8a8088', '#c8c0c8'], attack: 'claw', skill: 'quake', sound: 'hit' },
  dragon: { cols: ['#ff6a1f', '#fbe08a'], attack: 'claw', skill: 'fire', sound: 'hit' },
};

// Au rang 4 les effets se dorent, au rang 5 (Céleste) ils deviennent blanc et or.
export function fxColors(prof, rank) {
  if (rank >= 5) return ['#fbe08a', '#ffffff'];
  if (rank === 4) return [prof.cols[0], '#fbe08a'];
  return prof.cols;
}

export function drawEffect(name, g, q, e) {
  FX[name]?.(g, q, e);
}
