import type { Venue, WeddingEvent } from "@/types/wedding";
import { listedEvents } from "@/lib/invite-copy";

/** Google Maps URL for a venue — explicit `mapsUrl` wins, otherwise a search link. */
export function mapsUrl(venue: Venue) {
  if (venue.mapsUrl) return venue.mapsUrl;
  const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Where Google Maps should point: the exact pin when known, otherwise the address. */
function destination(venue: Venue) {
  return venue.coordinates ? `${venue.coordinates.lat},${venue.coordinates.lng}` : `${venue.name}, ${venue.address}`;
}

/** Keyless Google Maps embed, centred on the venue's pin. */
export function mapsEmbedUrl(venue: Venue) {
  return `https://www.google.com/maps?q=${encodeURIComponent(destination(venue))}&z=16&output=embed`;
}

/** Turn-by-turn directions from wherever the guest is. */
export function directionsUrl(venue: Venue) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination(venue))}`;
}

/** The distinct venues on a guest's invite, each with the event names held there. */
export function inviteVenues(events: WeddingEvent[]) {
  const shown = new Set(listedEvents(events).map((e) => e.id));
  const venues = new Map<string, { venue: Venue; events: string[] }>();
  for (const e of events) {
    if (!e.venue) continue;
    const key = `${e.venue.name}|${e.venue.address}`;
    const entry = venues.get(key) ?? { venue: e.venue, events: [] };
    if (shown.has(e.id)) entry.events.push(e.name);
    venues.set(key, entry);
  }
  return [...venues.values()];
}
