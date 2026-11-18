import type { ReactNode } from "react";
import styles from "./BusinessNote.module.css";

const PALCANA_URL = "https://palcana.com";

const iconProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const FACTS: { title: string; detail: string; icon: ReactNode }[] = [
    {
        title: "PALCANA",
        detail: "Registered in Ras Al Khaimah Economic Zone, UAE",
        icon: (
            <svg {...iconProps}>
                <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
                <path d="M14 10h5a1 1 0 0 1 1 1v10" />
                <path d="M2 21h20" />
                <path d="M8 8h2M8 12h2M8 16h2M17 14h0M17 17h0" />
            </svg>
        ),
    },
    {
        title: "International collaboration",
        detail: "Dubai-based, working with clients worldwide",
        icon: (
            <svg {...iconProps}>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
            </svg>
        ),
    },
    {
        title: "Direct technical involvement",
        detail: "From architecture and development through launch",
        icon: (
            <svg {...iconProps}>
                <path d="m8 7-5 5 5 5" />
                <path d="m16 7 5 5-5 5" />
                <path d="m14 4-4 16" />
            </svg>
        ),
    },
];

export default function BusinessNote() {
    return (
        <section className={styles.businessNote} aria-labelledby="business-note-title">
            <div className={`container ${styles.layout}`}>
                <div className={styles.intro}>
                    <h2 id="business-note-title" className={styles.title}>
                        A creative partnership, backed by a registered business.
                    </h2>
                    <p className={styles.text}>
                        I work directly with clients from discovery to delivery, bringing together strategy, design, and
                        technical execution. Software development engagements are offered through PALCANA, a
                        UAE-registered business, providing a professional framework for project agreements and invoicing.
                    </p>
                </div>

                <div className={styles.details}>
                    <ul className={styles.facts}>
                        {FACTS.map((fact) => (
                            <li key={fact.title} className={styles.fact}>
                                <span className={styles.factIcon}>{fact.icon}</span>
                                <div>
                                    <p className={styles.factTitle}>{fact.title}</p>
                                    <p className={styles.factDetail}>{fact.detail}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className={styles.footer}>
                        Learn more about PALCANA at{" "}
                        <a
                            className={styles.link}
                            href={PALCANA_URL}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="palcana.com (opens in a new tab)"
                        >
                            palcana.com
                            <span aria-hidden="true"> ↗</span>
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
