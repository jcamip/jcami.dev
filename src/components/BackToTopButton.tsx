"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTopButton.module.css";

// How far down the page a visitor has to scroll before the button offers
// itself — below this the top of the page is already one scroll away, so
// showing it from the very first pixel would just be clutter.
const SHOW_AFTER_PX = 480;

/**
 * Fixed bottom-right "back to top" button. Reuses the same three-layer
 * chromatic-aberration glitch treatment as the hero's scroll-down chevron
 * (see .heroGlitchSilver/.heroGlitchRed in services.module.css) — silver
 * and red copies jitter in opposite directions behind a solid black arrow
 * so the two color fringes read as glitch artifacts rather than a shadow.
 */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_PX);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a8a90" />
            <stop offset="25%" stopColor="#f2f2f4" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#b4b4ba" />
            <stop offset="100%" stopColor="#6c6c72" />
          </linearGradient>
        </defs>
      </svg>

      <button
        type="button"
        className={`${styles.backToTop} ${isVisible ? styles.visible : ""}`}
        onClick={handleClick}
        aria-label="Back to top"
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
      >
        <svg width="20" height="20" viewBox="0 0 24 18" fill="none" aria-hidden="true">
          <path
            className={styles.backToTopGlitchSilver}
            d="M6 13 L12 6 L18 13"
            stroke="url(#silverGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={styles.backToTopGlitchRed}
            d="M6 13 L12 6 L18 13"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 13 L12 6 L18 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
