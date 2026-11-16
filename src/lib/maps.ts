import type { Venue } from "@/types/wedding";

/** Google Maps URL for a venue — explicit `mapsUrl` wins, otherwise a search link. */
export function mapsUrl(venue: Venue) {
  if (venue.mapsUrl) return venue.mapsUrl;
  const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
