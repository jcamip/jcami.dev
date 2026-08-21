"use client";

import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import styles from "./ClosingCta.module.css";

const CALENDLY_URL = "https://calendly.com/joane-camille/30min";

// Final screen of the home page's scroll-snap sequence (see .closing in
// ClosingCta.module.css) — sits directly after the last project in
// Projects.tsx and reiterates the hero's own "book a call" CTA now that the
// visitor has scrolled through the work. Below the CTA, a compact meta bar
// stands in for the site Footer (which deliberately doesn't render on the
// home page — see the pathname check in Footer.tsx) with just location,
// email, and copyright.
export default function ClosingCta() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // Services page has its own closing CTA section (see .cta in
  // services.module.css) — skip this one there to avoid a duplicate.
  if (pathname === "/services") return null;

  return (
    <section className={styles.closing} aria-label="Get in touch">
      <div className={`container ${styles.content}`}>
        <span className={styles.kicker}>Let&rsquo;s Talk</span>
        <h2>Have a project in mind? Let&rsquo;s set up a meeting.</h2>
        <p>
          Book a free 30-minute call and let&rsquo;s talk through your goals, timeline, and how I
          can help. I work remotely, with clients everywhere.
        </p>
        <Button
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="brand"
          className={styles.ctaButton}
        >
          <span>Schedule a Meeting</span>
          <svg
            className={styles.ctaArrow}
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div className={`container ${styles.meta}`}>
        <span className={styles.location}>Dubai, UAE</span>
        <a href="mailto:hello@jcami.dev" className={styles.email}>
          hello@jcami.dev
        </a>
        <p className={styles.copyright}>&copy; {year} JOANE CAMILLE</p>
      </div>
    </section>
  );
}
