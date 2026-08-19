"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/connect", label: "Connect" },
];

const SOCIAL_LINKS = [
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // The home page is a full-bleed, one-screen-per-section experience —
  // no footer there. It still renders on About/Services/Connect.
  if (pathname === "/") return null;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              JOANE CAMILLE
            </Link>
            <p className={styles.tagline}>
              Strategy, design, and digital growth for brands that mean to lead.
            </p>
          </div>

          <nav className={styles.footerNav} aria-label="Footer">
            <span className={styles.navHeading}>Navigate</span>
            <ul>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.footerNav}>
            <span className={styles.navHeading}>Connect</span>
            <ul>
              <li>
                <a href="mailto:hello@joanecamille.com">hello@joanecamille.com</a>
              </li>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} Joane Camille. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
