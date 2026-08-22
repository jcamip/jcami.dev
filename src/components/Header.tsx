"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/connect", label: "Connect" },
];


const OVERLAY_LAYOUT_PATHS = new Set(["/", "/about", "/services", "/connect"]);


const TRANSPARENT_OVER_DARK_HERO_PATHS = new Set(["/", "/services"]);


const STATIC_OVERLAY_PATHS = new Set(["/connect", "/services"]);


const BRAND_NAV_PATHS = new Set(["/services"]);

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const useOverlayLayout = OVERLAY_LAYOUT_PATHS.has(pathname);
  const transparentOverDarkHero = TRANSPARENT_OVER_DARK_HERO_PATHS.has(pathname);
  const scrollsWithPage = STATIC_OVERLAY_PATHS.has(pathname);
  const forceBrandNav = BRAND_NAV_PATHS.has(pathname);

  const hideLogoOnAbout = pathname === "/about";


  const [overLightSection, setOverLightSection] = useState(false);

  useEffect(() => {
    if (!transparentOverDarkHero) {

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


  const handleLogoClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={
        useOverlayLayout
          ? `${styles.homeHeader} ${transparentOverDarkHero ? "" : styles.homeHeaderSolid} ${
              scrollsWithPage ? styles.homeHeaderStatic : ""
            }`
          : styles.header
      }
      data-over-light={(transparentOverDarkHero && overLightSection) || undefined}
      data-brand-nav={forceBrandNav || undefined}
    >
      <div className={useOverlayLayout ? styles.homeBar : `container ${styles.bar}`}>
        <div className={useOverlayLayout ? styles.homeBrandNav : styles.brandNav}>
          <Link
            href="/"
            className={`${useOverlayLayout ? styles.homeLogo : styles.logo} ${
              hideLogoOnAbout ? styles.homeLogoHidden : ""
            }`}
            aria-label="Joane Camille — go to homepage"
            aria-hidden={hideLogoOnAbout || undefined}
            tabIndex={hideLogoOnAbout ? -1 : undefined}
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
