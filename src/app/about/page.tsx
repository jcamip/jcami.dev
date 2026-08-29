import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import PageCta from "@/components/PageCta";
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




export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* first section */}
      {/* <section className={`section ${styles.values}`}>
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
      </section> */}


      <PageCta
        title={<>My story shaped my craft.<br />Now let’s make something meaningful from yours.</>}
        // description="Tell me about your project and I’ll help you figure out the right scope."
        buttonLabel="Tell Cami about your project"
        href="/connect"
      />
    </>
  );
}
