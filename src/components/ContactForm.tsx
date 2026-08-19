"use client";

import { useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

// TODO: wire this up to the Google Form's /formResponse endpoint once we
// have the entry IDs — see the setup instructions requested from the user.
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <h3>Message sent.</h3>
        <p>Thanks for reaching out — I&rsquo;ll reply within one business day.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="fullName">Full name*</label>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email*</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="company">Company / brand name*</label>
        <input id="company" name="company" type="text" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="website">Website or social (optional)</label>
        <input id="website" name="website" type="text" />
      </div>

      <div className={styles.field}>
        <label htmlFor="projectDetails">Project details</label>
        <textarea id="projectDetails" name="projectDetails" rows={1} />
      </div>

      <button type="submit" className={styles.submit} disabled={status === "submitting"}>
        <span>{status === "submitting" ? "Sending" : "Submit form"}</span>
        <span aria-hidden className={styles.arrow}>
          ↗
        </span>
      </button>

      {status === "error" ? (
        <p className={styles.error} role="alert">
          Something went wrong. Please try again or email me directly.
        </p>
      ) : null}
    </form>
  );
}
