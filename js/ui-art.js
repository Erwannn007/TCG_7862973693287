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
