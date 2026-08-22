"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./AboutHero.module.css";

type Phase = "idle" | "descend" | "grow" | "split" | "revealed";


const INTRO_PAUSE_MS = 200;
const DESCEND_MS = 550;
const GROW_MS = 850;
const SPLIT_MS = 650;
const SPLASH_FALLBACK_MS = 4000;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));


const BIO_SETTLE_PX = 250;

const bio = `Joane Camille has always moved between two worlds: one led by imagination, the other grounded in logic. Where they meet, scattered thoughts find structure, complex ideas become clear, and creativity takes tangible form.

Creativity, for Cami, begins with connection—bringing fragments together, recognizing patterns, and shaping ideas as they unfold. She began coding at an early age, discovering a natural affinity for systems, problem-solving, and building things from the ground up. Studying Computer Engineering strengthened that foundation, while front-end development became the meeting point between technical thinking and creative expression—where structure becomes visual, ideas become interactive, and technology feels more human.

Cami’s professional journey began at Accenture as a Software Engineer. Since then, she has built software for the healthcare and events industries, progressing from Software Developer to her current role as a Senior Software Developer. Each chapter has strengthened her ability to navigate complex systems, organize moving parts, and transform ideas into thoughtful digital experiences.

Along the way, Cami discovered that being a creator and an operator were never opposing qualities. Technical discipline did not restrict creativity; it amplified it. Creative instinct opens new possibilities, while an operator’s mindset brings the clarity and structure needed to make them real. Together, they define how Cami thinks, builds, and creates.

At the heart of Cami’s identity is ᜃᜋᜒ, the Baybayin rendering of Ka-mi. In this pre-colonial Philippine writing system, ᜃ represents ka, while ᜋᜒ represents mi. Together, the characters form Cami’s name and a personal emblem rooted in Filipino heritage.

More than a visual signature, ᜃᜋᜒ represents the creative identity Cami brings to everything she builds. It reflects the way she approaches her work: understanding the structure behind an idea, then shaping it into something personal, relevant, and tangible. Just as Baybayin gives her name a visual form, code gives her imagination the structure it needs to become real.

Based in Dubai and working worldwide, Cami brings clarity to complexity and transforms ideas into experiences that feel thoughtful, purposeful, and distinctly human.

`;

const BIO_PARAGRAPHS = bio.trim().split(/\n{2,}/);


export default function AboutHero() {
  const [phase, setPhase] = useState<Phase>("idle");
  const aliveRef = useRef(true);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const bioViewportRef = useRef<HTMLDivElement>(null);
  const bioInnerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);


  useEffect(() => {
    const wrap = pinWrapRef.current;
    if (wrap) wrap.setAttribute("data-js-ready", "true");

    const measure = () => {
      const viewport = bioViewportRef.current;
      const inner = bioInnerRef.current;
      if (!viewport || !inner) return;
      setScrollRange(Math.max(0, inner.scrollHeight - viewport.clientHeight));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);


  useEffect(() => {
    const inner = bioInnerRef.current;
    const wrap = pinWrapRef.current;
    if (!inner || !wrap) return;

    if (scrollRange <= 0) {
      inner.style.transform = "";
      return;
    }

    const computeTarget = () => {
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      return Math.min(scrollRange, Math.max(0, window.scrollY - wrapTop));
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      let ticking = false;
      const apply = () => {
        ticking = false;
        inner.style.transform = `translateY(-${computeTarget()}px)`;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
      };
      apply();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    let raf = 0;
    let current = computeTarget();
    inner.style.transform = `translateY(-${current}px)`;
    const tick = () => {
      const target = computeTarget();
      current += (target - current) * 0.15;
      // Snaps once close enough, so it actually settles instead of
      // approaching the target forever in ever-smaller fractions.
      if (Math.abs(target - current) < 0.5) current = target;
      inner.style.transform = `translateY(-${current}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollRange]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion: leave `phase` at "idle" and never advance it — the
    // settled layout is what AboutHero.module.css renders outside its
    // `(prefers-reduced-motion: no-preference)` blocks, so there's nothing
    // left to orchestrate.
    if (reduceMotion) return;

    let settle = () => {};
    const splashDone = new Promise<void>((resolve) => {
      settle = resolve;
      window.addEventListener("jcami:splashdone", settle, { once: true });
    });

    const run = async () => {
      await Promise.race([splashDone, wait(SPLASH_FALLBACK_MS)]);
      if (!aliveRef.current) return;
      await wait(INTRO_PAUSE_MS);
      if (!aliveRef.current) return;
      setPhase("descend");
      await wait(DESCEND_MS);
      if (!aliveRef.current) return;
      setPhase("grow");
      await wait(GROW_MS);
      if (!aliveRef.current) return;
      setPhase("split");
      await wait(SPLIT_MS);
      if (!aliveRef.current) return;
      setPhase("revealed");
    };

    run();
    return () => {
      window.removeEventListener("jcami:splashdone", settle);
    };
  }, []);

  return (
    <div className={styles.pinWrap} ref={pinWrapRef}>
      <section className={styles.hero} data-phase={phase}>
        {/* Scroll-driven bio, masked (not clipped) around the
            name/mark/description band (see .bioViewport in
            AboutHero.module.css) — applies at every width once
            [data-js-ready] is set, see the effects above. A child of
            .hero specifically so it's included in .hero's own sticky box
            and therefore always moves together with the pinned name. */}
        <div className={styles.bioViewport} ref={bioViewportRef}>
          <div className={styles.bioInner} ref={bioInnerRef}>
            {BIO_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className={styles.bioParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <h1 className={styles.nameHeading}>
          <span className={styles.nameUnified} aria-hidden="true" data-glitch="JOANE CAMILLE">
            JOANE CAMILLE
          </span>

  
          <span className={styles.nameRow} aria-hidden="true">
            <Link href="/" tabIndex={-1} className={`${styles.name} ${styles.nameFirst}`}>
              JOANE
            </Link>
            <Link href="/" tabIndex={-1} className={`${styles.name} ${styles.nameLast}`}>
              CAMILLE
            </Link>
          </span>
   
          <Link href="/" className="visuallyHidden">
            Joane Camille
          </Link>
      
          <Image
            src="/images/kami.png"
            alt=""
            width={34}
            height={56}
            className={styles.mark}
          />
        </h1>
        <p className={styles.description}>
          WHERE CODE MEETS CREATIVITY
          <br />
          BASED IN DUBAI, WORKING WORLDWIDE
        </p>
      </section>


      <div
        className={styles.bioSpacer}
        style={{ height: scrollRange > 0 ? scrollRange + BIO_SETTLE_PX : 0 }}
        aria-hidden="true"
      />


      <div className={styles.bioMobile}>
        {BIO_PARAGRAPHS.map((paragraph, index) => (
          <p key={index} className={styles.bioParagraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
