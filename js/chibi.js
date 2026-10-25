// Gabarit commun des héros chibi (24×24) : couleurs de base, métaux des rangs, corps, épaulières,
// diadème. Partagé par js/sprites.js (premiers héros, tenues) et js/heroes.js (nouveaux héros).
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

// Héros 24×24 : grosse tête (8×7), yeux de 2 px, joues roses, pas de nez ; corps de 8×6 avec col,
// plis, ceinture et ourlet brodé ; jambes de 2 px, bottes de 3 px à semelle sombre.
// Les pieds touchent le bas de la grille (y = 23) ; tout ce qui dépasse en haut (casque, chapeau,
// arme) a les rangées 0 à 4.
export const BLUSH = '#f0907a';

export function body(s, o) {
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
export function pauldrons(s, m) {
  for (const x of [5, 16]) {
    s.r(x, 13, 3, 2, m.c);
    s.p(x + 1, 13, m.hi, true);
  }
}

// Diadème d'or avec une gemme, à la hauteur y.
export function tiara(s, y, x0 = 8, x1 = 15) {
  s.hl(x0, x1, y, C.gold);
  s.p(x0, y - 1, C.gold); s.p(x1, y - 1, C.gold);
  s.r(11, y - 2, 2, 2, C.gold);
  s.p(x0 + 1, y, C.goldHi, true);
  s.r(11, y - 1, 2, 1, C.gem, true);
  s.p(11, y - 2, C.goldHi, true);
}

// Rang 5 : la grille passe à 28×28 (le héros est décalé de 2 à droite et 4 vers le bas) ; back
// dessine derrière lui (s.under) et autour de lui son grand décor personnel, en coordonnées 28×28.
export function grand(s, back) {
  const b = s.grow(28, 28, 2, 4);
  back(b);
  return b;
}

// Bottes selon le rang : cuir puis métal.
export const boots = (m) => ({ boots: m.c, bootsHi: m.hi, sole: '#3a2a22' });


// Ombre d'un métal (gouttière d'une lame).
export const shade2 = (c) => ({ '#8a6a4a': '#6a5038', '#8e99a4': '#6a7480', '#b9c6d2': '#8e99a4', '#e0a93a': '#b07a20', '#f2ead6': '#d8c8a8' })[c] || c;
