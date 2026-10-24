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
export function unlock() {
  try {
    if ('audioSession' in navigator) navigator.audioSession.type = 'playback';
  } catch (e) { /* non supporté */ }
  if (!ctx) {
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
  if (ctx.state === 'suspended') ctx.resume();
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
