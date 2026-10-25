// Planche de tous les sprites : node tools/sheet.mjs sortie.png [id1,id2,…]
// Sans liste : tous les héros (5 rangs) puis les ennemis. Avec une liste : seulement ces héros.
import { writeFileSync } from 'node:fs';
import { Image } from './png.mjs';
import { heroSprite, enemySprite } from '../js/sprites.js';
import { HERO_IDS } from '../js/data.js';

const K = 8, CELL = 30 * K;
const only = process.argv[3]?.split(',');
const heroes = only || HERO_IDS;
const enemies = only ? [] : [
  ['slime', 'vert'], ['slime', 'bleu'], ['slime', 'violet'], ['slime', 'rouge'],
  ['goblin', 'vert'], ['goblin', 'gris'], ['goblin', 'rouge'],
  ['skeleton', 'os'], ['skeleton', 'spectre'], ['skeleton', 'obsidienne'],
  ['golem', 'pierre'], ['golem', 'mythril'], ['golem', 'obsidienne'],
  ['dragon', 'rouge'], ['dragon', 'obsidienne'], ['dragon', 'celeste'],
];
const cols = 5, rows = heroes.length + Math.ceil(enemies.length / cols);
const img = new Image(cols * CELL, rows * CELL, '#3a3050');
heroes.forEach((id, y) => {
  for (let r = 1; r <= 5; r++) {
    const b = heroSprite(id, r).build();
    img.sprite(b, (r - 1) * CELL + (CELL - b.w * K) / 2, y * CELL + (CELL - b.h * K) / 2, K);
  }
});
enemies.forEach(([k, v], i) => {
  const b = enemySprite(k, v).build();
  const x = (i % cols) * CELL, y = (heroes.length + Math.floor(i / cols)) * CELL;
  img.sprite(b, x + (CELL - b.w * K) / 2, y + (CELL - b.h * K) / 2, K);
});
writeFileSync(process.argv[2] || 'sheet.png', img.png());
