// Single source of truth for the home page "Projects" section. To add a
// project: drop its image in public/projects/ and add an entry below —
// the Projects component (src/components/Projects.tsx) renders one
// full-screen block per entry, in array order.
export type Project = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "brand-refresh",
    title: "RSVP Wedding Website",
    description:
      "A full identity and digital wedding website for a couple's big day, with a custom RSVP form that feeds into a Google Sheet for easy guest management.",
    href: "https://rigorandirene.com",
    image: {
      src: "/projects/ry.png",
      alt: "Wedding website",
    },
  },
  {
    slug: "product-launch",
    title: "Product Launch — Solace App",
    description:
      "End-to-end campaign and product experience design for a wellness app's public debut.",
    href: "https://example.com/solace-app",
    image: {
      src: "/projects/sec.jpeg",
      alt: "Solace App product launch preview",
    },
  },
];
