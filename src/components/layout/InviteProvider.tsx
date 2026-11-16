"use client";

import { createContext, useContext } from "react";
import type { Invite } from "@/types/wedding";

const InviteContext = createContext<Invite | null>(null);

/**
 * The guest's invite (which events they see). Resolved on the server and
 * passed in, so only the invited events ever reach the browser.
 */
export function InviteProvider({ invite, children }: { invite: Invite; children: React.ReactNode }) {
  return <InviteContext.Provider value={invite}>{children}</InviteContext.Provider>;
}

export function useInvite() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvite must be used inside <InviteProvider>");
  return ctx;
}
