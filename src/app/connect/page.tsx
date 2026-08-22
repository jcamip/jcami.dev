import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import CreativePool from "@/components/CreativePool";
import styles from "./connect.module.css";

export const metadata: Metadata = {
  title: "Connect — Joane Camille",
  description: "Get in touch with Joane Camille to start a strategy, design, or development project.",
};

export default function ConnectPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.imageCol}>
          <Image
            src="/images/hc.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 520px, 100vw"
            className={styles.image}
          />
        </div>

        <div className={styles.formCol}>
          <div className={styles.formContent}>
            <h1 className={styles.headline}>
              Bring me the idea you can’t stop thinking about. I’ll give it everything I’ve got.
            </h1>

            <ContactForm />
          </div>
        </div>
      </section>

      <CreativePool />
    </>
  );
}
