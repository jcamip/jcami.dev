"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { ProjectImage } from "@/data/projects";
import styles from "./Projects.module.css";

type Props = {
  title: string;
  images: ProjectImage[];
};

// Degrees/steps are hand-tuned for the fan interaction, not part of the
// spacing/typography scale in globals.css — there's no design-system token
// for "how far a hovered mockup should rotate its neighbors".
const REST_ROTATE_STEP = 6; // deg, per step away from the fan's own center
const HOVER_ROTATE_STEP = 12; // deg, per step away from the hovered image
// Pushes ipad/mobile apart enough at rest that the anchored browser mockup
// behind them stays visible dead-center instead of being fully covered.
const REST_SPREAD_MULT = 2.1;
const HOVER_SPREAD_MULT = 1.5; // how much further siblings push out on hover
const HOVER_LIFT_SELF = -24; // px, matches --space-6
const HOVER_LIFT_SIBLING = 8; // px, matches --space-2
// How much the hovered/focused image zooms in is NOT set here — it comes
// from --hover-scale in Projects.module.css (data-hovered picks it up),
// specifically so the mobile media query there can zoom in much further
// than desktop without this component needing to know about breakpoints.
const HOVER_SCALE_SIBLING = 0.88; // siblings shrink back slightly for contrast

// Each mockup's footprint relative to the shared height clamp in
// Projects.module.css — 1 = full size. The ipad reads slightly oversized
// next to the phone/browser at the same height, so it's dialed down a bit.
const BASE_SCALE_BY_TYPE: Record<ProjectImage["type"], number> = {
  browser: 1,
  ipad: 0.82,
  mobile: 1,
};

// Nudges an individual mockup's rest position past the plain step count
// computeRestOffsets gives it below — that function only knows "which
// side, how many steps out," not each device's own visual weight. The
// ipad reads better pushed further out from center than its default full
// step, and the mobile mockup a little further right than its default
// slot too; positive moves right, negative left.
const REST_OFFSET_NUDGE_BY_TYPE: Record<ProjectImage["type"], number> = {
  browser: 0,
  ipad: -0.35,
  mobile: 0.25,
};

// Per-type override for how far a hovered mockup zooms in, layered on top
// of .frameVisual's shared --hover-scale (1.22) in Projects.module.css —
// omit a type here to just use that shared default. Only the ipad needs
// its own: at the shared scale it barely grows next to how much the
// phone/browser mockups zoom, since it starts from a taller BASE_SCALE_BY_TYPE.
const HOVER_SCALE_BY_TYPE: Partial<Record<ProjectImage["type"], number>> = {
  ipad: 1.55,
};

// Custom properties consumed by .frame/.frameVisual's transforms in
// Projects.module.css — typed separately since React.CSSProperties doesn't
// know about them.
type FrameStyle = CSSProperties & {
  "--rest-spread"?: number;
  "--spread-delta"?: number;
  "--rot"?: string;
  "--lift"?: number;
  "--scale"?: number;
  "--size-scale"?: number;
  "--visual-z"?: number;
  "--aspect"?: number;
  "--hover-scale"?: number;
};

// z-index bump so the hovered mockup's *visual* paints above its siblings.
// This lives only on .frameVisual, never on .frame (see the note below) —
// keep it well clear of any z-index elsewhere in this stack.
const HOVERED_VISUAL_Z = 20;

// Where each image sits in the *resting* fan, as a step count from the
// center (negative = left, positive = right) — independent of hover.
// The "browser" mockup, if there is one, always anchors dead-center
// regardless of where it falls in the data array; every other image keeps
// its relative array order but alternates out to either side of it
// (closest first). With no browser image, everything fans out symmetrically
// around the array's own center instead.
function computeRestOffsets(images: ProjectImage[]): number[] {
  const browserIndex = images.findIndex((image) => image.type === "browser");
  if (browserIndex === -1) {
    const center = (images.length - 1) / 2;
    return images.map((_, index) => index - center);
  }

  let otherIndex = 0;
  return images.map((_, index) => {
    if (index === browserIndex) return 0;
    const step = Math.floor(otherIndex / 2) + 1;
    const side = otherIndex % 2 === 0 ? -1 : 1;
    otherIndex += 1;
    return step * side;
  });
}

export default function ProjectMedia({ title, images }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Real mouse hover only (see the pointerType guard below) — desktop's
  // fan interaction.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Tap/click only, and persistent (unlike hover, which ends the instant
  // the pointer leaves) — phones have no hover to drive the fan/zoom
  // effect with, so tapping a mockup pins the SAME effect on instead.
  // Cleared by tapping again (any mockup, or elsewhere — see the effect
  // below), or Escape.
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  // Whichever is active drives the fan math below; mouse hover wins if
  // both are somehow set (can't happen on a real device, but keeps this
  // unambiguous). A single unified value here — rather than two parallel
  // copies of the spread/rotate/scale logic — is what makes tapping an
  // image center *that* image and fan the rest aside exactly like
  // hovering already does on desktop, instead of a separate mechanism
  // that (as shipped once; see git history) grew every mockup at once
  // regardless of which one was tapped.
  const activeIndex = hoveredIndex ?? tappedIndex;

  // Replaces the pointer with a "Selected Works" label that follows it
  // while over any mockup, mirroring ProjectDetails.tsx's cursorHint for
  // its title button (see .frame's cursor: none and .mediaCursorHint in
  // Projects.module.css). Tracked relative to stackRef rather than the
  // viewport for the same reason as that one: .stack fades/rises via its
  // own transform (see .stack[data-visible]), which would otherwise make
  // it the containing block for a viewport-relative-coordinate tooltip.
  const [cursorHint, setCursorHint] = useState<{ x: number; y: number } | null>(null);

  // Smooth one-time entrance the first time this project's stack scrolls
  // into view — not a repeating reveal, so the observer disconnects itself
  // once triggered.
  useEffect(() => {
    const node = stackRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Un-pinning a tapped mockup: Escape, or a click ANYWHERE (the same
  // mockup again, a different one, or genuinely outside the stack —
  // each .frame's onClick below only ever sets a new tappedIndex, it
  // never clears one, specifically so this is the one and only path back
  // to null regardless of where that second tap lands). Registering in
  // an effect rather than inline on each .frame means it also catches
  // taps that land outside every .frame's own box (the focused mockup
  // can render past .stack's edges once zoomed in — see .frameVisual's
  // mobile override below). Attaching after the opening tap has already
  // finished dispatching (an effect only runs after commit) means that
  // same tap can't immediately clear what it just set.
  useEffect(() => {
    if (tappedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTappedIndex(null);
    };
    const onDocumentClick = () => setTappedIndex(null);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, [tappedIndex]);

  const restOffsets = computeRestOffsets(images).map(
    (offset, index) => offset + REST_OFFSET_NUDGE_BY_TYPE[images[index].type]
  );

  return (
    <div
      ref={stackRef}
      className={styles.stack}
      data-visible={isVisible || undefined}
      role="group"
      aria-label={`${title} preview`}
    >
      {images.map((image, index) => {
        // With nothing focused, each image sits at its resting offset
        // (see computeRestOffsets). Once one is hovered or tapped,
        // offsets are recomputed relative to *its* resting slot instead
        // — that image becomes the new center (rotation and spread both
        // zero out) and zooms in, and every other image is pushed
        // further along its existing side, opening the fan around it.
        // With a single image both offsets are always 0, so focusing it
        // just zooms it in place — there's no sibling to fan out or
        // center relative to.
        const restOffset = restOffsets[index];
        const restSpread = restOffset * REST_SPREAD_MULT;
        const hoverOffset = activeIndex === null ? null : restOffset - restOffsets[activeIndex];
        const isHovered = hoverOffset === 0;

        const spread = hoverOffset === null ? restSpread : isHovered ? 0 : hoverOffset * HOVER_SPREAD_MULT;
        const rotateStep = hoverOffset === null ? REST_ROTATE_STEP : HOVER_ROTATE_STEP;
        const rotate = hoverOffset === null ? restOffset * rotateStep : isHovered ? 0 : hoverOffset * rotateStep;
        const lift = isHovered ? HOVER_LIFT_SELF : hoverOffset === null ? 0 : HOVER_LIFT_SIBLING;
        // Rest and pushed-aside siblings get a flat number here; the
        // hovered image's zoom is left for CSS to fill in (see
        // visualStyle below) so it can vary by breakpoint.
        const scale = hoverOffset === null ? 1 : isHovered ? null : HOVER_SCALE_SIBLING;

        // .frame (the hit-testable box) only ever sits at the image's
        // *resting* position/size — it never itself animates, and
        // deliberately carries NO z-index: overlapping hitboxes fall back
        // to plain DOM order, which already puts the anchored browser
        // (first in the array) behind ipad/mobile (later) — exactly the
        // rest-state layering we want, and it can never change. .frameVisual
        // (its child) carries the actual hover motion as a delta from that
        // fixed anchor, plus its own z-index bump while hovered.
        //
        // Both halves of this split matter. Without a static hit box, the
        // hovered image would animate out from under a stationary cursor,
        // firing mouseleave, snapping back under the cursor, firing
        // mouseenter again — a jiggling feedback loop. And without keeping
        // z-index off of .frame, boosting a hitbox's own z-index on hover
        // backfires: the browser mockup's box is wide enough to geometrically
        // cover ipad/mobile's boxes almost entirely, so the moment it was
        // hovered even briefly (e.g. the pointer crossing it en route to a
        // neighbor), its raised z-index made it win hit-testing everywhere
        // it overlapped them too — trapping hover on it and making the
        // others nearly impossible to hover afterward.
        const frameStyle: FrameStyle = {
          "--rest-spread": restSpread,
          "--size-scale": BASE_SCALE_BY_TYPE[image.type],
          aspectRatio: `${image.width} / ${image.height}`,
        };
        const visualStyle: FrameStyle = {
          "--spread-delta": spread - restSpread,
          "--rot": `${rotate}deg`,
          "--lift": lift,
          // Own aspect ratio, unused on desktop — the mobile media query's
          // hovered state sizes independently (height/aspect-ratio) rather
          // than scaling up the rest size, so it needs this to size each
          // mockup's own shape correctly. See the CSS for why: a flat scale
          // big enough to make the portrait phone mockup fill a phone
          // screen would blow the landscape browser mockup way past its
          // width.
          "--aspect": image.width / image.height,
          // Omit --scale entirely when hovered rather than passing a
          // number — an inline style always wins over a stylesheet rule,
          // so leaving it unset is what lets .frameVisual[data-hovered]'s
          // --hover-scale (and its mobile media-query override) apply.
          ...(scale === null ? null : { "--scale": scale }),
          ...(isHovered ? { "--visual-z": HOVERED_VISUAL_Z } : null),
          // Inline custom property wins over the stylesheet's shared
          // --hover-scale: 1.22 for whichever type has its own entry in
          // HOVER_SCALE_BY_TYPE above.
          ...(HOVER_SCALE_BY_TYPE[image.type] !== undefined
            ? { "--hover-scale": HOVER_SCALE_BY_TYPE[image.type] }
            : null),
        };

        return (
          <div
            key={image.src}
            className={styles.frame}
            style={frameStyle}
            // pointerType-gated rather than onMouseEnter/Leave: a tap
            // fires a synthetic mouse-enter for compatibility too, which
            // would set hoveredIndex on every tap right alongside
            // tappedIndex below, needlessly running both at once (this
            // shipped stacking their effects — a hover-driven zoom AND a
            // tap-driven one compounding into an ever-larger image — once;
            // see git history). Real mouse hover (desktop's fan
            // interaction) still reports pointerType "mouse" and is
            // unaffected.
            onPointerEnter={(event: PointerEvent) => {
              if (event.pointerType === "mouse") setHoveredIndex(index);
            }}
            onPointerMove={(event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;
              const rect = stackRef.current?.getBoundingClientRect();
              if (!rect) return;
              setCursorHint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
            }}
            onPointerLeave={(event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;
              setHoveredIndex(null);
              setCursorHint(null);
            }}
            // Tapping *this specific* mockup is what pins activeIndex to
            // it (see the comment by tappedIndex above) — not a click
            // handler on .stack as a whole, which couldn't know which one
            // was actually tapped and ended up zooming all of them
            // together instead of just this one (this shipped that way
            // once too; see git history).
            onClick={() => setTappedIndex(index)}
          >
            <div className={styles.frameVisual} style={visualStyle} data-hovered={isHovered || undefined}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={styles.frameImage}
                draggable={false}
                sizes="(min-width: 1024px) 45vw, 80vw"
                loading="lazy"
              />
            </div>
          </div>
        );
      })}

      {cursorHint && (
        <span
          className={styles.mediaCursorHint}
          style={{ left: cursorHint.x, top: cursorHint.y }}
          aria-hidden="true"
        >
          Selected Works
        </span>
      )}
    </div>
  );
}
