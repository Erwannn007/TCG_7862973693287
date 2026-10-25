// Éléments d'interface en pixel art, dessinés en code :
// cadres « 9-slice » (bois, parchemin, pierre, boutons), fond de donjon, icônes, médaillons.
import { Spr, OUTLINE } from './spr.js';
import { C } from './sprites.js';

export const U = 2; // 1 pixel d'art = 2 px CSS dans l'interface
const DPR = Math.max(1, Math.round(window.devicePixelRatio || 1));

function toCanvas(b, k) {
  const c = document.createElement('canvas');
  c.width = b.w * k;
  c.height = b.h * k;
  const g = c.getContext('2d');
  b.data.forEach((col, i) => {
    if (!col) return;
    g.fillStyle = col;
    g.fillRect((i % b.w) * k, Math.floor(i / b.w) * k, k, k);
  });
  return c;
}
// Image déjà agrandie à la bonne taille (pixels physiques) : aucun redimensionnement flou.
const url = (spr) => toCanvas(spr.build(), U * DPR).toDataURL();

// ---------------------------------------------------------------- cadres 9-slice (16×16, coins de 6)

function frame({ rings, center, hi, lo, rivet }) {
  const s = new Spr(16, 16);
  s.r(0, 0, 16, 16, center, true);
  rings.forEach((c, i) => {
    s.hl(i, 15 - i, i, c, true);
    s.hl(i, 15 - i, 15 - i, c, true);
    s.v(i, i, 15 - i, c, true);
    s.v(15 - i, i, 15 - i, c, true);
  });
  if (hi) { s.hl(hi.i + 1, 14 - hi.i, hi.i, hi.c, true); s.v(hi.i, hi.i + 1, 14 - hi.i, hi.c, true); }
  if (lo) { s.hl(lo.i + 1, 15 - lo.i, 15 - lo.i, lo.c, true); s.v(15 - lo.i, lo.i + 1, 15 - lo.i, lo.c, true); }
  if (rivet) for (const [x, y] of [[2, 2], [12, 2], [2, 12], [12, 12]]) {
    s.r(x, y, 2, 2, C.gold, true);
    s.p(x, y, C.goldHi, true);
  }
  return s;
}

const FRAMES = {
  // panneau de bois sombre (menus)
  wood: { rings: [OUTLINE, '#4a2e1c', '#8a5a32', '#6a4228', '#24160e'], center: '#2e1f17', hi: { i: 2, c: '#b07a42' }, lo: { i: 2, c: '#5a3820' }, rivet: true },
  // parchemin bordé de bois (fiches, textes)
  parch: { rings: [OUTLINE, '#4a2e1c', '#8a5a32', '#c8a870', '#e8d4a4'], center: '#f2e2b8', hi: { i: 2, c: '#b07a42' }, lo: { i: 2, c: '#5a3820' }, rivet: true },
  // pierre (vitrines, scènes)
  stone: { rings: [OUTLINE, '#4a4048', '#8a8088', '#6a6068', '#1e171c'], center: '#2a2026', hi: { i: 2, c: '#aaa0a8' }, lo: { i: 2, c: '#4a4048' } },
  // boutons
  btn: { rings: [OUTLINE, '#4a2e1c', '#c08a4a', '#9a6a3a'], center: '#8a5a32', hi: { i: 2, c: '#e0a860' }, lo: { i: 2, c: '#6a4228' } },
  btnDown: { rings: [OUTLINE, '#4a2e1c', '#6a4228', '#7a5030'], center: '#7a5030' },
  gold: { rings: [OUTLINE, '#7a4a12', '#fbe08a', '#e0a93a'], center: '#d0942e', hi: { i: 2, c: '#fff4c0' }, lo: { i: 2, c: '#a87a20' } },
  goldDown: { rings: [OUTLINE, '#7a4a12', '#a87a20', '#c08628'], center: '#c08628' },
  red: { rings: [OUTLINE, '#5a1018', '#ff7a8a', '#e2334a'], center: '#c02a3e', hi: { i: 2, c: '#ffb0b8' }, lo: { i: 2, c: '#8a1a28' } },
  redDown: { rings: [OUTLINE, '#5a1018', '#8a1a28', '#a82434'], center: '#a82434' },
  // cadres de cartes selon la rareté
  cardC: { rings: [OUTLINE, '#3a3a44', '#a8b0b8', '#6a7480'], center: '#2a1d1a', hi: { i: 2, c: '#d0d6dc' }, lo: { i: 2, c: '#5a6270' } },
  cardR: { rings: [OUTLINE, '#1e3a6a', '#7ab0f0', '#4a8ee0'], center: '#2a1d1a', hi: { i: 2, c: '#b0d4ff' }, lo: { i: 2, c: '#2e5aa8' } },
  cardL: { rings: [OUTLINE, '#7a4a12', '#fbe08a', '#e0a93a'], center: '#2a1d1a', hi: { i: 2, c: '#fff4c0' }, lo: { i: 2, c: '#a87a20' }, rivet: true },
  sel: { rings: [OUTLINE, '#8a5a1a', '#fff8dc', '#fbe08a'], center: '#3a2818', hi: { i: 2, c: '#ffffff' }, lo: { i: 2, c: '#e0a93a' } },
  // ruban de titre
  ribbon: { rings: [OUTLINE, '#6a1420', '#c8323c'], center: '#a82434', hi: { i: 1, c: '#e2554a' }, lo: { i: 1, c: '#6a1420' } },
};

// Fond de mur de donjon pour les menus (32×16, briques chaudes).
function wallTile() {
  const s = new Spr(32, 16), M = '#1a1114', B = ['#2e2024', '#352529', '#3c2a2c'];
  s.r(0, 0, 32, 16, M, true);
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < 3; i++) {
      const x = i * 12 - (row ? 6 : 0), y = row * 8 + 1;
      const c = B[(i + row * 2) % 3];
      s.r(x + 1, y, 11, 6, c, true);
      s.hl(x + 1, x + 11, y, '#46302f', true);
      s.hl(x + 1, x + 11, y + 5, '#24181b', true);
    }
  return s;
}

// Injecte les images générées comme variables CSS.
export function installUiArt() {
  const css = [`--sl:${6 * U * DPR}`, `--wall:url(${url(wallTile())})`];
  for (const [k, f] of Object.entries(FRAMES)) css.push(`--f-${k}:url(${url(frame(f))})`);
  const st = document.createElement('style');
  st.textContent = `:root{${css.join(';')}}`;
  document.head.appendChild(st);
}

// ---------------------------------------------------------------- icônes 14×14

const ICONS = {
  attack(s) { // épée
    s.sline(3, 10, 11, 2, '#b9c6d2'); s.sline(4, 10, 11, 3, '#e4ecf3');
    s.sline(2, 9, 5, 12, C.gold); s.p(2, 12, C.grip); s.p(1, 13, C.gem, true);
  },
  guard(s) { // bouclier
    s.hl(3, 10, 2, C.gold); s.r(3, 3, 8, 5, '#3a64c8'); s.v(2, 2, 7, C.gold); s.v(11, 2, 7, C.gold);
    s.hl(3, 10, 8, C.gold); s.hl(4, 9, 9, C.gold); s.hl(5, 8, 10, C.gold); s.hl(6, 7, 11, C.gold);
    s.hl(4, 9, 8, '#3a64c8'); s.hl(5, 8, 9, '#3a64c8'); s.hl(6, 7, 10, '#3a64c8');
    s.v(6, 3, 9, '#e4ecf3', true); s.v(7, 3, 9, '#e4ecf3', true);
  },
  kael(s) { // double entaille
    s.sline(2, 11, 11, 2, '#ffffff', true); s.sline(3, 11, 12, 2, '#e2334a', true);
    s.sline(2, 2, 11, 11, '#ffffff', true); s.sline(3, 2, 12, 11, '#e2334a', true);
  },
  lyra(s) { // flèche
    s.sline(2, 11, 10, 3, '#c8a870'); s.p(11, 2, '#e4ecf3'); s.p(10, 2, '#e4ecf3'); s.p(11, 3, '#e4ecf3');
    s.p(9, 2, '#b9c6d2'); s.p(11, 4, '#b9c6d2'); s.p(2, 10, '#4f9e3c'); s.p(3, 12, '#4f9e3c'); s.p(1, 11, '#4f9e3c');
    s.spark(12, 6, C.goldHi); s.spark(8, 1, C.goldHi);
  },
  elio(s) { // météore
    s.sline(1, 1, 7, 7, '#ffb030', true); s.sline(2, 1, 8, 7, '#e2552a', true); s.sline(1, 3, 6, 8, '#e2552a', true);
    s.r(7, 7, 5, 5, '#ff6a1f', true); s.r(8, 8, 3, 3, '#fbe08a', true); s.p(8, 8, '#ffffff', true);
  },
  sera(s) { // cœur
    s.hl(3, 5, 3, '#e2334a'); s.hl(8, 10, 3, '#e2334a'); s.hl(2, 11, 4, '#e2334a'); s.hl(2, 11, 5, '#e2334a');
    s.hl(3, 10, 6, '#e2334a'); s.hl(4, 9, 7, '#e2334a'); s.hl(5, 8, 8, '#e2334a'); s.hl(6, 7, 9, '#e2334a');
    s.p(4, 4, '#ff9aa8', true); s.p(3, 4, '#ff9aa8', true);
    s.spark(1, 9, C.goldHi); s.spark(12, 9, C.goldHi);
  },
  volt(s) { // éclair
    s.sline(9, 1, 5, 6, C.neon, true); s.hl(5, 9, 6, C.neon, true); s.sline(9, 7, 4, 12, C.neon, true);
    s.sline(10, 1, 6, 6, '#ffffff', true); s.p(10, 7, '#2fb8c8', true);
  },
  // icônes de compétence des nouveaux héros (HEROES[id].skill.ico)
  taunt(s) { // poing rouge et cris
    s.r(4, 5, 6, 5, '#e2334a'); s.hl(4, 8, 4, '#e2334a'); s.r(5, 10, 4, 2, '#e2334a');
    for (const x of [5, 7]) s.v(x, 5, 6, '#a8203a', true);
    s.p(5, 4, '#ff8a9a', true); s.p(4, 5, '#ff8a9a', true);
    s.v(11, 2, 5, '#fbe08a', true); s.p(11, 7, '#fbe08a', true); s.v(1, 3, 5, '#fbe08a', true);
  },
  note(s) { // double croche
    s.r(2, 9, 3, 3, '#f0a050'); s.r(8, 8, 3, 3, '#f0a050'); s.v(4, 3, 10, '#f0a050'); s.v(10, 2, 9, '#f0a050');
    s.sline(4, 3, 10, 2, '#f0a050'); s.sline(4, 4, 10, 3, '#f0a050');
    s.p(2, 9, '#fff0b0', true); s.p(8, 8, '#fff0b0', true); s.spark(12, 11, C.goldHi);
  },
  cross(s) { // croix verte de soin
    s.r(5, 2, 4, 10, '#5ae0a0'); s.r(2, 5, 10, 4, '#5ae0a0'); s.v(6, 3, 10, '#b8ffd8', true); s.hl(3, 10, 6, '#b8ffd8', true);
    s.spark(12, 1, '#ffffff');
  },
  dagger(s) { // dague et goutte de sang
    s.sline(3, 10, 9, 4, '#e4ecf3'); s.sline(4, 10, 10, 4, '#b9c6d2'); s.p(10, 3, '#ffffff', true);
    s.sline(1, 9, 4, 12, C.gold); s.p(2, 11, C.grip); s.p(1, 12, C.grip);
    s.v(11, 9, 11, '#e2334a', true); s.r(10, 11, 3, 2, '#e2334a', true);
  },
  pick(s) { // pioche
    s.sline(3, 12, 9, 6, '#8a5a32'); s.sline(4, 12, 10, 6, '#a8703a');
    s.sline(5, 2, 9, 4, '#b9c6d2'); s.sline(9, 4, 12, 8, '#b9c6d2'); s.hl(7, 9, 3, '#e4ecf3', true);
  },
  drop(s) { // goutte d'eau
    s.v(6, 1, 2, '#4a9ae0'); s.hl(5, 7, 3, '#4a9ae0'); s.hl(4, 8, 4, '#4a9ae0'); s.r(3, 5, 7, 5, '#4a9ae0'); s.hl(4, 8, 10, '#4a9ae0'); s.hl(5, 7, 11, '#4a9ae0');
    s.v(4, 6, 8, '#c8f0ff', true); s.p(5, 5, '#ffffff', true);
  },
  fang(s) { // deux crocs et une goutte
    s.r(1, 2, 12, 3, '#c8323c'); s.hl(2, 11, 1, '#c8323c');
    for (const x of [3, 9]) { s.r(x, 5, 2, 3, '#ffffff', true); s.p(x, 8, '#ffffff', true); }
    s.p(4, 10, '#e2334a', true); s.r(3, 11, 3, 2, '#e2334a', true);
  },
  aegis(s) { // bouclier d'or et de cyan
    s.hl(3, 10, 1, C.gold); s.r(2, 2, 10, 6, C.gold); s.r(3, 2, 8, 6, '#4fd8e0');
    s.hl(3, 10, 8, C.gold); s.hl(4, 9, 9, C.gold); s.hl(5, 8, 10, C.gold); s.hl(6, 7, 11, C.gold);
    s.hl(4, 9, 8, '#4fd8e0'); s.hl(5, 8, 9, '#4fd8e0'); s.hl(6, 7, 10, '#4fd8e0');
    s.v(6, 3, 9, '#ffffff', true); s.hl(4, 9, 5, '#c8f6ff', true);
  },
  wing(s) { // aile blanche
    for (const [y, a, b] of [[3, 7, 11], [4, 5, 12], [5, 4, 12], [6, 3, 11], [7, 2, 9], [8, 2, 7], [9, 3, 5]]) s.hl(a, b, y, '#f2eef4');
    s.hl(5, 10, 6, '#c8c0d0', true); s.hl(4, 8, 8, '#c8c0d0', true); s.p(11, 3, '#ffffff', true);
    s.spark(1, 11, C.goldHi); s.spark(12, 10, '#ffffff');
  },
  fist(s) { // poing et étoile d'impact
    s.r(5, 4, 6, 5, '#f2eef4'); s.r(4, 5, 1, 4, '#f2eef4'); s.r(6, 9, 4, 3, '#3a4ad0');
    for (const x of [6, 8]) s.v(x, 4, 5, '#c8c0d0', true);
    s.p(5, 4, '#ffffff', true);
    s.p(12, 2, '#fbe08a', true); s.p(13, 4, '#fbe08a', true); s.p(1, 2, '#fbe08a', true);
  },
  axe(s) { // hache
    s.sline(3, 12, 9, 3, '#8a5a32'); s.r(8, 2, 4, 5, '#b9c6d2'); s.p(12, 3, '#b9c6d2'); s.p(12, 5, '#b9c6d2'); s.v(11, 2, 6, '#e4ecf3', true);
  },
  stew(s) { // marmite fumante
    s.r(2, 7, 10, 5, '#4a4a5a'); s.hl(1, 12, 6, '#8e99a4'); s.hl(3, 10, 7, '#c8603a', true); s.p(2, 8, '#8e99a4', true);
    for (const x of [4, 7, 10]) s.v(x, 2 + (x % 2), 4, '#efe6cf', true);
  },
  glove(s) { // gant de boxe
    s.r(3, 2, 8, 7, '#d8323c'); s.r(2, 4, 1, 4, '#d8323c'); s.r(4, 9, 6, 3, '#f2eef4'); s.p(4, 3, '#ff8a8a', true); s.p(5, 3, '#ff8a8a', true);
    s.v(7, 3, 6, '#a8203a', true);
  },
  gun(s) { // revolver
    s.hl(2, 11, 4, '#8e99a4'); s.hl(2, 11, 5, '#8e99a4'); s.r(6, 6, 3, 2, '#6a7480'); s.r(8, 6, 3, 6, '#8a5a32'); s.p(3, 4, '#e4ecf3', true);
    s.p(12, 3, '#fbe08a', true); s.spark(13, 5, '#ffffff');
  },
  whirl(s) { // haches qui tournent
    s.sline(2, 2, 11, 11, '#c8d8e8'); s.sline(11, 2, 2, 11, '#c8d8e8'); s.r(1, 1, 3, 3, '#e4ecf3'); s.r(10, 10, 3, 3, '#e4ecf3');
    s.r(10, 1, 3, 3, '#e4ecf3'); s.r(1, 10, 3, 3, '#e4ecf3'); s.p(6, 6, '#ffffff', true); s.p(7, 7, '#ffffff', true);
  },
  hook(s) { // hameçon
    s.v(8, 1, 9, '#b9c6d2'); s.hl(4, 7, 11, '#b9c6d2'); s.p(8, 10, '#b9c6d2'); s.v(3, 8, 10, '#b9c6d2'); s.p(4, 8, '#e4ecf3', true);
    s.p(8, 1, '#e4ecf3', true); s.hl(6, 10, 0, '#efe6cf');
  },
  comet(s) { // comète
    s.sline(1, 1, 7, 7, '#e2552a', true); s.sline(2, 1, 8, 7, '#fbe08a', true); s.r(7, 7, 5, 5, '#c8f0ff', true); s.p(8, 8, '#ffffff', true);
    s.spark(12, 2, '#ffffff');
  },
  skull(s) { // crâne et flamme verte
    s.r(3, 3, 8, 6, '#e8e0cc'); s.r(4, 9, 6, 2, '#e8e0cc'); s.r(4, 5, 2, 2, OUTLINE, true); s.r(8, 5, 2, 2, OUTLINE, true);
    s.p(6, 10, OUTLINE, true); s.p(8, 10, OUTLINE, true); s.v(7, 0, 2, '#7af06a', true); s.p(6, 1, '#3ab84a', true);
  },
  flame(s) { // flamme
    for (const [y, a, b] of [[1, 6, 6], [2, 5, 7], [3, 5, 8], [4, 4, 8], [5, 3, 9], [6, 3, 10], [7, 2, 10], [8, 2, 10], [9, 2, 10], [10, 3, 9], [11, 4, 8]]) s.hl(a, b, y, '#ff6a1f', true);
    for (const [y, a, b] of [[6, 6, 7], [7, 5, 8], [8, 5, 8], [9, 5, 8], [10, 6, 7]]) s.hl(a, b, y, '#fbe08a', true);
    s.p(6, 9, '#ffffff', true);
  },
  dragon(s) { // tête de dragon qui crache du feu
    s.r(1, 3, 6, 5, '#2f7a4a'); s.r(5, 5, 4, 3, '#2f7a4a'); s.p(3, 4, '#fbe08a', true); s.sline(1, 3, 0, 0, '#efe6cf'); s.p(8, 7, '#ffffff', true);
    s.hl(9, 12, 6, '#ff6a1f', true); s.hl(10, 13, 7, '#fbe08a', true); s.hl(9, 11, 8, '#ff6a1f', true);
  },
  hay(s) { // botte de foin
    s.r(2, 4, 10, 8, '#e8c860'); s.hl(2, 11, 6, '#c8a040'); s.hl(2, 11, 9, '#c8a040'); s.p(2, 4, '#fff0b0', true);
    s.p(1, 3, '#e8c860'); s.p(12, 3, '#e8c860'); s.p(6, 3, '#e8c860');
  },
  poison(s) { // fiole verte
    s.r(5, 1, 4, 3, '#e8e0cc'); s.r(3, 4, 8, 8, '#7af06a'); s.hl(4, 9, 12, '#7af06a'); s.hl(3, 10, 4, '#4ab83a');
    s.p(4, 6, '#c8ffb8', true); s.p(4, 7, '#c8ffb8', true); s.p(8, 8, '#ffffff', true); s.p(6, 10, '#ffffff', true);
  },
  guitar(s) { // guitare en V
    for (const [y, a, b] of [[7, 1, 2], [8, 2, 4], [9, 3, 6], [10, 2, 7], [11, 1, 4]]) s.hl(a, b, y, '#e2338a');
    s.sline(6, 8, 11, 2, '#3a2a22'); s.hl(11, 12, 1, '#b9c6d2'); s.p(4, 9, '#ffffff', true); s.spark(12, 7, '#fbe08a');
  },
  snow(s) { // flocon
    s.v(6, 1, 11, '#8ae8ff', true); s.hl(1, 11, 6, '#8ae8ff', true); s.sline(2, 2, 10, 10, '#8ae8ff', true); s.sline(10, 2, 2, 10, '#8ae8ff', true);
    s.p(6, 6, '#ffffff', true); s.p(6, 1, '#ffffff', true);
  },
  moon(s) { // croissant de lune et flèche
    for (const [y, a, b] of [[2, 6, 8], [3, 4, 6], [4, 3, 5], [5, 3, 4], [6, 3, 4], [7, 3, 4], [8, 3, 5], [9, 4, 6], [10, 6, 8]]) s.hl(a, b, y, '#e8f0d0', true);
    s.sline(6, 6, 12, 6, '#c8a870'); s.p(12, 5, '#e4ecf3'); s.p(12, 7, '#e4ecf3'); s.spark(10, 1, '#ffffff');
  },
  leaf(s) { // feuille
    for (const [y, a, b] of [[2, 9, 11], [3, 7, 11], [4, 5, 10], [5, 4, 10], [6, 3, 9], [7, 3, 8], [8, 3, 7], [9, 4, 5]]) s.hl(a, b, y, '#7ac85a');
    s.sline(2, 11, 10, 3, '#4e8a34'); s.p(6, 4, '#c8f0a0', true); s.p(5, 5, '#c8f0a0', true);
  },
  rage(s) { // couperet et goutte de sang
    s.r(4, 1, 6, 8, '#b9c6d2'); s.v(4, 2, 8, '#e4ecf3', true); for (const y of [2, 5, 8]) s.p(10, y, '#b9c6d2');
    s.r(6, 9, 2, 4, '#5a3f2e'); s.p(1, 9, '#e2334a', true); s.r(0, 10, 3, 2, '#e2334a', true);
  },
  scarf(s) { // foulard qui ondule
    s.sline(1, 10, 4, 6, '#4fd8c8'); s.sline(4, 6, 8, 8, '#4fd8c8'); s.sline(8, 8, 12, 3, '#4fd8c8');
    s.sline(1, 11, 4, 7, '#a8fff0', true); s.sline(4, 7, 8, 9, '#4fd8c8'); s.sline(8, 9, 12, 4, '#a8fff0', true);
    s.p(12, 2, '#fbe08a', true); s.spark(6, 1, '#fbe08a');
  },
  foxfire(s) { // feu follet bleu
    for (const [y, a, b] of [[1, 7, 7], [2, 6, 8], [3, 5, 8], [4, 4, 9], [5, 3, 10], [6, 3, 10], [7, 3, 10], [8, 3, 10], [9, 4, 9], [10, 5, 8]]) s.hl(a, b, y, '#5ac8ff', true);
    for (const [y, a, b] of [[5, 6, 7], [6, 5, 8], [7, 5, 8], [8, 6, 7]]) s.hl(a, b, y, '#c8f0ff', true);
    s.p(6, 7, '#ffffff', true); s.sline(10, 11, 12, 12, '#2f78d0', true);
  },
  eye(s) { // œil d'or
    s.hl(4, 9, 3, C.gold); s.hl(2, 11, 4, C.gold); s.hl(1, 12, 5, C.gold); s.hl(1, 12, 6, C.gold); s.hl(2, 11, 7, C.gold); s.hl(4, 9, 8, C.gold);
    s.hl(3, 10, 5, '#f2eef4', true); s.hl(3, 10, 6, '#f2eef4', true); s.r(5, 4, 4, 4, '#5a3aa8', true); s.p(5, 5, '#ffffff', true);
    s.spark(1, 1, '#ffffff'); s.spark(12, 11, C.goldHi);
  },
  auto(s) { // engrenage
    s.r(4, 3, 6, 8, '#8e99a4'); s.r(3, 4, 8, 6, '#8e99a4'); s.r(6, 1, 2, 2, '#8e99a4'); s.r(6, 11, 2, 2, '#8e99a4');
    s.r(1, 6, 2, 2, '#8e99a4'); s.r(11, 6, 2, 2, '#8e99a4'); s.r(6, 6, 2, 2, OUTLINE, true); s.p(4, 4, '#e4ecf3', true);
  },
  speed(s) { // double chevron
    for (const o of [0, 5]) { s.sline(2 + o, 3, 5 + o, 7, C.goldHi); s.sline(5 + o, 7, 2 + o, 11, C.goldHi); s.sline(3 + o, 3, 6 + o, 7, C.gold); s.sline(6 + o, 7, 3 + o, 11, C.gold); }
  },
  flee(s) { // drapeau blanc
    s.v(3, 1, 12, '#8a6a4a'); s.r(4, 2, 7, 5, '#f2ead6'); s.hl(5, 10, 7, '#cdbf9f'); s.p(11, 3, '#f2ead6'); s.p(11, 5, '#f2ead6');
  },
  back(s) { // flèche retour
    s.hl(4, 11, 6, '#f2ead6'); s.hl(4, 11, 7, '#f2ead6'); s.sline(2, 7, 6, 3, '#f2ead6'); s.sline(2, 6, 6, 10, '#f2ead6');
    s.sline(3, 7, 6, 4, '#f2ead6'); s.sline(3, 6, 6, 9, '#f2ead6');
  },
  cancel(s) { // croix
    s.sline(3, 3, 10, 10, '#e2334a'); s.sline(4, 3, 11, 10, '#e2334a'); s.sline(10, 3, 3, 10, '#e2334a'); s.sline(11, 3, 4, 10, '#e2334a');
  },
  skin(s) { // tunique et pinceau
    s.r(3, 3, 8, 9, '#d9548c'); s.r(1, 3, 2, 4, '#d9548c'); s.r(11, 3, 2, 4, '#d9548c'); s.hl(5, 8, 2, '#d9548c');
    s.hl(6, 7, 2, '#f2ead6', true); s.v(7, 3, 11, '#a83a6a', true); s.p(4, 4, '#ff9ac8', true); s.p(4, 5, '#ff9ac8', true);
    s.sline(9, 13, 13, 9, '#c8a870'); s.p(13, 8, C.goldHi, true); s.spark(1, 12, C.goldHi);
  },
  gear(s) { ICONS.auto(s); },
  chest(s) { // coffre
    s.r(1, 5, 12, 7, '#8a5a32'); s.hl(2, 11, 3, '#8a5a32'); s.hl(1, 12, 4, '#a8703a'); s.hl(1, 12, 7, C.gold);
    s.v(1, 4, 11, C.gold); s.v(12, 4, 11, C.gold); s.r(6, 6, 2, 3, C.gold); s.p(6, 7, OUTLINE, true);
    s.spark(0, 1, C.goldHi); s.spark(13, 2, '#ffffff');
  },
  scroll(s) { // parchemin
    s.r(3, 2, 8, 10, '#f2e2b8'); s.hl(2, 11, 2, '#c8a870'); s.hl(2, 11, 11, '#c8a870');
    for (const y of [4, 6, 8]) s.hl(4, 9, y, '#8a6a4a', true);
  },
  team(s) { // bouclier rouge
    s.hl(3, 10, 1, C.gold); s.r(2, 2, 10, 6, C.gold); s.r(3, 2, 8, 6, '#c8323c');
    s.hl(3, 10, 8, C.gold); s.hl(4, 9, 9, C.gold); s.hl(5, 8, 10, C.gold); s.hl(6, 7, 11, C.gold);
    s.hl(4, 9, 8, '#c8323c'); s.hl(5, 8, 9, '#c8323c'); s.hl(6, 7, 10, '#c8323c');
    s.v(6, 3, 9, C.goldHi, true); s.hl(4, 9, 5, C.goldHi, true);
  },
  summon(s) { // cristal
    const rows = [[1, 6, 7], [2, 5, 8], [3, 4, 9], [4, 4, 9], [5, 3, 10], [6, 3, 10], [7, 4, 9], [8, 4, 9], [9, 5, 8], [10, 5, 8], [11, 6, 7]];
    for (const [y, a, b] of rows) { s.hl(a, b, y, '#9a5ad8', true); s.p(a, y, '#c89af0', true); s.p(b, y, '#62349a', true); }
    s.v(6, 2, 8, '#ffffff', true); s.spark(1, 2, C.goldHi); s.spark(12, 10, '#ffffff');
  },
  fight(s) { // épées croisées
    s.sline(2, 1, 10, 9, '#b9c6d2'); s.sline(11, 1, 3, 9, '#b9c6d2');
    s.sline(8, 10, 11, 7, C.gold); s.sline(2, 7, 5, 10, C.gold); s.p(12, 11, C.grip); s.p(1, 11, C.grip);
  },
};

export function iconSprite(name) {
  const s = new Spr(14, 14);
  ICONS[name](s);
  return s;
}

// ---------------------------------------------------------------- pancartes en bois

// Pancartes des actions de combat, dessinées à la taille exacte du bouton (pas d'étirement) :
// cadre de bois sombre, planches veinées avec nœuds et clous, équerres de fer aux coins, usure.
const WOOD = {
  normal: {
    planks: ['#8a5a32', '#94623a', '#7e522e'], grain: '#6a4226', grain2: '#a06c3e', gap: '#2e1c10',
    hi: '#b8814a', lo: '#5a3820', frame: ['#4e3019', '#6a4228'], frameHi: '#8a5a32', metal: ['#2a262e', '#7a7480', '#c4c0c8'],
  },
  hot: {
    planks: ['#d8a052', '#dea85a', '#d29a4c'], grain: '#c08a44', grain2: '#e8b868', gap: '#5a3818',
    hi: '#f8d690', lo: '#9a6630', frame: ['#7a4a12', '#a87a20'], frameHi: '#e0a93a', metal: ['#5a3408', '#e0a93a', '#fff4c0'],
  },
  // bois laqué rouge : actions dangereuses (fuir, effacer la partie)
  red: {
    planks: ['#a8323c', '#b43a44', '#9a2a36'], grain: '#7a1e2a', grain2: '#c85a5a', gap: '#3a0e14',
    hi: '#d86a6a', lo: '#6a1420', frame: ['#4a0e16', '#6a1420'], frameHi: '#a8323c', metal: ['#2a262e', '#7a7480', '#c4c0c8'],
  },
  // bois sombre : ce qu'on ne peut pas toucher pour l'instant (héros déjà sur un socle)
  dark: {
    planks: ['#4a3426', '#523a2a', '#443022'], grain: '#3a281c', grain2: '#5e4434', gap: '#1e140e',
    hi: '#6a4c38', lo: '#2e2016', frame: ['#2a1c12', '#3a281a'], frameHi: '#4a3426', metal: ['#1e1a22', '#4e4a54', '#7a7480'],
  },
};
const rnd = (a, b) => {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function drawSign(g, W, H, P, seed) {
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  // contour noir, coins cassés d'un pixel
  R(1, 0, W - 2, H, OUTLINE);
  R(0, 1, W, H - 2, OUTLINE);
  // cadre de bois sombre sur 2 px, éclairé en haut à gauche
  R(1, 1, W - 2, H - 2, P.frame[0]);
  R(2, 2, W - 4, H - 4, P.frame[1]);
  R(2, 1, W - 4, 1, P.frameHi);
  R(1, 2, 1, H - 4, P.frameHi);
  // planches horizontales
  const x0 = 3, x1 = W - 3, y0 = 3, y1 = H - 3, n = Math.max(2, Math.round((y1 - y0) / 8));
  for (let i = 0; i < n; i++) {
    const a = y0 + Math.round(((y1 - y0) * i) / n), b = y0 + Math.round(((y1 - y0) * (i + 1)) / n);
    const k = seed * 7 + i;
    R(x0, a, x1 - x0, b - a, P.planks[Math.floor(rnd(k, 1) * 3)]);
    R(x0, a, x1 - x0, 1, P.hi);
    R(x0, b - 1, x1 - x0, 1, P.lo);
    if (i) R(x0, a - 1, x1 - x0, 1, P.gap);
    // veinures : traits fins de longueurs variées, parfois ondulés
    for (let j = 0; j < (x1 - x0) / 5; j++) {
      const gx = x0 + Math.floor(rnd(k, j + 10) * (x1 - x0 - 4)), gy = a + 1 + Math.floor(rnd(k, j + 50) * Math.max(1, b - a - 3));
      const len = 3 + Math.floor(rnd(k, j + 90) * 12), wave = rnd(k, j + 130) < 0.3;
      R(gx, gy, Math.min(len, x1 - gx), 1, rnd(k, j + 170) < 0.75 ? P.grain : P.grain2);
      if (wave && gy + 1 < b - 1) R(gx + (len >> 1), gy + 1, Math.min(3, x1 - gx - (len >> 1)), 1, P.grain);
    }
    // un nœud dans le bois, entouré de veines qui le contournent
    if (rnd(k, 3) < 0.7 && b - a >= 6) {
      const kx = x0 + 10 + Math.floor(rnd(k, 4) * (x1 - x0 - 20)), ky = a + ((b - a) >> 1);
      R(kx - 3, ky - 2, 7, 1, P.grain);
      R(kx - 3, ky + 2, 7, 1, P.grain);
      R(kx - 1, ky - 1, 3, 3, P.grain);
      R(kx, ky, 1, 1, P.lo);
      R(kx - 5, ky - 1, 2, 1, P.grain);
      R(kx + 4, ky + 1, 2, 1, P.grain);
    }
    // clous aux deux bouts de la planche
    for (const nx of [x0 + 2, x1 - 3]) {
      const ny = a + ((b - a) >> 1) - 1;
      R(nx, ny, 2, 2, P.metal[1]);
      R(nx, ny, 1, 1, P.metal[2]);
      R(nx + 1, ny + 2, 1, 1, P.lo);
    }
  }
  // équerres de fer aux quatre coins, avec un rivet
  const L = Math.max(3, Math.min(7, Math.floor(Math.min(W, H) / 4))); // équerres plus petites sur les petits boutons
  for (const [cx, cy, sx, sy] of [[1, 1, 1, 1], [W - 2, 1, -1, 1], [1, H - 2, 1, -1], [W - 2, H - 2, -1, -1]]) {
    for (let t = 0; t < L; t++) {
      for (const [px, py] of [[cx + sx * t, cy], [cx + sx * t, cy + sy], [cx, cy + sy * t], [cx + sx, cy + sy * t]]) R(px, py, 1, 1, P.metal[1]);
    }
    for (let t = 0; t < L; t++) {
      R(cx + sx * t, cy + sy * 2, 1, 1, P.metal[0]);
      R(cx + sx * 2, cy + sy * t, 1, 1, P.metal[0]);
    }
    R(cx + sx * Math.min(4, L - 1), cy, 1, 1, P.metal[2]);
    R(cx, cy + sy * Math.min(4, L - 1), 1, 1, P.metal[2]);
    R(cx + sx, cy + sy, 1, 1, P.metal[2]);
  }
  // usure : éclats sur le bord, quelques rayures claires
  for (let i = 0; i < 3; i++) {
    const ex = 10 + Math.floor(rnd(seed, i + 300) * (W - 20));
    g.clearRect(ex, rnd(seed, i + 310) < 0.5 ? 0 : H - 1, 2, 1);
  }
  for (let i = 0; i < 2; i++) {
    const sx = 12 + Math.floor(rnd(seed, i + 320) * (W - 30)), sy = 5 + Math.floor(rnd(seed, i + 330) * (H - 10));
    for (let t = 0; t < 4; t++) R(sx + t, sy + (t >> 1), 1, 1, P.grain2);
  }
}

const signCache = new Map();
// Image de pancarte (URL) pour un bouton de wCss × hCss pixels CSS ; kind : 'normal' ou 'hot'.
export function signUrl(wCss, hCss, kind = 'normal', seed = 1) {
  const W = Math.max(16, Math.round(wCss / U)), H = Math.max(12, Math.round(hCss / U)), key = `${W}x${H}-${kind}-${seed}`;
  if (!signCache.has(key)) {
    const art = document.createElement('canvas');
    art.width = W;
    art.height = H;
    drawSign(art.getContext('2d'), W, H, WOOD[kind], seed);
    const k = U * DPR, big = document.createElement('canvas');
    big.width = W * k;
    big.height = H * k;
    const bg = big.getContext('2d');
    bg.imageSmoothingEnabled = false;
    bg.drawImage(art, 0, 0, W * k, H * k);
    signCache.set(key, `url(${big.toDataURL()})`);
  }
  return signCache.get(key);
}

// ---------------------------------------------------------------- avis de recherche

// Affiche de parchemin pour un héros pas encore obtenu : bords déchirés, taches, coins brunis,
// un clou en haut. Dessinée à la taille exacte de l'élément, comme les pancartes.
function drawPoster(g, W, H, seed) {
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      // bord déchiré : quelques pixels manquants sur le pourtour
      const edge = Math.min(x - 1, y - 1, W - 2 - x, H - 2 - y);
      if (edge === 0 && rnd(x * 7 + seed, y) < 0.35) continue;
      let c = '#e8d4a4';
      if (edge <= 1) c = '#c8a870';
      else if (edge <= 2 && rnd(x, y + seed) < 0.5) c = '#d8c08a';
      // coins brunis et taches
      const corner = Math.min(x, W - x) + Math.min(y, H - y);
      if (corner < 7 && rnd(x + seed, y * 3) < 0.6) c = '#b89060';
      if (rnd(Math.floor(x / 4) + seed * 5, Math.floor(y / 3)) < 0.08) c = '#d8c08a';
      if (rnd(x * 3, y * 5 + seed) < 0.03) c = '#c8a870';
      R(x, y, 1, 1, c);
    }
  // contour brun irrégulier
  for (let x = 1; x < W - 1; x++) {
    if (rnd(x, seed) > 0.3) R(x, 0, 1, 1, '#8a6a4a');
    if (rnd(x, seed + 1) > 0.3) R(x, H - 1, 1, 1, '#8a6a4a');
  }
  for (let y = 1; y < H - 1; y++) {
    if (rnd(seed, y) > 0.3) R(0, y, 1, 1, '#8a6a4a');
    if (rnd(seed + 1, y) > 0.3) R(W - 1, y, 1, 1, '#8a6a4a');
  }
  // clou en haut au milieu
  const nx = W >> 1;
  R(nx - 1, 1, 3, 3, OUTLINE);
  R(nx, 2, 1, 1, '#b9c6d2');
  R(nx - 1, 4, 3, 1, '#a89060');
}

const posterCache = new Map();
export function posterUrl(wCss, hCss, seed = 1) {
  const W = Math.max(16, Math.round(wCss / U)), H = Math.max(12, Math.round(hCss / U)), key = `${W}x${H}-${seed}`;
  if (!posterCache.has(key)) {
    const art = document.createElement('canvas');
    art.width = W;
    art.height = H;
    drawPoster(art.getContext('2d'), W, H, seed);
    const k = U * DPR, big = document.createElement('canvas');
    big.width = W * k;
    big.height = H * k;
    const bg = big.getContext('2d');
    bg.imageSmoothingEnabled = false;
    bg.drawImage(art, 0, 0, W * k, H * k);
    posterCache.set(key, `url(${big.toDataURL()})`);
  }
  return posterCache.get(key);
}
