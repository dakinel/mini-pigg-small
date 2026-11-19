/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

export type GamePhase = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'WHITEPAPER' | 'GAME_OVER';
export type Difficulty = 'STANDARD' | 'FRENZY';

export interface PiggyDuelPluginProps {
  className?: string;
  initialDifficulty?: Difficulty;
  autoStart?: boolean;
  storageKey?: string;
  whitepaperUrl?: string;
  onScoreChange?: (stats: { score: number; round: number; piggiesBroken: number; slotDrops: number }) => void;
  onPiggyBroken?: (stats: { round: number; score: number; piggiesBroken: number }) => void;
  onGameOver?: (stats: { score: number; bestScore: number; round: number; piggiesBroken: number }) => void;
  onClose?: () => void;
}

const IconVolume2 = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const IconVolumeX = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" x2="16" y1="9" y2="15" />
    <line x1="16" x2="22" y1="9" y2="15" />
  </svg>
);

const IconPause = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const IconPlay = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const IconRotateCcw = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const IconCoins = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const IconZap = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

const IconDollarSign = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconX = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const IconFileText = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const IconDownload = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const PLUGIN_SCOPED_CSS = `
  .piggy-plugin-root {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    user-select: none;
    -webkit-user-select: none;
  }
  .piggy-plugin-root .font-display {
    font-family: 'Fraunces', Georgia, serif;
  }
  .piggy-plugin-root .font-mono-tabular {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
  }
  .piggy-plugin-root.lite-mode [filter] {
    filter: none !important;
  }
`;
type BossAction = 'WALK' | 'PATTERN_MOVE' | 'PATTERN_STOP' | 'JET_FLIGHT' | 'BOUNCY_BALL' | 'BREAKING';
export type LaserStyleId = 'SLING_ARC' | 'RAPID_WHIP' | 'HIGH_LOB' | 'STRAIGHT_RAIL' | 'SNIPER_LOCK';
export type LaserModeSetting = 'AUTO' | LaserStyleId;

interface LaserProfile {
  id: LaserStyleId;
  label: string;
  shortLabel: string;
  curved: boolean;
  gravity: number;
  flightScale: number;
  straightSpeed: number;
  sweepRate: number;
  subRate: number;
  angleSpan: number;
  powerSwing: number;
  beamColor: string;
  coreColor: string;
}

const LASER_PROFILES: Record<LaserStyleId, LaserProfile> = {
  SLING_ARC: {
    id: 'SLING_ARC',
    label: 'Sling Lob (Curved)',
    shortLabel: 'Sling Arc',
    curved: true,
    gravity: 2150,
    flightScale: 1.0,
    straightSpeed: 0,
    sweepRate: 2.65,
    subRate: 4.2,
    angleSpan: 0.68,
    powerSwing: 0.19,
    beamColor: '#EA580C',
    coreColor: '#FDBA74',
  },
  STRAIGHT_RAIL: {
    id: 'STRAIGHT_RAIL',
    label: 'Direct Beam (Straight)',
    shortLabel: 'Straight Beam',
    curved: false,
    gravity: 0,
    flightScale: 1.0,
    straightSpeed: 1680,
    sweepRate: 2.35,
    subRate: 3.4,
    angleSpan: 0.56,
    powerSwing: 0.12,
    beamColor: '#0284C7',
    coreColor: '#BAE6FD',
  },
  RAPID_WHIP: {
    id: 'RAPID_WHIP',
    label: 'Rapid Whip (Fast Curve)',
    shortLabel: 'Rapid Whip',
    curved: true,
    gravity: 2620,
    flightScale: 0.84,
    straightSpeed: 0,
    sweepRate: 4.35,
    subRate: 6.4,
    angleSpan: 0.84,
    powerSwing: 0.24,
    beamColor: '#E11D48',
    coreColor: '#FECDD3',
  },
  SNIPER_LOCK: {
    id: 'SNIPER_LOCK',
    label: 'Hyper Rail (Fast Straight)',
    shortLabel: 'Hyper Rail',
    curved: false,
    gravity: 0,
    flightScale: 1.0,
    straightSpeed: 2280,
    sweepRate: 3.85,
    subRate: 5.5,
    angleSpan: 0.72,
    powerSwing: 0.14,
    beamColor: '#7C3AED',
    coreColor: '#DDD6FE',
  },
  HIGH_LOB: {
    id: 'HIGH_LOB',
    label: 'Sky Dropper (Slow Lob)',
    shortLabel: 'Sky Lob',
    curved: true,
    gravity: 1680,
    flightScale: 1.24,
    straightSpeed: 0,
    sweepRate: 1.65,
    subRate: 2.8,
    angleSpan: 0.62,
    powerSwing: 0.17,
    beamColor: '#D97706',
    coreColor: '#FDE68A',
  },
};

const LASER_STYLE_ORDER: LaserStyleId[] = [
  'SLING_ARC',
  'STRAIGHT_RAIL',
  'RAPID_WHIP',
  'SNIPER_LOCK',
  'HIGH_LOB',
];

interface PatternSpot {
  x: number;
  alt: number;
  hop?: boolean;
}

interface MovementPattern {
  name: string;
  baseStop: number;
  baseMoveSpeed: number;
  spots: PatternSpot[];
}

const ROUND_PATTERNS: MovementPattern[] = [
  {
    name: 'Twin-Side Hop',
    baseStop: 0.86,
    baseMoveSpeed: 980,
    spots: [
      { x: 300, alt: 0 },
      { x: 800, alt: 255 },
      { x: 1300, alt: 0 },
      { x: 800, alt: 255 },
    ],
  },
  {
    name: 'Sky Triangle',
    baseStop: 0.78,
    baseMoveSpeed: 1090,
    spots: [
      { x: 260, alt: 45 },
      { x: 800, alt: 410 },
      { x: 1340, alt: 45 },
    ],
  },
  {
    name: 'Figure-8 Orbit',
    baseStop: 0.72,
    baseMoveSpeed: 1180,
    spots: [
      { x: 330, alt: 355 },
      { x: 1250, alt: 0 },
      { x: 1270, alt: 355 },
      { x: 350, alt: 0 },
    ],
  },
  {
    name: 'Corner Feint',
    baseStop: 0.66,
    baseMoveSpeed: 1280,
    spots: [
      { x: 230, alt: 0 },
      { x: 640, alt: 345 },
      { x: 1370, alt: 0 },
      { x: 960, alt: 345 },
    ],
  },
  {
    name: 'Double Zig-Zag',
    baseStop: 0.62,
    baseMoveSpeed: 1360,
    spots: [
      { x: 250, alt: 305 },
      { x: 580, alt: 0 },
      { x: 960, alt: 395 },
      { x: 1350, alt: 0 },
      { x: 800, alt: 175 },
    ],
  },
  {
    name: 'Hyper Loop',
    baseStop: 0.56,
    baseMoveSpeed: 1460,
    spots: [
      { x: 240, alt: 380 },
      { x: 1360, alt: 380 },
      { x: 1080, alt: 0 },
      { x: 800, alt: 295 },
      { x: 520, alt: 0 },
    ],
  },
];

interface Projectile {
  kind: 'thrown_coin';
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vrot: number;
  life: number;
  maxLife: number;
  gravity: number;
  bounces?: number;
  armorHitCooldown?: number;
  trail?: { x: number; y: number }[];
  power?: number;
  pumpValue?: number;
  missedHandled?: boolean;
}

interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  maxLife: number;
  gravity: number;
  kind?: 'dot' | 'bill' | 'dollar' | 'dust' | 'gleam';
  rot?: number;
  vrot?: number;
  drag?: number;
  grow?: number;
}

interface CanvasFloater {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Afterimage {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

interface DualTrailPoint {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  life: number;
  maxLife: number;
  speed: number;
  thr: number;
  belly: number;
  ballM: number;
  ballAng: number;
  squash: number;
  nervous: number;
  vx?: number;
  vy?: number;
}

interface BallAfterimage {
  x: number;
  y: number;
  r: number;
  sx: number;
  sy: number;
  rot: number;
  life: number;
  maxLife: number;
}

interface LandingRing {
  x: number;
  y: number;
  rx: number;
  maxRx: number;
  life: number;
  maxLife: number;
  color: string;
}

interface ImpactFlash {
  x: number;
  y: number;
  r: number;
  maxR: number;
  nx: number;
  ny: number;
  life: number;
  maxLife: number;
  color: string;
  coreColor?: string;
}

interface DroppingCoin {
  relX: number;
  relY: number;
  r: number;
  rot: number;
  life: number;
  maxLife: number;
  dir: number;
}

interface SlotIntakePulse {
  life: number;
  maxLife: number;
  dir: number;
}

interface CanvasShockwave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  maxLife: number;
  color: string;
  lineWidth: number;
}

interface MechanicalDebris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vrot: number;
  kind: 'screw' | 'bolt' | 'washer' | 'gear' | 'spring' | 'nut' | 'plate';
  color: string;
  life: number;
  maxLife: number;
  bounces: number;
  mass?: number;
  bounce?: number;
}

interface DisassemblyPart {
  id: string;
  el: SVGGElement | null;
  cx: number;
  cy: number;
  r: number;
  mass: number;
  detachAt: number;
  vx: number;
  vy: number;
  vrot: number;
  bounce: number;
  wx0: number;
  wy0: number;
  wx: number;
  wy: number;
  rot: number;
  detached: boolean;
  clangs: number;
  unscrew?: boolean;
}

interface HudState {
  score: number;
  bestScore: number;
  round: number;
  patternName: string;
  spotIndex: number;
  spotTotal: number;
  pumpProgress: number;
  pumpTarget: number;
  pumpHoldPct: number;
  bellyPct: number;
  bossActionLabel: string;
  dashReadyPct: number;
  revolverChambers: number;
  revolverMax: number;
  isReloading: boolean;
  reloadPct: number;
  combo: number;
  slotDrops: number;
  piggiesBroken: number;
  laserStyle: LaserStyleId;
  laserLabel: string;
  laserCurved: boolean;
  laserModeSetting: LaserModeSetting;
  nervousPct: number;
  isNervous: boolean;
  handChargePct: number;
  handStateLabel: string;
}

const HAND_SPRITE_URL = 'https://i.imgur.com/SXUGSfK.png';
const COIN_SPRITE_URL = 'https://i.imgur.com/XE4l8eT.png';
const SPRITE_COLS = 5;
const SPRITE_ROWS = 2;

const WORLD_W = 1600;
const WORLD_H = 920;
const FLOOR_Y = 828;
const PIGGY_SCALE = 0.38;
const PIGGY_UNIT = PIGGY_SCALE / 0.56;
const REVOLVER_CHAMBERS = 6;
const MIN_X = 160;
const MAX_X = WORLD_W - 160;
const DEFAULT_BEST_KEY = 'cursor_vs_piggy_best_v3';
const BALL_CX = 552;
const BALL_CY = 505;
const getBallSvgRadius = (belly: number) => 236 + 42 * Math.min(1.2, Math.max(0, belly));

function readBestScore(key: string): number {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return 0;
    return Number(window.localStorage.getItem(key) || '0') || 0;
  } catch {
    return 0;
  }
}

function writeBestScore(key: string, val: number): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, String(val));
  } catch {
    // Ignore storage quota / sandbox errors
  }
}

class FightSynth {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock() {
    this.ensure();
  }

  public playThrow() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.095);
  }

  // Layered "Money Hurt" SFX: metallic ka-ching + rubbery piggy stretch thud
  public playMoneyHurt(pumpRatio: number) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Coin ka-ching chime (rises with inflation tension!)
    const pitchBoost = 1 + pumpRatio * 0.45;
    [987.77 * pitchBoost, 1318.51 * pitchBoost].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.032);
      gain.gain.setValueAtTime(0.13, now + i * 0.032);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.032 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.032);
      osc.stop(now + i * 0.032 + 0.24);
    });

    // 2. Piggy hurt thud / rubber strain
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sawtooth';
    thud.frequency.setValueAtTime(210 + pumpRatio * 120, now);
    thud.frequency.exponentialRampToValueAtTime(85, now + 0.14);
    thudGain.gain.setValueAtTime(0.11, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    thud.connect(thudGain).connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.16);
  }

  public playArmorClank() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(115, now + 0.09);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playClash() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1240, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playDash() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.1);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playDisassemblyStart() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Rapid high-torque metallic bolt unscrewing ratchet + sharp thread snaps
    [0, 0.042, 0.084, 0.126, 0.17, 0.215].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(720 + idx * 140, now + offset);
      osc.frequency.exponentialRampToValueAtTime(1140 + idx * 165, now + offset + 0.032);
      gain.gain.setValueAtTime(0.068, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.042);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.046);
    });

    // Heavy cast-iron boiler pressure groan
    const groan = ctx.createOscillator();
    const groanGain = ctx.createGain();
    groan.type = 'triangle';
    groan.frequency.setValueAtTime(92, now);
    groan.frequency.exponentialRampToValueAtTime(185, now + 0.34);
    groanGain.gain.setValueAtTime(0.05, now);
    groanGain.gain.linearRampToValueAtTime(0.14, now + 0.28);
    groanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.37);
    groan.connect(groanGain).connect(ctx.destination);
    groan.start(now);
    groan.stop(now + 0.38);

    const whine = ctx.createOscillator();
    const whineGain = ctx.createGain();
    whine.type = 'sawtooth';
    whine.frequency.setValueAtTime(165, now);
    whine.frequency.exponentialRampToValueAtTime(640, now + 0.35);
    whineGain.gain.setValueAtTime(0.02, now);
    whineGain.gain.linearRampToValueAtTime(0.085, now + 0.29);
    whineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    whine.connect(whineGain).connect(ctx.destination);
    whine.start(now);
    whine.stop(now + 0.39);
  }

  public playPiggyBreak() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Deep heavy sub-bass cast-hull pressure blast
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(125, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.52);
    subGain.gain.setValueAtTime(0.28, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.54);
    sub.connect(subGain).connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.55);

    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sawtooth';
    boom.frequency.setValueAtTime(185, now);
    boom.frequency.exponentialRampToValueAtTime(34, now + 0.44);
    boomGain.gain.setValueAtTime(0.2, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
    boom.connect(boomGain).connect(ctx.destination);
    boom.start(now);
    boom.stop(now + 0.48);

    // Metallic hull plate shatter crunch
    [420, 690, 940, 1280].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + i * 0.018);
      osc.frequency.exponentialRampToValueAtTime(f * 0.42, now + i * 0.018 + 0.14);
      gain.gain.setValueAtTime(0.055, now + i * 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.018 + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.018);
      osc.stop(now + i * 0.018 + 0.17);
    });

    // Jackpot coin cascade
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + 0.09 + i * 0.055);
      gain.gain.setValueAtTime(0.115, now + 0.09 + i * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09 + i * 0.055 + 0.34);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + 0.09 + i * 0.055);
      osc.stop(now + 0.09 + i * 0.055 + 0.36);
    });
  }

  public playCoreBurst() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = 'triangle';
    pop.frequency.setValueAtTime(250, now);
    pop.frequency.exponentialRampToValueAtTime(48, now + 0.3);
    popGain.gain.setValueAtTime(0.19, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    pop.connect(popGain).connect(ctx.destination);
    pop.start(now);
    pop.stop(now + 0.34);

    [880, 1174, 1480].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 0.03 + i * 0.04);
      gain.gain.setValueAtTime(0.07, now + 0.03 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + i * 0.04 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + 0.03 + i * 0.04);
      osc.stop(now + 0.03 + i * 0.04 + 0.24);
    });
  }

  public playPartClang(pitchMul = 1) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    [390 * pitchMul, 635 * pitchMul].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.78, now + 0.11);
      gain.gain.setValueAtTime(i === 0 ? 0.065 : 0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    });
  }

  public playHeavyPartThud(mass = 1.8) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const weight = Math.max(1, Math.min(2.8, mass));

    // Heavy cast-brass / iron floor slam
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(108 / Math.sqrt(weight * 0.75), now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.22);
    subGain.gain.setValueAtTime(0.11 * Math.min(1.6, weight * 0.7), now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    sub.connect(subGain).connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.25);

    // Damped metallic plate resonance
    const plate = ctx.createOscillator();
    const plateGain = ctx.createGain();
    plate.type = 'triangle';
    plate.frequency.setValueAtTime(240 / Math.sqrt(weight * 0.8), now);
    plate.frequency.exponentialRampToValueAtTime(88, now + 0.15);
    plateGain.gain.setValueAtTime(0.075, now);
    plateGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    plate.connect(plateGain).connect(ctx.destination);
    plate.start(now);
    plate.stop(now + 0.17);
  }

  public playHardwareClink(pitchMul = 1) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480 * pitchMul, now);
    osc.frequency.exponentialRampToValueAtTime(980 * pitchMul, now + 0.055);
    gain.gain.setValueAtTime(0.026, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  public playBossAttack() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(82, now + 0.18);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playPlayerHurt() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.24);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.27);
  }

  public playLanding(intensity = 1) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const mag = Math.max(0.45, Math.min(1.4, intensity));

    // Heavy brass thud
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(128 * (1 + 0.12 * mag), now);
    thud.frequency.exponentialRampToValueAtTime(38, now + 0.16);
    thudGain.gain.setValueAtTime(0.16 * mag, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    thud.connect(thudGain).connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.19);

    // Metallic spring clank
    const clank = ctx.createOscillator();
    const clankGain = ctx.createGain();
    clank.type = 'sine';
    clank.frequency.setValueAtTime(310, now);
    clank.frequency.exponentialRampToValueAtTime(145, now + 0.08);
    clankGain.gain.setValueAtTime(0.055 * mag, now);
    clankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    clank.connect(clankGain).connect(ctx.destination);
    clank.start(now);
    clank.stop(now + 0.1);
  }

  public playStep() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(58, now + 0.045);
    gain.gain.setValueAtTime(0.032, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  public playDryClick() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.028);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playCylinderTick(stepIdx = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620 + stepIdx * 75, now);
    osc.frequency.exponentialRampToValueAtTime(410 + stepIdx * 45, now + 0.03);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.036);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playReloadComplete() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    [540, 960].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.045);
      gain.gain.setValueAtTime(0.095, now + i * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.14);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.15);
    });
  }

  public playCoinClink() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    [1860, 2720].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.015);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.84, now + i * 0.015 + 0.07);
      gain.gain.setValueAtTime(0.036, now + i * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.015 + 0.075);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.015);
      osc.stop(now + i * 0.015 + 0.08);
    });
  }

  public playBallBoing(pitchMul = 1) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175 * pitchMul, now);
    osc.frequency.exponentialRampToValueAtTime(340 * pitchMul, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(140 * pitchMul, now + 0.22);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playBallRicochet() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1280, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.085);
    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playHandBump(intensity = 0.8, isBall = false) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const mag = Math.max(0.35, Math.min(1.4, intensity));

    if (isBall) {
      const boing = ctx.createOscillator();
      const boingGain = ctx.createGain();
      boing.type = 'triangle';
      boing.frequency.setValueAtTime(195, now);
      boing.frequency.exponentialRampToValueAtTime(420, now + 0.065);
      boing.frequency.exponentialRampToValueAtTime(155, now + 0.16);
      boingGain.gain.setValueAtTime(0.09 * mag, now);
      boingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      boing.connect(boingGain).connect(ctx.destination);
      boing.start(now);
      boing.stop(now + 0.18);
      return;
    }

    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(165, now);
    thud.frequency.exponentialRampToValueAtTime(68, now + 0.09);
    thudGain.gain.setValueAtTime(0.1 * mag, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    thud.connect(thudGain).connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.11);

    const clack = ctx.createOscillator();
    const clackGain = ctx.createGain();
    clack.type = 'sine';
    clack.frequency.setValueAtTime(760, now);
    clack.frequency.exponentialRampToValueAtTime(410, now + 0.06);
    clackGain.gain.setValueAtTime(0.055 * mag, now);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    clack.connect(clackGain).connect(ctx.destination);
    clack.start(now);
    clack.stop(now + 0.075);
  }

  public playDizzy(intense = false) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = intense ? 520 : 450;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.36);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(11.5, now);
    lfoGain.gain.setValueAtTime(intense ? 68 : 48, now);
    lfo.connect(lfoGain).connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(intense ? 0.068 : 0.052, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.4);
    lfo.stop(now + 0.4);
  }

  public playNervousAlert() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [680, 920, 760, 1080];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = now + idx * 0.045;
      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, t0);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.18, t0 + 0.04);
      gain.gain.setValueAtTime(0.055, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.065);
    });
  }

  public playHandHop() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.09);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playChargeTick(step: number) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const baseF = 480 + step * 170;
    osc.frequency.setValueAtTime(baseF, now);
    osc.frequency.exponentialRampToValueAtTime(baseF * 1.25, now + 0.055);
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  public playChargedRelease(charge: number) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const c = Math.max(0, Math.min(1, charge));
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520 + c * 360, now);
    osc.frequency.exponentialRampToValueAtTime(220 + c * 140, now + 0.16);
    gain.gain.setValueAtTime(0.11 + c * 0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}

function makeSpr(k: number, c: number) {
  return {
    x: 0,
    v: 0,
    k,
    c,
    step(tg: number, dt: number) {
      for (let i = 0; i < 3; i++) {
        const h = dt / 3;
        this.v += (this.k * (tg - this.x) - this.c * this.v) * h;
        this.x += this.v * h;
      }
      return this.x;
    },
  };
}

export function PiggyDuelPlugin({
  className = 'w-full h-full min-h-[420px]',
  initialDifficulty = 'STANDARD',
  autoStart = false,
  storageKey = DEFAULT_BEST_KEY,
  whitepaperUrl = '/assets/aistudio/white_71b73dee.pdf',
  onScoreChange,
  onPiggyBroken,
  onGameOver,
  onClose,
}: PiggyDuelPluginProps) {
  const [phase, setPhase] = useState<GamePhase>(autoStart ? 'PLAYING' : 'TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [muted, setMuted] = useState(false);
  const [textureOn, setTextureOn] = useState(true);
  const [spriteError, setSpriteError] = useState(false);
  const [coinError, setCoinError] = useState(false);
  const [spriteCellRatio, setSpriteCellRatio] = useState(1);
  const [stageDims, setStageDims] = useState({ w: 1200, h: 690 });
  const [wpTab, setWpTab] = useState<'PDF' | 'SUMMARY'>('PDF');
  const [laserMode, setLaserMode] = useState<LaserModeSetting>('AUTO');

  const [hud, setHud] = useState<HudState>(() => ({
    score: 0,
    bestScore: readBestScore(storageKey),
    round: 1,
    patternName: ROUND_PATTERNS[0].name,
    spotIndex: 0,
    spotTotal: ROUND_PATTERNS[0].spots.length,
    pumpProgress: 0,
    pumpTarget: 3,
    pumpHoldPct: 0,
    bellyPct: 0,
    bossActionLabel: autoStart ? ROUND_PATTERNS[0].name : 'Ready',
    dashReadyPct: 100,
    revolverChambers: REVOLVER_CHAMBERS,
    revolverMax: REVOLVER_CHAMBERS,
    isReloading: false,
    reloadPct: 100,
    combo: 0,
    slotDrops: 0,
    piggiesBroken: 0,
    laserStyle: 'SLING_ARC',
    laserLabel: LASER_PROFILES.SLING_ARC.shortLabel,
    laserCurved: true,
    laserModeSetting: 'AUTO',
    nervousPct: 0,
    isNervous: false,
    handChargePct: 0,
    handStateLabel: '',
  }));

  const rootRef = useRef<HTMLDivElement | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const stageBoxRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorWrapRef = useRef<HTMLDivElement | null>(null);
  const cursorFlipRef = useRef<HTMLDivElement | null>(null);
  const spriteImgRef = useRef<HTMLImageElement | null>(null);
  const coinImgRef = useRef<HTMLImageElement | null>(null);
  const pointerInsideRef = useRef(false);
  const callbacksRef = useRef({ onScoreChange, onPiggyBroken, onGameOver });
  callbacksRef.current = { onScoreChange, onPiggyBroken, onGameOver };

  const synthRef = useRef<FightSynth | null>(null);
  if (!synthRef.current) synthRef.current = new FightSynth();

  const simRef = useRef({
    phase: (autoStart ? 'PLAYING' : 'TITLE_MENU') as GamePhase,
    difficulty: initialDifficulty as Difficulty,
    round: 1,
    score: 0,
    bestScore: readBestScore(storageKey),
    combo: 0,
    slotDrops: 0,
    piggiesBroken: 0,

    // Hand/Cursor state (revolver coin loader, never damaged)
    cx: WORLD_W * 0.42,
    cy: WORLD_H * 0.25,
    prevCx: WORLD_W * 0.42,
    prevCy: WORLD_H * 0.25,
    targetCx: WORLD_W * 0.42,
    targetCy: WORLD_H * 0.25,
    velX: 0,
    facing: 1,
    throwHolding: false,
    throwCooldown: 0,
    throwCooldownMax: 0.16,
    throwAnimTimer: 0,
    revolverMax: REVOLVER_CHAMBERS,
    revolverChambers: REVOLVER_CHAMBERS,
    cylinderAngle: 0,
    cylinderTargetAngle: 0,
    isReloading: false,
    reloadTimer: 0,
    reloadDuration: 1.18,
    reloadSoundStep: 0,
    reloadCompleteFlash: 0,
    dryClickFlash: 0,
    sinceLastSlotHit: 0,
    pumpHoldTimer: 0,
    pumpHoldMax: 4.8,
    pressureBleedFxAcc: 0,
    dashCooldown: 0,
    dashMaxCooldown: 0.65,
    dashTimer: 0,
    dashVx: 0,
    dashVy: 0,
    spriteFrameTime: 0,
    lastSpriteCol: -1,
    lastSpriteRow: -1,
    lastFacing: 0,
    afterimages: [] as Afterimage[],

    // Dynamic Tap / Hold / Release Hand Mechanics (Short Hop, Power Charge, Extended Glide)
    handHoldActive: false,
    handHoldDuration: 0,
    handCharge: 0,
    handChargeStep: 0,
    handHopY: 0,
    handHopVy: 0,
    handOffsetX: 0,
    handOffsetY: 0,
    handTiltDeg: 0,
    handScaleX: 1,
    handScaleY: 1,
    handGlideTimer: 0,
    handGlideVx: 0,
    handGlideVy: 0,
    handChargeTrailAcc: 0,
    dashHolding: false,
    dashGlideFuel: 0,
    handColCooldown: 0,
    handScrapeFxAcc: 0,
    handBounceVx: 0,
    handBounceVy: 0,
    handShieldFlash: 0,
    handContactX: 0,
    handContactY: 0,
    handContactNx: 0,
    handContactNy: -1,
    dizzyTimer: 0,
    dizzyLevel: 0,
    dizzyPhase: 0,

    // Dynamic Deterministic Low-to-Top Hold Targeting Laser (Curved Slings & Straight Rails)
    laserModeSetting: 'AUTO' as LaserModeSetting,
    laserStyle: 'SLING_ARC' as LaserStyleId,
    laserIndex: 0,
    laserSwitchTimer: 5.0,
    laserElev: 0,
    laserGrow: 0,
    laserFadeTimer: 0,
    laserHoldSnapshot: 0,
    laserIgniteFlash: 0,
    slingPhase: 0,
    slingSubPhase: 0,
    slingSpeed: 2.65,
    slingTargetSpeed: 2.65,
    slingSubSpeed: 4.2,
    slingTargetSubSpeed: 4.2,
    slingAngleSpan: 0.68,
    slingTargetAngleSpan: 0.68,
    slingPowerBias: 0,
    slingTargetPowerBias: 0,
    slingMorphTimer: 1.8,
    slingSeed: 0,
    slingLocked: false,

    // Boss Piggybank Pump-to-Explode & Pattern Movement state
    px: WORLD_W * 0.34,
    py: 0,
    vx: 0,
    vy: 0,
    onGround: true,
    dir: 1,
    walkM: 0,
    phi: 0,
    prevDy: 0,
    prevVy: 0,
    ay: 0,
    prevM: 0,
    primed: false,
    stepNo: 0,
    pumpProgress: 0,
    pumpTarget: 3,
    bossAction: 'WALK' as BossAction,
    bossTimer: 1.0,
    walkTimer: 0,
    walkTurnPause: 0,
    playerIdleTimer: 0,
    bossFlash: 0,
    hurtTimer: 0,
    hurtDir: 1,
    breakTimer: 0,

    // Bouncy Ball state
    ballMorph: 0,
    ballAngle: 0,
    ballSpin: 0,
    ballVx: 0,
    ballVy: 0,
    ballTimer: 0,
    ballSquashContact: 0,
    stopsSinceBall: 0,
    ballTriggerStops: 3,

    // Nervous state & volatility
    nervousLevel: 0,
    nervousPanicTimer: 0,
    nervousSteamAcc: 0,
    nervousDartTimer: 0,
    nervousJitterX: 0,
    textureOn: true,

    // Pattern waypoint navigation
    patternIndex: 0,
    spotIndex: 0,
    visitedSpots: new Set<number>([0]),
    stopDuration: 1.0,
    moveFromX: WORLD_W * 0.34,
    moveFromAlt: 0,
    moveTargetX: WORLD_W * 0.34,
    moveTargetAlt: 0,
    moveElapsed: 0,
    moveDuration: 0.65,
    moveArcAlt: 0,

    // Flight, landing & biomechanical inertia state
    goalAlt: 0,
    alt: 0,
    prevAlt: 0,
    vAlt: 0,
    thrS: 0,
    realVx: 0,
    prevRealVx: 0,
    realAx: 0,
    trailSampleAcc: 0,

    // Coin-swallow reaction
    swallowTimer: 0,
    swallowMax: 0.28,
    slotGlowTimer: 0,
    slotReceiveTilt: 0,

    // Balloon belly physics (starts flat at 0, swells progressively to 1.0+ until it breaks!)
    bellyLevel: 0.04,
    bellyGoal: 0.04,
    bellyVel: 0,
    ripplePhase: 0,

    // Springs for piggy parts
    spLa: makeSpr(95, 3.2),
    spRa: makeSpr(85, 3),
    spTail: makeSpr(60, 2.2),
    spSq: makeSpr(150, 5),
    spSx: makeSpr(150, 5),
    spLean: makeSpr(70, 3.2),
    spLand: makeSpr(175, 11),
    spBallSq: makeSpr(320, 8.2),
    spBallWall: makeSpr(320, 8.2),

    // Canvas FX pools
    projectiles: [] as Projectile[],
    particles: [] as CanvasParticle[],
    floaters: [] as CanvasFloater[],
    piggyTrail: [] as DualTrailPoint[],
    ballAfterimages: [] as BallAfterimage[],
    landingRings: [] as LandingRing[],
    impactFlashes: [] as ImpactFlash[],
    droppingCoins: [] as DroppingCoin[],
    slotIntakePulses: [] as SlotIntakePulse[],
    shockwaves: [] as CanvasShockwave[],
    debrisItems: [] as MechanicalDebris[],
    disassemblyParts: [] as DisassemblyPart[],
    breakMax: 2.35,
    breakPx: WORLD_W * 0.34,
    breakPy: 0,
    breakDir: 1,
    breakStage: 0,
    shakeTimer: 0,
    hitStop: 0,

    // FPS safeguard
    slowFrames: 0,
    fpsSamples: 0,
    autoLiteDone: false,

    // Cached SVG DOM nodes
    piggyPos: null as SVGGElement | null,
    actor: null as SVGGElement | null,
    bodyG: null as SVGGElement | null,
    legsG: null as SVGGElement | null,
    shadowEl: null as SVGEllipseElement | null,
    la: null as SVGGElement | null,
    ra: null as SVGGElement | null,
    le: null as SVGGElement | null,
    re: null as SVGGElement | null,
    tail: null as SVGGElement | null,
    head: null as SVGGElement | null,
    tailMount: null as SVGGElement | null,
    tailEjectWrap: null as SVGGElement | null,
    slotFollow: null as SVGGElement | null,
    slotEjectWrap: null as SVGGElement | null,
    jetFollow: null as SVGGElement | null,
    jetTuckWrap: null as SVGGElement | null,
    topScrewWrap: null as SVGGElement | null,
    leftPauldron: null as SVGGElement | null,
    rightPauldronWrap: null as SVGGElement | null,
    leftSocket: null as SVGPathElement | null,
    rightSocket: null as SVGGElement | null,
    leftArmTuck: null as SVGGElement | null,
    rightArmTuck: null as SVGGElement | null,
    torsoChestWrap: null as SVGGElement | null,
    torsoBellyWrap: null as SVGGElement | null,
    torsoPelvisWrap: null as SVGGElement | null,
    leg0Wrap: null as SVGGElement | null,
    leg1Wrap: null as SVGGElement | null,
    piggyInnerCore: null as SVGGElement | null,
    coreGearA: null as SVGGElement | null,
    coreGearB: null as SVGGElement | null,
    coreGearC: null as SVGGElement | null,
    topScrewShank: null as SVGGElement | null,
    ballShellOverlay: null as SVGGElement | null,
    jetGimbal: null as SVGGElement | null,
    jetFlame: null as SVGGElement | null,
    jetFlameBody: null as SVGGElement | null,
    jetEmber: null as SVGEllipseElement | null,
    jetSparks: [] as { el: SVGCircleElement; seed: number }[],
    slotRimGlow: null as SVGPathElement | null,
    swallowCoinGroup: null as SVGGElement | null,
    slotLight: null as SVGGElement | null,
    glRaysIn: null as SVGGElement | null,
    glBloomEl: null as SVGEllipseElement | null,
    glStarB: null as SVGGElement | null,
    slotLightNextAt: 1200,
    slotLightStartAt: -1,
    slotLightSpin: 0,
    legs: [] as { t: SVGGElement; s: SVGGElement; f: SVGGElement }[],
    balloonPaths: [] as { el: SVGPathElement; tok: string[] }[],
    balloonEllipses: [] as { el: SVGEllipseElement; cx: number; cy: number; rx: number; ry: number; ang: number }[],
    nervousColorMatrix: null as SVGFEColorMatrixElement | null,
    nervousRedGlow: null as SVGFEDropShadowElement | null,
  });

  useEffect(() => {
    simRef.current.phase = phase;
  }, [phase]);

  useEffect(() => {
    simRef.current.difficulty = difficulty;
  }, [difficulty]);

  useEffect(() => {
    simRef.current.textureOn = textureOn;
  }, [textureOn]);

  useEffect(() => {
    if (synthRef.current) synthRef.current.muted = muted;
  }, [muted]);

  // Preload coin image for fast Canvas rendering
  useEffect(() => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      coinImgRef.current = img;
      setCoinError(false);
    };
    img.onerror = () => setCoinError(true);
    img.src = COIN_SPRITE_URL;
  }, []);

  // Locked 1600x920 stage sizing
  useEffect(() => {
    const el = arenaRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const padW = Math.max(200, rect.width - 16);
      const padH = Math.max(180, rect.height - 16);
      const scale = Math.min(padW / WORLD_W, padH / WORLD_H);
      setStageDims({
        w: Math.round(WORLD_W * scale),
        h: Math.round(WORLD_H * scale),
      });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const spawnMoneyHurtFx = (x: number, y: number, count: number, speed = 340) => {
    const s = simRef.current;
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.55;
      const spd = speed * (0.45 + Math.random() * 0.75);
      const kindRoll = Math.random();
      const kind: CanvasParticle['kind'] = kindRoll < 0.55 ? 'bill' : kindRoll < 0.9 ? 'dollar' : 'dot';
      s.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 105,
        r: kind === 'bill' ? 17 + Math.random() * 5 : kind === 'dollar' ? 24 + Math.random() * 6 : 4 + Math.random() * 3.5,
        color: kind === 'dot' ? '#22C55E' : '#15803D',
        life: 0.6 + Math.random() * 0.35,
        maxLife: 0.95,
        gravity: kind === 'bill' ? 320 : 480,
        kind,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 460,
      });
    }
  };

  const spawnBurst = (x: number, y: number, color: string, count: number, speed = 280, gravity = 380) => {
    const s = simRef.current;
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7;
      const spd = speed * (0.4 + Math.random() * 0.85);
      s.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 40,
        r: 3.5 + Math.random() * 4.5,
        color,
        life: 0.35 + Math.random() * 0.25,
        maxLife: 0.6,
        gravity,
        kind: 'dot',
      });
    }
  };

  const spawnDustPuff = (x: number, y: number, dirSign: number, count = 4, spreadSpeed = 160) => {
    const s = simRef.current;
    for (let i = 0; i < count; i++) {
      const puffVx = dirSign * (45 + Math.random() * spreadSpeed) + (Math.random() - 0.5) * 60;
      const puffVy = -(24 + Math.random() * 75);
      const maxLife = 0.36 + Math.random() * 0.26;
      s.particles.push({
        x: x + (Math.random() - 0.5) * 26,
        y: y - Math.random() * 8,
        vx: puffVx,
        vy: puffVy,
        r: 9 + Math.random() * 10,
        color: Math.random() < 0.5 ? '#D6C6AE' : '#E7DCC8',
        life: maxLife,
        maxLife,
        gravity: -18,
        kind: 'dust',
        drag: 3.4,
        grow: 1.55,
      });
    }
  };

  const spawnLandingFx = (x: number, intensity = 1.0) => {
    const s = simRef.current;
    const impact = Math.max(0.55, Math.min(1.5, intensity));

    // Expanding ground shockwave ring at boot contact
    s.landingRings.push({
      x,
      y: FLOOR_Y + 4,
      rx: 34,
      maxRx: 145 + impact * 45,
      life: 0.4,
      maxLife: 0.4,
      color: 'rgba(180, 83, 9, 0.55)',
    });
    if (impact > 0.85) {
      s.landingRings.push({
        x,
        y: FLOOR_Y + 4,
        rx: 22,
        maxRx: 98 + impact * 28,
        life: 0.28,
        maxLife: 0.28,
        color: 'rgba(217, 119, 6, 0.42)',
      });
    }

    // Bilateral billowing dust plumes shooting outward from both boots
    const plumeCount = Math.round(5 + impact * 5);
    spawnDustPuff(x - 30, FLOOR_Y - 3, -1, plumeCount, 240 * impact);
    spawnDustPuff(x + 30, FLOOR_Y - 3, 1, plumeCount, 240 * impact);

    // Subtle golden/brass impact sparks
    for (let i = 0; i < Math.round(6 + impact * 5); i++) {
      const side = i % 2 === 0 ? -1 : 1;
      s.particles.push({
        x: x + side * (16 + Math.random() * 24),
        y: FLOOR_Y - 6,
        vx: side * (120 + Math.random() * 220 * impact),
        vy: -(70 + Math.random() * 165 * impact),
        r: 2.5 + Math.random() * 3,
        color: Math.random() < 0.5 ? '#F59E0B' : '#B45309',
        life: 0.28 + Math.random() * 0.2,
        maxLife: 0.48,
        gravity: 680,
        kind: 'dot',
      });
    }

    // Biomechanical compression impulse on legs, body squash, belly slosh, arms, tail & subtle shake
    s.spLand.v += 13 * impact;
    s.spSq.v += 2.3 * impact;
    s.spSx.v += 1.45 * impact;
    s.bellyVel += 0.24 * impact;
    s.spLa.v -= 26 * impact;
    s.spRa.v += 26 * impact;
    s.spTail.v += 38 * impact;
    s.shakeTimer = Math.max(s.shakeTimer, 0.08 * impact);
    synthRef.current?.playLanding(impact);
  };

  const spawnFloater = (x: number, y: number, text: string, color: string, size = 24) => {
    simRef.current.floaters.push({
      x,
      y,
      vy: -76,
      text,
      color,
      size,
      life: 0.82,
      maxLife: 0.82,
    });
  };

  const spawnCoinExpireFx = (x: number, y: number, vx = 0, vy = 0) => {
    const s = simRef.current;
    s.impactFlashes.push({
      x,
      y,
      r: 10,
      maxR: 38,
      nx: 0,
      ny: -1,
      life: 0.3,
      maxLife: 0.3,
      color: '#FDE68A',
      coreColor: '#FFFBEB',
    });

    for (let i = 0; i < 4; i++) {
      const ang = (Math.PI * 2 * i) / 4 + Math.random() * 0.6;
      const spd = 28 + Math.random() * 48;
      const maxLife = 0.34 + Math.random() * 0.22;
      s.particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: vx * 0.06 + Math.cos(ang) * spd,
        vy: vy * 0.04 - 38 - Math.random() * 42,
        r: 4.5 + Math.random() * 3.5,
        color: i % 2 === 0 ? '#FDE047' : '#FFFBEB',
        life: maxLife,
        maxLife,
        gravity: -45,
        kind: 'gleam',
        rot: Math.random() * 90,
        vrot: (Math.random() - 0.5) * 260,
        drag: 3.6,
      });
    }

    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
      const spd = 35 + Math.random() * 75;
      const maxLife = 0.28 + Math.random() * 0.18;
      s.particles.push({
        x,
        y,
        vx: vx * 0.08 + Math.cos(ang) * spd,
        vy: vy * 0.05 - 24 + Math.sin(ang) * spd * 0.5,
        r: 2.2 + Math.random() * 2.2,
        color: i % 3 === 0 ? '#FFFBEB' : i % 3 === 1 ? '#FDE68A' : '#FBBF24',
        life: maxLife,
        maxLife,
        gravity: -30,
        kind: 'dot',
        drag: 4.5,
      });
    }
  };

  const spawnCollisionFx = (x: number, y: number, nx: number, ny: number, color = '#F59E0B', intense = false) => {
    const s = simRef.current;
    const nLen = Math.hypot(nx, ny) || 1;
    const ux = nx / nLen;
    const uy = ny / nLen;

    s.impactFlashes.push({
      x,
      y,
      r: intense ? 12 : 8,
      maxR: intense ? 52 : 34,
      nx: ux,
      ny: uy,
      life: intense ? 0.24 : 0.18,
      maxLife: intense ? 0.24 : 0.18,
      color,
      coreColor: '#FFFBEB',
    });

    const sparkCount = intense ? 9 : 6;
    const baseAngle = Math.atan2(uy, ux);
    for (let i = 0; i < sparkCount; i++) {
      const ang = baseAngle + (Math.random() - 0.5) * 1.9;
      const spd = (intense ? 210 : 140) + Math.random() * (intense ? 230 : 160);
      const maxLife = 0.22 + Math.random() * 0.16;
      s.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 35,
        r: 2.2 + Math.random() * 2.4,
        color: i % 3 === 0 ? '#FFFBEB' : color,
        life: maxLife,
        maxLife,
        gravity: 560,
        kind: 'dot',
        drag: 2.8,
      });
    }

    const gleamCount = intense ? 3 : 2;
    for (let i = 0; i < gleamCount; i++) {
      const ang = baseAngle + (Math.random() - 0.5) * 1.4;
      const spd = 75 + Math.random() * 110;
      const maxLife = 0.26 + Math.random() * 0.14;
      s.particles.push({
        x: x + ux * 6,
        y: y + uy * 6,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 20,
        r: intense ? 7.5 : 5.5,
        color: i === 0 ? '#FEF08A' : color,
        life: maxLife,
        maxLife,
        gravity: 140,
        kind: 'gleam',
        rot: Math.random() * 90,
        vrot: (Math.random() - 0.5) * 320,
        drag: 3.2,
      });
    }
  };

  const getBallWorldCenterY = () => {
    const s = simRef.current;
    const m = s.ballMorph;
    const rBall = getBallSvgRadius(s.bellyLevel);
    const ballIdealDropY = 911 - (BALL_CY + rBall);
    const normalCenterY = FLOOR_Y + s.py + (545 - 911) * PIGGY_SCALE;
    const ballCenterY = FLOOR_Y + s.py + (BALL_CY + ballIdealDropY - 911) * PIGGY_SCALE;
    return normalCenterY * (1 - m) + ballCenterY * m;
  };

  const moveHandWithCollision = useCallback((desiredCx: number, desiredCy: number, dt: number, fromPointer = false) => {
    const s = simRef.current;
    const clampedDestX = Math.max(24, Math.min(WORLD_W - 24, desiredCx));
    const clampedDestY = Math.max(24, Math.min(WORLD_H - 24, desiredCy));

    const hasPiggyBody =
      (s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') &&
      !(s.bossAction === 'BREAKING' && s.breakStage >= 1);

    if (!hasPiggyBody) {
      s.cx = clampedDestX;
      s.cy = clampedDestY;
      return;
    }

    const handR = 30;
    const inBallMode = s.ballMorph > 0.35;
    const ballR = getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE;
    const bodyRx = inBallMode ? ballR * 0.96 : 62 + s.bellyLevel * 28;
    const bodyRy = inBallMode ? ballR * 0.96 : 84 + s.bellyLevel * 22;
    const ex = bodyRx + handR;
    const ey = bodyRy + handR;
    const pyCenter = getBallWorldCenterY();

    const startX = s.cx;
    const startY = s.cy;
    const totalDx = clampedDestX - startX;
    const totalDy = clampedDestY - startY;
    const totalDist = Math.hypot(totalDx, totalDy);
    const steps = Math.max(1, Math.min(18, Math.ceil(totalDist / 16)));
    const stepDx = totalDx / steps;
    const stepDy = totalDy / steps;

    let curX = startX;
    let curY = startY;
    let collided = false;
    let hitNx = 0;
    let hitNy = -1;

    for (let i = 0; i < steps; i++) {
      curX += stepDx;
      curY += stepDy;
      const hx = curX + s.handOffsetX;
      const hy = curY + s.handHopY + s.handOffsetY;
      const nx = (hx - s.px) / ex;
      const ny = (hy - pyCenter) / ey;
      const d2 = nx * nx + ny * ny;
      if (d2 < 1) {
        collided = true;
        if (d2 < 0.0001) {
          const fbDx = startX - s.px;
          const fbDy = startY - pyCenter;
          const fbLen = Math.hypot(fbDx, fbDy) || 1;
          hitNx = fbDx / fbLen;
          hitNy = fbDy / fbLen;
          curX = s.px + hitNx * ex * 1.004 - s.handOffsetX;
          curY = pyCenter + hitNy * ey * 1.004 - s.handHopY - s.handOffsetY;
        } else {
          const rawNx = (hx - s.px) / (ex * ex);
          const rawNy = (hy - pyCenter) / (ey * ey);
          const nLen = Math.hypot(rawNx, rawNy) || 1;
          hitNx = rawNx / nLen;
          hitNy = rawNy / nLen;
          const invD = 1 / Math.sqrt(d2);
          const pushedHx = s.px + (hx - s.px) * invD * 1.005;
          const pushedHy = pyCenter + (hy - pyCenter) * invD * 1.005;
          curX = pushedHx - s.handOffsetX;
          curY = pushedHy - s.handHopY - s.handOffsetY;
        }
      }
    }

    s.cx = Math.max(24, Math.min(WORLD_W - 24, curX));
    s.cy = Math.max(24, Math.min(WORLD_H - 24, curY));

    if (!collided) return;

    // Deflect active dash, glide, and hop velocities cleanly off the piggy surface
    if (s.dashTimer > 0) {
      const dotDash = s.dashVx * hitNx + s.dashVy * hitNy;
      if (dotDash < 0) {
        s.dashVx = (s.dashVx - 1.65 * dotDash * hitNx) * 0.72;
        s.dashVy = (s.dashVy - 1.65 * dotDash * hitNy) * 0.72;
        s.dashTimer = Math.min(s.dashTimer, 0.06);
      }
    }
    if (s.handGlideTimer > 0) {
      const dotGlide = s.handGlideVx * hitNx + s.handGlideVy * hitNy;
      if (dotGlide < 0) {
        s.handGlideVx = (s.handGlideVx - 1.7 * dotGlide * hitNx) * 0.78;
        s.handGlideVy = (s.handGlideVy - 1.7 * dotGlide * hitNy) * 0.78;
      }
    }
    if (s.handHopVy !== 0 && s.handHopVy * hitNy < 0) {
      s.handHopVy = -s.handHopVy * 0.55;
    }

    const contactX = s.px + hitNx * bodyRx;
    const contactY = pyCenter + hitNy * bodyRy;
    s.handContactX = contactX;
    s.handContactY = contactY;
    s.handContactNx = hitNx;
    s.handContactNy = hitNy;
    s.handShieldFlash = 0.28;

    const handMoveSpd = totalDist / Math.max(dt, 0.016);
    const piggySpd = Math.hypot(s.realVx, s.vAlt * PIGGY_SCALE);
    const impactSpeed = Math.min(1400, handMoveSpd * (fromPointer ? 0.65 : 1) + piggySpd);
    const fxColor = inBallMode ? '#38BDF8' : s.nervousLevel > 0.4 ? '#EF4444' : '#F59E0B';

    if (s.handColCooldown <= 0) {
      s.handColCooldown = 0.115;
      const intense = impactSpeed > 320 || s.dashTimer > 0 || s.handGlideTimer > 0 || inBallMode;
      spawnCollisionFx(contactX, contactY, hitNx, hitNy, fxColor, intense);
      s.landingRings.push({
        x: contactX,
        y: contactY,
        rx: 12,
        maxRx: intense ? 64 : 44,
        life: 0.24,
        maxLife: 0.24,
        color: inBallMode ? 'rgba(56, 189, 248, 0.62)' : 'rgba(245, 158, 11, 0.62)',
      });

      const kick = Math.min(22, 7 + impactSpeed * 0.02);
      s.handBounceVx = hitNx * (150 + Math.min(340, impactSpeed * 0.36));
      s.handBounceVy = hitNy * (150 + Math.min(340, impactSpeed * 0.36));
      s.handOffsetX += hitNx * kick;
      s.handOffsetY += hitNy * kick;
      s.handScaleX = Math.abs(hitNx) > Math.abs(hitNy) ? 0.78 : 1.22;
      s.handScaleY = Math.abs(hitNx) > Math.abs(hitNy) ? 1.22 : 0.78;

      // Tactile piggy armor/balloon response
      s.bellyVel += 0.11 + Math.min(0.16, impactSpeed * 0.00022);
      s.bossFlash = Math.max(s.bossFlash, 0.08);
      s.hurtTimer = Math.max(s.hurtTimer, 0.11);
      s.hurtDir = hitNx >= 0 ? -1 : 1;
      if (inBallMode) {
        s.spBallWall.v += 2.1;
        s.ballSpin += hitNx * 85;
      }
      if (intense) {
        s.shakeTimer = Math.max(s.shakeTimer, 0.075);
      }

      // Trigger or extend Dizzy State upon solid hand-to-piggy collision
      const wasDizzy = s.dizzyTimer;
      const dizzyAdd = intense ? 0.55 : 0.3;
      const dizzyFloor = intense ? 1.85 : 1.2;
      s.dizzyTimer = Math.min(2.4, Math.max(s.dizzyTimer + dizzyAdd, dizzyFloor));
      s.spLean.v += hitNx * (intense ? 38 : 22);
      if (wasDizzy <= 0.12 || intense) {
        const starBaseY = pyCenter - bodyRy * 0.85;
        for (let di = 0; di < (intense ? 5 : 3); di++) {
          const sa = (Math.PI * 2 * di) / (intense ? 5 : 3) + Math.random() * 0.5;
          s.particles.push({
            x: s.px + Math.cos(sa) * 28,
            y: starBaseY + Math.sin(sa) * 10,
            vx: Math.cos(sa) * (95 + Math.random() * 80) + hitNx * 40,
            vy: -95 - Math.random() * 90,
            r: 4.5 + Math.random() * 2.2,
            color: di % 2 === 0 ? '#FACC15' : '#FB923C',
            life: 0.42,
            maxLife: 0.42,
            gravity: 240,
            kind: 'gleam',
            rot: Math.random() * 120,
            vrot: (di % 2 === 0 ? 1 : -1) * 340,
            drag: 2.5,
          });
        }
        if (wasDizzy <= 0.12) {
          spawnFloater(s.px, starBaseY - 24, 'DIZZY!', '#D97706', 22);
        }
        synthRef.current?.playDizzy(intense);
      }

      synthRef.current?.playHandBump(Math.min(1.3, 0.45 + impactSpeed / 700), inBallMode);
    } else if (s.handScrapeFxAcc >= 0.045) {
      s.handScrapeFxAcc = 0;
      const tangX = -hitNy;
      const tangY = hitNx;
      const side = Math.random() < 0.5 ? -1 : 1;
      s.particles.push({
        x: contactX + (Math.random() - 0.5) * 8,
        y: contactY + (Math.random() - 0.5) * 8,
        vx: hitNx * 90 + tangX * side * (110 + Math.random() * 110),
        vy: hitNy * 90 + tangY * side * (110 + Math.random() * 110) - 30,
        r: 2.3 + Math.random() * 1.8,
        color: Math.random() < 0.4 ? '#FEF08A' : fxColor,
        life: 0.2,
        maxLife: 0.2,
        gravity: 420,
        kind: 'dot',
        drag: 3,
      });
    }
  }, []);

  const getSlotHolePos = () => {
    const s = simRef.current;
    const m = s.ballMorph;
    const aS = Math.min(1.3, s.bellyGoal + m * 0.25);
    const sgS = 150 + 70 * aS;
    const gS = 0.9 * aS;
    const dxS = 545 - 560;
    const dyS = 450 - 650;
    const kS = gS * Math.exp(-(dxS * dxS + dyS * dyS) / (2 * sgS * sgS));
    const slotOffX = dxS * kS;
    const slotOffY = dyS * kS;

    const normalRelX = 512 + slotOffX - 550;
    const normalRelY = 348 + slotOffY - 545;
    const rBall = getBallSvgRadius(s.bellyLevel);
    const ballRelX = -32;
    const ballRelY = -rBall * 0.54;
    const baseRelX = (normalRelX * (1 - m) + ballRelX * m) * PIGGY_SCALE * (s.dir > 0 ? -1 : 1);
    const baseRelY = (normalRelY * (1 - m) + ballRelY * m) * PIGGY_SCALE;
    const screenRad = (s.dir > 0 ? -1 : 1) * ((s.ballAngle * m * Math.PI) / 180);
    const cosA = Math.cos(screenRad);
    const sinA = Math.sin(screenRad);
    const rotX = baseRelX * cosA - baseRelY * sinA;
    const rotY = baseRelX * sinA + baseRelY * cosA;
    const centerY = getBallWorldCenterY();
    return {
      x: s.px + rotX,
      y: centerY + rotY,
    };
  };

  // Shared live trajectory solver supporting both curved sling arcs and non-curved straight laser beams
  // Deterministic, predictive & dynamic: starts low on press, sweeps through predicted moving slot, and climbs to top!
  const getSlingLaunchState = () => {
    const s = simRef.current;
    const profile = LASER_PROFILES[s.laserStyle];
    const handX = s.cx + s.handOffsetX;
    const handY = s.cy + s.handHopY + s.handOffsetY;
    const slot = getSlotHolePos();
    const charge = s.handCharge;
    const rawElev = Math.max(0, Math.min(1, s.laserElev));
    const elev = 0.42 * rawElev + 0.58 * (rawElev * rawElev * (3 - 2 * rawElev));

    const predictSlot = (estT: number) => {
      const t = Math.max(0, Math.min(0.42, estT));
      if (s.bossAction === 'BOUNCY_BALL') {
        const gBall = 1740 + s.nervousLevel * 320;
        let ix = slot.x + s.ballVx * t;
        if (ix < MIN_X) ix = MIN_X + (MIN_X - ix);
        else if (ix > MAX_X) ix = MAX_X - (ix - MAX_X);
        let iy = slot.y + s.ballVy * t + 0.5 * gBall * t * t;
        if (iy > FLOOR_Y - 58) iy = FLOOR_Y - 58 - (iy - (FLOOR_Y - 58)) * 0.65;
        return {
          x: Math.max(MIN_X - 24, Math.min(MAX_X + 24, ix)),
          y: Math.max(82, Math.min(FLOOR_Y - 48, iy)),
        };
      }
      const pvx = s.bossAction === 'PATTERN_STOP' ? 0 : s.realVx;
      const pvy = s.bossAction === 'PATTERN_STOP' || s.bossAction === 'WALK' ? 0 : -s.vAlt * PIGGY_SCALE;
      return {
        x: Math.max(MIN_X - 24, Math.min(MAX_X + 24, slot.x + pvx * t)),
        y: Math.max(86, Math.min(FLOOR_Y - 48, slot.y + pvy * t)),
      };
    };

    const dist0 = Math.hypot(slot.x - handX, slot.y - handY);
    const estT = profile.curved
      ? (0.28 + elev * 0.24 + Math.min(0.2, dist0 / 2400)) * profile.flightScale
      : dist0 / Math.max(700, profile.straightSpeed * (0.92 + elev * 0.42));
    const intercept = predictSlot(estT);

    // Low-to-Top elevation curve anchored cleanly so mid-hold (~48%) sweeps accurately through the predicted chest slot
    const lowY = Math.min(FLOOR_Y - 12, intercept.y + 168);
    const topY = Math.max(68, Math.min(220, intercept.y - 220));
    const targetY =
      elev <= 0.48
        ? lowY + (intercept.y - lowY) * (elev / 0.48)
        : intercept.y + (topY - intercept.y) * ((elev - 0.48) / 0.52);
    const targetX = intercept.x;

    const dxRaw = targetX - handX;
    const dyTarget = targetY - handY;
    const dist = Math.hypot(dxRaw, dyTarget);

    let baseAngle = Math.atan2(dyTarget, Math.abs(dxRaw) < 4 ? (s.facing < 0 ? 4 : -4) : dxRaw);
    let baseSpeed = profile.straightSpeed * (0.9 + elev * 0.44);
    const gravity = profile.gravity;

    if (profile.curved) {
      // Adaptive flight time guarantees curved coins clear shoulder armor and descend cleanly into the slot
      const lobBlend = Math.max(0, Math.min(1, (160 - dyTarget) / 260));
      const baseFlightT =
        (0.28 + elev * 0.23 + lobBlend * 0.1 + Math.min(0.22, dist / 2400)) *
        profile.flightScale *
        (1 - charge * 0.12);
      const minDropT =
        elev >= 0.28
          ? Math.sqrt((2 * Math.max(36, -dyTarget + 88)) / Math.max(400, gravity))
          : 0.16;
      const flightT = Math.max(baseFlightT, minDropT);
      const idealVx = dxRaw / Math.max(0.14, flightT);
      const idealVy = (dyTarget - 0.5 * gravity * flightT * flightT) / Math.max(0.14, flightT);
      baseAngle = Math.atan2(idealVy, idealVx);
      baseSpeed = Math.min(2120, Math.hypot(idealVx, idealVy));
    }

    // Dynamic deterministic responsiveness from hand vertical hop & horizontal glide (zero random logic)
    const hopDynamicBend = Math.max(-0.16, Math.min(0.16, s.handHopVy * -0.0002));
    const glideDynamicBend = Math.max(-0.16, Math.min(0.16, s.velX * 0.00012)) * (profile.curved ? 1 : 0.45);
    const launchAngle = baseAngle + hopDynamicBend + glideDynamicBend;
    const launchSpeed = Math.max(290, baseSpeed * (1 + charge * (profile.curved ? 0.08 : 0.18)));
    const vx = Math.cos(launchAngle) * launchSpeed + (profile.curved ? s.velX * 0.06 : 0);
    const vy = Math.sin(launchAngle) * launchSpeed + s.handHopVy * 0.12;
    const launchFacing = vx >= 0 ? 1 : -1;

    return {
      spawnX: handX + Math.cos(launchAngle) * 12,
      spawnY: handY + Math.sin(launchAngle) * 8 + 6,
      vx,
      vy,
      gravity,
      profile,
      launchAngle,
      baseAngle,
      facing: launchFacing,
      slot,
      charge,
      elev,
      targetX,
      targetY,
      interceptX: intercept.x,
      interceptY: intercept.y,
    };
  };

  const setupRound = useCallback((roundNum: number, resetRun: boolean) => {
    const s = simRef.current;
    const targetCoins = 3;
    const holdWindow =
      s.difficulty === 'FRENZY'
        ? Math.max(2.6, 3.8 - (roundNum - 1) * 0.16)
        : Math.max(3.2, 4.8 - (roundNum - 1) * 0.18);

    if (resetRun) {
      s.score = 0;
      s.combo = 0;
      s.slotDrops = 0;
      s.piggiesBroken = 0;
      s.round = 1;
    } else {
      s.round = roundNum;
    }

    const patIdx = (s.round - 1) % ROUND_PATTERNS.length;
    const pat = ROUND_PATTERNS[patIdx];
    const startSpot = pat.spots[0];
    const frenzyFactor = s.difficulty === 'FRENZY' ? 1.24 : 1.0;
    const roundSpeedBoost = 1 + Math.floor((s.round - 1) / ROUND_PATTERNS.length) * 0.16;
    const stopDur = Math.max(0.34, pat.baseStop / (frenzyFactor * roundSpeedBoost));

    s.patternIndex = patIdx;
    s.spotIndex = 0;
    s.visitedSpots = new Set([0]);
    s.stopDuration = stopDur;
    s.px = startSpot.x;
    s.goalAlt = startSpot.alt;
    s.alt = startSpot.alt;
    s.prevAlt = startSpot.alt;
    s.vAlt = 0;
    s.py = -startSpot.alt * PIGGY_SCALE;
    s.vx = 0;
    s.vy = 0;
    s.realVx = 0;
    s.prevRealVx = 0;
    s.realAx = 0;
    s.trailSampleAcc = 0;
    s.onGround = startSpot.alt < 1;
    s.dir = startSpot.x < WORLD_W * 0.5 ? 1 : -1;
    s.walkM = 0;
    s.pumpProgress = 0;
    s.pumpTarget = targetCoins;
    s.sinceLastSlotHit = 0;
    s.pumpHoldMax = holdWindow;
    s.pumpHoldTimer = 0;
    s.pressureBleedFxAcc = 0;
    s.bossAction = 'PATTERN_STOP';
    s.bossTimer = stopDur;
    s.walkTimer = 0;
    s.walkTurnPause = 0;
    s.playerIdleTimer = 0;
    s.bossFlash = 0;
    s.hurtTimer = 0;
    s.breakTimer = 0;
    s.ballMorph = 0;
    s.ballAngle = 0;
    s.ballSpin = 0;
    s.ballVx = 0;
    s.ballVy = 0;
    s.ballTimer = 0;
    s.ballSquashContact = 0;
    s.stopsSinceBall = 0;
    s.ballTriggerStops = s.difficulty === 'FRENZY' ? 2 : 3;
    s.nervousLevel = 0;
    s.nervousPanicTimer = 0;
    s.nervousSteamAcc = 0;
    s.nervousDartTimer = 0;
    s.nervousJitterX = 0;
    s.swallowTimer = 0;
    s.slotGlowTimer = 0;
    s.slotReceiveTilt = 0;
    s.thrS = startSpot.alt > 0 ? 0.35 : 0;
    s.moveFromX = startSpot.x;
    s.moveFromAlt = startSpot.alt;
    s.moveTargetX = startSpot.x;
    s.moveTargetAlt = startSpot.alt;
    s.moveElapsed = 0;
    s.moveDuration = 0.52;
    s.moveArcAlt = 0;
    s.bellyLevel = 0.02;
    s.bellyGoal = 0.02;
    s.bellyVel = 0.04;
    s.spLand.x = 0;
    s.spLand.v = 0;
    s.spBallSq.x = 0;
    s.spBallSq.v = 0;
    s.spBallWall.x = 0;
    s.spBallWall.v = 0;
    s.dashCooldown = 0;
    s.dashTimer = 0;
    s.handHoldActive = false;
    s.handHoldDuration = 0;
    s.handCharge = 0;
    s.handChargeStep = 0;
    s.handHopY = 0;
    s.handHopVy = 0;
    s.handOffsetX = 0;
    s.handOffsetY = 0;
    s.handTiltDeg = 0;
    s.handScaleX = 1;
    s.handScaleY = 1;
    s.handGlideTimer = 0;
    s.handGlideVx = 0;
    s.handGlideVy = 0;
    s.dashHolding = false;
    s.dashGlideFuel = 0;
    s.handColCooldown = 0;
    s.handScrapeFxAcc = 0;
    s.handBounceVx = 0;
    s.handBounceVy = 0;
    s.handShieldFlash = 0;
    s.dizzyTimer = 0;
    s.dizzyLevel = 0;
    s.dizzyPhase = 0;
    s.revolverMax = REVOLVER_CHAMBERS;
    s.revolverChambers = REVOLVER_CHAMBERS;
    s.cylinderAngle = 0;
    s.cylinderTargetAngle = 0;
    s.isReloading = false;
    s.reloadTimer = 0;
    s.reloadDuration = s.difficulty === 'FRENZY' ? 1.24 : 1.15;
    s.reloadSoundStep = 0;
    s.reloadCompleteFlash = 0;
    s.dryClickFlash = 0;
    s.projectiles = [];
    s.particles = [];
    s.floaters = [];
    s.afterimages = [];
    s.piggyTrail = [];
    s.ballAfterimages = [];
    s.landingRings = [];
    s.impactFlashes = [];
    s.droppingCoins = [];
    s.slotIntakePulses = [];
    s.shockwaves = [];
    s.debrisItems = [];
    s.disassemblyParts = [];
    s.breakStage = 0;
    for (const partEl of [
      s.topScrewWrap,
      s.leftPauldron,
      s.rightPauldronWrap,
      s.slotEjectWrap,
      s.leftArmTuck,
      s.rightArmTuck,
      s.tailEjectWrap,
      s.jetTuckWrap,
      s.torsoChestWrap,
      s.torsoBellyWrap,
      s.torsoPelvisWrap,
      s.leg0Wrap,
      s.leg1Wrap,
    ]) {
      if (!partEl) continue;
      partEl.setAttribute('transform', '');
      partEl.style.opacity = '1';
    }
    if (s.piggyInnerCore) s.piggyInnerCore.setAttribute('opacity', '0');
    if (s.topScrewShank) s.topScrewShank.setAttribute('opacity', '0');
    if (s.leftSocket) s.leftSocket.style.opacity = '1';
    if (s.rightSocket) s.rightSocket.style.opacity = '1';
    if (s.piggyPos) {
      s.piggyPos.style.opacity = '1';
      s.piggyPos.style.filter = '';
    }
    const initProfile =
      s.laserModeSetting === 'AUTO'
        ? LASER_PROFILES[LASER_STYLE_ORDER[(roundNum - 1) % LASER_STYLE_ORDER.length]]
        : LASER_PROFILES[s.laserModeSetting];
    s.laserStyle = initProfile.id;
    s.laserIndex = LASER_STYLE_ORDER.indexOf(initProfile.id);
    s.laserSwitchTimer = 5.0;
    s.laserElev = 0;
    s.laserGrow = 0;
    s.laserFadeTimer = 0;
    s.laserHoldSnapshot = 0;
    s.laserIgniteFlash = 0;
    s.slingPhase = 0;
    s.slingSubPhase = 0;
    s.slingSpeed = initProfile.sweepRate;
    s.slingTargetSpeed = initProfile.sweepRate;
    s.slingSubSpeed = initProfile.subRate;
    s.slingTargetSubSpeed = initProfile.subRate;
    s.slingAngleSpan = initProfile.angleSpan;
    s.slingTargetAngleSpan = initProfile.angleSpan;
    s.slingPowerBias = 0;
    s.slingTargetPowerBias = 0;
    s.slingMorphTimer = 1.5;
    s.slingSeed = 0;
    s.slingLocked = false;
    s.phase = 'PLAYING';

    setPhase('PLAYING');
    setHud((prev) => ({
      ...prev,
      score: s.score,
      bestScore: s.bestScore,
      round: s.round,
      patternName: pat.name,
      spotIndex: 0,
      spotTotal: pat.spots.length,
      pumpProgress: 0,
      pumpTarget: targetCoins,
      pumpHoldPct: 0,
      bellyPct: 0,
      bossActionLabel: `Pattern: ${pat.name}`,
      dashReadyPct: 100,
      revolverChambers: REVOLVER_CHAMBERS,
      revolverMax: REVOLVER_CHAMBERS,
      isReloading: false,
      reloadPct: 100,
      combo: s.combo,
      slotDrops: s.slotDrops,
      piggiesBroken: s.piggiesBroken,
      laserStyle: initProfile.id,
      laserLabel: initProfile.shortLabel,
      laserCurved: initProfile.curved,
      laserModeSetting: s.laserModeSetting,
      nervousPct: 0,
      isNervous: false,
      handChargePct: 0,
      handStateLabel: '',
    }));
  }, []);

  const applyLaserStyle = useCallback((styleId: LaserStyleId, announce = false) => {
    const s = simRef.current;
    const p = LASER_PROFILES[styleId];
    s.laserStyle = styleId;
    s.laserIndex = Math.max(0, LASER_STYLE_ORDER.indexOf(styleId));
    const fBoost = s.difficulty === 'FRENZY' ? 1.2 : 1.0;
    s.slingTargetSpeed = p.sweepRate * fBoost;
    s.slingTargetSubSpeed = p.subRate * fBoost;
    s.slingTargetAngleSpan = p.angleSpan;
    s.slingTargetPowerBias = 0;
    if (announce) {
      spawnFloater(s.cx, s.cy - 68, `${p.shortLabel.toUpperCase()}!`, p.beamColor, 16);
      synthRef.current?.playCylinderTick(s.laserIndex);
    }
  }, []);

  const cycleLaserMode = useCallback(() => {
    const modes: LaserModeSetting[] = ['AUTO', ...LASER_STYLE_ORDER];
    const s = simRef.current;
    s.playerIdleTimer = 0;
    const curIdx = modes.indexOf(s.laserModeSetting);
    const nextMode = modes[(curIdx + 1) % modes.length];
    s.laserModeSetting = nextMode;
    setLaserMode(nextMode);
    if (nextMode === 'AUTO') {
      s.laserSwitchTimer = 4.2;
      spawnFloater(s.cx, s.cy - 68, 'AUTO VARIETY MIX!', '#B45309', 16);
      synthRef.current?.playReloadComplete();
    } else {
      applyLaserStyle(nextMode, true);
    }
  }, [applyLaserStyle]);

  const startFight = useCallback(
    (diff?: Difficulty) => {
      synthRef.current?.unlock();
      if (diff) {
        simRef.current.difficulty = diff;
        setDifficulty(diff);
      }
      setupRound(1, true);
      synthRef.current?.playMoneyHurt(0.2);
    },
    [setupRound]
  );

  useEffect(() => {
    if (autoStart) {
      setupRound(1, true);
    }
  }, [autoStart, setupRound]);

  const startRevolverReload = useCallback((playTick = true) => {
    const s = simRef.current;
    s.playerIdleTimer = 0;
    if (s.phase !== 'PLAYING' && s.phase !== 'TITLE_MENU') return;
    if (s.isReloading || s.revolverChambers >= s.revolverMax) return;
    s.isReloading = true;
    s.reloadTimer = 0;
    s.reloadSoundStep = 0;
    s.revolverChambers = 0;
    s.throwHolding = false;
    if (playTick) synthRef.current?.playCylinderTick(0);
  }, []);

  // Hand/Cursor Hit State: Revolver-Gated Sling-Laser Coin Throw (https://i.imgur.com/XE4l8eT.png)
  const throwCoin = useCallback(
    (fromHold = false, chargePower = 0) => {
      const s = simRef.current;
      synthRef.current?.unlock();
      if (s.phase !== 'PLAYING' && s.phase !== 'TITLE_MENU') return false;
      if (s.throwCooldown > 0) return false;

      if (s.isReloading) {
        if (!fromHold) {
          s.dryClickFlash = 0.22;
          synthRef.current?.playDryClick();
        }
        return false;
      }

      if (s.revolverChambers <= 0) {
        if (!fromHold) {
          s.dryClickFlash = 0.22;
          synthRef.current?.playDryClick();
        }
        startRevolverReload(false);
        return false;
      }

      const pwr = Math.max(0, Math.min(1, chargePower));
      const launch = getSlingLaunchState();
      s.revolverChambers -= 1;
      s.cylinderTargetAngle += (Math.PI * 2) / s.revolverMax;
      s.throwCooldown = s.throwCooldownMax;
      s.throwAnimTimer = 0.13;
      s.facing = -launch.facing;
      if (pwr < 0.15) {
        synthRef.current?.playThrow();
      }

      const pumpValue = 1.0;
      s.projectiles.push({
        kind: 'thrown_coin',
        x: launch.spawnX,
        y: launch.spawnY,
        vx: launch.vx,
        vy: launch.vy,
        r: 21 + pwr * 6,
        rot: 0,
        vrot: launch.facing * (680 + pwr * 420),
        life: 2.0 + pwr * 0.25,
        maxLife: 2.0 + pwr * 0.25,
        gravity: launch.gravity,
        bounces: 0,
        armorHitCooldown: 0,
        power: pwr,
        pumpValue,
        missedHandled: false,
      });

      // Revolver empties -> swing out cylinder & sweep orbit threshold to reload
      if (s.revolverChambers <= 0) {
        startRevolverReload(true);
      }
      return true;
    },
    [startRevolverReload]
  );

  const performDash = useCallback((extendGlide = false) => {
    const s = simRef.current;
    s.playerIdleTimer = 0;
    synthRef.current?.unlock();
    if (s.phase !== 'PLAYING') return;
    if (s.dashCooldown > 0) return;

    const dx = s.cx - s.prevCx;
    const dy = s.cy - s.prevCy;
    let ang = Math.atan2(dy, dx);
    if (Math.hypot(dx, dy) < 1.5) {
      ang = Math.atan2(s.cy - (FLOOR_Y + s.py - Math.round(205 * PIGGY_UNIT)), s.cx - s.px);
    }

    s.dashCooldown = s.dashMaxCooldown;
    s.dashTimer = 0.16;
    s.dashVx = Math.cos(ang) * 1950;
    s.dashVy = Math.sin(ang) * 1950;
    s.handHopVy = Math.min(s.handHopVy, -380);
    s.handScaleX = 1.2;
    s.handScaleY = 0.84;
    if (extendGlide) {
      s.dashHolding = true;
      s.dashGlideFuel = 0.65;
    }
    s.throwAnimTimer = 0.14;
    synthRef.current?.playDash();
    spawnBurst(s.cx, s.cy, '#38BDF8', 10, 260, 0);
  }, []);

  // Tap vs. Hold vs. Release Hand Controller
  const startHandPress = useCallback(() => {
    const s = simRef.current;
    s.playerIdleTimer = 0;
    synthRef.current?.unlock();
    if (s.phase !== 'PLAYING' && s.phase !== 'TITLE_MENU') return;
    if (s.isReloading) {
      s.dryClickFlash = 0.22;
      synthRef.current?.playDryClick();
      return;
    }
    if (s.revolverChambers <= 0) {
      s.dryClickFlash = 0.22;
      synthRef.current?.playDryClick();
      startRevolverReload(false);
      return;
    }
    if (s.handHoldActive) return;
    s.handHoldActive = true;
    s.handHoldDuration = 0;
    s.laserElev = 0;
    s.laserGrow = 0;
    s.laserFadeTimer = 0;
    s.laserHoldSnapshot = 0;
    s.laserIgniteFlash = 1.0;
    s.handCharge = 0;
    s.handChargeStep = 0;
    s.handScaleX = 1.15;
    s.handScaleY = 0.86;
  }, [startRevolverReload]);

  const releaseHandPress = useCallback(() => {
    const s = simRef.current;
    if (!s.handHoldActive) return;
    const dur = s.handHoldDuration;
    const charge = s.handCharge;
    const growSnap = s.laserGrow;
    s.handHoldActive = false;
    s.handHoldDuration = 0;
    s.handCharge = 0;
    s.handChargeStep = 0;

    if (s.phase !== 'PLAYING' && s.phase !== 'TITLE_MENU') {
      s.laserGrow = 0;
      s.laserFadeTimer = 0;
      return;
    }

    if (dur < 0.17) {
      // Quick Tap -> Short Hand Hop + Crisp Snap Coin Toss!
      s.handHopVy = -640;
      s.handScaleX = 0.84;
      s.handScaleY = 1.26;
      s.handTiltDeg = -s.facing * 15;
      s.landingRings.push({
        x: s.cx,
        y: s.cy + 18,
        rx: 10,
        maxRx: 46,
        life: 0.24,
        maxLife: 0.24,
        color: 'rgba(245, 158, 11, 0.45)',
      });
      spawnDustPuff(s.cx, s.cy + 14, -s.facing, 3, 120);
      synthRef.current?.playHandHop();
      throwCoin(false, 0);
      s.laserHoldSnapshot = Math.max(0.14, growSnap);
      s.laserFadeTimer = 0.16;
    } else {
      // Hold Release -> Power Shot + Launch Lunge + Extended Glide!
      const prevCharge = charge;
      // Preserve charge momentarily for getSlingLaunchState inside throwCoin
      s.handCharge = prevCharge;
      const launch = getSlingLaunchState();
      const fired = throwCoin(false, prevCharge);
      s.handCharge = 0;
      s.laserHoldSnapshot = Math.max(0.24, growSnap);
      s.laserFadeTimer = 0.24;
      if (fired) {
        const cosL = Math.cos(launch.launchAngle);
        const sinL = Math.sin(launch.launchAngle);
        s.handOffsetX += cosL * (18 + prevCharge * 28);
        s.handOffsetY += sinL * (14 + prevCharge * 22);
        s.handScaleX = 1.24;
        s.handScaleY = 0.82;
        s.handTiltDeg = ((launch.launchAngle * 180) / Math.PI) * 0.18;
        s.handGlideTimer = 0.28 + prevCharge * 0.44;
        s.handGlideVx = cosL * (240 + prevCharge * 480);
        s.handGlideVy = sinL * (180 + prevCharge * 320) - 90;
        synthRef.current?.playChargedRelease(prevCharge);
        if (prevCharge >= 0.72) {
          spawnCollisionFx(launch.spawnX, launch.spawnY, cosL, sinL, '#FDE047', true);
          spawnFloater(s.cx, s.cy - 68, 'POWER GLIDE!', '#0284C7', 16);
        }
      }
    }
  }, [throwCoin]);

  // Pointer & Keyboard Listeners
  useEffect(() => {
    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const box = stageBoxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = Math.max(24, Math.min(WORLD_W - 24, ((clientX - rect.left) / rect.width) * WORLD_W));
      const ny = Math.max(24, Math.min(WORLD_H - 24, ((clientY - rect.top) / rect.height) * WORLD_H));
      const s = simRef.current;
      if (Math.hypot(nx - s.targetCx, ny - s.targetCy) > 12) {
        s.playerIdleTimer = 0;
      }
      s.targetCx = nx;
      s.targetCy = ny;
      if (s.dashTimer <= 0 && !s.handHoldActive && s.handGlideTimer <= 0) {
        moveHandWithCollision(nx, ny, 0.016, true);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointerFromClient(e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, header, [data-ui-card]')) return;
      updatePointerFromClient(e.clientX, e.clientY);
      const s = simRef.current;
      if (s.phase !== 'PLAYING' && s.phase !== 'TITLE_MENU') return;
      if (e.button === 2) {
        if (s.phase === 'PLAYING') {
          e.preventDefault();
          performDash(true);
        }
      } else {
        startHandPress();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 2) {
        simRef.current.dashHolding = false;
      } else {
        releaseHandPress();
      }
    };

    const onWindowBlur = () => {
      const s = simRef.current;
      s.handHoldActive = false;
      s.handCharge = 0;
      s.laserGrow = 0;
      s.laserFadeTimer = 0;
      s.laserIgniteFlash = 0;
      s.dashHolding = false;
      s.throwHolding = false;
    };

    const onContextMenu = (e: MouseEvent) => {
      if (simRef.current.phase === 'PLAYING') e.preventDefault();
    };

    const onPointerEnter = () => {
      pointerInsideRef.current = true;
    };
    const onPointerLeave = () => {
      pointerInsideRef.current = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      const s = simRef.current;
      const isActiveWithinHost =
        pointerInsideRef.current ||
        s.phase === 'PLAYING' ||
        s.phase === 'PAUSED' ||
        s.phase === 'WHITEPAPER' ||
        Boolean(rootRef.current && rootRef.current.contains(document.activeElement));
      if (!isActiveWithinHost) return;

      if (e.key === ' ' || e.key === 'Shift') {
        if (s.phase === 'PLAYING') {
          e.preventDefault();
          if (!e.repeat) {
            performDash(true);
          } else {
            s.dashHolding = true;
          }
        }
      } else if (e.key === 'j' || e.key === 'J' || e.key === 'f' || e.key === 'F') {
        if ((s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') && !e.repeat) {
          startHandPress();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if ((s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') && !e.repeat) {
          startRevolverReload(true);
        }
      } else if (e.key === 'q' || e.key === 'Q') {
        if ((s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') && !e.repeat) {
          cycleLaserMode();
        }
      } else if (e.key === 'Escape') {
        if (s.phase === 'PLAYING') {
          s.phase = 'PAUSED';
          setPhase('PAUSED');
        } else if (s.phase === 'PAUSED') {
          s.phase = 'PLAYING';
          setPhase('PLAYING');
        } else if (s.phase === 'WHITEPAPER') {
          setupRound(s.round + 1, false);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'J' || e.key === 'f' || e.key === 'F') {
        releaseHandPress();
      } else if (e.key === ' ' || e.key === 'Shift') {
        simRef.current.dashHolding = false;
      }
    };

    const rootEl = rootRef.current;
    rootEl?.addEventListener('pointerenter', onPointerEnter);
    rootEl?.addEventListener('pointerleave', onPointerLeave);
    rootEl?.addEventListener('pointerdown', onPointerDown);
    rootEl?.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      rootEl?.removeEventListener('pointerenter', onPointerEnter);
      rootEl?.removeEventListener('pointerleave', onPointerLeave);
      rootEl?.removeEventListener('pointerdown', onPointerDown);
      rootEl?.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [cycleLaserMode, moveHandWithCollision, performDash, releaseHandPress, setupRound, startHandPress, startRevolverReload]);

  // Main 60fps Loop
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const s = simRef.current;
    const $ = (id: string) => svg.querySelector<SVGElement>(`#${id}`);

    const legsG = $('legs-group') as SVGGElement | null;
    if (!legsG) return;

    const HIPS = [
      { x: 498, y: 782, T: 46 },
      { x: 622, y: 772, T: 56 },
    ];
    const S_LEN = 46;
    const F_LEN = 37;
    const GY = 911;
    const D = Math.PI / 180;

    const bronze = 'fill="url(#leg-bronze-grad)" stroke="#2b1e10" stroke-width="1.5"';
    const hl = 'stroke="#d9b987" stroke-width="3" fill="none" stroke-linecap="round"';
    const legSVG = (i: number, T: number) => `<g id="L${i}-wrap"><g id="L${i}">
      <path d="M-28 -18Q0 -24 28 -18Q31 ${T / 2} 24 ${T}Q0 ${T + 5} -24 ${T}Q-31 ${T / 2} -28 -18Z" ${bronze}/>
      <path d="M-15 -8Q-17 ${T / 2} -13 ${T - 6}" ${hl} opacity=".35"/>
      <g id="S${i}">
        <path d="M-21 0Q0 -5 21 0Q24 ${S_LEN / 2} 18 ${S_LEN}Q0 ${S_LEN + 4} -18 ${S_LEN}Q-24 ${S_LEN / 2} -21 0Z" ${bronze}/>
        <path d="M-11 6Q-13 ${S_LEN / 2} -10 ${S_LEN - 8}" ${hl} opacity=".3"/>
        <circle r="17" fill="#31281e" stroke="#14100a" stroke-width="1.5"/>
        <circle r="15" fill="url(#kn-ring)" stroke="#1d150c" stroke-width="1"/>
        <circle r="11.5" fill="url(#kn-head)" stroke="#2a1d10" stroke-width="1.2"/>
        <circle r="9.3" fill="none" stroke="#f3dca4" stroke-width=".7" opacity=".4"/>
        <g stroke="#2a1d10" stroke-width=".6" opacity=".35"><path d="M0 -11.5V-9.6M0 11.5V9.6M-11.5 0H-9.6M11.5 0H9.6M8.1 -8.1L6.8 -6.8M-8.1 8.1L-6.8 6.8M8.1 8.1L6.8 6.8M-8.1 -8.1L-6.8 -6.8"/></g>
        <g transform="rotate(-35)"><path d="M-7.5 0H7.5M0 -7.5V7.5" stroke="#1a1209" stroke-width="3" stroke-linecap="round"/><path d="M-6.8 .9H6.8M.9 -6.8V6.8" stroke="#8b6a3a" stroke-width=".7" stroke-linecap="round" opacity=".55"/></g>
        <ellipse cx="-4.2" cy="-5.2" rx="3.6" ry="1.7" transform="rotate(-38 -4.2 -5.2)" fill="#fff6dc" opacity=".5"/>
        <g id="F${i}">
          <rect x="-23" y="-6" width="46" height="24" rx="12" fill="#695640" stroke="#32291e" stroke-width="1.5"/>
          <path d="M26 16Q34 24 30 33Q-5 40 -40 33C-56 33-57 21-45 18C-36 15-30 16-26 16Z" fill="#64523e" stroke="#31281e" stroke-width="1.5"/>
          <path d="M30 31Q34 34 30 37Q-6 43 -42 37C-58 37-59 27-55 24Q-51 24 -46 28Q-43 30 -40 31Z" fill="#4c3e2f" stroke="#2a2219" stroke-width="1.5"/>
          <path d="M-30 20Q-45 20-50 27" stroke="#756048" stroke-width="2" fill="none" opacity=".7"/>
        </g>
      </g></g></g>`;
    legsG.innerHTML = legSVG(1, HIPS[1].T) + legSVG(0, HIPS[0].T);

    s.piggyPos = $('piggy-pos') as SVGGElement;
    s.actor = $('actor') as SVGGElement;
    s.bodyG = $('body') as SVGGElement;
    s.legsG = legsG;
    s.shadowEl = $('piggy-shadow') as SVGEllipseElement;
    s.la = $('left-arm-group') as SVGGElement;
    s.ra = $('right-arm-group') as SVGGElement;
    s.le = $('left-ear') as SVGGElement;
    s.re = $('right-ear') as SVGGElement;
    s.tail = $('curly-tail-group') as SVGGElement;
    s.head = $('head-and-ears') as SVGGElement;
    s.tailMount = $('tail-mount') as SVGGElement;
    s.tailEjectWrap = $('tail-eject-wrap') as SVGGElement;
    s.slotFollow = $('slot-follow') as SVGGElement;
    s.slotEjectWrap = $('slot-eject-wrap') as SVGGElement;
    s.jetFollow = $('jet-follow') as SVGGElement;
    s.jetTuckWrap = $('jet-tuck-wrap') as SVGGElement;
    s.topScrewWrap = $('top-screw-wrap') as SVGGElement;
    s.leftPauldron = $('left-pauldron') as SVGGElement;
    s.rightPauldronWrap = $('right-pauldron-wrap') as SVGGElement;
    s.leftSocket = $('left-socket') as SVGPathElement;
    s.rightSocket = $('right-socket-g') as SVGGElement;
    s.leftArmTuck = $('left-arm-tuck') as SVGGElement;
    s.rightArmTuck = $('right-arm-tuck') as SVGGElement;
    s.torsoChestWrap = $('torso-chest-wrap') as SVGGElement;
    s.torsoBellyWrap = $('torso-belly-wrap') as SVGGElement;
    s.torsoPelvisWrap = $('torso-pelvis-wrap') as SVGGElement;
    s.leg0Wrap = $('L0-wrap') as SVGGElement;
    s.leg1Wrap = $('L1-wrap') as SVGGElement;
    s.piggyInnerCore = $('piggy-inner-core') as SVGGElement;
    s.coreGearA = $('core-gear-a') as SVGGElement;
    s.coreGearB = $('core-gear-b') as SVGGElement;
    s.coreGearC = $('core-gear-c') as SVGGElement;
    s.topScrewShank = $('top-screw-shank') as SVGGElement;
    s.ballShellOverlay = $('ball-shell-overlay') as SVGGElement;
    s.jetGimbal = $('jet-gimbal') as SVGGElement;
    s.jetFlame = $('jet-flame') as SVGGElement;
    s.jetFlameBody = $('jet-flame-body') as SVGGElement;
    s.jetEmber = $('jet-ember') as SVGEllipseElement;
    s.slotRimGlow = $('slot-rim-glow') as SVGPathElement;
    s.swallowCoinGroup = $('swallow-coin-group') as SVGGElement;
    s.slotLight = $('slot-light') as SVGGElement;
    s.glRaysIn = $('gl-rays-in') as SVGGElement;
    s.glBloomEl = $('gl-bloom-el') as SVGEllipseElement;
    s.glStarB = $('gl-star-b') as SVGGElement;
    s.nervousColorMatrix = $('nervous-color-matrix') as SVGFEColorMatrixElement | null;
    s.nervousRedGlow = $('nervous-red-glow') as SVGFEDropShadowElement | null;
    s.slotLightNextAt = performance.now() + 900;
    s.slotLightStartAt = -1;
    s.legs = HIPS.map((_, i) => ({
      t: $(`L${i}`) as SVGGElement,
      s: $(`S${i}`) as SVGGElement,
      f: $(`F${i}`) as SVGGElement,
    }));

    const jetSparksG = $('jet-sparks');
    if (jetSparksG) {
      jetSparksG.innerHTML = '';
      s.jetSparks = Array.from({ length: 9 }, (_, i) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('r', (1.6 + (i % 3) * 0.7).toFixed(1));
        c.setAttribute('fill', i % 2 ? '#ffd27a' : '#f0a53c');
        jetSparksG.appendChild(c);
        return { el: c, seed: (i * 0.618) % 1 };
      });
    }

    s.balloonPaths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-o]')).map((el) => ({
      el,
      tok: (el.getAttribute('data-o') || '').match(/[MCLZ]|-?\d+(?:\.\d+)?/g) || [],
    }));
    s.balloonEllipses = Array.from(svg.querySelectorAll<SVGEllipseElement>('[data-e]')).map((el) => {
      const [cx, cy, rx, ry, ang] = (el.getAttribute('data-e') || '0 0 10 10 0').split(' ').map(Number);
      return { el, cx, cy, rx, ry, ang };
    });

    const clampAbs = (v: number, a: number) => Math.max(-a, Math.min(a, v));
    const ARM_SCALE = 0.72;
    const armT = (el: SVGGElement | null, a: number, x: number, y: number) => {
      el?.setAttribute('transform', `rotate(${a.toFixed(2)} ${x} ${y}) translate(${x} ${y}) scale(${ARM_SCALE}) translate(${-x} ${-y})`);
    };
    const rotEl = (el: SVGGElement | null, a: number, x: number, y: number) => {
      el?.setAttribute('transform', `rotate(${a.toFixed(2)} ${x} ${y})`);
    };

    const applyBalloon = (a: number, st = 0, wob = 0, m = 0, belly = 0) => {
      const CX = 560;
      const CY = 650;
      const sg = 150 + 70 * a;
      const gain = 0.9 * a;
      const grow = 1 + 0.55 * a;
      const rBall = getBallSvgRadius(belly);
      const fmt = (v: number) => v.toFixed(1);

      const push = (x: number, y: number): [number, number] => {
        const dx = x - CX;
        const dy = y - CY;
        const r2 = dx * dx + dy * dy;
        const k = gain * Math.exp(-r2 / (2 * sg * sg));
        const ang = Math.atan2(dy, dx);
        const ripple = 1 + wob * Math.sin(Math.sqrt(r2) * 0.035 - s.ripplePhase + ang * 2);
        let bx = x + dx * k * ripple * (1 - st);
        let by = y + dy * k * ripple * (1 + st);

        if (m > 0.002) {
          const bdx = bx - BALL_CX;
          const bdy = by - BALL_CY;
          // Normalize torso's tall aspect ratio into a round sphere and lock outer contour to rBall
          const eqX = bdx * 1.07;
          const eqY = bdy * 0.84;
          const eqR = Math.hypot(eqX, eqY);
          if (eqR > 0.5) {
            const rimW = Math.max(0, Math.min(1, (eqR - 120) / 115));
            const innerR = eqR * (rBall / 248);
            const targetR = innerR * (1 - rimW) + rBall * rimW;
            const sxPt = BALL_CX + (eqX / eqR) * targetR;
            const syPt = BALL_CY + (eqY / eqR) * targetR;
            bx = bx + (sxPt - bx) * m;
            by = by + (syPt - by) * m;
          }
        }
        return [bx, by];
      };

      for (const p of s.balloonPaths) {
        let out = '';
        let i = 0;
        const t = p.tok;
        while (i < t.length) {
          if (/[MCLZ]/.test(t[i])) {
            out += t[i++] + ' ';
            continue;
          }
          const [nx, ny] = push(+t[i], +t[i + 1]);
          out += fmt(nx) + ' ' + fmt(ny) + ' ';
          i += 2;
        }
        p.el.setAttribute('d', out.trim());
      }

      for (const e of s.balloonEllipses) {
        const [nx, ny] = push(e.cx, e.cy);
        const ballEllipseShrink = 1 - 0.18 * m;
        e.el.setAttribute('cx', fmt(nx));
        e.el.setAttribute('cy', fmt(ny));
        e.el.setAttribute('rx', fmt(e.rx * grow * ballEllipseShrink * (1 - st * 0.6)));
        e.el.setAttribute('ry', fmt(e.ry * grow * ballEllipseShrink * (1 + st * 0.6)));
        if (e.ang) e.el.setAttribute('transform', `rotate(${e.ang} ${fmt(nx)} ${fmt(ny)})`);
      }

      const [tx, ty] = push(696, 634);
      s.tailMount?.setAttribute('transform', `translate(${fmt(tx - 696)} ${fmt(ty - 634)})`);

      // Coin slot smoothly settles onto the curved sphere surface in ball mode
      const aS = Math.min(1.3, s.bellyGoal + m * 0.25);
      const sgS = 150 + 70 * aS;
      const gS = 0.9 * aS;
      const dxS = 545 - CX;
      const dyS = 450 - CY;
      const kS = gS * Math.exp(-(dxS * dxS + dyS * dyS) / (2 * sgS * sgS));
      const normalPx = 545 + dxS * kS;
      const normalPy = 450 + dyS * kS;
      const ballSlotX = BALL_CX - 32;
      const ballSlotY = BALL_CY - rBall * 0.54;
      const px = normalPx * (1 - m) + ballSlotX * m;
      const py = normalPy * (1 - m) + ballSlotY * m;
      const ss = (1 + 0.3 * aS) * (1 - 0.18 * m);
      s.slotFollow?.setAttribute(
        'transform',
        `translate(${fmt(px - 545)} ${fmt(py - 450)}) translate(545 450) scale(${fmt(ss)} ${fmt(ss)}) translate(-545 -450)`
      );

      const [jx, jy] = push(742, 672);
      s.jetFollow?.setAttribute('transform', `translate(${fmt(jx - 742)} ${fmt(jy - 672)})`);

      if (s.ballShellOverlay) {
        s.ballShellOverlay.setAttribute('opacity', (m * 0.92).toFixed(2));
        if (m > 0.01) {
          const shellScale = rBall / 236;
          s.ballShellOverlay.setAttribute(
            'transform',
            `translate(${BALL_CX} ${BALL_CY}) scale(${shellScale.toFixed(4)}) translate(${-BALL_CX} ${-BALL_CY})`
          );
        }
      }
    };

    const poseRig = (dt: number, nowMs: number) => {
      const mm = Math.min(s.walkM, 1.65);
      const airAlt = Math.max(s.alt, -s.py / PIGGY_SCALE);
      const airK = Math.min(1, airAlt / 40);
      const preCoil = s.bossAction === 'PATTERN_STOP' && s.bossTimer < 0.2 ? ((0.2 - s.bossTimer) / 0.2) * 0.42 : 0;
      const landFlex = Math.max(0, s.spLand.step(0, dt)) + preCoil;
      const hipA = 28 * D * Math.min(s.walkM, 1) * (1 - airK);
      const kneeA = 48 * D * mm * (1 - airK);
      let lowest = 0;

      // Realistic braking leg extension just before stopping, plus landing knee-bend compression
      const speedNorm = Math.min(1.4, Math.abs(s.realVx) / 680);
      const braceLeg = s.bossAction !== 'PATTERN_STOP' && s.realAx * s.dir < -900 ? 0.24 : 0;

      HIPS.forEach((hp, i) => {
        const p = s.phi + i * Math.PI;
        const h =
          hipA * Math.sin(p) -
          airK * (7 + 14 * Math.min(mm, 1.7) / 1.7) * D +
          landFlex * 28 * D -
          braceLeg * 14 * D;
        const k =
          -kneeA * Math.max(0, Math.cos(p)) -
          airK * 24 * D -
          landFlex * 52 * D;
        const a = -(h + k) * 0.85;
        lowest = Math.max(lowest, hp.y + hp.T * Math.cos(h) + S_LEN * Math.cos(h + k) + F_LEN * Math.cos(h + k + a));
        s.legs[i]?.t.setAttribute('transform', `translate(${hp.x} ${hp.y}) rotate(${(h / D).toFixed(2)})`);
        s.legs[i]?.s.setAttribute('transform', `translate(0 ${hp.T}) rotate(${(k / D).toFixed(2)})`);
        s.legs[i]?.f.setAttribute('transform', `translate(0 ${S_LEN}) rotate(${(a / D).toFixed(2)})`);
      });

      const bob = airK * 3.8 * Math.sin(nowMs * 0.0042);
      const dyN = GY - lowest + bob;
      const s1 = Math.sin(s.phi);
      const w = Math.sin(2 * s.phi - 1.2);

      if (!s.primed) {
        s.prevDy = dyN;
        s.primed = true;
      }
      const vy = (dyN - s.prevDy) / dt;
      s.ay = clampAbs(0.6 * s.ay + 0.4 * (vy - s.prevVy) / dt, 950);
      s.prevVy = vy;
      s.prevDy = dyN;
      const dm = (s.walkM - s.prevM) / dt;
      s.prevM = s.walkM;

      const sq = s.spSq.step(clampAbs(s.ay * 0.000075 + landFlex * 0.08, 0.14), dt);
      const sx = s.spSx.step(clampAbs(s.ay * 0.000045 + landFlex * 0.06, 0.1), dt);
      const accelLean = clampAbs(-s.realAx * 0.0022 * s.dir - speedNorm * 4.5, 16);
      const lean = s.spLean.step(clampAbs(-1.1 * dm + accelLean, 18), dt);
      const hurtArm = s.hurtTimer > 0 ? -36 : 0;
      const anticipateNext =
        s.bossAction === 'PATTERN_STOP' && s.bossTimer < 0.26 ? -24 : 0;
      const windupArm =
        s.bossAction === 'JET_FLIGHT'
          ? -18 - Math.min(14, speedNorm * 10)
          : hurtArm || anticipateNext;
      const isWalkingPose = s.bossAction === 'WALK' && s.alt <= 8 && s.ballMorph < 0.2;
      const targetLa = isWalkingPose
        ? -32 + 5 * mm * s1 + hurtArm * 0.45
        : 8 * mm * s1 + clampAbs(s.ay * 0.014, 16) - lean * 0.85 + windupArm - landFlex * 18;
      const targetRa = isWalkingPose
        ? 72 - 5 * mm * s1 - hurtArm * 0.45
        : -7 * mm * s1 - clampAbs(s.ay * 0.014, 16) - lean * 0.85 - windupArm + landFlex * 18;
      const la = s.spLa.step(targetLa, dt);
      const ra = s.spRa.step(targetRa, dt);
      const airTailDrag = -s.dir * Math.min(18, Math.abs(s.realVx) * 0.018) + clampAbs(s.vAlt * 0.035, 16);
      const tl = s.spTail.step(15 * mm * Math.sin(2 * s.phi + 0.8) - clampAbs(s.ay * 0.022, 24) + lean * 1.45 + airTailDrag, dt);

      // Realistic footstep dust + subtle step thud when walking/sprinting on ground
      if (s.onGround && airK < 0.18 && s.walkM > 0.35 && Math.floor(s.phi / Math.PI) !== s.stepNo) {
        s.stepNo = Math.floor(s.phi / Math.PI);
        s.bellyVel += 0.015 * Math.min(s.walkM, 1.7);
        if (s.walkM > 0.65) {
          spawnDustPuff(s.px - s.dir * 16, FLOOR_Y - 2, -s.dir, 2, 95);
          if (s.phase === 'PLAYING') {
            synthRef.current?.playStep();
          }
        }
      }

      const flying = s.goalAlt > 0 || s.alt > 0.4 || Math.abs(s.vAlt) > 0.5 || s.bossAction === 'JET_FLIGHT';
      const sp = Math.min(1, mm / 1.2);
      const revvingJet = s.bossAction === 'PATTERN_STOP' && s.bossTimer < 0.26 && s.moveTargetAlt > 10;
      let thr = flying
        ? 0.4 + 0.35 * Math.min(1, Math.abs(s.vAlt) / 150) + 0.32 * sp + (s.vAlt > 20 ? 0.22 : 0)
        : revvingJet
        ? 0.52
        : s.bossAction === 'PATTERN_MOVE'
        ? 0.58
        : 0;
      if (flying && s.vAlt < -30) thr *= 0.55;
      s.thrS += (Math.min(1, thr) - s.thrS) * Math.min(1, dt * 9);

      const vb = s.thrS * Math.max(airK, s.bossAction === 'PATTERN_MOVE' ? 0.35 : 0);
      const vibX = vb * (1.3 * Math.sin(nowMs * 0.085) + 0.7 * Math.sin(nowMs * 0.131 + 2));
      const vibY = vb * (1.1 * Math.sin(nowMs * 0.097 + 1) + 0.6 * Math.sin(nowMs * 0.153));
      const vibR = vb * 0.45 * Math.sin(nowMs * 0.11 + 0.5);

      const m = s.ballMorph;
      const limbFade = Math.max(0, 1 - m * 1.65);
      const tuckScale = Math.max(0.14, 1 - 0.86 * m);
      const tuckAttr = m > 0.005 ? `translate(${BALL_CX} ${BALL_CY}) scale(${tuckScale.toFixed(3)}) translate(${-BALL_CX} ${-BALL_CY})` : '';
      const tuckOp = m > 0.005 ? limbFade.toFixed(2) : '1';

      if (s.legsG) {
        if (m > 0.005) {
          s.legsG.setAttribute(
            'transform',
            `translate(${(vibX * 1.3).toFixed(2)} ${(dyN + vibY * 1.3 - 150 * m).toFixed(2)}) translate(${BALL_CX} ${BALL_CY + 140}) scale(${tuckScale.toFixed(3)}) translate(${-BALL_CX} ${-(BALL_CY + 140)})`
          );
          s.legsG.style.opacity = tuckOp;
        } else {
          s.legsG.setAttribute('transform', `translate(${(vibX * 1.3).toFixed(2)} ${(dyN + vibY * 1.3).toFixed(2)})`);
          s.legsG.style.opacity = '1';
        }
      }
      if (s.la) s.la.style.opacity = tuckOp;
      if (s.ra) s.ra.style.opacity = tuckOp;
      if (s.tailMount) s.tailMount.style.opacity = tuckOp;
      if (s.leftArmTuck) s.leftArmTuck.setAttribute('transform', tuckAttr);
      if (s.rightArmTuck) s.rightArmTuck.setAttribute('transform', tuckAttr);

      const attachFade = Math.max(0, 1 - m * 1.45).toFixed(2);
      const attachTuckScale = Math.max(0.22, 1 - 0.78 * m);
      const attachAttr =
        m > 0.005
          ? `translate(${BALL_CX} ${BALL_CY}) scale(${attachTuckScale.toFixed(3)}) translate(${-BALL_CX} ${-BALL_CY})`
          : '';
      for (const attachEl of [
        s.topScrewWrap,
        s.leftPauldron,
        s.rightPauldronWrap,
        s.leftSocket,
        s.rightSocket,
        s.jetTuckWrap,
      ]) {
        if (!attachEl) continue;
        attachEl.style.opacity = m > 0.005 ? attachFade : '1';
        attachEl.setAttribute('transform', attachAttr);
      }

      const n = s.bossAction === 'BREAKING' ? 0 : s.nervousLevel;
      const dz = s.bossAction === 'BREAKING' ? 0 : s.dizzyLevel;
      const dzPhase = s.dizzyPhase;
      const dizzyBodyX = dz * Math.sin(dzPhase) * 9.5;
      const dizzyBodyY = dz * Math.sin(dzPhase * 2) * 3.6;
      const dizzyBodyRot = dz * Math.sin(dzPhase * 0.9) * 9.2;
      const dizzyHeadRot = dz * Math.sin(dzPhase * 1.15 + 0.5) * 16.5;
      const dizzyEarL = dz * Math.cos(dzPhase * 1.35) * 18;
      const dizzyEarR = dz * Math.sin(dzPhase * 1.35 + 0.9) * 18;
      const dizzyArm = dz * Math.sin(dzPhase * 1.05) * 19;

      const nervousTremorX = n > 0.05 ? (Math.sin(nowMs * 0.095) + 0.55 * Math.sin(nowMs * 0.163)) * n * 4.4 : 0;
      const nervousTremorY = n > 0.05 ? Math.cos(nowMs * 0.125) * n * 2.4 : 0;
      const strainJitter =
        s.bossAction === 'BREAKING'
          ? Math.sin(nowMs * 0.05) * 12
          : (s.bellyLevel > 0.72 ? Math.sin(nowMs * 0.035) * (s.bellyLevel - 0.72) * 16 : 0) +
            n * Math.sin(nowMs * 0.072) * 6.5;
      const hurtShakeX = (s.hurtTimer > 0 ? Math.sin(s.hurtTimer * 55) * 12 * s.hurtDir : 0) + nervousTremorX;

      const climbTilt = airK * clampAbs(-s.vAlt * 0.022, 9);
      const bodyRotBase =
        (-2.2 * mm + 1.3 * mm * Math.sin(2 * s.phi)) * (1 - airK) +
        airK * (-12.5 * Math.min(mm, 1.7) / 1.7 + 1.8 * Math.sin(nowMs * 0.003)) +
        lean * 0.6 +
        climbTilt +
        landFlex * 4.5 +
        vibR +
        strainJitter +
        dizzyBodyRot +
        s.slotReceiveTilt;
      const bodyRot = bodyRotBase * (1 - m) + s.ballAngle * m;
      const rBall = getBallSvgRadius(s.bellyLevel);
      const ballIdealDropY = 911 - (BALL_CY + rBall);
      const ballPivotX = 550 * (1 - m) + BALL_CX * m;
      const ballPivotY = 750 * (1 - m) + BALL_CY * m;
      const ballDropY = dyN * (1 - m) + ballIdealDropY * m;
      const bodySx = 1 + sx * (1 - m);
      const bodySy = 1 - sq * (1 - m);

      // Elastic squash & stretch in ball mode (floor/wall impact + velocity elongation)
      const bSq = s.spBallSq.step(0, dt);
      const bWall = s.spBallWall.step(0, dt);
      s.ballSquashContact += (0 - s.ballSquashContact) * Math.min(1, dt * 8.5);
      const sqTotal = clampAbs((bSq - bWall) * (0.25 + 0.75 * m), 0.36);
      const impactSx = 1 + sqTotal;
      const impactSy = 1 / Math.max(0.66, impactSx);
      const contactSinkY = s.ballSquashContact > 0.01 ? s.ballSquashContact * rBall * Math.max(0, 1 - impactSy) : 0;

      const bSpeed = Math.hypot(s.ballVx, s.ballVy);
      const velStretch = m * Math.min(0.18, (bSpeed / 1280) * 0.16);
      const worldVelDeg = (Math.atan2(s.ballVy, s.ballVx) * 180) / Math.PI;
      const localVelDeg = s.dir > 0 ? 180 - worldVelDeg : worldVelDeg;
      const impactPart =
        Math.abs(sqTotal) > 0.002
          ? ` translate(${BALL_CX} ${BALL_CY}) scale(${impactSx.toFixed(4)} ${impactSy.toFixed(4)}) translate(${-BALL_CX} ${-BALL_CY})`
          : '';
      const velPart =
        velStretch > 0.004
          ? ` translate(${BALL_CX} ${BALL_CY}) rotate(${localVelDeg.toFixed(1)}) scale(${(1 + velStretch).toFixed(4)} ${(1 / (1 + velStretch)).toFixed(4)}) rotate(${(-localVelDeg).toFixed(1)}) translate(${-BALL_CX} ${-BALL_CY})`
          : '';

      s.bodyG?.setAttribute(
        'transform',
        `translate(${(hurtShakeX + vibX + dizzyBodyX).toFixed(2)} ${(ballDropY + contactSinkY + vibY + nervousTremorY + dizzyBodyY).toFixed(2)})${impactPart}${velPart} translate(550 790) scale(${bodySx.toFixed(4)} ${bodySy.toFixed(4)}) translate(-550 -790) rotate(${bodyRot.toFixed(2)} ${ballPivotX.toFixed(1)} ${ballPivotY.toFixed(1)})`
      );
      const earFlop = landFlex * 14 + speedNorm * 7 * s.dir + n * 10 * Math.sin(nowMs * 0.062);
      const nervousArmFlail = n * 14 * Math.sin(nowMs * 0.054);
      armT(s.la, la + vb * 1.6 * Math.sin(nowMs * 0.12) - nervousArmFlail + dizzyArm, 300, 345);
      armT(s.ra, ra + vb * 1.6 * Math.sin(nowMs * 0.12 + 1.3) + nervousArmFlail - dizzyArm, 640, 235);
      rotEl(s.le, 7 * mm * w + earFlop + dizzyEarL, 350, 195);
      rotEl(s.re, -6 * mm * w + earFlop * 0.85 + dizzyEarR, 490, 150);
      rotEl(s.tail, tl + vb * 2.4 * Math.sin(nowMs * 0.14 + 0.7) + n * 18 * Math.sin(nowMs * 0.088), 696, 634);
      rotEl(s.head, 1.5 * mm * Math.sin(2 * s.phi + 0.5) + landFlex * 4 + n * 4.5 * Math.sin(nowMs * 0.058) + dizzyHeadRot, 440, 260);

      // Rear Jet gimbal, flame & sparks
      const jetAng = flying ? 80 - 66 * sp + (s.vAlt > 20 ? 6 : 0) : s.bossAction === 'PATTERN_MOVE' ? 18 : 40;
      s.jetGimbal?.setAttribute('transform', `translate(742 672) rotate(${jetAng.toFixed(1)}) scale(1.4)`);
      const fl = 1 + 0.08 * Math.sin(nowMs * 0.045) + 0.06 * Math.sin(nowMs * 0.11 + 1) + 0.05 * Math.random();
      s.jetFlame?.setAttribute('opacity', Math.min(1, s.thrS * 3.2).toFixed(2));
      s.jetEmber?.setAttribute('opacity', Math.min(0.9, s.thrS * 2).toFixed(2));
      s.jetFlameBody?.setAttribute(
        'transform',
        `translate(30 0) scale(${((0.35 + 1.25 * s.thrS) * fl).toFixed(3)} ${((0.8 + 0.5 * s.thrS) * (2 - fl)).toFixed(3)})`
      );
      for (const q of s.jetSparks) {
        const tt = (nowMs * 0.0011 * (0.6 + s.thrS) + q.seed) % 1;
        q.el.setAttribute('cx', (36 + tt * (50 + s.thrS * 150)).toFixed(1));
        q.el.setAttribute('cy', (Math.sin(q.seed * 40 + nowMs * 0.004) * (3 + tt * 16)).toFixed(1));
        q.el.setAttribute('opacity', (Math.max(0, 1 - tt) * Math.min(1, s.thrS * 2)).toFixed(2));
      }

      if (s.swallowCoinGroup) {
        if (s.swallowTimer > 0) {
          const p = 1 - s.swallowTimer / s.swallowMax;
          const easeIn = p * p;
          const sxPos = 516 + easeIn * 76;
          const syPos = 246 + easeIn * 150;
          const coinScaleX = Math.max(0.26, 1.18 - p * 0.92);
          const coinScaleY = 1.15 - p * 0.28;
          const op = p < 0.72 ? 1 : Math.max(0, (1 - p) / 0.28);
          s.swallowCoinGroup.setAttribute(
            'transform',
            `translate(${sxPos.toFixed(1)} ${syPos.toFixed(1)}) rotate(${(58 + p * 14).toFixed(1)}) scale(${coinScaleX.toFixed(2)} ${coinScaleY.toFixed(2)})`
          );
          s.swallowCoinGroup.setAttribute('opacity', op.toFixed(2));
        } else {
          s.swallowCoinGroup.setAttribute('opacity', '0');
        }
      }

      if (s.slotRimGlow) {
        const glowOp = s.slotGlowTimer > 0 ? Math.min(1, s.slotGlowTimer * 3.4) : 0;
        s.slotRimGlow.setAttribute('opacity', glowOp.toFixed(2));
      }

      // Periodic golden blink spilling out of the coin slot (matches reference piggy)
      if (s.slotLight) {
        if (s.slotLightStartAt < 0 && nowMs >= s.slotLightNextAt) {
          s.slotLightStartAt = nowMs;
          s.slotLightSpin = Math.random() * 40;
        }
        let pulseE = 0;
        let pulseT = 0;
        if (s.slotLightStartAt >= 0) {
          pulseT = (nowMs - s.slotLightStartAt) / 2200;
          if (pulseT >= 1) {
            s.slotLightStartAt = -1;
            s.slotLightNextAt = nowMs + 2800 + Math.random() * 4200;
          } else {
            const bump = (t: number, c: number, w: number) => Math.exp(-Math.pow((t - c) / w, 2));
            pulseE = Math.min(1, bump(pulseT, 0.3, 0.2) + 0.3 * bump(pulseT, 0.62, 0.15)) * 0.8;
          }
        }
        const hitBoost = s.slotGlowTimer > 0 ? Math.min(0.85, s.slotGlowTimer * 2.2) : 0;
        const totalE = Math.max(pulseE, hitBoost);
        s.slotLight.setAttribute('opacity', totalE.toFixed(3));
        if (totalE > 0.005) {
          s.glRaysIn?.setAttribute(
            'transform',
            `rotate(${(s.slotLightSpin + pulseT * 12).toFixed(2)}) scale(${(0.5 + 0.4 * totalE).toFixed(3)})`
          );
          s.glBloomEl?.setAttribute(
            'transform',
            `rotate(-34 578 378) translate(578 378) scale(${(0.9 + 0.12 * totalE).toFixed(3)}) translate(-578 -378)`
          );
          const starBump = s.slotLightStartAt >= 0 ? Math.exp(-Math.pow((pulseT - 0.4) / 0.22, 2)) : totalE;
          s.glStarB?.setAttribute(
            'transform',
            `translate(610 418) rotate(${(-pulseT * 90).toFixed(1)}) scale(${(0.2 + 0.7 * starBump).toFixed(3)})`
          );
        }
      }

      const breakElapsed = s.bossAction === 'BREAKING' ? Math.max(0, s.breakMax - s.breakTimer) : 0;
      const breakDetonated = s.bossAction === 'BREAKING' && s.breakStage >= 1;

      if (s.bossAction === 'BREAKING') {
        s.actor?.setAttribute('transform', s.breakDir > 0 ? 'translate(1100 0) scale(-1 1)' : '');
        s.piggyPos?.setAttribute(
          'transform',
          `translate(${s.breakPx.toFixed(1)} ${(FLOOR_Y + s.breakPy).toFixed(1)}) scale(${PIGGY_SCALE.toFixed(3)}) translate(-550 -911)`
        );

        if (breakDetonated) {
          // Neutralize parent transforms once parts have popped off so world-space ballistic pieces align cleanly
          s.bodyG?.setAttribute('transform', '');
          if (s.legsG) {
            s.legsG.setAttribute('transform', '');
            s.legsG.style.opacity = '1';
          }
          if (s.leftSocket) s.leftSocket.style.opacity = '0';
          if (s.rightSocket) s.rightSocket.style.opacity = '0';
          if (s.ballShellOverlay) s.ballShellOverlay.setAttribute('opacity', '0');
          if (s.la) s.la.style.opacity = '1';
          if (s.ra) s.ra.style.opacity = '1';
          if (s.tailMount) s.tailMount.style.opacity = '1';
          s.jetFlame?.setAttribute('opacity', s.breakTimer > 1.35 ? '0.65' : '0');
          s.jetEmber?.setAttribute('opacity', '0.45');
        } else {
          // Overpressure buildup shake before seam detonation
          const buildFrac = Math.min(1, breakElapsed / 0.36);
          const buildShakeX = Math.sin(nowMs * 0.095) * (8 + buildFrac * 22);
          const buildShakeY = Math.cos(nowMs * 0.125) * (5 + buildFrac * 14);
          const swellScale = 1 + buildFrac * 0.085;
          s.bodyG?.setAttribute(
            'transform',
            `translate(${buildShakeX.toFixed(2)} ${buildShakeY.toFixed(2)}) translate(550 560) scale(${swellScale.toFixed(4)}) translate(-550 -560)`
          );
          s.legsG?.setAttribute('transform', `translate(${(buildShakeX * 0.5).toFixed(2)} ${(buildShakeY * 0.4).toFixed(2)})`);
        }

        // Exposed inner steampunk clockwork core visibility + 3-gear precision spin
        if (s.piggyInnerCore) {
          const coreOp =
            breakElapsed < 0.36
              ? Math.min(0.94, (breakElapsed / 0.36) * 0.94)
              : breakElapsed < 1.05
              ? 1
              : Math.max(0, 1 - (breakElapsed - 1.05) / 0.22);
          s.piggyInnerCore.setAttribute('opacity', coreOp.toFixed(3));
          const gearSpin = breakElapsed * (breakElapsed > 0.36 ? 760 : 360);
          s.coreGearA?.setAttribute('transform', `translate(494 456) rotate(${gearSpin.toFixed(1)})`);
          s.coreGearB?.setAttribute('transform', `translate(602 522) rotate(${(-gearSpin * 1.35).toFixed(1)})`);
          s.coreGearC?.setAttribute('transform', `translate(534 576) rotate(${(gearSpin * 1.85).toFixed(1)})`);
        }

        // Apply individual world-space ballistic transforms + threaded top-screw unthreading
        const dirSign = s.breakDir > 0 ? -1 : 1;
        const partFade = s.breakTimer < 0.32 ? Math.max(0, s.breakTimer / 0.32) : 1;
        for (const dp of s.disassemblyParts) {
          if (!dp.el) continue;
          if (!dp.detached) {
            dp.el.style.opacity = '1';
            if (dp.unscrew && breakElapsed >= 0.02) {
              const u = Math.min(1, (breakElapsed - 0.02) / 0.2);
              s.topScrewShank?.setAttribute('opacity', Math.min(1, u * 1.4).toFixed(2));
              dp.el.setAttribute(
                'transform',
                `translate(${(-u * 18).toFixed(1)} ${(-u * 74).toFixed(1)}) rotate(${(u * 720).toFixed(1)} ${dp.cx} ${dp.cy})`
              );
            } else if (!breakDetonated && breakElapsed > 0.16) {
              const seamJitter = (breakElapsed - 0.16) / 0.2;
              const jx = (dp.cx - 550) * 0.095 * seamJitter;
              const jy = (dp.cy - 520) * 0.095 * seamJitter;
              dp.el.setAttribute('transform', `translate(${jx.toFixed(1)} ${jy.toFixed(1)})`);
            }
            continue;
          }
          if (dp.id === 'topScrew') {
            s.topScrewShank?.setAttribute('opacity', '1');
          }
          const dxSvg = dirSign * ((dp.wx - dp.wx0) / PIGGY_SCALE);
          const dySvg = (dp.wy - dp.wy0) / PIGGY_SCALE;
          dp.el.setAttribute(
            'transform',
            `translate(${dxSvg.toFixed(1)} ${dySvg.toFixed(1)}) rotate(${(dirSign * dp.rot).toFixed(1)} ${dp.cx} ${dp.cy})`
          );
          dp.el.style.opacity = partFade.toFixed(2);
        }

        if (s.piggyPos) {
          s.piggyPos.style.opacity = s.breakTimer < 0.24 ? Math.max(0, s.breakTimer / 0.24).toFixed(2) : '1';
          if (!breakDetonated) {
            const flashK = 1 + 0.45 * Math.min(1, breakElapsed / 0.36);
            s.piggyPos.style.filter = `brightness(${flashK.toFixed(2)}) saturate(${(1 + breakElapsed * 1.4).toFixed(2)})`;
          } else {
            s.piggyPos.style.filter = breakElapsed < 0.52 ? 'brightness(1.28)' : '';
          }
        }
        if (s.shadowEl) {
          const shadowOp = Math.max(0, 0.16 * (1 - Math.min(1, breakElapsed / 0.48)));
          s.shadowEl.setAttribute('fill', `rgba(45, 32, 18, ${shadowOp.toFixed(3)})`);
        }
      } else {
        if (s.piggyInnerCore) s.piggyInnerCore.setAttribute('opacity', '0');
        if (s.topScrewShank) s.topScrewShank.setAttribute('opacity', '0');
        s.actor?.setAttribute('transform', s.dir > 0 ? 'translate(1100 0) scale(-1 1)' : '');
        s.piggyPos?.setAttribute(
          'transform',
          `translate(${(s.px + (s.bossAction === 'PATTERN_STOP' ? s.nervousJitterX : 0)).toFixed(1)} ${(FLOOR_Y + s.py).toFixed(1)}) scale(${PIGGY_SCALE.toFixed(3)}) translate(-550 -911)`
        );
        if (s.piggyPos) {
          s.piggyPos.style.opacity = '1';
          if (n > 0.04) {
            const pulse = 0.5 + 0.5 * Math.sin(nowMs * (0.015 + 0.014 * n));
            if (s.nervousColorMatrix) {
              const rGain = (1 + 0.54 * n + 0.16 * n * pulse).toFixed(3);
              const gToR = (0.22 * n).toFixed(3);
              const rOff = (0.09 * n + 0.04 * n * pulse).toFixed(3);
              const gGain = Math.max(0.42, 1 - 0.5 * n).toFixed(3);
              const bGain = Math.max(0.28, 1 - 0.66 * n).toFixed(3);
              s.nervousColorMatrix.setAttribute(
                'values',
                `${rGain} ${gToR} 0 0 ${rOff}  0 ${gGain} 0 0 0  0 0 ${bGain} 0 0  0 0 0 1 0`
              );
            }
            if (s.nervousRedGlow) {
              s.nervousRedGlow.setAttribute('stdDeviation', (7 + 9 * n * (0.45 + 0.55 * pulse)).toFixed(2));
              s.nervousRedGlow.setAttribute('flood-opacity', ((0.28 + 0.54 * pulse) * n).toFixed(3));
            }
            const flashPart = s.bossFlash > 0 ? ' brightness(1.38) contrast(1.14)' : '';
            s.piggyPos.style.filter = s.textureOn
              ? `url(#nervous-red-shader)${flashPart}`
              : `sepia(${(0.75 * n).toFixed(2)}) hue-rotate(-38deg) saturate(${(1.15 + 1.6 * n).toFixed(2)})${flashPart}`;
          } else {
            s.piggyPos.style.filter = s.bossFlash > 0 ? 'brightness(1.45) contrast(1.15)' : '';
          }
        }

        if (s.shadowEl) {
          const hf = Math.max(0.32, 1 - airAlt / 620);
          s.shadowEl.setAttribute('cx', s.px.toFixed(1));
          s.shadowEl.setAttribute('rx', ((98 + s.bellyLevel * 38) * PIGGY_UNIT * hf).toFixed(1));
          s.shadowEl.setAttribute('fill', `rgba(45, 32, 18, ${(0.17 * hf).toFixed(3)})`);
        }
      }
    };

    const spawnMechanicalDebris = (
      cx: number,
      cy: number,
      count: number,
      power = 1,
      mode: 'burst' | 'screws' = 'burst'
    ) => {
      const s = simRef.current;
      const kinds: MechanicalDebris['kind'][] =
        mode === 'screws'
          ? ['screw', 'bolt', 'washer', 'screw', 'nut']
          : ['screw', 'bolt', 'gear', 'plate', 'washer', 'spring', 'nut'];
      const colors = ['#D97706', '#B45309', '#F59E0B', '#92400E', '#64748B', '#78350F'];
      for (let i = 0; i < count; i++) {
        const ang =
          mode === 'screws'
            ? -Math.PI * (0.18 + Math.random() * 0.64)
            : -Math.PI * (0.06 + Math.random() * 0.88);
        const kind = kinds[i % kinds.length];
        const mass =
          kind === 'plate'
            ? 1.75
            : kind === 'gear'
            ? 1.35
            : kind === 'bolt' || kind === 'spring'
            ? 1.15
            : 0.85;
        const spd = (240 + Math.random() * 620) * (power / Math.sqrt(mass));
        const r =
          kind === 'plate'
            ? 13 + Math.random() * 7
            : kind === 'gear'
            ? 11 + Math.random() * 8
            : kind === 'spring'
            ? 11 + Math.random() * 6
            : kind === 'screw' || kind === 'bolt'
            ? 9 + Math.random() * 4.5
            : 7.5 + Math.random() * 4;
        s.debrisItems.push({
          x: cx + (Math.random() - 0.5) * (mode === 'screws' ? 92 : 76),
          y: cy + (Math.random() - 0.5) * (mode === 'screws' ? 76 : 64),
          vx: Math.cos(ang) * spd * (Math.random() < 0.5 ? -1 : 1) * (0.72 + Math.random() * 0.55),
          vy: Math.sin(ang) * spd - (mode === 'screws' ? 230 : 155) * power,
          r,
          rot: Math.random() * 360,
          vrot: (Math.random() - 0.5) * (kind === 'screw' || kind === 'washer' ? 1120 : 620 / Math.sqrt(mass)),
          kind,
          color: colors[i % colors.length],
          life: 2.0 + Math.random() * 0.75,
          maxLife: 2.6,
          bounces: 0,
          mass,
          bounce: kind === 'plate' ? 0.24 : kind === 'gear' ? 0.34 : kind === 'spring' ? 0.56 : 0.44,
        });
      }
    };

    const advanceToNextPatternSpot = (skipBallTrigger = false) => {
      const s = simRef.current;
      const n = s.nervousLevel;
      s.nervousJitterX = 0;
      s.stopsSinceBall += 1;
      const surprisePanicBall = n > 0.62 && Math.random() < 0.34;
      if (!skipBallTrigger && (s.stopsSinceBall >= s.ballTriggerStops || surprisePanicBall)) {
        s.stopsSinceBall = 0;
        s.ballTriggerStops = n > 0.45 ? 1 : s.difficulty === 'FRENZY' ? 2 : 3;
        s.bossAction = 'BOUNCY_BALL';
        s.ballTimer = (s.difficulty === 'FRENZY' ? 4.4 : 3.6) + Math.min(1.0, (s.round - 1) * 0.2) + n * 0.85;
        const dirToCenter = s.px < WORLD_W * 0.5 ? 1 : -1;
        const ballSpeedBoost = (s.difficulty === 'FRENZY' ? 1.18 : 1.0) + (s.round - 1) * 0.05 + n * 0.24;
        s.ballVx = dirToCenter * (490 + Math.random() * 230) * ballSpeedBoost;
        s.ballVy = -(820 + Math.random() * 240) * (1 + n * 0.14);
        s.ballSpin = dirToCenter * (520 + Math.random() * 260) * (1 + n * 0.32);
        s.dir = dirToCenter;
        s.walkM = 0;
        s.onGround = false;
        s.spBallSq.v = -4.2 * (1 + n * 0.25);
        s.bellyVel += 0.22 + n * 0.12;
        spawnCollisionFx(s.px, FLOOR_Y + s.py - 85, 0, -1, n > 0.45 ? '#EF4444' : '#F59E0B', true);
        synthRef.current?.playBallBoing(1.15 + n * 0.2);
        return;
      }

      const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];
      // Dedicated grounded WALK patrol state once per cycle when calm on the floor
      if (!skipBallTrigger && s.alt <= 4 && s.stopsSinceBall === 1 && n < 0.52) {
        s.bossAction = 'WALK';
        s.goalAlt = 0;
        s.walkTimer = s.difficulty === 'FRENZY' ? 1.15 : 1.5;
        s.walkTurnPause = 0;
        if (s.px <= MIN_X + 140) s.dir = 1;
        else if (s.px >= MAX_X - 140) s.dir = -1;
        return;
      }

      const skipStep = n > 0.32 && Math.random() < 0.46 * n ? 2 : 1;
      const nextIdx = (s.spotIndex + skipStep) % pat.spots.length;
      const nextSpot = pat.spots[nextIdx];
      const frenzyBoost = s.difficulty === 'FRENZY' ? 1.25 : 1.0;
      const cycleBoost = 1 + Math.floor((s.round - 1) / ROUND_PATTERNS.length) * 0.15;
      const nervousBoost = 1 + n * 0.48;
      const speed = pat.baseMoveSpeed * frenzyBoost * cycleBoost * nervousBoost;

      const dist = Math.hypot(nextSpot.x - s.px, (nextSpot.alt - s.alt) * PIGGY_SCALE);
      s.spotIndex = nextIdx;
      s.moveFromX = s.px;
      s.moveFromAlt = s.alt;
      s.moveTargetX = nextSpot.x;
      s.moveTargetAlt = nextSpot.alt;
      s.moveElapsed = 0;
      const minDur = n > 0.4 ? 0.3 : 0.45;
      s.moveDuration = Math.max(minDur, Math.min(1.08, dist / speed));
      // Natural aerodynamic arc: hop on wide ground dashes, smooth lift curve on aerial flights, volatile hops when nervous
      const baseArc =
        nextSpot.alt === 0 && s.alt === 0 && dist > 420
          ? 125
          : nextSpot.alt > 20 || s.alt > 20
          ? Math.min(95, dist * 0.085)
          : 0;
      s.moveArcAlt = baseArc + (n > 0.3 && Math.random() < 0.65 ? n * 92 : 0);
      s.bossAction = nextSpot.alt > 20 || s.alt > 20 || s.moveArcAlt > 0 ? 'JET_FLIGHT' : 'PATTERN_MOVE';
      s.dir = nextSpot.x >= s.px ? 1 : -1;
      s.spLean.v += s.dir * (22 + n * 16);
      // Push off the floor cleanly with takeoff dust + squash impulse!
      if (s.alt < 12 && (nextSpot.alt > 20 || s.moveArcAlt > 0)) {
        spawnDustPuff(s.px, FLOOR_Y - 2, -s.dir, 6, 190 + n * 70);
        s.spSq.v += 1.4 + n * 0.6;
        synthRef.current?.playBossAttack();
      } else if (nextSpot.alt > s.alt + 40) {
        synthRef.current?.playBossAttack();
      }
    };

    // Progressive 3-in-a-Row Pump + Money-Hurt Reaction every time a coin drops inside!
    const receiveCoinInSlot = (coinX: number, coinY: number, amount: number, isSlotDirect: boolean, coinPower = 0) => {
      const s = simRef.current;
      if (s.bossAction === 'BREAKING') return;

      const piggyCenterY = FLOOR_Y + s.py + (545 + 46 * s.ballMorph - 911) * PIGGY_SCALE;

      // 1. 3-in-a-Row Pump (only direct slot drops fill the row & keep pressure pumped!)
      if (s.phase === 'PLAYING') {
        if (isSlotDirect) {
          s.pumpProgress = Math.min(s.pumpTarget, s.pumpProgress + Math.max(1, Math.round(amount)));
          s.combo += 1;
          s.slotDrops += 1;
          s.sinceLastSlotHit = 0;
          s.pumpHoldTimer = s.pumpHoldMax + coinPower * 1.1;

          const ratio = s.pumpProgress / s.pumpTarget;
          s.bellyGoal = Math.max(s.bellyGoal, 0.04 + ratio * 1.08);

          if (s.pumpProgress >= 1 || s.combo >= 2) {
            const wasCalm = s.nervousLevel < 0.35 && s.nervousPanicTimer <= 0;
            s.nervousPanicTimer = Math.max(s.nervousPanicTimer, 2.5 + ratio * 1.8);
            if (wasCalm) {
              synthRef.current?.playNervousAlert();
              spawnFloater(s.px, piggyCenterY - 88, 'NERVOUS!', '#DC2626', 24);
            }
            // Startle piggy into darting early if it is stopped and already nervous
            if (s.nervousLevel > 0.4 && s.bossAction === 'PATTERN_STOP') {
              s.bossTimer = Math.min(s.bossTimer, 0.16);
            }
          }
        }
        const powerBonus = isSlotDirect && coinPower >= 0.42 ? Math.round(coinPower * 45) : 0;
        const dollarVal = (isSlotDirect ? 65 + Math.min(s.combo, 12) * 15 : 8) + powerBonus;
        s.score += dollarVal;
        if (s.score > s.bestScore) {
          s.bestScore = s.score;
          writeBestScore(storageKey, s.bestScore);
        }
        callbacksRef.current.onScoreChange?.({
          score: s.score,
          round: s.round,
          piggiesBroken: s.piggiesBroken,
          slotDrops: s.slotDrops,
        });

        // Money-Hurt Floating Text
        const streakLabel =
          s.pumpProgress >= s.pumpTarget
            ? `3/3 BREAK! +$${dollarVal}!`
            : `${s.pumpProgress}/3 IN A ROW! +$${dollarVal}`;
        spawnFloater(
          coinX + (Math.random() - 0.5) * 28,
          coinY - (isSlotDirect ? 42 : 24),
          isSlotDirect ? streakLabel : `+$${dollarVal} ARMOR`,
          isSlotDirect ? (coinPower >= 0.72 ? '#0284C7' : '#15803D') : '#92400E',
          isSlotDirect ? (coinPower >= 0.72 ? 26 : 24) : 15
        );
      } else {
        // Title screen preview pump
        s.bellyGoal = s.bellyGoal >= 0.98 ? 0.04 : Math.min(1.0, s.bellyGoal + 0.12);
        if (s.bellyGoal >= 0.5) {
          s.nervousPanicTimer = Math.max(s.nervousPanicTimer, 2.2);
        }
        spawnFloater(coinX, coinY - 36, isSlotDirect ? '+$$ IN SLOT!' : 'CLANG!', isSlotDirect ? '#15803D' : '#92400E', 22);
      }

      // 2. Money-Hurt Physical Recoil & Slot Swallow
      s.swallowTimer = isSlotDirect ? s.swallowMax : 0;
      s.slotGlowTimer = isSlotDirect ? 0.44 : 0.12;
      s.bossFlash = isSlotDirect ? 0.16 : 0.08;
      s.hurtTimer = isSlotDirect ? 0.24 : 0.12;
      s.hurtDir = coinX >= s.px ? -1 : 1;
      s.slotReceiveTilt = isSlotDirect ? s.dir * -10 : s.dir * -4;
      s.bellyVel += isSlotDirect ? 0.26 : 0.07;
      s.spSq.v += isSlotDirect ? 1.35 : 0.35;
      s.spLa.v -= isSlotDirect ? 24 : 10;
      s.spRa.v += isSlotDirect ? 24 : 10;
      s.spTail.v += isSlotDirect ? 34 : 14;
      s.hitStop = isSlotDirect ? 0.025 : 0;
      s.shakeTimer = Math.max(s.shakeTimer, isSlotDirect ? 0.12 : 0.03);

      // 3. Money Hurt Particles ($ signs + bills on slot hit, muted brass clank on armor graze)
      if (isSlotDirect) {
        spawnMoneyHurtFx(coinX, coinY, 12, 350);
        synthRef.current?.playMoneyHurt(Math.min(1, s.bellyGoal));
      } else {
        spawnMoneyHurtFx(coinX, coinY, 2, 175);
        synthRef.current?.playArmorClank();
      }

      // 4. Did it pump enough to BREAK?! -> Launch Heavy Premium Mechanical Disassembly!
      if (s.phase === 'PLAYING' && s.pumpProgress >= s.pumpTarget) {
        s.bossAction = 'BREAKING';
        s.breakMax = 2.75;
        s.breakTimer = 2.75;
        s.breakStage = 0;
        s.breakPx = s.px;
        s.breakPy = s.py;
        s.breakDir = s.dir;
        s.piggiesBroken += 1;
        s.bellyGoal = 1.32;
        s.bellyVel = 0.72;
        s.projectiles = [];
        s.hitStop = 0.095;
        s.shakeTimer = 0.38;
        const dirSign = s.breakDir > 0 ? -1 : 1;
        const mkPart = (
          id: string,
          el: SVGGElement | null,
          cx: number,
          cy: number,
          r: number,
          mass: number,
          detachAt: number,
          vxLocal: number,
          vy: number,
          vrot: number,
          bounce = 0.28,
          unscrew = false
        ): DisassemblyPart => ({
          id,
          el,
          cx,
          cy,
          r,
          mass,
          detachAt,
          vx: dirSign * vxLocal,
          vy,
          vrot,
          bounce,
          wx0: s.breakPx + dirSign * (cx - 550) * PIGGY_SCALE,
          wy0: FLOOR_Y + s.breakPy + (cy - 911) * PIGGY_SCALE,
          wx: s.breakPx + dirSign * (cx - 550) * PIGGY_SCALE,
          wy: FLOOR_Y + s.breakPy + (cy - 911) * PIGGY_SCALE,
          rot: 0,
          detached: false,
          clangs: 0,
          unscrew,
        });

        s.disassemblyParts = [
          mkPart('topScrew', s.topScrewWrap, 478, 186, 17, 0.75, 0.21, -180, -820, 960, 0.48, true),
          mkPart('leftPauldron', s.leftPauldron, 340, 322, 28, 1.55, 0.34, -430, -490, -320, 0.26),
          mkPart('rightPauldron', s.rightPauldronWrap, 600, 212, 26, 1.45, 0.35, 450, -470, 340, 0.26),
          mkPart('slotPlate', s.slotEjectWrap, 575, 395, 31, 1.75, 0.36, -110, -640, -240, 0.24),
          mkPart('leftArm', s.leftArmTuck, 235, 445, 33, 1.65, 0.37, -490, -310, -290, 0.24),
          mkPart('rightArm', s.rightArmTuck, 715, 175, 33, 1.65, 0.38, 500, -320, 300, 0.24),
          mkPart('tail', s.tailEjectWrap, 735, 645, 20, 0.9, 0.39, 570, -440, 680, 0.5),
          mkPart('jet', s.jetTuckWrap, 755, 672, 25, 1.25, 0.4, 620, -590, 440, 0.34),
          mkPart('chestHull', s.torsoChestWrap, 515, 420, 54, 2.7, 0.42, -230, -410, -130, 0.18),
          mkPart('bellyDome', s.torsoBellyWrap, 575, 635, 48, 2.5, 0.44, 240, -330, 145, 0.19),
          mkPart('pelvisBase', s.torsoPelvisWrap, 575, 725, 36, 2.35, 0.46, -75, -210, -95, 0.17),
          mkPart('legBack', s.leg1Wrap, 622, 835, 23, 1.5, 0.47, 300, -260, 230, 0.26),
          mkPart('legFront', s.leg0Wrap, 498, 845, 23, 1.5, 0.48, -280, -250, -215, 0.26),
        ];

        spawnMechanicalDebris(s.breakPx, piggyCenterY - 45, 7, 0.72, 'screws');

        const breakBonus = 400 * s.round;
        s.score += breakBonus;
        if (s.score > s.bestScore) {
          s.bestScore = s.score;
          writeBestScore(storageKey, s.bestScore);
        }
        callbacksRef.current.onPiggyBroken?.({
          round: s.round,
          score: s.score,
          piggiesBroken: s.piggiesBroken,
        });
        callbacksRef.current.onScoreChange?.({
          score: s.score,
          round: s.round,
          piggiesBroken: s.piggiesBroken,
          slotDrops: s.slotDrops,
        });
        synthRef.current?.playDisassemblyStart();
        spawnMoneyHurtFx(s.px, piggyCenterY, 16, 420);
        spawnFloater(s.px, piggyCenterY - 128, `DISASSEMBLY! +$${breakBonus}!`, '#15803D', 36);
      }
    };

    let raf = 0;
    let last = performance.now();
    let hudTimer = 0;

    const tick = (now: number) => {
      const rawDt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;

      if (!s.autoLiteDone && s.phase === 'PLAYING') {
        s.fpsSamples++;
        if (rawDt > 0.036) s.slowFrames++;
        if (s.fpsSamples >= 70) {
          if (s.slowFrames > 32) {
            s.autoLiteDone = true;
            setTextureOn(false);
          }
          s.fpsSamples = 0;
          s.slowFrames = 0;
        }
      }

      if (s.phase !== 'PAUSED' && s.phase !== 'WHITEPAPER') {
        if (s.hitStop > 0) s.hitStop = Math.max(0, s.hitStop - rawDt);
        const dt = s.hitStop > 0 ? rawDt * 0.15 : rawDt;

        // 1. Hand/Cursor Movement, Revolver Cylinder & Threshold Reload Sweep
        if (s.dashCooldown > 0) s.dashCooldown = Math.max(0, s.dashCooldown - rawDt);
        if (s.throwCooldown > 0) s.throwCooldown = Math.max(0, s.throwCooldown - rawDt);
        if (s.throwAnimTimer > 0) s.throwAnimTimer = Math.max(0, s.throwAnimTimer - rawDt);
        if (s.reloadCompleteFlash > 0) s.reloadCompleteFlash = Math.max(0, s.reloadCompleteFlash - rawDt);
        if (s.dryClickFlash > 0) s.dryClickFlash = Math.max(0, s.dryClickFlash - rawDt);
        if (s.bossFlash > 0) s.bossFlash = Math.max(0, s.bossFlash - rawDt);
        if (s.hurtTimer > 0) s.hurtTimer = Math.max(0, s.hurtTimer - rawDt);
        if (s.shakeTimer > 0) s.shakeTimer = Math.max(0, s.shakeTimer - rawDt);
        if (s.swallowTimer > 0) s.swallowTimer = Math.max(0, s.swallowTimer - rawDt);
        if (s.slotGlowTimer > 0) s.slotGlowTimer = Math.max(0, s.slotGlowTimer - rawDt);
        if (s.nervousPanicTimer > 0) s.nervousPanicTimer = Math.max(0, s.nervousPanicTimer - rawDt);
        if (s.dizzyTimer > 0) {
          s.dizzyTimer = s.bossAction === 'BREAKING' ? 0 : Math.max(0, s.dizzyTimer - rawDt);
        }
        const targetDizzy = s.bossAction === 'BREAKING' || s.dizzyTimer <= 0 ? 0 : Math.min(1, s.dizzyTimer / 0.55);
        s.dizzyLevel += (targetDizzy - s.dizzyLevel) * Math.min(1, rawDt * (targetDizzy > s.dizzyLevel ? 14 : 6.5));
        if (s.dizzyLevel > 0.01) {
          s.dizzyPhase += rawDt * (5.2 + 3.4 * s.dizzyLevel);
        }
        s.slotReceiveTilt *= Math.max(0, 1 - rawDt * 10);

        // Update Nervous Level (high fill pressure OR acute panic surge after rapid hits)
        const nervousFillRatio = s.pumpTarget > 0 ? s.pumpProgress / s.pumpTarget : 0;
        const pressureNervous =
          s.phase === 'PLAYING' && nervousFillRatio >= 0.46
            ? Math.min(1, (nervousFillRatio - 0.46) / 0.44)
            : 0;
        const panicNervous = s.nervousPanicTimer > 0 ? Math.min(1, 0.56 + s.nervousPanicTimer * 0.22) : 0;
        const targetNervous =
          s.bossAction === 'BREAKING' ? 0 : Math.max(pressureNervous, panicNervous);
        s.nervousLevel +=
          (targetNervous - s.nervousLevel) *
          Math.min(1, rawDt * (targetNervous > s.nervousLevel ? 6.5 : 2.1));

        // Smooth cylinder rotation per fired chamber & threshold reload sweep
        s.cylinderAngle += (s.cylinderTargetAngle - s.cylinderAngle) * Math.min(1, rawDt * 22);
        if (s.isReloading) {
          s.reloadTimer += rawDt;
          const reloadFrac = Math.min(1, s.reloadTimer / s.reloadDuration);
          const nextStep = Math.floor(reloadFrac * s.revolverMax);
          if (nextStep > s.reloadSoundStep && nextStep < s.revolverMax) {
            s.reloadSoundStep = nextStep;
            s.cylinderTargetAngle += (Math.PI * 2) / s.revolverMax;
            synthRef.current?.playCylinderTick(nextStep);
          }
          if (s.reloadTimer >= s.reloadDuration) {
            s.isReloading = false;
            s.reloadTimer = 0;
            s.revolverChambers = s.revolverMax;
            s.reloadCompleteFlash = 0.42;
            s.cylinderTargetAngle += (Math.PI * 2) / s.revolverMax;
            synthRef.current?.playReloadComplete();
          }
        }

        // Tap-Hop, Hold-Charge Power Meter, Low-to-Top Laser Climb & Progressive Tap-Grow Physics
        if (s.laserIgniteFlash > 0) {
          s.laserIgniteFlash = Math.max(0, s.laserIgniteFlash - rawDt * 6.5);
        }
        if (s.handHoldActive && (s.phase === 'PLAYING' || s.phase === 'TITLE_MENU')) {
          s.handHoldDuration += rawDt;
          s.laserGrow = Math.min(1, s.handHoldDuration / 0.85);
          s.laserHoldSnapshot = s.laserGrow;
          s.laserFadeTimer = 0;
          const curProfile = LASER_PROFILES[s.laserStyle];
          const fBoost = s.difficulty === 'FRENZY' ? 1.15 : 1.0;
          const syncFocusDamp = s.slingLocked ? 0.46 : 1.0;
          const elevClimbRate = (0.62 + curProfile.sweepRate * 0.075) * fBoost * syncFocusDamp;
          s.laserElev = Math.min(1, s.laserElev + rawDt * elevClimbRate);

          const prevStep = s.handChargeStep;
          if (s.handHoldDuration >= 0.14) {
            s.handCharge = Math.min(1, (s.handHoldDuration - 0.14) / 0.85);
            const nextStep = s.handCharge >= 0.98 ? 3 : s.handCharge >= 0.65 ? 2 : s.handCharge >= 0.3 ? 1 : 0;
            if (nextStep > prevStep) {
              s.handChargeStep = nextStep;
              synthRef.current?.playChargeTick(nextStep);
            }
          }
          // Pull back & tense slightly along aim vector while charging
          const aimState = getSlingLaunchState();
          const pullMag = 14 * Math.max(s.handCharge, s.laserElev * 0.45);
          const pullTargetX = -Math.cos(aimState.launchAngle) * pullMag + (s.handCharge > 0.7 ? Math.sin(now * 0.08) * 2.2 * s.handCharge : 0);
          const pullTargetY = -Math.sin(aimState.launchAngle) * pullMag + (s.handCharge > 0.7 ? Math.cos(now * 0.09) * 2.2 * s.handCharge : 0);
          s.handOffsetX += (pullTargetX - s.handOffsetX) * Math.min(1, rawDt * 18);
          s.handOffsetY += (pullTargetY - s.handOffsetY) * Math.min(1, rawDt * 18);
          s.handScaleX += (1 + 0.14 * s.handCharge - s.handScaleX) * Math.min(1, rawDt * 14);
          s.handScaleY += (1 - 0.14 * s.handCharge - s.handScaleY) * Math.min(1, rawDt * 14);
          s.handTiltDeg += (-s.facing * 24 * s.handCharge - s.handTiltDeg) * Math.min(1, rawDt * 14);

          if (s.handCharge > 0.15) {
            s.handChargeTrailAcc += rawDt;
            if (s.handChargeTrailAcc >= 0.05) {
              s.handChargeTrailAcc = 0;
              const ang = Math.random() * Math.PI * 2;
              const rad = 46 - s.handCharge * 18;
              s.particles.push({
                x: s.cx + s.handOffsetX + Math.cos(ang) * rad,
                y: s.cy + s.handHopY + s.handOffsetY + Math.sin(ang) * rad,
                vx: -Math.cos(ang) * 95,
                vy: -Math.sin(ang) * 95,
                r: 2.2 + s.handCharge * 1.4,
                color: s.handCharge >= 0.78 ? 'rgba(253, 224, 71, 0.85)' : 'rgba(56, 189, 248, 0.78)',
                life: 0.22,
                maxLife: 0.22,
                gravity: 0,
                kind: 'gleam',
                rot: Math.random() * 90,
                vrot: 240,
                drag: 2,
              });
            }
          }
        } else {
          if (s.laserFadeTimer > 0) {
            s.laserFadeTimer = Math.max(0, s.laserFadeTimer - rawDt);
            if (s.laserFadeTimer <= 0) {
              s.laserElev = 0;
              s.laserGrow = 0;
            }
          } else {
            s.laserElev += (0 - s.laserElev) * Math.min(1, rawDt * 12);
            if (s.laserElev < 0.002) s.laserElev = 0;
            s.laserGrow = 0;
          }
          s.handOffsetX += (0 - s.handOffsetX) * Math.min(1, rawDt * 14);
          s.handOffsetY += (0 - s.handOffsetY) * Math.min(1, rawDt * 14);
          s.handScaleX += (1 - s.handScaleX) * Math.min(1, rawDt * 14);
          s.handScaleY += (1 - s.handScaleY) * Math.min(1, rawDt * 14);
        }

        // Quick-tap vertical hop physics
        if (s.handHopY < 0 || s.handHopVy !== 0) {
          s.handHopVy += 2850 * rawDt;
          s.handHopY += s.handHopVy * rawDt;
          if (s.handHopY >= 0) {
            const impactSpd = Math.abs(s.handHopVy);
            s.handHopY = 0;
            s.handHopVy = 0;
            if (impactSpd > 140) {
              s.handScaleX = 1.18;
              s.handScaleY = 0.84;
            }
          }
        }

        // Hand collider timers & recoil damping
        if (s.handColCooldown > 0) s.handColCooldown = Math.max(0, s.handColCooldown - rawDt);
        if (s.handShieldFlash > 0) s.handShieldFlash = Math.max(0, s.handShieldFlash - rawDt);
        s.handScrapeFxAcc += rawDt;

        // Extended glide + dash-hold air glide + collision-safe hand movement
        let nextHandX = s.cx;
        let nextHandY = s.cy;
        if (s.dashTimer > 0) {
          s.dashTimer = Math.max(0, s.dashTimer - rawDt);
          nextHandX = s.cx + s.dashVx * rawDt;
          nextHandY = s.cy + s.dashVy * rawDt;
          s.afterimages.push({ x: s.cx, y: s.cy + s.handHopY, life: 0.18, maxLife: 0.18 });
          if (s.dashTimer <= 0 && s.dashHolding && s.dashGlideFuel > 0) {
            s.handGlideTimer = Math.max(s.handGlideTimer, 0.2);
            s.handGlideVx = s.dashVx * 0.34;
            s.handGlideVy = s.dashVy * 0.34;
          }
        } else if (s.dashHolding && s.dashGlideFuel > 0 && s.phase === 'PLAYING') {
          s.dashGlideFuel = Math.max(0, s.dashGlideFuel - rawDt);
          s.handGlideTimer = Math.max(s.handGlideTimer, 0.12);
          nextHandX = s.cx + (s.targetCx - s.cx) * Math.min(1, rawDt * 12) + s.handGlideVx * rawDt * 0.35;
          nextHandY = s.cy + (s.targetCy - s.cy) * Math.min(1, rawDt * 12) + s.handGlideVy * rawDt * 0.35;
          s.handGlideVx *= Math.max(0, 1 - rawDt * 2.5);
          s.handGlideVy *= Math.max(0, 1 - rawDt * 2.5);
          s.afterimages.push({ x: s.cx, y: s.cy + s.handHopY, life: 0.22, maxLife: 0.22 });
        } else if (s.handGlideTimer > 0) {
          s.handGlideTimer = Math.max(0, s.handGlideTimer - rawDt);
          nextHandX = s.cx + (s.targetCx - s.cx) * Math.min(1, rawDt * 13) + s.handGlideVx * rawDt * 0.22;
          nextHandY = s.cy + (s.targetCy - s.cy) * Math.min(1, rawDt * 13) + s.handGlideVy * rawDt * 0.22;
          s.handGlideVx *= Math.max(0, 1 - rawDt * 4.5);
          s.handGlideVy *= Math.max(0, 1 - rawDt * 4.5);
          if (Math.random() < 0.5) {
            s.afterimages.push({ x: s.cx + s.handOffsetX, y: s.cy + s.handHopY + s.handOffsetY, life: 0.2, maxLife: 0.2 });
          }
        } else if (s.handHoldActive) {
          // Focus-glide smoothing while holding & charging power meter
          const glideTrackRate = 24 - s.handCharge * 11;
          nextHandX = s.cx + (s.targetCx - s.cx) * Math.min(1, rawDt * glideTrackRate);
          nextHandY = s.cy + (s.targetCy - s.cy) * Math.min(1, rawDt * glideTrackRate);
        } else {
          nextHandX = s.targetCx;
          nextHandY = s.targetCy;
        }

        if (Math.abs(s.handBounceVx) > 2 || Math.abs(s.handBounceVy) > 2) {
          nextHandX += s.handBounceVx * rawDt;
          nextHandY += s.handBounceVy * rawDt;
          const bDamp = Math.max(0, 1 - rawDt * 14);
          s.handBounceVx *= bDamp;
          s.handBounceVy *= bDamp;
        } else {
          s.handBounceVx = 0;
          s.handBounceVy = 0;
        }
        moveHandWithCollision(nextHandX, nextHandY, rawDt, false);

        const cDx = s.cx - s.prevCx;
        const cDy = s.cy - s.prevCy;
        s.velX = cDx / Math.max(rawDt, 0.001);
        const cSpeed = Math.hypot(cDx, cDy) / Math.max(rawDt, 0.001);
        s.prevCx = s.cx;
        s.prevCy = s.cy;

        // Smooth velocity-banked tilt when not charging
        if (!s.handHoldActive) {
          const bankTarget = Math.max(-18, Math.min(18, s.velX * 0.012));
          s.handTiltDeg += (bankTarget - s.handTiltDeg) * Math.min(1, rawDt * 12);
        }

        // Deterministic Varied Laser Profile Cycling (Zero random oscillation)
        if (s.laserModeSetting === 'AUTO' && s.phase === 'PLAYING' && !s.handHoldActive) {
          s.laserSwitchTimer -= rawDt;
          if (s.laserSwitchTimer <= 0) {
            s.laserSwitchTimer = 5.0;
            s.laserIndex = (s.laserIndex + 1) % LASER_STYLE_ORDER.length;
            applyLaserStyle(LASER_STYLE_ORDER[s.laserIndex], true);
          }
        }
        const curLaserProfile = LASER_PROFILES[s.laserStyle];
        s.slingSpeed += (curLaserProfile.sweepRate - s.slingSpeed) * Math.min(1, rawDt * 6);
        s.slingPhase += rawDt * (s.slingSpeed + s.laserElev * 2.4);

        const isThrowing = s.throwAnimTimer > 0 || s.dashTimer > 0 || s.handGlideTimer > 0;
        const row = isThrowing ? 1 : 0;
        let col = 0;
        if (isThrowing) {
          const p = 1 - Math.max(0, s.throwAnimTimer) / 0.13;
          col = Math.min(SPRITE_COLS - 1, Math.floor(p * SPRITE_COLS));
        } else if (s.handHoldActive && s.handCharge > 0.05) {
          // Lock hand sprite to wind-up pinch frame as charge builds
          col = Math.min(SPRITE_COLS - 1, Math.floor(s.handCharge * (SPRITE_COLS - 1)));
        } else {
          s.spriteFrameTime += rawDt * (cSpeed > 220 ? 13 : 7);
          col = Math.floor(s.spriteFrameTime) % SPRITE_COLS;
        }

        // 2. Pattern-Based Evasive Movement AI + Bouncy Ball State (with solid Hand Collider!)
        const piggyCenterY = getBallWorldCenterY();
        const slotPos = getSlotHolePos();
        const prevFramePx = s.px;

        if (s.bossAction === 'BOUNCY_BALL') {
          s.ballMorph += (1 - s.ballMorph) * Math.min(1, dt * 13);
        } else {
          s.ballMorph += (0 - s.ballMorph) * Math.min(1, dt * 10);
          s.ballAngle += (0 - s.ballAngle) * Math.min(1, dt * 10);
        }

        if (s.phase === 'PLAYING') {
          const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];

          // Periodic crimson warning steam & sparks when nervous
          if (s.nervousLevel > 0.22 && s.bossAction !== 'BREAKING') {
            s.bellyVel += Math.sin(now * 0.026) * 0.009 * s.nervousLevel;
            s.nervousSteamAcc += dt * (0.7 + s.nervousLevel * 1.8);
            if (s.nervousSteamAcc >= 0.34) {
              s.nervousSteamAcc = 0;
              const steamAng = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.4;
              const steamSpd = 120 + Math.random() * 140 * s.nervousLevel;
              s.particles.push({
                x: slotPos.x + (Math.random() - 0.5) * 34,
                y: slotPos.y - 10,
                vx: Math.cos(steamAng) * steamSpd,
                vy: Math.sin(steamAng) * steamSpd,
                r: 2.6 + Math.random() * 2.2,
                color: Math.random() < 0.65 ? 'rgba(239, 68, 68, 0.78)' : 'rgba(251, 146, 60, 0.75)',
                life: 0.32,
                maxLife: 0.32,
                gravity: -40,
                kind: Math.random() < 0.45 ? 'gleam' : 'dot',
                rot: Math.random() * 90,
                vrot: (Math.random() - 0.5) * 300,
                drag: 3.2,
              });
            }
          }

          // Keep-Pumped Pressure Hold Countdown (drains slower in Bouncy Ball or during reload; vents & resets streak if it runs dry!)
          if (s.bossAction !== 'BREAKING' && s.pumpProgress > 0) {
            s.sinceLastSlotHit += dt;
            const drainScale = s.bossAction === 'BOUNCY_BALL' ? 0.42 : s.isReloading ? 0.45 : 1.0;
            s.pumpHoldTimer = Math.max(0, s.pumpHoldTimer - dt * drainScale);

            const holdRatio = s.pumpHoldMax > 0 ? Math.min(1, s.pumpHoldTimer / s.pumpHoldMax) : 0;
            const baseBelly = 0.04 + (s.pumpProgress / s.pumpTarget) * 1.08;
            s.bellyGoal = Math.max(0.04, baseBelly * (0.55 + 0.45 * holdRatio));

            if (holdRatio < 0.55) {
              s.pressureBleedFxAcc += dt;
              if (s.pressureBleedFxAcc >= 0.36) {
                s.pressureBleedFxAcc = 0;
                spawnDustPuff(slotPos.x, slotPos.y - 6, s.dir, 2, 75);
              }
            }

            if (s.pumpHoldTimer <= 0) {
              s.pumpProgress = 0;
              s.combo = 0;
              s.bellyGoal = 0.04;
              s.nervousPanicTimer = 0;
              spawnDustPuff(slotPos.x, slotPos.y - 8, s.dir, 5, 165);
              spawnFloater(s.px, piggyCenterY - 96, 'VENTED! KEEP PUMPED (0/3)', '#DC2626', 18);
              synthRef.current?.playArmorClank();
            }
          }

          if (s.bossAction === 'BREAKING') {
            s.walkM = 0;
            s.ballMorph = Math.max(0, s.ballMorph - dt * 10);
            const prevElapsed = s.breakMax - s.breakTimer;
            s.breakTimer -= dt;
            const elapsed = s.breakMax - s.breakTimer;
            const dirSign = s.breakDir > 0 ? -1 : 1;

            // Beat 1 (0..0.38s): Unscrewing pressure bolts, steam jets & seam sparks
            if (s.breakStage === 0) {
              if (prevElapsed < 0.16 && elapsed >= 0.16) {
                spawnMechanicalDebris(s.breakPx, piggyCenterY - 12, 8, 0.82, 'screws');
              }
              if (Math.random() < 0.72) {
                spawnDustPuff(
                  s.breakPx + (Math.random() - 0.5) * 85,
                  piggyCenterY + (Math.random() - 0.5) * 90,
                  Math.random() < 0.5 ? -1 : 1,
                  2,
                  280
                );
              }
              if (Math.random() < 0.55) {
                s.particles.push({
                  x: s.breakPx + (Math.random() - 0.5) * 70,
                  y: piggyCenterY + (Math.random() - 0.5) * 70,
                  vx: (Math.random() - 0.5) * 520,
                  vy: -160 - Math.random() * 340,
                  r: 3.5 + Math.random() * 3.5,
                  color: Math.random() < 0.5 ? '#FEF08A' : '#F97316',
                  life: 0.25 + Math.random() * 0.2,
                  maxLife: 0.45,
                  gravity: 480,
                  kind: 'gleam',
                });
              }
            }

            // Beat 2 (0.36s): CORE DETONATION! Heavy hull plates & hardware blast outward
            if (s.breakStage === 0 && elapsed >= 0.36) {
              s.breakStage = 1;
              s.shakeTimer = 0.48;
              synthRef.current?.playPiggyBreak();
              s.shockwaves.push(
                {
                  x: s.breakPx,
                  y: piggyCenterY,
                  r: 28,
                  maxR: 350,
                  life: 0.44,
                  maxLife: 0.44,
                  color: '#FEF08A',
                  lineWidth: 12,
                },
                {
                  x: s.breakPx,
                  y: piggyCenterY,
                  r: 18,
                  maxR: 260,
                  life: 0.36,
                  maxLife: 0.36,
                  color: '#F59E0B',
                  lineWidth: 6.5,
                }
              );
              spawnMoneyHurtFx(s.breakPx, piggyCenterY, 26, 610);
              spawnMechanicalDebris(s.breakPx, piggyCenterY, 34, 1.05, 'burst');
            }

            // Beat 3 (0.98s): Exposed inner clockwork boiler core secondary burst
            if (s.breakStage === 1 && elapsed >= 0.98) {
              s.breakStage = 2;
              s.shakeTimer = 0.28;
              synthRef.current?.playCoreBurst();
              s.shockwaves.push({
                x: s.breakPx,
                y: piggyCenterY,
                r: 20,
                maxR: 270,
                life: 0.38,
                maxLife: 0.38,
                color: '#F97316',
                lineWidth: 8.5,
              });
              spawnMoneyHurtFx(s.breakPx, piggyCenterY, 22, 540);
              spawnMechanicalDebris(s.breakPx, piggyCenterY, 24, 0.9, 'burst');
            }

            // Heavy ballistic integration + floor slam weight, shock rings, sparks & skid friction
            for (const dp of s.disassemblyParts) {
              if (elapsed < dp.detachAt) continue;
              if (!dp.detached) {
                dp.detached = true;
                dp.wx0 = s.breakPx + dirSign * (dp.cx - 550) * PIGGY_SCALE;
                dp.wy0 = FLOOR_Y + s.breakPy + (dp.cy - 911) * PIGGY_SCALE;
                dp.wx = dp.wx0;
                dp.wy = dp.wy0;
                if (dp.id === 'topScrew') {
                  dp.wy -= 26;
                  synthRef.current?.playPartClang(1.55);
                }
              }
              // Jet thruster sputters upward/forward briefly after snapping free
              if (dp.id === 'jet' && elapsed < 1.15) {
                dp.vy -= 420 * dt;
                if (Math.random() < 0.75) {
                  s.particles.push({
                    x: dp.wx,
                    y: dp.wy,
                    vx: (Math.random() - 0.5) * 140,
                    vy: 90 + Math.random() * 140,
                    r: 4 + Math.random() * 4,
                    color: Math.random() < 0.5 ? '#FB923C' : '#FDE047',
                    life: 0.24,
                    maxLife: 0.24,
                    gravity: -60,
                    kind: 'dot',
                  });
                }
              }

              const partGravity = 1660 + dp.mass * 320;
              dp.vy += partGravity * dt;
              dp.wx += dp.vx * dt;
              dp.wy += dp.vy * dt;
              dp.rot += dp.vrot * dt;

              if (dp.wx < MIN_X + 18) {
                dp.wx = MIN_X + 18;
                dp.vx = Math.abs(dp.vx) * 0.55;
                dp.vrot *= -0.6;
              } else if (dp.wx > MAX_X - 18) {
                dp.wx = MAX_X - 18;
                dp.vx = -Math.abs(dp.vx) * 0.55;
                dp.vrot *= -0.6;
              }

              const floorContactY = FLOOR_Y - dp.r;
              if (dp.wy >= floorContactY) {
                dp.wy = floorContactY;
                const impSpeed = Math.abs(dp.vy);
                if (impSpeed > 95) {
                  dp.vy = -impSpeed * dp.bounce;
                  dp.vx *= dp.mass >= 1.5 ? 0.62 : 0.72;
                  dp.vrot *= dp.mass >= 1.5 ? 0.44 : 0.6;
                  if (impSpeed > 155) {
                    const dustCount = dp.mass >= 1.9 ? 6 : 3;
                    spawnDustPuff(dp.wx, FLOOR_Y - 3, dp.vx >= 0 ? 1 : -1, dustCount, 145 + dp.mass * 35);
                    if (dp.mass >= 1.5 && impSpeed > 260) {
                      s.landingRings.push({
                        x: dp.wx,
                        y: FLOOR_Y + 3,
                        rx: dp.r * 0.75,
                        maxRx: dp.r * (1.5 + dp.mass * 0.42),
                        life: 0.26,
                        maxLife: 0.26,
                        color: 'rgba(180, 83, 9, 0.34)',
                      });
                      for (let sp = 0; sp < 4; sp++) {
                        s.particles.push({
                          x: dp.wx + (Math.random() - 0.5) * dp.r,
                          y: FLOOR_Y - 4,
                          vx: (Math.random() - 0.5) * 320,
                          vy: -90 - Math.random() * 190,
                          r: 2.2 + Math.random() * 2,
                          color: sp % 2 === 0 ? '#FEF08A' : '#F59E0B',
                          life: 0.2 + Math.random() * 0.14,
                          maxLife: 0.34,
                          gravity: 780,
                          kind: 'gleam',
                        });
                      }
                    }
                    if (dp.clangs < 2) {
                      dp.clangs += 1;
                      if (dp.mass >= 1.45 && dp.clangs === 1) {
                        s.shakeTimer = Math.max(s.shakeTimer, Math.min(0.18, 0.055 * dp.mass));
                        synthRef.current?.playHeavyPartThud(dp.mass);
                      } else {
                        synthRef.current?.playPartClang(0.76 + (dp.clangs === 1 ? 0.14 : 0.34) + Math.random() * 0.14);
                      }
                    }
                  }
                } else {
                  dp.vy = 0;
                  dp.vx *= Math.max(0, 1 - dt * (7 + dp.mass * 2.5));
                  dp.vrot *= Math.max(0, 1 - dt * (8 + dp.mass * 2.5));
                }
              }
            }

            if (s.breakTimer <= 0) {
              s.bossAction = 'PATTERN_STOP';
              s.phase = 'WHITEPAPER';
              s.throwHolding = false;
              s.projectiles = [];
              s.disassemblyParts = [];
              s.debrisItems = [];
              s.shockwaves = [];
              setWpTab('PDF');
              setPhase('WHITEPAPER');
            }
          } else if (s.bossAction === 'BOUNCY_BALL') {
            const nv = s.nervousLevel;
            const dizzyPace = s.dizzyLevel > 0.08 ? Math.max(0.45, 1 - 0.5 * s.dizzyLevel) : 1;
            s.walkM = 0;
            s.ballTimer -= dt * dizzyPace;
            s.ballVy += (1740 + nv * 320) * dt;
            s.px += s.ballVx * dt;
            s.py += s.ballVy * dt;
            s.ballAngle += s.ballSpin * dt;
            s.alt = Math.max(0, -s.py / PIGGY_SCALE);
            s.goalAlt = s.alt;
            s.vAlt = -s.ballVy / PIGGY_SCALE;
            const ballRWorld = getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE;

            // Elastic arena wall bounces with rubber wall-squash & echo
            if (s.px <= MIN_X) {
              const wallImp = Math.min(1.4, Math.abs(s.ballVx) / 520);
              s.px = MIN_X;
              s.ballVx = Math.abs(s.ballVx) * (0.96 + Math.random() * 0.14 + nv * 0.08);
              s.ballSpin = (s.ballVx >= 0 ? 1 : -1) * (490 + Math.random() * 320) * (1 + nv * 0.28);
              s.spBallWall.x = Math.max(s.spBallWall.x, 0.2 * wallImp);
              s.spBallWall.v += 5.2 * wallImp;
              s.bellyVel += 0.24 * wallImp;
              s.ballAfterimages.push({
                x: s.px,
                y: getBallWorldCenterY(),
                r: ballRWorld,
                sx: 0.78,
                sy: 1.26,
                rot: 0,
                life: 0.26,
                maxLife: 0.26,
              });
              spawnCollisionFx(MIN_X - ballRWorld * 0.65, piggyCenterY, 1, 0, nv > 0.45 ? '#EF4444' : '#F59E0B', true);
              synthRef.current?.playBallBoing(1.1 + nv * 0.16);
            } else if (s.px >= MAX_X) {
              const wallImp = Math.min(1.4, Math.abs(s.ballVx) / 520);
              s.px = MAX_X;
              s.ballVx = -Math.abs(s.ballVx) * (0.96 + Math.random() * 0.14 + nv * 0.08);
              s.ballSpin = (s.ballVx >= 0 ? 1 : -1) * (490 + Math.random() * 320) * (1 + nv * 0.28);
              s.spBallWall.x = Math.max(s.spBallWall.x, 0.2 * wallImp);
              s.spBallWall.v += 5.2 * wallImp;
              s.bellyVel += 0.24 * wallImp;
              s.ballAfterimages.push({
                x: s.px,
                y: getBallWorldCenterY(),
                r: ballRWorld,
                sx: 0.78,
                sy: 1.26,
                rot: 0,
                life: 0.26,
                maxLife: 0.26,
              });
              spawnCollisionFx(MAX_X + ballRWorld * 0.65, piggyCenterY, -1, 0, nv > 0.45 ? '#EF4444' : '#F59E0B', true);
              synthRef.current?.playBallBoing(1.1 + nv * 0.16);
            }

            // Ceiling deflection with elastic squash
            if (s.py <= -540) {
              s.py = -540;
              s.ballVy = Math.abs(s.ballVy) * 0.9;
              s.spBallSq.x = Math.max(s.spBallSq.x, 0.2);
              s.spBallSq.v += 4.6;
              s.bellyVel += 0.2;
              spawnCollisionFx(s.px, FLOOR_Y + s.py - ballRWorld * 1.4, 0, 1, nv > 0.45 ? '#EF4444' : '#FBBF24', false);
              synthRef.current?.playBallBoing(1.22 + nv * 0.16);
            }

            // High-energy rubber-brass floor bounce with deep elastic squash
            if (s.py >= 0) {
              const impactSpeed = Math.abs(s.ballVy);
              const imp = Math.max(0.7, Math.min(1.5, impactSpeed / 700));
              s.py = 0;
              if (s.ballTimer > 0) {
                const keepSameProb = Math.max(0.38, 0.72 - nv * 0.32);
                const keepDir = Math.random() < keepSameProb ? (s.ballVx >= 0 ? 1 : -1) : (s.px < WORLD_W * 0.5 ? 1 : -1);
                const hMag = (430 + Math.random() * 350) * (s.difficulty === 'FRENZY' ? 1.18 : 1.0) * (1 + nv * 0.24);
                s.ballVx = keepDir * hMag;
                s.ballVy = -(780 + Math.random() * 350) * (1 + nv * 0.14);
                s.ballSpin = keepDir * (540 + Math.random() * 340) * (1 + nv * 0.3);
                s.spBallSq.x = Math.max(s.spBallSq.x, 0.24 * imp);
                s.spBallSq.v += 5.4 * imp;
                s.bellyVel += 0.34 * imp;
                s.ballSquashContact = 1;
                s.ballAfterimages.push({
                  x: s.px,
                  y: FLOOR_Y - ballRWorld * 0.85,
                  r: ballRWorld,
                  sx: 1.28,
                  sy: 0.76,
                  rot: 0,
                  life: 0.3,
                  maxLife: 0.3,
                });
                s.landingRings.push({
                  x: s.px,
                  y: FLOOR_Y + 4,
                  rx: 28,
                  maxRx: 162,
                  life: 0.36,
                  maxLife: 0.36,
                  color: nv > 0.45 ? 'rgba(239, 68, 68, 0.62)' : 'rgba(217, 119, 6, 0.58)',
                });
                spawnDustPuff(s.px - 26, FLOOR_Y - 2, -1, 5, 210);
                spawnDustPuff(s.px + 26, FLOOR_Y - 2, 1, 5, 210);
                spawnCollisionFx(s.px, FLOOR_Y - 6, 0, -1, nv > 0.45 ? '#EF4444' : '#F59E0B', true);
                s.shakeTimer = Math.max(s.shakeTimer, 0.065 + nv * 0.03);
                synthRef.current?.playBallBoing(0.95 + Math.random() * 0.2 + nv * 0.15);
              } else {
                // Ball timer finished cleanly on floor touch -> uncurl & resume pattern!
                s.py = 0;
                s.alt = 0;
                s.prevAlt = 0;
                s.vAlt = 0;
                s.goalAlt = 0;
                s.onGround = true;
                s.spBallSq.v += 2.6;
                s.ballSquashContact = 0.7;
                s.ballAngle = ((((s.ballAngle % 360) + 540) % 360) - 180);
                spawnLandingFx(s.px, 0.9);
                advanceToNextPatternSpot(true);
              }
            }
          } else if (s.bossAction === 'WALK') {
            const nv = s.nervousLevel;
            const dizzyPace = s.dizzyLevel > 0.08 ? Math.max(0.45, 1 - 0.5 * s.dizzyLevel) : 1;
            const walkMinX = MIN_X + 95;
            const walkMaxX = MAX_X - 95;
            const isIdleWalk = s.playerIdleTimer >= 2.0 && s.pumpProgress === 0;
            const walkSpd = (isIdleWalk ? 205 : 265) * (s.difficulty === 'FRENZY' ? 1.14 : 1.0) * (1 + nv * 0.25) * dizzyPace;

            s.goalAlt = 0;
            if (s.alt <= 6) {
              if (s.walkTurnPause > 0) {
                s.walkTurnPause = Math.max(0, s.walkTurnPause - dt);
                s.walkM += (0 - s.walkM) * Math.min(1, dt * 14);
              } else {
                s.px += s.dir * walkSpd * dt;
                const targetWalk = Math.min(1.15, walkSpd / 235);
                s.walkM += (targetWalk - s.walkM) * Math.min(1, dt * 10);
                if (s.px <= walkMinX) {
                  s.px = walkMinX;
                  s.dir = 1;
                  s.walkTurnPause = 0.16;
                  s.spLean.v += 12;
                } else if (s.px >= walkMaxX) {
                  s.px = walkMaxX;
                  s.dir = -1;
                  s.walkTurnPause = 0.16;
                  s.spLean.v -= 12;
                }
              }
            } else {
              s.walkM += (0 - s.walkM) * Math.min(1, dt * 8);
            }

            if (!isIdleWalk) {
              if (s.walkTimer > 0) {
                s.walkTimer -= dt * dizzyPace;
              }
              if (s.walkTimer <= 0 || nv >= 0.55) {
                advanceToNextPatternSpot(true);
              }
            }
          } else if (s.bossAction === 'PATTERN_STOP') {
            const nv = s.nervousLevel;
            const dizzyPace = s.dizzyLevel > 0.08 ? Math.max(0.42, 1 - 0.54 * s.dizzyLevel) : 1;
            s.walkM += (0 - s.walkM) * Math.min(1, dt * 12);
            s.bossTimer -= dt * (1 + nv * 0.55) * dizzyPace;

            // Volatile nervous pacing & erratic direction glances while paused
            if (nv > 0.2) {
              s.nervousDartTimer -= dt;
              if (s.nervousDartTimer <= 0) {
                s.nervousDartTimer = 0.14 + Math.random() * (0.24 - nv * 0.12);
                s.nervousJitterX = (Math.random() - 0.5) * 44 * nv;
                if (s.bossTimer >= 0.28 && Math.random() < 0.55 * nv) {
                  s.dir = Math.random() < 0.5 ? -1 : 1;
                }
              }
            } else {
              s.nervousJitterX *= Math.max(0, 1 - dt * 12);
            }

            // Gentle subtle tell right before dashing to the next spot in the pattern
            const nextSpot = pat.spots[(s.spotIndex + 1) % pat.spots.length];
            if (s.bossTimer < 0.26) {
              s.dir = nextSpot.x >= s.px ? 1 : -1;
              s.moveTargetAlt = nextSpot.alt;
            }

            // If player does nothing, calmly enter WALK patrol state
            if (s.playerIdleTimer >= 2.0 && s.pumpProgress === 0 && nv < 0.3) {
              s.bossAction = 'WALK';
              s.goalAlt = 0;
              s.walkTimer = 0;
              s.walkTurnPause = 0;
            } else if (s.bossTimer <= 0) {
              advanceToNextPatternSpot();
            }
          } else {
            // Smoothly zip through space along the pattern route to the next stop spot
            const nv = s.nervousLevel;
            const dizzyPace = s.dizzyLevel > 0.08 ? Math.max(0.48, 1 - 0.48 * s.dizzyLevel) : 1;
            s.moveElapsed += dt * dizzyPace;
            const u = Math.min(1, s.moveElapsed / Math.max(0.05, s.moveDuration));
            // Smooth cubic-quintic blend for realistic acceleration, cruise & deceleration
            const ease = u < 0.5 ? 16 * u * u * u * u * u : 1 - Math.pow(-2 * u + 2, 5) / 2;

            const prevPx = s.px;
            const jukeX = nv > 0.25 ? Math.sin(u * Math.PI * 2) * 38 * nv : 0;
            const jukeAlt = nv > 0.25 ? Math.sin(u * Math.PI * 3) * 44 * nv : 0;
            s.px = s.moveFromX + (s.moveTargetX - s.moveFromX) * ease + jukeX;
            const linearAlt = s.moveFromAlt + (s.moveTargetAlt - s.moveFromAlt) * ease;
            const arcAlt = s.moveArcAlt * Math.sin(u * Math.PI);
            s.goalAlt = Math.max(0, linearAlt + arcAlt + jukeAlt);

            const speedX = Math.abs(s.px - prevPx) / Math.max(dt, 0.001);
            const targetWalk = s.goalAlt > 20 ? Math.min(1.3, speedX / 550) : Math.min(1.6, speedX / 420);
            s.walkM += (targetWalk - s.walkM) * Math.min(1, dt * 12);

            if (u >= 1) {
              const wasMovingFast = Math.abs(s.realVx) > 220;
              s.px = s.moveTargetX;
              s.goalAlt = s.moveTargetAlt;
              s.visitedSpots.add(s.spotIndex);
              s.bossAction = 'PATTERN_STOP';
              s.bossTimer = s.stopDuration * Math.max(0.45, 1 - nv * 0.42);
              s.walkM = 0;

              // Landing impact on floor arrival or heel-skid dust on fast ground stop
              if (s.moveTargetAlt <= 2 && (s.alt > 16 || s.moveFromAlt > 16 || s.moveArcAlt > 0)) {
                s.alt = 0;
                s.vAlt = 0;
                s.py = 0;
                s.onGround = true;
                spawnLandingFx(s.px, Math.max(0.85, Math.min(1.4, (s.moveFromAlt + s.moveArcAlt) / 230)));
              } else if (s.moveTargetAlt <= 2 && wasMovingFast) {
                spawnDustPuff(s.px + s.dir * 20, FLOOR_Y - 2, s.dir, 5, 175);
                s.spLean.v -= s.dir * 16;
                s.bellyVel += 0.1;
              }
            }
          }
          s.playerIdleTimer += rawDt;
        } else if (s.phase === 'TITLE_MENU') {
          // When doing nothing on the title screen, piggy walks peacefully right and left!
          s.bossAction = 'WALK';
          s.goalAlt = 0;
          const dizzyPace = s.dizzyLevel > 0.08 ? Math.max(0.45, 1 - 0.5 * s.dizzyLevel) : 1;
          const menuMinX = MIN_X + 115;
          const menuMaxX = MAX_X - 115;
          const menuWalkSpd = 195 * dizzyPace;
          s.bellyVel += Math.sin(now * 0.0025) * 0.0004;
          if (s.walkTurnPause > 0) {
            s.walkTurnPause = Math.max(0, s.walkTurnPause - dt);
            s.walkM += (0 - s.walkM) * Math.min(1, dt * 12);
          } else {
            s.px += s.dir * menuWalkSpd * dt;
            s.walkM += (0.84 - s.walkM) * Math.min(1, dt * 8);
            if (s.px <= menuMinX) {
              s.px = menuMinX;
              s.dir = 1;
              s.walkTurnPause = 0.18;
              s.spLean.v += 10;
            } else if (s.px >= menuMaxX) {
              s.px = menuMaxX;
              s.dir = -1;
              s.walkTurnPause = 0.18;
              s.spLean.v -= 10;
            }
          }
        }

        // Track real horizontal velocity & acceleration for realistic banking + dual trails
        const curRealVx = (s.px - prevFramePx) / Math.max(dt, 0.001);
        s.realAx = Math.max(-5500, Math.min(5500, (curRealVx - s.prevRealVx) / Math.max(dt, 0.001)));
        s.prevRealVx = curRealVx;
        s.realVx = curRealVx;

        // Update player's falling coins with physical ricochets, floor bounces & premium expiration
        const inBallMode = s.ballMorph > 0.35;
        const activePiggyCenterY = getBallWorldCenterY();
        const activeSlotPos = getSlotHolePos();
        const slotFacingUp = !inBallMode || activeSlotPos.y <= activePiggyCenterY + 18;
        const slotHitR = inBallMode ? 38 + s.bellyLevel * 8 : 46 + s.bellyLevel * 10;
        const ballShellR = getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE;
        const bodyRx = inBallMode ? ballShellR * 0.92 : 58 + s.bellyLevel * 28;
        const bodyRy = inBallMode ? ballShellR * 0.92 : 82 + s.bellyLevel * 22;
        const nextProj: Projectile[] = [];

        const handleMissedCoin = (missX: number, missY: number) => {
          if (s.phase !== 'PLAYING' || s.bossAction === 'BREAKING' || s.pumpProgress <= 0) return;
          s.pumpProgress = 0;
          s.pumpHoldTimer = 0;
          s.combo = 0;
          s.bellyGoal = 0.04;
          s.nervousPanicTimer = 0;
          spawnDustPuff(activeSlotPos.x, activeSlotPos.y - 8, s.dir, 4, 150);
          spawnFloater(missX, Math.min(missY - 22, FLOOR_Y - 40), 'MISS! ROW RESET (0/3)', '#DC2626', 18);
          synthRef.current?.playArmorClank();
        };

        for (const p of s.projectiles) {
          p.life -= dt;
          if (p.armorHitCooldown && p.armorHitCooldown > 0) {
            p.armorHitCooldown = Math.max(0, p.armorHitCooldown - dt);
          }
          if (p.life <= 0) {
            if (!p.missedHandled) {
              p.missedHandled = true;
              handleMissedCoin(p.x, p.y);
            }
            spawnCoinExpireFx(p.x, p.y, p.vx, p.vy);
            continue;
          }

          if (!p.trail) p.trail = [];
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();

          p.vy += p.gravity * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;

          // Off-arena horizontal or ceiling vanish
          if (p.x < -80 || p.x > WORLD_W + 80 || p.y < -180) {
            const edgeX = Math.max(10, Math.min(WORLD_W - 10, p.x));
            const edgeY = Math.max(10, p.y);
            if (!p.missedHandled) {
              p.missedHandled = true;
              handleMissedCoin(edgeX, edgeY);
            }
            spawnCoinExpireFx(edgeX, edgeY, p.vx, p.vy);
            continue;
          }

          // Arena floor bounce (up to 2 elastic clinks) or premium settle-dissolve
          if (p.y + p.r * 0.7 >= FLOOR_Y && p.vy > 0) {
            if (!p.missedHandled) {
              p.missedHandled = true;
              handleMissedCoin(p.x, FLOOR_Y - 12);
            }
            const bounces = p.bounces ?? 0;
            if (bounces < 2 && Math.abs(p.vy) > 170) {
              p.y = FLOOR_Y - p.r * 0.7;
              p.vy = -Math.abs(p.vy) * 0.48;
              p.vx *= 0.74;
              p.bounces = bounces + 1;
              p.life = Math.min(p.life, 0.55);
              p.vrot *= -0.65;
              s.landingRings.push({
                x: p.x,
                y: FLOOR_Y + 2,
                rx: 8,
                maxRx: 34,
                life: 0.22,
                maxLife: 0.22,
                color: 'rgba(217, 119, 6, 0.42)',
              });
              spawnDustPuff(p.x, FLOOR_Y - 2, p.vx >= 0 ? 1 : -1, 2, 95);
              spawnCollisionFx(p.x, FLOOR_Y - 4, 0, -1, '#F59E0B', false);
              synthRef.current?.playCoinClink();
            } else {
              spawnCoinExpireFx(p.x, FLOOR_Y - 6, p.vx, p.vy);
              continue;
            }
          }

          if (s.bossAction !== 'BREAKING') {
            // 1. Top-drop into Piggybank's Coin Slot Hole (+1 in the 3-in-a-row streak!)
            const distToSlot = Math.hypot(p.x - activeSlotPos.x, p.y - activeSlotPos.y);
            const slotApproachOk = p.gravity < 300 ? p.vy > -420 : p.vy > 0;
            const effectiveSlotR = slotHitR + (p.power ?? 0) * 10;
            if (slotApproachOk && slotFacingUp && distToSlot < effectiveSlotR) {
              s.droppingCoins.push({
                relX: p.x - activeSlotPos.x,
                relY: Math.min(-10, p.y - activeSlotPos.y),
                r: p.r,
                rot: p.rot,
                life: 0.23,
                maxLife: 0.23,
                dir: s.dir,
              });
              s.slotIntakePulses.push({
                life: 0.36,
                maxLife: 0.36,
                dir: s.dir,
              });
              spawnCollisionFx(activeSlotPos.x, activeSlotPos.y, 0, -1, (p.power ?? 0) >= 0.72 ? '#38BDF8' : '#22C55E', true);
              receiveCoinInSlot(activeSlotPos.x, activeSlotPos.y, 1, true, p.power ?? 0);
              continue;
            }

            // 2. Physical armor / bouncy ball shell ricochet! (does NOT count toward the 3-in-a-row fill)
            const nx = (p.x - s.px) / bodyRx;
            const ny = (p.y - activePiggyCenterY) / bodyRy;
            if ((p.armorHitCooldown ?? 0) <= 0 && nx * nx + ny * ny <= 1) {
              const rawNx = (p.x - s.px) / (bodyRx * bodyRx);
              const rawNy = (p.y - activePiggyCenterY) / (bodyRy * bodyRy);
              const nLen = Math.hypot(rawNx, rawNy) || 1;
              const hitNx = rawNx / nLen;
              const hitNy = rawNy / nLen;
              const dot = p.vx * hitNx + p.vy * hitNy;
              const restitution = inBallMode ? 0.82 : 0.68;
              if (dot < 0) {
                p.vx = (p.vx - (1 + restitution) * dot * hitNx) + s.realVx * 0.35;
                p.vy = p.vy - (1 + restitution) * dot * hitNy;
              } else {
                p.vx = hitNx * 320 + s.realVx * 0.35;
                p.vy = hitNy * 320 - 120;
              }
              if (p.gravity < 300) p.gravity = 1950;
              // Push coin just outside the brass shell so it visibly ricochets cleanly
              p.x = s.px + hitNx * (bodyRx + p.r * 0.65);
              p.y = activePiggyCenterY + hitNy * (bodyRy + p.r * 0.65);
              p.armorHitCooldown = 0.24;
              p.bounces = (p.bounces ?? 0) + 1;
              p.life = Math.min(p.life, 0.58);
              p.vrot = (hitNx >= 0 ? 1 : -1) * 1100;

              spawnCollisionFx(p.x, p.y, hitNx, hitNy, inBallMode ? '#FBBF24' : '#F59E0B', inBallMode);
              if (inBallMode) synthRef.current?.playBallRicochet();
              receiveCoinInSlot(p.x, p.y, 0, false, 0);
              nextProj.push(p);
              continue;
            }
          }

          nextProj.push(p);
        }
        s.projectiles = nextProj;

        // Boss vertical jump or underdamped jet flight physics + touchdown detection
        const prevAltFrame = s.alt;
        if (s.bossAction === 'BOUNCY_BALL') {
          s.onGround = s.py >= -2;
          s.prevAlt = s.alt;
        } else if (s.goalAlt > 0 || s.alt > 0.4 || Math.abs(s.vAlt) > 0.5) {
          for (let i = 0; i < 3; i++) {
            const hh = dt / 3;
            s.vAlt += (28 * (s.goalAlt - s.alt) - 8.5 * s.vAlt) * hh;
            s.alt += s.vAlt * hh;
            if (s.alt < 0) {
              s.alt = 0;
              s.vAlt *= -0.15;
            }
          }
          s.py = -s.alt * PIGGY_SCALE;
          s.onGround = s.alt < 1.5;
          if (prevAltFrame > 14 && s.alt <= 1.5 && s.goalAlt <= 2) {
            spawnLandingFx(s.px, Math.max(0.75, Math.min(1.4, Math.abs(s.vAlt) / 210 + 0.55)));
          }
        } else if (!s.onGround || s.py < 0) {
          const prevVyFall = s.vy;
          s.vy += 2250 * dt;
          s.py += s.vy * dt;
          if (s.py >= 0) {
            s.py = 0;
            s.vy = 0;
            s.onGround = true;
            if (prevVyFall > 180) {
              spawnLandingFx(s.px, Math.min(1.45, prevVyFall / 700));
            }
          }
        }
        s.prevAlt = s.alt;

        s.px = Math.max(MIN_X, Math.min(MAX_X, s.px));
        s.phi += 7.8 * s.walkM * dt;

        // Re-check Piggy-into-Hand collision after piggy moves, then sync DOM cursor sprite cleanly
        moveHandWithCollision(s.cx, s.cy, rawDt, false);
        const boxSync = stageBoxRef.current;
        const wrapSync = cursorWrapRef.current;
        const imgSync = spriteImgRef.current;
        if (boxSync && wrapSync) {
          const rect = boxSync.getBoundingClientRect();
          const pxX = ((s.cx + s.handOffsetX) / WORLD_W) * rect.width;
          const pxY = ((s.cy + s.handHopY + s.handOffsetY) / WORLD_H) * rect.height;
          wrapSync.style.transform = `translate3d(${pxX.toFixed(1)}px, ${pxY.toFixed(1)}px, 0)`;
          wrapSync.style.opacity = '1';
        }
        const flipElSync2 = cursorFlipRef.current;
        if (flipElSync2) {
          flipElSync2.style.transform = `scaleX(${s.facing}) rotate(${(s.handTiltDeg * s.facing).toFixed(1)}deg) scale(${s.handScaleX.toFixed(3)}, ${s.handScaleY.toFixed(3)})`;
          s.lastFacing = s.facing;
        }
        if (imgSync && (s.lastSpriteCol !== col || s.lastSpriteRow !== row)) {
          s.lastSpriteCol = col;
          s.lastSpriteRow = row;
          imgSync.style.transform = `translate3d(${-col * 20}%, ${-row * 50}%, 0)`;
        }

        // Expressive Soulful Trail Emitter (Tapered Silk Ribbons + Helical Ball Wake + Kinetic Motes)
        const moveSpeedTotal = Math.hypot(s.realVx, s.vAlt * PIGGY_SCALE);
        const ballSpeedTotal = s.bossAction === 'BOUNCY_BALL' ? Math.hypot(s.ballVx, s.ballVy) : 0;
        const effectiveSpeed = Math.max(moveSpeedTotal, ballSpeedTotal);
        if (
          s.phase === 'PLAYING' &&
          s.bossAction !== 'BREAKING' &&
          s.bossAction !== 'WALK' &&
          (effectiveSpeed > 75 || s.alt > 12 || s.thrS > 0.2 || s.ballMorph > 0.2)
        ) {
          s.trailSampleAcc += rawDt;
          const isBallSampling = s.ballMorph > 0.25;
          const sampleInterval = isBallSampling ? 0.0085 : 0.012;
          if (s.trailSampleAcc >= sampleInterval) {
            s.trailSampleAcc = 0;
            const curBodyY = FLOOR_Y + s.py - Math.round(195 * PIGGY_UNIT);
            const curBallCenterY = getBallWorldCenterY();
            const backDir = s.realVx >= 0 ? -1 : 1;
            const jetWorldX = s.px + (s.dir > 0 ? -108 : 108) * PIGGY_UNIT;
            const jetWorldY = FLOOR_Y + s.py - Math.round(128 * PIGGY_UNIT);
            const x1Pos = s.px + backDir * 22 * PIGGY_UNIT;
            const y1Pos = curBodyY - Math.round(48 * PIGGY_UNIT);
            const trailLife = isBallSampling ? 0.56 : 0.42;
            s.piggyTrail.push({
              x1: x1Pos,
              y1: y1Pos,
              x2: jetWorldX,
              y2: jetWorldY,
              cx: s.px,
              cy: curBallCenterY,
              life: trailLife,
              maxLife: trailLife,
              speed: effectiveSpeed,
              thr: s.thrS,
              belly: s.bellyLevel,
              ballM: s.ballMorph,
              ballAng: s.ballAngle,
              squash: s.spBallSq.x - s.spBallWall.x,
              nervous: s.nervousLevel,
              vx: isBallSampling ? s.ballVx : s.realVx,
              vy: isBallSampling ? s.ballVy : -s.vAlt * PIGGY_SCALE,
            });
            const maxTrailPts = isBallSampling ? 56 : 44;
            while (s.piggyTrail.length > maxTrailPts) s.piggyTrail.shift();

            // Soulful embers, supple wake motes & diamond gleams drifting off the wake
            if (effectiveSpeed > 180 && Math.random() < (s.ballMorph > 0.3 ? 0.38 : 0.26)) {
              const isBallTrail = s.ballMorph > 0.3;
              const upperSpawn = Math.random() < 0.45;
              const bSpd = isBallTrail ? Math.max(1, Math.hypot(s.ballVx, s.ballVy)) : 1;
              const trailDirX = isBallTrail ? -s.ballVx / bSpd : 0;
              const trailDirY = isBallTrail ? -s.ballVy / bSpd : 0;
              const rimDist = isBallTrail ? getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE * (0.45 + Math.random() * 0.45) : 0;
              const sx = isBallTrail
                ? s.px + trailDirX * rimDist + (Math.random() - 0.5) * 32
                : upperSpawn
                ? x1Pos
                : jetWorldX;
              const sy = isBallTrail
                ? curBallCenterY + trailDirY * rimDist + (Math.random() - 0.5) * 32
                : upperSpawn
                ? y1Pos
                : jetWorldY;
              const isRich = s.bellyLevel > 0.25 && !upperSpawn && s.thrS <= 0.25;
              const isJet = !isBallTrail && !upperSpawn && s.thrS > 0.25;
              const isGleam = isBallTrail && Math.random() < 0.42;
              const maxL = (isBallTrail ? 0.32 : 0.26) + Math.random() * 0.18;
              s.particles.push({
                x: sx,
                y: sy,
                vx: -(isBallTrail ? s.ballVx : s.realVx) * 0.16 + (Math.random() - 0.5) * 58,
                vy: -(isBallTrail ? s.ballVy * 0.12 : 0) + (Math.random() - 0.5) * 40 - (isJet ? 12 : 20),
                r: isGleam ? 4.4 + Math.random() * 2.2 : isRich ? 3.2 : 2.6 + Math.random() * 1.5,
                color:
                  s.nervousLevel > 0.42 && isBallTrail
                    ? 'rgba(248, 113, 113, 0.48)'
                    : isGleam
                    ? 'rgba(254, 240, 138, 0.52)'
                    : isBallTrail
                    ? isRich
                      ? 'rgba(74, 222, 128, 0.36)'
                      : 'rgba(251, 191, 36, 0.36)'
                    : isRich
                    ? 'rgba(34, 197, 94, 0.5)'
                    : isJet
                    ? 'rgba(251, 146, 60, 0.54)'
                    : 'rgba(245, 158, 11, 0.5)',
                life: maxL,
                maxLife: maxL,
                gravity: isRich ? 34 : -22,
                kind: isGleam ? 'gleam' : 'dot',
                rot: Math.random() * 90,
                vrot: (Math.random() - 0.5) * 280,
                drag: 2.8,
              });
            }
          }
        }

        // Balloon spring physics
        const dt60 = Math.min(dt * 60, 2.5);
        s.bellyVel += (0.075 * (s.bellyGoal - s.bellyLevel) - 0.045 * s.bellyVel) * dt60;
        s.bellyLevel += s.bellyVel * dt60;
        if (s.bellyLevel < 0) {
          s.bellyLevel = 0;
          s.bellyVel *= -0.4;
        }
        const a = Math.min(1.35, s.bellyLevel + s.ballMorph * 0.25);
        s.ripplePhase += 0.35 * dt60 * (0.4 + Math.min(1, Math.abs(s.bellyVel) * 18));
        const wob = Math.min(0.14, Math.abs(s.bellyVel) * 2.4);
        const st = Math.max(-0.34, Math.min(0.34, s.bellyVel * 6.5)) * (1 - s.ballMorph * 0.35);
        if (!(s.bossAction === 'BREAKING' && s.breakStage >= 1)) {
          applyBalloon(a, st, wob, s.ballMorph, s.bellyLevel);
        } else {
          applyBalloon(0.28, 0, 0, 0, 0.28);
        }
        poseRig(dt, now);
      }

      // 3. Render Canvas Overlay
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, WORLD_W, WORLD_H);
          ctx.save();
          if (s.shakeTimer > 0) {
            const mag = s.shakeTimer * 24;
            ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
          }

          const piggyCenterY = getBallWorldCenterY();
          const slotPos = getSlotHolePos();

          // Elastic ball bounce echoes (dissolving squash-and-stretch rings)
          for (let i = s.ballAfterimages.length - 1; i >= 0; i--) {
            const bi = s.ballAfterimages[i];
            bi.life -= rawDt;
            if (bi.life <= 0) {
              s.ballAfterimages.splice(i, 1);
              continue;
            }
            const t = bi.life / bi.maxLife;
            ctx.save();
            ctx.translate(bi.x, bi.y);
            ctx.rotate(bi.rot);
            ctx.scale(bi.sx, bi.sy);
            ctx.globalAlpha = t * 0.13;
            const echoGrad = ctx.createRadialGradient(0, 0, bi.r * 0.35, 0, 0, bi.r * 1.12);
            echoGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
            echoGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.25)');
            echoGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
            ctx.fillStyle = echoGrad;
            ctx.beginPath();
            ctx.arc(0, 0, bi.r * (1.02 + (1 - t) * 0.25), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.38)';
            ctx.lineWidth = 2 * t;
            ctx.beginPath();
            ctx.arc(0, 0, bi.r * (0.98 + (1 - t) * 0.18), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Subtle rotating kinetic aura when Piggy is curled in Bouncy Ball state
          if (s.ballMorph > 0.05 && s.bossAction !== 'BREAKING') {
            const ballR = getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE;
            ctx.save();
            ctx.translate(s.px, piggyCenterY);
            ctx.rotate((s.ballAngle * Math.PI) / 180);
            ctx.globalAlpha = 0.16 * s.ballMorph;
            ctx.strokeStyle = s.nervousLevel > 0.4 ? '#EF4444' : '#D97706';
            ctx.lineWidth = 2.6;
            ctx.setLineDash([18, 12]);
            ctx.beginPath();
            ctx.arc(0, 0, ballR + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([8, 16]);
            ctx.strokeStyle = s.nervousLevel > 0.4 ? '#FCA5A5' : '#FEF08A';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(0, 0, ballR + 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Pulsing Crimson Overpressure / Nervous Halo when agitated
          if (s.nervousLevel > 0.14 && s.bossAction !== 'BREAKING') {
            const nv = s.nervousLevel;
            const pulse = 0.5 + 0.5 * Math.sin(now * (0.016 + 0.014 * nv));
            const haloR = (s.ballMorph > 0.3 ? getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE : 102 + s.bellyLevel * 28) + 12 + pulse * 10;
            ctx.save();
            ctx.translate(s.px + (s.bossAction === 'PATTERN_STOP' ? s.nervousJitterX : 0), piggyCenterY);
            ctx.globalAlpha = (0.12 + 0.16 * pulse) * nv;
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 2.2 + nv * 1.4;
            ctx.setLineDash([10, 12]);
            ctx.lineDashOffset = -(now * 0.055);
            ctx.beginPath();
            ctx.arc(0, 0, haloR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Dizzy Effect: 3D Orbiting Stars, Brass Spirals & Temple Squiggles upon Hand Collision
          if (s.dizzyLevel > 0.03 && s.bossAction !== 'BREAKING') {
            const dz = s.dizzyLevel;
            const dizzyX = s.px + (s.bossAction === 'PATTERN_STOP' ? s.nervousJitterX : 0);
            const normalHeadTopY = FLOOR_Y + s.py - Math.round(310 * PIGGY_UNIT);
            const ballTopY = piggyCenterY - getBallSvgRadius(s.bellyLevel) * PIGGY_SCALE - 18;
            const dizzyY = normalHeadTopY * (1 - s.ballMorph) + ballTopY * s.ballMorph;

            ctx.save();
            ctx.translate(dizzyX, dizzyY);
            ctx.rotate(Math.sin(s.dizzyPhase * 0.55) * 0.12);

            // Tilted orbital track ring
            ctx.globalAlpha = 0.42 * dz;
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 2;
            ctx.setLineDash([7, 7]);
            ctx.beginPath();
            ctx.ellipse(0, 0, 48, 14, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Depth-sorted orbiting stars & clockwork spirals
            const orbitItems: { ang: number; depth: number; idx: number }[] = [];
            for (let oi = 0; oi < 5; oi++) {
              const ang = s.dizzyPhase + (oi * Math.PI * 2) / 5;
              orbitItems.push({ ang, depth: Math.sin(ang), idx: oi });
            }
            orbitItems.sort((a, b) => a.depth - b.depth);

            for (const item of orbitItems) {
              const ox = Math.cos(item.ang) * 48;
              const oy = Math.sin(item.ang) * 14;
              const depthScale = 0.72 + 0.36 * ((item.depth + 1) * 0.5);
              const itemAlpha = Math.min(1, dz * (0.62 + 0.38 * ((item.depth + 1) * 0.5)));

              ctx.save();
              ctx.translate(ox, oy);
              ctx.scale(depthScale, depthScale);
              ctx.globalAlpha = itemAlpha;

              if (item.idx % 2 === 0) {
                // Crisp 5-point dizzy star
                ctx.rotate(s.dizzyPhase * 1.4 + item.idx);
                ctx.fillStyle = item.idx === 0 ? '#FEF08A' : '#FBBF24';
                ctx.strokeStyle = '#78350F';
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                for (let pt = 0; pt < 10; pt++) {
                  const r = pt % 2 === 0 ? 10.5 : 4.6;
                  const pa = (pt * Math.PI) / 5 - Math.PI / 2;
                  if (pt === 0) ctx.moveTo(Math.cos(pa) * r, Math.sin(pa) * r);
                  else ctx.lineTo(Math.cos(pa) * r, Math.sin(pa) * r);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
              } else {
                // Spinning brass dizzy spiral
                ctx.rotate(-s.dizzyPhase * 1.8 + item.idx);
                ctx.strokeStyle = '#EA580C';
                ctx.lineWidth = 2.2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                for (let st = 0; st <= 18; st++) {
                  const frac = st / 18;
                  const sr = 1.5 + frac * 7.2;
                  const sa = frac * Math.PI * 3.1;
                  const sx = Math.cos(sa) * sr;
                  const sy = Math.sin(sa) * sr;
                  if (st === 0) ctx.moveTo(sx, sy);
                  else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
                ctx.fillStyle = '#FEF08A';
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }

            // Comical pulsing dizzy temple squiggles on left & right of head
            for (const side of [-1, 1]) {
              ctx.save();
              ctx.translate(side * 58, 34 + Math.sin(s.dizzyPhase * 1.5 + side) * 4);
              ctx.globalAlpha = 0.72 * dz;
              ctx.strokeStyle = '#D97706';
              ctx.lineWidth = 2.2;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(side * -5, -8);
              ctx.quadraticCurveTo(side * 6, -3, side * -3, 2);
              ctx.quadraticCurveTo(side * -9, 7, side * 4, 11);
              ctx.stroke();
              ctx.restore();
            }

            ctx.restore();
          }

          // Floating 3-Coin-Row Streak Pips & Keep-Pumped Gauge above Piggy
          if (s.phase === 'PLAYING' && s.bossAction !== 'BREAKING') {
            const pipY = FLOOR_Y + s.py - Math.round(355 * PIGGY_UNIT) - Math.round(s.dizzyLevel * 22);
            const pipX = s.px + (s.bossAction === 'PATTERN_STOP' ? s.nervousJitterX : 0);
            ctx.save();
            ctx.translate(pipX, pipY);
            for (let pi = 0; pi < s.pumpTarget; pi++) {
              const ox = (pi - (s.pumpTarget - 1) / 2) * 22;
              const filled = pi < s.pumpProgress;
              ctx.beginPath();
              ctx.arc(ox, 0, filled ? 7 : 5.5, 0, Math.PI * 2);
              if (filled) {
                ctx.fillStyle = s.pumpProgress >= 2 ? '#EF4444' : '#22C55E';
                ctx.fill();
                ctx.strokeStyle = '#FFFDF9';
                ctx.lineWidth = 2;
                ctx.stroke();
              } else {
                ctx.fillStyle = 'rgba(255, 253, 249, 0.72)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(120, 53, 15, 0.45)';
                ctx.lineWidth = 1.8;
                ctx.stroke();
              }
            }
            if (s.pumpProgress > 0 && s.pumpHoldMax > 0) {
              const holdFrac = Math.max(0, Math.min(1, s.pumpHoldTimer / s.pumpHoldMax));
              const barW = 54;
              ctx.fillStyle = 'rgba(35, 26, 16, 0.2)';
              ctx.fillRect(-barW / 2, 12, barW, 4);
              ctx.fillStyle = holdFrac < 0.35 ? '#EF4444' : s.pumpProgress >= 2 ? '#F59E0B' : '#22C55E';
              ctx.fillRect(-barW / 2, 12, barW * holdFrac, 4);
            }
            ctx.restore();
          }

          // Learned Pattern Waypoint Markers (shows visited stop spots so players learn & predict!)
          if (s.phase === 'PLAYING' && s.bossAction !== 'BREAKING') {
            const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];
            ctx.save();
            // Connect visited consecutive spots lightly
            if (s.visitedSpots.size > 1) {
              ctx.strokeStyle = 'rgba(180, 83, 9, 0.16)';
              ctx.lineWidth = 2;
              ctx.setLineDash([8, 8]);
              ctx.beginPath();
              let started = false;
              pat.spots.forEach((sp, idx) => {
                if (!s.visitedSpots.has(idx)) return;
                const sy = FLOOR_Y - sp.alt * PIGGY_SCALE - Math.round(190 * PIGGY_UNIT);
                if (!started) {
                  ctx.moveTo(sp.x, sy);
                  started = true;
                } else {
                  ctx.lineTo(sp.x, sy);
                }
              });
              ctx.stroke();
            }

            pat.spots.forEach((sp, idx) => {
              if (!s.visitedSpots.has(idx)) return;
              const spotSlotY = FLOOR_Y - sp.alt * PIGGY_SCALE - Math.round(315 * PIGGY_UNIT);
              const cursorAimedAtSpot = Math.abs(s.cx - sp.x) < 85 && s.cy < spotSlotY + 25;
              const isCurrentSpot = s.bossAction === 'PATTERN_STOP' && s.spotIndex === idx;

              ctx.setLineDash(cursorAimedAtSpot ? [] : [5, 5]);
              ctx.strokeStyle = cursorAimedAtSpot
                ? 'rgba(21, 128, 61, 0.65)'
                : isCurrentSpot
                ? 'rgba(217, 119, 6, 0.55)'
                : 'rgba(180, 83, 9, 0.28)';
              ctx.lineWidth = cursorAimedAtSpot ? 2.5 : 1.75;
              ctx.beginPath();
              ctx.arc(sp.x, spotSlotY, cursorAimedAtSpot ? 28 : 21, 0, Math.PI * 2);
              ctx.stroke();

              // Stop-beat countdown ring while piggy is paused at this spot
              if (isCurrentSpot && s.stopDuration > 0) {
                const frac = Math.max(0, s.bossTimer / s.stopDuration);
                ctx.setLineDash([]);
                ctx.strokeStyle = frac < 0.28 ? 'rgba(220, 38, 38, 0.78)' : 'rgba(217, 119, 6, 0.78)';
                ctx.lineWidth = 3.2;
                ctx.beginPath();
                ctx.arc(sp.x, spotSlotY, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
                ctx.stroke();
              }

              // Small spot number label
              ctx.setLineDash([]);
              ctx.fillStyle = cursorAimedAtSpot ? '#15803D' : 'rgba(120, 53, 15, 0.6)';
              ctx.font = '700 12px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(String(idx + 1), sp.x, spotSlotY);
            });
            ctx.restore();
          }

          // Tap-Activated Growing Laser Beam (starts the moment you tap & gets bigger as you maintain it)
          const laserActive = s.handHoldActive || s.laserFadeTimer > 0;
          if ((s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') && s.bossAction !== 'BREAKING') {
            if (!laserActive) {
              s.slingLocked = false;
              if (Math.abs(slotPos.x - s.cx) > 12) {
                s.facing = slotPos.x >= s.cx ? -1 : 1;
              }
              const flipElIdle = cursorFlipRef.current;
              if (flipElIdle && s.lastFacing !== s.facing) {
                s.lastFacing = s.facing;
                flipElIdle.style.transform = `scaleX(${s.facing}) rotate(${(s.handTiltDeg * s.facing).toFixed(1)}deg) scale(${s.handScaleX.toFixed(3)}, ${s.handScaleY.toFixed(3)})`;
              }
            } else {
              const launch = getSlingLaunchState();
              // Always orient hand left/right with the live laser launch direction (reversed sprite orientation)
              if (Math.abs(launch.vx) > 16) {
                s.facing = launch.vx >= 0 ? -1 : 1;
              } else if (Math.abs(launch.slot.x - s.cx) > 12) {
                s.facing = launch.slot.x >= s.cx ? -1 : 1;
              }
              const flipElSync = cursorFlipRef.current;
              if (flipElSync && s.lastFacing !== s.facing) {
                s.lastFacing = s.facing;
                flipElSync.style.transform = `scaleX(${s.facing}) rotate(${(s.handTiltDeg * s.facing).toFixed(1)}deg) scale(${s.handScaleX.toFixed(3)}, ${s.handScaleY.toFixed(3)})`;
              }

              const fadeMax = s.laserHoldSnapshot > 0.22 ? 0.24 : 0.16;
              const fadeAlpha = s.handHoldActive ? 1 : Math.max(0, Math.min(1, s.laserFadeTimer / fadeMax));
              const growRaw = Math.max(0, Math.min(1, s.handHoldActive ? s.laserGrow : s.laserHoldSnapshot));
              const grow = growRaw * (0.45 + 0.55 * (growRaw * (2 - growRaw)));

              const simPts: { x: number; y: number }[] = [{ x: launch.spawnX, y: launch.spawnY }];
              let lx = launch.spawnX;
              let ly = launch.spawnY;
              const lvx = launch.vx;
              let lvy = launch.vy;
              const isStraightLaser = !launch.profile.curved;
              const stepDt = isStraightLaser ? 0.016 : 0.022;
              const maxSteps = isStraightLaser ? 56 : 44;
              const inBallMode = s.ballMorph > 0.35;
              const slotFacingUp = !inBallMode || slotPos.y <= piggyCenterY + 18;
              const slotR = inBallMode ? 38 + s.bellyLevel * 8 : 46 + s.bellyLevel * 10;
              const bodyRx = inBallMode ? 72 + s.bellyLevel * 24 : 58 + s.bellyLevel * 28;
              const bodyRy = inBallMode ? 72 + s.bellyLevel * 24 : 82 + s.bellyLevel * 22;

              let hitKind: 'none' | 'slot' | 'body' | 'floor' = 'none';
              let impactX = lx;
              let impactY = ly;

              for (let step = 0; step < maxSteps; step++) {
                lvy += launch.gravity * stepDt;
                lx += lvx * stepDt;
                ly += lvy * stepDt;
                simPts.push({ x: lx, y: ly });

                const slotPreviewOk = isStraightLaser ? lvy > -420 : lvy > 0;
                const previewSlotR = slotR + launch.charge * 10;
                const hitLiveSlot = Math.hypot(lx - slotPos.x, ly - slotPos.y) < previewSlotR;
                const hitPredSlot =
                  Math.hypot(launch.interceptX - slotPos.x, launch.interceptY - slotPos.y) > 8 &&
                  Math.hypot(lx - launch.interceptX, ly - launch.interceptY) < previewSlotR;
                if (slotPreviewOk && slotFacingUp && (hitLiveSlot || hitPredSlot)) {
                  hitKind = 'slot';
                  impactX = hitPredSlot && !hitLiveSlot ? launch.interceptX : slotPos.x;
                  impactY = hitPredSlot && !hitLiveSlot ? launch.interceptY : slotPos.y;
                  break;
                }
                const bnx = (lx - s.px) / bodyRx;
                const bny = (ly - piggyCenterY) / bodyRy;
                if (bnx * bnx + bny * bny <= 1) {
                  hitKind = 'body';
                  impactX = lx;
                  impactY = ly;
                  break;
                }
                if (ly >= FLOOR_Y) {
                  hitKind = 'floor';
                  impactX = lx;
                  impactY = FLOOR_Y;
                  break;
                }
                if (lx < 0 || lx > WORLD_W || ly < -140) break;
              }

              s.slingLocked = s.handHoldActive && hitKind === 'slot';

              // Slice trajectory progressively so beam starts short at tap & shoots out to full reach as maintained
              const cumDists: number[] = [0];
              for (let i = 1; i < simPts.length; i++) {
                cumDists.push(
                  cumDists[i - 1] + Math.hypot(simPts[i].x - simPts[i - 1].x, simPts[i].y - simPts[i - 1].y)
                );
              }
              const totalDist = cumDists[cumDists.length - 1];
              const reachEase = Math.min(1, growRaw / 0.34);
              const reachFrac = 0.28 + 0.72 * (1 - Math.pow(1 - reachEase, 2));
              const targetLen =
                totalDist <= 140
                  ? totalDist
                  : Math.min(totalDist, Math.max(140, totalDist * reachFrac));
              const fullReach = targetLen >= totalDist - 6;

              const visiblePts: { x: number; y: number }[] = [simPts[0]];
              if (simPts.length >= 2) {
                for (let i = 1; i < simPts.length; i++) {
                  if (cumDists[i] <= targetLen) {
                    visiblePts.push(simPts[i]);
                  } else {
                    const segLen = Math.max(0.001, cumDists[i] - cumDists[i - 1]);
                    const segT = Math.max(0, Math.min(1, (targetLen - cumDists[i - 1]) / segLen));
                    visiblePts.push({
                      x: simPts[i - 1].x + (simPts[i].x - simPts[i - 1].x) * segT,
                      y: simPts[i - 1].y + (simPts[i].y - simPts[i - 1].y) * segT,
                    });
                    break;
                  }
                }
              }

              ctx.save();
              // Predictive moving-slot ghost marker when leading a moving/bouncing piggy
              const leadOffset = Math.hypot(launch.interceptX - slotPos.x, launch.interceptY - slotPos.y);
              if (leadOffset > 10) {
                ctx.globalAlpha = fadeAlpha * (0.45 + grow * 0.45);
                ctx.strokeStyle = hitKind === 'slot' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(14, 165, 233, 0.5)';
                ctx.lineWidth = 1.6 + grow * 0.8;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(slotPos.x, slotPos.y);
                ctx.lineTo(launch.interceptX, launch.interceptY);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(launch.interceptX, launch.interceptY, 14 + grow * 6, 0, Math.PI * 2);
                ctx.stroke();
              }

              // Soft base slot ring on piggy
              ctx.globalAlpha = fadeAlpha;
              ctx.strokeStyle =
                hitKind === 'slot'
                  ? 'rgba(34, 197, 94, 0.95)'
                  : hitKind === 'body'
                  ? 'rgba(245, 158, 11, 0.72)'
                  : isStraightLaser
                  ? 'rgba(2, 132, 199, 0.38)'
                  : 'rgba(180, 83, 9, 0.28)';
              ctx.lineWidth = (hitKind === 'slot' ? 3.2 : 1.8) + grow * 1.4;
              ctx.setLineDash(hitKind === 'slot' ? [] : [6, 6]);
              ctx.beginPath();
              ctx.arc(slotPos.x, slotPos.y, (hitKind === 'slot' ? 28 : 22) + grow * 10, 0, Math.PI * 2);
              ctx.stroke();

              // Growing Targeting Laser Beam
              if (visiblePts.length >= 2) {
                ctx.setLineDash([]);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                const traceLaser = () => {
                  ctx.beginPath();
                  ctx.moveTo(visiblePts[0].x, visiblePts[0].y);
                  const lastPt = visiblePts[visiblePts.length - 1];
                  if (isStraightLaser) {
                    ctx.lineTo(lastPt.x, lastPt.y);
                  } else {
                    for (let k = 1; k < visiblePts.length - 1; k++) {
                      const mx = (visiblePts[k].x + visiblePts[k + 1].x) * 0.5;
                      const my = (visiblePts[k].y + visiblePts[k + 1].y) * 0.5;
                      ctx.quadraticCurveTo(visiblePts[k].x, visiblePts[k].y, mx, my);
                    }
                    ctx.lineTo(lastPt.x, lastPt.y);
                  }
                };

                const chg = launch.charge;
                const elev = launch.elev;
                const dynEnergy = Math.max(grow, chg, elev * 0.75);
                const chargedBeamColor = elev >= 0.72 ? '#EF4444' : elev >= 0.32 ? '#0EA5E9' : launch.profile.beamColor;
                const chargedCoreColor = elev >= 0.72 ? '#FEF08A' : elev >= 0.32 ? '#E0F2FE' : launch.profile.coreColor;
                const laserColor =
                  hitKind === 'slot' ? '#22C55E' : hitKind === 'body' ? '#F59E0B' : chargedBeamColor;
                const laserCore =
                  hitKind === 'slot' ? '#FEF08A' : hitKind === 'body' ? '#FEF3C7' : chargedCoreColor;

                // Hand Emitter Ignition & Growing Plasma Orb
                const emitterR = (4.5 + grow * 11.5 + s.laserIgniteFlash * 5) * (hitKind === 'slot' ? 1.15 : 1);
                ctx.globalAlpha = (0.34 + grow * 0.36) * fadeAlpha;
                ctx.fillStyle = laserColor;
                ctx.beginPath();
                ctx.arc(launch.spawnX, launch.spawnY, emitterR * 1.45, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = (0.78 + grow * 0.22) * fadeAlpha;
                ctx.fillStyle = laserCore;
                ctx.beginPath();
                ctx.arc(launch.spawnX, launch.spawnY, emitterR * 0.62, 0, Math.PI * 2);
                ctx.fill();

                if (grow > 0.2 && s.handHoldActive) {
                  ctx.save();
                  ctx.translate(launch.spawnX, launch.spawnY);
                  ctx.rotate(now * 0.006);
                  ctx.globalAlpha = Math.min(0.85, (grow - 0.15) * 0.95) * fadeAlpha;
                  ctx.strokeStyle = laserColor;
                  ctx.lineWidth = 1.6 + grow * 1.4;
                  ctx.setLineDash([5, 6]);
                  ctx.beginPath();
                  ctx.arc(0, 0, emitterR * 1.75, 0, Math.PI * 2);
                  ctx.stroke();
                  ctx.restore();
                }

                // Outer laser bloom (starts tight on tap, swells dramatically as hold is maintained)
                traceLaser();
                ctx.globalAlpha = ((hitKind === 'slot' ? 0.26 : 0.18) + grow * 0.26) * fadeAlpha;
                ctx.strokeStyle = laserColor;
                ctx.lineWidth = (isStraightLaser ? 4.5 : 5.2) + grow * 19.5 + (hitKind === 'slot' ? 3.5 : 0);
                ctx.stroke();

                // Crisp beam body (starts razor-thin at tap, thickens into a heavy beam as maintained)
                traceLaser();
                ctx.globalAlpha = (0.78 + grow * 0.22) * fadeAlpha;
                ctx.strokeStyle = laserColor;
                ctx.lineWidth = (isStraightLaser ? 1.8 : 2.1) + grow * 7.8 + (hitKind === 'slot' ? 1.5 : 0);
                if (isStraightLaser || elev >= 0.45 || grow >= 0.32) {
                  ctx.setLineDash([]);
                } else {
                  ctx.setLineDash([12, 8]);
                  ctx.lineDashOffset = -(now * (0.065 + launch.profile.sweepRate * 0.012 + dynEnergy * 0.08));
                }
                ctx.stroke();

                // Luminous inner filament
                traceLaser();
                ctx.globalAlpha = (0.72 + grow * 0.28) * fadeAlpha;
                ctx.strokeStyle = laserCore;
                ctx.lineWidth = 0.9 + grow * 3.4;
                if (isStraightLaser || elev >= 0.45 || grow >= 0.32) {
                  ctx.setLineDash([16, 10]);
                  ctx.lineDashOffset = -(now * (0.14 + dynEnergy * 0.18));
                } else {
                  ctx.setLineDash([6, 14]);
                  ctx.lineDashOffset = -(now * (0.065 + launch.profile.sweepRate * 0.012));
                }
                ctx.stroke();
                ctx.setLineDash([]);

                // Animated traveling laser pulses/beads scaling up with hold
                const beadSpeed = (isStraightLaser ? 0.0036 : 0.0022) * (1 + dynEnergy * 1.25);
                const beadPhase = (now * beadSpeed) % 1;
                for (let bi = 0; bi < 4; bi++) {
                  const frac = (beadPhase + bi * 0.25) % 1;
                  const idx = Math.min(visiblePts.length - 1, Math.floor(frac * (visiblePts.length - 1)));
                  const bp = visiblePts[idx];
                  ctx.globalAlpha = Math.sin(frac * Math.PI) * 0.95 * fadeAlpha;
                  ctx.fillStyle = laserCore;
                  ctx.beginPath();
                  ctx.arc(bp.x, bp.y, 2.0 + grow * 5.4 + (hitKind === 'slot' ? 1.2 : 0), 0, Math.PI * 2);
                  ctx.fill();
                }

                // Subtle Low-to-Top Elevation Track Guide along the aim column while holding
                if (s.handHoldActive) {
                  ctx.save();
                  ctx.globalAlpha = 0.28 + grow * 0.18;
                  ctx.strokeStyle = laserColor;
                  ctx.lineWidth = 1.4 + grow * 0.8;
                  ctx.setLineDash([4, 6]);
                  ctx.beginPath();
                  ctx.moveTo(launch.targetX, FLOOR_Y - 14);
                  ctx.lineTo(launch.targetX, 76);
                  ctx.stroke();
                  ctx.setLineDash([]);

                  ctx.globalAlpha = 0.85;
                  ctx.fillStyle = laserCore;
                  ctx.strokeStyle = laserColor;
                  ctx.lineWidth = 1.8 + grow * 0.8;
                  ctx.beginPath();
                  ctx.arc(launch.targetX, launch.targetY, 4.2 + grow * 3.0, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                }

                // Tip Flare & Impact / Sync Reticle (grows as beam reaches & charges)
                const tipPt = visiblePts[visiblePts.length - 1];
                const retX = fullReach && hitKind !== 'none' ? impactX : tipPt.x;
                const retY = fullReach && hitKind !== 'none' ? impactY : tipPt.y;

                if (fullReach && hitKind === 'slot') {
                  const pulse = 1 + 0.12 * Math.sin(now * 0.02);
                  ctx.globalAlpha = 0.95 * fadeAlpha;
                  ctx.strokeStyle = '#15803D';
                  ctx.lineWidth = 2.6 + grow * 1.6;
                  ctx.beginPath();
                  ctx.arc(retX, retY, (18 + grow * 10) * pulse, 0, Math.PI * 2);
                  ctx.stroke();

                  ctx.fillStyle = '#15803D';
                  ctx.font = '800 13px "JetBrains Mono", monospace';
                  ctx.textAlign = 'center';
                  ctx.fillText(chg >= 0.72 ? 'POWER SYNC!' : 'SYNC!', retX, retY - (48 + grow * 14));
                } else {
                  ctx.globalAlpha = 0.85 * fadeAlpha;
                  ctx.fillStyle = fullReach && hitKind === 'body' ? '#F59E0B' : laserColor;
                  ctx.beginPath();
                  ctx.arc(retX, retY, 3.6 + grow * 8.2, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.strokeStyle = '#FFFBEB';
                  ctx.lineWidth = 1.4 + grow * 0.8;
                  ctx.stroke();

                  if (grow > 0.06) {
                    const lockR = 14 + grow * 22;
                    ctx.save();
                    ctx.translate(retX, retY);
                    ctx.rotate(now * 0.004 * (1 + dynEnergy * 2));
                    ctx.globalAlpha = (0.42 + grow * 0.45) * fadeAlpha;
                    ctx.strokeStyle = laserColor;
                    ctx.lineWidth = 1.6 + grow * 1.6;
                    ctx.setLineDash([8, 6]);
                    ctx.beginPath();
                    ctx.arc(0, 0, lockR, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                  }
                }
              }
              ctx.restore();
            }
          }

          // Dynamic Floor Contact Shadows for Heavy Disassembled Hull Parts
          if (s.bossAction === 'BREAKING') {
            const pFade = s.breakTimer < 0.32 ? Math.max(0, s.breakTimer / 0.32) : 1;
            for (const dp of s.disassemblyParts) {
              if (!dp.detached) continue;
              const hAbove = Math.max(0, FLOOR_Y - dp.r - dp.wy);
              const hf = Math.max(0.22, 1 - hAbove / 540);
              ctx.save();
              ctx.globalAlpha = pFade * (0.14 + 0.16 * Math.min(1.6, dp.mass * 0.65)) * hf;
              ctx.fillStyle = '#231A10';
              ctx.beginPath();
              ctx.ellipse(dp.wx, FLOOR_Y + 4, dp.r * (0.95 + 0.35 * hf), Math.max(3, dp.r * 0.22 * hf), 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }

          // Landing Floor Shockwave Rings
          for (let i = s.landingRings.length - 1; i >= 0; i--) {
            const lr = s.landingRings[i];
            lr.life -= rawDt;
            if (lr.life <= 0) {
              s.landingRings.splice(i, 1);
              continue;
            }
            const t = 1 - lr.life / lr.maxLife;
            const easeOut = 1 - Math.pow(1 - t, 3);
            const rx = lr.rx + (lr.maxRx - lr.rx) * easeOut;
            const ry = rx * 0.23;
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - t);
            ctx.strokeStyle = lr.color;
            ctx.lineWidth = Math.max(1.5, 4.5 * (1 - t));
            ctx.beginPath();
            ctx.ellipse(lr.x, lr.y, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Directional Collision Shockwaves & Premium Expiration Halos
          for (let i = s.impactFlashes.length - 1; i >= 0; i--) {
            const im = s.impactFlashes[i];
            im.life -= rawDt;
            if (im.life <= 0) {
              s.impactFlashes.splice(i, 1);
              continue;
            }
            const t = 1 - im.life / im.maxLife;
            const easeOut = 1 - Math.pow(1 - t, 3);
            const alpha = Math.max(0, 1 - t);
            const radius = im.r + (im.maxR - im.r) * easeOut;

            ctx.save();
            ctx.translate(im.x, im.y);

            // Soft radial glow flash
            ctx.globalAlpha = alpha * 0.32;
            const rg = ctx.createRadialGradient(0, 0, 1, 0, 0, radius);
            rg.addColorStop(0, im.coreColor || '#FFFBEB');
            rg.addColorStop(0.55, im.color);
            rg.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = rg;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();

            // Crisp expanding impact halo ring
            ctx.globalAlpha = alpha * 0.9;
            ctx.strokeStyle = im.color;
            ctx.lineWidth = Math.max(1.2, 3.8 * (1 - t));
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
            ctx.stroke();

            // Directional starburst cross aligned with collision normal
            if (t < 0.72) {
              const starScale = (1 - t / 0.72) * im.maxR * 0.65;
              const ang = Math.atan2(im.ny, im.nx);
              ctx.rotate(ang);
              ctx.globalAlpha = (1 - t / 0.72) * 0.85;
              ctx.strokeStyle = im.coreColor || '#FFFBEB';
              ctx.lineWidth = 2.2;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(-starScale * 0.35, 0);
              ctx.lineTo(starScale, 0);
              ctx.moveTo(0, -starScale * 0.55);
              ctx.lineTo(0, starScale * 0.55);
              ctx.stroke();
            }

            ctx.restore();
          }

          // Tapered Soulful Ribbons (Calligraphic Motion Streams + Supple Helical Bouncy Ball Wake)
          const trailFadeScale = s.bossAction === 'WALK' ? 3.2 : 1;
          for (let i = s.piggyTrail.length - 1; i >= 0; i--) {
            const pt = s.piggyTrail[i];
            pt.life -= rawDt * trailFadeScale;
            if (pt.life <= 0) {
              s.piggyTrail.splice(i, 1);
              continue;
            }
            // Gentle supple slipstream drift on older ball wake samples
            if (pt.ballM > 0.25) {
              const ageFrac = 1 - pt.life / pt.maxLife;
              const driftAmt = ageFrac * rawDt * 26;
              if (pt.vx !== undefined && pt.vy !== undefined) {
                const spd = Math.hypot(pt.vx, pt.vy) || 1;
                pt.cx -= (pt.vx / spd) * driftAmt * 0.45;
                pt.cy -= (pt.vy / spd) * driftAmt * 0.45 + rawDt * 18 * ageFrac;
              } else {
                pt.cy -= rawDt * 16 * ageFrac;
              }
            }
          }
          if (s.piggyTrail.length >= 2) {
            const drawSoulRibbon = (
              pts: { x: number; y: number; fade: number }[],
              baseWidth: number,
              haloColor: string,
              tailColor: string,
              midColor: string,
              headColor: string,
              coreColor: string,
              alphaBoost = 1,
              pulsePhase = 0
            ) => {
              if (pts.length < 2) return;
              const n = pts.length;
              const first = pts[0];
              const last = pts[n - 1];
              const headFade = Math.max(0.15, last.fade) * alphaBoost;

              // Compute smooth unit normals along the path for true tapered supple ribbon polygon
              const leftPts: { x: number; y: number }[] = [];
              const rightPts: { x: number; y: number }[] = [];
              const coreLeft: { x: number; y: number }[] = [];
              const coreRight: { x: number; y: number }[] = [];
              const auraLeft: { x: number; y: number }[] = [];
              const auraRight: { x: number; y: number }[] = [];

              for (let k = 0; k < n; k++) {
                const pPrev = pts[Math.max(0, k - 1)];
                const pNext = pts[Math.min(n - 1, k + 1)];
                let tx = pNext.x - pPrev.x;
                let ty = pNext.y - pPrev.y;
                const tLen = Math.hypot(tx, ty) || 1;
                tx /= tLen;
                ty /= tLen;
                const nx = -ty;
                const ny = tx;

                const t = k / (n - 1);
                const fadeW = Math.min(1, pts[k].fade * 1.15);
                const wave = 1 + 0.16 * Math.sin(t * 9.5 - pulsePhase);
                const headTaper = t > 0.9 ? Math.sin(((1 - t) / 0.1) * (Math.PI * 0.5)) * 0.28 + 0.72 : 1;
                const halfW = baseWidth * 0.5 * Math.pow(t, 0.72) * fadeW * wave * headTaper;
                const coreHalfW = halfW * 0.38;
                const auraHalfW = halfW * 2.05;

                leftPts.push({ x: pts[k].x + nx * halfW, y: pts[k].y + ny * halfW });
                rightPts.push({ x: pts[k].x - nx * halfW, y: pts[k].y - ny * halfW });
                coreLeft.push({ x: pts[k].x + nx * coreHalfW, y: pts[k].y + ny * coreHalfW });
                coreRight.push({ x: pts[k].x - nx * coreHalfW, y: pts[k].y - ny * coreHalfW });
                auraLeft.push({ x: pts[k].x + nx * auraHalfW, y: pts[k].y + ny * auraHalfW });
                auraRight.push({ x: pts[k].x - nx * auraHalfW, y: pts[k].y - ny * auraHalfW });
              }

              // Smooth quadratic-midpoint spline fill so curves bend like silk
              const fillRibbonPoly = (lPts: { x: number; y: number }[], rPts: { x: number; y: number }[]) => {
                ctx.beginPath();
                ctx.moveTo(lPts[0].x, lPts[0].y);
                for (let k = 1; k < lPts.length - 1; k++) {
                  const mx = (lPts[k].x + lPts[k + 1].x) * 0.5;
                  const my = (lPts[k].y + lPts[k + 1].y) * 0.5;
                  ctx.quadraticCurveTo(lPts[k].x, lPts[k].y, mx, my);
                }
                const lLast = lPts[lPts.length - 1];
                const rLast = rPts[rPts.length - 1];
                ctx.lineTo(lLast.x, lLast.y);
                ctx.quadraticCurveTo(
                  (lLast.x + rLast.x) * 0.5 + (last.x - pts[Math.max(0, n - 2)].x) * 0.25,
                  (lLast.y + rLast.y) * 0.5 + (last.y - pts[Math.max(0, n - 2)].y) * 0.25,
                  rLast.x,
                  rLast.y
                );
                for (let k = rPts.length - 2; k >= 1; k--) {
                  const mx = (rPts[k].x + rPts[k - 1].x) * 0.5;
                  const my = (rPts[k].y + rPts[k - 1].y) * 0.5;
                  ctx.quadraticCurveTo(rPts[k].x, rPts[k].y, mx, my);
                }
                ctx.lineTo(rPts[0].x, rPts[0].y);
                ctx.closePath();
                ctx.fill();
              };

              const makeGrad = (cTail: string, cMid: string, cHead: string) => {
                if (Math.hypot(last.x - first.x, last.y - first.y) < 1) return cHead;
                const g = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
                g.addColorStop(0, cTail);
                g.addColorStop(0.42, cMid);
                g.addColorStop(1, cHead);
                return g;
              };

              ctx.save();
              // Layer 1: Soft Atmospheric Halo
              ctx.globalAlpha = 0.18 * headFade;
              ctx.fillStyle = makeGrad(tailColor, haloColor, haloColor);
              fillRibbonPoly(auraLeft, auraRight);

              // Layer 2: Rich Tapered Soul Body
              ctx.globalAlpha = 0.46 * headFade;
              ctx.fillStyle = makeGrad(tailColor, midColor, headColor);
              fillRibbonPoly(leftPts, rightPts);

              // Layer 3: Luminous Inner Energy Filament
              ctx.globalAlpha = 0.58 * headFade;
              ctx.fillStyle = makeGrad(tailColor, midColor, coreColor);
              fillRibbonPoly(coreLeft, coreRight);
              ctx.restore();
            };

            // Partition contiguous segments (skip large teleports/resets)
            const chunks: DualTrailPoint[][] = [];
            let curChunk: DualTrailPoint[] = [s.piggyTrail[0]];
            for (let i = 1; i < s.piggyTrail.length; i++) {
              const p0 = s.piggyTrail[i - 1];
              const p1 = s.piggyTrail[i];
              if (Math.hypot(p1.cx - p0.cx, p1.cy - p0.cy) > 195) {
                if (curChunk.length >= 2) chunks.push(curChunk);
                curChunk = [p1];
              } else {
                curChunk.push(p1);
              }
            }
            if (curChunk.length >= 2) chunks.push(curChunk);

            const pulseT = now * 0.012;
            for (const ch of chunks) {
              const headPt = ch[ch.length - 1];
              const isBallChunk = headPt.ballM > 0.28;

              if (isBallChunk) {
                // Supple Bouncy Ball Wake: Silky undulating comet ribbon + braided spin-whips + elastic slipstream beads
                const chLen = ch.length;
                const centerPts: { x: number; y: number; fade: number }[] = [];
                const helixA: { x: number; y: number; fade: number }[] = [];
                const helixB: { x: number; y: number; fade: number }[] = [];
                const whipC: { x: number; y: number; fade: number }[] = [];

                for (let k = 0; k < chLen; k++) {
                  const p = ch[k];
                  const pPrev = ch[Math.max(0, k - 1)];
                  const pNext = ch[Math.min(chLen - 1, k + 1)];
                  let tx = pNext.cx - pPrev.cx;
                  let ty = pNext.cy - pPrev.cy;
                  const tLen = Math.hypot(tx, ty) || 1;
                  tx /= tLen;
                  ty /= tLen;
                  const nx = -ty;
                  const ny = tx;

                  const frac = k / (chLen - 1);
                  const fade = Math.max(0, p.life / p.maxLife);
                  const tailCurl = Math.pow(1 - frac, 1.35);
                  const suppleWave = Math.sin(frac * 9.5 - pulseT * 1.15) * 10.5 * tailCurl * p.ballM;
                  const cxS = p.cx + nx * suppleWave;
                  const cyS = p.cy + ny * suppleWave;
                  centerPts.push({ x: cxS, y: cyS, fade });

                  const bellEnv = Math.sin(frac * Math.PI * 0.88);
                  const rad = (10 + 28 * bellEnv) * p.ballM;
                  const phase = (p.ballAng * Math.PI) / 180 + (1 - frac) * 2.4;
                  const offA = Math.sin(phase) * rad;
                  const offB = Math.sin(phase + Math.PI * 0.72) * rad * 0.88;
                  const offC = Math.cos(phase * 1.5 - pulseT * 0.5) * (8 + 14 * tailCurl) * p.ballM;

                  helixA.push({ x: cxS + nx * offA, y: cyS + ny * offA, fade });
                  helixB.push({ x: cxS - nx * offB, y: cyS - ny * offB, fade });
                  whipC.push({ x: cxS + nx * offC, y: cyS + ny * offC, fade });
                }

                const elasticSpread = 1 + Math.min(0.45, Math.abs(headPt.squash) * 0.85);
                const ballW = (28 + Math.min(20, headPt.speed * 0.015) + headPt.belly * 10) * elasticSpread;
                const isRich = headPt.belly > 0.32;
                const isNervousBall = headPt.nervous > 0.35;

                drawSoulRibbon(
                  centerPts,
                  ballW,
                  isNervousBall
                    ? 'rgba(239, 68, 68, 0.28)'
                    : isRich
                    ? 'rgba(22, 163, 74, 0.26)'
                    : 'rgba(217, 119, 6, 0.28)',
                  'rgba(245, 158, 11, 0)',
                  isNervousBall
                    ? 'rgba(220, 38, 38, 0.4)'
                    : isRich
                    ? 'rgba(34, 197, 94, 0.38)'
                    : 'rgba(234, 88, 12, 0.38)',
                  isNervousBall
                    ? 'rgba(248, 113, 113, 0.62)'
                    : isRich
                    ? 'rgba(74, 222, 128, 0.58)'
                    : 'rgba(251, 191, 36, 0.62)',
                  isNervousBall ? 'rgba(254, 226, 226, 0.72)' : 'rgba(254, 240, 138, 0.74)',
                  0.44,
                  pulseT
                );

                // Supple braided silk spin-strands
                drawSoulRibbon(
                  helixA,
                  10.5,
                  isNervousBall ? 'rgba(248, 113, 113, 0.26)' : 'rgba(251, 191, 36, 0.26)',
                  'rgba(245, 158, 11, 0)',
                  isNervousBall ? 'rgba(239, 68, 68, 0.4)' : 'rgba(251, 146, 60, 0.4)',
                  isNervousBall ? 'rgba(252, 165, 165, 0.58)' : 'rgba(253, 224, 71, 0.6)',
                  'rgba(255, 251, 235, 0.7)',
                  0.38,
                  pulseT + 1.4
                );
                drawSoulRibbon(
                  helixB,
                  9,
                  isRich ? 'rgba(34, 197, 94, 0.24)' : 'rgba(217, 119, 6, 0.24)',
                  'rgba(245, 158, 11, 0)',
                  isRich ? 'rgba(22, 163, 74, 0.38)' : 'rgba(217, 119, 6, 0.38)',
                  isRich ? 'rgba(74, 222, 128, 0.55)' : 'rgba(245, 158, 11, 0.55)',
                  'rgba(254, 249, 195, 0.65)',
                  0.34,
                  pulseT + 2.9
                );
                drawSoulRibbon(
                  whipC,
                  5.5,
                  'rgba(254, 240, 138, 0.28)',
                  'rgba(254, 240, 138, 0)',
                  isNervousBall ? 'rgba(251, 146, 60, 0.45)' : 'rgba(251, 191, 36, 0.45)',
                  'rgba(254, 249, 195, 0.7)',
                  'rgba(255, 255, 255, 0.82)',
                  0.42,
                  pulseT + 4.3
                );

                // Soft elastic slipstream ghost-pearls trailing in the curved wake
                if (chLen >= 6) {
                  const ballR = getBallSvgRadius(headPt.belly) * PIGGY_SCALE;
                  const step = Math.max(4, Math.floor(chLen / 5));
                  for (let bi = Math.max(1, chLen - 4); bi >= 1; bi -= step) {
                    const cp = centerPts[bi];
                    const pRaw = ch[bi];
                    const frac = bi / (chLen - 1);
                    const pearlR = ballR * (0.16 + 0.46 * frac);
                    const prevCp = centerPts[Math.max(0, bi - 1)];
                    const ang = Math.atan2(cp.y - prevCp.y, cp.x - prevCp.x);
                    const stretch = 1 + Math.min(0.45, pRaw.speed / 1350);

                    ctx.save();
                    ctx.translate(cp.x, cp.y);
                    ctx.rotate(ang);
                    ctx.scale(stretch, 1 / stretch);
                    ctx.globalAlpha = cp.fade * frac * 0.22;
                    const pGrad = ctx.createRadialGradient(0, 0, pearlR * 0.1, 0, 0, pearlR);
                    pGrad.addColorStop(0, isNervousBall ? 'rgba(254, 202, 202, 0.8)' : 'rgba(254, 240, 138, 0.85)');
                    pGrad.addColorStop(
                      0.6,
                      isNervousBall
                        ? 'rgba(239, 68, 68, 0.45)'
                        : isRich
                        ? 'rgba(74, 222, 128, 0.45)'
                        : 'rgba(245, 158, 11, 0.45)'
                    );
                    pGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
                    ctx.fillStyle = pGrad;
                    ctx.beginPath();
                    ctx.arc(0, 0, pearlR, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                  }
                }
              } else {
                const upperPts = ch.map((p) => ({
                  x: p.x1,
                  y: p.y1,
                  fade: Math.max(0, p.life / p.maxLife),
                }));
                const lowerPts = ch.map((p) => ({
                  x: p.x2,
                  y: p.y2,
                  fade: Math.max(0, p.life / p.maxLife),
                }));

                // Trail 1: Upper Tapered Brass-Gold Silk Soul Stream
                drawSoulRibbon(
                  upperPts,
                  14 + Math.min(8, headPt.speed * 0.008),
                  'rgba(217, 119, 6, 0.3)',
                  'rgba(245, 158, 11, 0)',
                  'rgba(217, 119, 6, 0.58)',
                  'rgba(245, 158, 11, 0.82)',
                  'rgba(254, 240, 138, 0.9)',
                  0.9,
                  pulseT
                );

                // Trail 2: Lower Tapered Jetpack Stream (flight) OR Emerald Wealth Stream (loaded)
                const isJet = headPt.thr > 0.25;
                const isRich = headPt.belly > 0.28;
                const isNervousTrail = headPt.nervous > 0.35;
                drawSoulRibbon(
                  lowerPts,
                  (isJet ? 18 : 13) + Math.min(10, headPt.speed * 0.009),
                  isNervousTrail
                    ? 'rgba(239, 68, 68, 0.34)'
                    : isJet
                    ? 'rgba(234, 88, 12, 0.32)'
                    : isRich
                    ? 'rgba(21, 128, 61, 0.28)'
                    : 'rgba(180, 83, 9, 0.26)',
                  isNervousTrail
                    ? 'rgba(239, 68, 68, 0)'
                    : isJet
                    ? 'rgba(249, 115, 22, 0)'
                    : isRich
                    ? 'rgba(34, 197, 94, 0)'
                    : 'rgba(217, 119, 6, 0)',
                  isNervousTrail
                    ? 'rgba(220, 38, 38, 0.65)'
                    : isJet
                    ? 'rgba(234, 88, 12, 0.62)'
                    : isRich
                    ? 'rgba(22, 163, 74, 0.58)'
                    : 'rgba(180, 83, 9, 0.54)',
                  isNervousTrail
                    ? 'rgba(248, 113, 113, 0.9)'
                    : isJet
                    ? 'rgba(251, 146, 60, 0.88)'
                    : isRich
                    ? 'rgba(74, 222, 128, 0.85)'
                    : 'rgba(245, 158, 11, 0.8)',
                  isNervousTrail
                    ? 'rgba(254, 226, 226, 0.94)'
                    : isJet
                    ? 'rgba(255, 251, 235, 0.92)'
                    : isRich
                    ? 'rgba(187, 247, 208, 0.9)'
                    : 'rgba(254, 240, 138, 0.85)',
                  0.95,
                  pulseT + 1.1
                );
              }
            }
          }

          // Dash Afterimages
          for (let i = s.afterimages.length - 1; i >= 0; i--) {
            const ai = s.afterimages[i];
            ai.life -= rawDt;
            if (ai.life <= 0) {
              s.afterimages.splice(i, 1);
              continue;
            }
            ctx.save();
            ctx.globalAlpha = (ai.life / ai.maxLife) * 0.4;
            ctx.fillStyle = '#38BDF8';
            ctx.beginPath();
            ctx.arc(ai.x, ai.y, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Projectiles + Shimmer Fall Arcs + Premium Dissolve Expiration
          const cImg = coinImgRef.current;
          for (const p of s.projectiles) {
            const expireFade = p.life < 0.34 ? Math.max(0, p.life / 0.34) : 1;
            const expireShrink = p.life < 0.34 ? 0.35 + 0.65 * expireFade : 1;

            if (p.trail && p.trail.length >= 2) {
              const pwr = p.power ?? 0;
              ctx.save();
              ctx.globalAlpha = expireFade;
              ctx.lineCap = 'round';
              for (let ti = 1; ti < p.trail.length; ti++) {
                const tf = ti / p.trail.length;
                ctx.strokeStyle =
                  pwr >= 0.72
                    ? `rgba(56, 189, 248, ${(tf * 0.54).toFixed(3)})`
                    : `rgba(245, 158, 11, ${(tf * 0.38).toFixed(3)})`;
                ctx.lineWidth = Math.max(1.8, tf * (9.5 + pwr * 5) * expireShrink);
                ctx.beginPath();
                ctx.moveTo(p.trail[ti - 1].x, p.trail[ti - 1].y);
                ctx.lineTo(p.trail[ti].x, p.trail[ti].y);
                ctx.stroke();
              }
              ctx.restore();
            }

            ctx.save();
            ctx.globalAlpha = expireFade;
            ctx.translate(p.x, p.y);

            // Expanding golden halo ring as coin dissolves at end of flight
            if (expireFade < 1) {
              const haloR = p.r * (1.25 + (1 - expireFade) * 1.45);
              ctx.save();
              ctx.globalAlpha = expireFade * 0.72;
              ctx.strokeStyle = '#FDE68A';
              ctx.lineWidth = 2.4 * expireFade;
              ctx.beginPath();
              ctx.arc(0, 0, haloR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }

            // Warm subtle aura behind active coin (radiant sky-gold for charged power coins)
            const coinAura = ctx.createRadialGradient(0, 0, p.r * 0.2, 0, 0, p.r * (1.65 + (p.power ?? 0) * 0.55));
            coinAura.addColorStop(0, (p.power ?? 0) >= 0.72 ? 'rgba(56, 189, 248, 0.36)' : 'rgba(253, 224, 71, 0.24)');
            coinAura.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = coinAura;
            ctx.beginPath();
            ctx.arc(0, 0, p.r * (1.65 + (p.power ?? 0) * 0.55), 0, Math.PI * 2);
            ctx.fill();

            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.scale(expireShrink, expireShrink);

            if (p.kind === 'thrown_coin') {
              if (cImg && cImg.complete && cImg.naturalWidth > 0) {
                const sz = p.r * 2.25;
                ctx.drawImage(cImg, -sz / 2, -sz / 2, sz, sz);
              } else {
                ctx.fillStyle = '#F59E0B';
                ctx.strokeStyle = '#78350F';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#78350F';
                ctx.font = '800 18px Fraunces, serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 0, 1);
              }
            }
            ctx.restore();
          }

          // Unmistakable Coin Drop-In Funnel & Edge-On Slot Insertion Animation
          for (let i = s.droppingCoins.length - 1; i >= 0; i--) {
            const dc = s.droppingCoins[i];
            dc.life -= rawDt;
            if (dc.life <= 0) {
              s.droppingCoins.splice(i, 1);
              continue;
            }
            const t = 1 - dc.life / dc.maxLife;
            // Phase 1 (0..0.45): glide over slot lip; Phase 2 (0.45..1.0): tilt edge-on & plunge down into slot!
            const alignEase = 1 - Math.pow(1 - Math.min(1, t / 0.5), 2);
            const dropEase = t < 0.35 ? 0 : Math.pow((t - 0.35) / 0.65, 1.45);
            const drawX = slotPos.x + dc.relX * (1 - alignEase);
            const hoverY = slotPos.y + Math.min(-24, dc.relY) * (1 - alignEase) - 18 * (1 - dropEase);
            const drawY = hoverY + dropEase * 38;
            const slotAngleRad = ((dc.dir > 0 ? -30 : 30) * Math.PI) / 180;
            const edgeTilt = 1 - dropEase * 0.68; // 3D coin turns edge-on as it slides into slot slit
            const scaleAmt = 1.08 - dropEase * 0.42;
            const alpha = t < 0.72 ? 1 : Math.max(0, (1 - t) / 0.28);

            // Brief golden guide streak from capture point into the slot mouth
            if (t < 0.65) {
              ctx.save();
              ctx.globalAlpha = (1 - t / 0.65) * 0.55;
              ctx.strokeStyle = '#22C55E';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(drawX, drawY - 22);
              ctx.lineTo(slotPos.x, slotPos.y + 4);
              ctx.stroke();
              ctx.restore();
            }

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(drawX, drawY);
            ctx.rotate(slotAngleRad * alignEase + ((dc.rot * Math.PI) / 180) * (1 - alignEase));
            ctx.scale(scaleAmt * edgeTilt, scaleAmt);
            if (cImg && cImg.complete && cImg.naturalWidth > 0) {
              const sz = dc.r * 2.4;
              ctx.drawImage(cImg, -sz / 2, -sz / 2, sz, sz);
            } else {
              ctx.fillStyle = '#FBBF24';
              ctx.strokeStyle = '#78350F';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(0, 0, dc.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();
          }

          // Slot-Mouth Intake Slit Flash & Expanding Emerald-Gold Confirmation Ring
          for (let i = s.slotIntakePulses.length - 1; i >= 0; i--) {
            const sp = s.slotIntakePulses[i];
            sp.life -= rawDt;
            if (sp.life <= 0) {
              s.slotIntakePulses.splice(i, 1);
              continue;
            }
            const t = 1 - sp.life / sp.maxLife;
            const easeOut = 1 - Math.pow(1 - t, 3);
            const alpha = Math.max(0, 1 - t);

            ctx.save();
            ctx.translate(slotPos.x, slotPos.y);

            // Expanding crisp confirmation ring around the coin slot
            ctx.globalAlpha = alpha * 0.9;
            ctx.strokeStyle = t < 0.35 ? '#FDE047' : '#22C55E';
            ctx.lineWidth = Math.max(2, 6 * (1 - t));
            ctx.beginPath();
            ctx.arc(0, 0, 22 + easeOut * 48, 0, Math.PI * 2);
            ctx.stroke();

            // Glowing angled coin-slot slit flash + vertical intake light beam
            ctx.rotate(((sp.dir > 0 ? -36 : 36) * Math.PI) / 180);
            ctx.globalAlpha = alpha * 0.95;
            ctx.fillStyle = '#4ADE80';
            ctx.beginPath();
            ctx.ellipse(0, 0, 28 + easeOut * 8, Math.max(2, 7 * (1 - t * 0.7)), 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = alpha * 0.85;
            ctx.fillStyle = '#FEF9C3';
            ctx.beginPath();
            ctx.ellipse(0, 0, 19, Math.max(1.2, 3.6 * (1 - t * 0.7)), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Particles (Dust Plumes, Dollar Bills, Bold $ Symbols, Gleams & Sparks)
          for (let i = s.particles.length - 1; i >= 0; i--) {
            const pt = s.particles[i];
            pt.life -= rawDt;
            if (pt.life <= 0) {
              s.particles.splice(i, 1);
              continue;
            }
            if (pt.drag) {
              const damp = Math.max(0, 1 - pt.drag * rawDt);
              pt.vx *= damp;
              pt.vy *= damp;
            }
            pt.vy += pt.gravity * rawDt;
            pt.x += pt.vx * rawDt;
            pt.y += pt.vy * rawDt;
            if (pt.rot !== undefined && pt.vrot !== undefined) pt.rot += pt.vrot * rawDt;

            const lifeFrac = pt.life / pt.maxLife;
            const alpha = Math.min(1, lifeFrac);
            ctx.save();
            ctx.globalAlpha = pt.kind === 'dust' ? alpha * 0.55 : alpha;
            ctx.translate(pt.x, pt.y);
            if (pt.rot) ctx.rotate((pt.rot * Math.PI) / 180);

            if (pt.kind === 'dust') {
              const radius = pt.r * (1 + (1 - lifeFrac) * ((pt.grow ?? 1.4) - 1));
              ctx.fillStyle = pt.color;
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
            } else if (pt.kind === 'gleam') {
              const gr = pt.r * Math.max(0.25, lifeFrac);
              ctx.fillStyle = pt.color;
              ctx.beginPath();
              ctx.moveTo(0, -gr * 1.45);
              ctx.lineTo(gr * 0.45, -gr * 0.45);
              ctx.lineTo(gr * 1.45, 0);
              ctx.lineTo(gr * 0.45, gr * 0.45);
              ctx.lineTo(0, gr * 1.45);
              ctx.lineTo(-gr * 0.45, gr * 0.45);
              ctx.lineTo(-gr * 1.45, 0);
              ctx.lineTo(-gr * 0.45, -gr * 0.45);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = '#FFFBEB';
              ctx.beginPath();
              ctx.arc(0, 0, gr * 0.35, 0, Math.PI * 2);
              ctx.fill();
            } else if (pt.kind === 'bill') {
              const bw = pt.r * 1.9;
              const bh = pt.r * 1.0;
              ctx.fillStyle = '#86EFAC';
              ctx.strokeStyle = '#15803D';
              ctx.lineWidth = 2;
              ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
              ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
              ctx.strokeStyle = '#166534';
              ctx.lineWidth = 1;
              ctx.strokeRect(-bw / 2 + 3, -bh / 2 + 3, bw - 6, bh - 6);
              ctx.fillStyle = '#14532D';
              ctx.font = `800 ${Math.round(pt.r * 0.72)}px "JetBrains Mono", monospace`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('$', 0, 0.5);
            } else if (pt.kind === 'dollar') {
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#ECFDF5';
              ctx.fillStyle = '#15803D';
              ctx.font = `800 ${Math.round(pt.r)}px "JetBrains Mono", monospace`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.strokeText('$', 0, 0);
              ctx.fillText('$', 0, 0);
            } else {
              ctx.fillStyle = pt.color;
              ctx.beginPath();
              ctx.arc(0, 0, pt.r * alpha, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }

          // Seam Fracture Rays during Overpressure Buildup + Expanding Shockwave Rings
          if (s.bossAction === 'BREAKING') {
            const breakElapsed = Math.max(0, s.breakMax - s.breakTimer);
            if (breakElapsed > 0.06 && breakElapsed < 0.45) {
              const rayAlpha =
                breakElapsed < 0.36
                  ? Math.min(0.85, (breakElapsed - 0.06) / 0.22)
                  : Math.max(0, 1 - (breakElapsed - 0.36) / 0.09);
              ctx.save();
              ctx.translate(s.breakPx, piggyCenterY);
              ctx.rotate(breakElapsed * 1.4);
              for (let ri = 0; ri < 8; ri++) {
                const ang = (ri * Math.PI) / 4 + Math.sin(breakElapsed * 12 + ri) * 0.08;
                const len = 95 + breakElapsed * 420 + (ri % 2) * 45;
                ctx.save();
                ctx.rotate(ang);
                const rGrad = ctx.createLinearGradient(0, 0, len, 0);
                rGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha.toFixed(3)})`);
                rGrad.addColorStop(0.45, `rgba(245, 158, 11, ${(rayAlpha * 0.55).toFixed(3)})`);
                rGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
                ctx.fillStyle = rGrad;
                ctx.beginPath();
                ctx.moveTo(0, -4);
                ctx.lineTo(len, -18);
                ctx.lineTo(len, 18);
                ctx.lineTo(0, 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
              }
              ctx.restore();
            }
          }

          for (let i = s.shockwaves.length - 1; i >= 0; i--) {
            const sw = s.shockwaves[i];
            sw.life -= rawDt;
            if (sw.life <= 0) {
              s.shockwaves.splice(i, 1);
              continue;
            }
            const t = 1 - sw.life / sw.maxLife;
            const easeOut = 1 - Math.pow(1 - t, 3);
            const curR = sw.r + (sw.maxR - sw.r) * easeOut;
            const alpha = Math.max(0, 1 - t);
            ctx.save();
            ctx.globalAlpha = alpha * 0.85;
            ctx.strokeStyle = sw.color;
            ctx.lineWidth = Math.max(1.5, sw.lineWidth * (1 - t * 0.78));
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, curR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = alpha * 0.22;
            ctx.fillStyle = sw.color;
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, curR * 0.92, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Precision Machined Mechanical Hardware (Threaded Screws, Hex Bolts, Washers, Spoked Gears, Coiled Springs, Hex Nuts & Heavy Armor Plates)
          for (let i = s.debrisItems.length - 1; i >= 0; i--) {
            const db = s.debrisItems[i];
            db.life -= rawDt;
            if (db.life <= 0) {
              s.debrisItems.splice(i, 1);
              continue;
            }
            const mass = db.mass ?? 1;
            const bounceK = db.bounce ?? 0.42;
            db.vy += (1560 + mass * 340) * rawDt;
            db.x += db.vx * rawDt;
            db.y += db.vy * rawDt;
            db.rot += db.vrot * rawDt;

            if (db.x < MIN_X + 12) {
              db.x = MIN_X + 12;
              db.vx = Math.abs(db.vx) * 0.65;
            } else if (db.x > MAX_X - 12) {
              db.x = MAX_X - 12;
              db.vx = -Math.abs(db.vx) * 0.65;
            }

            if (db.y >= FLOOR_Y - db.r * 0.65) {
              db.y = FLOOR_Y - db.r * 0.65;
              const spd = Math.abs(db.vy);
              if (spd > 85) {
                db.vy = -spd * bounceK;
                db.vx *= mass >= 1.4 ? 0.64 : 0.74;
                db.vrot *= mass >= 1.4 ? 0.48 : 0.65;
                db.bounces += 1;
                if (db.bounces === 1 && spd > 210 && Math.random() < 0.28) {
                  synthRef.current?.playHardwareClink(db.kind === 'screw' || db.kind === 'washer' ? 1.15 : 0.85);
                }
              } else {
                db.vy = 0;
                db.vx *= Math.max(0, 1 - rawDt * (6 + mass * 2));
                db.vrot *= Math.max(0, 1 - rawDt * (8 + mass * 2));
              }
            }

            const dAlpha = db.life < 0.35 ? Math.max(0, db.life / 0.35) : 1;

            // Ground shadow beneath airborne/resting hardware
            const hAbove = Math.max(0, FLOOR_Y - db.r * 0.65 - db.y);
            if (hAbove < 280) {
              const sFrac = 1 - hAbove / 280;
              ctx.save();
              ctx.globalAlpha = dAlpha * 0.22 * sFrac;
              ctx.fillStyle = '#231A10';
              ctx.beginPath();
              ctx.ellipse(db.x, FLOOR_Y + 3, db.r * (0.65 + 0.35 * sFrac), Math.max(1.8, db.r * 0.18 * sFrac), 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }

            ctx.save();
            ctx.globalAlpha = dAlpha;
            ctx.translate(db.x, db.y);
            ctx.rotate((db.rot * Math.PI) / 180);
            ctx.strokeStyle = '#23160A';
            ctx.lineWidth = 1.6;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            if (db.kind === 'screw') {
              // Machined Brass/Steel Threaded Screw with Bevel Head, Collar & Helical Threads
              const shLen = db.r * 1.45;
              const shW = db.r * 0.38;
              const headR = db.r * 0.68;
              const shGrad = ctx.createLinearGradient(-shW, 0, shW, 0);
              shGrad.addColorStop(0, '#64748B');
              shGrad.addColorStop(0.35, '#F1F5F9');
              shGrad.addColorStop(0.7, '#94A3B8');
              shGrad.addColorStop(1, '#334155');
              ctx.fillStyle = shGrad;
              ctx.beginPath();
              ctx.moveTo(-shW, -shLen * 0.25);
              ctx.lineTo(shW, -shLen * 0.25);
              ctx.lineTo(shW * 0.72, shLen * 0.72);
              ctx.lineTo(0, shLen * 0.96);
              ctx.lineTo(-shW * 0.72, shLen * 0.72);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Helical screw threads
              ctx.strokeStyle = '#1E293B';
              ctx.lineWidth = 1.3;
              for (let ti = 0; ti < 4; ti++) {
                const ty = -shLen * 0.04 + ti * (shLen * 0.2);
                const tw = shW * (1 - ti * 0.08);
                ctx.beginPath();
                ctx.moveTo(-tw - 1, ty - 1.5);
                ctx.lineTo(tw + 1, ty + 1.8);
                ctx.stroke();
              }

              // Beveled brass flange collar + domed screw head with slot
              ctx.strokeStyle = '#23160A';
              ctx.lineWidth = 1.5;
              ctx.fillStyle = '#D97706';
              ctx.beginPath();
              ctx.roundRect(-headR * 1.05, -shLen * 0.42, headR * 2.1, shLen * 0.22, 2);
              ctx.fill();
              ctx.stroke();

              const hdGrad = ctx.createLinearGradient(-headR, -shLen * 0.85, headR, -shLen * 0.35);
              hdGrad.addColorStop(0, '#FEF08A');
              hdGrad.addColorStop(0.45, '#F59E0B');
              hdGrad.addColorStop(1, '#92400E');
              ctx.fillStyle = hdGrad;
              ctx.beginPath();
              ctx.arc(0, -shLen * 0.42, headR, Math.PI, 0);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Center slot notch
              ctx.fillStyle = '#23160A';
              ctx.fillRect(-headR * 0.16, -shLen * 0.42 - headR, headR * 0.32, headR * 0.45);
            } else if (db.kind === 'bolt') {
              // Heavy Hex-Head Structural Bolt with Thread Ridges & Chamfered Top
              const hw = db.r * 0.78;
              const hh = db.r * 0.46;
              const shW = db.r * 0.4;
              const shL = db.r * 1.15;
              ctx.fillStyle = '#94A3B8';
              ctx.fillRect(-shW, 0, shW * 2, shL);
              ctx.strokeRect(-shW, 0, shW * 2, shL);
              ctx.strokeStyle = '#334155';
              ctx.lineWidth = 1.4;
              for (let ti = 0; ti < 3; ti++) {
                const ty = shL * (0.28 + ti * 0.24);
                ctx.beginPath();
                ctx.moveTo(-shW - 1, ty - 1);
                ctx.lineTo(shW + 1, ty + 1.5);
                ctx.stroke();
              }
              ctx.strokeStyle = '#23160A';
              ctx.lineWidth = 1.6;
              const boltGrad = ctx.createLinearGradient(-hw, -hh, hw, 0);
              boltGrad.addColorStop(0, '#FDE68A');
              boltGrad.addColorStop(0.4, '#D97706');
              boltGrad.addColorStop(1, '#78350F');
              ctx.fillStyle = boltGrad;
              ctx.beginPath();
              ctx.roundRect(-hw, -hh, hw * 2, hh + 2, 2);
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(-hw * 0.36, -hh);
              ctx.lineTo(-hw * 0.36, 2);
              ctx.moveTo(hw * 0.36, -hh);
              ctx.lineTo(hw * 0.36, 2);
              ctx.stroke();
            } else if (db.kind === 'washer') {
              // Beveled Metallic Split-Lock Washer
              const wGrad = ctx.createLinearGradient(-db.r, -db.r, db.r, db.r);
              wGrad.addColorStop(0, '#FEF3C7');
              wGrad.addColorStop(0.45, '#CBD5E1');
              wGrad.addColorStop(1, '#475569');
              ctx.fillStyle = wGrad;
              ctx.beginPath();
              ctx.arc(0, 0, db.r * 0.86, 0.22, Math.PI * 2 - 0.14);
              ctx.arc(0, 0, db.r * 0.44, Math.PI * 2 - 0.14, 0.22, true);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            } else if (db.kind === 'gear') {
              // Precision Spoked Brass/Bronze Cogwheel
              const teeth = 10;
              const rOut = db.r * 1.12;
              const rIn = db.r * 0.82;
              const gGrad = ctx.createLinearGradient(-rOut, -rOut, rOut, rOut);
              gGrad.addColorStop(0, '#FDE68A');
              gGrad.addColorStop(0.45, db.color);
              gGrad.addColorStop(1, '#5B3410');
              ctx.fillStyle = gGrad;
              ctx.beginPath();
              for (let ti = 0; ti < teeth * 2; ti++) {
                const a0 = (ti * Math.PI) / teeth;
                const a1 = ((ti + 0.56) * Math.PI) / teeth;
                const rad = ti % 2 === 0 ? rOut : rIn;
                if (ti === 0) ctx.moveTo(Math.cos(a0) * rad, Math.sin(a0) * rad);
                else ctx.lineTo(Math.cos(a0) * rad, Math.sin(a0) * rad);
                ctx.lineTo(Math.cos(a1) * rad, Math.sin(a1) * rad);
              }
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Recessed spoked cutout ring
              ctx.fillStyle = '#3B2511';
              ctx.beginPath();
              ctx.arc(0, 0, db.r * 0.54, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              ctx.strokeStyle = '#D97706';
              ctx.lineWidth = Math.max(1.8, db.r * 0.16);
              for (let sp = 0; sp < 4; sp++) {
                const sa = (sp * Math.PI) / 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(sa) * db.r * 0.52, Math.sin(sa) * db.r * 0.52);
                ctx.lineTo(-Math.cos(sa) * db.r * 0.52, -Math.sin(sa) * db.r * 0.52);
                ctx.stroke();
              }
              ctx.fillStyle = '#FCD34D';
              ctx.strokeStyle = '#23160A';
              ctx.lineWidth = 1.4;
              ctx.beginPath();
              ctx.arc(0, 0, db.r * 0.25, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            } else if (db.kind === 'spring') {
              // Heavy 3D Coiled Tempered Steel Tension Spring
              const w = db.r * 1.45;
              const h = db.r * 0.55;
              ctx.strokeStyle = '#1E293B';
              ctx.lineWidth = 3.8;
              ctx.beginPath();
              for (let si = -3; si <= 3; si++) {
                const sx = (si / 3) * w;
                const sy = si % 2 === 0 ? -h : h;
                if (si === -3) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
              ctx.stroke();
              ctx.strokeStyle = '#CBD5E1';
              ctx.lineWidth = 1.8;
              ctx.stroke();
            } else if (db.kind === 'nut') {
              // Chamfered Heavy Hex Nut with Threaded Inner Bore
              const nGrad = ctx.createLinearGradient(-db.r, -db.r, db.r, db.r);
              nGrad.addColorStop(0, '#FEF08A');
              nGrad.addColorStop(0.5, '#F59E0B');
              nGrad.addColorStop(1, '#78350F');
              ctx.fillStyle = nGrad;
              ctx.beginPath();
              for (let hi = 0; hi < 6; hi++) {
                const a = (hi * Math.PI) / 3;
                const px = Math.cos(a) * db.r * 0.96;
                const py = Math.sin(a) * db.r * 0.96;
                if (hi === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.strokeStyle = '#78350F';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.arc(0, 0, db.r * 0.62, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = '#1F150B';
              ctx.beginPath();
              ctx.arc(0, 0, db.r * 0.36, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Heavy Cast-Brass Riveted Armor Plate Shard
              const pw = db.r * 1.28;
              const ph = db.r * 0.82;
              const pGrad = ctx.createLinearGradient(-pw, -ph, pw, ph);
              pGrad.addColorStop(0, '#E3BD7E');
              pGrad.addColorStop(0.45, '#9A723A');
              pGrad.addColorStop(1, '#432D15');
              ctx.fillStyle = pGrad;
              ctx.beginPath();
              ctx.moveTo(-pw * 0.88, -ph);
              ctx.lineTo(pw * 0.72, -ph * 0.85);
              ctx.lineTo(pw, ph * 0.62);
              ctx.lineTo(-pw * 0.65, ph);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.strokeStyle = '#FEF3C7';
              ctx.lineWidth = 1.1;
              ctx.globalAlpha *= 0.5;
              ctx.beginPath();
              ctx.moveTo(-pw * 0.72, -ph * 0.8);
              ctx.lineTo(pw * 0.58, -ph * 0.68);
              ctx.stroke();
              ctx.globalAlpha = dAlpha;
              ctx.fillStyle = '#FDE68A';
              ctx.strokeStyle = '#23160A';
              ctx.lineWidth = 1;
              for (const [rx, ry] of [
                [-pw * 0.45, -ph * 0.4],
                [pw * 0.42, ph * 0.25],
              ]) {
                ctx.beginPath();
                ctx.arc(rx, ry, db.r * 0.16, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
              }
            }
            ctx.restore();
          }

          // Floating Money-Hurt Text
          for (let i = s.floaters.length - 1; i >= 0; i--) {
            const fl = s.floaters[i];
            fl.life -= rawDt;
            if (fl.life <= 0) {
              s.floaters.splice(i, 1);
              continue;
            }
            fl.y += fl.vy * rawDt;
            ctx.save();
            ctx.globalAlpha = Math.min(1, (fl.life / fl.maxLife) * 1.4);
            ctx.fillStyle = fl.color;
            ctx.font = `700 ${fl.size}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(fl.text, fl.x, fl.y);
            ctx.restore();
          }

          // Glowing Hand-to-Piggy Collider Contact Arc & Armor Ripple
          if (s.handShieldFlash > 0.02 && (s.phase === 'PLAYING' || s.phase === 'TITLE_MENU')) {
            const flashFrac = Math.min(1, s.handShieldFlash / 0.28);
            const contactAng = Math.atan2(s.handContactNy, s.handContactNx);
            const shieldCol = s.ballMorph > 0.35 ? '#38BDF8' : s.nervousLevel > 0.4 ? '#EF4444' : '#F59E0B';
            ctx.save();
            ctx.translate(s.handContactX, s.handContactY);
            ctx.globalAlpha = flashFrac * 0.85;
            ctx.strokeStyle = shieldCol;
            ctx.lineWidth = 4.5 * flashFrac;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, 0, 26 + (1 - flashFrac) * 18, contactAng - 0.95, contactAng + 0.95);
            ctx.stroke();
            ctx.strokeStyle = '#FEF9C3';
            ctx.lineWidth = 2 * flashFrac;
            ctx.beginPath();
            ctx.arc(0, 0, 18 + (1 - flashFrac) * 12, contactAng - 0.72, contactAng + 0.72);
            ctx.stroke();
            ctx.restore();
          }

          // Hand-Orbit Revolver Cylinder, Charge Power Meter & Reload Threshold Circle
          if (s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') {
            ctx.save();
            ctx.translate(s.cx + s.handOffsetX, s.cy + s.handHopY + s.handOffsetY);

            if (s.handShieldFlash > 0.02) {
              const hf = Math.min(1, s.handShieldFlash / 0.28);
              const inwardAng = Math.atan2(-s.handContactNy, -s.handContactNx);
              ctx.save();
              ctx.globalAlpha = hf * 0.88;
              ctx.strokeStyle = s.ballMorph > 0.35 ? '#38BDF8' : '#F59E0B';
              ctx.lineWidth = 4;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(0, 0, 32, inwardAng - 0.85, inwardAng + 0.85);
              ctx.stroke();
              ctx.restore();
            }

            const thresholdR = 62;
            const orbitChamberR = 46;
            const topAng = -Math.PI / 2;
            const reloadFrac = s.isReloading ? Math.min(1, s.reloadTimer / s.reloadDuration) : 1;
            const chamberRatio = s.revolverChambers / s.revolverMax;

            // Outer Charge Power Meter / Extended Glide Ring
            if (s.handCharge > 0.02 || s.handGlideTimer > 0) {
              const meterR = 74;
              const isCharging = s.handCharge > 0.02;
              const meterFrac = isCharging ? s.handCharge : Math.min(1, s.handGlideTimer / 0.55);
              const meterColor = isCharging
                ? s.handCharge >= 0.78
                  ? '#EF4444'
                  : s.handCharge >= 0.35
                  ? '#F59E0B'
                  : '#0EA5E9'
                : '#38BDF8';

              ctx.strokeStyle = 'rgba(35, 26, 16, 0.14)';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.arc(0, 0, meterR, 0, Math.PI * 2);
              ctx.stroke();

              ctx.strokeStyle = meterColor;
              ctx.lineWidth = 5.5;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(0, 0, meterR, topAng, topAng + Math.PI * 2 * meterFrac);
              ctx.stroke();

              ctx.fillStyle = meterColor;
              ctx.font = '800 11px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(
                isCharging
                  ? s.handCharge >= 0.96
                    ? 'MAX POWER'
                    : `CHARGE ${Math.round(s.handCharge * 100)}%`
                  : 'GLIDE',
                0,
                -meterR - 8
              );
            }

            // 1. Subtle backing ring around the hand's orbit
            ctx.strokeStyle =
              s.dryClickFlash > 0
                ? 'rgba(220, 38, 38, 0.58)'
                : s.reloadCompleteFlash > 0
                ? 'rgba(34, 197, 94, 0.65)'
                : 'rgba(35, 26, 16, 0.18)';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.arc(0, 0, thresholdR, 0, Math.PI * 2);
            ctx.stroke();

            // 2. Threshold Progress Arc (ammo remaining OR sweeping reload gate arc)
            if (s.isReloading) {
              // Dashed base track for remaining sweep to threshold
              ctx.save();
              ctx.setLineDash([4, 5]);
              ctx.strokeStyle = 'rgba(180, 83, 9, 0.28)';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.arc(0, 0, thresholdR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();

              // Active sweeping reload progress toward the 12-o'clock threshold
              ctx.strokeStyle = reloadFrac > 0.78 ? '#22C55E' : '#F59E0B';
              ctx.lineWidth = 5.5;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(0, 0, thresholdR, topAng, topAng + Math.PI * 2 * reloadFrac);
              ctx.stroke();

              // Glowing orbiting bead at the reload sweep tip
              const tipAng = topAng + Math.PI * 2 * reloadFrac;
              const tipX = Math.cos(tipAng) * thresholdR;
              const tipY = Math.sin(tipAng) * thresholdR;
              ctx.fillStyle = reloadFrac > 0.78 ? '#4ADE80' : '#FDE047';
              ctx.beginPath();
              ctx.arc(tipX, tipY, 5.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#78350F';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            } else if (s.revolverChambers > 0) {
              ctx.strokeStyle =
                s.reloadCompleteFlash > 0
                  ? '#22C55E'
                  : s.revolverChambers <= 2
                  ? 'rgba(234, 88, 12, 0.85)'
                  : 'rgba(217, 119, 6, 0.78)';
              ctx.lineWidth = 4;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(0, 0, thresholdR, topAng, topAng + Math.PI * 2 * chamberRatio);
              ctx.stroke();
            }

            // 3. Threshold Gate Marker at 12 o'clock (where reload locks & chambers reset)
            const gateColor = s.isReloading
              ? reloadFrac > 0.85
                ? '#22C55E'
                : '#B45309'
              : s.reloadCompleteFlash > 0
              ? '#16A34A'
              : '#78350F';
            ctx.fillStyle = gateColor;
            ctx.beginPath();
            ctx.moveTo(0, -thresholdR - 8);
            ctx.lineTo(-5.5, -thresholdR - 15);
            ctx.lineTo(5.5, -thresholdR - 15);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#FFFDF9';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -thresholdR - 6);
            ctx.lineTo(0, -thresholdR + 6);
            ctx.stroke();

            // 4. Inner Rotating 6-Chamber Revolver Cylinder Orbit
            ctx.strokeStyle = 'rgba(120, 53, 15, 0.16)';
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            ctx.arc(0, 0, orbitChamberR, 0, Math.PI * 2);
            ctx.stroke();

            const filledWhileReloading = s.isReloading ? Math.floor(reloadFrac * s.revolverMax) : s.revolverChambers;
            for (let ci = 0; ci < s.revolverMax; ci++) {
              const cAng = topAng + s.cylinderAngle + (ci * Math.PI * 2) / s.revolverMax;
              const px = Math.cos(cAng) * orbitChamberR;
              const py = Math.sin(cAng) * orbitChamberR;
              const isLoaded = ci < filledWhileReloading;

              ctx.save();
              ctx.translate(px, py);
              if (isLoaded) {
                // Loaded brass coin chamber
                ctx.fillStyle = s.reloadCompleteFlash > 0 ? '#4ADE80' : '#FBBF24';
                ctx.strokeStyle = '#78350F';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 6.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#FEF9C3';
                ctx.beginPath();
                ctx.arc(-1.8, -1.8, 1.9, 0, Math.PI * 2);
                ctx.fill();
              } else {
                // Spent hollow revolver bore
                ctx.fillStyle = 'rgba(35, 26, 16, 0.14)';
                ctx.strokeStyle = s.dryClickFlash > 0 ? 'rgba(220, 38, 38, 0.6)' : 'rgba(120, 53, 15, 0.38)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, 5.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
              }
              ctx.restore();
            }

            // 5. Crisp Reloading / Low-Ammo Orbit Cue
            if (s.isReloading) {
              ctx.fillStyle = '#92400E';
              ctx.font = '800 11px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillText(`RELOAD ${Math.round(reloadFrac * 100)}%`, 0, thresholdR + 9);
            } else if (s.revolverChambers <= 2 && s.phase === 'PLAYING') {
              ctx.fillStyle = '#B45309';
              ctx.font = '700 10px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillText(`${s.revolverChambers}/6 · [R]`, 0, thresholdR + 9);
            }

            ctx.restore();
          }

          // Subtle Cinematic Letterbox Framing during Piggy Disassembly Finisher
          if (s.bossAction === 'BREAKING') {
            const breakElapsed = Math.max(0, s.breakMax - s.breakTimer);
            const barIn = Math.min(1, breakElapsed / 0.22);
            const barOut = s.breakTimer < 0.35 ? Math.max(0, s.breakTimer / 0.35) : 1;
            const barH = 38 * barIn * barOut;
            if (barH > 0.5) {
              ctx.save();
              ctx.fillStyle = 'rgba(28, 19, 10, 0.88)';
              ctx.fillRect(0, 0, WORLD_W, barH);
              ctx.fillRect(0, WORLD_H - barH, WORLD_W, barH);
              ctx.fillStyle = 'rgba(245, 158, 11, 0.65)';
              ctx.fillRect(0, barH - 2, WORLD_W, 2);
              ctx.fillRect(0, WORLD_H - barH, WORLD_W, 2);
              ctx.restore();
            }
          }

          ctx.restore();
        }
      }

      // 4. Throttled HUD Sync
      hudTimer += rawDt;
      if (hudTimer >= 0.06) {
        hudTimer = 0;
        const pct = Math.round(Math.min(1, s.pumpProgress / s.pumpTarget) * 100);
        const pumpHoldPct =
          s.pumpProgress > 0 && s.pumpHoldMax > 0
            ? Math.round(Math.min(1, Math.max(0, s.pumpHoldTimer / s.pumpHoldMax)) * 100)
            : 0;
        const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];
        const nervousPct = Math.round(Math.min(1, Math.max(0, s.nervousLevel)) * 100);
        const isNervous = s.bossAction !== 'BREAKING' && s.nervousLevel >= 0.28;
        const isDizzy = s.bossAction !== 'BREAKING' && s.dizzyLevel >= 0.25;
        const baseActionLabel =
          s.bossAction === 'BREAKING'
            ? 'DISASSEMBLING!'
            : s.bossAction === 'BOUNCY_BALL'
            ? isNervous
              ? `${pat.name} · Panic Bounce!`
              : `${pat.name} · Bouncy Ball!`
            : isNervous && s.bossAction === 'PATTERN_STOP'
            ? `${pat.name} · Nervous Jitter (${s.spotIndex + 1}/${pat.spots.length})`
            : isNervous
            ? `${pat.name} · Volatile Dash!`
            : s.bossAction === 'WALK'
            ? s.playerIdleTimer >= 2.0 && s.pumpProgress === 0
              ? `${pat.name} · Idle Walk`
              : `${pat.name} · Walking`
            : s.bossAction === 'PATTERN_STOP'
            ? `${pat.name} · Stopped (${s.spotIndex + 1}/${pat.spots.length})`
            : s.bossAction === 'JET_FLIGHT'
            ? `${pat.name} · Jetting`
            : s.pumpProgress >= 2
            ? `${pat.name} · 1 More Coin to Break!`
            : `${pat.name} · Moving`;
        const actionLabel = isDizzy ? `${baseActionLabel} · Dizzy!` : baseActionLabel;

        const handChargePct = Math.round(Math.min(1, Math.max(0, s.handCharge)) * 100);
        const laserElevPct = Math.round(Math.min(1, Math.max(0, s.laserElev)) * 100);
        const handStateLabel = s.handHoldActive
          ? `AIM ${laserElevPct}%`
          : s.handGlideTimer > 0
          ? 'GLIDING'
          : s.handHopY < -4
          ? 'HOP'
          : '';

        setHud((prev) => ({
          ...prev,
          score: s.score,
          bestScore: s.bestScore,
          round: s.round,
          patternName: pat.name,
          spotIndex: s.spotIndex,
          spotTotal: pat.spots.length,
          pumpProgress: Number(s.pumpProgress.toFixed(0)),
          pumpTarget: s.pumpTarget,
          pumpHoldPct,
          bellyPct: pct,
          bossActionLabel: actionLabel,
          dashReadyPct: Math.round((1 - s.dashCooldown / s.dashMaxCooldown) * 100),
          revolverChambers: s.revolverChambers,
          revolverMax: s.revolverMax,
          isReloading: s.isReloading,
          reloadPct: s.isReloading ? Math.round((s.reloadTimer / s.reloadDuration) * 100) : 100,
          combo: s.combo,
          slotDrops: s.slotDrops,
          piggiesBroken: s.piggiesBroken,
          laserStyle: s.laserStyle,
          laserLabel: LASER_PROFILES[s.laserStyle].shortLabel,
          laserCurved: LASER_PROFILES[s.laserStyle].curved,
          laserModeSetting: s.laserModeSetting,
          nervousPct,
          isNervous,
          handChargePct,
          handStateLabel,
        }));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyLaserStyle, setupRound, storageKey]);

  const togglePause = () => {
    const s = simRef.current;
    if (s.phase === 'PLAYING') {
      s.phase = 'PAUSED';
      setPhase('PAUSED');
    } else if (s.phase === 'PAUSED') {
      s.phase = 'PLAYING';
      setPhase('PLAYING');
    }
  };

  const spriteH = Math.max(60, Math.round(stageDims.h * 0.14));
  const spriteW = Math.round(spriteH * spriteCellRatio);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={`piggy-plugin-root relative overflow-hidden bg-[#F6F2EA] text-[#231A10] flex flex-col outline-none ${!textureOn ? 'lite-mode' : ''} ${className}`}
    >
      <style>{PLUGIN_SCOPED_CSS}</style>
      {/* TOP FIGHT HUD */}
      <header className="relative z-30 h-14 shrink-0 px-4 md:px-6 border-b border-[#231A10]/10 bg-[#FFFDF9]/92 backdrop-blur-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-5 shrink-0">
          <div className="flex items-center gap-2" aria-label={`Pattern ${hud.patternName}, spot ${hud.spotIndex + 1} of ${hud.spotTotal}`}>
            <div className="flex items-center gap-1">
              {Array.from({ length: hud.spotTotal }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === hud.spotIndex ? 'bg-[#B45309]' : 'bg-[#231A10]/18'
                  }`}
                />
              ))}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-[#473827] whitespace-nowrap">
              {hud.patternName}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-medium text-[#6B5A46]">Dash</span>
            <div className="w-12 h-2 rounded-full bg-[#E8E0D2] overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${hud.dashReadyPct >= 100 ? 'bg-[#0284C7]' : 'bg-[#94A3B8]'}`}
                style={{ width: `${hud.dashReadyPct}%` }}
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5" title="Revolver coin chambers (Press R to reload)">
            <div className="flex items-center gap-1">
              {Array.from({ length: hud.revolverMax }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full border transition-colors ${
                    hud.isReloading
                      ? i < Math.floor((hud.reloadPct / 100) * hud.revolverMax)
                        ? 'bg-[#22C55E] border-[#15803D]'
                        : 'bg-transparent border-[#B45309]/40'
                      : i < hud.revolverChambers
                      ? 'bg-[#F59E0B] border-[#78350F]'
                      : 'bg-transparent border-[#231A10]/25'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono-tabular text-[11px] font-semibold text-[#5A4A38]">
              {hud.isReloading ? `${hud.reloadPct}%` : `${hud.revolverChambers}/${hud.revolverMax}`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-medium text-[#6B5A46]">Money</span>
            <span className="font-mono-tabular text-base md:text-lg font-bold text-[#15803D]">${hud.score.toLocaleString()}</span>
          </div>
        </div>

        {/* Center 3-Coins-in-a-Row & Keep-Pumped Pressure Meter */}
        <div className="flex-1 max-w-lg flex items-center gap-3">
          <div className="flex-1 min-w-[160px]">
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="font-semibold text-[#231A10]">3 in a Row · Round {hud.round}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" aria-label={`${hud.pumpProgress} of ${hud.pumpTarget} coins in a row`}>
                  {Array.from({ length: hud.pumpTarget }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        i < hud.pumpProgress
                          ? hud.pumpProgress >= 2
                            ? 'bg-[#DC2626] border-[#991B1B] scale-110'
                            : 'bg-[#22C55E] border-[#15803D]'
                          : 'bg-[#E8E0D2] border-[#231A10]/20'
                      }`}
                    />
                  ))}
                </div>
                <span className={`font-mono-tabular font-semibold ${hud.pumpProgress >= 2 ? 'text-[#DC2626]' : 'text-[#5A4A38]'}`}>
                  {hud.pumpProgress}/{hud.pumpTarget} {hud.pumpProgress >= 2 ? '1 MORE TO POP!' : ''}
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[#E8E0D2] overflow-hidden border border-[#231A10]/10" title="Keep the piggy pumped before pressure vents">
              <div
                className={`h-full transition-all duration-100 ${
                  hud.pumpProgress >= 2
                    ? hud.pumpHoldPct < 35
                      ? 'bg-[#DC2626]'
                      : 'bg-[#F59E0B]'
                    : hud.pumpProgress >= 1
                    ? 'bg-[#22C55E]'
                    : 'bg-[#B45309]'
                }`}
                style={{ width: `${hud.pumpProgress > 0 ? hud.pumpHoldPct : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={cycleLaserMode}
            title="Cycle targeting laser style [Q] (Auto Variety / Straight Beams / Curved Slings)"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !hud.laserCurved
                ? 'bg-[#0284C7]/10 text-[#0369A1] border-[#0284C7]/35 hover:bg-[#0284C7]/20'
                : 'bg-[#B45309]/10 text-[#92400E] border-[#B45309]/30 hover:bg-[#B45309]/20'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: LASER_PROFILES[hud.laserStyle].beamColor }}
            />
            <span>{laserMode === 'AUTO' ? `Mix: ${hud.laserLabel}` : hud.laserLabel}</span>
            <span className="hidden md:inline text-[10px] opacity-70">[Q]</span>
          </button>

          <button
            type="button"
            onClick={() => setTextureOn((v) => !v)}
            title="Toggle brushed metal texture filters"
            className={`hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              textureOn
                ? 'bg-[#231A10] text-[#FFFDF9] border-[#231A10]'
                : 'bg-white text-[#5A4A38] border-[#231A10]/15 hover:bg-[#EFE9DD]'
            }`}
          >
            Texture
          </button>

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#231A10]/15 bg-white text-[#3D2E1E] hover:bg-[#EFE9DD] transition-colors cursor-pointer"
          >
            {muted ? <IconVolumeX className="w-4 h-4" /> : <IconVolume2 className="w-4 h-4" />}
          </button>

          {(phase === 'PLAYING' || phase === 'PAUSED') && (
            <button
              type="button"
              onClick={togglePause}
              aria-label={phase === 'PAUSED' ? 'Resume' : 'Pause'}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#231A10]/15 bg-white text-[#3D2E1E] hover:bg-[#EFE9DD] transition-colors cursor-pointer"
            >
              {phase === 'PAUSED' ? <IconPlay className="w-4 h-4" /> : <IconPause className="w-4 h-4" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close game"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#231A10]/15 bg-white text-[#3D2E1E] hover:bg-[#EFE9DD] transition-colors cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* MAIN ARENA */}
      <main
        ref={arenaRef}
        className={`relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden ${
          phase === 'PLAYING' ? 'cursor-none' : ''
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(60, 42, 20, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(60, 42, 20, 0.045) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div ref={stageBoxRef} className="relative shrink-0" style={{ width: `${stageDims.w}px`, height: `${stageDims.h}px` }}>
          {/* Layer 1: Piggybank Vector Rig */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
            className="w-full h-full block select-none pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="metal-patina" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves="4" seed="14" result="noise" />
                <feColorMatrix
                  type="matrix"
                  values="
                    0.35 0    0    0 0.25
                    0    0.28 0    0 0.18
                    0    0    0.18 0 0.08
                    0    0    0    0.16 0"
                  in="noise"
                  result="tintedNoise"
                />
                <feComposite operator="in" in="tintedNoise" in2="SourceGraphic" result="clippedNoise" />
                <feBlend mode="multiply" in="SourceGraphic" in2="clippedNoise" />
              </filter>

              <filter id="copper-texture" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="5" seed="42" result="rawNoise" />
                <feColorMatrix
                  type="matrix"
                  values="
                    0.40 0    0    0 0.15
                    0    0.30 0    0 0.10
                    0    0    0.16 0 0.04
                    0    0    0    0.24 0"
                  in="rawNoise"
                  result="copperNoise"
                />
                <feComposite operator="in" in="copperNoise" in2="SourceGraphic" result="maskedNoise" />
                <feBlend mode="multiply" in="SourceGraphic" in2="maskedNoise" />
              </filter>

              <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                <feOffset dx="3" dy="7" result="offsetBlur" />
                <feComponentTransfer in="offsetBlur" result="shadowAlpha">
                  <feFuncA type="linear" slope="0.45" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="shadowAlpha" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="tail-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" />
                <feOffset dx="-6" dy="8" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.52" />
                </feComponentTransfer>
              </filter>

              <filter id="nervous-red-shader" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  id="nervous-color-matrix"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                />
                <feDropShadow
                  id="nervous-red-glow"
                  dx="0"
                  dy="0"
                  stdDeviation="10"
                  floodColor="#EF4444"
                  floodOpacity="0"
                />
              </filter>

              <linearGradient id="brass-body-main" x1="12%" y1="35%" x2="88%" y2="55%">
                <stop offset="0%" stopColor="#76603f" />
                <stop offset="17%" stopColor="#7b6441" />
                <stop offset="33%" stopColor="#836b45" />
                <stop offset="50%" stopColor="#876f47" />
                <stop offset="67%" stopColor="#7f6842" />
                <stop offset="83%" stopColor="#775f3e" />
                <stop offset="100%" stopColor="#6f5938" />
              </linearGradient>

              <linearGradient id="brass-body-vertical" x1="40%" y1="0%" x2="55%" y2="100%">
                <stop offset="0%" stopColor="#6a5533" stopOpacity="0.45" />
                <stop offset="22%" stopColor="#7a633e" stopOpacity="0.06" />
                <stop offset="65%" stopColor="#846a3f" stopOpacity="0.05" />
                <stop offset="92%" stopColor="#4d3d24" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#322716" stopOpacity="0.65" />
              </linearGradient>

              <linearGradient id="collar-brass" x1="15%" y1="20%" x2="85%" y2="80%">
                <stop offset="0%" stopColor="#6f5936" />
                <stop offset="35%" stopColor="#765e39" />
                <stop offset="62%" stopColor="#735c37" />
                <stop offset="100%" stopColor="#6c5633" />
              </linearGradient>

              <linearGradient id="copper-belly-grad" x1="15%" y1="25%" x2="85%" y2="75%">
                <stop offset="0%" stopColor="#46341f" />
                <stop offset="20%" stopColor="#58402a" />
                <stop offset="40%" stopColor="#684a2e" />
                <stop offset="60%" stopColor="#5e442a" />
                <stop offset="80%" stopColor="#4d3822" />
                <stop offset="100%" stopColor="#3d2c1a" />
              </linearGradient>

              <linearGradient id="bottom-rim-grad" x1="10%" y1="30%" x2="90%" y2="70%">
                <stop offset="0%" stopColor="#46341f" />
                <stop offset="25%" stopColor="#745636" />
                <stop offset="50%" stopColor="#8a6640" />
                <stop offset="75%" stopColor="#68492f" />
                <stop offset="100%" stopColor="#3b2a19" />
              </linearGradient>

              <linearGradient id="pelvis-under-grad" x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#30241a" />
                <stop offset="33%" stopColor="#483425" />
                <stop offset="67%" stopColor="#583f2a" />
                <stop offset="100%" stopColor="#2c2017" />
              </linearGradient>

              <linearGradient id="arm-left-cyl" x1="25%" y1="15%" x2="78%" y2="85%">
                <stop offset="0%" stopColor="#493424" />
                <stop offset="25%" stopColor="#7d5b3d" />
                <stop offset="50%" stopColor="#8d6746" />
                <stop offset="75%" stopColor="#654733" />
                <stop offset="100%" stopColor="#38281b" />
              </linearGradient>

              <linearGradient id="arm-right-cyl" x1="35%" y1="5%" x2="65%" y2="95%">
                <stop offset="0%" stopColor="#4f3828" />
                <stop offset="25%" stopColor="#826041" />
                <stop offset="50%" stopColor="#926c4a" />
                <stop offset="75%" stopColor="#684a35" />
                <stop offset="100%" stopColor="#3b2b1d" />
              </linearGradient>

              <radialGradient id="fist-cap-grad" cx="38%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#76826f" />
                <stop offset="33%" stopColor="#58655b" />
                <stop offset="67%" stopColor="#3b463f" />
                <stop offset="100%" stopColor="#232b26" />
              </radialGradient>

              <linearGradient id="slot-bevel-outer" x1="0%" y1="15%" x2="100%" y2="85%">
                <stop offset="0%" stopColor="#566052" />
                <stop offset="25%" stopColor="#7a846f" />
                <stop offset="50%" stopColor="#434c41" />
                <stop offset="75%" stopColor="#2f362e" />
                <stop offset="100%" stopColor="#66705e" />
              </linearGradient>

              <linearGradient id="slot-inner-wall" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a2a21" />
                <stop offset="50%" stopColor="#454a3b" />
                <stop offset="100%" stopColor="#68705b" />
              </linearGradient>

              <linearGradient id="slot-void-grad" x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#090705" />
                <stop offset="45%" stopColor="#14100c" />
                <stop offset="85%" stopColor="#2c2418" />
                <stop offset="100%" stopColor="#0b0907" />
              </linearGradient>

              <linearGradient id="tail-steel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9aa593" />
                <stop offset="33%" stopColor="#707d6f" />
                <stop offset="67%" stopColor="#4b574f" />
                <stop offset="100%" stopColor="#2c342f" />
              </linearGradient>

              <linearGradient id="leg-bronze-grad" x1="10%" y1="20%" x2="90%" y2="80%">
                <stop offset="0%" stopColor="#3c2e20" />
                <stop offset="25%" stopColor="#55432f" />
                <stop offset="50%" stopColor="#665038" />
                <stop offset="75%" stopColor="#463726" />
                <stop offset="100%" stopColor="#291f15" />
              </linearGradient>

              <linearGradient id="fl-outer" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#e8a24a" stopOpacity=".95" />
                <stop offset=".45" stopColor="#d9722c" stopOpacity=".85" />
                <stop offset="1" stopColor="#b8402a" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="fl-mid" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f7dc7a" stopOpacity="1" />
                <stop offset=".5" stopColor="#f0a53c" stopOpacity=".9" />
                <stop offset="1" stopColor="#e0702b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="fl-core" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fffbe9" stopOpacity="1" />
                <stop offset=".6" stopColor="#ffe9a6" stopOpacity=".85" />
                <stop offset="1" stopColor="#f7dc7a" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="fl-glow">
                <stop offset="0" stopColor="#ffb347" stopOpacity=".55" />
                <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="kn-head" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#f3dca4" />
                <stop offset="45%" stopColor="#c79a58" />
                <stop offset="100%" stopColor="#6a4824" />
              </radialGradient>
              <radialGradient id="kn-ring" cx="40%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#9a7646" />
                <stop offset="60%" stopColor="#5f4527" />
                <stop offset="100%" stopColor="#2e2010" />
              </radialGradient>
              <radialGradient id="rivet-grad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#8e703f" />
                <stop offset="50%" stopColor="#715b36" />
                <stop offset="100%" stopColor="#46371f" />
              </radialGradient>

              <linearGradient id="ts-cyl" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#4a3219" />
                <stop offset="0.18" stopColor="#9a6f3d" />
                <stop offset="0.38" stopColor="#f1d79a" />
                <stop offset="0.55" stopColor="#c9964f" />
                <stop offset="0.82" stopColor="#7a5229" />
                <stop offset="1" stopColor="#35230f" />
              </linearGradient>
              <radialGradient id="ts-top" cx="0.38" cy="0.32" r="0.8">
                <stop offset="0" stopColor="#fbe9bb" />
                <stop offset="0.45" stopColor="#d4a45e" />
                <stop offset="1" stopColor="#8a5f30" />
              </radialGradient>
              <radialGradient id="ts-flange" cx="0.4" cy="0.3" r="0.85">
                <stop offset="0" stopColor="#a9814f" />
                <stop offset="0.6" stopColor="#6b4b2a" />
                <stop offset="1" stopColor="#3a2813" />
              </radialGradient>
              <linearGradient id="ts-nutL" x1="0" x2="1">
                <stop offset="0" stopColor="#3b2813" />
                <stop offset="1" stopColor="#7c5731" />
              </linearGradient>
              <linearGradient id="ts-nutM" x1="0" x2="1">
                <stop offset="0" stopColor="#b98a52" />
                <stop offset="0.5" stopColor="#e3bd7e" />
                <stop offset="1" stopColor="#a47840" />
              </linearGradient>
              <linearGradient id="ts-nutR" x1="0" x2="1">
                <stop offset="0" stopColor="#8a6335" />
                <stop offset="1" stopColor="#3f2b15" />
              </linearGradient>

              <g id="tat-chest" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="385" cy="478" r="25" />
                <circle cx="385" cy="478" r="20" strokeDasharray="2 3.2" />
                <path d="M 385 444 L 391 472 L 419 478 L 391 484 L 385 512 L 379 484 L 351 478 L 379 472 Z" />
                <path d="M 391.4 484.4 L 404.1 497.1" />
                <path d="M 378.6 484.4 L 365.9 497.1" />
                <path d="M 378.6 471.6 L 365.9 458.9" />
                <path d="M 391.4 471.6 L 404.1 458.9" />
                <circle cx="385" cy="478" r="2.6" />
                <path d="M 385 435 l 0 -7 M 382 431 l 6 0" />
                <path d="M 362.8 566.0 L 366.9 567.9 L 366.3 570.6 L 361.8 570.6 L 360.7 572.3 L 362.9 576.3 L 360.8 578.1 L 357.2 575.5 L 355.3 576.3 L 354.8 580.7 L 352.0 581.0 L 350.6 576.7 L 348.7 576.3 L 345.6 579.6 L 343.2 578.1 L 344.6 573.9 L 343.3 572.3 L 338.9 573.2 L 337.7 570.6 L 341.4 568.0 L 341.2 566.0 L 337.1 564.1 L 337.7 561.4 L 342.2 561.4 L 343.3 559.7 L 341.1 555.7 L 343.2 553.9 L 346.8 556.5 L 348.7 555.7 L 349.2 551.3 L 352.0 551.0 L 353.4 555.3 L 355.3 555.7 L 358.4 552.4 L 360.8 553.9 L 359.4 558.1 L 360.7 559.7 L 365.1 558.8 L 366.3 561.4 L 362.6 564.0 Z M 357.2 566.0 A 5.2 5.2 0 1 1 346.8 566.0 A 5.2 5.2 0 1 1 357.2 566.0 Z" />
                <path d="M 396.2 592.0 L 398.9 593.6 L 398.2 595.8 L 395.1 595.8 L 394.1 597.1 L 394.9 600.1 L 392.8 601.2 L 390.7 599.0 L 389.0 599.2 L 387.4 601.9 L 385.2 601.2 L 385.2 598.1 L 383.9 597.1 L 380.9 597.9 L 379.8 595.8 L 382.0 593.7 L 381.8 592.0 L 379.1 590.4 L 379.8 588.2 L 382.9 588.2 L 383.9 586.9 L 383.1 583.9 L 385.2 582.8 L 387.3 585.0 L 389.0 584.8 L 390.6 582.1 L 392.8 582.8 L 392.8 585.9 L 394.1 586.9 L 397.1 586.1 L 398.2 588.2 L 396.0 590.3 Z M 392.5 592.0 A 3.5 3.5 0 1 1 385.5 592.0 A 3.5 3.5 0 1 1 392.5 592.0 Z" />
                <path d="M 338.0 534.0 L 339.9 535.2 L 339.3 537.0 L 337.1 537.0 L 336.1 537.9 L 336.3 540.2 L 334.6 540.8 L 333.2 539.0 L 331.9 538.9 L 330.2 540.4 L 328.6 539.5 L 329.2 537.3 L 328.5 536.2 L 326.3 535.9 L 326.0 534.0 L 328.0 533.1 L 328.5 531.8 L 327.3 529.9 L 328.6 528.5 L 330.6 529.6 L 331.9 529.1 L 332.7 527.0 L 334.6 527.2 L 335.0 529.4 L 336.1 530.1 L 338.3 529.4 L 339.3 531.0 L 337.9 532.7 Z M 335.1 534.0 A 2.1 2.1 0 1 1 330.9 534.0 A 2.1 2.1 0 1 1 335.1 534.0 Z" />
                <path d="M 413.9 540.6 L 413.8 541.3 L 413.5 542.1 L 412.8 542.7 L 411.8 543.1 L 410.8 543.1 L 409.6 542.8 L 408.6 542.0 L 407.9 540.8 L 407.6 539.4 L 407.7 537.9 L 408.5 536.4 L 409.7 535.2 L 411.3 534.5 L 413.2 534.3 L 415.1 534.7 L 416.9 535.9 L 418.2 537.6 L 418.9 539.7 L 418.9 542.0 L 418.1 544.3 L 416.6 546.3 L 414.4 547.7 L 411.7 548.3 L 408.9 548.0 L 406.3 546.8 L 404.2 544.8 L 402.8 542.0 L 402.4 538.9 L 403.0 535.7 L 404.7 532.9 L 407.2 530.6 L 410.5 529.3 L 414.1 529.1 L 417.6 530.1 L 420.7 532.3 L 423.0 535.5 L 424.2 539.3 L 424.0 543.3 L 422.5 547.2 L 419.8 550.4" />
                <path d="M 330 600 C 340 628, 368 636, 392 628 C 410 622, 420 608, 412 598 C 405 590, 392 596, 397 606" />
                <path d="M 428 566 C 436 580, 434 596, 424 604" />
                <path d="M 430 514 Q 430 520 436 520 Q 430 520 430 526 Q 430 520 424 520 Q 430 520 430 514 Z" />
                <path d="M 318 490 Q 318 495 323 495 Q 318 495 318 500 Q 318 495 313 495 Q 318 495 318 490 Z" />
                <circle cx="440" cy="590" r="1.2" />
                <circle cx="446" cy="580" r="1" />
                <circle cx="342" cy="620" r="1.2" />
                <circle cx="326" cy="568" r="1" />
                <path d="M 668 342 A 20 20 0 1 0 672 381.6 A 15 15 0 1 1 668 342 Z" />
                <path d="M 691.0 341.0 L 692.6 345.7 L 697.7 345.8 L 693.7 348.9 L 695.1 353.7 L 691.0 350.8 L 686.9 353.7 L 688.3 348.9 L 684.3 345.8 L 689.4 345.7 Z" />
                <path d="M 688.0 379.5 L 689.1 382.5 L 692.3 382.6 L 689.7 384.6 L 690.6 387.6 L 688.0 385.8 L 685.4 387.6 L 686.3 384.6 L 683.7 382.6 L 686.9 382.5 Z" />
                <path d="M 702 361 Q 702 366 707 366 Q 702 366 702 371 Q 702 366 697 366 Q 702 366 702 361 Z" />
                <circle cx="660" cy="332" r="1.2" />
                <circle cx="689" cy="330" r="1" />
                <g transform="translate(724 410) rotate(24)">
                  <circle cx="0" cy="-16" r="7" />
                  <circle cx="0" cy="-16" r="3" />
                  <path d="M 0 -9 L 0 22 M 0 14 L 7 14 M 0 20 L 5 20" />
                </g>
                <g transform="translate(36 -14)">
                  <path d="M 699.1 487.2 L 699.4 487.6 L 699.9 487.9 L 700.4 488.0 L 701.1 488.0 L 701.7 487.7 L 702.3 487.3 L 702.7 486.6 L 703.0 485.8 L 703.0 484.9 L 702.7 484.0 L 702.2 483.2 L 701.4 482.5 L 700.4 482.1 L 699.2 481.9 L 698.0 482.2 L 696.9 482.7 L 696.0 483.6 L 695.3 484.8 L 694.9 486.2 L 695.0 487.6 L 695.5 489.1 L 696.4 490.3 L 697.7 491.3 L 699.2 492.0 L 701.0 492.1 L 702.7 491.8 L 704.3 490.9 L 705.7 489.6 L 706.7 487.9 L 707.1 486.0 L 707.0 484.0 L 706.3 482.0 L 705.1 480.2 L 703.4 478.9 L 701.3 478.0 L 699.0 477.8 L 696.7 478.3 L 694.5 479.3 L 692.7 481.0 L 691.4 483.2" />
                </g>
                <circle cx="656" cy="410" r="1.1" />
                <circle cx="662" cy="476" r="1.2" />
              </g>

              <g id="tat-belly" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="598" cy="702" r="22" />
                <circle cx="598" cy="702" r="17.5" strokeDasharray="1.6 2.6" />
                <path d="M 603 693 C 590 690, 589 700, 598 702 C 607 704, 606 714, 593 711 M 598 687 L 598 717" />
                <g>
                  <path d="M 574 702 C 556 704, 540 698, 540 686 C 540 676, 552 674, 556 681 C 559 687, 552 691, 548 687" />
                  <path d="M 576 712 C 560 724, 540 724, 530 712 C 522 702, 510 702, 506 710" />
                  <path d="M 497.3 716.7 L 497.2 717.2 L 496.9 717.6 L 496.5 717.9 L 496.0 718.1 L 495.4 718.2 L 494.7 718.1 L 494.1 717.8 L 493.5 717.4 L 493.1 716.7 L 492.9 715.9 L 492.9 715.0 L 493.1 714.2 L 493.6 713.3 L 494.3 712.6 L 495.2 712.1 L 496.2 711.9 L 497.4 712.0 L 498.5 712.3 L 499.5 713.0 L 500.3 714.0 L 500.8 715.1 L 501.1 716.5 L 500.9 717.8 L 500.4 719.2 L 499.5 720.3 L 498.3 721.2 L 496.8 721.8 L 495.3 722.0 L 493.6 721.7 L 492.1 721.0 L 490.8 719.9 L 489.8 718.5 L 489.2 716.8 L 489.1 714.9 L 489.4 713.1 L 490.3 711.3 L 491.7 709.9 L 493.4 708.8 L 495.4 708.2 L 497.5 708.1" />
                </g>
                <g transform="translate(1196 0) scale(-1 1)">
                  <path d="M 574 702 C 556 704, 540 698, 540 686 C 540 676, 552 674, 556 681 C 559 687, 552 691, 548 687" />
                  <path d="M 576 712 C 560 724, 540 724, 530 712 C 522 702, 510 702, 506 710" />
                  <path d="M 497.3 716.7 L 497.2 717.2 L 496.9 717.6 L 496.5 717.9 L 496.0 718.1 L 495.4 718.2 L 494.7 718.1 L 494.1 717.8 L 493.5 717.4 L 493.1 716.7 L 492.9 715.9 L 492.9 715.0 L 493.1 714.2 L 493.6 713.3 L 494.3 712.6 L 495.2 712.1 L 496.2 711.9 L 497.4 712.0 L 498.5 712.3 L 499.5 713.0 L 500.3 714.0 L 500.8 715.1 L 501.1 716.5 L 500.9 717.8 L 500.4 719.2 L 499.5 720.3 L 498.3 721.2 L 496.8 721.8 L 495.3 722.0 L 493.6 721.7 L 492.1 721.0 L 490.8 719.9 L 489.8 718.5 L 489.2 716.8 L 489.1 714.9 L 489.4 713.1 L 490.3 711.3 L 491.7 709.9 L 493.4 708.8 L 495.4 708.2 L 497.5 708.1" />
                </g>
                <path d="M 598.0 656.0 L 599.9 661.4 L 605.6 661.5 L 601.0 665.0 L 602.7 670.5 L 598.0 667.2 L 593.3 670.5 L 595.0 665.0 L 590.4 661.5 L 596.1 661.4 Z" />
                <path d="M 558 667 Q 558 672 563 672 Q 558 672 558 677 Q 558 672 553 672 Q 558 672 558 667 Z" />
                <path d="M 638 667 Q 638 672 643 672 Q 638 672 638 677 Q 638 672 633 672 Q 638 672 638 667 Z" />
                <path d="M 550 738 q 8 -9 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" />
                <circle cx="558" cy="752" r="1.2" />
                <circle cx="578" cy="752" r="1.2" />
                <circle cx="598" cy="752" r="1.2" />
                <circle cx="618" cy="752" r="1.2" />
                <circle cx="638" cy="752" r="1.2" />
                <path d="M 495.2 676.0 L 497.9 677.6 L 497.2 679.8 L 494.1 679.8 L 493.1 681.1 L 493.9 684.1 L 491.8 685.2 L 489.7 683.0 L 488.0 683.2 L 486.4 685.9 L 484.2 685.2 L 484.2 682.1 L 482.9 681.1 L 479.9 681.9 L 478.8 679.8 L 481.0 677.7 L 480.8 676.0 L 478.1 674.4 L 478.8 672.2 L 481.9 672.2 L 482.9 670.9 L 482.1 667.9 L 484.2 666.8 L 486.3 669.0 L 488.0 668.8 L 489.6 666.1 L 491.8 666.8 L 491.8 669.9 L 493.1 670.9 L 496.1 670.1 L 497.2 672.2 L 495.0 674.3 Z M 491.5 676.0 A 3.5 3.5 0 1 1 484.5 676.0 A 3.5 3.5 0 1 1 491.5 676.0 Z" />
                <path d="M 714.5 676.0 L 716.9 677.4 L 716.3 679.4 L 713.5 679.4 L 712.6 680.6 L 713.3 683.3 L 711.4 684.3 L 709.5 682.3 L 708.0 682.5 L 706.6 684.9 L 704.6 684.3 L 704.6 681.5 L 703.4 680.6 L 700.7 681.3 L 699.7 679.4 L 701.7 677.5 L 701.5 676.0 L 699.1 674.6 L 699.7 672.6 L 702.5 672.6 L 703.4 671.4 L 702.7 668.7 L 704.6 667.7 L 706.5 669.7 L 708.0 669.5 L 709.4 667.1 L 711.4 667.7 L 711.4 670.5 L 712.6 671.4 L 715.3 670.7 L 716.3 672.6 L 714.3 674.5 Z M 711.1 676.0 A 3.1 3.1 0 1 1 704.9 676.0 A 3.1 3.1 0 1 1 711.1 676.0 Z" />
              </g>

              <g id="tat-dollar" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle r="21" />
                <circle r="16.5" strokeDasharray="1.6 2.6" />
                <path d="M 5.5 -9 C -8 -12.5 -9.5 -2 0 0 C 9.5 2 8 12.5 -5.5 9 M 0 -16 L 0 16" />
                <path d="M 31 -10 Q 31 -10 36 -10 Q 36 -10 36 -5 Q 36 -10 41 -10 Q 36 -10 36 -15 Q 36 -10 31 -10 Z" />
                <path d="M -34 12 Q -34 12 -30 12 Q -30 12 -30 16 Q -30 12 -26 12 Q -30 12 -30 8 Q -30 12 -34 12 Z" />
              </g>

              <clipPath id="clip-upper-torso">
                <path
                  d="M 326.0 244.0 C 365.0 206.0 462.0 174.0 540.0 165.0 C 612.0 192.0 695.0 310.0 774.0 494.0 C 695.0 492.0 608.0 525.0 535.0 588.0 C 468.0 646.0 405.0 696.0 354.0 714.0 C 315.0 585.0 294.0 422.0 326.0 244.0 Z"
                  data-o="M 326.0 244.0 C 365.0 206.0 462.0 174.0 540.0 165.0 C 612.0 192.0 695.0 310.0 774.0 494.0 C 695.0 492.0 608.0 525.0 535.0 588.0 C 468.0 646.0 405.0 696.0 354.0 714.0 C 315.0 585.0 294.0 422.0 326.0 244.0 Z"
                />
              </clipPath>

              <clipPath id="clip-lower-belly">
                <path
                  d="M 358.0 722.0 C 412.0 706.0 474.0 654.0 542.0 595.0 C 614.0 532.0 698.0 498.0 776.0 502.0 C 788.0 538.0 795.0 572.0 794.0 602.0 C 738.0 662.0 636.0 720.0 520.0 742.0 C 438.0 757.0 382.0 746.0 358.0 722.0 Z"
                  data-o="M 358.0 722.0 C 412.0 706.0 474.0 654.0 542.0 595.0 C 614.0 532.0 698.0 498.0 776.0 502.0 C 788.0 538.0 795.0 572.0 794.0 602.0 C 738.0 662.0 636.0 720.0 520.0 742.0 C 438.0 757.0 382.0 746.0 358.0 722.0 Z"
                />
              </clipPath>

              <clipPath id="clip-slot-cavity">
                <path d="M 465 210 H 630 L 644 416 C 651 430, 644 446, 627 455 C 610 464, 593 462, 583 448 L 506 326 C 498 313, 502 300, 514 292 L 465 210 Z" />
              </clipPath>

              <clipPath id="slot-void-clip">
                <path d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z" />
              </clipPath>
              <linearGradient id="slot-depth-wall" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#050403" />
                <stop offset="0.6" stopColor="#17110a" />
                <stop offset="1" stopColor="#3b2d1b" />
              </linearGradient>
              <radialGradient id="slot-depth-glow" cx="0.55" cy="0.62" r="0.5">
                <stop offset="0" stopColor="#8a6a38" stopOpacity="0.38" />
                <stop offset="0.5" stopColor="#4d3a1f" stopOpacity="0.16" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </radialGradient>
              <filter id="slot-depth-blur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
              <filter id="slot-depth-blur-s" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.2" />
              </filter>

              <radialGradient id="gl-bloom" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffdc94" stopOpacity="0.38" />
                <stop offset="0.4" stopColor="#e8a840" stopOpacity="0.2" />
                <stop offset="0.75" stopColor="#c98a2a" stopOpacity="0.06" />
                <stop offset="1" stopColor="#e09a1f" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="gl-core" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffe6a8" stopOpacity="0.85" />
                <stop offset="0.3" stopColor="#e9b04a" stopOpacity="0.7" />
                <stop offset="0.7" stopColor="#a8691c" stopOpacity="0.4" />
                <stop offset="1" stopColor="#5a3510" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gl-ray" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ffe9b0" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#f0bd55" stopOpacity="0.12" />
                <stop offset="1" stopColor="#ffc03a" stopOpacity="0" />
              </linearGradient>
              <filter id="gl-blur-l" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <filter id="gl-blur-m" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
              <filter id="gl-blur-s" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.1" />
              </filter>
            </defs>

            <rect x="0" y={FLOOR_Y} width={WORLD_W} height={WORLD_H - FLOOR_Y} fill="#EBE3D4" />
            <line x1="0" x2={WORLD_W} y1={FLOOR_Y} y2={FLOOR_Y} stroke="#B8A992" strokeWidth="3" />
            <line
              x1="0"
              x2={WORLD_W}
              y1={FLOOR_Y + 22}
              y2={FLOOR_Y + 22}
              stroke="#CFC4B0"
              strokeWidth="4"
              strokeDasharray="48 34"
              strokeLinecap="round"
            />

            <ellipse id="piggy-shadow" cx={WORLD_W * 0.34} cy={FLOOR_Y + 4} rx="110" ry="10" fill="rgba(45, 32, 18, 0.16)" />

            <g id="piggy-pos" transform={`translate(${WORLD_W * 0.34} ${FLOOR_Y}) scale(${PIGGY_SCALE}) translate(-550 -911)`}>
              <g id="actor" strokeLinejoin="round" strokeLinecap="round">
                <g id="legs-group" />
                <g id="body">
                  <g id="right-socket-g">
                    <ellipse cx="642" cy="235" rx="36" ry="52" transform="rotate(-26 642 235)" fill="#2c1e14" />
                  </g>
                  <g id="right-arm-tuck">
                  <g id="right-arm-group">
                    <path
                      d="M 608.0 164.0 C 634.0 152.0 662.0 142.0 686.0 135.0 C 708.0 164.0 720.0 198.0 716.0 232.0 C 692.0 242.0 666.0 250.0 642.0 254.0 C 635.0 222.0 622.0 190.0 608.0 164.0 Z"
                      fill="url(#arm-right-cyl)"
                      filter="url(#metal-patina)"
                      stroke="#402c1e"
                      strokeWidth="1.5"
                    />
                    <path d="M 614 166 C 638 155, 662 146, 683 140" fill="none" stroke="#966747" strokeWidth="2.5" opacity="0.10" />
                    <path
                      d="M 686.0 135.0 C 708.0 164.0 720.0 198.0 716.0 232.0 C 718.9 231.7 721.6 230.7 724.0 229.0 C 728.0 195.0 716.0 161.0 694.0 133.0 C 691.2 132.9 688.5 133.6 686.0 135.0 Z"
                      fill="#322217"
                    />
                    <path
                      d="M 694.0 133.0 C 708.0 128.0 722.0 125.0 734.0 123.0 C 752.0 152.0 761.0 186.0 757.0 219.0 C 745.0 223.0 734.0 226.0 723.0 229.0 C 727.0 195.0 716.0 161.0 694.0 133.0 Z"
                      fill="url(#arm-right-cyl)"
                      filter="url(#metal-patina)"
                      stroke="#402c1e"
                      strokeWidth="1.5"
                    />
                    <path d="M 702 156 C 716 152, 730 149, 742 148" fill="none" stroke="#996848" strokeWidth="4" opacity="0.08" />
                    <path
                      d="M 733.0 122.0 C 751.0 151.0 760.0 185.0 756.0 219.0 C 758.8 219.1 761.5 218.4 764.0 217.0 C 768.0 183.0 759.0 149.0 741.0 120.0 C 738.2 119.9 735.5 120.6 733.0 122.0 Z"
                      fill="#2e2016"
                    />
                    <path
                      d="M 741.0 120.0 C 778.0 112.0 812.0 132.0 816.0 165.0 C 820.0 198.0 796.0 221.0 764.0 217.0 C 768.0 183.0 759.0 149.0 741.0 120.0 Z"
                      fill="url(#fist-cap-grad)"
                      filter="url(#metal-patina)"
                      stroke="#3a271b"
                      strokeWidth="1.5"
                    />
                    <path d="M 746 125 C 762 152, 770 182, 766 212" fill="none" stroke="#895d40" strokeWidth="2.5" opacity="0.10" />
                  </g>
                  </g>

                  {/* Exposed Inner Steampunk Clockwork Boiler Vault (revealed during Disassembly) */}
                  <g id="piggy-inner-core" opacity="0" style={{ pointerEvents: 'none' }}>
                    <ellipse cx="552" cy="495" rx="148" ry="194" fill="#170f08" stroke="#4a351d" strokeWidth="7" />
                    <ellipse cx="552" cy="495" rx="138" ry="184" fill="none" stroke="#a67c46" strokeWidth="2.4" opacity="0.55" />
                    <ellipse cx="552" cy="495" rx="118" ry="160" fill="#26190e" stroke="#8b6637" strokeWidth="3.5" strokeDasharray="12 6" />
                    {/* Radial machined bulkhead perimeter bolts & washers */}
                    <g fill="#d9a459" stroke="#1f140a" strokeWidth="1.6">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const bx = 552 + Math.cos(rad) * 129;
                        const by = 495 + Math.sin(rad) * 172;
                        return (
                          <g key={deg} transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)})`}>
                            <circle r="8.5" fill="#70512a" stroke="#1f140a" strokeWidth="1.5" />
                            <circle r="5" fill="#e5bd73" stroke="#2c1d0e" strokeWidth="1.2" />
                            <path d="M -3 0 L 3 0 M 0 -3 L 0 3" stroke="#2c1d0e" strokeWidth="1.5" />
                          </g>
                        );
                      })}
                    </g>
                    {/* Pressurized copper manifold pipes */}
                    <path d="M 462 346 L 496 446 M 624 346 L 600 462 M 478 625 L 535 555 M 628 620 L 580 555" stroke="#92400e" strokeWidth="13" strokeLinecap="round" opacity="0.82" />
                    <path d="M 462 346 L 496 446 M 624 346 L 600 462 M 478 625 L 535 555 M 628 620 L 580 555" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
                    <circle cx="552" cy="495" r="84" fill="url(#gl-core)" />
                    <g id="core-gear-a" transform="translate(494 456)">
                      <path
                        d="M -42 -8 L -52 -6 L -52 6 L -42 8 L -38 22 L -46 30 L -38 38 L -28 32 L -14 40 L -16 50 L -4 52 L 0 42 L 16 40 L 24 48 L 34 42 L 28 32 L 38 18 L 48 20 L 52 8 L 42 4 L 42 -10 L 50 -16 L 44 -26 L 34 -22 L 22 -34 L 26 -44 L 16 -50 L 8 -40 L -8 -40 L -16 -50 L -26 -44 L -22 -34 L -34 -22 L -44 -26 L -50 -16 Z"
                        fill="#d97706"
                        stroke="#2a1d10"
                        strokeWidth="2.8"
                      />
                      <circle r="24" fill="#3a1604" stroke="#fcd34d" strokeWidth="2.8" />
                      <path d="M -20 0 H 20 M 0 -20 V 20" stroke="#b45309" strokeWidth="6" />
                      <circle r="10" fill="#fbbf24" stroke="#2a1d10" strokeWidth="2" />
                    </g>
                    <g id="core-gear-b" transform="translate(602 522)">
                      <path
                        d="M -34 -6 L -42 -4 L -42 6 L -34 8 L -30 18 L -36 25 L -29 32 L -21 26 L -10 32 L -12 40 L -2 42 L 2 34 L 14 32 L 20 39 L 28 33 L 23 25 L 31 14 L 39 16 L 42 6 L 34 3 L 34 -8 L 40 -13 L 35 -21 L 27 -18 L 18 -27 L 21 -35 L 13 -40 L 6 -32 L -6 -32 L -13 -40 L -21 -35 L -18 -27 L -27 -18 L -35 -21 L -40 -13 Z"
                        fill="#f59e0b"
                        stroke="#2a1d10"
                        strokeWidth="2.6"
                      />
                      <circle r="18" fill="#3a1604" stroke="#fef08a" strokeWidth="2.2" />
                      <path d="M -15 0 H 15 M 0 -15 V 15" stroke="#d97706" strokeWidth="4.5" />
                      <circle r="7.5" fill="#fde047" stroke="#2a1d10" strokeWidth="1.6" />
                    </g>
                    <g id="core-gear-c" transform="translate(534 576)">
                      <path
                        d="M -24 -5 L -31 -3 L -31 5 L -24 6 L -21 14 L -26 19 L -20 24 L -14 20 L -7 24 L -9 31 L -1 32 L 2 25 L 10 24 L 15 29 L 21 24 L 17 18 L 23 10 L 30 11 L 32 4 L 25 2 L 25 -6 L 30 -10 L 26 -16 L 20 -13 L 13 -21 L 16 -27 L 9 -31 L 4 -24 L -5 -24 L -10 -31 L -16 -27 L -13 -21 L -20 -13 L -26 -16 L -30 -10 Z"
                        fill="#94a3b8"
                        stroke="#1e293b"
                        strokeWidth="2.2"
                      />
                      <circle r="13" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
                      <circle r="5.5" fill="#cbd5e1" />
                    </g>
                    <circle cx="552" cy="495" r="24" fill="#fef08a" stroke="#f59e0b" strokeWidth="4" opacity="0.92" />
                  </g>

                  <g id="torso-main">
                    <g id="torso-pelvis-wrap">
                      <path
                        d="M 358.0 725.0 C 430.0 755.0 575.0 745.0 680.0 692.0 C 738.0 662.0 780.0 628.0 798.0 598.0 C 806.0 625.0 798.0 662.0 768.0 696.0 C 712.0 758.0 608.0 796.0 496.0 794.0 C 418.0 792.0 368.0 765.0 358.0 725.0 Z"
                        data-o="M 358.0 725.0 C 430.0 755.0 575.0 745.0 680.0 692.0 C 738.0 662.0 780.0 628.0 798.0 598.0 C 806.0 625.0 798.0 662.0 768.0 696.0 C 712.0 758.0 608.0 796.0 496.0 794.0 C 418.0 792.0 368.0 765.0 358.0 725.0 Z"
                        fill="url(#pelvis-under-grad)"
                        filter="url(#metal-patina)"
                        stroke="#3d311d"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 354.0 714.0 C 425.0 746.0 568.0 738.0 678.0 682.0 C 738.0 652.0 780.0 616.0 798.0 584.0 C 801.6 590.9 803.3 598.2 803.0 606.0 C 782.0 642.0 738.0 678.0 676.0 709.0 C 566.0 764.0 424.0 770.0 356.0 736.0 C 353.4 728.8 352.7 721.5 354.0 714.0 Z"
                        data-o="M 354.0 714.0 C 425.0 746.0 568.0 738.0 678.0 682.0 C 738.0 652.0 780.0 616.0 798.0 584.0 C 801.6 590.9 803.3 598.2 803.0 606.0 C 782.0 642.0 738.0 678.0 676.0 709.0 C 566.0 764.0 424.0 770.0 356.0 736.0 C 353.4 728.8 352.7 721.5 354.0 714.0 Z"
                        fill="url(#bottom-rim-grad)"
                        stroke="#41341f"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M 360 718 C 430 748, 570 740, 678 685 C 736 655, 776 622, 795 591"
                        data-o="M 360 718 C 430 748, 570 740, 678 685 C 736 655, 776 622, 795 591"
                        fill="none"
                        stroke="#927341"
                        strokeWidth="2.2"
                        opacity="0.11"
                      />
                    </g>

                    <g id="torso-belly-wrap">
                      <g clipPath="url(#clip-lower-belly)">
                        <rect x="150" y="400" width="800" height="600" fill="url(#copper-belly-grad)" filter="url(#copper-texture)" />
                        <path
                          d="M 352.0 715.0 C 408.0 698.0 472.0 645.0 540.0 586.0 C 612.0 524.0 696.0 490.0 778.0 494.0 C 783.0 503.4 785.4 513.4 785.0 524.0 C 702.0 520.0 622.0 554.0 550.0 614.0 C 482.0 672.0 418.0 722.0 362.0 738.0 C 356.6 731.2 353.3 723.6 352.0 715.0 Z"
                          data-o="M 352.0 715.0 C 408.0 698.0 472.0 645.0 540.0 586.0 C 612.0 524.0 696.0 490.0 778.0 494.0 C 783.0 503.4 785.4 513.4 785.0 524.0 C 702.0 520.0 622.0 554.0 550.0 614.0 C 482.0 672.0 418.0 722.0 362.0 738.0 C 356.6 731.2 353.3 723.6 352.0 715.0 Z"
                          fill="#2b2214"
                          opacity="0.58"
                        />
                        <ellipse data-e="595 635 95 52 -24" cx="595" cy="635" rx="95" ry="52" transform="rotate(-24 595 635)" fill="#7e663f" opacity="0.22" />
                      </g>

                      {/* ENGRAVED TATTOO ART (belly) */}
                      <g clipPath="url(#clip-lower-belly)" style={{ pointerEvents: 'none' }}>
                        <use href="#tat-belly" stroke="#f1dca6" strokeWidth="1.6" opacity="0.38" transform="translate(0.9 1)" />
                        <use href="#tat-belly" stroke="#2b1d0e" strokeWidth="1.6" opacity="0.72" />
                      </g>

                      <path
                        d="M 352.0 712.0 C 406.0 694.0 468.0 644.0 536.0 585.0 C 608.0 522.0 694.0 488.0 775.0 492.0 C 778.1 496.9 779.8 502.2 780.0 508.0 C 698.0 504.0 614.0 538.0 542.0 600.0 C 474.0 658.0 412.0 708.0 358.0 725.0 C 354.8 721.2 352.8 716.9 352.0 712.0 Z"
                        data-o="M 352.0 712.0 C 406.0 694.0 468.0 644.0 536.0 585.0 C 608.0 522.0 694.0 488.0 775.0 492.0 C 778.1 496.9 779.8 502.2 780.0 508.0 C 698.0 504.0 614.0 538.0 542.0 600.0 C 474.0 658.0 412.0 708.0 358.0 725.0 C 354.8 721.2 352.8 716.9 352.0 712.0 Z"
                        fill="#645237"
                        stroke="#342b1c"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 356 713 C 410 695, 472 645, 540 586 C 612 524, 696 490, 775 494"
                        data-o="M 356 713 C 410 695, 472 645, 540 586 C 612 524, 696 490, 775 494"
                        fill="none"
                        stroke="#866e46"
                        strokeWidth="2.5"
                        opacity="0.12"
                      />
                    </g>

                    <g id="torso-chest-wrap">
                      <g clipPath="url(#clip-upper-torso)">
                        <rect x="150" y="150" width="800" height="800" fill="url(#brass-body-main)" filter="url(#metal-patina)" />
                        <rect x="150" y="150" width="800" height="800" fill="url(#brass-body-vertical)" />
                        <ellipse data-e="445 435 115 165 -18" cx="445" cy="435" rx="115" ry="165" transform="rotate(-18 445 435)" fill="#a5824a" opacity="0.04" />
                        <path
                          d="M 650 220 C 705 305, 745 400, 772 492"
                          data-o="M 650 220 C 705 305, 745 400, 772 492"
                          fill="none"
                          stroke="#967643"
                          strokeWidth="10"
                          opacity="0.04"
                        />
                      </g>

                      {/* ENGRAVED TATTOO ART (chest) */}
                      <g clipPath="url(#clip-upper-torso)" style={{ pointerEvents: 'none' }}>
                        <use href="#tat-chest" stroke="#f1dca6" strokeWidth="1.6" opacity="0.38" transform="translate(0.9 1)" />
                        <use href="#tat-chest" stroke="#2b1d0e" strokeWidth="1.6" opacity="0.72" />
                      </g>
                    </g>
                  </g>

                  {/* Spherical Ball-State Brass Rim & Specular Overlay */}
                  <g id="ball-shell-overlay" opacity="0" style={{ pointerEvents: 'none' }}>
                    <circle cx="552" cy="505" r="236" fill="none" stroke="#2f2314" strokeWidth="5" opacity="0.78" />
                    <circle cx="552" cy="505" r="232" fill="none" stroke="#d8b26e" strokeWidth="3.2" opacity="0.34" />
                    <path
                      d="M 380 345 A 220 220 0 0 1 688 326"
                      fill="none"
                      stroke="#fff3cf"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      opacity="0.34"
                    />
                    <path
                      d="M 332 548 A 226 226 0 0 0 742 622"
                      fill="none"
                      stroke="#1f150c"
                      strokeWidth="11"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </g>

                  {/* TOP SCREW: heavy machined brass Phillips bolt on hex nut, flange & threaded steel shank */}
                  <g id="top-screw-wrap">
                  <g id="top-screw" transform="translate(478 186) rotate(-14) scale(1.7)">
                    <ellipse cx="3" cy="8" rx="40" ry="11" fill="#1f140a" opacity="0.38" filter="url(#soft-shadow)" />
                    <g id="top-screw-shank" opacity="0">
                      <path d="M -11 6 L -11 32 L 0 38 L 11 32 L 11 6 Z" fill="url(#ts-cyl)" stroke="#23160a" strokeWidth="1.2" />
                      <g stroke="#23160a" strokeWidth="1.15" opacity="0.85">
                        <path d="M -11 10 L 11 13" />
                        <path d="M -11 15.5 L 11 18.5" />
                        <path d="M -11 21 L 11 24" />
                        <path d="M -11 26.5 L 11 29.5" />
                      </g>
                    </g>
                    <ellipse cx="0" cy="6" rx="34" ry="10" fill="#2c1d0e" />
                    <path d="M -34 3 L -34 6 A 34 10 0 0 0 34 6 L 34 3 Z" fill="#4a331b" />
                    <ellipse cx="0" cy="3" rx="34" ry="10" fill="url(#ts-flange)" stroke="#2c1d0e" strokeWidth="1.3" />
                    <ellipse cx="0" cy="3" rx="29" ry="7.8" fill="none" stroke="#d9b172" strokeWidth="1" opacity="0.55" />
                    <g fill="#e3bd7e" stroke="#2c1d0e" strokeWidth="0.7">
                      <circle cx="-26" cy="4" r="2.0" />
                      <circle cx="26" cy="4" r="2.0" />
                      <circle cx="-14" cy="10" r="1.9" />
                      <circle cx="14" cy="10" r="1.9" />
                      <circle cx="-22" cy="-2" r="1.7" />
                      <circle cx="22" cy="-2" r="1.7" />
                    </g>
                    <path d="M -24 -12 L -12 -5 L -12 4 L -24 -3 Z" fill="url(#ts-nutL)" stroke="#2c1d0e" strokeWidth="1" />
                    <path d="M -12 -5 L 12 -5 L 12 4 L -12 4 Z" fill="url(#ts-nutM)" stroke="#2c1d0e" strokeWidth="1" />
                    <path d="M 12 -5 L 24 -12 L 24 -3 L 12 4 Z" fill="url(#ts-nutR)" stroke="#2c1d0e" strokeWidth="1" />
                    <path d="M -24 -12 L -12 -19 L 12 -19 L 24 -12 L 12 -5 L -12 -5 Z" fill="#c79a5c" stroke="#2c1d0e" strokeWidth="1" />
                    <path d="M -22 -12 L -11 -18 L 11 -18" fill="none" stroke="#fff1c9" strokeWidth="1.2" opacity="0.65" />
                    <path d="M -17 -15 L -17 -30 A 17 6.5 0 0 1 17 -30 L 17 -15 A 17 6.5 0 0 1 -17 -15 Z" fill="url(#ts-cyl)" stroke="#2c1d0e" strokeWidth="1.2" />
                    <g stroke="#2c1d0e" strokeWidth="0.7" opacity="0.45">
                      <path d="M -13 -14 L -13 -28" />
                      <path d="M -9 -12 L -9 -27" />
                      <path d="M -4.5 -11 L -4.5 -26.5" />
                      <path d="M 0 -10.5 L 0 -26" />
                      <path d="M 4.5 -11 L 4.5 -26.5" />
                      <path d="M 9 -12 L 9 -27" />
                      <path d="M 13 -14 L 13 -28" />
                    </g>
                    <ellipse cx="0" cy="-30" rx="17" ry="6.5" fill="url(#ts-top)" stroke="#3a2813" strokeWidth="1.2" />
                    <ellipse cx="0" cy="-30" rx="13.5" ry="4.9" fill="none" stroke="#fff3cf" strokeWidth="0.9" opacity="0.5" />
                    <path d="M -9 -30 L 9 -30 M 0 -34.2 L 0 -25.8" stroke="#1b1108" strokeWidth="3.6" strokeLinecap="round" />
                    <path d="M -8 -29.2 L 8 -29.2 M 0.9 -33.2 L 0.9 -26.8" stroke="#8b6338" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
                    <ellipse cx="-7" cy="-33.2" rx="4.2" ry="1.3" fill="#ffffff" opacity="0.55" transform="rotate(-12 -7 -33.2)" />
                    <path d="M -11 -26 L -11 -17" stroke="#fff3cf" strokeWidth="1.4" opacity="0.45" strokeLinecap="round" />
                  </g>
                  </g>

                  <g id="head-and-ears">
                    <g id="right-ear" />
                    <g id="left-ear" />
                  </g>

                  <path
                    id="left-socket"
                    d="M 294.0 334.0 C 332.0 346.0 362.0 374.0 374.0 414.0 C 374.0 452.0 354.0 484.0 326.0 496.0 C 295.0 456.0 282.0 394.0 294.0 334.0 Z"
                    fill="#1a1108"
                  />
                  <g id="left-arm-tuck">
                  <g id="left-arm-group">
                    <path
                      d="M 244.0 352.0 C 262.0 336.0 282.0 328.0 298.0 332.0 C 332.0 346.0 356.0 382.0 356.0 422.0 C 338.0 428.0 320.0 430.0 304.0 428.0 C 292.0 396.0 270.0 368.0 244.0 352.0 Z"
                      fill="url(#arm-left-cyl)"
                      filter="url(#metal-patina)"
                      stroke="#3d2a1d"
                      strokeWidth="1.5"
                    />
                    <path d="M 254 352 C 278 368, 298 394, 310 424" fill="none" stroke="#966747" strokeWidth="2.5" opacity="0.10" />
                    <path
                      d="M 244.0 352.0 C 270.0 368.0 292.0 396.0 304.0 428.0 C 302.0 431.1 299.3 433.4 296.0 435.0 C 284.0 403.0 262.0 375.0 236.0 359.0 C 238.0 355.9 240.7 353.6 244.0 352.0 Z"
                      fill="#302016"
                    />
                    <path
                      d="M 206.0 392.0 C 218.0 378.0 228.0 366.0 236.0 359.0 C 262.0 375.0 284.0 403.0 296.0 435.0 C 286.0 446.0 276.0 456.0 266.0 464.0 C 252.0 434.0 230.0 408.0 206.0 392.0 Z"
                      fill="url(#arm-left-cyl)"
                      filter="url(#metal-patina)"
                      stroke="#3d2a1d"
                      strokeWidth="1.5"
                    />
                    <path d="M 222 376 C 246 392, 268 418, 280 448" fill="none" stroke="#996848" strokeWidth="4.5" opacity="0.07" />
                    <path
                      d="M 206.0 392.0 C 230.0 408.0 252.0 434.0 266.0 464.0 C 264.0 467.1 261.3 469.4 258.0 471.0 C 244.0 441.0 222.0 415.0 198.0 399.0 C 200.0 395.9 202.7 393.6 206.0 392.0 Z"
                      fill="#2e2016"
                    />
                    <path
                      d="M 176.0 432.0 C 184.0 418.0 192.0 406.0 198.0 399.0 C 222.0 415.0 244.0 441.0 258.0 471.0 C 248.0 480.0 238.0 488.0 228.0 494.0 C 214.0 468.0 196.0 446.0 176.0 432.0 Z"
                      fill="url(#arm-left-cyl)"
                      filter="url(#metal-patina)"
                      stroke="#3d2a1d"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 176.0 432.0 C 196.0 446.0 214.0 468.0 228.0 494.0 C 226.0 497.1 223.3 499.4 220.0 501.0 C 206.0 475.0 188.0 453.0 168.0 439.0 C 170.0 435.9 172.7 433.6 176.0 432.0 Z"
                      fill="#2a1d14"
                    />
                    <g id="left-fist-cap">
                      <path
                        d="M 168.0 439.0 C 138.0 468.0 126.0 512.0 144.0 544.0 C 164.0 576.0 208.0 574.0 234.0 542.0 C 238.0 528.0 234.0 512.0 220.0 501.0 C 206.0 475.0 188.0 453.0 168.0 439.0 Z"
                        fill="url(#fist-cap-grad)"
                        filter="url(#metal-patina)"
                        stroke="#212b26"
                        strokeWidth="1.6"
                      />
                      <path d="M 171 445 C 190 458, 207 479, 220 504" fill="none" stroke="#597266" strokeWidth="2.5" opacity="0.10" />
                      <path d="M 140 504 C 152 528, 174 548, 198 558" fill="none" stroke="#202824" strokeWidth="3" opacity="0.85" />
                      <path d="M 142 501 C 154 525, 176 545, 200 555" fill="none" stroke="#51675c" strokeWidth="1.8" opacity="0.65" />
                      <ellipse cx="174" cy="496" rx="22" ry="15" transform="rotate(-38 174 496)" fill="#5e786b" opacity="0.04" />
                    </g>
                  </g>
                  </g>

                  <g id="slot-eject-wrap">
                  <g id="slot-follow">
                    <g id="coin-slot-assembly" transform="translate(-28 75) translate(575 372) scale(1.45) translate(-575 -372)">
                      <path
                        d="M 502.0 284.0 C 526.0 270.0 554.0 265.0 574.0 282.0 C 614.7 318.9 643.4 363.6 660.0 416.0 C 672.0 436.0 662.0 458.0 636.0 472.0 C 610.0 486.0 584.0 484.0 570.0 462.0 C 529.8 424.2 501.8 378.9 486.0 326.0 C 474.0 306.0 482.0 294.0 502.0 284.0 Z"
                        fill="#2f2516"
                        opacity="0.34"
                        filter="url(#soft-shadow)"
                      />
                      <path
                        d="M 505.0 280.0 C 529.0 266.0 557.0 262.0 577.0 280.0 C 617.4 317.0 645.7 361.7 662.0 414.0 C 674.0 434.0 664.0 456.0 638.0 470.0 C 612.0 484.0 586.0 482.0 572.0 460.0 C 531.8 422.2 503.8 376.9 488.0 324.0 C 476.0 304.0 485.0 292.0 505.0 280.0 Z"
                        fill="url(#slot-bevel-outer)"
                        stroke="#443723"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M 507.0 283.0 C 530.0 270.0 555.0 266.0 574.0 283.0 C 613.9 319.4 641.9 363.4 658.0 415.0 C 669.0 433.0 660.0 453.0 636.0 466.0 C 612.0 479.0 588.0 477.0 575.0 457.0 C 535.3 419.8 507.6 375.1 492.0 323.0 C 481.0 305.0 489.0 294.0 507.0 283.0 Z"
                        fill="none"
                        stroke="#937647"
                        strokeWidth="2.2"
                        opacity="0.12"
                      />
                      <path
                        d="M 518.0 294.0 C 535.0 284.0 554.0 282.0 567.0 295.0 C 604.1 329.0 630.1 370.0 645.0 418.0 C 653.0 431.0 646.0 446.0 628.0 456.0 C 610.0 466.0 592.0 464.0 582.0 449.0 C 545.1 414.3 519.4 372.6 505.0 324.0 C 497.0 311.0 503.0 302.0 518.0 294.0 Z"
                        fill="url(#slot-inner-wall)"
                        stroke="#302718"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                        fill="url(#slot-void-grad)"
                      />

                      {/* Receding tunnel depth inside the coin slot */}
                      <g clipPath="url(#slot-void-clip)">
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          transform="translate(580 383) scale(0.90) translate(-575 -375)"
                          fill="url(#slot-depth-wall)"
                          stroke="#4a3a24"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          transform="translate(586 392) scale(0.77) translate(-575 -375)"
                          fill="#0a0705"
                          stroke="#2f2418"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          transform="translate(592 401) scale(0.62) translate(-575 -375)"
                          fill="#050302"
                          stroke="#1d150d"
                          strokeWidth="1"
                        />
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          transform="translate(597 409) scale(0.47) translate(-575 -375)"
                          fill="#020101"
                        />
                        <ellipse cx="598" cy="415" rx="30" ry="42" transform="rotate(-24 598 415)" fill="url(#slot-depth-glow)" />
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          fill="none"
                          stroke="#000"
                          strokeWidth="26"
                          opacity="0.75"
                          filter="url(#slot-depth-blur)"
                        />
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          transform="translate(-4 -5)"
                          fill="none"
                          stroke="#000"
                          strokeWidth="12"
                          opacity="0.7"
                          filter="url(#slot-depth-blur-s)"
                        />
                        <path d="M 640 424 C 645 434, 640 444, 626 451 C 612 458, 598 456, 590 446" fill="none" stroke="#9c7b45" strokeWidth="3" opacity="0.28" filter="url(#slot-depth-blur-s)" />
                      </g>

                      <g clipPath="url(#clip-slot-cavity)">
                        <g id="swallow-coin-group" opacity="0">
                          {!coinError ? (
                            <image href={COIN_SPRITE_URL} x="-26" y="-26" width="52" height="52" />
                          ) : (
                            <circle r="22" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
                          )}
                        </g>
                      </g>

                      <path
                        id="slot-rim-glow"
                        d="M 505.0 280.0 C 529.0 266.0 557.0 262.0 577.0 280.0 C 617.4 317.0 645.7 361.7 662.0 414.0 C 674.0 434.0 664.0 456.0 638.0 470.0 C 612.0 484.0 586.0 482.0 572.0 460.0 C 531.8 422.2 503.8 376.9 488.0 324.0 C 476.0 304.0 485.0 292.0 505.0 280.0 Z"
                        fill="none"
                        stroke="#4ADE80"
                        strokeWidth="8.5"
                        opacity="0"
                      />

                      <path
                        d="M 642 420 C 649 431, 643 444, 627 453 C 611 462, 595 460, 586 447"
                        fill="none"
                        stroke="#756140"
                        strokeWidth="1.8"
                        opacity="0.75"
                      />

                      {/* PREMIUM GOLD LIGHT: periodic blink spilling out of the slot */}
                      <g id="slot-light" opacity="0" style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}>
                        <ellipse id="gl-bloom-el" cx="578" cy="378" rx="104" ry="146" transform="rotate(-34 578 378)" fill="url(#gl-bloom)" filter="url(#gl-blur-l)" />
                        <g id="gl-rays" transform="translate(578 378)" filter="url(#gl-blur-m)" opacity="0.5">
                          <g id="gl-rays-in">
                            <path d="M 0 -2.5 L 190 -9 L 190 9 L 0 2.5 Z" fill="url(#gl-ray)" transform="rotate(0)" />
                            <path d="M 0 -2 L 150 -7 L 150 7 L 0 2 Z" fill="url(#gl-ray)" transform="rotate(45)" />
                            <path d="M 0 -3 L 210 -10 L 210 10 L 0 3 Z" fill="url(#gl-ray)" transform="rotate(90)" />
                            <path d="M 0 -2 L 150 -7 L 150 7 L 0 2 Z" fill="url(#gl-ray)" transform="rotate(135)" />
                            <path d="M 0 -2.5 L 190 -9 L 190 9 L 0 2.5 Z" fill="url(#gl-ray)" transform="rotate(180)" />
                            <path d="M 0 -2 L 150 -7 L 150 7 L 0 2 Z" fill="url(#gl-ray)" transform="rotate(225)" />
                            <path d="M 0 -3 L 210 -10 L 210 10 L 0 3 Z" fill="url(#gl-ray)" transform="rotate(270)" />
                            <path d="M 0 -2 L 150 -7 L 150 7 L 0 2 Z" fill="url(#gl-ray)" transform="rotate(315)" />
                          </g>
                        </g>
                        <g clipPath="url(#slot-void-clip)">
                          <ellipse cx="596" cy="402" rx="44" ry="78" transform="rotate(-34 596 402)" fill="url(#gl-core)" filter="url(#gl-blur-m)" />
                          <path
                            d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                            fill="none"
                            stroke="#f2c067"
                            strokeWidth="5"
                            opacity="0.5"
                            filter="url(#gl-blur-m)"
                          />
                        </g>
                        <path
                          d="M 523.0 298.0 C 538.0 289.0 554.0 288.0 566.0 300.0 C 602.1 333.2 627.5 373.2 642.0 420.0 C 649.0 431.0 643.0 444.0 627.0 453.0 C 611.0 462.0 595.0 460.0 586.0 447.0 C 549.7 413.2 524.4 372.5 510.0 325.0 C 503.0 313.0 509.0 306.0 523.0 298.0 Z"
                          fill="none"
                          stroke="#f0c36e"
                          strokeWidth="1.6"
                          opacity="0.55"
                          filter="url(#gl-blur-s)"
                        />
                        <g id="gl-star-a" opacity="0" />
                        <g id="gl-star-b" transform="translate(610 418)">
                          <path
                            d="M 0 -18 C 1.6 -5.5 5.5 -1.6 18 0 C 5.5 1.6 1.6 5.5 0 18 C -1.6 5.5 -5.5 1.6 -18 0 C -5.5 -1.6 -1.6 -5.5 0 -18 Z"
                            fill="#ffefc0"
                            filter="url(#gl-blur-s)"
                            opacity="0.7"
                          />
                          <circle r="1.8" fill="#fff8e0" opacity="0.85" />
                        </g>
                      </g>
                    </g>
                  </g>
                  </g>

                  {/* PAULDRON ARMOUR over the arm AND over the slot frame */}
                  <g id="left-pauldron">
                    <path
                      d="M 279.3 300.2 C 288.3 290.8 299.1 284.7 311.7 281.8 C 327.9 272.6 345.8 272.8 365.4 282.4 C 380.4 284.9 393.5 291.3 404.6 301.6 C 424.2 311.2 428.2 323.6 416.6 338.8 C 411.9 351.3 404.2 361.4 393.4 369.2 C 381.8 384.4 368.0 387.4 352.0 378.2 C 339.5 375.3 328.8 369.1 320.0 359.8 C 304.0 350.6 291.9 342.8 283.7 336.4 C 277.0 333.8 271.5 329.5 267.3 323.6 C 259.1 317.2 263.1 309.4 279.3 300.2 Z"
                      fill="#332318"
                      opacity="0.38"
                    />
                    <path
                      d="M 274.4 294.4 C 284.1 283.9 295.8 277.0 309.6 273.6 C 327.2 263.2 345.8 263.2 365.4 273.6 C 380.5 276.6 393.6 283.5 404.6 294.4 C 424.2 304.8 428.2 317.6 416.6 332.8 C 411.9 345.3 404.2 355.4 393.4 363.2 C 381.8 378.4 366.6 380.4 347.8 369.2 C 333.0 365.5 320.5 358.0 310.2 346.8 C 291.4 335.6 278.6 328.0 271.8 324.0 C 266.5 322.7 261.9 320.0 258.2 316.0 C 251.4 312.0 256.8 304.8 274.4 294.4 Z"
                      fill="url(#collar-brass)"
                      filter="url(#metal-patina)"
                      stroke="#402c1e"
                      strokeWidth="1.6"
                    />
                    <path d="M 254 309 C 282 286, 310 270, 336 261" fill="none" stroke="#926344" strokeWidth="2.2" opacity="0.11" />
                    {/* Machined pauldron anchor screws */}
                    <g fill="url(#ts-top)" stroke="#2c1d0e" strokeWidth="1.2">
                      <circle cx="292" cy="308" r="5.5" />
                      <circle cx="388" cy="296" r="5.5" />
                      <circle cx="364" cy="358" r="5.5" />
                      <path d="M 289 308 H 295 M 385 296 H 391 M 361 358 H 367" stroke="#2c1d0e" strokeWidth="1.3" />
                    </g>
                    <g transform="translate(345 325) rotate(-10) scale(1.15)" style={{ pointerEvents: 'none' }}>
                      <use href="#tat-dollar" stroke="#f1dca6" strokeWidth="1.7" opacity="0.4" transform="translate(0.9 1)" />
                      <use href="#tat-dollar" stroke="#2b1d0e" strokeWidth="1.7" opacity="0.75" />
                    </g>
                  </g>

                  <g id="right-pauldron-wrap">
                    <g id="right-pauldron">
                      <path
                        d="M 550.6 166.0 C 560.7 160.1 571.7 157.4 583.4 158.0 C 599.8 154.0 613.8 162.2 625.4 182.6 C 637.2 193.9 644.9 207.5 648.6 223.4 C 660.2 243.8 659.8 256.2 647.4 260.6 C 640.0 266.0 631.7 268.9 622.6 269.4 C 610.2 273.8 596.2 265.6 580.6 244.8 C 566.0 234.1 555.6 220.2 549.4 203.2 C 533.8 182.4 534.2 170.0 550.6 166.0 Z"
                        fill="url(#collar-brass)"
                        filter="url(#metal-patina)"
                        stroke="#412d1f"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 577.6 169.8 C 584.0 165.9 590.9 164.0 598.4 164.2 C 608.8 161.4 618.0 168.0 626.0 184.0 C 634.5 193.1 639.9 203.7 642.0 216.0 C 650.0 232.0 649.2 241.6 639.6 244.8 C 633.8 248.9 627.4 251.0 620.4 251.2 C 610.8 254.4 601.6 247.8 592.8 231.4 C 583.7 222.2 577.8 211.3 575.2 198.6 C 566.4 182.2 567.2 172.6 577.6 169.8 Z"
                        fill="#6f4c34"
                        opacity="0.55"
                      />
                      <path d="M 530 174 C 562 204, 588 238, 605 274" fill="none" stroke="#8d6042" strokeWidth="2" opacity="0.10" />
                      <g fill="url(#ts-top)" stroke="#2c1d0e" strokeWidth="1.1">
                        <circle cx="566" cy="184" r="4.8" />
                        <circle cx="628" cy="242" r="4.8" />
                        <path d="M 563.5 184 H 568.5 M 625.5 242 H 630.5" stroke="#2c1d0e" strokeWidth="1.2" />
                      </g>
                      <g transform="translate(612 205) rotate(28) scale(1.0)" style={{ pointerEvents: 'none' }}>
                        <use href="#tat-dollar" stroke="#f1dca6" strokeWidth="1.7" opacity="0.4" transform="translate(0.9 1)" />
                        <use href="#tat-dollar" stroke="#2b1d0e" strokeWidth="1.7" opacity="0.75" />
                      </g>
                    </g>
                  </g>

                  <g id="jet-tuck-wrap">
                  <g id="jet-follow">
                    <g id="jet-gimbal" transform="translate(742 672) rotate(40) scale(1.4)">
                      <g id="jet-flame" opacity="0">
                        <circle cx="46" cy="0" r="46" fill="url(#fl-glow)" />
                        <g id="jet-flame-body" transform="translate(30 0)">
                          <path d="M 0 -12 C 35 -26, 95 -16, 150 0 C 95 16, 35 26, 0 12 Z" fill="url(#fl-outer)" />
                          <path d="M 0 -8 C 30 -16, 70 -10, 108 0 C 70 10, 30 16, 0 8 Z" fill="url(#fl-mid)" />
                          <path d="M 0 -4.5 C 22 -8, 48 -5, 70 0 C 48 5, 22 8, 0 4.5 Z" fill="url(#fl-core)" />
                        </g>
                        <g id="jet-sparks" />
                      </g>
                      <ellipse cx="0" cy="0" rx="9" ry="17" fill="#3e2a1d" stroke="#211710" strokeWidth="1.5" />
                      <path d="M 0 -12 C 10 -13 20 -17 32 -21 C 36 -10 36 10 32 21 C 20 17 10 13 0 12 Z" fill="url(#leg-bronze-grad)" stroke="#281b13" strokeWidth="1.5" />
                      <path d="M 12 -15 C 14 -5 14 5 12 15" fill="none" stroke="#281b13" strokeWidth="2" />
                      <path d="M 24 -18 C 26 -6 26 6 24 18" fill="none" stroke="#281b13" strokeWidth="1.6" />
                      <ellipse cx="32" cy="0" rx="5" ry="20" fill="#1b160d" stroke="#281b13" strokeWidth="1.2" />
                      <ellipse id="jet-ember" cx="33" cy="0" rx="2.6" ry="12" fill="#e8a24a" opacity="0" />
                    </g>
                  </g>
                  </g>

                  <g id="tail-eject-wrap">
                  <g id="tail-mount">
                    <g id="curly-tail-group">
                      <path
                        d="M 692 612 C 716 598, 748 612, 756 638 C 764 664, 744 686, 718 682 C 694 678, 686 654, 702 636"
                        fill="none"
                        stroke="#1c0f06"
                        strokeWidth="13"
                        strokeLinecap="round"
                        filter="url(#tail-shadow)"
                      />
                      <ellipse cx="696" cy="634" rx="13" ry="18" transform="rotate(-12 696 634)" fill="#37473f" stroke="#202824" strokeWidth="1.8" />
                      <ellipse cx="696" cy="634" rx="7" ry="11" transform="rotate(-12 696 634)" fill="#1b231f" />
                      <path
                        d="M 696 634 C 716 616, 744 616, 756 634 C 766 650, 756 672, 736 678"
                        fill="none"
                        stroke="url(#tail-steel-grad)"
                        strokeWidth="11"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 696 634 C 716 616, 744 616, 756 634 C 766 650, 756 672, 736 678"
                        fill="none"
                        stroke="#28332e"
                        strokeWidth="11"
                        strokeLinecap="round"
                        opacity="0.25"
                      />
                      <path
                        d="M 736 678 C 716 682, 704 666, 710 646 C 716 626, 740 612, 762 622"
                        fill="none"
                        stroke="url(#tail-steel-grad)"
                        strokeWidth="10.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 762 622 C 780 630, 784 654, 768 670 C 754 684, 734 682, 724 668"
                        fill="none"
                        stroke="url(#tail-steel-grad)"
                        strokeWidth="10.5"
                        strokeLinecap="round"
                      />
                      <path d="M 702 629 C 720 615, 744 616, 754 631" fill="none" stroke="#739182" strokeWidth="2.2" strokeLinecap="round" opacity="0.11" />
                      <path
                        d="M 712 645 C 718 627, 740 614, 760 623 C 776 630, 780 651, 766 666"
                        fill="none"
                        stroke="#739182"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        opacity="0.12"
                      />
                      <path d="M 724 668 C 718 659, 718 648, 724 640" fill="none" stroke="#324039" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 724 668 C 718 659, 718 648, 724 640" fill="none" stroke="#5a7366" strokeWidth="5" strokeLinecap="round" />
                    </g>
                  </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>

          {/* Layer 2: Canvas Combat & Money-Hurt FX Overlay */}
          <canvas ref={canvasRef} width={WORLD_W} height={WORLD_H} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Layer 3: Player Hand/Cursor 5x2 Sprite (Coin hidden until released!) */}
          <div
            ref={cursorWrapRef}
            className="absolute top-0 left-0 pointer-events-none will-change-transform z-20"
            style={{
              width: `${spriteW}px`,
              height: `${spriteH}px`,
              marginLeft: `${-spriteW / 2}px`,
              marginTop: `${-spriteH / 2}px`,
            }}
          >
            <div ref={cursorFlipRef} className="relative w-full h-full will-change-transform">
              {!spriteError ? (
                <div className="w-full h-full overflow-hidden relative drop-shadow-[0_4px_6px_rgba(35,26,16,0.28)]">
                  <img
                    ref={spriteImgRef}
                    src={HAND_SPRITE_URL}
                    alt="Player cursor hand sprite"
                    referrerPolicy="no-referrer"
                    draggable={false}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        const cellW = img.naturalWidth / SPRITE_COLS;
                        const cellH = img.naturalHeight / SPRITE_ROWS;
                        setSpriteCellRatio(cellW / cellH);
                      }
                    }}
                    onError={() => setSpriteError(true)}
                    className="block max-w-none will-change-transform"
                    style={{
                      width: `${SPRITE_COLS * 100}%`,
                      height: `${SPRITE_ROWS * 100}%`,
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
              ) : (
                <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
                  <circle cx="32" cy="32" r="24" fill="#FFFDF9" stroke="#231A10" strokeWidth="3" />
                  <path d="M 32 16 V 44 M 22 34 L 32 46 L 42 34" stroke="#B45309" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* TITLE MENU */}
        {phase === 'TITLE_MENU' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center lg:justify-end p-4 md:p-10 pointer-events-none">
            <div
              data-ui-card="true"
              className="pointer-events-auto w-full max-w-md bg-[#FFFDF9]/95 backdrop-blur-md border border-[#231A10]/15 rounded-2xl shadow-xl p-6 md:p-7"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-[#EFE9DD] border border-[#231A10]/12 overflow-hidden flex items-center justify-center shrink-0">
                  {!coinError ? (
                    <img src={COIN_SPRITE_URL} alt="Coin preview" referrerPolicy="no-referrer" className="w-8 h-8 object-contain" />
                  ) : (
                    <IconCoins className="w-5 h-5 text-[#B45309]" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-[#8C6432]">Pattern Prediction Coin Drop</div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-[#231A10] tracking-tight leading-tight">
                    Cursor vs. Brass Piggy
                  </h1>
                </div>
              </div>

              <p className="mt-2.5 text-sm text-[#5A4A38] leading-relaxed">
                Drop <strong>3 coins in a row</strong> into the chest slot without missing or letting the pressure vent — keep the piggy pumped and it explodes!
              </p>

              <div className="mt-5">
                <div className="text-xs font-semibold text-[#473827] mb-2">Difficulty</div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EFE9DD] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDifficulty('STANDARD')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      difficulty === 'STANDARD' ? 'bg-[#FFFDF9] text-[#231A10] shadow-sm' : 'text-[#5A4A38] hover:text-[#231A10]'
                    }`}
                  >
                    Standard Patterns
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficulty('FRENZY')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      difficulty === 'FRENZY' ? 'bg-[#FFFDF9] text-[#231A10] shadow-sm' : 'text-[#5A4A38] hover:text-[#231A10]'
                    }`}
                  >
                    Frenzy Speed
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#231A10]/10 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#473827]">
                <div>
                  <span className="font-semibold text-[#231A10]">Quick Tap</span> · Short Hop &amp; Snap
                </div>
                <div>
                  <span className="font-semibold text-[#231A10]">Hold + Release</span> · Charge &amp; Glide
                </div>
                <div>
                  <span className="font-semibold text-[#231A10]">R / Empty</span> · Orbit Reload
                </div>
                <div>
                  <span className="font-semibold text-[#231A10]">Space (Hold)</span> · Dash / Glide
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#231A10]/10 flex items-center justify-between text-xs text-[#5A4A38]">
                <span>3 slot drops in a row breaks · Misses vent pressure</span>
                <span className="font-mono-tabular font-semibold text-[#15803D]">Best: ${hud.bestScore.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={() => startFight(difficulty)}
                className="mt-5 w-full py-3 px-5 rounded-xl bg-[#B45309] hover:bg-[#92400E] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                Start Filling
              </button>
              <p className="mt-2.5 text-center text-[11px] text-[#6B5A46]">
                Tip: Keep it pumped! Land 3 synced slot drops before the hold bar vents or a coin misses.
              </p>
            </div>
          </div>
        )}

        {/* PAUSED MODAL */}
        {phase === 'PAUSED' && (
          <div className="absolute inset-0 z-30 bg-[#231A10]/25 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div data-ui-card="true" className="w-full max-w-sm bg-[#FFFDF9] border border-[#231A10]/15 rounded-2xl shadow-xl p-6 text-center">
              <h2 className="font-display text-2xl font-bold text-[#231A10]">Fight Paused</h2>
              <p className="mt-1.5 text-sm text-[#5A4A38]">
                Round {hud.round} · Money <span className="font-mono-tabular font-bold text-[#15803D]">${hud.score.toLocaleString()}</span>
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={togglePause}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Resume Fight
                </button>
                <button
                  type="button"
                  onClick={() => startFight(difficulty)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EFE9DD] hover:bg-[#E5DCCB] text-[#231A10] font-semibold text-sm transition-colors cursor-pointer"
                >
                  Restart Duel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    simRef.current.phase = 'TITLE_MENU';
                    setPhase('TITLE_MENU');
                  }}
                  className="w-full py-2 px-4 rounded-xl text-[#5A4A38] hover:text-[#231A10] text-xs font-medium transition-colors cursor-pointer"
                >
                  Back to Title
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WHITEPAPER MODAL (Displayed when Piggybank Explodes!) */}
        {phase === 'WHITEPAPER' && (
          <div className="absolute inset-0 z-40 bg-[#0A0906]/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
            <div
              data-ui-card="true"
              className="w-full max-w-4xl h-[88vh] max-h-[820px] bg-[#0B0A07] border border-[#D4A45E]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F5EFE0]"
            >
              {/* Modal Header */}
              <div className="shrink-0 px-4 md:px-6 py-3.5 border-b border-[#D4A45E]/25 bg-[#12100B] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#D4A45E]/15 border border-[#D4A45E]/40 flex items-center justify-center text-[#E6BF73] shrink-0">
                    <IconFileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#E6BF73]">
                      Piggybank Cracked · Round {hud.round} Cleared (+${(400 * hud.round).toLocaleString()} Bonus)
                    </div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-[#FFFDF9] leading-tight">
                      BABANK Whitepaper v1.8 — Reward Unlocked
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex p-0.5 rounded-lg bg-[#1C1810] border border-[#D4A45E]/20">
                    <button
                      type="button"
                      onClick={() => setWpTab('PDF')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                        wpTab === 'PDF' ? 'bg-[#D4A45E] text-[#141008]' : 'text-[#CFC3A8] hover:text-white'
                      }`}
                    >
                      Full PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setWpTab('SUMMARY')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                        wpTab === 'SUMMARY' ? 'bg-[#D4A45E] text-[#141008]' : 'text-[#CFC3A8] hover:text-white'
                      }`}
                    >
                      Executive Summary
                    </button>
                  </div>

                  <a
                    href={whitepaperUrl}
                    download="BABANK_Whitepaper_v1.8.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4A45E]/35 bg-[#1C1810] hover:bg-[#2A2316] text-[#E6BF73] text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    <IconDownload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download PDF</span>
                  </a>
                </div>
              </div>

              {/* Whitepaper Content Body */}
              <div className="flex-1 min-h-0 overflow-hidden bg-[#0B0A07]">
                {wpTab === 'PDF' ? (
                  <div className="w-full h-full flex flex-col">
                    <iframe
                      src={`${whitepaperUrl}#view=FitH`}
                      title="BABANK Whitepaper v1.8 PDF"
                      className="w-full flex-1 border-0 bg-[#14120D]"
                    />
                    <div className="shrink-0 px-4 py-2 bg-[#12100B] border-t border-[#D4A45E]/20 flex items-center justify-between text-[11px] text-[#BFB397]">
                      <span>BABANK Whitepaper v1.8 · November 2026 · Sui Network ($BABANK)</span>
                      <button
                        type="button"
                        onClick={() => setWpTab('SUMMARY')}
                        className="text-[#E6BF73] hover:underline font-semibold cursor-pointer"
                      >
                        Read structured text view →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-y-auto p-5 md:p-8 space-y-6 text-sm leading-relaxed text-[#E7DFCD]">
                    <div className="border border-[#D4A45E]/35 rounded-xl p-5 bg-[#12100A] text-center">
                      <div className="font-display text-3xl font-bold tracking-wide text-[#D4A45E]">BABANK</div>
                      <p className="mt-1 text-xs text-[#BFB397]">
                        Version 1.8 · November 2026 · Blockchain: Sui Network · Token: $BABANK · Total Supply: 1,000,000,000,000 (1 Trillion)
                      </p>
                      <p className="mt-3 text-base italic font-semibold text-[#E6BF73]">
                        &ldquo;The token that teaches you how to invest.&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-[#CFC3A8] max-w-2xl mx-auto">
                        Babank uses $BABANK as the engine of financial education. Every trade you simulate, every lesson you complete, and every challenge you win earns $BABANK token — turning learning to invest into a rewarding, zero-risk mobile trading simulator game powered by Sui.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-[#D4A45E]/25 rounded-xl p-4 bg-[#12100A]">
                        <h3 className="text-sm font-bold text-[#D4A45E] mb-2">Corporate Structure</h3>
                        <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
                          <dt className="text-[#9E9279]">Entity</dt>
                          <dd className="font-medium text-[#FFFDF9]">BABANK LTD (HE 445942)</dd>
                          <dt className="text-[#9E9279]">Jurisdiction</dt>
                          <dd>Republic of Cyprus (Limassol)</dd>
                          <dt className="text-[#9E9279]">Incorporated</dt>
                          <dd>10 April 2023</dd>
                          <dt className="text-[#9E9279]">Registry</dt>
                          <dd>Cyprus Registrar of Companies</dd>
                        </dl>
                      </div>

                      <div className="border border-[#D4A45E]/25 rounded-xl p-4 bg-[#12100A]">
                        <h3 className="text-sm font-bold text-[#D4A45E] mb-2">1. The Problem &amp; Dual-Economy</h3>
                        <p className="text-xs text-[#CFC3A8]">
                          $124 trillion in US household wealth is projected to change hands by 2048 (Cerulli Associates, 2024). Babank separates <strong>Simulation Capital ($10,000 Virtual USD)</strong> for safe practice from <strong>$BABANK Reward Tokens</strong> earned via Counter-Logic Mining (no GPUs, no electricity).
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#D4A45E]/25 rounded-xl p-4 bg-[#12100A]">
                      <h3 className="text-sm font-bold text-[#D4A45E] mb-2.5">Tokenomics &amp; Distribution (1 Trillion Fixed Cap)</h3>
                      <div className="grid sm:grid-cols-5 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-[#1A160E] border border-[#D4A45E]/20">
                          <div className="font-mono-tabular text-base font-bold text-[#E6BF73]">50%</div>
                          <div className="font-semibold text-[#FFFDF9]">Prize Pools &amp; Staking</div>
                          <div className="text-[11px] text-[#9E9279]">500B Tokens</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#1A160E] border border-[#D4A45E]/20">
                          <div className="font-mono-tabular text-base font-bold text-[#E6BF73]">20%</div>
                          <div className="font-semibold text-[#FFFDF9]">Liquidity &amp; DEX</div>
                          <div className="text-[11px] text-[#9E9279]">200B · Live on Cetus</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#1A160E] border border-[#D4A45E]/20">
                          <div className="font-mono-tabular text-base font-bold text-[#E6BF73]">15%</div>
                          <div className="font-semibold text-[#FFFDF9]">Community Airdrops</div>
                          <div className="text-[11px] text-[#9E9279]">150B Tokens</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#1A160E] border border-[#D4A45E]/20">
                          <div className="font-mono-tabular text-base font-bold text-[#E6BF73]">10%</div>
                          <div className="font-semibold text-[#FFFDF9]">Dev &amp; Core Team</div>
                          <div className="text-[11px] text-[#9E9279]">100B · 24m Vesting</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#1A160E] border border-[#D4A45E]/20">
                          <div className="font-mono-tabular text-base font-bold text-[#E6BF73]">5%</div>
                          <div className="font-semibold text-[#FFFDF9]">Marketing</div>
                          <div className="text-[11px] text-[#9E9279]">50B Tokens</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#D4A45E]/15 text-[11px] font-mono-tabular text-[#BFB397] space-y-1 break-all">
                        <div>Active Testnet: 0x3994138689fa31fb51313e3f97fc4440666ffa4fff18708aa53e3b8c03c6084a::babank::BABANK</div>
                        <div>Legacy Mainnet: 0x7ae454ddee04d24634981df08a856927dfd28b0ca5f28aea5dcb06fcb6913a85::babank::BABANK</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div className="border border-[#D4A45E]/25 rounded-xl p-3.5 bg-[#12100A]">
                        <div className="font-bold text-[#E6BF73]">Phase 1 · Q3 2026</div>
                        <div className="mt-1 text-[#CFC3A8]">Simulator Broker Launch (web + PWA), first 10,000 Pioneers, $BABANK rewards &amp; Cetus LP.</div>
                      </div>
                      <div className="border border-[#D4A45E]/25 rounded-xl p-3.5 bg-[#12100A]">
                        <div className="font-bold text-[#E6BF73]">Phase 2 · Q1 2027</div>
                        <div className="mt-1 text-[#CFC3A8]">Skill trees, Staking &amp; DAO governance, NFT Broker Collection &amp; 3-Year Babank Certification.</div>
                      </div>
                      <div className="border border-[#D4A45E]/25 rounded-xl p-3.5 bg-[#12100A]">
                        <div className="font-bold text-[#E6BF73]">Phase 3 · Q3 2027</div>
                        <div className="mt-1 text-[#CFC3A8]">iOS &amp; Android listings, real-money paper-trading bridge &amp; certified trader pathways.</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#9E9279] border-t border-[#D4A45E]/15 pt-3">
                      Disclaimer: Informational &amp; educational purposes only. Not financial advice. $BABANK is an educational utility token earned through verified in-app gameplay mechanics. · babank.org · @Babankltd
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer CTA */}
              <div className="shrink-0 px-4 md:px-6 py-3.5 border-t border-[#D4A45E]/25 bg-[#12100B] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#CFC3A8]">
                  Money Earned: <span className="font-mono-tabular font-bold text-[#4ADE80]">${hud.score.toLocaleString()}</span> · Piggies Broken:{' '}
                  <span className="font-mono-tabular font-bold text-[#E6BF73]">{hud.piggiesBroken}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setupRound(simRef.current.round + 1, false)}
                  className="py-2.5 px-5 rounded-xl bg-[#D4A45E] hover:bg-[#E6BF73] active:scale-[0.99] text-[#141008] font-bold text-sm transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <IconPlay className="w-4 h-4" />
                  Continue to Round {hud.round + 1}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GAME OVER MODAL */}
        {phase === 'GAME_OVER' && (
          <div className="absolute inset-0 z-30 bg-[#231A10]/30 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div data-ui-card="true" className="w-full max-w-md bg-[#FFFDF9] border border-[#231A10]/15 rounded-2xl shadow-xl p-6 md:p-7">
              <div className="text-xs font-semibold text-[#DC2626]">Cursor Knocked Out</div>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#231A10]">
                {hud.score > 0 && hud.score >= hud.bestScore ? 'New Money Record!' : 'Fight Complete'}
              </h2>

              <div className="mt-5 grid grid-cols-3 gap-3 py-4 border-y border-[#231A10]/10 text-center">
                <div>
                  <div className="text-[11px] font-medium text-[#6B5A46]">Money Earned</div>
                  <div className="font-mono-tabular text-xl font-bold text-[#15803D] mt-0.5">${hud.score.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#6B5A46]">Best</div>
                  <div className="font-mono-tabular text-xl font-bold text-[#B45309] mt-0.5">${hud.bestScore.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#6B5A46]">Piggies Broken</div>
                  <div className="font-mono-tabular text-xl font-bold text-[#231A10] mt-0.5">{hud.piggiesBroken}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#5A4A38]">
                <span>Slot drops landed: <strong className="font-mono-tabular text-[#231A10]">{hud.slotDrops}</strong></span>
                <span>Round reached: <strong className="font-mono-tabular text-[#231A10]">{hud.round}</strong></span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => startFight(difficulty)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <IconRotateCcw className="w-4 h-4" />
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    simRef.current.phase = 'TITLE_MENU';
                    setPhase('TITLE_MENU');
                  }}
                  className="py-3 px-4 rounded-xl bg-[#EFE9DD] hover:bg-[#E5DCCB] text-[#231A10] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM BAR */}
      <footer className="relative z-30 shrink-0 px-4 py-2 bg-[#FFFDF9]/95 border-t border-[#231A10]/10 flex items-center justify-between gap-3 text-xs text-[#5A4A38]">
        <div className="flex items-center gap-3">
          <span className={`font-semibold ${hud.isNervous ? 'text-[#DC2626]' : 'text-[#231A10]'}`}>
            {hud.bossActionLabel}
          </span>
          {hud.isNervous && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#DC2626]/12 text-[#DC2626] border border-[#DC2626]/25 font-mono-tabular text-[11px] font-bold">
              NERVOUS {hud.nervousPct}%
            </span>
          )}
          {hud.handStateLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0284C7]/12 text-[#0369A1] border border-[#0284C7]/25 font-mono-tabular text-[11px] font-bold">
              {hud.handStateLabel}
            </span>
          )}
          {hud.combo > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular font-semibold text-[#15803D]">{hud.combo} Drop Combo</span>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span>Tap · Hop</span>
          <span aria-hidden="true">·</span>
          <span>Hold / Release · Charge &amp; Glide ({hud.revolverChambers}/{hud.revolverMax})</span>
          <span aria-hidden="true">·</span>
          <span>Q · Laser ({hud.laserLabel})</span>
          <span aria-hidden="true">·</span>
          <span>R · Reload</span>
          <span aria-hidden="true">·</span>
          <span>Space · Dash / Glide</span>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onPointerDown={startHandPress}
            onPointerUp={releaseHandPress}
            onPointerCancel={releaseHandPress}
            className="h-10 px-3.5 rounded-xl bg-[#B45309] text-white font-semibold inline-flex items-center gap-1.5 touch-none"
          >
            <IconCoins className="w-3.5 h-3.5" />
            {hud.isReloading
              ? `${hud.reloadPct}%`
              : hud.handChargePct > 0
              ? `${hud.handChargePct}%`
              : `Tap/Hold (${hud.revolverChambers})`}
          </button>
          <button
            type="button"
            onPointerDown={() => startRevolverReload(true)}
            className="h-10 px-3 rounded-xl bg-[#EFE9DD] text-[#231A10] font-semibold inline-flex items-center gap-1 touch-none"
          >
            <IconRotateCcw className="w-3.5 h-3.5" />
            Reload
          </button>
          <button
            type="button"
            onPointerDown={() => performDash(true)}
            onPointerUp={() => {
              simRef.current.dashHolding = false;
            }}
            onPointerCancel={() => {
              simRef.current.dashHolding = false;
            }}
            className="h-10 px-3.5 rounded-xl bg-[#EFE9DD] text-[#231A10] font-semibold inline-flex items-center gap-1.5 touch-none"
          >
            <IconZap className="w-3.5 h-3.5" />
            Dash
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1.5 font-mono-tabular text-[#473827]">
          <IconDollarSign className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Exploded: {hud.piggiesBroken}</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <PiggyDuelPlugin className="w-screen h-screen" />;
}

