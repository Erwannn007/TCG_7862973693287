// Génère les icônes de l'écran d'accueil à partir du sprite de Kael rang 4.
// Usage : node tools/make-icons.mjs
import { writeFileSync } from 'node:fs';
import { Image } from './png.mjs';
import { heroSprite } from '../js/sprites.js';

const b = heroSprite('kael', 4).build();
for (const [size, k] of [[180, 6], [192, 7], [512, 18]]) {
  const img = new Image(size, size, '#2c2340');
  const off = Math.floor((size - b.w * k) / 2);
  img.rect(0, size - off - k, size, off + k, '#3a2f52');
  img.sprite(b, off, off, k);
  writeFileSync(new URL(`../icons/icon-${size}.png`, import.meta.url), img.png());
}
