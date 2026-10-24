// Rendu canvas : échelle entière, aucun lissage.
import { glyph, OUTLINE } from './spr.js';

const cache = new Map();

// Image 1:1 d'un sprite (mise en cache par clé).
export function bitmap(key, makeSpr) {
  if (cache.has(key)) return cache.get(key);
  const b = makeSpr().build();
  const c = document.createElement('canvas');
  c.width = b.w;
  c.height = b.h;
  const g = c.getContext('2d');
  b.data.forEach((col, i) => {
    if (!col) return;
    g.fillStyle = col;
    g.fillRect(i % b.w, Math.floor(i / b.w), 1, 1);
  });
  const out = { canvas: c, w: b.w, h: b.h, fx: b.fx };
  cache.set(key, out);
  return out;
}

// Étincelles qui clignotent par paliers.
export function drawFx(g, bm, x, y, frame) {
  bm.fx.forEach((f, i) => {
    if ((frame + i) % 3 === 0) return;
    g.fillStyle = f.c;
    g.fillRect(x + f.x, y + f.y, 1, 1);
  });
}

// Canvas HTML affichant un sprite à l'échelle entière k (pour les cartes et fiches).
export function spriteCanvas(key, makeSpr, k) {
  const bm = bitmap(key, makeSpr);
  const c = document.createElement('canvas');
  c.width = bm.w;
  c.height = bm.h;
  c.className = 'px';
  c.style.width = bm.w * k + 'px';
  c.style.height = bm.h * k + 'px';
  const g = c.getContext('2d');
  g.drawImage(bm.canvas, 0, 0);
  if (bm.fx.length) {
    let frame = 0;
    const tick = () => {
      if (!c.isConnected) return;
      g.clearRect(0, 0, bm.w, bm.h);
      g.drawImage(bm.canvas, 0, 0);
      drawFx(g, bm, 0, 0, frame++);
      setTimeout(tick, 250);
    };
    setTimeout(tick, 0);
  }
  return c;
}

// Texte en police 3×5, avec contour.
export function drawText(g, str, x, y, color) {
  const chars = String(str).split('');
  const draw = (col, ox, oy) => {
    g.fillStyle = col;
    chars.forEach((ch, i) => {
      const gl = glyph(ch);
      if (!gl) return;
      for (let j = 0; j < 15; j++)
        if (gl[j] === '1') g.fillRect(x + i * 4 + (j % 3) + ox, y + Math.floor(j / 3) + oy, 1, 1);
    });
  };
  for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) draw(OUTLINE, ox, oy);
  draw(color, 0, 0);
}
export const textWidth = (str) => String(str).length * 4 - 1;
