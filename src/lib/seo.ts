import type { Metadata } from "next";
import { PROJECTS } from "@/data/projects";
import { absoluteUrl, siteConfig } from "@/config/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(siteConfig.ogImage.path);
  const isHomePage = path === "/";
  const socialTitle = isHomePage ? title : `${title} · ${siteConfig.name}`;

  return {
    title: isHomePage ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: siteConfig.ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  };
}

export const schemaIds = {
  person: absoluteUrl("/#person"),
  website: absoluteUrl("/#website"),
  profilePage: absoluteUrl("/about#profile-page"),
  projects: absoluteUrl("/#projects-list"),
} as const;

export function siteIdentityJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": schemaIds.person,
        name: siteConfig.name,
        url: absoluteUrl("/about"),
        jobTitle: siteConfig.jobTitle,
        description:
          "Dubai-based senior software developer working across strategy, product design, web development, and AI experiences.",
        homeLocation: {
          "@type": "Place",
          name: siteConfig.location,
        },
        knowsAbout: siteConfig.knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": schemaIds.website,
        url: absoluteUrl("/"),
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        author: { "@id": schemaIds.person },
        publisher: { "@id": schemaIds.person },
      },
    ],
  };
}

export function profilePageJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": schemaIds.profilePage,
    url: absoluteUrl("/about"),
    name: `About ${siteConfig.name}`,
    description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": schemaIds.website },
    mainEntity: { "@id": schemaIds.person },
  };
}

export function projectsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": schemaIds.projects,
    url: absoluteUrl("/#projects"),
    name: `Selected projects by ${siteConfig.name}`,
    description: "Selected digital product and web development projects by Joane Camille.",
    inLanguage: siteConfig.language,
    isPartOf: { "@id": schemaIds.website },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          "@id": absoluteUrl(`/#project-${project.slug}`),
          name: project.title,
          description: project.description,
          ...(project.year ? { dateCreated: String(project.year) } : {}),
          ...(project.href ? { url: project.href } : {}),
          image: project.images.map((image) => absoluteUrl(image.src)),
          creator: { "@id": schemaIds.person },
        },
      })),
    },
  };
}
