// Moteur de sprites pixel art. Aucun accès au DOM ici : utilisable aussi par Node (tools/).
export const OUTLINE = '#1a1320';
const DARK = 0.76;
const LIGHT = 1.16;

const norm = (c) => c.toLowerCase();

export function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export class Spr {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.px = new Array(w * h).fill(null); // {c, flat}
    this.fx = []; // pixels d'effet posés après le contour (étincelles)
  }

  p(x, y, c, flat = false) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return this;
    this.px[y * this.w + x] = c == null ? null : { c: norm(c), flat };
    return this;
  }
  // Pose un pixel seulement si la case est vide (pour dessiner « derrière »).
  under(x, y, c, flat = false) {
    if (!this.get(x, y)) this.p(x, y, c, flat);
    return this;
  }
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.px[y * this.w + x];
  }
  r(x, y, w, h, c, flat) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.p(x + i, y + j, c, flat);
    return this;
  }
  hl(x0, x1, y, c, flat) {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.p(x, y, c, flat);
    return this;
  }
  v(x, y0, y1, c, flat) {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) this.p(x, y, c, flat);
    return this;
  }
  sline(x0, y0, x1, y1, c, flat) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.p(x0, y0, c, flat);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
    return this;
  }
  spark(x, y, c) {
    this.fx.push({ x, y, c: norm(c) });
    return this;
  }

  clone() {
    const s = new Spr(this.w, this.h);
    s.px = this.px.map((q) => (q ? { ...q } : null));
    s.fx = this.fx.map((q) => ({ ...q }));
    return s;
  }
  // Nouveau sprite avec une autre palette : table {ancienne: nouvelle}.
  recolor(table) {
    const t = {};
    for (const k in table) t[norm(k)] = norm(table[k]);
    const s = this.clone();
    for (const q of s.px) if (q && t[q.c]) q.c = t[q.c];
    for (const q of s.fx) if (t[q.c]) q.c = t[q.c];
    return s;
  }
  // Agrandit la grille et décale le dessin.
  grow(w, h, dx, dy) {
    const s = new Spr(w, h);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const q = this.get(x, y);
        if (q) s.p(x + dx, y + dy, q.c, q.flat);
      }
    s.fx = this.fx.map((q) => ({ ...q, x: q.x + dx, y: q.y + dy }));
    return s;
  }
  flip() {
    const s = new Spr(this.w, this.h);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const q = this.get(x, y);
        if (q) s.p(this.w - 1 - x, y, q.c, q.flat);
      }
    s.fx = this.fx.map((q) => ({ ...q, x: this.w - 1 - q.x }));
    return s;
  }
  // Silhouette d'une seule couleur (flash de coup, perso verrouillé).
  silhouette(c) {
    const s = new Spr(this.w, this.h);
    this.px.forEach((q, i) => { if (q) s.px[i] = { c: norm(c), flat: true }; });
    return s;
  }

  // Génère l'image finale : ombrage automatique + contour. Renvoie {w, h, data, fx}.
  build() {
    const { w, h } = this;
    const on = (x, y) => !!this.get(x, y);
    const data = new Array(w * h).fill(null);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const q = this.get(x, y);
        if (!q) {
          if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) data[y * w + x] = OUTLINE;
          continue;
        }
        let c = q.c;
        if (!q.flat) {
          if (!on(x, y + 1) || !on(x + 1, y)) c = shade(c, DARK);
          else if (!on(x, y - 1) || !on(x - 1, y)) c = shade(c, LIGHT);
        }
        data[y * w + x] = c;
      }
    return { w, h, data, fx: this.fx.slice() };
  }
}

// Police 3×5 pour les chiffres de dégâts (glyphes = pixels plats).
const GLYPHS = {
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111',
  4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001010010010',
  8: '111101111101111', 9: '111101111001111', '+': '000010111010000', '-': '000000111000000',
  '!': '010010010000010',
};
export function glyph(ch) {
  return GLYPHS[ch] || null;
}
