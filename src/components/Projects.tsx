import { PROJECTS } from "@/data/projects";
import ProjectDetails from "./ProjectDetails";
import ProjectMedia from "./ProjectMedia";
import styles from "./Projects.module.css";

// One full-viewport screen per project on a white background. Each screen
// pairs that project's image "stack" (1-N device mockups — see
// ProjectMedia.tsx for the fan/hover animation) on the left with its title
// beside it, vertically centered against the stack's 90% of the space
// below the fixed header. The year is pulled out separately and pinned to
// the page's right edge, lined up with the fixed header's nav (see .year
// in Projects.module.css). The stack fades/rises in the first time it
// scrolls into view.
//
// Content lives in src/data/projects.ts — add/edit entries there, drop
// matching images in public/projects/.
//
// Hovering, focusing, or clicking a project's title reveals its
// description below it with a typing animation, plus a "View Website" CTA
// linking to href once one's typed out — see ProjectDetails.tsx.
export default function Projects() {
  return (
    <section id="projects" className={styles.projects} aria-label="Selected projects">
      {PROJECTS.map((project) => (
        <article key={project.slug} className={styles.project} aria-label={project.title}>
          <ProjectMedia title={project.title} images={project.images} />
          <ProjectDetails
            title={project.title}
            year={project.year}
            description={project.description}
            href={project.href}
          />
        </article>
      ))}
    </section>
  );
}
