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

  // ---- nouveaux héros (dessins dans js/heroes.js). Types de compétence :
  //   single, all, multi : dégâts (mult × ATQ), avec en plus, au choix : stun (tours), dot
  //     { type: poison | burn | bleed, mult, turns }, drain (part des dégâts rendue en PV),
  //     weaken { atk, turns } (ATQ de la cible en moins), pierce (ignore la DÉF), exec (×2 sous ce % de PV)
  //   heal (toute l'équipe), heal1 (l'allié le plus blessé), shield (bouclier : mult × ATQ, turns),
  //   buff { atk, turns } (ATQ de l'équipe en plus), taunt (attire les coups, turns),
  //   revive (relève un allié tombé avec pct de ses PV ; sinon soigne le plus blessé de mult × ATQ)
  //   en plus : heal (soin de heal × ATQ sur les alliés touchés, ou sur toute l'équipe après une attaque « all »),
  //   taunt (tours de provocation pour le lanceur, sur une compétence de soutien)
  //   ico : icône de la compétence (js/ui-art.js)
  brann: {
    name: 'Brann', cls: 'Chevalier', rarity: 'C', hp: 150, atk: 16, def: 14, spd: 8,
    skill: { name: 'Provocation', desc: 'Attire tous les coups 2 tours, dégâts reçus −30 %.', cd: 3, kind: 'taunt', turns: 2, ico: 'taunt' },
  },
  mira: {
    name: 'Mira', cls: 'Barde', rarity: 'C', hp: 95, atk: 18, def: 7, spd: 13,
    skill: { name: 'Ballade héroïque', desc: 'ATQ de l’équipe +30 % pendant 2 tours.', cd: 3, kind: 'buff', atk: 0.3, turns: 2, ico: 'note' },
  },
  nina: {
    name: 'Nina', cls: 'Infirmière', rarity: 'C', hp: 100, atk: 18, def: 7, spd: 12,
    skill: { name: 'Piqûre de rappel', desc: 'Soigne l’allié le plus blessé (250 % ATQ).', cd: 2, kind: 'heal1', mult: 2.5, ico: 'cross' },
  },
  pip: {
    name: 'Pip', cls: 'Voleur', rarity: 'C', hp: 90, atk: 24, def: 6, spd: 16,
    skill: { name: 'Coupe-jarret', desc: '130 % sur une cible, saignement 3 tours.', cd: 2, kind: 'single', mult: 1.3, dot: { type: 'bleed', mult: 0.35, turns: 3 }, ico: 'dagger' },
  },
  gus: {
    name: 'Gus', cls: 'Mineur', rarity: 'C', hp: 115, atk: 22, def: 9, spd: 9,
    skill: { name: 'Coup de pioche', desc: '170 % sur une cible, ignore sa DÉF.', cd: 2, kind: 'single', mult: 1.7, pierce: true, ico: 'pick' },
  },
  lenny: {
    name: 'Lenny', cls: 'Pompier', rarity: 'C', hp: 110, atk: 19, def: 9, spd: 10,
    skill: { name: 'Lance à incendie', desc: '80 % sur tous les ennemis, leur ATQ −25 % 2 tours.', cd: 3, kind: 'all', mult: 0.8, weaken: { atk: 0.25, turns: 2 }, ico: 'drop' },
  },
  vex: {
    name: 'Vex', cls: 'Vampire', rarity: 'R', hp: 105, atk: 27, def: 7, spd: 13,
    skill: { name: 'Morsure', desc: '180 % sur une cible, rend 60 % des dégâts en PV.', cd: 3, kind: 'single', mult: 1.8, drain: 0.6, ico: 'fang' },
  },
  gideon: {
    name: 'Gideon', cls: 'Paladin', rarity: 'R', hp: 135, atk: 20, def: 13, spd: 9,
    skill: { name: 'Égide', desc: 'Bouclier sur l’équipe (150 % ATQ) pendant 3 tours.', cd: 3, kind: 'shield', mult: 1.5, turns: 3, ico: 'aegis' },
  },
  aurelia: {
    name: 'Aurélia', cls: 'Valkyrie', rarity: 'L', hp: 125, atk: 28, def: 11, spd: 14,
    skill: { name: 'Chant du Valhalla', desc: 'Relève un allié tombé (50 % PV), sinon soigne le plus blessé (200 % ATQ).', cd: 4, kind: 'revive', pct: 0.5, mult: 2, ico: 'wing' },
  },
  nova: {
    name: 'Nova', cls: 'Super-héroïne', rarity: 'L', hp: 115, atk: 31, def: 9, spd: 16,
    skill: { name: 'Poing météore', desc: '280 % sur une cible et l’étourdit 1 tour.', cd: 3, kind: 'single', mult: 2.8, stun: 1, ico: 'fist' },
  },
  rok: {
    name: 'Rok', cls: 'Bûcheron', rarity: 'C', hp: 120, atk: 23, def: 9, spd: 9,
    skill: { name: 'Abattage', desc: '160 % sur une cible, double sous 40 % de PV.', cd: 3, kind: 'single', mult: 1.6, exec: 0.4, ico: 'axe' },
  },
  tobo: {
    name: 'Tobo', cls: 'Chef cuisinier', rarity: 'C', hp: 115, atk: 17, def: 8, spd: 10,
    skill: { name: 'Ragoût maison', desc: 'Soigne toute l’équipe (90 % ATQ).', cd: 3, kind: 'heal', mult: 0.9, ico: 'stew' },
  },
  hugo: {
    name: 'Hugo', cls: 'Boxeur', rarity: 'C', hp: 115, atk: 22, def: 8, spd: 14,
    skill: { name: 'Une-deux', desc: '2 coups de 110 % sur des ennemis au hasard.', cd: 2, kind: 'multi', mult: 1.1, hits: 2, ico: 'glove' },
  },
  kiki: {
    name: 'Kiki', cls: 'Cow-girl', rarity: 'C', hp: 90, atk: 24, def: 6, spd: 15,
    skill: { name: 'Tir en rafale', desc: '3 tirs de 70 % sur des ennemis au hasard.', cd: 2, kind: 'multi', mult: 0.7, hits: 3, ico: 'gun' },
  },
  bjorn: {
    name: 'Bjorn', cls: 'Viking', rarity: 'C', hp: 125, atk: 21, def: 9, spd: 10,
    skill: { name: 'Tourbillon', desc: '100 % sur tous les ennemis.', cd: 3, kind: 'all', mult: 1, ico: 'whirl' },
  },
  sven: {
    name: 'Sven', cls: 'Pêcheur', rarity: 'C', hp: 100, atk: 20, def: 8, spd: 11,
    skill: { name: 'Hameçon', desc: '150 % sur une cible et l’étourdit 1 tour.', cd: 3, kind: 'single', mult: 1.5, stun: 1, ico: 'hook' },
  },
  astra: {
    name: 'Astra', cls: 'Astronaute', rarity: 'R', hp: 95, atk: 28, def: 7, spd: 12,
    skill: { name: 'Pluie de comètes', desc: '120 % sur tous les ennemis.', cd: 3, kind: 'all', mult: 1.2, ico: 'comet' },
  },
  nyx: {
    name: 'Nyx', cls: 'Nécromancienne', rarity: 'R', hp: 95, atk: 27, def: 6, spd: 12,
    skill: { name: 'Rappel des morts', desc: 'Relève un allié tombé (35 % PV), sinon soigne le plus blessé (150 % ATQ).', cd: 4, kind: 'revive', pct: 0.35, mult: 1.5, ico: 'skull' },
  },
  ignis: {
    name: 'Ignis', cls: 'Pyromancien', rarity: 'R', hp: 90, atk: 29, def: 6, spd: 13,
    skill: { name: 'Brasier', desc: '200 % sur une cible, brûlure 3 tours.', cd: 3, kind: 'single', mult: 2, dot: { type: 'burn', mult: 0.5, turns: 3 }, ico: 'flame' },
  },
  drakon: {
    name: 'Drakon', cls: 'Chevalier dragon', rarity: 'L', hp: 130, atk: 30, def: 12, spd: 12,
    skill: { name: 'Souffle du dragon', desc: '130 % sur tous les ennemis, brûlure 2 tours.', cd: 4, kind: 'all', mult: 1.3, dot: { type: 'burn', mult: 0.3, turns: 2 }, ico: 'dragon' },
  },
  tess: {
    name: 'Tess', cls: 'Fermière', rarity: 'C', hp: 120, atk: 18, def: 10, spd: 10,
    skill: { name: 'Botte de foin', desc: 'Bouclier sur l’équipe (100 % ATQ) pendant 2 tours.', cd: 3, kind: 'shield', mult: 1, turns: 2, ico: 'hay' },
  },
  doc: {
    name: 'Doc', cls: 'Médecin de peste', rarity: 'C', hp: 100, atk: 20, def: 7, spd: 11,
    skill: { name: 'Miasmes', desc: '50 % sur tous les ennemis, poison 3 tours.', cd: 3, kind: 'all', mult: 0.5, dot: { type: 'poison', mult: 0.35, turns: 3 }, ico: 'poison' },
  },
  ozzy: {
    name: 'Ozzy', cls: 'Rockeur', rarity: 'C', hp: 100, atk: 21, def: 7, spd: 12,
    skill: { name: 'Larsen', desc: '50 % sur tous les ennemis, les étourdit 1 tour.', cd: 4, kind: 'all', mult: 0.5, stun: 1, ico: 'guitar' },
  },
  yuki: {
    name: 'Yuki', cls: 'Cryomancienne', rarity: 'C', hp: 90, atk: 23, def: 6, spd: 12,
    skill: { name: 'Pluie de glaçons', desc: '3 coups de 70 % au hasard, ATQ des cibles −15 % 2 tours.', cd: 3, kind: 'multi', mult: 0.7, hits: 3, weaken: { atk: 0.15, turns: 2 }, ico: 'snow' },
  },
  sylva: {
    name: 'Sylva', cls: 'Archère elfique', rarity: 'R', hp: 95, atk: 28, def: 7, spd: 15,
    skill: { name: 'Tir du crépuscule', desc: '170 % sur une cible, double sous 50 % de PV.', cd: 3, kind: 'single', mult: 1.7, exec: 0.5, ico: 'moon' },
  },
  thorn: {
    name: 'Thorn', cls: 'Druide', rarity: 'R', hp: 110, atk: 22, def: 8, spd: 10,
    skill: { name: 'Sève de vie', desc: 'Soigne toute l’équipe (110 % ATQ).', cd: 3, kind: 'heal', mult: 1.1, ico: 'leaf' },
  },
  gorm: {
    name: 'Gorm', cls: 'Orc barbare', rarity: 'R', hp: 140, atk: 24, def: 9, spd: 10,
    skill: { name: 'Frénésie', desc: '3 coups de 80 % au hasard, rend 25 % des dégâts en PV.', cd: 3, kind: 'multi', mult: 0.8, hits: 3, drain: 0.25, ico: 'rage' },
  },
  zara: {
    name: 'Zara', cls: 'Danseuse', rarity: 'R', hp: 95, atk: 22, def: 7, spd: 16,
    skill: { name: 'Danse des sabres', desc: 'ATQ de l’équipe +40 % pendant 2 tours.', cd: 3, kind: 'buff', atk: 0.4, turns: 2, ico: 'scarf' },
  },
  kitsune: {
    name: 'Kitsune', cls: 'Renarde à neuf queues', rarity: 'L', hp: 105, atk: 30, def: 8, spd: 17,
    skill: { name: 'Feux follets', desc: '5 coups de 55 % au hasard, brûlure 2 tours.', cd: 3, kind: 'multi', mult: 0.55, hits: 5, dot: { type: 'burn', mult: 0.25, turns: 2 }, ico: 'foxfire' },
  },
  sybil: {
    name: 'Sybil', cls: 'Voyante', rarity: 'L', hp: 100, atk: 26, def: 8, spd: 14,
    skill: { name: 'Prophétie', desc: 'ATQ de l’équipe +40 % 2 tours et soin (80 % ATQ).', cd: 4, kind: 'buff', atk: 0.4, turns: 2, heal: 0.8, ico: 'eye' },
  },
  grumli: {
    name: 'Grumli', cls: 'Nain', rarity: 'C', hp: 160, atk: 15, def: 15, spd: 7,
    skill: { name: 'Mur de pierre', desc: 'Attire tous les coups 2 tours et se soigne (120 % ATQ).', cd: 3, kind: 'taunt', turns: 2, heal: 1.2, ico: 'anvil' },
  },
  spike: {
    name: 'Spike', cls: 'Homme cactus', rarity: 'C', hp: 120, atk: 19, def: 11, spd: 8,
    skill: { name: 'Pluie d’épines', desc: '60 % sur tous les ennemis, saignement 2 tours.', cd: 3, kind: 'all', mult: 0.6, dot: { type: 'bleed', mult: 0.25, turns: 2 }, ico: 'cactus' },
  },
  bip: {
    name: 'Bip', cls: 'Robot', rarity: 'C', hp: 105, atk: 21, def: 10, spd: 11,
    skill: { name: 'Mitraille', desc: '4 tirs de 50 % sur des ennemis au hasard.', cd: 2, kind: 'multi', mult: 0.5, hits: 4, ico: 'robot' },
  },
  lulu: {
    name: 'Lulu', cls: 'Boulangère', rarity: 'C', hp: 100, atk: 18, def: 7, spd: 12,
    skill: { name: 'Pain chaud', desc: 'Soigne l’allié le plus blessé (220 % ATQ).', cd: 2, kind: 'heal1', mult: 2.2, ico: 'bread' },
  },
  djmax: {
    name: 'DJ Max', cls: 'DJ', rarity: 'C', hp: 95, atk: 19, def: 7, spd: 13,
    skill: { name: 'Le drop', desc: 'ATQ de l’équipe +25 % 2 tours et soin (40 % ATQ).', cd: 3, kind: 'buff', atk: 0.25, turns: 2, heal: 0.4, ico: 'disc' },
  },
  pablo: {
    name: 'Pablo', cls: 'Facteur', rarity: 'C', hp: 100, atk: 21, def: 7, spd: 14,
    skill: { name: 'Courrier express', desc: '3 lettres de 65 % sur des ennemis au hasard.', cd: 2, kind: 'multi', mult: 0.65, hits: 3, ico: 'letter' },
  },
  bob: {
    name: 'Bob', cls: 'Zombie', rarity: 'C', hp: 130, atk: 20, def: 6, spd: 7,
    skill: { name: 'Morsure contagieuse', desc: '130 % sur une cible, poison 3 tours.', cd: 3, kind: 'single', mult: 1.3, dot: { type: 'poison', mult: 0.4, turns: 3 }, ico: 'brain' },
  },
  zip: {
    name: 'Zip', cls: 'Skateur', rarity: 'C', hp: 95, atk: 22, def: 6, spd: 17,
    skill: { name: 'Ollie', desc: '140 % sur une cible, son ATQ −30 % 2 tours.', cd: 2, kind: 'single', mult: 1.4, weaken: { atk: 0.3, turns: 2 }, ico: 'skate' },
  },
  rexy: {
    name: 'Rexy', cls: 'Enfant dino', rarity: 'C', hp: 110, atk: 21, def: 8, spd: 11,
    skill: { name: 'Croc-croc', desc: '150 % sur une cible, rend 40 % des dégâts en PV.', cd: 3, kind: 'single', mult: 1.5, drain: 0.4, ico: 'dino' },
  },
  leo: {
    name: 'Léo', cls: 'Homme-lion', rarity: 'R', hp: 130, atk: 25, def: 10, spd: 12,
    skill: { name: 'Rugissement', desc: '80 % sur tous les ennemis, leur ATQ −25 % 2 tours.', cd: 3, kind: 'all', mult: 0.8, weaken: { atk: 0.25, turns: 2 }, ico: 'lion' },
  },
  tonnerre: {
    name: 'Tonnerre', cls: 'Super-héros', rarity: 'R', hp: 110, atk: 27, def: 9, spd: 15,
    skill: { name: 'Éclairs en chaîne', desc: '4 éclairs de 60 % sur des ennemis au hasard.', cd: 3, kind: 'multi', mult: 0.6, hits: 4, ico: 'bolt' },
  },
  ramses: {
    name: 'Ramsès', cls: 'Pharaon momie', rarity: 'R', hp: 120, atk: 24, def: 10, spd: 9,
    skill: { name: 'Bandelettes', desc: '140 % sur une cible et l’étourdit 2 tours.', cd: 4, kind: 'single', mult: 1.4, stun: 2, ico: 'mummy' },
  },
  elixa: {
    name: 'Elixa', cls: 'Alchimiste', rarity: 'R', hp: 100, atk: 23, def: 8, spd: 12,
    skill: { name: 'Élixir', desc: 'Bouclier sur l’équipe (120 % ATQ) 2 tours et soin (50 % ATQ).', cd: 3, kind: 'shield', mult: 1.2, turns: 2, heal: 0.5, ico: 'potion' },
  },
  mako: {
    name: 'Mako', cls: 'Homme-requin', rarity: 'R', hp: 115, atk: 28, def: 8, spd: 13,
    skill: { name: 'Frénésie des abysses', desc: '150 % sur une cible, double sous 50 % de PV, saignement 2 tours.', cd: 3, kind: 'single', mult: 1.5, exec: 0.5, dot: { type: 'bleed', mult: 0.3, turns: 2 }, ico: 'shark' },
  },
  pixel: {
    name: 'Pixel', cls: 'Hackeuse', rarity: 'R', hp: 90, atk: 28, def: 6, spd: 15,
    skill: { name: 'Piratage', desc: '3 attaques de 60 % au hasard, ignorent la DÉF.', cd: 2, kind: 'multi', mult: 0.6, hits: 3, pierce: true, ico: 'chip' },
  },
  lumi: {
    name: 'Lumi', cls: 'Chevalière au sabre', rarity: 'R', hp: 105, atk: 28, def: 8, spd: 14,
    skill: { name: 'Sabre de lumière', desc: '3 coups de 75 % sur des ennemis au hasard.', cd: 3, kind: 'multi', mult: 0.75, hits: 3, ico: 'saber' },
  },
  kero: {
    name: 'Kero', cls: 'Grenouille ninja', rarity: 'R', hp: 100, atk: 26, def: 7, spd: 16,
    skill: { name: 'Langue venimeuse', desc: '150 % sur une cible, poison 3 tours.', cd: 3, kind: 'single', mult: 1.5, dot: { type: 'poison', mult: 0.45, turns: 3 }, ico: 'frog' },
  },
  atlas: {
    name: 'Atlas', cls: 'Méca-gardien', rarity: 'L', hp: 170, atk: 22, def: 16, spd: 8,
    skill: { name: 'Protocole forteresse', desc: 'Bouclier sur l’équipe (200 % ATQ) 3 tours, attire les coups 2 tours.', cd: 4, kind: 'shield', mult: 2, turns: 3, taunt: 2, ico: 'mech' },
  },
  pyra: {
    name: 'Pyra', cls: 'Phénix', rarity: 'L', hp: 115, atk: 31, def: 9, spd: 15,
    skill: { name: 'Renaissance', desc: '100 % sur tous, brûlure 2 tours, puis soigne l’équipe (60 % ATQ).', cd: 4, kind: 'all', mult: 1, dot: { type: 'burn', mult: 0.4, turns: 2 }, heal: 0.6, ico: 'phoenix' },
  },
  mortis: {
    name: 'Mortis', cls: 'Roi-liche', rarity: 'L', hp: 125, atk: 32, def: 10, spd: 11,
    skill: { name: 'Hiver éternel', desc: '100 % sur tous, ATQ −30 % 2 tours, rend 20 % des dégâts en PV.', cd: 4, kind: 'all', mult: 1, weaken: { atk: 0.3, turns: 2 }, drain: 0.2, ico: 'crown' },
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

// Rang maximal actuel ; trois rangs de plus sont prévus (jusqu'à 8 : mythril, obsidienne…).
// Pour les ajouter : RANK_MULT, RANK_NAMES, UPGRADE et les dessins des rangs (js/sprites.js).
export const MAX_RANK = 5;

// Niveaux (XP) : on progresse en jouant. Le rang fixe le niveau maximum (10 par rang) ;
// chaque niveau ajoute 2,5 % aux stats ; monter de rang demande d'être au niveau maximum.
export const LEVEL = {
  cap: (rank) => 10 * rank,
  need: (lvl) => 20 + 10 * lvl, // XP pour passer du niveau lvl au suivant
  bonus: 0.025,
};
// XP gagnée par chaque héros d'un combat de niveau n (40 % en cas de défaite).
export const xpFor = (n, win) => Math.round((30 + 6 * n) * (win ? 1 : 0.4));

export function heroStats(id, rank, lvl = 1) {
  const h = HEROES[id], k = RANK_MULT[rank - 1] * (1 + LEVEL.bonus * (lvl - 1));
  return {
    hp: Math.round(h.hp * k), atk: Math.round(h.atk * k),
    def: Math.round(h.def * k), spd: h.spd + (rank - 1) + Math.floor((lvl - 1) / 10),
  };
}

export const GACHA = { single: 100, multi: 900, pity: 40 };
// Invocation de tenues (skins) : prix, et or rendu pour un doublon.
export const SKIN_GACHA = { single: 150, multi: 1350, dupGold: 50 };
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
    gold: 30 + 12 * n, firstGold: 100 + (n % 5 === 0 ? 150 : 0), mode: 'story', label: `Étape ${n} · ${ch.name}`,
  };
}

// ---------------------------------------------------------------- tour des épreuves

// Des salles rejouables, avec une difficulté au choix : on n'est jamais bloqué.
// Clés : TOWER_KEYS par jour, une clé dépensée par victoire.
export const TOWER_KEYS = 5;
export const TOWER_ROOMS = {
  shards: { name: 'Salle des éclats', short: 'Éclats', ico: 'summon', mg: '#c08aff', desc: 'pour monter de rang' },
  gold: { name: 'Salle du trésor', short: 'Trésor', ico: 'chest', mg: '#ffd86a', desc: 'beaucoup d’or' },
  xp: { name: 'Salle d’entraînement', short: 'Entraînement', ico: 'fight', mg: '#5ae0ee', desc: 'beaucoup d’XP' },
};
// lvl : niveau des ennemis selon la meilleure étape gagnée ; k : multiplicateur de récompense.
export const TOWER_DIFF = [
  { name: 'Facile', lvl: (b) => Math.max(1, Math.round(b * 0.5)), k: 1, count: 2 },
  { name: 'Normal', lvl: (b) => Math.max(1, b), k: 1.6, count: 3 },
  { name: 'Difficile', lvl: (b) => b + 4, k: 2.4, count: 3 },
];

export function towerReward(room, d, best) {
  const D = TOWER_DIFF[d], n = D.lvl(best);
  if (room === 'shards') return { shards: d + 1 };
  if (room === 'gold') return { gold: Math.round((80 + 25 * n) * D.k) };
  return { xp: Math.round(xpFor(n, true) * (1 + D.k)) };
}

export function towerStage(room, d, best, hero = null) {
  const D = TOWER_DIFF[d], n = D.lvl(best), ch = chapterOf(n), r = rng(Math.floor(Math.random() * 1e6));
  const enemies = Array.from({ length: D.count }, () => {
    const [k, v] = ch.pool[Math.floor(r() * ch.pool.length)];
    return enemy(k, v, n);
  });
  return {
    n, chapter: ch, enemies, boss: false, mode: 'tower', room, diff: d, hero,
    reward: { ...towerReward(room, d, best), hero }, label: `${TOWER_ROOMS[room].name} · ${D.name}`,
  };
}

// ---------------------------------------------------------------- mode infini

// Des vagues de plus en plus dures, sans fin ; les PV des héros passent d'une vague à l'autre
// (+25 % de soin entre deux vagues). Un golem toutes les 5 vagues, un dragon toutes les 10.
export function endlessWave(w) {
  const ch = CHAPTERS[Math.floor((w - 1) / 5) % CHAPTERS.length];
  let enemies;
  if (w % 10 === 0) enemies = [enemy('dragon', ch.dragon, w)];
  else if (w % 5 === 0) enemies = [enemy('golem', ch.golem, w)];
  else {
    const r = rng(w * 7919 + Math.floor(Math.random() * 1e6)), count = Math.min(3, 1 + Math.floor(w / 2));
    enemies = Array.from({ length: count }, () => {
      const [k, v] = ch.pool[Math.floor(r() * ch.pool.length)];
      return enemy(k, v, w);
    });
  }
  return {
    n: w, wave: w, chapter: ch, enemies, boss: w % 5 === 0, mode: 'endless',
    reward: { gold: 20 + 10 * w, xp: Math.round(xpFor(w, true) * 0.7) }, label: `Mode infini · Vague ${w}`,
  };
}
