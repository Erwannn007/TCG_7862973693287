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

export const NEW_DRAW = {
  brann, mira, nina, pip, gus, lenny, vex, gideon, aurelia, nova,
  rok, tobo, hugo, kiki, bjorn, sven, astra, nyx, ignis, drakon,
};
