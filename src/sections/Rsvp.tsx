"use client";

import { MessageCircle, Phone } from "lucide-react";
import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { Reveal } from "@/components/animations/Reveal";
import { Illustration } from "@/components/art/Illustration";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { formatFullDate, formatTime, hasTime } from "@/lib/time";
import { whatsappUrl } from "@/lib/whatsapp";

/** SECTION G — RSVP (sent on WhatsApp) and the contact number. */
export function Rsvp() {
  const { rsvp, contact } = wedding;
  const { events } = useInvite();

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="section-y relative overflow-hidden bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(64,13,32,0.45),transparent_70%)]">
      <Illustration name="floral-corner" className="absolute -left-24 top-0 w-64 opacity-40 sm:w-96 lg:opacity-50" />

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:pt-10">
          <p className="eyebrow flex items-center gap-4">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            {rsvp.eyebrow}
          </p>
          <h2 id="rsvp-title" className="display-title mt-6 text-[clamp(2.8rem,7vw,5.25rem)] italic text-balance">
            {rsvp.title}
          </h2>
          <p className="body-copy mt-6 max-w-md text-pretty">{rsvp.intro}</p>

          <dl className="mt-10 space-y-5 border-l border-gold/20 pl-6">
            {events.map((e) => (
              <div key={e.id}>
                <dt className="eyebrow text-[0.6rem] text-ivory/45">{e.name}</dt>
                <dd className="mt-1 font-display text-xl italic text-ivory">
                  {formatFullDate(e.start)}
                  {hasTime(e.start) && <span className="text-ivory/55"> · {formatTime(e.start)}</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 max-w-md border border-gold/20 bg-burgundy/20 p-5">
            <p className="eyebrow text-[0.6rem] text-gold/85">{contact.eyebrow}</p>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="mt-2 inline-flex items-center gap-3 font-serif text-xl text-ivory transition-colors hover:text-gold"
            >
              <Phone className="size-4 text-gold" aria-hidden="true" />
              {contact.phone}
            </a>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="link-luxe">
                <Phone className="size-3.5" aria-hidden="true" />
                Call
              </a>
              <a href={whatsappUrl(contact.phone)} target="_blank" rel="noopener noreferrer" className="link-luxe">
                <MessageCircle className="size-3.5" aria-hidden="true" />
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          <RsvpForm />
        </Reveal>
      </div>
    </section>
  );
}
