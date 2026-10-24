import { HEROES, HERO_IDS, RARITY, RANK_NAMES, UPGRADE, GACHA, DAILY_GOLD, heroStats, stage } from './data.js';
import { heroSprite, coinSprite } from './sprites.js';
import { spriteCanvas } from './render.js';
import { state, save, resetSave } from './state.js';
import { Battle, W, H } from './battle.js';
import { sfx, haptic, unlock, setSound, setHaptics } from './sfx.js';

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const LOCKED = '#2a2238';

const heroCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}`, () => heroSprite(id, rank), k);
const lockedCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}-lock`, () => heroSprite(id, rank).silhouette(LOCKED), k);

// ---------------------------------------------------------------- navigation

let current = 'combat';
function show(name) {
  current = name;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('hidden', s.id !== 'scr-' + name));
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.scr === name));
  refresh();
}
document.querySelectorAll('#tabs button').forEach((b) => (b.onclick = () => show(b.dataset.scr)));

function refresh() {
  $('#gold').textContent = state.gold;
  ({ combat: renderCombat, gacha: renderGacha, collection: renderCollection, team: renderTeam })[current]();
}

// ---------------------------------------------------------------- cartes

function rankPips(rank) {
  const d = el('div', 'pips');
  for (let i = 1; i <= 5; i++) d.appendChild(el('i', i <= rank ? 'on' : ''));
  return d;
}

function card(id, opts = {}) {
  const h = HEROES[id], own = state.owned[id];
  const c = el('button', `card r-${h.rarity}${own ? '' : ' locked'}`);
  c.appendChild(el('div', 'card-name', own ? h.name : '???'));
  const art = el('div', 'card-art');
  const k = opts.k || 3;
  art.appendChild(own ? heroCanvas(id, own.rank, k) : lockedCanvas(id, 1, k));
  c.appendChild(art);
  c.appendChild(el('div', 'card-cls', h.cls));
  if (own) c.appendChild(rankPips(own.rank));
  else c.appendChild(el('div', 'card-cls', RARITY[h.rarity].name));
  if (opts.badge) c.appendChild(el('div', 'badge', opts.badge));
  return c;
}

// ---------------------------------------------------------------- combat

const today = () => new Date().toISOString().slice(0, 10);

function renderCombat() {
  const s = $('#scr-combat');
  s.innerHTML = '';
  const team = el('div', 'panel team-strip');
  state.team.forEach((id) => team.appendChild(heroCanvas(id, state.owned[id].rank, 3)));
  s.appendChild(team);

  if (state.lastDaily !== today()) {
    const b = el('button', 'btn gold-btn', `Bonus du jour : +${DAILY_GOLD} or`);
    b.onclick = () => {
      state.lastDaily = today();
      state.gold += DAILY_GOLD;
      sfx('coin');
      save();
      refresh();
    };
    s.appendChild(b);
  }

  const next = stage(state.best + 1);
  const go = el('button', 'btn big', `Étape ${next.n}${next.boss ? ' · BOSS' : ''}<small>${next.chapter.name} · +${next.gold + next.firstGold} or</small>`);
  go.onclick = () => startBattle(next.n);
  s.appendChild(go);

  if (state.best > 0) {
    s.appendChild(el('h3', '', 'Rejouer une étape'));
    const list = el('div', 'stage-list');
    for (let n = state.best; n >= 1; n--) {
      const st = stage(n);
      const b = el('button', 'btn row', `<span>Étape ${n}${st.boss ? ' · BOSS' : ''}</span><span>${st.chapter.name} · +${st.gold}</span>`);
      b.onclick = () => startBattle(n);
      list.appendChild(b);
    }
    s.appendChild(list);
  }

  const opts = el('div', 'b-opts');
  const tog = (label, key, apply) => {
    const b = el('button', 'btn ghost', `${label} : ${state[key] ? 'oui' : 'non'}`);
    b.onclick = () => {
      state[key] = !state[key];
      apply(state[key]);
      save();
      refresh();
    };
    return b;
  };
  opts.append(tog('Sons', 'sound', setSound), tog('Vibrations', 'haptics', setHaptics));
  s.appendChild(opts);

  const reset = el('button', 'btn ghost', 'Effacer la sauvegarde');
  reset.onclick = () => ask('Tout effacer et recommencer ?', () => { resetSave(); refresh(); });
  s.appendChild(reset);
}

let battle = null;
function startBattle(n) {
  const st = stage(n);
  const ov = $('#battle');
  ov.classList.remove('hidden');
  const cv = $('#b-canvas');
  cv.width = W;
  cv.height = H;
  sizeScreen();
  const ui = { log: $('#b-log'), attack: $('#b-attack'), skill: $('#b-skill'), skillName: $('#b-skill-name') };
  $('#b-auto').classList.remove('on');
  $('#b-auto-label').textContent = 'SELECT · AUTO';
  $('#b-speed-label').textContent = 'START · ×1';
  battle = new Battle({
    canvas: cv, ui, team: state.team, stage: st, owned: state.owned,
    onEnd: (res) => endBattle(st, res),
  });
  battle.run();
}

// Écran le plus grand possible, à une échelle entière en pixels physiques (net sur Retina).
function sizeScreen() {
  const cv = $('#b-canvas'), dpr = window.devicePixelRatio || 1, gb = $('.gb');
  // Hauteur prise par tout le reste de la console (mesurée, donc juste sur chaque iPhone).
  const pad = parseFloat(getComputedStyle(gb).paddingTop) + parseFloat(getComputedStyle(gb).paddingBottom);
  const used = [...gb.children].reduce((h, c) => h + c.offsetHeight, 0) - cv.offsetHeight + pad;
  const availW = Math.min(innerWidth, 480) - 30;
  const availH = innerHeight - used - 24;
  const s = Math.max(dpr, Math.floor(Math.min(availW / W, availH / H) * dpr));
  cv.style.width = (W * s) / dpr + 'px';
  cv.style.height = (H * s) / dpr + 'px';
  $('#b-log').style.width = cv.style.width;
}
addEventListener('resize', () => battle && sizeScreen());

const press = (fn) => () => battle && !battle.over && fn(battle);
$('#b-attack').onclick = press((b) => b.choose('attack'));
$('#b-skill').onclick = press((b) => b.choose('skill'));
document.querySelectorAll('.dpad button').forEach((d) => (d.onclick = press((b) => b.cycleTarget(+d.dataset.d))));
$('#b-auto').onclick = press((b) => {
  b.setAuto(!b.auto);
  $('#b-auto').classList.toggle('on', b.auto);
  $('#b-auto-label').textContent = b.auto ? 'SELECT · AUTO ON' : 'SELECT · AUTO';
});
$('#b-speed').onclick = press((b) => {
  b.speed = b.speed === 1 ? 2 : 1;
  $('#b-speed-label').textContent = 'START · ×' + b.speed;
});
$('#b-flee').onclick = () => battle && ask('Éteindre la console et fuir le combat ?', () => closeBattle());

// Clavier (ordinateur) : flèches = cible, X/Entrée = A, Z = B.
addEventListener('keydown', (e) => {
  if (!battle || !$('#modal').classList.contains('hidden')) return;
  const k = e.key.toLowerCase();
  if (k === 'arrowleft' || k === 'arrowup') $('.dpad .left').click();
  else if (k === 'arrowright' || k === 'arrowdown') $('.dpad .right').click();
  else if (k === 'x' || k === 'enter') $('#b-attack').click();
  else if (k === 'z') $('#b-skill').click();
});

function closeBattle() {
  battle?.stop();
  battle = null;
  $('#battle').classList.add('hidden');
  refresh();
}

function endBattle(st, res) {
  let html, actions;
  if (res === 'win') {
    const first = st.n > state.best;
    const gain = st.gold + (first ? st.firstGold : 0);
    state.gold += gain;
    if (first) state.best = st.n;
    save();
    sfx('win');
    html = `<h2 class="win">Victoire !</h2><p>+${gain} or${first ? ' (bonus premier passage)' : ''}</p>`;
    actions = [['Continuer', () => closeBattle()], ['Étape suivante', () => { closeBattle(); startBattle(state.best + 1); }]];
  } else {
    sfx('lose');
    html = `<h2 class="lose">Défaite…</h2><p>Améliore tes persos ou change d'équipe.</p>`;
    actions = [['Retour', () => closeBattle()], ['Réessayer', () => { closeBattle(); startBattle(st.n); }]];
  }
  modal(html, actions);
}

// ---------------------------------------------------------------- gacha

function renderGacha() {
  const s = $('#scr-gacha');
  s.innerHTML = '';
  const p = el('div', 'panel center');
  p.appendChild(el('h2', '', 'Invocation'));
  const row = el('div', 'hero-row');
  HERO_IDS.forEach((id) => row.appendChild(state.owned[id] ? heroCanvas(id, 1, 2) : lockedCanvas(id, 1, 2)));
  p.appendChild(row);
  p.appendChild(el('p', 'small', Object.values(RARITY).map((r) => `<b style="color:${r.color}">${r.name}</b> ${Math.round(r.rate * 100)} %`).join(' · ')));
  p.appendChild(el('p', 'small', `Légendaire garantie dans <b>${GACHA.pity - state.pity}</b> invocations · ×10 : au moins une Rare`));
  s.appendChild(p);
  const b1 = el('button', 'btn big', `Invoquer ×1<small>${GACHA.single} or</small>`);
  const b10 = el('button', 'btn big gold-btn', `Invoquer ×10<small>${GACHA.multi} or</small>`);
  b1.disabled = state.gold < GACHA.single;
  b10.disabled = state.gold < GACHA.multi;
  b1.onclick = () => pull(1);
  b10.onclick = () => pull(10);
  s.append(b1, b10);
  s.appendChild(el('p', 'small center', `Doublon = +1 éclat pour monter de rang. Invocations totales : ${state.pulls}`));
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
  reveal(results);
}

// Révélation : dos de carte qui clignote par paliers, puis la face.
async function reveal(results) {
  const ov = $('#reveal');
  const grid = $('#reveal-grid');
  grid.innerHTML = '';
  grid.className = results.length > 1 ? 'grid10' : 'grid1';
  ov.classList.remove('hidden');
  const done = $('#reveal-ok');
  done.textContent = 'Tout révéler';
  let skip = false;
  done.onclick = () => { skip = true; };
  const slots = results.map((r) => {
    // Les Légendaires se cachent parfois derrière un dos de Rare.
    const back = el('div', `card back b-${r.rar === 'L' && Math.random() < 0.5 ? 'R' : r.rar}`);
    grid.appendChild(back);
    return back;
  });
  for (let i = 0; i < results.length; i++) {
    const r = results[i], back = slots[i];
    if (!skip) {
      const blinks = r.rar === 'L' ? 8 : r.rar === 'R' ? 4 : 2;
      for (let b = 0; b < blinks && !skip; b++) {
        back.classList.toggle('blink');
        sfx('card');
        if (r.rar === 'L' && b === 3) back.className = 'card back b-L blink';
        await wait(110);
      }
    }
    const face = card(r.id, { badge: r.isNew ? 'NEW' : '+1', k: results.length > 1 ? 2 : 4 });
    face.classList.add('flash-' + r.rar);
    back.replaceWith(face);
    sfx(r.rar === 'L' ? 'legend' : r.rar === 'R' ? 'rare' : 'blip');
    if (!skip) await wait(r.rar === 'C' ? 120 : 350);
  }
  done.textContent = 'OK';
  done.onclick = () => {
    ov.classList.add('hidden');
    refresh();
  };
}

// ---------------------------------------------------------------- collection

function renderCollection() {
  const s = $('#scr-collection');
  s.innerHTML = '';
  const g = el('div', 'cards');
  HERO_IDS.forEach((id) => {
    const own = state.owned[id];
    const canUp = own && own.rank < 5 && own.frags >= UPGRADE[own.rank - 1].frags;
    const c = card(id, { badge: canUp ? '▲' : null });
    c.onclick = () => heroSheet(id);
    g.appendChild(c);
  });
  s.appendChild(g);
}

function heroSheet(id) {
  const h = HEROES[id], own = state.owned[id];
  const body = el('div', 'sheet');
  const art = el('div', 'sheet-art');
  art.appendChild(own ? heroCanvas(id, own.rank, 6) : lockedCanvas(id, 1, 6));
  body.appendChild(art);
  body.appendChild(el('h2', '', `${own ? h.name : '???'} <small style="color:${RARITY[h.rarity].color}">${RARITY[h.rarity].name}</small>`));
  body.appendChild(el('p', 'small', `${h.cls}${own ? ' · Rang ' + own.rank + ' — ' + RANK_NAMES[own.rank - 1] : ' · non débloqué'}`));
  const rank = own ? own.rank : 1, st = heroStats(id, rank);
  body.appendChild(el('div', 'stats', `<span>PV ${st.hp}</span><span>ATQ ${st.atk}</span><span>DÉF ${st.def}</span><span>VIT ${st.spd}</span>`));
  body.appendChild(el('p', '', `<b>${h.skill.name}</b> (recharge ${h.skill.cd}) — ${h.skill.desc}`));
  const ranks = el('div', 'hero-row');
  for (let r = 1; r <= 5; r++) ranks.appendChild(own && r <= own.rank ? heroCanvas(id, r, 2) : lockedCanvas(id, r, 2));
  body.appendChild(ranks);

  const actions = [['Fermer', closeModal]];
  if (own && own.rank < 5) {
    const cost = UPGRADE[own.rank - 1];
    body.appendChild(el('p', 'small center', `Rang ${own.rank + 1} : éclats ${own.frags}/${cost.frags} · ${cost.gold} or`));
    const ok = own.frags >= cost.frags && state.gold >= cost.gold;
    actions.push([`Améliorer`, ok ? () => upgrade(id) : null]);
  } else if (own) {
    body.appendChild(el('p', 'small center', `Rang maximum ! Éclats en réserve : ${own.frags}`));
  }
  modal(body, actions);
}

async function upgrade(id) {
  const own = state.owned[id], cost = UPGRADE[own.rank - 1];
  if (own.frags < cost.frags || state.gold < cost.gold) return;
  own.frags -= cost.frags;
  state.gold -= cost.gold;
  own.rank++;
  sfx('levelUp');
  save();
  heroSheet(id);
  const art = $('#modal .sheet-art');
  for (let i = 0; i < 6; i++) {
    art.classList.toggle('blink');
    await wait(90);
  }
  art.classList.remove('blink');
  $('#gold').textContent = state.gold;
}

// ---------------------------------------------------------------- équipe

function renderTeam() {
  const s = $('#scr-team');
  s.innerHTML = '';
  const slots = el('div', 'panel team-strip');
  for (let i = 0; i < 3; i++) {
    const id = state.team[i];
    const slot = el('div', 'slot');
    if (id) slot.appendChild(heroCanvas(id, state.owned[id].rank, 3));
    else slot.appendChild(el('span', 'small', 'vide'));
    slots.appendChild(slot);
  }
  s.appendChild(slots);
  s.appendChild(el('p', 'small center', 'Touche un perso pour l’ajouter ou le retirer (3 max).'));
  const g = el('div', 'cards');
  HERO_IDS.filter((id) => state.owned[id]).forEach((id) => {
    const pos = state.team.indexOf(id);
    const c = card(id, { badge: pos >= 0 ? String(pos + 1) : null });
    if (pos >= 0) c.classList.add('picked');
    c.onclick = () => {
      if (pos >= 0) {
        if (state.team.length > 1) state.team.splice(pos, 1);
      } else if (state.team.length < 3) state.team.push(id);
      save();
      refresh();
    };
    g.appendChild(c);
  });
  s.appendChild(g);
}

// ---------------------------------------------------------------- fenêtres

function modal(content, actions) {
  const box = $('#modal-body');
  box.innerHTML = '';
  if (typeof content === 'string') box.innerHTML = content;
  else box.appendChild(content);
  const row = el('div', 'actions');
  for (const [label, fn] of actions) {
    const b = el('button', 'btn', label);
    if (fn) b.onclick = fn;
    else b.disabled = true;
    row.appendChild(b);
  }
  box.appendChild(row);
  $('#modal').classList.remove('hidden');
}

function closeModal() {
  $('#modal').classList.add('hidden');
  refresh();
}

function ask(question, yes) {
  modal(`<p>${question}</p>`, [['Non', () => $('#modal').classList.add('hidden')], ['Oui', () => { $('#modal').classList.add('hidden'); yes(); }]]);
}

// Les boutons d'action ferment la fenêtre avant d'agir (sauf l'amélioration, qui la redessine).
$('#modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal' && !battle) closeModal();
});
$('#modal-body').addEventListener('click', (e) => {
  const b = e.target.closest('.actions .btn');
  if (b && !b.disabled && b.textContent !== 'Améliorer') $('#modal').classList.add('hidden');
}, true);

// ---------------------------------------------------------------- démarrage

$('#coin').appendChild(spriteCanvas('coin', coinSprite, 2));
setSound(state.sound);
setHaptics(state.haptics);

// Chaque touche : son + vibration. Sur iPhone, l'audio ne démarre qu'après un premier toucher.
addEventListener('pointerdown', unlock, { capture: true });
document.addEventListener('click', (e) => {
  unlock();
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  if (b.closest('.dpad')) { sfx('move'); haptic(8); }
  else if (b.closest('.cap')) { sfx('select'); haptic(15); }
  else if (b.closest('.pill, .gb-power')) { sfx('tick'); haptic(10); }
  else { sfx('blip'); haptic(8); }
}, true);

show('combat');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
