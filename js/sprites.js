// Tous les dessins du jeu. Règles : docs/DIRECTION_ARTISTIQUE.md
import { Spr } from './spr.js';

export const C = {
  skin: '#f0bf98', skinSh: '#cf8f6a', eye: '#21182a', mouth: '#a8584a',
  hair: '#6b4428', gold: '#e0a93a', goldHi: '#fbe08a', gem: '#e2334a',
  grip: '#5a3f2e', wood: '#7a5a3a', string: '#efe6cf', white: '#f2eef4', neon: '#4ff0e8',
};

// Métal selon le rang : cuir → fer → acier → or → ivoire.
export const METALS = [
  { c: '#8a6a4a', hi: '#a8865f' },
  { c: '#8e99a4', hi: '#b8c2cc' },
  { c: '#b9c6d2', hi: '#e4ecf3' },
  { c: '#e0a93a', hi: '#fbe08a' },
  { c: '#f2ead6', hi: '#ffffff' },
];

export const CLASS = {
  kael: { main: '#c8323c', dark: '#8c1f2e', pants: '#4a3a52' },
  lyra: { main: '#4f9e3c', dark: '#2f6a2a', pants: '#5a4a3a' },
  elio: { main: '#3a64c8', dark: '#26408a', pants: '#26408a', beard: '#d8d4cc' },
  sera: { main: '#d9548c', dark: '#9a3264', pants: '#6a3a5a' },
  volt: { main: '#7a3cc8', dark: '#4a2386', pants: '#2e2440', hair: '#2a2234', mask: '#3a2a4a' },
};

// Tables de recoloration des rangs supérieurs.
export const MYTHRIL = {
  '#e0a93a': '#5fd3e0', '#fbe08a': '#c8f6ff', '#8a6a4a': '#3a8ea0', '#7a5a3a': '#3a8ea0',
  '#5a3f2e': '#2a5a6e', '#e2334a': '#4ff0e8',
};
export const OBSIDIENNE = {
  '#e0a93a': '#2e2834', '#fbe08a': '#ff6a1f', '#8a6a4a': '#241e2c', '#7a5a3a': '#241e2c',
  '#5a3f2e': '#ff6a1f', '#e2334a': '#ffb030',
};
const CELESTE = {
  '#8a6a4a': '#e0a93a', '#7a5a3a': '#fbe08a', '#5a3f2e': '#c08a2a', '#efe6cf': '#ffffff',
};

// ---------------------------------------------------------------- base chibi

// Corps commun 20×20 : jambes 2 px, pieds 3 px, tête ~6×6, pas de nez.
function chibi(s, o) {
  if (o.cape) {
    s.r(6, 11, 8, 7, o.cape);
    s.v(5, 16, 17, o.cape);
    s.v(14, 16, 17, o.cape);
  }
  // jambes et pieds
  s.r(7, 16, 2, 2, o.pants);
  s.r(11, 16, 2, 2, o.pants);
  s.hl(6, 8, 18, o.boots);
  s.hl(11, 13, 18, o.boots);
  // corps
  s.r(7, 11, 6, 5, o.tunic);
  s.hl(7, 12, 15, o.dark);
  if (o.robe) s.hl(6, 13, 15, o.dark);
  s.hl(7, 12, 14, C.grip);
  s.p(9, 14, o.buckle || C.gold);
  arm(s, 6, -1, o.left || 'down', o.tunic);
  arm(s, 13, 1, o.right || 'down', o.tunic);
  // tête
  s.r(7, 5, 6, 5, C.skin);
  s.hl(8, 11, 10, C.skinSh);
  s.p(8, 7, C.eye, true);
  s.p(11, 7, C.eye, true);
  if (o.mouth !== false) s.hl(9, 10, 9, C.mouth);
}

// Bras : 'down' main le long du corps, 'out' main tendue, 'far' bras écarté.
function arm(s, x, dir, pose, tunic) {
  s.v(x, 11, 13, tunic);
  if (pose === 'down') s.p(x, 14, C.skin);
  else if (pose === 'out') s.p(x + dir, 13, C.skin);
  else { s.p(x + dir, 13, tunic); s.p(x + 2 * dir, 13, C.skin); }
}

function pauldrons(s, m) {
  s.r(5, 11, 2, 2, m.c);
  s.r(13, 11, 2, 2, m.c);
  s.p(5, 11, m.hi, true);
  s.p(13, 11, m.hi, true);
}

// Diadème du rang 4 : couronne d'or + gemme.
function tiara(s, y) {
  s.hl(7, 12, y, C.gold);
  s.p(7, y - 1, C.gold);
  s.p(12, y - 1, C.gold);
  s.r(9, y - 1, 2, 1, C.gold);
  s.p(8, y, C.goldHi, true);
  s.r(9, y, 2, 1, C.gem, true);
}

// ---------------------------------------------------------------- héros

function kael(rank) {
  const s = new Spr(20, 20), m = METALS[rank - 1], K = CLASS.kael;
  chibi(s, { tunic: K.main, dark: K.dark, pants: K.pants, boots: m.c, right: 'out', cape: rank >= 4 && K.dark });
  // cheveux en pointes
  s.r(6, 3, 8, 3, C.hair);
  s.v(6, 6, 7, C.hair);
  s.v(13, 6, 7, C.hair);
  s.p(7, 6, C.hair);
  if (rank === 1) { s.p(7, 2, C.hair); s.p(10, 2, C.hair); s.p(12, 2, C.hair); }
  if (rank >= 2) {
    // casque
    s.hl(7, 12, 2, m.c);
    s.r(6, 3, 8, 2, m.c);
    s.hl(6, 13, 5, m.c);
    s.p(8, 3, m.hi, true);
  }
  if (rank === 3) { s.hl(9, 10, 1, K.main); s.p(11, 1, K.main); s.p(11, 0, K.main); }
  if (rank >= 4) {
    s.p(7, 1, C.gold); s.p(12, 1, C.gold); s.r(9, 1, 2, 1, C.gold);
    s.r(9, 4, 2, 1, C.gem, true);
    s.hl(7, 12, 15, C.gold);
  }
  if (rank >= 3) pauldrons(s, m);
  // épée tenue à droite, pointe en haut
  const top = [8, 6, 4, 2][rank - 1];
  const wide = rank >= 3;
  s.v(15, top, 11, m.c);
  if (wide) s.v(16, top + 1, 11, m.c);
  s.p(15, top + 1, m.hi, true);
  s.hl(14, wide ? 17 : 16, 12, rank === 1 ? C.grip : rank >= 4 ? C.gold : m.c);
  if (rank >= 4) s.p(15, 12, C.gem, true);
  s.v(15, 13, 14, C.grip);
  s.p(15, 15, rank >= 3 ? C.gold : m.c);
  return s;
}

function lyra(rank) {
  const s = new Spr(20, 20), m = METALS[rank - 1], L = CLASS.lyra;
  // carquois dans le dos
  s.v(14, 9, 12, C.grip);
  s.p(14, 8, C.white);
  s.p(15, 8, C.gem);
  chibi(s, { tunic: L.main, dark: L.dark, pants: L.pants, boots: m.c, left: 'out', cape: rank >= 4 && L.dark });
  // capuche
  s.hl(7, 12, 2, L.main);
  s.r(6, 3, 8, 2, L.main);
  s.v(6, 5, 9, L.main);
  s.v(13, 5, 9, L.main);
  s.hl(7, 12, 5, C.hair);
  s.p(7, 6, C.hair);
  if (rank >= 2 && rank < 4) { s.hl(7, 12, 4, m.c); s.p(8, 4, m.hi, true); }
  if (rank >= 3) { s.p(13, 2, C.gem); s.p(14, 1, C.gem); }
  if (rank >= 4) { tiara(s, 4); s.hl(7, 12, 15, C.gold); }
  if (rank >= 3) pauldrons(s, m);
  // arc à gauche
  const y0 = rank >= 3 ? 6 : 8, y1 = rank >= 3 ? 18 : 16;
  s.p(4, y0, m.c);
  s.p(3, y0 + 1, m.c);
  s.v(2, y0 + 2, y1 - 2, m.c);
  s.p(3, y1 - 1, m.c);
  s.p(4, y1, m.c);
  s.v(4, y0 + 1, y1 - 1, C.string, true);
  s.p(2, y0 + 3, m.hi, true);
  if (rank >= 4) s.p(2, 12, C.gem, true);
  return s;
}

function elio(rank) {
  const s = new Spr(20, 20), m = METALS[rank - 1], E = CLASS.elio;
  chibi(s, { tunic: E.main, dark: E.dark, pants: E.pants, boots: m.c, right: 'out', mouth: false, cape: rank >= 4 && E.dark });
  // barbe d'une ligne, cheveux gris
  s.hl(8, 11, 10, E.beard);
  s.v(6, 6, 8, E.beard);
  s.v(13, 6, 8, E.beard);
  // chapeau pointu
  s.hl(6, 13, 5, E.dark);
  s.hl(7, 12, 4, E.main);
  s.hl(8, 11, 3, E.main);
  s.hl(9, 11, 2, E.main);
  s.hl(11, 12, 1, E.main);
  if (rank >= 2 && rank < 4) { s.hl(7, 12, 4, m.c); s.p(8, 4, m.hi, true); }
  if (rank >= 4) { tiara(s, 4); s.p(10, 2, C.goldHi, true); s.hl(7, 12, 15, C.gold); }
  if (rank >= 3) pauldrons(s, m);
  // bâton avec orbe
  const big = rank >= 3;
  const top = big ? 1 : 3;
  s.v(15, big ? 4 : 5, 18, rank >= 4 ? C.gold : C.wood);
  if (big) {
    s.r(14, top, 3, 3, '#5ab4ff', true);
    s.p(14, top, '#d8f4ff', true);
    s.p(16, top + 2, '#2f78d0', true);
    s.p(14, 4, m.c);
    s.p(16, 4, m.c);
  } else {
    s.r(15, top, 2, 2, '#5ab4ff', true);
    s.p(15, top, '#d8f4ff', true);
    s.p(16, top + 1, '#2f78d0', true);
    if (rank === 2) s.p(16, 5, m.c);
  }
  return s;
}

function sera(rank) {
  const s = new Spr(20, 20), m = METALS[rank - 1], S = CLASS.sera;
  chibi(s, { tunic: S.main, dark: S.dark, pants: S.pants, boots: m.c, left: 'far', robe: true, cape: rank >= 4 && S.dark });
  // étole blanche
  s.v(9, 11, 13, C.white);
  s.v(10, 11, 13, C.white);
  // voile
  s.hl(7, 12, 2, C.white);
  s.r(6, 3, 8, 2, C.white);
  s.v(6, 5, 10, C.white);
  s.v(13, 5, 10, C.white);
  s.hl(7, 12, 5, C.hair);
  if (rank >= 2 && rank < 4) { s.hl(7, 12, 4, m.c); s.p(8, 4, m.hi, true); }
  if (rank >= 4) { tiara(s, 4); s.hl(6, 13, 15, C.gold); }
  if (rank >= 3) pauldrons(s, m);
  // bâton à anneau
  const top = rank >= 3 ? 3 : 5;
  s.p(3, top, m.c);
  s.v(2, top + 1, top + 2, m.c);
  s.v(4, top + 1, top + 2, m.c);
  s.p(3, top + 3, m.c);
  s.p(3, top, m.hi, true);
  if (rank >= 4) s.v(3, top + 1, top + 2, C.gem, true);
  s.v(3, top + 4, 18, rank >= 4 ? C.gold : C.wood);
  return s;
}

function volt(rank) {
  const s = new Spr(20, 20), m = METALS[rank - 1], V = CLASS.volt;
  chibi(s, { tunic: V.main, dark: V.dark, pants: V.pants, boots: m.c, right: 'out', mouth: false, buckle: C.neon, cape: rank >= 4 && V.dark });
  s.hl(7, 12, 14, C.neon, true);
  s.p(8, 12, C.neon, true);
  // cheveux noirs en pointes
  s.r(6, 3, 8, 2, V.hair);
  s.p(6, 2, V.hair); s.p(9, 2, V.hair); s.p(12, 2, V.hair);
  s.v(6, 6, 7, V.hair);
  s.v(13, 6, 7, V.hair);
  // bandeau avec pans qui flottent
  s.hl(6, 13, 5, V.main);
  s.p(5, 5, V.main); s.p(4, 6, V.main); s.p(3, 6, V.main);
  // masque
  s.hl(7, 12, 9, V.mask);
  s.hl(8, 11, 10, V.mask);
  if (rank >= 2) { s.hl(8, 11, 5, m.c); s.p(9, 5, m.hi, true); }
  if (rank >= 4) {
    // cimier en V doré
    s.p(7, 1, C.gold); s.p(8, 2, C.gold); s.p(11, 2, C.gold); s.p(12, 1, C.gold);
    s.r(9, 3, 2, 1, C.gem, true);
  }
  if (rank >= 3) pauldrons(s, m);
  // lame : fer, acier puis plasma néon
  const top = [9, 7, 4, 2][rank - 1];
  if (rank <= 2) {
    const b = METALS[rank].c;
    s.v(15, top, 11, b);
    s.p(15, top + 1, METALS[rank].hi, true);
  } else {
    s.v(15, top, 11, C.neon, true);
    s.v(16, top + 1, 10, '#2fb8c8', true);
    s.p(15, top + 1, '#ffffff', true);
  }
  s.hl(14, 16, 12, m.c);
  s.v(15, 13, 14, V.hair);
  s.p(15, 14, V.main);
  return s;
}

// Rang 5 « Céleste » : recolor du rang 4, 24×24, ailes, auréole, étincelles.
function celestial(base, cls) {
  const t = { ...CELESTE, [cls.main]: '#f2ead6', [cls.dark]: '#d8c49a', [cls.pants]: '#c8b48a', [C.gem]: cls.main };
  const s = base.recolor(t).grow(24, 24, 2, 3);
  const wing = [[7, 6, 8], [8, 4, 8], [9, 3, 8], [10, 2, 8], [11, 3, 8], [12, 4, 8], [13, 6, 8]];
  for (const [y, x0, x1] of wing)
    for (let x = x0; x <= x1; x++) {
      const c = x === x0 ? '#e4dcc8' : '#fff8ec';
      s.under(x, y, c);
      s.under(23 - x, y, c);
    }
  s.hl(10, 13, 1, C.goldHi, true);
  s.p(9, 1, C.gold, true);
  s.p(14, 1, C.gold, true);
  for (const [x, y] of [[1, 4], [22, 3], [0, 13], [23, 10], [2, 21], [21, 22]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}

const DRAW = { kael, lyra, elio, sera, volt };

export function heroSprite(id, rank) {
  if (rank >= 5) return celestial(DRAW[id](4), CLASS[id]);
  return DRAW[id](rank);
}

// ---------------------------------------------------------------- ennemis

function slime() {
  const s = new Spr(20, 20), a = '#5cc85a', d = '#3a8e3e';
  s.hl(8, 11, 9, a);
  s.hl(6, 13, 10, a);
  s.r(5, 11, 10, 5, a);
  s.hl(5, 14, 16, d);
  s.hl(6, 13, 17, d);
  s.p(8, 13, C.eye, true);
  s.p(11, 13, C.eye, true);
  s.hl(9, 10, 15, d);
  s.p(7, 11, '#d8ffd0', true);
  s.p(6, 12, '#d8ffd0', true);
  return s;
}

function goblin() {
  const s = new Spr(20, 20), g = '#7ab84a', gs = '#4e8a34', rag = '#7a5a3a', ragD = '#5a4028';
  // gourdin à gauche
  s.r(2, 7, 3, 4, '#6a4a32');
  s.p(2, 8, '#b9c6d2', true);
  s.p(4, 10, '#b9c6d2', true);
  s.v(4, 11, 14, C.grip);
  // corps
  s.r(7, 16, 2, 2, ragD);
  s.r(11, 16, 2, 2, ragD);
  s.hl(6, 8, 18, gs);
  s.hl(11, 13, 18, gs);
  s.r(7, 11, 6, 4, rag);
  s.p(7, 15, rag); s.p(9, 15, rag); s.p(11, 15, rag);
  s.hl(7, 12, 14, ragD);
  s.v(6, 11, 13, g); s.p(5, 13, g);
  s.v(13, 11, 13, g); s.p(13, 14, g);
  // tête et oreilles pointues
  s.hl(8, 11, 4, g);
  s.r(7, 5, 6, 5, g);
  s.hl(8, 11, 10, gs);
  s.p(6, 6, g); s.p(5, 6, g); s.p(4, 5, g);
  s.p(13, 6, g); s.p(14, 6, g); s.p(15, 5, g);
  s.p(8, 7, '#f0d040', true);
  s.p(11, 7, '#f0d040', true);
  s.hl(8, 11, 9, '#3a2a2a');
  s.p(10, 9, '#f2ead6', true);
  return s;
}

function skeleton() {
  const s = new Spr(20, 20), b = '#e8e0cc', bd = '#b8ac90', hole = '#3a2a40';
  // épée rouillée à gauche
  s.v(4, 4, 11, '#9a8a7a');
  s.p(4, 5, '#c8bcb0', true);
  s.p(4, 8, '#a0583a');
  s.hl(3, 5, 12, '#6a4a32');
  // crâne
  s.hl(8, 11, 3, b);
  s.r(7, 4, 6, 5, b);
  s.hl(8, 11, 9, b);
  s.hl(8, 11, 10, bd);
  s.p(9, 10, hole, true);
  s.r(8, 6, 1, 1, C.eye, true);
  s.r(11, 6, 1, 1, C.eye, true);
  // cage thoracique
  s.hl(7, 12, 11, b);
  s.hl(7, 12, 13, b);
  s.p(7, 12, hole, true); s.p(8, 12, hole, true); s.p(11, 12, hole, true); s.p(12, 12, hole, true);
  s.p(9, 12, b); s.p(10, 12, b);
  s.p(9, 14, b); s.p(10, 14, b);
  s.hl(8, 11, 15, bd);
  s.v(6, 11, 13, b); s.p(5, 13, b);
  s.v(13, 11, 13, b); s.p(13, 14, b);
  s.v(8, 16, 17, b);
  s.v(11, 16, 17, b);
  s.hl(6, 8, 18, bd);
  s.hl(11, 13, 18, bd);
  return s;
}

function golem() {
  const s = new Spr(24, 24), st = '#8a8478', sd = '#5e584e', cr = '#4a453e', moss = '#5a8a3a';
  s.r(8, 18, 3, 3, sd);
  s.r(13, 18, 3, 3, sd);
  s.hl(7, 10, 21, st);
  s.hl(13, 16, 21, st);
  s.r(6, 8, 12, 9, st);
  s.hl(7, 16, 17, st);
  s.r(9, 3, 6, 5, st);
  s.hl(9, 14, 4, sd);
  s.p(10, 5, C.goldHi, true);
  s.p(13, 5, C.goldHi, true);
  s.r(3, 7, 4, 4, st);
  s.r(17, 7, 4, 4, st);
  s.r(3, 11, 3, 5, st);
  s.r(18, 11, 3, 5, st);
  s.r(2, 16, 4, 3, sd);
  s.r(18, 16, 4, 3, sd);
  s.r(11, 11, 2, 2, C.gem, true);
  s.p(11, 11, '#ff8a9a', true);
  s.sline(8, 9, 9, 12, cr);
  s.sline(15, 13, 16, 15, cr);
  s.p(4, 9, cr);
  s.p(19, 13, cr);
  s.hl(3, 5, 7, moss);
  s.hl(18, 20, 7, moss);
  s.p(9, 3, moss); s.p(10, 3, moss);
  return s;
}

function dragon() {
  const s = new Spr(28, 27), sc = '#c8402a', sd = '#8c2a22', wm = '#a83a2a', bel = '#f0c060', belD = '#d09a3a', horn = '#f2ead6';
  // aile (derrière)
  const wing = [[2, 16, 18], [3, 15, 21], [4, 15, 24], [5, 14, 24], [6, 14, 23], [7, 14, 23], [8, 13, 22], [9, 13, 21], [10, 13, 20]];
  for (const [y, x0, x1] of wing) s.hl(x0, x1, y + 2, wm);
  s.sline(13, 12, 16, 4, sd);
  s.sline(16, 4, 24, 6, sd);
  s.sline(16, 4, 22, 11, sd);
  // queue
  s.r(20, 18, 4, 3, sc);
  s.r(23, 15, 2, 4, sc);
  s.p(25, 14, sc);
  s.p(25, 13, horn);
  // corps
  const body = [[13, 11, 18], [14, 10, 20], [15, 9, 21], [16, 9, 21], [17, 9, 21], [18, 9, 21], [19, 9, 21], [20, 9, 21], [21, 10, 20], [22, 11, 19]];
  for (const [y, x0, x1] of body) s.hl(x0, x1, y, sc);
  s.r(9, 16, 5, 6, bel);
  s.hl(9, 13, 18, belD);
  s.hl(9, 13, 20, belD);
  // cou et tête (tournée vers la gauche)
  s.r(7, 10, 4, 5, sc);
  s.v(7, 11, 14, bel);
  s.hl(4, 9, 7, sc);
  s.r(2, 8, 8, 3, sc);
  s.hl(3, 9, 11, sc);
  s.hl(5, 8, 12, sc);
  s.hl(3, 7, 10, sd);
  s.p(4, 11, horn, true);
  s.p(6, 11, horn, true);
  s.p(3, 8, C.eye, true);
  s.p(7, 8, C.goldHi, true);
  s.sline(8, 6, 10, 3, horn);
  s.sline(6, 6, 6, 5, horn);
  // pattes
  s.r(10, 23, 3, 2, sc);
  s.hl(9, 12, 25, sd);
  s.p(9, 25, horn, true);
  s.r(17, 23, 3, 2, sc);
  s.hl(16, 19, 25, sd);
  s.p(16, 25, horn, true);
  return s;
}

// Variantes = même dessin, autre palette.
const ENEMIES = {
  slime: {
    draw: slime, size: 20,
    variants: {
      vert: {},
      bleu: { '#5cc85a': '#4a8ee0', '#3a8e3e': '#2e5aa8', '#d8ffd0': '#d8f0ff' },
      violet: { '#5cc85a': '#9a5ad8', '#3a8e3e': '#62349a', '#d8ffd0': '#f0d8ff' },
      rouge: { '#5cc85a': '#e0503a', '#3a8e3e': '#a02e28', '#d8ffd0': '#ffd8c8' },
    },
  },
  goblin: {
    draw: goblin, size: 20,
    variants: {
      vert: {},
      gris: { '#7ab84a': '#8a96a8', '#4e8a34': '#5e6a80' },
      rouge: { '#7ab84a': '#d0644a', '#4e8a34': '#9a3e30', '#7a5a3a': '#4a3a52', '#5a4028': '#2e2440' },
    },
  },
  skeleton: {
    draw: skeleton, size: 20,
    variants: {
      os: {},
      spectre: { '#e8e0cc': '#9ae8e0', '#b8ac90': '#5ab8b0', '#21182a': '#e2334a' },
      obsidienne: { '#e8e0cc': '#3a3040', '#b8ac90': '#2a2232', '#21182a': '#ff6a1f', '#3a2a40': '#ff6a1f' },
    },
  },
  golem: {
    draw: golem, size: 24,
    variants: {
      pierre: {},
      mythril: { '#8a8478': '#5fb8c8', '#5e584e': '#3a7a8e', '#4a453e': '#2a5468', '#5a8a3a': '#c8f6ff', '#fbe08a': '#ffffff', '#e2334a': '#4ff0e8' },
      obsidienne: { '#8a8478': '#2e2834', '#5e584e': '#241e2c', '#4a453e': '#ff6a1f', '#5a8a3a': '#ff9a3a', '#fbe08a': '#ff6a1f', '#e2334a': '#ffd040' },
    },
  },
  dragon: {
    draw: dragon, size: 28,
    variants: {
      rouge: {},
      obsidienne: { '#c8402a': '#3a3040', '#8c2a22': '#241e2c', '#a83a2a': '#ff6a1f', '#f0c060': '#ff9a3a', '#d09a3a': '#d0601a', '#fbe08a': '#ff6a1f' },
      celeste: { '#c8402a': '#f2ead6', '#8c2a22': '#c8b48a', '#a83a2a': '#fbe08a', '#f0c060': '#e0a93a', '#d09a3a': '#b8862a', '#f2ead6': '#e0a93a', '#fbe08a': '#4ff0e8' },
    },
  },
};

export function enemySprite(kind, variant) {
  const e = ENEMIES[kind];
  return e.draw().recolor(e.variants[variant] || {});
}

// ---------------------------------------------------------------- UI

export function coinSprite() {
  const s = new Spr(9, 9);
  s.hl(3, 5, 1, C.gold);
  s.r(2, 2, 5, 5, C.gold);
  s.v(1, 3, 5, C.gold);
  s.v(7, 3, 5, C.gold);
  s.hl(3, 5, 7, C.gold);
  s.v(4, 3, 5, '#b8862a', true);
  s.p(3, 2, C.goldHi, true);
  return s;
}

export function gemSprite() {
  const s = new Spr(9, 9);
  s.hl(3, 5, 1, C.gem);
  s.hl(2, 6, 2, C.gem);
  s.hl(1, 7, 3, C.gem);
  s.hl(2, 6, 4, C.gem);
  s.hl(3, 5, 5, C.gem);
  s.p(4, 6, C.gem);
  s.p(3, 2, '#ff9aa8', true);
  return s;
}

// Étoile de rareté (7×7).
export function starSprite() {
  const s = new Spr(9, 9);
  s.p(4, 1, C.gold); s.hl(3, 5, 2, C.gold); s.hl(1, 7, 3, C.gold); s.hl(2, 6, 4, C.gold);
  s.hl(2, 6, 5, C.gold); s.p(2, 6, C.gold); s.p(6, 6, C.gold); s.p(4, 2, C.goldHi, true);
  return s;
}

// Cristal d'invocation sur son socle (28×32).
export function crystalSprite() {
  const s = new Spr(28, 32), a = '#9a5ad8', d = '#62349a', l = '#c89af0', st = '#8a8478', sd = '#5e584e';
  // socle
  s.r(7, 25, 14, 3, st); s.r(5, 28, 18, 2, sd); s.hl(8, 19, 24, sd);
  s.p(9, 26, C.gem, true); s.p(14, 26, C.gold, true); s.p(18, 26, C.gem, true);
  // cristal (losange)
  const rows = [[2, 13, 14], [3, 12, 15], [4, 11, 16], [5, 10, 17], [6, 10, 17], [7, 9, 18], [8, 9, 18], [9, 8, 19], [10, 8, 19],
    [11, 8, 19], [12, 8, 19], [13, 9, 18], [14, 9, 18], [15, 10, 17], [16, 10, 17], [17, 11, 16], [18, 11, 16], [19, 12, 15], [20, 12, 15], [21, 13, 14]];
  for (const [y, x0, x1] of rows) s.hl(x0, x1, y, a, true);
  for (const [y, x0, x1] of rows) { s.p(x0, y, l, true); s.p(x1, y, d, true); }
  s.v(13, 3, 20, l, true);
  s.v(11, 7, 12, '#ffffff', true);
  s.p(12, 5, '#ffffff', true);
  s.r(14, 9, 3, 8, d, true);
  // rayons
  s.v(13, 22, 23, l, true); s.v(14, 22, 23, a, true);
  for (const [x, y] of [[3, 6], [24, 4], [2, 16], [25, 14], [6, 1], [21, 20], [1, 22], [26, 23]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}
