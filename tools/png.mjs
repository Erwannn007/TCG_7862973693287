// Encodeur PNG minimal (RGBA) + rendu de sprites, pour Node uniquement.
import { deflateSync } from 'node:zlib';

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

export class Image {
  constructor(w, h, bg = null) {
    this.w = w;
    this.h = h;
    this.d = Buffer.alloc(w * h * 4);
    if (bg) this.rect(0, 0, w, h, bg);
  }
  rect(x, y, w, h, hex) {
    const n = parseInt(hex.slice(1), 16);
    for (let j = y; j < y + h; j++)
      for (let i = x; i < x + w; i++) {
        if (i < 0 || j < 0 || i >= this.w || j >= this.h) continue;
        const o = (j * this.w + i) * 4;
        this.d[o] = n >> 16;
        this.d[o + 1] = (n >> 8) & 255;
        this.d[o + 2] = n & 255;
        this.d[o + 3] = 255;
      }
  }
  // Dessine un sprite construit (Spr.build()) à l'échelle entière k.
  sprite(b, x, y, k, withFx = true) {
    b.data.forEach((c, i) => c && this.rect(x + (i % b.w) * k, y + Math.floor(i / b.w) * k, k, k, c));
    if (withFx) for (const f of b.fx) this.rect(x + f.x * k, y + f.y * k, k, k, f.c);
  }
  png() {
    const raw = Buffer.alloc((this.w * 4 + 1) * this.h);
    for (let y = 0; y < this.h; y++) this.d.copy(raw, y * (this.w * 4 + 1) + 1, y * this.w * 4, (y + 1) * this.w * 4);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0);
    ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    return Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw)),
      chunk('IEND', Buffer.alloc(0)),
    ]);
  }
}
