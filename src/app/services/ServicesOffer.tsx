"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./services.module.css";

const SERVICES = [
    {
        title: "Brand Strategy",
        description:
            "Clarify what your brand stands for, who it serves, and why it matters—then turn that strategy into messaging and an identity people remember.",
        deliverables: [
            "Positioning & differentiation",
            "Audience & value proposition",
            "Messaging framework",
            "Visual identity direction",
        ],
    },
    {
        title: "Product Design",
        description:
            "Turn user needs and business goals into intuitive digital experiences—from early concepts and prototypes to polished, scalable interfaces.",
        deliverables: [
            "Product discovery & research",
            "User journeys & flows",
            "Wireframes & prototypes",
            "UI & design systems",
        ],
    },
    {
        title: "Technical Strategy & Architecture",
        description:
            "Reduce risk before development with a clear technical direction, practical system architecture, and a roadmap aligned with your product goals.",
        deliverables: [
            "Technical discovery & scoping",
            "System architecture",
            "Technology selection",
            "Delivery roadmap",
        ],
    },
    {
        title: "Web Development",
        description:
            "Build and launch fast, accessible digital products—from high-performing websites to secure SaaS platforms, dashboards, and customer portals.",
        deliverables: [
            "Responsive websites",
            "SaaS applications & dashboards",
            "CMS, APIs & integrations",
            "Authentication & subscriptions",
        ],
    },
    {
        title: "Growth & Expansion Consulting",
        description:
            "Turn customer and performance insights into a focused strategy for increasing conversion, entering new markets, and scaling sustainable growth.",
        deliverables: [
            "Growth opportunity analysis",
            "Conversion optimization",
            "Market expansion strategy",
            "Prioritized scaling roadmap",
        ],
    },
];

export default function ServicesOffer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setIsVisible(false);
                    return;
                }

                if (window.scrollY > 0) {
                    setIsVisible(false);
                    requestAnimationFrame(() => setIsVisible(true));
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="offer" className={`section ${styles.list}`}>
            <div className="container">
                <div className={styles.offerLayout}>
                    <div className={`${styles.offerIntro} ${isVisible ? styles.offerIntroVisible : ""}`.trim()}>
                        <span className="eyebrow">What I Offer</span>
                        <h2>Services</h2>
                        <p>
                            Choose a focused service or combine them into a seamless, end-to-end engagement tailored to your goals and the support you need.
                        </p>
                    </div>

                    <div className={styles.serviceItems}>
                        {SERVICES.map((service, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <article
                                    key={service.title}
                                    className={`${styles.serviceItem} ${isActive ? styles.active : ""} ${isVisible ? styles.visible : ""}`.trim()}
                                    tabIndex={0}
                                    onClick={() => setActiveIndex(index)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            setActiveIndex(index);
                                        }
                                    }}
                                >
                                    <div className={styles.serviceItemHeader}>
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
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
