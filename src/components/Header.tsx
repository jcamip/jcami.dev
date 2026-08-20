"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

// No "Home" entry on any page — the logo already links there, on every
// page, so a text link to the same place would just be a second, more
// roundabout way to do what's already one click away.
const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/connect", label: "Connect" },
];

// Pages whose header uses the home page's layout — fixed position,
// centered logo, vertical nav stacked top-right (collapsing to the same
// hamburger + full-screen overlay as everything else below 900px) —
// instead of the plain solid header with a left logo + horizontal nav.
const OVERLAY_LAYOUT_PATHS = new Set(["/", "/about", "/services", "/connect"]);

// Subset of the above whose hero is a full-bleed dark panel, so the
// header can float fully transparent in white and switch to brand-red
// once scrolled onto a light section — see the scroll effect below.
// Connect isn't in this set: its hero splits into a light form panel
// right where the vertical nav sits, so it keeps the overlay layout but
// with a permanently dark, opaque backdrop instead (.homeHeaderSolid).
const TRANSPARENT_OVER_DARK_HERO_PATHS = new Set(["/", "/about", "/services"]);

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const useOverlayLayout = OVERLAY_LAYOUT_PATHS.has(pathname);
  const transparentOverDarkHero = TRANSPARENT_OVER_DARK_HERO_PATHS.has(pathname);

  // The transparent header sits over each page's dark hero, then over
  // whatever lighter content follows as the visitor scrolls — white reads
  // on the dark hero, but needs to switch to the brand red once a light
  // section is what's actually behind it. A direct scroll-position check
  // (rather than an IntersectionObserver watching the dark sections) is
  // used deliberately: with sections landing edge-to-edge, a section's
  // exit can cross the viewport boundary with exactly zero overlap, and in
  // testing that boundary case never re-fired the observer's callback — it
  // read the section as still "intersecting" indefinitely. Checking every
  // dark section's bounding rect on scroll sidesteps that crossing-
  // detection edge case, and generalizes past a single hero: some pages
  // (Services) have a second dark section further down, so this checks
  // whether *any* marked dark section currently sits behind the header
  // rather than a one-shot "have we passed the hero yet" flag.
  const [overLightSection, setOverLightSection] = useState(false);

  useEffect(() => {
    if (!transparentOverDarkHero) {
      // Deferred to a frame rather than called synchronously in the effect
      // body, so this stays a plain external-system subscription (same
      // pattern as TypingHeading.tsx/ProjectDetails.tsx).
      const frameId = requestAnimationFrame(() => setOverLightSection(false));
      return () => cancelAnimationFrame(frameId);
    }

    const darkSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header-dark]")
    );
    if (!darkSections.length) return;

    let ticking = false;
    const checkScroll = () => {
      ticking = false;
      const headerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 0;
      const overDark = darkSections.some((section) => {
        const rect = section.getBoundingClientRect();
        // > 1, not > 0: vh/percentage-based layout heights are frequently
        // fractional, so a section's bottom can rest at e.g. 0.16px even
        // once it's fully, visibly scrolled past — landing squarely on a
        // scroll-snap stop right at a section seam reproduced this
        // reliably. A strict > 0 read that sub-pixel remainder as "still
        // here," leaving the header white against the next (light)
        // section's background — invisible (this shipped reproducing
        // exactly there on the hero/Projects seam; see git history).
        return rect.top < headerHeight && rect.bottom > 1;
      });
      setOverLightSection(!overDark);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkScroll);
    };

    checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Belt-and-suspenders for momentum/snap scrolling on real mobile
    // devices: 'scroll' events can be sparse mid-fling (some browsers
    // coalesce them down to just one or two for a whole flick), so the
    // last one to fire isn't guaranteed to land on the final settled
    // position — 'scrollend' (fires once scrolling, including snap, has
    // fully stopped) catches whatever that left stale. Doesn't touch the
    // getBoundingClientRect check itself, just adds another trigger for
    // it — unsupported browsers simply never fire it, no different from
    // before this existed.
    window.addEventListener("scrollend", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", checkScroll);
    };
  }, [transparentOverDarkHero, pathname]);

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
      className={
        useOverlayLayout
          ? `${styles.homeHeader} ${transparentOverDarkHero ? "" : styles.homeHeaderSolid}`
          : styles.header
      }
      data-over-light={(transparentOverDarkHero && overLightSection) || undefined}
    >
      <div className={useOverlayLayout ? styles.homeBar : `container ${styles.bar}`}>
        <div className={useOverlayLayout ? styles.homeBrandNav : styles.brandNav}>
          <Link
            href="/"
            className={useOverlayLayout ? styles.homeLogo : styles.logo}
            aria-label="Joane Camille — go to homepage"
            onClick={handleLogoClick}
          >
            JOANE CAMILLE
          </Link>

          <nav className={useOverlayLayout ? styles.homeNav : styles.nav} aria-label="Primary">
            <ul className={useOverlayLayout ? styles.homeNavList : styles.navList}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={useOverlayLayout ? styles.homeNavLink : styles.navLink}
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
          className={`${styles.menuToggle} ${transparentOverDarkHero ? styles.menuToggleLight : ""}`}
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
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname.startsWith(link.href);
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
