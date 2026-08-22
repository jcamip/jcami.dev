import Button from "@/components/Button";
import ClosingCta from "@/components/ClosingCta";
import PartnersCarousel from "@/components/PartnersCarousel";
import Projects from "@/components/Projects";
import ScrollToTop from "@/components/ScrollToTop";
import TypingHeading from "@/components/TypingHeading";
import styles from "./page.module.css";

export default function Home() {
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
              href="https://calendly.com/joane-camille/30min"
              target="_blank"
              rel="noopener noreferrer"
              variant="invert"
              className={styles.heroCtaButton}
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
    </>
  );
}
