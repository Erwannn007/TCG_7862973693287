// Données de jeu : personnages, gacha, étapes. Voir docs/CAHIER_DES_CHARGES.md
export const RARITY = {
  C: { name: 'Commune', color: '#8e99a4', rate: 0.6 },
  R: { name: 'Rare', color: '#4a8ee0', rate: 0.32 },
  L: { name: 'Légendaire', color: '#e0a93a', rate: 0.08 },
};

export const HEROES = {
  kael: {
    name: 'Kael', cls: 'Épéiste', rarity: 'C', hp: 120, atk: 22, def: 10, spd: 10,
    skill: { name: 'Taille croisée', desc: '200 % de dégâts sur une cible.', cd: 2, kind: 'single', mult: 2 },
  },
  lyra: {
    name: 'Lyra', cls: 'Archère', rarity: 'C', hp: 95, atk: 25, def: 6, spd: 14,
    skill: { name: 'Flèche sonnante', desc: '150 % sur une cible et l’étourdit 1 tour.', cd: 3, kind: 'single', mult: 1.5, stun: 1 },
  },
  elio: {
    name: 'Elio', cls: 'Mage', rarity: 'R', hp: 85, atk: 28, def: 5, spd: 11,
    skill: { name: 'Météore', desc: '110 % sur tous les ennemis.', cd: 3, kind: 'all', mult: 1.1 },
  },
  sera: {
    name: 'Séra', cls: 'Prêtresse', rarity: 'R', hp: 100, atk: 20, def: 8, spd: 12,
    skill: { name: 'Bénédiction', desc: 'Soigne toute l’équipe (120 % ATQ).', cd: 3, kind: 'heal', mult: 1.2 },
  },
  volt: {
    name: 'Volt', cls: 'Cyber-ninja', rarity: 'L', hp: 105, atk: 32, def: 8, spd: 18,
    skill: { name: 'Lame plasma', desc: '3 coups de 80 % sur des ennemis au hasard.', cd: 2, kind: 'multi', mult: 0.8, hits: 3 },
  },
};
export const HERO_IDS = Object.keys(HEROES);

export const RANK_MULT = [1, 1.2, 1.45, 1.75, 2.2];
export const RANK_NAMES = ['Cuir', 'Fer', 'Acier', 'Or', 'Céleste'];
// Coût pour passer du rang r au rang r+1 (index r-1).
export const UPGRADE = [
  { frags: 1, gold: 100 },
  { frags: 2, gold: 250 },
  { frags: 3, gold: 500 },
  { frags: 5, gold: 1000 },
];

export function heroStats(id, rank) {
  const h = HEROES[id], k = RANK_MULT[rank - 1];
  return {
    hp: Math.round(h.hp * k), atk: Math.round(h.atk * k),
    def: Math.round(h.def * k), spd: h.spd + (rank - 1),
  };
}

export const GACHA = { single: 100, multi: 900, pity: 40 };
export const DAILY_GOLD = 300;

// ---------------------------------------------------------------- étapes

const ENEMY_BASE = {
  slime: { name: 'Slime', hp: 60, atk: 12, def: 3, spd: 8 },
  goblin: { name: 'Gobelin', hp: 75, atk: 15, def: 5, spd: 12 },
  skeleton: { name: 'Squelette', hp: 85, atk: 17, def: 7, spd: 10 },
  golem: { name: 'Golem', hp: 300, atk: 22, def: 14, spd: 6, boss: { name: 'Séisme', every: 3, mult: 0.7 } },
  dragon: { name: 'Dragon', hp: 450, atk: 24, def: 12, spd: 11, boss: { name: 'Souffle de feu', every: 3, mult: 0.9 } },
};

const CHAPTERS = [
  { name: 'Prairie', bg: 'prairie', pool: [['slime', 'vert'], ['slime', 'bleu'], ['goblin', 'vert']], golem: 'pierre', dragon: 'rouge' },
  { name: 'Crypte', bg: 'crypte', pool: [['skeleton', 'os'], ['slime', 'violet'], ['goblin', 'gris'], ['skeleton', 'spectre']], golem: 'mythril', dragon: 'obsidienne' },
  { name: 'Volcan', bg: 'volcan', pool: [['skeleton', 'obsidienne'], ['slime', 'rouge'], ['goblin', 'rouge']], golem: 'obsidienne', dragon: 'celeste' },
];

export function chapterOf(n) {
  return CHAPTERS[Math.floor((n - 1) / 10) % CHAPTERS.length];
}

// Générateur pseudo-aléatoire stable : une étape donne toujours les mêmes ennemis.
function rng(seed) {
  let a = seed * 2654435761 >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function enemy(kind, variant, n) {
  const b = ENEMY_BASE[kind], k = 1 + 0.1 * (n - 1);
  return {
    kind, variant, name: b.name, boss: b.boss || null,
    hp: Math.round(b.hp * k), atk: Math.round(b.atk * k), def: Math.round(b.def * k), spd: b.spd,
  };
}

export function stage(n) {
  const ch = chapterOf(n);
  let enemies;
  if (n % 10 === 0) enemies = [enemy('dragon', ch.dragon, n)];
  else if (n % 5 === 0) enemies = [enemy('golem', ch.golem, n)];
  else {
    const r = rng(n), count = Math.min(3, 1 + Math.floor((n % 10) / 2));
    enemies = Array.from({ length: count }, () => {
      const [k, v] = ch.pool[Math.floor(r() * ch.pool.length)];
      return enemy(k, v, n);
    });
  }
  return {
    n, chapter: ch, enemies, boss: n % 5 === 0,
    gold: 30 + 12 * n, firstGold: 100 + (n % 5 === 0 ? 150 : 0),
  };
}
