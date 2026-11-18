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
type BossAction = 'PATTERN_MOVE' | 'PATTERN_STOP' | 'JET_FLIGHT' | 'BOUNCY_BALL' | 'BREAKING';
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
  life: number;
  maxLife: number;
  speed: number;
  thr: number;
  belly: number;
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

interface HudState {
  score: number;
  bestScore: number;
  round: number;
  patternName: string;
  spotIndex: number;
  spotTotal: number;
  pumpProgress: number;
  pumpTarget: number;
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

  public playPiggyBreak() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pop boom
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sawtooth';
    boom.frequency.setValueAtTime(190, now);
    boom.frequency.exponentialRampToValueAtTime(42, now + 0.35);
    boomGain.gain.setValueAtTime(0.22, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    boom.connect(boomGain).connect(ctx.destination);
    boom.start(now);
    boom.stop(now + 0.38);

    // Jackpot coin cascade
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + 0.08 + i * 0.06);
      gain.gain.setValueAtTime(0.13, now + 0.08 + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + i * 0.06 + 0.32);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + 0.08 + i * 0.06);
      osc.stop(now + 0.08 + i * 0.06 + 0.34);
    });
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
    pumpTarget: initialDifficulty === 'FRENZY' ? 24 : 18,
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

    // Varied Targeting Laser Oscillator (Curved Slings & Straight Rails at varying speeds!)
    laserModeSetting: 'AUTO' as LaserModeSetting,
    laserStyle: 'SLING_ARC' as LaserStyleId,
    laserIndex: 0,
    laserSwitchTimer: 4.8,
    slingPhase: 0,
    slingSubPhase: 1.1,
    slingSpeed: 2.65,
    slingTargetSpeed: 2.65,
    slingSubSpeed: 4.2,
    slingTargetSubSpeed: 4.2,
    slingAngleSpan: 0.68,
    slingTargetAngleSpan: 0.68,
    slingPowerBias: 0,
    slingTargetPowerBias: 0,
    slingMorphTimer: 1.8,
    slingSeed: 0.65,
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
    pumpTarget: 14,
    bossAction: 'PATTERN_STOP' as BossAction,
    bossTimer: 1.0,
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
    stopsSinceBall: 0,
    ballTriggerStops: 3,

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

    // Canvas FX pools
    projectiles: [] as Projectile[],
    particles: [] as CanvasParticle[],
    floaters: [] as CanvasFloater[],
    piggyTrail: [] as DualTrailPoint[],
    landingRings: [] as LandingRing[],
    impactFlashes: [] as ImpactFlash[],
    droppingCoins: [] as DroppingCoin[],
    slotIntakePulses: [] as SlotIntakePulse[],
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
    slotFollow: null as SVGGElement | null,
    jetFollow: null as SVGGElement | null,
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
  });

  useEffect(() => {
    simRef.current.phase = phase;
  }, [phase]);

  useEffect(() => {
    simRef.current.difficulty = difficulty;
  }, [difficulty]);

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

  const getSlotHolePos = () => {
    const s = simRef.current;
    const aS = Math.min(1.3, s.bellyGoal + s.ballMorph * 0.42);
    const sgS = 150 + 70 * aS;
    const gS = 0.9 * aS;
    const dxS = 545 - 560;
    const dyS = 450 - 650;
    const kS = gS * Math.exp(-(dxS * dxS + dyS * dyS) / (2 * sgS * sgS));
    const slotOffX = dxS * kS;
    const slotOffY = dyS * kS;

    const baseRelX = (512 + slotOffX - 550) * PIGGY_SCALE * (s.dir > 0 ? -1 : 1);
    const baseRelY = (348 + slotOffY - 545) * PIGGY_SCALE;
    const screenRad = (s.dir > 0 ? -1 : 1) * ((s.ballAngle * s.ballMorph * Math.PI) / 180);
    const cosA = Math.cos(screenRad);
    const sinA = Math.sin(screenRad);
    const rotX = baseRelX * cosA - baseRelY * sinA;
    const rotY = baseRelX * sinA + baseRelY * cosA;
    const centerY = FLOOR_Y + s.py + (545 + 46 * s.ballMorph - 911) * PIGGY_SCALE;
    return {
      x: s.px + rotX,
      y: centerY + rotY,
    };
  };

  // Shared live trajectory solver supporting both curved sling arcs and non-curved straight laser beams
  const getSlingLaunchState = () => {
    const s = simRef.current;
    const profile = LASER_PROFILES[s.laserStyle];
    const slot = getSlotHolePos();
    const dxRaw = slot.x - s.cx;
    const dyRaw = slot.y - s.cy;
    const dist = Math.hypot(dxRaw, dyRaw);

    let baseAngle = Math.atan2(dyRaw, dxRaw);
    let baseSpeed = profile.straightSpeed;
    const gravity = profile.gravity;

    if (profile.curved) {
      // Smoothly blend between overhead drop sling and side/underneath rainbow slingshot lob
      const lobBlend = Math.max(0, Math.min(1, (160 - dyRaw) / 240));
      const flightT = (0.31 + lobBlend * 0.28 + Math.min(0.3, dist / 2300)) * profile.flightScale;
      const idealVx = dxRaw / flightT;
      const idealVy = (dyRaw - 0.5 * gravity * flightT * flightT) / flightT;
      baseAngle = Math.atan2(idealVy, idealVx);
      baseSpeed = Math.min(1680, Math.hypot(idealVx, idealVy));
    }

    // Organic randomized sweep across angle & launch speed/power
    const sweepAngle =
      Math.sin(s.slingPhase) * s.slingAngleSpan +
      Math.sin(s.slingSubPhase + s.slingSeed) * (s.slingAngleSpan * 0.32);
    const sweepPower =
      1 +
      Math.cos(s.slingPhase * 0.82 + s.slingSeed * 1.4) * profile.powerSwing +
      s.slingPowerBias * (profile.curved ? 1 : 0.45);

    const launchAngle = baseAngle + sweepAngle;
    const launchSpeed = Math.max(260, baseSpeed * sweepPower);
    const vx = Math.cos(launchAngle) * launchSpeed + (profile.curved ? s.velX * 0.06 : 0);
    const vy = Math.sin(launchAngle) * launchSpeed;
    const launchFacing = vx >= 0 ? 1 : -1;

    return {
      spawnX: s.cx + Math.cos(launchAngle) * 10,
      spawnY: s.cy + Math.sin(launchAngle) * 6 + 6,
      vx,
      vy,
      gravity,
      profile,
      launchAngle,
      baseAngle,
      facing: launchFacing,
      slot,
    };
  };

  const setupRound = useCallback((roundNum: number, resetRun: boolean) => {
    const s = simRef.current;
    const frenzyAdd = s.difficulty === 'FRENZY' ? 6 : 0;
    const targetCoins = 18 + (roundNum - 1) * 5 + frenzyAdd;

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
    s.pressureBleedFxAcc = 0;
    s.bossAction = 'PATTERN_STOP';
    s.bossTimer = stopDur;
    s.bossFlash = 0;
    s.hurtTimer = 0;
    s.breakTimer = 0;
    s.ballMorph = 0;
    s.ballAngle = 0;
    s.ballSpin = 0;
    s.ballVx = 0;
    s.ballVy = 0;
    s.ballTimer = 0;
    s.stopsSinceBall = 0;
    s.ballTriggerStops = s.difficulty === 'FRENZY' ? 2 : 3;
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
    s.dashCooldown = 0;
    s.dashTimer = 0;
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
    s.landingRings = [];
    s.impactFlashes = [];
    s.droppingCoins = [];
    s.slotIntakePulses = [];
    const initProfile =
      s.laserModeSetting === 'AUTO'
        ? LASER_PROFILES[LASER_STYLE_ORDER[(roundNum - 1) % LASER_STYLE_ORDER.length]]
        : LASER_PROFILES[s.laserModeSetting];
    s.laserStyle = initProfile.id;
    s.laserIndex = LASER_STYLE_ORDER.indexOf(initProfile.id);
    s.laserSwitchTimer = 4.6;
    s.slingPhase = 0;
    s.slingSubPhase = Math.random() * Math.PI * 2;
    s.slingSpeed = initProfile.sweepRate;
    s.slingTargetSpeed = initProfile.sweepRate;
    s.slingSubSpeed = initProfile.subRate;
    s.slingTargetSubSpeed = initProfile.subRate;
    s.slingAngleSpan = initProfile.angleSpan;
    s.slingTargetAngleSpan = initProfile.angleSpan;
    s.slingPowerBias = 0;
    s.slingTargetPowerBias = 0;
    s.slingMorphTimer = 1.45;
    s.slingSeed = Math.random() * Math.PI * 2;
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
    (fromHold = false) => {
      const s = simRef.current;
      synthRef.current?.unlock();
      if (s.phase !== 'PLAYING' && s.phase !== 'TITLE_MENU') return;
      if (s.throwCooldown > 0) return;

      if (s.isReloading) {
        if (!fromHold) {
          s.dryClickFlash = 0.22;
          synthRef.current?.playDryClick();
        }
        return;
      }

      if (s.revolverChambers <= 0) {
        if (!fromHold) {
          s.dryClickFlash = 0.22;
          synthRef.current?.playDryClick();
        }
        startRevolverReload(false);
        return;
      }

      const launch = getSlingLaunchState();
      s.revolverChambers -= 1;
      s.cylinderTargetAngle += (Math.PI * 2) / s.revolverMax;
      s.throwCooldown = s.throwCooldownMax;
      s.throwAnimTimer = 0.13;
      s.facing = -launch.facing;
      synthRef.current?.playThrow();

      s.projectiles.push({
        kind: 'thrown_coin',
        x: launch.spawnX,
        y: launch.spawnY,
        vx: launch.vx,
        vy: launch.vy,
        r: 21,
        rot: 0,
        vrot: launch.facing * 680,
        life: 2.0,
        maxLife: 2.0,
        gravity: launch.gravity,
        bounces: 0,
        armorHitCooldown: 0,
      });

      // Subtle playful sling twist after firing a chamber
      s.slingTargetPowerBias = Math.max(-0.24, Math.min(0.24, s.slingTargetPowerBias + (Math.random() - 0.5) * 0.16));

      // Revolver empties -> swing out cylinder & sweep orbit threshold to reload
      if (s.revolverChambers <= 0) {
        startRevolverReload(true);
      }
    },
    [startRevolverReload]
  );

  const performDash = useCallback(() => {
    const s = simRef.current;
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
    s.throwAnimTimer = 0.14;
    synthRef.current?.playDash();
    spawnBurst(s.cx, s.cy, '#38BDF8', 10, 260, 0);
  }, []);

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
      s.targetCx = nx;
      s.targetCy = ny;
      if (s.dashTimer <= 0) {
        s.cx = nx;
        s.cy = ny;
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
      if (s.phase === 'TITLE_MENU') {
        s.throwHolding = false;
        throwCoin(false);
        return;
      }
      if (s.phase !== 'PLAYING') return;
      if (e.button === 2) {
        e.preventDefault();
        performDash();
      } else {
        s.throwHolding = true;
        throwCoin(false);
      }
    };

    const onPointerUp = () => {
      simRef.current.throwHolding = false;
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
          if (!e.repeat) performDash();
        }
      } else if (e.key === 'j' || e.key === 'J' || e.key === 'f' || e.key === 'F') {
        if (s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') {
          s.throwHolding = true;
          if (!e.repeat) throwCoin(false);
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
        simRef.current.throwHolding = false;
      }
    };

    const rootEl = rootRef.current;
    rootEl?.addEventListener('pointerenter', onPointerEnter);
    rootEl?.addEventListener('pointerleave', onPointerLeave);
    rootEl?.addEventListener('pointerdown', onPointerDown);
    rootEl?.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      rootEl?.removeEventListener('pointerenter', onPointerEnter);
      rootEl?.removeEventListener('pointerleave', onPointerLeave);
      rootEl?.removeEventListener('pointerdown', onPointerDown);
      rootEl?.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [cycleLaserMode, performDash, setupRound, startRevolverReload, throwCoin]);

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
    const legSVG = (i: number, T: number) => `<g id="L${i}">
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
      </g></g>`;
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
    s.slotFollow = $('slot-follow') as SVGGElement;
    s.jetFollow = $('jet-follow') as SVGGElement;
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

    const applyBalloon = (a: number, st = 0, wob = 0) => {
      const CX = 560;
      const CY = 650;
      const sg = 150 + 70 * a;
      const gain = 0.9 * a;
      const grow = 1 + 0.55 * a;
      const fmt = (v: number) => v.toFixed(1);

      const push = (x: number, y: number): [number, number] => {
        const dx = x - CX;
        const dy = y - CY;
        const r2 = dx * dx + dy * dy;
        const k = gain * Math.exp(-r2 / (2 * sg * sg));
        const ang = Math.atan2(dy, dx);
        const ripple = 1 + wob * Math.sin(Math.sqrt(r2) * 0.035 - s.ripplePhase + ang * 2);
        return [x + dx * k * ripple * (1 - st), y + dy * k * ripple * (1 + st)];
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
        e.el.setAttribute('cx', fmt(nx));
        e.el.setAttribute('cy', fmt(ny));
        e.el.setAttribute('rx', fmt(e.rx * grow * (1 - st * 0.6)));
        e.el.setAttribute('ry', fmt(e.ry * grow * (1 + st * 0.6)));
        if (e.ang) e.el.setAttribute('transform', `rotate(${e.ang} ${fmt(nx)} ${fmt(ny)})`);
      }

      const [tx, ty] = push(696, 634);
      s.tailMount?.setAttribute('transform', `translate(${fmt(tx - 696)} ${fmt(ty - 634)})`);

      // Coin slot follows slow bellyGoal + ballMorph roundness smoothly
      const aS = Math.min(1.3, s.bellyGoal + s.ballMorph * 0.42);
      const sgS = 150 + 70 * aS;
      const gS = 0.9 * aS;
      const dxS = 545 - CX;
      const dyS = 450 - CY;
      const kS = gS * Math.exp(-(dxS * dxS + dyS * dyS) / (2 * sgS * sgS));
      const px = 545 + dxS * kS;
      const py = 450 + dyS * kS;
      const ss = 1 + 0.3 * aS;
      s.slotFollow?.setAttribute(
        'transform',
        `translate(${fmt(px - 545)} ${fmt(py - 450)}) translate(545 450) scale(${fmt(ss)} ${fmt(ss)}) translate(-545 -450)`
      );

      const [jx, jy] = push(742, 672);
      s.jetFollow?.setAttribute('transform', `translate(${fmt(jx - 742)} ${fmt(jy - 672)})`);
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
      const la = s.spLa.step(8 * mm * s1 + clampAbs(s.ay * 0.014, 16) - lean * 0.85 + windupArm - landFlex * 18, dt);
      const ra = s.spRa.step(-7 * mm * s1 - clampAbs(s.ay * 0.014, 16) - lean * 0.85 - windupArm + landFlex * 18, dt);
      const airTailDrag = -s.dir * Math.min(18, Math.abs(s.realVx) * 0.018) + clampAbs(s.vAlt * 0.035, 16);
      const tl = s.spTail.step(15 * mm * Math.sin(2 * s.phi + 0.8) - clampAbs(s.ay * 0.022, 24) + lean * 1.45 + airTailDrag, dt);

      // Realistic footstep dust + subtle step thud when sprinting on ground
      if (s.onGround && airK < 0.18 && s.walkM > 0.35 && Math.floor(s.phi / Math.PI) !== s.stepNo) {
        s.stepNo = Math.floor(s.phi / Math.PI);
        s.bellyVel += 0.015 * Math.min(s.walkM, 1.7);
        if (s.walkM > 0.65) {
          spawnDustPuff(s.px - s.dir * 16, FLOOR_Y - 2, -s.dir, 2, 95);
          synthRef.current?.playStep();
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
      const limbFade = Math.max(0, 1 - m * 1.55);
      if (s.legsG) {
        if (m > 0.005) {
          const legSc = 1 - 0.88 * m;
          s.legsG.setAttribute(
            'transform',
            `translate(${(vibX * 1.3).toFixed(2)} ${(dyN + vibY * 1.3 - 120 * m).toFixed(2)}) translate(550 760) scale(${legSc.toFixed(3)}) translate(-550 -760)`
          );
          s.legsG.style.opacity = limbFade.toFixed(2);
        } else {
          s.legsG.setAttribute('transform', `translate(${(vibX * 1.3).toFixed(2)} ${(dyN + vibY * 1.3).toFixed(2)})`);
          s.legsG.style.opacity = '1';
        }
      }
      if (s.la) s.la.style.opacity = m > 0.005 ? limbFade.toFixed(2) : '1';
      if (s.ra) s.ra.style.opacity = m > 0.005 ? limbFade.toFixed(2) : '1';
      if (s.tailMount) s.tailMount.style.opacity = m > 0.005 ? limbFade.toFixed(2) : '1';
      const strainJitter =
        s.bossAction === 'BREAKING'
          ? Math.sin(nowMs * 0.05) * 12
          : s.bellyLevel > 0.72
          ? Math.sin(nowMs * 0.035) * (s.bellyLevel - 0.72) * 16
          : 0;
      const hurtShakeX = s.hurtTimer > 0 ? Math.sin(s.hurtTimer * 55) * 12 * s.hurtDir : 0;

      const climbTilt = airK * clampAbs(-s.vAlt * 0.022, 9);
      const bodyRotBase =
        (-2.2 * mm + 1.3 * mm * Math.sin(2 * s.phi)) * (1 - airK) +
        airK * (-12.5 * Math.min(mm, 1.7) / 1.7 + 1.8 * Math.sin(nowMs * 0.003)) +
        lean * 0.6 +
        climbTilt +
        landFlex * 4.5 +
        vibR +
        strainJitter +
        s.slotReceiveTilt;
      const bodyRot = bodyRotBase * (1 - m) + s.ballAngle * m;
      const ballPivotY = 750 * (1 - m) + 545 * m;
      const ballDropY = dyN * (1 - m) + 46 * m;
      const bodySx = 1 + sx * (1 - m);
      const bodySy = 1 - sq * (1 - m);

      s.bodyG?.setAttribute(
        'transform',
        `translate(${(hurtShakeX + vibX).toFixed(2)} ${(ballDropY + vibY).toFixed(2)}) translate(550 790) scale(${bodySx.toFixed(4)} ${bodySy.toFixed(4)}) translate(-550 -790) rotate(${bodyRot.toFixed(2)} 550 ${ballPivotY.toFixed(1)})`
      );
      const earFlop = landFlex * 14 + speedNorm * 7 * s.dir;
      armT(s.la, la + vb * 1.6 * Math.sin(nowMs * 0.12), 300, 345);
      armT(s.ra, ra + vb * 1.6 * Math.sin(nowMs * 0.12 + 1.3), 640, 235);
      rotEl(s.le, 7 * mm * w + earFlop, 350, 195);
      rotEl(s.re, -6 * mm * w + earFlop * 0.85, 490, 150);
      rotEl(s.tail, tl + vb * 2.4 * Math.sin(nowMs * 0.14 + 0.7), 696, 634);
      rotEl(s.head, 1.5 * mm * Math.sin(2 * s.phi + 0.5) + landFlex * 4, 440, 260);

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

      s.actor?.setAttribute('transform', s.dir > 0 ? 'translate(1100 0) scale(-1 1)' : '');
      const breakShrink = s.bossAction === 'BREAKING' ? Math.max(0.25, s.breakTimer / 1.05) : 1;
      s.piggyPos?.setAttribute(
        'transform',
        `translate(${s.px.toFixed(1)} ${(FLOOR_Y + s.py).toFixed(1)}) scale(${(PIGGY_SCALE * breakShrink).toFixed(3)}) translate(-550 -911)`
      );
      if (s.piggyPos) {
        if (s.bossAction === 'BREAKING') {
          s.piggyPos.style.opacity = Math.max(0, s.breakTimer / 1.05).toFixed(2);
          s.piggyPos.style.filter = 'brightness(1.45) sepia(0.25)';
        } else {
          s.piggyPos.style.opacity = '1';
          s.piggyPos.style.filter = s.bossFlash > 0 ? 'brightness(1.45) contrast(1.15)' : '';
        }
      }

      if (s.shadowEl) {
        const hf = Math.max(0.32, 1 - airAlt / 620) * breakShrink;
        s.shadowEl.setAttribute('cx', s.px.toFixed(1));
        s.shadowEl.setAttribute('rx', ((98 + s.bellyLevel * 38) * PIGGY_UNIT * hf).toFixed(1));
        s.shadowEl.setAttribute('fill', `rgba(45, 32, 18, ${(0.17 * hf).toFixed(3)})`);
      }
    };

    const advanceToNextPatternSpot = (skipBallTrigger = false) => {
      const s = simRef.current;
      s.stopsSinceBall += 1;
      if (!skipBallTrigger && s.stopsSinceBall >= s.ballTriggerStops) {
        s.stopsSinceBall = 0;
        s.ballTriggerStops = s.difficulty === 'FRENZY' ? 2 : 3;
        s.bossAction = 'BOUNCY_BALL';
        s.ballTimer = (s.difficulty === 'FRENZY' ? 4.4 : 3.6) + Math.min(1.0, (s.round - 1) * 0.2);
        const dirToCenter = s.px < WORLD_W * 0.5 ? 1 : -1;
        const ballSpeedBoost = (s.difficulty === 'FRENZY' ? 1.18 : 1.0) + (s.round - 1) * 0.05;
        s.ballVx = dirToCenter * (490 + Math.random() * 230) * ballSpeedBoost;
        s.ballVy = -(820 + Math.random() * 240);
        s.ballSpin = dirToCenter * (520 + Math.random() * 260);
        s.dir = dirToCenter;
        s.walkM = 0;
        s.onGround = false;
        spawnCollisionFx(s.px, FLOOR_Y + s.py - 85, 0, -1, '#F59E0B', true);
        synthRef.current?.playBallBoing(1.15);
        return;
      }

      const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];
      const nextIdx = (s.spotIndex + 1) % pat.spots.length;
      const nextSpot = pat.spots[nextIdx];
      const frenzyBoost = s.difficulty === 'FRENZY' ? 1.25 : 1.0;
      const cycleBoost = 1 + Math.floor((s.round - 1) / ROUND_PATTERNS.length) * 0.15;
      const speed = pat.baseMoveSpeed * frenzyBoost * cycleBoost;

      const dist = Math.hypot(nextSpot.x - s.px, (nextSpot.alt - s.alt) * PIGGY_SCALE);
      s.spotIndex = nextIdx;
      s.moveFromX = s.px;
      s.moveFromAlt = s.alt;
      s.moveTargetX = nextSpot.x;
      s.moveTargetAlt = nextSpot.alt;
      s.moveElapsed = 0;
      s.moveDuration = Math.max(0.45, Math.min(1.08, dist / speed));
      // Natural aerodynamic arc: hop on wide ground dashes, smooth lift curve on aerial flights
      s.moveArcAlt =
        nextSpot.alt === 0 && s.alt === 0 && dist > 420
          ? 125
          : nextSpot.alt > 20 || s.alt > 20
          ? Math.min(95, dist * 0.085)
          : 0;
      s.bossAction = nextSpot.alt > 20 || s.alt > 20 || s.moveArcAlt > 0 ? 'JET_FLIGHT' : 'PATTERN_MOVE';
      s.dir = nextSpot.x >= s.px ? 1 : -1;
      s.spLean.v += s.dir * 22;
      // Push off the floor cleanly with takeoff dust + squash impulse!
      if (s.alt < 12 && (nextSpot.alt > 20 || s.moveArcAlt > 0)) {
        spawnDustPuff(s.px, FLOOR_Y - 2, -s.dir, 6, 190);
        s.spSq.v += 1.4;
        synthRef.current?.playBossAttack();
      } else if (nextSpot.alt > s.alt + 40) {
        synthRef.current?.playBossAttack();
      }
    };

    // Progressive Pump + Money-Hurt Reaction every time a coin drops inside!
    const receiveCoinInSlot = (coinX: number, coinY: number, amount: number, isSlotDirect: boolean) => {
      const s = simRef.current;
      if (s.bossAction === 'BREAKING') return;

      const piggyCenterY = FLOOR_Y + s.py + (545 + 46 * s.ballMorph - 911) * PIGGY_SCALE;

      // 1. Progressive Pump (resets pressure bleed timer on direct slot drops!)
      if (s.phase === 'PLAYING') {
        s.pumpProgress = Math.min(s.pumpTarget, s.pumpProgress + amount);
        const ratio = s.pumpProgress / s.pumpTarget;
        s.bellyGoal = Math.max(s.bellyGoal, 0.04 + ratio * 1.06);

        if (isSlotDirect) {
          s.combo += 1;
          s.slotDrops += 1;
          s.sinceLastSlotHit = 0;
        }
        const dollarVal = isSlotDirect ? 45 + Math.min(s.combo, 12) * 10 : 8;
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
        spawnFloater(
          coinX + (Math.random() - 0.5) * 28,
          coinY - (isSlotDirect ? 42 : 24),
          isSlotDirect ? `+$${dollarVal} IN SLOT!` : `+$${dollarVal} ARMOR`,
          isSlotDirect ? '#15803D' : '#92400E',
          isSlotDirect ? 24 : 15
        );
      } else {
        // Title screen preview pump
        s.bellyGoal = s.bellyGoal >= 0.98 ? 0.04 : Math.min(1.0, s.bellyGoal + 0.12);
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

      // 4. Did it pump enough to BREAK?!
      if (s.phase === 'PLAYING' && s.pumpProgress >= s.pumpTarget) {
        s.bossAction = 'BREAKING';
        s.breakTimer = 1.05;
        s.piggiesBroken += 1;
        s.bellyGoal = 1.28;
        s.bellyVel = 0.45;
        s.projectiles = [];
        s.shakeTimer = 0.45;
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
        synthRef.current?.playPiggyBreak();
        spawnMoneyHurtFx(s.px, piggyCenterY, 34, 580);
        spawnFloater(s.px, piggyCenterY - 120, `PIGGY BROKEN! +$${breakBonus}!`, '#15803D', 36);
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
        s.slotReceiveTilt *= Math.max(0, 1 - rawDt * 10);

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

        if (s.dashTimer > 0) {
          s.dashTimer = Math.max(0, s.dashTimer - rawDt);
          s.cx = Math.max(30, Math.min(WORLD_W - 30, s.cx + s.dashVx * rawDt));
          s.cy = Math.max(30, Math.min(WORLD_H - 30, s.cy + s.dashVy * rawDt));
          s.afterimages.push({ x: s.cx, y: s.cy, life: 0.18, maxLife: 0.18 });
        } else {
          s.cx = s.targetCx;
          s.cy = s.targetCy;
        }

        const cDx = s.cx - s.prevCx;
        const cDy = s.cy - s.prevCy;
        s.velX = cDx / Math.max(rawDt, 0.001);
        const cSpeed = Math.hypot(cDx, cDy) / Math.max(rawDt, 0.001);
        s.prevCx = s.cx;
        s.prevCy = s.cy;

        // Varied Targeting Laser Oscillator & Auto-Cycle Update
        if (s.laserModeSetting === 'AUTO' && s.phase === 'PLAYING') {
          s.laserSwitchTimer -= rawDt;
          if (s.laserSwitchTimer <= 0) {
            s.laserSwitchTimer = 4.2 + Math.random() * 2.4;
            s.laserIndex = (s.laserIndex + 1) % LASER_STYLE_ORDER.length;
            applyLaserStyle(LASER_STYLE_ORDER[s.laserIndex], true);
          }
        }
        const curLaserProfile = LASER_PROFILES[s.laserStyle];
        s.slingMorphTimer -= rawDt;
        if (s.slingMorphTimer <= 0) {
          s.slingMorphTimer = 1.15 + Math.random() * 1.25;
          const fBoost = s.difficulty === 'FRENZY' ? 1.24 : 1.0;
          s.slingTargetSpeed = curLaserProfile.sweepRate * (0.85 + Math.random() * 0.35) * fBoost;
          s.slingTargetSubSpeed = curLaserProfile.subRate * (0.85 + Math.random() * 0.35) * fBoost;
          s.slingTargetAngleSpan = curLaserProfile.angleSpan * (0.86 + Math.random() * 0.3);
          s.slingTargetPowerBias = (Math.random() - 0.5) * 0.32;
        }
        s.slingSpeed += (s.slingTargetSpeed - s.slingSpeed) * Math.min(1, rawDt * 2.8);
        s.slingSubSpeed += (s.slingTargetSubSpeed - s.slingSubSpeed) * Math.min(1, rawDt * 2.8);
        s.slingAngleSpan += (s.slingTargetAngleSpan - s.slingAngleSpan) * Math.min(1, rawDt * 2.5);
        s.slingPowerBias += (s.slingTargetPowerBias - s.slingPowerBias) * Math.min(1, rawDt * 2.5);
        s.slingPhase += rawDt * s.slingSpeed;
        s.slingSubPhase += rawDt * s.slingSubSpeed;

        if ((s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') && s.throwHolding && s.throwCooldown <= 0 && !s.isReloading && s.revolverChambers > 0) {
          throwCoin(true);
        }

        const isThrowing = s.throwAnimTimer > 0 || s.dashTimer > 0;
        const row = isThrowing ? 1 : 0;
        let col = 0;
        if (isThrowing) {
          const p = 1 - Math.max(0, s.throwAnimTimer) / 0.13;
          col = Math.min(SPRITE_COLS - 1, Math.floor(p * SPRITE_COLS));
        } else {
          s.spriteFrameTime += rawDt * (cSpeed > 220 ? 13 : 7);
          col = Math.floor(s.spriteFrameTime) % SPRITE_COLS;
        }

        const box = stageBoxRef.current;
        const wrap = cursorWrapRef.current;
        const imgEl = spriteImgRef.current;

        if (box && wrap) {
          const rect = box.getBoundingClientRect();
          const pxX = (s.cx / WORLD_W) * rect.width;
          const pxY = (s.cy / WORLD_H) * rect.height;
          wrap.style.transform = `translate3d(${pxX.toFixed(1)}px, ${pxY.toFixed(1)}px, 0)`;
          wrap.style.opacity = '1';
        }
        if (imgEl && (s.lastSpriteCol !== col || s.lastSpriteRow !== row)) {
          s.lastSpriteCol = col;
          s.lastSpriteRow = row;
          imgEl.style.transform = `translate3d(${-col * 20}%, ${-row * 50}%, 0)`;
        }

        // 2. Pattern-Based Evasive Movement AI + Bouncy Ball State (Never hits cursor!)
        const piggyCenterY = FLOOR_Y + s.py + (545 + 46 * s.ballMorph - 911) * PIGGY_SCALE;
        const slotPos = getSlotHolePos();
        const prevFramePx = s.px;

        if (s.bossAction === 'BOUNCY_BALL') {
          s.ballMorph += (1 - s.ballMorph) * Math.min(1, dt * 11);
        } else {
          s.ballMorph += (0 - s.ballMorph) * Math.min(1, dt * 10);
          s.ballAngle += (0 - s.ballAngle) * Math.min(1, dt * 10);
        }

        if (s.phase === 'PLAYING') {
          const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];

          // Gentle idle pressure vent if player hasn't landed a slot coin in 3.2s
          if (s.bossAction !== 'BREAKING' && s.pumpProgress > 0) {
            s.sinceLastSlotHit += dt;
            if (s.sinceLastSlotHit > 3.2) {
              s.pumpProgress = Math.max(0, s.pumpProgress - 0.28 * dt);
              const ratio = s.pumpProgress / s.pumpTarget;
              s.bellyGoal = Math.max(0.02, 0.04 + ratio * 1.06);
              s.pressureBleedFxAcc += dt;
              if (s.pressureBleedFxAcc >= 0.45) {
                s.pressureBleedFxAcc = 0;
                spawnDustPuff(slotPos.x, slotPos.y - 6, s.dir, 1, 55);
              }
            }
          }

          if (s.bossAction === 'BREAKING') {
            s.walkM = 0;
            s.breakTimer -= dt;
            if (Math.random() < 0.55) {
              spawnMoneyHurtFx(s.px + (Math.random() - 0.5) * 90, piggyCenterY, 3, 480);
            }
            if (s.breakTimer <= 0) {
              s.bossAction = 'PATTERN_STOP';
              s.phase = 'WHITEPAPER';
              s.throwHolding = false;
              s.projectiles = [];
              setWpTab('PDF');
              setPhase('WHITEPAPER');
            }
          } else if (s.bossAction === 'BOUNCY_BALL') {
            s.walkM = 0;
            s.ballTimer -= dt;
            s.ballVy += 1740 * dt;
            s.px += s.ballVx * dt;
            s.py += s.ballVy * dt;
            s.ballAngle += s.ballSpin * dt;
            s.alt = Math.max(0, -s.py / PIGGY_SCALE);
            s.goalAlt = s.alt;
            s.vAlt = -s.ballVy / PIGGY_SCALE;

            // Elastic arena wall bounces
            if (s.px <= MIN_X) {
              s.px = MIN_X;
              s.ballVx = Math.abs(s.ballVx) * (0.94 + Math.random() * 0.14);
              s.ballSpin = (s.ballVx >= 0 ? 1 : -1) * (460 + Math.random() * 300);
              spawnCollisionFx(MIN_X - 42, piggyCenterY, 1, 0, '#F59E0B', false);
              synthRef.current?.playBallBoing(1.1);
            } else if (s.px >= MAX_X) {
              s.px = MAX_X;
              s.ballVx = -Math.abs(s.ballVx) * (0.94 + Math.random() * 0.14);
              s.ballSpin = (s.ballVx >= 0 ? 1 : -1) * (460 + Math.random() * 300);
              spawnCollisionFx(MAX_X + 42, piggyCenterY, -1, 0, '#F59E0B', false);
              synthRef.current?.playBallBoing(1.1);
            }

            // Ceiling deflection
            if (s.py <= -540) {
              s.py = -540;
              s.ballVy = Math.abs(s.ballVy) * 0.88;
              spawnCollisionFx(s.px, FLOOR_Y + s.py - 190, 0, 1, '#FBBF24', false);
              synthRef.current?.playBallBoing(1.22);
            }

            // High-energy rubber-brass floor bounce
            if (s.py >= 0) {
              s.py = 0;
              if (s.ballTimer > 0) {
                const keepDir = Math.random() < 0.72 ? (s.ballVx >= 0 ? 1 : -1) : (s.px < WORLD_W * 0.5 ? 1 : -1);
                const hMag = (420 + Math.random() * 340) * (s.difficulty === 'FRENZY' ? 1.18 : 1.0);
                s.ballVx = keepDir * hMag;
                s.ballVy = -(740 + Math.random() * 350);
                s.ballSpin = keepDir * (500 + Math.random() * 320);
                s.landingRings.push({
                  x: s.px,
                  y: FLOOR_Y + 4,
                  rx: 28,
                  maxRx: 148,
                  life: 0.34,
                  maxLife: 0.34,
                  color: 'rgba(217, 119, 6, 0.52)',
                });
                spawnDustPuff(s.px - 22, FLOOR_Y - 2, -1, 4, 190);
                spawnDustPuff(s.px + 22, FLOOR_Y - 2, 1, 4, 190);
                spawnCollisionFx(s.px, FLOOR_Y - 6, 0, -1, '#F59E0B', true);
                s.shakeTimer = Math.max(s.shakeTimer, 0.06);
                synthRef.current?.playBallBoing(0.95 + Math.random() * 0.2);
              } else {
                // Ball timer finished cleanly on floor touch -> uncurl & resume pattern!
                s.py = 0;
                s.alt = 0;
                s.prevAlt = 0;
                s.vAlt = 0;
                s.goalAlt = 0;
                s.onGround = true;
                s.ballAngle = ((((s.ballAngle % 360) + 540) % 360) - 180);
                spawnLandingFx(s.px, 0.9);
                advanceToNextPatternSpot(true);
              }
            }
          } else if (s.bossAction === 'PATTERN_STOP') {
            s.walkM += (0 - s.walkM) * Math.min(1, dt * 12);
            s.bossTimer -= dt;

            // Gentle subtle tell right before dashing to the next spot in the pattern
            const nextSpot = pat.spots[(s.spotIndex + 1) % pat.spots.length];
            if (s.bossTimer < 0.26) {
              s.dir = nextSpot.x >= s.px ? 1 : -1;
              s.moveTargetAlt = nextSpot.alt;
            }

            if (s.bossTimer <= 0) {
              advanceToNextPatternSpot();
            }
          } else {
            // Smoothly zip through space along the pattern route to the next stop spot
            s.moveElapsed += dt;
            const u = Math.min(1, s.moveElapsed / Math.max(0.05, s.moveDuration));
            // Smooth cubic-quintic blend for realistic acceleration, cruise & deceleration
            const ease = u < 0.5 ? 16 * u * u * u * u * u : 1 - Math.pow(-2 * u + 2, 5) / 2;

            const prevPx = s.px;
            s.px = s.moveFromX + (s.moveTargetX - s.moveFromX) * ease;
            const linearAlt = s.moveFromAlt + (s.moveTargetAlt - s.moveFromAlt) * ease;
            const arcAlt = s.moveArcAlt * Math.sin(u * Math.PI);
            s.goalAlt = linearAlt + arcAlt;

            const speedX = Math.abs(s.px - prevPx) / Math.max(dt, 0.001);
            const targetWalk = s.goalAlt > 20 ? Math.min(1.3, speedX / 550) : Math.min(1.6, speedX / 420);
            s.walkM += (targetWalk - s.walkM) * Math.min(1, dt * 12);

            if (u >= 1) {
              const wasMovingFast = Math.abs(s.realVx) > 220;
              s.px = s.moveTargetX;
              s.goalAlt = s.moveTargetAlt;
              s.visitedSpots.add(s.spotIndex);
              s.bossAction = 'PATTERN_STOP';
              s.bossTimer = s.stopDuration;
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
        } else if (s.phase === 'TITLE_MENU') {
          s.bellyVel += Math.sin(now * 0.0025) * 0.0004;
          s.walkM += (0 - s.walkM) * Math.min(1, dt * 6);
        }

        // Track real horizontal velocity & acceleration for realistic banking + dual trails
        const curRealVx = (s.px - prevFramePx) / Math.max(dt, 0.001);
        s.realAx = Math.max(-5500, Math.min(5500, (curRealVx - s.prevRealVx) / Math.max(dt, 0.001)));
        s.prevRealVx = curRealVx;
        s.realVx = curRealVx;

        // Update player's falling coins with physical ricochets, floor bounces & premium expiration
        const inBallMode = s.ballMorph > 0.35;
        const activePiggyCenterY = FLOOR_Y + s.py + (545 + 46 * s.ballMorph - 911) * PIGGY_SCALE;
        const activeSlotPos = getSlotHolePos();
        const slotFacingUp = !inBallMode || activeSlotPos.y <= activePiggyCenterY + 18;
        const slotHitR = inBallMode ? 38 + s.bellyLevel * 8 : 46 + s.bellyLevel * 10;
        const bodyRx = inBallMode ? 72 + s.bellyLevel * 24 : 58 + s.bellyLevel * 28;
        const bodyRy = inBallMode ? 72 + s.bellyLevel * 24 : 82 + s.bellyLevel * 22;
        const nextProj: Projectile[] = [];

        for (const p of s.projectiles) {
          p.life -= dt;
          if (p.armorHitCooldown && p.armorHitCooldown > 0) {
            p.armorHitCooldown = Math.max(0, p.armorHitCooldown - dt);
          }
          if (p.life <= 0) {
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
            spawnCoinExpireFx(Math.max(10, Math.min(WORLD_W - 10, p.x)), Math.max(10, p.y), p.vx, p.vy);
            continue;
          }

          // Arena floor bounce (up to 2 elastic clinks) or premium settle-dissolve
          if (p.y + p.r * 0.7 >= FLOOR_Y && p.vy > 0) {
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
            // 1. Top-drop into Piggybank's Coin Slot Hole (+1 full pump & emerald collision gleam!)
            const distToSlot = Math.hypot(p.x - activeSlotPos.x, p.y - activeSlotPos.y);
            const slotApproachOk = p.gravity < 300 ? p.vy > -160 : p.vy > 0;
            if (slotApproachOk && slotFacingUp && distToSlot < slotHitR) {
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
              spawnCollisionFx(activeSlotPos.x, activeSlotPos.y, 0, -1, '#22C55E', true);
              receiveCoinInSlot(activeSlotPos.x, activeSlotPos.y, 1.0, true);
              continue;
            }

            // 2. Physical armor / bouncy ball shell ricochet!
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
              receiveCoinInSlot(p.x, p.y, inBallMode ? 0.05 : 0.1, false);
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

        // Premium Dual Trail Emitter (Upper Brass-Gold Silk Ribbon + Lower Thruster/Wealth Ribbon)
        const moveSpeedTotal = Math.hypot(s.realVx, s.vAlt * PIGGY_SCALE);
        if (s.phase === 'PLAYING' && s.bossAction !== 'BREAKING' && (moveSpeedTotal > 85 || s.alt > 12 || s.thrS > 0.2)) {
          s.trailSampleAcc += rawDt;
          if (s.trailSampleAcc >= 0.012) {
            s.trailSampleAcc = 0;
            const curBodyY = FLOOR_Y + s.py - Math.round(195 * PIGGY_UNIT);
            const backDir = s.realVx >= 0 ? -1 : 1;
            const jetWorldX = s.px + (s.dir > 0 ? -108 : 108) * PIGGY_UNIT;
            const jetWorldY = FLOOR_Y + s.py - Math.round(128 * PIGGY_UNIT);
            const x1Pos = s.px + backDir * 22 * PIGGY_UNIT;
            const y1Pos = curBodyY - Math.round(48 * PIGGY_UNIT);
            s.piggyTrail.push({
              x1: x1Pos,
              y1: y1Pos,
              x2: jetWorldX,
              y2: jetWorldY,
              life: 0.36,
              maxLife: 0.36,
              speed: moveSpeedTotal,
              thr: s.thrS,
              belly: s.bellyLevel,
            });
            if (s.piggyTrail.length > 36) s.piggyTrail.shift();

            // Whisper-light ambient motes drifting off the transparent dual trails
            if (moveSpeedTotal > 280 && Math.random() < 0.2) {
              const upperSpawn = Math.random() < 0.45;
              const sx = upperSpawn ? x1Pos : jetWorldX;
              const sy = upperSpawn ? y1Pos : jetWorldY;
              const isRich = s.bellyLevel > 0.25 && !upperSpawn && s.thrS <= 0.25;
              const isJet = !upperSpawn && s.thrS > 0.25;
              s.particles.push({
                x: sx + (Math.random() - 0.5) * 10,
                y: sy + (Math.random() - 0.5) * 10,
                vx: -s.realVx * 0.12 + (Math.random() - 0.5) * 34,
                vy: (Math.random() - 0.5) * 28 - (isJet ? 8 : 0),
                r: isRich ? 3.2 : 2.2 + Math.random() * 1.4,
                color: isRich ? 'rgba(34, 197, 94, 0.32)' : isJet ? 'rgba(251, 146, 60, 0.34)' : 'rgba(245, 158, 11, 0.3)',
                life: 0.22 + Math.random() * 0.1,
                maxLife: 0.32,
                gravity: isRich ? 35 : -6,
                kind: 'dot',
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
        const a = Math.min(1.35, s.bellyLevel + s.ballMorph * 0.42);
        s.ripplePhase += 0.35 * dt60 * (0.4 + Math.min(1, Math.abs(s.bellyVel) * 18));
        const wob = Math.min(0.12, Math.abs(s.bellyVel) * 2.2);
        const st = Math.max(-0.34, Math.min(0.34, s.bellyVel * 6.5)) * (1 - s.ballMorph * 0.65);
        applyBalloon(a, st, wob);
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

          const piggyCenterY = FLOOR_Y + s.py + (545 + 46 * s.ballMorph - 911) * PIGGY_SCALE;
          const slotPos = getSlotHolePos();

          // Subtle rotating kinetic aura when Piggy is curled in Bouncy Ball state
          if (s.ballMorph > 0.05 && s.bossAction !== 'BREAKING') {
            const ballR = 72 + s.bellyLevel * 24;
            ctx.save();
            ctx.translate(s.px, piggyCenterY);
            ctx.rotate((s.ballAngle * Math.PI) / 180);
            ctx.globalAlpha = 0.28 * s.ballMorph;
            ctx.strokeStyle = '#D97706';
            ctx.lineWidth = 3;
            ctx.setLineDash([16, 12]);
            ctx.beginPath();
            ctx.arc(0, 0, ballR + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([8, 18]);
            ctx.strokeStyle = '#FEF08A';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(0, 0, ballR + 16, 0, Math.PI * 2);
            ctx.stroke();
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

          // Playful Sweeping Parabolic Sling-Laser Trajectory & Sync Lock Cue
          if ((s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') && s.bossAction !== 'BREAKING') {
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
              flipElSync.style.transform = `scaleX(${s.facing})`;
            }

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

              const slotPreviewOk = isStraightLaser ? lvy > -160 : lvy > 0;
              if (slotPreviewOk && slotFacingUp && Math.hypot(lx - slotPos.x, ly - slotPos.y) < slotR) {
                hitKind = 'slot';
                impactX = slotPos.x;
                impactY = slotPos.y;
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

            s.slingLocked = hitKind === 'slot';

            ctx.save();
            // Soft base slot ring on piggy
            ctx.strokeStyle =
              hitKind === 'slot'
                ? 'rgba(34, 197, 94, 0.95)'
                : hitKind === 'body'
                ? 'rgba(245, 158, 11, 0.72)'
                : isStraightLaser
                ? 'rgba(2, 132, 199, 0.36)'
                : 'rgba(180, 83, 9, 0.25)';
            ctx.lineWidth = hitKind === 'slot' ? 3.5 : 1.8;
            ctx.setLineDash(hitKind === 'slot' ? [] : [6, 6]);
            ctx.beginPath();
            ctx.arc(slotPos.x, slotPos.y, hitKind === 'slot' ? 34 : 24, 0, Math.PI * 2);
            ctx.stroke();

            // Varied Targeting Laser Beam (Curved Sling Parabolas OR Razor-Straight Rail Beams)
            if (simPts.length >= 2) {
              ctx.setLineDash([]);
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';

              const traceLaser = () => {
                ctx.beginPath();
                ctx.moveTo(simPts[0].x, simPts[0].y);
                const lastPt = simPts[simPts.length - 1];
                if (isStraightLaser) {
                  ctx.lineTo(lastPt.x, lastPt.y);
                } else {
                  for (let k = 1; k < simPts.length - 1; k++) {
                    const mx = (simPts[k].x + simPts[k + 1].x) * 0.5;
                    const my = (simPts[k].y + simPts[k + 1].y) * 0.5;
                    ctx.quadraticCurveTo(simPts[k].x, simPts[k].y, mx, my);
                  }
                  ctx.lineTo(lastPt.x, lastPt.y);
                }
              };

              const laserColor =
                hitKind === 'slot' ? '#22C55E' : hitKind === 'body' ? '#F59E0B' : launch.profile.beamColor;
              const laserCore =
                hitKind === 'slot' ? '#FEF08A' : hitKind === 'body' ? '#FEF3C7' : launch.profile.coreColor;

              // Outer laser bloom
              traceLaser();
              ctx.globalAlpha = hitKind === 'slot' ? 0.34 : isStraightLaser ? 0.24 : 0.2;
              ctx.strokeStyle = laserColor;
              ctx.lineWidth = hitKind === 'slot' ? 12 : isStraightLaser ? 8 : 9;
              ctx.stroke();

              // Crisp beam body (continuous crisp beam for straight lasers, animated dashed arc for sling curves)
              traceLaser();
              ctx.globalAlpha = hitKind === 'slot' ? 0.94 : isStraightLaser ? 0.84 : 0.74;
              ctx.strokeStyle = laserColor;
              ctx.lineWidth = hitKind === 'slot' ? 4.2 : isStraightLaser ? 2.8 : 3.2;
              if (isStraightLaser) {
                ctx.setLineDash([]);
              } else {
                ctx.setLineDash([12, 9]);
                ctx.lineDashOffset = -(now * (0.065 + launch.profile.sweepRate * 0.012));
              }
              ctx.stroke();

              // Luminous inner filament
              traceLaser();
              ctx.globalAlpha = hitKind === 'slot' ? 0.92 : 0.72;
              ctx.strokeStyle = laserCore;
              ctx.lineWidth = isStraightLaser ? 1.3 : 1.6;
              if (isStraightLaser) {
                ctx.setLineDash([16, 12]);
                ctx.lineDashOffset = -(now * 0.14);
              } else {
                ctx.setLineDash([6, 15]);
                ctx.lineDashOffset = -(now * (0.065 + launch.profile.sweepRate * 0.012));
              }
              ctx.stroke();
              ctx.setLineDash([]);

              // Animated traveling laser pulses/beads along path
              const beadSpeed = isStraightLaser ? 0.0036 : 0.0022;
              const beadPhase = (now * beadSpeed) % 1;
              for (let bi = 0; bi < 4; bi++) {
                const frac = (beadPhase + bi * 0.25) % 1;
                const idx = Math.min(simPts.length - 1, Math.floor(frac * (simPts.length - 1)));
                const bp = simPts[idx];
                ctx.globalAlpha = Math.sin(frac * Math.PI) * 0.95;
                ctx.fillStyle = laserCore;
                ctx.beginPath();
                ctx.arc(bp.x, bp.y, hitKind === 'slot' ? 4.6 : isStraightLaser ? 3.2 : 3.5, 0, Math.PI * 2);
                ctx.fill();
              }

              // Predicted impact dot / Sync-Lock Reticle
              if (hitKind === 'slot') {
                const pulse = 1 + 0.12 * Math.sin(now * 0.02);
                ctx.globalAlpha = 0.95;
                ctx.strokeStyle = '#15803D';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(impactX, impactY, 22 * pulse, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#15803D';
                ctx.font = '800 13px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText('SYNC!', impactX, impactY - 58);
              } else if (hitKind !== 'none') {
                ctx.globalAlpha = 0.78;
                ctx.fillStyle = hitKind === 'body' ? '#F59E0B' : laserColor;
                ctx.beginPath();
                ctx.arc(impactX, impactY, isStraightLaser ? 5 : 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#FFFBEB';
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }
            ctx.restore();
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

          // Smooth Rounded Solid Dual Trails (Upper Brass-Gold Stream + Lower Thruster/Wealth Stream)
          for (let i = s.piggyTrail.length - 1; i >= 0; i--) {
            s.piggyTrail[i].life -= rawDt;
            if (s.piggyTrail[i].life <= 0) {
              s.piggyTrail.splice(i, 1);
            }
          }
          if (s.piggyTrail.length >= 2) {
            const drawSolidTrail = (
              pts: { x: number; y: number; fade: number }[],
              lineW: number,
              haloColor: string,
              tailColor: string,
              midColor: string,
              headColor: string,
              sheenColor: string
            ) => {
              if (pts.length < 2) return;
              const first = pts[0];
              const last = pts[pts.length - 1];
              const headFade = Math.max(0.15, last.fade);

              const traceSmoothSpline = () => {
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                if (pts.length === 2) {
                  ctx.lineTo(pts[1].x, pts[1].y);
                } else {
                  for (let k = 1; k < pts.length - 1; k++) {
                    const mx = (pts[k].x + pts[k + 1].x) * 0.5;
                    const my = (pts[k].y + pts[k + 1].y) * 0.5;
                    ctx.quadraticCurveTo(pts[k].x, pts[k].y, mx, my);
                  }
                  ctx.lineTo(last.x, last.y);
                }
              };

              const makeGrad = (cTail: string, cMid: string, cHead: string) => {
                if (Math.hypot(last.x - first.x, last.y - first.y) < 1) return cHead;
                const g = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
                g.addColorStop(0, cTail);
                g.addColorStop(0.45, cMid);
                g.addColorStop(1, cHead);
                return g;
              };

              ctx.save();
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';

              // Layer 1: Soft Outer Ambient Aura (whisper-light transparent glow)
              traceSmoothSpline();
              ctx.globalAlpha = 0.045 * headFade;
              ctx.strokeStyle = haloColor;
              ctx.lineWidth = lineW * 1.6;
              ctx.stroke();

              // Layer 2: Translucent Continuous Rounded Stream Body
              traceSmoothSpline();
              ctx.globalAlpha = 0.16 * headFade;
              ctx.strokeStyle = makeGrad(tailColor, midColor, headColor);
              ctx.lineWidth = lineW * 0.8;
              ctx.stroke();

              // Layer 3: Delicate Inner Sheen
              traceSmoothSpline();
              ctx.globalAlpha = 0.08 * headFade;
              ctx.strokeStyle = makeGrad(tailColor, sheenColor, sheenColor);
              ctx.lineWidth = lineW * 0.32;
              ctx.stroke();

              ctx.restore();
            };

            // Partition contiguous segments (skip large teleports/resets)
            const chunks: DualTrailPoint[][] = [];
            let curChunk: DualTrailPoint[] = [s.piggyTrail[0]];
            for (let i = 1; i < s.piggyTrail.length; i++) {
              const p0 = s.piggyTrail[i - 1];
              const p1 = s.piggyTrail[i];
              if (Math.hypot(p1.x1 - p0.x1, p1.y1 - p0.y1) > 190) {
                if (curChunk.length >= 2) chunks.push(curChunk);
                curChunk = [p1];
              } else {
                curChunk.push(p1);
              }
            }
            if (curChunk.length >= 2) chunks.push(curChunk);

            for (const ch of chunks) {
              const headPt = ch[ch.length - 1];
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

              // Trail 1: Upper Translucent Brass-Gold Stream
              drawSolidTrail(
                upperPts,
                9,
                'rgba(180, 83, 9, 0.22)',
                'rgba(245, 158, 11, 0)',
                'rgba(217, 119, 6, 0.45)',
                'rgba(245, 158, 11, 0.62)',
                'rgba(253, 230, 138, 0.55)'
              );

              // Trail 2: Lower Translucent Jetpack Stream (during flight) OR Emerald Wealth Stream (when loaded)
              const isJet = headPt.thr > 0.25;
              const isRich = headPt.belly > 0.28;
              drawSolidTrail(
                lowerPts,
                isJet ? 11 : 8,
                isJet ? 'rgba(234, 88, 12, 0.22)' : isRich ? 'rgba(21, 128, 61, 0.2)' : 'rgba(146, 64, 14, 0.18)',
                isJet ? 'rgba(249, 115, 22, 0)' : isRich ? 'rgba(34, 197, 94, 0)' : 'rgba(217, 119, 6, 0)',
                isJet ? 'rgba(234, 88, 12, 0.48)' : isRich ? 'rgba(22, 163, 74, 0.46)' : 'rgba(180, 83, 9, 0.42)',
                isJet ? 'rgba(251, 146, 60, 0.65)' : isRich ? 'rgba(34, 197, 94, 0.62)' : 'rgba(217, 119, 6, 0.58)',
                isJet ? 'rgba(254, 240, 138, 0.55)' : isRich ? 'rgba(187, 247, 208, 0.55)' : 'rgba(253, 230, 138, 0.5)'
              );
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
              ctx.save();
              ctx.globalAlpha = expireFade;
              ctx.lineCap = 'round';
              for (let ti = 1; ti < p.trail.length; ti++) {
                const tf = ti / p.trail.length;
                ctx.strokeStyle = `rgba(245, 158, 11, ${(tf * 0.38).toFixed(3)})`;
                ctx.lineWidth = Math.max(1.8, tf * 9.5 * expireShrink);
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

            // Warm subtle aura behind active coin
            const coinAura = ctx.createRadialGradient(0, 0, p.r * 0.2, 0, 0, p.r * 1.65);
            coinAura.addColorStop(0, 'rgba(253, 224, 71, 0.24)');
            coinAura.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = coinAura;
            ctx.beginPath();
            ctx.arc(0, 0, p.r * 1.65, 0, Math.PI * 2);
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

          // Hand-Orbit Revolver Cylinder & Reload Threshold Circle
          if (s.phase === 'PLAYING' || s.phase === 'TITLE_MENU') {
            ctx.save();
            ctx.translate(s.cx, s.cy);

            const thresholdR = 62;
            const orbitChamberR = 46;
            const topAng = -Math.PI / 2;
            const reloadFrac = s.isReloading ? Math.min(1, s.reloadTimer / s.reloadDuration) : 1;
            const chamberRatio = s.revolverChambers / s.revolverMax;

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

          ctx.restore();
        }
      }

      // 4. Throttled HUD Sync
      hudTimer += rawDt;
      if (hudTimer >= 0.06) {
        hudTimer = 0;
        const pct = Math.round(Math.min(1, s.pumpProgress / s.pumpTarget) * 100);
        const pat = ROUND_PATTERNS[s.patternIndex % ROUND_PATTERNS.length];
        const actionLabel =
          s.bossAction === 'BREAKING'
            ? 'PIGGY EXPLODING!'
            : s.bossAction === 'BOUNCY_BALL'
            ? `${pat.name} · Bouncy Ball!`
            : s.bossAction === 'PATTERN_STOP'
            ? `${pat.name} · Stopped (${s.spotIndex + 1}/${pat.spots.length})`
            : s.bossAction === 'JET_FLIGHT'
            ? `${pat.name} · Jetting`
            : pct >= 75
            ? `${pat.name} · About to Explode!`
            : `${pat.name} · Moving`;

        setHud((prev) => ({
          ...prev,
          score: s.score,
          bestScore: s.bestScore,
          round: s.round,
          patternName: pat.name,
          spotIndex: s.spotIndex,
          spotTotal: pat.spots.length,
          pumpProgress: Number(s.pumpProgress.toFixed(1)),
          pumpTarget: s.pumpTarget,
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
        }));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyLaserStyle, setupRound, storageKey, throwCoin]);

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

        {/* Center Progressive Fill-to-Explode Meter */}
        <div className="flex-1 max-w-lg flex items-center gap-3">
          <div className="flex-1 min-w-[140px]">
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="font-semibold text-[#231A10]">Piggy Fill · Round {hud.round}</span>
              <span className={`font-mono-tabular font-semibold ${hud.bellyPct >= 75 ? 'text-[#DC2626]' : 'text-[#5A4A38]'}`}>
                {hud.pumpProgress}/{hud.pumpTarget} Coins · {hud.bellyPct}% {hud.bellyPct >= 75 ? 'ABOUT TO POP!' : ''}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[#E8E0D2] overflow-hidden border border-[#231A10]/10">
              <div
                className={`h-full transition-all duration-100 ${
                  hud.bellyPct >= 75 ? 'bg-[#DC2626]' : hud.bellyPct >= 40 ? 'bg-[#D97706]' : 'bg-[#B45309]'
                }`}
                style={{ width: `${hud.bellyPct}%` }}
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

                  <g id="torso-main">
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

                  {/* TOP SCREW: polished-brass Phillips bolt on hex nut and beveled flange */}
                  <g id="top-screw" transform="translate(478 186) rotate(-14) scale(1.7)">
                    <ellipse cx="3" cy="8" rx="40" ry="11" fill="#1f140a" opacity="0.38" filter="url(#soft-shadow)" />
                    <ellipse cx="0" cy="6" rx="34" ry="10" fill="#2c1d0e" />
                    <path d="M -34 3 L -34 6 A 34 10 0 0 0 34 6 L 34 3 Z" fill="#4a331b" />
                    <ellipse cx="0" cy="3" rx="34" ry="10" fill="url(#ts-flange)" stroke="#2c1d0e" strokeWidth="1.2" />
                    <ellipse cx="0" cy="3" rx="29" ry="7.8" fill="none" stroke="#d9b172" strokeWidth="1" opacity="0.5" />
                    <g fill="#e3bd7e" stroke="#2c1d0e" strokeWidth="0.6">
                      <circle cx="-26" cy="4" r="1.6" />
                      <circle cx="26" cy="4" r="1.6" />
                      <circle cx="-14" cy="10" r="1.5" />
                      <circle cx="14" cy="10" r="1.5" />
                    </g>
                    <path d="M -24 -12 L -12 -5 L -12 4 L -24 -3 Z" fill="url(#ts-nutL)" stroke="#2c1d0e" strokeWidth="0.9" />
                    <path d="M -12 -5 L 12 -5 L 12 4 L -12 4 Z" fill="url(#ts-nutM)" stroke="#2c1d0e" strokeWidth="0.9" />
                    <path d="M 12 -5 L 24 -12 L 24 -3 L 12 4 Z" fill="url(#ts-nutR)" stroke="#2c1d0e" strokeWidth="0.9" />
                    <path d="M -24 -12 L -12 -19 L 12 -19 L 24 -12 L 12 -5 L -12 -5 Z" fill="#c79a5c" stroke="#2c1d0e" strokeWidth="0.9" />
                    <path d="M -22 -12 L -11 -18 L 11 -18" fill="none" stroke="#fff1c9" strokeWidth="1" opacity="0.6" />
                    <path d="M -17 -15 L -17 -30 A 17 6.5 0 0 1 17 -30 L 17 -15 A 17 6.5 0 0 1 -17 -15 Z" fill="url(#ts-cyl)" stroke="#2c1d0e" strokeWidth="1.2" />
                    <g stroke="#2c1d0e" strokeWidth="0.7" opacity="0.4">
                      <path d="M -13 -14 L -13 -28" />
                      <path d="M -9 -12 L -9 -27" />
                      <path d="M -4.5 -11 L -4.5 -26.5" />
                      <path d="M 0 -10.5 L 0 -26" />
                      <path d="M 4.5 -11 L 4.5 -26.5" />
                      <path d="M 9 -12 L 9 -27" />
                      <path d="M 13 -14 L 13 -28" />
                    </g>
                    <ellipse cx="0" cy="-30" rx="17" ry="6.5" fill="url(#ts-top)" stroke="#3a2813" strokeWidth="1.1" />
                    <ellipse cx="0" cy="-30" rx="13.5" ry="4.9" fill="none" stroke="#fff3cf" strokeWidth="0.8" opacity="0.45" />
                    <path d="M -9 -30 L 9 -30 M 0 -34.2 L 0 -25.8" stroke="#1b1108" strokeWidth="3.4" strokeLinecap="round" />
                    <path d="M -8 -29.2 L 8 -29.2 M 0.9 -33.2 L 0.9 -26.8" stroke="#8b6338" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
                    <ellipse cx="-7" cy="-33.2" rx="4.2" ry="1.3" fill="#ffffff" opacity="0.5" transform="rotate(-12 -7 -33.2)" />
                    <path d="M -11 -26 L -11 -17" stroke="#fff3cf" strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
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
                      <g transform="translate(612 205) rotate(28) scale(1.0)" style={{ pointerEvents: 'none' }}>
                        <use href="#tat-dollar" stroke="#f1dca6" strokeWidth="1.7" opacity="0.4" transform="translate(0.9 1)" />
                        <use href="#tat-dollar" stroke="#2b1d0e" strokeWidth="1.7" opacity="0.75" />
                      </g>
                    </g>
                  </g>

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
                The piggy darts between pattern spots while your sling laser sweeps in a playful arc. Predict its stop, line up your spot, and sync your throw when the laser locks green on the slot!
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
                  <span className="font-semibold text-[#231A10]">Watch Spots</span> · Read Pattern
                </div>
                <div>
                  <span className="font-semibold text-[#231A10]">Sync Laser</span> · 6-Shot Cylinder
                </div>
                <div>
                  <span className="font-semibold text-[#231A10]">R / Empty</span> · Orbit Reload
                </div>
                <div>
                  <span className="font-semibold text-[#231A10]">Right Click / Space</span> · Dash
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#231A10]/10 flex items-center justify-between text-xs text-[#5A4A38]">
                <span>Direct slot drops fill · Armor grazes deflect</span>
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
                Tip: Aim the sweeping laser onto the slot! Each 6-coin cylinder sweeps the hand orbit threshold to reload.
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
          <span className="font-semibold text-[#231A10]">{hud.bossActionLabel}</span>
          {hud.combo > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular font-semibold text-[#15803D]">{hud.combo} Drop Combo</span>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span>Predict Spot</span>
          <span aria-hidden="true">·</span>
          <span>Sync Laser + Click / J · Fire ({hud.revolverChambers}/{hud.revolverMax})</span>
          <span aria-hidden="true">·</span>
          <span>Q · Laser ({hud.laserLabel})</span>
          <span aria-hidden="true">·</span>
          <span>R · Reload</span>
          <span aria-hidden="true">·</span>
          <span>Space · Dash</span>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onPointerDown={() => throwCoin(false)}
            className="h-10 px-3.5 rounded-xl bg-[#B45309] text-white font-semibold inline-flex items-center gap-1.5 touch-none"
          >
            <IconCoins className="w-3.5 h-3.5" />
            {hud.isReloading ? `${hud.reloadPct}%` : `Drop (${hud.revolverChambers})`}
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
            onPointerDown={performDash}
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

