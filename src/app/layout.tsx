import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
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

/** Arabic display face for the Bismillah line only. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

const { seo } = wedding;

const skipGateScript = `try{var u=new URL(location.href);if(u.hash.length>1||u.searchParams.get("open")==="1"||sessionStorage.getItem("wedding:opened")==="1")document.documentElement.setAttribute("data-opened","")}catch(e){}`;

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
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        {/* Returning guests / deep links skip the invitation cover before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: skipGateScript }} />
      </head>
      <body className="min-h-svh antialiased">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
