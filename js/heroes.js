// Les nouveaux héros (après les cinq premiers de js/sprites.js). Même gabarit chibi 24×24 (`body`),
// mêmes règles : docs/DIRECTION_ARTISTIQUE.md. Chaque héros a ses couleurs (NEW_CLASS) et son
// dessin pour les rangs 1 à 4 ; le rang 5 Céleste est fabriqué par js/sprites.js.
import { Spr } from './spr.js';
import { C, METALS, BLUSH, body, pauldrons, tiara, boots, shade2 } from './chibi.js';

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
};

const trimOf = (K, rank) => (rank >= 4 ? C.gold : K.trim);
const W = '#f2eef4';

// ---------------------------------------------------------------- vague 1

// Brann, chevalier : heaume ouvert à couvre-joues, grand bouclier à gauche, masse d'armes à droite.
function brann(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.brann, dk = shade2(m.c);
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: m.c });
  // heaume : calotte ronde, bord, couvre-joues ; la face reste visible
  s.r(8, 3, 8, 4, m.c);
  s.hl(9, 14, 2, m.c);
  s.hl(7, 16, 7, m.c);
  s.v(7, 8, 12, m.c); s.v(16, 8, 12, m.c);
  s.p(9, 3, m.hi, true); s.p(10, 2, m.hi, true); s.p(7, 8, m.hi, true);
  s.p(10, 5, dk); s.p(13, 5, dk); s.hl(8, 15, 6, dk);
  if (rank === 2) s.hl(11, 12, 1, K.main);
  if (rank === 3) { s.hl(10, 13, 1, K.main); s.hl(11, 12, 0, K.main); s.p(11, 0, K.trim, true); }
  if (rank >= 4) {
    for (const x of [8, 10, 13, 15]) s.p(x, 2, C.gold);
    s.p(10, 1, C.goldHi, true); s.p(13, 1, C.goldHi, true);
    s.r(11, 3, 2, 2, C.gem, true); s.p(11, 3, '#ff8a9a', true);
  }
  if (rank >= 3) pauldrons(s, m);
  // masse d'armes à droite : manche gainé, tête de métal (à ailettes dès le rang 3)
  const big = rank >= 3, top = big ? 5 : 8;
  s.v(18, top + 3, 20, C.grip);
  s.p(18, 20, '#7a5a3a', true);
  s.r(17, top, 3, big ? 4 : 3, m.c);
  s.p(17, top, m.hi, true);
  if (big) { s.p(16, top + 1, m.c); s.p(20, top + 1, m.c); s.p(18, top - 1, m.c); s.p(16, top + 2, m.c); s.p(20, top + 2, m.c); }
  if (rank >= 4) s.p(18, top + 1, C.gem, true);
  // grand bouclier à gauche : bord de métal, champ aux couleurs, pal brodé, umbo
  const rows = [[11, 2, 5], [12, 1, 6], [13, 1, 6], [14, 1, 6], [15, 1, 6], [16, 1, 6], [17, 1, 6], [18, 1, 6], [19, 2, 5], [20, 2, 5], [21, 3, 4]];
  for (const [y, a, b] of rows) {
    s.hl(a, b, y, m.c);
    if (y > 11 && y < 21) s.hl(a + 1, b - 1, y, y < 20 ? K.main : m.c);
  }
  s.v(3, 12, 19, trimOf(K, rank)); s.v(4, 12, 19, trimOf(K, rank));
  s.hl(2, 5, 15, rank >= 4 ? C.gold : K.dark);
  s.r(3, 15, 2, 1, rank >= 3 ? C.gold : m.c);
  s.p(2, 12, m.hi, true); s.p(1, 13, m.hi, true);
  if (rank >= 4) s.p(3, 15, C.gem, true);
  return s;
}

// Mira, barde : béret à longue plume, cheveux blonds, luth à gauche.
function mira(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.mira, H = '#e8c070', HH = '#fff0b0';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // longs cheveux blonds, frange de côté
  s.hl(8, 15, 7, H);
  s.p(8, 8, H); s.p(9, 8, H); s.p(15, 8, H);
  s.v(7, 7, 13, H); s.v(16, 7, 13, H);
  s.p(10, 7, HH, true); s.p(14, 7, HH, true); s.p(7, 10, HH, true);
  // béret penché, bandeau, plume qui monte en arrière
  s.hl(7, 15, 5, K.main); s.hl(8, 16, 4, K.main); s.hl(9, 15, 3, K.main);
  s.hl(8, 15, 6, rank >= 4 ? C.gold : K.dark);
  s.p(9, 3, '#f0a050', true); s.p(10, 4, '#f0a050', true);
  const F = rank >= 4 ? C.goldHi : W;
  s.sline(15, 3, 19, 0, F); s.p(20, 0, F); s.p(16, 3, '#c8c0d0'); s.p(18, 1, '#e2334a');
  if (rank >= 2) { s.p(14, 6, m.c); s.p(14, 5, m.hi, true); }
  if (rank >= 4) s.p(14, 6, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // luth à gauche : manche, chevillier, caisse ronde à rosace, cordes claires
  const y0 = rank >= 3 ? 6 : 9, wood = '#c8945a', wd = '#8a5a32';
  s.hl(2, 4, y0, '#5a3a22');
  s.v(3, y0 + 1, 15, wd);
  s.v(4, y0 + 1, 15, C.string, true);
  for (const [y, a, b] of [[15, 2, 5], [16, 1, 6], [17, 1, 6], [18, 1, 6], [19, 1, 6], [20, 2, 5]]) s.hl(a, b, y, wood);
  s.hl(2, 5, 20, rank >= 4 ? C.gold : wd);
  s.r(3, 17, 2, 2, '#5a3a22', true);
  s.p(2, 16, '#e8b878', true);
  if (rank >= 4) s.p(2, y0, C.gem, true);
  return s;
}

// Nina, infirmière : coiffe blanche à croix rouge, robe blanche, seringue géante à droite.
function nina(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.nina, H = '#8a4a2a', HH = '#b06a40', R = rank >= 4 ? C.gold : '#e2334a';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && '#c8323c', bracers: rank >= 2 && m.c });
  // tablier : petite poche
  s.hl(12, 14, 17, K.dark);
  // cheveux châtains au carré
  s.r(8, 5, 8, 3, H);
  s.v(7, 6, 12, H); s.v(16, 6, 12, H);
  s.p(8, 8, H); s.p(12, 8, H); s.p(15, 8, H);
  s.p(10, 6, HH, true); s.p(13, 7, HH, true);
  // coiffe d'infirmière
  s.r(9, 3, 6, 3, W);
  s.hl(8, 15, 5, W);
  s.v(12, 3, 5, R, true); s.hl(11, 13, 4, R, true);
  s.p(9, 3, '#ffffff', true);
  if (rank >= 2) s.p(9, 5, m.c);
  if (rank >= 4) tiara(s, 7);
  if (rank >= 3) pauldrons(s, m);
  // seringue géante à droite : aiguille de métal, corps transparent, liquide vert, piston
  const top = rank >= 3 ? 6 : 9;
  s.v(19, top - 3, top - 1, m.c);
  s.p(19, top - 3, m.hi, true);
  s.r(18, top, 3, 17 - top, '#d8f0ff');
  s.r(18, top + 3, 3, 14 - top - 3, '#5ae0a0', true);
  s.p(18, top + 3, '#b8ffd8', true);
  for (let y = top + 1; y < 16; y += 2) s.p(20, y, '#8ab0c8', true);
  s.hl(17, 21, 17, m.c);
  s.v(19, 18, 19, '#8e99a4');
  s.hl(18, 20, 20, m.c);
  return s;
}

// Pip, voleur : capuche brune, foulard rouge sur le bas du visage, deux dagues.
function pip(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.pip, H = '#8a3a2a', R = '#c8323c';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // bourse d'or à la ceinture
  s.r(14, 19, 2, 2, '#a8865f'); s.p(14, 19, C.gold, true);
  // capuche ronde, mèche rousse qui dépasse
  s.hl(9, 14, 4, K.main);
  s.r(8, 5, 8, 3, K.main);
  s.v(7, 6, 13, K.main); s.v(16, 6, 13, K.main);
  s.p(9, 5, '#8a7660', true); s.p(10, 4, '#8a7660', true);
  s.hl(8, 15, 8, H);
  s.p(9, 9, H); s.p(13, 9, H);
  s.p(11, 8, '#b05a3a', true);
  // foulard rouge noué, pans qui flottent
  s.r(8, 12, 8, 2, R);
  s.p(10, 12, '#e85a5a', true);
  s.p(7, 14, R); s.p(6, 15, '#8c1f2e');
  if (rank >= 4) tiara(s, 7);
  else if (rank >= 2) { s.p(11, 14, m.c); s.p(12, 14, m.c); }
  if (rank >= 3) pauldrons(s, m);
  // dague à droite, pointe en haut ; dague à gauche en prise inversée
  const top = rank >= 3 ? 9 : 11;
  s.v(18, top, 17, m.c);
  s.p(18, top, m.hi, true);
  s.hl(17, 19, 18, rank >= 4 ? C.gold : C.grip);
  s.v(18, 19, 20, C.grip);
  s.hl(4, 6, 18, rank >= 4 ? C.gold : C.grip);
  s.sline(5, 19, 4, rank >= 3 ? 22 : 21, m.c);
  s.p(5, 19, m.hi, true);
  if (rank >= 4) s.p(18, 18, C.gem, true);
  return s;
}

// Gus, mineur : casque jaune à lampe, barbe touffue, salopette, pioche à gauche.
function gus(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.gus, H = '#6b4428', Y = '#f0c030', YD = '#c89020', SH = '#c8503a';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#8c1f2e' });
  // chemise rouge sous la salopette : manches, épaules ; boutons d'or
  s.r(6, 14, 2, 3, SH); s.r(16, 14, 2, 3, SH);
  s.p(8, 14, SH); s.p(15, 14, SH);
  s.p(10, 15, C.gold, true); s.p(13, 15, C.gold, true);
  if (rank >= 2) { s.hl(6, 7, 16, m.c); s.hl(16, 17, 16, m.c); }
  // barbe touffue, favoris
  s.r(8, 12, 8, 2, H);
  s.hl(9, 14, 14, H);
  s.v(7, 8, 11, H); s.v(16, 8, 11, H);
  s.hl(10, 13, 12, '#4a2e1a');
  s.p(9, 13, '#8a5a34', true); s.p(13, 14, '#8a5a34', true);
  // casque de chantier, bord, lampe frontale
  s.r(8, 3, 8, 4, Y);
  s.hl(9, 14, 2, Y);
  s.hl(7, 16, 7, YD);
  s.p(9, 3, '#fff0a0', true); s.p(10, 2, '#fff0a0', true);
  s.r(11, 4, 2, 2, rank >= 4 ? C.gem : '#fff4c0', true);
  s.p(11, 4, '#ffffff', true);
  s.hl(10, 13, 6, rank >= 4 ? C.gold : m.c);
  if (rank >= 3) pauldrons(s, m);
  // pioche à gauche : manche de bois, fer recourbé
  const y0 = rank >= 3 ? 5 : 8, wood = rank >= 4 ? C.gold : '#8a5a32';
  s.v(4, y0 + 1, 20, wood);
  for (let y = y0 + 3; y < 20; y += 3) s.p(4, y, rank >= 4 ? C.goldHi : '#6a4226', true);
  s.hl(1, 7, y0, m.c);
  s.p(0, y0 + 1, m.c); s.p(8, y0 + 1, m.c);
  s.hl(2, 6, y0, m.hi, true);
  s.p(4, y0, rank >= 4 ? C.gem : m.c, rank >= 4);
  return s;
}

// Lenny, pompier : casque rouge à long bord arrière et insigne, veste à bandes jaunes, lance à incendie.
function lenny(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.lenny, H = C.hair, RD = '#c8302a', RDD = '#8c1f20';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), cape: rank >= 4 && RDD, bracers: K.trim });
  // cheveux courts sous le casque
  s.hl(8, 15, 8, H);
  s.v(7, 8, 10, H); s.v(16, 8, 10, H);
  s.p(9, 9, H); s.p(14, 9, H);
  // casque de pompier : dôme, crête, long bord à l'arrière (à gauche), insigne
  s.r(8, 3, 8, 4, RD);
  s.hl(9, 14, 2, RD);
  s.v(12, 2, 6, RDD);
  s.hl(5, 16, 7, RDD);
  s.p(4, 8, RDD); s.p(5, 8, RDD);
  s.p(9, 3, '#e85a50', true); s.p(10, 2, '#e85a50', true);
  const B = rank >= 4 ? C.gold : m.c;
  s.r(10, 3, 2, 3, B);
  s.p(10, 3, rank >= 4 ? C.goldHi : m.hi, true);
  if (rank >= 4) s.p(11, 4, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // lance à incendie : embout de métal en haut, tuyau rouge qui descend et s'enroule au sol
  const top = rank >= 3 ? 7 : 10;
  s.v(18, top, top + 4, B);
  s.p(18, top, rank >= 4 ? C.goldHi : m.hi, true);
  s.p(18, top - 1, '#8ae0ff', true);
  s.hl(17, 19, top + 5, B);
  s.v(18, top + 6, 21, RD);
  s.hl(19, 21, 21, RD); s.hl(19, 22, 22, RDD); s.p(21, 20, RD);
  s.p(18, 19, '#e85a50', true);
  return s;
}

// Vex, vampire : peau pâle, cheveux plaqués en pointe, haut col rouge et noir, rapière.
function vex(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.vex, H = '#2a2234', HH = '#4a3e5a', R = K.trim;
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: '#8c1f2e', bracers: rank >= 2 && m.c });
  // gilet rouge et broche
  s.v(11, 15, 17, '#8c1f2e'); s.v(12, 15, 17, '#8c1f2e');
  s.p(12, 15, C.gem, true);
  // crocs
  s.p(11, 12, '#6a2a3a', true); s.p(12, 12, '#ffffff', true);
  // cheveux noirs plaqués, pointe sur le front
  s.r(8, 5, 8, 3, H);
  s.hl(9, 14, 4, H);
  s.v(7, 6, 9, H); s.v(16, 6, 9, H);
  s.p(11, 8, H); s.p(12, 8, H);
  s.p(10, 5, HH, true); s.p(14, 6, HH, true);
  // haut col dressé derrière la tête : noir dehors, rouge dedans
  s.v(5, 8, 13, K.main); s.v(18, 8, 13, K.main);
  s.v(6, 9, 13, R); s.v(17, 9, 13, R);
  s.p(4, 7, K.main); s.p(19, 7, K.main);
  if (rank >= 4) tiara(s, 5);
  if (rank >= 3) pauldrons(s, m);
  // rapière fine, coquille, pommeau de rubis
  const top = rank >= 3 ? 2 : 5;
  s.v(20, top, 17, m.c);
  s.v(20, top + 1, top + 4, m.hi, true);
  s.hl(19, 21, 18, rank >= 4 ? C.gold : m.c);
  s.p(21, 17, rank >= 4 ? C.gold : m.c);
  s.v(20, 19, 20, H);
  s.p(20, 21, C.gem, true);
  // peau pâle
  return s.recolor({ [C.skin]: '#f0d8cc', [C.skinSh]: '#c8a8a8' });
}

// Gideon, paladin : casque à grande crête bleue, soleil d'or sur la poitrine, marteau de guerre.
function gideon(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.gideon, P = '#3a5ab8', PH = '#6a8ae0';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && '#3a5ab8', bracers: m.c });
  // soleil d'or sur la poitrine
  s.r(11, 15, 2, 2, C.gold, true);
  s.p(11, 15, C.goldHi, true);
  s.p(10, 16, C.gold, true); s.p(13, 15, C.gold, true);
  // casque ouvert, couvre-joues
  s.r(8, 3, 8, 4, m.c);
  s.hl(7, 16, 7, m.c);
  s.v(7, 8, 11, m.c); s.v(16, 8, 11, m.c);
  s.p(9, 3, m.hi, true); s.p(8, 7, m.hi, true);
  s.hl(8, 15, 6, shade2(m.c));
  // crête de crin qui grandit avec le rang
  const crest = [[2, 9, 14], [1, 9, 14], [0, 10, 13]].slice(0, rank >= 3 ? 3 : 2);
  for (const [y, a, b] of crest) s.hl(a, b, y, P);
  s.p(10, 1, PH, true); s.p(11, 2, PH, true);
  if (rank >= 4) { s.r(11, 4, 2, 2, C.gem, true); s.p(11, 4, '#ff8a9a', true); s.hl(8, 15, 6, C.gold); }
  if (rank >= 3) pauldrons(s, m);
  // marteau de guerre à droite : manche de bois, grosse tête de métal
  const big = rank >= 3, y0 = big ? 4 : 8, wood = rank >= 4 ? C.gold : C.wood;
  s.v(19, y0 + 3, 21, wood);
  for (let y = y0 + 5; y < 21; y += 3) s.p(19, y, rank >= 4 ? C.goldHi : '#5a3f2e', true);
  s.r(big ? 17 : 18, y0, big ? 5 : 3, 3, m.c);
  s.p(big ? 17 : 18, y0, m.hi, true);
  s.p(19, y0 + 1, rank >= 4 ? C.gem : C.gold, true);
  return s;
}

// Aurélia, valkyrie : casque ailé, longues tresses blondes, cape bleue, lance de lumière.
function aurelia(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.aurelia, H = '#f0c860', HH = '#fff0b0', CP = '#3a5aa8';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: CP, bracers: m.c });
  // cuirasse : reflets
  s.p(9, 15, '#eef0f6', true); s.p(14, 16, '#eef0f6', true);
  // tresses
  for (const x of [7, 16]) {
    s.v(x, 8, 15, H);
    for (let y = 9; y <= 15; y += 2) s.p(x, y, HH, true);
    s.p(x, 16, CP);
  }
  s.hl(8, 15, 8, H);
  s.p(9, 9, H); s.p(14, 9, H);
  // casque et ailes
  s.r(8, 4, 8, 4, m.c);
  s.hl(9, 14, 3, m.c);
  s.hl(8, 15, 7, rank >= 4 ? C.gold : shade2(m.c));
  s.p(9, 4, m.hi, true); s.p(10, 3, m.hi, true);
  s.r(11, 5, 2, 2, rank >= 4 ? C.gem : C.gold, true);
  const wing = rank >= 3 ? [[1, 5, 6], [2, 4, 6], [3, 3, 7], [4, 4, 7], [5, 5, 7]] : [[3, 5, 6], [4, 4, 7], [5, 5, 7]];
  for (const [y, a, b] of wing) {
    s.hl(a, b, y, W); s.hl(23 - b, 23 - a, y, W);
    s.p(a, y, '#c8c0d0'); s.p(23 - a, y, '#c8c0d0');
  }
  if (rank >= 3) pauldrons(s, m);
  // lance : hampe de bois, fer en feuille
  const top = rank >= 3 ? 0 : 3, wood = rank >= 4 ? C.gold : C.wood;
  s.v(20, top + 4, 22, wood);
  s.v(20, top, top + 3, m.c);
  s.p(19, top + 2, m.c); s.p(21, top + 2, m.c);
  s.p(20, top + 1, m.hi, true);
  s.hl(19, 21, top + 4, C.gold);
  for (const [x, y] of [[22, 3], [3, 10], [21, 14]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}

// Nova, super-héroïne : combinaison bleue à éclair d'or, cape rouge au vent, poing levé.
function nova(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.nova, H = '#f0c050', HH = '#fff0a0', CP = '#d8323c', CD = '#9a1e2a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: CP, belt: CP, buckle: C.gold });
  // cape qui claque au vent vers la gauche
  for (const [y, a, b] of [[14, 5, 6], [15, 4, 6], [16, 3, 6], [17, 2, 5], [18, 2, 5], [19, 1, 4], [20, 2, 3]]) s.hl(a, b, y, CP);
  s.p(3, 17, CD); s.p(2, 19, CD);
  // éclair d'or sur la poitrine
  s.p(12, 15, K.trim, true); s.p(11, 16, K.trim, true); s.p(12, 16, K.trim, true); s.p(11, 17, K.trim, true);
  // le bras droit est levé, poing fermé dans un gant blanc
  for (let y = 14; y <= 19; y++) { s.p(16, y, null); s.p(17, y, null); }
  s.r(16, 14, 2, 2, K.main);
  s.v(17, 9, 14, K.main); s.v(18, 9, 13, K.main);
  s.hl(17, 18, 9, rank >= 2 ? m.c : K.trim);
  s.r(17, 6, 3, 3, W);
  s.p(17, 6, '#ffffff', true); s.p(19, 8, '#c8c0d0');
  // cheveux blonds qui volent vers l'arrière
  s.r(8, 4, 8, 4, H);
  s.hl(9, 14, 3, H);
  s.v(7, 5, 12, H); s.v(6, 6, 10, H); s.p(5, 7, H); s.p(5, 8, H); s.p(4, 8, HH);
  s.v(16, 6, 9, H);
  s.p(9, 8, H); s.p(15, 8, H);
  s.p(10, 4, HH, true); s.p(13, 5, HH, true); s.p(6, 7, HH, true);
  if (rank >= 2 && rank < 4) { s.hl(9, 14, 7, m.c); s.p(10, 7, m.hi, true); }
  if (rank >= 4) tiara(s, 7);
  if (rank >= 3) pauldrons(s, m);
  for (const [x, y] of [[21, 5], [1, 13]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}


// ---------------------------------------------------------------- vague 2

// Rok, bûcheron : bonnet vert, grosse barbe rousse, chemise de flanelle, hache à droite.
function rok(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.rok, B = '#8a4a22', BH = '#b06a34', G = '#3a6a3a';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // carreaux de la flanelle : deux bandes sombres seulement (pas de motif sur tout le tissu)
  s.v(10, 15, 17, K.dark); s.v(13, 15, 17, K.dark);
  // bretelles
  s.v(9, 14, 17, '#4a3a2a'); s.v(14, 14, 17, '#4a3a2a');
  // barbe rousse touffue, favoris
  s.r(8, 12, 8, 2, B); s.hl(9, 14, 14, B); s.hl(10, 13, 15, B);
  s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  s.p(10, 13, BH, true); s.p(13, 14, BH, true);
  s.hl(10, 13, 12, '#6a3418');
  // bonnet de laine à revers, pompon
  s.r(8, 4, 8, 3, G); s.hl(9, 14, 3, G);
  s.hl(7, 16, 7, '#2a5a2a'); s.hl(7, 16, 8, rank >= 4 ? C.gold : '#2a5a2a');
  s.r(11, 1, 2, 2, '#e8d8b0');
  s.p(9, 4, '#5a8a5a', true); s.p(10, 3, '#5a8a5a', true);
  if (rank >= 2) { s.p(14, 7, m.c); s.p(14, 6, m.hi, true); }
  if (rank >= 4) s.p(14, 7, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // hache : manche de bois, fer large (double dès le rang 3)
  const y0 = rank >= 3 ? 4 : 7, wood = rank >= 4 ? C.gold : '#8a5a32';
  s.v(18, y0, 21, wood);
  for (let y = y0 + 3; y < 21; y += 3) s.p(18, y, rank >= 4 ? C.goldHi : '#6a4226', true);
  s.r(19, y0 + 1, 2, 4, m.c); s.p(21, y0, m.c); s.p(21, y0 + 5, m.c); s.v(21, y0 + 1, y0 + 4, m.hi, true);
  if (rank >= 3) { s.r(16, y0 + 1, 2, 3, m.c); s.p(16, y0 + 1, m.hi, true); }
  return s;
}

// Tobo, chef cuisinier : grande toque, veste blanche croisée, foulard rouge, moustache, poêle.
function tobo(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.tobo, H = '#3a2a22', R = '#e2334a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.dark, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#c8323c', bracers: rank >= 2 && m.c });
  // boutons croisés, foulard rouge
  for (const y of [15, 17]) { s.p(10, y, rank >= 4 ? C.gold : '#a8a0b0'); s.p(13, y, rank >= 4 ? C.gold : '#a8a0b0'); }
  s.hl(9, 14, 14, R); s.p(11, 15, R); s.p(12, 15, '#a8203a');
  // moustache en guidon
  s.hl(10, 13, 12, H); s.p(9, 13, H); s.p(14, 13, H);
  // cheveux courts sur les côtés
  s.v(7, 8, 10, H); s.v(16, 8, 10, H); s.hl(8, 15, 7, H);
  // toque bouffante, bandeau
  s.r(8, 1, 8, 5, K.main); s.hl(9, 14, 0, K.main); s.p(7, 2, K.main); s.p(16, 2, K.main);
  s.v(11, 1, 4, K.dark); s.p(14, 2, K.dark);
  s.hl(8, 15, 6, rank >= 4 ? C.gold : K.dark);
  s.p(9, 1, '#ffffff', true); s.p(10, 2, '#ffffff', true);
  if (rank >= 2) s.p(9, 6, m.c);
  if (rank >= 4) s.p(9, 6, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // poêle à frire : manche gainé, fond noir, bord de métal, un œuf dedans au rang 1-2
  const big = rank >= 3, y0 = big ? 6 : 9, w = big ? 5 : 4;
  s.v(19, y0 + w, 20, C.grip);
  s.r(17, y0, w, w, m.c);
  s.r(18, y0 + 1, w - 2, w - 2, '#2a2a32');
  s.p(17, y0, m.hi, true);
  s.p(18, y0 + 1, '#ffffff', true); s.p(19, y0 + 2, '#fbe08a', true);
  return s;
}

// Hugo, boxeur : bandeau de sueur, débardeur bleu, short rouge, gros gants (garde haute).
function hugo(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.hugo, H = '#2a2234', GL = '#d8323c', GH = '#ff8a8a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && '#d8323c', belt: rank >= 4 ? C.gold : '#f2eef4', buckle: rank >= 2 ? m.c : C.gold });
  // bras nus (débardeur)
  s.r(6, 14, 2, 3, C.skin); s.r(16, 14, 2, 3, C.skin);
  s.r(8, 18, 8, 2, K.pants); s.hl(8, 15, 18, rank >= 4 ? C.gold : '#f2eef4');
  // cheveux noirs courts en épis
  s.r(8, 4, 8, 3, H);
  for (const [x, y] of [[9, 3], [11, 2], [13, 3], [15, 3]]) s.p(x, y, H);
  s.v(7, 6, 9, H); s.v(16, 6, 9, H);
  s.p(10, 4, '#4a3e5a', true);
  // bandeau (métal au rang 2-3 : protège-tête, or au rang 4)
  s.hl(7, 16, 7, rank >= 4 ? C.gold : rank >= 2 ? m.c : GL);
  s.p(8, 7, rank >= 2 ? m.hi : GH, true);
  if (rank >= 2) { s.v(7, 8, 11, m.c); s.v(16, 8, 11, m.c); }
  if (rank >= 4) s.r(11, 6, 2, 1, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // gants : garde haute à gauche, poing en avant à droite (lacets de la couleur du rang)
  const G = rank >= 4 ? C.gold : GL;
  s.r(3, 12, 4, 4, G); s.p(3, 12, rank >= 4 ? C.goldHi : GH, true); s.hl(3, 6, 15, rank >= 2 ? m.c : '#f2eef4');
  s.r(17, 14, 4, 4, G); s.p(17, 14, rank >= 4 ? C.goldHi : GH, true); s.hl(17, 20, 17, rank >= 2 ? m.c : '#f2eef4');
  s.v(6, 16, 17, C.skin);
  return s;
}

// Kiki, cow-girl : grand chapeau, longs cheveux roux, foulard, revolver à droite, lasso à gauche.
function kiki(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.kiki, H = '#c8502a', HH = '#e8803a', HT = '#8a5a32', HTD = '#6a4226';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // gilet en cuir ouvert, foulard
  s.v(8, 14, 17, HTD); s.v(15, 14, 17, HTD);
  s.hl(10, 13, 14, '#3a64c8'); s.p(11, 15, '#3a64c8');
  // cheveux roux longs
  s.hl(8, 15, 7, H); s.p(8, 8, H); s.p(15, 8, H); s.p(9, 8, H);
  s.v(7, 7, 14, H); s.v(16, 7, 14, H);
  s.p(7, 10, HH, true); s.p(10, 7, HH, true);
  // chapeau de cow-boy : calotte creusée, bord large relevé
  s.r(9, 3, 6, 3, HT); s.p(8, 4, HT); s.p(15, 4, HT); s.p(11, 2, HT); s.p(13, 2, HT);
  s.hl(5, 18, 6, HT); s.p(4, 5, HT); s.p(19, 5, HT);
  s.hl(9, 14, 5, rank >= 4 ? C.gold : HTD);
  s.p(12, 3, HTD); s.p(9, 3, '#a8784a', true);
  if (rank >= 2) { s.p(13, 5, m.c); s.p(13, 4, m.hi, true); } // étoile de shérif
  if (rank >= 4) s.p(13, 5, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // revolver à droite (canon de métal, crosse de bois)
  const L = rank >= 3 ? 4 : 3;
  s.hl(18, 18 + L, 15, m.c); s.p(18 + L, 14, m.c);
  s.p(19, 15, m.hi, true);
  s.v(18, 16, 17, '#8a5a32'); s.p(19, 16, '#8a5a32');
  // lasso enroulé à la hanche gauche
  const R = '#c8a870';
  s.hl(3, 5, 17, R); s.v(2, 18, 20, R); s.v(6, 18, 20, R); s.hl(3, 5, 21, R); s.p(4, 19, '#a88a50');
  return s;
}

// Bjorn, viking : casque à cornes, grande barbe blonde tressée, col de fourrure, hache à deux mains à gauche.
function bjorn(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.bjorn, B = '#e8b048', BH = '#fff0a0', F = '#8a6a4a', FH = '#a8865f', HO = '#efe6cf';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#8c1f2e', bracers: m.c });
  // col de fourrure sur les épaules
  s.hl(6, 17, 14, F); s.hl(7, 16, 13, F);
  for (const x of [7, 10, 14, 16]) s.p(x, 14, FH, true);
  // grande barbe tressée
  s.r(8, 12, 8, 2, B); s.r(9, 14, 6, 2, B); s.v(11, 16, 17, B); s.v(12, 16, 17, B);
  s.p(11, 17, '#c8323c'); s.p(12, 17, '#c8323c');
  s.p(10, 14, BH, true); s.p(13, 13, BH, true);
  s.hl(10, 13, 12, '#c8903a');
  s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  // casque rond à cornes
  s.r(8, 3, 8, 5, m.c); s.hl(9, 14, 2, m.c);
  s.hl(7, 16, 7, shade2(m.c)); s.v(12, 2, 6, shade2(m.c));
  s.p(9, 3, m.hi, true); s.p(10, 2, m.hi, true);
  const H = rank >= 4 ? C.gold : HO, long = rank >= 3;
  s.p(7, 5, H); s.p(6, 4, H); s.p(5, 3, H); if (long) { s.p(5, 2, H); s.p(5, 1, H); }
  s.p(16, 5, H); s.p(17, 4, H); s.p(18, 3, H); if (long) { s.p(18, 2, H); s.p(18, 1, H); }
  if (rank >= 4) { s.r(11, 4, 2, 2, C.gem, true); s.p(11, 4, '#ff8a9a', true); }
  if (rank >= 3) pauldrons(s, m);
  // hache à deux mains à gauche, fer en croissant
  const y0 = rank >= 3 ? 3 : 6, wood = rank >= 4 ? C.gold : '#8a5a32';
  s.v(4, y0, 21, wood);
  for (let y = y0 + 4; y < 21; y += 3) s.p(4, y, rank >= 4 ? C.goldHi : '#6a4226', true);
  s.r(1, y0 + 1, 3, 4, m.c); s.p(0, y0 + 2, m.c); s.p(0, y0 + 3, m.c); s.p(2, y0, m.c); s.p(2, y0 + 5, m.c);
  s.v(1, y0 + 1, y0 + 3, m.hi, true);
  return s;
}

// Sven, pêcheur : ciré et chapeau jaunes, barbe grise, canne à pêche avec un poisson au bout.
function sven(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.sven, B = '#c8c0b8', BS = '#9a928a';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#3a64c8', bracers: rank >= 2 && m.c });
  // boutons du ciré
  s.p(12, 15, '#3a4a6a'); s.p(12, 17, '#3a4a6a');
  // barbe grise courte, pipe
  s.r(8, 12, 8, 2, B); s.hl(9, 14, 14, B); s.p(10, 13, BS); s.p(13, 12, BS);
  s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  s.p(14, 12, '#6a4226'); s.p(15, 12, '#6a4226'); s.p(15, 11, '#8a5a32');
  // chapeau de pluie : bord tombant, plus long derrière (à gauche)
  s.r(8, 4, 8, 3, K.main); s.hl(9, 14, 3, K.main);
  s.hl(6, 17, 7, K.dark); s.hl(5, 8, 8, K.dark); s.p(17, 8, K.dark);
  s.p(9, 4, K.trim, true); s.p(10, 3, K.trim, true);
  if (rank >= 2) s.hl(8, 15, 6, rank >= 4 ? C.gold : m.c);
  if (rank >= 4) s.p(12, 6, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // canne à pêche qui monte en diagonale, fil, poisson
  const tip = rank >= 3 ? [21, 1] : [20, 4], wood = rank >= 4 ? C.gold : '#8a5a32';
  s.sline(17, 19, tip[0], tip[1], wood);
  s.p(18, 16, m.c); s.p(17, 17, m.c); // moulinet
  s.v(tip[0] + 1, tip[1], tip[1] + 6, C.string, true);
  const fy = tip[1] + 7, F = '#4a9ae0';
  s.hl(21, 23, fy, F); s.hl(21, 23, fy + 1, F); s.p(20, fy, F); s.p(20, fy + 2, F);
  s.p(22, fy, '#ffffff', true);
  return s;
}

// Astra, astronaute : casque-bulle avec antenne, combinaison blanche à bandes orange, pistolet laser.
function astra(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.astra, GL = '#a8d8f0', H = '#3a2a22', O = K.trim;
  // sac de survie dans le dos
  s.r(4, 14, 3, 6, '#8e99a4'); s.p(4, 14, '#b8c2cc', true); s.p(5, 16, '#e2552a', true);
  body(s, { tunic: K.main, dark: K.dark, trim: rank >= 4 ? C.gold : O, pants: K.pants, ...boots(m), cape: rank >= 4 && '#2a3a7a', belt: '#8e99a4', bracers: O });
  s.p(10, 16, '#4a9ae0', true); s.p(13, 16, O, true); // écussons
  // cheveux courts
  s.r(8, 5, 8, 2, H); s.p(8, 7, H); s.p(15, 7, H);
  // bulle de verre autour de la tête, reflets ; col de métal
  s.hl(9, 14, 2, GL); s.hl(8, 15, 3, GL); s.p(7, 4, GL); s.p(16, 4, GL);
  s.v(6, 5, 12, GL); s.v(17, 5, 12, GL); s.p(7, 13, GL); s.p(16, 13, GL);
  s.p(8, 3, '#ffffff', true); s.p(6, 6, '#ffffff', true); s.p(6, 7, '#ffffff', true);
  s.hl(7, 16, 14, rank >= 4 ? C.gold : m.c);
  // antenne
  s.v(16, 0, 2, m.c); s.p(16, 0, '#e2334a', true);
  if (rank >= 4) tiara(s, 4, 9, 14);
  if (rank >= 3) pauldrons(s, m);
  // pistolet laser à droite, bout lumineux
  const L = rank >= 3 ? 4 : 3;
  s.hl(18, 18 + L, 15, m.c); s.p(18, 16, '#4a4a5a'); s.p(18, 17, '#4a4a5a');
  s.p(19 + L, 15, C.neon, true); s.p(19, 15, m.hi, true);
  if (rank >= 3) s.p(20, 14, O, true);
  for (const [x, y] of [[21, 3], [2, 9]]) s.spark(x, y, '#ffffff');
  return s;
}

// Nyx, nécromancienne : capuche profonde, cheveux blancs, robe violette, bâton à crâne et flamme verte.
function nyx(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.nyx, HW = '#e8e4f0', GR = K.trim, BO = '#e8e0cc';
  body(s, { tunic: K.main, dark: K.dark, trim: rank >= 4 ? C.gold : '#9a6ad0', pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // médaillon vert
  s.p(11, 16, GR, true);
  // cheveux blancs qui tombent sous la capuche
  s.hl(8, 15, 8, HW); s.p(9, 9, HW); s.p(14, 9, HW);
  s.v(8, 9, 13, HW); s.v(15, 9, 13, HW);
  // capuche pointue vers l'arrière, bord sombre
  s.r(8, 4, 8, 4, K.main); s.hl(9, 15, 3, K.main); s.hl(11, 16, 2, K.main); s.p(16, 3, K.main); s.p(17, 2, K.main);
  s.v(7, 5, 14, K.main); s.v(16, 5, 14, K.main);
  s.hl(8, 15, 7, K.dark);
  s.p(9, 4, '#6a4a8a', true); s.p(10, 3, '#6a4a8a', true);
  if (rank >= 2) { s.p(11, 7, m.c); s.p(12, 7, m.c); }
  if (rank >= 4) tiara(s, 7);
  if (rank >= 3) pauldrons(s, m);
  // bâton à gauche : crâne d'os, flamme verte au-dessus
  const top = rank >= 3 ? 4 : 6, wood = rank >= 4 ? C.gold : '#4a3a2a';
  s.v(4, top + 4, 23, wood);
  s.r(3, top, 3, 3, BO); s.p(3, top + 3, BO); s.p(5, top + 3, BO);
  s.p(3, top + 1, '#2a1e30', true); s.p(5, top + 1, '#2a1e30', true);
  s.p(4, top + 2, '#2a1e30', true);
  s.p(4, top - 1, GR, true); s.p(4, top - 2, '#c8ffb8', true); s.p(3, top - 1, '#3ab84a', true);
  if (rank >= 3) s.p(5, top - 2, GR, true);
  // peau pâle
  return s.recolor({ [C.skin]: '#e8d4d8', [C.skinSh]: '#b8a0b0' });
}

// Ignis, pyromancien : cheveux en flammes, robe orange à ourlet de feu, boule de feu dans la main.
function ignis(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.ignis, F1 = '#ff8a2a', F2 = '#fbe08a', F3 = '#e2334a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && '#8c1f2e', bracers: rank >= 2 && m.c });
  // ourlet en flammes
  for (const x of [8, 11, 14]) s.p(x, 20, F3);
  // cheveux de feu : flammes qui montent
  s.r(8, 5, 8, 3, F1); s.hl(8, 15, 8, F1);
  s.v(7, 6, 10, F1); s.v(16, 6, 10, F1);
  for (const [x, y] of [[8, 4], [9, 2], [9, 3], [11, 1], [11, 2], [11, 3], [12, 3], [13, 2], [14, 3], [14, 4], [15, 4], [16, 5]]) s.p(x, y, F1);
  for (const [x, y] of [[9, 3], [11, 2], [13, 3], [10, 5], [14, 6]]) s.p(x, y, F2, true);
  s.p(11, 0, F3); s.p(12, 6, F3);
  if (rank >= 2) { s.hl(8, 15, 7, rank >= 4 ? C.gold : m.c); s.p(9, 7, m.hi, true); }
  if (rank >= 4) s.r(11, 7, 2, 1, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // boule de feu au-dessus de la main droite (plus grosse avec le rang)
  const big = rank >= 3, cx = 19, cy = big ? 12 : 14;
  s.r(cx - 1, cy - 1, 3, 3, F1, true);
  if (big) { s.p(cx, cy - 2, F1, true); s.p(cx - 2, cy, F1, true); s.p(cx + 2, cy, F1, true); s.p(cx, cy + 2, F1, true); s.p(cx + 1, cy - 3, F3, true); }
  s.p(cx, cy, '#ffffff', true); s.p(cx - 1, cy - 1, F2, true); s.p(cx, cy - 2 - (big ? 1 : 0), F2, true);
  return s;
}

// Drakon, chevalier dragon : casque en tête de dragon (museau, cornes), armure verte, cape rouge, lance à fanion.
function drakon(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.drakon, HO = '#efe6cf', CP = '#a82a2a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: CP, bracers: m.c });
  // écailles : deux rangées claires sur le plastron
  s.p(10, 15, '#4aa86a', true); s.p(13, 15, '#4aa86a', true); s.p(11, 17, '#4aa86a', true);
  // casque-dragon : crâne vert, museau vers l'avant, dents, œil d'or, cornes en arrière
  s.r(8, 3, 8, 5, K.main); s.hl(9, 14, 2, K.main);
  s.hl(16, 19, 4, K.main); s.hl(16, 19, 5, K.dark); s.p(19, 3, K.main); s.p(19, 4, K.dark, true);
  s.p(17, 6, '#ffffff'); s.p(19, 6, '#ffffff');
  for (const [x, y] of [[7, 3], [7, 5], [8, 1]]) s.p(x, y, rank >= 4 ? C.gold : '#4aa86a');
  s.hl(7, 16, 7, K.dark); s.v(7, 8, 11, K.dark); s.v(16, 8, 10, K.dark);
  s.p(14, 4, rank >= 4 ? C.gem : C.goldHi, true);
  s.p(9, 3, '#4aa86a', true); s.p(10, 2, '#4aa86a', true);
  const H = rank >= 4 ? C.gold : HO;
  s.sline(10, 2, 6, 0, H); s.sline(9, 3, 5, 1, H); s.sline(14, 2, 15, 0, H);
  if (rank >= 2) s.hl(10, 14, 6, m.c);
  if (rank >= 3) { s.p(12, 1, CP); s.p(11, 1, CP); s.p(13, 1, CP); s.p(12, 0, CP); }
  if (rank >= 3) pauldrons(s, m);
  // lance de cavalier avec fanion rouge
  const top = rank >= 3 ? 0 : 3, wood = rank >= 4 ? C.gold : C.wood;
  s.v(20, top + 3, 22, wood);
  s.v(20, top, top + 2, m.c); s.p(19, top + 2, m.c); s.p(21, top + 2, m.c); s.p(20, top, m.hi, true);
  s.hl(21, 23, top + 4, CP); s.hl(21, 22, top + 5, CP); s.p(21, top + 6, CP);
  s.hl(18, 22, 18, m.c);
  for (const [x, y] of [[3, 4], [22, 12], [2, 15]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}

// ---------------------------------------------------------------- vague 3

// Tess, fermière : chapeau de paille, nattes, salopette verte sur chemise blanche, brin de paille, fourche.
function tess(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.tess, H = '#8a5a34', HH = '#b07a48', ST = '#e8c860', STD = '#c8a040';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // chemise blanche : manches et épaules ; boutons de salopette
  s.r(6, 14, 2, 3, W); s.r(16, 14, 2, 3, W); s.p(8, 14, W); s.p(15, 14, W);
  s.p(9, 15, rank >= 4 ? C.gold : m.c); s.p(14, 15, rank >= 4 ? C.gold : m.c);
  // brin de paille au coin de la bouche
  s.p(12, 12, ST, true); s.p(13, 12, ST, true); s.p(14, 13, STD, true);
  // cheveux et nattes
  s.hl(8, 15, 8, H); s.p(9, 9, H); s.p(14, 9, H);
  s.v(7, 8, 13, H); s.v(16, 8, 13, H); s.p(6, 14, H); s.p(17, 14, H);
  s.p(7, 10, HH, true); s.p(16, 12, HH, true); s.p(6, 14, '#c8323c'); s.p(17, 14, '#c8323c');
  // chapeau de paille : calotte, ruban rouge, bord large
  s.r(9, 4, 6, 3, ST); s.hl(10, 13, 3, ST);
  s.hl(9, 14, 6, rank >= 4 ? C.gold : '#c8323c');
  s.hl(5, 18, 7, ST); s.p(4, 6, ST); s.p(19, 6, ST);
  for (const x of [6, 10, 15]) s.p(x, 7, STD);
  s.p(10, 4, '#fff0b0', true);
  if (rank >= 2) s.p(13, 6, m.c);
  if (rank >= 4) s.p(13, 6, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // fourche à droite : manche de bois, trois dents de métal
  const y0 = rank >= 3 ? 1 : 4, wood = rank >= 4 ? C.gold : '#8a5a32';
  s.v(19, y0 + 4, 21, wood);
  for (let y = y0 + 6; y < 21; y += 3) s.p(19, y, rank >= 4 ? C.goldHi : '#6a4226', true);
  s.hl(18, 20, y0 + 3, m.c);
  for (const x of [18, 19, 20]) s.v(x, y0, y0 + 2, m.c);
  s.p(19, y0, m.hi, true);
  return s;
}

// Doc, médecin de peste : chapeau noir à large bord, masque à long bec, lunettes rondes, encensoir fumant.
function doc(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.doc, BK = '#e8e0cc', BKD = '#b8ac90', GL = '#8a6a4a';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), robe: true, mouth: false, cape: rank >= 4 && '#3a5228', bracers: rank >= 2 && m.c });
  // boutons du manteau, ceinture à fioles
  s.p(12, 15, GL); s.p(12, 17, GL);
  s.p(9, 18, '#7af06a', true); s.p(14, 18, '#c08aff', true);
  // masque de cuir clair, long bec vers l'avant, lunettes cerclées
  s.r(8, 9, 8, 5, BK); s.hl(9, 14, 13, BKD);
  s.hl(16, 19, 11, BK); s.hl(16, 18, 12, BKD); s.p(20, 12, BKD); s.p(16, 10, BK);
  for (const x of [10, 13]) { s.p(x - 1, 10, GL); s.p(x + 1, 10, GL); s.p(x, 9, GL); s.p(x, 12, GL); }
  s.v(10, 10, 11, C.eye, true); s.v(13, 10, 11, C.eye, true);
  s.p(17, 11, '#ffffff', true);
  // chapeau noir à large bord
  s.r(9, 3, 6, 4, K.main); s.hl(5, 18, 7, K.main); s.hl(6, 17, 8, K.dark);
  s.hl(9, 14, 6, rank >= 4 ? C.gold : GL);
  s.p(10, 3, '#4a4250', true);
  s.v(7, 9, 12, K.main); s.v(16, 9, 10, K.main);
  if (rank >= 2) s.p(10, 6, m.c);
  if (rank >= 4) s.p(10, 6, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // encensoir à gauche, au bout d'une canne : fumée verte
  const top = rank >= 3 ? 6 : 8, wood = rank >= 4 ? C.gold : '#4a3a2a';
  s.v(4, top, 23, wood);
  s.hl(2, 4, top, wood);
  s.v(2, top + 1, top + 2, m.c);
  s.r(1, top + 3, 3, 3, m.c); s.p(1, top + 3, m.hi, true); s.p(2, top + 4, '#7af06a', true);
  s.p(1, top - 1, '#9af098', true); s.p(2, top - 2, '#c8ffb8', true); s.p(0, top - 3, '#9af098', true);
  return s;
}

// Ozzy, rockeur : grande crête rose, blouson noir clouté, guitare électrique en V à gauche.
function ozzy(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.ozzy, MO = '#e2338a', MOH = '#ff8ac8', GT = '#d83a3a';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), cape: rank >= 4 && '#8a2060', bracers: m.c });
  // t-shirt blanc sous le blouson, clous d'épaules
  s.r(10, 15, 4, 3, W); s.p(11, 16, MO, true);
  for (const x of [6, 17]) s.p(x, 14, K.trim, true);
  // côtés rasés, crête de punk
  s.hl(8, 15, 7, '#4a3a42'); s.v(7, 7, 9, '#4a3a42'); s.v(16, 7, 9, '#4a3a42');
  const top = rank >= 3 ? 0 : 1;
  s.r(11, top, 2, 7 - top, MO); s.p(10, top + 2, MO); s.p(13, top + 2, MO); s.p(10, 4, MO); s.p(13, 4, MO);
  s.v(11, top, top + 3, MOH, true);
  // anneau à l'oreille
  s.p(16, 11, rank >= 4 ? C.gold : m.c, true);
  if (rank >= 2) { s.hl(8, 15, 6, m.c); s.p(9, 6, m.hi, true); }
  if (rank >= 4) { s.hl(8, 15, 6, C.gold); s.p(9, 5, C.gem, true); s.p(14, 5, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // guitare en V à gauche : corps rouge, manche qui monte, mécaniques
  const G = rank >= 4 ? C.gold : GT;
  for (const [y, a, b] of [[16, 1, 2], [17, 2, 4], [18, 3, 6], [19, 2, 7], [20, 1, 4]]) s.hl(a, b, y, G);
  s.p(5, 19, W, true); s.p(4, 18, '#2a2234');
  const nt = rank >= 3 ? 7 : 9;
  s.sline(6, 17, 4, nt + 1, '#3a2a22'); s.sline(7, 17, 5, nt + 1, '#3a2a22');
  s.hl(3, 5, nt, m.c); s.p(3, nt - 1, m.hi, true);
  s.p(2, 16, rank >= 4 ? C.goldHi : '#ff8a8a', true);
  return s;
}

// Yuki, cryomancienne : longs cheveux blancs, diadème de glace, robe bleu glacier, bâton à flocon.
function yuki(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.yuki, H = '#e8f4ff', HS = '#b8d0e8', IC = '#8ae8ff';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && '#3a8ab0', bracers: rank >= 2 && m.c });
  // col de fourrure blanche
  s.hl(8, 15, 14, W); s.p(9, 14, '#ffffff', true);
  // longs cheveux blancs
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H);
  s.v(7, 6, 15, H); s.v(16, 6, 15, H);
  s.p(8, 8, H); s.p(10, 8, H); s.p(15, 8, H);
  s.p(9, 5, '#ffffff', true); s.p(7, 12, HS); s.p(16, 10, HS);
  // diadème de cristaux de glace
  s.p(10, 3, IC, true); s.p(12, 2, IC, true); s.p(12, 3, IC, true); s.p(14, 3, IC, true);
  s.p(12, 1, '#ffffff', true);
  if (rank >= 2) s.hl(9, 14, 4, m.c);
  if (rank >= 3) { s.p(11, 1, IC, true); s.p(13, 1, IC, true); s.p(12, 0, '#ffffff', true); }
  if (rank >= 4) { s.hl(9, 14, 4, C.gold); s.p(12, 3, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // bâton à droite, flocon de glace au sommet
  const top = rank >= 3 ? 1 : 4, cx = 20, cy = top + 2, wood = rank >= 4 ? C.gold : '#b8c2cc';
  s.v(cx, cy + 3, 23, wood);
  s.v(cx, cy - 2, cy + 2, IC, true); s.hl(cx - 2, cx + 2, cy, IC, true);
  s.p(cx - 1, cy - 1, IC, true); s.p(cx + 1, cy + 1, IC, true); s.p(cx + 1, cy - 1, IC, true); s.p(cx - 1, cy + 1, IC, true);
  s.p(cx, cy, '#ffffff', true);
  s.spark(17, 7, '#ffffff'); s.spark(3, 14, IC);
  return s;
}

// Sylva, archère elfique : oreilles pointues, longs cheveux platine, couronne de feuilles, grand arc blanc à droite.
function sylva(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.sylva, H = '#f0ecd8', HS = '#c8c0a8', LF = '#7ac85a';
  // carquois dans le dos (à gauche)
  s.r(5, 10, 2, 7, '#8a6a4a'); s.p(5, 9, W); s.p(6, 8, W); s.p(6, 9, LF);
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // feuille brodée sur la poitrine
  s.p(12, 16, LF, true); s.p(11, 17, LF, true);
  // longs cheveux platine
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H);
  s.v(7, 6, 14, H); s.v(16, 6, 14, H);
  s.p(8, 8, H); s.p(11, 8, H); s.p(15, 8, H);
  s.p(10, 5, '#ffffff', true); s.p(16, 11, HS); s.p(7, 13, HS);
  // oreilles pointues qui dépassent des cheveux
  s.p(6, 9, C.skin); s.p(5, 8, C.skin); s.p(17, 9, C.skin); s.p(18, 8, C.skin);
  // couronne de feuilles
  s.hl(8, 15, 5, rank >= 2 && rank < 4 ? m.c : rank >= 4 ? C.gold : '#4e8a34');
  for (const x of [8, 11, 14]) s.p(x, 4, LF);
  if (rank >= 4) s.p(11, 4, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // grand arc de bois blanc à droite, corde, poignée
  const y0 = rank >= 3 ? 3 : 6, y1 = 22, mid = (y0 + y1) >> 1, B = rank >= 4 ? C.gold : '#e8e0cc';
  s.p(18, y0, B); s.p(19, y0 + 1, B);
  s.v(20, y0 + 2, y1 - 2, B);
  s.p(19, y1 - 1, B); s.p(18, y1, B);
  s.v(18, y0 + 1, y1 - 1, C.string, true);
  s.v(20, mid - 1, mid + 1, '#26786e');
  s.p(21, y0 + 3, LF); s.p(21, y1 - 4, LF);
  return s;
}

// Thorn, druide : bois de cerf, manteau de feuilles, robe de mousse, bâton noueux fleuri.
function thorn(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.thorn, H = '#6b4428', AN = '#c8a878', AND = '#8a6a4a', LF = '#7ac85a', FL = '#ff9ac8';
  body(s, { tunic: K.main, dark: K.dark, trim: trimOf(K, rank), pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // mantelet de feuilles sur les épaules
  for (const [x, y] of [[6, 14], [8, 14], [10, 14], [13, 14], [15, 14], [17, 14], [7, 15], [16, 15]]) s.p(x, y, LF);
  s.p(9, 14, '#9ae070', true);
  // cheveux bruns en bataille, barbiche
  s.r(8, 5, 8, 3, H); s.v(7, 6, 11, H); s.v(16, 6, 11, H);
  s.p(9, 8, H); s.p(13, 8, H);
  s.p(10, 5, '#8a5a34', true);
  s.hl(10, 13, 13, H); s.p(11, 14, H); s.p(12, 14, H);
  // bois de cerf qui grandissent avec le rang
  const A = rank >= 4 ? C.gold : AN;
  s.v(8, 2, 4, A); s.p(7, 1, A); s.p(9, 1, A);
  s.v(15, 2, 4, A); s.p(14, 1, A); s.p(16, 1, A);
  if (rank >= 3) { s.p(6, 0, A); s.p(17, 0, A); s.p(9, 0, A); s.p(14, 0, A); }
  s.p(8, 4, AND); s.p(15, 4, AND);
  // couronne de feuilles et fleur
  s.hl(9, 14, 5, rank >= 2 && rank < 4 ? m.c : LF); s.p(12, 4, FL, true);
  if (rank >= 4) s.p(12, 4, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // bâton noueux à gauche, feuilles et fleur au sommet
  const top = rank >= 3 ? 3 : 6, wood = rank >= 4 ? C.gold : '#7a5a3a';
  s.v(4, top + 2, 23, wood); s.p(3, top + 1, wood); s.p(5, top, wood); s.p(3, top, wood);
  for (let y = top + 5; y < 23; y += 4) s.p(5, y, wood);
  s.p(2, top, LF); s.p(6, top - 1, LF); s.p(4, top - 1, FL, true); s.p(5, top + 3, LF);
  return s;
}

// Gorm, orc barbare : peau verte, défenses, chignon noir, torse barré d'une sangle, couperet géant.
function gorm(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.gorm, H = '#2a2234', TK = '#efe6cf';
  body(s, { tunic: C.skin, dark: C.skinSh, trim: C.skin, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#8c1f2e', belt: K.main, bracers: m.c });
  // pagne de fourrure et sangle en travers du torse
  s.r(8, 18, 8, 2, K.main); s.p(9, 19, K.dark); s.p(13, 19, K.dark);
  s.sline(8, 14, 15, 18, K.dark); s.p(11, 16, rank >= 4 ? C.gold : m.c);
  s.p(10, 15, '#e8a878', true);
  // défenses, mâchoire
  s.p(10, 12, TK, true); s.p(13, 12, TK, true); s.p(10, 11, TK, true); s.p(13, 11, TK, true);
  s.hl(11, 12, 12, '#6a2a2a');
  // crâne rasé, chignon noir, sourcils froncés
  s.hl(8, 15, 7, '#2e4a22'); s.r(10, 3, 4, 3, H); s.hl(11, 12, 2, H); s.r(11, 6, 2, 1, H);
  s.p(11, 3, '#4a3e5a', true);
  s.p(9, 9, H); s.p(14, 9, H);
  s.p(16, 9, C.skin); s.p(17, 8, C.skin); s.p(7, 9, C.skin); s.p(6, 8, C.skin); // oreilles pointues
  if (rank >= 2) { s.hl(10, 13, 6, m.c); s.p(10, 6, m.hi, true); }
  if (rank >= 4) { s.hl(10, 13, 6, C.gold); s.p(11, 6, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // couperet géant à droite : lame large, dos crénelé
  const y0 = rank >= 3 ? 3 : 6;
  s.v(18, 15, 20, C.grip);
  s.r(18, y0, 3, 15 - y0, m.c);
  s.v(18, y0 + 1, 13, m.hi, true);
  for (let y = y0 + 1; y < 14; y += 3) s.p(21, y, m.c);
  s.p(20, y0 + 2, shade2(m.c));
  if (rank >= 4) s.p(19, 13, C.gem, true);
  // peau verte
  return s.recolor({ [C.skin]: '#7ab84a', [C.skinSh]: '#4e8a34' });
}

// Zara, danseuse : voile sur le bas du visage, bandeau de pièces d'or, longue queue de cheval, cimeterre et foulard.
function zara(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.zara, H = '#2a2234', HH = '#4a3e5a', VL = '#f0a8c8', SC = '#4fd8c8';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && K.dark, belt: K.trim, buckle: '#ffffff' });
  // ventre nu, ceinture de pièces
  s.r(9, 17, 6, 1, C.skin);
  for (const x of [9, 11, 13, 15]) s.p(x, 19, C.gold, true);
  // voile
  s.r(8, 12, 8, 2, VL); s.p(10, 12, '#ffd0e4', true);
  // cheveux noirs, longue queue de cheval qui flotte vers la gauche
  s.r(8, 5, 8, 3, H); s.hl(9, 14, 4, H);
  s.v(7, 6, 10, H); s.v(16, 6, 10, H);
  s.p(8, 8, H); s.p(15, 8, H);
  s.p(6, 6, H); s.p(5, 7, H); s.p(4, 8, H); s.p(4, 9, H); s.p(3, 10, H); s.p(3, 11, H);
  s.p(10, 5, HH, true); s.p(5, 7, HH, true);
  // bandeau de pièces d'or
  s.hl(8, 15, 7, rank >= 2 ? m.c : K.trim);
  for (const x of [9, 12, 15]) s.p(x, 8, C.gold, true);
  if (rank >= 4) { s.hl(8, 15, 7, C.gold); s.r(11, 6, 2, 1, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // foulard turquoise qui ondule à gauche
  for (const [x, y] of [[5, 15], [4, 16], [3, 17], [3, 18], [2, 19], [3, 20]]) s.p(x, y, SC);
  s.p(4, 16, '#a8fff0', true);
  // cimeterre à droite : lame courbe
  const top = rank >= 3 ? 7 : 9;
  s.v(18, top + 2, 17, m.c); s.p(19, top + 1, m.c); s.p(19, top, m.c); s.p(20, top - 1, m.c);
  s.v(18, top + 3, top + 6, m.hi, true);
  s.hl(17, 19, 18, C.gold); s.v(18, 19, 20, C.grip);
  return s;
}

// Kitsune, renarde à neuf queues : oreilles de renard, queues en éventail, kimono blanc et rouge, feux follets bleus.
function kitsune(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.kitsune, H = '#e8702a', HH = '#ffa860', TW = '#fff4e8', FF = '#5ac8ff';
  // queues en éventail derrière, bouts blancs (plus nombreuses avec le rang)
  const tails = [[1, 12], [0, 15], [1, 18], [3, 20], [2, 10]].slice(0, rank >= 3 ? 5 : 3);
  for (const [x, y] of tails) {
    s.sline(x + 1, y + 1, 8, 18, H); s.sline(x + 2, y + 1, 8, 19, H);
    s.p(x, y, TW); s.p(x + 1, y, TW); s.p(x, y + 1, TW);
  }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && K.trim, belt: K.trim, buckle: C.gold });
  // col croisé rouge
  s.p(10, 15, K.trim); s.p(13, 15, K.trim); s.p(11, 16, K.trim);
  // cheveux roux, mèches
  s.r(8, 5, 8, 3, H); s.v(7, 6, 13, H); s.v(16, 6, 13, H);
  s.p(8, 8, H); s.p(10, 8, H); s.p(13, 8, H); s.p(15, 8, H);
  s.p(9, 5, HH, true); s.p(16, 9, HH, true);
  // oreilles de renard, intérieur clair
  for (const x0 of [8, 14]) { s.v(x0, 2, 4, H); s.v(x0 + 1, 3, 4, H); s.p(x0 + (x0 === 8 ? 1 : 0), 4, TW, true); }
  s.p(8, 2, '#2a2234'); s.p(15, 3, '#2a2234');
  if (rank >= 2) { s.hl(9, 14, 5, m.c); s.p(10, 5, m.hi, true); }
  if (rank >= 4) { s.hl(9, 14, 5, C.gold); s.r(11, 5, 2, 1, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // feux follets bleus qui flottent à droite
  for (const [x, y] of rank >= 3 ? [[19, 9], [21, 13], [19, 17]] : [[19, 11], [20, 15]]) {
    s.p(x, y, FF, true); s.p(x, y - 1, '#c8f0ff', true); s.p(x + 1, y, '#2f78d0', true);
  }
  for (const [x, y] of [[22, 6], [12, 0]]) s.spark(x, y, '#c8f0ff');
  return s;
}

// Sybil, voyante : turban violet à joyau, longs cheveux noirs, anneaux d'or, châle étoilé, boule de cristal.
function sybil(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.sybil, H = '#2a2234', TB = '#8a4ac8', TBD = '#6a2a9a', CR = '#c8a8ff';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && '#2a1a5a', bracers: rank >= 2 && m.c });
  // étoiles sur le châle
  s.p(9, 16, K.trim, true); s.p(14, 18, K.trim, true); s.p(12, 20, K.trim, true);
  // longs cheveux noirs, anneaux d'or
  s.v(7, 8, 15, H); s.v(16, 8, 15, H); s.hl(8, 15, 8, H); s.p(9, 9, H); s.p(14, 9, H);
  s.p(7, 11, '#4a3e5a', true);
  s.p(7, 12, C.gold, true); s.p(16, 12, C.gold, true);
  // turban drapé, joyau
  s.r(8, 3, 8, 5, TB); s.hl(9, 14, 2, TB); s.hl(7, 16, 7, TBD);
  s.sline(8, 6, 13, 3, TBD); s.p(9, 3, '#b07ae8', true);
  s.r(11, 4, 2, 2, rank >= 4 ? C.gem : rank >= 2 ? m.c : CR, true);
  s.p(11, 4, '#ffffff', true);
  if (rank >= 3) { s.v(12, 0, 1, rank >= 4 ? C.gold : m.c); s.p(13, 0, W); s.p(11, 1, W); } // plume
  if (rank >= 4) s.hl(7, 16, 7, C.gold);
  if (rank >= 3) pauldrons(s, m);
  // boule de cristal qui flotte devant elle, socle de métal
  const cy = rank >= 3 ? 12 : 14;
  s.hl(19, 21, cy - 2, CR); s.r(18, cy - 1, 5, 3, CR); s.hl(19, 21, cy + 2, CR);
  s.p(19, cy - 1, '#ffffff', true); s.p(21, cy + 1, '#8a6ad8', true); s.p(20, cy, '#e8d8ff', true);
  s.hl(19, 21, cy + 3, rank >= 4 ? C.gold : m.c);
  for (const [x, y] of [[22, 6], [17, 4], [2, 12]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}

// ---------------------------------------------------------------- vague 4 (sans limite)

// Grumli, nain : casque à plaques d'oreilles, immense barbe tressée à anneaux d'or, marteau à tête d'enclume.
function grumli(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.grumli, B = '#5a3a24', BH = '#7a5236';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#2a3a6a', bracers: m.c });
  // immense barbe qui tombe jusqu'à la ceinture, deux tresses à anneaux d'or
  s.r(8, 12, 8, 3, B); s.r(9, 15, 6, 3, B); s.hl(10, 13, 18, B);
  s.v(10, 18, 20, B); s.v(13, 18, 20, B);
  s.p(10, 19, C.gold, true); s.p(13, 19, C.gold, true);
  s.p(9, 13, BH, true); s.p(12, 15, BH, true); s.p(14, 13, BH, true);
  s.hl(10, 13, 12, '#3a2414');
  s.v(7, 9, 12, B); s.v(16, 9, 12, B);
  // gros sourcils
  s.hl(9, 10, 9, B); s.hl(13, 14, 9, B);
  // casque rond à plaques d'oreilles, rivets
  s.r(8, 3, 8, 5, m.c); s.hl(9, 14, 2, m.c);
  s.hl(7, 16, 7, shade2(m.c)); s.v(7, 8, 10, m.c); s.v(16, 8, 10, m.c);
  s.p(9, 3, m.hi, true); s.p(10, 2, m.hi, true);
  for (const x of [9, 12, 14]) s.p(x, 6, shade2(m.c));
  s.v(12, 1, 2, rank >= 4 ? C.gold : m.c);
  if (rank >= 3) { s.p(11, 0, K.trim); s.p(12, 0, K.trim); s.p(13, 0, K.trim); }
  if (rank >= 4) { s.r(11, 4, 2, 2, C.gem, true); s.p(11, 4, '#ff8a9a', true); }
  if (rank >= 3) pauldrons(s, m);
  // marteau à tête d'enclume à gauche
  const y0 = rank >= 3 ? 5 : 8, wood = rank >= 4 ? C.gold : '#7a5a3a';
  s.v(4, y0 + 3, 21, wood);
  for (let y = y0 + 5; y < 21; y += 3) s.p(4, y, rank >= 4 ? C.goldHi : '#5a3f2e', true);
  s.hl(1, 7, y0, m.c); s.hl(2, 6, y0 + 1, m.c); s.hl(3, 5, y0 + 2, m.c); s.p(0, y0, m.c);
  s.hl(1, 5, y0, m.hi, true);
  if (rank >= 4) s.p(4, y0 + 1, C.gem, true);
  return s;
}

// Spike, homme cactus : tête de cactus à épines et fleur, sombrero, poncho rayé, bras de cactus, maraca.
function spike(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.spike, SP = '#f0e8c8', SB = '#e8c860', SBD = '#b8902a', FL = '#ff6ab8';
  // bras de cactus qui monte à gauche, derrière
  s.r(3, 10, 2, 7, '#5aa04a'); s.hl(3, 6, 16, '#5aa04a'); s.p(3, 9, '#5aa04a');
  s.p(2, 11, SP); s.p(2, 14, SP); s.p(5, 12, SP);
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // poncho : deux bandes jaunes seulement
  s.hl(8, 15, 16, K.trim); s.hl(6, 7, 15, K.trim); s.hl(16, 17, 15, K.trim);
  // épines sur la tête de cactus (côtés et front)
  for (const [x, y] of [[7, 9], [7, 12], [16, 10], [16, 13], [9, 8], [14, 8]]) s.p(x, y, SP, true);
  // sombrero : calotte pointue, ruban, très large bord
  s.r(10, 3, 4, 3, SB); s.hl(11, 12, 2, SB);
  s.hl(9, 14, 5, rank >= 4 ? C.gold : '#d8503a');
  s.hl(4, 19, 6, SB); s.hl(5, 18, 7, SBD); s.p(3, 5, SB); s.p(20, 5, SB);
  s.p(10, 3, '#fff0a0', true);
  for (const x of [6, 10, 14, 18]) s.p(x, 6, '#d8503a');
  // fleur rose sur le chapeau (gemme au rang 4)
  s.p(13, 2, rank >= 4 ? C.gem : FL, true); s.p(14, 3, FL, true);
  if (rank >= 2) { s.p(9, 5, m.c); s.p(14, 5, m.c); }
  if (rank >= 3) pauldrons(s, m);
  // maraca à droite
  const y0 = rank >= 3 ? 9 : 11, M = rank >= 4 ? C.gold : '#e8603a';
  s.v(18, y0 + 3, 19, '#8a5a32');
  s.r(17, y0, 3, 3, M); s.p(18, y0 - 1, M); s.p(17, y0, '#ffb070', true);
  s.p(19, y0 + 1, rank >= 2 ? m.c : '#3ab86a', true);
  // peau de cactus
  return s.recolor({ [C.skin]: '#6ab85a', [C.skinSh]: '#3a7a32' });
}

// Bip, petit robot : tête-boîte à antenne et boulons, yeux lumineux, corps orange, bras-blaster.
function bip(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.bip, MT = '#a8b0bc', MD = '#7a8290';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#2a3a6a', belt: '#4a4a5a', buckle: '#4ff0e8' });
  // écran sur la poitrine, voyant
  s.r(10, 15, 4, 2, '#2a3440'); s.p(10, 15, '#4ff0e8', true); s.p(12, 16, '#9af098', true);
  // tête-boîte : coins carrés, boulons sur les côtés, bouche-grille
  s.hl(8, 15, 7, MT); s.v(7, 8, 13, MD); s.v(16, 8, 13, MD);
  s.p(7, 10, '#e0a93a', true); s.p(16, 10, '#e0a93a', true);
  s.hl(10, 13, 12, '#4a4a5a'); s.p(11, 12, MT); s.p(13, 12, MT);
  // yeux lumineux (à la place des traits sombres)
  s.v(10, 10, 11, '#4ff0e8', true); s.v(13, 10, 11, '#4ff0e8', true);
  s.p(9, 12, '#ff8a9a', true); s.p(14, 12, '#ff8a9a', true);
  // antenne à boule (bandeau de métal du rang)
  s.v(12, 3, 6, MD); s.r(11, 1, 2, 2, rank >= 4 ? C.gem : '#e2334a', true); s.p(11, 1, '#ffffff', true);
  s.hl(9, 14, 6, rank >= 2 ? (rank >= 4 ? C.gold : m.c) : MD);
  if (rank >= 3) { s.p(8, 5, m.c); s.p(15, 5, m.c); s.p(8, 4, m.hi, true); s.p(15, 4, m.hi, true); }
  if (rank >= 3) pauldrons(s, m);
  // bras-blaster à droite
  const L = rank >= 3 ? 5 : 4;
  s.r(16, 15, 2, 3, MD);
  s.hl(17, 17 + L, 16, m.c); s.hl(17, 17 + L, 17, MD);
  s.p(18 + L, 16, '#4ff0e8', true);
  s.p(18, 16, m.hi, true);
  // peau de métal
  return s.recolor({ [C.skin]: MT, [C.skinSh]: MD });
}

// Lulu, boulangère : foulard rouge noué, tablier enfariné, baguette sous le bras, croissant à la main.
function lulu(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.lulu, H = '#e8c070', R = '#d83a3a', BG = '#d8a050', BGD = '#a8702a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // tablier blanc, un peu de farine
  s.r(9, 15, 6, 5, W); s.hl(9, 14, 20, W); s.p(13, 17, '#e8e0d8'); s.p(10, 16, '#ffffff', true);
  // cheveux blonds bouclés qui dépassent
  s.v(7, 8, 12, H); s.v(16, 8, 12, H); s.p(8, 8, H); s.p(15, 8, H); s.p(7, 13, H); s.p(16, 13, H);
  // foulard rouge noué sur le dessus, pointe à gauche
  s.r(8, 4, 8, 4, R); s.hl(9, 14, 3, R);
  s.p(10, 4, '#ff7a7a', true); s.p(11, 3, '#ff7a7a', true);
  s.p(7, 5, R); s.p(6, 4, R); s.p(6, 6, '#a02a2a');
  s.hl(8, 15, 7, rank >= 4 ? C.gold : rank >= 2 ? m.c : '#a02a2a');
  if (rank >= 4) s.p(14, 6, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // longue baguette tenue droite à gauche, entailles en biais
  const top = rank >= 3 ? 3 : 6;
  s.r(3, top, 2, 22 - top, BG); s.p(3, top - 1, BG); s.p(4, 22, BG);
  for (let y = top + 2; y < 21; y += 4) { s.p(4, y, BGD); s.p(3, y + 1, BGD); }
  s.p(3, top, '#f0c878', true);
  if (rank >= 4) s.hl(2, 5, 16, C.gold);
  // miche ronde dans la main droite, entaille claire
  s.hl(18, 20, 14, BG); s.r(17, 15, 5, 3, BG); s.hl(18, 20, 18, BGD);
  s.p(18, 15, '#f0c878', true); s.hl(18, 20, 16, '#f0d8a0');
  return s;
}

// DJ Max : gros casque audio, casquette à l'envers, chaîne en or, sweat noir, vinyle à la main.
function djmax(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.djmax, CP = '#e2338a', HP = '#2a2234', NE = '#ff4ab8';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && '#8a2060', bracers: rank >= 2 && m.c });
  // cordons du sweat, chaîne en or
  s.p(10, 15, W); s.p(13, 15, W);
  s.hl(10, 13, 17, C.gold); s.p(11, 18, C.gold); s.p(12, 18, C.goldHi, true);
  // casquette rose à l'envers (visière à gauche), cheveux qui dépassent
  s.r(8, 4, 8, 4, CP); s.hl(9, 14, 3, CP); s.hl(5, 7, 7, '#a82060');
  s.p(10, 4, '#ff8ac8', true);
  s.hl(9, 14, 8, '#3a2a22'); s.p(15, 8, '#3a2a22');
  // casque audio : arceau et gros écouteurs, un point néon
  s.hl(8, 15, 3, HP); s.v(7, 4, 7, HP); s.v(16, 4, 7, HP);
  s.r(6, 8, 2, 4, HP); s.r(16, 8, 2, 4, HP);
  s.p(17, 9, NE, true);
  if (rank >= 2) { s.p(6, 9, m.c); s.p(6, 10, m.c); s.p(16, 3, m.c); }
  if (rank >= 4) { s.hl(8, 15, 3, C.gold); s.p(6, 9, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // vinyle noir dans la main droite, étiquette au centre
  const cy = rank >= 3 ? 14 : 16, R = rank >= 3 ? 3 : 2;
  for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) if (x * x + y * y <= R * R + 1) s.p(19 + x, cy + y, '#1a1a22');
  s.p(19, cy, rank >= 4 ? C.gold : NE, true);
  s.p(18, cy - R + 1, '#5a5a6a', true);
  return s;
}

// Pablo, facteur : casquette à visière, moustache, uniforme bleu à bandes jaunes, sacoche, lettre levée.
function pablo(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.pablo, H = '#3a2a22', SB = '#8a5a32', SBD = '#6a4226';
  // sacoche de cuir sur la hanche gauche, une lettre qui dépasse
  s.r(3, 16, 4, 4, SB); s.hl(3, 6, 16, SBD); s.p(4, 15, W); s.p(5, 15, W); s.p(4, 17, C.gold, true);
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // bandoulière en travers
  s.sline(15, 14, 8, 18, SBD);
  // moustache
  s.hl(10, 13, 12, H);
  s.v(7, 8, 10, H); s.v(16, 8, 10, H);
  // casquette : calotte, bandeau jaune, visière, insigne
  s.r(8, 4, 8, 3, K.main); s.hl(9, 14, 3, K.main);
  s.hl(8, 15, 7, K.trim); s.hl(13, 18, 8, K.dark);
  s.p(9, 4, '#5a8ae0', true);
  s.r(11, 5, 2, 2, rank >= 4 ? C.gold : m.c); s.p(11, 5, rank >= 4 ? C.gem : m.hi, true);
  if (rank >= 3) pauldrons(s, m);
  // le bras droit lève une lettre (cachetée de rouge, timbre au rang 3)
  for (let y = 14; y <= 19; y++) { s.p(16, y, null); s.p(17, y, null); }
  s.r(16, 14, 2, 2, K.main); s.v(17, 10, 14, K.main); s.v(18, 10, 13, K.main); s.hl(17, 18, 10, K.trim);
  s.r(16, 6, 6, 4, W); s.sline(16, 6, 18, 8, '#c8c0d0'); s.sline(21, 6, 19, 8, '#c8c0d0');
  s.p(19, 8, '#d83a3a', true);
  if (rank >= 3) s.p(21, 7, rank >= 4 ? C.gold : '#3ab86a', true);
  return s;
}

// Bob, zombie gentil : peau verte, cicatrice cousue, chemise déchirée, bras tendu vers l'avant.
function bob(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.bob, H = '#4a3a2a', ST = '#3a2a2a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#5a2a4a', bracers: rank >= 2 && m.c });
  // chemise déchirée : trous et ourlet en dents de scie
  s.p(9, 17, C.skin); s.p(14, 15, C.skin); s.p(8, 19, null); s.p(12, 19, null); s.p(15, 19, null);
  // bouche de travers, cicatrice cousue sur le front
  s.hl(11, 12, 12, '#5a2a2a'); s.p(13, 13, '#5a2a2a');
  s.hl(9, 13, 8, ST); for (const x of [10, 12]) { s.p(x, 7, ST); s.p(x, 9, ST); }
  // cheveux en bataille
  s.r(8, 4, 8, 3, H); for (const [x, y] of [[8, 3], [11, 3], [14, 2], [15, 3], [16, 5], [7, 5]]) s.p(x, y, H);
  s.v(7, 6, 9, H); s.v(16, 6, 8, H);
  s.p(10, 4, '#6a5a4a', true);
  if (rank >= 2) { s.hl(8, 15, 7, m.c); s.p(9, 7, m.hi, true); }
  if (rank >= 4) { s.hl(8, 15, 7, C.gold); tiara(s, 6); }
  if (rank >= 3) pauldrons(s, m);
  // le bras droit tendu vers l'avant, main verte, manche en lambeaux
  for (let y = 14; y <= 19; y++) { s.p(16, y, null); s.p(17, y, null); }
  s.r(16, 14, 5, 2, K.main); s.p(18, 16, K.main); s.p(20, 16, K.dark);
  s.r(21, 14, 2, 2, C.skin); s.p(23, 14, C.skin); s.p(23, 15, C.skinSh);
  if (rank >= 3) s.hl(19, 20, 14, m.c);
  // peau de zombie
  return s.recolor({ [C.skin]: '#9ac08a', [C.skinSh]: '#6a9a5a', ['#f0907a']: '#c8a0a8' });
}

// Zip, skateur : casquette rouge à l'envers, mèches, sweat vert, planche de skate debout à gauche.
function zip(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.zip, H = '#e8a040', CP = '#d83a3a', DK = '#2a2234';
  // planche de skate debout à gauche : plateau, roues, dessin
  const t = rank >= 3 ? 6 : 8;
  s.r(2, t, 3, 22 - t, rank >= 4 ? C.gold : '#c8603a'); s.hl(2, 4, t, '#f0a060');
  s.v(3, t + 3, t + 5, rank >= 2 ? m.c : '#fbe08a', true); s.p(3, t + 9, '#fbe08a', true);
  for (const y of [t + 2, 19]) { s.p(1, y, '#f2eef4'); s.p(5, y, '#f2eef4'); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // poche kangourou, cordons
  s.hl(10, 13, 17, K.dark); s.p(10, 15, W); s.p(13, 15, W);
  // mèches blondes qui dépassent devant
  s.hl(8, 15, 7, H); s.p(13, 8, H); s.p(14, 8, H); s.p(15, 8, H); s.p(15, 9, H);
  s.v(16, 7, 10, H); s.p(7, 8, H);
  // casquette à l'envers, visière à gauche
  s.r(8, 4, 8, 3, CP); s.hl(9, 14, 3, CP); s.hl(5, 7, 6, '#a02a2a');
  s.p(10, 4, '#ff7a7a', true);
  if (rank >= 2) s.r(11, 4, 2, 2, m.c);
  if (rank >= 4) s.r(11, 4, 2, 2, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // genouillères
  s.p(9, 20, DK); s.p(14, 20, DK);
  return s;
}

// Rexy, enfant en costume de dinosaure : capuche à dents, crête orange, ventre jaune, grosse queue.
function rexy(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.rexy, SPK = '#f08a2a', TE = '#ffffff';
  // queue derrière, à gauche
  for (const [y, a, b] of [[17, 5, 7], [18, 3, 7], [19, 2, 6], [20, 1, 4], [21, 0, 2]]) s.hl(a, b, y, K.main);
  s.p(3, 18, SPK); s.p(1, 20, SPK); s.hl(3, 5, 20, K.dark);
  body(s, { tunic: K.main, dark: K.dark, trim: K.dark, pants: K.pants, ...boots(m), cape: rank >= 4 && '#d8323c', bracers: rank >= 2 && m.c });
  // ventre jaune
  s.r(10, 15, 4, 3, K.trim); s.hl(10, 13, 16, '#e8c860');
  // capuche de dino : tête verte, rangée de dents blanches au-dessus du visage, yeux de la capuche
  s.r(8, 3, 8, 5, K.main); s.hl(9, 14, 2, K.main); s.v(7, 5, 13, K.main); s.v(16, 5, 13, K.main);
  s.hl(16, 18, 5, K.main); s.hl(16, 18, 6, K.main); s.p(18, 4, K.main);
  for (const x of [8, 10, 12, 14]) s.p(x, 8, TE, true);
  s.hl(8, 15, 7, K.dark);
  s.p(15, 4, '#2a2234', true); s.p(15, 3, '#ffffff', true);
  // crête : pointes orange sur le dessus (plus nombreuses avec le rang)
  const spikes = rank >= 3 ? [[9, 1], [11, 0], [13, 1], [7, 3]] : [[10, 1], [12, 1]];
  for (const [x, y] of spikes) { s.p(x, y, rank >= 4 ? C.gold : SPK); s.p(x, y + 1, rank >= 4 ? C.gold : SPK); }
  if (rank >= 2) s.p(17, 5, m.c);
  if (rank >= 4) s.p(12, 3, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // petites griffes de peluche aux mains
  s.p(6, 19, TE); s.p(17, 19, TE);
  return s;
}

// Léo, homme-lion : grande crinière, oreilles rondes, museau clair, armure royale bleue, griffes de métal.
function leo(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.leo, MN = '#b8601e', MNH = '#d8803a', MNL = '#e8a050', MZ = '#f8e0b8';
  // crinière derrière la tête : très large
  for (const [y, a, b] of [[3, 9, 14], [4, 7, 16], [5, 6, 17], [6, 5, 18], [7, 5, 18], [8, 5, 18], [9, 5, 18], [10, 5, 18], [11, 5, 18], [12, 6, 17], [13, 6, 17], [14, 7, 16]]) s.hl(a, b, y, MN);
  for (const [x, y] of [[7, 5], [5, 8], [17, 7], [6, 12], [16, 11], [10, 3]]) s.p(x, y, MNH, true);
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && '#a82a2a', bracers: m.c });
  // oreilles rondes sur la crinière
  s.r(7, 3, 2, 2, '#e0a860'); s.r(15, 3, 2, 2, '#e0a860'); s.p(8, 4, '#b07a3a'); s.p(15, 4, '#b07a3a');
  // mèche de crinière sur le front, museau clair
  s.hl(9, 14, 7, MNL); s.p(11, 8, MNL); s.p(12, 8, MNL);
  s.r(10, 12, 4, 2, MZ); s.p(11, 12, '#6a3a2a'); s.p(12, 12, '#6a3a2a');
  // emblème d'or
  s.p(11, 16, C.gold, true); s.p(12, 16, C.gold, true); s.p(11, 15, C.goldHi, true);
  if (rank >= 2 && rank < 4) { s.hl(9, 14, 6, m.c); s.p(10, 6, m.hi, true); }
  if (rank >= 4) { for (const x of [9, 11, 12, 14]) s.p(x, 5, C.gold); s.hl(9, 14, 6, C.gold); s.r(11, 6, 2, 1, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // griffes de métal à la main droite, qui dépassent
  const L = rank >= 3 ? 4 : 3;
  for (const y of [16, 18, 20]) { s.hl(18, 17 + L, y - 1, m.c); s.p(18 + L, y - 1, m.hi, true); }
  s.r(16, 15, 2, 4, rank >= 4 ? C.gold : m.c);
  // pelage
  return s.recolor({ [C.skin]: '#e0a860', [C.skinSh]: '#b07a3a' });
}

// Capitaine Tonnerre, super-héros : combinaison noire à éclair jaune, cape d'or, banane, éclair dans la main.
function tonnerre(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.tonnerre, H = '#3a2a22', Y = K.trim, CP = '#6a3aa8';
  body(s, { tunic: K.main, dark: K.dark, trim: rank >= 4 ? C.gold : '#4a3e5a', pants: K.pants, ...boots(m), cape: CP, belt: Y, buckle: '#ffffff', bracers: rank >= 2 && m.c });
  // éclair jaune sur la poitrine
  s.p(12, 14, Y, true); s.p(11, 15, Y, true); s.p(12, 15, Y, true); s.p(11, 16, Y, true); s.p(12, 17, Y, true);
  // cheveux bruns avec une banane qui pointe vers l'avant
  s.r(8, 5, 8, 3, H); s.hl(10, 15, 4, H); s.hl(13, 16, 3, H); s.p(17, 4, H);
  s.v(7, 6, 9, H); s.v(16, 6, 9, H); s.p(15, 8, H);
  s.p(12, 4, '#5a4a3a', true); s.p(15, 3, '#5a4a3a', true);
  // loup jaune autour des yeux
  s.hl(9, 14, 9, Y); s.p(9, 10, Y); s.p(14, 10, Y); s.p(11, 10, Y); s.p(12, 10, Y);
  if (rank >= 2) { s.p(8, 9, m.c); s.p(15, 9, m.c); }
  if (rank >= 4) tiara(s, 6);
  if (rank >= 3) pauldrons(s, m);
  // éclair qui crépite au-dessus de la main droite
  const top = rank >= 3 ? 3 : 6;
  s.sline(19, top, 17, top + 4, Y); s.hl(17, 19, top + 4, Y); s.sline(19, top + 5, 18, top + 10, Y);
  s.p(19, top, '#ffffff', true); s.p(18, top + 4, '#ffffff', true);
  for (const [x, y] of [[21, 4], [2, 12]]) s.spark(x, y, '#ffffff');
  return s;
}

// Ramsès, pharaon momie : bandelettes, coiffe rayée bleu et or, bandelette qui flotte, sceptre ânkh.
function ramses(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.ramses, BL = '#2a4a9a', G = C.gold, BD = '#c8b898';
  // bandelette qui flotte derrière, à gauche
  s.p(6, 15, K.main); s.p(5, 16, K.main); s.p(4, 16, K.main); s.p(3, 17, K.main); s.p(2, 18, K.main); s.p(3, 19, BD);
  body(s, { tunic: K.main, dark: K.dark, trim: G, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && BL, belt: BL, buckle: G });
  // lignes des bandelettes (quelques-unes, pas sur tout le tissu)
  s.hl(8, 11, 16, BD); s.hl(12, 15, 17, BD); s.p(7, 15, BD); s.p(16, 16, BD);
  s.hl(8, 12, 9, BD); s.hl(11, 15, 13, BD);
  // collier d'or
  s.hl(9, 14, 14, G); s.p(11, 15, BL); s.p(12, 15, G);
  // coiffe de pharaon : rayures bleu et or qui tombent sur les épaules
  s.r(8, 3, 8, 4, G); s.hl(9, 14, 2, G);
  for (const x of [9, 11, 13, 15]) s.v(x, 3, 6, BL);
  s.hl(7, 16, 7, G);
  for (const x of [7, 16]) { s.v(x, 8, 13, x === 7 ? BL : G); s.v(x === 7 ? 6 : 17, 9, 13, x === 7 ? G : BL); }
  // cobra d'or sur le front (métal du rang à la place au rang 2-3)
  s.p(12, 2, rank >= 2 && rank < 4 ? m.c : G); s.p(12, 1, rank >= 2 && rank < 4 ? m.hi : G);
  if (rank >= 4) s.r(11, 4, 2, 2, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // sceptre ânkh à droite
  const top = rank >= 3 ? 2 : 5, A = rank >= 4 ? G : m.c;
  s.v(19, top + 4, 22, rank >= 4 ? G : '#7a5a3a');
  s.r(18, top, 3, 3, A); s.p(19, top + 1, null); s.hl(17, 21, top + 3, A);
  s.p(18, top, rank >= 4 ? C.goldHi : m.hi, true);
  // peau de bandelettes
  return s.recolor({ [C.skin]: '#e8dcc0', [C.skinSh]: '#b8a888', ['#f0907a']: '#d8c8a8' });
}

// Elixa, alchimiste : cheveux roses bouffants, lunettes de laiton sur le front, robe lie-de-vin, fiole qui bouillonne.
function elixa(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.elixa, H = '#e88ab8', HH = '#ffb8d8', BR = '#c8903a', LQ = '#ff8a2a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && K.dark, bracers: rank >= 2 && m.c });
  // ceinture de fioles
  s.p(9, 18, '#7af06a', true); s.p(10, 18, '#5ac8ff', true); s.p(14, 18, '#ff8a2a', true);
  // cheveux roses bouffants
  s.r(8, 4, 8, 4, H); s.hl(9, 14, 3, H); s.v(7, 5, 12, H); s.v(16, 5, 12, H); s.v(6, 7, 10, H); s.v(17, 7, 10, H);
  s.p(8, 8, H); s.p(15, 8, H);
  s.p(9, 4, HH, true); s.p(6, 8, HH, true);
  // lunettes de laiton relevées sur le front
  s.hl(8, 15, 6, '#5a3a22');
  s.r(9, 5, 2, 2, BR); s.r(13, 5, 2, 2, BR);
  s.p(9, 5, '#c8f0ff', true); s.p(13, 5, '#c8f0ff', true);
  if (rank >= 2) { s.p(10, 6, m.c); s.p(14, 6, m.c); }
  if (rank >= 4) tiara(s, 4);
  if (rank >= 3) pauldrons(s, m);
  // fiole ronde à droite, liquide orange qui bouillonne
  const cy = rank >= 3 ? 13 : 15;
  s.v(19, cy - 4, cy - 2, '#d8f0ff'); s.p(19, cy - 5, '#8a5a32');
  s.r(17, cy - 1, 5, 4, '#d8f0ff'); s.hl(18, 20, cy + 3, '#d8f0ff');
  s.r(18, cy, 3, 3, LQ, true); s.hl(17, 21, cy + 1, LQ, true);
  s.p(18, cy, '#ffd080', true); s.p(17, cy - 1, '#ffffff', true);
  s.p(20, cy - 6, '#ffd080', true); s.p(18, cy - 7, '#ffd080', true);
  return s;
}

// Mako, homme-requin : aileron sur la tête, dents pointues, peau gris-bleu à ventre blanc, short orange, trident.
function mako(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.mako, FN = '#5a7a98';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#2a5a8a', belt: '#2a2234', buckle: C.gold, bracers: rank >= 2 && m.c });
  // ventre blanc, short
  s.r(10, 15, 4, 3, K.trim); s.r(8, 18, 8, 2, K.pants); s.p(10, 19, '#ffb070');
  // tête de requin : aileron dorsal, ventre blanc sous la bouche, dents
  for (const [y, a, b] of [[0, 12, 12], [1, 11, 12], [2, 10, 12], [3, 9, 12], [4, 9, 13], [5, 8, 14], [6, 8, 15]]) s.hl(a, b, y, FN);
  s.p(10, 2, '#9ab8d8', true); s.p(9, 4, '#9ab8d8', true);
  s.r(9, 12, 6, 2, K.trim);
  for (const x of [9, 11, 13]) s.p(x, 12, '#c8c0c8');
  s.hl(9, 14, 13, '#3a2a3a'); s.p(10, 13, '#ffffff', true); s.p(12, 13, '#ffffff', true); s.p(14, 13, '#ffffff', true);
  // ouïes
  s.p(15, 10, FN); s.p(15, 11, FN);
  if (rank >= 2) { s.hl(8, 15, 7, m.c); s.p(9, 7, m.hi, true); }
  if (rank >= 4) { s.hl(8, 15, 7, C.gold); s.r(11, 6, 2, 1, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // trident à droite
  const y0 = rank >= 3 ? 1 : 4, wood = rank >= 4 ? C.gold : '#4a6a8a';
  s.v(19, y0 + 4, 22, wood);
  s.hl(17, 21, y0 + 3, m.c);
  for (const x of [17, 19, 21]) s.v(x, y0 + (x === 19 ? 0 : 1), y0 + 2, m.c);
  s.p(19, y0, m.hi, true);
  return s.recolor({ [C.skin]: '#8aaac8', [C.skinSh]: '#6a8aa8' });
}

// Pixel, hackeuse : carré violet à mèche, visière lumineuse, sweat noir, ordinateur portable ouvert.
function pixel(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.pixel, H = '#9a5ad8', HH = '#c89af0', NE = '#4ff0e8';
  // ordinateur portable ouvert à gauche, écran qui luit
  s.r(1, 13, 5, 4, '#2a3440'); s.r(2, 14, 3, 2, '#1e5a4a', true); s.p(2, 14, NE, true); s.p(3, 15, '#9af098', true);
  s.hl(1, 6, 17, rank >= 4 ? C.gold : m.c); s.hl(2, 7, 18, '#4a4a5a');
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && '#3a2a6a', bracers: rank >= 2 && m.c });
  // câble qui pend, autocollant
  s.v(15, 15, 19, '#4a4a5a'); s.p(10, 16, '#ff8ac8', true);
  // carré violet, mèche claire, oreillette
  s.r(8, 4, 8, 4, H); s.hl(9, 14, 3, H); s.v(7, 5, 12, H); s.v(16, 5, 12, H);
  s.p(8, 8, H); s.p(9, 8, H); s.p(10, 8, H);
  s.v(11, 4, 7, HH, true);
  // visière lumineuse à la place des yeux
  s.hl(8, 15, 10, '#2a3440'); s.hl(8, 15, 11, '#2a3440');
  s.v(10, 10, 11, NE, true); s.v(13, 10, 11, NE, true);
  if (rank >= 2) { s.p(7, 10, m.c); s.p(16, 10, m.c); }
  if (rank >= 4) tiara(s, 4);
  if (rank >= 3) pauldrons(s, m);
  for (const [x, y] of [[20, 9], [19, 16]]) s.spark(x, y, '#9af098');
  return s;
}

// Lumi, chevalière au sabre de lumière : chignon, tunique beige, cape de bure, sabre vert lumineux.
function lumi(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.lumi, H = '#6b4428', HH = '#8a5a34', CL = '#6a4a32', SB = '#5ae05a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: CL, belt: CL, buckle: rank >= 4 ? C.gold : m.c, bracers: rank >= 2 && m.c });
  // tunique croisée
  s.sline(10, 14, 13, 17, K.dark);
  // cheveux bruns en chignon, capuche de bure baissée sur les épaules
  s.r(8, 5, 8, 3, H); s.v(7, 6, 10, H); s.v(16, 6, 10, H); s.p(9, 8, H); s.p(14, 8, H);
  s.r(11, 2, 3, 3, H); s.p(12, 2, HH, true); s.p(9, 5, HH, true);
  s.hl(7, 16, 13, CL); s.p(6, 13, CL); s.p(17, 13, CL);
  if (rank >= 2) s.hl(11, 13, 5, rank >= 4 ? C.gold : m.c);
  if (rank >= 4) s.p(12, 4, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // sabre de lumière : poignée de métal, lame lumineuse à cœur blanc
  const top = rank >= 3 ? 1 : 4;
  s.v(18, 17, 20, m.c); s.p(18, 18, '#2a2234'); s.hl(17, 19, 17, m.c);
  s.v(18, top, 16, SB, true); s.v(18, top + 1, 15, '#d8ffd0', true); s.p(18, top, '#ffffff', true);
  s.v(19, top + 1, 16, '#2a9a3a', true);
  return s;
}

// Kero, grenouille ninja : peau verte, gros yeux sur le dessus, bandeau rouge aux pans flottants, shuriken.
function kero(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.kero, R = K.trim, GR = '#6ac84a', GD = '#4a9a34';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && R, belt: R, buckle: C.gold, bracers: rank >= 2 && m.c });
  // ventre clair, large bouche
  s.r(10, 15, 4, 2, '#c8e8a0');
  s.hl(9, 14, 12, GD);
  // haut de la tête vert, deux gros yeux en bosses
  s.r(8, 5, 8, 3, GR);
  for (const x0 of [8, 13]) { s.r(x0, 2, 3, 3, GR); s.p(x0 + 1, 3, '#ffffff', true); s.p(x0 + 1, 4, '#21182a', true); }
  s.v(7, 6, 11, GR); s.v(16, 6, 11, GR);
  // bandeau de ninja rouge, plaque de métal, pans qui flottent
  s.hl(7, 16, 7, R);
  s.r(11, 7, 2, 1, rank >= 4 ? C.gold : rank >= 2 ? m.c : '#a82030');
  s.p(6, 7, R); s.p(5, 8, R); s.p(4, 8, R); s.p(5, 9, '#a82030'); s.p(3, 9, '#a82030');
  if (rank >= 4) s.p(11, 7, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // shuriken à droite (plus grand au rang 3)
  const cx = 19, cy = rank >= 3 ? 14 : 16, M = rank >= 4 ? C.gold : m.c;
  s.p(cx, cy, '#2a2234'); s.v(cx, cy - 2, cy - 1, M); s.v(cx, cy + 1, cy + 2, M); s.hl(cx - 2, cx - 1, cy, M); s.hl(cx + 1, cx + 2, cy, M);
  if (rank >= 3) { s.p(cx - 1, cy - 1, M); s.p(cx + 1, cy + 1, M); s.p(cx + 1, cy - 1, M); s.p(cx - 1, cy + 1, M); }
  s.p(cx, cy - 2, rank >= 4 ? C.goldHi : m.hi, true);
  return s.recolor({ [C.skin]: GR, [C.skinSh]: GD });
}

// Atlas, méca-gardien : robot blanc et or, visage-écran aux yeux cyan, aileron en V, gros bouclier, canon au bras.
function atlas(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.atlas, FP = '#4a5a7a', NE = '#4ff0e8';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: '#2a3a7a', belt: FP, buckle: NE });
  // réacteur cyan au cœur, plaques
  s.r(11, 15, 2, 2, NE, true); s.p(11, 15, '#ffffff', true); s.hl(9, 14, 17, K.dark);
  // tête de robot : casque blanc, visage-écran, yeux lumineux, aileron d'or en V
  s.r(8, 4, 8, 4, K.main); s.hl(9, 14, 3, K.main); s.v(7, 6, 13, K.main); s.v(16, 6, 13, K.main);
  s.v(10, 10, 11, NE, true); s.v(13, 10, 11, NE, true);
  s.p(9, 12, '#2a3440'); s.p(14, 12, '#2a3440'); s.hl(10, 13, 12, '#2a3440');
  s.sline(12, 4, 9, 1, C.gold); s.sline(12, 4, 15, 1, C.gold); s.p(12, 4, rank >= 4 ? C.gem : NE, true);
  s.p(9, 4, '#ffffff', true);
  // grosses épaulières d'or à tous les rangs (métal du rang par-dessus)
  for (const x of [4, 16]) { s.r(x, 12, 4, 3, K.trim); s.hl(x, x + 3, 12, rank >= 2 ? m.c : K.trim); s.p(x + 1, 12, rank >= 2 ? m.hi : C.goldHi, true); }
  // bouclier d'énergie à gauche, canon au bras droit
  const sh = rank >= 3 ? 9 : 11;
  for (let y = sh; y <= 21; y++) s.hl(1, 4, y, y === sh || y === 21 ? m.c : FP);
  s.v(2, sh + 1, 20, NE, true); s.p(2, sh + 1, '#ffffff', true);
  const L = rank >= 3 ? 5 : 4;
  s.r(16, 15, 2, 4, K.main); s.r(18, 15, L, 3, m.c); s.p(18 + L, 16, NE, true); s.p(18, 15, m.hi, true);
  for (const [x, y] of [[21, 4], [22, 11], [6, 1]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s.recolor({ [C.skin]: FP, [C.skinSh]: '#34405a', ['#f0907a']: FP });
}

// Pyra, phénix : ailes de flammes déployées, cheveux de plumes de feu, robe rouge, diadème d'or.
function pyra(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.pyra, F1 = '#ff8a2a', F2 = '#fbe08a', F3 = '#e2334a';
  // ailes de flammes derrière, de chaque côté (plus grandes au rang 3)
  const wing = rank >= 3 ? [[8, 3, 5], [9, 1, 5], [10, 0, 5], [11, 1, 5], [12, 0, 5], [13, 2, 5], [14, 1, 5], [15, 3, 5]] : [[10, 3, 5], [11, 2, 5], [12, 1, 5], [13, 3, 5], [14, 2, 5]];
  for (const [y, a, b] of wing) { s.hl(a, b, y, F1); s.hl(23 - b, 23 - a, y, F1); s.p(a, y, F3); s.p(23 - a, y, F3); }
  s.p(4, 11, F2, true); s.p(19, 11, F2, true); s.p(3, 12, F2, true); s.p(20, 13, F2, true);
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), robe: true, cape: rank >= 4 && F1, bracers: rank >= 2 && m.c });
  // flamme brodée sur la robe
  s.p(12, 16, F2, true); s.p(11, 17, F1, true); s.p(12, 18, F1, true);
  // cheveux de plumes de feu, qui partent en arrière
  s.r(8, 5, 8, 3, F1); s.hl(9, 15, 4, F1); s.v(7, 6, 12, F1); s.v(16, 6, 12, F1);
  s.p(8, 8, F1); s.p(14, 8, F1); s.p(15, 8, F1);
  for (const [x, y] of [[8, 3], [7, 2], [10, 2], [12, 3], [6, 4]]) s.p(x, y, F3);
  s.p(9, 5, F2, true); s.p(11, 4, F2, true); s.p(16, 9, F2, true);
  // diadème
  s.hl(8, 15, 7, rank >= 4 ? C.gold : rank >= 2 ? m.c : C.gold);
  s.r(11, 6, 2, 1, rank >= 4 ? C.gem : F2, true);
  if (rank >= 4) { s.p(11, 5, C.gold); s.p(12, 5, C.goldHi, true); }
  if (rank >= 3) pauldrons(s, m);
  for (const [x, y] of [[2, 6], [21, 5], [12, 0]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : F2);
  return s;
}

// Mortis, roi-liche : crâne pâle, couronne de glace, robe bleu nuit à givre, bâton au crâne gelé.
function mortis(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.mortis, IC = K.trim, BO = '#e8e0cc';
  body(s, { tunic: K.main, dark: K.dark, trim: IC, pants: K.pants, ...boots(m), robe: true, mouth: false, cape: '#141c38', bracers: rank >= 2 && m.c });
  // côtes qui se devinent, givre sur la robe
  s.hl(10, 13, 15, BO); s.hl(10, 13, 17, BO); s.p(14, 20, IC, true); s.p(9, 19, IC, true);
  // crâne : orbites sombres, petite lueur cyan, mâchoire
  s.r(9, 9, 2, 3, '#2a2234'); s.r(13, 9, 2, 3, '#2a2234');
  s.p(10, 10, IC, true); s.p(13, 10, IC, true);
  s.hl(10, 13, 12, '#2a2234'); s.p(11, 13, BO); s.p(12, 12, BO);
  // capuche sombre et couronne de glace
  s.r(8, 5, 8, 2, K.dark); s.v(7, 6, 13, K.dark); s.v(16, 6, 13, K.dark); s.hl(8, 15, 7, K.dark);
  s.hl(8, 15, 4, rank >= 4 ? C.gold : rank >= 2 ? m.c : '#5a8ab0');
  const spikes = rank >= 3 ? [[8, 1], [10, 2], [12, 0], [13, 1], [15, 2]] : [[9, 2], [12, 1], [14, 2]];
  for (const [x, y] of spikes) s.v(x, y, 3, IC, true);
  s.p(12, rank >= 3 ? 0 : 1, '#ffffff', true);
  if (rank >= 4) s.p(11, 4, C.gem, true);
  if (rank >= 3) pauldrons(s, m);
  // bâton à droite : cristal de glace sur un petit crâne
  const top = rank >= 3 ? 1 : 4, wood = rank >= 4 ? C.gold : '#4a5a7a';
  s.v(19, top + 6, 23, wood);
  s.r(18, top + 4, 3, 2, BO); s.p(18, top + 4, '#2a2234', true); s.p(20, top + 4, '#2a2234', true);
  s.v(19, top, top + 3, IC, true); s.p(18, top + 2, IC, true); s.p(20, top + 1, IC, true); s.p(19, top, '#ffffff', true);
  for (const [x, y] of [[22, 3], [3, 8], [21, 16]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : IC);
  return s.recolor({ [C.skin]: BO, [C.skinSh]: '#b8ac90', ['#f0907a']: BO });
}

// ---------------------------------------------------------------- clins d'œil : My Hero Academia

// Shoto : cheveux moitié blancs moitié rouges, cicatrice de brûlure, glace à gauche, feu à droite.
function shoto(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.shoto, HW = '#f2eef4', HR = '#d8402a', IC = '#8ae8ff', ICD = '#4ab8d8';
  // glace qui couvre le côté gauche (pics de glace derrière le bras)
  const big = rank >= 3;
  for (const [x, y] of big ? [[4, 9], [3, 11], [2, 14], [3, 17], [4, 20], [5, 12]] : [[4, 12], [3, 15], [4, 18]]) { s.v(x, y, y + 2, IC); s.p(x, y, '#ffffff', true); s.p(x + 1, y + 2, ICD); }
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), cape: rank >= 4 && K.dark, belt: '#b9c6d2', buckle: rank >= 4 ? C.gold : m.c });
  // harnais argenté sur la poitrine, bras gauche givré
  s.v(9, 14, 17, K.trim); s.v(14, 14, 17, K.trim); s.hl(9, 14, 16, K.trim);
  s.r(6, 14, 2, 3, IC); s.p(6, 14, '#ffffff', true);
  // cheveux : blancs à gauche, rouges à droite
  s.r(8, 4, 4, 4, HW); s.r(12, 4, 4, 4, HR); s.hl(9, 11, 3, HW); s.hl(12, 14, 3, HR);
  s.v(7, 5, 11, HW); s.v(16, 5, 11, HR);
  s.p(8, 8, HW); s.p(9, 8, HW); s.p(14, 8, HR); s.p(15, 8, HR);
  s.p(9, 4, '#ffffff', true); s.p(13, 4, '#ff7a5a', true);
  // cicatrice de brûlure autour de l'œil droit
  s.p(14, 9, '#b8606a'); s.p(14, 10, '#b8606a'); s.p(15, 10, '#b8606a'); s.p(14, 11, '#c87a7a');
  if (rank >= 2) { s.p(10, 16, m.c); s.p(13, 16, m.c); }
  if (rank >= 4) tiara(s, 7);
  if (rank >= 3) pauldrons(s, m);
  // flamme dans la main droite (plus grande au rang 3)
  const cy = big ? 14 : 16;
  s.r(17, cy, 3, 3, '#ff8a2a', true); s.p(18, cy - 1, '#ff8a2a', true); s.p(18, cy - 2, '#fbe08a', true);
  if (big) { s.p(19, cy - 2, '#e2334a', true); s.p(17, cy - 1, '#e2334a', true); s.p(20, cy + 1, '#ff8a2a', true); }
  s.p(18, cy + 1, '#ffffff', true);
  return s;
}

// Bakugo : cheveux blond cendré en pétard, regard furieux, X orange sur la poitrine, gantelets-grenades.
function bakugo(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.bakugo, H = '#f0e0a0', HS = '#c8b070', O = K.trim, GR = '#e8702a';
  body(s, { tunic: K.main, dark: K.dark, trim: '#4a3e5a', pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#8c1f2e', belt: GR, buckle: rank >= 4 ? C.gold : m.c });
  // le grand X orange sur la poitrine
  s.sline(9, 14, 14, 17, O); s.sline(14, 14, 9, 17, O);
  // grimace furieuse (dents serrées), sourcils froncés
  s.hl(10, 13, 12, '#ffffff'); s.hl(10, 13, 13, '#6a2a2a');
  s.p(9, 9, HS); s.p(10, 9, '#21182a'); s.p(13, 9, '#21182a'); s.p(14, 9, HS);
  // cheveux en pétard : pointes partout
  s.r(8, 4, 8, 4, H);
  for (const [x, y] of [[7, 4], [6, 6], [8, 2], [9, 3], [10, 1], [12, 2], [13, 1], [14, 2], [16, 3], [17, 5], [16, 4], [7, 7], [6, 8], [16, 8], [17, 8]]) s.p(x, y, H);
  s.v(7, 5, 10, H); s.v(16, 5, 10, H);
  s.p(8, 8, H); s.p(11, 8, H); s.p(15, 8, H);
  s.p(10, 4, HS); s.p(13, 5, HS); s.p(9, 5, '#fff8d0', true);
  if (rank >= 2) { s.hl(9, 14, 7, m.c); s.p(10, 7, m.hi, true); }
  if (rank >= 4) { s.hl(9, 14, 7, C.gold); s.r(11, 6, 2, 1, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // gantelets-grenades énormes aux deux bras (goupille au rang 2)
  const G = rank >= 4 ? C.gold : GR;
  for (const x0 of [4, 16]) {
    s.hl(x0 + 1, x0 + 2, 15, G); s.r(x0, 16, 4, 4, G); s.hl(x0 + 1, x0 + 2, 20, G);
    s.hl(x0, x0 + 3, 16, m.c); s.p(x0 + 1, 17, rank >= 4 ? C.goldHi : '#ffa060', true);
    s.p(x0 + (x0 < 10 ? 0 : 3), 14, m.c); s.p(x0 + (x0 < 10 ? 0 : 3), 13, m.hi, true); // goupille
  }
  return s;
}

// Red Riot : cheveux rouges dressés en pointes, cicatrice, sourire à dents pointues, torse nu, épaulières crantées.
function redriot(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.redriot, H = '#e2334a', HS = '#a8203a', RK = '#a8a0a8';
  body(s, { tunic: C.skin, dark: C.skinSh, trim: C.skin, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#8c1f2e', belt: H, buckle: rank >= 4 ? C.gold : '#2a2234' });
  // torse nu, abdos ; short noir à bandes rouges
  s.p(10, 16, C.skinSh); s.p(13, 16, C.skinSh); s.p(11, 15, C.skinSh); s.p(12, 15, C.skinSh);
  s.r(8, 19, 8, 1, K.main); s.p(10, 20, H); s.p(13, 20, H);
  // sourire à dents pointues, cicatrice sur l'œil gauche
  s.hl(10, 13, 12, '#ffffff'); s.p(10, 13, '#ffffff'); s.p(12, 13, '#ffffff'); s.p(11, 13, '#6a2a2a'); s.p(13, 13, '#6a2a2a');
  s.v(9, 9, 10, '#c87a6a');
  // cheveux rouges dressés en lames
  s.r(8, 4, 8, 3, H);
  // trois grandes lames qui montent vers l'arrière
  for (const [x0, top] of [[8, 1], [11, 0], [14, 1]]) for (let y = top; y < 4; y++) s.hl(x0, x0 + Math.min(2, y - top), y, H);
  s.v(7, 4, 9, H); s.v(16, 5, 9, H); s.hl(8, 15, 7, H); s.p(16, 3, H); s.p(17, 4, H);
  s.p(8, 2, '#ff7a8a', true); s.p(11, 1, '#ff7a8a', true); s.p(13, 5, HS); s.p(10, 4, HS);
  // épaulières crantées noires et rouges (métal du rang aux dents)
  for (const x of [4, 16]) { s.r(x, 13, 4, 3, K.main); s.hl(x, x + 3, 13, H); }
  s.p(3, 13, rank >= 2 ? m.c : H); s.p(20, 13, rank >= 2 ? m.c : H); s.p(4, 12, rank >= 2 ? m.c : H); s.p(19, 12, rank >= 2 ? m.c : H);
  if (rank >= 4) tiara(s, 7);
  // poings durcis comme de la roche (dès le rang 3, les bras aussi)
  for (const x of [6, 16]) { s.r(x, 17, 2, 2, RK); s.p(x, 17, '#d8d0d8', true); }
  if (rank >= 3) for (const x of [6, 16]) { s.v(x, 14, 16, RK); s.p(x + 1, 15, '#7a7280'); }
  if (rank >= 4) { s.p(6, 18, C.gold); s.p(17, 18, C.gold); }
  return s;
}

// Deku : cheveux verts en bataille, capuche à oreilles pointues, combinaison verte, baskets rouges, éclairs verts.
function deku(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.deku, H = '#2a5a3a', HH = '#4a8a5a', GL = '#5af08a';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, boots: '#d83a3a', bootsHi: '#ff8a8a', sole: '#f2eef4', cape: rank >= 4 && '#2a5a3a', belt: '#e2334a', buckle: rank >= 4 ? C.gold : m.c });
  // lignes noires de la combinaison, genouillères
  s.v(11, 15, 17, K.trim); s.p(9, 20, K.trim); s.p(14, 20, K.trim);
  // capuche dans le dos : deux oreilles pointues
  s.v(7, 2, 5, K.dark); s.p(6, 1, K.dark); s.v(16, 2, 5, K.dark); s.p(17, 1, K.dark);
  // cheveux vert foncé en bataille, mèches claires
  s.r(8, 4, 8, 4, H);
  for (const [x, y] of [[8, 3], [10, 2], [11, 3], [13, 2], [15, 3], [7, 6], [16, 6]]) s.p(x, y, H);
  s.v(7, 7, 10, H); s.v(16, 7, 10, H);
  s.p(8, 8, H); s.p(10, 8, H); s.p(13, 8, H); s.p(15, 8, H);
  s.p(9, 5, HH, true); s.p(12, 4, HH, true); s.p(14, 6, HH, true);
  // taches de rousseur
  s.p(9, 11, '#c8806a', true); s.p(14, 11, '#c8806a', true);
  if (rank >= 2) { s.hl(9, 14, 7, m.c); s.p(10, 7, m.hi, true); }
  if (rank >= 4) { s.hl(9, 14, 7, C.gold); s.r(11, 6, 2, 1, C.gem, true); }
  if (rank >= 3) pauldrons(s, m);
  // gros gant blanc à bandes rouges, éclairs verts autour du bras droit
  s.r(16, 16, 3, 3, '#f2eef4'); s.hl(16, 18, 18, '#e2334a'); s.p(16, 16, '#ffffff', true);
  const bolts = rank >= 3 ? [[19, 12], [20, 13], [19, 14], [21, 15], [5, 13], [4, 14], [20, 18]] : [[19, 13], [20, 14], [19, 15], [5, 14]];
  for (const [x, y] of bolts) s.p(x, y, GL, true);
  s.p(20, rank >= 3 ? 11 : 12, '#ffffff', true);
  return s;
}

// All Might : les deux mèches blondes dressées, grand sourire, ombre sur les yeux, costume bleu, blanc et rouge, carrure énorme.
function allmight(rank) {
  const s = new Spr(24, 24), m = METALS[rank - 1], K = NEW_CLASS.allmight, H = '#f8d850', HS = '#d8a830', Y = '#f0c030';
  body(s, { tunic: K.main, dark: K.dark, trim: K.trim, pants: K.pants, ...boots(m), mouth: false, cape: rank >= 4 && '#e2334a', belt: Y, buckle: rank >= 4 ? C.gold : m.c });
  // carrure énorme : épaules larges, plastron blanc en V, bande rouge
  for (const x of [5, 16]) s.r(x, 13, 3, 3, K.main);
  s.hl(9, 14, 14, '#f2eef4'); s.hl(10, 13, 15, '#f2eef4'); s.p(11, 16, '#f2eef4'); s.p(12, 16, '#f2eef4');
  s.p(9, 17, K.trim); s.p(14, 17, K.trim);
  // cheveux blonds, les deux grandes mèches en V qui se dressent
  s.r(8, 4, 8, 4, H); s.v(7, 5, 10, H); s.v(16, 5, 10, H);
  s.sline(10, 4, 7, 0, H); s.sline(11, 4, 8, 0, H); s.sline(13, 4, 16, 0, H); s.sline(12, 4, 15, 0, H);
  s.p(8, 1, '#fff8c0', true); s.p(15, 1, '#fff8c0', true);
  s.p(9, 8, H); s.p(14, 8, H); s.p(11, 8, H); s.p(12, 8, H);
  // ombre sur les yeux, grand sourire plein de dents
  s.hl(9, 14, 9, '#a87850');
  s.hl(10, 13, 12, '#ffffff'); s.p(9, 12, '#a8584a'); s.p(14, 12, '#a8584a'); s.hl(10, 13, 13, '#a8584a');
  s.p(12, 12, '#e8e0d8');
  if (rank >= 2) { s.p(5, 13, m.c); s.p(18, 13, m.c); s.p(5, 14, m.hi, true); s.p(18, 14, m.hi, true); }
  if (rank >= 4) { s.r(11, 5, 2, 1, C.gem, true); s.hl(9, 14, 4, C.gold); }
  if (rank >= 3) { s.r(4, 12, 3, 2, m.c); s.r(17, 12, 3, 2, m.c); s.p(5, 12, m.hi, true); s.p(18, 12, m.hi, true); }
  // gros poing ganté de rouge en avant, à droite
  s.r(17, 15, 4, 4, '#e2334a'); s.p(17, 15, '#ff8a8a', true); s.hl(17, 20, 18, Y);
  for (const [x, y] of [[22, 6], [2, 4], [21, 13]]) s.spark(x, y, (x + y) % 2 ? '#ffffff' : C.goldHi);
  return s;
}

export const NEW_DRAW = {
  brann, mira, nina, pip, gus, lenny, vex, gideon, aurelia, nova,
  rok, tobo, hugo, kiki, bjorn, sven, astra, nyx, ignis, drakon,
  tess, doc, ozzy, yuki, sylva, thorn, gorm, zara, kitsune, sybil,
  grumli, spike, bip, lulu, djmax, pablo, bob, zip, rexy, leo,
  tonnerre, ramses, elixa, mako, pixel, lumi, kero, atlas, pyra, mortis,
  shoto, bakugo, redriot, deku, allmight,
};
