import { absoluteUrl, siteConfig } from "@/config/site";
import { PROJECTS } from "@/data/projects";

export const dynamic = "force-static";

export function GET() {
  const projects = PROJECTS.map(
    (project) =>
      `- [${project.title}](${absoluteUrl(`/#project-${project.slug}`)}): ${project.description}`
  ).join("\n");

  const content = `# ${siteConfig.name}

> ${siteConfig.name} is a Dubai-based senior software developer and digital product developer working across strategy, product design, web development, and AI experiences.

## Profile

- [About ${siteConfig.name}](${absoluteUrl("/about")})

## Services and expertise

- [Services](${absoluteUrl("/services")}): Brand strategy, product design, technical strategy and architecture, web development, and growth consulting.

## Selected projects

${projects}

## Contact

- [Start a project conversation](${absoluteUrl("/connect")})
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
