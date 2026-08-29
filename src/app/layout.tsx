import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Noto_Sans_Tagalog, Cormorant_Garamond } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteScrollReset from "@/components/RouteScrollReset";
import Splashscreen from "@/components/Splashscreen";
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
  title: "Joane Camille · Digital Product Developer",
  description:
    "Joane Camille partners with ambitious brands to design, build, and scale digital products that perform.",
  openGraph: {
    title: "Joane Camille · Digital Product Developer",
    description:
      "Joane Camille partners with ambitious brands to design, build, and scale digital products that perform.",
    images: ["/images/bg.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joane Camille · Digital Product Developer",
    description:
      "Joane Camille partners with ambitious brands to design, build, and scale digital products that perform.",
    images: ["/images/bg.png"],
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
