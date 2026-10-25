// Sons façon console 8 bits (Web Audio, ondes carrées + bruit) et vibrations.
let ctx = null, master = null, noiseBuf = null;
let soundOn = true, hapticOn = true;

export function setSound(on) {
  soundOn = on;
}
export function setHaptics(on) {
  hapticOn = on;
}

// iOS n'autorise l'audio qu'après un geste de l'utilisateur (touchend / click).
// Par défaut Safari range le Web Audio en son « ambiant », coupé par le bouton silencieux :
// le type « playback » le fait jouer comme un vrai jeu.
// Quand le téléphone se verrouille ou que l'app passe en arrière-plan, iOS interrompt le contexte
// audio et ne le relance pas toujours (il peut même se dire « running » en restant muet) :
// on le marque comme périmé, et on en recrée un neuf au prochain geste.
let stale = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stale = true;
});
addEventListener('pagehide', () => (stale = true));

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  // Bruit « paliers » : on tient chaque valeur quelques échantillons, plus granuleux.
  let v = 0;
  for (let i = 0; i < d.length; i++) {
    if (i % 6 === 0) v = Math.random() * 2 - 1;
    d[i] = v;
  }
}

export function unlock() {
  try {
    if ('audioSession' in navigator) navigator.audioSession.type = 'playback';
  } catch (e) { /* non supporté */ }
  if (ctx && (stale || ctx.state === 'closed' || ctx.state === 'interrupted')) {
    try { ctx.close(); } catch (e) { /* déjà fermé */ }
    ctx = null;
  }
  stale = false;
  if (!ctx) build();
  if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
}

// Une note : fréquence, durée (s), départ relatif (s), forme, volume, glissement vers une autre fréquence.
function tone(freq, dur, at = 0, type = 'square', vol = 1, slide = null) {
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.linearRampToValueAtTime(slide, t + dur);
  // Enveloppe en paliers, sans fondu doux.
  g.gain.setValueAtTime(vol, t);
  g.gain.setValueAtTime(vol * 0.5, t + dur * 0.6);
  g.gain.setValueAtTime(0, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.01);
}

// Souffle filtré qui glisse d'une fréquence à l'autre (vent, zoom).
function whoosh(dur, f0, f1, vol = 1, at = 0) {
  const t = ctx.currentTime + at;
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noiseBuf;
  s.loop = true;
  f.type = 'bandpass';
  f.Q.value = 1.4;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.001, t);
  g.gain.linearRampToValueAtTime(vol, t + dur * 0.35);
  g.gain.linearRampToValueAtTime(0.001, t + dur);
  s.connect(f).connect(g).connect(master);
  s.start(t);
  s.stop(t + dur + 0.02);
}

function noise(dur, at = 0, vol = 0.8) {
  const t = ctx.currentTime + at;
  const s = ctx.createBufferSource(), g = ctx.createGain();
  s.buffer = noiseBuf;
  g.gain.setValueAtTime(vol, t);
  g.gain.setValueAtTime(vol * 0.4, t + dur * 0.5);
  g.gain.setValueAtTime(0, t + dur);
  s.connect(g).connect(master);
  s.start(t);
  s.stop(t + dur + 0.01);
}

const N = { C4: 262, E4: 330, G4: 392, A4: 440, C5: 523, D5: 587, E5: 659, G5: 784, A5: 880, C6: 1047, E6: 1319 };

const SOUNDS = {
  blip: () => tone(N.A5, 0.04),
  move: () => tone(N.E5, 0.03, 0, 'square', 0.7),
  select: () => { tone(N.C6, 0.04); tone(N.E6, 0.05, 0.04); },
  tick: () => tone(N.G4, 0.03, 0, 'square', 0.6),
  denied: () => { tone(196, 0.06); tone(147, 0.08, 0.06); },
  hit: () => { noise(0.08); tone(220, 0.08, 0, 'square', 0.5, 110); },
  crit: () => { noise(0.12); tone(440, 0.05, 0, 'square', 0.7); tone(880, 0.08, 0.05, 'square', 0.7, 220); },
  hurt: () => { noise(0.1, 0, 0.6); tone(150, 0.12, 0, 'square', 0.6, 80); },
  skill: () => tone(N.C5, 0.18, 0, 'square', 0.7, N.C6 * 1.5),
  heal: () => [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => tone(f, 0.07, i * 0.07, 'triangle', 1)),
  boom: () => { noise(0.35, 0, 1); tone(110, 0.35, 0, 'square', 0.6, 40); },
  die: () => [N.A5, N.E5, N.C5, N.A4].forEach((f, i) => tone(f, 0.06, i * 0.06, 'square', 0.7)),
  win: () => [[N.C5, 0.1], [N.E5, 0.1], [N.G5, 0.1], [N.C6, 0.3]].reduce((t, [f, d]) => (tone(f, d, t), t + d), 0),
  lose: () => [[N.G4, 0.15], [N.E4, 0.15], [N.C4, 0.4]].reduce((t, [f, d]) => (tone(f, d, t, 'square', 0.8), t + d), 0),
  card: () => tone(N.E6, 0.02, 0, 'square', 0.4),
  rare: () => { tone(N.E5, 0.08); tone(N.A5, 0.12, 0.08); },
  legend: () => [N.C5, N.E5, N.G5, N.C6, N.E6, N.C6, N.E6].forEach((f, i) => tone(f, 0.07, i * 0.07)),
  levelUp: () => [N.C5, N.D5, N.E5, N.G5, N.C6].forEach((f, i) => tone(f, 0.06, i * 0.06)),
  coin: () => { tone(N.E6 * 0.75, 0.05); tone(N.E6, 0.12, 0.05); },
  wind: () => { whoosh(0.55, 300, 1400, 1.6); whoosh(0.45, 700, 2400, 0.7, 0.08); },
  zoom: () => { whoosh(0.5, 200, 3000, 1.4); tone(110, 0.5, 0, 'square', 0.35, 440); noise(0.15, 0.45, 0.6); },
  hover: () => tone(N.G5, 0.025, 0, 'square', 0.45),
  // un pas en avant sous le projecteur : souffle court + deux notes qui montent (ou descendent pour l'ennemi)
  focus: () => { whoosh(0.22, 500, 2200, 0.9); tone(N.G4, 0.05, 0.03, 'square', 0.35); tone(N.C5, 0.08, 0.08, 'square', 0.35); },
  focusFoe: () => { whoosh(0.22, 1600, 300, 0.9); tone(N.E4, 0.05, 0.03, 'square', 0.35); tone(196, 0.1, 0.08, 'square', 0.35); },
  // charge d'une compétence : souffle qui monte et note qui grimpe
  charge: () => { whoosh(0.42, 300, 2600, 0.9); tone(220, 0.4, 0, 'square', 0.3, 880); },
  // coup sourd de bois quand on choisit une pancarte
  // sons d'attaque propres à chaque héros (voir js/fx.js)
  slash: () => { whoosh(0.12, 3000, 800, 1.2); noise(0.05, 0.08, 0.6); },
  arrow: () => { whoosh(0.16, 1800, 4200, 0.9); tone(N.E6, 0.03, 0.14, 'square', 0.4); },
  zap: () => { tone(N.C5, 0.18, 0, 'square', 0.5, N.C6 * 2); tone(N.G5, 0.12, 0.04, 'triangle', 0.6, N.E6); },
  holy: () => [N.E5, N.A5, N.E6].forEach((f, i) => tone(f, 0.08, i * 0.05, 'triangle', 0.8)),
  plasma: () => { tone(N.A5, 0.05, 0, 'square', 0.5, N.E6 * 1.5); tone(N.E6, 0.06, 0.05, 'square', 0.4, N.A5); noise(0.04, 0.03, 0.4); },
  // sons des tenues
  bonk: () => { tone(330, 0.05, 0, 'square', 0.6, 520); tone(660, 0.08, 0.05, 'triangle', 0.6); noise(0.03, 0, 0.4); },
  pop: () => { tone(N.C5, 0.04, 0, 'square', 0.5, N.C6); noise(0.04, 0.03, 0.5); },
  cannon: () => { noise(0.2, 0, 1); tone(90, 0.25, 0, 'square', 0.7, 40); },
  bubble: () => [N.G5, N.C6, N.E6].forEach((f, i) => tone(f, 0.04, i * 0.05, 'triangle', 0.6, f * 1.3)),
  baa: () => { tone(330, 0.3, 0, 'square', 0.35, 300); tone(336, 0.3, 0, 'triangle', 0.5, 310); },
  // nouveaux héros et statuts
  shout: () => { tone(196, 0.12, 0, 'square', 0.6, 262); tone(262, 0.18, 0.1, 'square', 0.6, 392); noise(0.06, 0.1, 0.4); },
  lute: () => [N.E5, N.G5, N.C6].forEach((f, i) => tone(f, 0.09, i * 0.06, 'triangle', 0.8, f * 0.98)),
  chop: () => { noise(0.05, 0, 0.7); tone(392, 0.04, 0, 'square', 0.5, 196); tone(130, 0.08, 0.04, 'triangle', 0.8); },
  splash: () => { whoosh(0.3, 900, 3200, 1.2); noise(0.12, 0.12, 0.5); },
  drain: () => { tone(N.E5, 0.25, 0, 'triangle', 0.6, 196); tone(N.A4, 0.25, 0.05, 'square', 0.3, 147); },
  punch: () => { noise(0.07, 0, 0.9); tone(165, 0.1, 0, 'square', 0.8, 70); tone(N.E5, 0.04, 0.02, 'square', 0.4); },
  burn: () => { noise(0.18, 0, 0.5); tone(220, 0.12, 0, 'square', 0.3, 330); },
  bang: () => { noise(0.1, 0, 1); tone(330, 0.05, 0, 'square', 0.6, 110); },
  reel: () => { tone(N.C6, 0.25, 0, 'square', 0.3, N.C5); noise(0.05, 0.22, 0.4); },
  laser: () => tone(N.E6, 0.16, 0, 'square', 0.5, N.A4),
  ghost: () => { tone(N.A4, 0.3, 0, 'triangle', 0.7, N.E5); tone(N.E4, 0.3, 0.05, 'triangle', 0.4, N.A4); },
  roar: () => { noise(0.4, 0, 0.9); tone(98, 0.4, 0, 'square', 0.7, 65); tone(147, 0.3, 0.05, 'square', 0.4, 98); },
  drip: () => { tone(N.A5, 0.04, 0, 'triangle', 0.6, N.E5); tone(N.E5, 0.05, 0.06, 'triangle', 0.4, N.C5); },
  shield: () => { tone(N.G4, 0.06, 0, 'square', 0.5); tone(N.D5, 0.14, 0.05, 'triangle', 0.8, N.G5); },
  // grosse plaque qui tombe ou éclate : coup sourd et gras (basse qui plonge + bruit + craquement)
  thud: () => {
    noise(0.14, 0, 0.9);
    tone(140, 0.22, 0, 'square', 0.7, 45);
    tone(70, 0.28, 0, 'triangle', 1, 35);
    tone(220, 0.05, 0.02, 'square', 0.35, 110);
  },
  // une plaque qu'on fait glisser du doigt : souffle rapide
  swipe: () => { whoosh(0.2, 600, 2600, 1.4); whoosh(0.16, 1400, 500, 0.6, 0.05); },
  wood: () => { noise(0.04, 0, 0.5); tone(170, 0.06, 0, 'square', 0.45, 90); tone(110, 0.08, 0.03, 'triangle', 0.7); },
  // les actions apparaissent une à une
  menu: () => [N.G5, N.C6, N.E6].forEach((f, i) => tone(f, 0.04, 0.05 + i * 0.07, 'triangle', 0.5)),
};

export function sfx(name) {
  if (!soundOn || !ctx || !SOUNDS[name]) return;
  if (ctx.state !== 'running') ctx.resume();
  SOUNDS[name]();
}

// Vibration. Android : navigator.vibrate. iPhone : Safari n'a pas d'API officielle ;
// on clique un interrupteur <input switch> caché, ce qui déclenche le retour haptique
// du système (iOS 17.4+, non officiel : Apple peut le supprimer).
// Apple semble avoir fermé cette astuce dans iOS 26.5 : elle ne marche alors plus du tout.
export function haptic(ms = 12) {
  if (!hapticOn) return;
  if (navigator.vibrate) {
    navigator.vibrate(ms);
    return;
  }
  const label = document.createElement('label');
  label.ariaHidden = 'true';
  label.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.appendChild(input);
  document.head.appendChild(label);
  label.click();
  label.remove();
}
