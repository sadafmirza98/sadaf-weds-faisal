import type { MetadataRoute } from "next";
import { wedding } from "@/config/wedding";
import { siteUrl } from "@/lib/site";

/**
 * Crawling stays allowed so link-preview bots (WhatsApp, iMessage, X…) can read
 * the Open Graph tags. Search indexing is controlled by the robots <meta> tag
 * via `seo.allowIndexing` in the config.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: wedding.seo.allowIndexing ? new URL("/sitemap.xml", siteUrl()).toString() : undefined,
  };
}
