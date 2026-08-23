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


export default function ProjectDetails({ title, year, description, href }: Props) {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const frameId = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  const [visibleCount, setVisibleCount] = useState(0);
  const isTyped = visibleCount >= description.length;
  const descriptionId = useId();

  const titleWrapRef = useRef<HTMLDivElement>(null);
  const [cursorHint, setCursorHint] = useState<{ x: number; y: number } | null>(null);

  const handleTitleMouseMove = (event: MouseEvent) => {
    const rect = titleWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorHint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

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
