"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./TypingHeading.module.css";

type Segment = {
  text: string;
  className?: string;
};

type TypingHeadingProps = {
  /** Chunks of text typed out in order; give a chunk a className to color
      or style it differently (e.g. an emphasized phrase) without breaking
      the character sequence. */
  segments: Segment[];
  /** Milliseconds between each character appearing. */
  charDelayMs?: number;
  /** Delay before the first character appears. */
  startDelayMs?: number;
  playOnceKey?: string;
};

const playedKeys = new Set<string>();


export default function TypingHeading({
  segments,
  charDelayMs = 32,
  startDelayMs = 300,
  playOnceKey = "hero-typing-played",
}: TypingHeadingProps) {
  const fullText = useMemo(() => segments.map((segment) => segment.text).join(""), [segments]);
  // Cumulative character offset each segment starts at, so the map below
  // can slice its slot of `visibleCount` without mutating a variable
  // across iterations.
  const segmentStarts = useMemo(() => {
    const starts: number[] = [];
    let offset = 0;
    for (const segment of segments) {
      starts.push(offset);
      offset += segment.text.length;
    }
    return starts;
  }, [segments]);

  const [visibleCount, setVisibleCount] = useState(0);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = playedKeys.has(playOnceKey);

    let frameId = 0;

    if (reduceMotion || alreadyPlayed) {
      // Still deferred to a frame rather than called synchronously in the
      // effect body, so this stays a plain external-system subscription.
      frameId = requestAnimationFrame(() => {
        setVisibleCount(fullText.length);
        setShowCursor(!reduceMotion);
      });
      return () => cancelAnimationFrame(frameId);
    }

    const startTime = performance.now() + startDelayMs;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      const count = Math.min(fullText.length, Math.floor(elapsed / charDelayMs) + 1);
      setVisibleCount(count);
      if (count >= fullText.length) {
        setShowCursor(true);
        playedKeys.add(playOnceKey);
        return;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [fullText, charDelayMs, startDelayMs, playOnceKey]);

  return (
    <>
      <span aria-hidden="true">
        {segments.map((segment, index) => {
          const visible = Math.max(0, Math.min(segment.text.length, visibleCount - segmentStarts[index]));
          return (
            <span key={index} className={segment.className}>
              {segment.text.slice(0, visible)}
            </span>
          );
        })}
        <span className={showCursor ? `${styles.cursor} ${styles.cursorOn}` : styles.cursor} />
      </span>
      <span className="visuallyHidden">{fullText}</span>
    </>
  );
}
