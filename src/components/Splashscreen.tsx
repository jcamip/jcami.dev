"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { JCAMI_PIECES } from "./jcamiPaths";
import styles from "./Splashscreen.module.css";

const VIEW_W = 1544;
const VIEW_H = 1019;

// Fired once the curtain has fully receded — on the initial load and again
// on every internal navigation, since the curtain replays every time.
// `splashState.covering` is live for the whole time in between (set true
// synchronously before the curtain rises, false right when this fires), so
// a consumer like TypingHeading.tsx can tell "is the curtain up right now"
// apart from "has it ever finished" — the latter would go stale after the
// very first cycle and never gate anything again.
export const SPLASH_DONE_EVENT = "jcami:splashdone";
export const splashState = { covering: false };

const ENTER_MS = 420; // curtain rising, bottom -> covering (matches the CSS transition below)
const REVEAL_START_MS = 130; // beat after the curtain covers, before the first stroke starts
const STAGE_GAP_MS = 70; // pen-lift pause between one piece finishing and the next starting
const FILL_MS = 160; // once a piece's outline is fully traced, how fast it fills solid
const DRAW_SPEED = 7.5; // *drawn* (post-scale) units per ms — sets how long each piece takes to trace
const DRAW_MIN_MS = 150; // floor, so the tiny dots don't vanish-and-appear in a single frame
const DRAW_MAX_MS = 750; // ceiling, so the long j+tail stroke doesn't drag
const HOLD_MS = 350; // pause once the whole mark is drawn, before receding
const EXIT_MS = 420; // curtain receding, covering -> below (matches the CSS transition below)
// If the underlying page is already done loading (document.readyState is
// "complete", i.e. not still loading) by the time the splash starts, there's
// nothing left to mask — trim the percent counter and pen-stroke timing down
// to this fraction of normal so the curtain doesn't linger for its own sake.
const FAST_REVEAL_MULTIPLIER = 0.7;
const STROKE_WIDTH_WORLD = 36; // outline thickness in drawn (post-scale) space, shared by every piece
// Once a piece fills solid, its trace-stroke shrinks to 0 (so it doesn't
// permanently fatten the shape beyond the source artwork) while a thin
// background-colored "eraser" stroke fades in over the fill's own edges —
// a bit of vector stroke, not a pixel-based filter (feMorphology erode was
// tried and tested destructive on these thin flourish strokes even at
// modest radii), so it reliably lightens the mark's weight without
// fracturing any of the thinner strokes.
const ERASER_WIDTH_WORLD = 8;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const pieceLength = (piece: { subpaths: { length: number }[] }) =>
  piece.subpaths.reduce((sum, s) => sum + s.length, 0);

// How long a piece's stroke-dashoffset animation takes, proportional to its
// actual drawn length (path length × that piece's own scale — the "j" is
// traced from a higher-resolution source than the rest, so raw path length
// alone isn't comparable across pieces). A big loopy "j" takes longer to
// write than a small dot, same as it would by hand.
const drawDuration = (piece: { subpaths: { length: number }[]; scale: number }, fast = false) => {
  const base = Math.min(DRAW_MAX_MS, Math.max(DRAW_MIN_MS, (pieceLength(piece) * piece.scale) / DRAW_SPEED));
  return fast ? base * FAST_REVEAL_MULTIPLIER : base;
};

/**
 * Full-viewport page-transition curtain. Plays once on the initial load and
 * again on every internal navigation (intercepted below): the white
 * background rises to cover the screen, the jcami mark draws itself piece
 * by piece — traced like a pen stroke, then filled solid — in the middle,
 * then the curtain recedes to reveal the destination page, which has
 * already finished swapping in behind it by that point.
 */
// Total time the piece-by-piece reveal loop below actually takes, so the
// "000%" counter can be driven by the same numbers rather than a duration
// guessed separately — the two are built to reach 100% at the same moment
// by construction, not by coincidence. Takes `fast` so the counter and the
// loop it mirrors always agree on which mode they're in.
const totalRevealMs = (fast: boolean) =>
  JCAMI_PIECES.reduce((sum, piece) => sum + drawDuration(piece, fast) + FILL_MS + STAGE_GAP_MS, 0);

export default function Splashscreen() {
  const router = useRouter();
  const [covering, setCovering] = useState(false);
  const [drawnCount, setDrawnCount] = useState(0);
  const [percent, setPercent] = useState(0);
  // Whether this run is the sped-up variant — decided once per playSplash
  // call from document.readyState (see there) and mirrored into state so the
  // stroke transitionDurations in the render below stay in lockstep with the
  // wait()s driving drawnCount forward.
  const [fast, setFast] = useState(false);
  const runningRef = useRef(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Counts "000" up to "100" over totalMs, run alongside (not awaited by)
  // the piece-reveal loop in playSplash.
  const runPercentCounter = (totalMs: number) => {
    const start = performance.now();
    const tick = (now: number) => {
      if (!aliveRef.current) return;
      const pct = Math.min(100, Math.floor(((now - start) / totalMs) * 100));
      setPercent(pct);
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const playSplash = async (navigate?: () => void) => {
    if (runningRef.current) return;
    runningRef.current = true;
    splashState.covering = true;

    // #site-content wraps Header/main/ClosingCta in layout.tsx. Marking it
    // inert keeps keyboard focus and screen readers off the real page for
    // as long as the curtain is up.
    const siteContent = document.getElementById("site-content");
    siteContent?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";

    // If the page has already finished loading (readyState is "complete" —
    // i.e. loading is false) by the time the curtain goes up, there's no
    // real load left to mask, so run the percent counter and pen strokes a
    // bit faster instead of holding the curtain for its usual duration.
    const isFast = document.readyState === "complete";
    setFast(isFast);

    setDrawnCount(0);
    setPercent(0);
    setCovering(true);
    await wait(ENTER_MS);
    if (!aliveRef.current) return;

    // The curtain is now fully covering the screen — safe to actually
    // navigate; the swap happens unseen behind it.
    navigate?.();

    await wait(REVEAL_START_MS);
    runPercentCounter(totalRevealMs(isFast));
    for (let i = 0; i < JCAMI_PIECES.length; i++) {
      if (!aliveRef.current) return;
      setDrawnCount(i + 1);
      await wait(drawDuration(JCAMI_PIECES[i], isFast) + FILL_MS + STAGE_GAP_MS);
    }

    if (!aliveRef.current) return;
    await wait(HOLD_MS);
    if (!aliveRef.current) return;

    setCovering(false);
    await wait(EXIT_MS);
    if (!aliveRef.current) return;

    splashState.covering = false;
    window.dispatchEvent(new Event(SPLASH_DONE_EVENT));

    siteContent?.removeAttribute("inert");
    document.body.style.overflow = "";
    runningRef.current = false;
  };

  // Initial page load: same sequence, no navigation to perform.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Set synchronously here (not inside playSplash, which only actually
    // runs a frame later below) so this is visible to other components'
    // mount effects in the same commit — Splashscreen sits before
    // #site-content in the tree, so its effects run first, and something
    // like TypingHeading.tsx needs to see "covering" already true rather
    // than a stale `false` from before the curtain has risen.
    splashState.covering = true;

    // Deferred to a frame rather than called synchronously in the effect
    // body, so this stays a plain external-system subscription (same
    // pattern as TypingHeading.tsx/Header.tsx).
    const frameId = requestAnimationFrame(() => {
      playSplash();
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (including same-page hash links): let it behave natively.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      playSplash(() => router.push(`${url.pathname}${url.search}${url.hash}`));
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  return (
    <div className={styles.splash} role="status" aria-live="polite">
      <div className={covering ? `${styles.curtain} ${styles.covering}` : styles.curtain}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.logo} aria-hidden="true">
          {JCAMI_PIECES.map((piece, index) => {
            const drawMs = drawDuration(piece, fast);
            const drawn = index < drawnCount;
            const fillDelay = drawn ? drawMs : 0;
            const totalLength = pieceLength(piece);
            const combinedD = piece.subpaths.map((s) => s.d).join(" ");
            let lengthBefore = 0;
            return (
              <g key={piece.name} transform={`translate(${piece.offset[0]} ${piece.offset[1]}) scale(${piece.scale})`}>
                {piece.subpaths.map((subpath, subIndex) => {
                  const subDelay = (drawMs * lengthBefore) / totalLength;
                  const subDuration = (drawMs * subpath.length) / totalLength;
                  lengthBefore += subpath.length;
                  return (
                    <path
                      key={subIndex}
                      d={subpath.d}
                      fill="none"
                      className={styles.stroke}
                      style={{
                        strokeDasharray: subpath.length,
                        strokeDashoffset: drawn ? 0 : subpath.length,
                        strokeWidth: drawn ? 0 : STROKE_WIDTH_WORLD / piece.scale,
                        transitionDuration: `${subDuration}ms, ${FILL_MS}ms`,
                        transitionDelay: `${subDelay}ms, ${fillDelay}ms`,
                        transitionProperty: "stroke-dashoffset, stroke-width",
                      }}
                    />
                  );
                })}
                {/* Solid fill, evenodd across every subpath at once so holes
                    (the loop, the heart's center) stay open. */}
                <path
                  d={combinedD}
                  fillRule="evenodd"
                  className={styles.fill}
                  style={{
                    transitionDuration: `${FILL_MS}ms`,
                    transitionDelay: `${fillDelay}ms`,
                    fillOpacity: drawn ? 1 : 0,
                  }}
                />
                {/* Thin background-colored "eraser" traced over the fill's
                    own edges once it settles — see ERASER_WIDTH_WORLD. */}
                <path
                  d={combinedD}
                  fillRule="evenodd"
                  className={styles.eraser}
                  style={{
                    strokeWidth: ERASER_WIDTH_WORLD / piece.scale,
                    transitionDuration: `${FILL_MS}ms`,
                    transitionDelay: `${fillDelay}ms`,
                    opacity: drawn ? 1 : 0,
                  }}
                />
              </g>
            );
          })}
        </svg>
        <span className={styles.percent} aria-hidden="true">
          {String(percent).padStart(3, "0")}%
        </span>
        {covering && <span className="visuallyHidden">Loading — jcami</span>}
      </div>
    </div>
  );
}
