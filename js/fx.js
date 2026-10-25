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
