// Single source of truth for the home page "Projects" section. To add a
// project: drop its image(s) in public/projects/ and add an entry below —
// the Projects component (src/components/Projects.tsx) renders one
// full-screen block per entry, in array order.
//
// Each project can have 1 or more images (e.g. browser / tablet / phone
// mockups), named "<slug>-<type>" (e.g. ry-browser, ry-ipad, ry-mobile) so
// an asset's project and device are obvious from its filename alone. `type`
// mirrors that filename suffix and drives layout in ProjectMedia.tsx: the
// "browser" image (if present) always anchors dead-center, with the rest
// fanned out around it in their array order. Hovering any image zooms it in
// front-and-center and fans the rest aside; with only one image, hovering
// it just zooms it in place for a closer look. width/height are each
// image's real intrinsic pixel size (next/image needs them to reserve
// layout space and avoid shift) — get them with e.g.
// `sips -g pixelWidth -g pixelHeight <file>` when adding a new asset.
export type ProjectImage = {
  type: "browser" | "ipad" | "mobile";
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  href?: string;
  year?: number;
  images: ProjectImage[];
};

export const PROJECTS: Project[] = [
  {
    slug: "ry",
    title: "RSVP Website",
    year: 2026,
    description:
      "A full identity and digital wedding website for a couple's big day, with a custom RSVP form that feeds into a Google Sheet for easy guest management.",
    href: "https://rigorandirene.com",
    images: [
      {
        type: "browser",
        src: "/projects/ry-browser.png",
        alt: "Wedding website shown in a browser window",
        width: 1356,
        height: 880,
      },
      {
        type: "ipad",
        src: "/projects/ry-ipad.png",
        alt: "Wedding website shown on a tablet",
        width: 780,
        height: 1169,
      },
      {
        type: "mobile",
        src: "/projects/ry-mobile.png",
        alt: "Wedding website shown on a phone",
        width: 580,
        height: 1252,
      },
    ],
  },
  {
    slug: "sec",
    title: "Business & Corporate",
    description:
      "Designed for a renewable energy company, this corporate website presents its services, mission, and sustainable solutions while making it easier for customers to get in touch.",
    href: "https://www.secsolar.ae/",
    year: 2025,
    images: [
      {
        type: "browser",
        src: "/projects/sec-browser.jpeg",
        alt: "Solace App product launch preview in a browser window",
        width: 2870,
        height: 1552,
      },
    ],
  },
    {
    slug: "1bfs",
    title: "Online Ticketing Platform",
    year: 2024,
    description:
      "Built as an online ticketing platform, the website allows users to purchase tickets and access them easily through a dedicated portal.",
    // href: "https://rigorandirene.com",
    images: [
      {
        type: "browser",
        src: "/projects/ry-browser.png",
        alt: "Wedding website shown in a browser window",
        width: 1356,
        height: 880,
      },
      {
        type: "ipad",
        src: "/projects/ry-ipad.png",
        alt: "Wedding website shown on a tablet",
        width: 780,
        height: 1169,
      },
      {
        type: "mobile",
        src: "/projects/ry-mobile.png",
        alt: "Wedding website shown on a phone",
        width: 580,
        height: 1252,
      },
    ],
  },
];
