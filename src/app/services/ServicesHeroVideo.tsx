"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./services.module.css";

const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
const MASK_X = 960;
const MASK_STEP = 8;
const MENU_CLEARANCE = 12;
const MAX_ZOOM = 3;
const ZOOM_STEP = 1.01;

// Non-white row ranges [start, end, start, end, ...] in sser.mp4, one entry
// per 8px column of the footage's right half, unioned over every frame of
// the loop (and padded 4px). Anything outside these ranges stays white for
// the whole video.
const CHROME_ROWS: number[][] = [
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1015,1046,1080],
  [0,872,892,1006,1074,1080],
  [0,768,788,855,935,986,1074,1080],
  [0,523,572,683,1074,1080],
  [0,480,1074,1080],
  [0,450,1074,1080],
  [0,430,1074,1080],
  [0,427,1074,1080],
  [0,430,1074,1080],
  [0,432,1074,1080],
  [0,434,1074,1080],
  [0,435,1074,1080],
  [0,437,1074,1080],
  [0,437,1074,1080],
  [0,437,1074,1080],
  [0,437,1074,1080],
  [0,437,1074,1080],
  [0,437,1074,1080],
  [0,435,1074,1080],
  [0,433,1074,1080],
  [0,430,1074,1080],
  [0,426,1074,1080],
  [0,421,1074,1080],
  [0,415,1074,1080],
  [0,408,1074,1080],
  [0,401,1074,1080],
  [0,392,1074,1080],
  [0,385,1074,1080],
  [0,378,1074,1080],
  [0,372,1074,1080],
  [0,367,1074,1080],
  [0,363,1074,1080],
  [0,361,1074,1080],
  [0,362,1074,1080],
  [0,365,1074,1080],
  [0,369,1074,1080],
  [0,375,1074,1080],
  [0,382,1074,1080],
  [0,391,1074,1080],
  [0,408,1074,1080],
  [0,429,1074,1080],
  [0,452,1074,1080],
  [0,481,1074,1080],
  [0,517,1074,1080],
  [0,582,1074,1080],
  [0,725,1074,1080],
  [0,939,994,1047,1074,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,1080],
  [0,38,47,1080],
  [0,28,52,898,924,1080],
  [0,20,45,707,777,883,963,1065,1074,1080],
  [0,10,38,545,632,680,826,853,1002,1041,1074,1080],
  [32,416,1074,1080],
  [26,369,1074,1080],
  [20,323,1074,1080],
  [15,298,1074,1080],
  [9,278,1074,1080],
  [4,262,1074,1080],
  [0,248,1074,1080],
  [0,235,1074,1080],
  [0,224,1074,1080],
  [0,214,1074,1080],
  [0,203,1074,1080],
  [0,193,1074,1080],
  [0,184,1074,1080],
  [0,175,1074,1080],
  [0,167,1074,1080],
  [0,159,1074,1080],
  [0,152,1074,1080],
  [0,147,1074,1080],
  [0,141,1074,1080],
  [0,135,1074,1080],
  [0,130,1074,1080],
  [0,124,1074,1080],
  [0,119,1074,1080],
  [0,113,1074,1080],
  [0,107,1074,1080],
  [0,101,1074,1080],
  [0,95,1074,1080],
  [0,89,1074,1080],
  [0,83,1074,1080],
  [0,78,1074,1080],
  [0,72,1074,1080],
  [0,66,1074,1080],
  [0,60,1074,1080],
  [0,54,1074,1080],
  [0,49,1074,1080],
  [0,43,1074,1080],
  [0,40,1074,1080],
  [0,35,1074,1080],
];

type Rect = { left: number; right: number; top: number; bottom: number };

function isWhite(left: number, right: number, top: number, bottom: number) {
  if (left < MASK_X) return false;
  const first = Math.floor((left - MASK_X) / MASK_STEP);
  const last = Math.min(CHROME_ROWS.length - 1, Math.floor((right - MASK_X) / MASK_STEP));
  for (let column = first; column <= last; column++) {
    const rows = CHROME_ROWS[column];
    for (let i = 0; i < rows.length; i += 2) {
      if (rows[i] < bottom && rows[i + 1] > top) return false;
    }
  }
  return true;
}

// Least zoom, then the highest crop, that keeps the menu (plus clearance) on
// the footage's white background with the frame anchored to the hero's
// right edge, so the chrome sits as close to the menu as it can. Returns
// the frame's scale and its top-left offset in frame pixels.
function fitFrame(heroWidth: number, heroHeight: number, menu: Rect) {
  const minScale = Math.max(heroWidth / FRAME_WIDTH, heroHeight / FRAME_HEIGHT);

  for (let scale = minScale; scale <= minScale * MAX_ZOOM; scale *= ZOOM_STEP) {
    const viewHeight = heroHeight / scale;
    const x = FRAME_WIDTH - heroWidth / scale;
    const menuLeft = x + (menu.left - MENU_CLEARANCE) / scale;
    const menuRight = x + (menu.right + MENU_CLEARANCE) / scale;
    const menuTop = (menu.top - MENU_CLEARANCE) / scale;
    const menuBottom = (menu.bottom + MENU_CLEARANCE) / scale;

    for (let y = 0; y <= FRAME_HEIGHT - viewHeight; y++) {
      if (isWhite(menuLeft, menuRight, y + menuTop, y + menuBottom)) {
        return { scale, x, y };
      }
    }
  }

  return null;
}

export default function ServicesHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    const hero = video?.parentElement;
    if (!video || !hero) return;

    const frame = () => {
      const menu = document.querySelector('nav[aria-label="Primary"]');
      const heroRect = hero.getBoundingClientRect();
      const menuRect = menu?.getBoundingClientRect();
      const fit =
        menuRect && menuRect.width > 0
          ? fitFrame(heroRect.width, heroRect.height, {
              left: menuRect.left - heroRect.left,
              right: menuRect.right - heroRect.left,
              top: menuRect.top - heroRect.top,
              bottom: menuRect.bottom - heroRect.top,
            })
          : null;

      if (!fit) {
        video.style.removeProperty("width");
        video.style.removeProperty("height");
        video.style.removeProperty("left");
        video.style.removeProperty("top");
        return;
      }

      video.style.width = `${Math.ceil(FRAME_WIDTH * fit.scale) + 1}px`;
      video.style.height = `${Math.ceil(FRAME_HEIGHT * fit.scale) + 1}px`;
      video.style.left = `${Math.floor(-fit.x * fit.scale)}px`;
      video.style.top = `${Math.floor(-fit.y * fit.scale)}px`;
    };

    frame();
    const observer = new ResizeObserver(frame);
    observer.observe(hero);
    void document.fonts.ready.then(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={styles.heroVideo}
      src="/videos/sser.mp4"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
}
