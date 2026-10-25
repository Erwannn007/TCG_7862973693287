// Tous les dessins du jeu. Règles : docs/DIRECTION_ARTISTIQUE.md
import { Spr } from './spr.js';
import { C, METALS, BLUSH, body, pauldrons, grand, capeBack } from './chibi.js';
import { NEW_CLASS, NEW_DRAW } from './heroes.js';

export { C, METALS };

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

// ---------------------------------------------------------------- héros

// Chaque héros a ses 5 rangs à lui : une histoire en 5 étapes (tenue, coiffe, arme qui évoluent
// à sa façon), et un rang 5 en 28×28 avec un grand décor personnel (voir grand() dans chibi.js).

// Kael, épéiste : recrue à l'épée courte, écuyer au bandeau, chevalier au plastron et au plumet,
// champion au heaume ailé et à la lame runique ; rang 5, la lame de feu : armure de plates rouge,
// épaulières de flammes, l'épée s'embrase et s'allonge, cape de flammes qui tombe de ses épaules.
function kael(rank) {
  const s = new Spr(24, 24), K = CLASS.kael, H = C.hair, HH = '#8a5a34', ST = '#b9c6d2', SH = '#e4ecf3', SD = '#8e99a4', WG = '#f2eef4';
  body(s, {
    tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, cape: rank >= 4 && (rank >= 5 ? '#e2552a' : K.dark),
    boots: rank >= 3 ? SD : '#8a6a4a', bootsHi: rank >= 3 ? SH : '#a8865f', sole: '#3a2a22', bracers: rank >= 2 && (rank >= 3 ? ST : '#8a6a4a'),
  });
  // cheveux en pointes, mèches claires
  s.r(8, 5, 8, 3, H);
  for (const [x, y] of [[8, 4], [10, 3], [11, 4], [13, 3], [15, 4], [16, 5]]) s.p(x, y, H);
  s.v(7, 6, 10, H); s.v(16, 6, 10, H);
  s.p(9, 8, H); s.p(12, 8, H); s.p(14, 8, H); s.p(15, 8, H);
  s.p(10, 5, HH, true); s.p(13, 6, HH, true); s.p(11, 4, HH, true);
  if (rank === 2) {
    // bandeau rouge noué, les pans flottent derrière
    s.hl(8, 15, 6, K.main); s.p(9, 6, K.trim, true);
    s.p(7, 7, K.main); s.p(6, 8, K.main); s.p(5, 8, K.dark); s.p(6, 9, K.dark);
  }
  if (rank >= 3) {
    // plastron d'acier sur la tunique
    s.r(9, 14, 6, 3, ST); s.hl(9, 14, 14, SH); s.v(12, 15, 16, SD); s.p(10, 15, SH, true);
    // casque ouvert, couvre-joues
    s.r(8, 3, 8, 4, ST); s.hl(9, 14, 2, ST); s.hl(7, 16, 7, ST); s.v(7, 8, 10, ST); s.v(16, 8, 10, ST);
    s.p(9, 3, SH, true); s.p(10, 2, SH, true); s.v(12, 3, 6, SD);
  }
  if (rank === 3) { s.v(12, 0, 1, K.main); s.p(13, 0, K.main); s.p(11, 1, K.main); s.p(13, 1, K.dark); } // plumet
  if (rank >= 4) {
    // heaume ailé : une aile blanche de chaque côté
    for (const [x, d] of [[6, -1], [17, 1]]) { s.v(x, 2, 6, WG); s.v(x + d, 1, 4, WG); s.p(x + 2 * d, 1, WG); s.p(x, 6, '#c8c0d0'); }
    s.r(11, 4, 2, 2, K.main, true); s.p(11, 4, K.trim, true);
  }
  if (rank >= 5) { s.p(11, 1, '#ff8a2a'); s.v(12, 0, 1, '#ffd84a'); s.p(13, 1, '#e2552a'); } // crête de flamme
  // épée : courte en fer, longue, large en acier, runique, puis enflammée
  const top = [11, 8, 5, 2, 0][rank - 1], wide = rank >= 3, B = rank === 1 ? SD : ST;
  s.v(18, top, 17, B); if (wide) s.v(19, top + 1, 17, B);
  s.v(18, top + 1, 15, rank === 1 ? ST : SH, true);
  if (wide) s.v(19, top + 3, 15, SD, true);
  if (rank >= 4) for (let y = top + 3; y <= 15; y += 2) s.p(19, y, '#ff5a6a', true); // runes
  if (rank >= 5) for (let y = 1; y <= 14; y += 2) { s.p(17, y + 1, '#ff8a2a'); s.p(20, y, y % 4 === 1 ? '#ffd84a' : '#ff8a2a'); }
  s.hl(17, wide ? 20 : 19, 18, rank === 1 ? C.grip : rank >= 4 ? K.main : SD);
  s.v(18, 19, 20, C.grip); s.p(18, 20, '#7a5a3a', true);
  s.p(18, 21, rank >= 4 ? K.trim : SD);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(9, 14, 6, 3, '#c83a3a'); s.hl(9, 14, 14, '#ff8a5a'); s.p(11, 15, '#fbe08a', true); s.p(12, 15, '#ff8a2a', true);
  for (const x of [5, 17]) { s.r(x, 12, 2, 2, '#c83a3a'); s.p(x, 11, '#ff8a2a'); s.p(x + 1, 11, '#fbe08a', true); }
  return grand(s, (b) => {
    for (let x = 6; x <= 21; x++) { const h = 25 + (x * 7) % 3; for (let y = 18; y <= h; y++) b.under(x, y, y > h - 2 ? '#fbe08a' : y > h - 5 ? '#ff8a2a' : '#c83a2a'); }
    b.v(20, 0, 4, '#e4ecf3'); b.v(21, 1, 4, '#b9c6d2'); b.p(19, 1, '#ff8a2a', true); b.p(22, 0, '#fbe08a', true); b.p(22, 2, '#ff8a2a', true);
  });
}

// Lyra, archère : chasseuse à l'arc de bois, éclaireuse à l'arc gainé, rôdeuse à la cape et à la
// plume rouge, gardienne des bois au diadème de feuilles et à l'arc vivant ; rang 5, l'esprit de la
// forêt : capuche de feuilles d'où poussent de petits bois de cerf, cape de feuilles, arc de
// lumière à flèche encochée.
function lyra(rank) {
  const s = new Spr(24, 24), L = CLASS.lyra, LF = '#7ac85a', LD = '#2f6a2a', WD = '#8a5a32', SP = '#c8ffb0';
  // carquois dans le dos, empennages (plus nombreux avec le rang)
  s.r(16, 10, 2, 6, rank >= 3 ? '#4a3a2a' : C.grip);
  s.p(16, 9, C.white); s.p(17, 8, C.white); s.p(17, 9, C.gem); s.p(16, 8, C.gem);
  if (rank >= 2) { s.p(18, 8, C.white); s.p(18, 7, LF); }
  body(s, {
    tunic: L.main, dark: L.dark, trim: L.trim, pants: L.pants, cape: rank >= 3 && LD,
    boots: rank >= 4 ? '#4a3a2a' : '#6a4a32', bootsHi: '#8a6a4a', sole: '#2a1e16', bracers: rank >= 2 && '#6a4a32', belt: rank >= 3 ? '#4a3a2a' : C.grip,
  });
  // capuche
  s.hl(9, 14, 4, L.main); s.r(8, 5, 8, 3, L.main); s.v(7, 6, 13, L.main); s.v(16, 6, 13, L.main);
  s.p(15, 3, L.main); s.p(16, 4, L.main);
  s.p(9, 5, LF, true); s.p(10, 4, LF, true);
  // frange sous la capuche
  s.hl(8, 15, 8, C.hair); s.p(9, 9, C.hair); s.p(14, 9, C.hair); s.p(11, 8, '#8a5a34', true);
  if (rank >= 2) { s.r(8, 13, 2, 1, LF); s.p(8, 13, SP, true); } // fermoir en feuille
  if (rank === 3) { s.p(17, 3, C.gem); s.p(18, 2, C.gem); s.p(18, 3, '#ff8a9a', true); } // plume rouge
  if (rank >= 4) {
    // diadème de feuilles sur la capuche
    for (const [x, y] of [[8, 4], [9, 3], [11, 2], [12, 2], [14, 3], [15, 4]]) s.p(x, y, LF);
    s.p(11, 1, SP, true); s.p(9, 2, LF); s.p(14, 2, LF);
  }
  // arc : bois simple, gainé, long, vivant à feuilles, puis de lumière
  const y0 = [10, 9, 7, 5, 3][rank - 1], y1 = 23, mid = (y0 + y1) >> 1;
  const BW = rank >= 5 ? '#c8ffb0' : rank >= 4 ? '#5a8a3a' : WD;
  s.p(5, y0, BW); s.p(4, y0 + 1, BW); s.v(3, y0 + 2, y1 - 2, BW); s.p(4, y1 - 1, BW); s.p(5, y1, BW);
  s.v(5, y0 + 1, y1 - 1, rank >= 5 ? '#ffffff' : C.string, true);
  s.v(3, mid - 1, mid + 1, rank >= 2 ? '#c8a870' : C.grip);
  if (rank >= 3) { s.p(2, y0 + 2, BW); s.p(2, y1 - 2, BW); }
  if (rank >= 4) for (const [x, y] of [[2, y0 + 4], [4, y0 + 3], [2, y1 - 4], [1, y0 + 3]]) s.p(x, y, LF, true);
  if (rank >= 4) { s.hl(6, 9, mid, rank >= 5 ? '#ffffff' : '#c8a870'); s.p(10, mid, rank >= 5 ? SP : '#b9c6d2', true); } // flèche encochée
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.hl(8, 15, 5, '#5a8a3a'); for (const [x, y] of [[9, 4], [12, 3], [14, 4]]) s.p(x, y, '#c8ffb0', true);
  s.r(9, 16, 6, 1, '#5a8a3a'); s.p(10, 16, LF, true); s.p(13, 16, LF, true);
  return grand(s, (b) => {
    for (const d of [-1, 1]) { const x = d < 0 ? 9 : 18; b.sline(x, 6, x + 2 * d, 2, '#c8ffb0'); b.p(x + d, 3, '#c8ffb0'); b.p(x + 3 * d, 2, '#ffffff', true); }
    capeBack(b, LD, LF, '#c8ffb0');
  });
}

// Elio, mage : la barbe pousse avec le rang. Apprenti au bâton court, mage au chapeau étoilé,
// sorcier à la lune, archimage à la robe d'étoiles ; rang 5, le maître des astres : robe de nuit
// étoilée, barbe jusqu'au sol, chapeau à croissant de lune, bâton coiffé d'une petite galaxie.
function elio(rank) {
  const s = new Spr(24, 24), E = CLASS.elio, B = E.beard, BS = '#b0aaa0', ORB = ['#5ab4ff', '#d8f4ff', '#2f78d0'], MOON = '#fbe08a';
  body(s, { tunic: E.main, dark: E.dark, trim: E.trim, pants: E.pants, boots: '#3a3a6a', bootsHi: '#5a5a8a', sole: '#1e1e3a', robe: true, mouth: false, cape: rank >= 4 && E.dark });
  // étoiles brodées sur la robe (archimage)
  if (rank >= 4) for (const [x, y] of [[9, 15], [14, 16], [10, 20], [14, 20]]) s.p(x, y, MOON, true);
  // barbe : courte, puis jusqu'au ventre, puis jusqu'à la ceinture
  s.hl(10, 13, 12, B);
  const len = [13, 14, 16, 17, 18][rank - 1];
  for (let y = 13; y <= len; y++) { const w = y > len - 1 ? 1 : y > len - 3 ? 2 : 3; s.hl(12 - w, 11 + w, y, B); }
  s.p(10, 14, BS); s.p(13, 13, BS); if (len >= 16) s.p(12, 15, BS);
  s.p(10, 9, B); s.p(13, 9, B);
  s.v(7, 8, 11, B); s.v(16, 8, 11, B);
  // chapeau pointu à bord large, pointe qui retombe
  s.hl(6, 17, 7, E.dark); if (rank >= 3) { s.p(5, 7, E.dark); s.p(18, 7, E.dark); }
  s.hl(8, 15, 6, E.trim);
  s.hl(9, 14, 5, E.main); s.hl(9, 13, 4, E.main); s.hl(10, 13, 3, E.main); s.hl(11, 13, 2, E.main); s.hl(12, 14, 1, E.main); s.hl(14, 15, 0, E.main);
  if (rank >= 4) { s.p(16, 0, E.main); s.p(16, 1, MOON, true); } // pointe à grelot
  s.p(10, 4, '#5a84e0', true); s.p(11, 3, '#5a84e0', true);
  if (rank >= 2) s.p(12, 4, MOON, true); // étoile
  if (rank >= 3) { s.p(10, 5, MOON, true); s.p(11, 5, MOON, true); s.p(11, 6, E.trim); } // lune
  // bâton : orbe qui grossit, puis tête en croissant de lune, puis anneau d'étoiles
  s.v(19, 5, 23, C.wood);
  for (let y = 7; y < 23; y += 3) s.p(19, y, '#5a3f2e', true);
  if (rank <= 2) {
    const o = rank === 1 ? 2 : 3, top = 5 - o;
    s.r(19 - (o - 2), top, o, o, ORB[0], true); s.p(19 - (o - 2), top, ORB[1], true); s.p(20, top + o - 1, ORB[2], true);
  } else {
    // croissant de lune autour de l'orbe
    s.v(17, 1, 4, MOON); s.p(18, 0, MOON); s.p(18, 5, MOON); s.p(17, 1, '#fff8c0', true);
    s.r(19, 2, 2, 2, ORB[0], true); s.p(19, 2, ORB[1], true);
    if (rank >= 4) { s.p(21, 0, MOON, true); s.p(22, 3, MOON, true); s.p(21, 5, MOON, true); }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 19, 8, 3, '#1a2648'); for (const [x, y] of [[9, 20], [13, 21], [11, 19]]) s.p(x, y, MOON, true);
  s.v(11, 18, 21, B); s.v(12, 18, 21, B); s.p(11, 21, BS);
  s.p(13, 3, MOON, true); s.p(14, 2, MOON, true); s.p(13, 1, '#fff8c0', true);
  return grand(s, (b) => {
    for (const [x, y, c] of [[19, 2, '#c8a8ff'], [21, 1, '#ffffff'], [23, 3, '#5ab4ff'], [22, 5, '#c8a8ff'], [20, 6, '#ffffff']]) b.p(x, y, c, true);
    b.r(20, 3, 3, 3, '#3a2a7a', true); b.p(21, 4, '#ffffff', true);
  });
}

// Séra, prêtresse : novice au voile blanc, prêtresse au bâton à gemme, sainte à la couronne de
// fleurs, grande prêtresse à la mitre et au cristal de rose ; rang 5, l'ange gardien : ses propres
// ailes roses lui poussent dans le dos, robe blanche et or, bâton au grand cristal en cœur.
function sera(rank) {
  const s = new Spr(24, 24), S = CLASS.sera, W = C.white, HR = '#e8c070', PK = '#ff9ac8', PL = '#ffd0e0';
  body(s, { tunic: S.main, dark: S.dark, trim: S.trim, pants: S.pants, boots: '#f2eef4', bootsHi: '#ffffff', sole: '#c8b0c0', robe: true, cape: rank >= 4 && W });
  // étole blanche et petite croix
  s.v(11, 14, 21, W); s.v(12, 14, 21, W);
  s.p(11, 16, C.gold, true); s.p(12, 16, C.gold, true); s.p(11, 15, C.gold, true);
  if (rank >= 3) { s.p(11, 20, PK, true); s.p(12, 20, PK, true); }
  // voile blanc, mèches dorées
  s.hl(9, 14, 4, W); s.r(8, 5, 8, 3, W);
  s.v(7, 6, 15, W); s.v(16, 6, 15, W);
  s.v(7, 13, 15, S.main); s.v(16, 13, 15, S.main);
  s.hl(8, 15, 8, HR); s.p(9, 9, HR); s.p(14, 9, HR); s.p(8, 9, HR); s.p(15, 9, HR);
  s.p(10, 8, '#fff0b0', true); s.p(13, 8, '#fff0b0', true); s.p(9, 5, '#ffffff', true);
  if (rank === 3) for (const [x, c] of [[8, PK], [10, '#f2eef4'], [12, PK], [14, '#f2eef4'], [15, PK]]) s.p(x, 4, c, true); // couronne de fleurs
  if (rank >= 4) {
    // mitre haute, blanche et rose
    s.r(9, 1, 6, 4, W); s.hl(10, 13, 0, W); s.v(11, 1, 4, S.main); s.v(12, 1, 4, S.main); s.hl(9, 14, 4, S.trim);
    s.p(11, 2, PL, true);
  }
  // bâton à anneau : bois, puis gemme rose, anneau en cœur, cristal de rose
  const top = rank >= 3 ? 3 : 6, R = rank >= 4 ? PK : C.gold;
  if (rank >= 3) {
    s.p(3, top, R); s.p(5, top, R); s.v(2, top + 1, top + 2, R); s.v(6, top + 1, top + 2, R); s.p(3, top + 3, R); s.p(5, top + 3, R); s.p(4, top + 4, R);
    s.p(4, top + 1, R); s.r(3, top + 1, 3, 2, rank >= 4 ? '#ff6aa8' : PL, true); s.p(3, top + 1, '#ffffff', true);
  } else {
    s.p(4, top, R); s.v(3, top + 1, top + 3, R); s.v(5, top + 1, top + 3, R); s.p(4, top + 4, R);
    if (rank === 2) s.p(4, top + 2, PK, true);
  }
  s.v(4, top + 5, 23, rank >= 4 ? '#f2eef4' : C.wood);
  for (let y = top + 7; y < 23; y += 3) s.p(4, y, rank >= 4 ? PL : '#5a3f2e', true);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 18, 8, 4, '#f2eef4'); s.hl(8, 15, 21, '#e8b84a'); s.p(9, 19, PK, true); s.p(14, 20, PK, true);
  s.r(2, 2, 5, 4, '#ff6aa8', true); s.p(4, 6, '#ff6aa8', true); s.hl(3, 5, 5, '#ff6aa8', true); s.p(2, 2, '#ffffff', true);
  return grand(s, (b) => {
    const wing = [[12, 5, 9], [13, 3, 9], [14, 2, 9], [15, 2, 9], [16, 3, 9], [17, 4, 9], [18, 5, 9], [19, 7, 9]];
    for (const [y, x0, x1] of wing) for (let x = x0; x <= x1; x++) { const c = x === x0 ? '#e88ab8' : (x + y) % 3 ? '#ffe0ee' : PL; b.under(x, y, c); b.under(27 - x, y, c); }
  });
}

// Volt, cyber-ninja : initié à la lame de métal, ninja masqué aux kunaïs, ombre néon aux lunettes
// et à la lame plasma, maître cyber au bras mécanique ; rang 5, le fantôme de données : armure
// cyber intégrale à lignes néon, visière pleine, deux lames plasma, pans du bandeau en néon.
function volt(rank) {
  const s = new Spr(24, 24), V = CLASS.volt, N = C.neon, ND = '#2fb8c8', MT = '#8e99a4', MH = '#b9c6d2';
  body(s, { tunic: V.main, dark: V.dark, trim: V.trim, pants: V.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', mouth: false, buckle: rank >= 3 ? N : MT, cape: false, belt: V.mask });
  s.p(10, 16, rank >= 3 ? N : V.trim, true);
  if (rank >= 2) { s.p(8, 18, MT); s.p(9, 18, MH, true); } // kunaï à la ceinture
  // cheveux noirs en pointes
  s.r(8, 4, 8, 3, V.hair);
  for (const [x, y] of [[8, 3], [10, 2], [12, 3], [14, 2], [16, 4]]) s.p(x, y, V.hair);
  s.v(7, 6, 10, V.hair); s.v(16, 6, 10, V.hair);
  s.p(10, 4, '#4a3e5a', true); s.p(13, 5, '#4a3e5a', true);
  // bandeau, pans qui flottent (plus longs avec le rang)
  s.hl(7, 16, 7, V.main);
  s.p(6, 7, V.main); s.p(5, 8, V.main); s.p(4, 8, V.main); s.p(5, 9, V.dark); s.p(3, 9, V.dark);
  if (rank >= 4) { s.p(2, 10, V.main); s.p(1, 10, V.trim); s.p(2, 9, V.main); }
  s.p(12, 7, rank >= 3 ? N : V.trim, true);
  // masque (dès le rang 2), lunettes néon (rang 3)
  if (rank >= 2) { s.r(8, 12, 8, 2, V.mask); s.hl(9, 14, 12, V.mask); s.p(13, 13, rank >= 3 ? N : V.trim, true); }
  if (rank >= 3) { s.hl(8, 15, 10, '#2a2234'); s.p(10, 10, N, true); s.p(13, 10, N, true); s.p(11, 10, '#4a3e5a'); }
  if (rank >= 4) {
    // bras droit mécanique, lignes néon
    s.r(16, 14, 2, 4, MT); s.p(16, 14, MH, true); s.p(17, 16, ND, true); s.r(16, 18, 2, 1, MH); s.p(16, 19, MT);
  }
  // lame : métal, plus longue, plasma, plasma double
  const top = [11, 8, 4, 1, 0][rank - 1];
  if (rank <= 2) { s.v(18, top, 17, MT); s.v(18, top + 1, top + 3, MH, true); }
  else {
    s.v(18, top, 17, N, true); s.v(19, top + 1, 16, ND, true); s.v(18, top + 1, top + 4, '#ffffff', true);
    if (rank >= 4) { s.v(20, top + 3, 15, ND, true); s.p(20, top + 3, '#ffffff', true); }
  }
  s.hl(17, rank >= 4 ? 20 : 19, 18, rank >= 3 ? '#4a3e5a' : MT);
  s.v(18, 19, 20, V.hair); s.p(18, 21, V.main);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 4, '#3a2a5a'); s.v(9, 14, 17, N, true); s.v(14, 14, 17, N, true); s.r(11, 15, 2, 2, '#ffffff', true);
  s.hl(8, 15, 10, '#1a1320'); s.hl(9, 14, 10, N, true); s.p(1, 10, N, true); s.p(2, 9, N, true);
  s.v(4, 8, 17, N, true); s.v(5, 9, 16, ND, true); s.p(4, 8, '#ffffff', true); s.hl(3, 5, 18, '#4a3e5a');
  return grand(s);
}

const DRAW = { kael, lyra, elio, sera, volt, ...NEW_DRAW };

export function heroSprite(id, rank) {
  return DRAW[id](Math.min(5, rank));
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
