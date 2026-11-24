import type { Invite } from "@/types/wedding";
import { ExperienceProvider } from "@/components/layout/ExperienceProvider";
import { InviteProvider } from "@/components/layout/InviteProvider";
import { MainContent } from "@/components/layout/MainContent";
import { SiteNav } from "@/components/layout/SiteNav";
import { InvitationGate } from "@/components/invitation/InvitationGate";
import { PetalField } from "@/components/animations/PetalField";
import { SakuraBreak } from "@/components/art/GrowingSakura";
import { MusicProvider } from "@/components/music/MusicProvider";
import { MusicToggle } from "@/components/music/MusicToggle";
import { Hero } from "@/sections/Hero";
import { Families } from "@/sections/Blessing";
import { Celebrations } from "@/sections/Celebrations";
import { Countdown } from "@/sections/Countdown";
import { SaveTheDate } from "@/sections/SaveTheDate";
import { VenueMap } from "@/sections/VenueMap";
import { Rsvp } from "@/sections/Rsvp";
import { Closing } from "@/sections/Closing";

/** The whole invitation, showing only the events on one invite. */
export function InvitationPage({ invite }: { invite: Invite }) {
  return (
    <InviteProvider invite={invite}>
      <ExperienceProvider>
        <MusicProvider>
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
            <Families />
            {/* Phones: sakura grows in the open space between sections */}
            <SakuraBreak side="left" variant={0} />
            <Celebrations />
            <SakuraBreak side="right" variant={1} />
            <Countdown />
            <SaveTheDate />
            <SakuraBreak side="left" variant={1} />
            <VenueMap />
            <Rsvp />
            <SakuraBreak side="right" variant={0} />
            <Closing />
          </MainContent>
          <MusicToggle />
        </MusicProvider>
      </ExperienceProvider>
    </InviteProvider>
  );
}
