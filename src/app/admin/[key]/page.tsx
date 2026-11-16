import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InviteBuilder } from "@/components/admin/InviteBuilder";
import { adminData, isAdminKey } from "@/lib/invites";

/** Rendered on request (never prebuilt), so a wrong address is a real 404. */
export const instant = false;

const robots = { index: false, follow: false, nocache: true };

/** Titled only for the right key, so a wrong address reveals nothing. */
export async function generateMetadata({ params }: PageProps<"/admin/[key]">): Promise<Metadata> {
  const { key } = await params;
  return isAdminKey(decodeURIComponent(key)) ? { title: "Invite links", robots } : { robots };
}

/**
 * Private admin page at /admin/<INVITE_SECRET>: tick the events for a guest
 * and get their personal link. Not prebuilt, so the secret never appears in
 * build output; anything else under /admin is a 404.
 */
export default async function AdminPage({ params }: PageProps<"/admin/[key]">) {
  const { key } = await params;
  if (!isAdminKey(decodeURIComponent(key))) notFound();
  return <InviteBuilder {...adminData()} />;
}
