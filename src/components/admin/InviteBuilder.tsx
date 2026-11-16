"use client";

import { Check, Copy, ExternalLink, MessageCircle, TriangleAlert } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { wedding } from "@/config/wedding";
import { WaxSeal } from "@/components/art/WaxSeal";
import { formatTime, hasTime, parseLocal, weekdayOf, monthOf } from "@/lib/time";
import { cn } from "@/lib/utils";
import { inviteShareMessage } from "@/lib/whatsapp";

interface Props {
  events: { id: string; name: string; start: string }[];
  defaultIds: string[];
  /** setKey(ids) → code, for every combination. */
  codes: Record<string, string>;
  usingDevSecret: boolean;
}

const subscribeNoop = () => () => {};
const setKey = (ids: string[]) => [...ids].sort().join(",");
const when = (start: string) => {
  const p = parseLocal(start);
  return `${weekdayOf(start).slice(0, 3)} ${p.day} ${monthOf(start).slice(0, 3)}${hasTime(start) ? ` · ${formatTime(start)}` : ""}`;
};

/** Admin: choose a guest's events, then copy or WhatsApp their personal link. */
export function InviteBuilder({ events, defaultIds, codes, usingDevSecret }: Props) {
  const [selected, setSelected] = useState<string[]>(events.map((e) => e.id));
  const [guest, setGuest] = useState("");
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(subscribeNoop, () => window.location.origin, () => "");

  const chosen = events.filter((e) => selected.includes(e.id));
  const code = chosen.length ? codes[setKey(selected)] : undefined;
  const link = code && origin ? `${origin}/i/${code}` : "";
  const shareText = useMemo(() => (link ? inviteShareMessage(guest, chosen.map((e) => e.name), link) : ""), [link, guest, chosen]);
  const defaultNames = events.filter((e) => defaultIds.includes(e.id)).map((e) => e.name);

  const toggle = (id: string) => {
    setCopied(false);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-svh px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-4">
          <div className="size-14 shrink-0">
            <WaxSeal monogram={wedding.couple.monogram} idPrefix="admin-seal" />
          </div>
          <div>
            <p className="eyebrow">Private · for {wedding.couple.partnerOne.firstName} &amp; {wedding.couple.partnerTwo.firstName}</p>
            <h1 className="mt-1 font-display text-4xl italic text-ivory">Invite links</h1>
          </div>
        </div>
        <p className="body-copy mt-6 text-pretty">
          Tick the events this guest is invited to. Their link shows only those events — the other events are not on their page at all.
        </p>

        {usingDevSecret && (
          <p role="alert" className="mt-6 flex gap-3 border border-[#e07a8e]/40 bg-crimson/20 p-4 text-sm leading-relaxed text-ivory/85">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[#e07a8e]" aria-hidden="true" />
            Development links — these only work on this computer. Make the links you send from the live site&apos;s admin page.
          </p>
        )}

        <fieldset className="mt-10">
          <legend className="eyebrow text-gold/90">Invited to</legend>
          <div className="mt-4 grid gap-3">
            {events.map((e) => {
              const on = selected.includes(e.id);
              return (
                <label
                  key={e.id}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-4 border px-4 py-3 transition-colors duration-300",
                    on ? "border-gold bg-wine/35 text-ivory" : "border-ivory/15 text-ivory/55 hover:border-gold/50",
                    "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-gold",
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(e.id)} />
                  <span aria-hidden="true" className={cn("grid size-5 shrink-0 place-items-center border", on ? "border-gold bg-gold/15" : "border-ivory/40")}>
                    {on && <Check className="size-3.5 text-gold" />}
                  </span>
                  <span className="font-display text-xl italic">{e.name}</span>
                  <span className="ml-auto text-right text-[0.65rem] uppercase tracking-[0.18em] text-ivory/45">{when(e.start)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8">
          <label htmlFor="guest-name" className="eyebrow text-gold/90">
            Guest name <span className="normal-case tracking-normal text-ivory/40">(optional, for the WhatsApp message)</span>
          </label>
          <input
            id="guest-name"
            type="text"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            placeholder="e.g. Ayesha Aunty"
            className="field-input"
          />
        </div>

        <div className="frame mt-10 px-5 py-6 sm:px-7">
          <p className="eyebrow text-[0.6rem]">Their link</p>
          {link ? (
            <>
              <p className="mt-3 break-all font-serif text-lg text-ivory" data-testid="invite-link">
                {link}
              </p>
              <p className="mt-2 text-xs text-ivory/50">Shows: {chosen.map((e) => e.name).join(" · ")}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={copy} className="btn-luxe">
                  {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="btn-luxe">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Send on WhatsApp
                </a>
                <a href={link} target="_blank" rel="noopener noreferrer" className="link-luxe self-center">
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  Preview as guest
                </a>
              </div>
              <span className="sr-only" aria-live="polite">
                {copied ? "Link copied" : ""}
              </span>
            </>
          ) : (
            <p className="mt-3 font-display text-lg italic text-ivory/60">Choose at least one event.</p>
          )}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-ivory/45">
          The plain link {origin ? <span className="text-ivory/70">{origin}/</span> : "(your site's home page)"} shows: {defaultNames.join(" · ")}.
          Send personal links to anyone who should see a different set. Keep this page&apos;s address private — anyone with it can make links for every event.
        </p>
      </div>
    </main>
  );
}
