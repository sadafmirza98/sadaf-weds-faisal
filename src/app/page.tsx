import type { Metadata } from "next";
import { InvitationPage } from "@/components/layout/InvitationPage";
import { defaultInvite } from "@/lib/invites";
import { inviteMetadata } from "@/lib/invite-copy";

export const metadata: Metadata = inviteMetadata(defaultInvite(), "/");

/** The plain link: shows `defaultInviteEvents`. */
export default function Home() {
  return <InvitationPage invite={defaultInvite()} />;
}
