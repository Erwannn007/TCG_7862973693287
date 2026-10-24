// Interface : tout le jeu tourne dans l'écran de la console « Pixel Boy ».
import { HEROES, HERO_IDS, RARITY, RANK_NAMES, UPGRADE, GACHA, DAILY_GOLD, heroStats, stage } from './data.js';
import { heroSprite, enemySprite, coinSprite, iconSprite, starSprite, crystalSprite } from './sprites.js';
import { spriteCanvas, bitmap, drawFx } from './render.js';
import { state, save, resetSave } from './state.js';
import { Battle, W, H, drawBackground } from './battle.js';
import { sfx, haptic, unlock, setSound, setHaptics } from './sfx.js';

const $ = (sel) => document.querySelector(sel);
// La police pixel n'a pas de capitales accentuées : on écrit les majuscules sans accent.
const up = (t) => t.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const LOCKED = '#1a1320';
const RAR_STARS = { C: 1, R: 2, L: 3 };
const TITLES = { team: 'EQUIPE', home: 'COMBAT', gacha: 'INVOQUER' };
const TAB_ORDER = ['team', 'home', 'gacha'];

const heroCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}`, () => heroSprite(id, rank), k);
const lockedCanvas = (id, rank, k) => spriteCanvas(`h-${id}-${rank}-lock`, () => heroSprite(id, rank).silhouette(LOCKED), k);

function starsRow(rar) {
  const d = el('div', 'stars');
  for (let i = 0; i < RAR_STARS[rar]; i++) d.appendChild(spriteCanvas('star', starSprite, 2));
  return d;
}
function rankPips(rank) {
  const d = el('div', 'pips');
  for (let i = 1; i <= 5; i++) d.appendChild(el('i', i <= rank ? 'on' : ''));
  return d;
}
function win(title, cls = '') {
  const w = el('div', `win has-ttl ${cls}`);
  w.appendChild(el('span', 'ttl', title));
  return w;
}

// ---------------------------------------------------------------- navigation entre écrans

let view = 'home';

function show(name) {
  view = name;
  for (const v of TAB_ORDER) $('#v-' + v).classList.toggle('hidden', v !== name);
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
  $('#hud-title').textContent = TITLES[name];
  clearFocus();
  refresh();
  $('#v-' + name).scrollTop = 0;
}

function refresh() {
  $('#gold').textContent = state.gold;
  if (view === 'battle') return;
  ({ team: renderTeam, home: renderHome, gacha: renderGacha })[view]();
  updateKeys();
}

document.querySelectorAll('#tabs button').forEach((b) => {
  const ico = { team: 'team', home: 'combat', gacha: 'invoke' }[b.dataset.tab];
  b.querySelector('.ico').appendChild(spriteCanvas('ico-' + ico, () => iconSprite(ico), 2));
  b.onclick = () => show(b.dataset.tab);
});

// ---------------------------------------------------------------- cartes

function card(id, opts = {}) {
  const h = HEROES[id], own = state.owned[id], k = opts.k || 3;
  const c = el('button', `card r-${h.rarity}${own ? '' : ' locked'}`);
  const sc = el('div', own ? 'scene' : 'scene night');
  sc.appendChild(own ? heroCanvas(id, own.rank, k) : lockedCanvas(id, 1, k));
  c.appendChild(sc);
  c.appendChild(el('div', 'name', own ? up(h.name) : '???'));
  c.appendChild(starsRow(h.rarity));
  if (own) c.appendChild(rankPips(own.rank));
  if (opts.badge) c.appendChild(el('div', 'badge' + (opts.blink ? ' up' : ''), opts.badge));
  return c;
}

const canUpgrade = (id) => {
  const o = state.owned[id];
  return o && o.rank < 5 && o.frags >= UPGRADE[o.rank - 1].frags;
};

// ---------------------------------------------------------------- EQUIPE (gauche)

function renderTeam() {
  const v = $('#v-team');
  v.innerHTML = '';
  const w = win('MON EQUIPE', 'dark');
  const slots = el('div', 'slots');
  for (let i = 0; i < 3; i++) {
    const id = state.team[i];
    const s = el('button', 'slot' + (id ? '' : ' empty'));
    const sc = el('div', 'scene');
    if (id) sc.appendChild(heroCanvas(id, state.owned[id].rank, 3));
    else sc.textContent = 'VIDE';
    s.appendChild(sc);
    s.appendChild(el('span', '', id ? up(HEROES[id].name) : '-'));
    s.onclick = () => (id ? heroSheet(id) : null);
    slots.appendChild(s);
  }
  w.appendChild(slots);
  v.appendChild(w);

  const owned = HERO_IDS.filter((id) => state.owned[id]).length;
  const r = win(`HEROS ${owned}/${HERO_IDS.length}`, 'dark');
  const g = el('div', 'cards');
  for (const id of HERO_IDS) {
    const pos = state.team.indexOf(id);
    const c = card(id, canUpgrade(id) ? { badge: 'UP', blink: true } : pos >= 0 ? { badge: String(pos + 1) } : {});
    if (pos >= 0) c.classList.add('picked');
    c.onclick = () => heroSheet(id);
    g.appendChild(c);
  }
  r.appendChild(g);
  v.appendChild(r);
  v.appendChild(el('p', 'muted center', 'Touche un héros pour le voir,<br>l’améliorer ou le mettre<br>dans l’équipe.'));
}

function heroSheet(id) {
  const h = HEROES[id], own = state.owned[id], rank = own ? own.rank : 1, st = heroStats(id, rank);
  const body = el('div', 'sheet');
  const sc = el('div', own ? 'scene' : 'scene night');
  sc.appendChild(own ? heroCanvas(id, rank, 5) : lockedCanvas(id, 1, 5));
  body.appendChild(sc);

  const head = el('div', 'row');
  head.appendChild(el('h2', '', own ? up(h.name) : '???'));
  head.appendChild(starsRow(h.rarity));
  body.appendChild(head);
  body.appendChild(el('p', '', `${up(h.cls)} · <span style="color:${h.rarity === 'C' ? '#5e6a80' : RARITY[h.rarity].color}">${up(RARITY[h.rarity].name)}</span>`));
  if (own) {
    const rr = el('div', 'row');
    rr.appendChild(el('span', '', `RANG ${rank} · ${up(RANK_NAMES[rank - 1])}`));
    rr.appendChild(rankPips(rank));
    body.appendChild(rr);
  }

  for (const [label, val, max, cls] of [['PV', st.hp, 260, 'hp'], ['ATQ', st.atk, 75, ''], ['DEF', st.def, 25, ''], ['VIT', st.spd, 25, '']]) {
    const s = el('div', 'stat');
    s.appendChild(el('span', '', label));
    const bar = el('div', 'bar ' + cls);
    const fill = el('i');
    fill.style.width = Math.round(Math.min(1, val / max) * 25) * 4 + '%';
    bar.appendChild(fill);
    s.appendChild(bar);
    s.appendChild(el('span', '', String(val)));
    body.appendChild(s);
  }

  const sk = el('div', 'win dark');
  sk.innerHTML = `<span class="gold-t">${up(h.skill.name)}</span><br><br>${h.skill.desc}<br><span class="muted">Recharge : ${h.skill.cd} tours</span>`;
  body.appendChild(sk);

  const ranks = el('div', 'ranks');
  for (let r = 1; r <= 5; r++) {
    const d = el('div');
    d.appendChild(own && r <= rank ? heroCanvas(id, r, 2) : lockedCanvas(id, r, 2));
    d.appendChild(el('span', own && r <= rank ? '' : 'muted', 'R' + r));
    ranks.appendChild(d);
  }
  body.appendChild(ranks);

  const actions = [];
  if (!own) {
    body.appendChild(el('p', 'center muted', 'A obtenir en invoquant !'));
  } else {
    if (rank < 5) {
      const cost = UPGRADE[rank - 1];
      body.appendChild(el('p', 'center', `RANG ${rank + 1} : ECLATS ${own.frags}/${cost.frags} · ${cost.gold} OR`));
      actions.push({ label: 'AMELIORER', cls: 'gold', fn: () => upgrade(id), disabled: own.frags < cost.frags || state.gold < cost.gold });
    } else {
      body.appendChild(el('p', 'center gold-t', `RANG MAX ! ECLATS : ${own.frags}`));
    }
    const inTeam = state.team.includes(id);
    actions.push({
      label: inTeam ? 'RETIRER' : 'EQUIPE +',
      cls: inTeam ? 'red' : '',
      disabled: inTeam ? state.team.length <= 1 : state.team.length >= 3,
      fn: () => {
        if (inTeam) state.team.splice(state.team.indexOf(id), 1);
        else state.team.push(id);
        save();
        heroSheet(id);
      },
    });
  }
  actions.push({ label: 'RETOUR', cls: 'dark', fn: closeModal, back: true });
  modal(body, actions);
}

async function upgrade(id) {
  const own = state.owned[id], cost = UPGRADE[own.rank - 1];
  if (own.frags < cost.frags || state.gold < cost.gold) return;
  own.frags -= cost.frags;
  state.gold -= cost.gold;
  own.rank++;
  save();
  sfx('levelUp');
  heroSheet(id);
  $('#gold').textContent = state.gold;
  const sc = $('#modal .sheet .scene');
  for (let i = 0; i < 6; i++) {
    sc.classList.toggle('flash');
    await wait(90);
  }
  sc.classList.remove('flash');
}

// ---------------------------------------------------------------- COMBAT (centre)

const today = () => new Date().toISOString().slice(0, 10);

function renderHome() {
  const v = $('#v-home');
  v.innerHTML = '';
  const next = stage(state.best + 1);
  const w = win(`CHAPITRE ${Math.floor((next.n - 1) / 10) + 1} · ${up(next.chapter.name)}`, 'dark');
  const pv = el('div', 'preview');
  pv.appendChild(previewCanvas(next));
  w.appendChild(pv);
  const go = el('button', 'pbtn gold', `<span class="big">ETAPE ${next.n}</span><small>${next.boss ? 'BOSS ! · ' : ''}+${next.gold + next.firstGold} OR</small>`);
  go.style.marginTop = '12px';
  go.onclick = () => startBattle(next.n);
  w.appendChild(go);
  v.appendChild(w);

  if (state.lastDaily !== today()) {
    const b = el('button', 'pbtn red', `BONUS DU JOUR<small>+${DAILY_GOLD} OR</small>`);
    b.onclick = () => {
      state.lastDaily = today();
      state.gold += DAILY_GOLD;
      save();
      sfx('coin');
      refresh();
    };
    v.appendChild(b);
  }

  if (state.best > 0) {
    const r = win('REJOUER', 'dark');
    const list = el('div', 'stage-list');
    for (let n = state.best; n >= Math.max(1, state.best - 29); n--) {
      const st = stage(n);
      const b = el('button', 'pbtn dark line', `<span>ETAPE ${n}${st.boss ? ' BOSS' : ''}</span><span class="gold-t">+${st.gold}</span>`);
      b.onclick = () => startBattle(n);
      list.appendChild(b);
    }
    r.appendChild(list);
    v.appendChild(r);
  }

  const o = win('OPTIONS', 'dark');
  const row = el('div', 'btn-row');
  const tog = (label, key, apply) => {
    const b = el('button', 'pbtn dark', `${label}<small>${state[key] ? 'OUI' : 'NON'}</small>`);
    b.onclick = () => {
      state[key] = !state[key];
      apply(state[key]);
      save();
      refresh();
    };
    return b;
  };
  row.append(tog('SONS', 'sound', setSound), tog('VIBRATION', 'haptics', setHaptics));
  o.appendChild(row);
  const reset = el('button', 'pbtn red', 'EFFACER LA PARTIE');
  reset.style.marginTop = '8px';
  reset.style.width = '100%';
  reset.onclick = () => ask('Tout effacer et<br>recommencer ?', () => { resetSave(); show('home'); });
  o.appendChild(reset);
  v.appendChild(o);
}

// Aperçu de l'étape suivante : l'équipe face aux ennemis, sur le décor du chapitre.
function previewCanvas(st) {
  const PH = 56, c = el('canvas', 'px'), dpr = window.devicePixelRatio || 1;
  c.width = W;
  c.height = PH;
  const avail = $('#lcd').clientWidth - 52;
  const s = Math.max(dpr, Math.floor((avail / W) * dpr));
  c.style.width = (W * s) / dpr + 'px';
  c.style.height = (PH * s) / dpr + 'px';
  const g = c.getContext('2d'), bg = drawBackground(st.chapter.bg, W, PH);
  const team = state.team.map((id, i) => ({
    bm: bitmap(`h-${id}-${state.owned[id].rank}`, () => heroSprite(id, state.owned[id].rank)),
    cx: 14 + i * 18, by: 52 - (i % 2) * 6,
  }));
  const n = st.enemies.length;
  const foes = st.enemies.map((e, i) => ({
    bm: bitmap(`e-${e.kind}-${e.variant}`, () => enemySprite(e.kind, e.variant)),
    cx: n === 1 ? 96 : 106 - i * 18, by: 53 - (i % 2) * 6,
  }));
  let step = 0;
  const draw = () => {
    if (step > 0 && !c.isConnected) return;
    g.drawImage(bg, 0, 0);
    [...team, ...foes].forEach((u, i) => {
      const x = u.cx - (u.bm.w >> 1), y = u.by - u.bm.h - ((step + i) % 2);
      g.drawImage(u.bm.canvas, x, y);
      drawFx(g, u.bm, x, y, step);
    });
    step++;
    setTimeout(draw, 400);
  };
  draw();
  return c;
}

// ---------------------------------------------------------------- INVOQUER (droite)

function renderGacha() {
  const v = $('#v-gacha');
  v.innerHTML = '';
  const w = win("AUTEL D'INVOCATION", 'dark');
  const altar = el('div', 'altar');
  altar.appendChild(spriteCanvas('crystal', crystalSprite, 3));
  w.appendChild(altar);
  const line = el('div', 'lineup');
  HERO_IDS.forEach((id) => line.appendChild(state.owned[id] ? heroCanvas(id, 1, 2) : lockedCanvas(id, 1, 2)));
  w.appendChild(line);
  v.appendChild(w);

  const b1 = el('button', 'pbtn', `INVOQUER ×1<small>${GACHA.single} OR</small>`);
  const b10 = el('button', 'pbtn gold', `INVOQUER ×10<small>${GACHA.multi} OR</small>`);
  b1.disabled = state.gold < GACHA.single;
  b10.disabled = state.gold < GACHA.multi;
  b1.onclick = () => pull(1);
  b10.onclick = () => pull(10);
  const row = el('div', 'btn-row');
  row.append(b1, b10);
  v.appendChild(row);

  const t = win('TAUX');
  for (const [k, r] of Object.entries(RARITY)) {
    const rr = el('div', 'row');
    rr.appendChild(starsRow(k));
    rr.appendChild(el('span', '', `${up(r.name)} ${Math.round(r.rate * 100)}%`));
    t.appendChild(rr);
  }
  const left = GACHA.pity - state.pity;
  t.appendChild(el('p', '', `<br>LEGENDAIRE GARANTIE<br>DANS ${left} INVOCATION${left > 1 ? 'S' : ''}`));
  const bar = el('div', 'bar pity');
  const fill = el('i');
  fill.style.width = Math.round((state.pity / GACHA.pity) * 25) * 4 + '%';
  bar.appendChild(fill);
  bar.style.marginTop = '6px';
  t.appendChild(bar);
  t.appendChild(el('p', 'muted', '<br>×10 : au moins une Rare.<br>Doublon : +1 éclat.'));
  v.appendChild(t);
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
  $('#gold').textContent = state.gold;
  reveal(results);
}

// Révélation : dos de carte qui clignote par paliers, puis la face.
async function reveal(results) {
  const ov = $('#reveal'), grid = $('#reveal-grid'), ok = $('#reveal-ok');
  grid.innerHTML = '';
  grid.className = results.length > 1 ? 'grid10' : 'grid1';
  ov.classList.remove('hidden');
  clearFocus();
  ok.textContent = 'TOUT REVELER';
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
    clearFocus();
    refresh();
  };
}

// ---------------------------------------------------------------- combat

let battle = null;

// Les touches A/B de la console servent de boutons d'action au moteur de combat.
const keyProxy = (btn) => ({
  _d: true,
  get disabled() { return this._d; },
  set disabled(v) { this._d = v; btn.classList.toggle('off', v); },
});

function startBattle(n) {
  const st = stage(n);
  view = 'battle';
  closeLayers();
  clearFocus();
  for (const v of TAB_ORDER) $('#v-' + v).classList.add('hidden');
  $('#v-battle').classList.remove('hidden');
  $('#lcd').classList.add('battle');
  const cv = $('#b-canvas');
  cv.width = W;
  cv.height = H;
  sizeBattle();
  const ui = { log: $('#b-log'), attack: keyProxy($('#key-a')), skill: keyProxy($('#key-b')), skillName: $('#label-b') };
  battle = new Battle({ canvas: cv, ui, team: state.team, stage: st, owned: state.owned, onEnd: (res) => endBattle(st, res) });
  updateKeys();
  battle.run();
}

// Écran de combat le plus grand possible, à une échelle entière en pixels physiques.
function sizeBattle() {
  const box = $('#v-battle'), cv = $('#b-canvas'), dpr = window.devicePixelRatio || 1;
  const w = box.clientWidth, h = box.clientHeight - 8 - 68;
  const s = Math.max(dpr, Math.floor(Math.min(w / W, h / H) * dpr));
  cv.style.width = (W * s) / dpr + 'px';
  cv.style.height = (H * s) / dpr + 'px';
  $('#b-log').style.width = cv.style.width;
}
addEventListener('resize', () => battle && sizeBattle());

function closeBattle() {
  battle?.stop();
  battle = null;
  $('#lcd').classList.remove('battle');
  $('#v-battle').classList.add('hidden');
  closeLayers();
  show('home');
}

function endBattle(st, res) {
  const body = el('div', 'sheet center');
  let actions;
  if (res === 'win') {
    const first = st.n > state.best;
    const gain = st.gold + (first ? st.firstGold : 0);
    state.gold += gain;
    if (first) state.best = st.n;
    save();
    sfx('win');
    $('#gold').textContent = state.gold;
    body.innerHTML = `<h2 class="win-title">VICTOIRE !</h2><p>+${gain} OR${first ? '<br><span class="muted">bonus premier passage</span>' : ''}</p>`;
    actions = [
      { label: 'MENU', cls: 'dark', fn: closeBattle, back: true },
      { label: 'SUIVANTE', cls: 'gold', fn: () => { closeBattle(); startBattle(state.best + 1); } },
    ];
  } else {
    sfx('lose');
    body.innerHTML = `<h2 class="lose-title">DEFAITE…</h2><p>Améliore tes héros<br>ou change d’équipe.</p>`;
    actions = [
      { label: 'MENU', cls: 'dark', fn: closeBattle, back: true },
      { label: 'REJOUER', cls: 'gold', fn: () => { closeBattle(); startBattle(st.n); } },
    ];
  }
  modal(body, actions);
}

// ---------------------------------------------------------------- fenêtres dans l'écran

let modalBack = null;

function modal(content, actions) {
  const box = $('#modal-body');
  box.innerHTML = '';
  box.appendChild(content);
  const grid = el('div', 'btn-row');
  modalBack = null;
  actions.forEach((a, i) => {
    const b = el('button', `pbtn ${a.cls || ''}`, a.label);
    b.disabled = !!a.disabled;
    b.onclick = a.fn;
    if (a.back) modalBack = a.fn;
    // nombre impair de boutons : le dernier prend toute la largeur
    if (actions.length % 2 && i === actions.length - 1) b.style.gridColumn = '1 / -1';
    grid.appendChild(b);
  });
  box.appendChild(grid);
  $('#modal').classList.remove('hidden');
  box.scrollTop = 0;
  const hadFocus = !!focused;
  clearFocus();
  if (hadFocus) setFocus(navItems()[0]);
  updateKeys();
}

function closeModal() {
  $('#modal').classList.add('hidden');
  modalBack = null;
  clearFocus();
  refresh();
}

function closeLayers() {
  $('#modal').classList.add('hidden');
  $('#reveal').classList.add('hidden');
  modalBack = null;
}

function ask(question, yes) {
  const hide = () => {
    $('#modal').classList.add('hidden');
    modalBack = null;
    clearFocus();
    updateKeys();
  };
  modal(el('p', 'center', question), [
    { label: 'NON', cls: 'dark', fn: hide, back: true },
    { label: 'OUI', cls: 'red', fn: () => { hide(); yes(); } },
  ]);
}

const layerOpen = () => !$('#modal').classList.contains('hidden') || !$('#reveal').classList.contains('hidden');

// ---------------------------------------------------------------- croix + curseur ▶

let focused = null;

function navItems() {
  let roots;
  if (!$('#reveal').classList.contains('hidden')) roots = [$('#reveal')];
  else if (!$('#modal').classList.contains('hidden')) roots = [$('#modal')];
  else if (view === 'battle') roots = [];
  else roots = [$('#v-' + view), $('#tabs')];
  return roots.flatMap((r) => [...r.querySelectorAll('button')]).filter((b) => !b.disabled && b.offsetParent !== null);
}

function setFocus(b) {
  focused?.classList.remove('focus');
  focused = b || null;
  if (b) {
    b.classList.add('focus');
    b.scrollIntoView({ block: 'nearest' });
  }
}
function clearFocus() {
  setFocus(null);
}

// Déplace le curseur vers l'élément le plus proche dans la direction choisie.
function move(dir) {
  const items = navItems();
  if (!items.length) return;
  if (!focused || !items.includes(focused)) return setFocus(items[0]);
  const r = focused.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let best = null, score = Infinity;
  for (const b of items) {
    if (b === focused) continue;
    const q = b.getBoundingClientRect();
    const x = q.left + q.width / 2 - cx, y = q.top + q.height / 2 - cy;
    const [p, o] = dir === 'left' ? [-x, y] : dir === 'right' ? [x, y] : dir === 'up' ? [-y, x] : [y, x];
    if (p <= 2) continue;
    const sc = p + Math.abs(o) * 2;
    if (sc < score) { score = sc; best = b; }
  }
  if (best) setFocus(best);
}

// ---------------------------------------------------------------- touches de la console

const inBattle = () => view === 'battle' && battle && !battle.over && !layerOpen();

function updateKeys() {
  const fight = inBattle();
  $('#label-a').textContent = fight ? 'ATTAQUE' : 'VALIDER';
  const u = fight && battle.active;
  if (u && u.side === 'h') $('#label-b').textContent = up(u.cd > 0 ? `${u.skill.name} (${u.cd})` : u.skill.name);
  else if (!fight) $('#label-b').textContent = 'RETOUR';
  $('#label-select').textContent = fight ? (battle.auto ? 'AUTO ON' : 'AUTO') : 'ONGLET';
  $('#label-start').textContent = fight ? '×' + battle.speed : 'COMBAT';
  $('#key-select').classList.toggle('on', !!(fight && battle.auto));
  $('#power-label').textContent = view === 'battle' ? 'FUIR' : 'ON';
  $('#power').classList.toggle('armed', view === 'battle');
  if (!fight) {
    $('#key-a').classList.remove('off');
    $('#key-b').classList.remove('off');
  }
}

document.querySelectorAll('.dpad button').forEach((d) => {
  d.onclick = () => {
    const dir = d.dataset.dir;
    if (inBattle()) battle.cycleTarget(dir === 'left' || dir === 'up' ? -1 : 1);
    else move(dir);
  };
});

$('#key-a').onclick = () => {
  if (inBattle()) return battle.choose('attack');
  if (focused && navItems().includes(focused)) focused.click();
  else move('down');
};

$('#key-b').onclick = () => {
  if (inBattle()) return battle.choose('skill');
  if (!$('#reveal').classList.contains('hidden')) return $('#reveal-ok').click();
  if (!$('#modal').classList.contains('hidden')) return modalBack && modalBack();
  if (view === 'team' || view === 'gacha') show('home');
};

$('#key-select').onclick = () => {
  if (inBattle()) {
    battle.setAuto(!battle.auto);
    return updateKeys();
  }
  if (view === 'battle' || layerOpen()) return;
  show(TAB_ORDER[(TAB_ORDER.indexOf(view) + 1) % TAB_ORDER.length]);
};

$('#key-start').onclick = () => {
  if (inBattle()) {
    battle.speed = battle.speed === 1 ? 2 : 1;
    return updateKeys();
  }
  if (view === 'battle' || layerOpen()) return;
  startBattle(state.best + 1);
};

$('#power').onclick = () => {
  if (view === 'battle' && battle && !battle.over && !layerOpen()) ask('Eteindre la console<br>et fuir le combat ?', closeBattle);
};

// Clavier sur ordinateur.
addEventListener('keydown', (e) => {
  const map = {
    arrowup: '.dpad .up', arrowdown: '.dpad .down', arrowleft: '.dpad .left', arrowright: '.dpad .right',
    x: '#key-a', enter: '#key-a', z: '#key-b', escape: '#key-b', backspace: '#key-b', shift: '#key-select', ' ': '#key-start',
  };
  const sel = map[e.key.toLowerCase()];
  if (sel) {
    e.preventDefault();
    $(sel).click();
  }
});

// Son + vibration à chaque vraie pression. Toucher directement l'écran efface le curseur.
document.addEventListener('click', (e) => {
  unlock();
  if (!e.isTrusted) return;
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  if (b.closest('.dpad')) { sfx('move'); haptic(8); }
  else if (b.closest('.cap')) { sfx('select'); haptic(15); }
  else if (b.closest('.pill, .gb-power')) { sfx('tick'); haptic(10); }
  else { sfx('blip'); haptic(8); if (b.closest('#lcd')) clearFocus(); }
}, true);
addEventListener('touchend', unlock, { passive: true });
// Le moteur de combat change les touches en cours de tour : on garde les libellés à jour.
setInterval(() => view === 'battle' && updateKeys(), 250);

// ---------------------------------------------------------------- démarrage

$('#coin').appendChild(spriteCanvas('coin', coinSprite, 2));
setSound(state.sound);
setHaptics(state.haptics);
show('home');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
