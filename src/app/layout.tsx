import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Inter, Monsieur_La_Doulaise, Noto_Nastaliq_Urdu, Playfair_Display } from "next/font/google";
import { wedding } from "@/config/wedding";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Royal copperplate calligraphy for the couple's names. */
const royalScript = Monsieur_La_Doulaise({
  variable: "--font-royal-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/** Urdu Nastaliq for the opening Bismillah. */
const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["500"],
  display: "swap",
});

/** Arabic Naskh for the closing Quran verse. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

const { seo } = wedding;

// The cover shows on every visit; only ?open=1 (testing/previews) skips it.
const skipGateScript = `try{if(new URL(location.href).searchParams.get("open")==="1")document.documentElement.setAttribute("data-opened","")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: seo.title,
  description: seo.description,
  applicationName: seo.title,
  alternates: { canonical: "/" },
  robots: seo.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    url: "/",
    siteName: seo.title,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#090708",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${amiri.variable} ${nastaliq.variable} ${royalScript.variable}`} suppressHydrationWarning>
      <head>
        {/* ?open=1 links skip the invitation cover before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: skipGateScript }} />
      </head>
      <body className="min-h-svh antialiased">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
