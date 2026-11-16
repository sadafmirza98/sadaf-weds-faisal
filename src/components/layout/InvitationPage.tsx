import { ExperienceProvider } from "@/components/layout/ExperienceProvider";
import { InviteProvider } from "@/components/layout/InviteProvider";
import { MainContent } from "@/components/layout/MainContent";
import { SiteNav } from "@/components/layout/SiteNav";
import { InvitationGate } from "@/components/invitation/InvitationGate";
import { PetalField } from "@/components/animations/PetalField";
import { Hero } from "@/sections/Hero";
import { Blessing } from "@/sections/Blessing";
import { Celebrations } from "@/sections/Celebrations";
import { Countdown } from "@/sections/Countdown";
import { SaveTheDate } from "@/sections/SaveTheDate";
import { Rsvp } from "@/sections/Rsvp";
import { Closing } from "@/sections/Closing";

/** The whole invitation, showing the events of one invite (null = the plain link). */
export function InvitationPage({ code }: { code: string | null }) {
  return (
    <InviteProvider code={code}>
      <ExperienceProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-obsidian focus:px-4 focus:py-3 focus:text-sm focus:text-gold"
        >
          Skip to content
        </a>
        <InvitationGate />
        <SiteNav />
        <PetalField />
        <MainContent>
          <Hero />
          <Blessing />
          <Celebrations />
          <Countdown />
          <SaveTheDate />
          <Rsvp />
          <Closing />
        </MainContent>
      </ExperienceProvider>
    </InviteProvider>
  );
}
