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

// main : couleur signature ; dark : ombre et ourlet ; trim : col, broderies ; pants : jambes.
export const CLASS = {
  kael: { main: '#c8323c', dark: '#8c1f2e', trim: '#f08a7a', pants: '#4a3a52' },
  lyra: { main: '#4f9e3c', dark: '#2f6a2a', trim: '#c8e08a', pants: '#5a4a3a' },
  elio: { main: '#3a64c8', dark: '#26408a', trim: '#e0a93a', pants: '#26408a', beard: '#e8e4dc' },
  sera: { main: '#d9548c', dark: '#9a3264', trim: '#ffd0e0', pants: '#6a3a5a' },
  volt: { main: '#7a3cc8', dark: '#4a2386', trim: '#a878e8', pants: '#2e2440', hair: '#2a2234', mask: '#3a2a4a' },
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

// Héros 24×24 : grosse tête (8×7), yeux de 2 px, joues roses, pas de nez ; corps de 8×6 avec col,
// plis, ceinture et ourlet brodé ; jambes de 2 px, bottes de 3 px à semelle sombre.
// Les pieds touchent le bas de la grille (y = 23) ; tout ce qui dépasse en haut (casque, chapeau,
// arme) a les rangées 0 à 4.
const BLUSH = '#f0907a';

function body(s, o) {
  const T = o.tunic, D = o.dark;
  // cape derrière le corps
  if (o.cape) {
    s.r(7, 14, 10, 8, o.cape);
    s.hl(6, 17, 22, o.cape);
    s.p(9, 20, shadeOf(o.cape)); s.p(14, 21, shadeOf(o.cape));
  }
  // jambes et bottes
  if (!o.robe) {
    s.r(9, 20, 2, 2, o.pants);
    s.r(13, 20, 2, 2, o.pants);
  }
  for (const x0 of [8, 13]) {
    s.hl(x0, x0 + 2, 22, o.boots);
    s.hl(x0, x0 + 2, 23, o.sole);
    s.p(x0, 22, o.bootsHi, true);
  }
  // torse (et robe longue)
  s.r(8, 14, 8, 6, T);
  if (o.robe) {
    s.r(8, 20, 8, 2, T);
    s.hl(7, 16, 21, D);
    for (let x = 8; x <= 15; x += 2) s.p(x, 21, o.trim);
    s.p(10, 20, D); s.p(13, 20, D);
  }
  s.hl(10, 13, 14, o.trim); // col
  s.p(11, 15, o.trim);
  s.hl(8, 15, 19, D); // ourlet brodé
  for (let x = 9; x <= 15; x += 3) s.p(x, 19, o.trim);
  s.hl(8, 15, 18, o.belt || C.grip); // ceinture
  s.r(11, 18, 2, 1, o.buckle || C.gold);
  s.p(11, 18, C.goldHi, true);
  // bras (2 px) détachés du torse par une ombre, poignets brodés, mains sous la ceinture
  s.v(8, 15, 17, D); s.v(15, 15, 17, D);
  for (const x of [6, 16]) {
    s.r(x, 14, 2, 4, T);
    s.hl(x, x + 1, 17, o.trim);
    s.r(x, 18, 2, 1, C.skin);
    s.p(x, 19, C.skinSh);
  }
  if (o.bracers) { s.hl(6, 7, 16, o.bracers); s.hl(16, 17, 16, o.bracers); }
  // tête
  s.r(8, 7, 8, 7, C.skin);
  s.hl(9, 14, 13, C.skinSh);
  s.v(10, 10, 11, C.eye, true);
  s.v(13, 10, 11, C.eye, true);
  s.p(9, 12, BLUSH, true);
  s.p(14, 12, BLUSH, true);
  if (o.mouth !== false) s.p(11, 12, C.mouth, true);
}

const shadeOf = (c) => ({ '#8c1f2e': '#6a1420', '#2f6a2a': '#1e4a1c', '#26408a': '#1a2c66', '#9a3264': '#6e2046', '#4a2386': '#341862' })[c] || c;

// Épaulières de métal (rang 3 et plus).
function pauldrons(s, m) {
  for (const x of [5, 16]) {
    s.r(x, 13, 3, 2, m.c);
    s.p(x + 1, 13, m.hi, true);
  }
}

// Diadème d'or avec une gemme, à la hauteur y.
function tiara(s, y, x0 = 8, x1 = 15) {
  s.hl(x0, x1, y, C.gold);
  s.p(x0, y - 1, C.gold); s.p(x1, y - 1, C.gold);
  s.r(11, y - 2, 2, 2, C.gold);
  s.p(x0 + 1, y, C.goldHi, true);
  s.r(11, y - 1, 2, 1, C.gem, true);
  s.p(11, y - 2, C.goldHi, true);
}

// Bottes selon le rang : cuir puis métal.
const boots = (m) => ({ boots: m.c, bootsHi: m.hi, sole: '#3a2a22' });

// ---------------------------------------------------------------- héros

function kael(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = CLASS.kael, H = C.hair, HH = '#8a5a34';
  body(s, { tunic: K.main, dark: K.dark, trim: rank >= 4 ? C.gold : K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // cheveux en pointes, mèches claires
  s.r(8, 5, 8, 3, H);
  for (const [x, y] of [[8, 4], [10, 3], [11, 4], [13, 3], [15, 4], [16, 5]]) s.p(x, y, H);
  s.v(7, 6, 10, H); s.v(16, 6, 10, H);
  s.p(9, 8, H); s.p(12, 8, H); s.p(14, 8, H); s.p(15, 8, H);
  s.p(10, 5, HH, true); s.p(13, 6, HH, true); s.p(11, 4, HH, true);
  if (rank >= 2) {
    // casque à rivets, nasal absent (pas de nez)
    s.r(8, 3, 8, 4, m.c);
    s.hl(9, 14, 2, m.c);
    s.hl(7, 16, 7, m.c);
    s.p(9, 3, m.hi, true); s.p(10, 2, m.hi, true);
    s.p(8, 7, m.hi, true); s.p(15, 7, m.hi, true);
    s.v(12, 3, 6, rank >= 4 ? C.gold : '#6a7480');
  }
  if (rank === 3) { s.v(12, 0, 1, K.main); s.p(13, 0, K.main); s.p(13, 1, K.dark); s.p(11, 1, K.main); }
  if (rank >= 4) {
    for (const x of [8, 10, 13, 15]) s.p(x, 2, C.gold);
    s.p(10, 1, C.goldHi, true); s.p(13, 1, C.goldHi, true);
    s.r(11, 4, 2, 2, C.gem, true);
    s.p(11, 4, '#ff8a9a', true);
  }
  if (rank >= 3) pauldrons(s, m);
  // épée à droite : lame avec gouttière, garde, poignée gainée, pommeau
  const top = [10, 7, 4, 1][rank - 1], wide = rank >= 3;
  s.v(18, top, 17, m.c);
  if (wide) s.v(19, top + 1, 17, m.c);
  s.v(18, top + 2, 15, m.hi, true);
  if (wide) s.v(19, top + 3, 15, shade2(m.c), true);
  s.hl(17, wide ? 20 : 19, 18, rank === 1 ? C.grip : rank >= 4 ? C.gold : m.c);
  if (rank >= 4) s.p(18, 18, C.gem, true);
  s.v(18, 19, 20, C.grip);
  s.p(18, 20, '#7a5a3a', true);
  s.p(18, 21, rank >= 3 ? C.gold : m.c);
  return s;
}

function lyra(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], L = CLASS.lyra;
  // carquois dans le dos, empennages qui dépassent
  s.r(16, 10, 2, 6, C.grip);
  s.p(16, 9, C.white); s.p(17, 8, C.white); s.p(17, 9, C.gem); s.p(16, 8, C.gem);
  body(s, { tunic: L.main, dark: L.dark, trim: rank >= 4 ? C.gold : L.trim, pants: L.pants, ...boots(m), cape: rank >= 4 && L.dark, bracers: rank >= 3 && m.c });
  // capuche
  s.hl(9, 14, 4, L.main);
  s.r(8, 5, 8, 3, L.main);
  s.v(7, 6, 13, L.main); s.v(16, 6, 13, L.main);
  s.p(15, 3, L.main); s.p(16, 4, L.main);
  s.p(9, 5, '#7ac85a', true); s.p(10, 4, '#7ac85a', true);
  // frange sous la capuche
  s.hl(8, 15, 8, C.hair);
  s.p(9, 9, C.hair); s.p(14, 9, C.hair);
  s.p(11, 8, '#8a5a34', true);
  if (rank >= 2 && rank < 4) { s.hl(8, 15, 7, m.c); s.p(9, 7, m.hi, true); }
  if (rank >= 3) { s.p(17, 3, C.gem); s.p(18, 2, C.gem); s.p(18, 3, '#ff8a9a', true); }
  if (rank >= 4) tiara(s, 7);
  if (rank >= 3) pauldrons(s, m);
  // arc à gauche, poignée gainée, corde
  const y0 = rank >= 3 ? 7 : 9, y1 = 23, mid = (y0 + y1) >> 1;
  s.p(5, y0, m.c); s.p(4, y0 + 1, m.c);
  s.v(3, y0 + 2, y1 - 2, m.c);
  s.p(4, y1 - 1, m.c); s.p(5, y1, m.c);
  s.v(5, y0 + 1, y1 - 1, C.string, true);
  s.v(3, y0 + 3, y0 + 5, m.hi, true);
  s.v(3, mid - 1, mid + 1, C.grip);
  if (rank >= 4) s.p(3, mid, C.gem, true);
  return s;
}

function elio(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], E = CLASS.elio, B = E.beard, BS = '#b0aaa0';
  body(s, { tunic: E.main, dark: E.dark, trim: rank >= 4 ? C.gold : E.trim, pants: E.pants, ...boots(m), robe: true, mouth: false, cape: rank >= 4 && E.dark });
  // longue barbe et moustache, sourcils blancs
  s.hl(10, 13, 12, B);
  s.r(9, 13, 6, 3, B);
  s.hl(10, 13, 16, B);
  s.p(11, 17, B);
  s.p(10, 14, BS); s.p(12, 15, BS); s.p(13, 13, BS); s.p(11, 16, BS);
  s.p(10, 9, B); s.p(13, 9, B);
  s.v(7, 8, 11, B); s.v(16, 8, 11, B);
  // chapeau pointu à bord large, pointe qui retombe, étoile
  s.hl(6, 17, 7, E.dark);
  s.hl(8, 15, 6, rank >= 2 && rank < 4 ? m.c : E.trim);
  s.hl(9, 14, 5, E.main);
  s.hl(9, 13, 4, E.main);
  s.hl(10, 13, 3, E.main);
  s.hl(11, 13, 2, E.main);
  s.hl(12, 14, 1, E.main);
  s.hl(14, 15, 0, E.main);
  s.p(10, 4, '#5a84e0', true); s.p(11, 3, '#5a84e0', true);
  s.p(12, 4, C.goldHi, true);
  if (rank >= 2 && rank < 4) s.p(9, 6, m.hi, true);
  if (rank >= 4) { tiara(s, 6); s.p(12, 2, C.goldHi, true); }
  if (rank >= 3) pauldrons(s, m);
  // bâton à droite, veines du bois, orbe lumineux
  const big = rank >= 3, top = big ? 1 : 3, wood = rank >= 4 ? C.gold : C.wood;
  s.v(19, big ? 5 : 5, 23, wood);
  for (let y = 7; y < 23; y += 3) s.p(19, y, rank >= 4 ? C.goldHi : '#5a3f2e', true);
  if (big) {
    s.r(18, top, 3, 3, '#5ab4ff', true);
    s.p(18, top, '#d8f4ff', true);
    s.p(19, top + 1, '#ffffff', true);
    s.p(20, top + 2, '#2f78d0', true);
    s.p(18, 4, m.c); s.p(20, 4, m.c); s.p(19, 4, m.c);
  } else {
    s.r(19, top, 2, 2, '#5ab4ff', true);
    s.p(19, top, '#d8f4ff', true);
    s.p(20, top + 1, '#2f78d0', true);
    if (rank === 2) s.p(20, 4, m.c);
  }
  return s;
}

function sera(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], S = CLASS.sera, W = C.white, HR = '#e8c070';
  body(s, { tunic: S.main, dark: S.dark, trim: rank >= 4 ? C.gold : S.trim, pants: S.pants, ...boots(m), robe: true, cape: rank >= 4 && S.dark });
  // étole blanche et petite croix d'or
  s.v(11, 14, 21, W); s.v(12, 14, 21, W);
  s.p(11, 16, C.gold, true); s.p(12, 16, C.gold, true); s.p(11, 15, C.gold, true);
  s.p(12, 19, '#d8d0c8');
  // voile blanc liseré de rose, mèches dorées
  s.hl(9, 14, 4, W);
  s.r(8, 5, 8, 3, W);
  s.v(7, 6, 15, W); s.v(16, 6, 15, W);
  s.v(7, 13, 15, S.main); s.v(16, 13, 15, S.main);
  s.hl(8, 15, 8, HR);
  s.p(9, 9, HR); s.p(14, 9, HR); s.p(8, 9, HR); s.p(15, 9, HR);
  s.p(10, 8, '#fff0b0', true); s.p(13, 8, '#fff0b0', true);
  s.p(9, 5, '#ffffff', true);
  if (rank >= 2 && rank < 4) { s.hl(8, 15, 7, m.c); s.p(9, 7, m.hi, true); }
  if (rank >= 4) tiara(s, 7);
  if (rank >= 3) pauldrons(s, m);
  // bâton à anneau à gauche
  const top = rank >= 3 ? 3 : 6;
  s.p(4, top, m.c);
  s.v(3, top + 1, top + 3, m.c); s.v(5, top + 1, top + 3, m.c);
  s.p(4, top + 4, m.c);
  s.p(3, top + 1, m.hi, true);
  if (rank >= 4) s.v(4, top + 1, top + 3, C.gem, true);
  else if (rank >= 3) s.p(4, top + 2, '#ff9ac8', true);
  s.v(4, top + 5, 23, rank >= 4 ? C.gold : C.wood);
  for (let y = top + 7; y < 23; y += 3) s.p(4, y, rank >= 4 ? C.goldHi : '#5a3f2e', true);
  return s;
}

function volt(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], V = CLASS.volt;
  body(s, { tunic: V.main, dark: V.dark, trim: V.trim, pants: V.pants, ...boots(m), mouth: false, buckle: C.neon, cape: rank >= 4 && V.dark, belt: V.mask });
  s.p(10, 16, C.neon, true); // un seul éclat néon sur la poitrine, plus la boucle
  // cheveux noirs en pointes
  s.r(8, 4, 8, 3, V.hair);
  for (const [x, y] of [[8, 3], [10, 2], [12, 3], [14, 2], [16, 4]]) s.p(x, y, V.hair);
  s.v(7, 6, 10, V.hair); s.v(16, 6, 10, V.hair);
  s.p(10, 4, '#4a3e5a', true); s.p(13, 5, '#4a3e5a', true);
  // bandeau avec pans qui flottent
  s.hl(7, 16, 7, V.main);
  s.p(6, 7, V.main); s.p(5, 8, V.main); s.p(4, 8, V.main); s.p(5, 9, V.dark); s.p(3, 9, V.dark);
  s.p(12, 7, C.neon, true);
  // masque sous les yeux, ligne néon
  s.r(8, 12, 8, 2, V.mask);
  s.hl(9, 14, 12, V.mask);
  s.p(13, 13, C.neon, true);
  if (rank >= 2) { s.hl(9, 14, 7, m.c); s.p(10, 7, m.hi, true); }
  if (rank >= 4) {
    s.p(8, 1, C.gold); s.p(9, 2, C.gold); s.p(14, 2, C.gold); s.p(15, 1, C.gold);
    s.r(11, 5, 2, 1, C.gem, true);
  }
  if (rank >= 3) pauldrons(s, m);
  // lame : métal puis plasma néon
  const top = [10, 8, 4, 1][rank - 1];
  if (rank <= 2) {
    s.v(18, top, 17, METALS[rank].c);
    s.v(18, top + 1, top + 3, METALS[rank].hi, true);
  } else {
    s.v(18, top, 17, C.neon, true);
    s.v(19, top + 1, 16, '#2fb8c8', true);
    s.v(18, top + 1, top + 4, '#ffffff', true);
  }
  s.hl(17, 19, 18, m.c);
  s.v(18, 19, 20, V.hair);
  s.p(18, 21, V.main);
  return s;
}

const shade2 = (c) => ({ '#8a6a4a': '#6a5038', '#8e99a4': '#6a7480', '#b9c6d2': '#8e99a4', '#e0a93a': '#b07a20', '#f2ead6': '#d8c8a8' })[c] || c;

// Rang 5 « Céleste » : recolor du rang 4, grille 28×28, ailes, auréole, étincelles.
function celestial(base, cls) {
  const t = { ...CELESTE, [cls.main]: '#f2ead6', [cls.dark]: '#d8c49a', [cls.pants]: '#c8b48a', [cls.trim]: '#fbe08a', [C.gem]: cls.main };
  const s = base.recolor(t).grow(28, 28, 2, 4);
  const wing = [[9, 7, 9], [10, 5, 9], [11, 3, 9], [12, 2, 9], [13, 2, 9], [14, 3, 9], [15, 5, 9], [16, 7, 9]];
  for (const [y, x0, x1] of wing)
    for (let x = x0; x <= x1; x++) {
      const c = x === x0 ? '#e4dcc8' : (x + y) % 3 === 0 ? '#f2e8d4' : '#fff8ec';
      s.under(x, y, c);
      s.under(27 - x, y, c);
    }
  s.hl(11, 16, 1, C.goldHi, true);
  s.p(10, 2, C.gold, true);
  s.p(17, 2, C.gold, true);
  for (const [x, y] of [[1, 5], [26, 4], [0, 16], [27, 12], [2, 25], [25, 26]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}

const DRAW = { kael, lyra, elio, sera, volt };

export function heroSprite(id, rank) {
  if (rank >= 5) return celestial(DRAW[id](4), CLASS[id]);
  return DRAW[id](rank);
}

// ---------------------------------------------------------------- skins

// Tenues complètes : un skin remplace entièrement le dessin du héros, quel que soit son rang.
// Aucune limite de thème. rarity : C, R ou L (mêmes taux que les héros à l'invocation).
export const SKINS = [
  { id: 'kael-slip', hero: 'kael', name: 'En slip', rarity: 'C' },
  { id: 'kael-cube', hero: 'kael', name: 'Mineur cubique', rarity: 'R' },
  { id: 'kael-diamant', hero: 'kael', name: 'Armure de diamant', rarity: 'L' },
  { id: 'lyra-pirate', hero: 'lyra', name: 'Pirate', rarity: 'R' },
  { id: 'elio-pyjama', hero: 'elio', name: 'Pyjama', rarity: 'C' },
  { id: 'sera-sorciere', hero: 'sera', name: 'Sorcière', rarity: 'R' },
  { id: 'volt-pizza', hero: 'volt', name: 'Livreur de pizza', rarity: 'C' },
  { id: 'volt-samourai', hero: 'volt', name: 'Samouraï', rarity: 'L' },
];

const SKIN_DRAW = {
  // Kael en slip rouge, pieds nus, épée en bois.
  'kael-slip'() {
    const s = new Spr(24, 24), H = C.hair;
    body(s, { tunic: C.skin, dark: C.skinSh, trim: C.skin, pants: C.skin, boots: C.skin, bootsHi: '#f8d4b4', sole: C.skinSh, belt: '#c8323c', buckle: '#c8323c' });
    s.r(8, 18, 8, 2, '#c8323c');
    s.hl(9, 14, 18, '#e85a5a', true);
    s.p(11, 19, '#8c1f2e');
    s.p(11, 16, C.skinSh, true); // nombril
    s.r(8, 5, 8, 3, H);
    for (const [x, y] of [[8, 4], [10, 3], [11, 4], [13, 3], [15, 4], [16, 5]]) s.p(x, y, H);
    s.v(7, 6, 10, H); s.v(16, 6, 10, H);
    s.p(9, 8, H); s.p(12, 8, H); s.p(14, 8, H); s.p(15, 8, H);
    s.p(10, 5, '#8a5a34', true); s.p(13, 6, '#8a5a34', true);
    s.v(18, 10, 17, '#c8945a');
    s.p(18, 11, '#e0b07a', true);
    s.hl(17, 19, 18, '#8a5a32');
    s.v(18, 19, 20, C.grip);
    return s;
  },
  // Kael façon jeu de blocs : tête carrée, t-shirt turquoise, pioche.
  'kael-cube'() {
    const s = new Spr(24, 24), B = '#4a3020';
    body(s, { tunic: '#2fa8b0', dark: '#1e7a84', trim: '#2fa8b0', pants: '#3a48a8', boots: '#6a6a72', bootsHi: '#8a8a92', sole: '#3a3a42', belt: '#3a48a8', buckle: '#3a48a8', mouth: false });
    s.r(8, 18, 8, 2, '#3a48a8');
    s.r(8, 5, 8, 4, B);
    s.hl(8, 15, 8, B);
    s.p(8, 9, B); s.p(15, 9, B);
    s.r(8, 9, 8, 5, '#c8906a');
    s.p(9, 10, '#ffffff', true); s.p(10, 10, '#4a5ac8', true);
    s.p(13, 10, '#4a5ac8', true); s.p(14, 10, '#ffffff', true);
    s.hl(10, 13, 12, '#7a4a3a');
    s.hl(9, 14, 13, '#8a5a3a');
    s.p(11, 11, '#a86a4a'); s.p(12, 11, '#a86a4a');
    // pioche
    s.sline(19, 20, 19, 8, '#8a5a32');
    s.hl(16, 22, 7, '#9aa4ae');
    s.p(16, 8, '#9aa4ae'); s.p(22, 8, '#9aa4ae');
    s.hl(17, 21, 7, '#c8d2dc', true);
    return s;
  },
  // Armure intégrale de diamant, épée de diamant.
  'kael-diamant'() {
    const s = new Spr(24, 24), D = { c: '#4fd8e0', hi: '#c8f6ff', dk: '#2a9ab0' };
    body(s, { tunic: D.c, dark: D.dk, trim: D.hi, pants: D.dk, boots: D.c, bootsHi: D.hi, sole: '#1e6a80', belt: D.dk, buckle: D.hi, cape: '#2a6ab0' });
    pauldrons(s, { c: D.c, hi: D.hi });
    s.r(8, 3, 8, 5, D.c);
    s.hl(9, 14, 2, D.c);
    s.hl(7, 16, 8, D.c);
    s.r(9, 3, 2, 2, D.hi, true);
    s.v(12, 3, 7, D.dk);
    s.v(7, 9, 12, D.c); s.v(16, 9, 12, D.c);
    s.p(9, 13, D.c); s.p(14, 13, D.c);
    s.v(18, 1, 17, D.c); s.v(19, 2, 17, D.c);
    s.v(18, 3, 14, D.hi, true);
    s.hl(17, 20, 18, D.dk);
    s.v(18, 19, 20, C.grip);
    s.p(18, 21, D.hi);
    for (const [x, y] of [[21, 3], [4, 9], [20, 13]]) s.spark(x, y, '#ffffff');
    return s;
  },
  // Lyra en pirate : bandana, cache-œil, marinière, sabre.
  'lyra-pirate'() {
    const s = new Spr(24, 24), R = '#c8323c';
    body(s, { tunic: '#f2eef4', dark: '#c8c0d0', trim: R, pants: '#4a3a52', boots: '#2a2228', bootsHi: '#4a4048', sole: '#140d11', belt: '#5a3f2e' });
    for (const y of [15, 17]) s.hl(8, 15, y, R);
    s.hl(6, 7, 15, R); s.hl(16, 17, 15, R);
    s.r(8, 5, 8, 3, R);
    s.hl(9, 14, 4, R);
    s.p(7, 7, R); s.p(6, 8, R); s.p(5, 9, '#8c1f2e'); s.p(6, 9, R);
    s.p(10, 5, '#ffffff', true); s.p(13, 6, '#ffffff', true);
    s.hl(8, 15, 8, C.hair);
    s.v(7, 8, 11, C.hair); s.v(16, 8, 11, C.hair);
    s.r(12, 10, 3, 2, '#1a1320', true);
    s.sline(9, 9, 16, 9, '#1a1320');
    s.p(13, 12, BLUSH, true);
    // sabre courbe à gauche
    s.v(4, 10, 17, '#b9c6d2');
    s.p(5, 9, '#b9c6d2'); s.p(5, 10, '#e4ecf3', true);
    s.hl(3, 6, 18, C.gold);
    s.v(4, 19, 20, C.grip);
    return s;
  },
  // Elio en pyjama étoilé, bonnet de nuit, pantoufles, bougie.
  'elio-pyjama'() {
    const s = new Spr(24, 24), P = '#8ab4f0', PD = '#5a84c8', B = CLASS.elio.beard;
    body(s, { tunic: P, dark: PD, trim: '#ffffff', pants: P, boots: '#f08ab8', bootsHi: '#ffc0d8', sole: '#c85a8a', belt: PD, buckle: '#fbe08a', mouth: false });
    for (const [x, y] of [[9, 15], [13, 17], [10, 19], [14, 15], [7, 16], [17, 15]]) s.p(x, y, '#fbe08a', true);
    s.r(9, 13, 6, 3, B); s.hl(10, 13, 12, B); s.hl(10, 13, 16, B);
    s.p(10, 14, '#b0aaa0'); s.p(12, 15, '#b0aaa0');
    s.p(10, 9, B); s.p(13, 9, B);
    // bonnet de nuit qui retombe, pompon
    s.r(8, 5, 8, 3, P); s.hl(7, 16, 7, '#ffffff');
    s.hl(10, 15, 4, P); s.hl(13, 17, 3, P); s.hl(16, 18, 4, P); s.p(18, 5, P);
    s.r(18, 6, 2, 2, '#ffffff');
    s.p(11, 5, '#b8d4ff', true);
    // bougie dans son bougeoir
    s.hl(17, 20, 18, '#e0a93a');
    s.v(18, 14, 17, '#f2ead6');
    s.p(18, 13, '#ffb030', true); s.p(18, 12, '#fbe08a', true);
    return s;
  },
  // Séra en sorcière : grand chapeau noir, robe violette, balai.
  'sera-sorciere'() {
    const s = new Spr(24, 24), K = '#2a2234', V = '#6a3aa8';
    body(s, { tunic: K, dark: '#160f1c', trim: V, pants: K, boots: K, bootsHi: '#4a3e5a', sole: '#0e0a12', robe: true, belt: V, buckle: '#9af098' });
    s.hl(8, 15, 8, '#e8c070');
    s.v(7, 8, 13, '#e8c070'); s.v(16, 8, 13, '#e8c070');
    s.p(10, 8, '#fff0b0', true);
    // chapeau pointu à large bord, ruban violet, boucle
    s.hl(5, 18, 7, K);
    s.hl(8, 15, 6, V);
    s.p(11, 6, '#9af098', true);
    s.hl(9, 14, 5, K); s.hl(9, 13, 4, K); s.hl(10, 13, 3, K); s.hl(10, 12, 2, K); s.hl(9, 11, 1, K); s.p(8, 0, K);
    s.p(10, 3, '#4a3e5a', true);
    // balai à gauche
    s.v(4, 6, 19, '#8a5a32');
    s.p(4, 8, '#a8703a', true);
    s.r(3, 20, 3, 3, '#d8b060'); s.p(2, 22, '#d8b060'); s.p(6, 22, '#d8b060');
    s.hl(3, 5, 20, '#8a6a3a');
    return s;
  },
  // Volt livreur de pizza : casquette, polo rouge, boîte à pizza.
  'volt-pizza'() {
    const s = new Spr(24, 24), R = '#d83a3a';
    body(s, { tunic: R, dark: '#a02a2a', trim: '#ffffff', pants: '#3a48a8', boots: '#f2eef4', bootsHi: '#ffffff', sole: '#8a8a92', belt: '#2a2234' });
    s.r(8, 4, 8, 3, R); s.hl(9, 14, 3, R);
    s.hl(14, 18, 7, '#a02a2a');
    s.r(10, 4, 3, 2, '#ffffff', true); s.p(11, 5, R, true);
    s.v(7, 7, 10, V_HAIR); s.v(16, 7, 9, V_HAIR); s.hl(8, 15, 7, V_HAIR);
    s.p(12, 12, C.mouth, true);
    // pile de boîtes à pizza
    s.r(16, 15, 7, 2, '#c8945a'); s.r(16, 17, 7, 2, '#b07a42');
    s.hl(16, 22, 15, '#e0b07a', true);
    s.p(19, 16, '#d83a3a', true); s.p(18, 18, '#fbe08a', true);
    return s;
  },
  // Volt en samouraï : armure rouge et or, casque à croissant d'or, katana.
  'volt-samourai'() {
    const s = new Spr(24, 24), R = '#b8283a', RD = '#7a1828', G = C.gold;
    body(s, { tunic: R, dark: RD, trim: G, pants: '#2a2234', boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#0e0a12', belt: '#2a2234', buckle: G, mouth: false, cape: '#2a2234' });
    for (const y of [15, 17]) s.hl(9, 14, y, RD);
    pauldrons(s, { c: R, hi: G });
    // kabuto et croissant
    s.r(8, 4, 8, 4, '#2a2234'); s.hl(7, 16, 8, R); s.hl(6, 7, 9, R); s.hl(16, 17, 9, R);
    s.p(8, 2, G); s.p(9, 3, G); s.p(14, 3, G); s.p(15, 2, G); s.p(7, 1, G); s.p(16, 1, G);
    s.r(11, 5, 2, 2, G, true);
    s.r(8, 12, 8, 2, '#3a2a4a');
    s.p(13, 13, '#e2334a', true);
    // katana
    s.v(19, 1, 17, '#d8e0e8'); s.v(19, 2, 10, '#ffffff', true);
    s.hl(18, 20, 18, G);
    s.v(19, 19, 21, '#2a2234'); s.p(19, 20, R, true);
    for (const [x, y] of [[21, 4], [3, 6]]) s.spark(x, y, C.goldHi);
    return s;
  },
};
const V_HAIR = '#2a2234';

export function skinSprite(id) {
  return SKIN_DRAW[id]();
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
  s.v(4, 1, 2, C.gold);
  s.hl(1, 7, 3, C.gold);
  s.hl(2, 6, 4, C.gold);
  s.hl(3, 5, 5, C.gold);
  s.hl(2, 3, 6, C.gold); s.hl(5, 6, 6, C.gold);
  s.p(2, 7, C.gold); s.p(6, 7, C.gold);
  s.p(4, 2, C.goldHi, true); s.p(3, 3, C.goldHi, true); s.p(4, 3, C.goldHi, true);
  return s;
}

// Gemme de rang en losange (7×7) : dorée si le rang est atteint, sombre sinon.
export function rankGemSprite(on) {
  const s = new Spr(7, 7), a = on ? C.gold : '#4a3a3a', hi = on ? C.goldHi : '#6a5a5a';
  s.p(3, 1, a); s.hl(2, 4, 2, a); s.hl(1, 5, 3, a); s.hl(2, 4, 4, a); s.p(3, 5, a);
  s.p(3, 2, hi, true); s.p(2, 3, hi, true);
  return s;
}
