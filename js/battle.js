// Combat au tour par tour, rendu dans un canvas de 240×120 pixels d'art (écran horizontal).
import { HEROES, heroStats } from './data.js';
import { heroSprite, enemySprite } from './sprites.js';
import { bitmap, drawFx, drawText, textWidth } from './render.js';
import { sceneLayers, LAYER_M, SW, SH } from './scene.js';
import { OUTLINE } from './spr.js';
import { sfx, haptic } from './sfx.js';
import { posed, POSE_PAD, heroFx, ENEMY_FX, fxColors, drawEffect } from './fx.js';

// Largeur variable (240 à 320) selon l'écran ; les positions sont données pour 240 et recentrées.
// Hauteur au moins H : le surplus s'ajoute en bas (plus de sol), pour remplir tout l'écran.
export const W = SW, H = SH;
// Formation en chevron : le héros du milieu est en retrait, l'arc d'actions tombe dans le vide.
const HERO_SLOTS = [[54, 80], [36, 96], [54, 112]];
const ENEMY_SLOTS = [[186, 80], [204, 96], [186, 112]];
const BOSS_SLOT = [182, 110];
const SLOT_ORDER = { 1: [1], 2: [0, 2], 3: [0, 1, 2] };
const WHITE = '#ffffff';
// Mise en scène du tour : de combien celui qui agit s'avance, et les autres de son camp reculent.
const STEP_IN = 14, STEP_BACK = 4, DARK_MAX = 4;
// La cible d'un coup s'avance aussi, pour un face-à-face.
const DUEL_STEP = 8;
// Parallaxe : de combien la caméra se tourne vers celui qui agit, et le glissement d'entrée en combat.
const PAN = 6, PAN_INTRO = 18;
// Couleur de la charge avant une compétence.
const CHARGE = { boss: '#ff5a4a' }; // les héros chargent dans leur propre couleur (js/fx.js)
const SPOT = { h: '#fff2c0', e: '#ffb0a0' };

const rand = (a) => a[Math.floor(Math.random() * a.length)];

// Signes des statuts (5 px de large) : '.' vide, 'w' reflet blanc, sinon la couleur du statut.
const STATUS = {
  poison: { c: '#7af06a', rows: ['..x..', '.xwx.', 'xxxxx', '.xxx.'] },
  burn: { c: '#ff8a2a', rows: ['..x..', '.xx.x', 'xxwxx', '.xxx.'] },
  bleed: { c: '#e2334a', rows: ['..x..', '.xwx.', 'xxxxx', '.xxx.'] },
  buff: { c: '#fbe08a', rows: ['..w..', '.xxx.', 'xxxxx', '..x..'] },
  weak: { c: '#b07af0', rows: ['..x..', 'xxxxx', '.xxx.', '..w..'] },
  taunt: { c: '#ff5a4a', rows: ['x.x.x', 'xxxxx', 'xwxxx', '.xxx.'] },
};
// Couleurs des effets de dégâts sur la durée (chiffres et petites gerbes).
const DOT_COLS = { poison: ['#7af06a', '#d8ffd0'], burn: ['#ff6a1f', '#fbe08a'], bleed: ['#e2334a', '#ff9aa8'] };
// ATQ effective, avec les bonus et malus en cours.
// Compétences qui visent les alliés (le reste frappe les ennemis : single, all, multi).
const SUPPORT = ['heal', 'heal1', 'shield', 'buff', 'taunt', 'revive'];
const atkOf = (u) => u.atk * (1 + (u.buff ? u.buff.k : 0) - (u.weak ? u.weak.k : 0));

export class Battle {
  // look(id, rang) → { key, make } : l'apparence du héros (son skin s'il en porte un)
  // carry : PV gardés d'un combat à l'autre (mode infini), { idDuHéros: fraction des PV max }
  constructor({ canvas, ui, team, stage, owned, onEnd, width = W, height = H, zoom = 1, look = null, carry = null }) {
    this.g = canvas.getContext('2d');
    this.canvas = canvas;
    this.ui = ui;
    this.stage = stage;
    this.onEnd = onEnd;
    this.auto = false;
    this.speed = 1;
    this.over = false;
    this.floats = [];
    this.puffs = [];
    this.vfx = []; // effets de combat en cours (voir js/fx.js)
    this.focus = null;
    this.dark = 0;
    this.darkT = 0;
    this.fTick = 0;
    this.duel = null;
    this.flashT = 0;
    // caméra : zoom (z vers zT) autour de origin ; next = prochain point visé, appliqué une fois dézoomé
    this.zoom = zoom;
    this.cam = { z: 1, zT: 1, origin: [width / 2, height / 2], next: null, sx: 0, sy: 0, shakeUntil: 0, amp: 0, css: '' };
    canvas.style.transform = '';
    this.active = null;
    this.targeting = null; // ennemis ciblables pendant le choix d'une cible
    this.onTargetTap = null;
    this.queue = [];
    this.scene = stage.chapter.bg;
    this.W = width;
    this.H = height;
    this.pan = PAN_INTRO;
    this.panT = 0;
    this.ox = Math.round((width - W) / 2);

    const hs = SLOT_ORDER[team.length];
    this.heroes = team.map((id, i) => {
      const rank = owned[id].rank, st = heroStats(id, rank, owned[id].lvl || 1);
      const lk = look ? look(id, rank) : { key: `h-${id}-${rank}`, make: () => heroSprite(id, rank) };
      return this.unit('h', { id, rank, skin: lk.skin || null, name: HEROES[id].name, skill: HEROES[id].skill, ...st }, HERO_SLOTS[hs[i]], lk.key, lk.make);
    });
    const big = stage.enemies.length === 1 && stage.boss;
    const es = SLOT_ORDER[stage.enemies.length];
    this.enemies = stage.enemies.map((e, i) =>
      this.unit('e', { ...e }, big ? BOSS_SLOT : ENEMY_SLOTS[es[i]], `e-${e.kind}-${e.variant}`, () => enemySprite(e.kind, e.variant)));
    this.turns = 0;
    if (carry) for (const u of this.heroes) {
      const f = carry[u.id] ?? 1;
      u.hp = u.trailHp = Math.round(u.max * Math.min(1, f));
      if (u.hp <= 0) {
        u.hp = 0;
        u.alive = false;
      }
    }

    canvas.onpointerdown = (ev) => this.tap(ev);
    this.raf = requestAnimationFrame((t) => this.draw(t));
  }

  unit(side, data, [cx0, by], key, make) {
    const bm = bitmap(key, make), cx = cx0 + this.ox;
    const flash = bitmap(key + '-w', () => make().silhouette(WHITE));
    const shade = bitmap(key + '-d', () => make().silhouette(OUTLINE));
    const sx = cx - (bm.w >> 1);
    return {
      side, key, ...data, max: data.hp, cd: 0, stun: 0, guard: false, alive: true,
      // statuts : dégâts sur la durée, ATQ en plus ou en moins, bouclier, provocation (voir tickStatus)
      dots: [], buff: null, weak: null, barrier: 0, barrierT: 0, taunt: 0,
      trailHp: data.hp, trailT: 0, hitAt: 0, healAt: 0, // jauge de PV : traînée des dégâts, éclair de soin
      bm, flash, shade, cx, by, sx, sy: by - bm.h, dx: 0, flashUntil: 0, diedAt: 0,
      // cx0/sx0 : place dans la formation ; fx : décalage de mise en scène (fxT = où il va)
      cx0: cx, sx0: sx, fx: 0, fxT: 0,
      // pose en cours (élan, frappe, incantation, garde, choc) et fiche d'effets du personnage
      pose: null, prof: side === 'h' ? heroFx(data.id, data.skin) : ENEMY_FX[data.kind] || ENEMY_FX.goblin,
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
    const layers = sceneLayers(this.scene, this.W, this.H);
    for (const l of layers) if (!l.front) this.layer(l, fstep, t);
    const all = [...this.heroes, ...this.enemies];
    this.spotlight(t, all);
    this.camera(t);
    const f = this.focus;

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
      // pendant la charge, il se ramasse sur lui-même (1 px plus bas)
      const bob = u.charge ? 1 : u.alive && !u.stun && (step + i) % 2 ? -1 : 0;
      const x = u.sx + u.dx, y = u.sy + bob;
      const white = t < u.flashUntil && Math.floor(t / 80) % 2 === 0;
      const src = white ? u.flash : u.bm;
      if (u.pose && u.alive) g.drawImage(posed(src, u.pose, u.side === 'h' ? 1 : -1), x - POSE_PAD, y);
      else g.drawImage(src.canvas, x, y);
      if (u.alive) drawFx(g, u.bm, x, y, step);
      if (!u.alive) return;
      // ceux qui n'agissent pas restent dans la pénombre (sauf les cibles qu'on peut toucher)
      if (f && u !== f && u !== this.duel && this.dark && !this.targeting?.includes(u)) {
        g.globalAlpha = this.dark * 0.09;
        g.drawImage(u.shade.canvas, x, y);
        g.globalAlpha = 1;
      }
      this.bar(u, t);
      if (u.stun && step % 2) {
        g.fillStyle = '#fbe08a';
        g.fillRect(u.cx - 4, u.sy - 3, 1, 1);
        g.fillRect(u.cx + 4, u.sy - 2, 1, 1);
        g.fillRect(u.cx, u.sy - 4, 1, 1);
      }
      if (u.guard) this.shieldMark(u);
      this.statusMarks(u, step);
    });

    // premier plan, devant les combattants (assombri lui aussi pendant la mise en scène)
    for (const l of layers) {
      if (!l.front) continue;
      this.layer(l, fstep, t);
      if (this.dark) {
        g.globalAlpha = this.dark * 0.07;
        g.drawImage(l.shade, this.layerX(l), 0);
        g.globalAlpha = 1;
      }
    }

    if (a && a.alive && !this.over) this.chevron(a, step, a.side === 'h' ? '#fbe08a' : '#e2334a');
    if (this.targeting) for (const u of this.targeting) if (u.alive) this.reticle(u, step);

    this.drawVfx(t);
    this.drawPuffs(t);
    for (const u of all) if (u.charge) this.drawCharge(u, t);
    // éclair blanc sur tout l'écran (coup critique, attaque de boss)
    if (t - this.flashT < 70) {
      g.globalAlpha = 0.35;
      g.fillStyle = WHITE;
      g.fillRect(0, 0, this.W, this.H);
      g.globalAlpha = 1;
    }
    this.floats = this.floats.filter((fl) => t - fl.t0 < 760);
    for (const fl of this.floats) {
      const rise = Math.max(0, Math.min(7, Math.floor((t - fl.t0) / 80)));
      drawText(g, fl.txt, fl.x - (textWidth(fl.txt) >> 1), fl.y - rise, fl.color);
    }
    this.raf = requestAnimationFrame((tt) => this.draw(tt));
  }

  // Un plan du décor, décalé selon sa profondeur : le sol (d = 1) ne bouge pas,
  // le lointain suit la caméra, le premier plan file en sens inverse.
  layerX(l) {
    return Math.round(this.pan * (l.d - 1)) - LAYER_M;
  }

  layer(l, fstep, t) {
    const g = this.g, x = this.layerX(l);
    g.drawImage(l.canvas, x, 0);
    if (!l.anim) return;
    g.save();
    g.translate(x, 0);
    l.anim(g, fstep, l.lw, this.H, t);
    g.restore();
  }

  // Fait avancer la mise en scène par paliers de 2 px, puis assombrit le décor
  // et pose un rai de lumière sur celui qui agit.
  spotlight(t, all) {
    const g = this.g;
    if (t - this.fTick >= 40 / this.speed) {
      this.fTick = t;
      for (const u of all) {
        if (u.fx !== u.fxT) u.fx += Math.sign(u.fxT - u.fx) * Math.min(2, Math.abs(u.fxT - u.fx));
        u.cx = u.cx0 + u.fx;
        u.sx = u.sx0 + u.fx;
      }
      if (this.dark !== this.darkT) this.dark += Math.sign(this.darkT - this.dark);
      if (this.pan !== this.panT) this.pan += Math.sign(this.panT - this.pan);
    }
    if (!this.dark) return;
    g.globalAlpha = this.dark * 0.07;
    g.fillStyle = OUTLINE;
    g.fillRect(0, 0, this.W, this.H);
    const f = this.focus;
    if (!f || !f.alive) {
      g.globalAlpha = 1;
      return;
    }
    // rai de lumière qui tombe du ciel, élargi par bandes de 4 px
    g.fillStyle = SPOT[f.side];
    g.globalAlpha = this.dark * 0.035;
    const w0 = Math.max(10, f.bm.w - 8);
    for (let y = 0; y < f.by; y += 4) {
      const w = w0 + Math.floor((y / f.by) * 10) * 2;
      g.fillRect(f.cx - (w >> 1), y, w, 4);
    }
    // flaque de lumière au sol
    g.globalAlpha = this.dark * 0.08;
    const pw = f.bm.w + 10;
    [[-2, pw - 12], [-1, pw - 4], [0, pw], [1, pw - 4], [2, pw - 12]].forEach(([dy, w]) => g.fillRect(f.cx - (w >> 1), f.by + dy, w, 1));
    g.globalAlpha = 1;
  }

  // Caméra : zoome par paliers sur celui qui agit (dézoome d'abord s'il faut changer de cible),
  // et tremble par sauts de pixels entiers. Appliqué en transform CSS sur le canvas.
  camera(t) {
    const c = this.cam, k = this.canvas.clientWidth / this.W;
    if (t - (c.tick || 0) >= 40 / this.speed) {
      c.tick = t;
      if (c.next && c.z === 1) {
        c.origin = c.next;
        c.next = null;
        c.zT = this.zoom;
      }
      const dz = (this.zoom - 1) / 3;
      if (c.z !== c.zT) c.z = Math.abs(c.zT - c.z) <= dz + 1e-6 ? c.zT : c.z + Math.sign(c.zT - c.z) * dz;
      const on = t < c.shakeUntil;
      c.sx = on ? Math.round((Math.random() * 2 - 1) * c.amp) : 0;
      c.sy = on ? Math.round((Math.random() * 2 - 1) * c.amp) : 0;
    }
    const css = `translate(${c.sx * k}px, ${c.sy * k}px) scale(${c.z})`, org = `${c.origin[0] * k}px ${c.origin[1] * k}px`;
    if (css + org !== c.css) {
      c.css = css + org;
      this.canvas.style.transformOrigin = org;
      this.canvas.style.transform = css;
    }
  }

  shake(amp, ms) {
    this.cam.amp = Math.max(amp, performance.now() < this.cam.shakeUntil ? this.cam.amp : 0);
    this.cam.shakeUntil = Math.max(this.cam.shakeUntil, performance.now() + ms / this.speed);
  }

  // Point du décor (pixels d'art) → écran (pixels CSS), une fois la caméra posée. Renvoie aussi l'échelle.
  screenAt(x, y) {
    const c = this.canvas, cam = this.cam, k = c.clientWidth / this.W;
    const z = this.focus ? this.zoom : 1, [ox, oy] = cam.next || cam.origin;
    return [c.offsetLeft + (ox + (x - ox) * z) * k, c.offsetTop + (oy + (y - oy) * z) * k, k * z];
  }

  // ---- effets de combat

  // Lance un effet (nom dans js/fx.js) de l'unité a vers les cibles d ; se résout à la fin.
  // cols : couleurs imposées (sinon celles de la fiche de a).
  addFx(name, ms, a, d, steps = 8, cols = null) {
    return new Promise((res) => this.vfx.push({ name, a, d, t0: performance.now(), dur: ms / this.speed, steps, res, cols }));
  }

  drawVfx(t) {
    const g = this.g, at = (u) => ({ tx: u.cx + u.dx, ty: u.by - (u.bm.h >> 1) });
    this.vfx = this.vfx.filter((v) => {
      const p = (t - v.t0) / v.dur;
      if (p >= 1) {
        v.res();
        return false;
      }
      const a = v.a, d0 = at(v.d[0] || a);
      drawEffect(v.name, g, Math.floor(p * v.steps) / v.steps, {
        x: a.cx + a.dx, y: a.by - (a.bm.h >> 1), tx: d0.tx, ty: d0.ty, d: v.d.map(at),
        // une tenue garde ses couleurs à tous les rangs
        dir: a.side === 'h' ? 1 : -1, rank: a.rank || 1, cols: v.cols || fxColors(a.prof, a.side === 'h' && !a.skin ? a.rank : 1),
      });
      return true;
    });
  }

  // Étincelles qui convergent vers celui qui prépare sa compétence, en 6 paliers.
  drawCharge(u, t) {
    const g = this.g, p = Math.min(5, Math.floor(((t - u.charge.t0) * this.speed) / 75));
    const cx = u.cx + u.dx, cy = u.by - (u.bm.h >> 1), r = 22 - p * 4;
    g.fillStyle = u.charge.col;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + p * 0.25;
      const x = Math.round(cx + Math.cos(a) * r), y = Math.round(cy + Math.sin(a) * r * 0.7);
      g.fillRect(x, y, 2, 2);
      g.fillStyle = WHITE;
      g.fillRect(x, y, 1, 1);
      g.fillStyle = u.charge.col;
    }
    // halo au sol qui se resserre
    g.globalAlpha = 0.5;
    const w = u.bm.w + 12 - p * 2;
    g.fillRect(u.cx - (w >> 1), u.by - 1, w, 1);
    g.globalAlpha = 1;
  }

  // Pose de préparation : il se ramasse, la magie converge, puis il s'illumine.
  async charge(u, col) {
    u.charge = { t0: performance.now(), col };
    sfx('charge');
    await this.wait(450);
    u.charge = null;
    u.flashUntil = performance.now() + 160 / this.speed;
    this.shake(1, 120);
  }

  // Met un combattant en avant : il passe devant toute sa ligne, ses alliés reculent d'un pas.
  setFocus(u) {
    this.focus = u;
    this.darkT = u ? DARK_MAX : 0;
    // la caméra se tourne vers lui : vers la gauche pour un héros, la droite pour un ennemi
    this.panT = !u ? 0 : u.side === 'h' ? PAN : -PAN;
    const dir = u?.side === 'h' ? 1 : -1;
    const front = u && Math.max(...this.alive(u.side).map((v) => v.cx0 * dir)) * dir;
    for (const v of [...this.heroes, ...this.enemies]) {
      v.fxT = !u ? 0 : v === u ? front + STEP_IN * dir - v.cx0 : v.side === u.side ? -STEP_BACK * dir : 0;
    }
    // la caméra dézoome, puis vise celui qui s'avance ; ancrée sur le bas pour garder les barres de vie à l'écran
    this.cam.zT = 1;
    this.cam.next = u ? [u.cx0 + u.fxT, this.H - 4] : null;
    if (u) this.puffs.push({ x: u.cx, y: u.by, dir: u.side === 'h' ? 1 : -1, t0: performance.now() });
  }

  // Petits nuages de poussière laissés derrière celui qui s'élance.
  drawPuffs(t) {
    const g = this.g;
    this.puffs = this.puffs.filter((p) => t - p.t0 < 400);
    g.fillStyle = '#efe4c8';
    for (const p of this.puffs) {
      const k = Math.floor((t - p.t0) / 80);
      g.globalAlpha = 0.8 - k * 0.15;
      for (const s of [-1, 1]) {
        const x = p.x - p.dir * (4 + k * 2), y = p.y - 1 - k + (s > 0 ? k : 0);
        g.fillRect(x + s * k, y, 2, 1);
        g.fillRect(x - p.dir * 3 + s * (k >> 1), y - 1, 1, 1);
      }
    }
    g.globalAlpha = 1;
  }

  // Jauge de PV : petit cadre en pixel art (bois à rivets d'or pour un héros, fer sombre pour un
  // ennemi) avec un cœur ou un crâne, des segments qu'on compte d'un coup d'œil, une traînée
  // claire qui montre les PV qu'on vient de perdre puis se vide par paliers, un éclair au soin.
  bar(u, t) {
    const g = this.g, hero = u.side === 'h', seg = u.boss ? 14 : 8, IW = seg * 3 - 1;
    const x = Math.round(u.cx - IW / 2) + 2, y = u.by + 4, step = Math.floor(t / 250);
    // la traînée rattrape les PV par paliers, un peu après le coup
    if (u.trailHp < u.hp) u.trailHp = u.hp;
    if (u.trailHp > u.hp && t - u.hitAt > 300 / this.speed && t - u.trailT > 40) {
      u.trailT = t;
      u.trailHp = Math.max(u.hp, u.trailHp - u.max / seg / 2);
    }
    const F = hero ? ['#6a4228', '#a8703a', '#3a2416'] : ['#4a4650', '#76707e', '#2a2630'];
    g.fillStyle = OUTLINE;
    g.fillRect(x - 2, y - 2, IW + 4, 7);
    g.fillStyle = F[0];
    g.fillRect(x - 1, y - 1, IW + 2, 5);
    g.fillStyle = F[1];
    g.fillRect(x - 1, y - 1, IW + 2, 1);
    g.fillStyle = F[2];
    g.fillRect(x - 1, y + 3, IW + 2, 1);
    g.fillStyle = '#1e1418';
    g.fillRect(x, y, IW, 3);
    g.fillStyle = hero ? '#fbe08a' : '#b8b0bc';
    g.fillRect(x + IW, y + 1, 1, 1);
    const ratio = u.hp / u.max, lit = Math.ceil(ratio * seg), trail = Math.ceil((u.trailHp / u.max) * seg);
    const heal = t - u.healAt < 360 / this.speed && step % 2 === 0;
    const col = heal ? ['#d8ffd0', '#ffffff', '#9af098']
      : ratio > 0.5 ? ['#5cc85a', '#9af098', '#3a8e3e'] : ratio > 0.25 ? ['#e0a93a', '#fbe08a', '#a87a20'] : ['#e2334a', '#ff8a9a', '#8a1a28'];
    for (let i = 0; i < seg; i++) {
      const sx = x + i * 3;
      if (i < lit) {
        g.fillStyle = col[0];
        g.fillRect(sx, y, 2, 3);
        g.fillStyle = col[1];
        g.fillRect(sx, y, 2, 1);
        g.fillStyle = col[2];
        g.fillRect(sx, y + 2, 2, 1);
      } else if (i < trail) {
        g.fillStyle = '#fff2c0';
        g.fillRect(sx, y, 2, 3);
        g.fillStyle = '#e8c070';
        g.fillRect(sx, y + 2, 2, 1);
      } else {
        g.fillStyle = '#2e2228';
        g.fillRect(sx, y, 2, 3);
        g.fillStyle = '#3a2a32';
        g.fillRect(sx, y, 2, 1);
      }
    }
    // cœur (héros) ou crâne (ennemi) posé sur le bout gauche du cadre ; le cœur bat quand il reste peu de vie
    const ix = x - 6, iy = y - 2;
    const cells = hero ? ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..'] : ['.XXX.', 'XXXXX', 'X.X.X', 'XXXXX', '.X.X.'];
    g.fillStyle = OUTLINE;
    cells.forEach((row, j) => [...row].forEach((ch, i) => ch === 'X' && g.fillRect(ix + i - 1, iy + j - 1, 3, 3)));
    const beat = hero && ratio <= 0.25 && step % 2 === 0;
    cells.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch === '.') {
        if (!hero && j === 2) { g.fillStyle = OUTLINE; g.fillRect(ix + i, iy + j, 1, 1); }
        return;
      }
      g.fillStyle = hero ? (beat ? '#ff8a9a' : j === 1 && i === 1 ? '#ff8a9a' : j >= 3 ? '#a8203a' : '#e2334a') : j === 0 && i === 1 ? '#f2eef4' : j >= 3 ? '#a89c88' : '#d8d0bc';
      g.fillRect(ix + i, iy + j, 1, 1);
    }));
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

  // Petits signes des statuts, empilés à gauche de la tête : goutte de poison, flamme, goutte de
  // sang, flèche d'ATQ (dorée vers le haut, violette vers le bas), poing de la provocation.
  // Le bouclier est une ligne cyan posée sur la jauge de PV.
  statusMarks(u, step) {
    const g = this.g, marks = [];
    for (const d of u.dots) marks.push(STATUS[d.type]);
    if (u.buff) marks.push(STATUS.buff);
    if (u.weak) marks.push(STATUS.weak);
    if (u.taunt) marks.push(STATUS.taunt);
    marks.forEach((m, i) => {
      const x = u.sx - 3, y = u.sy + 3 + i * 7;
      g.fillStyle = OUTLINE;
      m.rows.forEach((row, j) => [...row].forEach((ch, k) => ch !== '.' && g.fillRect(x + k - 1, y + j - 1, 3, 3)));
      m.rows.forEach((row, j) => [...row].forEach((ch, k) => {
        if (ch === '.') return;
        g.fillStyle = ch === 'w' ? WHITE : m.c;
        g.fillRect(x + k, y + j, 1, 1);
      }));
    });
    if (u.barrier > 0) {
      const seg = u.boss ? 14 : 8, IW = seg * 3 - 1, x = Math.round(u.cx - IW / 2) + 2, w = Math.max(2, Math.round(Math.min(1, u.barrier / u.max) * IW));
      g.fillStyle = OUTLINE;
      g.fillRect(x - 1, u.by + 1, w + 2, 3);
      g.fillStyle = step % 2 ? '#8af0ff' : '#4fd8e0';
      g.fillRect(x, u.by + 2, w, 1);
    }
  }

  float(u, txt, color) {
    this.floats.push({ txt, x: u.cx, y: u.sy - 4, color, t0: performance.now() });
  }

  tap(ev) {
    if (!this.targeting || !this.onTargetTap) return;
    const r = this.canvas.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * this.W, y = ((ev.clientY - r.top) / r.height) * this.H;
    const hit = this.targeting.find((u) => u.alive && x >= u.sx - 6 && x <= u.sx + u.bm.w + 6 && y >= u.sy - 8 && y <= u.by + 8);
    if (hit) this.onTargetTap(hit);
  }

  stop() {
    this.stopped = true;
    this.over = true;
    cancelAnimationFrame(this.raf);
    this.canvas.style.transform = '';
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
    this.log(this.stage.label || `Étape ${this.stage.n} — ${this.stage.chapter.name}`);
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
        this.setFocus(u);
        sfx(u.side === 'h' ? 'focus' : 'focusFoe');
        await this.wait(260);
        if (this.over) return;
        if (u.dots.length) {
          await this.tickDots(u);
          if (this.checkEnd()) return;
          if (!u.alive) {
            this.queue.shift();
            continue;
          }
        }
        if (u.stun) {
          u.stun--;
          this.log(`${u.name} est étourdi !`);
          await this.wait(650);
          this.endTurn(u);
          this.queue.shift();
          continue;
        }
        if (u.side === 'h') await this.heroTurn(u);
        else await this.enemyTurn(u);
        this.endTurn(u);
        this.queue.shift();
        if (this.checkEnd()) return;
      }
    }
  }

  // Poison, brûlure, saignement : au début de son tour, il perd des PV (sans tenir compte de sa DÉF).
  async tickDots(u) {
    for (const d of u.dots) {
      const v = Math.min(u.hp, d.dmg);
      u.hp -= v;
      u.taken = (u.taken || 0) + v;
      if (d.from) d.from.dealt = (d.from.dealt || 0) + v;
      u.hitAt = performance.now();
      u.flashUntil = performance.now() + 200 / this.speed;
      this.float(u, '-' + v, DOT_COLS[d.type][0]);
      this.addFx('tick', 360, u, [u], 6, DOT_COLS[d.type]);
      d.turns--;
    }
    sfx(u.dots[0].type === 'burn' ? 'burn' : 'drip');
    u.dots = u.dots.filter((d) => d.turns > 0);
    this.log(`${u.name} souffre…`);
    await this.wait(520);
    if (u.hp === 0) this.kill(u);
  }

  // Fin de son tour : ses bonus, malus, bouclier et provocation s'usent d'un tour.
  endTurn(u) {
    if (u.buff && --u.buff.t <= 0) u.buff = null;
    if (u.weak && --u.weak.t <= 0) u.weak = null;
    if (u.taunt) u.taunt--;
    if (u.barrierT && --u.barrierT <= 0) u.barrier = 0;
  }

  checkEnd() {
    if (this.over) return true;
    let res = null;
    if (!this.alive('e').length) res = 'win';
    else if (!this.alive('h').length) res = 'lose';
    if (!res) return false;
    this.over = true;
    this.active = null;
    this.setFocus(null);
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
    const k = u.skill.kind, allies = this.alive('h');
    if (k === 'heal' || k === 'heal1') return allies.some((h) => h.hp / h.max < 0.6) ? { type: 'skill' } : { type: 'attack', target };
    if (k === 'revive') return this.heroes.some((h) => !h.alive) || allies.some((h) => h.hp / h.max < 0.5) ? { type: 'skill' } : { type: 'attack', target };
    return { type: 'skill', target };
  }

  async heroTurn(u) {
    u.guard = false;
    if (u.pose === 'guard') u.pose = null;
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
      u.pose = 'guard';
      if (u.cd > 0) u.cd--;
      this.log(`${u.name} se met en garde.`);
      sfx('shield');
      await this.addFx('shield', 500, u, [u]);
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
    await this.charge(u, u.prof.cols[0]);
    sfx(u.prof.skillSound || 'skill');
    const allies = this.alive('h');
    if (SUPPORT.includes(s.kind)) {
      // compétences de soutien : l'effet tombe sur les alliés touchés
      const dead = this.heroes.filter((h) => !h.alive);
      const wounded = [...allies].sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
      const to = s.kind === 'heal1' ? [wounded] : s.kind === 'taunt' ? [u] : s.kind === 'revive' ? [dead[0] || wounded] : allies;
      u.pose = 'cast';
      const fxp = this.addFx(u.prof.skill, 800, u, to, 10);
      await this.wait(300);
      if (s.kind === 'revive' && dead.length) {
        const h = dead[0];
        h.alive = true;
        h.hp = h.trailHp = Math.round(h.max * s.pct);
        h.stun = 0;
        h.dots = [];
        h.pose = null;
        h.healAt = performance.now();
        h.flashUntil = performance.now() + 400 / this.speed;
        u.healed = (u.healed || 0) + h.hp;
        this.float(h, '+' + h.hp, '#5cc85a');
        this.log(`${h.name} se relève !`);
      } else if (s.kind === 'heal' || s.kind === 'heal1' || s.kind === 'revive') for (const h of to) this.heal(u, h, atkOf(u) * s.mult);
      else if (s.kind === 'shield') for (const h of to) {
        h.barrier = Math.round(atkOf(u) * s.mult);
        h.barrierT = s.turns || 3;
        this.float(h, '+' + h.barrier, '#8af0ff');
      } else if (s.kind === 'buff') for (const h of to) {
        h.buff = { k: s.atk, t: s.turns };
        h.flashUntil = performance.now() + 200 / this.speed;
      } else if (s.kind === 'taunt') {
        u.taunt = s.turns;
        this.log(`${u.name} attire tous les coups !`);
      }
      if (s.heal) for (const h of to) this.heal(u, h, atkOf(u) * s.heal); // soin en plus (ex. buff + soin)
      if (s.taunt && s.kind !== 'taunt') u.taunt = s.taunt;
      await fxp;
      u.pose = s.kind === 'taunt' ? 'guard' : null;
      await this.wait(200);
    } else if (s.kind === 'all') {
      u.pose = 'cast';
      const fxp = this.addFx(u.prof.skill, 1000, u, foes, 12);
      await this.wait(600);
      this.shake(2, 300);
      foes.forEach((f) => this.hit(u, f, s.mult, s));
      await fxp;
      u.pose = null;
      await this.wait(250);
    } else if (s.kind === 'multi') {
      for (let i = 0; i < s.hits; i++) {
        const live = this.alive('e');
        if (!live.length) break;
        await this.strike(u, rand(live), s.mult, false, 'skill', s);
      }
    } else {
      const t = target && target.alive ? target : foes[0];
      await this.strike(u, t, s.mult, true, 'skill', s);
    }
  }

  heal(u, h, amount) {
    const v = Math.min(h.max - h.hp, Math.round(amount));
    h.hp += v;
    u.healed = (u.healed || 0) + v;
    h.healAt = performance.now();
    this.float(h, '+' + v, '#5cc85a');
  }

  async enemyTurn(u) {
    const heroes = this.alive('h');
    if (u.boss && this.turns % u.boss.every === 0) {
      this.log(`${u.name} : ${u.boss.name} !`);
      await this.charge(u, CHARGE.boss);
      sfx('boom');
      haptic(60);
      u.pose = 'strike';
      const fxp = this.addFx(u.prof.skill || 'claw', 800, u, heroes, 10);
      await this.wait(400);
      this.shake(3, 450);
      this.flashT = performance.now();
      heroes.forEach((h) => this.hit(u, h, u.boss.mult));
      await fxp;
      u.pose = null;
      await this.wait(200);
      return;
    }
    const tank = heroes.find((h) => h.taunt);
    const t = tank || (Math.random() < 0.3 ? [...heroes].sort((a, b) => a.hp - b.hp)[0] : rand(heroes));
    this.log(`${u.name} attaque ${t.name}.`);
    await this.strike(u, t, 1);
  }

  // Avance par sauts de pixels, frappe, recule.
  // Il prend son élan (recule d'un pas, penché en arrière), bondit penché en avant, frappe, revient.
  async lunge(u, onHit) {
    const dir = u.side === 'h' ? 1 : -1;
    u.pose = 'windup';
    u.dx = -2 * dir;
    await this.wait(90);
    u.pose = 'strike';
    u.dx = 4 * dir;
    await this.wait(60);
    u.dx = 8 * dir;
    if (onHit) onHit();
    await this.wait(160);
    u.dx = 4 * dir;
    await this.wait(70);
    u.dx = 0;
    u.pose = null;
  }

  // Un coup : la cible s'avance face à l'attaquant (sauf en rafale), il frappe, chacun reprend sa place.
  // mode : 'attack' ou 'skill' (l'effet vient de la fiche du personnage, js/fx.js).
  // s : la compétence, dont les effets en plus (étourdir, poison, vol de vie…) suivent le coup.
  async strike(a, d, mult, duel = true, mode = 'attack', s = null) {
    if (duel && d.alive) {
      this.duel = d;
      d.fxT = (d.side === 'h' ? 1 : -1) * DUEL_STEP;
      await this.wait(140);
    }
    const P = a.prof, name = mode === 'skill' ? P.skill : P.attack;
    if (P.ranged) {
      // à distance : élan, puis le tir part et frappe en arrivant
      a.pose = 'windup';
      await this.wait(120);
      a.pose = mode === 'skill' || name === 'bolt' || name === 'holy' ? 'cast' : 'strike';
      sfx(mode === 'skill' ? P.skillSound || P.sound : P.sound);
      await this.addFx(name, mode === 'skill' ? 520 : 300, a, [d]);
      this.hit(a, d, mult, s);
      await this.wait(120);
      a.pose = null;
    } else {
      await this.lunge(a, () => {
        sfx(mode === 'skill' ? P.skillSound || P.sound : P.sound);
        this.addFx(name, mode === 'skill' ? 480 : 320, a, [d]);
        this.hit(a, d, mult, s);
      });
    }
    await this.wait(300);
    if (this.duel === d) {
      this.duel = null;
      d.fxT = 0;
    }
  }

  // s : compétence utilisée (perce-armure, exécution, puis ses effets sur la cible).
  hit(a, d, mult, s = null) {
    if (!d.alive) return;
    let v = atkOf(a) * mult * (s?.pierce ? 1 : 1 - d.def / (d.def + 60)) * (0.9 + Math.random() * 0.2);
    if (s?.exec && d.hp / d.max < s.exec) v *= 2;
    const crit = Math.random() < 0.1;
    if (crit) v *= 1.5;
    if (d.guard) v *= 0.5;
    if (d.taunt) v *= 0.7; // celui qui provoque se protège aussi
    v = Math.max(1, Math.round(v));
    // le bouclier encaisse d'abord
    if (d.barrier > 0) {
      const b = Math.min(d.barrier, v);
      d.barrier -= b;
      v -= b;
      if (!d.barrier) d.barrierT = 0;
      if (!v) {
        this.float(d, '0', '#8af0ff');
        d.flashUntil = performance.now() + 160 / this.speed;
        sfx('shield');
        return;
      }
    }
    // statistiques du combat (affichées sur la plaque de fin)
    a.dealt = (a.dealt || 0) + Math.min(v, d.hp);
    d.taken = (d.taken || 0) + Math.min(v, d.hp);
    if (crit) a.crits = (a.crits || 0) + 1;
    d.hp = Math.max(0, d.hp - v);
    if (d.hp === 0) a.kills = (a.kills || 0) + 1;
    d.hitAt = performance.now();
    d.flashUntil = performance.now() + 320 / this.speed;
    // il encaisse : penché en arrière un instant (puis revient à sa garde s'il en avait une)
    if (!d.pose || d.pose === 'guard') {
      d.pose = 'hurt';
      setTimeout(() => d.pose === 'hurt' && (d.pose = d.guard ? 'guard' : null), 220 / this.speed);
    }
    this.float(d, crit ? v + '!' : String(v), crit ? '#fbe08a' : WHITE);
    this.shake(crit ? 2 : 1, crit ? 260 : 120);
    if (crit) this.flashT = performance.now();
    sfx(d.side === 'h' ? 'hurt' : crit ? 'crit' : 'hit');
    if (s?.drain) this.heal(a, a, v * s.drain);
    if (d.hp === 0) return this.kill(d);
    if (!s) return;
    if (s.stun) d.stun = Math.max(d.stun, s.stun);
    if (s.weaken) d.weak = { k: s.weaken.atk, t: s.weaken.turns };
    if (s.dot) {
      // un même poison ne se cumule pas : il se renouvelle
      const dmg = Math.max(1, Math.round(atkOf(a) * s.dot.mult)), old = d.dots.find((x) => x.type === s.dot.type);
      if (old) Object.assign(old, { dmg: Math.max(old.dmg, dmg), turns: s.dot.turns, from: a });
      else d.dots.push({ type: s.dot.type, dmg, turns: s.dot.turns, from: a });
    }
  }

  kill(d) {
    d.alive = false;
    d.diedAt = performance.now();
    d.dots = [];
    d.buff = d.weak = null;
    d.barrier = d.taunt = 0;
    d.guard = false;
    setTimeout(() => sfx('die'), 120);
  }
}
