// Combat au tour par tour, rendu dans un canvas de 240×120 pixels d'art (écran horizontal).
import { HEROES, heroStats } from './data.js';
import { heroSprite, enemySprite } from './sprites.js';
import { bitmap, drawFx, drawText, textWidth } from './render.js';
import { sceneBackground, sceneAnim, SW, SH } from './scene.js';
import { OUTLINE } from './spr.js';
import { sfx, haptic } from './sfx.js';

// Largeur variable (240 à 320) selon l'écran ; les positions sont données pour 240 et recentrées.
export const W = SW, H = SH;
// Formation en chevron : le héros du milieu est en retrait, l'arc d'actions tombe dans le vide.
const HERO_SLOTS = [[54, 80], [36, 96], [54, 112]];
const ENEMY_SLOTS = [[186, 80], [204, 96], [186, 112]];
const BOSS_SLOT = [182, 110];
const SLOT_ORDER = { 1: [1], 2: [0, 2], 3: [0, 1, 2] };
const WHITE = '#ffffff';

const rand = (a) => a[Math.floor(Math.random() * a.length)];

export class Battle {
  constructor({ canvas, ui, team, stage, owned, onEnd, width = W }) {
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
    this.targeting = null; // ennemis ciblables pendant le choix d'une cible
    this.onTargetTap = null;
    this.queue = [];
    this.scene = stage.chapter.bg;
    this.W = width;
    this.ox = Math.round((width - W) / 2);

    const hs = SLOT_ORDER[team.length];
    this.heroes = team.map((id, i) => {
      const rank = owned[id].rank, st = heroStats(id, rank);
      return this.unit('h', { id, rank, name: HEROES[id].name, skill: HEROES[id].skill, ...st }, HERO_SLOTS[hs[i]],
        `h-${id}-${rank}`, () => heroSprite(id, rank));
    });
    const big = stage.enemies.length === 1 && stage.boss;
    const es = SLOT_ORDER[stage.enemies.length];
    this.enemies = stage.enemies.map((e, i) =>
      this.unit('e', { ...e }, big ? BOSS_SLOT : ENEMY_SLOTS[es[i]], `e-${e.kind}-${e.variant}`, () => enemySprite(e.kind, e.variant)));
    this.turns = 0;

    canvas.onpointerdown = (ev) => this.tap(ev);
    this.raf = requestAnimationFrame((t) => this.draw(t));
  }

  unit(side, data, [cx0, by], key, make) {
    const bm = bitmap(key, make), cx = cx0 + this.ox;
    const flash = bitmap(key + '-w', () => make().silhouette(WHITE));
    return {
      side, key, ...data, max: data.hp, cd: 0, stun: 0, guard: false, alive: true,
      bm, flash, cx, by, sx: cx - (bm.w >> 1), sy: by - bm.h, dx: 0, flashUntil: 0, diedAt: 0,
    };
  }

  // Position d'une unité en pixels CSS, relative au canvas.
  screenPos(u) {
    const k = this.canvas.clientWidth / this.W;
    return { x: u.cx * k, y: (u.by - u.bm.h / 2) * k, top: u.sy * k, k };
  }

  // ------------------------------------------------------------ rendu

  draw(t) {
    if (this.stopped) return;
    const g = this.g, step = Math.floor(t / 250), fstep = Math.floor(t / 140);
    g.drawImage(sceneBackground(this.scene, this.W), 0, 0);
    sceneAnim(this.scene, g, fstep, this.W);
    const all = [...this.heroes, ...this.enemies];

    // ombres au sol
    g.globalAlpha = 0.35;
    g.fillStyle = OUTLINE;
    for (const u of all) {
      if (!u.alive) continue;
      const w = Math.max(8, u.bm.w - 6);
      g.fillRect(u.cx - (w >> 1) + u.dx, u.by - 1, w, 2);
      g.fillRect(u.cx - (w >> 1) + 2 + u.dx, u.by + 1, w - 4, 1);
    }
    g.globalAlpha = 1;

    // anneau doré sous le héros actif
    const a = this.active;
    if (a && a.alive && a.side === 'h' && !this.over) this.ring(a, step % 2 ? '#fbe08a' : '#e0a93a');

    all.forEach((u, i) => {
      if (!u.alive && (t - u.diedAt > 700 || Math.floor(t / 90) % 2)) return;
      const bob = u.alive && !u.stun && (step + i) % 2 ? -1 : 0;
      const x = u.sx + u.dx, y = u.sy + bob;
      const white = t < u.flashUntil && Math.floor(t / 80) % 2 === 0;
      g.drawImage(white ? u.flash.canvas : u.bm.canvas, x, y);
      if (u.alive) drawFx(g, u.bm, x, y, step);
      if (!u.alive) return;
      this.bar(u);
      if (u.stun && step % 2) {
        g.fillStyle = '#fbe08a';
        g.fillRect(u.cx - 4, u.sy - 3, 1, 1);
        g.fillRect(u.cx + 4, u.sy - 2, 1, 1);
        g.fillRect(u.cx, u.sy - 4, 1, 1);
      }
      if (u.guard) this.shieldMark(u);
    });

    if (a && a.alive && !this.over) this.chevron(a, step, a.side === 'h' ? '#fbe08a' : '#e2334a');
    if (this.targeting) for (const u of this.targeting) if (u.alive) this.reticle(u, step);

    this.floats = this.floats.filter((f) => t - f.t0 < 760);
    for (const f of this.floats) {
      const rise = Math.max(0, Math.min(7, Math.floor((t - f.t0) / 80)));
      drawText(g, f.txt, f.x - (textWidth(f.txt) >> 1), f.y - rise, f.color);
    }
    this.raf = requestAnimationFrame((tt) => this.draw(tt));
  }

  // Barre de PV en segments : on compte les morceaux d'un coup d'œil.
  bar(u) {
    const g = this.g, w = u.boss ? 40 : 24, seg = u.boss ? 10 : 6, x = u.cx - (w >> 1), y = u.by + 3;
    const ratio = u.hp / u.max, lit = Math.ceil(ratio * seg);
    g.fillStyle = OUTLINE;
    g.fillRect(x - 1, y - 1, w + 2, 5);
    const col = ratio > 0.5 ? ['#5cc85a', '#9af098'] : ratio > 0.25 ? ['#e0a93a', '#fbe08a'] : ['#e2334a', '#ff8a9a'];
    const sw = w / seg;
    for (let i = 0; i < seg; i++) {
      const sx = x + Math.round(i * sw);
      g.fillStyle = i < lit ? col[0] : '#3a2a34';
      g.fillRect(sx, y, Math.round(sw) - 1, 3);
      if (i < lit) {
        g.fillStyle = col[1];
        g.fillRect(sx, y, Math.round(sw) - 1, 1);
      }
    }
  }

  ring(u, col) {
    const g = this.g, w = Math.max(12, u.bm.w - 2), x = u.cx - (w >> 1), y = u.by - 2;
    g.fillStyle = col;
    g.fillRect(x + 2, y - 1, w - 4, 1);
    g.fillRect(x + 2, y + 3, w - 4, 1);
    g.fillRect(x, y, 2, 3);
    g.fillRect(x + w - 2, y, 2, 3);
  }

  // Chevron au-dessus de la tête, avec contour, qui rebondit d'1 px.
  chevron(u, step, col) {
    const g = this.g, x = u.cx, y = u.sy - 9 + (step % 2);
    const rows = [[-4, 9], [-3, 7], [-2, 5], [-1, 3], [0, 1]];
    g.fillStyle = OUTLINE;
    rows.forEach(([o, w], j) => g.fillRect(x + o - 1, y + j - 1, w + 2, 3));
    g.fillStyle = col;
    rows.forEach(([o, w], j) => g.fillRect(x + o, y + j, w, 1));
    g.fillStyle = '#ffffff';
    g.fillRect(x - 3, y, 2, 1);
  }

  // Coins de visée rouges autour d'un ennemi ciblable (clignotent par paliers).
  reticle(u, step) {
    const g = this.g, pad = 3, x0 = u.sx - pad, y0 = u.sy - pad, x1 = u.sx + u.bm.w + pad - 1, y1 = u.by + pad;
    const col = step % 2 ? '#ff5a6a' : '#fbe08a', L = 4;
    for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
      g.fillStyle = OUTLINE;
      g.fillRect(Math.min(cx, cx + sx * L) - 1, cy - 1, L + 2, 3);
      g.fillRect(cx - 1, Math.min(cy, cy + sy * L) - 1, 3, L + 2);
      g.fillStyle = col;
      g.fillRect(Math.min(cx, cx + sx * (L - 1)), cy, L, 1);
      g.fillRect(cx, Math.min(cy, cy + sy * (L - 1)), 1, L);
    }
  }

  shieldMark(u) {
    const g = this.g, x = u.cx + (u.bm.w >> 1) - 2, y = u.sy + 2;
    g.fillStyle = OUTLINE;
    g.fillRect(x - 1, y - 1, 7, 8);
    g.fillStyle = '#3a64c8';
    g.fillRect(x, y, 5, 4);
    g.fillRect(x + 1, y + 4, 3, 1);
    g.fillRect(x + 2, y + 5, 1, 1);
    g.fillStyle = '#e4ecf3';
    g.fillRect(x + 2, y, 1, 5);
  }

  float(u, txt, color) {
    this.floats.push({ txt, x: u.cx, y: u.sy - 4, color, t0: performance.now() });
  }

  tap(ev) {
    if (!this.targeting || !this.onTargetTap) return;
    const r = this.canvas.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * this.W, y = ((ev.clientY - r.top) / r.height) * H;
    const hit = this.targeting.find((u) => u.alive && x >= u.sx - 6 && x <= u.sx + u.bm.w + 6 && y >= u.sy - 8 && y <= u.by + 8);
    if (hit) this.onTargetTap(hit);
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
    this.ui.log(txt);
  }

  alive(side) {
    return (side === 'h' ? this.heroes : this.enemies).filter((u) => u.alive);
  }

  async run() {
    this.log(`Étape ${this.stage.n} — ${this.stage.chapter.name}`);
    await this.wait(700);
    while (!this.over) {
      this.turns++;
      const order = [...this.heroes, ...this.enemies]
        .filter((u) => u.alive)
        .sort((a, b) => b.spd - a.spd || Math.random() - 0.5);
      this.queue = order.slice();
      for (const u of order) {
        this.queue = this.queue.filter((q) => q !== u && q.alive);
        if (this.over) return;
        if (!u.alive) continue;
        this.active = u;
        this.queue.unshift(u);
        if (u.stun) {
          u.stun--;
          this.log(`${u.name} est étourdi !`);
          await this.wait(650);
          this.queue.shift();
          continue;
        }
        if (u.side === 'h') await this.heroTurn(u);
        else await this.enemyTurn(u);
        this.queue.shift();
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
    setTimeout(() => !this.stopped && this.onEnd(res), 800 / this.speed);
    return true;
  }

  // Le joueur (ou le mode Auto) répond par {type: 'attack'|'skill'|'guard', target}.
  submit(choice) {
    if (this.resolveChoice) {
      const r = this.resolveChoice;
      this.resolveChoice = null;
      r(choice);
    }
  }

  setAuto(on) {
    this.auto = on;
    if (on && this.resolveChoice && this.active) {
      this.ui.endChoice();
      this.submit(this.autoChoice(this.active));
    }
  }

  autoChoice(u) {
    const foes = this.alive('e');
    const target = [...foes].sort((a, b) => a.hp - b.hp)[0];
    if (u.cd > 0) return { type: 'attack', target };
    if (u.skill.kind === 'heal') return this.alive('h').some((h) => h.hp / h.max < 0.6) ? { type: 'skill' } : { type: 'attack', target };
    return { type: 'skill', target };
  }

  async heroTurn(u) {
    u.guard = false;
    let choice;
    if (this.auto) {
      this.log(`${u.name} agit…`);
      await this.wait(250);
      choice = this.autoChoice(u);
    } else {
      this.log(`À ${u.name} de jouer !`);
      this.ui.beginChoice(u);
      choice = await new Promise((res) => { this.resolveChoice = res; });
      this.ui.endChoice();
    }
    if (!choice || this.over) return;
    if (choice.type === 'guard') {
      u.guard = true;
      if (u.cd > 0) u.cd--;
      this.log(`${u.name} se met en garde.`);
      sfx('tick');
      await this.wait(450);
    } else if (choice.type === 'skill' && u.cd === 0) {
      await this.useSkill(u, choice.target);
      u.cd = u.skill.cd;
    } else {
      if (u.cd > 0) u.cd--;
      const t = choice.target && choice.target.alive ? choice.target : this.alive('e')[0];
      this.log(`${u.name} attaque ${t.name}.`);
      await this.strike(u, t, 1);
    }
  }

  async useSkill(u, target) {
    const s = u.skill, foes = this.alive('e');
    this.log(`${u.name} : ${s.name} !`);
    sfx(s.kind === 'heal' ? 'heal' : 'skill');
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
      const t = target && target.alive ? target : foes[0];
      await this.strike(u, t, s.mult);
      if (s.stun && t.alive) t.stun = s.stun;
    }
  }

  async enemyTurn(u) {
    const heroes = this.alive('h');
    if (u.boss && this.turns % u.boss.every === 0) {
      this.log(`${u.name} : ${u.boss.name} !`);
      sfx('boom');
      haptic(60);
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
    u.dx = 4 * dir;
    await this.wait(70);
    u.dx = 8 * dir;
    if (onHit) onHit();
    await this.wait(160);
    u.dx = 4 * dir;
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
    if (d.guard) v *= 0.5;
    v = Math.max(1, Math.round(v));
    d.hp = Math.max(0, d.hp - v);
    d.flashUntil = performance.now() + 320 / this.speed;
    this.float(d, crit ? v + '!' : String(v), crit ? '#fbe08a' : WHITE);
    sfx(d.side === 'h' ? 'hurt' : crit ? 'crit' : 'hit');
    if (d.hp === 0) {
      d.alive = false;
      d.diedAt = performance.now();
      setTimeout(() => sfx('die'), 120);
    }
  }
}
