"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Next's client-side navigations don't reset scroll position on this
 * site — nothing does, once ScrollToTop's mount effect (home page only)
 * has flipped history.scrollRestoration to "manual" and the browser stops
 * handling it natively. That's invisible on pages whose header stays
 * fixed in the viewport, but Connect's header scrolls away with the page
 * (see STATIC_OVERLAY_PATHS in Header.tsx), so navigating there while
 * still scrolled from the previous page landed mid-page with the header
 * already scrolled out of view. Force every route change back to the top.
 *
 * behavior: "instant" bypasses the global `scroll-behavior: smooth` (see
 * globals.css) — this should be an immediate reset, not a visible glide.
 */
export default function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
