const PRODUCTION_SITE_URL = "https://jcami.dev";
const DEVELOPMENT_SITE_URL = "http://localhost:3000";

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallbackUrl =
    process.env.NODE_ENV === "development" ? DEVELOPMENT_SITE_URL : PRODUCTION_SITE_URL;

  try {
    const url = new URL(configuredUrl || fallbackUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return fallbackUrl;
    }

    if (
      process.env.NODE_ENV === "production" &&
      (url.protocol !== "https:" || isLocalHostname(url.hostname))
    ) {
      return PRODUCTION_SITE_URL;
    }

    return url.origin;
  } catch {
    return fallbackUrl;
  }
}

export const siteConfig = {
  name: "Joane Camille",
  shortName: "JCami",
  url: resolveSiteUrl(),
  title: "Joane Camille · Digital Product Developer",
  professionalTitle: "Digital Product Developer",
  jobTitle: "Senior Software Developer",
  description:
    "Joane Camille partners with ambitious brands to design, build, and scale digital products that perform.",
  language: "en",
  locale: "en_US",
  location: "Dubai, United Arab Emirates",
  email: "hello@jcami.dev",
  whatsapp: {
    number: "971585650930",
    message:
      "Hi Joane! I found your portfolio on jcami.dev and I'd love to chat about a project. Are you available for a quick call this week?",
  },
  ogImage: {
    path: "/images/bg.png",
    width: 1920,
    height: 1080,
    alt: "Joane Camille digital product portfolio",
  },
  knowsAbout: [
    "Web development",
    "Product design",
    "Brand strategy",
    "Technical strategy and architecture",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Design systems",
    "Headless Shopify",
    "CMS integration",
    "Analytics and tracking",
  ],
} as const;

export const publicRoutes = [
  {
    path: "/",
    title: "Joane Camille · Digital Product Developer",
    description: siteConfig.description,
    lastModified: "2026-09-09",
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/about",
    title: "About",
    description:
      "Learn about Joane Camille, a Dubai-based senior software developer working across strategy, product design, web development, and AI experiences.",
    lastModified: "2026-09-09",
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    path: "/services",
    title: "Services",
    description:
      "Explore Joane Camille's brand strategy, product design, technical architecture, web development, and growth consulting services.",
    lastModified: "2026-09-09",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/connect",
    title: "Connect",
    description:
      "Contact Joane Camille about a strategy, product design, web development, or digital growth project.",
    lastModified: "2026-09-09",
    changeFrequency: "yearly",
    priority: 0.7,
  },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function getPublicRoute(path: (typeof publicRoutes)[number]["path"]) {
  return publicRoutes.find((route) => route.path === path)!;
}
