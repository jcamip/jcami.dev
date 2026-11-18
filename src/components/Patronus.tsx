"use client";

import { useEffect, useRef } from "react";
import styles from "./Patronus.module.css";

export type PatronusKind = "stag" | "snake" | "bunny" | "phoenix" | "horse" | "blackCat";

export type PatronusCast = {
  key: number;
  kind: PatronusKind;
};

/** `width` strokes the path instead of filling it; `cut` carves it out of
    the shapes before it (eyes, nostrils) so the particles leave a gap. */
type Shape = { d: string; width?: number; cut?: boolean };

type Silhouette = {
  label: string;
  shapes: Shape[];
  eyes?: [number, number][];
  /** Drawn larger than the full-body animals, e.g. a head-only bust. */
  zoom?: number;
  /** Rotates (degrees, around `pivot`) then shifts the drawing before sampling. */
  pose?: { rotate: number; pivot: [number, number]; offsetY: number };
};

const VIEW_W = 240;
const VIEW_H = 200;
const LIMB = 8;
const FINE = 4;

function ellipse(cx: number, cy: number, rx: number, ry: number, rotDeg = 0): Shape {
  const r = (rotDeg * Math.PI) / 180;
  const ox = Math.cos(r) * rx;
  const oy = Math.sin(r) * rx;
  return {
    d: `M${cx - ox} ${cy - oy} A${rx} ${ry} ${rotDeg} 1 0 ${cx + ox} ${cy + oy} A${rx} ${ry} ${rotDeg} 1 0 ${cx - ox} ${cy - oy} Z`,
  };
}

/** A tapered, slightly curved feather from (x, y) pointing at `deg`. */
function feather(x: number, y: number, deg: number, length: number, width: number, bend = 0): Shape {
  const a = (deg * Math.PI) / 180;
  const tx = x + Math.cos(a) * length;
  const ty = y + Math.sin(a) * length;
  const px = -Math.sin(a);
  const py = Math.cos(a);
  const mx = (x + tx) / 2 + px * bend;
  const my = (y + ty) / 2 + py * bend;
  return {
    d: `M${x} ${y} Q${mx + px * width} ${my + py * width} ${tx} ${ty} Q${mx - px * width} ${my - py * width} ${x} ${y} Z`,
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A row of feathers fanned along a wing bone, from shoulder to wrist:
    short secondaries at the shoulder sweeping into long primaries at the tip. */
function featherRow(
  [sx, sy]: [number, number],
  [wx, wy]: [number, number],
  count: number,
  [fromDeg, toDeg]: [number, number],
  [minLen, maxLen]: [number, number],
  width: number,
  bend: number,
): Shape[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return feather(
      lerp(sx, wx, t),
      lerp(sy, wy, t),
      lerp(fromDeg, toDeg, Math.pow(t, 1.2)),
      lerp(minLen, maxLen, Math.pow(t, 1.6)),
      width,
      bend,
    );
  });
}

type Vec = [number, number];

/** A body of varying thickness swept along a chain of cubic Béziers
    (start point, then [control1, control2, end] per segment). `widthAt`
    gets 0 at the start of the spine and 1 at its end. */
function tube(start: Vec, curves: [Vec, Vec, Vec][], widthAt: (s: number) => number, steps = 24): Shape {
  const spine: Vec[] = [];
  let p0 = start;
  for (const [c1, c2, p3] of curves) {
    for (let i = spine.length ? 1 : 0; i <= steps; i++) {
      const t = i / steps;
      const u = 1 - t;
      spine.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1],
      ]);
    }
    p0 = p3;
  }

  const left: string[] = [];
  const right: string[] = [];
  spine.forEach(([x, y], i) => {
    const [ax, ay] = spine[Math.max(0, i - 1)];
    const [bx, by] = spine[Math.min(spine.length - 1, i + 1)];
    const length = Math.hypot(bx - ax, by - ay) || 1;
    const nx = -(by - ay) / length;
    const ny = (bx - ax) / length;
    const half = widthAt(i / (spine.length - 1)) / 2;
    left.push(`${x + nx * half} ${y + ny * half}`);
    right.push(`${x - nx * half} ${y - ny * half}`);
  });
  return { d: `M${left.join(" L")} L${right.reverse().join(" L")} Z` };
}

/** Thin tail tip, full-bodied middle, slimmer neck behind the head. */
const snakeWidth = (s: number) =>
  s < 0.3 ? 1.5 + (s / 0.3) * 13 : s < 0.75 ? 14.5 : 14.5 - ((s - 0.75) / 0.25) * 5.5;

const SILHOUETTES: Record<PatronusKind, Silhouette> = {
  stag: {
    label: "a stag",
    shapes: [
      ellipse(110, 110, 55, 26),
      { d: "M148 98 L174 54 L190 60 L170 114 Z" },
      { d: "M172 52 Q185 40 200 48 L222 60 Q226 67 218 69 L195 68 Q182 66 175 62 Z" },
      { d: "M180 48 L168 36 L187 43 Z" },
      { d: "M58 100 Q46 94 49 109 Z" },
      { d: "M185 46 Q180 25 165 10 M178 30 Q168 25 158 28 M172 19 Q171 10 178 3", width: FINE },
      { d: "M193 46 Q200 25 216 12 M201 30 Q211 25 220 30 M209 20 Q207 10 213 3", width: FINE },
      { d: "M150 124 L158 158 L155 186 M138 128 L137 160 L144 186", width: LIMB },
      { d: "M76 120 L70 150 L80 186 M90 125 L94 156 L90 186", width: LIMB },
    ],
  },
  snake: {
    label: "a snake",
    shapes: [
      tube(
        [22, 168],
        [
          [[44, 194], [108, 198], [140, 182]],
          [[172, 166], [164, 138], [128, 136]],
          [[92, 134], [80, 108], [106, 92]],
          [[132, 76], [124, 50], [150, 44]],
        ],
        snakeWidth,
      ),
      { d: "M146 38 Q160 31 174 35 Q186 39 190 45 Q186 51 174 54 Q160 57 146 51 Q143 45 146 38 Z" },
      feather(189, 45, 6, 13, 1.8),
      feather(201, 46, -18, 8, 1.4),
      feather(201, 46, 28, 8, 1.4),
    ],
  },
  bunny: {
    label: "a bunny",
    shapes: [
      { d: "M58 172 C50 132 72 102 106 98 C132 96 152 108 158 128 C164 150 158 170 148 182 L72 186 Q60 182 58 172 Z" },
      { d: "M128 118 C126 94 142 82 158 82 C174 82 186 94 184 108 Q183 118 174 122 C160 130 136 132 128 118 Z" },
      feather(154, 86, -98, 64, 13, 5),
      feather(143, 88, -116, 58, 12, -4),
      ellipse(156, 182, 11, 6),
      ellipse(94, 184, 32, 7),
      ellipse(54, 150, 12, 12),
      ...[0, 1, 2, 3].map((i) => feather(50, 150, 160 + i * 25, 14, 3, 2)),
    ],
  },
  phoenix: {
    label: "a phoenix",
    shapes: [
      { d: "M130 58 Q142 64 141 80 Q139 102 129 122 Q121 136 113 138 Q106 132 108 114 Q110 92 121 72 Q125 62 130 58 Z" },
      { d: "M127 62 Q129 48 139 45 Q147 44 152 50 Q159 52 162 60 Q156 56 151 59 Q145 63 138 65 Q132 67 127 62 Z" },
      { d: "M130 84 Q146 60 172 36 L178 44 Q156 70 142 92 Z" },
      { d: "M120 84 Q104 62 80 40 L74 48 Q94 70 110 92 Z" },
      ...featherRow([134, 86], [174, 38], 18, [35, -42], [30, 76], 7, 4),
      ...featherRow([136, 82], [168, 44], 12, [30, -30], [14, 30], 7, 2),
      ...featherRow([116, 86], [78, 42], 16, [145, 220], [26, 64], 6.5, -4),
      ...featherRow([114, 82], [84, 48], 11, [150, 210], [12, 26], 6.5, -2),
      ...[0, 1, 2, 3].map((i) => feather(134, 47, 200 + i * 14, 20 + i * 4, 2.2, -2)),
      ...[0, 1, 2, 3, 4, 5].map((i) => feather(113, 134, 112 + i * 11, 92 - i * 7, 6.5, 10 - i * 2)),
    ],
  },
  horse: {
    label: "a horse",
    zoom: 1.2,
    pose: { rotate: -20, pivot: [130, 110], offsetY: 10 },
    shapes: [
      {
        d: "M118 42 Q104 22 108 2 Q122 16 126 34 Q128 14 142 0 Q150 20 142 40 C148 44 154 48 156 56 Q160 62 163 64 C176 82 188 100 198 114 C204 121 208 128 206 134 C205 140 200 144 194 144 Q190 144 188 146 C190 152 184 156 178 152 C172 148 166 142 160 138 C150 136 136 134 126 126 C116 118 114 100 122 90 C112 108 108 132 112 158 C115 174 122 184 134 194 Q96 199 50 196 C42 160 46 112 70 78 C84 60 100 48 118 42 Z",
      },
      { d: "M153 68 Q158 63 165 68 Q159 74 153 68 Z", cut: true },
      { d: "M195 119 Q203 121 204 131 Q198 127 195 119 Z", cut: true },
      {
        d: "M120 40 C98 42 72 58 58 82 C46 102 40 128 38 156 C36 172 34 186 30 196 L56 196 C50 160 56 110 80 76 C92 60 106 50 120 46 Z",
      },
      feather(114, 44, 170, 40, 10, -9),
      feather(96, 54, 160, 42, 11, -10),
      feather(78, 72, 150, 42, 11, -10),
      feather(64, 96, 140, 40, 10, -9),
      feather(54, 124, 130, 36, 9, -8),
      feather(48, 152, 122, 32, 8, -7),
      ...[0, 1, 2, 3, 4].map((i) => feather(58 + i * 16, 194, 100 + i * 5, 12 + (i % 2) * 8, 4, i % 2 ? 5 : -5)),
    ],
  },
  blackCat: {
    label: "a black cat",
    shapes: [
      { d: "M90 190 Q70 150 85 110 Q95 90 120 88 Q148 90 155 120 Q165 160 150 190 Z" },
      ellipse(122, 70, 26, 26),
      { d: "M100 58 L98 30 L118 47 Z" },
      { d: "M127 47 L148 30 L146 58 Z" },
      { d: "M150 186 Q195 186 200 150 Q205 125 190 115 Q198 140 188 160 Q178 178 150 176 Z" },
      { d: "M110 140 L108 190 M134 140 L136 190", width: LIMB },
    ],
    eyes: [
      [112, 68],
      [133, 68],
    ],
  },
};

const KINDS = Object.keys(SILHOUETTES) as PatronusKind[];

export function createPatronusCast(previous?: PatronusKind): PatronusCast {
  const pool = KINDS.filter((kind) => kind !== previous);
  return { key: Date.now(), kind: pool[Math.floor(Math.random() * pool.length)] };
}

export function describePatronus(kind: PatronusKind) {
  return SILHOUETTES[kind].label;
}

/* ---------- Timeline (ms) ---------- */
const CONVERGE_STAGGER = 900;
const CONVERGE_MIN = 2200;
const CONVERGE_SPREAD = 700;
const CONVERGE_SPIN = Math.PI * 2.4;
const FORMED_AT = 3000;
const DISSOLVE_START = 5200;
const DISSOLVE_STAGGER = 500;
const DISSOLVE_MS = 1300;
const TOTAL_MS = 7200;

const PARTICLE_COUNT = 1700;
const MOTE_COUNT = 90;
const MOTE_START = FORMED_AT - 800;
const MOTE_SPAWN_SPREAD = 1400;
const SAMPLE_SCALE = 2;
const EDGE_PROBE = 12;
const SPRITE_PX = 64;
const BLOOM_DOWNSCALE = 6;
const BLOOM_ALPHA = 0.7;

type Point = { x: number; y: number; depth: number };

type Particle = {
  tx: number;
  ty: number;
  depth: number;
  startAngle: number;
  startRadius: number;
  targetAngle: number;
  targetRadius: number;
  delay: number;
  duration: number;
  size: number;
  alpha: number;
  core: boolean;
  phase: number;
  dissolveDelay: number;
  driftX: number;
  driftY: number;
};

type Mote = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  core: boolean;
  spawn: number;
  life: number;
  rise: number;
  sway: number;
  phase: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Rasterises the silhouette and returns random interior points, each
    tagged with how deep inside the shape it sits (0 = edge, 1 = core). */
function sampleSilhouette(silhouette: Silhouette, count: number): Point[] {
  const w = VIEW_W * SAMPLE_SCALE;
  const h = VIEW_H * SAMPLE_SCALE;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.scale(SAMPLE_SCALE, SAMPLE_SCALE);
  if (silhouette.pose) {
    const { rotate, pivot, offsetY } = silhouette.pose;
    ctx.translate(pivot[0], pivot[1] + offsetY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.translate(-pivot[0], -pivot[1]);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const ordered = [...silhouette.shapes].sort((a, b) => Number(!!a.cut) - Number(!!b.cut));
  for (const shape of ordered) {
    const path = new Path2D(shape.d);
    ctx.globalCompositeOperation = shape.cut ? "destination-out" : "source-over";
    if (shape.width) {
      ctx.lineWidth = shape.width;
      ctx.stroke(path);
    } else {
      ctx.fill(path);
    }
  }
  ctx.globalCompositeOperation = "source-over";

  const data = ctx.getImageData(0, 0, w, h).data;
  const filled = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && data[(y * w + x) * 4 + 3] > 128;

  const directions = Array.from({ length: 8 }, (_, i) => [
    Math.cos((i / 8) * Math.PI * 2),
    Math.sin((i / 8) * Math.PI * 2),
  ]);

  const points: Point[] = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 60) {
    attempts++;
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    if (!filled(x, y)) continue;

    let nearest = EDGE_PROBE;
    for (const [dx, dy] of directions) {
      for (let step = 1; step < nearest; step++) {
        if (!filled(Math.round(x + dx * step), Math.round(y + dy * step))) {
          nearest = step;
          break;
        }
      }
    }
    points.push({ x: x / SAMPLE_SCALE, y: y / SAMPLE_SCALE, depth: nearest / EDGE_PROBE });
  }
  return points;
}

/** A soft radial dot in the given colour, used as the particle brush. */
function makeSprite(color: string) {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_PX;
  sprite.height = SPRITE_PX;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const half = SPRITE_PX / 2;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  ctx.globalCompositeOperation = "destination-in";
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(0,0,0,1)");
  gradient.addColorStop(0.35, "rgba(0,0,0,0.55)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  return sprite;
}

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

type PatronusProps = {
  cast: PatronusCast;
  onDone: () => void;
};

export default function Patronus({ cast, onDone }: PatronusProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const silhouette = SILHOUETTES[cast.kind];
    const isDark = cast.kind === "blackCat";

    const brand = readToken("--color-brand");
    const bodyColor = isDark ? readToken("--color-neutral-900") : brand;
    const coreColor = isDark ? readToken("--color-neutral-700") : readToken("--color-accent");
    const bodySprite = makeSprite(bodyColor);
    const coreSprite = makeSprite(coreColor);
    const eyeSprite = makeSprite(readToken("--color-accent"));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const zoom = silhouette.zoom ?? 1;
    const figureW = Math.min(420 * zoom, cssW * 0.85 * zoom, cssW * 0.95, (cssH * 0.8 * VIEW_W) / VIEW_H);
    const scale = figureW / VIEW_W;
    const cx = cssW / 2;
    const cy = cssH / 2;
    const toScreenX = (x: number) => cx + (x - VIEW_W / 2) * scale;
    const toScreenY = (y: number) => cy + (y - VIEW_H / 2) * scale;

    const points = sampleSilhouette(silhouette, PARTICLE_COUNT);

    const particles: Particle[] = points.map((p) => {
      const sx = toScreenX(p.x) - cx;
      const sy = toScreenY(p.y) - cy;
      const coreChance = Math.pow(p.depth, 1.5);
      return {
        tx: sx,
        ty: sy,
        depth: p.depth,
        startAngle: rand(0, Math.PI * 2),
        startRadius: rand(4, 30),
        targetAngle: Math.atan2(sy, sx),
        targetRadius: Math.hypot(sx, sy),
        delay: rand(0, CONVERGE_STAGGER),
        duration: CONVERGE_MIN + rand(0, CONVERGE_SPREAD),
        size: scale * (3 + p.depth * 10) * rand(0.8, 1.25),
        alpha: 0.15 + p.depth * 0.12,
        core: Math.random() < coreChance * 0.6,
        phase: rand(0, Math.PI * 2),
        dissolveDelay: rand(0, DISSOLVE_STAGGER),
        driftX: rand(-60, 60),
        driftY: rand(-140, -40),
      };
    });

    const motes: Mote[] = Array.from({ length: MOTE_COUNT }, () => {
      const angle = rand(0, Math.PI * 2);
      const reach = Math.sqrt(rand(0.12, 1));
      return {
        x: Math.cos(angle) * reach * figureW * 0.7,
        y: Math.sin(angle) * reach * figureW * 0.55,
        size: 3 + Math.pow(Math.random(), 2) * 11,
        alpha: rand(0.55, 1),
        core: Math.random() < 0.5,
        spawn: MOTE_START + rand(0, MOTE_SPAWN_SPREAD),
        life: rand(1200, 2600),
        rise: rand(20, 70),
        sway: rand(4, 14),
        phase: rand(0, Math.PI * 2),
      };
    });

    const drawMotes = (t: number, fade: number) => {
      for (const mote of motes) {
        if (t < mote.spawn) continue;
        const cycle = ((t - mote.spawn) % mote.life) / mote.life;
        const twinkle = Math.sin(cycle * Math.PI) * (0.7 + 0.3 * Math.sin(t * 0.012 + mote.phase));
        const x = cx + mote.x + Math.sin(cycle * Math.PI * 2 + mote.phase) * mote.sway;
        const y = cy + mote.y - cycle * mote.rise;
        drawSprite(mote.core ? coreSprite : bodySprite, x, y, mote.size, mote.alpha * twinkle * fade);
      }
    };

    const eyes = (silhouette.eyes ?? []).map(([x, y]) => [toScreenX(x) - cx, toScreenY(y) - cy]);

    const drawSprite = (sprite: HTMLCanvasElement, x: number, y: number, size: number, alpha: number) => {
      if (alpha <= 0.002) return;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    };

    const bloom = document.createElement("canvas");
    bloom.width = Math.max(1, Math.round(cssW / BLOOM_DOWNSCALE));
    bloom.height = Math.max(1, Math.round(cssH / BLOOM_DOWNSCALE));
    const bloomCtx = bloom.getContext("2d");

    const applyBloom = () => {
      if (!bloomCtx) return;
      bloomCtx.clearRect(0, 0, bloom.width, bloom.height);
      bloomCtx.drawImage(canvas, 0, 0, bloom.width, bloom.height);
      ctx.globalAlpha = BLOOM_ALPHA;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bloom, 0, 0, cssW, cssH);
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let start = 0;

    const render = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      ctx.clearRect(0, 0, cssW, cssH);

      const floatY = reduceMotion ? 0 : -6 * Math.sin(t / 700) - Math.max(0, t - FORMED_AT) * 0.006;
      const globalFade = reduceMotion
        ? Math.min(clamp01(t / 600), clamp01((TOTAL_MS - t) / 900))
        : 1;
      const dissolveAll = clamp01((t - DISSOLVE_START) / (DISSOLVE_MS + DISSOLVE_STAGGER));

      for (const p of particles) {
        let x: number;
        let y: number;
        let alpha = p.alpha * globalFade;

        if (reduceMotion) {
          x = cx + p.tx;
          y = cy + p.ty;
        } else {
          const raw = clamp01((t - p.delay) / p.duration);
          if (raw <= 0) continue;
          const e = easeInOutCubic(raw);
          const angle = p.startAngle + (p.targetAngle - p.startAngle) * e + (1 - e) * CONVERGE_SPIN;
          const swirlR = p.startRadius + (220 + p.targetRadius) * Math.sin(e * Math.PI) * 0.45;
          const radius = swirlR * (1 - e) + p.targetRadius * e;
          const shimmer = (1 - p.depth) * 3 * scale;
          x = cx + Math.cos(angle) * radius + Math.sin(t * 0.003 + p.phase) * shimmer;
          y = cy + Math.sin(angle) * radius + Math.cos(t * 0.0025 + p.phase) * shimmer + floatY * e;

          alpha *= clamp01(raw * 4) * (0.8 + 0.2 * Math.sin(t * 0.006 + p.phase));
          const travelling = 1 - e;
          alpha += travelling * 0.25 * clamp01(raw * 4);

          const d = easeInOutCubic(clamp01((t - DISSOLVE_START - p.dissolveDelay) / DISSOLVE_MS));
          if (d > 0) {
            x += p.driftX * d;
            y += p.driftY * d;
            alpha *= 1 - d;
          }
        }

        const size = reduceMotion ? p.size : p.size * (1 + 0.6 * (1 - clamp01((t - p.delay) / p.duration)));
        drawSprite(p.core ? coreSprite : bodySprite, x, y, size, alpha);
      }

      if (eyes.length) {
        const eyeIn = reduceMotion ? 1 : clamp01((t - FORMED_AT) / 500);
        const eyeAlpha = eyeIn * (1 - dissolveAll) * globalFade;
        for (const [ex, ey] of eyes) {
          drawSprite(eyeSprite, cx + ex, cy + ey + floatY, 14 * scale, eyeAlpha);
          drawSprite(eyeSprite, cx + ex, cy + ey + floatY, 5 * scale, eyeAlpha);
        }
      }

      ctx.globalAlpha = 1;
      applyBloom();
      if (!reduceMotion) drawMotes(t, 1 - dissolveAll);
      ctx.globalAlpha = 1;

      if (t >= TOTAL_MS) {
        onDoneRef.current();
        return;
      }
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [cast]);

  return (
    <div className={`${styles.stage} ${cast.kind === "blackCat" ? styles.stageDark : ""}`} aria-hidden="true">
      <span className={styles.mist} />
      <span className={styles.burst} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
