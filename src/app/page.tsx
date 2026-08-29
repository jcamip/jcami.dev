"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import BackToTopButton from "@/components/BackToTopButton";
import Button from "@/components/Button";
import PartnersCarousel from "@/components/PartnersCarousel";
import Projects from "@/components/Projects";
import ScrollToTop from "@/components/ScrollToTop";
import TypingHeading from "@/components/TypingHeading";
import styles from "./page.module.css";

const CAL_NAMESPACE = "intro";
const CAL_LINK = "joane-camille/intro";
const CAL_CONFIG = JSON.stringify({
  layout: "month_view",
  useSlotsViewOnSmallScreen: true,
  theme: "light",
});

export default function Home() {
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

  return (
    <>
      <ScrollToTop />

      <section
        className={styles.hero}
        aria-label="Joane Camille"
        data-scroll-snap="home"
        data-header-dark
      >

        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Strategy &middot; Design &middot; Digital Growth</p>
          <h1 className={styles.heroHeading}>
            <TypingHeading
              segments={[
                { text: "Building brands that " },
                { text: "move markets", className: styles.heroChrome },
                { text: ", not just pixels." },
              ]}
            />
          </h1>
          <p className={styles.heroSubheading}>
            I turn your ideas into fully developed websites. Handling everything from the visual
            direction to launch. <br/>Scroll to explore selected projects.
          </p>
          <div className={styles.heroCta}>
            <Button
              type="button"
              variant="invert"
              className={styles.heroCtaButton}
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-link={CAL_LINK}
              data-cal-config={CAL_CONFIG}
            >
              <span>Start Your Project</span>
              <svg
                className={styles.heroCtaArrow}
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
          <div className={styles.heroPartners}>
            <PartnersCarousel />
          </div>
        </div>
      </section>

      <Projects />
      <BackToTopButton />
    </>
  );
}
