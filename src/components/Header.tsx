"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/connect", label: "Connect" },
];

const HOME_NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/connect", label: "Connect" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === "/";

  // The home header sits transparent over the hero, then over the Projects
  // deck as the visitor scrolls — white reads on the hero photo, but needs
  // to switch to the brand red once the dark-red Projects section is what's
  // actually behind it. A direct scroll-position check (rather than an
  // IntersectionObserver watching the hero) is used deliberately: with the
  // hero and Projects landing edge-to-edge, the hero's exit crosses the
  // viewport boundary with exactly zero overlap, and in testing that
  // boundary case never re-fired the observer's callback — it read the
  // hero as still "intersecting" indefinitely. Checking the hero's
  // bounding rect on scroll sidesteps that crossing-detection edge case.
  const [overProjects, setOverProjects] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setOverProjects(false);
      return;
    }

    const hero = document.querySelector<HTMLElement>('[data-scroll-snap="home"]');
    if (!hero) return;

    let ticking = false;
    const checkScroll = () => {
      ticking = false;
      setOverProjects(hero.getBoundingClientRect().bottom <= 0);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkScroll);
    };

    checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close the mobile menu whenever the route changes, without a redundant
  // extra render pass (see https://react.dev/learn/you-might-not-need-an-effect).
  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    if (isMenuOpen) setIsMenuOpen(false);
  }

  // Lock body scroll while the mobile menu overlay is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Mobile menu links differ slightly per variant: the home page omits the
  // redundant "Home" link since the logo already sits there.
  const navLinks = isHome ? HOME_NAV_LINKS : NAV_LINKS;

  // Next's router treats a Link to the current pathname as a no-op, so
  // clicking the logo while already on "/" (and scrolled into the
  // Projects deck) would otherwise do nothing. Scroll back to the hero
  // ourselves in that case; navigating in from another page already lands
  // on top via ScrollToTop's mount effect.
  const handleLogoClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={isHome ? styles.homeHeader : styles.header}
      data-over-projects={(isHome && overProjects) || undefined}
    >
      <div className={isHome ? styles.homeBar : `container ${styles.bar}`}>
        <div className={isHome ? styles.homeBrandNav : styles.brandNav}>
          <Link
            href="/"
            className={isHome ? styles.homeLogo : styles.logo}
            aria-label="Joane Camille — go to homepage"
            onClick={handleLogoClick}
          >
            JOANE CAMILLE
          </Link>

          <nav className={isHome ? styles.homeNav : styles.nav} aria-label="Primary">
            <ul className={isHome ? styles.homeNavList : styles.navList}>
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={isHome ? styles.homeNavLink : styles.navLink}
                      data-active={isActive || undefined}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <button
          type="button"
          className={`${styles.menuToggle} ${isHome ? styles.menuToggleLight : ""}`}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="visuallyHidden">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>
          <span
            className={styles.menuIcon}
            data-open={isMenuOpen || undefined}
          />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={styles.mobileNav}
        data-open={isMenuOpen || undefined}
        aria-hidden={!isMenuOpen}
      >
        <ul className={styles.mobileNavList}>
          {navLinks.map((link, index) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li
                key={link.href}
                className={styles.mobileNavItem}
                style={{ transitionDelay: isMenuOpen ? `${index * 40}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  data-active={isActive || undefined}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
