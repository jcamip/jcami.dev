"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import styles from "./SkillsShowcase.module.css";

export type SkillGroup = {
  label: string;
  items: string[];
};

export type SkillShowcaseImage = {
  src: string;
  alt: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  groups: SkillGroup[];
  images: SkillShowcaseImage[];
};


const IMAGE_SIDES = ["left", "right"];


export default function SkillsShowcase({ eyebrow, title, description, groups, images }: Props) {
  const [activeGroup, setActiveGroup] = useState(0);
  // Wraps every row so the effect below can query all of this render's
  // split markers at once, rather than needing one ref per group
  // threaded in individually.
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = rowsRef.current;
    if (!container) return;

    const markers = Array.from(
      container.querySelectorAll<HTMLElement>("[data-split-index]")
    );
    if (!markers.length) return;


    const initializedMarkers = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        const viewportCenter = window.innerHeight / 2;
        entries.forEach((entry) => {
          if (!initializedMarkers.has(entry.target)) {
            initializedMarkers.add(entry.target);
            return;
          }
          const groupIndex = Number((entry.target as HTMLElement).dataset.splitIndex);
          const passed = entry.boundingClientRect.top < viewportCenter;
          setActiveGroup(passed ? groupIndex : groupIndex - 1);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    markers.forEach((marker) => observer.observe(marker));
    return () => observer.disconnect();
  }, [groups]);


  const rows = groups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => ({
      key: `${group.label}-${item}`,
      label: itemIndex === 0 ? group.label : null,
      text: item,
      isSplit: groupIndex > 0 && groupIndex < images.length && itemIndex === 0,
      splitIndex: groupIndex,
    }))
  );


  const groupStartRows = groups.reduce<{ nextRow: number; starts: number[] }>(
    (acc, group) => ({
      nextRow: acc.nextRow + group.items.length,
      starts: [...acc.starts, acc.nextRow],
    }),
    { nextRow: 1, starts: [] }
  ).starts;

  const rowImages = groups.flatMap((group, groupIndex) => {
    const image = images[groupIndex];
    if (!image) return [];
    return [
      {
        src: image.src,
        image,
        anchorRow: groupStartRows[groupIndex],
        side: IMAGE_SIDES[groupIndex % IMAGE_SIDES.length],
        groupIndex,
      },
    ];
  });

  return (
    <section className={`section ${styles.skills}`} id="skills">
      <div className={`container ${styles.inner}`}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          className={styles.heading}
        />

        <div className={styles.rows} ref={rowsRef}>
          {rows.map((row) => (
            <Fragment key={row.key}>
        
              <span className={styles.rowLabel} data-glitch={row.label ?? undefined}>
                {row.label}
              </span>
              <span
                className={styles.rowText}
                data-split-index={row.isSplit ? row.splitIndex : undefined}
              >
                {row.text}
              </span>
            </Fragment>
          ))}

          {rowImages.map(({ src, image, anchorRow, side, groupIndex }) => (
            <div
              key={src}
              className={styles.rowImage}
              data-side={side}
              data-group-index={groupIndex}
              data-visible={activeGroup === groupIndex || undefined}
              style={{ gridRow: anchorRow }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={styles.rowImageImg}
                sizes="(min-width: 768px) 340px, 70vw"
                priority={groupIndex === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
