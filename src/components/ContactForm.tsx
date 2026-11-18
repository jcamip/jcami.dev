"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [isComplete, setIsComplete] = useState(false);
  const projectDetailsRef = useRef<HTMLTextAreaElement>(null);

  // Project details starts at the same one-line height as the fields above
  // it, then grows downward as the visitor types past that — resetting to
  // "auto" first so it can shrink back too (e.g. after deleting a line),
  // not just grow. rows={1} + CSS resize:none/overflow:hidden hand all
  // sizing to this instead of the browser's native drag handle.
  function autoGrowProjectDetails(event: FormEvent<HTMLTextAreaElement>) {
    const el = event.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          company: data.get("company"),
          website: data.get("website"),
          projectDetails: data.get("projectDetails"),
        }),
      });

      if (!response.ok) {
        throw new Error("Contact form submission failed");
      }

      setStatus("success");
      form.reset();
      // form.reset() clears the value but not the inline height we've been
      // setting on every keystroke — without this it'd stay tall and empty.
      if (projectDetailsRef.current) {
        projectDetailsRef.current.style.height = "";
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <h3>Message sent.</h3>
      <p>Thanks for sharing your project with me. I’ll review the details and follow up soon.</p>    </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onInput={(event) => setIsComplete(event.currentTarget.checkValidity())}
      noValidate
    >
      <div className={styles.row}>
        <div className={styles.field}>
          <label className="visuallyHidden" htmlFor="fullName">Full name*</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Full name*"
            required
          />
        </div>
        <div className={styles.field}>
          <label className="visuallyHidden" htmlFor="email">Email*</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email*"
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className="visuallyHidden" htmlFor="company">Company / brand name*</label>
        <input id="company" name="company" type="text" placeholder="Company / brand name*" required />
      </div>

      <div className={styles.field}>
        <label className="visuallyHidden" htmlFor="website">Website or social (optional)</label>
        <input id="website" name="website" type="text" placeholder="Website or social (optional)" />
      </div>

      <div className={styles.field}>
        <label className="visuallyHidden" htmlFor="projectDetails">Project details</label>
        <textarea
          ref={projectDetailsRef}
          id="projectDetails"
          name="projectDetails"
          rows={1}
          placeholder="Project details"
          onInput={autoGrowProjectDetails}
        />
      </div>

      <button type="submit" className={styles.submit} disabled={!isComplete || status === "submitting"}>
        <span>{status === "submitting" ? "Sending" : "Submit"}</span>
      </button>

      <div className={styles.note}>
        <svg
          className={styles.noteIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <div>
          <p className={styles.noteTitle}>Professional engagements</p>
          <p className={styles.noteText}>
            Software development projects are contracted and invoiced through PALCANA, a UAE-registered business,
            providing a clear framework for agreements, payments, and ongoing collaboration with clients worldwide.
          </p>
        </div>
      </div>

      {status === "error" ? (
        <p className={styles.error} role="alert">
          Something went wrong. Please try again or email me directly at hello@jcami.dev
        </p>
      ) : null}
    </form>
  );
}
