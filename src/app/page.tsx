import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getPublicRoute } from "@/config/site";
import { createPageMetadata, projectsJsonLd } from "@/lib/seo";
import HomePageContent from "./HomePageContent";

export const metadata: Metadata = createPageMetadata(getPublicRoute("/"));

export default function Home() {
  return (
    <>
      <JsonLd data={projectsJsonLd()} />
      <HomePageContent />
    </>
  );
}
