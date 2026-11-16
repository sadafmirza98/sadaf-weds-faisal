import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/layout/InvitationPage";
import { inviteCodes, resolveInvite } from "@/lib/invites";
import { inviteMetadata } from "@/lib/invite-copy";

/** Every personalised link is prerendered at build time. */
export function generateStaticParams() {
  return inviteCodes.map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps<"/i/[code]">): Promise<Metadata> {
  const { code } = await params;
  const invite = resolveInvite(code);
  if (!invite) return {};
  return inviteMetadata(invite, `/i/${code}`);
}

/** A personalised link: /i/<code> shows only that invite's events. */
export default async function InvitePage({ params }: PageProps<"/i/[code]">) {
  const { code } = await params;
  if (!resolveInvite(code)) notFound();
  return <InvitationPage code={code} />;
}
