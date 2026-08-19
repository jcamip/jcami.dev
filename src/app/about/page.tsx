import type { Metadata } from "next";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Joane Camille",
  description:
    "Learn about Joane Camille's approach to strategy, design, and building digital products that perform.",
};

const VALUES = [
  {
    title: "Clarity over noise",
    description: "Good work starts with a clear problem statement. I cut through ambiguity fast.",
  },
  {
    title: "Ownership",
    description: "I treat every project like it carries my name — because it does.",
  },
  {
    title: "Craft as standard",
    description: "Polish isn't a phase at the end. It's the baseline for everything I ship.",
  },
  {
    title: "Honest counsel",
    description: "I'll tell you when an idea won't work, and why — before it costs you time.",
  },
];

const TIMELINE = [
  {
    year: "Foundations",
    description: "Started in brand strategy and visual design, working across early-stage startups.",
  },
  {
    year: "Expansion",
    description: "Grew into full product design and front-end development to ship ideas end-to-end.",
  },
  {
    year: "Today",
    description: "Partnering directly with founders and teams as an independent strategy & design practice.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="eyebrow">About</span>
          <h1>Design is strategy made visible.</h1>
          <p className={styles.heroSubtitle}>
            I&rsquo;m Joane Camille — a strategist and designer who helps brands translate ambition
            into digital experiences people actually trust. My work sits at the intersection of
            business thinking and craft: sharp enough to hold up in a boardroom, refined enough to
            hold up on screen.
          </p>
        </div>
      </section>

      <section className={`section ${styles.values}`}>
        <div className="container">
          <SectionHeading
            eyebrow="What I believe"
            title="Principles that shape every engagement"
          />
          <div className={`grid ${styles.valueGrid}`}>
            {VALUES.map((value) => (
              <article key={value.title} className={styles.valueCard}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.timelineSection}`}>
        <div className="container">
          <SectionHeading eyebrow="The journey" title="How this practice came to be" />
          <ol className={styles.timeline}>
            {TIMELINE.map((item) => (
              <li key={item.year} className={styles.timelineItem}>
                <span className={styles.timelineYear}>{item.year}</span>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.cta}`}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Let&rsquo;s build something worth talking about.</h2>
          <Button href="/connect" variant="primary">
            Connect with me
          </Button>
        </div>
      </section>
    </>
  );
}
