import type { Metadata } from "next";
import BackToTopButton from "@/components/BackToTopButton";
import PageCta from "@/components/PageCta";
import SkillsShowcase from "@/components/SkillsShowcase";

import styles from "./services.module.css";
import ServicesOffer from "./ServicesOffer";

export const metadata: Metadata = {
  title: "Services — Joane Camille",
  description:
    "Brand strategy, product design, web development, and growth consulting services offered by Joane Camille.",
};



const SKILL_GROUPS = [
  {
    label: "Capabilities",
    items: [
      "Web Development",
      "Ecommerce",
      "DevOps & Hosting",
      "AI",
      "Product Design",
      "Brand Strategy",
      "Design Systems",
      "Headless Shopify",
    ],
  },
  {
    label: "Tech Stack",
    items: [
      "Next.js", 
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Tailwind CSS",
      "Git & GitHub",
      "CMS Integration",
      "Analytics & Tracking",],
  },
  {
    label: "Inspiracion",
    items: ["Music", "Futurism & Digital Brutalism", "Middle Eastern Culture", "Animation", "Typography", "Art", "Cubao Streets", "Technology"],
  },
];

const SKILL_IMAGES: { src: string; alt: string }[] = [
  {
    src: "/images/service-skill1.png",
    alt: "Ecom",
  },
  {
    src: "/images/service-s2.png",
    alt: "Mobile",
  },
  {
    src: "/images/service-skill3.png",
    alt: "Typography",
  },
];

export default function ServicesPage() {
  return (
    <>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <filter id="brushStroke" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a8a90" />
          <stop offset="25%" stopColor="#f2f2f4" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#b4b4ba" />
          <stop offset="100%" stopColor="#6c6c72" />
        </linearGradient>
      </svg>

      {/* first section: */}
      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          src="/videos/sser.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <span className="eyebrow">Services</span>
          {/* <h1>Full-scope support, from strategy to launch.</h1> */}
          <h1>Vision, design, and technology in flow.</h1>
          <p className={styles.heroSubtitle}>
            Great ideas need the right strategy, design, and execution to make an impact.<br /> Here’s where I can help.
          </p>
        </div>

        <a href="#offer" className={styles.heroScrollButton} aria-label="Scroll to what I offer">
          <svg width="40" height="32" viewBox="0 0 24 18" fill="none" aria-hidden="true">
            <path
              className={styles.heroGlitchSilver}
              d="M6 5 L12 12 L18 5"
              stroke="url(#silverGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className={styles.heroGlitchRed}
              d="M6 5 L12 12 L18 5"
              stroke="var(--color-brand)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 5 L12 12 L18 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      {/* second section: */}
      <ServicesOffer />

      {/* third section: */}
      <SkillsShowcase
        eyebrow="Key Skills & Interests"
        title="What I bring to every project"
        description="A quick look at the tools, expertise, and inspirations that shape how I design and build."
        groups={SKILL_GROUPS}
        images={SKILL_IMAGES}
      />

{/* fourth section:  */}
      <PageCta
        title="Not sure which service fits?"
        description="Tell me about your project and I’ll help you figure out the right scope."
        buttonLabel="Start the conversation"
        href="/connect"
      />

      <BackToTopButton />
    </>
  );
}
