"use client";

import { createContext, useContext, useMemo } from "react";
import { resolveInvite, type Invite } from "@/lib/invites";

const InviteContext = createContext<Invite | null>(null);

/**
 * Makes the guest's invite (which events they see) available to every section.
 * Resolved from config by code, so server and client render the same thing.
 */
export function InviteProvider({ code, children }: { code: string | null; children: React.ReactNode }) {
  const invite = useMemo(() => resolveInvite(code), [code]);
  if (!invite) throw new Error(`Unknown invite code "${code}"`);
  return <InviteContext.Provider value={invite}>{children}</InviteContext.Provider>;
}

export function useInvite() {
  const ctx = useContext(InviteContext);
  if (!ctx) throw new Error("useInvite must be used inside <InviteProvider>");
  return ctx;
}
