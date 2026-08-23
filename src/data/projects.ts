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
    slug: "1bfs",
    title: "Online Ticketing Platform",
    year: 2024,
    description:
      "Built as an online ticketing platform, the website enables users to purchase and easily access their tickets through a dedicated portal. It also includes a CMS portal with a dashboard where users can manage content and view analytics. All data shown in the images is sample data used for demonstration purposes.",
    // href: "https://rigorandirene.com",
    images: [
      {
        type: "browser",
        src: "/projects/1bfs-browser.png",
        alt: "Online ticketing platform shown in a browser window",
        width: 1356,
        height: 880,
      },
      {
        type: "ipad",
        src: "/projects/1bfs-ipad.png",
        alt: "Online ticketing platform shown on a tablet",
        width: 780,
        height: 1169,
      },
      {
        type: "mobile",
        src: "/projects/1bfs-mobile2.png",
        alt: "Online ticketing platform shown on a phone",
        width: 580,
        height: 1252,
      },
      {
        type: "mobile",
        src: "/projects/1bfs-mobile.png",
        alt: " Online ticketing platform shown on a phone",
        width: 580,
        height: 1252,
      },
    ],
  },
  {
    slug: "sec",
    title: "Business & Corporate",
    description:
      "Designed for a renewable energy company, this business website presents its services, mission, and sustainable solutions while making it easier for customers to get in touch.",
    // href: "https://www.secsolar.ae/",
    year: 2025,
    images: [
      {
        type: "browser",
        src: "/projects/sec-browser.png",
        alt: "Wedding website shown in a browser window",
        width: 1356,
        height: 880,
      },
      {
        type: "ipad",
        src: "/projects/sec-ipad.png",
        alt: "Wedding website shown on a tablet",
        width: 780,
        height: 1169,
      },
      {
        type: "mobile",
        src: "/projects/sec-mobile.png",
        alt: "Wedding website shown on a phone",
        width: 580,
        height: 1252,
      },
    ],
  },
  {
    slug: "ry",
    title: "Digital RSVP Platform",
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

];
