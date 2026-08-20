"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import styles from "./Projects.module.css";

type Props = {
  title: string;
  year?: number;
  description: string;
  href?: string;
};

// How fast the description types out once revealed. Quicker than
// TypingHeading's hero pace (32ms/char) since this replays on every
// hover/click rather than once per page load — a slower pace would feel
// sluggish on repeat.
const CHAR_DELAY_MS = 16;

// Arrow icon shared with the hero's CTA button (page.tsx heroCtaButton) —
// same visual language for "go to this link" across the site.
function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10H16M16 10L11 5M16 10L11 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The year/title/description/CTA cluster pinned to the page's right edge
// (see .details in Projects.module.css). Hovering or focusing the title
// opens the description below it with a typing animation; unlike a normal
// hover reveal, moving the pointer or focus away does NOT close it again
// — only clicking the title does (clicking a second time reopens it).
// Hover/focus can only turn it on, never off, so they're bound with
// setIsOpen(true) rather than a toggle; the click handler is the only
// thing that can turn it back off.
export default function ProjectDetails({ title, year, description, href }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // On phones there's no hover, and requiring a tap just to read the
  // description/find the link adds friction a desktop hover doesn't have
  // — open it automatically instead. Checked once on mount rather than
  // watched live: a phone being resized across this breakpoint mid-visit
  // isn't a real scenario worth a resize listener for (same one-shot
  // pattern as the reduced-motion check below). Still fully toggleable
  // afterward via the title's own click handler, same as desktop.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const frameId = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  const [visibleCount, setVisibleCount] = useState(0);
  const isTyped = visibleCount >= description.length;
  const descriptionId = useId();

  // Replaces the pointer with a "More Details" label that follows it while
  // over the title, instead of the browser's default hand cursor (see
  // .detailsTitle's cursor: none and .cursorHint in Projects.module.css).
  // Positioned relative to titleWrapRef (not the viewport) so it tracks
  // correctly regardless of .details' own transform: translateY(-50%) —
  // a transform on an ancestor makes it the containing block for any
  // position: fixed descendant, which would otherwise misplace a
  // viewport-relative-coordinate tooltip against .details' own small box
  // instead of the actual cursor position.
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const [cursorHint, setCursorHint] = useState<{ x: number; y: number } | null>(null);

  const handleTitleMouseMove = (event: MouseEvent) => {
    const rect = titleWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorHint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  // Types the description out character by character each time it opens;
  // resets to empty on close so it replays from scratch next time, rather
  // than TypingHeading's play-once-ever behavior — this is a repeatable
  // reveal, not a one-time hero animation. The characters are still
  // counted/revealed in normal reading order (0..N) — the right-to-left
  // *look* comes entirely from .descriptionText's text-align: right in
  // Projects.module.css, which keeps the newest character anchored at the
  // fixed right edge and grows the revealed text leftward from there,
  // rather than from reversing the string itself (which would render
  // unreadable nonsense mid-type).
  useEffect(() => {
    let frameId = 0;

    if (!isOpen) {
      // Deferred to a frame rather than called synchronously in the effect
      // body, so this stays a plain external-system subscription (see the
      // same pattern in TypingHeading.tsx).
      frameId = requestAnimationFrame(() => setVisibleCount(0));
      return () => cancelAnimationFrame(frameId);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      frameId = requestAnimationFrame(() => setVisibleCount(description.length));
      return () => cancelAnimationFrame(frameId);
    }

    const startTime = performance.now();
    const tick = (now: number) => {
      const count = Math.min(description.length, Math.floor((now - startTime) / CHAR_DELAY_MS) + 1);
      setVisibleCount(count);
      if (count < description.length) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isOpen, description]);

  return (
    <div className={styles.details}>
      {year && <span className={styles.year}>{year}</span>}

      <div
        ref={titleWrapRef}
        className={styles.titleWrap}
        onMouseEnter={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
      >
        <h3 className={styles.detailsTitleHeading}>
          <button
            type="button"
            className={styles.detailsTitle}
            aria-expanded={isOpen}
            aria-controls={descriptionId}
            onClick={() => setIsOpen((open) => !open)}
            onMouseMove={handleTitleMouseMove}
            onMouseLeave={() => setCursorHint(null)}
          >
            {title}
          </button>
        </h3>

        {cursorHint && (
          <span
            className={styles.cursorHint}
            style={{ left: cursorHint.x, top: cursorHint.y }}
            aria-hidden="true"
          >
            Project Details
          </span>
        )}

        <div
          id={descriptionId}
          className={styles.descriptionPanel}
          data-open={isOpen || undefined}
          aria-hidden={!isOpen}
        >
          <p className={styles.descriptionText}>{description.slice(0, visibleCount)}</p>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              data-visible={isTyped || undefined}
              tabIndex={isTyped ? undefined : -1}
            >
              <span>View Website</span>
              <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
