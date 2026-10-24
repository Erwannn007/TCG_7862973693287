// Interface du jeu (écran horizontal) : camp, équipe, invocation, combat.
import { HEROES, HERO_IDS, RARITY, RANK_NAMES, UPGRADE, GACHA, DAILY_GOLD, heroStats, stage } from './data.js';
import { heroSprite, coinSprite, starSprite, crystalSprite } from './sprites.js';
import { spriteCanvas, bitmap, drawFx } from './render.js';
import { state, save, resetSave } from './state.js';
import { Battle, W, H } from './battle.js';
import { sceneBackground, sceneAnim, SH, CAMP_W } from './scene.js';
import { installUiArt, iconSprite, medallionSprite } from './ui-art.js';
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

const heroCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}`, () => heroSprite(id, rank), k);
const lockedCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}-lock`, () => heroSprite(id, rank).silhouette(LOCKED), k);
const icon = (name, k = 2) => spriteCanvas('ico-' + name, () => iconSprite(name), k);
const medal = (name, tone = 'gold') => spriteCanvas(`med-${name}-${tone}`, () => medallionSprite(name, tone), 2);

function starsRow(rar, k = 1) {
  const d = el('div', 'stars');
  for (let i = 0; i < RAR_STARS[rar]; i++) d.appendChild(spriteCanvas('star', starSprite, k));
  return d;
}
function rankPips(rank) {
  const d = el('div', 'pips');
  for (let i = 1; i <= 5; i++) d.appendChild(el('i', i <= rank ? 'on' : ''));
  return d;
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

// Icônes et pièces des barres du haut.
$$('.ico[data-ico]').forEach((s) => s.appendChild(icon(s.dataset.ico)));
$$('.coin').forEach((s) => s.appendChild(spriteCanvas('coin', coinSprite, 2)));
$('#btn-options').appendChild(medal('gear', 'stone'));
$('#btn-daily').appendChild(medal('chest'));
$('#go-replay').appendChild(medal('scroll', 'stone'));
$$('.back').forEach((b) => {
  b.appendChild(medal('back', 'stone'));
  b.onclick = () => show('camp');
});

// ---------------------------------------------------------------- navigation

let screen = 'camp';
function show(name) {
  screen = name;
  for (const s of ['camp', 'team', 'summon', 'battle']) $('#scr-' + s).classList.toggle('hidden', s !== name);
  refresh();
}
function refresh() {
  $$('.gold-amt').forEach((g) => (g.textContent = state.gold));
  if (screen === 'camp') renderCamp();
  else if (screen === 'team') renderTeam();
  else if (screen === 'summon') renderSummon();
}

// ---------------------------------------------------------------- cartes

function card(id, opts = {}) {
  const h = HEROES[id], own = state.owned[id], k = opts.k || 2;
  const c = el('button', `card r-${h.rarity}${own ? '' : ' locked'}${opts.sel ? ' sel' : ''}`);
  const ped = el('div', 'pedestal');
  ped.appendChild(own ? heroCanvas(id, own.rank, k) : lockedCanvas(id, 1, k));
  c.appendChild(ped);
  c.appendChild(el('div', 'name', own ? h.name : '???'));
  c.appendChild(starsRow(h.rarity));
  if (own) c.appendChild(rankPips(own.rank));
  if (opts.badge) c.appendChild(el('div', 'badge ' + (opts.badgeCls || ''), opts.badge));
  return c;
}
const canUpgrade = (id) => {
  const o = state.owned[id];
  return o && o.rank < 5 && o.frags >= UPGRADE[o.rank - 1].frags;
};

// ---------------------------------------------------------------- camp (accueil)

const today = () => new Date().toISOString().slice(0, 10);
let campTimer = null;

function renderCamp() {
  const next = stage(state.best + 1);
  $('#fight-info').textContent = `Étape ${next.n} · ${next.chapter.name}${next.boss ? ' · BOSS' : ''}`;
  $('#go-replay').classList.toggle('hidden', state.best === 0);
  $('#btn-daily').classList.toggle('hidden', state.lastDaily === today());
  drawCamp();
}

// Le camp : feu de camp dans le donjon, l'équipe autour, le cristal d'invocation à droite.
function drawCamp() {
  const c = $('#camp-canvas');
  c.width = CAMP_W;
  c.height = SH;
  fitCanvas(c, CAMP_W, SH, innerWidth, innerHeight, true);
  const g = c.getContext('2d');
  const crystal = bitmap('crystal', crystalSprite);
  const spots = [[124, 96], [136, 86], [176, 94]];
  const party = state.team.map((id, i) => ({ bm: bitmap(`h-${id}-${state.owned[id].rank}`, () => heroSprite(id, state.owned[id].rank)), at: spots[i] }));
  let step = 0;
  clearTimeout(campTimer);
  const frame = () => {
    if (screen !== 'camp') return;
    g.drawImage(sceneBackground('camp'), 0, 0);
    noticeBoard(g);
    sceneAnim('camp', g, step);
    const cy = 66 - (step % 6 < 3 ? 0 : 1);
    g.drawImage(crystal.canvas, 228, cy);
    drawFx(g, crystal, 228, cy, step);
    party.forEach((p, i) => {
      const x = p.at[0] - (p.bm.w >> 1), y = p.at[1] - p.bm.h - ((Math.floor(step / 2) + i) % 2);
      g.drawImage(p.bm.canvas, x, y);
      drawFx(g, p.bm, x, y, step);
    });
    step++;
    campTimer = setTimeout(frame, 140);
  };
  frame();
}

// Panneau d'affichage en bois sur le mur de gauche.
function noticeBoard(g) {
  g.fillStyle = OUTLINE;
  g.fillRect(71, 33, 30, 22);
  g.fillStyle = '#6a4228';
  g.fillRect(72, 34, 28, 20);
  g.fillStyle = '#8a5a32';
  g.fillRect(72, 34, 28, 2);
  for (const [x, y, c] of [[75, 38, '#f2e2b8'], [85, 37, '#e8d4a4'], [92, 40, '#f2e2b8'], [78, 45, '#e8d4a4']]) {
    g.fillStyle = c;
    g.fillRect(x, y, 6, 7);
    g.fillStyle = '#8a6a4a';
    g.fillRect(x + 1, y + 2, 4, 1);
    g.fillRect(x + 1, y + 4, 3, 1);
    g.fillStyle = '#e2334a';
    g.fillRect(x + 2, y, 1, 1);
  }
}

$('#go-team').onclick = () => show('team');
$('#go-summon').onclick = () => show('summon');
$('#go-fight').onclick = () => startBattle(state.best + 1);
$('#go-replay').onclick = () => {
  const box = el('div');
  box.appendChild(el('div', 'big-title', 'Rejouer'));
  const list = el('div', 'stage-list');
  for (let n = state.best; n >= 1; n--) {
    const st = stage(n);
    const b = el('button', 'btn' + (st.boss ? ' red' : ''), `${n}${st.boss ? ' boss' : ''}`);
    b.onclick = () => { closeModal(); startBattle(n); };
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

// ---------------------------------------------------------------- équipe

let selected = null;

function renderTeam() {
  if (!selected || !HEROES[selected]) selected = state.team[0];
  const left = $('#team-left');
  left.innerHTML = '';
  left.appendChild(el('div', 'h', 'Formation'));
  const slots = el('div', 'slots');
  for (let i = 0; i < 3; i++) {
    const id = state.team[i];
    if (!id) {
      slots.appendChild(el('div', 'card slot empty', 'vide'));
      continue;
    }
    const c = card(id, { sel: id === selected, badge: String(i + 1), badgeCls: 'team' });
    c.classList.add('slot');
    c.onclick = () => { selected = id; renderTeam(); };
    slots.appendChild(c);
  }
  left.appendChild(slots);
  const owned = HERO_IDS.filter((id) => state.owned[id]).length;
  left.appendChild(el('div', 'h', `Héros ${owned}/${HERO_IDS.length}`));
  const g = el('div', 'cards');
  for (const id of HERO_IDS) {
    const c = card(id, { sel: id === selected, ...(canUpgrade(id) ? { badge: '▲', badgeCls: 'up' } : {}) });
    c.onclick = () => { selected = id; renderTeam(); };
    g.appendChild(c);
  }
  left.appendChild(g);
  renderDetail(selected);
}

function renderDetail(id) {
  const box = $('#team-detail');
  box.innerHTML = '';
  const h = HEROES[id], own = state.owned[id], rank = own ? own.rank : 1, st = heroStats(id, rank);
  const d = el('div', 'detail');
  const stageEl = el('div', 'stage');
  stageEl.appendChild(own ? heroCanvas(id, rank, 4) : lockedCanvas(id, 1, 4));
  d.appendChild(stageEl);

  const info = el('div');
  info.appendChild(el('div', 'd-name', own ? h.name : '???'));
  const l1 = el('div', 'd-line', `${h.cls} · <b style="color:${h.rarity === 'C' ? '#5e6a80' : h.rarity === 'R' ? '#2e5aa8' : '#a87a20'}">${RARITY[h.rarity].name}</b>`);
  l1.appendChild(starsRow(h.rarity));
  info.appendChild(l1);
  if (own) {
    const l2 = el('div', 'd-line', `Rang ${rank} · ${RANK_NAMES[rank - 1]}`);
    l2.appendChild(rankPips(rank));
    info.appendChild(l2);
  }
  for (const [label, val, max, cls] of [['PV', st.hp, 260, 'hp'], ['ATQ', st.atk, 75, ''], ['DÉF', st.def, 25, ''], ['VIT', st.spd, 25, '']]) {
    const s = el('div', 'stat');
    s.append(el('span', '', label), segBar(val / max, cls), el('span', '', String(val)));
    info.appendChild(s);
  }
  d.appendChild(info);

  d.appendChild(el('div', 'skill-box', `<b>${h.skill.name}</b> · recharge ${h.skill.cd} tours<br>${h.skill.desc}`));
  const actSlot = el('div', 'd-actions');
  d.appendChild(actSlot);
  const ranks = el('div', 'ranks');
  for (let r = 1; r <= 5; r++) {
    const rd = el('div');
    rd.appendChild(own && r <= rank ? heroCanvas(id, r, 2) : lockedCanvas(id, r, 2));
    rd.appendChild(el('span', '', `R${r}`));
    ranks.appendChild(rd);
  }
  d.appendChild(ranks);

  const act = actSlot;
  if (!own) {
    act.appendChild(el('p', 'muted', 'À obtenir à l’autel d’invocation.'));
  } else {
    if (rank < 5) {
      const cost = UPGRADE[rank - 1];
      const up = el('button', 'btn gold', `<span>Améliorer<small>éclats ${own.frags}/${cost.frags} · ${cost.gold} or</small></span>`);
      up.disabled = own.frags < cost.frags || state.gold < cost.gold;
      up.onclick = () => upgrade(id);
      act.appendChild(up);
    } else {
      act.appendChild(el('p', 'muted', `Rang maximum ! Éclats : ${own.frags}`));
    }
    const inTeam = state.team.includes(id);
    const tb = el('button', 'btn' + (inTeam ? ' red' : ''), inTeam ? 'Retirer' : 'Dans l’équipe');
    tb.disabled = inTeam ? state.team.length <= 1 : state.team.length >= 3;
    tb.onclick = () => {
      if (inTeam) state.team.splice(state.team.indexOf(id), 1);
      else state.team.push(id);
      save();
      renderTeam();
    };
    act.appendChild(tb);
  }
  box.appendChild(d);
}

async function upgrade(id) {
  const own = state.owned[id], cost = UPGRADE[own.rank - 1];
  if (own.frags < cost.frags || state.gold < cost.gold) return;
  own.frags -= cost.frags;
  state.gold -= cost.gold;
  own.rank++;
  save();
  sfx('levelUp');
  refresh();
  const s = $('#team-detail .stage');
  for (let i = 0; i < 6; i++) {
    s.classList.toggle('flash');
    await wait(90);
  }
  s.classList.remove('flash');
}

// ---------------------------------------------------------------- invocation

function renderSummon() {
  const altar = $('#summon-altar');
  altar.innerHTML = '';
  altar.appendChild(spriteCanvas('crystal', crystalSprite, 4));
  const line = el('div', 'lineup');
  HERO_IDS.forEach((id) => line.appendChild(state.owned[id] ? heroCanvas(id, 1, 2) : lockedCanvas(id, 1, 2)));
  altar.appendChild(line);

  const info = $('#summon-info');
  info.innerHTML = '';
  info.appendChild(el('div', 'h', 'Autel d’invocation'));
  info.appendChild(el('p', 'muted', 'Chaque invocation donne un héros. Un doublon donne un éclat pour monter de rang.'));
  for (const [k, r] of Object.entries(RARITY)) {
    const row = el('div', 'rate');
    row.appendChild(starsRow(k, 2));
    row.appendChild(el('b', '', `${r.name} · ${Math.round(r.rate * 100)} %`));
    info.appendChild(row);
  }
  const left = GACHA.pity - state.pity;
  info.appendChild(el('p', '', `Légendaire garantie dans <b>${left}</b> invocation${left > 1 ? 's' : ''}`));
  info.appendChild(segBar(state.pity / GACHA.pity, 'pity', 20));
  const row = el('div', 'pull-row');
  const b1 = el('button', 'btn', `<b>Invoquer ×1</b><small>${GACHA.single} or</small>`);
  const b10 = el('button', 'btn gold', `<b>Invoquer ×10</b><small>${GACHA.multi} or · 1 Rare min.</small>`);
  b1.disabled = state.gold < GACHA.single;
  b10.disabled = state.gold < GACHA.multi;
  b1.onclick = () => pull(1);
  b10.onclick = () => pull(10);
  row.append(b1, b10);
  info.appendChild(row);
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
    if (isNew) state.owned[id] = { rank: 1, frags: 0 };
    else state.owned[id].frags++;
    results.push({ id, rar, isNew });
  }
  save();
  $$('.gold-amt').forEach((g) => (g.textContent = state.gold));
  reveal(results);
}

// Révélation : dos de carte qui clignote par paliers, puis la face.
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
    const b = el('div', `card back b-${r.rar === 'L' && Math.random() < 0.5 ? 'R' : r.rar}`);
    grid.appendChild(b);
    return b;
  });
  for (let i = 0; i < results.length; i++) {
    const r = results[i], back = backs[i];
    if (!skip) {
      const blinks = r.rar === 'L' ? 8 : r.rar === 'R' ? 4 : 2;
      for (let b = 0; b < blinks && !skip; b++) {
        back.classList.toggle('blink');
        if (r.rar === 'L' && b === 3) back.className = 'card back b-L blink';
        sfx('card');
        await wait(110);
      }
    }
    const face = card(r.id, { badge: r.isNew ? 'NEW' : '+1', k: results.length > 1 ? 2 : 4 });
    face.classList.add('flash-' + r.rar);
    back.replaceWith(face);
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

function startBattle(n) {
  const st = stage(n);
  closeModal(false);
  show('battle');
  const cv = $('#b-canvas'), dpr = DPR();
  // échelle entière la plus grande, puis scène élargie pour remplir l'écran
  const s = Math.max(1, Math.floor(Math.min((innerWidth * dpr) / W, (innerHeight * dpr) / H)));
  const width = Math.max(W, Math.min(320, Math.floor((innerWidth * dpr) / s)));
  cv.width = width;
  cv.height = H;
  fitCanvas(cv, width, H, innerWidth, innerHeight, false);
  $('#b-stage').textContent = `Étape ${n} · ${st.chapter.name}`;
  battle = new Battle({
    canvas: cv, width, team: state.team, stage: st, owned: state.owned,
    ui: { log: (t) => ($('#b-log').textContent = t), beginChoice: showArc, endChoice: hideArc },
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
    a.append(medal('auto'), el('span', 'tag', 'Auto'));
    s.append(medal('speed'), el('span', 'tag', '×1'));
    f.append(medal('flee', 'stone'), el('span', 'tag', 'Fuir'));
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

// Menu d'actions qui flotte en arc autour du héros actif.
function showArc(u) {
  const arc = $('#b-arc'), cv = $('#b-canvas');
  arc.innerHTML = '';
  const p = battle.screenPos(u);
  arc.style.left = cv.offsetLeft + p.x + 'px';
  arc.style.top = cv.offsetTop + p.y + 'px';
  const single = u.skill.kind === 'single';
  const items = [
    { ico: 'attack', label: 'Attaque', go: () => pickTarget(u, 'attack') },
    { ico: u.id, label: u.skill.name, cd: u.cd, go: () => (single ? pickTarget(u, 'skill') : battle.submit({ type: 'skill' })) },
    { ico: 'guard', label: 'Garde', go: () => battle.submit({ type: 'guard' }) },
  ];
  placeArc(arc, items, cv.offsetTop + p.y);
}

// Cherche l'arc (rayon + rotation) qui reste à l'écran sans recouvrir les autres combattants.
function placeArc(arc, items, cy) {
  const cv = $('#b-canvas'), k = cv.clientWidth / battle.W, cx = parseFloat(arc.style.left);
  const others = [...battle.heroes, ...battle.enemies].filter((u) => u.alive && u !== battle.active).map((u) => ({
    x0: cv.offsetLeft + u.sx * k, y0: cv.offsetTop + u.sy * k, x1: cv.offsetLeft + (u.sx + u.bm.w) * k, y1: cv.offsetTop + (u.by + 6) * k,
  }));
  let best = null;
  for (const gap of items.length === 3 ? [44, 38, 34] : [24])
  for (const R of [100, 116, 132])
    for (let shift = -70; shift <= 70; shift += 5) {
      const spread = items.length === 3 ? [-gap, 0, gap] : [-gap, gap];
      let pen = Math.abs(shift) / 100 + R / 1000 + (46 - gap) / 50;
      const pts = spread.map((a) => {
        const r = ((a + shift) * Math.PI) / 180;
        return [Math.round(R * Math.cos(r)), Math.round(R * Math.sin(r))];
      });
      for (const [x, y] of pts) {
        const ax = cx + x, ay = cy + y; // médaillon 48×48 + étiquette dessous
        if (ay - 26 < 64 || ay + 26 > innerHeight - 4 || ax + 140 > innerWidth) pen += 100;
        for (const o of others) if (ax + 120 > o.x0 && ax - 26 < o.x1 && ay + 24 > o.y0 && ay - 24 < o.y1) pen += 10;
      }
      if (!best || pen < best.pen) best = { pen, pts };
    }
  items.forEach((it, i) => {
    const [x, y] = best.pts[i];
    it.x = x;
    it.y = y;
  });
  items.forEach((it, i) => {
    const b = el('button', 'medal float');
    b.appendChild(medal(it.ico, it.tone || 'gold'));
    b.appendChild(el('span', 'tag', it.label));
    if (it.cd) {
      b.disabled = true;
      b.appendChild(el('span', 'cd', String(it.cd)));
    }
    b.onclick = it.go;
    const { x, y } = it;
    // apparition en 3 sauts depuis le héros (pas de glissement doux)
    [0.35, 0.7, 1].forEach((f, j) => setTimeout(() => {
      b.style.left = Math.round(x * f) + 'px';
      b.style.top = Math.round(y * f) + 'px';
    }, j * 45));
    b.style.left = '0px';
    b.style.top = '0px';
    arc.appendChild(b);
  });
}

function hideArc() {
  $('#b-arc').innerHTML = '';
}

// Choix de la cible : coins de visée sur les ennemis, on touche celui qu'on veut.
function pickTarget(u, type) {
  const foes = battle.alive('e');
  if (foes.length === 1) return battle.submit({ type, target: foes[0] });
  const arc = $('#b-arc');
  arc.innerHTML = '';
  placeArc(arc, [
    { ico: type === 'attack' ? 'attack' : u.id, label: 'Touche un ennemi', go: () => {} },
    { ico: 'cancel', label: 'Annuler', tone: 'stone', go: () => { battle.targeting = null; showArc(u); } },
  ], parseFloat(arc.style.top));
  battle.log('Choisis une cible.');
  battle.targeting = foes;
  battle.onTargetTap = (t) => {
    battle.targeting = null;
    battle.onTargetTap = null;
    sfx('select');
    battle.submit({ type, target: t });
  };
}

function closeBattle() {
  battle?.stop();
  battle = null;
  clearInterval(queueTimer);
  hideArc();
  closeModal(false);
  show('camp');
}

function endBattle(st, res) {
  const box = el('div');
  if (res === 'win') {
    const first = st.n > state.best;
    const gain = st.gold + (first ? st.firstGold : 0);
    state.gold += gain;
    if (first) state.best = st.n;
    save();
    sfx('win');
    box.innerHTML = `<div class="big-title">Victoire !</div><p style="text-align:center"><b>+${gain} or</b>${first ? '<br><span class="muted">bonus du premier passage</span>' : ''}</p>`;
    modal(box, [['Camp', closeBattle], ['Étape suivante', () => { closeBattle(); startBattle(state.best + 1); }, 'gold']]);
  } else {
    sfx('lose');
    box.innerHTML = `<div class="big-title lose">Défaite…</div><p style="text-align:center">Améliore tes héros ou change d’équipe.</p>`;
    modal(box, [['Camp', closeBattle], ['Réessayer', () => { closeBattle(); startBattle(st.n); }, 'gold']]);
  }
}

addEventListener('resize', () => {
  if (screen === 'battle' && battle) {
    fitCanvas($('#b-canvas'), battle.W, H, innerWidth, innerHeight, false);
    if ($('#b-arc').firstChild && battle.active) showArc(battle.active);
  } else if (screen === 'camp') drawCamp();
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
  if (b.closest('#b-arc')) { sfx('select'); haptic(15); } else { sfx('blip'); haptic(8); }
}, true);
addEventListener('touchend', unlock, { passive: true });
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').classList.contains('hidden')) closeModal(screen !== 'battle');
});

// ---------------------------------------------------------------- démarrage

setSound(state.sound);
setHaptics(state.haptics);
document.fonts?.ready.then(() => show(screen));
show('camp');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
