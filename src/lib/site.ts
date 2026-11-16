import { wedding } from "@/config/wedding";

/**
 * Absolute site URL for canonical / Open Graph metadata (server-side only).
 * Priority: NEXT_PUBLIC_SITE_URL → Vercel production URL → Netlify site URL → config → localhost.
 */
export function siteUrl(): URL {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return new URL(fromEnv);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  // Netlify sets URL to the site's main address during builds.
  const netlify = process.env.NETLIFY === "true" ? process.env.URL?.trim() : "";
  if (netlify) return new URL(netlify);
  if (wedding.seo.siteUrl) return new URL(wedding.seo.siteUrl);
  return new URL("http://localhost:3000");
}
