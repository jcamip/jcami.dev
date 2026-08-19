import { PROJECTS } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";
import styles from "./Projects.module.css";

// One full-viewport screen per project on a white background. Each screen
// centers that project's image "stack" (1-N device mockups — see
// ProjectMedia.tsx for the fan/hover animation) at 90% of the space below
// the fixed header, with a smooth fade/rise-in the first time it scrolls
// into view.
//
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
        <article key={project.slug} className={styles.project} aria-label={project.title}>
          <ProjectMedia title={project.title} images={project.images} />
        </article>
      ))}
    </section>
  );
}
