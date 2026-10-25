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

// ---------------------------------------------------------------- effets des tenues

// Petites étoiles qui tournent au-dessus d'une tête (sonné).
function dizzy(g, x, y, q, col, n = 3) {
  for (let i = 0; i < n; i++) {
    const a = q * 9 + (i / n) * Math.PI * 2;
    px(g, x + Math.cos(a) * 7, y - 10 + Math.sin(a) * 2, i % 2 ? '#ffffff' : col);
  }
}
// Petits cubes de 2 px qui volent et retombent.
function cubes(g, x, y, q, cols, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i - n / 2) * 0.35, v = 6 + (i % 3) * 3;
    const cx = x + Math.cos(a) * v * q * 1.6, cy = y + Math.sin(a) * v * q * 1.6 + q * q * 18;
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(cx) - 1, Math.round(cy) - 1, 4, 4);
    px(g, cx, cy, cols[i % cols.length], 2);
  }
}
// Projectile en cloche générique : dessine draw(x, y) le long de la trajectoire.
const arc = (e, q, h, draw) => draw(lerp(e.x + 8 * e.dir, e.tx, q), lerp(e.y - 4, e.ty, q) - Math.sin(q * Math.PI) * h);

Object.assign(FX, {
  // --- Kael en slip : coup d'épée en bois, étoiles qui tournent
  bonk(g, q, e) {
    if (q < 0.4) slash(g, e.tx, e.ty, q * 2.5, e.dir, ['#a8703a', '#e0b07a'], 8);
    else {
      burst(g, e.tx, e.ty - 4, (q - 0.4) / 0.6, ['#fbe08a', '#ffffff'], 7);
      dizzy(g, e.tx, e.ty, q, '#fbe08a');
    }
  },
  bonkX(g, q, e) {
    FX.cross(g, q, { ...e, cols: ['#a8703a', '#fbe08a'] });
    if (q > 0.5) dizzy(g, e.tx, e.ty, q, '#fbe08a', 5);
  },
  // --- mineur cubique : la pioche fait voler des blocs
  blocks(g, q, e) {
    if (q < 0.35) slash(g, e.tx, e.ty, q * 3, e.dir, ['#9aa4ae', '#ffffff'], 9, -120, 40);
    else cubes(g, e.tx, e.ty, (q - 0.35) / 0.65, ['#5cc85a', '#8a5a32', '#9aa4ae', '#3a8e3e']);
  },
  blockX(g, q, e) {
    // une croix de blocs pixel, puis une pluie de cubes
    const k = Math.min(1, q * 2), r = 12;
    for (let i = -r; i <= r; i += 3) {
      if (Math.abs(i) > r * k) continue;
      px(g, e.tx + i, e.ty + i, '#5cc85a', 3);
      px(g, e.tx + i, e.ty - i, '#8a5a32', 3);
    }
    if (q > 0.45) cubes(g, e.tx, e.ty, (q - 0.45) / 0.55, ['#5cc85a', '#8a5a32', '#9aa4ae', '#4ff0e8'], 12);
  },
  // --- armure de diamant : lame cyan et éclats en losange
  diamond(g, q, e) {
    slash(g, e.tx, e.ty, q, e.dir, ['#4fd8e0', '#c8f6ff'], 10 + e.rank);
    if (q > 0.35) for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + q, d = 4 + (q - 0.35) * 18, x = e.tx + Math.cos(a) * d, y = e.ty + Math.sin(a) * d;
      px(g, x, y - 1, '#c8f6ff'); px(g, x - 1, y, '#4fd8e0'); px(g, x + 1, y, '#2a9ab0'); px(g, x, y + 1, '#4fd8e0');
    }
  },
  diamondX(g, q, e) {
    FX.cross(g, q, { ...e, cols: ['#4fd8e0', '#ffffff'] });
    if (q > 0.5) FX.diamond(g, (q - 0.5) * 2, e);
  },
  // --- Lyra pirate : boulet de canon et fumée
  cannon(g, q, e) {
    if (q < 0.8) {
      for (let i = 1; i < 5; i++) arc(e, q - i * 0.06, 8, (x, y) => px(g, x, y, i % 2 ? '#c8c0c8' : '#8a8088', 2));
      arc(e, q, 8, (x, y) => {
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
        px(g, x - 1, y - 1, '#4a4650', 3);
        px(g, x - 1, y - 1, '#a8a0a8');
      });
    } else {
      const k = (q - 0.8) / 0.2;
      burst(g, e.tx, e.ty, k, ['#ff6a1f', '#fbe08a'], 9);
      for (let i = 0; i < 6; i++) px(g, e.tx - 6 + i * 2.5, e.ty - 4 - k * 8 + (i % 2) * 3, '#c8c0c8', 2);
    }
  },
  cannonBlast(g, q, e) {
    FX.cannon(g, Math.min(1, q * 1.4), e);
    if (q > 0.6) {
      const k = (q - 0.6) / 0.4;
      ring(g, e.tx, e.ty, k, '#ff6a1f', 18);
      ring(g, e.tx, e.ty, Math.max(0, k - 0.2), '#c8c0c8', 14);
      dizzy(g, e.tx, e.ty, q, '#fbe08a', 4);
    }
  },
  // --- Elio en pyjama : oreiller et plumes, moutons qui tombent du ciel
  pillow(g, q, e) {
    if (q < 0.75) arc(e, q, 10, (x, y) => {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 4, Math.round(y) - 3, 9, 6);
      g.fillStyle = '#f2eef4';
      g.fillRect(Math.round(x) - 3, Math.round(y) - 2, 7, 4);
      px(g, x - 3, y - 2, '#ffffff', 2);
    });
    else for (let i = 0; i < 7; i++) {
      const k = (q - 0.75) / 0.25, a = (i / 7) * Math.PI * 2;
      px(g, e.tx + Math.cos(a) * (3 + k * 12), e.ty + Math.sin(a) * (3 + k * 8) + k * 4, i % 2 ? '#ffffff' : '#c8d4f0', i % 3 ? 1 : 2);
    }
  },
  sheep(g, q, e) {
    for (const [i, d] of e.d.entries()) {
      const k = Math.max(0, Math.min(1, q * 1.6 - i * 0.18));
      if (k <= 0) continue;
      const y = k < 0.6 ? lerp(-12, d.ty - 4, k / 0.6) : d.ty - 4 - Math.sin(((k - 0.6) / 0.4) * Math.PI) * 4;
      // un mouton tout rond (laine blanche, tête noire)
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(d.tx) - 6, Math.round(y) - 4, 13, 9);
      g.fillStyle = '#f2eef4';
      g.fillRect(Math.round(d.tx) - 5, Math.round(y) - 3, 11, 6);
      px(g, d.tx - 4, y - 3, '#ffffff', 2);
      // bouclettes de laine sur le dos
      for (const bx of [-4, -1, 2]) {
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(d.tx) + bx - 1, Math.round(y) - 6, 4, 3);
        px(g, d.tx + bx, y - 5, '#ffffff', 2);
      }
      g.fillStyle = '#2a2234';
      g.fillRect(Math.round(d.tx) + 4 * e.dir - 1, Math.round(y) - 2, 3, 3);
      for (const lx of [-4, -1, 2, 4]) { px(g, d.tx + lx, y + 5, '#2a2234'); px(g, d.tx + lx, y + 6, '#2a2234'); }
      if (k > 0.6) for (let z = 0; z < 3; z++) {
        const zz = (k - 0.6) / 0.4;
        const zx = d.tx + 6 + z * 3, zy = y - 8 - z * 4 - zz * 6;
        px(g, zx, zy, '#c8d4f0'); px(g, zx + 1, zy, '#c8d4f0'); px(g, zx + 1, zy + 1, '#c8d4f0'); px(g, zx, zy + 2, '#c8d4f0'); px(g, zx + 1, zy + 2, '#c8d4f0');
      }
    }
  },
  // --- Séra sorcière : fiole verte qui éclate en bulles, chaudron de bulles qui soignent
  potion(g, q, e) {
    if (q < 0.75) arc(e, q, 12, (x, y) => {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 2, Math.round(y) - 3, 5, 7);
      px(g, x - 1, y - 1, '#7af06a', 3);
      px(g, x, y - 3, '#c8a870');
      px(g, x - 1, y - 1, '#ffffff');
    });
    else for (let i = 0; i < 8; i++) {
      const k = (q - 0.75) / 0.25, a = (i / 8) * Math.PI * 2, r = 2 + k * 10;
      px(g, e.tx + Math.cos(a) * r, e.ty + Math.sin(a) * r * 0.7 - k * 6, i % 2 ? '#7af06a' : '#d8ffd0', 2);
    }
  },
  cauldron(g, q, e) {
    for (const d of e.d) {
      g.globalAlpha = 0.35;
      g.fillStyle = '#7af06a';
      g.fillRect(Math.round(d.tx) - 10, Math.round(d.ty) + 6, 21, 3);
      g.globalAlpha = 1;
      for (let i = 0; i < 6; i++) {
        const t = (q * 2 + i * 0.17) % 1, bx = d.tx - 9 + i * 3.5, by = d.ty + 8 - t * 26;
        if (q < 0.1) continue;
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(bx) - 1, Math.round(by) - 1, 4, 4);
        px(g, bx, by, i % 2 ? '#7af06a' : '#c08aff', 2);
        px(g, bx, by, '#ffffff');
      }
    }
  },
  // --- Volt livreur de pizza : part de pizza, puis livraison express
  pizza(g, q, e) {
    if (q > 0.85) return;
    const x = e.tx - 4 * e.dir, y = e.ty - 3, k = Math.min(1, q * 2.5);
    // une part triangulaire : croûte, fromage, pepperoni
    for (let j = 0; j < 7; j++) {
      const w = Math.round((7 - j) * k);
      for (let i = 0; i <= w; i++) px(g, x + i * e.dir, y + j, j === 0 ? '#c8945a' : '#fbe08a');
      if (j === 2 || j === 4) px(g, x + 2 * e.dir, y + j, '#c83020');
    }
    if (q > 0.4) burst(g, e.tx, e.ty, (q - 0.4) / 0.6, ['#fbe08a', '#c83020'], 8);
  },
  pizzaDash(g, q, e) {
    if (q < 0.5) {
      const x1 = lerp(e.x, e.tx, q * 2);
      for (let x = Math.min(e.x, x1); x <= Math.max(e.x, x1); x += 2) px(g, x, e.ty + ((x | 0) % 4 === 0 ? -1 : 0), (x | 0) % 6 < 3 ? '#d83a3a' : '#ffffff');
    }
    FX.pizza(g, Math.max(0, (q - 0.3) / 0.7), e);
    if (q > 0.5) for (let i = 0; i < 3; i++) {
      const k = (q - 0.5) / 0.5, a = -1.2 - i * 0.5;
      px(g, e.tx + Math.cos(a) * k * 18, e.ty + Math.sin(a) * k * 14 + k * k * 10, '#fbe08a', 3);
    }
  },
  // --- Volt samouraï : coup de katana horizontal et pétales
  katana(g, q, e) {
    if (q < 0.5) for (let i = -10; i <= 10; i++) if (Math.abs(i) < q * 40) px(g, e.tx + i, e.ty + i * 0.15, Math.abs(i) < 3 ? '#ffffff' : '#d8e0e8');
    if (q > 0.3) for (let i = 0; i < 6; i++) {
      const k = (q - 0.3) / 0.7, x = e.tx - 8 + i * 3 + k * 6 * e.dir, y = e.ty - 6 + (i % 3) * 4 + k * 12;
      px(g, x, y, i % 2 ? '#ff9ac8' : '#ffd0e0', 2);
    }
  },
  iai(g, q, e) {
    if (q < 0.45) {
      const x1 = lerp(e.x, e.tx + 10 * e.dir, q / 0.45);
      for (let x = Math.min(e.x, x1); x <= Math.max(e.x, x1); x++) px(g, x, e.ty, (x | 0) % 2 ? '#ffffff' : '#b8283a');
    } else {
      const k = (q - 0.45) / 0.55;
      for (let i = -14; i <= 14; i++) if (k < 0.5) px(g, e.tx + i, e.ty - i * 0.3, '#ffffff', 2);
      for (let i = 0; i < 10; i++) {
        const x = e.tx - 14 + i * 3 + k * 8 * e.dir, y = e.ty - 10 + (i % 4) * 5 + k * 16;
        px(g, x, y, i % 2 ? '#ff9ac8' : '#ffd0e0', 2);
      }
      if (k < 0.6) burst(g, e.tx, e.ty, k / 0.6, ['#b8283a', '#fbe08a'], 10);
    }
  },
});

// ---------------------------------------------------------------- effets des nouveaux héros

// Étoile d'impact à 8 branches (bout blanc), qui grandit puis s'éteint.
function star(g, x, y, q, cols, r = 8) {
  if (q > 0.85) return;
  const L = 2 + Math.round(q * r);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, l = i % 2 ? L * 0.6 : L;
    for (let k = 1; k <= l; k++) px(g, x + Math.cos(a) * k, y + Math.sin(a) * k, k > l - 2 ? '#ffffff' : k % 2 ? cols[0] : cols[1]);
  }
  px(g, x - 1, y - 1, '#ffffff', 3);
}
// Gouttes qui tombent d'un point (sang, eau, poison).
function drops(g, x, y, q, col, n = 5) {
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 3, fall = q * q * 14 + (i % 2) * 2;
    px(g, x + dx + q * dx, y + fall, col, 1);
    px(g, x + dx + q * dx, y + fall + 1, col, 1);
  }
}
// Petite note de musique (tête 2×2, hampe, crochet).
function note(g, x, y, col) {
  g.fillStyle = OUTLINE;
  g.fillRect(Math.round(x) - 1, Math.round(y) - 5, 5, 8);
  px(g, x, y, col, 2);
  for (let k = 1; k <= 4; k++) px(g, x + 1, y - k, col);
  px(g, x + 2, y - 4, col);
  px(g, x + 2, y - 3, '#ffffff');
}
// Petit cœur (5×4).
function heart(g, x, y, col) {
  for (const [dx, dy] of [[-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, 0], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]]) px(g, x + dx, y + dy, col);
  px(g, x - 1, y - 1, '#ffffff');
}

Object.assign(FX, {
  // --- Brann : la masse s'abat, poussière au sol
  smash(g, q, e) {
    if (q < 0.4) {
      const y = lerp(e.ty - 18, e.ty - 2, q / 0.4);
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(e.tx) - 3, Math.round(y) - 3, 7, 7);
      px(g, e.tx - 2, y - 2, e.cols[0], 5);
      px(g, e.tx - 2, y - 2, '#ffffff', 2);
      for (let k = 1; k < 4; k++) px(g, e.tx, y - 3 - k * 3, e.cols[1]);
    } else {
      const k = (q - 0.4) / 0.6;
      star(g, e.tx, e.ty - 2, k, e.cols, 9 + e.rank);
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) px(g, e.tx + s * (4 + k * 10 + i * 3), e.ty + 9 - i - (k < 0.5 ? 0 : 1), '#d8c8a8', i ? 1 : 2);
    }
  },
  // Provocation : il bombe le torse, des anneaux rouges partent de lui, des « ! » sautent
  taunt(g, q, e) {
    const d = e.d[0] || { tx: e.x, ty: e.y };
    ring(g, d.tx, d.ty, q, e.cols[0], 18);
    ring(g, d.tx, d.ty, Math.max(0, q - 0.3), e.cols[1], 14);
    for (const [i, ox] of [-9, 0, 9].entries()) {
      const k = Math.max(0, q * 1.5 - i * 0.15), y = d.ty - 14 - Math.sin(Math.min(1, k) * Math.PI) * 5;
      if (k <= 0 || k > 1.2) continue;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(d.tx + ox) - 1, Math.round(y) - 1, 4, 8);
      g.fillStyle = i === 1 ? '#ffffff' : e.cols[0];
      g.fillRect(Math.round(d.tx + ox), Math.round(y), 2, 4);
      g.fillRect(Math.round(d.tx + ox), Math.round(y) + 5, 2, 1);
    }
  },
  // --- Mira : une note file en cloche
  note(g, q, e) {
    arc(e, q, 10, (x, y) => {
      note(g, x, y + Math.round(Math.sin(q * 12)), e.cols[0]);
      for (let i = 1; i < 4; i++) px(g, lerp(e.x + 8 * e.dir, e.tx, q - i * 0.08), lerp(e.y - 4, e.ty, q - i * 0.08) - Math.sin((q - i * 0.08) * Math.PI) * 10, e.cols[1]);
    });
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Ballade : des notes montent autour de chaque allié, flèches d'or vers le haut
  chorus(g, q, e) {
    for (const [j, d] of e.d.entries()) {
      for (let i = 0; i < 3; i++) {
        const t = (q * 1.4 + i * 0.33 + j * 0.1) % 1;
        if (q < 0.1 + i * 0.1) continue;
        note(g, d.tx - 9 + i * 8, d.ty + 8 - t * 22, i % 2 ? e.cols[1] : e.cols[0]);
      }
      if (q > 0.5) {
        const y = d.ty - 12 - Math.round((q - 0.5) * 12);
        for (const [dx, dy] of [[0, 0], [-1, 1], [1, 1], [-2, 2], [2, 2], [0, 1], [0, 2], [0, 3]]) px(g, d.tx + dx, y + dy, dy === 0 ? '#ffffff' : '#fbe08a');
      }
    }
  },
  // --- Nina : une fléchette-seringue file tout droit
  syringe(g, q, e) {
    const x = lerp(e.x + 8 * e.dir, e.tx, q), y = lerp(e.y - 6, e.ty, q);
    for (let i = 0; i < 9; i++) px(g, x - i * e.dir, y, i < 2 ? '#ffffff' : i < 3 ? '#b9c6d2' : i < 7 ? (i < 5 ? '#5ae0a0' : '#d8f0ff') : '#8e99a4');
    for (const o of [-1, 1]) px(g, x - 7 * e.dir, y + o, '#8e99a4');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, ['#5ae0a0', '#ffffff'], 6);
  },
  // Piqûre de rappel : grande croix verte qui pulse sur l'allié, des cœurs montent
  medkit(g, q, e) {
    const d = e.d[0];
    if (!d) return;
    const s = q < 0.3 ? Math.round(q * 13) : q < 0.7 ? 4 : Math.max(0, Math.round((1 - q) * 13));
    if (s > 0) {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(d.tx) - s - 1, Math.round(d.ty) - 2, s * 2 + 3, 5);
      g.fillRect(Math.round(d.tx) - 2, Math.round(d.ty) - s - 1, 5, s * 2 + 3);
      g.fillStyle = e.cols[0];
      g.fillRect(Math.round(d.tx) - s, Math.round(d.ty) - 1, s * 2 + 1, 3);
      g.fillRect(Math.round(d.tx) - 1, Math.round(d.ty) - s, 3, s * 2 + 1);
      px(g, d.tx, d.ty, '#ffffff');
    }
    for (let i = 0; i < 3; i++) {
      const t = (q * 1.3 + i * 0.3) % 1;
      if (q > 0.2) heart(g, d.tx - 8 + i * 8, d.ty + 6 - t * 20, i === 1 ? '#ff9ac8' : '#e2334a');
    }
  },
  // --- Pip : deux coups de dague rapides
  dagger(g, q, e) {
    slash(g, e.tx, e.ty, Math.min(1, q * 2), e.dir, e.cols, 6, -60, 60);
    if (q > 0.3) slash(g, e.tx, e.ty - 2, Math.min(1, (q - 0.3) * 2), -e.dir, e.cols, 6, -60, 60);
    if (q > 0.6) burst(g, e.tx, e.ty, (q - 0.6) / 0.4, e.cols, 5);
  },
  // Coupe-jarret : trois entailles en Z, le sang goutte
  bleedCut(g, q, e) {
    for (let s = 0; s < 3; s++) {
      const k = Math.min(1, q * 3 - s * 0.5);
      if (k <= 0 || q > 0.85) continue;
      const y = e.ty - 6 + s * 6, L = 12;
      for (let i = 0; i < L * k; i++) px(g, e.tx - L / 2 + i, y + (s === 1 ? -i * 0.4 + 2 : 0), i > L * k - 2 ? '#ffffff' : e.cols[0]);
    }
    if (q > 0.45) drops(g, e.tx, e.ty, (q - 0.45) / 0.55, '#e2334a', 4);
  },
  // --- Gus : coup de pioche, éclats de roche
  pick(g, q, e) {
    if (q < 0.45) slash(g, e.tx, e.ty, q * 2.2, e.dir, e.cols, 9, -150, 20);
    else cubes(g, e.tx, e.ty, (q - 0.45) / 0.55, ['#8a7a68', '#c8b8a0', e.cols[1]], 6);
  },
  // Coup de pioche (perce-armure) : la pointe traverse, la roche se fend derrière la cible
  drill(g, q, e) {
    FX.pick(g, Math.min(1, q * 1.4), e);
    if (q > 0.35) {
      const k = (q - 0.35) / 0.65, L = Math.round(k * 26);
      for (let i = 0; i < L; i++) px(g, e.tx - 4 * e.dir + i * e.dir, e.ty + ((i * 7) % 3) - 1, i > L - 3 ? '#ffffff' : e.cols[0]);
      if (k > 0.5) star(g, e.tx + 20 * e.dir, e.ty, (k - 0.5) * 2, e.cols, 5);
    }
  },
  // --- Lenny : jet d'eau
  water(g, q, e) {
    const x0 = e.x + 9 * e.dir, y0 = e.y - 8, n = Math.round(q * 14);
    for (let i = 0; i < n; i++) {
      const t = i / 14, x = lerp(x0, e.tx, t), y = lerp(y0, e.ty, t) - Math.sin(t * Math.PI) * 6 + (i % 2);
      px(g, x, y, i > n - 3 ? '#ffffff' : i % 3 ? e.cols[0] : e.cols[1], 2);
    }
    if (q > 0.75) drops(g, e.tx, e.ty - 4, (q - 0.75) / 0.25, e.cols[1], 6);
  },
  // Lance à incendie : une vague déferle sur tous les ennemis
  flood(g, q, e) {
    for (const [i, d] of e.d.entries()) {
      const k = Math.max(0, Math.min(1, q * 1.4 - i * 0.12));
      if (k <= 0) continue;
      const x = lerp(d.tx - 30, d.tx + 6, k), h = Math.round(Math.sin(k * Math.PI) * 14);
      for (let j = 0; j < 14; j++) {
        const yy = d.ty + 10 - Math.round(Math.sin((j / 14) * Math.PI) * h);
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(x - 14 + j * 2) - 1, yy - 1, 4, d.ty + 12 - yy + 2);
        g.fillStyle = j % 4 === 1 ? e.cols[1] : e.cols[0];
        g.fillRect(Math.round(x - 14 + j * 2), yy, 2, d.ty + 12 - yy);
        px(g, x - 14 + j * 2, yy, '#ffffff');
      }
      if (k > 0.6) drops(g, d.tx, d.ty - 10, (k - 0.6) / 0.4, '#ffffff', 5);
    }
  },
  // --- Vex : coup d'estoc tout droit
  thrust(g, q, e) {
    if (q < 0.5) {
      const L = Math.round(q * 2 * 16);
      for (let i = 0; i < L; i++) px(g, e.tx - 14 * e.dir + i * e.dir, e.ty, i > L - 3 ? '#ffffff' : e.cols[0]);
      px(g, e.tx - 14 * e.dir + L * e.dir, e.ty - 1, e.cols[1]);
    } else burst(g, e.tx, e.ty, (q - 0.5) * 2, e.cols, 7);
  },
  // Morsure : deux crocs se referment, puis le sang revient vers le vampire
  bite(g, q, e) {
    if (q < 0.4) {
      const o = Math.round((1 - q / 0.4) * 6);
      for (const [s, oy] of [[1, -o - 2], [-1, o + 2]]) {
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(e.tx) - 5, Math.round(e.ty + oy) - (s > 0 ? 1 : 3), 11, 5);
        for (const fx of [-3, 2]) {
          g.fillStyle = '#ffffff';
          g.fillRect(Math.round(e.tx) + fx, Math.round(e.ty + oy) - (s > 0 ? 0 : 2), 2, 3);
        }
      }
    } else {
      const k = (q - 0.4) / 0.6;
      for (let i = 0; i < 6; i++) {
        const t = Math.max(0, Math.min(1, k * 1.3 - i * 0.06));
        px(g, lerp(e.tx, e.x, t), lerp(e.ty, e.y, t) - Math.sin(t * Math.PI) * (6 + i * 2), i % 2 ? e.cols[1] : e.cols[0], 2);
      }
      if (k < 0.4) drops(g, e.tx, e.ty, k * 2, '#e2334a', 3);
    }
  },
  // --- Gideon : dôme d'or sur chaque allié
  aegis(g, q, e) {
    for (const d of e.d) {
      const r = Math.min(13, Math.round(q * 40)), on = q < 0.75 || Math.round(q * 16) % 2;
      if (!on) continue;
      for (let a = 180; a <= 360; a += 12) {
        const rad = (a * Math.PI) / 180, x = d.tx + Math.cos(rad) * r, y = d.ty + 8 + Math.sin(rad) * r * 1.3;
        px(g, x, y, (a / 12) % 2 ? e.cols[0] : e.cols[1]);
      }
      for (let x = -r; x <= r; x += 3) px(g, d.tx + x, d.ty + 9, e.cols[0]);
      if (q > 0.4) px(g, d.tx - 4, d.ty - 6 + Math.round(q * 4), '#ffffff', 2);
    }
  },
  // --- Aurélia : coup de lance, longue pointe de lumière
  spear(g, q, e) {
    if (q > 0.8) return;
    const L = Math.round(Math.min(1, q * 2.5) * 20);
    for (let i = 0; i < L; i++) {
      const x = e.tx - 16 * e.dir + i * e.dir, y = e.ty + 3 - Math.round(i * 0.25);
      px(g, x, y, i > L - 4 ? '#ffffff' : e.cols[0]);
      if (i > L - 4) { px(g, x, y - 1, e.cols[1]); px(g, x, y + 1, e.cols[1]); }
    }
    if (q > 0.4) burst(g, e.tx, e.ty, (q - 0.4) / 0.4, e.cols, 7);
  },
  // Chant du Valhalla : un rai de lumière tombe sur l'allié, des plumes descendent
  valhalla(g, q, e) {
    const d = e.d[0];
    if (!d) return;
    const w = q < 0.3 ? 2 + Math.round(q * 30) : Math.max(0, Math.round(11 - (q - 0.3) * 14));
    g.globalAlpha = 0.5;
    g.fillStyle = e.cols[1];
    g.fillRect(Math.round(d.tx - w / 2), 0, w, Math.round(d.ty + 10));
    g.globalAlpha = 1;
    for (let i = 0; i < 5; i++) {
      const t = (q * 0.9 + i * 0.2) % 1, x = d.tx - 10 + i * 5 + Math.round(Math.sin(q * 8 + i) * 2), y = lerp(d.ty - 30, d.ty + 6, t);
      if (q < 0.1) continue;
      px(g, x, y, '#ffffff'); px(g, x + 1, y + 1, '#ffffff'); px(g, x - 1, y + 1, '#c8c0d0'); px(g, x, y + 2, e.cols[0]);
    }
    if (q > 0.5) {
      const k = (q - 0.5) / 0.5;
      for (const s of [-1, 1]) for (let i = 0; i < 6; i++) px(g, d.tx + s * (6 + i * 2), d.ty - 6 - Math.round(Math.sin((i / 6) * Math.PI) * 6 * (1 - k)), i % 2 ? '#ffffff' : e.cols[1]);
    }
  },
  // --- Nova : coup de poing, étoile d'impact et traits de vitesse
  punch(g, q, e) {
    star(g, e.tx, e.ty, q, e.cols, 7 + e.rank);
    if (q < 0.5) for (let i = 0; i < 3; i++) for (let k = 0; k < 6; k++) px(g, e.tx - (8 + k) * e.dir - q * 10 * e.dir, e.ty - 4 + i * 4, i === 1 ? '#ffffff' : e.cols[1]);
  },
  // Poing météore : ruée en traînée de feu, impact énorme, onde
  meteorPunch(g, q, e) {
    if (q < 0.45) {
      const x1 = lerp(e.x, e.tx, q / 0.45);
      for (let x = Math.min(e.x, x1); x <= Math.max(e.x, x1); x += 1) {
        px(g, x, e.ty + Math.round(Math.sin(x * 0.7) * 2), (x | 0) % 3 ? e.cols[0] : '#ffffff', 2);
        if ((x | 0) % 3 === 0) px(g, x, e.ty - 4 + ((x | 0) % 9), e.cols[1]);
      }
    } else {
      const k = (q - 0.45) / 0.55;
      star(g, e.tx, e.ty, k, ['#fbe08a', e.cols[0]], 16);
      ring(g, e.tx, e.ty, k, e.cols[1], 22);
      ring(g, e.tx, e.ty, Math.max(0, k - 0.25), '#ffffff', 16);
      dizzy(g, e.tx, e.ty, q, '#fbe08a', 4);
    }
  },
  // --- Rok : la hache tombe de haut, copeaux de bois
  axeChop(g, q, e) {
    if (q < 0.45) slash(g, e.tx, e.ty, q * 2.2, e.dir, e.cols, 10, -170, -10);
    else {
      const k = (q - 0.45) / 0.55;
      burst(g, e.tx, e.ty, k, e.cols, 7 + e.rank);
      cubes(g, e.tx, e.ty - 2, k, ['#c8945a', '#e8c890'], 5);
    }
  },
  // Abattage : une entaille verticale géante, « timber ! », l'arbre tombe… sur l'ennemi
  timber(g, q, e) {
    const L = Math.round(Math.min(1, q * 2.5) * 26);
    if (q < 0.7) for (let i = 0; i < L; i++) {
      const y = e.ty - 13 + i;
      px(g, e.tx + Math.round(i * 0.15) * e.dir, y, i > L - 3 ? '#ffffff' : e.cols[0], 2);
    }
    if (q > 0.35) {
      const k = (q - 0.35) / 0.65;
      cubes(g, e.tx, e.ty, k, ['#8a5a32', '#c8945a', '#e8c890'], 9);
      star(g, e.tx, e.ty, k, e.cols, 10);
    }
  },
  // --- Tobo : la poêle, un nuage de vapeur
  pan(g, q, e) {
    if (q < 0.4) slash(g, e.tx, e.ty, q * 2.5, e.dir, ['#4a4a5a', '#b8c2cc'], 8);
    else {
      const k = (q - 0.4) / 0.6;
      star(g, e.tx, e.ty - 2, k, ['#fbe08a', '#ffffff'], 7);
      for (let i = 0; i < 3; i++) px(g, e.tx - 4 + i * 4, e.ty - 10 - k * 8 - (i % 2) * 2, '#efe6cf', 2);
      dizzy(g, e.tx, e.ty, q, '#fbe08a');
    }
  },
  // Ragoût maison : une marmite fume au-dessus de chaque allié, des cœurs montent
  stew(g, q, e) {
    for (const d of e.d) {
      const y = d.ty - 18, on = q < 0.85 || Math.round(q * 16) % 2;
      if (on) {
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(d.tx) - 6, y - 1, 13, 7);
        g.fillStyle = '#4a4a5a';
        g.fillRect(Math.round(d.tx) - 5, y, 11, 5);
        g.fillStyle = '#c8603a';
        g.fillRect(Math.round(d.tx) - 4, y, 9, 1);
        px(g, d.tx - 4, y + 1, '#8e99a4');
        for (let i = 0; i < 3; i++) px(g, d.tx - 3 + i * 3, y - 2 - Math.round(((q * 3 + i * 0.3) % 1) * 6), '#efe6cf');
      }
      if (q > 0.35) heart(g, d.tx + 7, d.ty + 4 - Math.round((q - 0.35) * 22), '#e2334a');
    }
  },
  // --- Hugo : petit direct, puis gros crochet
  jab(g, q, e) {
    star(g, e.tx, e.ty - 2, q, e.cols, 5);
    if (q < 0.4) for (let k = 0; k < 4; k++) px(g, e.tx - (6 + k * 2) * e.dir, e.ty - 2, e.cols[1]);
  },
  uppercut(g, q, e) {
    FX.punch(g, q, e);
    if (q > 0.3) for (let i = 0; i < 4; i++) px(g, e.tx - 6 + i * 4, e.ty - 6 - Math.round((q - 0.3) * 20) - (i % 2) * 3, i % 2 ? '#ffffff' : e.cols[1]);
  },
  // --- Kiki : balle traçante, éclair au canon
  bullet(g, q, e) {
    const x0 = e.x + 10 * e.dir, y0 = e.y - 1;
    if (q < 0.25) { px(g, x0, y0 - 1, '#fbe08a', 3); px(g, x0 + e.dir, y0, '#ffffff'); }
    const x = lerp(x0, e.tx, Math.min(1, q * 1.3)), y = lerp(y0, e.ty, Math.min(1, q * 1.3));
    if (q < 0.77) for (let i = 0; i < 6; i++) px(g, x - i * e.dir, y, i < 1 ? '#ffffff' : i < 3 ? e.cols[1] : e.cols[0]);
    else burst(g, e.tx, e.ty, (q - 0.77) / 0.23, e.cols, 5);
  },
  quickdraw(g, q, e) {
    FX.bullet(g, q, e);
    if (q < 0.3) ring(g, e.x + 10 * e.dir, e.y - 1, q / 0.3, '#fbe08a', 5);
    if (q > 0.75) star(g, e.tx, e.ty, (q - 0.75) / 0.25, e.cols, 6);
  },
  // --- Bjorn : tourbillon, des haches tournent autour de chaque ennemi
  whirl(g, q, e) {
    for (const d of e.d) {
      for (let i = 0; i < 3; i++) {
        const a = q * 14 + (i / 3) * Math.PI * 2, r = 4 + Math.min(1, q * 2) * 9;
        const x = d.tx + Math.cos(a) * r, y = d.ty + Math.sin(a) * r * 0.6;
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
        px(g, x - 1, y - 1, e.cols[0], 3);
        px(g, x - 1, y - 1, '#ffffff');
      }
      if (q > 0.6) burst(g, d.tx, d.ty, (q - 0.6) / 0.4, e.cols, 10);
    }
  },
  // --- Sven : le fil part en cloche, l'hameçon accroche
  hook(g, q, e) {
    const k = Math.min(1, q * 1.4), tx = lerp(e.x + 10 * e.dir, e.tx, k), ty = lerp(e.y - 14, e.ty, k) - Math.sin(k * Math.PI) * 10;
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      px(g, lerp(e.x + 10 * e.dir, tx, t), lerp(e.y - 14, ty, t) + Math.sin(t * Math.PI) * 3, '#efe6cf');
    }
    px(g, tx, ty, '#b9c6d2', 2); px(g, tx + e.dir, ty + 2, '#b9c6d2');
    if (q > 0.75) burst(g, e.tx, e.ty, (q - 0.75) / 0.25, e.cols, 5);
  },
  // Hameçon : un gros poisson gifle la cible, qui voit des étoiles
  reel(g, q, e) {
    FX.hook(g, Math.min(1, q * 1.6), e);
    if (q > 0.5) {
      const k = (q - 0.5) / 0.5, x = e.tx + (1 - k) * 10 * e.dir, y = e.ty - 4 - Math.sin(k * Math.PI) * 6;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 5, Math.round(y) - 3, 12, 6);
      g.fillStyle = '#4a9ae0';
      g.fillRect(Math.round(x) - 4, Math.round(y) - 2, 7, 4);
      g.fillRect(Math.round(x) + 3, Math.round(y) - 2, 2, 1);
      g.fillRect(Math.round(x) + 3, Math.round(y) + 1, 2, 1);
      px(g, x - 3, y - 1, '#ffffff');
      dizzy(g, e.tx, e.ty, q, '#fbe08a', 4);
    }
  },
  // --- Astra : rayon laser
  laser(g, q, e) {
    if (q > 0.7) return burst(g, e.tx, e.ty, (q - 0.7) / 0.3, e.cols, 6);
    const x0 = e.x + 12 * e.dir, y0 = e.y, L = Math.min(1, q * 3);
    for (let i = 0; i <= 30; i++) {
      const t = (i / 30) * L;
      px(g, lerp(x0, e.tx, t), lerp(y0, e.ty, t), i % 4 ? e.cols[0] : '#ffffff');
      if (i % 2) px(g, lerp(x0, e.tx, t), lerp(y0, e.ty, t) + 1, e.cols[1]);
    }
  },
  // Pluie de comètes : des étoiles filantes tombent sur chaque ennemi
  comets(g, q, e) {
    for (const [i, d] of e.d.entries()) for (let j = 0; j < 2; j++) {
      const k = Math.max(0, Math.min(1, q * 1.7 - i * 0.15 - j * 0.3));
      if (k <= 0) continue;
      const ox = j ? 6 : -4;
      if (k < 0.6) {
        const f = k / 0.6, x = lerp(d.tx + ox + 26, d.tx + ox, f), y = lerp(-6, d.ty, f);
        for (let t = 1; t < 6; t++) px(g, x + t * 2.5, y - t * 3, t < 2 ? '#ffffff' : t < 4 ? e.cols[1] : e.cols[0]);
        px(g, x - 1, y - 1, '#ffffff', 3);
      } else star(g, d.tx + ox, d.ty, (k - 0.6) / 0.4, e.cols, 7);
    }
  },
  // --- Nyx : orbe vert à tête de mort
  skullOrb(g, q, e) {
    const x = lerp(e.x + 8 * e.dir, e.tx, q), y = lerp(e.y - 8, e.ty, q) + Math.sin(q * 10) * 2;
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7);
    g.fillStyle = '#e8e0cc';
    g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 4);
    g.fillRect(Math.round(x) - 1, Math.round(y) + 2, 3, 1);
    px(g, x - 1, y - 1, OUTLINE); px(g, x + 1, y - 1, OUTLINE);
    for (let i = 1; i < 5; i++) px(g, lerp(e.x + 8 * e.dir, e.tx, q - i * 0.06), lerp(e.y - 8, e.ty, q - i * 0.06), i % 2 ? e.cols[0] : e.cols[1]);
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Rappel des morts : flammes vertes qui montent du sol, crânes qui tournent
  raise(g, q, e) {
    const d = e.d[0];
    if (!d) return;
    for (let i = 0; i < 6; i++) {
      const t = (q * 1.5 + i * 0.17) % 1, x = d.tx - 10 + i * 4, y = d.ty + 10 - t * 26;
      px(g, x, y, i % 2 ? e.cols[0] : e.cols[1], t < 0.5 ? 2 : 1);
    }
    for (let i = 0; i < 3; i++) {
      const a = q * 8 + (i / 3) * Math.PI * 2;
      px(g, d.tx + Math.cos(a) * 12, d.ty + Math.sin(a) * 5, '#e8e0cc', 2);
    }
    ring(g, d.tx, d.ty + 10, q, e.cols[0], 14);
  },
  // --- Ignis : boule de feu
  fireball(g, q, e) {
    const x = lerp(e.x + 9 * e.dir, e.tx, q), y = lerp(e.y - 4, e.ty, q);
    for (let i = 1; i < 6; i++) px(g, x - i * 2 * e.dir, y + ((i * 5) % 3) - 1, i < 3 ? '#fbe08a' : i < 5 ? '#ff6a1f' : '#8a3a1c', i < 3 ? 2 : 1);
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7);
    g.fillStyle = e.cols[0];
    g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
    px(g, x - 1, y - 1, e.cols[1], 2);
    px(g, x, y, '#ffffff');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 7);
  },
  // Brasier : une colonne de feu jaillit sous la cible
  inferno(g, q, e) {
    const h = q < 0.6 ? Math.round(q / 0.6 * 30) : Math.round((1 - q) / 0.4 * 30);
    for (let i = 0; i < h; i++) {
      const w = 4 + Math.round(Math.sin(i * 0.9 + q * 20) * 2) - Math.round(i / 10);
      const y = e.ty + 10 - i, c = i > h - 4 ? '#fbe08a' : i % 3 ? '#ff6a1f' : '#e2334a';
      g.fillStyle = c;
      g.fillRect(Math.round(e.tx - w), y, w * 2 + 1, 1);
    }
    if (q > 0.3) burst(g, e.tx, e.ty - 6, (q - 0.3) / 0.7, ['#ff6a1f', '#fbe08a'], 12);
  },
  // --- Drakon : coup de lance, une flammèche au bout
  dragonLance(g, q, e) {
    FX.spear(g, q, e);
    if (q > 0.3 && q < 0.8) px(g, e.tx + 2 * e.dir, e.ty - 3, '#fbe08a', 2);
  },
  // Souffle du dragon : un flot de flammes balaie tous les ennemis
  dragonBreath(g, q, e) {
    for (const d of e.d)
      for (let i = 0; i < 18; i++) {
        const k = Math.min(1, q * 1.4) - i * 0.04;
        if (k <= 0 || k > 1) continue;
        const x = lerp(e.x + 10 * e.dir, d.tx, k), y = lerp(e.y - 6, d.ty, k) + Math.sin(i * 2.3 + q * 9) * 3;
        px(g, x, y, i % 3 === 0 ? '#fbe08a' : i % 3 === 1 ? e.cols[0] : '#c83020', i % 2 ? 2 : 3);
      }
    if (q > 0.7) for (const d of e.d) burst(g, d.tx, d.ty, (q - 0.7) / 0.3, ['#ff6a1f', '#fbe08a'], 10);
  },
  // --- Tess : trois dents de fourche
  fork(g, q, e) {
    if (q < 0.5) {
      const L = Math.round(q * 2 * 12);
      for (const o of [-3, 0, 3]) for (let i = 0; i < L; i++) px(g, e.tx - 10 * e.dir + i * e.dir, e.ty + o, i > L - 2 ? '#ffffff' : e.cols[0]);
    } else burst(g, e.tx, e.ty, (q - 0.5) * 2, e.cols, 7);
  },
  // Botte de foin : une botte de paille tombe devant chaque allié
  hay(g, q, e) {
    for (const d of e.d) {
      const k = Math.min(1, q * 2.2), x = d.tx + 9, y = lerp(d.ty - 30, d.ty + 2, k) - (k === 1 ? Math.round(Math.sin(Math.min(1, (q - 0.45) * 4) * Math.PI) * 2) : 0);
      if (q > 0.85 && Math.round(q * 16) % 2) continue;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 5, Math.round(y) - 5, 11, 11);
      g.fillStyle = e.cols[0];
      g.fillRect(Math.round(x) - 4, Math.round(y) - 4, 9, 9);
      g.fillStyle = '#c8a040';
      g.fillRect(Math.round(x) - 4, Math.round(y) - 1, 9, 1);
      g.fillRect(Math.round(x) - 4, Math.round(y) + 2, 9, 1);
      px(g, x - 3, y - 3, '#fff0b0');
      if (k === 1 && q < 0.7) for (const s of [-1, 1]) px(g, x + s * (6 + (q - 0.45) * 20), y + 3, e.cols[1]);
    }
  },
  // --- Doc : fiole verte en cloche, éclate en bulles
  flask(g, q, e) {
    if (q < 0.75) arc(e, q / 0.75, 12, (x, y) => {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 2, Math.round(y) - 3, 5, 6);
      px(g, x - 1, y - 1, e.cols[0], 3);
      px(g, x, y - 2, '#e8e0cc');
      px(g, x - 1, y - 1, '#ffffff');
    });
    else for (let i = 0; i < 6; i++) {
      const k = (q - 0.75) / 0.25;
      px(g, e.tx - 6 + i * 2.5, e.ty - k * (6 + (i % 3) * 4), i % 2 ? e.cols[0] : e.cols[1], 2);
    }
  },
  // Miasmes : un nuage vert enveloppe chaque ennemi
  miasma(g, q, e) {
    for (const [i, d] of e.d.entries()) {
      const k = Math.max(0, Math.min(1, q * 1.5 - i * 0.12));
      if (k <= 0) continue;
      for (let j = 0; j < 7; j++) {
        const a = (j / 7) * Math.PI * 2 + q * 3, r = 3 + k * 9;
        const x = d.tx + Math.cos(a) * r, y = d.ty + Math.sin(a) * r * 0.6 - k * 3;
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
        px(g, x - 1, y - 1, j % 2 ? e.cols[0] : e.cols[1], 3);
      }
      if (k > 0.5) px(g, d.tx - 1, d.ty - 12 - k * 4, '#e8e0cc', 2);
    }
  },
  // --- Ozzy : ondes sonores en arcs
  riff(g, q, e) {
    for (let i = 0; i < 3; i++) {
      const k = q * 1.3 - i * 0.15;
      if (k <= 0 || k > 1) continue;
      const x = lerp(e.x + 8 * e.dir, e.tx, k), y = lerp(e.y - 2, e.ty, k);
      for (let a = -50; a <= 50; a += 14) {
        const rad = (a * Math.PI) / 180, r = 3 + i;
        px(g, x + Math.cos(rad) * r * e.dir, y + Math.sin(rad) * r * 1.6, i === 0 ? '#ffffff' : e.cols[i % 2]);
      }
    }
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Larsen : des anneaux sonores secouent chaque ennemi, des notes et des étoiles
  larsen(g, q, e) {
    for (const d of e.d) {
      for (let i = 0; i < 3; i++) ring(g, d.tx, d.ty, Math.max(0, Math.min(1, q * 1.5 - i * 0.2)), i % 2 ? e.cols[1] : e.cols[0], 16);
      if (q > 0.5) dizzy(g, d.tx, d.ty, q, '#fbe08a', 3);
    }
    if (q < 0.6) for (let i = 0; i < 3; i++) note(g, e.x + 4 + i * 6, e.y - 12 - Math.round(q * 20) - (i % 2) * 4, i % 2 ? e.cols[1] : e.cols[0]);
  },
  // --- Yuki : éclat de glace
  iceShard(g, q, e) {
    const x = lerp(e.x + 9 * e.dir, e.tx, q), y = lerp(e.y - 8, e.ty, q);
    for (let i = 0; i < 6; i++) px(g, x - i * e.dir, y, i < 2 ? '#ffffff' : i < 4 ? e.cols[1] : e.cols[0]);
    px(g, x - 2 * e.dir, y - 1, e.cols[1]); px(g, x - 2 * e.dir, y + 1, e.cols[1]);
    for (let i = 1; i < 4; i++) px(g, lerp(e.x + 9 * e.dir, e.tx, q - i * 0.07), lerp(e.y - 8, e.ty, q - i * 0.07) + (i % 2 ? -2 : 2), '#ffffff');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Glaçon : une stalactite de glace tombe et se brise
  icicle(g, q, e) {
    if (q < 0.5) {
      const y = lerp(e.ty - 30, e.ty - 4, q / 0.5);
      for (let i = 0; i < 9; i++) {
        const w = Math.max(0, 3 - Math.floor(i / 3));
        g.fillStyle = i > 6 ? '#ffffff' : i % 2 ? e.cols[0] : e.cols[1];
        g.fillRect(Math.round(e.tx) - w, Math.round(y) + i - 9, w * 2 + 1, 1);
      }
    } else {
      const k = (q - 0.5) / 0.5;
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i - 3.5) * 0.45;
        px(g, e.tx + Math.cos(a) * k * 14, e.ty + Math.sin(a) * k * 12 + k * k * 10, i % 2 ? '#ffffff' : e.cols[0], 2);
      }
      ring(g, e.tx, e.ty + 8, k, e.cols[1], 12);
    }
  },
  // --- Sylva : flèche de lune, croissant d'argent
  moonArrow(g, q, e) {
    FX.arrow(g, Math.min(1, q * 1.4), e);
    if (q > 0.65) {
      const k = (q - 0.65) / 0.35, r = 4 + Math.round(k * 6);
      for (let a = -100; a <= 100; a += 12) {
        const rad = (a * Math.PI) / 180;
        px(g, e.tx + Math.cos(rad) * r, e.ty + Math.sin(rad) * r, '#ffffff');
        px(g, e.tx + Math.cos(rad) * (r - 2) + 1, e.ty + Math.sin(rad) * (r - 2), e.cols[1]);
      }
      burst(g, e.tx, e.ty, k, e.cols, 10);
    }
  },
  // --- Thorn : feuille qui tourne
  leaf(g, q, e) {
    const x = lerp(e.x + 8 * e.dir, e.tx, q), y = lerp(e.y - 6, e.ty, q) - Math.sin(q * Math.PI) * 6, f = Math.round(q * 10) % 2;
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
    g.fillStyle = e.cols[0];
    if (f) g.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
    else { g.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); g.fillRect(Math.round(x), Math.round(y) - 1, 1, 3); }
    px(g, x, y, '#ffffff');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Sève de vie : des fleurs poussent aux pieds de chaque allié, des feuilles montent
  bloom(g, q, e) {
    for (const d of e.d) {
      for (let i = 0; i < 4; i++) {
        const x = d.tx - 9 + i * 6, h = Math.min(5, Math.round(q * 14) - i);
        if (h <= 0) continue;
        for (let j = 0; j < h; j++) px(g, x, d.ty + 10 - j, '#4e8a34');
        if (h === 5) {
          const c = i % 2 ? '#ff9ac8' : '#fbe08a';
          px(g, x - 1, d.ty + 5, c); px(g, x + 1, d.ty + 5, c); px(g, x, d.ty + 4, c); px(g, x, d.ty + 6, c); px(g, x, d.ty + 5, '#ffffff');
        }
      }
      for (let i = 0; i < 3; i++) {
        const t = (q * 1.4 + i * 0.33) % 1;
        if (q > 0.25) px(g, d.tx - 6 + i * 6 + Math.round(Math.sin(t * 8) * 2), d.ty + 6 - t * 22, e.cols[0], 2);
      }
    }
  },
  // --- Gorm : couperet lourd
  cleaver(g, q, e) {
    slash(g, e.tx, e.ty, Math.min(1, q * 1.6), e.dir, e.cols, 12, -140, 40);
    if (q > 0.5) burst(g, e.tx, e.ty, (q - 0.5) * 2, e.cols, 8);
  },
  // Frénésie : entailles rouges en croix, le sang revient vers l'orc
  frenzy(g, q, e) {
    FX.cleaver(g, Math.min(1, q * 1.4), e);
    if (q > 0.45) {
      const k = (q - 0.45) / 0.55;
      for (let i = 0; i < 4; i++) {
        const t = Math.max(0, Math.min(1, k * 1.3 - i * 0.08));
        px(g, lerp(e.tx, e.x, t), lerp(e.ty, e.y, t) - Math.sin(t * Math.PI) * (5 + i * 2), '#e2334a', 2);
      }
    }
  },
  // --- Zara : coup de cimeterre doré
  scimitar(g, q, e) {
    slash(g, e.tx, e.ty, q, e.dir, e.cols, 10, -80, 100);
    if (q > 0.4) for (let i = 0; i < 3; i++) px(g, e.tx + (i - 1) * 5, e.ty - 6 - (q - 0.4) * 12, '#fbe08a');
  },
  // Danse des sabres : des foulards tournoient autour de chaque allié, flèches d'or
  dance(g, q, e) {
    for (const d of e.d) {
      for (let i = 0; i < 10; i++) {
        const a = q * 10 - i * 0.25, r = 11;
        px(g, d.tx + Math.cos(a) * r, d.ty + 2 + Math.sin(a) * 5 - i * 0.6, i < 2 ? '#ffffff' : i % 2 ? e.cols[0] : e.cols[1], i < 5 ? 2 : 1);
      }
      if (q > 0.5) {
        const y = d.ty - 12 - Math.round((q - 0.5) * 12);
        for (const [dx, dy] of [[0, 0], [-1, 1], [1, 1], [-2, 2], [2, 2], [0, 1], [0, 2], [0, 3]]) px(g, d.tx + dx, y + dy, dy === 0 ? '#ffffff' : '#fbe08a');
      }
    }
  },
  // --- Kitsune : feu follet bleu qui ondule
  foxfire(g, q, e) {
    const x = lerp(e.x + 8 * e.dir, e.tx, q), y = lerp(e.y - 10, e.ty, q) + Math.sin(q * 14) * 3;
    for (let i = 1; i < 6; i++) px(g, lerp(e.x + 8 * e.dir, e.tx, q - i * 0.05), lerp(e.y - 10, e.ty, q - i * 0.05) + Math.sin((q - i * 0.05) * 14) * 3, i < 3 ? e.cols[1] : e.cols[0]);
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 2, Math.round(y) - 3, 5, 6);
    px(g, x - 1, y - 1, e.cols[0], 3);
    px(g, x, y - 2, e.cols[1]);
    px(g, x, y, '#ffffff');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  foxfireRain(g, q, e) {
    FX.foxfire(g, Math.min(1, q * 1.25), e);
    if (q > 0.75) ring(g, e.tx, e.ty, (q - 0.75) / 0.25, e.cols[1], 10);
  },
  // --- Sybil : petite boule de cristal et étoiles
  crystal(g, q, e) {
    const x = lerp(e.x + 9 * e.dir, e.tx, q), y = lerp(e.y - 4, e.ty, q);
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7);
    g.fillStyle = e.cols[0];
    g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
    px(g, x - 1, y - 1, '#ffffff');
    for (let i = 0; i < 3; i++) {
      const a = q * 12 + (i / 3) * Math.PI * 2;
      px(g, x + Math.cos(a) * 6, y + Math.sin(a) * 4, e.cols[1]);
    }
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 7);
  },
  // Prophétie : un œil d'or s'ouvre au-dessus de chaque allié, étoiles qui tournent, flèches d'or
  prophecy(g, q, e) {
    for (const d of e.d) {
      const y = d.ty - 18, o = q < 0.3 ? Math.round(q / 0.3 * 2) : q > 0.85 ? 0 : 2;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(d.tx) - 6, y - o - 1, 13, o * 2 + 3);
      g.fillStyle = e.cols[1];
      g.fillRect(Math.round(d.tx) - 5, y - o, 11, o * 2 + 1);
      if (o) { g.fillStyle = e.cols[0]; g.fillRect(Math.round(d.tx) - 1, y - 1, 3, 3); px(g, d.tx, y, '#ffffff'); }
      for (let i = 0; i < 4; i++) {
        const a = q * 9 + (i / 4) * Math.PI * 2;
        px(g, d.tx + Math.cos(a) * 12, d.ty + Math.sin(a) * 5, i % 2 ? '#ffffff' : e.cols[1]);
      }
    }
  },
  // --- Grumli : un rempart de pierre sort du sol devant lui
  stoneWall(g, q, e) {
    const d = e.d[0] || { tx: e.x, ty: e.y };
    for (let i = 0; i < 4; i++) {
      const h = Math.max(0, Math.min(5, Math.round(q * 20) - i * 2)), x = d.tx + 10 + (i % 2) * 3, y = d.ty + 10 - i * 5;
      if (!h) continue;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 4, y - h - 1, 9, h + 2);
      g.fillStyle = i % 2 ? '#8a8478' : '#a8a090';
      g.fillRect(Math.round(x) - 3, y - h, 7, h);
      px(g, x - 3, y - h, '#c8c0b0');
    }
    ring(g, d.tx, d.ty, q, e.cols[0], 16);
  },
  // --- Spike : épines qui filent
  thorns(g, q, e) {
    for (let i = 0; i < 3; i++) {
      const k = Math.min(1, q * 1.3 - i * 0.12);
      if (k <= 0 || k >= 1) continue;
      const x = lerp(e.x + 8 * e.dir, e.tx, k), y = lerp(e.y - 4 + i * 3, e.ty - 3 + i * 3, k);
      for (let j = 0; j < 4; j++) px(g, x - j * e.dir, y, j === 0 ? '#ffffff' : e.cols[1]);
    }
    if (q > 0.8) burst(g, e.tx, e.ty, (q - 0.8) / 0.2, e.cols, 6);
  },
  // Pluie d'épines : une gerbe d'épines tombe sur chaque ennemi
  needleRain(g, q, e) {
    for (const [i, d] of e.d.entries()) for (let j = 0; j < 5; j++) {
      const k = Math.max(0, Math.min(1, q * 1.6 - i * 0.12 - j * 0.08));
      if (k <= 0 || k >= 1) continue;
      const x = d.tx - 8 + j * 4 + (1 - k) * 8, y = lerp(-6, d.ty + 2, k);
      for (let t = 0; t < 4; t++) px(g, x + t, y - t * 2, t === 0 ? '#ffffff' : e.cols[1]);
    }
    if (q > 0.7) for (const d of e.d) drops(g, d.tx, d.ty, (q - 0.7) / 0.3, '#e2334a', 3);
  },
  // --- Bip : tir de blaster
  blaster(g, q, e) {
    const x = lerp(e.x + 10 * e.dir, e.tx, q), y = lerp(e.y + 2, e.ty, q);
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 3, Math.round(y) - 2, 7, 4);
    g.fillStyle = e.cols[0];
    g.fillRect(Math.round(x) - 2, Math.round(y) - 1, 5, 2);
    px(g, x + e.dir, y - 1, '#ffffff');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 5);
  },
  blasterHit(g, q, e) {
    FX.blaster(g, Math.min(1, q * 1.3), e);
    if (q > 0.75) star(g, e.tx, e.ty, (q - 0.75) / 0.25, e.cols, 5);
  },
  // --- Lulu : coup de baguette
  baguette(g, q, e) {
    if (q < 0.45) {
      const a = lerp(-2.2, 0.3, q / 0.45), L = 14;
      for (let i = 0; i < L; i++) px(g, e.tx - 6 * e.dir + Math.cos(a) * i * e.dir, e.ty + Math.sin(a) * i, i % 4 === 2 ? '#a8702a' : '#d8a050', 2);
    } else {
      star(g, e.tx, e.ty - 2, (q - 0.45) / 0.55, ['#fbe08a', '#ffffff'], 6);
      for (let i = 0; i < 4; i++) px(g, e.tx - 6 + i * 4, e.ty - 6 + (q - 0.45) * 12 + (i % 2) * 2, '#f2ead6');
    }
  },
  // Pain chaud : une miche dorée descend sur l'allié, vapeur et cœurs
  bread(g, q, e) {
    const d = e.d[0];
    if (!d) return;
    const y = q < 0.4 ? lerp(d.ty - 26, d.ty - 14, q / 0.4) : d.ty - 14;
    if (q < 0.85) {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(d.tx) - 6, Math.round(y) - 3, 13, 7);
      g.fillStyle = '#d8a050';
      g.fillRect(Math.round(d.tx) - 5, Math.round(y) - 2, 11, 5);
      g.fillStyle = '#f0d8a0';
      g.fillRect(Math.round(d.tx) - 4, Math.round(y), 9, 1);
      px(g, d.tx - 4, y - 2, '#ffffff');
      for (let i = 0; i < 3; i++) px(g, d.tx - 3 + i * 3, y - 5 - Math.round(((q * 3 + i * 0.3) % 1) * 5), '#f2ead6');
    }
    for (let i = 0; i < 3; i++) {
      const t = (q * 1.3 + i * 0.3) % 1;
      if (q > 0.3) heart(g, d.tx - 8 + i * 8, d.ty + 6 - t * 18, '#e2334a');
    }
  },
  // --- DJ Max : un vinyle file en tournant
  vinyl(g, q, e) {
    const x = lerp(e.x + 9 * e.dir, e.tx, q), y = lerp(e.y - 2, e.ty, q) - Math.sin(q * Math.PI) * 6, f = Math.round(q * 12) % 2;
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7);
    g.fillStyle = '#1a1a22';
    g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
    px(g, x, y, e.cols[0]);
    px(g, x + (f ? -2 : 2), y - 2, '#5a5a6a');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Le drop : des ondes de basse sur chaque allié, notes et flèches d'or
  drop(g, q, e) {
    for (const d of e.d) {
      ring(g, d.tx, d.ty + 8, (q * 2) % 1, e.cols[0], 14);
      ring(g, d.tx, d.ty + 8, (q * 2 + 0.5) % 1, e.cols[1], 14);
      if (q > 0.3) note(g, d.tx + 8, d.ty - 2 - Math.round((q - 0.3) * 18), e.cols[0]);
      if (q > 0.5) {
        const y = d.ty - 12 - Math.round((q - 0.5) * 12);
        for (const [dx, dy] of [[0, 0], [-1, 1], [1, 1], [-2, 2], [2, 2], [0, 1], [0, 2], [0, 3]]) px(g, d.tx + dx, y + dy, dy === 0 ? '#ffffff' : '#fbe08a');
      }
    }
  },
  // --- Pablo : une lettre file en tournoyant
  letter(g, q, e) {
    const x = lerp(e.x + 9 * e.dir, e.tx, q), y = lerp(e.y - 10, e.ty, q) - Math.sin(q * Math.PI) * 8, f = Math.round(q * 10) % 2;
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 4, Math.round(y) - (f ? 3 : 2), 9, f ? 6 : 5);
    g.fillStyle = '#f2eef4';
    g.fillRect(Math.round(x) - 3, Math.round(y) - (f ? 2 : 1), 7, f ? 4 : 3);
    px(g, x, y, '#d83a3a');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  parcel(g, q, e) {
    FX.letter(g, Math.min(1, q * 1.3), e);
    if (q > 0.75) star(g, e.tx, e.ty, (q - 0.75) / 0.25, e.cols, 6);
  },
  // --- Bob : griffure molle, morsure qui contamine
  scratch(g, q, e) {
    FX.claw(g, q, e);
  },
  infect(g, q, e) {
    if (q < 0.5) FX.claw(g, q * 1.6, e);
    else {
      const k = (q - 0.5) / 0.5;
      for (let i = 0; i < 6; i++) px(g, e.tx - 6 + i * 2.5, e.ty - 8 + Math.sin(i + k * 6) * 2 - k * 6, i % 2 ? e.cols[0] : e.cols[1], 2);
      drops(g, e.tx, e.ty, k, e.cols[0], 4);
    }
  },
  // --- Zip : coup de planche
  kickflip(g, q, e) {
    if (q < 0.5) {
      const k = q / 0.5, y = e.ty + 6 - Math.sin(k * Math.PI) * 10;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(e.tx) - 7, Math.round(y) - 2, 15, 4);
      g.fillStyle = Math.round(k * 6) % 2 ? e.cols[0] : '#2a2234';
      g.fillRect(Math.round(e.tx) - 6, Math.round(y) - 1, 13, 2);
    } else star(g, e.tx, e.ty, (q - 0.5) * 2, e.cols, 6);
  },
  // Ollie : il saute et retombe planche la première, étoiles
  ollie(g, q, e) {
    if (q < 0.5) {
      const k = q / 0.5, y = lerp(e.ty - 24, e.ty - 2, k);
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(e.tx) - 8, Math.round(y) - 2, 17, 5);
      g.fillStyle = e.cols[0];
      g.fillRect(Math.round(e.tx) - 7, Math.round(y) - 1, 15, 2);
      px(g, e.tx - 5, y + 2, '#f2eef4'); px(g, e.tx + 5, y + 2, '#f2eef4');
    } else {
      const k = (q - 0.5) / 0.5;
      star(g, e.tx, e.ty, k, e.cols, 10);
      dizzy(g, e.tx, e.ty, q, '#fbe08a', 3);
    }
  },
  // --- Rexy : une mâchoire de dino se referme
  chomp(g, q, e) {
    const o = q < 0.5 ? Math.round((1 - q / 0.5) * 6) : 0;
    if (q > 0.85) return;
    for (const s of [-1, 1]) {
      const y = e.ty + s * (o + 2);
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(e.tx) - 7, y - 2, 15, 4);
      g.fillStyle = e.cols[0];
      g.fillRect(Math.round(e.tx) - 6, y - 1, 13, 2);
      for (let x = -5; x <= 5; x += 3) px(g, e.tx + x, y - s * 2, '#ffffff');
    }
    if (q > 0.5) star(g, e.tx, e.ty, (q - 0.5) * 2, e.cols, 6);
  },
  bigChomp(g, q, e) {
    FX.chomp(g, Math.min(1, q * 1.4), e);
    if (q > 0.55) for (let i = 0; i < 3; i++) {
      const t = Math.max(0, Math.min(1, (q - 0.55) / 0.45 * 1.3 - i * 0.1));
      heart(g, lerp(e.tx, e.x, t), lerp(e.ty, e.y, t) - Math.sin(t * Math.PI) * 8, '#e2334a');
    }
  },
  // --- Léo : trois griffures dorées
  claws(g, q, e) {
    if (q > 0.85) return;
    for (let s = 0; s < 3; s++) {
      const k = Math.min(1, q * 2.5 - s * 0.25);
      for (let i = 0; i < 14 * k; i++) px(g, e.tx - 6 + s * 5 - i * 0.4 * e.dir, e.ty - 8 + i, i > 14 * k - 3 ? '#ffffff' : e.cols[0], i % 3 ? 1 : 2);
    }
  },
  // Rugissement : des ondes de choc partent de lui et secouent chaque ennemi
  roarWave(g, q, e) {
    for (let i = 0; i < 3; i++) {
      const k = Math.max(0, Math.min(1, q * 1.4 - i * 0.15)), x = lerp(e.x + 10 * e.dir, e.x + 120 * e.dir, k);
      for (let a = -60; a <= 60; a += 10) {
        const rad = (a * Math.PI) / 180, r = 6 + i * 3;
        px(g, x + Math.cos(rad) * r * e.dir, e.y + Math.sin(rad) * r * 1.4, i === 0 ? '#ffffff' : e.cols[i % 2]);
      }
    }
    if (q > 0.6) for (const d of e.d) burst(g, d.tx, d.ty, (q - 0.6) / 0.4, e.cols, 9);
  },
  // --- Tonnerre : un éclair en zigzag part de sa main
  zapBolt(g, q, e) {
    if (q > 0.7) return burst(g, e.tx, e.ty, (q - 0.7) / 0.3, e.cols, 7);
    const x0 = e.x + 8 * e.dir, y0 = e.y - 10, L = Math.min(1, q * 2.5), n = 10;
    let px0 = x0, py0 = y0;
    for (let i = 1; i <= n * L; i++) {
      const t = i / n, x = lerp(x0, e.tx, t), y = lerp(y0, e.ty, t) + (i % 2 ? 3 : -3);
      for (let k = 0; k <= 4; k++) px(g, lerp(px0, x, k / 4), lerp(py0, y, k / 4), k % 2 ? e.cols[0] : '#ffffff');
      px0 = x; py0 = y;
    }
  },
  // Éclair en chaîne : la foudre tombe du ciel sur la cible
  chain(g, q, e) {
    if (q < 0.55) {
      let x = e.tx + 6, y = -4;
      while (y < e.ty) {
        const nx = e.tx + ((Math.round(y + q * 30) % 3) - 1) * 4, ny = y + 6;
        for (let k = 0; k <= 4; k++) px(g, lerp(x, nx, k / 4), lerp(y, ny, k / 4), k % 2 ? e.cols[0] : '#ffffff', 2);
        x = nx; y = ny;
      }
    } else {
      const k = (q - 0.55) / 0.45;
      star(g, e.tx, e.ty, k, e.cols, 10);
      ring(g, e.tx, e.ty + 8, k, e.cols[1], 14);
    }
  },
  // --- Ramsès : une bandelette fouette la cible
  wrap(g, q, e) {
    const k = Math.min(1, q * 1.6), L = 20;
    for (let i = 0; i < L * k; i++) {
      const t = i / L;
      px(g, lerp(e.x + 8 * e.dir, e.tx, t), lerp(e.y - 4, e.ty, t) + Math.sin(t * 9 + q * 8) * 2, i % 3 ? e.cols[0] : '#c8b898', 2);
    }
    if (q > 0.7) burst(g, e.tx, e.ty, (q - 0.7) / 0.3, e.cols, 6);
  },
  // Bandelettes : elles s'enroulent autour de la cible, sable et étoiles
  mummify(g, q, e) {
    const n = Math.min(5, Math.round(q * 9));
    for (let i = 0; i < n; i++) {
      const y = e.ty - 8 + i * 4;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(e.tx) - 8, y - 1, 17, 4);
      g.fillStyle = i % 2 ? e.cols[0] : '#c8b898';
      g.fillRect(Math.round(e.tx) - 7, y, 15, 2);
      px(g, e.tx - 7 + ((i * 5) % 12), y, '#ffffff');
    }
    if (q > 0.6) dizzy(g, e.tx, e.ty, q, '#fbe08a', 4);
    if (q < 0.5) for (let i = 0; i < 5; i++) px(g, e.tx - 10 + i * 5, e.ty + 10 - q * 16, '#e8c860');
  },
  // --- Elixa : potions qui éclatent sur l'équipe, voile protecteur
  elixir(g, q, e) {
    for (const d of e.d) {
      if (q < 0.4) {
        const y = lerp(d.ty - 28, d.ty - 6, q / 0.4);
        g.fillStyle = OUTLINE;
        g.fillRect(Math.round(d.tx) - 2, Math.round(y) - 3, 5, 6);
        px(g, d.tx - 1, y - 1, e.cols[0], 3);
        px(g, d.tx, y - 2, '#d8f0ff');
      } else {
        const k = (q - 0.4) / 0.6;
        for (let i = 0; i < 8; i++) px(g, d.tx - 8 + i * 2.3, d.ty - k * (6 + (i % 3) * 5), i % 2 ? e.cols[0] : e.cols[1], 2);
        if (Math.round(q * 16) % 2) for (let a = 180; a <= 360; a += 15) {
          const rad = (a * Math.PI) / 180;
          px(g, d.tx + Math.cos(rad) * 12, d.ty + 8 + Math.sin(rad) * 15, '#8af0ff');
        }
      }
    }
  },
  // --- Mako : un aileron tourne, puis la mâchoire du requin surgit
  sharkAttack(g, q, e) {
    if (q < 0.5) {
      const a = q * 14, x = e.tx + Math.cos(a) * 12, y = e.ty + 8 + Math.sin(a) * 3;
      for (let i = 0; i < 5; i++) for (let j = 0; j <= i; j++) px(g, x - 2 + j, y - 4 + i, j === 0 ? '#ffffff' : '#5a7a98');
      for (let i = -4; i <= 4; i += 2) px(g, x + i, y + 1, '#c8f0ff');
    } else {
      const k = (q - 0.5) / 0.5;
      FX.chomp(g, Math.min(0.84, k), { ...e, cols: ['#8aaac8', '#ffffff'] });
      drops(g, e.tx, e.ty - 8, k, '#4a9ae0', 5);
    }
  },
  // --- Pixel : un flot de bits verts
  code(g, q, e) {
    for (let i = 0; i < 8; i++) {
      const k = Math.min(1, q * 1.3 - i * 0.05);
      if (k <= 0 || k >= 1) continue;
      const x = lerp(e.x + 8 * e.dir, e.tx, k), y = lerp(e.y, e.ty, k) + ((i * 3) % 5) - 2;
      g.fillStyle = i % 2 ? e.cols[0] : e.cols[1];
      if (i % 3) g.fillRect(Math.round(x), Math.round(y) - 1, 1, 3);
      else { g.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3); g.fillStyle = OUTLINE; g.fillRect(Math.round(x), Math.round(y), 1, 1); }
    }
    if (q > 0.8) burst(g, e.tx, e.ty, (q - 0.8) / 0.2, e.cols, 6);
  },
  // Piratage : des carrés de « bug » clignotent autour de la cible
  hack(g, q, e) {
    FX.code(g, Math.min(1, q * 1.5), e);
    if (q > 0.5) for (let i = 0; i < 7; i++) {
      if ((i + Math.round(q * 12)) % 3 === 0) continue;
      const x = e.tx - 10 + ((i * 7) % 20), y = e.ty - 10 + ((i * 11) % 20);
      g.fillStyle = OUTLINE;
      g.fillRect(x - 1, y - 1, 5, 4);
      g.fillStyle = i % 2 ? e.cols[0] : '#ff4ab8';
      g.fillRect(x, y, 3, 2);
    }
  },
  // --- Lumi : coup de sabre lumineux
  saber(g, q, e) {
    slash(g, e.tx, e.ty, q, e.dir, e.cols, 11, -120, 80);
    if (q < 0.6) slash(g, e.tx, e.ty, q, e.dir, ['#ffffff', '#ffffff'], 9, -120, 80);
  },
  // Sabre de lumière : le sabre lancé tourne vers la cible et revient
  saberSpin(g, q, e) {
    const k = q < 0.5 ? q / 0.5 : 1 - (q - 0.5) / 0.5, x = lerp(e.x + 8 * e.dir, e.tx, k), y = lerp(e.y - 4, e.ty, k), a = q * 20;
    for (let i = -6; i <= 6; i++) px(g, x + Math.cos(a) * i, y + Math.sin(a) * i, Math.abs(i) < 2 ? '#ffffff' : e.cols[0], Math.abs(i) < 4 ? 2 : 1);
    if (q > 0.4 && q < 0.7) burst(g, e.tx, e.ty, (q - 0.4) / 0.3, e.cols, 8);
  },
  // --- Kero : shuriken qui tourne
  shuriken(g, q, e) {
    const x = lerp(e.x + 9 * e.dir, e.tx, q), y = lerp(e.y - 2, e.ty, q), f = Math.round(q * 12) % 2;
    g.fillStyle = OUTLINE;
    g.fillRect(Math.round(x) - 3, Math.round(y) - 3, 7, 7);
    g.fillStyle = e.cols[0];
    if (f) { g.fillRect(Math.round(x) - 2, Math.round(y), 5, 1); g.fillRect(Math.round(x), Math.round(y) - 2, 1, 5); }
    else for (let i = -2; i <= 2; i++) { px(g, x + i, y + i, e.cols[0]); px(g, x + i, y - i, e.cols[0]); }
    px(g, x, y, '#ffffff');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Langue venimeuse : une longue langue rose fouette la cible, gouttes de poison
  tongue(g, q, e) {
    const k = q < 0.5 ? q / 0.5 : 1 - (q - 0.5) / 0.5, x1 = lerp(e.x + 6 * e.dir, e.tx, k);
    for (let x = Math.min(e.x + 6 * e.dir, x1); x <= Math.max(e.x + 6 * e.dir, x1); x++) px(g, x, lerp(e.y + 1, e.ty, (x - e.x) / (e.tx - e.x || 1)), '#ff6a9a', 2);
    px(g, x1 - 1, lerp(e.y + 1, e.ty, k) - 1, '#ffb0c8', 3);
    if (q > 0.45) drops(g, e.tx, e.ty, (q - 0.45) / 0.55, '#7af06a', 4);
  },
  // --- Atlas : une roquette part du canon
  rocket(g, q, e) {
    const x = lerp(e.x + 12 * e.dir, e.tx, q * q), y = lerp(e.y + 2, e.ty, q) - Math.sin(q * Math.PI) * 4;
    if (q < 0.8) {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 4, Math.round(y) - 2, 9, 5);
      g.fillStyle = '#e0e4ec';
      g.fillRect(Math.round(x) - 3, Math.round(y) - 1, 7, 3);
      px(g, x + 3 * e.dir, y, '#e2334a');
      for (let i = 1; i < 5; i++) px(g, x - (3 + i * 2) * e.dir, y + ((i * 3) % 3) - 1, i < 2 ? '#fbe08a' : i < 4 ? '#ff6a1f' : '#8a8478', 2);
    } else {
      star(g, e.tx, e.ty, (q - 0.8) / 0.2, ['#ff6a1f', '#fbe08a'], 9);
      ring(g, e.tx, e.ty, (q - 0.8) / 0.2, '#ffb030', 12);
    }
  },
  // Protocole forteresse : un dôme hexagonal cyan se pose sur chaque allié
  fortress(g, q, e) {
    for (const d of e.d) {
      const r = Math.min(14, Math.round(q * 40));
      if (q > 0.8 && Math.round(q * 16) % 2) continue;
      for (let a = 180; a <= 360; a += 10) {
        const rad = (a * Math.PI) / 180, x = d.tx + Math.cos(rad) * r, y = d.ty + 9 + Math.sin(rad) * r * 1.4;
        px(g, x, y, (a / 10) % 3 ? e.cols[0] : '#ffffff');
      }
      for (let x = -r; x <= r; x += 4) for (let y = 0; y < r; y += 5) if (((x + y) / 4) % 2 === 0 && x * x + (y * 1.2) ** 2 < r * r) px(g, d.tx + x, d.ty + 9 - y * 1.4, e.cols[1]);
    }
  },
  // --- Pyra : plume enflammée
  flameFeather(g, q, e) {
    const x = lerp(e.x + 8 * e.dir, e.tx, q), y = lerp(e.y - 8, e.ty, q) + Math.sin(q * 10) * 2;
    for (let i = 0; i < 7; i++) px(g, x - i * e.dir, y + (i > 2 ? (i % 2 ? 1 : -1) : 0), i < 2 ? '#ffffff' : i < 4 ? e.cols[1] : e.cols[0]);
    for (let i = 1; i < 4; i++) px(g, x - (7 + i * 2) * e.dir, y + ((i * 5) % 3) - 1, '#ff6a1f');
    if (q > 0.85) burst(g, e.tx, e.ty, (q - 0.85) / 0.15, e.cols, 6);
  },
  // Renaissance : un oiseau de feu traverse les ennemis, puis des étincelles tombent sur l'équipe
  rebirth(g, q, e) {
    if (q < 0.6) {
      const k = q / 0.6, x = lerp(e.x, e.x + 170 * e.dir, k), y = e.y - 6 - Math.sin(k * Math.PI) * 10, w = Math.round(Math.sin(q * 30) * 4);
      for (let i = 0; i < 8; i++) { px(g, x - i * e.dir, y - i * 0.5 - w + i * 0.2, i < 2 ? '#ffffff' : e.cols[1], 2); px(g, x - i * e.dir, y + i * 0.5 + w - i * 0.2, i < 2 ? '#ffffff' : e.cols[0], 2); }
      for (let i = 1; i < 10; i++) px(g, x - (6 + i * 3) * e.dir, y + Math.sin(i + q * 20) * 2, i % 2 ? '#ff6a1f' : '#fbe08a');
    } else for (const d of e.d) burst(g, d.tx, d.ty, (q - 0.6) / 0.4, ['#ff6a1f', '#fbe08a'], 12);
  },
  // --- Mortis : orbe de glace à tête de mort
  frostBolt(g, q, e) {
    FX.skullOrb(g, q, e);
    if (q > 0.85) for (let i = 0; i < 4; i++) px(g, e.tx - 6 + i * 4, e.ty - 6 + (q - 0.85) * 40, '#ffffff');
  },
  // Hiver éternel : un blizzard balaie tous les ennemis, des pics de glace sortent du sol
  blizzard(g, q, e) {
    for (let i = 0; i < 40; i++) {
      const x = ((i * 37 + q * 260) % 140) + (e.tx - 50), y = ((i * 23) % 70) + e.ty - 40 + q * 10;
      px(g, x, y, i % 3 ? '#ffffff' : e.cols[0], i % 5 ? 1 : 2);
    }
    if (q > 0.4) for (const d of e.d) {
      const h = Math.min(10, Math.round((q - 0.4) * 30));
      for (const ox of [-6, 0, 6]) for (let j = 0; j < h - Math.abs(ox) / 3; j++) px(g, d.tx + ox, d.ty + 10 - j, j > h - 3 ? '#ffffff' : e.cols[0]);
    }
  },
  // --- Shoto : un éclat de glace puis une flammèche, en alternance
  iceFire(g, q, e) {
    FX.iceShard(g, q, { ...e, cols: ['#8ae8ff', '#ffffff'] });
    if (q > 0.2) FX.fireball(g, Math.max(0, q - 0.2) / 0.8, { ...e, cols: ['#ff6a1f', '#fbe08a'] });
  },
  // Glace et feu : un glacier jaillit sous chaque ennemi, puis les flammes
  glacier(g, q, e) {
    for (const [i, d] of e.d.entries()) {
      const k = Math.max(0, Math.min(1, q * 1.5 - i * 0.12)), h = Math.round(Math.min(1, k * 2) * 14);
      for (const [ox, hh] of [[-8, 0.6], [-3, 1], [2, 0.8], [7, 0.5]]) {
        const H = Math.round(h * hh);
        for (let j = 0; j < H; j++) { px(g, d.tx + ox, d.ty + 10 - j, j > H - 2 ? '#ffffff' : '#8ae8ff', 2); }
      }
      if (k > 0.5) for (let j = 0; j < 6; j++) px(g, d.tx - 6 + j * 2.4, d.ty - 4 - (k - 0.5) * 16 - (j % 2) * 3, j % 2 ? '#fbe08a' : '#ff6a1f', 2);
    }
  },
  // --- Bakugo : petite explosion au contact
  blast(g, q, e) {
    if (q < 0.25) { px(g, e.tx - 2, e.ty - 2, '#ffffff', 4); return; }
    const k = (q - 0.25) / 0.75;
    burst(g, e.tx, e.ty, k, ['#ff6a1f', '#fbe08a'], 10);
    for (let i = 0; i < 4; i++) px(g, e.tx - 6 + i * 4, e.ty - 6 - k * 10, k < 0.5 ? '#ff6a1f' : '#6a6070', 2);
  },
  // Howitzer Impact : une tornade d'explosions tourne, puis tout explose
  howitzer(g, q, e) {
    if (q < 0.5) {
      for (let i = 0; i < 10; i++) {
        const a = q * 30 + i * 0.63, r = 4 + i;
        px(g, e.tx + Math.cos(a) * r, e.ty - 6 + Math.sin(a) * r * 0.5 - i, i % 2 ? '#ff6a1f' : '#fbe08a', 2);
      }
    } else {
      const k = (q - 0.5) / 0.5;
      star(g, e.tx, e.ty, k, ['#ff6a1f', '#fbe08a'], 16);
      ring(g, e.tx, e.ty, k, '#ffb030', 22);
      ring(g, e.tx, e.ty, Math.max(0, k - 0.2), '#ffffff', 16);
      for (let i = 0; i < 6; i++) px(g, e.tx - 10 + i * 4, e.ty - 8 - k * 14, '#6a6070', 2);
    }
  },
  // --- Red Riot : coup de poing durci, éclats de roche
  hardPunch(g, q, e) {
    star(g, e.tx, e.ty, q, ['#e2334a', '#ffffff'], 7 + e.rank);
    if (q > 0.3) cubes(g, e.tx, e.ty, (q - 0.3) / 0.7, ['#a8a0a8', '#d8d0d8'], 5);
  },
  // Roc indestructible : sa peau devient de pierre, anneaux rouges, éclats
  harden(g, q, e) {
    const d = e.d[0] || { tx: e.x, ty: e.y };
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, r = 14 - q * 8;
      if (q < 0.7) px(g, d.tx + Math.cos(a) * r, d.ty + Math.sin(a) * r, i % 2 ? '#a8a0a8' : '#d8d0d8', 2);
    }
    if (q > 0.5) { ring(g, d.tx, d.ty, (q - 0.5) * 2, e.cols[0], 16); star(g, d.tx, d.ty - 4, (q - 0.5) * 2, ['#a8a0a8', '#ffffff'], 8); }
  },
  // --- Deku : coup de poing entouré d'éclairs verts
  smashPunch(g, q, e) {
    FX.punch(g, q, e);
    for (let i = 0; i < 4; i++) {
      const a = q * 12 + i * 1.6;
      px(g, e.tx + Math.cos(a) * 9, e.ty + Math.sin(a) * 6, i % 2 ? '#5af08a' : '#ffffff');
    }
  },
  // Detroit Smash : éclairs verts qui crépitent, puis un souffle qui traverse tout l'écran
  detroit(g, q, e) {
    if (q < 0.35) {
      for (let i = 0; i < 6; i++) {
        const a = q * 20 + i;
        px(g, e.x + Math.cos(a) * (6 + (i % 3) * 3), e.y + Math.sin(a) * 8, i % 2 ? '#5af08a' : '#ffffff', 2);
      }
    } else {
      const k = (q - 0.35) / 0.65;
      for (let j = -3; j <= 3; j++) {
        const L = Math.round(k * 140);
        for (let i = 0; i < L; i += 3) px(g, e.x + 8 * e.dir + i * e.dir, e.ty + j * 3 + Math.sin(i * 0.3) * (j === 0 ? 0 : 1), j === 0 ? '#ffffff' : Math.abs(j) % 2 ? e.cols[0] : e.cols[1]);
      }
      star(g, e.tx, e.ty, k, ['#5af08a', '#ffffff'], 14);
    }
  },
  // --- All Might : coup de poing qui fait vibrer l'air
  texas(g, q, e) {
    star(g, e.tx, e.ty, q, e.cols, 9);
    ring(g, e.tx, e.ty, q, e.cols[1], 12);
  },
  // United States of Smash : un poing géant, le souffle balaie tous les ennemis
  usaSmash(g, q, e) {
    if (q < 0.4) {
      const k = q / 0.4, x = lerp(e.x + 10 * e.dir, e.x + 40 * e.dir, k), y = e.y - 4;
      g.fillStyle = OUTLINE;
      g.fillRect(Math.round(x) - 7, Math.round(y) - 7, 15, 15);
      g.fillStyle = '#e2334a';
      g.fillRect(Math.round(x) - 6, Math.round(y) - 6, 13, 13);
      g.fillStyle = '#ff8a8a';
      g.fillRect(Math.round(x) - 6, Math.round(y) - 6, 13, 2);
      for (let i = 0; i < 6; i++) px(g, x - (10 + i * 4) * e.dir, y - 6 + i * 2, '#ffffff');
    } else {
      const k = (q - 0.4) / 0.6;
      for (const d of e.d) { star(g, d.tx, d.ty, k, ['#fbe08a', '#e2334a'], 14); ring(g, d.tx, d.ty, k, '#ffffff', 18); }
      for (let j = -4; j <= 4; j++) for (let i = 0; i < k * 150; i += 4) px(g, e.x + 30 * e.dir + i * e.dir, e.y + j * 5, j % 2 ? e.cols[1] : '#ffffff');
    }
  },
  // Poison, brûlure, saignement : petite gerbe sur celui qui souffre (couleurs imposées)
  tick(g, q, e) {
    burst(g, e.tx, e.ty, q, e.cols, 6);
    drops(g, e.tx, e.ty - 6, q, e.cols[0], 3);
  },
});

// Une tenue peut changer les effets et les sons (jamais la portée ni les cibles : le gameplay
// reste celui du héros). Les champs absents sont ceux du héros.
export const SKIN_FX = {
  'kael-slip': { cols: ['#a8703a', '#fbe08a'], attack: 'bonk', skill: 'bonkX', sound: 'bonk', skillSound: 'bonk' },
  'kael-cube': { cols: ['#5cc85a', '#9aa4ae'], attack: 'blocks', skill: 'blockX', sound: 'pop', skillSound: 'pop' },
  'kael-diamant': { cols: ['#4fd8e0', '#c8f6ff'], attack: 'diamond', skill: 'diamondX', sound: 'slash', skillSound: 'zap' },
  'lyra-pirate': { cols: ['#4a4650', '#c8c0c8'], attack: 'cannon', skill: 'cannonBlast', sound: 'cannon', skillSound: 'cannon' },
  'elio-pyjama': { cols: ['#c8d4f0', '#ffffff'], attack: 'pillow', skill: 'sheep', sound: 'pop', skillSound: 'baa' },
  'sera-sorciere': { cols: ['#7af06a', '#c08aff'], attack: 'potion', skill: 'cauldron', sound: 'bubble', skillSound: 'bubble' },
  'volt-pizza': { cols: ['#d83a3a', '#fbe08a'], attack: 'pizza', skill: 'pizzaDash', sound: 'bonk', skillSound: 'plasma' },
  'volt-samourai': { cols: ['#b8283a', '#ff9ac8'], attack: 'katana', skill: 'iai', sound: 'slash', skillSound: 'slash' },
};

// Fiche d'effets d'un héros, avec sa tenue s'il en porte une.
export const heroFx = (id, skin) => ({ ...(HERO_FX[id] || HERO_FX.kael), ...(skin && SKIN_FX[skin]) });

// ---------------------------------------------------------------- fiches des personnages

// cols : [couleur principale, éclat] ; ranged : attaque à distance (le héros ne s'avance pas) ;
// sound : son de son attaque.
export const HERO_FX = {
  kael: { cols: ['#c8323c', '#ffd0c8'], attack: 'slash', skill: 'cross', ranged: false, sound: 'slash', skillSound: 'slash' },
  lyra: { cols: ['#4f9e3c', '#c8f0a0'], attack: 'arrow', skill: 'ringArrow', ranged: true, sound: 'arrow', skillSound: 'arrow' },
  elio: { cols: ['#5ab4ff', '#d8f4ff'], attack: 'bolt', skill: 'meteor', ranged: true, sound: 'zap', skillSound: 'boom' },
  sera: { cols: ['#ff9ac8', '#fff4c0'], attack: 'holy', skill: 'pillars', ranged: true, sound: 'holy', skillSound: 'heal' },
  volt: { cols: ['#4ff0e8', '#c8fff8'], attack: 'plasma', skill: 'dash', ranged: false, sound: 'plasma', skillSound: 'plasma' },
  brann: { cols: ['#9ad8d0', '#ffffff'], attack: 'smash', skill: 'taunt', ranged: false, sound: 'thud', skillSound: 'shout' },
  mira: { cols: ['#f0a050', '#fff0b0'], attack: 'note', skill: 'chorus', ranged: true, sound: 'lute', skillSound: 'lute' },
  nina: { cols: ['#5ae0a0', '#ffffff'], attack: 'syringe', skill: 'medkit', ranged: true, sound: 'arrow', skillSound: 'heal' },
  pip: { cols: ['#c8c0d0', '#ffffff'], attack: 'dagger', skill: 'bleedCut', ranged: false, sound: 'slash', skillSound: 'slash' },
  gus: { cols: ['#c8b8a0', '#fff4c0'], attack: 'pick', skill: 'drill', ranged: false, sound: 'chop', skillSound: 'chop' },
  lenny: { cols: ['#4a9ae0', '#c8f0ff'], attack: 'water', skill: 'flood', ranged: true, sound: 'splash', skillSound: 'splash' },
  vex: { cols: ['#c8323c', '#ff9aa8'], attack: 'thrust', skill: 'bite', ranged: false, sound: 'slash', skillSound: 'drain' },
  gideon: { cols: ['#fbe08a', '#8af0ff'], attack: 'smash', skill: 'aegis', ranged: false, sound: 'thud', skillSound: 'shield' },
  aurelia: { cols: ['#8ab4ff', '#fff4c0'], attack: 'spear', skill: 'valhalla', ranged: false, sound: 'slash', skillSound: 'holy' },
  nova: { cols: ['#d8323c', '#fbe08a'], attack: 'punch', skill: 'meteorPunch', ranged: false, sound: 'punch', skillSound: 'punch' },
  rok: { cols: ['#c8945a', '#fff0d0'], attack: 'axeChop', skill: 'timber', ranged: false, sound: 'chop', skillSound: 'chop' },
  tobo: { cols: ['#c8603a', '#fff0d0'], attack: 'pan', skill: 'stew', ranged: false, sound: 'bonk', skillSound: 'heal' },
  hugo: { cols: ['#d8323c', '#ffffff'], attack: 'jab', skill: 'uppercut', ranged: false, sound: 'punch', skillSound: 'punch' },
  kiki: { cols: ['#c8a870', '#fbe08a'], attack: 'bullet', skill: 'quickdraw', ranged: true, sound: 'bang', skillSound: 'bang' },
  bjorn: { cols: ['#c8d8e8', '#ffffff'], attack: 'axeChop', skill: 'whirl', ranged: false, sound: 'chop', skillSound: 'shout' },
  sven: { cols: ['#4a9ae0', '#fff0a0'], attack: 'hook', skill: 'reel', ranged: true, sound: 'reel', skillSound: 'reel' },
  astra: { cols: ['#e2552a', '#c8f0ff'], attack: 'laser', skill: 'comets', ranged: true, sound: 'laser', skillSound: 'boom' },
  nyx: { cols: ['#7af06a', '#c08aff'], attack: 'skullOrb', skill: 'raise', ranged: true, sound: 'ghost', skillSound: 'ghost' },
  ignis: { cols: ['#ff6a1f', '#fbe08a'], attack: 'fireball', skill: 'inferno', ranged: true, sound: 'burn', skillSound: 'boom' },
  drakon: { cols: ['#ff6a1f', '#fbe08a'], attack: 'dragonLance', skill: 'dragonBreath', ranged: false, sound: 'slash', skillSound: 'roar' },
  tess: { cols: ['#e8c860', '#fff0b0'], attack: 'fork', skill: 'hay', ranged: false, sound: 'chop', skillSound: 'wood' },
  doc: { cols: ['#7af06a', '#c8ffb8'], attack: 'flask', skill: 'miasma', ranged: true, sound: 'bubble', skillSound: 'bubble' },
  ozzy: { cols: ['#e2338a', '#ff8ac8'], attack: 'riff', skill: 'larsen', ranged: true, sound: 'riff', skillSound: 'larsen' },
  yuki: { cols: ['#8ae8ff', '#e8f8ff'], attack: 'iceShard', skill: 'icicle', ranged: true, sound: 'ice', skillSound: 'ice' },
  sylva: { cols: ['#3aa89a', '#e8f0d0'], attack: 'arrow', skill: 'moonArrow', ranged: true, sound: 'arrow', skillSound: 'arrow' },
  thorn: { cols: ['#7ac85a', '#ff9ac8'], attack: 'leaf', skill: 'bloom', ranged: true, sound: 'leaf', skillSound: 'heal' },
  gorm: { cols: ['#b9c6d2', '#ff8a8a'], attack: 'cleaver', skill: 'frenzy', ranged: false, sound: 'chop', skillSound: 'roar' },
  zara: { cols: ['#4fd8c8', '#fbe08a'], attack: 'scimitar', skill: 'dance', ranged: false, sound: 'slash', skillSound: 'dance' },
  kitsune: { cols: ['#5ac8ff', '#c8f0ff'], attack: 'foxfire', skill: 'foxfireRain', ranged: true, sound: 'chime', skillSound: 'chime' },
  sybil: { cols: ['#c8a8ff', '#fbe08a'], attack: 'crystal', skill: 'prophecy', ranged: true, sound: 'holy', skillSound: 'legend' },
  grumli: { cols: ['#d8702a', '#fbe08a'], attack: 'smash', skill: 'stoneWall', ranged: false, sound: 'thud', skillSound: 'shout' },
  spike: { cols: ['#6ab85a', '#f0e8c8'], attack: 'thorns', skill: 'needleRain', ranged: true, sound: 'arrow', skillSound: 'arrow' },
  bip: { cols: ['#4ff0e8', '#ffffff'], attack: 'blaster', skill: 'blasterHit', ranged: true, sound: 'beep', skillSound: 'laser' },
  lulu: { cols: ['#d8a050', '#f2ead6'], attack: 'baguette', skill: 'bread', ranged: false, sound: 'bonk', skillSound: 'heal' },
  djmax: { cols: ['#ff4ab8', '#4ff0e8'], attack: 'vinyl', skill: 'drop', ranged: true, sound: 'scratch', skillSound: 'bass' },
  pablo: { cols: ['#f0d040', '#ffffff'], attack: 'letter', skill: 'parcel', ranged: true, sound: 'paper', skillSound: 'paper' },
  bob: { cols: ['#9ac08a', '#c8ffb8'], attack: 'scratch', skill: 'infect', ranged: false, sound: 'groan', skillSound: 'groan' },
  zip: { cols: ['#c8603a', '#fbe08a'], attack: 'kickflip', skill: 'ollie', ranged: false, sound: 'skate', skillSound: 'skate' },
  rexy: { cols: ['#5ac85a', '#fbe08a'], attack: 'chomp', skill: 'bigChomp', ranged: false, sound: 'crunch', skillSound: 'roar' },
  leo: { cols: ['#e0a93a', '#fff0b0'], attack: 'claws', skill: 'roarWave', ranged: false, sound: 'slash', skillSound: 'roar' },
  tonnerre: { cols: ['#fbe08a', '#c08aff'], attack: 'zapBolt', skill: 'chain', ranged: true, sound: 'thunder', skillSound: 'thunder' },
  ramses: { cols: ['#e8dcc0', '#e0a93a'], attack: 'wrap', skill: 'mummify', ranged: true, sound: 'paper', skillSound: 'ghost' },
  elixa: { cols: ['#ff8a2a', '#ffd080'], attack: 'flask', skill: 'elixir', ranged: true, sound: 'bubble', skillSound: 'bubble' },
  mako: { cols: ['#8aaac8', '#c8f0ff'], attack: 'fork', skill: 'sharkAttack', ranged: false, sound: 'splash', skillSound: 'crunch' },
  pixel: { cols: ['#9af098', '#4ff0e8'], attack: 'code', skill: 'hack', ranged: true, sound: 'beep', skillSound: 'beep' },
  lumi: { cols: ['#5ae05a', '#d8ffd0'], attack: 'saber', skill: 'saberSpin', ranged: false, sound: 'hum', skillSound: 'hum' },
  kero: { cols: ['#b9c6d2', '#ffffff'], attack: 'shuriken', skill: 'tongue', ranged: true, sound: 'arrow', skillSound: 'ribbit' },
  atlas: { cols: ['#4ff0e8', '#c8f6ff'], attack: 'rocket', skill: 'fortress', ranged: true, sound: 'rocket', skillSound: 'shield' },
  pyra: { cols: ['#ff6a1f', '#fbe08a'], attack: 'flameFeather', skill: 'rebirth', ranged: true, sound: 'burn', skillSound: 'legend' },
  mortis: { cols: ['#8ae8ff', '#e8f8ff'], attack: 'frostBolt', skill: 'blizzard', ranged: true, sound: 'ice', skillSound: 'ghost' },
  shoto: { cols: ['#8ae8ff', '#ff6a1f'], attack: 'iceFire', skill: 'glacier', ranged: true, sound: 'ice', skillSound: 'burn' },
  bakugo: { cols: ['#ff6a1f', '#fbe08a'], attack: 'blast', skill: 'howitzer', ranged: false, sound: 'explode', skillSound: 'explode' },
  redriot: { cols: ['#e2334a', '#d8d0d8'], attack: 'hardPunch', skill: 'harden', ranged: false, sound: 'punch', skillSound: 'clank' },
  deku: { cols: ['#5af08a', '#c8ffd8'], attack: 'smashPunch', skill: 'detroit', ranged: false, sound: 'punch', skillSound: 'smash' },
  allmight: { cols: ['#fbe08a', '#8ab4ff'], attack: 'texas', skill: 'usaSmash', ranged: false, sound: 'punch', skillSound: 'smash' },
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
