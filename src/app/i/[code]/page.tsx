import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/layout/InvitationPage";
import { inviteCodes, inviteForCode } from "@/lib/invites";
import { inviteMetadata } from "@/lib/invite-copy";

/** Every combination of events is prebuilt (needs INVITE_SECRET in production). */
export function generateStaticParams() {
  return inviteCodes.map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps<"/i/[code]">): Promise<Metadata> {
  const { code } = await params;
  const invite = inviteForCode(code);
  return invite ? inviteMetadata(invite, `/i/${code}`) : {};
}

/** A personalised link: /i/<code> shows only the events chosen for it on the admin page. */
export default async function InvitePage({ params }: PageProps<"/i/[code]">) {
  const { code } = await params;
  const invite = inviteForCode(code);
  if (!invite) notFound();
  return <InvitationPage invite={invite} />;
}
