import Image from "next/image";
import styles from "./PartnersCarousel.module.css";

// Pre-composed strip of every partner mark (Investopia, Mubadala, 1
// Billion Followers Summit, GMIS, F1 Abu Dhabi Grand Prix, Make It in
// the Emirates, Misk Foundation, Ministry of Investment, Solaax, TEDx,
// SEC, SRTIP) as a single white/light image, so it reads against the
// hero's own dark-red background without needing a background of its
// own — same as the rest of the hero.
const PARTNERS_STRIP = {
  src: "/partners/prtn.png",
  alt:
    "Partner and collaborator logos: Investopia, Mubadala, 1 Billion Followers Summit, GMIS, F1 Abu Dhabi Grand Prix, Make It in the Emirates, Misk Foundation, Ministry of Investment, Solaax, TEDx, SEC, SRTIP",
  width: 5304,
  height: 240,
};

export default function PartnersCarousel() {
  return (
    <div className={styles.partners}>
      <div className={styles.marquee}>
        <div className={styles.track}>
          <Image
            src={PARTNERS_STRIP.src}
            alt={PARTNERS_STRIP.alt}
            width={PARTNERS_STRIP.width}
            height={PARTNERS_STRIP.height}
            className={styles.strip}
            loading="lazy"
          />
          {/* Duplicate, hidden from assistive tech — the track's width
             doubles so animating to translateX(-50%) loops seamlessly. */}
          <Image
            src={PARTNERS_STRIP.src}
            alt=""
            width={PARTNERS_STRIP.width}
            height={PARTNERS_STRIP.height}
            className={styles.strip}
            aria-hidden="true"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
