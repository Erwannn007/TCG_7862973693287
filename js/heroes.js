// Les nouveaux héros (après les cinq premiers de js/sprites.js). Même gabarit chibi 24×24 (`body`),
// mêmes règles : docs/DIRECTION_ARTISTIQUE.md. Chaque héros a ses couleurs (NEW_CLASS) et ses
// 5 rangs à lui : à chaque rang sa tenue, sa coiffe et son arme évoluent à sa façon ; le rang 5
// (28×28, voir grand() dans js/chibi.js) est sa forme ultime, sans aucun décor.
import { Spr } from './spr.js';
import { C, BLUSH, body, grand, capeBack } from './chibi.js';

// main : couleur signature ; dark : ombre et ourlet ; trim : col, broderies ; pants : jambes.
export const NEW_CLASS = {
  brann: { main: '#2f7a8a', dark: '#1e5462', trim: '#9ad8d0', pants: '#3a3a4a' },
  mira: { main: '#d8782a', dark: '#9a4a1a', trim: '#ffd890', pants: '#5a3a52' },
  nina: { main: '#f2eef4', dark: '#c8c0d0', trim: '#e2334a', pants: '#f2eef4' },
  pip: { main: '#6a5a48', dark: '#4a3e30', trim: '#c8a870', pants: '#3a3040' },
  gus: { main: '#3a5a9a', dark: '#26407a', trim: '#8ab0e0', pants: '#3a5a9a' },
  lenny: { main: '#3a3a5a', dark: '#26263e', trim: '#f0d040', pants: '#3a3a5a' },
  vex: { main: '#2e2638', dark: '#1a1422', trim: '#c8323c', pants: '#2e2638' },
  gideon: { main: '#e0d8c0', dark: '#a89c80', trim: '#e0a93a', pants: '#5a5a6a' },
  aurelia: { main: '#c8cede', dark: '#8a92aa', trim: '#e0a93a', pants: '#4a5a8a' },
  nova: { main: '#3a4ad0', dark: '#26308a', trim: '#fbe08a', pants: '#3a4ad0' },
  rok: { main: '#b84a2a', dark: '#7a2a18', trim: '#e8d8b0', pants: '#4a5a7a' },
  tobo: { main: '#f2eef4', dark: '#c8c0d0', trim: '#e2334a', pants: '#4a4a5a' },
  hugo: { main: '#2a64c8', dark: '#1a408a', trim: '#f2eef4', pants: '#c8323c' },
  kiki: { main: '#c8603a', dark: '#8a3a22', trim: '#f0d8a8', pants: '#3a4a7a' },
  bjorn: { main: '#4a6a8a', dark: '#2e4a62', trim: '#c8d8e8', pants: '#5a4a3a' },
  sven: { main: '#f0c030', dark: '#c08a18', trim: '#fff0a0', pants: '#3a4a6a' },
  astra: { main: '#e4e4ee', dark: '#a8a8c0', trim: '#e2552a', pants: '#e4e4ee' },
  nyx: { main: '#4a2a6a', dark: '#2a163e', trim: '#7af06a', pants: '#4a2a6a' },
  ignis: { main: '#e0602a', dark: '#a83a1a', trim: '#fbe08a', pants: '#3a2a2a' },
  drakon: { main: '#2f7a4a', dark: '#1e4e30', trim: '#e0a93a', pants: '#2a2a3a' },
  tess: { main: '#7ab84a', dark: '#4e8a34', trim: '#f0e0a0', pants: '#7ab84a' },
  doc: { main: '#2e2a34', dark: '#1a161e', trim: '#8a6a4a', pants: '#2e2a34' },
  ozzy: { main: '#2a2234', dark: '#160f1c', trim: '#b9c6d2', pants: '#3a3a6a' },
  yuki: { main: '#7ac8e8', dark: '#3a8ab0', trim: '#e8f8ff', pants: '#7ac8e8' },
  sylva: { main: '#3aa89a', dark: '#26786e', trim: '#e8f0d0', pants: '#3a4a4a' },
  thorn: { main: '#5a7a3a', dark: '#3a5228', trim: '#c8e08a', pants: '#5a7a3a' },
  gorm: { main: '#8a6a4a', dark: '#6a5038', trim: '#c8a870', pants: '#5a4a3a' },
  zara: { main: '#c83a8a', dark: '#8a2060', trim: '#fbe08a', pants: '#e8a0c8' },
  kitsune: { main: '#f2eef4', dark: '#c8c0d0', trim: '#d8323c', pants: '#d8323c' },
  sybil: { main: '#5a3aa8', dark: '#3a2470', trim: '#fbe08a', pants: '#5a3aa8' },
  grumli: { main: '#8a3a2a', dark: '#5e2418', trim: '#e0a93a', pants: '#4a3a32' },
  spike: { main: '#d8503a', dark: '#9a3020', trim: '#f0c040', pants: '#5a3a2a' },
  bip: { main: '#e8a030', dark: '#b07018', trim: '#f2eef4', pants: '#6a7480' },
  lulu: { main: '#e8a0b0', dark: '#b86a80', trim: '#f2eef4', pants: '#e8a0b0' },
  djmax: { main: '#2a2a3a', dark: '#18181f', trim: '#8a8aa8', pants: '#3a4a8a' },
  pablo: { main: '#3a6ab8', dark: '#2a4a8a', trim: '#f0d040', pants: '#2a2a4a' },
  bob: { main: '#7a8a9a', dark: '#5a6a7a', trim: '#a8b8c8', pants: '#5a4a6a' },
  zip: { main: '#3ab86a', dark: '#26864a', trim: '#f2eef4', pants: '#3a3a5a' },
  rexy: { main: '#5ac85a', dark: '#3a8e3e', trim: '#fbe08a', pants: '#5ac85a' },
  leo: { main: '#3a4a8a', dark: '#26305e', trim: '#e0a93a', pants: '#4a3a32' },
  tonnerre: { main: '#2a2234', dark: '#160f1c', trim: '#fbe08a', pants: '#2a2234' },
  ramses: { main: '#e8dcc0', dark: '#b8a888', trim: '#e0a93a', pants: '#e8dcc0' },
  elixa: { main: '#8a3a5a', dark: '#5a2038', trim: '#e0a93a', pants: '#8a3a5a' },
  mako: { main: '#7a9ab8', dark: '#5a7a98', trim: '#f2eef4', pants: '#e86a2a' },
  pixel: { main: '#3a3a4a', dark: '#24242e', trim: '#6a8aa8', pants: '#2a2a3a' },
  lumi: { main: '#d8c8a0', dark: '#a89870', trim: '#8a6a4a', pants: '#6a4a32' },
  kero: { main: '#2a3a6a', dark: '#1a2648', trim: '#e2334a', pants: '#2a3a6a' },
  atlas: { main: '#e0e4ec', dark: '#9aa0b8', trim: '#e0a93a', pants: '#4a5a7a' },
  pyra: { main: '#d83a2a', dark: '#9a2018', trim: '#fbe08a', pants: '#d83a2a' },
  mortis: { main: '#2a3a6a', dark: '#1a2648', trim: '#8ae8ff', pants: '#2a3a6a' },
  shoto: { main: '#3a4a7a', dark: '#26305e', trim: '#b9c6d2', pants: '#3a4a7a' },
  bakugo: { main: '#2a2234', dark: '#160f1c', trim: '#e8702a', pants: '#2a2234' },
  redriot: { main: '#2a2234', dark: '#160f1c', trim: '#e2334a', pants: '#2a2234' },
  deku: { main: '#3a8a5a', dark: '#26603e', trim: '#2a2234', pants: '#3a8a5a' },
  allmight: { main: '#2a5ad8', dark: '#1a3a98', trim: '#e2334a', pants: '#2a5ad8' },
  gon: { main: '#3a8a3a', dark: '#26602a', trim: '#9ad86a', pants: '#2f6a2a' },
  kirua: { main: '#f2eef4', dark: '#c8c0d0', trim: '#5a3a9a', pants: '#3a4a8a' },
  hisoka: { main: '#efe4cc', dark: '#c8b890', trim: '#8a3aa8', pants: '#c0589a' },
  netero: { main: '#f0e8d8', dark: '#c8bca4', trim: '#3a3a4a', pants: '#3a3a4a' },
  meruem: { main: '#3a6a62', dark: '#244a44', trim: '#8ae0c8', pants: '#3a6a62' },
};

const W = '#f2eef4';

// ---------------------------------------------------------------- vague 1

// Brann, chevalier : écuyer au bonnet de cuir et au bouclier rond en bois, garde au heaume et à
// l'écu, chevalier à la crête et à la tour brodée, bastion au grand pavois ; rang 5, le rempart
// éternel : armure de plates turquoise et acier, heaume fermé à grande crête, pavois géant à la
// tour qui brille, masse à pointes.
function brann(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.brann, ST = '#b9c6d2', SH = '#e4ecf3', SD = '#8e99a4', LT = '#8a6a4a', LH = '#a8865f', WD = '#9a7048';
  const steel = rank >= 2;
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: steel ? SD : LT, bootsHi: steel ? SH : LH, sole: '#3a2a22', bracers: steel ? ST : LT, cape: rank >= 4 && K.dark });
  if (rank >= 3) { s.r(9, 14, 6, 2, ST); s.hl(9, 14, 14, SH); } // cotte de plates
  if (rank === 1) {
    // bonnet de cuir, cheveux qui dépassent
    s.r(8, 4, 8, 3, LT); s.hl(9, 14, 3, LT); s.hl(7, 16, 7, '#6a5038'); s.p(9, 4, LH, true);
    s.v(7, 8, 9, C.hair); s.v(16, 8, 9, C.hair);
  } else {
    // heaume à couvre-joues ; visière à fentes au rang 4
    s.r(8, 3, 8, 4, ST); s.hl(9, 14, 2, ST); s.hl(7, 16, 7, ST); s.v(7, 8, 12, ST); s.v(16, 8, 12, ST);
    s.p(9, 3, SH, true); s.p(10, 2, SH, true); s.p(7, 8, SH, true); s.hl(8, 15, 6, SD);
    if (rank >= 4) { s.hl(8, 15, 9, SD); s.p(9, 9, ST); s.p(14, 9, ST); }
  }
  if (rank === 2) s.hl(11, 12, 1, K.main);
  if (rank >= 3) { s.hl(10, 13, 1, K.main); s.hl(11, 12, 0, K.main); s.p(11, 0, K.trim, true); }
  if (rank >= 4) { s.v(13, 0, 1, K.trim); s.p(14, 1, K.main); s.p(10, 0, K.main); s.r(11, 4, 2, 2, K.trim, true); }
  // arme : gourdin, masse, masse à ailettes, masse à pointes
  const top = [9, 8, 5, 4, 4][rank - 1];
  s.v(18, top + 3, 20, C.grip); s.p(18, 20, '#7a5a3a', true);
  if (rank === 1) { s.r(17, top, 3, 4, WD); s.p(17, top, '#c8945a', true); s.p(19, top + 2, '#6a4a2a'); }
  else {
    s.r(17, top, 3, rank >= 3 ? 4 : 3, ST); s.p(17, top, SH, true);
    if (rank >= 3) { s.p(16, top + 1, ST); s.p(20, top + 1, ST); s.p(18, top - 1, ST); s.p(16, top + 2, ST); s.p(20, top + 2, ST); }
    if (rank >= 4) { s.p(15, top + 1, SD); s.p(21, top + 1, SD); s.p(18, top - 2, SD); s.p(18, top + 1, K.trim, true); }
  }
  // bouclier : rond en bois, écu, écu à tour brodée, grand pavois
  if (rank === 1) {
    for (const [y, a, b] of [[13, 2, 5], [14, 1, 6], [15, 1, 6], [16, 1, 6], [17, 1, 6], [18, 2, 5]]) s.hl(a, b, y, WD);
    s.v(3, 13, 18, '#7a5a3a'); s.r(3, 15, 2, 2, SD); s.p(3, 15, SH, true); s.p(2, 14, '#c8945a', true);
  } else {
    const rows = rank >= 4
      ? [[8, 1, 6], [9, 0, 7], [10, 0, 7], [11, 0, 7], [12, 0, 7], [13, 0, 7], [14, 0, 7], [15, 0, 7], [16, 0, 7], [17, 0, 7], [18, 0, 7], [19, 0, 7], [20, 1, 6], [21, 2, 5]]
      : [[11, 2, 5], [12, 1, 6], [13, 1, 6], [14, 1, 6], [15, 1, 6], [16, 1, 6], [17, 1, 6], [18, 1, 6], [19, 2, 5], [20, 2, 5], [21, 3, 4]];
    const y0 = rows[0][0], y1 = rows[rows.length - 1][0];
    for (const [y, a, b] of rows) { s.hl(a, b, y, ST); if (y > y0 && y < y1 - 1) s.hl(a + 1, b - 1, y, K.main); }
    s.p(rows[1][1], y0 + 1, SH, true);
    if (rank === 2) { s.v(3, 12, 19, K.trim); s.v(4, 12, 19, K.trim); }
    else {
      // tour brodée : créneaux, porte
      const cx = rank >= 4 ? 3 : 3, ty = rank >= 4 ? 11 : 13;
      s.r(cx, ty, 2, 6, K.trim); s.p(cx - 1, ty, K.trim); s.p(cx + 2, ty, K.trim); s.p(cx, ty + 5, K.dark); s.p(cx + 1, ty + 5, K.dark);
      if (rank >= 4) { s.hl(1, 6, 18, K.trim); s.p(3, 9, K.trim, true); s.p(4, 9, K.trim, true); }
    }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 5, '#b9c6d2'); s.hl(8, 15, 14, '#e4ecf3'); s.r(10, 15, 4, 3, K.main); s.p(11, 16, K.trim, true);
  s.hl(8, 15, 10, SD); s.hl(8, 15, 11, '#b9c6d2'); s.p(10, 10, K.trim, true); s.p(13, 10, K.trim, true);
  s.r(3, 11, 2, 6, '#c8fff8', true); s.p(3, 11, '#ffffff', true);
  return grand(s, (b) => {
    for (let y = 0; y <= 4; y++) b.under(14, y, K.main); b.under(13, 1, K.main); b.under(15, 2, K.trim); b.under(12, 2, K.main);
  });
}

// Mira, barde : chanteuse des rues au petit luth, ménestrelle à la broche, troubadour à la double
// plume et au luth enrubanné, virtuose à la lyre ; rang 5, la muse : robe longue à notes brodées,
// couronne de laurier dorée, cheveux jusqu'aux pieds, grande lyre d'or aux cordes de lumière.
function mira(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.mira, H = '#e8c070', HH = '#fff0b0', NT = '#ffd890', LY = '#e8b84a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#6a3a22', bootsHi: '#8a5a32', sole: '#2a1a12', cape: rank >= 3 && K.dark, bracers: rank >= 2 && '#6a3a22' });
  // longs cheveux blonds (jusqu'aux épaules au rang 4)
  s.hl(8, 15, 7, H); s.p(8, 8, H); s.p(9, 8, H); s.p(15, 8, H);
  s.v(7, 7, rank >= 4 ? 15 : 13, H); s.v(16, 7, rank >= 4 ? 15 : 13, H);
  s.p(10, 7, HH, true); s.p(14, 7, HH, true); s.p(7, 10, HH, true);
  // béret penché, plume qui monte en arrière
  s.hl(7, 15, 5, K.main); s.hl(8, 16, 4, K.main); s.hl(9, 15, 3, K.main);
  s.hl(8, 15, 6, K.dark); s.p(9, 3, '#f0a050', true); s.p(10, 4, '#f0a050', true);
  const plume = [[16, 3, 19, 1], [16, 3, 20, 0], [15, 3, 20, 0], [15, 3, 21, 0]][Math.min(3, rank - 1)];
  s.sline(...plume, W); s.p(16, 3, '#c8c0d0');
  if (rank >= 3) { s.sline(14, 3, 17, 0, '#e2334a'); s.p(18, 0, '#e2334a'); }
  if (rank >= 2) { s.p(14, 6, '#e2334a', true); s.p(14, 5, '#ff8a9a', true); } // broche
  if (rank >= 4) { s.p(9, 6, NT, true); s.p(12, 6, NT, true); }
  if (rank <= 3) {
    // luth : petit, puis grand, puis enrubanné
    const y0 = [11, 9, 7][rank - 1], wood = '#c8945a', wd = '#8a5a32';
    s.hl(2, 4, y0, '#5a3a22'); s.v(3, y0 + 1, 15, wd); s.v(4, y0 + 1, 15, C.string, true);
    const body2 = rank === 1 ? [[16, 2, 5], [17, 2, 5], [18, 2, 5], [19, 3, 4]] : [[15, 2, 5], [16, 1, 6], [17, 1, 6], [18, 1, 6], [19, 1, 6], [20, 2, 5]];
    for (const [y, a, b] of body2) s.hl(a, b, y, wood);
    s.r(3, 17, 2, 2, '#5a3a22', true); s.p(2, 16, '#e8b878', true);
    if (rank === 3) { s.p(2, y0 + 1, '#e2334a'); s.p(1, y0 + 2, '#e2334a'); s.p(1, y0 + 3, '#8c1f2e'); }
  } else {
    // lyre dorée à deux bras recourbés, cordes
    s.v(1, 9, 18, LY); s.v(6, 9, 18, LY); s.p(0, 8, LY); s.p(7, 8, LY); s.p(0, 7, '#fff0a0', true); s.p(7, 7, '#fff0a0', true);
    s.hl(1, 6, 10, '#a8762a'); s.hl(1, 6, 18, LY); s.hl(2, 5, 19, '#a8762a');
    for (const x of [2, 4]) s.v(x, 11, 17, C.string, true); s.v(3, 11, 17, null); s.v(5, 11, 17, null);
    for (const [x, y] of [[20, 4], [21, 9], [19, 12]]) { s.p(x, y, NT, true); s.p(x + 1, y - 1, NT, true); s.p(x + 1, y - 2, NT, true); }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 18, 8, 4, K.main); s.hl(8, 15, 21, '#e8b84a'); s.p(10, 19, NT, true); s.p(13, 20, NT, true);
  for (const x of [7, 16]) s.v(x, 14, 21, H);
  for (const [x, y] of [[8, 4], [9, 3], [14, 3], [15, 4]]) s.p(x, y, '#7ab84a');
  for (const x of [2, 4]) s.v(x, 11, 17, '#fff0a0', true);
  return grand(s, (b) => {
    b.v(2, 9, 12, LY); b.v(9, 9, 12, LY); b.p(1, 8, LY); b.p(10, 8, LY); b.p(1, 7, '#fff0a0', true); b.p(10, 7, '#fff0a0', true);
  });
}

// Nina, infirmière : stagiaire à la petite seringue, infirmière au stéthoscope, urgentiste à la
// trousse, cheffe de service à la blouse et au miroir frontal ; rang 5, l'ange blanc : longue
// blouse blanche, petites ailes sur la coiffe, croix verte qui brille sur la poitrine, seringue
// géante qui luit.
function nina(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.nina, H = '#8a4a2a', HH = '#b06a40', R = '#e2334a', GL = '#d8f0ff', LQ = rank >= 4 ? '#7af0b0' : '#5ae0a0';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#f2eef4', bootsHi: '#ffffff', sole: '#c8c0d0', robe: true, cape: rank >= 4 && '#e8e4ee', bracers: rank >= 4 && '#c8c0d0' });
  s.hl(12, 14, 17, K.dark); // poche du tablier
  // cheveux châtains au carré (chignon au rang 4)
  s.r(8, 5, 8, 3, H); s.v(7, 6, 12, H); s.v(16, 6, 12, H); s.p(8, 8, H); s.p(12, 8, H); s.p(15, 8, H);
  s.p(10, 6, HH, true); s.p(13, 7, HH, true);
  if (rank >= 4) { s.r(16, 4, 2, 2, H); s.p(16, 4, HH, true); }
  // coiffe à croix rouge
  s.r(9, 3, 6, 3, W); s.hl(8, 15, 5, W); s.v(12, 3, 5, R, true); s.hl(11, 13, 4, R, true); s.p(9, 3, '#ffffff', true);
  if (rank >= 4) { s.r(7, 5, 2, 2, '#d8e8f0', true); s.p(7, 5, '#ffffff', true); } // miroir frontal
  if (rank >= 2) { s.v(9, 14, 16, '#6a7480'); s.v(14, 14, 15, '#6a7480'); s.r(13, 16, 2, 2, '#b9c6d2'); s.p(13, 16, '#e4ecf3', true); } // stéthoscope
  if (rank >= 3) { s.r(5, 18, 3, 3, R); s.p(6, 18, '#ffffff', true); s.p(6, 19, '#ffffff', true); s.p(5, 19, '#ffffff', true); s.p(7, 19, '#ffffff', true); s.hl(5, 7, 17, '#8c1f20'); } // trousse
  // seringue : petite, moyenne, géante, à manomètre
  const top = [12, 10, 6, 4, 3][rank - 1];
  s.v(19, top - 3, top - 1, '#b9c6d2'); s.p(19, top - 3, '#ffffff', true);
  s.r(18, top, 3, 17 - top, GL); s.r(18, top + 2, 3, 15 - top - 2, LQ, true); s.p(18, top + 2, '#b8ffd8', true);
  for (let y = top + 1; y < 16; y += 2) s.p(20, y, '#8ab0c8', true);
  s.hl(17, 21, 17, '#b9c6d2'); s.v(19, 18, 19, '#8e99a4'); s.hl(18, 20, 20, '#b9c6d2');
  if (rank >= 4) { s.r(21, top + 3, 2, 2, '#f2eef4'); s.p(21, top + 3, R, true); } // manomètre
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(10, 15, 4, 3, '#f2eef4'); s.v(11, 15, 17, '#5ae0a0', true); s.v(12, 15, 17, '#5ae0a0', true); s.hl(10, 13, 16, '#5ae0a0', true); s.p(11, 16, '#ffffff', true);
  for (const d of [-1, 1]) { const x = d < 0 ? 8 : 15; s.p(x + d, 3, W); s.p(x + 2 * d, 2, W); s.p(x + d, 4, W); s.p(x + 2 * d, 3, '#c8c0d0'); }
  return grand(s, (b) => {
    b.v(21, 0, 3, '#d8f0ff'); b.v(21, 0, 2, '#7af0b0', true); b.p(21, 0, '#ffffff', true);
  });
}

// Pip, voleur : pickpocket à la dague unique, voleur aux deux dagues et au foulard, monte-en-l'air
// au grappin, maître voleur au loup et au sac de butin ; rang 5, le prince des voleurs : couronne
// volée penchée sur la capuche, cape de velours violet, deux dagues d'or, sac de butin qui déborde.
function pip(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.pip, H = '#8a3a2a', R = '#c8323c', ST = '#b9c6d2', SH = '#e4ecf3', GD = '#e0a93a', HOOD = rank >= 4 ? '#3a3040' : K.main;
  if (rank >= 4) { s.r(15, 9, 5, 7, '#a8865f'); s.hl(16, 18, 8, '#8a6a4a'); s.p(16, 10, '#c8a870', true); s.p(18, 8, GD, true); } // sac de butin dans le dos
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#3a3040', bootsHi: '#5a5060', sole: '#1a1418', mouth: false, cape: rank >= 3 && '#3a3040', bracers: rank >= 2 && '#4a3e30' });
  s.r(14, 19, 2, 2, '#a8865f'); s.p(14, 19, GD, true); // bourse
  if (rank >= 3) { s.sline(8, 14, 15, 18, '#c8a870'); s.p(7, 13, '#8e99a4'); s.p(6, 12, '#8e99a4'); } // corde du grappin en bandoulière
  // capuche, mèche rousse
  s.hl(9, 14, 4, HOOD); s.r(8, 5, 8, 3, HOOD); s.v(7, 6, 13, HOOD); s.v(16, 6, 13, HOOD);
  s.p(9, 5, rank >= 4 ? '#5a5060' : '#8a7660', true); s.p(10, 4, rank >= 4 ? '#5a5060' : '#8a7660', true);
  s.hl(8, 15, 8, H); s.p(9, 9, H); s.p(13, 9, H); s.p(11, 8, '#b05a3a', true);
  if (rank >= 4) { s.hl(8, 15, 10, '#2a2234'); s.p(10, 10, '#21182a'); s.p(13, 10, '#21182a'); s.p(9, 10, '#4a3e5a'); } // loup
  // foulard (dès le rang 2), pans qui flottent
  if (rank >= 2) { s.r(8, 12, 8, 2, R); s.p(10, 12, '#e85a5a', true); s.p(7, 14, R); s.p(6, 15, '#8c1f2e'); }
  else s.p(11, 12, C.mouth, true);
  // dagues : une, puis deux, puis courbes
  const top = [12, 11, 9, 8, 8][rank - 1];
  s.v(18, top, 17, ST); s.p(18, top, SH, true); if (rank >= 3) { s.p(19, top + 1, ST); s.p(19, top, SH, true); }
  s.hl(17, 19, 18, C.grip); s.v(18, 19, 20, C.grip); if (rank >= 4) s.p(18, 18, R, true);
  if (rank >= 2) { s.hl(4, 6, 18, C.grip); s.sline(5, 19, 4, rank >= 3 ? 22 : 21, ST); s.p(5, 19, SH, true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(9, 2, 5, 2, GD); s.p(9, 1, GD); s.p(11, 1, GD); s.p(13, 1, GD); s.p(11, 2, R, true); s.p(9, 2, '#fbe08a', true);
  s.v(18, 8, 17, GD); s.p(18, 8, '#fbe08a', true); s.p(19, 9, GD); s.sline(5, 19, 4, 22, GD);
  s.p(16, 7, GD, true); s.p(18, 7, '#fbe08a', true); s.p(17, 8, GD, true);
  return grand(s, (b) => {
    capeBack(b, '#5a2a7a', '#7a3a9a', GD);
  });
}

// Gus, mineur : apprenti à la lampe et à la pioche de bois, mineur à la pioche de fer, foreur à la
// lampe qui éclaire et à la pioche double, chef de mine au casque serti de cristaux et à la pioche
// de cristal ; rang 5, le roi des profondeurs : des cristaux lui poussent sur les épaules et le
// casque, lampe en gemme, barbe tressée de cristaux, pioche de cristal géante.
function gus(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.gus, H = '#6b4428', Y = '#f0c030', YD = '#c89020', SH = '#c8503a', ST = '#8e99a4', SL = '#b9c6d2', CR = '#c87af0', CL = '#f0c8ff';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#6a4a32', bootsHi: '#8a6a4a', sole: '#2a1e16', mouth: false });
  // chemise rouge sous la salopette, boutons
  s.r(6, 14, 2, 3, SH); s.r(16, 14, 2, 3, SH); s.p(8, 14, SH); s.p(15, 14, SH);
  s.p(10, 15, C.gold, true); s.p(13, 15, C.gold, true);
  if (rank >= 2) { s.hl(6, 7, 16, '#6a4a32'); s.hl(16, 17, 16, '#6a4a32'); } // gants
  if (rank >= 3) { s.r(14, 18, 2, 2, '#6a4a32'); s.p(14, 18, CR, true); } // sacoche, une gemme dépasse
  // barbe touffue (plus longue avec le rang)
  s.r(8, 12, 8, 2, H); s.hl(9, 14, 14, H); if (rank >= 3) s.hl(10, 13, 15, H); if (rank >= 4) s.hl(11, 12, 16, H);
  s.v(7, 8, 11, H); s.v(16, 8, 11, H); s.hl(10, 13, 12, '#4a2e1a'); s.p(9, 13, '#8a5a34', true); s.p(13, 14, '#8a5a34', true);
  // casque de chantier, lampe
  s.r(8, 3, 8, 4, Y); s.hl(9, 14, 2, Y); s.hl(7, 16, 7, YD); s.p(9, 3, '#fff0a0', true); s.p(10, 2, '#fff0a0', true);
  s.r(11, 4, 2, 2, '#fff4c0', true); s.p(11, 4, '#ffffff', true); s.hl(10, 13, 6, rank >= 2 ? ST : '#6a4a32');
  if (rank === 3) for (const [x, y] of [[13, 3], [14, 2], [15, 1], [16, 0]]) s.p(x + 2, y + 1, '#fff8c0', true); // faisceau
  if (rank >= 4) for (const [x, y] of [[8, 2], [14, 1], [15, 2]]) { s.p(x, y, CR); s.p(x, y - 1, CL, true); } // cristaux
  // pioche : bois, fer, double, cristal
  const y0 = [9, 8, 5, 4, 4][rank - 1], head = rank >= 4 ? CR : rank >= 2 ? ST : '#a8865f', hi = rank >= 4 ? CL : rank >= 2 ? SL : '#c8a870';
  s.v(4, y0 + 1, 20, '#8a5a32'); for (let y = y0 + 3; y < 20; y += 3) s.p(4, y, '#6a4226', true);
  const w = 3;
  s.hl(4 - w, 4 + w, y0, head); s.p(4 - w - 1, y0 + 1, head); s.p(4 + w + 1, y0 + 1, head); s.hl(5 - w, 3 + w, y0, hi, true);
  if (rank >= 3) { s.p(4 - w - 1, y0 + 2, head); s.p(4 + w + 1, y0 + 2, head); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[5, 12], [6, 11], [17, 12], [18, 11], [5, 13], [18, 13]]) { s.p(x, y, CR); }
  s.p(6, 11, CL, true); s.p(18, 11, CL, true); s.r(11, 4, 2, 2, '#5ae0ff', true); s.p(11, 4, '#ffffff', true);
  s.p(10, 16, CR, true); s.p(13, 15, CR, true); s.hl(0, 8, 3, CR); s.p(0, 4, CR); s.p(8, 4, CR); s.hl(1, 7, 3, CL, true);
  return grand(s, (b) => {
    b.under(2, 6, CR); b.under(10, 6, CR); b.under(2, 7, CR); b.under(10, 7, CR);
  });
}

// Lenny, pompier : volontaire au seau, pompier à la lance, sergent à la bouteille d'air et à la
// hache, capitaine au casque blanc et à la lance qui arrose ; rang 5, le héros du feu : combinaison
// ignifugée argentée, masque à oxygène, casque blanc à grand insigne, deux lances qui arrosent.
function lenny(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.lenny, H = C.hair, RD = rank >= 4 ? '#f2eef4' : '#c8302a', RDD = rank >= 4 ? '#c8c0d0' : '#8c1f20', HOSE = '#c8302a', ST = '#b9c6d2', WA = '#8ae0ff';
  if (rank >= 3) { s.r(15, 10, 3, 7, ST); s.p(15, 10, '#e4ecf3', true); s.hl(15, 17, 9, '#8e99a4'); } // bouteille d'air
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2a3a', bootsHi: '#4a4a5a', sole: '#141418', cape: false, bracers: K.trim });
  if (rank >= 3) { s.v(7, 18, 21, '#8a5a32'); s.r(6, 21, 3, 2, ST); s.p(6, 21, '#e4ecf3', true); s.p(8, 22, '#c8302a'); } // hache
  // cheveux courts
  s.hl(8, 15, 8, H); s.v(7, 8, 10, H); s.v(16, 8, 10, H); s.p(9, 9, H); s.p(14, 9, H);
  // casque : dôme, crête, long bord arrière, insigne (blanc de capitaine au rang 4)
  s.r(8, 3, 8, 4, RD); s.hl(9, 14, 2, RD); s.v(12, 2, 6, RDD); s.hl(5, 16, 7, RDD); s.p(4, 8, RDD); s.p(5, 8, RDD);
  s.p(9, 3, rank >= 4 ? '#ffffff' : '#e85a50', true); s.p(10, 2, rank >= 4 ? '#ffffff' : '#e85a50', true);
  const B = rank >= 2 ? (rank >= 4 ? '#e0a93a' : ST) : '#8a6a4a';
  s.r(10, 3, 2, 3, B); s.p(10, 3, '#ffffff', true);
  if (rank >= 4) { s.hl(8, 15, 10, '#2a2a3a'); s.p(9, 10, '#8ae0ff', true); s.p(14, 10, '#8ae0ff', true); } // masque visière
  if (rank === 1) {
    // seau d'eau
    s.r(17, 15, 4, 4, '#8e99a4'); s.hl(17, 20, 15, '#b9c6d2'); s.hl(18, 19, 15, WA, true); s.sline(17, 14, 20, 14, '#6a7480'); s.p(18, 13, '#6a7480'); s.p(19, 13, '#6a7480');
    return s;
  }
  // lance à incendie qui grandit ; au rang 4 l'eau jaillit
  const top = [0, 10, 7, 5, 4][rank - 1];
  s.v(18, top, top + 4, ST); s.p(18, top, '#e4ecf3', true); s.p(18, top - 1, WA, true);
  s.hl(17, 19, top + 5, ST); s.v(18, top + 6, 21, HOSE);
  s.hl(19, 21, 21, HOSE); s.hl(19, 22, 22, '#8c1f20'); s.p(21, 20, HOSE); s.p(18, 19, '#e85a50', true);
  if (rank >= 4) for (const [x, y] of [[18, 2], [19, 1], [20, 0], [17, 1], [21, 2], [22, 1]]) s.p(x, y, (x + y) % 2 ? WA : '#ffffff', true);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 5, '#c8ccd8'); s.hl(8, 15, 16, '#f0c030'); s.hl(8, 15, 18, '#f0c030'); s.r(6, 14, 2, 3, '#c8ccd8'); s.r(16, 14, 2, 3, '#c8ccd8');
  s.r(10, 12, 4, 2, '#4a4a5a'); s.p(11, 12, '#8ae0ff', true); s.r(9, 2, 4, 4, '#e0a93a'); s.p(10, 3, '#ffffff', true);
  s.v(4, 8, 14, '#b9c6d2'); s.p(4, 7, '#8ae0ff', true); s.p(3, 6, '#8ae0ff', true); s.p(5, 5, '#ffffff', true);
  return grand(s);
}

// Vex, vampire : rejeton à la petite cape, vampire à la broche de rubis, comte aux chauves-souris,
// seigneur de la nuit au col en pointes et aux yeux rouges ; rang 5, le roi vampire : ses ailes de
// chauve-souris lui sortent du dos, couronne noire à rubis, cape doublée de sang, rapière rouge.
function vex(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.vex, H = '#2a2234', HH = '#4a3e5a', R = K.trim, ST = '#b9c6d2', RB = '#e2334a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', mouth: false, cape: rank >= 2 && '#8c1f2e', bracers: rank >= 3 && '#8c1f2e' });
  // gilet rouge, broche
  s.v(11, 15, 17, '#8c1f2e'); s.v(12, 15, 17, '#8c1f2e');
  if (rank >= 2) s.p(12, 15, RB, true);
  s.p(11, 12, '#6a2a3a', true); s.p(12, 12, '#ffffff', true); // croc
  if (rank >= 4) { s.p(10, 10, '#e2334a', true); s.p(13, 10, '#e2334a', true); } // yeux rouges
  // cheveux plaqués, pointe sur le front
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H); s.v(7, 6, 9, H); s.v(16, 6, 9, H); s.p(11, 8, H); s.p(12, 8, H);
  s.p(10, 5, HH, true); s.p(14, 6, HH, true);
  // haut col : petit, dressé, puis en pointes
  const ct = rank >= 2 ? 8 : 10;
  s.v(5, ct, 13, K.main); s.v(18, ct, 13, K.main); s.v(6, ct + 1, 13, R); s.v(17, ct + 1, 13, R);
  if (rank >= 2) { s.p(4, 7, K.main); s.p(19, 7, K.main); }
  if (rank >= 4) { s.p(3, 6, K.main); s.p(20, 6, K.main); s.p(4, 4, K.main); s.p(19, 4, K.main); s.p(4, 5, K.main); s.p(19, 5, K.main); }
  if (rank >= 3) for (const [x, y] of [[2, 2], [21, 11]]) { s.p(x, y, H); s.p(x - 1, y - 1, H); s.p(x + 1, y - 1, H); s.p(x, y, '#e2334a', true); } // chauves-souris
  // rapière qui s'allonge, coquille, rubis
  const top = [8, 6, 3, 1, 1][rank - 1];
  s.v(20, top, 17, ST); s.v(20, top + 1, top + 4, '#e4ecf3', true);
  s.hl(19, 21, 18, rank >= 3 ? '#8c1f2e' : ST); s.p(21, 17, ST); s.v(20, 19, 20, H); s.p(20, 21, RB, true);
  if (rank >= 4) s.p(20, top + 6, RB, true);
  const out = s.recolor({ [C.skin]: '#f0d8cc', [C.skinSh]: '#c8a8a8' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.hl(9, 14, 3, '#2a2234'); for (const x of [9, 11, 12, 14]) out.p(x, 2, '#2a2234'); out.p(11, 3, RB, true); out.p(12, 3, RB, true);
  out.v(20, 1, 16, '#c83a4a'); out.v(20, 2, 5, '#ff8a9a', true);
  return grand(out, (b) => {
    for (const d of [-1, 1]) { const c = d < 0 ? 7 : 20; for (let i = 0; i < 6; i++) b.sline(c, 14, c + d * (2 + i), 8 + i, '#3a2a4a'); b.sline(c + d * 2, 8, c + d * 7, 13, '#5a3a6a'); for (const k of [0, 3]) b.under(c + d * (3 + k), 15, '#2a1a34'); }
  });
}

// Gideon, paladin : novice à la calotte et au maillet de bois, croisé au marteau de fer, paladin à
// la crête et au tabard, templier au heaume solaire ; rang 5, le saint guerrier : armure blanche et
// or, heaume solaire à grands rayons, tabard au grand soleil, marteau sacré qui rayonne.
function gideon(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.gideon, P = '#3a5ab8', PH = '#6a8ae0', ST = '#b9c6d2', SH = '#e4ecf3', SD = '#8e99a4', SUN = '#f0c030', SUH = '#fff0a0';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: rank >= 2 ? SD : '#8a6a4a', bootsHi: rank >= 2 ? SH : '#a8865f', sole: '#3a2a22', cape: rank >= 4 && P, bracers: rank >= 2 ? ST : '#8a6a4a' });
  // soleil sur la poitrine (plus grand avec le rang), tabard bleu (rang 3)
  if (rank >= 3) { s.r(10, 14, 4, 5, P); s.hl(10, 13, 18, PH); }
  s.r(11, 15, 2, 2, SUN, true); s.p(11, 15, SUH, true);
  if (rank >= 2) { s.p(10, 16, SUN, true); s.p(13, 15, SUN, true); }
  if (rank >= 3) { s.p(11, 14, SUN, true); s.p(12, 17, SUN, true); }
  if (rank === 1) {
    // calotte de fer, cheveux blonds
    s.r(8, 4, 8, 3, SD); s.hl(9, 14, 3, SD); s.p(9, 4, ST, true); s.hl(8, 15, 7, '#e8c070'); s.v(7, 7, 10, '#e8c070'); s.v(16, 7, 10, '#e8c070');
  } else {
    s.r(8, 3, 8, 4, ST); s.hl(7, 16, 7, ST); s.v(7, 8, 11, ST); s.v(16, 8, 11, ST); s.p(9, 3, SH, true); s.p(8, 7, SH, true); s.hl(8, 15, 6, SD);
    const crest = [[2, 10, 13], [1, 9, 14], [0, 10, 13]].slice(0, rank === 2 ? 1 : 3);
    for (const [y, a, b] of crest) s.hl(a, b, y, P);
    if (rank >= 3) { s.p(10, 1, PH, true); s.p(11, 2, PH, true); }
    if (rank >= 4) for (const [x, y] of [[7, 3], [6, 5], [16, 3], [17, 5], [8, 1], [15, 1]]) s.p(x, y, SUN); // rayons du heaume solaire
    if (rank >= 4) { s.r(11, 4, 2, 2, SUN, true); s.p(11, 4, SUH, true); }
  }
  // marteau : maillet de bois, fer, grand, à soleil
  const big = rank >= 3, y0 = [9, 8, 4, 3, 3][rank - 1], head = rank === 1 ? '#9a7048' : ST;
  s.v(19, y0 + 3, 21, C.wood); for (let y = y0 + 5; y < 21; y += 3) s.p(19, y, '#5a3f2e', true);
  s.r(big ? 17 : 18, y0, big ? 5 : 3, 3, head); s.p(big ? 17 : 18, y0, rank === 1 ? '#c8945a' : SH, true);
  if (rank >= 3) s.p(19, y0 + 1, SUN, true);
  if (rank >= 4) { s.r(18, y0 + 1, 3, 1, SUN, true); s.p(19, y0 + 1, SUH, true); s.p(16, y0 + 1, ST); s.p(22, y0 + 1, ST); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 5, '#f2eef4'); s.r(10, 14, 4, 5, P); s.r(11, 15, 2, 2, SUN, true); s.p(11, 15, SUH, true); s.p(10, 16, SUN, true); s.p(13, 15, SUN, true);
  for (const [x, y] of [[6, 2], [17, 2], [12, 0], [5, 4], [18, 4]]) s.p(x, y, SUN);
  s.r(17, 3, 5, 3, '#f2eef4'); s.r(18, 4, 3, 1, SUN, true); s.p(19, 4, '#ffffff', true);
  return grand(s, (b) => {
    for (const [x, y] of [[19, 5], [25, 5], [22, 3], [22, 10]]) b.p(x, y, SUH, true);
  });
}

// Aurélia, valkyrie : bouclière au petit casque ailé, valkyrie aux longues tresses, chevaucheuse à
// la lance à fanion, reine valkyrie aux grandes ailes de casque et à la lance de lumière ; rang 5,
// l'élue d'Asgard : ses grandes ailes de valkyrie, armure aux plumes d'argent, casque aux ailes
// immenses, lance de lumière.
function aurelia(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.aurelia, H = '#f0c860', HH = '#fff0b0', CP = '#3a5aa8', ST = '#b9c6d2', SH = '#e4ecf3', LI = '#c8f0ff';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: ST, bootsHi: SH, sole: '#3a3a4a', cape: rank >= 2 && CP, bracers: rank >= 3 ? K.trim : ST });
  s.p(9, 15, '#eef0f6', true); s.p(14, 16, '#eef0f6', true);
  if (rank >= 4) for (const x of [9, 11, 13]) s.p(x, 17, W, true); // plumes sur la cuirasse
  // tresses (plus longues avec le rang)
  const tl = [13, 15, 16, 17, 17][rank - 1];
  for (const x of [7, 16]) { s.v(x, 8, tl, H); for (let y = 9; y <= tl; y += 2) s.p(x, y, HH, true); s.p(x, tl + 1, CP); }
  s.hl(8, 15, 8, H); s.p(9, 9, H); s.p(14, 9, H);
  // casque et ailes qui grandissent
  s.r(8, 4, 8, 4, ST); s.hl(9, 14, 3, ST); s.hl(8, 15, 7, '#8e99a4'); s.p(9, 4, SH, true); s.p(10, 3, SH, true);
  s.r(11, 5, 2, 2, rank >= 4 ? LI : K.trim, true);
  const wing = [
    [[4, 6, 7], [5, 5, 7]],
    [[3, 5, 6], [4, 4, 7], [5, 5, 7]],
    [[1, 5, 6], [2, 4, 6], [3, 3, 7], [4, 4, 7], [5, 5, 7]],
    [[0, 4, 5], [1, 3, 6], [2, 2, 6], [3, 1, 7], [4, 2, 7], [5, 4, 7]],
  ][Math.min(3, rank - 1)];
  for (const [y, a, b] of wing) { s.hl(a, b, y, W); s.hl(23 - b, 23 - a, y, W); s.p(a, y, '#c8c0d0'); s.p(23 - a, y, '#c8c0d0'); }
  // lance : courte, longue, à fanion bleu, de lumière
  const top = [6, 3, 0, 0, 0][rank - 1], blade = rank >= 4 ? LI : ST;
  s.v(20, top + 4, 22, C.wood); s.v(20, top, top + 3, blade); s.p(19, top + 2, blade); s.p(21, top + 2, blade); s.p(20, top + 1, '#ffffff', true);
  s.hl(19, 21, top + 4, K.trim);
  if (rank >= 3) { s.r(21, top + 5, 2, 3, CP); s.p(22, top + 8, CP); s.p(21, top + 5, '#6a8ae0', true); }
  if (rank >= 4) for (const [x, y] of [[22, 2], [18, 1]]) s.spark(x, y, LI);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 4, '#e4ecf3'); for (const x of [9, 11, 13]) { s.p(x, 15, W, true); s.p(x + 1, 16, '#c8d0e0'); }
  s.v(20, 0, 3, LI, true); s.p(20, 0, '#ffffff', true);
  return grand(s, (b) => {
    const wing = [[10, 1, 9], [11, 0, 9], [12, 0, 9], [13, 1, 9], [14, 1, 9], [15, 2, 9], [16, 3, 9], [17, 4, 9], [18, 6, 9]];
    for (const [y, x0, x1] of wing) for (let x = x0; x <= x1; x++) { const c = x < x0 + 2 ? '#6a8ae0' : (x + y) % 4 === 0 ? '#e4ecf3' : '#ffffff'; b.under(x, y, c); b.under(27 - x, y, c); }
  });
}

// Nova, super-héroïne : justicière à la petite cape, héroïne au loup, super-héroïne aux bottes
// rouges et au poing qui brille, icône à l'étoile sur le front et à la cape immense ; rang 5, la
// légende cosmique : combinaison bleu nuit semée d'étoiles, cape immense, étoile au front, poing
// qui brille comme une étoile.
function nova(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.nova, H = '#f0c050', HH = '#fff0a0', CP = '#d8323c', CD = '#9a1e2a', GL = rank >= 3 ? '#fff8c0' : W;
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: rank >= 3 ? CP : K.dark, bootsHi: rank >= 3 ? '#ff6a6a' : K.main, sole: '#1a1e4a', cape: CP, belt: CP, buckle: K.trim });
  // cape au vent vers la gauche (plus longue avec le rang)
  const cape = [[14, 5, 6], [15, 4, 6], [16, 3, 6], [17, 2, 5], [18, 2, 5], [19, 1, 4], [20, 2, 3]].slice(0, [3, 5, 7, 7, 7][rank - 1]);
  for (const [y, a, b] of cape) s.hl(a, b, y, CP);
  if (rank >= 4) { s.hl(0, 3, 21, CP); s.hl(0, 1, 20, CP); s.p(0, 22, CD); s.p(1, 16, CP); s.p(0, 18, CP); }
  s.p(3, 17, CD); s.p(2, 19, CD);
  // éclair sur la poitrine (plus grand au rang 3)
  s.p(12, 15, K.trim, true); s.p(11, 16, K.trim, true); s.p(12, 16, K.trim, true); s.p(11, 17, K.trim, true);
  if (rank >= 3) { s.p(13, 14, K.trim, true); s.p(10, 18, K.trim, true); }
  // bras droit levé, poing ganté
  for (let y = 14; y <= 19; y++) { s.p(16, y, null); s.p(17, y, null); }
  s.r(16, 14, 2, 2, K.main); s.v(17, 9, 14, K.main); s.v(18, 9, 13, K.main); s.hl(17, 18, 9, K.trim);
  s.r(17, 6, 3, 3, GL); s.p(17, 6, '#ffffff', true); s.p(19, 8, '#c8c0d0');
  if (rank >= 3) for (const [x, y] of [[21, 5], [16, 5], [20, 4]]) s.p(x, y, '#fff8c0', true);
  // cheveux blonds qui volent
  s.r(8, 4, 8, 4, H); s.hl(9, 14, 3, H); s.v(7, 5, 12, H); s.v(6, 6, 10, H); s.p(5, 7, H); s.p(5, 8, H); s.p(4, 8, HH);
  s.v(16, 6, 9, H); s.p(9, 8, H); s.p(15, 8, H); s.p(10, 4, HH, true); s.p(13, 5, HH, true); s.p(6, 7, HH, true);
  if (rank >= 2) { s.hl(8, 15, 10, K.dark); s.p(10, 10, '#ffffff', true); s.p(13, 10, '#ffffff', true); s.p(10, 11, C.eye, true); s.p(13, 11, C.eye, true); } // loup
  if (rank >= 4) { s.p(12, 6, K.trim, true); s.p(11, 7, K.trim, true); s.p(13, 7, K.trim, true); s.p(12, 5, K.trim, true); } // étoile au front
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 4, '#1a1e4a'); for (const [x, y] of [[9, 15], [14, 16], [10, 17]]) s.p(x, y, '#ffffff', true);
  s.p(12, 15, K.trim, true); s.p(11, 16, K.trim, true); s.p(12, 16, K.trim, true); s.p(11, 17, K.trim, true);
  s.r(17, 6, 3, 3, '#fff8c0', true); s.p(18, 5, '#ffffff', true); s.p(20, 7, '#ffffff', true); s.p(16, 7, '#ffffff', true); s.p(18, 9, '#ffffff', true);
  return grand(s, (b) => {
    capeBack(b, CP, CD, '#fff0a0'); for (const [x, y] of [[6, 22], [20, 24], [9, 26]]) b.under(x, y, '#ffffff');
  });
}

// ---------------------------------------------------------------- vague 2

// Rok, bûcheron : apprenti à la hachette, bûcheron à la hache et aux bretelles, forestier à la
// hache double, géant des bois à la peau d'ours sur les épaules ; rang 5, le roi des forêts :
// armure d'écorce, couronne de feuilles sur la peau d'ours, barbe tressée, immense hache double
// gravée de feuilles.
function rok(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.rok, B = '#8a4a22', BH = '#b06a34', G = '#3a6a3a', ST = '#b9c6d2', SH = '#e4ecf3', FU = '#6a4a32', FH = '#8a6a4a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#5a3a22', bootsHi: '#7a5a3a', sole: '#2a1a12', mouth: false, bracers: rank >= 3 && '#5a3a22' });
  s.v(10, 15, 17, K.dark); s.v(13, 15, 17, K.dark);
  if (rank >= 2) { s.v(9, 14, 17, '#4a3a2a'); s.v(14, 14, 17, '#4a3a2a'); }
  // barbe rousse : courte, touffue, puis très longue
  s.r(8, 12, 8, 2, B); s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  if (rank >= 2) s.hl(9, 14, 14, B);
  if (rank >= 3) s.hl(10, 13, 15, B);
  if (rank >= 4) { s.hl(10, 13, 16, B); s.hl(11, 12, 17, B); }
  s.p(10, 13, BH, true); s.p(13, 13, BH, true); s.hl(10, 13, 12, '#6a3418');
  if (rank >= 4) {
    // peau d'ours : tête sur le crâne, fourrure sur les épaules
    s.r(8, 3, 8, 5, FU); s.hl(9, 14, 2, FU); s.p(8, 2, FU); s.p(15, 2, FU); s.p(8, 1, FH); s.p(15, 1, FH);
    s.hl(7, 16, 7, FH); s.p(10, 6, '#21182a', true); s.p(13, 6, '#21182a', true); s.p(9, 3, FH, true);
    s.hl(5, 18, 13, FU); s.hl(6, 17, 14, FU); for (const x of [6, 9, 14, 17]) s.p(x, 14, FH, true);
  } else {
    // bonnet de laine à revers, pompon
    s.r(8, 4, 8, 3, G); s.hl(9, 14, 3, G); s.hl(7, 16, 7, '#2a5a2a'); s.hl(7, 16, 8, '#2a5a2a');
    s.r(11, 1, 2, 2, '#e8d8b0'); s.p(9, 4, '#5a8a5a', true); s.p(10, 3, '#5a8a5a', true);
  }
  // hache : hachette, hache, double, grande double
  const y0 = [10, 7, 4, 2, 2][rank - 1], big = rank >= 4;
  s.v(18, y0, 21, '#8a5a32'); for (let y = y0 + 3; y < 21; y += 3) s.p(18, y, '#6a4226', true);
  const hw = rank === 1 ? 1 : 2, hh = big ? 6 : rank === 1 ? 3 : 4;
  s.r(19, y0 + 1, hw, hh, ST); s.p(19 + hw, y0, ST); s.p(19 + hw, y0 + hh + 1, ST); s.v(19 + hw, y0 + 1, y0 + hh, SH, true);
  if (rank >= 3) { s.r(16, y0 + 1, 2, hh - 1, ST); s.p(16, y0 + 1, SH, true); if (big) s.v(15, y0 + 2, y0 + 4, ST); }
  if (big) s.p(20, y0 + 3, '#4a8a3a', true); // feuille gravée
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 3, '#6a4a32'); for (const [x, y] of [[9, 15], [12, 14], [14, 16]]) s.p(x, y, '#8a6a4a'); s.p(10, 16, '#4a8a3a', true);
  for (const [x, y] of [[8, 1], [10, 0], [13, 0], [15, 1], [11, 1]]) s.p(x, y, '#4a8a3a'); s.p(10, 0, '#7ac85a', true);
  s.p(11, 17, '#4a8a3a'); s.p(12, 17, '#4a8a3a');
  return grand(s, (b) => {
    b.under(21, 2, '#b9c6d2'); b.under(22, 3, '#b9c6d2'); b.under(16, 3, '#b9c6d2'); b.under(22, 9, '#b9c6d2'); b.under(21, 10, '#b9c6d2');
  });
}

// Tobo, chef cuisinier : commis à la petite toque, cuisinier à l'œuf au plat, chef à la cuillère en
// bois et au steak, grand chef à la médaille et au wok qui flambe ; rang 5, le chef étoilé : toque
// immense ornée de trois étoiles, veste à boutons d'or et médaille, wok de cuivre qui flambe,
// couteau de chef.
function tobo(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.tobo, H = '#3a2a22', R = '#e2334a', ST = '#8e99a4', CU = '#c8703a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.dark, pants: K.pants, boots: '#2a2a32', bootsHi: '#4a4a52', sole: '#141418', mouth: false });
  for (const y of [15, 17]) { s.p(10, y, '#a8a0b0'); s.p(13, y, '#a8a0b0'); }
  s.hl(9, 14, 14, R); s.p(11, 15, R); s.p(12, 15, '#a8203a');
  if (rank >= 3) { s.v(7, 17, 21, '#c8945a'); s.r(6, 21, 2, 2, '#c8945a'); s.p(6, 21, '#e8b878', true); } // cuillère en bois
  if (rank >= 4) { s.p(10, 16, '#3a64c8'); s.p(10, 17, '#f2eef4'); s.p(10, 18, R); s.r(9, 18, 2, 2, '#e0a93a'); s.p(9, 18, '#fbe08a', true); } // médaille
  // moustache (en guidon dès le rang 2), cheveux sur les côtés
  s.hl(10, 13, 12, H); if (rank >= 2) { s.p(9, 13, H); s.p(14, 13, H); } if (rank >= 4) { s.p(8, 12, H); s.p(15, 12, H); }
  s.v(7, 8, 10, H); s.v(16, 8, 10, H); s.hl(8, 15, 7, H);
  // toque qui grandit avec le rang
  const tt = [4, 2, 1, 0, 0][rank - 1];
  s.r(8, tt + 1, 8, 5 - tt, K.main); s.hl(9, 14, tt, K.main); s.p(7, tt + 2, K.main); s.p(16, tt + 2, K.main);
  if (rank >= 4) { s.r(9, 0, 6, 1, K.main); s.p(8, 1, K.main); s.p(15, 1, K.main); }
  s.v(11, tt + 1, 5, K.dark); if (rank >= 2) s.p(14, tt + 2, K.dark);
  s.hl(8, 15, 6, K.dark); s.p(9, tt + 1, '#ffffff', true);
  // poêle : petite et vide, œuf au plat, steak, wok qui flambe
  const big = rank >= 3, y0 = big ? 7 : 10, w = rank === 1 ? 3 : big ? 5 : 4, PAN = rank >= 4 ? CU : ST;
  s.v(19, y0 + w, 20, C.grip);
  s.r(17, y0, w, w, PAN); s.r(18, y0 + 1, w - 2, w - 2, '#2a2a32'); s.p(17, y0, rank >= 4 ? '#e8a060' : '#b9c6d2', true);
  if (rank === 2) { s.p(18, y0 + 1, '#ffffff', true); s.p(19, y0 + 2, '#fbe08a', true); }
  if (rank === 3) { s.r(18, y0 + 1, 3, 2, '#8a3a2a', true); s.p(18, y0 + 1, '#c86a4a', true); }
  if (rank >= 4) for (const [x, y] of [[18, y0 - 1], [19, y0 - 2], [20, y0 - 1], [19, y0 - 1], [21, y0 - 2]]) s.p(x, y, (x + y) % 2 ? '#ff8a2a' : '#fbe08a', true);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const x of [9, 12, 15]) s.p(x, 2, '#f0c030', true);
  for (const y of [15, 17]) { s.p(10, y, '#e0a93a'); s.p(13, y, '#e0a93a'); }
  s.v(4, 14, 18, '#b9c6d2'); s.v(5, 15, 18, '#e4ecf3', true); s.hl(4, 5, 19, '#2a2a32');
  return grand(s, (b) => {
    for (const [x, y] of [[20, 7], [21, 6], [22, 7], [19, 6], [23, 6], [21, 5]]) b.p(x, y, (x + y) % 2 ? '#ff8a2a' : '#fbe08a', true);
  });
}

// Hugo, boxeur : amateur au bandeau, boxeur au casque de protection, poids lourd aux mains bandées
// et au short rayé, champion à la ceinture et au peignoir ; rang 5, la légende du ring : peignoir
// de champion à capuche, ceinture de champion géante, gants dorés qui flambent.
function hugo(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.hugo, H = '#2a2234', GL = '#d8323c', GH = '#ff8a8a', BLT = '#e0a93a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#f2eef4', bootsHi: '#ffffff', sole: '#8a8a9a', cape: rank >= 4 && '#d8323c', belt: rank >= 4 ? BLT : '#f2eef4', buckle: rank >= 4 ? '#fbe08a' : '#c8c0d0' });
  s.r(6, 14, 2, 3, C.skin); s.r(16, 14, 2, 3, C.skin);
  s.r(8, 18, 8, 2, K.pants); s.hl(8, 15, 18, rank >= 4 ? BLT : '#f2eef4');
  if (rank >= 3) { s.p(9, 19, '#f2eef4'); s.p(14, 19, '#f2eef4'); }
  if (rank >= 4) { s.r(10, 17, 4, 3, BLT); s.r(11, 18, 2, 1, '#fbe08a', true); s.p(10, 17, '#fbe08a', true); } // ceinture de champion
  // cheveux en épis
  s.r(8, 4, 8, 3, H); for (const [x, y] of [[9, 3], [11, 2], [13, 3], [15, 3]]) s.p(x, y, H);
  s.v(7, 6, 9, H); s.v(16, 6, 9, H); s.p(10, 4, '#4a3e5a', true);
  if (rank === 2 || rank === 3) {
    // casque de protection rouge
    s.r(8, 3, 8, 4, GL); s.hl(9, 14, 2, GL); s.v(7, 7, 11, GL); s.v(16, 7, 11, GL); s.hl(7, 16, 7, GL); s.p(9, 3, GH, true);
    if (rank === 3) s.hl(9, 14, 8, GL);
  } else { s.hl(7, 16, 7, rank >= 4 ? BLT : GL); s.p(8, 7, rank >= 4 ? '#fbe08a' : GH, true); }
  if (rank >= 4) { s.p(5, 8, rank >= 4 ? BLT : GL); s.p(4, 9, GL); } // pans du bandeau
  // gants : petits, puis gros, mains bandées, gants à éclair
  const G = GL, gs = rank === 1 ? 3 : 4;
  s.r(3, 12, gs, gs, G); s.p(3, 12, GH, true); s.hl(3, 2 + gs, 11 + gs, '#f2eef4');
  s.r(17, 14, gs, gs, G); s.p(17, 14, GH, true); s.hl(17, 16 + gs, 13 + gs, '#f2eef4');
  if (rank >= 3) { s.v(6, 16, 17, '#f2eef4'); s.v(16, 16, 17, '#f2eef4'); }
  else s.v(6, 16, 17, C.skin);
  if (rank >= 4) { s.p(18, 15, '#fbe08a', true); s.p(19, 16, '#fbe08a', true); s.p(4, 13, '#fbe08a', true); s.p(5, 14, '#fbe08a', true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 2, 5, '#d8323c'); s.r(14, 14, 2, 5, '#d8323c'); s.hl(8, 15, 14, '#ff8a8a');
  s.r(9, 16, 6, 3, BLT); s.r(10, 17, 4, 1, '#fbe08a', true); s.p(12, 17, '#e2334a', true);
  for (const [x, y] of [[3, 11], [4, 10], [17, 13], [19, 12], [20, 13]]) s.p(x, y, '#ff8a2a', true);
  s.r(3, 12, 4, 4, BLT); s.r(17, 14, 4, 4, BLT); s.p(3, 12, '#fbe08a', true); s.p(17, 14, '#fbe08a', true);
  return grand(s);
}

// Kiki, cow-girl : gamine du ranch au lasso, cow-girl à l'étoile d'adjointe, deux revolvers et
// tresse au rang 3, shérif au cache-poussière et aux éperons ; rang 5, la légende de l'Ouest : long
// cache-poussière, chapeau à plumes et à cordon, étoile d'or, deux revolvers dorés, éperons.
function kiki(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.kiki, H = '#c8502a', HH = '#e8803a', HT = '#8a5a32', HTD = '#6a4226', ST = '#8e99a4', SH = '#b9c6d2', STAR = rank >= 4 ? '#e0a93a' : SH;
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#6a4226', bootsHi: '#8a5a32', sole: '#2a1a12', cape: rank >= 4 && '#a8784a', bracers: rank >= 3 && HTD });
  s.v(8, 14, 17, HTD); s.v(15, 14, 17, HTD); // gilet
  s.hl(10, 13, 14, '#3a64c8'); s.p(11, 15, '#3a64c8'); // foulard
  if (rank >= 4) { s.p(7, 23, SH); s.p(16, 23, SH); s.p(7, 22, ST); s.p(16, 22, ST); } // éperons
  // cheveux roux (tresse au rang 3)
  s.hl(8, 15, 7, H); s.p(8, 8, H); s.p(15, 8, H); s.p(9, 8, H);
  s.v(7, 7, 14, H); s.v(16, 7, rank >= 3 ? 11 : 14, H); s.p(7, 10, HH, true); s.p(10, 7, HH, true);
  if (rank >= 3) { s.v(17, 11, 17, H); for (let y = 12; y <= 16; y += 2) s.p(17, y, HH, true); s.p(17, 18, '#3a64c8'); }
  // chapeau de cow-boy (bord plus large avec le rang)
  s.r(9, 3, 6, 3, HT); s.p(8, 4, HT); s.p(15, 4, HT); s.p(11, 2, HT); s.p(13, 2, HT);
  const bw = rank >= 3 ? 5 : 6; s.hl(bw, 23 - bw, 6, HT); s.p(bw - 1, 5, HT); s.p(24 - bw, 5, HT);
  s.hl(9, 14, 5, HTD); s.p(12, 3, HTD); s.p(9, 3, '#a8784a', true);
  if (rank >= 2) { s.p(13, 16, STAR); s.p(12, 16, STAR); s.p(13, 15, STAR); s.p(13, 17, STAR); s.p(14, 16, STAR); s.p(13, 16, '#ffffff', true); } // étoile
  // revolver (deux au rang 3)
  if (rank >= 2) { const L = rank >= 3 ? 4 : 3; s.hl(18, 18 + L, 15, ST); s.p(18 + L, 14, ST); s.p(19, 15, SH, true); s.v(18, 16, 17, '#8a5a32'); s.p(19, 16, '#8a5a32'); }
  if (rank >= 3) { s.hl(0, 3, 15, ST); s.p(0, 14, ST); s.p(2, 15, SH, true); s.v(4, 16, 17, '#8a5a32'); }
  // lasso à la hanche (au rang 1 il tourne au-dessus de la main)
  const R = '#c8a870';
  if (rank === 1) { s.hl(19, 21, 10, R); s.hl(19, 21, 12, R); s.p(18, 11, R); s.p(22, 11, R); s.v(18, 13, 17, R); }
  else { s.hl(3, 5, 17, R); s.v(2, 18, 20, R); s.v(6, 18, 20, R); s.hl(3, 5, 21, R); s.p(4, 19, '#a88a50'); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(6, 14, 2, 8, '#a8784a'); s.r(16, 14, 2, 8, '#a8784a');
  s.p(15, 4, '#e2334a'); s.p(16, 3, '#e2334a'); s.p(17, 2, '#ffffff'); s.hl(9, 14, 5, '#e0a93a');
  s.hl(18, 22, 15, '#e0a93a'); s.hl(0, 3, 15, '#e0a93a'); s.p(19, 15, '#fbe08a', true); s.p(2, 15, '#fbe08a', true);
  return grand(s);
}

// Bjorn, viking : pillard aux petites cornes, viking au bouclier rond dans le dos, berserker aux
// peintures de guerre et à la peau d'ours, jarl à la barbe perlée et à la hache runique ; rang 5,
// le héros du Valhalla : casque aux cornes géantes et aux ailes, armure de runes qui luisent, cape
// de fourrure, deux haches.
function bjorn(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.bjorn, B = '#e8b048', BH = '#fff0a0', F = '#8a6a4a', FH = '#a8865f', HO = '#efe6cf', ST = '#b9c6d2', SH = '#e4ecf3', SD = '#8e99a4', RU = '#5ae0ff';
  if (rank >= 2) { for (const [y, a, b2] of [[9, 15, 18], [10, 14, 19], [11, 14, 19], [12, 14, 19], [13, 15, 18]]) s.hl(a, b2, y, '#a83a2a'); s.p(16, 11, ST); s.p(17, 11, ST); } // bouclier rond dans le dos
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: F, bootsHi: FH, sole: '#3a2a22', mouth: false, cape: rank >= 4 && '#8c1f2e', bracers: rank >= 2 ? ST : F });
  // col de fourrure (peau d'ours au rang 3)
  s.hl(6, 17, 14, F); s.hl(7, 16, 13, F); for (const x of [7, 10, 14, 16]) s.p(x, 14, FH, true);
  if (rank >= 3) { s.hl(5, 18, 13, '#5a3a22'); s.p(5, 12, '#5a3a22'); s.p(18, 12, '#5a3a22'); }
  // barbe tressée (plus longue et perlée au rang 4)
  s.r(8, 12, 8, 2, B); s.r(9, 14, 6, 2, B); s.v(11, 16, 17, B); s.v(12, 16, 17, B);
  if (rank >= 4) { s.v(11, 18, 19, B); s.v(12, 18, 19, B); s.p(11, 19, ST); s.p(12, 19, ST); }
  s.p(11, 17, '#c8323c'); s.p(12, 17, '#c8323c'); s.p(10, 14, BH, true); s.p(13, 13, BH, true); s.hl(10, 13, 12, '#c8903a');
  s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  if (rank >= 3) { s.p(9, 11, '#3a64c8', true); s.p(14, 11, '#3a64c8', true); s.p(9, 10, '#3a64c8'); } // peinture de guerre
  // casque à cornes (plus grandes avec le rang)
  s.r(8, 3, 8, 5, ST); s.hl(9, 14, 2, ST); s.hl(7, 16, 7, SD); s.v(12, 2, 6, SD); s.p(9, 3, SH, true); s.p(10, 2, SH, true);
  const horn = [[[7, 5], [6, 4]], [[7, 5], [6, 4], [5, 3]], [[7, 5], [6, 4], [5, 3], [5, 2], [5, 1]], [[7, 5], [6, 4], [5, 3], [4, 2], [4, 1], [5, 0]]][Math.min(3, rank - 1)];
  for (const [x, y] of horn) { s.p(x, y, HO); s.p(23 - x, y, HO); }
  if (rank >= 4) { s.p(11, 4, RU, true); s.p(12, 5, RU, true); }
  // hache : simple, grande, à deux mains, runique
  const y0 = [7, 6, 3, 2, 2][rank - 1];
  s.v(4, y0, 21, '#8a5a32'); for (let y = y0 + 4; y < 21; y += 3) s.p(4, y, '#6a4226', true);
  s.r(1, y0 + 1, 3, 4, ST); s.p(0, y0 + 2, ST); s.p(0, y0 + 3, ST); s.p(2, y0, ST); s.p(2, y0 + 5, ST); s.v(1, y0 + 1, y0 + 3, SH, true);
  if (rank >= 3) { s.r(5, y0 + 1, 2, 3, ST); s.p(7, y0 + 2, ST); }
  if (rank >= 4) { s.p(2, y0 + 2, RU, true); s.p(2, y0 + 4, RU, true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(9, 14, 6, 2, '#8e99a4'); s.p(10, 15, RU, true); s.p(13, 14, RU, true);
  for (const d of [-1, 1]) { const x = d < 0 ? 7 : 16; s.p(x, 3, '#f2eef4'); s.p(x + d, 2, '#f2eef4'); s.p(x + d, 3, '#c8c0d0'); }
  s.r(19, 4, 3, 4, ST); s.p(22, 5, ST); s.p(22, 6, ST); s.p(20, 3, ST); s.v(19, 4, 19, '#8a5a32'); s.p(21, 5, RU, true);
  return grand(s, (b) => {
    capeBack(b, '#5a3a22', '#7a5a3a', FH);
  });
}

// Sven, pêcheur : moussaillon à la canne simple, pêcheur à la pipe et au moulinet, marin au filet
// et au gros poisson, capitaine à la casquette à ancre et au harpon ; rang 5, le vieux loup de mer
// : grand manteau de capitaine aux boutons d'or, jambe de bois, perroquet sur l'épaule, harpon à
// corde.
function sven(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.sven, B = '#c8c0b8', BS = '#9a928a', NV = '#2a3a6a', ST = '#b9c6d2', NET = '#c8a870';
  if (rank >= 3) for (let y = 9; y <= 16; y++) for (let x = 3; x <= 7; x++) if ((x + y) % 2 === 0) s.p(x, y, NET); // filet sur l'épaule
  body(s, { tunic: rank >= 4 ? NV : K.main, dark: rank >= 4 ? '#1a2648' : K.dark, trim: K.trim, pants: K.pants, boots: '#2a2a3a', bootsHi: '#4a4a5a', sole: '#141418', mouth: false });
  s.p(12, 15, rank >= 4 ? '#e0a93a' : '#3a4a6a'); s.p(12, 17, rank >= 4 ? '#e0a93a' : '#3a4a6a');
  // barbe grise (plus fournie avec le rang), pipe
  s.r(8, 12, 8, 2, B); s.hl(9, 14, 14, B); if (rank >= 3) s.hl(10, 13, 15, B); s.p(10, 13, BS); s.p(13, 12, BS);
  s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  if (rank >= 2) { s.p(14, 12, '#6a4226'); s.p(15, 12, '#6a4226'); s.p(15, 11, '#8a5a32'); s.p(15, 10, '#e8e0d0', true); }
  if (rank >= 4) {
    // casquette de capitaine à ancre
    s.r(8, 4, 8, 3, NV); s.hl(9, 14, 3, '#f2eef4'); s.hl(8, 15, 3, '#f2eef4'); s.hl(7, 16, 7, '#1a1e2a'); s.hl(14, 18, 7, '#1a1e2a');
    s.p(11, 5, '#e0a93a', true); s.p(12, 5, '#e0a93a', true); s.p(12, 4, '#e0a93a', true); s.p(11, 6, '#e0a93a', true);
  } else {
    // chapeau de pluie jaune
    s.r(8, 4, 8, 3, K.main); s.hl(9, 14, 3, K.main); s.hl(6, 17, 7, K.dark); s.hl(5, 8, 8, K.dark); s.p(17, 8, K.dark);
    s.p(9, 4, K.trim, true); s.p(10, 3, K.trim, true);
  }
  if (rank >= 4) {
    // harpon
    s.v(20, 3, 22, '#8a5a32'); s.v(20, 0, 2, ST); s.p(19, 2, ST); s.p(21, 2, ST); s.p(19, 3, ST); s.p(21, 3, ST); s.p(20, 0, '#ffffff', true);
    s.sline(20, 6, 22, 9, NET);
  } else {
    // canne : simple, à moulinet, longue avec un gros poisson
    const tip = [[20, 6], [20, 4], [21, 1]][rank - 1];
    s.sline(17, 19, tip[0], tip[1], '#8a5a32');
    if (rank >= 2) { s.p(18, 16, ST); s.p(17, 17, ST); }
    s.v(tip[0] + 1, tip[1], tip[1] + 6, C.string, true);
    const fy = tip[1] + 7, F = '#4a9ae0';
    s.hl(21, 23, fy, F); if (rank >= 2) s.hl(21, 23, fy + 1, F); s.p(20, fy, F); s.p(20, fy + (rank >= 2 ? 2 : 1), F); s.p(22, fy, '#ffffff', true);
    if (rank === 3) { s.hl(21, 23, fy + 2, F); s.p(23, fy + 3, F); }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 6, NV); s.v(10, 15, 19, '#e0a93a'); s.v(13, 15, 19, '#e0a93a'); s.r(6, 14, 2, 4, NV); s.r(16, 14, 2, 4, NV);
  s.r(13, 20, 2, 4, null); s.v(14, 20, 23, '#8a5a32');
  s.r(16, 10, 2, 3, '#3ab84a'); s.p(18, 10, '#e0a93a'); s.p(16, 10, '#e2334a'); s.p(17, 10, '#21182a', true); s.p(16, 13, '#3a64c8');
  return grand(s);
}

// Astra, astronaute : cadette au petit laser, astronaute au réacteur dorsal, pilote à la visière
// dorée et au fusil, commandante au casque à ailerons et à l'écusson ; rang 5, l'exploratrice des
// étoiles : combinaison renforcée aux plaques orange, visière dorée pleine, réacteur dorsal à
// ailerons, fusil plasma.
function astra(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.astra, GL = rank >= 3 ? '#f0c860' : '#a8d8f0', H = '#3a2a22', O = K.trim, ST = '#8e99a4', SH = '#b8c2cc';
  // sac de survie, puis réacteur dorsal (flammes au rang 3)
  s.r(4, 14, 3, 6, ST); s.p(4, 14, SH, true); s.p(5, 16, '#e2552a', true);
  if (rank >= 2) { s.r(3, 12, 4, 8, ST); s.p(3, 12, SH, true); s.r(3, 20, 2, 1, '#4a4a5a'); s.r(5, 20, 2, 1, '#4a4a5a'); }
  if (rank >= 3) { s.p(3, 21, '#ff8a2a', true); s.p(5, 21, '#ff8a2a', true); s.p(3, 22, '#fbe08a', true); s.p(5, 22, '#fbe08a', true); }
  body(s, { tunic: K.main, dark: K.dark, trim: O, pants: K.pants, boots: '#e4e4ee', bootsHi: '#ffffff', sole: '#8e99a4', belt: ST, bracers: O, cape: false });
  s.p(10, 16, '#4a9ae0', true); s.p(13, 16, O, true);
  if (rank >= 4) { s.r(9, 15, 2, 2, '#2a3a7a'); s.p(9, 15, '#fbe08a', true); } // écusson de commandante
  s.r(8, 5, 8, 2, H); s.p(8, 7, H); s.p(15, 7, H);
  // casque-bulle (visière dorée au rang 3) ; ailerons au rang 4
  s.hl(9, 14, 2, GL); s.hl(8, 15, 3, GL); s.p(7, 4, GL); s.p(16, 4, GL);
  s.v(6, 5, 12, GL); s.v(17, 5, 12, GL); s.p(7, 13, GL); s.p(16, 13, GL);
  s.p(8, 3, '#ffffff', true); s.p(6, 6, '#ffffff', true); s.p(6, 7, '#ffffff', true);
  s.hl(7, 16, 14, ST);
  if (rank >= 4) { s.v(18, 6, 10, O); s.p(19, 7, O); s.v(5, 6, 10, O); s.p(4, 7, O); }
  // antenne (double au rang 2)
  s.v(16, 0, 2, ST); s.p(16, 0, '#e2334a', true);
  if (rank >= 2) { s.v(7, 1, 2, ST); s.p(7, 1, '#4ff0e8', true); }
  // laser : petit, pistolet, fusil
  const L = [2, 3, 5, 6, 6][rank - 1];
  s.hl(18, 18 + L, 15, ST); s.p(18, 16, '#4a4a5a'); s.p(18, 17, '#4a4a5a'); s.p(19 + L, 15, C.neon, true); s.p(19, 15, SH, true);
  if (rank >= 3) { s.hl(19, 21, 14, O); s.p(18, 14, ST); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 3, '#e4e4ee'); s.hl(8, 15, 15, O); s.r(9, 8, 6, 5, '#f0c860'); s.p(10, 9, '#ffffff', true); s.p(9, 8, '#fff0a0', true);
  s.hl(18, 24, 15, '#8e99a4'); s.p(24, 15, '#c87af0', true); s.hl(19, 22, 14, O);
  return grand(s, (b) => {
    b.sline(5, 16, 1, 12, O); b.sline(5, 17, 1, 14, O); b.sline(22, 16, 26, 12, O); b.sline(22, 17, 26, 14, O);
    for (const x of [5, 7]) { b.p(x, 26, '#ff8a2a', true); b.p(x, 27, '#fbe08a', true); }
  });
}

// Nyx, nécromancienne : initiée au petit bâton à crâne, nécromancienne à la flamme verte et à la
// ceinture d'os, invocatrice au crâne volant, liche à la couronne d'os et aux yeux verts ; rang 5,
// la reine des morts : couronne et armure d'os, robe d'ombre aux runes vertes, yeux qui brûlent,
// faux d'os à flamme verte.
function nyx(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.nyx, HW = '#e8e4f0', GR = K.trim, BO = '#e8e0cc', GH = '#c8ffb8';
  body(s, { tunic: K.main, dark: K.dark, trim: '#9a6ad0', pants: K.pants, boots: '#2a1e30', bootsHi: '#4a3a50', sole: '#140d18', robe: true, cape: rank >= 4 && K.dark });
  s.p(11, 16, GR, true);
  if (rank >= 2) for (const x of [9, 11, 13]) s.p(x, 18, BO); // ceinture d'os
  // cheveux blancs sous la capuche
  s.hl(8, 15, 8, HW); s.p(9, 9, HW); s.p(14, 9, HW); s.v(8, 9, 13, HW); s.v(15, 9, 13, HW);
  if (rank >= 4) { s.p(10, 10, GR, true); s.p(13, 10, GR, true); s.p(10, 11, '#3ab84a', true); s.p(13, 11, '#3ab84a', true); } // yeux verts
  // capuche pointue vers l'arrière
  s.r(8, 4, 8, 4, K.main); s.hl(9, 15, 3, K.main); s.hl(11, 16, 2, K.main); s.p(16, 3, K.main); s.p(17, 2, K.main);
  s.v(7, 5, 14, K.main); s.v(16, 5, 14, K.main); s.hl(8, 15, 7, K.dark); s.p(9, 4, '#6a4a8a', true); s.p(10, 3, '#6a4a8a', true);
  if (rank >= 4) { for (const x of [8, 10, 12, 14]) { s.p(x, 2, BO); s.p(x, 1, BO); } s.p(10, 0, BO); s.p(14, 0, BO); } // couronne d'os
  // bâton à crâne, flamme verte (plus haute avec le rang)
  const top = [8, 6, 4, 4, 4][rank - 1];
  s.v(4, top + 4, 23, '#4a3a2a');
  s.r(3, top, 3, 3, BO); s.p(3, top + 3, BO); s.p(5, top + 3, BO);
  s.p(3, top + 1, '#2a1e30', true); s.p(5, top + 1, '#2a1e30', true); s.p(4, top + 2, '#2a1e30', true);
  if (rank >= 2) { s.p(4, top - 1, GR, true); s.p(4, top - 2, GH, true); s.p(3, top - 1, '#3ab84a', true); }
  if (rank >= 3) { s.p(5, top - 2, GR, true); s.p(4, top - 3, GR, true); }
  if (rank >= 3) {
    // crâne volant à côté d'elle
    s.r(19, 6, 3, 3, BO); s.p(19, 9, BO); s.p(21, 9, BO); s.p(19, 7, '#2a1e30', true); s.p(21, 7, '#2a1e30', true); s.p(20, 8, '#2a1e30', true);
    s.p(18, 10, GR, true); s.p(22, 10, GR, true);
  }
  const out = s.recolor({ [C.skin]: '#e8d4d8', [C.skinSh]: '#b8a0b0' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 2, BO); out.hl(9, 14, 16, BO); for (const x of [9, 11, 13]) out.p(x, 17, BO);
  out.p(9, 20, GR, true); out.p(14, 19, GR, true); out.p(11, 21, GR, true);
  out.hl(0, 4, 3, BO); out.p(0, 4, BO); out.p(1, 5, BO); out.p(4, 2, GR, true);
  return grand(out, (b) => {
    for (const d of [-1, 1]) for (let i = 0; i < 4; i++) b.under(d < 0 ? 7 - i : 20 + i, 15 + i, BO);
  });
}

// Ignis, pyromancien : étincelle à la petite flamme, pyromancien à l'ourlet de feu, mage de feu à
// deux boules de feu, seigneur des flammes à la robe de lave et à la couronne de feu ; rang 5,
// l'avatar du feu : il devient flamme, cheveux en brasier, bras de feu, robe de lave qui craque,
// deux énormes boules de feu.
function ignis(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.ignis, F1 = '#ff8a2a', F2 = '#fbe08a', F3 = '#e2334a', LV = '#3a2a2a';
  body(s, { tunic: rank >= 4 ? LV : K.main, dark: rank >= 4 ? '#2a1a1a' : K.dark, trim: K.trim, pants: K.pants, boots: '#3a2a2a', bootsHi: '#5a4a4a', sole: '#1a1010', robe: true, cape: rank >= 4 && '#8c1f2e' });
  if (rank >= 2) for (const x of [8, 11, 14]) s.p(x, 20, F3);
  if (rank >= 3) for (const x of [9, 13]) { s.p(x, 21, F1); s.p(x + 1, 20, F1); }
  if (rank >= 4) { s.sline(9, 15, 11, 18, F1); s.sline(14, 14, 13, 17, F1); s.p(10, 16, F2, true); } // fissures de lave
  // cheveux de feu (plus hauts avec le rang)
  s.r(8, 5, 8, 3, F1); s.hl(8, 15, 8, F1); s.v(7, 6, 10, F1); s.v(16, 6, 10, F1);
  const lift = [2, 1, 0, 0, 0][rank - 1];
  for (const [x, y] of [[8, 4], [9, 2], [9, 3], [11, 1], [11, 2], [11, 3], [12, 3], [13, 2], [14, 3], [14, 4], [15, 4], [16, 5]]) s.p(x, y + lift, F1);
  for (const [x, y] of [[9, 3], [11, 2], [13, 3], [10, 5], [14, 6]]) s.p(x, y + lift, F2, true);
  s.p(11, lift, F3);
  if (rank >= 4) { for (const [x, y] of [[7, 4], [6, 3], [16, 3], [17, 2], [10, 0], [13, 0], [12, 1]]) s.p(x, y, F1); s.p(6, 3, F2, true); s.p(17, 2, F2, true); s.p(12, 1, F2, true); }
  // boule de feu dans la main droite (et la gauche au rang 3)
  const ball = (cx, cy, big) => {
    s.r(cx - 1, cy - 1, 3, 3, F1, true);
    if (big) { s.p(cx, cy - 2, F1, true); s.p(cx - 2, cy, F1, true); s.p(cx + 2, cy, F1, true); s.p(cx, cy + 2, F1, true); s.p(cx + 1, cy - 3, F3, true); }
    s.p(cx, cy, '#ffffff', true); s.p(cx - 1, cy - 1, F2, true);
  };
  if (rank === 1) { s.p(19, 15, F1, true); s.p(19, 14, F2, true); s.p(20, 15, F3, true); }
  else ball(19, rank >= 4 ? 11 : 13, rank >= 3);
  if (rank >= 3) ball(4, rank >= 4 ? 11 : 13, rank >= 4);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[6, 14], [7, 15], [16, 14], [17, 15], [6, 16], [17, 16]]) s.p(x, y, (x + y) % 2 ? F1 : F2, true);
  s.sline(9, 16, 10, 20, F1); s.sline(14, 15, 13, 20, F1); s.p(12, 18, F2, true);
  for (const [x, y] of [[8, 0], [10, 0], [12, 0], [14, 0], [16, 1], [6, 2]]) s.p(x, y, F2, true);
  return grand(s, (b) => {
    for (const [x, y] of [[21, 9], [22, 8], [5, 9], [4, 8], [21, 7], [5, 7]]) b.p(x, y, (x + y) % 2 ? F1 : F2, true);
  });
}

// Drakon, chevalier dragon : écuyer au petit casque-dragon et à la lance courte, chevalier aux
// cornes et au fanion, dompteur aux petites ailes, seigneur dragon à la lance enflammée ; rang 5,
// le dragon incarné : ses ailes de dragon et sa queue lui poussent, armure d'écailles, casque-
// dragon aux cornes immenses, lance qui crache le feu.
function drakon(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.drakon, HO = '#efe6cf', CP = '#a82a2a', SC = '#4aa86a', ST = '#b9c6d2', SH = '#e4ecf3';
  if (rank >= 3) for (const d of [-1, 1]) { const x = d < 0 ? 5 : 18; s.sline(x, 14, x + d * 3, 9, K.main); s.sline(x, 15, x + d * 3, 11, K.dark); s.p(x + d * 3, 9, SC); if (rank >= 4) { s.sline(x + d, 15, x + d * 4, 8, K.main); s.p(x + d * 4, 7, SC); } } // ailes
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: K.dark, bootsHi: K.main, sole: '#1a2a1a', cape: rank >= 2 && CP, bracers: ST });
  s.p(10, 15, SC, true); s.p(13, 15, SC, true); s.p(11, 17, SC, true);
  // casque-dragon : museau, dents, œil, cornes qui grandissent
  s.r(8, 3, 8, 5, K.main); s.hl(9, 14, 2, K.main);
  s.hl(16, 19, 4, K.main); s.hl(16, 19, 5, K.dark); s.p(19, 3, K.main); s.p(19, 4, K.dark, true); s.p(17, 6, '#ffffff'); s.p(19, 6, '#ffffff');
  for (const [x, y] of [[7, 3], [7, 5], [8, 1]]) s.p(x, y, SC);
  s.hl(7, 16, 7, K.dark); s.v(7, 8, 11, K.dark); s.v(16, 8, 10, K.dark);
  s.p(14, 4, rank >= 4 ? '#ff5a3a' : C.goldHi, true); s.p(9, 3, SC, true); s.p(10, 2, SC, true);
  if (rank >= 2) { s.sline(10, 2, 7, 0, HO); s.sline(14, 2, 15, 0, HO); }
  if (rank >= 3) s.sline(9, 3, 5, 1, HO);
  if (rank >= 4) { s.p(6, 0, HO); s.p(16, 0, HO); for (const x of [11, 12, 13]) s.p(x, 1, CP); s.p(12, 0, CP); }
  // lance : courte, à fanion, longue, enflammée
  const top = [6, 3, 0, 0, 0][rank - 1];
  s.v(20, top + 3, 22, C.wood); s.v(20, top, top + 2, ST); s.p(19, top + 2, ST); s.p(21, top + 2, ST); s.p(20, top, SH, true);
  if (rank >= 2) { s.hl(21, 23, top + 4, CP); s.hl(21, 22, top + 5, CP); s.p(21, top + 6, CP); }
  if (rank >= 4) { s.p(19, 0, '#ff8a2a', true); s.p(21, 0, '#fbe08a', true); s.p(21, 1, '#ff8a2a', true); }
  s.hl(18, 22, 18, ST);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 4, K.main); for (const [x, y] of [[9, 14], [11, 15], [13, 14], [10, 16], [14, 16]]) s.p(x, y, SC, true);
  s.p(19, 0, '#ff8a2a', true); s.p(20, 0, '#fbe08a', true); s.p(21, 0, '#ff8a2a', true); s.p(22, 1, '#ff8a2a', true);
  return grand(s, (b) => {
    for (const d of [-1, 1]) for (let i = 0; i < 7; i++) { const x = 14 + d * (5 + i), y0 = 8 + Math.round(i * 0.4); for (let y = y0; y <= y0 + 8 - i; y++) b.under(x, y, y === y0 ? SC : (y - y0) % 3 === 2 ? K.dark : K.main); }
    for (let i = 0; i < 6; i++) { b.under(9 - i, 24 + (i >> 1), K.main); b.under(9 - i, 25 + (i >> 1), K.dark); } b.under(3, 26, SC);
  });
}

// ---------------------------------------------------------------- vague 3

// Tess, fermière : fille de ferme au râteau de bois, fermière à la fourche, éleveuse au poussin,
// maîtresse du domaine au tournesol et à la faux ; rang 5, la déesse des moissons : couronne d'épis
// et de tournesols, robe dorée comme le blé, faux d'or.
function tess(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.tess, H = '#8a5a34', HH = '#b07a48', ST = '#e8c860', STD = '#c8a040', MT = '#b9c6d2', SF = '#f0c030', SFD = '#6a4226';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#6a4226', bootsHi: '#8a5a32', sole: '#2a1a12', mouth: false, bracers: rank >= 3 && '#c8a870' });
  s.r(6, 14, 2, 3, W); s.r(16, 14, 2, 3, W); s.p(8, 14, W); s.p(15, 14, W);
  s.p(9, 15, MT); s.p(14, 15, MT);
  if (rank >= 2) { s.r(12, 17, 3, 2, K.dark); s.p(13, 17, '#c8323c', true); } // poche, mouchoir
  s.p(12, 12, ST, true); s.p(13, 12, ST, true); s.p(14, 13, STD, true);
  // cheveux et nattes (plus longues avec le rang)
  const nb = rank >= 3 ? 16 : 14;
  s.hl(8, 15, 8, H); s.p(9, 9, H); s.p(14, 9, H); s.v(7, 8, 13, H); s.v(16, 8, 13, H);
  s.v(6, 14, nb, H); s.v(17, 14, nb, H); s.p(7, 10, HH, true); s.p(16, 12, HH, true); s.p(6, nb, '#c8323c'); s.p(17, nb, '#c8323c');
  // chapeau de paille (tournesol piqué au rang 4)
  s.r(9, 4, 6, 3, ST); s.hl(10, 13, 3, ST); s.hl(9, 14, 6, '#c8323c'); s.hl(5, 18, 7, ST); s.p(4, 6, ST); s.p(19, 6, ST);
  for (const x of [6, 10, 15]) s.p(x, 7, STD); s.p(10, 4, '#fff0b0', true);
  if (rank >= 4) { s.r(14, 3, 3, 3, SF); s.p(15, 4, SFD, true); s.p(14, 3, '#fff0a0', true); }
  if (rank >= 3) { s.r(2, 20, 3, 2, '#fbe08a'); s.p(2, 19, '#fbe08a'); s.p(1, 19, '#e8803a'); s.p(2, 19, '#21182a', true); s.p(3, 22, '#e8803a'); } // poussin
  if (rank <= 3) {
    // râteau de bois, puis fourche de fer (plus haute au rang 3)
    const y0 = [6, 4, 1][rank - 1];
    s.v(19, y0 + 4, 21, '#8a5a32'); for (let y = y0 + 6; y < 21; y += 3) s.p(19, y, '#6a4226', true);
    if (rank === 1) { s.hl(17, 21, y0 + 3, '#9a7048'); for (const x of [17, 19, 21]) s.v(x, y0 + 1, y0 + 2, '#9a7048'); }
    else { s.hl(18, 20, y0 + 3, MT); for (const x of [18, 19, 20]) s.v(x, y0, y0 + 2, MT); s.p(19, y0, '#e4ecf3', true); }
  } else {
    // faux : long manche, grande lame courbe
    s.v(19, 2, 21, '#8a5a32'); for (let y = 5; y < 21; y += 3) s.p(19, y, '#6a4226', true);
    s.hl(14, 19, 1, MT); s.hl(15, 18, 2, MT); s.p(13, 2, MT); s.hl(15, 18, 1, '#e4ecf3', true); s.p(18, 9, '#8a5a32'); s.p(17, 9, '#8a5a32');
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 5, '#e8c860'); s.hl(8, 15, 14, '#fff0a0'); s.p(10, 16, '#c8a040'); s.p(13, 17, '#c8a040');
  for (const x of [6, 9, 12, 16, 18]) { s.p(x, 6, '#f0c030'); s.p(x, 5, '#fff0a0', true); }
  s.hl(14, 19, 1, '#e0a93a'); s.hl(15, 18, 2, '#e0a93a'); s.hl(15, 18, 1, '#fbe08a', true);
  return grand(s);
}

// Doc, médecin de peste : apothicaire à la canne, médecin de peste à l'encensoir, alchimiste au
// corbeau sur l'épaule, docteur noir au chapeau à plume et aux sangles ; rang 5, le fléau : manteau
// de plumes de corbeau, masque à bec noir et argent, lanterne de feu vert, un corbeau sur chaque
// épaule.
function doc(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.doc, BK = '#e8e0cc', BKD = '#b8ac90', GL = '#8a6a4a', MT = '#8e99a4', GR = '#7af06a', CW = '#2a2234';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2234', bootsHi: '#4a4250', sole: '#140d11', robe: true, mouth: false, cape: rank >= 4 && '#1a161e' });
  s.p(12, 15, GL); s.p(12, 17, GL);
  if (rank >= 2) s.p(9, 18, GR, true);
  if (rank >= 3) { s.p(14, 18, '#c08aff', true); s.p(10, 18, '#ff8a2a', true); }
  if (rank >= 4) { s.sline(8, 14, 15, 18, GL); s.sline(15, 14, 8, 18, GL); } // sangles de cuir
  // masque à bec, lunettes cerclées (verres verts au rang 4)
  s.r(8, 9, 8, 5, BK); s.hl(9, 14, 13, BKD);
  const bl = rank >= 3 ? 20 : 19;
  s.hl(16, bl, 11, BK); s.hl(16, bl - 1, 12, BKD); s.p(bl + 1, 12, BKD); s.p(16, 10, BK);
  for (const x of [10, 13]) { s.p(x - 1, 10, GL); s.p(x + 1, 10, GL); s.p(x, 9, GL); s.p(x, 12, GL); }
  s.v(10, 10, 11, rank >= 4 ? GR : C.eye, true); s.v(13, 10, 11, rank >= 4 ? GR : C.eye, true); s.p(17, 11, '#ffffff', true);
  // chapeau à large bord (plus haut avec une plume au rang 4)
  const ht = rank >= 4 ? 1 : 3;
  s.r(9, ht, 6, 7 - ht, K.main); s.hl(5, 18, 7, K.main); s.hl(6, 17, 8, K.dark); s.hl(9, 14, 6, GL); s.p(10, ht, '#4a4250', true);
  if (rank >= 4) { s.sline(14, 5, 18, 1, CW); s.sline(15, 5, 18, 2, '#4a3e5a'); }
  s.v(7, 9, 12, K.main); s.v(16, 9, 10, K.main);
  if (rank >= 3) { s.r(16, 12, 3, 2, CW); s.p(18, 11, CW); s.p(19, 12, '#e0a93a'); s.p(17, 12, '#ffffff', true); s.p(15, 13, CW); } // corbeau
  // canne, puis encensoir qui fume
  const top = rank >= 3 ? 6 : 8;
  s.v(4, top, 23, '#4a3a2a');
  if (rank === 1) { s.r(3, top - 1, 3, 2, GL); s.p(3, top - 1, '#a8865f', true); return s; }
  s.hl(2, 4, top, '#4a3a2a'); s.v(2, top + 1, top + 2, MT);
  const big = rank >= 4 ? 4 : 3;
  s.r(1, top + 3, big, big, MT); s.p(1, top + 3, '#b9c6d2', true); s.p(2, top + 4, GR, true);
  s.p(1, top - 1, '#9af098', true); s.p(2, top - 2, '#c8ffb8', true); s.p(0, top - 3, '#9af098', true);
  if (rank >= 4) { s.p(1, top - 4, '#9af098', true); s.p(0, top + 1, '#9af098', true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[8, 16], [10, 18], [13, 17], [15, 19], [9, 20], [14, 21]]) s.p(x, y, '#3a3040');
  s.hl(16, 20, 11, '#8e99a4'); s.p(21, 12, '#8e99a4'); s.hl(16, 19, 12, '#6a7480');
  s.r(4, 12, 3, 2, CW); s.p(3, 11, CW); s.p(3, 12, '#e0a93a'); s.p(5, 12, '#ffffff', true);
  s.r(0, 11, 3, 3, '#2a3a2a'); s.p(1, 12, GR, true); s.p(1, 11, '#c8ffb8', true);
  return grand(s);
}

// Ozzy, rockeur : garage band à la petite crête, rockeur au blouson clouté, star du punk aux
// lunettes noires et à l'ampli, idole aux épaulettes à pointes et à la guitare en feu ; rang 5, le
// dieu du rock : crête en flammes, veste à pointes et chaînes, guitare à double manche qui flambe.
function ozzy(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.ozzy, MO = '#e2338a', MOH = '#ff8ac8', GT = '#d83a3a', MT = '#b9c6d2';
  if (rank >= 3) { s.r(18, 16, 5, 6, '#2a2234'); s.r(19, 17, 3, 3, '#4a4250'); s.p(20, 18, '#1a1320', true); s.hl(18, 22, 21, '#4a3a42'); s.p(22, 16, MT, true); } // ampli
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', cape: rank >= 4 && '#8a2060', bracers: rank >= 2 && MT });
  s.r(10, 15, 4, 3, W); s.p(11, 16, MO, true);
  if (rank >= 2) for (const x of [6, 17]) s.p(x, 14, MT, true);
  if (rank >= 4) for (const x of [5, 18]) { s.p(x, 13, MT); s.p(x + (x < 10 ? -1 : 1), 12, MT); } // épaulettes à pointes
  // côtés rasés, crête (plus haute avec le rang, mèches de couleur au rang 4)
  s.hl(8, 15, 7, '#4a3a42'); s.v(7, 7, 9, '#4a3a42'); s.v(16, 7, 9, '#4a3a42');
  const top = [4, 2, 0, 0, 0][rank - 1];
  s.r(11, top, 2, 7 - top, MO); s.p(10, top + 2, MO); s.p(13, top + 2, MO); s.p(10, 4, MO); s.p(13, 4, MO);
  s.v(11, top, top + 3, MOH, true);
  if (rank >= 4) { s.p(11, 0, '#5ae0ff', true); s.p(12, 1, '#fbe08a', true); s.p(9, 3, MO); s.p(14, 3, MO); }
  s.p(16, 11, MT, true); // anneau
  if (rank >= 3) { s.hl(8, 15, 10, '#1a1320'); s.r(9, 10, 2, 2, '#2a2234'); s.r(13, 10, 2, 2, '#2a2234'); s.p(9, 10, '#6a6a8a', true); s.p(13, 10, '#6a6a8a', true); } // lunettes noires
  // guitare en V (en flammes au rang 4)
  const G = GT;
  for (const [y, a, b] of [[16, 1, 2], [17, 2, 4], [18, 3, 6], [19, 2, 7], [20, 1, 4]]) s.hl(a, b, y, G);
  s.p(5, 19, W, true); s.p(4, 18, '#2a2234');
  const nt = [11, 9, 7, 6, 6][rank - 1];
  s.sline(6, 17, 4, nt + 1, '#3a2a22'); s.sline(7, 17, 5, nt + 1, '#3a2a22'); s.hl(3, 5, nt, MT); s.p(3, nt - 1, '#e4ecf3', true);
  if (rank >= 4) for (const [x, y] of [[0, 15], [1, 14], [0, 18], [3, 15], [0, 21]]) s.p(x, y, (x + y) % 2 ? '#ff8a2a' : '#fbe08a', true);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[10, 0], [11, 0], [12, 0], [13, 1], [10, 1]]) s.p(x, y, (x + y) % 2 ? '#ff8a2a' : '#fbe08a', true);
  s.hl(9, 14, 18, MT); s.p(10, 19, MT); s.p(13, 19, MT);
  s.sline(8, 17, 6, 7, '#3a2a22'); s.hl(5, 7, 6, MT);
  return grand(s);
}

// Yuki, cryomancienne : flocon au petit bâton, cryomancienne au diadème de glace, mage du givre à
// la cape de glace, impératrice glaciale à la haute couronne et aux éclats qui flottent ; rang 5,
// la reine des neiges : robe de glace scintillante, très haute couronne de cristaux, longue traîne
// de givre, sceptre-flocon géant.
function yuki(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.yuki, H = '#e8f4ff', HS = '#b8d0e8', IC = '#8ae8ff', ID = '#4ab8d8';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#e8f4ff', bootsHi: '#ffffff', sole: '#8ab0c8', robe: true, cape: rank >= 3 && (rank >= 4 ? '#c8f0ff' : '#3a8ab0') });
  s.hl(8, 15, 14, W); s.p(9, 14, '#ffffff', true);
  if (rank >= 4) for (const [x, y] of [[9, 17], [14, 19], [10, 20]]) s.p(x, y, '#ffffff', true); // givre sur la robe
  // longs cheveux blancs (jusqu'au sol au rang 4)
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H); s.v(7, 6, rank >= 4 ? 18 : 15, H); s.v(16, 6, rank >= 4 ? 18 : 15, H);
  s.p(8, 8, H); s.p(10, 8, H); s.p(15, 8, H); s.p(9, 5, '#ffffff', true); s.p(7, 12, HS); s.p(16, 10, HS);
  // diadème de glace (dès le rang 2), puis haute couronne
  if (rank >= 2) { s.p(10, 3, IC, true); s.p(12, 2, IC, true); s.p(12, 3, IC, true); s.p(14, 3, IC, true); s.p(12, 1, '#ffffff', true); }
  if (rank >= 4) { for (const [x, t] of [[9, 1], [10, 0], [12, 0], [14, 0], [15, 1]]) s.v(x, t, 3, IC, true); s.p(12, 0, '#ffffff', true); s.p(10, 0, '#ffffff', true); }
  // bâton à flocon (plus haut et plus grand avec le rang)
  const top = [6, 4, 1, 1, 1][rank - 1], cx = 20, cy = top + 2, r = rank >= 3 ? 3 : 2;
  s.v(cx, cy + r + 1, 23, '#b8c2cc');
  s.v(cx, cy - r, cy + r, IC, true); s.hl(cx - r, cx + r, cy, IC, true);
  for (let k = 1; k < r; k++) { s.p(cx - k, cy - k, IC, true); s.p(cx + k, cy + k, IC, true); s.p(cx + k, cy - k, IC, true); s.p(cx - k, cy + k, IC, true); }
  s.p(cx, cy, '#ffffff', true);
  if (rank >= 4) for (const [x, y] of [[3, 6], [2, 12], [4, 17]]) { s.v(x, y, y + 2, IC, true); s.p(x, y, '#ffffff', true); s.p(x + 1, y + 1, ID, true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 15, 8, 6, '#c8f0ff'); for (const [x, y] of [[9, 16], [13, 17], [11, 19], [14, 20]]) s.p(x, y, '#ffffff', true); s.hl(8, 15, 21, ID);
  for (const [x, t] of [[11, 0], [13, 0], [12, 0]]) s.v(x, t, 3, '#ffffff', true);
  return grand(s, (b) => {
    for (let y = 22; y <= 27; y++) for (let x = 2; x <= 8 + (y - 22); x++) b.under(x, y, (x + y) % 4 ? '#c8f0ff' : '#ffffff');
    for (const [x, y] of [[23, 2], [24, 3], [20, 3]]) b.p(x, y, IC, true);
  });
}

// Sylva, archère elfique : novice sylvestre à l'arc blanc, archère à la couronne de feuilles,
// sentinelle au diadème d'argent et au croissant, gardienne de la lune à l'arc-croissant et à la
// flèche de lumière ; rang 5, l'étoile des elfes : armure d'argent ciselée, diadème à étoile,
// longue cape de feuilles d'argent, grand arc-croissant et flèche de lumière.
function sylva(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.sylva, H = '#f0ecd8', HS = '#c8c0a8', LF = '#7ac85a', SV = '#d8e4f0', MN = '#e8f0ff';
  s.r(5, 10, 2, 7, '#8a6a4a'); s.p(5, 9, W); s.p(6, 8, W); s.p(6, 9, LF);
  if (rank >= 2) { s.p(4, 9, W); s.p(4, 8, LF); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#e8e0cc', bootsHi: '#ffffff', sole: '#8a7a6a', cape: rank >= 3 && (rank >= 4 ? '#e8e4f0' : K.dark), bracers: rank >= 2 && SV });
  s.p(12, 16, LF, true); s.p(11, 17, LF, true);
  // longs cheveux platine
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H); s.v(7, 6, 14, H); s.v(16, 6, 14, H);
  s.p(8, 8, H); s.p(11, 8, H); s.p(15, 8, H); s.p(10, 5, '#ffffff', true); s.p(16, 11, HS); s.p(7, 13, HS);
  // oreilles pointues (plus longues au rang 3)
  s.p(6, 9, C.skin); s.p(5, 8, C.skin); s.p(17, 9, C.skin); s.p(18, 8, C.skin);
  if (rank >= 3) { s.p(4, 7, C.skin); s.p(19, 7, C.skin); }
  // couronne de feuilles, puis diadème d'argent au croissant
  if (rank <= 2) { s.hl(8, 15, 5, '#4e8a34'); for (const x of [8, 11, 14]) s.p(x, 4, LF); if (rank === 2) { s.p(10, 4, LF); s.p(13, 4, LF); } }
  else { s.hl(8, 15, 5, SV); s.p(11, 3, MN); s.p(12, 4, MN); s.p(11, 4, '#8ab0e0', true); s.p(10, 3, MN); if (rank >= 4) s.p(12, 3, '#ffffff', true); }
  if (rank <= 3) {
    // grand arc blanc à droite
    const y0 = [8, 6, 3][rank - 1], y1 = 22, mid = (y0 + y1) >> 1;
    s.p(18, y0, '#e8e0cc'); s.p(19, y0 + 1, '#e8e0cc'); s.v(20, y0 + 2, y1 - 2, '#e8e0cc'); s.p(19, y1 - 1, '#e8e0cc'); s.p(18, y1, '#e8e0cc');
    s.v(18, y0 + 1, y1 - 1, C.string, true); s.v(20, mid - 1, mid + 1, '#26786e');
    if (rank >= 2) { s.p(21, y0 + 3, LF); s.p(21, y1 - 4, LF); }
  } else {
    // arc en croissant d'argent, flèche de lumière encochée
    for (let y = 1; y <= 22; y++) { const x = 18 + Math.round(Math.sin(((y - 1) / 21) * Math.PI) * 4); s.p(x, y, SV); if (y > 4 && y < 19) s.p(x - 1, y, MN, true); }
    s.v(18, 2, 21, C.string, true); s.hl(13, 21, 11, MN, true); s.p(12, 11, '#ffffff', true); s.p(13, 10, MN, true); s.p(13, 12, MN, true);
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 4, SV); s.p(11, 15, '#ffffff', true); s.p(12, 16, LF, true); s.hl(8, 15, 14, MN);
  s.p(11, 2, '#ffffff', true); s.p(10, 3, MN, true); s.p(12, 3, MN, true);
  return grand(s, (b) => {
    capeBack(b, '#c8e8d8', MN, LF);
  });
}

// Thorn, druide : graine aux petits bois et au bâton noueux, druide à la couronne de feuilles,
// gardien des bois à l'oiseau sur le bâton, archidruide aux grands bois fleuris et à la robe de
// mousse ; rang 5, l'esprit de la nature : son corps devient écorce, ses bois immenses se couvrent
// de fleurs, le bâton est un jeune arbre.
function thorn(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.thorn, H = '#6b4428', AN = '#c8a878', AND = '#8a6a4a', LF = '#7ac85a', FL = '#ff9ac8', MS = '#4e8a34';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#5a3a22', bootsHi: '#7a5a3a', sole: '#2a1a12', robe: true, cape: rank >= 4 && MS });
  if (rank >= 2) for (const [x, y] of [[6, 14], [8, 14], [10, 14], [13, 14], [15, 14], [17, 14], [7, 15], [16, 15]]) s.p(x, y, LF);
  if (rank >= 4) for (const [x, y] of [[9, 19], [13, 20], [11, 21]]) s.p(x, y, FL, true); // fleurs sur la robe
  // cheveux en bataille, barbiche (longue au rang 4)
  s.r(8, 5, 8, 3, H); s.v(7, 6, 11, H); s.v(16, 6, 11, H); s.p(9, 8, H); s.p(13, 8, H); s.p(10, 5, '#8a5a34', true);
  s.hl(10, 13, 13, H); s.p(11, 14, H); s.p(12, 14, H); if (rank >= 4) { s.p(11, 15, H); s.p(12, 16, H); }
  // bois de cerf qui grandissent avec le rang
  const ant = [
    [[8, 3], [8, 4], [15, 3], [15, 4]],
    [[8, 2], [8, 3], [8, 4], [7, 1], [9, 1], [15, 2], [15, 3], [15, 4], [14, 1], [16, 1]],
    [[8, 2], [8, 3], [8, 4], [7, 1], [9, 1], [6, 0], [9, 0], [15, 2], [15, 3], [15, 4], [14, 1], [16, 1], [17, 0], [14, 0]],
    [[8, 2], [8, 3], [8, 4], [7, 1], [9, 1], [6, 0], [9, 0], [5, 1], [4, 0], [15, 2], [15, 3], [15, 4], [14, 1], [16, 1], [17, 0], [14, 0], [18, 1], [19, 0]],
  ][Math.min(3, rank - 1)];
  for (const [x, y] of ant) s.p(x, y, AN); s.p(8, 4, AND); s.p(15, 4, AND);
  if (rank >= 4) { s.p(4, 0, FL, true); s.p(19, 0, FL, true); s.p(9, 0, LF, true); s.p(14, 0, LF, true); }
  if (rank >= 2) { s.hl(9, 14, 5, LF); s.p(12, 4, FL, true); }
  // bâton noueux, feuilles et fleur ; un oiseau dessus au rang 3
  const top = [8, 6, 3, 2, 2][rank - 1];
  s.v(4, top + 2, 23, '#7a5a3a'); s.p(3, top + 1, '#7a5a3a'); s.p(5, top, '#7a5a3a'); s.p(3, top, '#7a5a3a');
  for (let y = top + 5; y < 23; y += 4) s.p(5, y, '#7a5a3a');
  s.p(2, top, LF); s.p(6, top - 1, LF); s.p(4, top - 1, FL, true); s.p(5, top + 3, LF);
  if (rank >= 3) { s.r(5, top - 3, 2, 2, '#3a64c8'); s.p(7, top - 3, '#e8a030'); s.p(5, top - 3, '#21182a', true); s.p(4, top - 2, '#26408a'); } // oiseau bleu
  if (rank >= 4) for (const [x, y] of [[1, top + 2], [2, top + 5], [6, top + 2]]) s.p(x, y, LF);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 6, '#6a4a2a'); for (const [x, y] of [[9, 15], [12, 17], [14, 15], [10, 19]]) s.p(x, y, '#8a6a4a'); for (const [x, y] of [[11, 16], [13, 19]]) s.p(x, y, LF, true);
  for (const [x, y] of [[5, 1], [7, 0], [16, 0], [18, 1], [10, 0]]) s.p(x, y, FL, true);
  return grand(s, (b) => {
    for (const [x, y] of [[4, 4], [5, 3], [7, 4], [3, 6], [6, 6]]) b.p(x, y, LF, true); b.p(5, 5, FL, true);
  });
}

// Gorm, orc barbare : brute au petit couperet, orc barbare au bandeau de fer, chef de guerre au
// collier d'os, aux peintures et à l'épaulière à pointes, seigneur orc au crâne cornu ; rang 5, le
// fléau des terres : armure à pointes, crâne cornu sur la tête, peintures de guerre rouges,
// couperet géant ensanglanté.
function gorm(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.gorm, H = '#2a2234', TK = '#efe6cf', MT = '#b9c6d2', MD = '#8e99a4', BO = '#e8e0cc', RD = '#a82a2a';
  body(s, { tunic: C.skin, dark: C.skinSh, trim: C.skin, pants: K.pants, boots: K.main, bootsHi: K.trim, sole: '#2a1a12', mouth: false, cape: rank >= 4 && '#5a2a2a', belt: K.main, bracers: rank >= 2 ? MD : K.main });
  s.r(8, 18, 8, 2, K.main); s.p(9, 19, K.dark); s.p(13, 19, K.dark);
  s.sline(8, 14, 15, 18, K.dark); s.p(11, 16, MD); s.p(10, 15, '#e8a878', true);
  if (rank >= 3) { for (const x of [9, 11, 13]) s.p(x, 14, BO); s.p(15, 9, RD, true); s.p(8, 10, RD, true); s.p(15, 10, RD, true); } // collier d'os, peinture
  if (rank >= 3) { s.r(15, 12, 4, 3, MD); s.p(16, 11, MT); s.p(18, 11, MT); s.p(19, 12, MT); s.p(15, 12, MT, true); } // épaulière à pointes
  // défenses (plus longues au rang 3), mâchoire
  s.p(10, 12, TK, true); s.p(13, 12, TK, true); s.p(10, 11, TK, true); s.p(13, 11, TK, true);
  if (rank >= 3) { s.p(10, 10, TK, true); s.p(13, 10, TK, true); }
  s.hl(11, 12, 12, '#6a2a2a');
  // crâne rasé, chignon, sourcils froncés, oreilles pointues
  s.hl(8, 15, 7, '#2e4a22'); s.r(10, 3, 4, 3, H); s.hl(11, 12, 2, H); s.r(11, 6, 2, 1, H); s.p(11, 3, '#4a3e5a', true);
  s.p(9, 9, H); s.p(14, 9, H);
  s.p(16, 9, C.skin); s.p(17, 8, C.skin); s.p(7, 9, C.skin); s.p(6, 8, C.skin);
  if (rank === 2 || rank === 3) { s.hl(8, 15, 6, MD); s.p(9, 6, MT, true); }
  if (rank >= 4) {
    // crâne de bête cornu sur la tête
    s.r(9, 3, 6, 4, BO); s.hl(10, 13, 2, BO); s.p(10, 4, '#2a2234', true); s.p(13, 4, '#2a2234', true); s.p(11, 6, '#c8b890'); s.p(12, 6, '#c8b890');
    s.sline(9, 3, 6, 0, BO); s.sline(14, 3, 17, 0, BO); s.p(7, 2, BO); s.p(16, 2, BO);
  }
  // couperet : petit, grand, géant à dos crénelé
  const y0 = [10, 7, 3, 2, 2][rank - 1], w = rank === 1 ? 2 : 3;
  s.v(18, 15, 20, C.grip);
  s.r(18, y0, w, 15 - y0, MT); s.v(18, y0 + 1, 13, '#e4ecf3', true);
  if (rank >= 2) for (let y = y0 + 1; y < 14; y += 3) s.p(18 + w, y, MT);
  s.p(17 + w, y0 + 2, MD);
  if (rank >= 4) { s.p(19, y0 + 4, RD, true); s.p(20, y0 + 5, RD, true); }
  const out = s.recolor({ [C.skin]: '#7ab84a', [C.skinSh]: '#4e8a34' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 3, MD); for (const x of [8, 11, 14]) out.p(x, 13, MT); out.p(9, 15, RD, true);
  for (const x of [5, 18]) { out.r(x, 12, 2, 3, MD); out.p(x, 11, MT); out.p(x + 1, 11, MT); }
  out.p(18, 2, RD, true); out.p(19, 6, RD, true); out.p(20, 9, RD, true);
  return grand(out, (b) => {
    b.under(23, 3, '#b9c6d2'); b.under(23, 4, '#b9c6d2'); b.under(23, 6, '#b9c6d2');
  });
}

// Zara, danseuse : danseuse de rue à la dague et au foulard, danseuse au bandeau de pièces et au
// cimeterre, étoile du bazar aux deux foulards et aux bracelets, danseuse royale au diadème et aux
// deux cimeterres ; rang 5, la déesse de la danse : parure d'or et de joyaux, voile qui tombe du
// diadème, longs rubans de soie aux bras, deux cimeterres d'or.
function zara(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.zara, H = '#2a2234', HH = '#4a3e5a', VL = '#f0a8c8', SC = '#4fd8c8', GD = '#e0a93a', MT = '#b9c6d2';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: K.trim, bootsHi: '#fff0a0', sole: '#8a5a20', mouth: false, cape: rank >= 4 && VL, belt: K.trim, buckle: '#ffffff', bracers: rank >= 3 && GD });
  s.r(9, 17, 6, 1, C.skin);
  if (rank >= 2) for (const x of [9, 11, 13, 15]) s.p(x, 19, GD, true);
  s.r(8, 12, 8, 2, VL); s.p(10, 12, '#ffd0e4', true);
  // cheveux, queue de cheval (plus longue avec le rang)
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H); s.v(7, 6, 10, H); s.v(16, 6, 10, H); s.p(8, 8, H); s.p(15, 8, H);
  const tail = [[6, 6], [5, 7], [4, 8], [4, 9], [3, 10], [3, 11], [2, 12], [2, 13]].slice(0, 4 + rank);
  for (const [x, y] of tail) s.p(x, y, H); s.p(10, 5, HH, true); s.p(5, 7, HH, true);
  // bandeau (de pièces dès le rang 2), diadème et long voile au rang 4
  s.hl(8, 15, 7, K.trim);
  if (rank >= 2) for (const x of [9, 12, 15]) s.p(x, 8, GD, true);
  if (rank >= 4) { s.r(11, 5, 2, 2, '#e2334a', true); s.p(11, 4, GD); s.p(12, 4, GD); s.v(16, 4, 9, VL); s.v(17, 6, 12, VL); s.p(17, 13, '#ffd0e4'); }
  // foulard(s) qui ondulent
  for (const [x, y] of [[5, 15], [4, 16], [3, 17], [3, 18], [2, 19], [3, 20]]) s.p(x, y, SC); s.p(4, 16, '#a8fff0', true);
  if (rank >= 3) for (const [x, y] of [[19, 13], [20, 12], [21, 12], [22, 11], [22, 10]]) s.p(x, y, VL);
  // dague, cimeterre, deux cimeterres
  if (rank === 1) { s.v(18, 13, 17, MT); s.p(18, 13, '#e4ecf3', true); s.hl(17, 19, 18, GD); s.v(18, 19, 20, C.grip); }
  else {
    const top = rank >= 3 ? 6 : 8;
    s.v(18, top + 2, 17, MT); s.p(19, top + 1, MT); s.p(19, top, MT); s.p(20, top - 1, MT); s.v(18, top + 3, top + 6, '#e4ecf3', true);
    s.hl(17, 19, 18, GD); s.v(18, 19, 20, C.grip);
    if (rank >= 4) { s.v(5, 9, 14, MT); s.p(4, 8, MT); s.p(4, 7, MT); s.p(3, 6, MT); s.hl(4, 6, 15, GD); }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(9, 15, 6, 2, '#e0a93a'); s.p(11, 15, '#e2334a', true); s.p(12, 16, '#4fd8c8', true);
  s.hl(8, 15, 6, GD); s.p(10, 5, GD); s.p(13, 5, GD);
  return grand(s, (b) => {
    for (let i = 0; i < 18; i++) { b.under(7 - Math.round(i * 0.35), 18 + Math.round(Math.sin(i * 0.6) * 2) + (i >> 2), i % 2 ? SC : '#a8fff0'); b.under(20 + Math.round(i * 0.35), 17 + Math.round(Math.sin(i * 0.6 + 1) * 2) + (i >> 2), i % 2 ? VL : '#ffd0e4'); }
  });
}

// Kitsune, renarde : ses queues se multiplient avec le rang (1, 3, 5, 7, puis 9). Renardeau,
// kitsune aux feux follets, renarde mystique, renarde céleste au masque de renard sur le côté ;
// rang 5, Kyūbi : ses neuf queues en grand éventail, kimono blanc et rouge brodé d'or, masque de
// renard sur la tête, feux follets autour d'elle.
function kitsune(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.kitsune, H = '#e8702a', HH = '#ffa860', TW = '#fff4e8', FF = '#5ac8ff';
  // queues en éventail derrière, bouts blancs
  const tails = [[1, 12], [0, 15], [1, 18], [3, 20], [2, 10], [3, 8], [4, 22]].slice(0, [1, 3, 5, 7, 7][rank - 1]);
  for (const [x, y] of tails) { s.sline(x + 1, y + 1, 8, 18, H); s.sline(x + 2, y + 1, 8, 19, H); s.p(x, y, TW); s.p(x + 1, y, TW); s.p(x, y + 1, TW); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', robe: true, cape: rank >= 4 && K.trim, belt: K.trim, buckle: '#e0a93a' });
  s.p(10, 15, K.trim); s.p(13, 15, K.trim); s.p(11, 16, K.trim);
  s.r(8, 5, 8, 3, H); s.v(7, 6, 13, H); s.v(16, 6, 13, H); s.p(8, 8, H); s.p(10, 8, H); s.p(13, 8, H); s.p(15, 8, H);
  s.p(9, 5, HH, true); s.p(16, 9, HH, true);
  // oreilles de renard (plus grandes au rang 3)
  const et = rank >= 3 ? 1 : 2;
  for (const x0 of [8, 14]) { s.v(x0, et, 4, H); s.v(x0 + 1, et + 1, 4, H); s.p(x0 + (x0 === 8 ? 1 : 0), 4, TW, true); }
  s.p(8, et, '#2a2234'); s.p(15, et + 1, '#2a2234');
  if (rank >= 2) { s.p(10, 11, '#e2334a', true); s.p(13, 11, '#e2334a', true); } // fard rouge
  if (rank >= 4) { s.r(16, 3, 3, 3, TW); s.p(16, 2, TW); s.p(18, 2, TW); s.p(17, 4, '#e2334a', true); s.p(16, 5, '#e2334a', true); } // masque de renard
  // feux follets bleus (plus nombreux avec le rang)
  for (const [x, y] of [[19, 11], [20, 15], [19, 7], [21, 18], [22, 9]].slice(0, rank)) { s.p(x, y, FF, true); s.p(x, y - 1, '#c8f0ff', true); s.p(x + 1, y, '#2f78d0', true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.hl(8, 15, 18, '#e0a93a'); s.p(10, 20, '#e0a93a', true); s.p(13, 19, '#e0a93a', true);
  return grand(s, (b) => {
    for (const [x, y] of [[0, 6], [1, 2], [24, 4], [26, 9], [25, 16]]) { b.sline(x + (x < 10 ? 1 : -1), y + 1, x < 10 ? 10 : 18, 22, H); b.sline(x + (x < 10 ? 2 : -2), y + 1, x < 10 ? 10 : 18, 23, H); b.p(x, y, TW); b.p(x + 1, y, TW); b.p(x, y + 1, TW); }
  });
}

// Sybil, voyante : diseuse à la petite boule de cristal, voyante aux anneaux d'or, oracle aux
// cartes de tarot qui flottent, prophétesse au troisième œil et au voile étoilé ; rang 5, l'œil du
// destin : le troisième œil s'ouvre et luit, voile d'étoiles jusqu'au sol, cartes de tarot en
// éventail, grande boule de cristal.
function sybil(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.sybil, H = '#2a2234', TB = '#8a4ac8', TBD = '#6a2a9a', CR = '#c8a8ff', GD = '#e0a93a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#3a2470', bootsHi: '#5a3aa8', sole: '#1a1040', robe: true, cape: rank >= 4 && '#2a1a5a', bracers: rank >= 2 && GD });
  s.p(9, 16, K.trim, true); s.p(14, 18, K.trim, true); s.p(12, 20, K.trim, true);
  s.v(7, 8, 15, H); s.v(16, 8, 15, H); s.hl(8, 15, 8, H); s.p(9, 9, H); s.p(14, 9, H); s.p(7, 11, '#4a3e5a', true);
  if (rank >= 2) { s.p(7, 12, GD, true); s.p(16, 12, GD, true); }
  // turban drapé, joyau, plume ; troisième œil au rang 4
  s.r(8, 3, 8, 5, TB); s.hl(9, 14, 2, TB); s.hl(7, 16, 7, TBD); s.sline(8, 6, 13, 3, TBD); s.p(9, 3, '#b07ae8', true);
  s.r(11, 4, 2, 2, CR, true); s.p(11, 4, '#ffffff', true);
  if (rank >= 3) { s.v(12, 0, 1, GD); s.p(13, 0, W); s.p(11, 1, W); }
  if (rank >= 4) { s.hl(10, 13, 8, '#f2eef4'); s.p(11, 8, '#8a4ac8', true); s.p(12, 8, '#21182a', true); for (const x of [8, 15]) s.v(x, 8, 13, '#4a2a8a'); } // troisième œil, voile
  // boule de cristal (plus grosse avec le rang)
  const cy = rank >= 3 ? 12 : 14, big = rank >= 2;
  if (big) { s.hl(19, 21, cy - 2, CR); s.r(18, cy - 1, 5, 3, CR); s.hl(19, 21, cy + 2, CR); s.p(19, cy - 1, '#ffffff', true); s.p(21, cy + 1, '#8a6ad8', true); s.p(20, cy, '#e8d8ff', true); s.hl(19, 21, cy + 3, GD); }
  else { s.r(19, cy, 3, 3, CR); s.p(19, cy, '#ffffff', true); s.hl(19, 21, cy + 3, '#8a6a4a'); }
  if (rank >= 3) for (const [x, y] of [[2, 8], [3, 14], [21, 4]].slice(0, rank - 1)) { s.r(x, y, 2, 3, '#f2eef4'); s.p(x, y + 1, K.trim, true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(11, 4, 2, 2, '#e8d8ff', true); s.p(11, 4, '#8a4ac8', true); s.p(12, 5, '#21182a', true);
  for (const x of [7, 16]) s.v(x, 14, 22, '#4a2a8a'); for (const [x, y] of [[7, 16], [16, 19], [7, 21]]) s.p(x, y, GD, true);
  return grand(s, (b) => {
    for (let i = 0; i < 4; i++) { const x = 1 + i * 2, y = 14 - i; b.r(x, y, 2, 3, '#f2eef4'); b.p(x, y + 1, K.trim, true); }
  });
}

// ---------------------------------------------------------------- vague 4 (sans limite)

// Grumli, nain : apprenti forgeron au bonnet de cuir et au petit marteau, nain au casque et au
// marteau-enclume, gardien de la forge aux tresses à anneaux et aux runes, thane au heaume-couronne
// et à la barbe jusqu'aux genoux ; rang 5, le roi sous la montagne : heaume-couronne d'or, armure à
// runes de feu, barbe jusqu'au sol aux anneaux d'or, marteau-enclume qui rougeoie.
function grumli(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.grumli, B = '#5a3a24', BH = '#7a5236', ST = '#b9c6d2', SH = '#e4ecf3', SD = '#8e99a4', RU = '#ff8a2a', GD = '#e0a93a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: rank >= 2 ? SD : '#6a4a32', bootsHi: rank >= 2 ? SH : '#8a6a4a', sole: '#2a1a12', mouth: false, cape: rank >= 4 && '#2a3a6a', bracers: rank >= 2 ? ST : '#6a4a32' });
  // barbe : jusqu'au torse, à la ceinture, tressée, jusqu'aux genoux
  const len = [15, 18, 20, 22, 22][rank - 1];
  s.r(8, 12, 8, 3, B); if (len > 15) { s.r(9, 15, 6, 3, B); s.hl(10, 13, 18, B); }
  if (len >= 20) { s.v(10, 18, len, B); s.v(13, 18, len, B); s.p(10, len - 1, GD, true); s.p(13, len - 1, GD, true); }
  s.p(9, 13, BH, true); s.p(12, 15, BH, true); s.p(14, 13, BH, true); s.hl(10, 13, 12, '#3a2414');
  s.v(7, 9, 12, B); s.v(16, 9, 12, B); s.hl(9, 10, 9, B); s.hl(13, 14, 9, B);
  if (rank === 1) {
    s.r(8, 4, 8, 3, '#6a4a32'); s.hl(9, 14, 3, '#6a4a32'); s.hl(7, 16, 7, '#4a3220'); s.p(9, 4, '#8a6a4a', true);
  } else {
    s.r(8, 3, 8, 5, ST); s.hl(9, 14, 2, ST); s.hl(7, 16, 7, SD); s.v(7, 8, 10, ST); s.v(16, 8, 10, ST);
    s.p(9, 3, SH, true); s.p(10, 2, SH, true); for (const x of [9, 12, 14]) s.p(x, 6, SD);
    if (rank === 3) { s.v(12, 0, 1, K.trim); s.p(11, 1, K.trim); s.p(13, 1, K.trim); }
    if (rank >= 4) { for (const x of [8, 10, 13, 15]) { s.v(x, 1, 2, GD); } s.p(10, 0, GD); s.p(13, 0, GD); s.r(11, 4, 2, 2, RU, true); s.hl(8, 15, 8, SD); }
  }
  // marteau : petit, à tête d'enclume, runique, enclume rougeoyante
  const y0 = [10, 8, 5, 4, 4][rank - 1];
  s.v(4, y0 + 3, 21, '#7a5a3a'); for (let y = y0 + 5; y < 21; y += 3) s.p(4, y, '#5a3f2e', true);
  if (rank === 1) { s.r(3, y0, 3, 3, SD); s.p(3, y0, ST, true); }
  else {
    s.hl(1, 7, y0, ST); s.hl(2, 6, y0 + 1, ST); s.hl(3, 5, y0 + 2, ST); s.p(0, y0, ST); s.hl(1, 5, y0, SH, true);
    if (rank >= 3) { s.p(3, y0 + 1, RU, true); s.p(5, y0 + 1, RU, true); }
    if (rank >= 4) { s.hl(2, 6, y0 + 1, RU, true); s.p(4, y0 + 1, '#fbe08a', true); s.hl(0, 8, y0 - 1, ST); }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(9, 15, 6, 3, '#8e99a4'); s.p(10, 16, RU, true); s.p(14, 15, RU, true);
  for (const x of [8, 10, 13, 15]) s.v(x, 0, 2, GD); s.p(10, 0, '#fbe08a', true); s.r(11, 1, 2, 1, RU, true);
  s.v(10, 21, 23, B); s.v(13, 21, 23, B); s.p(10, 22, GD, true); s.p(13, 22, GD, true);
  return grand(s);
}

// Spike, homme cactus : bouture au petit sombrero, cactus au poncho, mariachi épineux aux deux
// maracas et au sombrero à pompons, cactus en fleur couvert de fleurs roses ; rang 5, le roi du
// désert : couronne de grandes fleurs roses sur le sombrero, bras couverts de fleurs, maracas d'or.
function spike(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.spike, SP = '#f0e8c8', SB = '#e8c860', SBD = '#b8902a', FL = '#ff6ab8', FLH = '#ffb8e0';
  // bras de cactus qui monte à gauche (plus haut avec le rang)
  const at = [12, 10, 9, 8, 8][rank - 1];
  s.r(3, at, 2, 17 - at, '#5aa04a'); s.hl(3, 6, 16, '#5aa04a'); s.p(3, at - 1, '#5aa04a'); s.p(2, at + 1, SP); s.p(2, 14, SP); s.p(5, 12, SP);
  if (rank >= 4) { s.p(3, at - 2, FL, true); s.p(4, at - 1, FLH, true); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#8a5a32', bootsHi: '#a8784a', sole: '#3a2a1a', cape: rank >= 4 && K.dark });
  if (rank >= 2) { s.hl(8, 15, 16, K.trim); s.hl(6, 7, 15, K.trim); s.hl(16, 17, 15, K.trim); }
  if (rank >= 3) { s.hl(8, 15, 18, '#3ab86a'); for (const x of [9, 12, 15]) s.p(x, 19, K.trim); } // franges du poncho
  for (const [x, y] of [[7, 9], [7, 12], [16, 10], [16, 13], [9, 8], [14, 8]]) s.p(x, y, SP, true);
  // sombrero : petit, large, à pompons
  const bw = rank === 1 ? 6 : 4;
  s.r(10, 3, 4, 3, SB); s.hl(11, 12, 2, SB); s.hl(9, 14, 5, '#d8503a');
  s.hl(bw, 23 - bw, 6, SB); s.hl(bw + 1, 22 - bw, 7, SBD); s.p(bw - 1, 5, SB); s.p(24 - bw, 5, SB); s.p(10, 3, '#fff0a0', true);
  if (rank >= 3) for (const x of [5, 9, 14, 18]) s.p(x, 8, '#d8503a');
  s.p(13, 2, FL, true); s.p(14, 3, FL, true);
  if (rank >= 4) for (const [x, y] of [[8, 12], [16, 12], [12, 1], [10, 14]]) { s.p(x, y, FL, true); }
  // maraca(s)
  const y0 = [12, 11, 9, 8, 8][rank - 1], M = rank >= 4 ? FL : '#e8603a';
  s.v(18, y0 + 3, 19, '#8a5a32'); s.r(17, y0, 3, 3, M); s.p(18, y0 - 1, M); s.p(17, y0, rank >= 4 ? FLH : '#ffb070', true); s.p(19, y0 + 1, '#3ab86a', true);
  if (rank >= 3) { s.v(1, 19, 21, '#8a5a32'); s.r(0, 16, 3, 3, M); s.p(0, 16, rank >= 4 ? FLH : '#ffb070', true); }
  const out = s.recolor({ [C.skin]: '#6ab85a', [C.skinSh]: '#3a7a32' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[9, 1], [12, 0], [15, 1], [6, 4], [18, 4]]) { out.p(x, y, FL, true); out.p(x + 1, y, FLH, true); out.p(x, y + 1, FL, true); }
  for (const [x, y] of [[6, 15], [17, 16], [3, 11], [4, 14]]) out.p(x, y, FL, true);
  out.r(17, 8, 3, 3, '#e0a93a'); out.p(17, 8, '#fbe08a', true); out.r(0, 16, 3, 3, '#e0a93a'); out.p(0, 16, '#fbe08a', true);
  return grand(out);
}

// Bip, robot : prototype au petit bras-blaster, Bip à l'écran sur la poitrine, Bip 2.0 aux
// réacteurs dans les pieds et au canon d'épaule, Méga Bip à la visière et au cœur lumineux ; rang
// 5, Bip Ultime : armure de méca, réacteurs-ailes dans le dos, double canon, visière et cœur qui
// brillent.
function bip(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.bip, MT = '#a8b0bc', MD = '#7a8290', N = '#4ff0e8', OR = K.main;
  if (rank >= 3) { s.r(4, 11, 3, 3, MD); s.hl(1, 4, 12, MT); s.p(1, 12, N, true); } // canon d'épaule
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: MD, bootsHi: MT, sole: '#4a4a5a', mouth: false, belt: '#4a4a5a', buckle: N });
  if (rank >= 2) { s.r(10, 15, 4, 2, '#2a3440'); s.p(10, 15, N, true); s.p(12, 16, '#9af098', true); }
  if (rank >= 4) { s.r(11, 15, 2, 2, '#ffffff', true); s.p(10, 15, N, true); s.p(13, 16, N, true); } // cœur lumineux
  if (rank >= 3) for (const x of [9, 14]) { s.p(x, 23, '#ff8a2a', true); } // réacteurs
  // tête-boîte
  s.hl(8, 15, 7, MT); s.v(7, 8, 13, MD); s.v(16, 8, 13, MD); s.p(7, 10, '#e0a93a', true); s.p(16, 10, '#e0a93a', true);
  s.hl(10, 13, 12, '#4a4a5a'); s.p(11, 12, MT); s.p(13, 12, MT);
  if (rank >= 4) { s.hl(8, 15, 10, '#2a3440'); s.hl(9, 14, 11, '#2a3440'); s.hl(10, 13, 10, N, true); } // visière
  else { s.v(10, 10, 11, N, true); s.v(13, 10, 11, N, true); }
  s.p(9, 12, '#ff8a9a', true); s.p(14, 12, '#ff8a9a', true);
  // antenne (double au rang 3)
  s.v(12, 3, 6, MD); s.r(11, 1, 2, 2, '#e2334a', true); s.p(11, 1, '#ffffff', true); s.hl(9, 14, 6, MD);
  if (rank >= 3) { s.v(9, 3, 5, MD); s.p(9, 2, N, true); }
  if (rank >= 4) { s.p(8, 5, OR); s.p(15, 5, OR); s.p(8, 4, OR); s.p(15, 4, OR); }
  // bras-blaster (plus long, puis double canon)
  const L = [3, 4, 5, 6, 6][rank - 1];
  s.r(16, 15, 2, 3, MD); s.hl(17, 17 + L, 16, MT); s.hl(17, 17 + L, 17, MD); s.p(18 + L, 16, N, true); s.p(18, 16, '#ffffff', true);
  if (rank >= 4) { s.hl(17, 16 + L, 15, MT); s.p(17 + L, 15, N, true); }
  const out = s.recolor({ [C.skin]: MT, [C.skinSh]: MD });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 4, '#7a8290'); out.r(11, 15, 2, 2, '#ffffff', true); out.p(10, 15, N, true); out.p(13, 16, N, true);
  out.hl(17, 23, 14, '#a8b0bc'); out.p(23, 14, N, true);
  return grand(out, (b) => {
    for (const d of [-1, 1]) { const x = d < 0 ? 6 : 21; b.sline(x, 16, x + 4 * d, 11, '#a8b0bc'); b.sline(x, 17, x + 4 * d, 13, '#7a8290'); b.p(x + 4 * d, 11, N, true); b.p(x + 2 * d, 19, '#ff8a2a', true); }
  });
}

// Lulu, boulangère : mitronne à la petite baguette, boulangère à la miche, pâtissière au rouleau et
// au croissant, maîtresse boulangère à la toque rose et au gâteau ; rang 5, la fée des gâteaux :
// petites ailes de sucre, toque-gâteau à la cerise, robe à volants roses, fouet magique qui
// saupoudre du sucre.
function lulu(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.lulu, H = '#e8c070', R = '#d83a3a', BG = '#d8a050', BGD = '#a8702a', PK = '#ffb8d0', WD = '#c8945a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#8a5a32', bootsHi: '#a8784a', sole: '#3a2a1a', robe: true, cape: rank >= 4 && PK });
  s.r(9, 15, 6, 5, W); s.hl(9, 14, 20, W); s.p(13, 17, '#e8e0d8'); s.p(10, 16, '#ffffff', true);
  if (rank >= 3) { s.p(11, 18, R); s.p(12, 18, R); s.p(11, 17, R); s.p(12, 17, '#ff7a7a', true); } // cœur brodé
  s.v(7, 8, 12, H); s.v(16, 8, 12, H); s.p(8, 8, H); s.p(15, 8, H); s.p(7, 13, H); s.p(16, 13, H);
  if (rank >= 4) {
    // toque rose à la cerise
    s.r(8, 1, 8, 6, PK); s.hl(9, 14, 0, PK); s.p(7, 2, PK); s.p(16, 2, PK); s.hl(8, 15, 7, '#e88ab0'); s.v(11, 1, 5, '#e88ab0');
    s.r(12, -1 + 1, 2, 1, R); s.p(13, 0, '#3a8a4a');
  } else {
    // foulard rouge noué
    s.r(8, 4, 8, 4, R); s.hl(9, 14, 3, R); s.p(10, 4, '#ff7a7a', true); s.p(11, 3, '#ff7a7a', true);
    s.p(7, 5, R); s.p(6, 4, R); s.p(6, 6, '#a02a2a'); s.hl(8, 15, 7, '#a02a2a');
  }
  // à gauche : baguette (puis rouleau à pâtisserie)
  if (rank <= 2) {
    const top = rank === 1 ? 9 : 5;
    s.r(3, top, 2, 22 - top, BG); s.p(3, top - 1, BG); s.p(4, 22, BG); for (let y = top + 2; y < 21; y += 4) { s.p(4, y, BGD); s.p(3, y + 1, BGD); } s.p(3, top, '#f0c878', true);
  } else {
    s.r(2, 8, 4, 10, WD); s.v(3, 6, 7, '#8a5a32'); s.v(3, 18, 20, '#8a5a32'); s.p(2, 8, '#e8b878', true); s.v(5, 9, 17, '#a8784a');
  }
  // à droite : rien, miche, croissant, gâteau
  if (rank === 2) { s.hl(18, 20, 14, BG); s.r(17, 15, 5, 3, BG); s.hl(18, 20, 18, BGD); s.p(18, 15, '#f0c878', true); s.hl(18, 20, 16, '#f0d8a0'); }
  if (rank === 3) { s.hl(17, 21, 15, BG); s.hl(18, 20, 14, BG); s.p(16, 16, BG); s.p(22, 16, BG); s.p(19, 15, BGD); s.p(18, 14, '#f0c878', true); }
  if (rank >= 4) { s.r(17, 13, 5, 4, '#f8e0c0'); s.hl(17, 21, 13, '#ffffff'); s.hl(17, 21, 15, PK); s.p(19, 12, R); s.hl(16, 22, 17, '#b9c6d2'); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 18, 8, 3, PK); s.hl(8, 15, 20, '#ffffff'); s.p(9, 21, PK); s.p(12, 21, PK); s.p(15, 21, PK);
  for (const [x, y] of [[2, 5], [4, 4], [3, 7], [5, 6]]) s.p(x, y, '#ffffff', true);
  return grand(s, (b) => {
    for (const d of [-1, 1]) { const x = d < 0 ? 8 : 19; for (const [dx, dy] of [[0, 0], [1, -1], [2, -1], [2, 0], [1, 1], [0, 1], [2, 2]]) b.under(x + d * dx, 15 + dy, dy === -1 ? '#ffffff' : '#ffe0f0'); }
  });
}

// DJ Max : ambianceur au casque, DJ à la casquette et à la chaîne, DJ résident aux lunettes LED et
// au gros vinyle, star des platines aux écouteurs lumineux et aux deux vinyles ; rang 5, la légende
// de la nuit : blouson néon, énormes écouteurs lumineux, lunettes LED, deux vinyles lumineux,
// chaîne en or massive.
function djmax(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.djmax, CP = '#e2338a', HP = '#2a2234', NE = '#ff4ab8', CY = '#4ff0e8', GD = '#e0a93a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#f2eef4', bootsHi: '#ffffff', sole: '#e2338a', cape: rank >= 4 && '#8a2060' });
  s.p(10, 15, W); s.p(13, 15, W);
  if (rank >= 2) { s.hl(10, 13, 17, GD); s.p(11, 18, GD); s.p(12, 18, '#fbe08a', true); }
  if (rank >= 4) { s.v(8, 14, 18, NE, true); s.v(15, 14, 18, CY, true); } // bandes néon du blouson
  // cheveux ; casquette à l'envers dès le rang 2
  s.hl(9, 14, 8, '#3a2a22'); s.p(15, 8, '#3a2a22');
  if (rank >= 2) { s.r(8, 4, 8, 4, CP); s.hl(9, 14, 3, CP); s.hl(5, 7, 7, '#a82060'); s.p(10, 4, '#ff8ac8', true); }
  else { s.r(8, 4, 8, 4, '#3a2a22'); s.hl(9, 14, 3, '#3a2a22'); s.p(10, 4, '#5a4a3a', true); }
  if (rank >= 3) { s.hl(8, 15, 10, HP); s.p(9, 10, CY, true); s.p(10, 10, NE, true); s.p(13, 10, CY, true); s.p(14, 10, NE, true); } // lunettes LED
  // casque audio (écouteurs lumineux au rang 4)
  s.hl(8, 15, 3, HP); s.v(7, 4, 7, HP); s.v(16, 4, 7, HP);
  const ew = rank >= 4 ? 3 : 2;
  s.r(8 - ew, 8, ew, 4, HP); s.r(16, 8, ew, 4, HP); s.p(17, 9, NE, true);
  if (rank >= 4) { s.p(5, 9, CY, true); s.p(18, 10, CY, true); }
  // vinyle(s) (plus grands avec le rang)
  const disc = (cx, cy, R) => {
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) if (x * x + y * y <= R * R + 1) s.p(cx + x, cy + y, '#1a1a22');
    s.p(cx, cy, NE, true); s.p(cx - 1, cy - R + 1, '#5a5a6a', true);
  };
  disc(19, rank >= 3 ? 14 : 16, [1, 2, 3, 3, 3][rank - 1]);
  if (rank >= 4) disc(3, 14, 2);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 3, '#2a2a3a'); s.v(8, 14, 18, NE, true); s.v(15, 14, 18, CY, true); s.hl(10, 13, 17, GD); s.hl(10, 13, 18, GD); s.p(11, 18, '#fbe08a', true);
  s.p(19, 14, CY, true); s.p(3, 14, NE, true);
  return grand(s);
}

// Pablo, facteur : coursier à la lettre, facteur à la sacoche, postier en chef au tampon et aux
// colis dans le dos, messager royal à la casquette ailée et au sceau d'or ; rang 5, le messager des
// vents : casquette et sandales ailées, cape de messager, sacoche dorée, lettre d'or scellée.
function pablo(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.pablo, H = '#3a2a22', SB = '#8a5a32', SBD = '#6a4226', GD = '#e0a93a', RD = '#d83a3a', PK = '#c8945a';
  if (rank >= 3) { s.r(2, 8, 5, 4, PK); s.r(3, 5, 4, 3, '#e8b878'); s.v(4, 8, 11, '#8a5a32'); s.hl(3, 6, 6, '#8a5a32'); } // colis dans le dos
  if (rank >= 2) { s.r(3, 16, 4, 4, SB); s.hl(3, 6, 16, SBD); s.p(4, 15, W); s.p(5, 15, W); s.p(4, 17, GD, true); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2a3a', bootsHi: '#4a4a5a', sole: '#141418', mouth: false, cape: rank >= 4 && K.dark });
  if (rank >= 2) s.sline(15, 14, 8, 18, SBD);
  if (rank >= 3) { s.r(14, 18, 2, 2, RD); s.p(14, 18, '#ff8a8a', true); } // tampon
  s.hl(10, 13, 12, H); if (rank >= 3) { s.p(9, 13, H); s.p(14, 13, H); }
  s.v(7, 8, 10, H); s.v(16, 8, 10, H);
  // casquette (ailée au rang 4)
  s.r(8, 4, 8, 3, K.main); s.hl(9, 14, 3, K.main); s.hl(8, 15, 7, K.trim); s.hl(13, 18, 8, K.dark); s.p(9, 4, '#5a8ae0', true);
  s.r(11, 5, 2, 2, rank >= 4 ? GD : '#b9c6d2'); s.p(11, 5, '#ffffff', true);
  if (rank >= 4) for (const d of [-1, 1]) { const x = d < 0 ? 7 : 16; s.p(x, 4, W); s.p(x + d, 3, W); s.p(x + 2 * d, 2, W); s.p(x + d, 4, W); s.p(x + 2 * d, 3, '#c8c0d0'); }
  // bras levé, lettre (dorée au rang 4)
  for (let y = 14; y <= 19; y++) { s.p(16, y, null); s.p(17, y, null); }
  s.r(16, 14, 2, 2, K.main); s.v(17, 10, 14, K.main); s.v(18, 10, 13, K.main); s.hl(17, 18, 10, K.trim);
  const L = rank >= 4 ? '#fbe08a' : W;
  s.r(16, 6, 6, 4, L); s.sline(16, 6, 18, 8, rank >= 4 ? GD : '#c8c0d0'); s.sline(21, 6, 19, 8, rank >= 4 ? GD : '#c8c0d0');
  s.p(19, 8, RD, true); if (rank >= 3) s.p(21, 7, '#3ab86a', true);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(3, 16, 4, 4, '#e0a93a'); s.hl(3, 6, 16, '#b07a20'); s.p(4, 17, RD, true);
  for (const d of [-1, 1]) { const x = d < 0 ? 8 : 15; s.p(x + d, 22, W); s.p(x + 2 * d, 21, W); }
  return grand(s, (b) => {
    capeBack(b, '#3a5ab8', '#2a408a', '#f0d040');
  });
}

// Bob, zombie gentil : mort-vivant à la chemise déchirée, Bob à la fleur, zombie costaud aux
// bandages et au boulon dans la tête, zombie chic au smoking et au haut-de-forme ; rang 5, le roi
// des zombies : couronne de travers, cape royale en lambeaux, sceptre-os, médailles de fer.
function bob(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.bob, H = '#4a3a2a', ST = '#3a2a2a', BD = '#e8e0cc', MT = '#8e99a4', TX = '#1e1a22';
  const chic = rank >= 4;
  body(s, { tunic: chic ? TX : K.main, dark: chic ? '#0e0a12' : K.dark, trim: chic ? '#f2eef4' : K.trim, pants: chic ? TX : K.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', mouth: false, cape: chic && '#5a2a4a' });
  if (chic) { s.r(11, 14, 2, 4, '#f2eef4'); s.p(11, 14, '#d83a3a'); s.p(12, 14, '#d83a3a'); s.p(10, 14, '#d83a3a'); s.p(13, 14, '#d83a3a'); } // chemise et nœud papillon
  else { s.p(9, 17, C.skin); s.p(14, 15, C.skin); s.p(8, 19, null); s.p(12, 19, null); s.p(15, 19, null); }
  if (rank === 3) { s.hl(8, 15, 16, BD); s.p(9, 17, BD); s.p(14, 17, BD); } // bandages
  s.hl(11, 12, 12, '#5a2a2a'); s.p(13, 13, '#5a2a2a');
  s.hl(9, 13, 8, ST); for (const x of [10, 12]) { s.p(x, 7, ST); s.p(x, 9, ST); }
  if (rank >= 3) { s.hl(5, 7, 10, MT); s.hl(16, 18, 10, MT); s.p(5, 10, '#b9c6d2', true); } // boulon
  if (chic) {
    // haut-de-forme
    s.r(9, 0, 6, 6, TX); s.hl(7, 16, 6, TX); s.hl(9, 14, 4, '#d83a3a'); s.p(10, 1, '#4a3e5a', true);
    s.v(7, 7, 9, H); s.v(16, 7, 8, H);
  } else {
    s.r(8, 4, 8, 3, H); for (const [x, y] of [[8, 3], [11, 3], [14, 2], [15, 3], [16, 5], [7, 5]]) s.p(x, y, H);
    s.v(7, 6, 9, H); s.v(16, 6, 8, H); s.p(10, 4, '#6a5a4a', true);
  }
  // bras droit tendu (avec une fleur au rang 2, une canne au rang 4)
  for (let y = 14; y <= 19; y++) { s.p(16, y, null); s.p(17, y, null); }
  s.r(16, 14, 5, 2, chic ? TX : K.main); s.p(18, 16, chic ? TX : K.main); s.p(20, 16, chic ? '#0e0a12' : K.dark);
  s.r(21, 14, 2, 2, C.skin); s.p(23, 14, C.skin); s.p(23, 15, C.skinSh);
  if (rank === 2 || rank === 3) { s.v(22, 10, 13, '#3a8a4a'); s.r(21, 8, 3, 2, '#ff8ac8'); s.p(22, 8, '#fbe08a', true); }
  if (chic) { s.v(22, 16, 22, TX); s.p(22, 16, '#e0a93a'); s.p(22, 22, '#e0a93a'); }
  const out = s.recolor({ [C.skin]: '#9ac08a', [C.skinSh]: '#6a9a5a', ['#f0907a']: '#c8a0a8' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(9, 0, 6, 2, '#e0a93a'); out.p(9, 0, '#fbe08a', true); out.p(12, 0, '#e2334a', true); out.r(9, 2, 6, 2, null); out.hl(9, 14, 2, '#e0a93a');
  out.v(22, 10, 16, BD); out.r(21, 9, 3, 2, BD); out.p(22, 9, '#ffffff', true);
  return grand(out, (b) => {
    capeBack(b, '#5a2a4a', '#3a1a30', '#e0a93a');
  });
}

// Zip, skateur : débutant à la planche nue, skateur aux genouillères et à l'autocollant, pro du
// skate au casque et à la planche à flammes, champion du park à la planche néon ; rang 5, le roi de
// la rampe : planche-hover néon, casque à visière, casque audio, baskets lumineuses.
function zip(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.zip, H = '#e8a040', CP = '#d83a3a', DK = '#2a2234', N = '#4ff0e8';
  // planche debout à gauche
  const t = [10, 8, 6, 5, 5][rank - 1], DECK = rank >= 4 ? '#2a2234' : '#c8603a';
  s.r(2, t, 3, 22 - t, DECK); s.hl(2, 4, t, rank >= 4 ? '#4a3e5a' : '#f0a060');
  if (rank >= 2) s.r(3, t + 3, 1, 3, '#fbe08a', true);
  if (rank === 3) for (const y of [16, 18, 20]) s.p(3, y, '#ff8a2a', true);
  if (rank >= 4) { s.v(2, t + 1, 21, N, true); s.v(4, t + 1, 21, '#ff4ab8', true); }
  for (const y of [t + 2, 19]) { s.p(1, y, rank >= 4 ? N : '#f2eef4'); s.p(5, y, rank >= 4 ? N : '#f2eef4'); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#f2eef4', bootsHi: '#ffffff', sole: '#d83a3a', cape: false });
  s.hl(10, 13, 17, K.dark); s.p(10, 15, W); s.p(13, 15, W);
  if (rank >= 4) { s.hl(8, 15, 14, DK); s.p(11, 16, N, true); } // blouson
  s.hl(8, 15, 7, H); s.p(13, 8, H); s.p(14, 8, H); s.p(15, 8, H); s.p(15, 9, H); s.v(16, 7, 10, H); s.p(7, 8, H);
  if (rank >= 3) {
    // casque de skate
    s.r(8, 3, 8, 4, rank >= 4 ? DK : '#3a64c8'); s.hl(9, 14, 2, rank >= 4 ? DK : '#3a64c8'); s.hl(7, 16, 7, rank >= 4 ? '#4a3e5a' : '#26408a');
    s.p(9, 3, '#ffffff', true); s.p(13, 4, rank >= 4 ? N : '#fbe08a', true);
  } else {
    s.r(8, 4, 8, 3, CP); s.hl(9, 14, 3, CP); s.hl(5, 7, 6, '#a02a2a'); s.p(10, 4, '#ff7a7a', true);
  }
  if (rank >= 2) { s.p(9, 20, DK); s.p(14, 20, DK); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(9, 8, 6, 2, '#2a3440'); s.hl(9, 14, 9, N, true); s.r(6, 7, 2, 3, '#2a2234'); s.r(16, 7, 2, 3, '#2a2234'); s.p(17, 8, '#ff4ab8', true);
  s.p(8, 22, N, true); s.p(13, 22, N, true);
  return grand(s, (b) => {
    for (let x = 3; x <= 7; x++) b.under(x, 27, x % 2 ? N : '#ff4ab8');
  });
}

// Rexy, enfant en costume de dinosaure : bébé dino à une seule pointe, Rexy à la crête, petit T-rex
// à la grosse queue et à l'os, dino-tyran à la gueule pleine de dents ; rang 5, le roi des dinos :
// grosse capuche de T-rex à mâchoire immense, couronne, grandes pointes sur la queue, griffes.
function rexy(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.rexy, SPK = '#f08a2a', TE = '#ffffff', BN = '#efe6cf';
  // queue (plus grosse avec le rang, à pointes au rang 4)
  const tail = rank >= 3 ? [[16, 6, 7], [17, 4, 7], [18, 3, 7], [19, 2, 6], [20, 1, 4], [21, 0, 2]] : [[17, 5, 7], [18, 3, 7], [19, 2, 6], [20, 1, 4], [21, 0, 2]];
  for (const [y, a, b] of tail) s.hl(a, b, y, K.main);
  s.hl(3, 5, 20, K.dark); if (rank >= 2) { s.p(3, 18, SPK); s.p(1, 20, SPK); }
  if (rank >= 4) { s.p(4, 17, SPK); s.p(2, 18, SPK); s.p(0, 20, SPK); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.dark, pants: K.pants, boots: K.main, bootsHi: K.trim, sole: K.dark, cape: false });
  s.r(10, 15, 4, 3, K.trim); s.hl(10, 13, 16, '#e8c860');
  // capuche de dino : tête, museau, dents (une rangée de plus au rang 4), œil
  s.r(8, 3, 8, 5, K.main); s.hl(9, 14, 2, K.main); s.v(7, 5, 13, K.main); s.v(16, 5, 13, K.main);
  const sn = rank >= 4 ? 20 : 18;
  s.hl(16, sn, 5, K.main); s.hl(16, sn, 6, K.main); s.p(sn, 4, K.main);
  for (const x of [8, 10, 12, 14]) s.p(x, 8, TE, true);
  if (rank >= 4) { for (const x of [17, 19]) s.p(x, 7, TE, true); s.hl(16, 20, 7, K.dark); s.p(9, 13, TE, true); s.p(14, 13, TE, true); }
  s.hl(8, 15, 7, K.dark); s.p(15, 4, '#2a2234', true); s.p(15, 3, '#ffffff', true);
  // crête : une pointe, deux, quatre, six
  const spikes = [[[11, 1]], [[10, 1], [12, 1]], [[9, 1], [11, 0], [13, 1], [7, 3]], [[9, 1], [11, 0], [13, 1], [7, 3], [6, 5], [15, 1]]][Math.min(3, rank - 1)];
  for (const [x, y] of spikes) { s.p(x, y, SPK); s.p(x, y + 1, SPK); }
  s.p(6, 19, TE); s.p(17, 19, TE);
  if (rank >= 3) { s.hl(17, 21, 17, BN); s.p(17, 16, BN); s.p(17, 18, BN); s.p(21, 16, BN); s.p(21, 18, BN); } // os
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(10, 0, 4, 1, '#e0a93a'); s.p(10, -1 + 1, '#e0a93a'); s.p(11, 0, '#e2334a', true); s.p(13, 0, '#fbe08a', true);
  for (const x of [16, 18, 20]) s.p(x, 8, TE, true); s.hl(16, 21, 7, K.dark); s.hl(16, 21, 4, K.main);
  return grand(s, (b) => {
    for (const [x, y] of [[1, 22], [3, 21], [5, 20]]) { b.under(x, y, SPK); b.under(x, y - 1, SPK); }
  });
}

// Léo, homme-lion : lionceau à la petite crinière, homme-lion aux griffes, guerrier lion aux
// tresses de crinière et aux longues griffes, roi lion à la couronne et à la cape rouge ; rang 5,
// le lion solaire : crinière immense et dorée, couronne-soleil, armure à tête de lion, griffes
// d'or.
function leo(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.leo, MN = '#b8601e', MNH = '#d8803a', MNL = '#e8a050', MZ = '#f8e0b8', MT = '#b9c6d2', GD = '#e0a93a';
  // crinière : petite, puis très large
  const mane = rank === 1
    ? [[4, 8, 15], [5, 7, 16], [6, 6, 17], [7, 6, 17], [8, 6, 17], [9, 6, 17], [10, 6, 17], [11, 6, 17], [12, 7, 16]]
    : [[3, 9, 14], [4, 7, 16], [5, 6, 17], [6, 5, 18], [7, 5, 18], [8, 5, 18], [9, 5, 18], [10, 5, 18], [11, 5, 18], [12, 6, 17], [13, 6, 17], [14, 7, 16]];
  for (const [y, a, b] of mane) s.hl(a, b, y, MN);
  if (rank >= 3) { s.hl(4, 19, 9, MN); s.hl(4, 19, 10, MN); s.p(4, 11, MN); s.p(19, 11, MN); s.v(4, 12, 14, MNL); s.v(19, 12, 14, MNL); s.p(4, 14, GD); s.p(19, 14, GD); } // tresses
  for (const [x, y] of [[7, 5], [5, 8], [17, 7], [6, 12], [16, 11], [10, 3]]) if (s.get(x, y)) s.p(x, y, MNH, true);
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#b07a3a', bootsHi: '#e0a860', sole: '#6a4a2a', cape: rank >= 4 && '#a82a2a', bracers: rank >= 3 ? K.trim : false });
  s.r(7, 3, 2, 2, '#e0a860'); s.r(15, 3, 2, 2, '#e0a860'); s.p(8, 4, '#b07a3a'); s.p(15, 4, '#b07a3a');
  s.hl(9, 14, 7, MNL); s.p(11, 8, MNL); s.p(12, 8, MNL);
  s.r(10, 12, 4, 2, MZ); s.p(11, 12, '#6a3a2a'); s.p(12, 12, '#6a3a2a');
  if (rank >= 2) { s.p(11, 16, GD, true); s.p(12, 16, GD, true); s.p(11, 15, '#fbe08a', true); }
  if (rank >= 4) { for (const x of [9, 11, 12, 14]) s.p(x, 5, GD); s.hl(9, 14, 6, GD); s.r(11, 6, 2, 1, '#e2334a', true); }
  // griffes : courtes, puis longues
  const L = [1, 3, 4, 5, 5][rank - 1];
  for (const y of [16, 18, 20]) { s.hl(18, 17 + L, y - 1, MT); s.p(18 + L, y - 1, '#ffffff', true); }
  s.r(16, 15, 2, 4, rank >= 3 ? MT : '#e0a860');
  const out = s.recolor({ [C.skin]: '#e0a860', [C.skinSh]: '#b07a3a' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [y, a, b2] of [[2, 6, 17], [3, 4, 19], [16, 6, 17]]) out.hl(a, b2, y, '#e0a93a');
  out.r(9, 15, 6, 3, '#e0a93a'); out.r(11, 15, 2, 2, '#b8601e'); out.p(11, 15, '#fbe08a', true);
  for (const y of [15, 17, 19]) out.hl(18, 22, y, '#e0a93a');
  return grand(out, (b) => {
    for (let y = 0; y < 22; y++) for (let x = 0; x < 28; x++) { const dx = x - 13.5, dy = y - 12, r = Math.sqrt(dx * dx + dy * dy), an = Math.atan2(dy, dx); if (r < 11 + Math.sin(an * 8) * 1.2) b.under(x, y, Math.sin(an * 8) > 0.3 ? '#fbe08a' : '#e0a93a'); }
  });
}

// Capitaine Tonnerre, super-héros : acolyte au loup jaune et à l'étincelle, capitaine à l'éclair,
// super-héros aux deux éclairs et aux bottes jaunes, héros de la ville à la couronne de foudre ;
// rang 5, le dieu de la foudre : couronne de foudre, cape violette zébrée d'éclairs, yeux qui
// brillent, foudre dans les deux mains.
function tonnerre(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.tonnerre, H = '#3a2a22', Y = K.trim, CP = '#6a3aa8';
  body(s, { tunic: K.main, dark: K.dark, trim: '#4a3e5a', pants: K.pants, boots: rank >= 3 ? Y : K.dark, bootsHi: rank >= 3 ? '#fff0a0' : '#4a3e5a', sole: '#140d11', cape: rank >= 2 && CP, belt: Y, buckle: '#ffffff' });
  s.p(12, 14, Y, true); s.p(11, 15, Y, true); s.p(12, 15, Y, true); s.p(11, 16, Y, true); s.p(12, 17, Y, true);
  if (rank >= 4) { s.p(13, 13, Y, true); s.p(10, 17, Y, true); }
  s.r(8, 5, 8, 3, H); s.hl(10, 15, 4, H); s.hl(13, 16, 3, H); s.p(17, 4, H);
  s.v(7, 6, 9, H); s.v(16, 6, 9, H); s.p(15, 8, H); s.p(12, 4, '#5a4a3a', true); s.p(15, 3, '#5a4a3a', true);
  s.hl(9, 14, 9, Y); s.p(9, 10, Y); s.p(14, 10, Y); s.p(11, 10, Y); s.p(12, 10, Y);
  if (rank >= 4) for (const [x, y] of [[8, 2], [9, 1], [11, 2], [12, 1], [14, 2], [15, 1]]) s.p(x, y, Y, true); // couronne de foudre
  // éclair(s) au-dessus des mains
  const bolt = (x, top, big) => { s.sline(x, top, x - 2, top + 4, Y); s.hl(x - 2, x, top + 4, Y); s.sline(x, top + 5, x - 1, top + (big ? 10 : 8), Y); s.p(x, top, '#ffffff', true); s.p(x - 1, top + 4, '#ffffff', true); };
  if (rank === 1) { s.p(19, 14, Y, true); s.p(20, 13, '#ffffff', true); s.p(18, 13, Y, true); }
  else bolt(19, rank >= 3 ? 3 : 6, rank >= 3);
  if (rank >= 3) bolt(5, 5, rank >= 4);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.p(10, 10, '#ffffff', true); s.p(13, 10, '#ffffff', true);
  for (const [x, y] of [[3, 16], [4, 17], [3, 18], [20, 16], [19, 17], [20, 18]]) s.p(x, y, Y, true);
  return grand(s, (b) => {
    capeBack(b, CP, '#4a2a7a', Y);
  });
}

// Ramsès, pharaon momie : momie à la petite coiffe et au petit ânkh, pharaon à la coiffe rayée,
// pharaon d'or au fouet et à la crosse, dieu-roi au masque d'or et au collier ailé ; rang 5, le
// fils du soleil : disque solaire et cobra sur la coiffe, masque d'or, collier ailé, crosse et
// fouet d'or, pagne doré.
function ramses(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.ramses, BL = '#2a4a9a', G = '#e0a93a', GH = '#fbe08a', BD = '#c8b898';
  s.p(6, 15, K.main); s.p(5, 16, K.main); s.p(4, 16, K.main); s.p(3, 17, K.main); s.p(2, 18, K.main); s.p(3, 19, BD);
  if (rank >= 2) { s.p(1, 19, K.main); s.p(1, 20, BD); }
  body(s, { tunic: K.main, dark: K.dark, trim: rank >= 2 ? G : BD, pants: K.pants, boots: K.main, bootsHi: '#ffffff', sole: BD, mouth: false, cape: rank >= 4 && BL, belt: rank >= 2 ? BL : BD, buckle: G });
  s.hl(8, 11, 16, BD); s.hl(12, 15, 17, BD); s.p(7, 15, BD); s.p(16, 16, BD);
  if (rank < 4) { s.hl(8, 12, 9, BD); s.hl(11, 15, 13, BD); }
  // collier d'or (ailé au rang 4)
  if (rank >= 2) { s.hl(9, 14, 14, G); s.p(11, 15, BL); s.p(12, 15, G); }
  if (rank >= 4) { s.hl(6, 17, 14, G); s.hl(7, 16, 15, BL); s.p(6, 15, G); s.p(17, 15, G); }
  // coiffe : simple bandeau, puis némès rayé
  if (rank === 1) { s.r(8, 4, 8, 3, BD); s.hl(9, 14, 3, BD); s.hl(8, 15, 7, BL); s.p(12, 2, G); }
  else {
    s.r(8, 3, 8, 4, G); s.hl(9, 14, 2, G); for (const x of [9, 11, 13, 15]) s.v(x, 3, 6, BL); s.hl(7, 16, 7, G);
    for (const x of [7, 16]) { s.v(x, 8, 13, x === 7 ? BL : G); s.v(x === 7 ? 6 : 17, 9, 13, x === 7 ? G : BL); }
    s.p(12, 2, G); s.p(12, 1, GH);
  }
  if (rank >= 4) {
    // masque funéraire d'or sur le visage : yeux soulignés de bleu, barbe postiche
    s.r(8, 8, 8, 5, G); s.hl(9, 14, 13, '#b07a20'); s.hl(9, 10, 10, BL); s.hl(13, 14, 10, BL); s.p(10, 10, '#ffffff', true); s.p(13, 10, '#ffffff', true);
    s.v(11, 13, 15, BL); s.v(12, 13, 15, G); s.p(9, 8, GH, true);
  }
  // sceptre : petit ânkh, ânkh, crosse et fouet
  const top = [8, 5, 2, 2, 2][rank - 1], A = rank >= 2 ? G : BD;
  s.v(19, top + 4, 22, rank >= 2 ? G : '#7a5a3a'); s.r(18, top, 3, 3, A); s.p(19, top + 1, null); s.hl(17, 21, top + 3, A); s.p(18, top, GH, true);
  if (rank >= 3) { s.v(4, 9, 20, BL); s.p(5, 8, BL); s.p(6, 9, BL); for (let y = 10; y <= 14; y += 2) { s.p(3, y, G); s.p(5, y + 1, G); } } // fouet
  const out = s.recolor({ [C.skin]: '#e8dcc0', [C.skinSh]: '#b8a888', ['#f0907a']: '#d8c8a8' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(10, 0, 4, 2, '#e2552a'); out.p(11, 0, '#ff8a5a', true); out.p(9, 1, G); out.p(14, 1, G);
  out.r(8, 18, 8, 3, G); out.v(11, 18, 20, BL); out.v(12, 18, 20, BL);
  return grand(out, (b) => {
    for (const d of [-1, 1]) for (let i = 0; i < 5; i++) b.under(d < 0 ? 7 - i : 20 + i, 18 + (i >> 1), i % 2 ? BL : G);
  });
}

// Elixa, alchimiste : préparatrice à la petite fiole, alchimiste aux lunettes de laiton, maîtresse
// des potions aux lunettes baissées et à la deuxième fiole qui flotte, grande alchimiste au cercle
// brodé et à la pierre rouge ; rang 5, la pierre philosophale : robe brodée du grand cercle,
// bandoulière de fioles, pierre rouge qui flotte au-dessus de sa main, lunettes qui luisent.
function elixa(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.elixa, H = '#e88ab8', HH = '#ffb8d8', BR = '#c8903a', LQ = '#ff8a2a', GL = '#d8f0ff', RS = '#e2334a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#5a2a3a', bootsHi: '#7a3a4a', sole: '#2a1018', robe: true, cape: rank >= 4 && K.dark });
  if (rank >= 2) { s.p(9, 18, '#7af06a', true); s.p(10, 18, '#5ac8ff', true); s.p(14, 18, LQ, true); }
  if (rank >= 4) { s.p(11, 15, K.trim); s.p(12, 15, K.trim); s.p(10, 16, K.trim); s.p(13, 16, K.trim); s.p(11, 17, K.trim); s.p(12, 17, K.trim); s.p(11, 16, RS, true); } // cercle brodé
  // cheveux roses (plus bouffants avec le rang)
  s.r(8, 4, 8, 4, H); s.hl(9, 14, 3, H); s.v(7, 5, 12, H); s.v(16, 5, 12, H);
  if (rank >= 2) { s.v(6, 7, 10, H); s.v(17, 7, 10, H); }
  if (rank >= 4) { s.v(5, 8, 11, H); s.v(18, 8, 11, H); s.hl(9, 14, 2, H); }
  s.p(8, 8, H); s.p(15, 8, H); s.p(9, 4, HH, true); s.p(7, 8, HH, true);
  // lunettes : simples, en laiton sur le front, puis baissées sur les yeux
  if (rank === 1) { s.p(9, 10, '#8a6a4a'); s.p(11, 10, '#8a6a4a'); s.p(12, 10, '#8a6a4a'); s.p(14, 10, '#8a6a4a'); }
  else if (rank === 2) { s.hl(8, 15, 6, '#5a3a22'); s.r(9, 5, 2, 2, BR); s.r(13, 5, 2, 2, BR); s.p(9, 5, '#c8f0ff', true); s.p(13, 5, '#c8f0ff', true); }
  else { s.hl(8, 15, 10, '#5a3a22'); s.r(9, 9, 2, 3, BR); s.r(13, 9, 2, 3, BR); s.p(10, 10, '#ffd080', true); s.p(13, 10, '#ffd080', true); s.p(9, 9, '#ffffff', true); }
  // fiole (plus grosse avec le rang), pierre rouge au rang 4
  const cy = [16, 15, 13, 12, 12][rank - 1], small = rank === 1;
  if (small) { s.r(18, cy, 3, 3, GL); s.r(18, cy + 1, 3, 2, LQ, true); s.v(19, cy - 2, cy - 1, GL); s.p(19, cy - 3, '#8a5a32'); }
  else {
    s.v(19, cy - 4, cy - 2, GL); s.p(19, cy - 5, '#8a5a32'); s.r(17, cy - 1, 5, 4, GL); s.hl(18, 20, cy + 3, GL);
    s.r(18, cy, 3, 3, LQ, true); s.hl(17, 21, cy + 1, LQ, true); s.p(18, cy, '#ffd080', true); s.p(17, cy - 1, '#ffffff', true);
    s.p(20, cy - 6, '#ffd080', true); s.p(18, cy - 7, '#ffd080', true);
  }
  if (rank >= 3) { s.r(2, 8, 3, 3, GL); s.r(2, 9, 3, 2, '#7af06a', true); s.p(3, 7, GL); s.p(3, 6, '#8a5a32'); s.p(2, 8, '#ffffff', true); } // fiole qui flotte
  if (rank >= 4) { s.r(19, cy, 2, 2, RS, true); s.p(19, cy, '#ff8a9a', true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.sline(8, 14, 15, 19, '#5a3a22'); for (const [x, y] of [[9, 15], [11, 16], [13, 18]]) s.p(x, y, ['#7af06a', '#5ac8ff', LQ][(x >> 1) % 3], true);
  s.r(19, 2, 2, 2, RS, true); s.p(19, 2, '#ff8a9a', true); s.p(18, 3, '#ffd080', true); s.p(21, 2, '#ffd080', true);
  return grand(s);
}

// Mako, homme-requin : bébé requin au petit aileron et à la lance, homme-requin au trident, requin-
// tigre aux rayures et au grand aileron, grand requin blanc à la couronne de corail ; rang 5, le
// mégalodon : tête de requin à mâchoire immense, armure de corail, aileron géant, trident de
// corail.
function mako(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.mako, FN = '#5a7a98', CO = '#ff7a6a', MT = '#b9c6d2';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#3a5a7a', bootsHi: FN, sole: '#1a2a3a', mouth: false, cape: rank >= 4 && '#2a5a8a', belt: '#2a2234', buckle: rank >= 4 ? CO : '#e0a93a' });
  s.r(10, 15, 4, 3, K.trim); s.r(8, 18, 8, 2, K.pants); s.p(10, 19, '#ffb070');
  if (rank === 3) for (const [x, y] of [[8, 15], [15, 16], [6, 15]]) s.p(x, y, '#3a5a7a'); // rayures
  // aileron (plus grand avec le rang)
  const fin = rank === 1 ? [[3, 11, 12], [4, 10, 13], [5, 9, 14], [6, 8, 15]] : [[0, 12, 12], [1, 11, 12], [2, 10, 12], [3, 9, 12], [4, 9, 13], [5, 8, 14], [6, 8, 15]];
  for (const [y, a, b] of fin) s.hl(a, b, y, FN);
  if (rank >= 3) { s.p(13, 0, FN); s.p(13, 1, FN); s.p(14, 2, FN); }
  s.p(10, 2, '#9ab8d8', true); s.p(9, 4, '#9ab8d8', true);
  if (rank === 3) { s.p(11, 3, '#3a5a7a'); s.p(10, 5, '#3a5a7a'); }
  s.r(9, 12, 6, 2, K.trim); for (const x of [9, 11, 13]) s.p(x, 12, '#c8c0c8');
  s.hl(9, 14, 13, '#3a2a3a'); for (const x of rank >= 4 ? [9, 10, 11, 12, 13, 14] : [10, 12, 14]) s.p(x, 13, '#ffffff', true);
  s.p(15, 10, FN); s.p(15, 11, FN);
  if (rank >= 4) for (const [x, y] of [[8, 6], [8, 5], [7, 4], [15, 6], [16, 5], [16, 4], [9, 4]]) s.p(x, y, CO); // couronne de corail
  // lance, puis trident (corail au rang 4)
  const y0 = [6, 4, 1, 1, 1][rank - 1], tip = rank >= 4 ? CO : MT;
  s.v(19, y0 + 4, 22, '#4a6a8a');
  if (rank === 1) { s.v(19, y0 + 1, y0 + 3, MT); s.p(19, y0 + 1, '#ffffff', true); }
  else { s.hl(17, 21, y0 + 3, tip); for (const x of [17, 19, 21]) s.v(x, y0 + (x === 19 ? 0 : 1), y0 + 2, tip); s.p(19, y0, '#ffffff', true); }
  const out = s.recolor({ [C.skin]: '#8aaac8', [C.skinSh]: '#6a8aa8' });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 3, '#e86a5a'); for (const [x, y] of [[9, 14], [12, 15], [14, 14]]) out.p(x, y, CO, true);
  out.r(8, 12, 8, 2, '#3a2a3a'); for (const x of [8, 10, 12, 14]) { out.p(x, 12, '#ffffff', true); out.p(x + 1, 13, '#ffffff', true); }
  return grand(out, (b) => {
    for (const [x, y] of [[14, 0], [15, 0], [15, 1], [16, 1], [16, 2]]) b.under(x, y, FN);
  });
}

// Pixel, hackeuse : codeuse aux lunettes et au petit ordi, hackeuse à la visière lumineuse, pirate
// du net aux écrans holographiques, cyber-reine au casque à oreilles lumineuses ; rang 5, le
// fantôme du réseau : casque de réalité virtuelle, combinaison à circuits néon, écrans
// holographiques qui tournent autour de ses mains.
function pixel(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.pixel, H = '#9a5ad8', HH = '#c89af0', NE = '#4ff0e8', GR = '#9af098';
  // ordinateur portable (plus grand au rang 2)
  const lw = rank === 1 ? 4 : 5;
  s.r(1, 13, lw, 4, '#2a3440'); s.r(2, 14, lw - 2, 2, '#1e5a4a', true); s.p(2, 14, NE, true); s.p(3, 15, GR, true);
  s.hl(1, lw + 1, 17, '#8e99a4'); s.hl(2, lw + 2, 18, '#4a4a5a');
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2a3a', bootsHi: '#4a4a5a', sole: NE, cape: rank >= 4 && '#3a2a6a' });
  if (rank >= 2) { s.v(15, 15, 19, '#4a4a5a'); s.p(10, 16, '#ff8ac8', true); }
  s.r(8, 4, 8, 4, H); s.hl(9, 14, 3, H); s.v(7, 5, 12, H); s.v(16, 5, 12, H); s.p(8, 8, H); s.p(9, 8, H); s.p(10, 8, H); s.v(11, 4, 7, HH, true);
  if (rank === 1) { s.p(9, 10, '#4a4a5a'); s.p(11, 10, '#4a4a5a'); s.p(12, 10, '#4a4a5a'); s.p(14, 10, '#4a4a5a'); }
  else { s.hl(8, 15, 10, '#2a3440'); s.hl(8, 15, 11, '#2a3440'); s.v(10, 10, 11, NE, true); s.v(13, 10, 11, NE, true); }
  if (rank >= 4) { s.p(8, 3, H); s.p(8, 2, H); s.p(15, 3, H); s.p(15, 2, H); s.p(8, 2, NE, true); s.p(15, 2, NE, true); s.p(7, 9, '#4a4a5a'); s.p(16, 9, '#4a4a5a'); } // oreilles lumineuses
  // écrans holographiques qui flottent
  if (rank >= 3) for (const [x, y] of [[18, 6], [19, 13]].slice(0, rank - 2)) { s.r(x, y, 4, 3, '#1e5a4a', true); s.hl(x, x + 3, y, NE, true); s.p(x + 1, y + 1, GR, true); s.p(x + 2, y + 2, GR, true); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 9, 8, 3, '#2a3440'); s.hl(9, 14, 10, NE, true); s.p(8, 9, '#4a4a5a');
  s.v(9, 14, 18, NE, true); s.hl(9, 13, 16, NE, true); s.p(14, 17, GR, true);
  return grand(s, (b) => {
    for (const [x, y] of [[22, 6], [0, 10]]) { b.r(x, y, 5, 3, '#1e5a4a', true); b.hl(x, x + 4, y, NE, true); b.p(x + 1, y + 1, GR, true); b.p(x + 3, y + 2, GR, true); }
  });
}

// Lumi, chevalière au sabre de lumière : padawan au sabre court bleu, chevalière au sabre vert,
// gardienne à la capuche de bure, maîtresse au long sabre et à la cape ; rang 5, la légende de la
// Force : robe de maître à capuche, ceinture de cuir, sabre double à deux lames vertes.
function lumi(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.lumi, H = '#6b4428', HH = '#8a5a34', CL = '#6a4a32', MT = '#b9c6d2';
  const SB = rank === 1 ? '#5ab4ff' : '#5ae05a', SL = rank === 1 ? '#d8f0ff' : '#d8ffd0', SD = rank === 1 ? '#2a78c8' : '#2a9a3a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: CL, bootsHi: '#8a6a4a', sole: '#2a1a12', cape: rank >= 2 && CL, belt: CL, buckle: MT });
  s.sline(10, 14, 13, 17, K.dark);
  if (rank >= 3) { s.v(9, 14, 18, CL); s.v(14, 14, 18, CL); } // pans de la robe de bure
  // cheveux en chignon ; capuche relevée au rang 4
  s.r(8, 5, 8, 3, H); s.v(7, 6, 10, H); s.v(16, 6, 10, H); s.p(9, 8, H); s.p(14, 8, H);
  if (rank >= 4) { s.r(8, 3, 8, 4, CL); s.hl(9, 14, 2, CL); s.v(7, 5, 12, CL); s.v(16, 5, 12, CL); s.p(9, 3, '#8a6a4a', true); }
  else { s.r(11, 2, 3, 3, H); s.p(12, 2, HH, true); s.p(9, 5, HH, true); }
  if (rank === 1) { s.v(16, 8, 12, H); s.p(16, 12, '#8a5a34'); } // tresse de padawan
  if (rank >= 2 && rank < 4) { s.hl(7, 16, 13, CL); s.p(6, 13, CL); s.p(17, 13, CL); }
  // sabre : court, plus long, long, très long
  const top = [8, 4, 2, 0, 0][rank - 1];
  s.v(18, 17, 20, MT); s.p(18, 18, '#2a2234'); s.hl(17, 19, 17, MT);
  s.v(18, top, 16, SB, true); s.v(18, top + 1, 15, SL, true); s.p(18, top, '#ffffff', true); s.v(19, top + 1, 16, SD, true);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 18, 8, 4, CL); s.hl(8, 15, 17, '#4a3020');
  s.v(18, 18, 23, '#5ae05a', true); s.v(19, 18, 23, '#2a9a3a', true); s.v(18, 19, 22, '#d8ffd0', true);
  return grand(s);
}

// Kero, grenouille ninja : têtard au petit shuriken, Kero au bandeau à plaque, ninja des marais au
// katana dans le dos, maître ninja au grand shuriken et au parchemin ; rang 5, la grenouille
// légendaire : manteau d'ermite rouge, marques de sage autour des yeux, grand parchemin dans le
// dos, shuriken géant.
function kero(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.kero, R = K.trim, GR = '#6ac84a', GD = '#4a9a34', MT = '#b9c6d2', SC = '#f0e0b0';
  if (rank >= 3) { s.sline(4, 20, 9, 9, '#2a2234'); s.sline(9, 9, 11, 5, MT); s.p(11, 5, '#ffffff', true); } // katana dans le dos
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: GD, bootsHi: GR, sole: '#2a4a1a', mouth: false, cape: rank >= 4 && R, belt: R, buckle: MT });
  s.r(10, 15, 4, 2, '#c8e8a0'); s.hl(9, 14, 12, GD);
  if (rank >= 4) { s.r(12, 12, 4, 1, SC); s.p(15, 12, R); s.p(12, 12, R); } // parchemin dans la bouche
  s.r(8, 5, 8, 3, GR);
  for (const x0 of [8, 13]) { s.r(x0, 2, 3, 3, GR); s.p(x0 + 1, 3, '#ffffff', true); s.p(x0 + 1, 4, '#21182a', true); }
  s.v(7, 6, 11, GR); s.v(16, 6, 11, GR);
  // bandeau : sans plaque, plaque de métal, pans longs
  s.hl(7, 16, 7, R); if (rank >= 2) { s.r(11, 7, 2, 1, MT); s.p(11, 7, '#ffffff', true); }
  s.p(6, 7, R); s.p(5, 8, R); s.p(4, 8, R); s.p(5, 9, '#a82030'); s.p(3, 9, '#a82030');
  if (rank >= 3) { s.p(2, 10, R); s.p(1, 10, '#a82030'); }
  // shuriken : petit, moyen, grand, géant à 4 lames
  const cx = 19, cy = [16, 16, 14, 13, 13][rank - 1], r = [1, 2, 2, 3, 3][rank - 1];
  s.p(cx, cy, '#2a2234'); s.v(cx, cy - r, cy - 1, MT); s.v(cx, cy + 1, cy + r, MT); s.hl(cx - r, cx - 1, cy, MT); s.hl(cx + 1, cx + r, cy, MT);
  if (rank >= 3) { s.p(cx - 1, cy - 1, MT); s.p(cx + 1, cy + 1, MT); s.p(cx + 1, cy - 1, MT); s.p(cx - 1, cy + 1, MT); }
  if (rank >= 4) { s.p(cx + 1, cy - 3, MT); s.p(cx + 3, cy + 1, MT); s.p(cx - 1, cy + 3, MT); s.p(cx - 3, cy - 1, MT); }
  s.p(cx, cy - r, '#ffffff', true);
  const out = s.recolor({ [C.skin]: GR, [C.skinSh]: GD });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.p(8, 3, '#e2334a'); out.p(15, 3, '#e2334a'); out.p(9, 5, '#e2334a'); out.p(14, 5, '#e2334a');
  out.r(8, 14, 8, 2, '#d83a3a'); out.hl(8, 15, 14, '#ff8a8a');
  return grand(out, (b) => {
    for (let y = 8; y <= 20; y++) { b.under(4, y, SC); b.under(5, y, SC); } b.under(4, 7, '#8a3a2a'); b.under(5, 7, '#8a3a2a'); b.under(4, 21, '#8a3a2a'); b.under(5, 21, '#8a3a2a');
  });
}

// Atlas, méca-gardien : drone au petit bouclier, méca-gardien au canon, sentinelle au grand
// bouclier et à l'aileron en V, colosse aux réacteurs dorsaux et à la visière ; rang 5, le titan :
// armure lourde blanche et or, ailes-réacteurs, double canon, bouclier d'énergie géant.
function atlas(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.atlas, FP = '#4a5a7a', NE = '#4ff0e8', MT = '#b9c6d2', GD = '#e0a93a';
  if (rank >= 4) for (const x of [4, 18]) { s.r(x, 9, 2, 5, MT); s.p(x, 9, '#ffffff', true); s.p(x, 14, '#ff8a2a', true); s.p(x + 1, 14, '#fbe08a', true); } // réacteurs dorsaux
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: K.main, bootsHi: '#ffffff', sole: FP, mouth: false, cape: rank >= 3 && '#2a3a7a', belt: FP, buckle: NE });
  s.r(11, 15, 2, 2, NE, true); s.p(11, 15, '#ffffff', true); s.hl(9, 14, 17, K.dark);
  // tête de robot ; aileron en V (rang 3), visière (rang 4)
  s.r(8, 4, 8, 4, K.main); s.hl(9, 14, 3, K.main); s.v(7, 6, 13, K.main); s.v(16, 6, 13, K.main);
  if (rank >= 4) { s.hl(8, 15, 10, '#2a3440'); s.hl(9, 14, 11, '#2a3440'); s.hl(9, 14, 10, NE, true); }
  else { s.v(10, 10, 11, NE, true); s.v(13, 10, 11, NE, true); }
  s.p(9, 12, '#2a3440'); s.p(14, 12, '#2a3440'); s.hl(10, 13, 12, '#2a3440');
  if (rank >= 3) { s.sline(12, 4, 9, 1, GD); s.sline(12, 4, 15, 1, GD); }
  else { s.v(12, 1, 3, MT); s.p(12, 1, NE, true); }
  s.p(12, 4, NE, true); s.p(9, 4, '#ffffff', true);
  if (rank >= 2) for (const x of [4, 16]) { s.r(x, 12, 4, 3, K.trim); s.hl(x, x + 3, 12, MT); s.p(x + 1, 12, '#ffffff', true); }
  // bouclier d'énergie (plus haut avec le rang), canon au bras (dès le rang 2)
  const sh = [16, 13, 9, 7, 7][rank - 1];
  for (let y = sh; y <= 21; y++) s.hl(1, 4, y, y === sh || y === 21 ? MT : FP);
  s.v(2, sh + 1, 20, NE, true); s.p(2, sh + 1, '#ffffff', true);
  if (rank >= 2) { const L = rank >= 3 ? 5 : 3; s.r(16, 15, 2, 4, K.main); s.r(18, 15, L, 3, MT); s.p(18 + L, 16, NE, true); s.p(18, 15, '#ffffff', true); }
  const out = s.recolor({ [C.skin]: FP, [C.skinSh]: '#34405a', ['#f0907a']: FP });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 4, '#f2f4f8'); out.hl(8, 15, 14, GD); out.r(11, 15, 2, 2, NE, true); out.p(11, 15, '#ffffff', true);
  out.hl(18, 23, 14, MT); out.p(23, 14, NE, true);
  return grand(out, (b) => {
    for (const d of [-1, 1]) { const x = d < 0 ? 6 : 21; for (let i = 0; i < 5; i++) { b.under(x + d * i, 12 - i, MT); b.under(x + d * i, 13 - i, '#8e99a4'); } b.p(x + d * 4, 7, NE, true); }
  });
}

// Pyra, phénix : ses ailes de flammes grandissent à chaque rang. Étincelle aux petites ailes,
// phénix au diadème, oiseau de feu aux grandes ailes, phénix royal aux plumes de queue ; rang 5, le
// phénix éternel : ailes de feu immenses, longues plumes de queue, couronne de flammes, robe de
// braises.
function pyra(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.pyra, F1 = '#ff8a2a', F2 = '#fbe08a', F3 = '#e2334a';
  const wing = [
    [[12, 4, 5], [13, 3, 5], [14, 4, 5]],
    [[10, 3, 5], [11, 2, 5], [12, 1, 5], [13, 3, 5], [14, 2, 5]],
    [[8, 3, 5], [9, 1, 5], [10, 0, 5], [11, 1, 5], [12, 0, 5], [13, 2, 5], [14, 1, 5], [15, 3, 5]],
    [[6, 3, 5], [7, 1, 5], [8, 0, 5], [9, 0, 5], [10, 0, 5], [11, 1, 5], [12, 0, 5], [13, 1, 5], [14, 0, 5], [15, 2, 5], [16, 3, 5]],
  ][Math.min(3, rank - 1)];
  for (const [y, a, b] of wing) { s.hl(a, b, y, F1); s.hl(23 - b, 23 - a, y, F1); s.p(a, y, F3); s.p(23 - a, y, F3); }
  if (rank >= 2) { s.p(4, 11, F2, true); s.p(19, 11, F2, true); }
  if (rank >= 3) { s.p(3, 12, F2, true); s.p(20, 13, F2, true); }
  if (rank >= 4) for (const [x, y] of [[8, 22], [7, 23], [15, 22], [16, 23], [6, 21], [17, 21]]) s.p(x, y, (x + y) % 2 ? F1 : F3); // plumes de queue
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: K.dark, bootsHi: K.main, sole: '#5a1010', robe: true, cape: rank >= 4 && F1 });
  s.p(12, 16, F2, true); s.p(11, 17, F1, true); s.p(12, 18, F1, true);
  s.r(8, 5, 8, 3, F1); s.hl(9, 15, 4, F1); s.v(7, 6, 12, F1); s.v(16, 6, 12, F1); s.p(8, 8, F1); s.p(14, 8, F1); s.p(15, 8, F1);
  for (const [x, y] of [[8, 3], [7, 2], [10, 2], [12, 3], [6, 4]]) s.p(x, y, F3);
  if (rank >= 3) { s.p(5, 3, F3); s.p(6, 2, F1); s.p(9, 1, F3); }
  s.p(9, 5, F2, true); s.p(11, 4, F2, true); s.p(16, 9, F2, true);
  if (rank >= 2) { s.hl(8, 15, 7, K.trim); s.r(11, 6, 2, 1, F2, true); }
  if (rank >= 4) { s.p(11, 5, F2); s.p(12, 5, '#ffffff', true); s.p(10, 6, F1); s.p(13, 6, F1); }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 18, 8, 4, '#a82a2a'); for (const [x, y] of [[9, 19], [12, 20], [14, 18]]) s.p(x, y, F2, true);
  for (const [x, y] of [[9, 3], [11, 2], [12, 1], [14, 3]]) s.p(x, y, F2, true);
  return grand(s, (b) => {
    for (const d of [-1, 1]) for (let i = 0; i < 6; i++) { const x = d < 0 ? 4 - i : 23 + i, y0 = 4 + i; for (let y = y0; y <= y0 + 8; y++) if (x >= 0 && x < 28) b.under(x, y, y === y0 ? F2 : y % 2 ? F1 : F3); }
    for (let y = 24; y <= 27; y++) { b.under(9 - (y - 24), y, F1); b.under(18 + (y - 24), y, F1); }
  });
}

// Mortis, roi-liche : squelette au cercle de fer, liche à la couronne de glace, roi-liche aux
// grandes pointes et au bâton gelé, seigneur de l'hiver aux épaulières de glace ; rang 5, le roi de
// l'hiver éternel : immense couronne de glace, armure de givre, cape de glace qui traîne, sceptre
// au grand cristal.
function mortis(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.mortis, IC = K.trim, BO = '#e8e0cc', ID = '#4ab8d8';
  body(s, { tunic: K.main, dark: K.dark, trim: IC, pants: K.pants, boots: K.dark, bootsHi: K.main, sole: '#0a0e1e', robe: true, mouth: false, cape: rank >= 2 && '#141c38' });
  s.hl(10, 13, 15, BO); s.hl(10, 13, 17, BO); s.p(14, 20, IC, true); s.p(9, 19, IC, true);
  if (rank >= 4) for (const x of [5, 18]) { s.v(x, 10, 13, IC, true); s.v(x + (x < 10 ? 1 : -1), 12, 14, ID, true); s.p(x, 10, '#ffffff', true); } // épaulières de glace
  s.r(9, 9, 2, 3, '#2a2234'); s.r(13, 9, 2, 3, '#2a2234'); s.p(10, 10, IC, true); s.p(13, 10, IC, true);
  s.hl(10, 13, 12, '#2a2234'); s.p(11, 13, BO); s.p(12, 12, BO);
  s.r(8, 5, 8, 2, K.dark); s.v(7, 6, 13, K.dark); s.v(16, 6, 13, K.dark); s.hl(8, 15, 7, K.dark);
  // cercle de fer, puis couronne de glace qui grandit
  s.hl(8, 15, 4, rank === 1 ? '#6a7480' : '#5a8ab0');
  const spikes = [[], [[9, 2], [12, 1], [14, 2]], [[8, 1], [10, 2], [12, 0], [13, 1], [15, 2]], [[8, 0], [10, 1], [12, 0], [13, 0], [15, 1], [7, 2], [16, 2]]][Math.min(3, rank - 1)];
  for (const [x, y] of spikes) s.v(x, y, 3, IC, true);
  if (rank >= 2) s.p(12, rank >= 3 ? 0 : 1, '#ffffff', true);
  // bâton : os, crâne gelé, grand cristal
  const top = [6, 4, 1, 0, 0][rank - 1];
  s.v(19, top + 6, 23, rank >= 3 ? '#4a5a7a' : BO);
  s.r(18, top + 4, 3, 2, BO); s.p(18, top + 4, '#2a2234', true); s.p(20, top + 4, '#2a2234', true);
  if (rank >= 2) { s.v(19, top, top + 3, IC, true); s.p(18, top + 2, IC, true); s.p(20, top + 1, IC, true); s.p(19, top, '#ffffff', true); }
  if (rank >= 4) { s.p(17, top + 1, IC, true); s.p(21, top + 2, ID, true); s.p(21, top, IC, true); }
  const out = s.recolor({ [C.skin]: BO, [C.skinSh]: '#b8ac90', ['#f0907a']: BO });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 4, '#8ad0e8'); out.hl(10, 13, 15, BO); out.p(9, 16, '#ffffff', true); out.p(14, 14, '#ffffff', true);
  for (const [x, y] of [[9, 0], [14, 0], [11, 0]]) out.v(x, y, 3, IC, true);
  return grand(out, (b) => {
    capeBack(b, '#c8f0ff', '#8ad0e8', '#ffffff');
    b.under(21, 2, IC); b.under(22, 1, IC); b.under(20, 1, ID);
  });
}

// ---------------------------------------------------------------- clins d'œil : My Hero Academia
// Leurs rangs suivent l'animé : uniforme de Yuei au rang 1, puis les costumes de héros successifs,
// jusqu'à leur forme la plus culte au rang 5.

// Uniforme de Yuei : veste grise, chemise blanche, cravate rouge, pantalon vert sombre.
const YUEI = { tunic: '#8a8e9a', dark: '#6a6e7a', trim: '#f2eef4', pants: '#2e4a3a', boots: '#6a3a2a', bootsHi: '#8a5a3a', sole: '#2a1a12', belt: '#2a2a32', buckle: '#8e99a4' };
function yuei(s, o = {}) {
  body(s, { ...YUEI, ...o });
  s.hl(10, 13, 14, '#f2eef4'); s.v(11, 15, 17, '#d83a3a'); s.v(12, 15, 16, '#d83a3a'); s.p(9, 15, '#6a6e7a'); s.p(14, 15, '#6a6e7a');
}

// Shoto : élève de Yuei, costume de héros au bras de glace, glace et feu au harnais argenté, flamme
// ardente (le côté gauche s'embrase) ; rang 5, le héros Shoto : tout le côté gauche se couvre d'une
// armure de glace, le côté droit brûle, la cicatrice rougeoie.
function shoto(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.shoto, HW = '#f2eef4', HR = '#d8402a', IC = '#8ae8ff', ICD = '#4ab8d8', F1 = '#ff8a2a', F2 = '#fbe08a';
  // glace qui couvre le côté gauche (dès le costume)
  if (rank >= 2) for (const [x, y] of rank >= 3 ? [[4, 9], [3, 11], [2, 14], [3, 17], [4, 20], [5, 12]] : [[4, 12], [3, 15], [4, 18]]) { s.v(x, y, y + 2, IC); s.p(x, y, '#ffffff', true); s.p(x + 1, y + 2, ICD); }
  if (rank === 1) yuei(s);
  else body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2a2a3a', bootsHi: '#4a4a5a', sole: '#141418', belt: '#b9c6d2', buckle: '#e4ecf3' });
  if (rank >= 2) { s.r(6, 14, 2, 3, IC); s.p(6, 14, '#ffffff', true); } // bras gauche givré
  if (rank >= 3) { s.v(9, 14, 17, K.trim); s.v(14, 14, 17, K.trim); s.hl(9, 14, 16, K.trim); s.p(10, 16, '#e4ecf3', true); } // harnais argenté
  // cheveux moitié blancs, moitié rouges (le rouge s'embrase au rang 4)
  s.r(8, 4, 4, 4, HW); s.r(12, 4, 4, 4, HR); s.hl(9, 11, 3, HW); s.hl(12, 14, 3, HR);
  s.v(7, 5, 11, HW); s.v(16, 5, 11, HR); s.p(8, 8, HW); s.p(9, 8, HW); s.p(14, 8, HR); s.p(15, 8, HR);
  s.p(9, 4, '#ffffff', true); s.p(13, 4, '#ff7a5a', true);
  if (rank >= 4) for (const [x, y] of [[13, 2], [14, 1], [15, 2], [16, 3], [12, 2]]) s.p(x, y, (x + y) % 2 ? F1 : HR);
  s.p(14, 9, '#b8606a'); s.p(14, 10, '#b8606a'); s.p(15, 10, '#b8606a'); s.p(14, 11, '#c87a7a');
  // flamme dans la main droite (plus grande avec le rang, bras entier en feu au rang 4)
  if (rank >= 2) {
    const cy = rank >= 3 ? 14 : 16;
    s.r(17, cy, 3, 3, F1, true); s.p(18, cy - 1, F1, true); s.p(18, cy - 2, F2, true); s.p(18, cy + 1, '#ffffff', true);
    if (rank >= 3) { s.p(19, cy - 2, '#e2334a', true); s.p(17, cy - 1, '#e2334a', true); s.p(20, cy + 1, F1, true); }
    if (rank >= 4) { s.v(16, 14, 17, F1, true); s.v(17, 13, 14, F2, true); s.p(20, cy - 3, F1, true); s.p(21, cy - 1, F2, true); }
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 4, 5, '#a8e8f8'); s.p(9, 15, '#ffffff', true); s.p(10, 17, ICD); s.v(7, 4, 6, IC, true);
  s.r(12, 14, 4, 5, '#e86a3a'); s.p(13, 15, F2, true); s.p(14, 17, F1, true);
  return grand(s, (b) => {
    for (const [x, y] of [[4, 12], [3, 14], [5, 10]]) { b.under(x, y, IC); b.under(x, y + 1, '#ffffff'); }
    for (const [x, y] of [[23, 12], [24, 14], [22, 10]]) { b.under(x, y, F1); b.under(x, y + 1, F2); }
  });
}

// Bakugo : élève de Yuei qui crépite déjà, costume aux gantelets-grenades, X orange et grands
// gantelets, AP Shot (gantelets dorés à canon) ; rang 5, Howitzer Impact : gantelets énormes qui
// explosent, flammes dans les paumes, masque d'explosion, costume de pro.
function bakugo(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.bakugo, H = '#f0e0a0', HS = '#c8b070', O = K.trim, GR = '#e8702a', MT = '#b9c6d2';
  if (rank === 1) yuei(s, { mouth: false });
  else body(s, { tunic: K.main, dark: K.dark, trim: '#4a3e5a', pants: K.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', mouth: false, belt: GR, buckle: MT });
  if (rank >= 2) { s.sline(9, 14, 14, 17, O); s.sline(14, 14, 9, 17, O); }
  if (rank >= 3) { s.hl(8, 15, 14, O); s.p(8, 18, MT); s.p(15, 18, MT); }
  // grimace furieuse, sourcils froncés
  s.hl(10, 13, 12, '#ffffff'); s.hl(10, 13, 13, '#6a2a2a');
  s.p(9, 9, HS); s.p(10, 9, '#21182a'); s.p(13, 9, '#21182a'); s.p(14, 9, HS);
  // cheveux en pétard
  s.r(8, 4, 8, 4, H);
  for (const [x, y] of [[7, 4], [6, 6], [8, 2], [9, 3], [10, 1], [12, 2], [13, 1], [14, 2], [16, 3], [17, 5], [16, 4], [7, 7], [6, 8], [16, 8], [17, 8]]) s.p(x, y, H);
  s.v(7, 5, 10, H); s.v(16, 5, 10, H); s.p(8, 8, H); s.p(11, 8, H); s.p(15, 8, H);
  s.p(10, 4, HS); s.p(13, 5, HS); s.p(9, 5, '#fff8d0', true);
  if (rank >= 2) { s.hl(8, 15, 7, '#2a2234'); s.p(9, 7, O); s.p(14, 7, O); } // masque noir à bords orange
  if (rank === 1) { for (const [x, y] of [[18, 17], [19, 16], [5, 17]]) s.p(x, y, '#ffb030', true); s.p(18, 16, '#ffffff', true); return s; } // étincelles dans les paumes
  // gantelets-grenades : normaux, grands, puis canons AP
  const G = rank >= 4 ? '#e0a93a' : GR, big = rank >= 3;
  for (const x0 of [4, 16]) {
    s.hl(x0 + 1, x0 + 2, 15, G); s.r(x0, 16, 4, big ? 5 : 4, G); s.hl(x0 + 1, x0 + 2, big ? 21 : 20, G);
    s.hl(x0, x0 + 3, 16, MT); s.p(x0 + 1, 17, rank >= 4 ? '#fbe08a' : '#ffa060', true);
    s.p(x0 + (x0 < 10 ? 0 : 3), 14, MT); s.p(x0 + (x0 < 10 ? 0 : 3), 13, '#e4ecf3', true);
  }
  if (rank >= 4) { s.hl(20, 22, 18, MT); s.p(23, 18, '#ffb030', true); s.p(22, 17, MT); } // canon
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[2, 15], [3, 14], [21, 15], [20, 14], [2, 21], [21, 21]]) s.p(x, y, (x + y) % 2 ? '#ffb030' : '#fff0a0', true);
  s.hl(9, 14, 18, '#e8702a');
  return grand(s, (b) => {
    for (const [x, y] of [[3, 19], [2, 20], [26, 19], [25, 20], [4, 18], [24, 18]]) b.p(x, y, (x + y) % 2 ? '#ff6a1f' : '#fbe08a', true);
  });
}

// Red Riot : élève de Yuei aux cheveux en lames, costume torse nu aux épaulières crantées, bras
// durcis, Red Riot Unbreakable (tout son corps devient roche) ; rang 5, Red Riot Unbreakable au
// maximum : tout son corps est roche hérissée de pointes.
function redriot(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.redriot, H = '#e2334a', HS = '#a8203a', RK = '#a8a0a8', RL = '#d8d0d8', RD = '#7a7280';
  if (rank === 1) yuei(s, { mouth: false });
  else body(s, { tunic: C.skin, dark: C.skinSh, trim: C.skin, pants: K.pants, boots: '#2a2234', bootsHi: '#4a3e5a', sole: '#140d11', mouth: false, belt: H, buckle: '#2a2234' });
  if (rank >= 2) { s.p(10, 16, C.skinSh); s.p(13, 16, C.skinSh); s.p(11, 15, C.skinSh); s.p(12, 15, C.skinSh); s.r(8, 19, 8, 1, K.main); s.p(10, 20, H); s.p(13, 20, H); }
  s.hl(10, 13, 12, '#ffffff'); s.p(10, 13, '#ffffff'); s.p(12, 13, '#ffffff'); s.p(11, 13, '#6a2a2a'); s.p(13, 13, '#6a2a2a');
  s.v(9, 9, 10, '#c87a6a');
  // cheveux rouges dressés en lames
  s.r(8, 4, 8, 3, H);
  for (const [x0, top] of [[8, 1], [11, 0], [14, 1]]) for (let y = top; y < 4; y++) s.hl(x0, x0 + Math.min(2, y - top), y, H);
  s.v(7, 4, 9, H); s.v(16, 5, 9, H); s.hl(8, 15, 7, H); s.p(16, 3, H); s.p(17, 4, H);
  s.p(8, 2, '#ff7a8a', true); s.p(11, 1, '#ff7a8a', true); s.p(13, 5, HS); s.p(10, 4, HS);
  if (rank >= 2) {
    // épaulières crantées noires et rouges
    for (const x of [4, 16]) { s.r(x, 13, 4, 3, K.main); s.hl(x, x + 3, 13, H); }
    s.p(3, 13, H); s.p(20, 13, H); s.p(4, 12, H); s.p(19, 12, H);
  }
  if (rank >= 3) for (const x of [6, 16]) { s.v(x, 16, 19, RK); s.v(x + 1, 16, 19, RK); s.p(x, 16, RL, true); s.p(x + 1, 18, RD); } // bras durcis
  if (rank >= 4) {
    // tout le corps en roche : arêtes sur le torse et le visage
    s.r(8, 14, 8, 5, RK); for (const [x, y] of [[9, 14], [12, 15], [14, 17], [10, 17]]) s.p(x, y, RL, true); for (const [x, y] of [[11, 16], [13, 14], [9, 18]]) s.p(x, y, RD);
    s.p(8, 10, RK); s.p(15, 10, RK); s.p(8, 11, RD); s.p(15, 11, RD);
    for (const [x, y] of [[3, 14], [20, 14], [5, 19], [18, 19]]) s.p(x, y, RK);
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[8, 14], [15, 14], [8, 18], [15, 18]]) s.p(x, y, RL, true);
  for (const [x, y] of [[7, 15], [16, 15], [6, 18], [17, 18], [9, 20], [14, 20]]) s.p(x, y, RK);
  s.r(8, 8, 8, 1, RK); s.p(9, 8, RL, true);
  return grand(s, (b) => {
    for (const [x, y] of [[4, 16], [3, 17], [23, 16], [24, 17], [10, 3], [17, 3]]) b.under(x, y, RK);
  });
}

// Deku : élève de Yuei au gros sac à dos jaune, costume vert à capuche à oreilles, Full Cowl (des
// éclairs verts courent sur lui), costume bêta aux gantelets et au Blackwhip ; rang 5, One For All
// à 100 % : des éclairs verts le parcourent tout entier, yeux qui brillent, Blackwhip qui jaillit
// des bras.
function deku(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.deku, H = '#2a5a3a', HH = '#4a8a5a', GL = '#5af08a', BP = '#f0c030', BW = '#2a2234';
  if (rank === 1) { s.r(5, 11, 4, 7, BP); s.p(5, 11, '#fff0a0', true); s.hl(5, 8, 14, '#c89020'); } // sac à dos jaune
  if (rank >= 2) { s.v(7, 2, 5, K.dark); s.p(6, 1, K.dark); s.v(16, 2, 5, K.dark); s.p(17, 1, K.dark); } // capuche à oreilles
  if (rank === 1) yuei(s, { boots: '#d83a3a', bootsHi: '#ff8a8a', sole: '#f2eef4' });
  else body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#d83a3a', bootsHi: '#ff8a8a', sole: '#f2eef4', belt: '#e2334a', buckle: '#e4ecf3' });
  if (rank >= 2) { s.v(11, 15, 17, K.trim); s.p(9, 20, K.trim); s.p(14, 20, K.trim); }
  // cheveux verts en bataille, taches de rousseur
  s.r(8, 4, 8, 4, H);
  for (const [x, y] of [[8, 3], [10, 2], [11, 3], [13, 2], [15, 3], [7, 6], [16, 6]]) s.p(x, y, H);
  s.v(7, 7, 10, H); s.v(16, 7, 10, H); s.p(8, 8, H); s.p(10, 8, H); s.p(13, 8, H); s.p(15, 8, H);
  s.p(9, 5, HH, true); s.p(12, 4, HH, true); s.p(14, 6, HH, true);
  s.p(9, 11, '#c8806a', true); s.p(14, 11, '#c8806a', true);
  // gants : blancs, puis gantelets du costume bêta
  if (rank >= 2) { s.r(16, 16, 3, 3, rank >= 4 ? '#b9c6d2' : '#f2eef4'); s.hl(16, 18, 18, '#e2334a'); s.p(16, 16, '#ffffff', true); }
  if (rank >= 4) { s.r(5, 16, 3, 3, '#b9c6d2'); s.hl(5, 7, 18, '#e2334a'); s.p(5, 16, '#ffffff', true); }
  if (rank >= 3) for (const [x, y] of [[19, 12], [20, 13], [19, 14], [21, 15], [5, 13], [4, 14], [20, 18], [9, 19], [14, 16]]) s.p(x, y, GL, true); // Full Cowl
  if (rank >= 4) for (const [x0, y0, x1, y1] of [[18, 17, 22, 20], [22, 20, 23, 23], [6, 17, 2, 20], [2, 20, 1, 23]]) s.sline(x0, y0, x1, y1, BW); // Blackwhip
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.p(10, 10, GL, true); s.p(13, 10, GL, true);
  for (const [x, y] of [[8, 15], [15, 17], [10, 20], [13, 22], [7, 9], [16, 9], [9, 3], [14, 2]]) s.p(x, y, GL, true);
  return grand(s, (b) => {
    for (const [x0, y0, x1, y1] of [[5, 21, 0, 14], [22, 21, 27, 14], [6, 22, 1, 27], [21, 22, 26, 27]]) b.sline(x0, y0, x1, y1, BW);
  });
}

// All Might : Toshinori (sa forme maigre, chemise trop grande), Young Age (costume blanc et bleu),
// Bronze Age (costume rouge et brun), Silver Age (costume argenté) ; rang 5, Golden Age : carrure
// encore plus énorme, cape de héros rouge, poing qui fume, grand sourire.
function allmight(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.allmight, H = '#f8d850', HS = '#d8a830', Y = '#f0c030';
  if (rank === 1) {
    // Toshinori : chemise jaune trop grande, joues creuses, filet de sang
    body(s, { tunic: '#e8d070', dark: '#c8a850', trim: '#e8d070', pants: '#6a7a6a', boots: '#4a3a2a', bootsHi: '#6a5a4a', sole: '#2a1a12', mouth: false, belt: '#3a2a2a', buckle: '#8e99a4' });
    s.r(8, 4, 8, 4, H); s.v(7, 5, 10, H); s.v(16, 5, 10, H); s.sline(10, 4, 8, 0, H); s.sline(13, 4, 15, 0, H); s.p(9, 8, H); s.p(14, 8, H);
    s.hl(9, 14, 9, '#5a4a5a'); s.v(10, 10, 11, '#21182a', true); s.v(13, 10, 11, '#21182a', true); s.p(9, 12, '#c8a088'); s.p(14, 12, '#c8a088');
    s.hl(10, 13, 12, '#a8584a'); s.v(10, 13, 14, '#c8323c', true);
    return s;
  }
  const suit = [null, null, ['#f2eef4', '#c8c0d0', '#2a5ad8', '#2a5ad8'], ['#a83a2a', '#7a2a1a', '#e0a93a', '#5a3a2a'], ['#b9c6d2', '#8e99a4', '#2a5ad8', '#8e99a4'], [K.main, K.dark, K.trim, K.pants]][rank];
  body(s, { tunic: suit[0], dark: suit[1], trim: suit[2], pants: suit[3], boots: rank >= 5 ? '#e2334a' : suit[1], bootsHi: '#ffffff', sole: '#2a2234', mouth: false, cape: rank === 3 && '#2a5ad8', belt: Y, buckle: '#ffffff' });
  // carrure énorme
  for (const x of [5, 16]) s.r(x, 13, 3, 3, suit[0]);
  s.hl(9, 14, 14, rank >= 4 ? '#f2eef4' : suit[2]); s.hl(10, 13, 15, rank >= 4 ? '#f2eef4' : suit[2]); s.p(11, 16, suit[2]); s.p(12, 16, suit[2]);
  s.p(9, 17, '#e2334a'); s.p(14, 17, '#e2334a');
  // cheveux, les deux mèches en V (plus hautes au rang 5)
  s.r(8, 4, 8, 4, H); s.v(7, 5, 10, H); s.v(16, 5, 10, H);
  const t = rank >= 5 ? 0 : 1;
  s.sline(10, 4, 7, t, H); s.sline(11, 4, 8, t, H); s.sline(13, 4, 16, t, H); s.sline(12, 4, 15, t, H);
  s.p(8, t + 1, '#fff8c0', true); s.p(15, t + 1, '#fff8c0', true); s.p(9, 8, H); s.p(14, 8, H); s.p(11, 8, H); s.p(12, 8, H);
  // ombre sur les yeux, grand sourire
  s.hl(9, 14, 9, '#a87850'); s.hl(10, 13, 12, '#ffffff'); s.p(9, 12, '#a8584a'); s.p(14, 12, '#a8584a'); s.hl(10, 13, 13, '#a8584a'); s.p(12, 12, '#e8e0d8');
  // poing en avant (rouge au rang 5)
  s.r(17, 15, 4, 4, rank >= 5 ? '#e2334a' : suit[2]); s.p(17, 15, '#ffffff', true); s.hl(17, 20, 18, Y);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.p(21, 14, '#ffffff', true); s.p(22, 13, '#e8e0d8', true); s.p(21, 12, '#ffffff', true);
  return grand(s, (b) => {
    capeBack(b, '#e2334a', '#a82030', '#f0c030');
  });
}

// ---------------------------------------------------------------- clins d'œil : Hunter × Hunter
// Leurs rangs suivent les arcs de l'animé, jusqu'à leur forme la plus culte au rang 5.

// Mèche en pointe : triangle plein de la pointe (tx, ty) à la base [x0, x1] sur la rangée by.
function meche(s, tx, ty, x0, x1, by, c) {
  for (let y = ty; y <= by; y++) {
    const t = (y - ty) / (by - ty);
    s.hl(Math.round(tx + (x0 - tx) * t), Math.round(tx + (x1 - tx) * t), y, c);
  }
}

// Gon : examen Hunter (canne à pêche, badge 405), Tour céleste (bras bandé), Greed Island (le
// Jajanken : poing de nen jaune), fourmis-chimères (mâchoire serrée, aura qui monte) ; rang 5, Gon
// adulte : ses cheveux poussent jusqu'au sol, musculature d'adulte, poing de nen énorme qui brûle.
function gon(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.gon, H = '#1e2622', HH = '#3a6a3a', NEN = '#f8d850', adult = rank >= 5;
  // Gon adulte : la crinière tombe derrière lui jusqu'au sol
  if (adult) { s.r(6, 8, 12, 15, H); s.hl(5, 18, 22, H); for (const x of [6, 9, 14, 17]) s.p(x, 20, HH); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#2f6a2a', bootsHi: '#5aa84a', sole: '#3a2a22', mouth: false, belt: '#4a3a2a', buckle: '#b9c6d2' });
  // short vert : les genoux nus au-dessus des bottes
  s.p(9, 21, C.skin); s.p(14, 21, C.skin);
  // badge de l'examen (n° 405) sur la veste
  s.r(13, 15, 2, 2, '#f2eef4', true); s.p(14, 16, '#e2334a', true);
  // cheveux en grandes pointes dressées, reflets verts
  s.r(8, 4, 8, 4, H);
  for (const [tx, ty, x0, x1] of [[5, 2, 7, 10], [9, -1, 8, 13], [14, adult ? -1 : 0, 11, 16], [19, 3, 15, 17]]) meche(s, tx, ty, x0, x1, 6, H);
  s.p(8, 8, H); s.p(15, 8, H); s.v(7, 8, 10, H); s.v(16, 8, 10, H);
  s.p(9, 2, HH, true); s.p(14, 3, HH, true); s.p(7, 4, HH, true); s.p(17, 5, HH, true);
  // grand sourire, ou mâchoire serrée quand le nen monte
  if (rank >= 4) { s.p(9, 9, H); s.p(14, 9, H); }
  s.hl(11, 12, 12, rank >= 4 ? '#6a2a2a' : C.mouth, true);
  if (rank === 2) { s.r(6, 15, 2, 3, '#f2eef4'); s.p(6, 15, '#ffffff', true); s.sline(7, 14, 14, 14, '#f2eef4'); } // bras bandé
  if (rank <= 2) {
    // canne à pêche à droite, le fil et le flotteur pendent
    s.v(18, 3, 20, C.wood); s.p(18, 4, '#a8865f', true); s.p(18, 21, C.grip);
    s.sline(18, 2, 21, 0, C.wood); s.v(22, 1, 7, '#e8e0d0', true); s.r(22, 8, 1, 2, '#e2334a', true); s.p(22, 8, '#ffffff', true);
    if (rank === 2) { s.r(17, 16, 3, 2, '#b9c6d2'); s.p(17, 16, '#e4ecf3', true); }
  } else {
    // Jajanken « Pierre » : poing droit chargé de nen, aura jaune qui grandit
    const A = rank >= 4 ? '#fff0a0' : NEN;
    s.r(17, 14, 4, 4, C.skin); s.p(17, 14, '#f8d4b4', true); s.v(20, 15, 16, C.skinSh);
    for (const [x, y] of [[16, 13], [18, 12], [20, 12], [21, 14], [21, 17], [19, 18], [16, 18]]) s.p(x, y, A, true);
    if (rank >= 4 || adult) for (const [x, y] of [[19, 10], [22, 12], [22, 16], [5, 12], [4, 15]]) s.p(x, y, A, true);
    for (const [x, y] of [[22, 11], [15, 12]]) s.spark(x, y, '#ffffff');
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(6, 14, 2, 3, C.skin); s.p(6, 14, '#f8d4b4', true);
  for (const [x, y] of [[16, 12], [18, 11], [20, 11], [22, 13], [22, 17], [20, 19], [16, 19], [21, 15]]) s.p(x, y, '#fff0a0', true);
  return grand(s, (b) => {
    for (let x = 4; x <= 23; x++) b.under(x, 27, H);
  });
}

// Kirua : examen Hunter (skate), yo-yo d'acier, main d'assassin (Rhythm Echo), foudre de Kanmuru ;
// rang 5, Godspeed : cheveux dressés et bleutés par la foudre, éclairs qui lui parcourent tout le
// corps, griffes d'assassin.
function kirua(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.kirua, god = rank >= 5;
  const H = god ? '#c8e8ff' : '#eef0f4', HS = god ? '#6ab8ff' : '#b8c0d0', EL = '#6ac8ff';
  // skate debout derrière lui, à gauche : planche, roues
  if (rank <= 3) {
    s.r(3, 9, 2, 12, '#3a3a5a'); s.v(3, 10, 19, '#5a4aa8'); s.p(3, 9, '#7a6ac8', true);
    for (const y of [11, 18]) { s.p(5, y, '#e2c83a'); s.p(2, y, '#e2c83a'); }
  }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#5a3a9a', bootsHi: '#8a6ac8', sole: '#2a2234', mouth: false, belt: K.trim, buckle: '#b9c6d2' });
  // manches longues violettes sous le t-shirt blanc
  for (const x of [6, 16]) { s.r(x, 15, 2, 3, K.trim); s.hl(x, x + 1, 14, K.main); }
  s.p(9, 21, C.skin); s.p(14, 21, C.skin);
  // yeux bleus, sourire de chat
  s.v(10, 10, 11, '#2a5ab8', true); s.v(13, 10, 11, '#2a5ab8', true); s.p(10, 10, '#21182a', true); s.p(13, 10, '#21182a', true);
  s.p(11, 12, C.mouth, true); s.p(12, 13, C.mouth, true); s.p(13, 12, C.mouth, true);
  // cheveux blancs ébouriffés, pointes dans tous les sens
  const tips = god
    ? [[4, 3, 6, 8, 6], [7, 0, 8, 10, 4], [11, -1, 10, 13, 4], [15, 0, 13, 15, 4], [19, 3, 15, 17, 6], [3, 8, 6, 6, 9], [20, 8, 17, 17, 9]]
    : [[5, 4, 6, 8, 6], [8, 1, 8, 10, 4], [11, 0, 10, 13, 4], [15, 1, 13, 15, 4], [18, 4, 15, 17, 6], [4, 9, 6, 6, 9], [19, 9, 17, 17, 9]];
  s.r(7, 4, 10, 4, H);
  for (const [tx, ty, x0, x1, by] of tips) meche(s, tx, ty, x0, x1, by, H);
  s.v(6, 5, 10, H); s.v(17, 5, 10, H); s.v(7, 8, 10, H); s.v(16, 8, 10, H);
  for (const x of [8, 10, 12, 14, 15]) s.p(x, 8, H);
  s.p(9, 5, HS); s.p(13, 6, HS); s.p(15, 5, HS); s.p(11, 4, '#ffffff', true);
  if (rank === 2) {
    // yo-yo de métal au bout de son fil, main droite
    s.v(18, 18, 20, '#e8e0d0', true); s.r(18, 20, 3, 3, '#b9c6d2'); s.p(18, 20, '#e4ecf3', true); s.p(19, 21, '#8e99a4');
  }
  if (rank >= 3) {
    // main de tueur : doigts en griffes
    for (const x of [16, 17, 18]) s.v(x, 18, 20, '#f8d4b4'); s.p(16, 21, '#ffffff', true); s.p(18, 21, '#ffffff', true); s.p(19, 19, '#ffffff', true);
  }
  if (rank >= 4) {
    // la foudre crépite autour de lui
    const bolts = god
      ? [[20, 2], [21, 3], [20, 4], [21, 5], [3, 4], [2, 5], [3, 6], [21, 12], [22, 13], [21, 14], [2, 12], [1, 13], [2, 14], [4, 18], [20, 17]]
      : [[20, 6], [21, 7], [20, 8], [3, 9], [2, 10], [3, 11], [21, 14], [20, 15]];
    for (const [x, y] of bolts) s.p(x, y, EL, true);
    s.spark(21, god ? 1 : 5, '#ffffff'); s.spark(2, god ? 3 : 8, '#ffffff');
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  for (const [x, y] of [[8, 15], [15, 17], [10, 20], [14, 21], [7, 9], [16, 9]]) s.p(x, y, EL, true);
  return grand(s, (b) => {
    for (const [x, y] of [[3, 6], [2, 7], [3, 8], [24, 6], [25, 7], [24, 8], [3, 18], [24, 18]]) b.under(x, y, EL);
  });
}

// Hisoka : une carte, puis deux, puis l'éventail et le Bungee Gum rose, puis le joker ; rang 5, le
// magicien suprême : cheveux dressés plus haut, Bungee Gum enroulé aux deux mains, éventail de
// cartes et joker, costume de bouffon.
function hisoka(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.hisoka, H = '#e2405a', HS = '#a82a48', GUM = '#ff7ac8', loose = rank >= 5;
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#6a2a8a', bootsHi: '#9a4ac8', sole: '#2a1a34', mouth: false, cape: rank >= 4 && '#6a2a8a', belt: K.trim, buckle: '#e0a93a' });
  // pique et cœur sur le haut, comme des cartes
  s.p(9, 15, '#2a2234'); s.hl(8, 10, 16, '#2a2234'); s.p(9, 17, '#2a2234');
  s.p(13, 15, '#e2334a'); s.p(15, 15, '#e2334a'); s.hl(13, 15, 16, '#e2334a'); s.p(14, 17, '#e2334a');
  // yeux dorés sous la paupière, sourcils relevés, sourire en coin
  for (const x of [10, 13]) s.p(x, 11, '#e0a93a', true);
  s.p(9, 9, HS); s.p(14, 9, HS);
  s.p(11, 12, C.mouth, true); s.p(12, 12, C.mouth, true);
  // larme (à gauche) et étoile (à droite) maquillées
  s.p(9, 12, '#4a8ad8', true); s.p(9, 13, '#2a5ab8', true);
  s.p(14, 12, '#f0c030', true); s.p(15, 12, '#fff0a0', true); s.p(14, 13, '#c89020', true);
  // cheveux plaqués qui se dressent en flammes vers l'arrière (plus hautes au rang 5)
  s.r(8, 5, 8, 2, H);
  for (const [tx, ty, x0, x1] of [[5, loose ? 0 : 1, 7, 10], [9, loose ? -2 : -1, 9, 13], [14, 1, 12, 16]]) meche(s, tx, ty, x0, x1, 5, H);
  s.v(7, 5, 9, H); s.v(16, 5, 9, H);
  s.p(8, 3, HS); s.p(11, 3, HS); s.p(14, 4, HS); s.p(7, 2, '#ff8a9a', true); s.p(10, 2, '#ff8a9a', true); s.p(13, 2, '#ff8a9a', true);
  // cartes en éventail dans la main droite (plus nombreuses avec le rang)
  const n = Math.min(4, rank), E = rank >= 4 ? '#e0a93a' : '#c8c0d0';
  for (let i = 0; i < n; i++) {
    const x = 17 + i, y = 13 - i;
    s.r(x, y, 2, 4, '#f8f4f8'); s.p(x + 1, y + 3, E); s.p(x, y + 1, i % 2 ? '#e2334a' : '#2a2234', true);
  }
  if (rank >= 4) s.p(20, 10, C.gem, true); // le joker
  if (rank >= 3) {
    // Bungee Gum : fil de nen rose collant qui part de la main gauche
    s.sline(6, 18, 3, 13, GUM, true); s.sline(3, 13, 5, 9, GUM, true); s.p(4, 8, GUM, true); s.p(5, 18, '#ffc8e8', true);
    s.spark(2, 11, '#ffc8e8');
  }
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 18, 8, 2, '#8a3aa8'); for (const x of [9, 12, 15]) s.p(x, 19, '#f0c030', true);
  s.sline(17, 19, 22, 21, GUM, true); s.p(22, 20, GUM, true);
  return grand(s);
}

// Netero : vieux maître aux mains jointes, chapelet au cou, une main dorée du Bodhisattva derrière
// lui au rang 3, quatre au rang 4 ; rang 5, Hyakushiki Kannon : gi blanc de combat, ses mains
// dorées deviennent plus grandes et plus nombreuses, chapelet de grosses perles.
function netero(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.netero, W = '#ffffff', WS = '#c8c8d8', GO = '#e8b84a', GH = '#fbe08a', GD = '#c08a28';
  // le Bodhisattva : mains dorées derrière lui
  // main ouverte, trois doigts écartés vers le haut, pouce sur le côté (o = -1 : pouce à gauche)
  const palm = (x, y, o = 1) => {
    [1, 0, 1].forEach((d, i) => { s.v(x + i * 2, y + d, y + 3, GO); s.p(x + i * 2, y + d, GH, true); });
    s.r(x, y + 4, 5, 3, GO); s.hl(x + 1, x + 3, y + 7, GO); s.v(o > 0 ? x + 5 : x - 1, y + 4, y + 5, GO);
    s.p(x + 1, y + 5, GD); s.p(x + 3, y + 5, GD);
  };
  if (rank >= 3) palm(19, 2, -1);
  if (rank >= 4) { palm(1, 2); palm(20, 12, -1); palm(0, 12); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.dark, pants: K.pants, boots: '#6a5a48', bootsHi: '#8a7a68', sole: '#3a2a22', mouth: false, belt: K.trim, buckle: '#8a5a32' });
  // crâne chauve, petit chignon blanc
  s.r(8, 6, 8, 1, C.skin); s.hl(9, 14, 5, C.skin); s.p(10, 5, '#f8d4b4', true); s.p(9, 6, '#f8d4b4', true);
  s.r(11, 3, 2, 2, W); s.p(11, 3, WS);
  // longs sourcils qui tombent, yeux plissés
  for (const x of [10, 13]) s.p(x, 10, C.skin);
  s.hl(9, 10, 9, W); s.p(8, 10, W); s.hl(13, 14, 9, W); s.p(15, 10, W);
  // longue moustache et barbe blanches jusqu'à la poitrine
  s.hl(9, 14, 12, W); s.p(9, 13, W); s.p(14, 13, W);
  s.r(10, 13, 4, 1, W); s.hl(11, 12, 14, W); s.p(10, 13, WS); s.p(13, 13, WS); s.p(12, 14, WS);
  // perles du chapelet au cou
  if (rank >= 2) { s.p(9, 14, '#8a5a32'); s.p(14, 14, '#8a5a32'); s.p(9, 15, '#8a5a32'); s.p(14, 15, '#8a5a32'); s.p(9, 14, '#c8945a', true); }
  // les mains jointes devant la poitrine (gasshō), avant-bras repliés
  for (const x of [6, 16]) { s.p(x, 18, null); s.p(x + 1, 18, null); s.p(x, 19, null); s.p(x + 1, 19, null); }
  s.hl(8, 10, 17, K.dark); s.hl(13, 15, 17, K.dark);
  s.r(11, 15, 2, 3, C.skin); s.p(11, 15, '#f8d4b4', true); s.p(12, 17, C.skinSh);
  if (rank >= 4) for (const [x, y] of [[21, 3], [2, 3], [22, 10]]) s.spark(x, y, GH);
  if (rank < 5) return s;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  s.r(8, 14, 8, 5, '#f2eef4'); s.sline(8, 14, 12, 18, '#c8bca4'); s.r(11, 15, 2, 3, C.skin);
  for (const x of [9, 14]) { s.p(x, 14, '#8a5a32'); s.p(x, 16, '#8a5a32'); }
  return grand(s, (b) => {
    const palm = (x, y) => { [1, 0, 1].forEach((d, i) => b.v(x + i * 2, y + d, y + 3, GO)); b.r(x, y + 4, 5, 3, GO); b.p(x + 1, y, GH, true); };
    palm(1, 0); palm(22, 0); palm(0, 20); palm(23, 20);
  });
}

// Meruem : le roi qui vient de naître (queue courte), le roi qui grandit (brassards), le roi à la
// cape, le roi couronné ; rang 5, le roi éveillé : ses ailes d'insecte se déploient, carapace plus
// massive, couronne, queue au dard violet.
function meruem(rank) {
  const s = new Spr(24, 24), K = NEW_CLASS.meruem, SK = '#c8dcd0', SS = '#8aa89a', A = '#2a3a3a', AU = '#b87af0';
  // la longue queue à dard, derrière lui à gauche
  const tail = rank >= 3 ? [[7, 19], [6, 19], [5, 18], [4, 17], [3, 16], [3, 15], [3, 14], [3, 13], [4, 12]] : [[7, 19], [6, 19], [5, 18], [4, 17], [4, 16], [4, 15]];
  for (const [x, y] of tail) { s.p(x, y, K.main); s.p(x + 1, y, K.dark); }
  const [tx, ty] = tail[tail.length - 1];
  s.v(tx, ty - 3, ty - 1, rank >= 4 ? AU : SK); s.p(tx, ty - 3, '#ffffff', true);
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: SK, bootsHi: '#e8f4ec', sole: SS, mouth: false, cape: rank >= 3 && '#4a2386', belt: K.dark, buckle: K.trim });
  // carapace segmentée sur le torse
  s.hl(9, 14, 15, K.dark); s.hl(9, 14, 17, K.dark); s.v(11, 15, 17, K.trim); s.v(12, 15, 17, K.trim);
  // tête casquée : crête au milieu, côtés qui descendent
  s.r(8, 4, 8, 4, SK); s.hl(9, 14, 3, SK); s.v(7, 6, 11, SK); s.v(16, 6, 11, SK);
  s.v(11, 2, 7, SS); s.v(12, 2, 7, SS); s.p(11, 1, SK); s.p(12, 1, SK); s.p(9, 4, '#ffffff', true);
  s.hl(8, 15, 8, SS);
  // deux longues antennes qui partent vers l'arrière
  s.sline(10, 3, 7, 0, A); s.sline(13, 3, 16, 0, A); s.p(6, 0, A); s.p(17, 0, A);
  // regard sévère, traits sombres sur les joues
  s.p(9, 10, A); s.p(14, 10, A); s.v(10, 10, 11, '#3a8a5a', true); s.v(13, 10, 11, '#3a8a5a', true); s.p(10, 10, C.eye, true); s.p(13, 10, C.eye, true);
  s.v(9, 12, 13, '#6a5a8a', true); s.v(14, 12, 13, '#6a5a8a', true); s.hl(11, 12, 12, SS, true);
  if (rank >= 2) { s.hl(6, 7, 16, K.trim); s.hl(16, 17, 16, K.trim); }
  if (rank >= 4) { s.hl(9, 14, 5, '#e0a93a'); s.p(9, 4, '#e0a93a'); s.p(14, 4, '#e0a93a'); s.r(11, 4, 2, 1, AU, true); }
  // griffes aux mains
  s.p(6, 19, '#ffffff'); s.p(17, 19, '#ffffff');
  const out = s.recolor({ [C.skin]: SK, [C.skinSh]: SS, [BLUSH]: SK });
  if (rank < 5) return out;
  // rang 5 : la forme ultime du héros lui-même (aucun décor)
  out.r(8, 14, 8, 4, '#2e5a52'); out.hl(9, 14, 15, '#1e3a36'); out.hl(9, 14, 17, '#1e3a36'); out.p(11, 16, AU, true); out.p(12, 16, AU, true);
  out.p(10, 10, AU, true); out.p(13, 10, AU, true);
  return grand(out, (b) => {
    for (const d of [-1, 1]) for (let i = 0; i < 6; i++) { const x = 14 + d * (5 + i), y0 = 8 + i; for (let y = y0; y <= y0 + 7 - i; y++) b.under(x, y, y === y0 ? '#6a8a8a' : (x + y) % 3 ? '#3a5a5a' : '#8ab0b0'); }
  });
}

export const NEW_DRAW = {
  brann, mira, nina, pip, gus, lenny, vex, gideon, aurelia, nova,
  rok, tobo, hugo, kiki, bjorn, sven, astra, nyx, ignis, drakon,
  tess, doc, ozzy, yuki, sylva, thorn, gorm, zara, kitsune, sybil,
  grumli, spike, bip, lulu, djmax, pablo, bob, zip, rexy, leo,
  tonnerre, ramses, elixa, mako, pixel, lumi, kero, atlas, pyra, mortis,
  shoto, bakugo, redriot, deku, allmight,
  gon, kirua, hisoka, netero, meruem,
};
