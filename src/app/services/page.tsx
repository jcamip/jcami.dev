import type { Metadata } from "next";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services — Joane Camille",
  description:
    "Brand strategy, product design, web development, and growth consulting services offered by Joane Camille.",
};

const SERVICES = [
  {
    title: "Brand Strategy",
    description:
      "Positioning, messaging, and identity foundations that give a brand a clear, defensible point of view in a crowded market.",
    deliverables: ["Brand positioning", "Messaging framework", "Visual identity", "Voice & tone guidelines"],
  },
  {
    title: "Product Design",
    description:
      "End-to-end UX/UI design for web and product experiences — from early wireframes to polished, developer-ready interfaces.",
    deliverables: ["UX research & flows", "Wireframing", "High-fidelity UI", "Design systems"],
  },
  {
    title: "Web Development",
    description:
      "Fast, accessible, production-grade builds on modern frameworks like Next.js — engineered for performance from day one.",
    deliverables: ["Responsive builds", "CMS integration", "Performance tuning", "Accessibility audits"],
  },
  {
    title: "Growth Consulting",
    description:
      "Data-informed roadmaps that connect design and product decisions to measurable business outcomes.",
    deliverables: ["Growth audits", "Conversion optimization", "Analytics setup", "Roadmapping"],
  },
];

const PROCESS = [
  { step: "01", title: "Discover", description: "Understand the goals, audience, and constraints before anything is designed." },
  { step: "02", title: "Define", description: "Align on strategy, scope, and success metrics so everyone builds toward the same target." },
  { step: "03", title: "Design & Build", description: "Move from concept to polished, production-ready execution in focused iterations." },
  { step: "04", title: "Launch & Grow", description: "Ship with confidence, then measure and refine based on real-world performance." },
];

export default function ServicesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="eyebrow">Services</span>
          <h1>Full-scope support, from strategy to launch.</h1>
          <p className={styles.heroSubtitle}>
            Whether you need a single focused deliverable or an end-to-end partner, here&rsquo;s
            where I can help.
          </p>
        </div>
      </section>

      <section className={`section ${styles.list}`}>
        <div className="container">
          <div className={styles.serviceItems}>
            {SERVICES.map((service, index) => (
              <article key={service.title} className={styles.serviceItem}>
                <div className={styles.serviceItemHead}>
                  <span className={styles.serviceIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{service.title}</h2>
                </div>
                <div className={styles.serviceItemBody}>
                  <p>{service.description}</p>
                  <ul className={styles.deliverables}>
                    {service.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.process}`}>
        <div className="container">
          <SectionHeading
            eyebrow="Process"
            title="A simple, transparent way of working"
            align="center"
          />
          <div className={`grid ${styles.processGrid}`}>
            {PROCESS.map((item) => (
              <div key={item.step} className={styles.processCard}>
                <span className={styles.processStep}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.cta}`}>
        <div className={`container ${styles.ctaInner}`}>
          <h2>Not sure which service fits?</h2>
          <p>Tell me about your project and I&rsquo;ll help you figure out the right scope.</p>
          <Button href="/connect" variant="accent">
            Start the conversation
          </Button>
        </div>
      </section>
    </>
  );
}
