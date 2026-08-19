"use client";

import { useEffect } from "react";

/**
 * The home page's hero and Projects sections are scroll-snapped like a
 * deck of full-viewport screens (see html:has([data-scroll-snap="home"])
 * in globals.css). Browsers restore the previous scroll offset on
 * refresh, which would drop the visitor back in the middle of the deck
 * instead of on the landing hero. Switching to manual scroll restoration
 * and jumping to the top on mount makes a refresh — or any fresh mount of
 * this page — always land back on the hero.
 */
export default function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
