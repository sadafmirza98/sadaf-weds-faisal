"use client";

import { MessageCircle, Phone } from "lucide-react";
import { wedding } from "@/config/wedding";
import { Reveal } from "@/components/animations/Reveal";
import { Illustration } from "@/components/art/Illustration";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { whatsappUrl } from "@/lib/whatsapp";
import { SideSakura } from "@/components/art/GrowingSakura";

/** SECTION G — RSVP (sent on WhatsApp) and the contact number. */
export function Rsvp() {
  const { rsvp, contact } = wedding;

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="section-y relative overflow-hidden bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(64,13,32,0.45),transparent_70%)]">
      {/* a sakura sprig grows in from the side as this scrolls into view */}
      <SideSakura side="right" variant={2} className="top-[52%]" />
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

          {/* Two quiet actions rather than a list of numbers; the number sits small beneath each. */}
          <div className="mt-10 max-w-md">
            <p className="eyebrow text-[0.6rem] text-gold/85">{contact.eyebrow}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ContactTile
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                icon={<Phone className="size-4" aria-hidden="true" />}
                title="Call us"
                detail={contact.phone}
              />
              <ContactTile
                href={whatsappUrl(contact.whatsapp)}
                external
                icon={<MessageCircle className="size-4" aria-hidden="true" />}
                title="WhatsApp us"
                detail={contact.whatsapp}
              />
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

function ContactTile({
  href,
  icon,
  title,
  detail,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 border border-gold/20 bg-burgundy/20 px-4 py-3.5 transition-[border-color,background-color,box-shadow] duration-500 ease-silk hover:border-gold/60 hover:bg-burgundy/35 hover:shadow-[0_0_30px_-12px_rgba(184,69,90,0.6)]"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/35 text-gold transition-colors duration-500 group-hover:border-gold group-hover:bg-gold/10">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-xl italic leading-tight text-ivory transition-colors duration-500 group-hover:text-gold">{title}</span>
        <span className="mt-0.5 text-[0.7rem] tracking-[0.08em] text-ivory/45">{detail}</span>
      </span>
      {external && <span className="sr-only"> (opens WhatsApp in a new tab)</span>}
    </a>
  );
}
