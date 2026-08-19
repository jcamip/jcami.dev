import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import styles from "./connect.module.css";

export const metadata: Metadata = {
  title: "Connect — Joane Camille",
  description: "Get in touch with Joane Camille to start a strategy, design, or development project.",
};

export default function ConnectPage() {
  return (
    <section className={styles.split}>
      <div className={styles.imageCol}>
        <Image
          src="/images/connect-photo.jpg"
          alt="Joane Camille"
          fill
          priority
          sizes="(min-width: 900px) 50vw, 100vw"
          className={styles.image}
        />
      </div>

      <div className={styles.formCol}>
        <h1 className={styles.headline}>
          Have a project in mind? Tell me what you&rsquo;re building, where you want to go, and
          how I can help. I work remotely, with clients everywhere.
        </h1>

        <ContactForm />
      </div>
    </section>
  );
}
