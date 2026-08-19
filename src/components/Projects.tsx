import Image from "next/image";
import { PROJECTS } from "@/data/projects";
import styles from "./Projects.module.css";

// One full-viewport screen per project — the image fills the whole screen.
// Content lives in src/data/projects.ts — add/edit entries there, drop
// matching images in public/projects/.
//
// The index/title/description/"View project" link are temporarily hidden
// (not rendered) while the section is image-only; the markup and its data
// stay wired up in src/data/projects.ts so they're a quick uncomment away.
export default function Projects() {
  return (
    <section id="projects" className={styles.projects} aria-label="Selected projects">
      {PROJECTS.map((project) => (
        <article key={project.slug} className={styles.project}>
          <div className={styles.media}>
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="100vw"
              className={styles.image}
              loading="lazy"
            />
          </div>
        </article>
      ))}
    </section>
  );
}
