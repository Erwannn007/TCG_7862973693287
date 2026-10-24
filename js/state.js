// Sauvegarde locale (localStorage). Le jeu marche même si le stockage est indisponible.
const KEY = 'pixel-gacha-save-v1';

function fresh() {
  return {
    gold: 1000,
    owned: { kael: { rank: 1, frags: 0 } },
    team: ['kael'],
    best: 0, // meilleure étape gagnée
    pulls: 0,
    pity: 0,
    lastDaily: '',
    sound: true,
    haptics: true,
  };
}

export const state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch (e) { /* stockage indisponible */ }
  return fresh();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
}

export function resetSave() {
  try { localStorage.removeItem(KEY); } catch (e) { /* ignoré */ }
  Object.assign(state, fresh());
}
