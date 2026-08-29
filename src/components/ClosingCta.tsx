"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import styles from "./ClosingCta.module.css";

const CAL_NAMESPACE = "intro";
const CAL_LINK = "joane-camille/intro";
const CAL_CONFIG = JSON.stringify({
  layout: "month_view",
  useSlotsViewOnSmallScreen: true,
  theme: "light",
});

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

  useEffect(() => {
    void (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#a00000",
          },
          dark: {
            "cal-brand": "#a00000",
          },
        },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, []);

  // Services and About pages each have their own closing CTA section (see
  // .cta in services.module.css / about.module.css) — skip this one there
  // to avoid a duplicate.
  if (pathname === "/services" || pathname === "/about") return null;

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
          type="button"
          variant="brand"
          className={styles.ctaButton}
          data-cal-namespace={CAL_NAMESPACE}
          data-cal-link={CAL_LINK}
          data-cal-config={CAL_CONFIG}
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
