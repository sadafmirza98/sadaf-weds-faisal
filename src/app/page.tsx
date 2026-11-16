import type { Metadata } from "next";
import { InvitationPage } from "@/components/layout/InvitationPage";
import { resolveInvite } from "@/lib/invites";
import { inviteMetadata } from "@/lib/invite-copy";

export const metadata: Metadata = inviteMetadata(resolveInvite(null)!, "/");

/** The plain link: shows `invites.default`. */
export default function Home() {
  return <InvitationPage code={null} />;
}
