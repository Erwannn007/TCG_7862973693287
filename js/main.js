// Interface du jeu (écran horizontal).
// Trois pièces côte à côte qu'on parcourt en balayant : Équipe · Camp · Invocation.
// Au camp, on touche la porte pour partir au combat.
import { HEROES, HERO_IDS, RARITY, RANK_NAMES, UPGRADE, GACHA, SKIN_GACHA, DAILY_GOLD, MAX_RANK, LEVEL, xpFor, heroStats, stage, TOWER_KEYS, TOWER_ROOMS, TOWER_DIFF, towerReward, towerStage, endlessWave } from './data.js';
import { heroSprite, skinSprite, SKINS, coinSprite, starSprite, rankGemSprite } from './sprites.js';
import { spriteCanvas, bitmap, drawFx } from './render.js';
import { state, save, resetSave } from './state.js';
import { Battle, W, H } from './battle.js';
import { sceneBackground, drawRoomLayers, campFireFront, altar, ALTAR_Y, ALTAR_BASE, SH, CAMP_W, GATE } from './scene.js';
import { installUiArt, iconSprite, signUrl, posterUrl, U } from './ui-art.js';
import { sfx, haptic, unlock, setSound, setHaptics } from './sfx.js';
import { OUTLINE } from './spr.js';

installUiArt();

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const DPR = () => window.devicePixelRatio || 1;
const LOCKED = '#1a1320';
const RAR_STARS = { C: 1, R: 2, L: 3 };
const ROOMS = ['team', 'camp', 'summon'];
const ROOM_NAMES = { team: 'Équipe', camp: 'Camp', summon: 'Invocation' };

const heroCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}`, () => heroSprite(id, rank), k);
const lockedCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}-lock`, () => heroSprite(id, rank).silhouette(LOCKED), k);
const icon = (name, k = 2) => spriteCanvas('ico-' + name, () => iconSprite(name), k);
// Apparence d'un héros : sa tenue (skin) s'il en porte une — la même à tous les rangs —, sinon le
// dessin de son rang. skin : forcer une tenue (null : tenue d'origine).
const look = (id, rank, skin = state.wear[id]) => (skin
  ? { key: 'skin-' + skin, make: () => skinSprite(skin) }
  : { key: `h-${id}-${rank}`, make: () => heroSprite(id, rank) });
const lookCanvas = (id, k) => {
  const lk = look(id, state.owned[id].rank);
  return spriteCanvas(lk.key, lk.make, k);
};

function starsRow(rar, k = 1) {
  const d = el('div', 'stars');
  for (let i = 0; i < RAR_STARS[rar]; i++) d.appendChild(spriteCanvas('star', starSprite, k));
  return d;
}
function rankGems(rank, k = 2) {
  const d = el('div', 'gems');
  for (let i = 1; i <= 5; i++) d.appendChild(spriteCanvas('gem-' + (i <= rank), () => rankGemSprite(i <= rank), k));
  return d;
}

// Portrait : le héros debout dans un coin de la salle d'armes (mur + dalles), avec son ombre.
function portrait(id, rank, k, w = 28, h = 30, locked = false, lk = null) {
  const c = el('canvas', 'px');
  c.width = w;
  c.height = h;
  c.style.width = w * k + 'px';
  c.style.height = h * k + 'px';
  const g = c.getContext('2d');
  g.drawImage(sceneBackground('teamRoom'), 216 - (w >> 1), 92 - h, w, h, 0, 0, w, h);
  const bm = locked
    ? bitmap(`h-${id}-1-lock`, () => heroSprite(id, 1).silhouette(LOCKED))
    : lk ? bitmap(lk.key, lk.make) : bitmap(`h-${id}-${rank}`, () => heroSprite(id, rank));
  g.globalAlpha = 0.45;
  g.fillStyle = OUTLINE;
  g.fillRect((w >> 1) - 6, h - 4, 12, 2);
  g.fillRect((w >> 1) - 4, h - 2, 8, 1);
  g.globalAlpha = 1;
  const x = (w - bm.w) >> 1, y = h - 3 - bm.h;
  g.drawImage(bm.canvas, x, y);
  if (!locked) drawFx(g, bm, x, y, 1);
  return c;
}
// Barre en segments (on compte les morceaux d'un coup d'œil).
function segBar(ratio, cls = '', n = 10) {
  const d = el('div', 'seg ' + cls), lit = Math.round(Math.min(1, ratio) * n);
  for (let i = 0; i < n; i++) d.appendChild(el('i', i < lit ? 'on' : ''));
  return d;
}
// Place un canvas de pixel art à une échelle entière en pixels physiques.
// cover = false : tout visible ; cover = true : remplit la hauteur (les côtés peuvent dépasser).
function fitCanvas(c, w, h, vw, vh, cover) {
  const dpr = DPR();
  let s = Math.max(1, Math.floor(Math.min((vw * dpr) / w, (vh * dpr) / h)));
  if (cover) {
    s = Math.max(1, Math.floor((vh * dpr) / h));
    if ((w * s) / dpr < vw) s = Math.ceil((vw * dpr) / w);
  }
  const cw = (w * s) / dpr, ch = (h * s) / dpr;
  c.style.width = cw + 'px';
  c.style.height = ch + 'px';
  c.style.left = Math.round(((vw - cw) / 2) * dpr) / dpr + 'px';
  c.style.top = Math.round(((vh - ch) / 2) * dpr) / dpr + 'px';
  c.style.position = 'absolute';
}
// Passe d'une position du canvas (pixels d'art) à l'écran (pixels CSS), et inversement.
const toScreen = (c, w, x, y) => {
  const k = c.clientWidth / w;
  return [c.offsetLeft + x * k, c.offsetTop + y * k];
};
const toArt = (c, w, ev) => {
  const r = c.getBoundingClientRect(), k = r.width / w;
  return [(ev.clientX - r.left) / k, (ev.clientY - r.top) / k];
};

$$('.coin').forEach((s) => s.appendChild(spriteCanvas('coin', coinSprite, 2)));
$('#btn-options').appendChild(icon('gear'));
$('#btn-daily').appendChild(icon('chest'));
$('#go-replay').appendChild(icon('scroll'));

// ---------------------------------------------------------------- pièces et transitions

let screen = 'camp';

function show(name) {
  screen = name;
  if (name !== 'team') resetSkins();
  for (const s of [...ROOMS, 'battle']) {
    const e = $('#scr-' + s);
    e.classList.toggle('hidden', s !== name);
    e.style.transform = '';
  }
  refresh();
}

function refresh() {
  $$('.gold-amt').forEach((g) => (g.textContent = state.gold));
  const inRoom = ROOMS.includes(screen);
  $('#nav-hints').classList.toggle('hidden', !inRoom);
  if (!inRoom) return;
  const i = ROOMS.indexOf(screen);
  const [l, r] = [$('#nav-hints .left'), $('#nav-hints .right')];
  l.classList.toggle('hidden', i === 0);
  r.classList.toggle('hidden', i === ROOMS.length - 1);
  if (i > 0) l.querySelector('span').textContent = ROOM_NAMES[ROOMS[i - 1]];
  if (i < ROOMS.length - 1) r.querySelector('span').textContent = ROOM_NAMES[ROOMS[i + 1]];
  $$('#nav-hints .dots i').forEach((d, k) => d.classList.toggle('on', k === i));
  renderRoom(screen);
  drawRooms(true);
}

function renderRoom(name) {
  if (name === 'camp') renderCamp();
  else if (name === 'team') renderTeam();
  else renderSummon();
}

// Balayage d'une pièce à l'autre : glissement par paliers + bourrasque de vent.
let moving = false;
async function goRoom(dir) {
  const i = ROOMS.indexOf(screen), j = i + dir;
  if (moving || summoning || i < 0 || j < 0 || j >= ROOMS.length) return;
  moving = true;
  const from = $('#scr-' + screen), name = ROOMS[j], to = $('#scr-' + name);
  renderRoom(name);
  to.classList.remove('hidden');
  sfx('wind');
  haptic(20);
  windGust(dir);
  // parallaxe : pendant le glissement, le mur du fond traîne et le premier plan file
  const PAN = 28;
  for (const p of [0.25, 0.5, 0.75, 1]) {
    from.style.transform = `translateX(${-dir * p * 100}%)`;
    to.style.transform = `translateX(${dir * (1 - p) * 100}%)`;
    roomPan[screen] = dir * p * PAN;
    roomPan[name] = -dir * (1 - p) * PAN;
    drawRooms(true, name);
    await wait(55);
  }
  roomPan[screen] = roomPan[name] = 0;
  moving = false;
  show(name);
}

// Traits de vent en pixels, qui traversent l'écran par sauts.
async function windGust(dir) {
  const c = $('#wind'), dpr = DPR(), k = 3;
  c.width = Math.ceil(innerWidth / k);
  c.height = Math.ceil(innerHeight / k);
  c.style.imageRendering = 'pixelated';
  const g = c.getContext('2d');
  const streaks = Array.from({ length: 14 }, (_, i) => ({
    y: Math.floor(Math.random() * c.height), len: 8 + Math.floor(Math.random() * 20),
    x: dir > 0 ? c.width + Math.random() * c.width * 0.6 : -Math.random() * c.width * 0.6, v: 14 + (i % 4) * 5,
  }));
  for (let f = 0; f < 10; f++) {
    g.clearRect(0, 0, c.width, c.height);
    for (const s of streaks) {
      s.x -= dir * s.v;
      g.fillStyle = f % 2 ? '#f2e2b8' : '#ffffff';
      g.globalAlpha = 0.75;
      g.fillRect(Math.round(s.x), s.y, s.len, 1);
      g.globalAlpha = 0.4;
      g.fillRect(Math.round(s.x) + dir * 4, s.y + 1, Math.floor(s.len / 2), 1);
    }
    await wait(45);
  }
  g.clearRect(0, 0, c.width, c.height);
  void dpr;
}

// Fondu au noir par paliers (aucune transition douce).
async function fade(to) {
  const f = $('#fader');
  f.classList.add('on');
  const steps = to ? [0.25, 0.5, 0.75, 1] : [0.75, 0.5, 0.25, 0];
  for (const o of steps) {
    f.style.opacity = o;
    await wait(70);
  }
  if (!to) f.classList.remove('on');
}

// Balayage au doigt (ou à la souris) sur les pièces.
let swipe = null, swallowClick = false;
addEventListener('pointerdown', (e) => {
  if (!ROOMS.includes(screen) || moving || summoning || overlayOpen()) return;
  swipe = { x: e.clientX, y: e.clientY, t: performance.now() };
}, { passive: true });
addEventListener('pointerup', (e) => {
  if (!swipe) return;
  const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y, dt = performance.now() - swipe.t;
  swipe = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 800) {
    swallowClick = true;
    setTimeout(() => (swallowClick = false), 350);
    goRoom(dx < 0 ? 1 : -1);
  }
}, { passive: true });
addEventListener('click', (e) => {
  if (swallowClick) {
    e.stopPropagation();
    e.preventDefault();
  }
}, true);
$$('#nav-hints .edge').forEach((b) => (b.onclick = () => goRoom(+b.dataset.go)));

const overlayOpen = () => !$('#modal').classList.contains('hidden') || !$('#reveal').classList.contains('hidden');

// ---------------------------------------------------------------- décors animés des pièces

const ROOM_SCENES = { camp: 'camp', team: 'teamRoom', summon: 'summonRoom' };
let roomStep = 0;
// Décalage de parallaxe de chaque pièce (pixels d'art), animé pendant le passage d'une pièce à l'autre.
const roomPan = { camp: 0, team: 0, summon: 0 };

function drawRooms(fit, only) {
  for (const name of ROOMS) {
    const sec = $('#scr-' + name);
    if (sec.classList.contains('hidden') && name !== only) continue;
    const c = $(`#${name}-canvas`);
    if (fit || c.width !== CAMP_W) {
      c.width = CAMP_W;
      c.height = SH;
      fitCanvas(c, CAMP_W, SH, innerWidth, innerHeight, true);
    }
    const g = c.getContext('2d'), sc = ROOM_SCENES[name];
    drawRoomLayers(sc, g, roomStep, roomPan[name], false);
    if (name === 'camp') {
      drawDoor(g);
      campFireFront(g, roomStep);
      drawCampLife(g);
    }
    if (name === 'summon') drawAltar(g);
    if (name === 'team') drawTeamLife(g);
    drawRoomLayers(sc, g, roomStep, roomPan[name], true);
  }
}
setInterval(() => {
  if (!ROOMS.includes(screen)) return;
  roomStep++;
  drawRooms(false);
}, 140);

function drawCampLife(g) {
  const spots = [[124, 96], [136, 86], [176, 94]];
  // du fond vers l'avant : celui dont les pieds sont le plus bas passe devant
  const order = state.team.map((id, i) => [id, i]).sort((a, b) => spots[a[1]][1] - spots[b[1]][1]);
  order.forEach(([id, i]) => {
    const lk = look(id, state.owned[id].rank), bm = bitmap(lk.key, lk.make);
    const x = spots[i][0] - (bm.w >> 1), y = spots[i][1] - bm.h - ((Math.floor(roomStep / 2) + i) % 2);
    g.drawImage(bm.canvas, x, y);
    drawFx(g, bm, x, y, roomStep);
  });
}

// L'autel d'invocation, à la place choisie par layoutSummon (pixels d'art).
let summonAltarX = 110;
// Pendant un changement d'autel, seule la pierre glisse : l'ancienne sort, la nouvelle arrive.
function drawAltar(g) {
  const sw = altarSwap;
  if (!sw) return altar(g, summonAltarX, roomStep, altarCharge, summonKind);
  const q = Math.min(1, (performance.now() - sw.t0) / (sw.bump ? 260 : SWAP_MS));
  if (sw.bump) {
    const d = Math.round(Math.sin(q * Math.PI) * 6) * -sw.dir;
    return altar(g, summonAltarX + d, roomStep, false, summonKind);
  }
  const p = Math.floor(q * 8) / 8, off = Math.round(p * SWAP_DIST) * sw.dir;
  altar(g, summonAltarX - off, roomStep, false, sw.from);
  altar(g, summonAltarX - off + SWAP_DIST * sw.dir, roomStep, false, sw.to);
}

// ---------------------------------------------------------------- camp

const today = () => new Date().toISOString().slice(0, 10);

// Trois modes derrière la porte : l'histoire, la tour des épreuves, le mode infini. On passe de l'un
// à l'autre en faisant glisser la porte de bas en haut (et de haut en bas pour revenir) : les
// pancartes explosent en copeaux, les nouvelles tombent du ciel, et l'intérieur de la porte change.
const CAMP_MODES = ['story', 'tower', 'endless'];
let campMode = 'story';
let towerPick = null; // choix en cours dans la tour : { room, hero }

// Clés de la tour, rechargées chaque jour.
function towerKeys() {
  if (state.keysDay !== today()) {
    state.keys = TOWER_KEYS;
    state.keysDay = today();
    save();
  }
  return state.keys;
}

function renderCamp() {
  $('#go-replay').classList.toggle('hidden', state.best === 0);
  $('#btn-daily').classList.toggle('hidden', state.lastDaily === today());
  campRibbon();
  requestAnimationFrame(() => layoutCamp());
}

function campRibbon() {
  const next = stage(state.best + 1);
  $('#fight-info').textContent = campMode === 'story'
    ? `Étape ${next.n} · ${next.chapter.name}${next.boss ? ' · Boss' : ''}`
    : campMode === 'tower' ? `Tour des épreuves · ${towerKeys()}/${TOWER_KEYS} clés` : `Mode infini · record : vague ${state.endlessBest}`;
  $('#door-sign .hint').textContent = campMode === 'story' ? 'Touche la porte' : campMode === 'tower' ? 'Choisis une salle' : 'Jusqu’où descendras-tu ?';
  $$('#c-modes .dots i').forEach((d, i) => d.classList.toggle('on', CAMP_MODES[i] === campMode));
}

// Les pancartes du mode, en arc à droite de la porte.
function campItems() {
  if (campMode === 'story') {
    const next = stage(state.best + 1);
    const items = [{ ico: 'fight', mg: '#ff8a4a', label: 'Combattre', sub: `Étape ${next.n}${next.boss ? ' · Boss' : ''}`, showSub: true, go: () => enterDoor() }];
    if (state.best > 0) items.push({ ico: 'scroll', mg: '#d8c8b0', label: 'Rejouer', sub: 'une étape gagnée', showSub: true, go: () => $('#go-replay').onclick() });
    return items;
  }
  if (campMode === 'endless') {
    return [{ ico: 'fight', mg: '#c08aff', label: 'Descendre', sub: `record : vague ${state.endlessBest}`, showSub: true, go: () => { endlessRun = { wave: 1, gold: 0 }; enterDoor(endlessWave(1)); } }];
  }
  // tour des épreuves : salle → (héros) → difficulté
  const keys = towerKeys(), back = { ico: 'back', mg: '#d8c8b0', label: 'Retour', go: () => { towerPick = null; swapCampSigns(); } };
  if (!towerPick) {
    return Object.entries(TOWER_ROOMS).map(([id, R]) => ({
      ico: R.ico, mg: R.mg, label: R.short, sub: R.desc, showSub: true, off: keys <= 0,
      go: () => { towerPick = { room: id }; swapCampSigns(); },
    }));
  }
  if (towerPick.room === 'shards' && !towerPick.hero) {
    const heroes = HERO_IDS.filter((id) => state.owned[id] && state.owned[id].rank < MAX_RANK);
    return [...heroes.map((id) => ({
      ico: id, mg: '#c08aff', label: HEROES[id].name, sub: `éclats ${state.owned[id].frags}/${UPGRADE[state.owned[id].rank - 1].frags}`, showSub: true,
      go: () => { towerPick.hero = id; swapCampSigns(); },
    })), back];
  }
  const R = TOWER_ROOMS[towerPick.room];
  return [...TOWER_DIFF.map((D, d) => {
    const rw = towerReward(towerPick.room, d, state.best);
    const gain = rw.shards ? `+${rw.shards} éclat${rw.shards > 1 ? 's' : ''}` : rw.gold ? `+${rw.gold} or` : `+${rw.xp} XP`;
    return {
      ico: R.ico, mg: ['#9af098', '#ffd86a', '#ff6a6a'][d], label: D.name, sub: `niv ${D.lvl(state.best)} · ${gain}`, showSub: true, off: keys <= 0,
      go: () => enterDoor(towerStage(towerPick.room, d, state.best, towerPick.hero)),
    };
  }), back];
}

function layoutCamp(enter = 'fan') {
  if ($('#scr-camp').classList.contains('hidden')) return;
  const c = $('#camp-canvas'), k = c.clientWidth / CAMP_W;
  // le ruban du mode est en haut, entre le titre et les boutons, pour laisser la porte dégagée
  const [dx] = toScreen(c, CAMP_W, 150, 40), s = $('#door-sign');
  s.style.left = dx + 'px';
  const [mx, my] = toScreen(c, CAMP_W, 150, 30), md = $('#c-modes');
  md.style.left = mx + 'px';
  md.style.top = my + 'px';
  const items = campItems(), n = items.length;
  // grand rayon, centre à gauche : un arc doux à droite de la porte ; écart vertical d'environ
  // 70 px entre deux pancartes, resserré s'il y en a beaucoup pour rester à l'écran
  const R = 170, gap = n > 1 ? Math.min(70, (innerHeight - 140) / (n - 1)) : 0, step = 2 * Math.asin(gap / 2 / R);
  layoutSigns($('#c-menu'), null, items, dx + 18 * k + 70 - R, (60 + innerHeight) / 2, R, step, 'messy', enter);
}

// Les pancartes du camp explosent en copeaux, puis les nouvelles tombent du ciel.
function swapCampSigns() {
  const m = $('#c-menu'), WOODS = ['#8a5a32', '#b8814a', '#5a3820', '#d49a4e'];
  [...m.querySelectorAll('.act')].forEach((a, i) => {
    const r = a.getBoundingClientRect();
    fx(Array.from({ length: 14 }, () => ({ x: rr(r.left, r.right), y: rr(r.top, r.bottom), vx: rr(-2.5, 2.5), vy: rr(-3.5, -0.5), g: 0.25, life: rr(20, 34) | 0, c: WOODS[(Math.random() * 4) | 0], s: Math.random() < 0.5 ? 3 : 2 })));
    a.animate([{ scale: 1, filter: 'brightness(1)' }, { scale: 1.12, filter: 'brightness(2)', offset: 0.3 }, { scale: 0.3, opacity: 0 }], { duration: 260, delay: i * 50, easing: 'steps(5, end)', fill: 'forwards' });
  });
  sfx('wood');
  haptic(12);
  setTimeout(() => {
    campRibbon();
    layoutCamp('drop');
    setTimeout(() => sfx('wood'), 420);
  }, 300);
}

function switchCampMode(dir) {
  const i = CAMP_MODES.indexOf(campMode) + dir;
  if (i < 0 || i >= CAMP_MODES.length) {
    // rien de ce côté : la porte résiste
    sfx('denied');
    $('#door-sign').animate(Array.from({ length: 5 }, (_, k) => ({ translate: k === 4 ? '-50% 0' : `calc(-50% + ${k % 2 ? 4 : -4}px) 0` })), { duration: 200, easing: 'steps(5, end)' });
    return;
  }
  campMode = CAMP_MODES[i];
  towerPick = null;
  doorFlash = performance.now();
  sfx('zoom');
  $('#scr-camp').animate(Array.from({ length: 5 }, (_, k) => ({ translate: k === 4 ? '0 0' : `0 ${k % 2 ? -2 : 2}px` })), { duration: 180, easing: 'steps(5, end)' });
  const c = $('#camp-canvas'), [x, y] = toScreen(c, CAMP_W, 150, 48);
  sparks(x, y, campMode === 'tower' ? '#7ab0f0' : campMode === 'endless' ? '#c08aff' : '#ffb030', 26, 1.8);
  swapCampSigns();
}

// L'intérieur de la porte selon le mode : obscurité (histoire), escalier de lumière bleue qui monte
// (tour), tourbillon violet (infini). Flash blanc juste après un changement.
let doorFlash = 0;
// Lumière qui sort de la porte : halo tramé sur le mur, flaque au sol qui s'élargit vers nous,
// rais de lumière (tour), particules aspirées (infini), braises (histoire). Respire par paliers.
const DOOR_LIGHT = { story: ['#ff9a3a', '#ffd08a'], tower: ['#5a8aff', '#c8e0ff'], endless: ['#a050ff', '#e8c8ff'] };
function doorLight(g) {
  const [col, hi] = DOOR_LIGHT[campMode], pulse = [0.75, 0.9, 1, 0.9][Math.floor(roomStep / 3) % 4];
  const strong = campMode === 'story' ? 0.7 : 1.4;
  // halo autour de l'arche
  g.fillStyle = col;
  for (let y = 4; y < 74; y++)
    for (let x = 108; x < 192; x++) {
      if (x > 134 && x < 166 && y > 20) continue;
      const d = ((x - 150) / 40) ** 2 + ((y - 46) / 42) ** 2;
      if (d > 1) continue;
      const a = Math.min(0.8, (1 - d) * 0.5 * pulse * strong);
      if (BAYER4[y % 4][x % 4] < (1 - d) * 1.3) {
        g.globalAlpha = a;
        g.fillRect(x, y, 1, 1);
      }
    }
  // flaque de lumière au sol, devant la porte
  for (let y = 74; y < 104; y++) {
    const t = (y - 74) / 30, half = Math.round(15 + t * 34);
    for (let x = 150 - half; x <= 150 + half; x++) {
      const e = Math.abs(x - 150) / half;
      if (BAYER4[y % 4][x % 4] > (1 - t) * (1 - e * 0.8) * 1.1) continue;
      g.globalAlpha = Math.min(0.8, 0.45 * pulse * strong * (1 - t * 0.7));
      g.fillRect(x, y, 1, 1);
    }
  }
  g.globalAlpha = 1;
  if (campMode === 'tower') {
    // rais de lumière bleue qui s'étirent sur le sol
    g.fillStyle = hi;
    for (const [dx, sl] of [[-8, -1.4], [0, 0], [8, 1.4]]) {
      g.globalAlpha = (roomStep + dx) % 6 < 3 ? 0.35 : 0.2;
      for (let y = 74; y < 100; y++) g.fillRect(Math.round(150 + dx + (y - 74) * sl), y, 1, 1);
    }
    g.globalAlpha = 1;
  } else if (campMode === 'endless') {
    // particules aspirées vers la porte en spirale
    for (let i = 0; i < 10; i++) {
      const t = ((roomStep + i * 5) % 30) / 30, a = i * 0.63 + t * 4, r = (1 - t) * 46;
      g.fillStyle = t > 0.7 ? '#ffffff' : hi;
      g.fillRect(Math.round(150 + Math.cos(a) * r * 1.2), Math.round(50 + Math.sin(a) * r * 0.8), 1, 1);
    }
  } else {
    // quelques braises qui s'échappent de l'obscurité
    for (let i = 0; i < 4; i++) {
      const t = (roomStep + i * 7) % 26;
      if (t < 18) {
        g.fillStyle = t < 9 ? hi : col;
        g.fillRect(140 + ((i * 7) % 20) + (t % 4 < 2 ? 0 : 1), 70 - t * 2, 1, 1);
      }
    }
  }
}
const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((v) => v / 16));

function drawDoor(g) {
  doorLight(g);
  // bord de l'arche éclairé par la lumière du mode
  if (campMode !== 'story') {
    g.fillStyle = DOOR_LIGHT[campMode][1];
    g.globalAlpha = roomStep % 4 < 2 ? 0.8 : 0.55;
    g.fillRect(134, 26, 1, 48);
    g.fillRect(165, 26, 1, 48);
    g.fillRect(137, 22, 26, 1);
    g.globalAlpha = 1;
  }
  const now = performance.now(), x0 = 136, x1 = 164, y0 = 30, y1 = 73, cx = 150, cy = 50;
  if (campMode === 'tower') {
    g.fillStyle = '#16203a';
    g.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let i = 0; i < 8; i++) {
      const y = y1 - 4 - i * 5, x = x0 + 3 + (i % 2 ? 8 : 0);
      g.fillStyle = '#4a6ab8';
      g.fillRect(x, y, 14, 2);
      g.fillStyle = '#a8c8ff';
      g.fillRect(x, y, 14, 1);
    }
    for (let i = 0; i < 6; i++) {
      const t = (roomStep + i * 4) % 22;
      g.fillStyle = t < 12 ? '#c8e0ff' : '#6a8ad8';
      g.fillRect(x0 + 4 + ((i * 7) % 22), y1 - 2 - t * 2, 1, 1);
    }
  } else if (campMode === 'endless') {
    g.fillStyle = '#1a0e24';
    g.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let r = 3; r <= 14; r += 3)
      for (let j = 0; j < 12; j++) {
        const a = (j / 12) * Math.PI * 2 + roomStep * (0.5 - r * 0.02) + r;
        const px = Math.round(cx + Math.cos(a) * r), py = Math.round(cy + Math.sin(a) * r * 1.3);
        if (px <= x0 || px >= x1 || py <= y0 || py >= y1) continue;
        g.fillStyle = r < 7 ? '#ffffff' : r < 11 ? '#c89af0' : '#7a3cc8';
        g.fillRect(px, py, 1, 1);
      }
  }
  if (now - doorFlash < 200) {
    g.globalAlpha = 0.7;
    g.fillStyle = '#ffffff';
    g.fillRect(x0, y0 - 6, x1 - x0, y1 - y0 + 6);
    g.globalAlpha = 1;
  }
}

// Toucher la porte : combat de l'histoire (dans les autres modes, on passe par les pancartes).
$('#camp-canvas').addEventListener('click', (e) => {
  if (screen !== 'camp' || moving) return;
  const [x, y] = toArt($('#camp-canvas'), CAMP_W, e);
  if (x >= GATE.x0 && x <= GATE.x1 && y >= GATE.y0 && y <= GATE.y1) {
    if (campMode === 'story') enterDoor();
  } else if (x >= 68 && x <= 104 && y >= 30 && y <= 58) goRoom(-1); // le panneau
});

// Glisser verticalement sur la porte change de mode, sans changer de pièce.
(() => {
  let start = null;
  $('#camp-canvas').addEventListener('pointerdown', (e) => {
    const [x, y] = toArt($('#camp-canvas'), CAMP_W, e);
    if (x < GATE.x0 - 6 || x > GATE.x1 + 6 || y < GATE.y0 || y > GATE.y1 + 20) return;
    e.stopPropagation();
    start = { x: e.clientX, y: e.clientY };
    $('#c-modes').classList.add('swiping');
  });
  addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    start = null;
    $('#c-modes').classList.remove('swiping');
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx) * 1.3) {
      swallowClick = true;
      setTimeout(() => (swallowClick = false), 350);
      switchCampMode(dy < 0 ? 1 : -1);
    }
  }, true);
})();

// Entrer : zoom vers la porte, son, fondu au noir, combat (étape suivante ou combat préparé).
async function enterDoor(st = null) {
  if (moving) return;
  moving = true;
  const c = $('#camp-canvas'), [ox, oy] = toScreen(c, CAMP_W, 150, 48);
  sfx('zoom');
  haptic(30);
  c.style.transformOrigin = `${ox - c.offsetLeft}px ${oy - c.offsetTop}px`;
  $('#door-sign').classList.add('hidden');
  $('#c-menu').classList.add('hidden');
  const f = $('#fader');
  f.classList.add('on');
  const steps = [[1.2, 0], [1.5, 0.1], [1.9, 0.3], [2.4, 0.55], [3, 0.8], [3.8, 1]];
  for (const [z, o] of steps) {
    c.style.transform = `scale(${z})`;
    f.style.opacity = o;
    await wait(75);
  }
  c.style.transform = '';
  $('#door-sign').classList.remove('hidden');
  moving = false;
  startBattle(st || state.best + 1);
  await wait(120);
  await fade(false);
}

$('#go-replay').onclick = () => {
  const box = el('div');
  box.appendChild(el('div', 'big-title', 'Rejouer'));
  const list = el('div', 'stage-list');
  for (let n = state.best; n >= 1; n--) {
    const st = stage(n);
    const b = el('button', 'btn' + (st.boss ? ' red' : ''), `${n}${st.boss ? ' boss' : ''}`);
    b.onclick = async () => {
      closeModal(false);
      await fade(true);
      startBattle(n);
      await fade(false);
    };
    list.appendChild(b);
  }
  box.appendChild(list);
  modal(box, [['Fermer', closeModal]]);
};
$('#btn-daily').onclick = () => {
  state.lastDaily = today();
  state.gold += DAILY_GOLD;
  save();
  sfx('coin');
  modal(el('div', '', `<div class="big-title">Coffre du jour</div><p style="text-align:center">+${DAILY_GOLD} or</p>`), [['Merci !', closeModal]]);
};
$('#btn-options').onclick = () => {
  const box = el('div');
  box.appendChild(el('div', 'big-title', 'Options'));
  const row = el('div', 'row');
  const tog = (label, key, apply) => {
    const b = el('button', 'btn', `${label} : ${state[key] ? 'oui' : 'non'}`);
    b.onclick = () => {
      state[key] = !state[key];
      apply(state[key]);
      save();
      b.textContent = `${label} : ${state[key] ? 'oui' : 'non'}`;
    };
    return b;
  };
  row.append(tog('Sons', 'sound', setSound), tog('Vibration', 'haptics', setHaptics));
  box.appendChild(row);
  box.appendChild(el('p', 'muted', 'La vibration ne marche pas sur iPhone depuis iOS 26.5 (bloquée par Apple pour les sites web).'));
  modal(box, [['Effacer la partie', () => ask('Tout effacer et recommencer ?', () => { resetSave(); show('camp'); }), 'red'], ['Fermer', closeModal]]);
};

// ---------------------------------------------------------------- cartes

// Face de carte : une petite pancarte en hauteur (bois doré pour une Légendaire), le héros dans
// une fenêtre sur la salle d'armes, son nom sur un ruban, ses étoiles et son rang.
function card(id, opts = {}) {
  const h = HEROES[id], own = state.owned[id], k = opts.k || 2;
  const c = el('div', `card face r-${h.rarity}`);
  const win = el('div', 'c-win');
  win.appendChild(portrait(id, own ? own.rank : 1, k, 28, 30, !own));
  c.appendChild(win);
  c.appendChild(el('div', 'c-name', own ? h.name : '???'));
  c.appendChild(starsRow(h.rarity, k > 2 ? 2 : 1));
  c.appendChild(el('div', 'rank', `${k > 2 ? h.cls + ' · ' : ''}Rang ${own ? own.rank : 1}`));
  if (opts.badge) c.appendChild(el('div', 'badge ' + (opts.badgeCls || ''), opts.badge));
  return c;
}
// Face de carte d'une tenue : le héros qui la porte, le nom de la tenue sur le ruban.
function skinCard(skinId, opts = {}) {
  const sk = SKINS.find((x) => x.id === skinId), k = opts.k || 2;
  const c = el('div', `card face r-${sk.rarity}`);
  const win = el('div', 'c-win');
  win.appendChild(portrait(sk.hero, 1, k, 28, 30, false, look(sk.hero, 1, skinId)));
  c.appendChild(win);
  c.appendChild(el('div', 'c-name', sk.name));
  c.appendChild(starsRow(sk.rarity, k > 2 ? 2 : 1));
  c.appendChild(el('div', 'rank', `Tenue · ${HEROES[sk.hero].name}`));
  if (opts.badge) c.appendChild(el('div', 'badge', opts.badge));
  return c;
}
// Monter de rang : il faut les éclats et être au niveau maximum du rang.
const atCap = (o) => o.lvl >= LEVEL.cap(o.rank);
const canUpgrade = (id) => {
  const o = state.owned[id];
  return o && o.rank < MAX_RANK && atCap(o) && o.frags >= UPGRADE[o.rank - 1].frags;
};

// Donne de l'XP aux héros ; renvoie ceux qui ont pris des niveaux : [{ id, lvl }].
function giveXp(ids, amount) {
  const ups = [];
  for (const id of ids) {
    const o = state.owned[id];
    if (!o) continue;
    const cap = LEVEL.cap(o.rank), from = o.lvl;
    o.xp += amount;
    while (o.lvl < cap && o.xp >= LEVEL.need(o.lvl)) {
      o.xp -= LEVEL.need(o.lvl);
      o.lvl++;
    }
    if (o.lvl >= cap) o.xp = 0; // au maximum du rang : l'XP ne s'accumule plus
    if (o.lvl > from) ups.push({ id, lvl: o.lvl });
  }
  return ups;
}

// ---------------------------------------------------------------- équipe

// La salle d'armes : les trois socles numérotés de l'équipe tournent comme un carrousel ;
// le héros choisi est devant, au milieu, éclairé, les deux autres reculent dans la pénombre.
// La collection est en colonne à gauche, la fiche du héros choisi à droite.
// On glisse un héros de la colonne sur un socle pour l'ajouter (ou remplacer celui qui y est),
// d'un socle à l'autre pour échanger les places, d'un socle vers la colonne pour le retirer.
let selected = null;
let teamSlots = []; // socles : { x, y (pieds) en pixels d'art, sx, sy à l'écran, depth : 1 devant, -0,5 au fond }
let teamDrag = null; // glisser en cours : { id, from (socle ou -1), over (socle, 'roster' ou null), ghost }
const slotFlash = [0, 0, 0, 0]; // les trois socles, puis l'invité du vestiaire
// carrousel : le socle i est à l'angle carR + 120·i ; devant quand l'angle vaut 90°
let carR = 90, carT = 90, carRaf = 0;
let carStage = { cx: 150, rx: 18 }; // centre et demi-largeur du carrousel (pixels d'art), posés par layoutTeam
const CAR_CY = 92, CAR_RY = 10, CAR_STEP = 8; // centre et profondeur du carrousel, degrés par image

function renderTeam() {
  if (!selected || !HEROES[selected]) selected = state.team[0];
  const roster = $('#t-roster');
  roster.innerHTML = '';
  HERO_IDS.forEach((id, i) => {
    const own = state.owned[id], pos = state.team.indexOf(id);
    const b = el('div', 'r-sign' + (id === selected && pos < 0 ? ' hot' : '') + (own ? '' : ' locked') + (pos >= 0 ? ' in-team' : ''));
    b.appendChild(own ? lookCanvas(id, 2) : lockedCanvas(id, 1, 2));
    // héros pas encore obtenu : avis de recherche ; déjà dans l'équipe : on le voit, mais il se
    // touche et se déplace sur son socle, pas ici
    const nm = el('div', 'r-name', own ? HEROES[id].name : '<span class="wanted">Recherché</span>???');
    if (pos >= 0) nm.appendChild(el('small', 'on-slot', `sur le socle ${pos + 1}`));
    else nm.appendChild(starsRow(HEROES[id].rarity));
    b.appendChild(nm);
    if (pos >= 0) b.appendChild(el('div', 'badge team', String(pos + 1)));
    if (canUpgrade(id)) b.appendChild(el('div', 'badge up', 'UP'));
    b._seed = i + 11;
    if (pos >= 0) b.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      pointToSlot(b, id, pos);
    });
    else dragSource(b, id, -1);
    roster.appendChild(b);
  });
  renderDetail(selected);
  requestAnimationFrame(layoutTeam);
}

// Toucher un héros : il devient le héros choisi ; s'il est dans l'équipe, le carrousel tourne
// pour l'amener devant.
// Toucher dans la colonne un héros déjà dans l'équipe : la plaque refuse, et son socle s'allume
// pour montrer où le prendre.
function pointToSlot(b, id, pos) {
  if (teamDrag || teamMode) return;
  sfx('denied');
  haptic(10);
  b.animate(Array.from({ length: 5 }, (_, k) => ({ translate: k === 4 ? '0 0' : `${k % 2 ? 3 : -3}px 0` })), { duration: 200, easing: 'steps(5, end)' });
  const sl = teamSlots[pos];
  if (sl) {
    slotFlash[pos] = performance.now() + 500;
    sparks(sl.sx, sl.sy - 30, '#ffd86a', 14, 1.2);
    teamAnimFor(520);
  }
  const hint = $('#t-hint');
  hint.textContent = `${HEROES[id].name} est sur le socle ${pos + 1} : glisse-le depuis là`;
  clearTimeout(hint._t);
  hint._t = setTimeout(() => (hint.textContent = 'Glisse un héros sur un socle'), 1800);
}

function selectHero(id, from) {
  const same = id === selected;
  selected = id;
  const rc = from.getBoundingClientRect();
  sparks(rc.left + rc.width / 2, rc.top + rc.height / 2, '#ffd86a', 8, 0.9);
  sfx('hover');
  haptic(5);
  if (!same) renderTeam();
}

// Socle i : position sur l'ellipse du carrousel.
function slotAt(i) {
  const c = $('#team-canvas'), k = c.clientWidth / CAMP_W, a = ((carR + i * 120) * Math.PI) / 180;
  const x = carStage.cx + carStage.rx * Math.cos(a), y = CAR_CY + CAR_RY * Math.sin(a);
  return { x, y, depth: Math.sin(a), sx: c.offsetLeft + x * k, sy: c.offsetTop + y * k };
}

// Recalcule les socles et déplace leurs zones (numéro, nom, cible du glisser).
function placeSlots() {
  teamSlots = [0, 1, 2].map(slotAt);
  $$('#t-slots .t-slot').forEach((z) => {
    const sl = teamSlots[z._slot], front = sl.depth > 0.9;
    z.style.left = Math.round(sl.sx) + 'px';
    z.style.top = Math.round(sl.sy) + 'px';
    z.style.zIndex = front ? 2 : 1;
    z.classList.toggle('back', !front);
  });
}

// Fait tourner le carrousel (par le plus court chemin) pour amener le socle i devant.
function rotateTo(i) {
  const d = ((((90 - i * 120 - carR) % 360) + 540) % 360) - 180;
  carT = carR + d;
  if (Math.abs(d) < 1) return heroSigns();
  $('#t-menu').classList.add('hidden');
  sfx('focus');
  cancelAnimationFrame(carRaf);
  const tick = () => {
    const left = carT - carR;
    carR = Math.abs(left) <= CAR_STEP ? carT : carR + Math.sign(left) * CAR_STEP;
    placeSlots();
    drawRooms(false, 'team');
    if (carR !== carT) carRaf = requestAnimationFrame(tick);
    else {
      carR = carT = ((carT % 360) + 360) % 360;
      placeSlots();
      heroSigns();
    }
  };
  carRaf = requestAnimationFrame(tick);
}

// Les pancartes jaillissent du héros choisi, comme en combat : devant le carrousel s'il est dans
// l'équipe, sinon de sa plaque dans la colonne.
function heroSigns() {
  const id = selected, own = state.owned[id], m = $('#t-menu');
  if (!own || teamDrag || teamMode) return m.classList.add('hidden');
  const pos = state.team.indexOf(id), c = $('#team-canvas'), k = c.clientWidth / CAMP_W;
  let hx, hy;
  if (pos >= 0) [hx, hy] = [teamSlots[pos].sx + 12 * k, teamSlots[pos].sy - 12 * k];
  else {
    const r = [...$$('#t-roster .r-sign')][HERO_IDS.indexOf(id)].getBoundingClientRect();
    [hx, hy] = [r.right - 30, r.top + r.height / 2];
  }
  const cost = UPGRADE[own.rank - 1];
  layoutSigns(m, null, [
    own.rank < MAX_RANK
      ? { ico: 'speed', mg: '#ffd86a', label: 'Améliorer', sub: atCap(own) ? `éclats ${own.frags}/${cost.frags} · ${cost.gold} or` : `niveau ${own.lvl}/${LEVEL.cap(own.rank)} requis`, showSub: true, off: !canUpgrade(id) || state.gold < cost.gold, go: () => upgrade(id) }
      : { ico: 'speed', mg: '#ffd86a', label: 'Rang max', sub: `éclats : ${own.frags}`, showSub: true, off: true },
    { ico: 'skin', mg: '#ff8ad8', label: 'Skin', sub: 'vestiaire', showSub: true, go: () => enterSkins(id) },
  ], hx, hy, 90, 0.9);
}

// Fiche du héros sur une plaque de bois : nom, classe, rang, place dans l'équipe, stats, compétence, rangs.
function renderDetail(id) {
  const box = $('#t-info');
  box.innerHTML = '';
  const h = HEROES[id], own = state.owned[id], rank = own ? own.rank : 1, st = heroStats(id, rank, own ? own.lvl : 1), pos = state.team.indexOf(id);
  box.appendChild(el('div', 'd-name', own ? h.name : '???'));
  const l1 = el('div', 'd-line', `${h.cls} · <b>${RARITY[h.rarity].name}</b>`);
  l1.appendChild(starsRow(h.rarity));
  box.appendChild(l1);
  if (own) {
    const l2 = el('div', 'd-line', `Rang ${rank} · ${RANK_NAMES[rank - 1]}`);
    l2.appendChild(rankGems(rank));
    box.appendChild(l2);
    // niveau et XP (le rang fixe le niveau maximum)
    const cap = LEVEL.cap(rank), lv = el('div', 'stat lvl');
    lv.append(el('span', '', `Niv ${own.lvl}`), segBar(own.lvl >= cap ? 1 : own.xp / LEVEL.need(own.lvl), 'xp'), el('span', '', own.lvl >= cap ? 'MAX' : `/${cap}`));
    box.appendChild(lv);
  }
  box.appendChild(el('div', 'd-place' + (pos >= 0 ? ' on' : ''), !own ? 'À obtenir à l’autel d’invocation'
    : pos >= 0 ? `Dans l’équipe · socle ${pos + 1}` : 'Glisse-le sur un socle pour l’ajouter'));
  for (const [label, val, max, cls] of [['PV', st.hp, 600, 'hp'], ['ATQ', st.atk, 150, ''], ['DÉF', st.def, 50, ''], ['VIT', st.spd, 30, '']]) {
    const s = el('div', 'stat');
    s.append(el('span', '', label), segBar(val / max, cls), el('span', '', String(val)));
    box.appendChild(s);
  }
  box.appendChild(el('div', 'skill-line', `<b>${h.skill.name}</b> · recharge ${h.skill.cd} tours<br>${h.skill.desc}`));
  const ranks = el('div', 'ranks');
  for (let r = 1; r <= MAX_RANK; r++) {
    const rd = el('div');
    rd.appendChild(own && r <= rank ? heroCanvas(id, r, 1) : lockedCanvas(id, r, 1));
    rd.appendChild(el('span', '', `R${r}`));
    ranks.appendChild(rd);
  }
  box.appendChild(ranks);
}

// Place les trois socles entre la colonne et la fiche, leurs zones de dépôt, et la pancarte Améliorer.
function layoutTeam() {
  if ($('#scr-team').classList.contains('hidden')) return;
  $$('#t-roster .r-sign').forEach((b) => {
    if (b.classList.contains('in-team')) {
      b.style.backgroundImage = signUrl(b.offsetWidth, b.offsetHeight, 'dark', b._seed);
      b.style.backgroundSize = `${Math.round(b.offsetWidth / U) * U}px ${Math.round(b.offsetHeight / U) * U}px`;
      return;
    }
    if (!b.classList.contains('locked')) return paintSign(b);
    b.style.backgroundImage = posterUrl(b.offsetWidth, b.offsetHeight, b._seed);
    b.style.backgroundSize = `${Math.round(b.offsetWidth / U) * U}px ${Math.round(b.offsetHeight / U) * U}px`;
  });
  const info = $('#t-info');
  paintSign(info);
  const c = $('#team-canvas');
  if (c.width !== CAMP_W) {
    c.width = CAMP_W;
    c.height = SH;
    fitCanvas(c, CAMP_W, SH, innerWidth, innerHeight, true);
  }
  const k = c.clientWidth / CAMP_W, left = $('#t-roster').getBoundingClientRect().right + 12, ir = info.getBoundingClientRect(), right = ir.left - 12;
  // carrousel un peu à gauche : à droite du héros de devant, il faut la place pour ses pancartes (≈ 350 px)
  const cxs = Math.max(left + 110, Math.min((left + right) / 2, right - 360));
  carStage = { cx: (cxs - c.offsetLeft) / k, rx: Math.min(70, (cxs - left - 50) / 0.87) / k };
  const box = $('#t-slots');
  box.innerHTML = '';
  [0, 1, 2].forEach((i) => {
    const id = state.team[i];
    const z = el('div', 't-slot' + (id ? '' : ' empty') + (id && id === selected ? ' sel' : ''));
    z.style.height = Math.round(24 * k) + 'px';
    z._slot = i;
    z.appendChild(el('div', 'num', String(i + 1)));
    z.appendChild(el('div', 'cap', id ? HEROES[id].name : 'Vide'));
    if (id) dragSource(z, id, i);
    box.appendChild(z);
  });
  placeSlots();
  const hint = $('#t-hint');
  hint.style.left = Math.round(cxs) + 'px';
  hint.style.top = Math.round(c.offsetTop + (CAR_CY - CAR_RY - 30) * k) + 'px';
  if (teamMode) paintSign($('#t-skins'));
  // le héros choisi vient devant (ou ses pancartes sortent de sa plaque s'il n'est pas dans l'équipe)
  const pos = state.team.indexOf(selected);
  if (pos >= 0) rotateTo(pos);
  else heroSigns();
  drawRooms(false, 'team');
}

// ---- vestiaire (skins)

// Les tenues (SKINS, js/sprites.js) s'obtiennent à l'autel des tenues ; la tenue d'origine est
// toujours en tête de liste. skinPreview : la tenue essayée (null : tenue d'origine).
let teamMode = null, skinT0 = 0, skinOut = false, skinPreview = null;
// Héros hors de l'équipe qui passe au vestiaire : toute l'équipe sort, et lui tombe du ciel au centre.
let skinGuest = null, skinGuestLanded = false;
let skinBoom = [false, false, false], skinLanded = false;
const SKIN_IN = 800, SKIN_BACK = 1000; // durées de l'ouverture et du retour

const skinList = (id) => [{ id: null, name: 'Tenue d’origine' }, ...SKINS.filter((sk) => sk.hero === id)];

// x (pixels d'art) où se place le héros pendant le vestiaire : au milieu entre la colonne des
// héros et la plaque du vestiaire.
function skinCenterX() {
  const c = $('#team-canvas'), k = c.clientWidth / CAMP_W;
  const left = $('#t-roster').getBoundingClientRect().right, right = $('#t-info').getBoundingClientRect().left;
  return ((left + right) / 2 - c.offsetLeft) / k;
}

// État de l'animation du vestiaire à l'instant now :
// hero : 0 en place → 1 (ceux du fond sortis, celui de devant au centre) ;
// padGone[i] : le socle i a volé en éclats ; padLift : hauteur des socles qui retombent au retour.
function skinState(now) {
  const st = { on: !!teamMode, back: skinOut, hero: 0, q: 0, padGone: [false, false, false], padLift: 0 };
  if (!teamMode) return st;
  if (!skinOut) {
    const q = Math.min(1, (now - skinT0) / SKIN_IN);
    st.hero = st.q = q;
    teamSlots.forEach((sl, i) => {
      // le socle éclate quand son héros le quitte (vite pour celui de devant, au départ en courant pour
      // les autres ; avec un invité, celui de devant part en courant lui aussi)
      const at = sl.depth > 0.9 && !skinGuest ? 0.12 : 0.4;
      if (q < at) return;
      st.padGone[i] = true;
      if (!skinBoom[i]) {
        skinBoom[i] = true;
        padBurst(sl);
      }
    });
  } else {
    // d'abord les socles retombent du ciel, puis les héros reviennent
    const q = Math.min(1, (now - skinT0) / SKIN_BACK), d = Math.min(1, q / 0.35);
    st.q = q;
    st.padLift = Math.round((1 - Math.floor(d * 6) / 6) * 120); // chute par paliers
    if (d >= 1 && !skinLanded) {
      skinLanded = true;
      teamSlots.forEach((sl) => fx(Array.from({ length: 6 }, () => ({ x: sl.sx + rr(-40, 40), y: sl.sy + 6, vx: rr(-1, 1), vy: rr(-1, -0.2), g: 0.03, life: rr(16, 26) | 0, c: Math.random() < 0.5 ? '#8a7068' : '#b8a080', s: 2 }))));
      sfx('wood');
      haptic(15);
    }
    st.hero = 1 - Math.max(0, Math.min(1, (q - 0.35) / 0.65));
  }
  return st;
}

// Un socle vole en éclats : morceaux de pierre et poussière, comme une pancarte qu'on choisit.
function padBurst(sl) {
  const STONES = ['#8a8088', '#6a6068', '#4a4048', '#a8a0a8'];
  fx(Array.from({ length: 18 }, () => ({ x: sl.sx + rr(-45, 45), y: sl.sy + rr(-6, 8), vx: rr(-2.5, 2.5), vy: rr(-4, -1), g: 0.28, life: rr(22, 36) | 0, c: STONES[(Math.random() * 4) | 0], s: Math.random() < 0.5 ? 3 : 2 })));
  sparks(sl.sx, sl.sy, '#ffd86a', 8, 1.2);
  sfx('wood');
  haptic(10);
}

// Redessine la salle à chaque image pendant ms (les trajets du vestiaire).
function teamAnimFor(ms) {
  const end = performance.now() + ms;
  const tick = () => {
    drawRooms(false, 'team');
    if (performance.now() < end) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Ouvre le vestiaire : les autres sortent, les socles éclatent, le héros va au centre,
// la fiche tombe en copeaux, la plaque des skins tombe du ciel.
function enterSkins(id) {
  teamMode = 'skins';
  skinOut = false;
  skinT0 = performance.now();
  skinPreview = state.wear[id] || null;
  skinGuest = state.team.includes(id) ? null : id;
  skinGuestLanded = false;
  skinBoom = [false, false, false];
  skinLanded = false;
  $('#scr-team').classList.add('skins');
  $('#t-menu').classList.add('hidden');
  sfx('focus');
  teamAnimFor(SKIN_IN + 100);
  const info = $('#t-info'), r = info.getBoundingClientRect();
  const WOODS = ['#8a5a32', '#b8814a', '#5a3820', '#d49a4e'];
  fx(Array.from({ length: 22 }, () => ({ x: rr(r.left, r.right), y: rr(r.top, r.bottom), vx: rr(-2, 2), vy: rr(-3, -0.5), g: 0.25, life: rr(24, 40) | 0, c: WOODS[(Math.random() * 4) | 0], s: Math.random() < 0.5 ? 3 : 2 })));
  sparks(r.left + r.width / 2, r.top + 20, '#ff8ad8', 16, 1.4);
  info.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '0 -10px', rotate: '-2deg', offset: 0.2 }, { translate: '0 120vh', rotate: '9deg' }], { duration: 520, easing: 'steps(9, end)', fill: 'forwards' });
  sfx('wood');
  setTimeout(() => teamMode === 'skins' && !skinOut && dropSkins(id), 430);
}

function dropSkins(id) {
  const box = $('#t-skins');
  renderSkins(id);
  box.classList.remove('hidden');
  paintSign(box);
  box.animate([{ translate: '0 -130vh' }, { translate: '0 10px', offset: 0.8 }, { translate: '0 -3px', offset: 0.9 }, { translate: '0 0' }], { duration: 460, easing: 'steps(8, end)', fill: 'backwards' });
  setTimeout(() => {
    const r = box.getBoundingClientRect();
    fx(Array.from({ length: 14 }, () => ({ x: rr(r.left, r.right), y: r.bottom, vx: rr(-1.2, 1.2), vy: rr(-1.2, -0.2), g: 0.03, life: rr(18, 30) | 0, c: Math.random() < 0.5 ? '#8a7068' : '#b8a080', s: 2 })));
    sfx('wood');
    haptic(20);
    $('#scr-team').animate(Array.from({ length: 5 }, (_, i) => ({ translate: i === 4 ? '0 0' : `0 ${i % 2 ? -2 : 2}px` })), { duration: 160, easing: 'steps(5, end)' });
  }, 380);
}

// La plaque des skins : une liste qu'on fait défiler de haut en bas ; toucher une tenue obtenue
// l'essaie sur le héros, au centre de la salle ; « Porter » la garde (partout, à tous les rangs).
function renderSkins(id) {
  const box = $('#t-skins'), own = state.owned[id], worn = state.wear[id] || null;
  box.innerHTML = '';
  box.appendChild(el('div', 'd-name', 'Vestiaire'));
  box.appendChild(el('div', 'd-line', `${HEROES[id].name} · touche une tenue pour l’essayer`));
  const ul = el('div', 'sk-list');
  skinList(id).forEach((sk) => {
    const has = !sk.id || state.skins[sk.id], lk = look(id, own.rank, sk.id);
    const row = el('button', 'sk-row' + (sk.id === skinPreview ? ' on' : '') + (has ? '' : ' soon'));
    row.appendChild(has ? spriteCanvas(lk.key, lk.make, 2) : spriteCanvas(lk.key + '-lock', () => lk.make().silhouette(LOCKED), 2));
    const txt = el('div', 'sk-txt', `<b>${has ? sk.name : '???'}</b><small>${sk.id === worn ? 'Portée' : sk.id === skinPreview ? 'Essayée' : has ? 'Disponible' : 'À l’autel des tenues'}</small>`);
    if (sk.rarity) txt.appendChild(starsRow(sk.rarity));
    row.appendChild(txt);
    row.onclick = () => {
      if (!has) return sfx('denied');
      if (sk.id === skinPreview) return;
      skinPreview = sk.id;
      const c = $('#team-canvas'), k = c.clientWidth / CAMP_W, f = teamSlots.find((sl) => sl.depth > 0.9);
      sparks(c.offsetLeft + skinCenterX() * k, f ? f.sy - 40 : innerHeight / 2, '#ff8ad8', 20, 1.6);
      slotFlash[skinGuest ? 3 : teamSlots.indexOf(f)] = performance.now() + 240;
      teamAnimFor(300);
      sfx('select');
      haptic(10);
      const top = ul.scrollTop;
      renderSkins(id);
      paintSign(box);
      $('#t-skins .sk-list').scrollTop = top;
    };
    ul.appendChild(row);
  });
  // le doigt fait défiler la liste sans changer de pièce
  ul.addEventListener('pointerdown', (e) => e.stopPropagation());
  ul.addEventListener('pointerup', (e) => e.stopPropagation());
  box.appendChild(ul);
  const row = el('div', 'sk-actions');
  if (skinPreview !== worn) {
    const wear = el('button', 'btn gold', 'Porter');
    wear.onclick = () => {
      if (skinPreview) state.wear[id] = skinPreview;
      else delete state.wear[id];
      save();
      const c = $('#team-canvas'), k = c.clientWidth / CAMP_W, f = teamSlots.find((sl) => sl.depth > 0.9);
      sparks(c.offsetLeft + skinCenterX() * k, f ? f.sy - 40 : innerHeight / 2, '#fbe08a', 30, 2);
      sfx('levelUp');
      haptic(20);
      const top = $('#t-skins .sk-list').scrollTop;
      renderTeam();
      renderSkins(id);
      paintSign(box);
      $('#t-skins .sk-list').scrollTop = top;
    };
    row.appendChild(wear);
  }
  const back = el('button', 'btn', 'Retour');
  back.onclick = exitSkins;
  row.appendChild(back);
  box.appendChild(row);
}

// Referme le vestiaire : la plaque tombe, la fiche revient du ciel, les socles retombent à leur
// place, puis les héros reviennent.
function exitSkins() {
  if (teamMode !== 'skins' || skinOut) return;
  skinOut = true;
  skinT0 = performance.now();
  skinLanded = false;
  const box = $('#t-skins'), info = $('#t-info');
  box.animate([{ translate: '0 0' }, { translate: '0 120vh', rotate: '-8deg' }], { duration: 420, easing: 'steps(7, end)', fill: 'forwards' });
  sfx('wood');
  setTimeout(() => {
    box.getAnimations().forEach((a) => a.cancel());
    box.classList.add('hidden');
    info.getAnimations().forEach((a) => a.cancel());
    info.animate([{ translate: '0 -130vh' }, { translate: '0 8px', offset: 0.8 }, { translate: '0 0' }], { duration: 420, easing: 'steps(7, end)' });
    sfx('wood');
  }, 380);
  teamAnimFor(SKIN_BACK + 100);
  setTimeout(() => {
    teamMode = null;
    skinOut = false;
    skinPreview = null;
    skinGuest = null;
    $('#scr-team').classList.remove('skins');
    heroSigns();
  }, SKIN_BACK + 40);
}

// Sortie immédiate (on quitte la pièce).
function resetSkins() {
  if (!teamMode) return;
  teamMode = null;
  skinOut = false;
  skinPreview = null;
  skinGuest = null;
  const box = $('#t-skins');
  box.getAnimations().forEach((a) => a.cancel());
  box.classList.add('hidden');
  $('#t-info').getAnimations().forEach((a) => a.cancel());
  $('#scr-team').classList.remove('skins');
}

// ---- glisser-déposer

// Un élément qu'on peut glisser (plaque de la colonne ou héros sur un socle) ; un simple toucher le sélectionne.
function dragSource(elm, id, slot) {
  elm.addEventListener('pointerdown', (e) => {
    e.stopPropagation(); // ne pas changer de pièce en glissant
    unlock();
    if (teamDrag || teamMode) return;
    const st = { x: e.clientX, y: e.clientY, moved: false };
    elm.setPointerCapture(e.pointerId);
    const move = (ev) => {
      if (!st.moved && Math.hypot(ev.clientX - st.x, ev.clientY - st.y) > 8) {
        if (!state.owned[id]) return;
        st.moved = true;
        beginDrag(id, slot);
      }
      if (st.moved) dragMove(ev);
    };
    const up = (ev) => {
      ev.stopPropagation();
      elm.removeEventListener('pointermove', move);
      elm.removeEventListener('pointerup', up);
      elm.removeEventListener('pointercancel', up);
      if (st.moved) dragEnd(ev, ev.type === 'pointercancel');
      else selectHero(id, elm);
    };
    elm.addEventListener('pointermove', move);
    elm.addEventListener('pointerup', up);
    elm.addEventListener('pointercancel', up);
  });
}

function beginDrag(id, from) {
  const own = state.owned[id], g = el('div', 't-ghost');
  g.appendChild(lookCanvas(id, 3));
  document.body.appendChild(g);
  teamDrag = { id, from, over: null, ghost: g, last: null };
  // ses pancartes ne servent à rien pendant qu'on le déplace : elles tombent
  const m = $('#t-menu');
  if (!m.classList.contains('hidden')) {
    m.querySelectorAll('.act').forEach((a, i) => a.animate([{ opacity: 1 }, { translate: '0 calc(-50% + 30px)', rotate: i % 2 ? '8deg' : '-8deg', opacity: 0 }], { duration: 200, easing: 'steps(4, end)', fill: 'forwards' }));
    setTimeout(() => teamDrag && m.classList.add('hidden'), 200);
  }
  $('#t-slots').classList.add('dragging');
  $('#t-roster').classList.toggle('drop-out', from >= 0);
  sfx('hover');
  haptic(8);
}

function dragMove(e) {
  const d = teamDrag;
  if (!d) return;
  d.ghost.style.left = e.clientX + 'px';
  d.ghost.style.top = e.clientY + 'px';
  const hit = document.elementFromPoint(e.clientX, e.clientY);
  const z = hit?.closest('.t-slot');
  const over = z ? z._slot : hit?.closest('#t-roster') && d.from >= 0 ? 'roster' : null;
  if (over !== d.over) {
    d.over = over;
    $$('#t-slots .t-slot').forEach((s) => s.classList.toggle('hot', s._slot === over));
    $('#t-roster').classList.toggle('hot', over === 'roster');
    if (over !== null) {
      sfx('hover');
      haptic(5);
    }
  }
  if (!d.last || Math.hypot(e.clientX - d.last[0], e.clientY - d.last[1]) > 7) {
    d.last = [e.clientX, e.clientY];
    fx([0, 1].map(() => ({ x: e.clientX + rr(-6, 6), y: e.clientY + rr(-4, 8), vx: rr(-0.5, 0.5), vy: rr(-1, -0.2), g: 0.02, life: rr(16, 28) | 0, c: Math.random() < 0.35 ? '#ffffff' : over === 'roster' ? '#ff6a6a' : '#ffd86a', s: 1 })));
  }
}

function dragEnd(e, cancel) {
  const d = teamDrag;
  if (!d) return;
  teamDrag = null;
  $('#t-slots').classList.remove('dragging');
  $('#t-roster').classList.remove('drop-out', 'hot');
  const team = state.team, j = team.indexOf(d.id);
  let landed = -1, removed = false;
  if (!cancel && typeof d.over === 'number') {
    const i = d.over;
    if (i < team.length) {
      if (j >= 0) [team[i], team[j]] = [team[j], team[i]]; // échange de places
      else team[i] = d.id; // remplace celui qui était sur le socle
    } else {
      if (j >= 0) team.splice(j, 1);
      team.push(d.id); // socle vide : il rejoint l'équipe à la suite
    }
    landed = team.indexOf(d.id);
  } else if (!cancel && d.over === 'roster' && j >= 0) {
    if (team.length > 1) {
      team.splice(j, 1);
      removed = true;
    } else {
      sfx('denied');
      $('#t-roster').animate(Array.from({ length: 5 }, (_, k) => ({ translate: k === 4 ? '0 0' : `${k % 2 ? 3 : -3}px 0` })), { duration: 200, easing: 'steps(5, end)' });
    }
  }
  if (landed >= 0 || removed) {
    save();
    selected = d.id;
    sfx('select');
    sfx('wood');
    haptic(15);
    if (landed >= 0) {
      slotFlash[landed] = performance.now() + 300;
      const sl = teamSlots[landed];
      sparks(sl.sx, sl.sy - 30, '#ffd86a', 22, 1.6);
      const WOODS = ['#8a6a4a', '#b8a080', '#efe4c8'];
      fx(Array.from({ length: 10 }, () => ({ x: sl.sx + rr(-20, 20), y: sl.sy, vx: rr(-1.5, 1.5), vy: rr(-1.6, -0.4), g: 0.08, life: rr(14, 22) | 0, c: WOODS[(Math.random() * 3) | 0], s: 2 })));
    } else {
      sparks(e.clientX, e.clientY, '#ff6a6a', 14, 1.2);
    }
    d.ghost.remove();
    renderTeam();
    return;
  }
  // rien de valable sous le doigt : le héros repart d'où il vient
  const back = d.from >= 0 ? [teamSlots[d.from].sx, teamSlots[d.from].sy - 40] : (() => {
    const r = [...$$('#t-roster .r-sign')][HERO_IDS.indexOf(d.id)].getBoundingClientRect();
    return [r.left + 26, r.top + r.height / 2];
  })();
  const g = d.ghost, x0 = parseFloat(g.style.left), y0 = parseFloat(g.style.top);
  g.animate([{ left: x0 + 'px', top: y0 + 'px' }, { left: back[0] + 'px', top: back[1] + 'px', opacity: 0.3 }], { duration: 200, easing: 'steps(5, end)', fill: 'forwards' });
  setTimeout(() => {
    g.remove();
    heroSigns(); // ses pancartes reviennent
  }, 210);
}

// Le carrousel dessiné dans la salle : la salle un peu assombrie, les socles du fond d'abord
// (héros dans la pénombre), puis celui de devant sous un rai de lumière ; pendant un glisser,
// les socles s'allument en pointillés. Au vestiaire, voir skinState.
function drawTeamLife(g) {
  if (!teamSlots.length) return;
  const now = performance.now(), dragging = !!teamDrag, sk = skinState(now);
  g.globalAlpha = 0.28;
  g.fillStyle = OUTLINE;
  g.fillRect(0, 0, CAMP_W, SH);
  g.globalAlpha = 1;
  const order = [0, 1, 2].sort((a, b) => teamSlots[a].depth - teamSlots[b].depth);
  for (const i of order) {
    const sl = teamSlots[i], front = sl.depth > 0.9, over = teamDrag?.over === i, id = state.team[i];
    const x = Math.round(sl.x), fy = Math.round(sl.y);
    // le héros de devant glisse vers le centre de la salle libre pendant le vestiaire
    // (avec un invité au vestiaire, celui de devant part en courant comme les autres)
    const runner = !front || !!skinGuest;
    const hx = !runner && sk.hero > 0 ? Math.round(x + (skinCenterX() - x) * sk.hero) : x;
    if ((front && id && id === selected && !dragging) || over) {
      g.fillStyle = over ? '#ffe9a0' : '#fff2c0';
      g.globalAlpha = over ? 0.14 : 0.11;
      for (let y = 0; y < fy; y += 4) {
        const w = 14 + Math.floor((y / fy) * 8) * 2;
        g.fillRect(hx - (w >> 1), y, w, 4);
      }
      g.globalAlpha = 0.16;
      for (const [dy, w] of [[-1, 26], [0, 34], [1, 26]]) g.fillRect(hx - (w >> 1), fy + dy, w, 1);
      g.globalAlpha = 1;
    }
    // socle : disque de pierre en perspective, liseré qui s'allume pendant un glisser ;
    // au vestiaire il a volé en éclats, puis il retombe du ciel au retour
    if (!sk.padGone[i]) {
      const py = fy - sk.padLift;
      for (let dy = -3; dy <= 4; dy++)
        for (let dx = -15; dx <= 15; dx++) {
          const dd = (dx / 15) ** 2 + (dy / 3.6) ** 2;
          if (dd > 1) continue;
          let c = dy > 1 ? '#4a4048' : dy < -1 ? '#8a8088' : '#6a6068';
          if (dd > 0.72) c = dragging && (roomStep + dx) % 2 ? (over ? '#ffffff' : '#ffd86a') : '#2a2228';
          g.fillStyle = c;
          g.fillRect(x + dx, py + dy, 1, 1);
        }
      g.fillStyle = OUTLINE;
      g.fillRect(x - 13, py + 5, 27, 1);
    }
    if (!id || (teamDrag && teamDrag.from === i)) {
      // socle vide : contour de héros en pointillés qui attend
      if (!id && !sk.on && roomStep % 4 < 3) {
        g.fillStyle = dragging ? '#ffd86a' : '#8a7068';
        for (let y = fy - 18; y < fy - 1; y += 3) { g.fillRect(x - 6, y, 1, 1); g.fillRect(x + 6, y, 1, 1); }
        for (let xx = x - 6; xx <= x + 6; xx += 3) g.fillRect(xx, fy - 19, 1, 1);
        g.fillRect(x - 1, fy - 11, 3, 1);
        g.fillRect(x, fy - 12, 1, 3);
      }
      continue;
    }
    const own = state.owned[id];
    let dx = 0, dy = 0, run = false;
    if (!runner) dx = hx - x;
    else if (sk.hero > 0) {
      // ceux du fond sautillent puis filent vers la gauche (ils reviennent en courant au retour)
      if (sk.hero >= 1) continue;
      run = sk.hero > 0.3;
      dx = run ? -Math.round(((sk.hero - 0.3) / 0.7) * 240) : 0;
      dy = -(Math.floor(now / 90) % 2) * 2;
    }
    const flip = run && !sk.back; // ils regardent là où ils courent
    // au vestiaire, celui de devant porte la tenue qu'on essaie
    const lk = look(id, own.rank, !runner && sk.on ? skinPreview : state.wear[id]);
    const key = lk.key + (flip ? '-f' : '');
    const bm = bitmap(key, () => (flip ? lk.make().flip() : lk.make()));
    const white = now < slotFlash[i] && roomStep % 2 === 0;
    const img = white ? bitmap(lk.key + '-w', () => lk.make().silhouette('#ffffff')) : bm;
    const bx = x - (bm.w >> 1) + dx, by = fy - bm.h - ((Math.floor(roomStep / 2) + i) % 2) + dy;
    g.globalAlpha = 0.4;
    g.fillStyle = OUTLINE;
    g.fillRect(x - 6 + dx, fy - 1, 12, 2);
    g.globalAlpha = 1;
    g.drawImage(img.canvas, bx, by);
    drawFx(g, bm, bx, by, roomStep);
    if (run && roomStep % 2) {
      g.fillStyle = '#b8a080';
      const tx = flip ? bx + bm.w : bx - 2;
      g.fillRect(tx, fy - 1, 2, 1);
      g.fillRect(flip ? tx + 2 : tx - 1, fy - 2, 1, 1);
    }
    // au fond : dans la pénombre
    if ((!front || (skinGuest && sk.hero > 0)) && !over) {
      g.globalAlpha = 0.45;
      g.drawImage(bitmap(key + '-d', () => (flip ? lk.make().flip() : lk.make()).silhouette(OUTLINE)).canvas, bx, by);
      g.globalAlpha = 1;
    }
  }
  if (sk.on && skinGuest) drawGuest(g, sk, now);
  // poussière dorée qui monte devant
  const f = teamSlots.find((sl) => sl.depth > 0.9);
  if (f && !dragging && !skinGuest) {
    const fx0 = sk.hero > 0 ? Math.round(f.x + (skinCenterX() - f.x) * sk.hero) : Math.round(f.x);
    for (let i = 0; i < 6; i++) {
      const t = (roomStep + i * 5) % 22, px = fx0 - 12 + ((i * 11) % 25) + (t % 4 < 2 ? 0 : 1);
      if (t < 18) {
        g.fillStyle = t < 10 ? '#fbe08a' : '#c89a4a';
        g.fillRect(px, Math.round(f.y) - 2 - t * 2, 1, 1);
      }
    }
  }
}

// L'invité du vestiaire : il tombe du ciel au centre de la salle (pendant que l'équipe sort),
// sous un rai de lumière, et repart vers le haut au retour.
function drawGuest(g, sk, now) {
  const id = skinGuest, own = state.owned[id], lk = look(id, own.rank, skinPreview);
  const x = Math.round(skinCenterX()), fy = CAR_CY + CAR_RY;
  const u = sk.back ? Math.min(1, sk.q / 0.3) : 1 - Math.max(0, Math.min(1, (sk.q - 0.3) / 0.45));
  const lift = Math.round((Math.floor(u * 6) / 6) * 130);
  if (!sk.back && lift === 0 && !skinGuestLanded) {
    skinGuestLanded = true;
    const c = $('#team-canvas'), k = c.clientWidth / CAMP_W;
    fx(Array.from({ length: 14 }, () => ({ x: c.offsetLeft + x * k + rr(-40, 40), y: c.offsetTop + fy * k, vx: rr(-1.5, 1.5), vy: rr(-1.4, -0.2), g: 0.04, life: rr(16, 28) | 0, c: Math.random() < 0.5 ? '#8a7068' : '#b8a080', s: 2 })));
    sparks(c.offsetLeft + x * k, c.offsetTop + (fy - 12) * k, '#ff8ad8', 14, 1.4);
    sfx('wood');
    haptic(20);
  }
  if (lift < 20) {
    g.fillStyle = '#fff2c0';
    g.globalAlpha = 0.11;
    for (let y = 0; y < fy; y += 4) {
      const w = 14 + Math.floor((y / fy) * 8) * 2;
      g.fillRect(x - (w >> 1), y, w, 4);
    }
    g.globalAlpha = 1;
  }
  const bm = bitmap(lk.key, lk.make), img = now < slotFlash[3] && roomStep % 2 === 0 ? bitmap(lk.key + '-w', () => lk.make().silhouette('#ffffff')) : bm;
  g.globalAlpha = lift < 30 ? 0.4 : 0.15;
  g.fillStyle = OUTLINE;
  g.fillRect(x - 6, fy - 1, 12, 2);
  g.globalAlpha = 1;
  const bx = x - (bm.w >> 1), by = fy - bm.h - lift - (lift === 0 ? Math.floor(roomStep / 2) % 2 : 0);
  g.drawImage(img.canvas, bx, by);
  drawFx(g, bm, bx, by, roomStep);
}

// Monter de rang : la magie dorée converge vers le héros, il s'illumine, la salle tremble.
async function upgrade(id) {
  const own = state.owned[id], cost = UPGRADE[own.rank - 1];
  if (!canUpgrade(id) || state.gold < cost.gold) return;
  const pos = state.team.indexOf(id);
  let cx, cy;
  if (pos >= 0) [cx, cy] = [teamSlots[pos].sx, teamSlots[pos].sy - 36];
  else {
    const r = [...$$('#t-roster .r-sign')][HERO_IDS.indexOf(id)].getBoundingClientRect();
    [cx, cy] = [r.left + 26, r.top + r.height / 2];
  }
  sfx('charge');
  for (let wave = 0; wave < 3; wave++) {
    fx(Array.from({ length: 12 }, () => {
      const a = rr(0, Math.PI * 2), d = rr(60, 110), life = rr(16, 22) | 0;
      return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: (-Math.cos(a) * d) / life, vy: (-Math.sin(a) * d) / life, g: 0, life, c: Math.random() < 0.3 ? '#ffffff' : '#fbe08a', s: Math.random() < 0.4 ? 2 : 1 };
    }));
    haptic(8);
    await wait(130);
  }
  own.frags -= cost.frags;
  state.gold -= cost.gold;
  own.rank++;
  save();
  sfx('levelUp');
  haptic(40);
  if (pos >= 0) slotFlash[pos] = performance.now() + 600;
  $('#scr-team').animate(Array.from({ length: 7 }, (_, j) => ({ translate: j === 6 ? '0 0' : `${Math.round(rr(-3, 3))}px ${Math.round(rr(-2, 2))}px` })), { duration: 300, easing: 'steps(7, end)' });
  sparks(cx, cy, '#fbe08a', 30, 2);
  refresh();
}

// ---------------------------------------------------------------- invocation

// Même langage que le combat : deux pancartes en arc autour du cristal (×1, ×10),
// une plaque de bois avec les taux et la pitié, puis un rituel avant la révélation.
// Deux autels : les héros (cristal violet) et les tenues (cristal vert, vêtements au sol) ;
// on passe de l'un à l'autre en faisant glisser la pierre.
let summoning = false, summonKind = 'hero';

function renderSummon(layout = true) {
  const info = $('#s-info');
  info.innerHTML = '';
  if (summonKind === 'skin') {
    const owned = SKINS.filter((sk) => state.skins[sk.id]).length;
    info.appendChild(el('div', 'h', 'Autel des tenues'));
    const line = el('div', 'lineup wrap');
    SKINS.forEach((sk) => {
      const lk = look(sk.hero, 1, sk.id);
      line.appendChild(state.skins[sk.id] ? spriteCanvas(lk.key, lk.make, 1) : spriteCanvas(lk.key + '-lock', () => lk.make().silhouette(LOCKED), 1));
    });
    info.appendChild(line);
    info.appendChild(el('div', '', `Tenues obtenues : <b>${owned}/${SKINS.length}</b>`));
    for (const [k, r] of Object.entries(RARITY)) {
      const row = el('div', 'rate');
      row.appendChild(starsRow(k));
      row.appendChild(el('b', '', `${r.name} · ${Math.round(r.rate * 100)} %`));
      info.appendChild(row);
    }
    info.appendChild(el('div', 'muted', `Une tenue garde son allure à tous les rangs. Doublon : +${SKIN_GACHA.dupGold} or.`));
  } else {
    info.appendChild(el('div', 'h', 'Autel d’invocation'));
    const line = el('div', 'lineup');
    HERO_IDS.forEach((id) => line.appendChild(state.owned[id] ? heroCanvas(id, 1, 2) : lockedCanvas(id, 1, 2)));
    info.appendChild(line);
    for (const [k, r] of Object.entries(RARITY)) {
      const row = el('div', 'rate');
      row.appendChild(starsRow(k));
      row.appendChild(el('b', '', `${r.name} · ${Math.round(r.rate * 100)} %`));
      info.appendChild(row);
    }
    const left = GACHA.pity - state.pity;
    info.appendChild(el('div', '', `Légendaire garantie dans <b>${left}</b>`));
    info.appendChild(segBar(state.pity / GACHA.pity, 'pity', 20));
    info.appendChild(el('div', 'muted', 'Un doublon donne un éclat pour monter de rang.'));
  }
  const dots = $('#s-hint .dots');
  dots.innerHTML = '<i></i><i></i>';
  dots.children[summonKind === 'skin' ? 1 : 0].className = 'on';
  // la mise en page dépend du canvas de la salle : on attend qu'elle soit affichée
  if (layout) requestAnimationFrame(() => layoutSummon());
}

// Les pancartes se rangent contre la plaque d'informations ; l'autel se centre entre le bord
// gauche et les pancartes, qui forment un arc autour de lui. enter : 'fan' (elles jaillissent du
// cristal) ou 'drop' (elles tombent du haut, quand on change d'autel).
const BIG_SIGN_HOT = 268; // largeur d'une grande pancarte visée (voir .signs.big)
function layoutSummon(enter = 'fan') {
  if (screen !== 'summon' && $('#scr-summon').classList.contains('hidden')) return;
  paintSign($('#s-info'));
  const c = $('#summon-canvas');
  if (c.width !== CAMP_W) {
    c.width = CAMP_W;
    c.height = SH;
    fitCanvas(c, CAMP_W, SH, innerWidth, innerHeight, true);
  }
  const k = c.clientWidth / CAMP_W, signsLeft = $('#s-info').getBoundingClientRect().left - 24 - BIG_SIGN_HOT;
  const cx = Math.max(100, signsLeft / 2 + 8), R = Math.max(110, signsLeft - cx);
  summonAltarX = (cx - c.offsetLeft) / k;
  const hint = $('#s-hint');
  hint.style.left = Math.round(cx) + 'px';
  hint.style.top = Math.round(Math.min(innerHeight - 52, c.offsetTop + (ALTAR_BASE - 4) * k)) + 'px';
  drawRooms(false, 'summon');
  const skin = summonKind === 'skin', G = skin ? SKIN_GACHA : GACHA;
  layoutSigns($('#s-menu'), null, [
    { ico: skin ? 'skin' : 'summon', mg: skin ? '#7af06a' : '#c08aff', label: skin ? 'Tenue ×1' : 'Invoquer ×1', sub: `${G.single} or`, showSub: true, off: state.gold < G.single, go: () => ritual(1) },
    { ico: skin ? 'skin' : 'summon', mg: '#ffd86a', label: skin ? 'Tenues ×10' : 'Invoquer ×10', sub: `${G.multi} or · 1 Rare min.`, showSub: true, off: state.gold < G.multi, go: () => ritual(10) },
  ], cx, (52 + innerHeight) / 2, R, 2 * Math.asin(Math.min(0.9, 58 / R)), 'big', enter); // centrées entre la barre du haut et le bas
}

// ---- changer d'autel en faisant glisser la pierre

// Glissement de la pierre en cours : { t0, dir (1 : la nouvelle arrive par la droite), from, to }.
let altarSwap = null;
const SWAP_MS = 520, SWAP_DIST = 230;

function swapAltar(dir) {
  const to = dir > 0 ? 'skin' : 'hero';
  if (summoning || altarSwap || to === summonKind) {
    // rien de l'autre côté : la pierre résiste un peu
    sfx('denied');
    altarSwap = { t0: performance.now(), dir, from: summonKind, to: summonKind, bump: true };
    animSummon(260);
    setTimeout(() => (altarSwap = null), 260);
    return;
  }
  altarSwap = { t0: performance.now(), dir, from: summonKind, to };
  sfx('wind');
  haptic(15);
  animSummon(SWAP_MS + 60);
  // toutes les pancartes et la plaque tombent dans une gerbe de copeaux
  const WOODS = ['#8a5a32', '#b8814a', '#5a3820', '#d49a4e'];
  const chips = (r) => fx(Array.from({ length: 16 }, () => ({ x: rr(r.left, r.right), y: rr(r.top, r.bottom), vx: rr(-2, 2), vy: rr(-3, -0.5), g: 0.25, life: rr(22, 36) | 0, c: WOODS[(Math.random() * 4) | 0], s: Math.random() < 0.5 ? 3 : 2 })));
  const fall = (elm, i, rot) => {
    chips(elm.getBoundingClientRect());
    elm.animate([{ translate: getComputedStyle(elm).translate, rotate: '0deg' }, { translate: '0 120vh', rotate: rot }], { duration: 480, delay: i * 70, easing: 'steps(8, end)', fill: 'forwards' });
  };
  [...$$('#s-menu .act')].forEach((a, i) => fall(a, i, i % 2 ? '10deg' : '-10deg'));
  fall($('#s-info'), 2, '7deg');
  sfx('wood');
  // puis les nouvelles tombent du haut à leur place
  setTimeout(() => {
    summonKind = to;
    altarSwap = null;
    const info = $('#s-info');
    info.getAnimations().forEach((a) => a.cancel());
    renderSummon(false);
    info.animate([{ translate: '0 -130vh' }, { translate: '0 10px', offset: 0.8 }, { translate: '0 0' }], { duration: 460, easing: 'steps(8, end)', fill: 'backwards' });
    layoutSummon('drop');
    setTimeout(() => { sfx('wood'); haptic(15); }, 420);
  }, SWAP_MS);
}

function animSummon(ms) {
  const end = performance.now() + ms;
  const tick = () => {
    drawRooms(false, 'summon');
    if (performance.now() < end) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Glisser horizontalement sur la pierre (et pas ailleurs) change d'autel, sans changer de pièce.
(() => {
  let start = null;
  $('#summon-canvas').addEventListener('pointerdown', (e) => {
    const c = $('#summon-canvas'), [ax, ay] = toScreen(c, CAMP_W, summonAltarX, ALTAR_Y), k = c.clientWidth / CAMP_W;
    if (Math.abs(e.clientX - ax) > 34 * k || e.clientY < ay - 34 * k || e.clientY > ay + 60 * k) return;
    e.stopPropagation();
    start = { x: e.clientX, y: e.clientY };
    $('#s-hint').classList.add('swiping'); // les points grossissent et blanchissent sous le doigt
  });
  addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    start = null;
    $('#s-hint').classList.remove('swiping');
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) swapAltar(dx < 0 ? 1 : -1);
  }, true);
})();

// Rituel : la salle s'assombrit, la magie converge vers le cristal qui charge, la salle tremble,
// éclair blanc, puis la révélation des cartes.
let altarCharge = false;
async function ritual(count) {
  const skin = summonKind === 'skin', G = skin ? SKIN_GACHA : GACHA, cost = count === 1 ? G.single : G.multi;
  if (summoning || state.gold < cost) return;
  summoning = true;
  const sec = $('#scr-summon'), veil = $('#s-veil'), c = $('#summon-canvas');
  const col = count > 1 ? '#fbe08a' : skin ? '#9af098' : '#c89af0';
  $('#s-menu').classList.add('hidden');
  const [cx, cy] = toScreen(c, CAMP_W, summonAltarX, ALTAR_Y);
  for (const o of [0.2, 0.4, 0.55]) {
    veil.style.opacity = o;
    await wait(60);
  }
  altarCharge = true;
  sfx('charge');
  for (let wave = 0; wave < 4; wave++) {
    fx(Array.from({ length: 14 }, () => {
      const a = rr(0, Math.PI * 2), d = rr(70, 130), life = rr(18, 26) | 0;
      return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: (-Math.cos(a) * d) / life, vy: (-Math.sin(a) * d) / life, g: 0, life, c: Math.random() < 0.3 ? '#ffffff' : col, s: Math.random() < 0.4 ? 2 : 1 };
    }));
    haptic(8);
    await wait(150);
  }
  sec.animate(Array.from({ length: 9 }, (_, i) => ({ translate: i === 8 ? '0 0' : `${Math.round(rr(-4, 4))}px ${Math.round(rr(-3, 3))}px` })), { duration: 420, easing: 'steps(9, end)' });
  sfx('zoom');
  haptic(40);
  await wait(300);
  veil.style.background = '#ffffff';
  veil.style.opacity = 0.85;
  sparks(cx, cy, col, 34, 2.2);
  await wait(80);
  veil.style.background = '';
  veil.style.opacity = 0;
  altarCharge = false;
  summoning = false;
  if (skin) pullSkins(count);
  else pull(count);
}

function rollRarity(forceRare) {
  if (state.pity >= GACHA.pity - 1) return 'L';
  const r = Math.random();
  if (r < RARITY.L.rate) return 'L';
  if (forceRare || r < RARITY.L.rate + RARITY.R.rate) return 'R';
  return 'C';
}

function pull(count) {
  const cost = count === 1 ? GACHA.single : GACHA.multi;
  if (state.gold < cost) return;
  state.gold -= cost;
  const results = [];
  for (let i = 0; i < count; i++) {
    const needRare = count === 10 && i === 9 && results.every((r) => r.rar === 'C');
    const rar = rollRarity(needRare);
    state.pulls++;
    state.pity = rar === 'L' ? 0 : state.pity + 1;
    const pool = HERO_IDS.filter((id) => HEROES[id].rarity === rar);
    const id = pool[Math.floor(Math.random() * pool.length)];
    const isNew = !state.owned[id];
    if (isNew) state.owned[id] = { rank: 1, frags: 0, lvl: 1, xp: 0 };
    else state.owned[id].frags++;
    results.push({ id, rar, isNew });
  }
  save();
  $$('.gold-amt').forEach((g) => (g.textContent = state.gold));
  reveal(results);
}

// Invocation de tenues : mêmes taux (sans pitié), une Rare au moins sur ×10 ; un doublon rend de l'or.
function pullSkins(count) {
  const cost = count === 1 ? SKIN_GACHA.single : SKIN_GACHA.multi;
  if (state.gold < cost) return;
  state.gold -= cost;
  const results = [];
  for (let i = 0; i < count; i++) {
    const needRare = count === 10 && i === 9 && results.every((r) => r.rar === 'C');
    const x = Math.random();
    let rar = x < RARITY.L.rate ? 'L' : needRare || x < RARITY.L.rate + RARITY.R.rate ? 'R' : 'C';
    let pool = SKINS.filter((sk) => sk.rarity === rar);
    if (!pool.length) { pool = SKINS; rar = pool[0].rarity; }
    const sk = pool[Math.floor(Math.random() * pool.length)];
    const isNew = !state.skins[sk.id];
    if (isNew) state.skins[sk.id] = true;
    else state.gold += SKIN_GACHA.dupGold;
    results.push({ skin: sk.id, rar: sk.rarity, isNew });
  }
  save();
  $$('.gold-amt').forEach((g) => (g.textContent = state.gold));
  reveal(results);
}

// Dos de carte : une petite pancarte de bois (dorée pour une Légendaire) frappée du cristal.
function paintBack(b) {
  b.style.backgroundImage = signUrl(b.offsetWidth, b.offsetHeight, b.classList.contains('b-L') ? 'hot' : 'normal', b._seed);
  b.style.backgroundSize = '100% 100%';
}

// Révélation : dos de carte qui clignote par paliers, puis la face (héros ou tenue).
async function reveal(results) {
  const ov = $('#reveal'), grid = $('#reveal-grid'), ok = $('#reveal-ok');
  grid.innerHTML = '';
  grid.className = results.length > 1 ? 'grid10' : 'grid1';
  ov.classList.remove('hidden');
  ok.textContent = 'Tout révéler';
  let skip = false;
  ok.onclick = () => { skip = true; };
  const backs = results.map((r) => {
    // Une Légendaire se cache parfois derrière un dos de Rare.
    const b = el('div', `card back b-${r.rar === 'L' && Math.random() < 0.5 ? 'R' : r.rar}${r.skin ? ' skin' : ''}`);
    b.appendChild(icon(r.skin ? 'skin' : 'summon', 3));
    b._seed = results.indexOf(r) + 3;
    grid.appendChild(b);
    paintBack(b);
    return b;
  });
  for (let i = 0; i < results.length; i++) {
    const r = results[i], back = backs[i];
    if (!skip) {
      const blinks = r.rar === 'L' ? 8 : r.rar === 'R' ? 4 : 2;
      for (let b = 0; b < blinks && !skip; b++) {
        back.classList.toggle('blink');
        if (r.rar === 'L' && b === 3) {
          back.className = 'card back b-L blink' + (r.skin ? ' skin' : '');
          paintBack(back);
        }
        sfx('card');
        await wait(110);
      }
    }
    const k = results.length > 1 ? 2 : 4;
    const face = r.skin
      ? skinCard(r.skin, { badge: r.isNew ? 'NEW' : `+${SKIN_GACHA.dupGold}`, k })
      : card(r.id, { badge: r.isNew ? 'NEW' : '+1', k });
    face._seed = back._seed;
    back.replaceWith(face);
    face.style.backgroundImage = signUrl(face.offsetWidth, face.offsetHeight, r.rar === 'L' ? 'hot' : 'normal', face._seed);
    face.style.backgroundSize = '100% 100%';
    // éclat à la révélation, plus fort selon la rareté ; une Légendaire fait trembler l'écran
    const fr = face.getBoundingClientRect();
    sparks(fr.left + fr.width / 2, fr.top + fr.height / 2, { C: '#d0d6dc', R: '#7ab0f0', L: '#fbe08a' }[r.rar], { C: 6, R: 14, L: 30 }[r.rar], r.rar === 'L' ? 2 : 1.2);
    if (r.rar === 'L') {
      ov.animate(Array.from({ length: 7 }, (_, j) => ({ translate: j === 6 ? '0 0' : `${Math.round(rr(-4, 4))}px ${Math.round(rr(-3, 3))}px` })), { duration: 320, easing: 'steps(7, end)' });
      haptic(30);
    }
    if (!skip) {
      sfx(r.rar === 'L' ? 'legend' : r.rar === 'R' ? 'rare' : 'blip');
      await wait(r.rar === 'C' ? 140 : 380);
    }
  }
  ok.textContent = 'OK';
  ok.onclick = () => {
    ov.classList.add('hidden');
    refresh();
  };
}

// ---------------------------------------------------------------- combat

let battle = null, queueSig = '', queueTimer = null;

// Échelle entière la plus grande où la scène de base (W × H) tient à l'écran.
const battleScale = () => Math.max(1, Math.floor(Math.min((innerWidth * DPR()) / W, (innerHeight * DPR()) / H)));

// Place le canvas de combat à l'échelle s, centré ; il peut déborder d'un pixel d'art pour couvrir l'écran.
function placeBattleCanvas(cv, w, h, s) {
  const dpr = DPR(), cw = (w * s) / dpr, ch = (h * s) / dpr;
  cv.style.width = cw + 'px';
  cv.style.height = ch + 'px';
  cv.style.left = Math.round(((innerWidth - cw) / 2) * dpr) / dpr + 'px';
  cv.style.top = Math.round(((innerHeight - ch) / 2) * dpr) / dpr + 'px';
  cv.style.position = 'absolute';
}

// n : numéro d'étape (histoire) ou combat déjà préparé (tour, mode infini) ; carry : PV gardés.
function startBattle(n, carry = null) {
  const st = typeof n === 'number' ? stage(n) : n;
  closeModal(false);
  hideEnd();
  show('battle');
  const cv = $('#b-canvas'), dpr = DPR();
  // échelle entière la plus grande, puis scène élargie et allongée (sol en plus en bas) pour couvrir tout l'écran
  const s = battleScale();
  const width = Math.max(W, Math.min(320, Math.ceil((innerWidth * dpr) / s)));
  const height = Math.max(H, Math.min(180, Math.ceil((innerHeight * dpr) / s)));
  cv.width = width;
  cv.height = height;
  placeBattleCanvas(cv, width, height, s);
  $('#b-stage').textContent = st.label;
  battle = new Battle({
    // zoom caméra d'un pixel d'écran de plus par pixel d'art : reste net (plafonné pour les petites échelles)
    look: (id, rank) => look(id, rank),
    carry,
    canvas: cv, width, height, zoom: Math.min((s + 1) / s, 1.2), team: state.team, stage: st, owned: state.owned,
    ui: { log: (t) => ($('#b-log').textContent = t), beginChoice: showMenu, endChoice: hideMenu },
    onEnd: (res) => endBattle(st, res),
  });
  setTools();
  queueSig = '';
  clearInterval(queueTimer);
  queueTimer = setInterval(updateQueue, 150);
  battle.run();
}

function setTools() {
  const a = $('#b-auto'), s = $('#b-speed'), f = $('#b-flee');
  if (!a.firstChild) {
    a.append(icon('auto'), el('span', 'tag', 'Auto'));
    s.append(icon('speed'), el('span', 'tag', '×1'));
    f.append(icon('flee'), el('span', 'tag', 'Fuir'));
  }
  a.classList.toggle('on', !!battle?.auto);
  a.querySelector('.tag').textContent = battle?.auto ? 'Auto : oui' : 'Auto';
  s.querySelector('.tag').textContent = '×' + (battle?.speed || 1);
}

$('#b-auto').onclick = () => {
  if (!battle || battle.over) return;
  battle.targeting = null;
  battle.setAuto(!battle.auto);
  setTools();
};
$('#b-speed').onclick = () => {
  if (!battle) return;
  battle.speed = battle.speed === 1 ? 2 : 1;
  setTools();
};
$('#b-flee').onclick = () => {
  if (battle && !battle.over) ask('Fuir le combat ?', closeBattle);
};

// Ordre des tours : les prochains combattants, de gauche à droite.
function updateQueue() {
  if (!battle) return;
  const q = battle.queue.filter((u) => u.alive).slice(0, 7);
  const sig = q.map((u) => u.key + u.side).join('|') + battle.active?.key;
  if (sig === queueSig) return;
  queueSig = sig;
  const box = $('#b-queue');
  box.innerHTML = '';
  q.forEach((u, i) => {
    const d = el('div', `q${i === 0 ? ' now' : ''}${u.side === 'e' ? ' foe' : ''}`);
    d.appendChild(spriteCanvas(u.key, () => null, u.bm.w > 24 ? 1 : 2));
    box.appendChild(d);
  });
}

// Menu d'actions : des pancartes en arc autour du héros. On glisse le doigt dessus,
// l'action visée grossit, et on la choisit en relâchant (un simple toucher marche aussi).
function showMenu(u) {
  const single = u.skill.kind === 'single';
  buildMenu(u, u.name, [
    { ico: 'attack', mg: '#ff8a4a', label: 'Attaque', sub: 'Frappe un ennemi', go: () => pickTarget(u, 'attack') },
    {
      ico: u.id, mg: '#c08aff', label: u.skill.name, sub: u.cd ? `Prête dans ${u.cd} tour${u.cd > 1 ? 's' : ''}` : u.skill.desc,
      cd: u.cd, go: () => (single ? pickTarget(u, 'skill') : battle.submit({ type: 'skill' })),
    },
    { ico: 'guard', mg: '#5ae0ee', label: 'Garde', sub: 'Dégâts reçus ÷ 2', go: () => battle.submit({ type: 'guard' }) },
  ]);
}

function hideMenu() {
  const m = $('#b-menu');
  m.classList.add('hidden');
  m.innerHTML = '';
}

// Les pancartes sont posées en arc de cercle autour d'un centre (le héros, le cristal),
// un peu inclinées selon leur place. ARC_STEP : écart entre deux pancartes (radians).
const ARC_STEP = 0.72;

function buildMenu(u, title, items) {
  // centre de l'arc : le héros, là où il s'arrête une fois avancé
  const [hx, hy] = battle.screenAt(u.cx0 + u.fxT, u.by - u.bm.h / 2);
  layoutSigns($('#b-menu'), title, items, hx, hy, 112);
}

// items : { ico, mg (couleur magique), label, sub, sub always visible si showSub, cd, off, go }
function layoutSigns(m, title, items, hx, hy, R, step = ARC_STEP, cls = '', enter = 'fan') {
  m.innerHTML = '';
  m.className = 'signs ' + cls;
  const n = items.length, span = R * Math.sin((step * (n - 1)) / 2);
  const cy = Math.max(96 + span, Math.min(innerHeight - 40 - span, hy));
  let first = null;
  items.forEach((it, i) => {
    // messy : pancartes clouées en désordre (décalées et penchées un peu au hasard, toujours pareil)
    const messy = cls.includes('messy'), jx = messy ? [14, -10, 22, -4, 16, -12][i % 6] : 0, jt = messy ? [-5, 6, -3, 7, -6, 4][i % 6] : 0;
    const a = (i - (n - 1) / 2) * step, x = Math.round(hx + R * Math.cos(a)) + jx, y = Math.round(cy + R * Math.sin(a));
    const row = el('div', 'act' + (it.cd || it.off ? ' off' : '') + (it.showSub ? ' sub' : ''), '<span class="motes"><i></i><i></i></span>');
    if (it.mg) row.style.setProperty('--mg', it.mg);
    row.style.setProperty('--tilt', (a * 7 + jt).toFixed(1) + 'deg');
    row.style.left = x + 'px';
    row.style.top = y + 'px';
    row.appendChild(icon(it.ico));
    row.appendChild(el('span', '', `${it.label}${it.sub ? `<small>${it.sub}</small>` : ''}`));
    if (it.cd) row.appendChild(el('span', 'cd', String(it.cd)));
    row._it = it;
    row._seed = i + 1;
    m.appendChild(row);
    first ??= [x, y];
    // les pancartes jaillissent du centre une à une et se déploient en éventail, par paliers
    // (ou tombent du haut de l'écran et rebondissent à leur place)
    if (enter === 'drop') {
      row.animate(
        [{ translate: '0 calc(-50% - 120vh)' }, { translate: '0 calc(-50% + 10px)', offset: 0.8 }, { translate: '0 calc(-50% - 3px)', offset: 0.9 }, { translate: '0 -50%' }],
        { duration: 460, delay: 80 + i * 110, easing: 'steps(8, end)', fill: 'backwards' },
      );
    } else {
      row.animate(
        [
          { translate: `${hx - x}px calc(-50% + ${hy - y}px)`, scale: 0.2, rotate: '0deg', opacity: 0 },
          { translate: '0 -50%', scale: 1, opacity: 1 },
        ],
        { duration: 260, delay: 40 + i * 70, easing: 'steps(5, end)', fill: 'backwards' },
      );
    }
  });
  if (title) {
    const t = el('div', 'm-title', title);
    t.style.left = first[0] + 8 + 'px';
    t.style.top = first[1] - 32 + 'px';
    m.prepend(t);
  }
  m.classList.remove('hidden');
  m.querySelectorAll('.act').forEach(paintSign);
  sfx('menu');
}

// Tous les boutons et cadres de l'interface sont peints comme les pancartes d'action : même bois
// brun veiné, à leur taille exacte (doré quand c'est actif ou principal, rouge pour ce qui est
// dangereux). Repeints dès qu'ils changent de taille ou de classe.
const WOOD_SEL = '.btn, .tool, .icon-btn, .gold-pill, #b-queue, #modal-box, #b-log';
let woodSeed = 30;
function paintWood(e) {
  const w = e.offsetWidth, h = e.offsetHeight;
  if (!w || !h) return;
  e._seed ??= woodSeed++ % 40;
  // une seule règle : le bois des pancartes d'action (doré si actif, rouge si dangereux)
  const kind = e.classList.contains('red') ? 'red' : e.classList.contains('gold') || e.classList.contains('on') ? 'hot' : 'normal';
  const key = `${w}x${h}-${kind}`;
  if (e._woodKey === key) return;
  e._woodKey = key;
  e.style.backgroundImage = signUrl(w, h, kind, e._seed);
  e.style.backgroundSize = `${Math.round(w / U) * U}px ${Math.round(h / U) * U}px`;
}
(() => {
  const ro = new ResizeObserver((entries) => entries.forEach((en) => paintWood(en.target)));
  const watch = (n) => {
    if (n.nodeType !== 1) return;
    if (n.matches(WOOD_SEL)) ro.observe(n);
    n.querySelectorAll?.(WOOD_SEL).forEach((e) => ro.observe(e));
  };
  watch(document.body);
  new MutationObserver((muts) => muts.forEach((m) => {
    if (m.type === 'attributes') {
      if (m.target.matches(WOOD_SEL)) paintWood(m.target);
    } else m.addedNodes.forEach(watch);
  })).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();

// Pancarte en bois dessinée à la taille exacte de l'élément (dorée quand elle est visée).
function paintSign(row) {
  const w = row.offsetWidth, h = row.offsetHeight;
  if (!w) return;
  const kind = row.classList.contains('hot') ? 'hot' : 'normal';
  row.style.backgroundImage = signUrl(w, h, kind, row._seed || 1);
  row.style.backgroundSize = `${Math.round(w / U) * U}px ${Math.round(h / U) * U}px`;
}

// Particules en pixels par-dessus l'interface : traînée du doigt, étincelles, éclats de bois.
// Chaque particule : position et vitesse en px CSS, gravité g, durée de vie en images, couleur, taille en pixels d'art.
const fx = (() => {
  const c = document.createElement('canvas');
  c.id = 'fx';
  c.className = 'px';
  document.body.appendChild(c);
  const g = c.getContext('2d');
  let parts = [], raf = 0;
  const loop = () => {
    g.clearRect(0, 0, c.width, c.height);
    parts = parts.filter((p) => --p.life > 0);
    for (const p of parts) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      g.globalAlpha = Math.min(1, p.life / 6);
      g.fillStyle = p.c;
      g.fillRect(Math.round(p.x / U), Math.round(p.y / U), p.s, p.s);
    }
    g.globalAlpha = 1;
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  };
  return (list) => {
    const w = Math.ceil(innerWidth / U), h = Math.ceil(innerHeight / U);
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    parts.push(...list);
    if (!raf) raf = requestAnimationFrame(loop);
  };
})();
const rr = (a, b) => a + Math.random() * (b - a);
const mgOf = (r) => getComputedStyle(r).getPropertyValue('--mg').trim() || '#fbe08a';

// Petites étincelles de couleur c autour du point (x, y).
const sparks = (x, y, c, n, speed = 1) => fx(Array.from({ length: n }, () => {
  const a = rr(0, Math.PI * 2), v = rr(0.6, 2.4) * speed;
  return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, g: 0.06, life: rr(16, 30) | 0, c: Math.random() < 0.3 ? '#ffffff' : c, s: Math.random() < 0.5 ? 2 : 1 };
}));

// Choisir une pancarte : elle s'illumine, gonfle puis éclate en copeaux et étincelles ;
// les autres tombent. L'action part juste après.
function chooseSign(r) {
  const m = r.parentElement, rc = r.getBoundingClientRect(), col = mgOf(r);
  m.classList.add('chosen');
  const WOODS = ['#8a5a32', '#b8814a', '#5a3820', '#d49a4e', '#fbe08a'];
  fx(Array.from({ length: 24 }, () => ({
    x: rr(rc.left + 8, rc.right - 8), y: rr(rc.top + 6, rc.bottom - 6), vx: rr(-3, 3), vy: rr(-4.5, -1), g: 0.28, life: rr(24, 40) | 0,
    c: WOODS[(Math.random() * WOODS.length) | 0], s: Math.random() < 0.5 ? 3 : 2,
  })));
  sparks(rc.left + rc.width / 2, rc.top + rc.height / 2, col, 28, 1.8);
  r.animate(
    [
      { scale: 1, filter: 'brightness(1)' },
      { scale: 1.16, filter: 'brightness(2.2)', offset: 0.25 },
      { scale: 1.08, filter: 'brightness(1.3)', offset: 0.5 },
      { scale: 0.3, opacity: 0, filter: 'brightness(3)' },
    ],
    { duration: 320, easing: 'steps(6, end)', fill: 'forwards' },
  );
  [...m.querySelectorAll('.act')].filter((o) => o !== r).forEach((o, i) => o.animate(
    [{ opacity: 1 }, { translate: '0 calc(-50% + 36px)', rotate: i % 2 ? '8deg' : '-8deg', opacity: 0 }],
    { duration: 240, delay: i * 50, easing: 'steps(4, end)', fill: 'forwards' },
  ));
  sfx('select');
  sfx('wood');
  haptic(15);
  setTimeout(() => {
    m.classList.remove('chosen');
    if (r.isConnected) r._it.go();
  }, 300);
}

// Glisser sur des pancartes : celle sous le doigt se redresse, grossit et suit un peu le doigt,
// une traînée d'étincelles suit le doigt ; relâcher = choisir.
function attachSigns(m) {
  let hot = null, dragging = false, last = null;
  const rowAt = (e) => {
    const r = document.elementFromPoint(e.clientX, e.clientY)?.closest('.act') || null;
    return r && r.parentElement === m ? r : null;
  };
  const setHot = (r) => {
    if (r === hot) return;
    if (hot) {
      hot.classList.remove('hot');
      hot.style.setProperty('--px', '0px');
      hot.style.setProperty('--py', '0px');
      paintSign(hot);
    }
    hot = r;
    m.classList.toggle('picking', !!r);
    if (r) {
      r.classList.add('hot');
      paintSign(r);
      const rc = r.getBoundingClientRect();
      sparks(rc.left + 6, rc.top + rc.height / 2, mgOf(r), 8, 0.9);
      sfx('hover');
      haptic(5);
    }
  };
  // la pancarte visée est attirée vers le doigt (6 px au plus)
  const pull = (e) => {
    if (!hot) return;
    const rc = hot.getBoundingClientRect();
    const cl = (v) => Math.max(-6, Math.min(6, Math.round(v * 0.12)));
    hot.style.setProperty('--px', cl(e.clientX - (rc.left + rc.width / 2)) + 'px');
    hot.style.setProperty('--py', cl(e.clientY - (rc.top + rc.height / 2)) + 'px');
  };
  const trail = (e) => {
    if (last && Math.hypot(e.clientX - last[0], e.clientY - last[1]) < 7) return;
    last = [e.clientX, e.clientY];
    const c = hot ? mgOf(hot) : '#fbe08a';
    fx([0, 1, 2].map((i) => ({ x: e.clientX + rr(-4, 4), y: e.clientY + rr(-4, 4), vx: rr(-0.5, 0.5), vy: rr(-1, -0.2), g: 0.02, life: rr(18, 32) | 0, c: Math.random() < 0.35 ? '#ffffff' : c, s: i ? 1 : 2 })));
  };
  // stopPropagation : glisser sur les pancartes ne doit pas faire changer de pièce
  m.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    dragging = true;
    last = null;
    m.setPointerCapture(e.pointerId);
    unlock();
    setHot(rowAt(e));
    pull(e);
    trail(e);
  });
  m.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setHot(rowAt(e));
    pull(e);
    trail(e);
  });
  m.addEventListener('pointerup', (e) => {
    e.stopPropagation();
    dragging = false;
    const r = rowAt(e);
    if (!r || r.classList.contains('off')) {
      if (r) sfx('denied');
      setHot(null);
      return;
    }
    hot = null; // la pancarte reste dorée pendant son effet ; le menu est reconstruit ou caché ensuite
    chooseSign(r);
  });
  m.addEventListener('pointercancel', () => { dragging = false; setHot(null); });
}
attachSigns($('#b-menu'));
attachSigns($('#s-menu'));
attachSigns($('#t-menu'));
attachSigns($('#b-end-menu'));
attachSigns($('#c-menu'));

// Choix de la cible : coins de visée sur les ennemis, on touche celui qu'on veut.
function pickTarget(u, type) {
  const foes = battle.alive('e');
  if (foes.length === 1) return battle.submit({ type, target: foes[0] });
  buildMenu(u, 'Touche un ennemi', [
    { ico: 'cancel', mg: '#d8c8b0', label: 'Annuler', go: () => { battle.targeting = null; showMenu(u); } },
  ]);
  battle.log('Choisis une cible.');
  battle.targeting = foes;
  battle.onTargetTap = (t) => {
    battle.targeting = null;
    battle.onTargetTap = null;
    sfx('select');
    battle.submit({ type, target: t });
  };
}

async function closeBattle() {
  closeModal(false);
  hideEnd();
  await fade(true);
  battle?.stop();
  battle = null;
  clearInterval(queueTimer);
  hideMenu();
  show('camp');
  await fade(false);
}

// Fin de combat, dans le style du jeu : le décor s'assombrit, une plaque de bois tombe du ciel
// (dorée pour une victoire) avec le titre, l'équipe qui saute de joie (ou grise et tête basse),
// les récompenses qui se comptent ; les choix sortent ensuite de la plaque en pancartes.
// Les récompenses dépendent du mode : histoire, tour des épreuves, mode infini.
let endlessRun = null; // descente en cours : { wave, gold }

function endBattle(st, res) {
  const win = res === 'win', team = state.team.slice();
  let gold = 0, xp = xpFor(st.n, win), notes = [], title = win ? 'Victoire !' : 'Défaite…', signs;
  if (st.mode === 'tower') {
    const R = st.reward;
    if (win) {
      state.keys = Math.max(0, towerKeys() - 1);
      if (R.gold) gold = R.gold;
      if (R.xp) xp = R.xp;
      if (R.shards) {
        state.owned[R.hero].frags += R.shards;
        notes.push(`+${R.shards} éclat${R.shards > 1 ? 's' : ''} de ${HEROES[R.hero].name}`);
      }
    } else notes.push('Aucune clé dépensée.');
    const again = { ico: 'fight', mg: TOWER_ROOMS[st.room].mg, label: win ? 'Recommencer' : 'Réessayer', sub: `${towerKeys()} clé${towerKeys() > 1 ? 's' : ''} restante${towerKeys() > 1 ? 's' : ''}`, showSub: true, off: towerKeys() <= 0, go: () => nextBattle(towerStage(st.room, st.diff, state.best, st.hero)) };
    signs = [again, { ico: 'back', mg: '#d8c8b0', label: 'Camp', go: closeBattle }];
  } else if (st.mode === 'endless') {
    if (win) {
      gold = st.reward.gold;
      xp = st.reward.xp;
      endlessRun.gold += gold;
      state.endlessBest = Math.max(state.endlessBest, st.wave);
      title = `Vague ${st.wave} franchie !`;
      notes.push(`Total de la descente : ${endlessRun.gold} or · record : vague ${state.endlessBest}`);
      // les PV restent d'une vague à l'autre, avec 25 % de soin
      const carry = {};
      for (const u of battle.heroes) carry[u.id] = u.alive ? u.hp / u.max + 0.25 : 0;
      signs = [
        { ico: 'fight', mg: '#c08aff', label: 'Vague suivante', sub: `Vague ${st.wave + 1}`, showSub: true, go: () => nextBattle(endlessWave(st.wave + 1), carry) },
        { ico: 'back', mg: '#d8c8b0', label: 'Remonter', sub: 'garder le butin', showSub: true, go: closeBattle },
      ];
    } else {
      xp = Math.round(xp * 0.5);
      title = 'Fin de la descente';
      state.endlessBest = Math.max(state.endlessBest, st.wave - 1);
      notes.push(`Vague ${st.wave} · butin : ${endlessRun ? endlessRun.gold : 0} or · record : vague ${state.endlessBest}`);
      signs = [
        { ico: 'fight', mg: '#c08aff', label: 'Redescendre', sub: 'depuis la vague 1', showSub: true, go: () => { endlessRun = { wave: 1, gold: 0 }; nextBattle(endlessWave(1)); } },
        { ico: 'back', mg: '#d8c8b0', label: 'Camp', go: closeBattle },
      ];
    }
  } else {
    const first = win && st.n > state.best;
    if (win) {
      gold = st.gold + (first ? st.firstGold : 0);
      if (first) state.best = st.n;
      if (first) notes.push('bonus du premier passage');
    } else notes.push('Améliore tes héros, ou entraîne-toi à la tour des épreuves.');
    signs = win ? [
      { ico: 'fight', mg: '#ffd86a', label: 'Étape suivante', sub: `Étape ${state.best + 1}`, showSub: true, go: () => nextBattle(state.best + 1) },
      { ico: 'back', mg: '#d8c8b0', label: 'Camp', go: closeBattle },
    ] : [
      { ico: 'fight', mg: '#ff8a4a', label: 'Réessayer', sub: `Étape ${st.n}`, showSub: true, go: () => nextBattle(st.n) },
      { ico: 'back', mg: '#d8c8b0', label: 'Camp', go: closeBattle },
    ];
  }
  state.gold += gold;
  const ups = giveXp(team, xp);
  save();
  showEnd({ win, title, gold, xp, ups, notes, signs });
}

// La plaque de fin : le même bois que les pancartes, avec deux autres plaques empilées derrière.
// On la fait glisser (ou on la touche) pour passer d'une page à l'autre : résumé, statistiques
// du combat, XP des soldats.
let endPage = 0;
function showEnd({ win, title, gold, xp, ups, notes, signs }) {
  sfx(win ? 'win' : 'lose');
  haptic(win ? 40 : 20);
  const end = $('#b-end'), veil = $('#b-veil'), pl = $('#b-plaque');
  pl.innerHTML = '';
  pl.className = win ? 'win' : 'lose';
  end.dataset.res = win ? 'win' : 'lose'; // lueur dorée (victoire) ou rouge (défaite) autour de la pile
  const heroes = battle ? battle.heroes : [];

  // page 1 : résumé
  const p1 = el('div', 'end-page');
  p1.appendChild(el('div', 'end-title' + (title.length > 12 ? ' long' : ''), title));
  const team = el('div', 'end-team');
  state.team.forEach((id) => team.appendChild(lookCanvas(id, 3)));
  p1.appendChild(team);
  const row = el('div', 'end-gold');
  if (gold) {
    row.appendChild(spriteCanvas('coin', coinSprite, 2));
    const n = el('b', '', '+0');
    row.append(n, el('span', '', 'or'));
    // l'or se compte par paliers
    for (let i = 1; i <= 12; i++) setTimeout(() => { n.textContent = '+' + Math.round((gold * i) / 12); if (i % 3 === 0) sfx('coin'); }, 520 + i * 50);
  }
  row.appendChild(el('span', 'end-xp', `+${xp} XP`));
  p1.appendChild(row);
  if (ups.length) p1.appendChild(el('div', 'end-up', ups.map((u) => `${HEROES[u.id].name} niv ${u.lvl} !`).join(' · ')));
  for (const t of notes) p1.appendChild(el('div', 'end-note', t));

  // page 2 : statistiques du combat, par soldat
  const p2 = el('div', 'end-page');
  p2.appendChild(el('div', 'end-head', 'Statistiques'));
  const tb = el('div', 'end-table');
  tb.appendChild(el('div', 'end-row head', '<span></span><span>Dégâts</span><span>Reçus</span><span>Soins</span><span>KO</span>'));
  const best = Math.max(1, ...heroes.map((u) => u.dealt || 0));
  heroes.forEach((u) => {
    const r = el('div', 'end-row' + ((u.dealt || 0) === best && best > 1 ? ' mvp' : ''));
    const who = el('span', 'who');
    who.appendChild(lookCanvas(u.id, 1));
    r.appendChild(who);
    r.append(el('span', '', String(u.dealt || 0) + (u.crits ? `<small> ${u.crits}×!</small>` : '')), el('span', '', String(u.taken || 0)), el('span', '', String(u.healed || 0)), el('span', '', String(u.kills || 0)));
    tb.appendChild(r);
  });
  p2.appendChild(tb);
  p2.appendChild(el('div', 'end-note', `${battle ? battle.turns : 0} tours · le plus de dégâts est en doré`));

  // page 3 : XP de chaque soldat
  const p3 = el('div', 'end-page');
  p3.appendChild(el('div', 'end-head', 'Expérience'));
  state.team.forEach((id) => {
    const o = state.owned[id], cap = LEVEL.cap(o.rank), up = ups.find((u) => u.id === id);
    const r = el('div', 'end-lvl');
    r.appendChild(lookCanvas(id, 2));
    const info = el('div', 'end-lvl-info');
    info.appendChild(el('div', '', `<b>${HEROES[id].name}</b> · niv ${o.lvl}/${cap}${up ? ' <span class="end-up">+niveau !</span>' : ''}`));
    info.appendChild(segBar(o.lvl >= cap ? 1 : o.xp / LEVEL.need(o.lvl), 'xp', 12));
    info.appendChild(el('div', 'end-small', o.lvl >= cap ? 'niveau max du rang : monte de rang pour aller plus loin' : `+${xp} XP · encore ${LEVEL.need(o.lvl) - o.xp} XP`));
    r.appendChild(info);
    p3.appendChild(r);
  });

  const pages = [p1, p2, p3];
  pages.forEach((p) => pl.appendChild(p));
  const dots = el('div', 'end-dots');
  pages.forEach(() => dots.appendChild(el('i')));
  pl.appendChild(dots);
  pl.appendChild(el('div', 'end-swipe', '◂ glisse la plaque ▸'));
  endPage = 0;
  const show = (i) => {
    endPage = i;
    pages.forEach((p, k) => p.classList.toggle('on', k === i));
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
  };
  show(0);
  // La plaque suit le doigt (dans tous les sens). Lâchée assez loin, elle file un peu dans cette
  // direction, éclate en copeaux comme une pancarte qu'on choisit, et la plaque suivante passe devant.
  // Gauche ou haut : page suivante ; droite ou bas : page précédente. Un toucher : page suivante.
  let drag = null, busy = false;
  const at = (dx, dy, rot = 0) => {
    pl.style.translate = `calc(-50% + ${Math.round(dx)}px) calc(-50% + ${Math.round(dy)}px)`;
    pl.style.rotate = rot + 'deg';
  };
  const turn = (dir, dx = -60, dy = 0) => {
    if (busy) return;
    busy = true;
    const next = (endPage + dir + pages.length) % pages.length, len = Math.hypot(dx, dy) || 1;
    const fx2 = dx + (dx / len) * 70, fy2 = dy + (dy / len) * 70;
    pl.animate([{ translate: pl.style.translate || '-50% -50%', scale: 1 }, { translate: `calc(-50% + ${Math.round(fx2)}px) calc(-50% + ${Math.round(fy2)}px)`, scale: 1.05, filter: 'brightness(1.8)' }], { duration: 140, easing: 'steps(3, end)', fill: 'forwards' });
    setTimeout(() => {
      const r = pl.getBoundingClientRect(), WOODS = ['#a8784a', '#c89660', '#7a5232', '#fbe08a'];
      fx(Array.from({ length: 30 }, () => ({ x: rr(r.left, r.right), y: rr(r.top, r.bottom), vx: rr(-3, 3) + (dx / len) * 2, vy: rr(-4, -0.5) + (dy / len) * 2, g: 0.25, life: rr(22, 38) | 0, c: WOODS[(Math.random() * 4) | 0], s: Math.random() < 0.5 ? 3 : 2 })));
      sparks(r.left + r.width / 2, r.top + r.height / 2, win ? '#fbe08a' : '#ff6a6a', 16, 1.6);
      sfx('wood');
      haptic(12);
      pl.getAnimations().forEach((an) => an.cancel());
      at(0, 0);
      show(next);
      // la plaque suivante sort de la pile, derrière, et passe devant
      pl.animate([{ translate: 'calc(-50% + 12px) calc(-50% + 8px)', rotate: '4deg', scale: 0.92, filter: 'brightness(.55)' }, { translate: '-50% -50%', rotate: '0deg', scale: 1, filter: 'brightness(1)' }], { duration: 220, easing: 'steps(5, end)' });
      sfx('select');
      setTimeout(() => (busy = false), 230);
    }, 140);
  };
  pl.onpointerdown = (e) => {
    e.stopPropagation();
    if (busy) return;
    pl.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
  };
  pl.onpointermove = (e) => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x;
    drag.dy = e.clientY - drag.y;
    at(drag.dx, drag.dy, drag.dx * 0.04);
  };
  pl.onpointerup = (e) => {
    e.stopPropagation();
    if (!drag) return;
    const { dx, dy } = drag;
    drag = null;
    if (Math.hypot(dx, dy) > 50) return turn(dx < -Math.abs(dy) * 0.5 || dy < -Math.abs(dx) * 0.5 ? 1 : -1, dx, dy);
    // pas assez loin : elle revient à sa place (un simple toucher tourne la page)
    pl.animate([{ translate: pl.style.translate, rotate: pl.style.rotate }, { translate: '-50% -50%', rotate: '0deg' }], { duration: 120, easing: 'steps(3, end)' });
    at(0, 0);
    if (Math.hypot(dx, dy) < 8) turn(1);
  };
  pl.onpointercancel = () => { drag = null; at(0, 0); };

  end.classList.remove('hidden');
  $('#b-end-menu').classList.add('hidden');
  for (const [o, ms] of [[0.2, 0], [0.4, 60], [0.6, 120]]) setTimeout(() => (veil.style.opacity = o), ms);
  // la plaque (et celles de derrière) tombe du haut et rebondit, puis lâche une gerbe d'étincelles (ou de poussière)
  const paint = (e, seed) => {
    e.style.backgroundImage = signUrl(e.offsetWidth, e.offsetHeight, 'normal', seed);
    e.style.backgroundSize = '100% 100%';
  };
  paint(pl, 7);
  $$('#b-end .end-back').forEach((b, i) => paint(b, 11 + i));
  const drop = [{ translate: '-50% -150vh' }, { translate: '-50% calc(-50% + 12px)', offset: 0.75 }, { translate: '-50% calc(-50% - 4px)', offset: 0.88 }, { translate: '-50% -50%' }];
  [pl, ...$$('#b-end .end-back')].forEach((e, i) => e.animate(drop, { duration: 480, delay: i * 60, easing: 'steps(8, end)', fill: 'backwards' }));
  setTimeout(() => {
    const r = pl.getBoundingClientRect();
    if (win) {
      sparks(r.left + r.width / 2, r.top + 10, '#fbe08a', 40, 2.4);
      fx(Array.from({ length: 14 }, () => ({ x: rr(r.left, r.right), y: r.top, vx: rr(-1.5, 1.5), vy: rr(-3, -1), g: 0.12, life: rr(30, 50) | 0, c: Math.random() < 0.5 ? '#e0a93a' : '#fbe08a', s: 2 })));
    } else {
      fx(Array.from({ length: 16 }, () => ({ x: rr(r.left, r.right), y: r.bottom, vx: rr(-1.2, 1.2), vy: rr(-1.2, -0.2), g: 0.03, life: rr(20, 34) | 0, c: Math.random() < 0.5 ? '#8a7068' : '#b8a080', s: 2 })));
    }
    if (ups.length) setTimeout(() => sfx('levelUp'), 300);
    sfx('wood');
    $('#scr-battle').animate(Array.from({ length: 5 }, (_, i) => ({ translate: i === 4 ? '0 0' : `0 ${i % 2 ? -3 : 3}px` })), { duration: 160, easing: 'steps(5, end)' });
    layoutSigns($('#b-end-menu'), null, signs, r.right - 60, r.top + r.height / 2, 80, 0.9); // arc assez large pour deux pancartes l'une sous l'autre
  }, 540);
}

function hideEnd() {
  $('#b-end').classList.add('hidden');
  $('#b-end-menu').classList.add('hidden');
  $('#b-veil').style.opacity = 0;
}

async function nextBattle(n, carry = null) {
  closeModal(false);
  await fade(true);
  battle?.stop();
  hideMenu();
  startBattle(n, carry);
  await fade(false);
}

addEventListener('resize', () => {
  if (screen === 'battle' && battle) {
    placeBattleCanvas($('#b-canvas'), battle.W, battle.H, battleScale());
    if (!$('#b-menu').classList.contains('hidden') && battle.active) showMenu(battle.active);
  } else if (ROOMS.includes(screen)) refresh();
});

// ---------------------------------------------------------------- fenêtres

function modal(content, buttons) {
  const box = $('#modal-box');
  box.innerHTML = '';
  box.appendChild(content);
  const row = el('div', 'row');
  for (const [label, fn, cls] of buttons) {
    const b = el('button', 'btn ' + (cls || ''), label);
    b.onclick = fn;
    row.appendChild(b);
  }
  box.appendChild(row);
  $('#modal').classList.remove('hidden');
}

function closeModal(re = true) {
  $('#modal').classList.add('hidden');
  if (re) refresh();
}

function ask(question, yes) {
  modal(el('p', '', question), [['Non', () => closeModal(false)], ['Oui', () => { closeModal(false); yes(); }, 'red']]);
}

// ---------------------------------------------------------------- portrait

(function rotateHint() {
  const c = $('#rotate-canvas'), g = c.getContext('2d');
  c.width = 24;
  c.height = 24;
  c.style.width = c.style.height = '96px';
  let f = 0;
  const draw = () => {
    g.clearRect(0, 0, 24, 24);
    const [w, h] = f % 2 ? [20, 12] : [12, 20];
    const x = (24 - w) >> 1, y = (24 - h) >> 1;
    g.fillStyle = OUTLINE;
    g.fillRect(x - 1, y - 1, w + 2, h + 2);
    g.fillStyle = '#8a8088';
    g.fillRect(x, y, w, h);
    g.fillStyle = '#5a86d8';
    g.fillRect(x + 2, y + 2, w - 4, h - 4);
    g.fillStyle = '#fbe08a';
    g.fillRect(x + 3, y + 3, 2, 1);
    f++;
    setTimeout(draw, 700);
  };
  draw();
})();

// ---------------------------------------------------------------- sons et vibrations

document.addEventListener('click', (e) => {
  unlock();
  if (!e.isTrusted) return;
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  sfx('blip');
  haptic(8);
}, true);
addEventListener('touchend', unlock, { passive: true });
// les pancartes et le glisser-déposer n'émettent pas de « click » : on débloque aussi au relâcher
addEventListener('pointerup', unlock, { capture: true, passive: true });
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').classList.contains('hidden')) closeModal(screen !== 'battle');
  if (ROOMS.includes(screen) && !overlayOpen()) {
    if (e.key === 'ArrowLeft') goRoom(-1);
    if (e.key === 'ArrowRight') goRoom(1);
  }
});

// ---------------------------------------------------------------- démarrage

setSound(state.sound);
setHaptics(state.haptics);
document.fonts?.ready.then(() => refresh());
show('camp');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
