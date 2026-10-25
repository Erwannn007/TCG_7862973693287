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

export const NEW_DRAW = { brann, mira, nina, pip, gus, lenny, vex, gideon, aurelia, nova };
