import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Noto_Sans_Tagalog, Cormorant_Garamond } from "next/font/google";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import RouteScrollReset from "@/components/RouteScrollReset";
import Splashscreen from "@/components/Splashscreen";
import { absoluteUrl, siteConfig } from "@/config/site";
import { siteIdentityJsonLd } from "@/lib/seo";
import "./globals.css";
import ClosingCta from "@/components/ClosingCta";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Only font in the Google Fonts catalog that ships Baybayin glyphs — needed
// for the decorative Baybayin "ka" watermark on the Product Design card
// (services.module.css .serviceItem:nth-child(2)::before). Space
// Grotesk/Manrope have no glyphs in that script, so without this the
// character would render as tofu/blank.
const notoSansTagalog = Noto_Sans_Tagalog({
  variable: "--font-baybayin",
  subsets: ["tagalog"],
  weight: "400",
  display: "swap",
});

// Elegant italic serif used only for the "Capabilities"/"Expertise"/
// "My Inspiration" captions in SkillsShowcase — a deliberate third face
// (distinct from the site's display/body pairing above) matching that
// section's editorial, poster-style reference rather than reusing
// Space Grotesk/Manrope for a look neither is cut for.
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: absoluteUrl("/about") }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: absoluteUrl("/"),
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
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage.path),
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage.path)],
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${notoSansTagalog.variable} ${cormorantGaramond.variable}`}
    >
      <body>
        <JsonLd data={siteIdentityJsonLd()} />
        {/* The curtain is server-rendered covering the page; without JS it
            would never lift, so hide it outright. */}
        <noscript>
          <style>{"[data-splash]{display:none}"}</style>
        </noscript>
        <Splashscreen />
        {/* Splashscreen marks this inert while it's covering the screen —
            see its effect for why. */}
        <div id="site-content">
          <RouteScrollReset />
          <Header />
          <main>{children}</main>
          <ClosingCta />
        </div>
      </body>
    </html>
  );
}
