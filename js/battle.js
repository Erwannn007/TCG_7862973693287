// Combat au tour par tour, rendu dans un canvas de 120×96 pixels de jeu.
import { HEROES, heroStats } from './data.js';
import { heroSprite, enemySprite } from './sprites.js';
import { bitmap, drawFx, drawText, textWidth } from './render.js';

// 120×108 : le format 10:9 de l'écran d'une console portable.
export const W = 120, H = 108;
const HERO_SLOTS = [[24, 36], [40, 69], [24, 102]];
const ENEMY_SLOTS = [[96, 36], [80, 69], [96, 102]];
const SLOT_ORDER = { 1: [1], 2: [0, 2], 3: [0, 1, 2] };
const WHITE = '#ffffff';

const BG = {
  prairie: { sky: ['#6a9ae0', '#7aaae8', '#8abaf0'], ground: '#4a8a3a', dots: '#5aa04a', line: '#3a7030' },
  crypte: { sky: ['#2a2238', '#322a42', '#3a3048'], ground: '#4a4058', dots: '#5a5068', line: '#3a3048' },
  volcan: { sky: ['#5a2a2a', '#6a322a', '#7a3a2a'], ground: '#3a2a2a', dots: '#ff6a1f', line: '#2a1e22' },
};

function drawBackground(name) {
  const p = BG[name], c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  p.sky.forEach((col, i) => { g.fillStyle = col; g.fillRect(0, i * 5, W, 5); });
  g.fillStyle = p.ground;
  g.fillRect(0, 15, W, H - 15);
  g.fillStyle = p.line;
  g.fillRect(0, 15, W, 1);
  // touffes / pierres placées de façon fixe
  g.fillStyle = p.dots;
  for (let i = 0; i < 40; i++) {
    const x = (i * 37 + 11) % W, y = 18 + ((i * 53) % (H - 20));
    g.fillRect(x, y, 2, 1);
    if (i % 3 === 0) g.fillRect(x + 1, y - 1, 1, 1);
  }
  return c;
}

const rand = (a) => a[Math.floor(Math.random() * a.length)];

export class Battle {
  constructor({ canvas, ui, team, stage, owned, onEnd }) {
    this.g = canvas.getContext('2d');
    this.canvas = canvas;
    this.ui = ui;
    this.stage = stage;
    this.onEnd = onEnd;
    this.auto = false;
    this.speed = 1;
    this.over = false;
    this.floats = [];
    this.active = null;
    this.bg = drawBackground(stage.chapter.bg);

    const hs = SLOT_ORDER[team.length];
    this.heroes = team.map((id, i) => {
      const rank = owned[id].rank, st = heroStats(id, rank);
      return this.unit('h', { id, name: HEROES[id].name, skill: HEROES[id].skill, ...st }, HERO_SLOTS[hs[i]],
        `h-${id}-${rank}`, () => heroSprite(id, rank));
    });
    const big = stage.enemies.length === 1 && stage.boss;
    const es = SLOT_ORDER[stage.enemies.length];
    this.enemies = stage.enemies.map((e, i) =>
      this.unit('e', { ...e }, big ? [92, 82] : ENEMY_SLOTS[es[i]],
        `e-${e.kind}-${e.variant}`, () => enemySprite(e.kind, e.variant)));
    this.target = this.enemies[0];
    this.turns = 0;

    canvas.onpointerdown = (ev) => this.tap(ev);
    this.raf = requestAnimationFrame((t) => this.draw(t));
  }

  unit(side, data, [cx, by], key, make) {
    const bm = bitmap(key, make);
    const flash = bitmap(key + '-w', () => make().silhouette(WHITE));
    return {
      side, ...data, max: data.hp, cd: 0, stun: 0, alive: true,
      bm, flash, cx, by, sx: cx - (bm.w >> 1), sy: by - bm.h, dx: 0, flashUntil: 0, diedAt: 0,
    };
  }

  // ------------------------------------------------------------ rendu

  draw(t) {
    if (this.stopped) return;
    const g = this.g, step = Math.floor(t / 250);
    g.drawImage(this.bg, 0, 0);
    [...this.heroes, ...this.enemies].forEach((u, i) => {
      if (!u.alive && (t - u.diedAt > 700 || Math.floor(t / 90) % 2)) return;
      const bob = u.alive && !u.stun && (step + i) % 2 ? -1 : 0;
      const x = u.sx + u.dx, y = u.sy + bob;
      const white = t < u.flashUntil && Math.floor(t / 80) % 2 === 0;
      g.drawImage(white ? u.flash.canvas : u.bm.canvas, x, y);
      if (u.alive) drawFx(g, u.bm, x, y, step);
      if (!u.alive) return;
      // barre de PV
      const bx = u.cx - 10, ratio = u.hp / u.max;
      g.fillStyle = '#1a1320';
      g.fillRect(bx - 1, u.by + 1, 22, 4);
      g.fillStyle = ratio > 0.5 ? '#5cc85a' : ratio > 0.25 ? '#e0a93a' : '#e2334a';
      g.fillRect(bx, u.by + 2, Math.max(1, Math.round(20 * ratio)), 2);
      if (u.stun && step % 2) {
        g.fillStyle = '#fbe08a';
        g.fillRect(u.cx - 3, u.sy - 3, 1, 1);
        g.fillRect(u.cx + 3, u.sy - 2, 1, 1);
      }
    });
    if (this.active && this.active.alive && step % 2 === 0) this.arrow(this.active, '#fbe08a');
    if (!this.over && this.target && this.target.alive && this.active?.side === 'h' && step % 2 === 1) this.arrow(this.target, '#e2334a');
    this.floats = this.floats.filter((f) => t - f.t0 < 720);
    for (const f of this.floats) {
      const rise = Math.max(0, Math.min(6, Math.floor((t - f.t0) / 80)));
      drawText(g, f.txt, f.x - (textWidth(f.txt) >> 1), f.y - rise, f.color);
    }
    this.raf = requestAnimationFrame((tt) => this.draw(tt));
  }

  arrow(u, col) {
    const g = this.g, x = u.cx, y = u.sy - 5;
    g.fillStyle = '#1a1320';
    g.fillRect(x - 3, y - 1, 7, 4);
    g.fillStyle = col;
    g.fillRect(x - 2, y, 5, 1);
    g.fillRect(x - 1, y + 1, 3, 1);
    g.fillRect(x, y + 2, 1, 1);
  }

  float(u, txt, color) {
    this.floats.push({ txt, x: u.cx, y: u.sy - 2, color, t0: performance.now() });
  }

  tap(ev) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * W, y = ((ev.clientY - r.top) / r.height) * H;
    const hit = this.enemies.find((u) => u.alive && x >= u.sx - 3 && x <= u.sx + u.bm.w + 3 && y >= u.sy - 3 && y <= u.by + 4);
    if (hit) this.target = hit;
  }

  stop() {
    this.stopped = true;
    this.over = true;
    cancelAnimationFrame(this.raf);
    if (this.resolveChoice) this.resolveChoice(null);
  }

  // ------------------------------------------------------------ logique

  wait(ms) {
    return new Promise((res) => setTimeout(res, ms / this.speed));
  }

  log(txt) {
    this.ui.log.textContent = txt;
  }

  alive(side) {
    return (side === 'h' ? this.heroes : this.enemies).filter((u) => u.alive);
  }

  async run() {
    this.log(`Étape ${this.stage.n} — ${this.stage.chapter.name}`);
    await this.wait(600);
    while (!this.over) {
      this.turns++;
      const order = [...this.heroes, ...this.enemies]
        .filter((u) => u.alive)
        .sort((a, b) => b.spd - a.spd || Math.random() - 0.5);
      for (const u of order) {
        if (this.over) return;
        if (!u.alive) continue;
        this.active = u;
        if (u.stun) {
          u.stun--;
          this.log(`${u.name} est étourdi !`);
          await this.wait(600);
          continue;
        }
        if (u.side === 'h') await this.heroTurn(u);
        else await this.enemyTurn(u);
        if (this.checkEnd()) return;
      }
    }
  }

  checkEnd() {
    if (this.over) return true;
    let res = null;
    if (!this.alive('e').length) res = 'win';
    else if (!this.alive('h').length) res = 'lose';
    if (!res) return false;
    this.over = true;
    this.active = null;
    this.updateButtons();
    setTimeout(() => !this.stopped && this.onEnd(res), 700 / this.speed);
    return true;
  }

  updateButtons() {
    const u = this.active, mine = !this.over && u && u.side === 'h' && !this.auto;
    const { attack, skill, skillName, log } = this.ui;
    attack.disabled = !mine;
    skill.disabled = !mine || u.cd > 0;
    skillName.textContent = u && u.side === 'h' ? (u.cd > 0 ? `${u.skill.name} (${u.cd})` : u.skill.name) : 'Compétence';
    log.classList.toggle('wait', !!mine);
  }

  // Croix directionnelle : passe à l'ennemi vivant suivant / précédent.
  cycleTarget(d) {
    const live = this.alive('e');
    if (!live.length) return;
    const i = live.indexOf(this.target);
    this.target = live[(i + d + live.length) % live.length];
  }

  choose(type) {
    if (this.resolveChoice) {
      const r = this.resolveChoice;
      this.resolveChoice = null;
      r(type);
    }
  }

  setAuto(on) {
    this.auto = on;
    if (on && this.resolveChoice) this.choose(this.autoChoice(this.active));
    this.updateButtons();
  }

  autoChoice(u) {
    if (u.cd > 0) return 'attack';
    if (u.skill.kind === 'heal') return this.alive('h').some((h) => h.hp / h.max < 0.6) ? 'skill' : 'attack';
    return 'skill';
  }

  async heroTurn(u) {
    if (!this.target || !this.target.alive) this.target = this.alive('e')[0];
    let choice;
    if (this.auto) {
      this.target = this.alive('e').sort((a, b) => a.hp - b.hp)[0];
      choice = this.autoChoice(u);
      this.log(`${u.name} agit…`);
      this.updateButtons();
      await this.wait(250);
    } else {
      this.log(`À ${u.name} ! A : attaque · B : ${u.skill.name}. Croix : changer de cible.`);
      this.updateButtons();
      choice = await new Promise((res) => { this.resolveChoice = res; });
    }
    if (!choice || this.over) return;
    this.ui.attack.disabled = this.ui.skill.disabled = true;
    this.ui.log.classList.remove('wait');
    if (choice === 'skill' && u.cd === 0) {
      await this.useSkill(u);
      u.cd = u.skill.cd;
    } else {
      if (u.cd > 0) u.cd--;
      await this.strike(u, this.target, 1);
      if (!this.target.alive) this.target = this.alive('e')[0];
    }
  }

  async useSkill(u) {
    const s = u.skill, foes = this.alive('e');
    this.log(`${u.name} : ${s.name} !`);
    if (s.kind === 'heal') {
      await this.lunge(u);
      for (const h of this.alive('h')) {
        const v = Math.min(h.max - h.hp, Math.round(u.atk * s.mult));
        h.hp += v;
        this.float(h, '+' + v, '#5cc85a');
      }
      await this.wait(500);
    } else if (s.kind === 'all') {
      await this.lunge(u, () => foes.forEach((f) => this.hit(u, f, s.mult)));
      await this.wait(400);
    } else if (s.kind === 'multi') {
      for (let i = 0; i < s.hits; i++) {
        const live = this.alive('e');
        if (!live.length) break;
        await this.strike(u, rand(live), s.mult);
      }
    } else {
      const t = this.target;
      await this.strike(u, t, s.mult);
      if (s.stun && t.alive) t.stun = s.stun;
    }
    if (this.target && !this.target.alive) this.target = this.alive('e')[0];
  }

  async enemyTurn(u) {
    const heroes = this.alive('h');
    if (u.boss && this.turns % u.boss.every === 0) {
      this.log(`${u.name} : ${u.boss.name} !`);
      await this.lunge(u, () => heroes.forEach((h) => this.hit(u, h, u.boss.mult)));
      await this.wait(400);
      return;
    }
    const t = Math.random() < 0.3 ? [...heroes].sort((a, b) => a.hp - b.hp)[0] : rand(heroes);
    this.log(`${u.name} attaque ${t.name}.`);
    await this.strike(u, t, 1);
  }

  // Avance par sauts de pixels, frappe, recule.
  async lunge(u, onHit) {
    const dir = u.side === 'h' ? 1 : -1;
    u.dx = 3 * dir;
    await this.wait(70);
    u.dx = 6 * dir;
    if (onHit) onHit();
    await this.wait(160);
    u.dx = 3 * dir;
    await this.wait(70);
    u.dx = 0;
  }

  async strike(a, d, mult) {
    await this.lunge(a, () => this.hit(a, d, mult));
    await this.wait(350);
  }

  hit(a, d, mult) {
    if (!d.alive) return;
    let v = a.atk * mult * (1 - d.def / (d.def + 60)) * (0.9 + Math.random() * 0.2);
    const crit = Math.random() < 0.1;
    if (crit) v *= 1.5;
    v = Math.max(1, Math.round(v));
    d.hp = Math.max(0, d.hp - v);
    d.flashUntil = performance.now() + 320 / this.speed;
    this.float(d, crit ? v + '!' : String(v), crit ? '#fbe08a' : WHITE);
    if (d.hp === 0) {
      d.alive = false;
      d.diedAt = performance.now();
    }
  }
}
