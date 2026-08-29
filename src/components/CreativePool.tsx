"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import SectionHeading from "@/components/SectionHeading";
import styles from "./CreativePool.module.css";

type Status = "idle" | "submitting" | "success" | "error";

// Connect page, below the hero — an open call for collaborators rather
// than a client-project form (see ContactForm), so it only asks for an
// email and posts to /api/subscribe instead of /api/contact.
export default function CreativePool() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Submit stays disabled until both fields actually have content — belt
  // and braces alongside the inputs' own `required`, since that only blocks
  // submission on click rather than communicating it up front.
  const canSubmit = email.trim() !== "" && role.trim() !== "";

  // Fades this section's copy in from below the first time it scrolls into
  // view — a one-time entrance, so the observer disconnects itself once
  // triggered (same pattern as the project stacks — see ProjectMedia.tsx).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.pool}`}
      data-visible={isVisible || undefined}
    >
      <div className={`container ${styles.inner}`}>
        <SectionHeading
          align="left"
          className={styles.heading}
          eyebrow="Open Collaboration"
          title="I like putting good people together."
          description={
            <>
              Alongside client work, I connect with photographers, designers, developers, social media and marketing specialists, and other creatives whose work I rate — and bring them in when a project calls for it.
              Add your email below to join the pool, and I&rsquo;ll reach out when there&rsquo;s a
              fit.
            </>
          }
        />

        {status === "success" ? (
          <p className={styles.success} role="status">
            You&rsquo;re on the list — I&rsquo;ll be in touch when a project calls for it.
          </p>
  
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className="visuallyHidden" htmlFor="poolEmail">
                  Email address
                </label>
                <input
                  id="poolEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className="visuallyHidden" htmlFor="poolRole">
                  Your role
                </label>
                <input
                  id="poolRole"
                  name="role"
                  type="text"
                  autoComplete="off"
                  placeholder="Your role, e.g. ai engineer"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className={styles.submit}
              disabled={status === "submitting" || !canSubmit}
            >
              <span>{status === "submitting" ? "Joining" : "Join the pool"}</span>
    
            </button>
          </form>
        )}

        {status === "error" ? (
          <p className={styles.error} role="alert">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </div>
    </section>
  );
}
