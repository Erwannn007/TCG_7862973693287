// Sauvegarde locale (localStorage). Le jeu marche même si le stockage est indisponible.
const KEY = 'pixel-gacha-save-v1';

function fresh() {
  return {
    gold: 1000,
    owned: { kael: { rank: 1, frags: 0, lvl: 1, xp: 0 } },
    team: ['kael'],
    skins: {}, // tenues obtenues : { idDuSkin: true }
    keys: 5, // clés de la tour des épreuves (rechargées chaque jour)
    keysDay: '',
    endlessBest: 0, // meilleure vague du mode infini
    wear: {}, // tenue portée par héros : { idDuHéros: idDuSkin }
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
    if (raw) {
      const s = { ...fresh(), ...JSON.parse(raw) };
      // anciennes sauvegardes : les héros commencent au niveau 1
      for (const o of Object.values(s.owned)) {
        o.lvl ??= 1;
        o.xp ??= 0;
      }
      return s;
    }
  } catch (e) { /* stockage indisponible */ }
  return fresh();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
}

// Mode admin : la vraie partie est mise de côté avant le premier « tout débloquer », et peut être
// remise telle quelle ensuite.
const BACKUP = KEY + '-avant-admin';
export function hasBackup() {
  try { return !!localStorage.getItem(BACKUP); } catch (e) { return false; }
}
export function backupSave() {
  try { if (!localStorage.getItem(BACKUP)) localStorage.setItem(BACKUP, JSON.stringify(state)); } catch (e) { /* ignoré */ }
}
export function restoreBackup() {
  try {
    const raw = localStorage.getItem(BACKUP);
    if (!raw) return false;
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, fresh(), JSON.parse(raw));
    localStorage.removeItem(BACKUP);
    save();
    return true;
  } catch (e) { return false; }
}

export function resetSave() {
  try { localStorage.removeItem(KEY); } catch (e) { /* ignoré */ }
  Object.assign(state, fresh());
}
