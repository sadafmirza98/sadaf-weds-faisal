"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, MessageCircle, Minus, Pencil, Plus } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { WaxSeal } from "@/components/art/WaxSeal";
import { rsvpSchema, type RsvpFormInput, type RsvpFormValues } from "@/components/rsvp/schema";
import { formatLongDate, parseLocal, weekdayOf, monthOf, zonedTimeToUtc } from "@/lib/time";
import { rsvpMessage, whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const noopSubscribe = () => () => {};
const deadlineMs = wedding.rsvp.deadline ? zonedTimeToUtc(wedding.rsvp.deadline, wedding.timeZone).getTime() : null;

const defaultsFor = (eventIds: string[]): RsvpFormInput => ({
  name: "",
  attending: undefined as unknown as "yes",
  events: eventIds,
  attendees: 1,
  message: "",
});

/**
 * RSVP without a backend: the form validates the reply, then hands it to
 * WhatsApp as a pre-written message to `contact.phone`. Nothing is stored
 * or sent by the site itself — the reply arrives when the guest presses send.
 */
export function RsvpForm() {
  const { rsvp, contact } = wedding;
  const invite = useInvite();
  const defaults = defaultsFor(invite.events.map((e) => e.id));
  const closed = useSyncExternalStore(noopSubscribe, () => deadlineMs !== null && Date.now() > deadlineMs, () => false);
  const [ready, setReady] = useState<{ values: RsvpFormValues; text: string } | null>(null);
  const [opened, setOpened] = useState(false);
  const readyRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<RsvpFormInput, unknown, RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const attending = useWatch({ control, name: "attending" });
  const message = useWatch({ control, name: "message" }) ?? "";

  useEffect(() => {
    if (attending === "no") setValue("attendees", 0, { shouldValidate: false });
    if (attending === "yes") setValue("attendees", 1, { shouldValidate: false });
  }, [attending, setValue]);

  useEffect(() => {
    if (ready) readyRef.current?.focus();
  }, [ready]);

  const onSubmit = (values: RsvpFormValues) => {
    setOpened(false);
    setReady({ values, text: rsvpMessage(values) });
  };

  const edit = () => {
    setReady(null);
    requestAnimationFrame(() => setFocus("name"));
  };

  const startAnother = () => {
    reset(defaults);
    setReady(null);
    setOpened(false);
    requestAnimationFrame(() => setFocus("name"));
  };

  if (!rsvp.enabled || closed) {
    return (
      <div className="frame px-6 py-14 text-center sm:px-12">
        <p className="eyebrow">Replies closed</p>
        <p className="mt-5 font-display text-2xl italic text-ivory">
          {closed && rsvp.deadline ? `Our RSVP closed on ${formatLongDate(rsvp.deadline)}.` : "RSVPs are not open yet."}
        </p>
        <p className="body-copy mt-4">
          {contact.eyebrow}:{" "}
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-gold underline-offset-4 hover:underline">
            {contact.phone}
          </a>
        </p>
      </div>
    );
  }

  const firstName = ready?.values.name.split(/\s+/)[0] ?? "";

  return (
    <div className="frame px-5 py-10 sm:px-10 sm:py-12">
      <AnimatePresence mode="wait" initial={false}>
        {ready ? (
          <motion.div
            key="ready"
            ref={readyRef}
            tabIndex={-1}
            role="region"
            aria-label="Send your reply on WhatsApp"
            className="flex flex-col items-center text-center outline-none"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.div
              className="size-20"
              initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.1 }}
            >
              <WaxSeal monogram={wedding.couple.monogram} idPrefix="rsvp-seal" />
            </motion.div>
            <p className="eyebrow mt-7">{opened ? "Thank you" : "One last step"}</p>
            <h3 className="mt-4 font-display text-[clamp(2rem,5vw,2.6rem)] italic leading-tight text-ivory">
              {opened ? `JazakAllah khair, ${firstName}` : `Almost there, ${firstName}`}
            </h3>
            <p className="body-copy mt-4 max-w-sm text-pretty" role="status">
              {opened
                ? "Once you press send in WhatsApp, your reply reaches us. If WhatsApp did not open, tap the button again or message us directly."
                : "Your reply is written below. Tap the button, and WhatsApp opens with it ready — just press send."}
            </p>

            <pre className="mt-7 w-full max-w-md whitespace-pre-wrap border border-gold/20 bg-burgundy/20 p-4 text-left font-sans text-[0.8rem] leading-relaxed text-ivory/75">
              {ready.text}
            </pre>

            <a
              href={whatsappUrl(contact.phone, ready.text)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpened(true)}
              className="btn-luxe mt-7 w-full sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Send on WhatsApp
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.25em] text-ivory/40">To {contact.phone}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-gold/15 pt-6">
              <button type="button" onClick={edit} className="link-luxe">
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit my reply
              </button>
              <button type="button" onClick={startAnother} className="link-luxe">
                Reply for another guest
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={(e) => void handleSubmit(onSubmit)(e)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-9"
          >
            <Field id="rsvp-name" label="Full name" error={errors.name?.message}>
              <input
                id="rsvp-name"
                type="text"
                autoComplete="name"
                placeholder="As it appears on your invitation"
                className="field-input"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                {...register("name")}
              />
            </Field>

            <fieldset aria-describedby={errors.attending ? "rsvp-attending-error" : undefined}>
              <legend className="eyebrow text-gold/90">Will you attend?</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["yes", "Joyfully accepts"],
                    ["no", "Regretfully declines"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={cn(
                      "group relative flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 transition-colors duration-500",
                      attending === value ? "border-gold bg-wine/35 text-ivory" : "border-ivory/15 text-ivory/70 hover:border-gold/50",
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-gold",
                    )}
                  >
                    <input type="radio" value={value} className="sr-only" {...register("attending")} />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
                        attending === value ? "border-gold" : "border-ivory/40",
                      )}
                    >
                      <span className={cn("size-2 rounded-full bg-gold transition-transform duration-300", attending === value ? "scale-100" : "scale-0")} />
                    </span>
                    <span className="font-display text-lg italic">{label}</span>
                  </label>
                ))}
              </div>
              <ErrorText id="rsvp-attending-error" message={errors.attending?.message} />
            </fieldset>

            <AnimatePresence initial={false}>
              {attending === "yes" && (
                <motion.div
                  key="attending-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="space-y-9 overflow-hidden"
                >
                  {invite.events.length > 1 && (
                    <fieldset aria-describedby={errors.events ? "rsvp-events-error" : undefined}>
                      <legend className="eyebrow text-gold/90">Joining us for</legend>
                      <div className="mt-4 grid gap-3">
                        {invite.events.map((e) => {
                          const p = parseLocal(e.start);
                          return (
                            <label
                              key={e.id}
                              className="flex min-h-14 cursor-pointer items-center gap-3 border border-ivory/15 px-4 py-3 text-ivory/70 transition-colors duration-300 hover:border-gold/50 has-[:checked]:border-gold has-[:checked]:bg-wine/35 has-[:checked]:text-ivory has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-gold"
                            >
                              <input type="checkbox" value={e.id} className="peer sr-only" {...register("events")} />
                              <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center border border-ivory/40 peer-checked:border-gold peer-checked:[&>svg]:block">
                                <Check className="hidden size-3 text-gold" />
                              </span>
                              <span className="font-display text-lg italic">{e.name}</span>
                              <span className="ml-auto text-right text-[0.65rem] uppercase tracking-[0.2em] text-ivory/45">
                                {weekdayOf(e.start).slice(0, 3)} {p.day} {monthOf(e.start).slice(0, 3)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <ErrorText id="rsvp-events-error" message={errors.events?.message} />
                    </fieldset>
                  )}

                  <Controller
                    control={control}
                    name="attendees"
                    render={({ field }) => {
                      const value = typeof field.value === "number" ? field.value : 1;
                      return (
                        <div role="group" aria-labelledby="rsvp-attendees-label" aria-describedby={errors.attendees ? "rsvp-attendees-error" : undefined}>
                          <p id="rsvp-attendees-label" className="eyebrow text-gold/90">
                            Number of guests <span className="normal-case tracking-normal text-ivory/40">(including you)</span>
                          </p>
                          <div className="mt-4 flex items-center gap-5">
                            <button
                              type="button"
                              onClick={() => field.onChange(Math.max(1, value - 1))}
                              disabled={value <= 1}
                              className="grid size-11 place-items-center rounded-full border border-gold/30 text-ivory transition-colors hover:border-gold disabled:opacity-30"
                              aria-label="Fewer guests"
                            >
                              <Minus className="size-4" aria-hidden="true" />
                            </button>
                            <output aria-live="polite" className="w-10 text-center font-display text-4xl text-ivory">
                              {value}
                            </output>
                            <button
                              type="button"
                              onClick={() => field.onChange(Math.min(rsvp.maxAttendees, value + 1))}
                              disabled={value >= rsvp.maxAttendees}
                              className="grid size-11 place-items-center rounded-full border border-gold/30 text-ivory transition-colors hover:border-gold disabled:opacity-30"
                              aria-label="More guests"
                            >
                              <Plus className="size-4" aria-hidden="true" />
                            </button>
                            <span className="text-xs text-ivory/40">max {rsvp.maxAttendees}</span>
                          </div>
                          <ErrorText id="rsvp-attendees-error" message={errors.attendees?.message} />
                        </div>
                      );
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              id="rsvp-message"
              label="A note for the couple"
              optional
              error={errors.message?.message}
              aside={<span className={cn("text-[0.65rem] tabular-nums", message.length > 500 ? "text-[#e07a8e]" : "text-ivory/35")}>{message.length}/500</span>}
            >
              <textarea
                id="rsvp-message"
                rows={3}
                placeholder="Wishes, duas, a favourite memory…"
                className="field-input resize-none"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "rsvp-message-error" : undefined}
                {...register("message")}
              />
            </Field>

            <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
              <button type="submit" className="btn-luxe w-full sm:w-auto">
                Continue to WhatsApp
              </button>
              <p className="text-center text-[0.65rem] uppercase leading-relaxed tracking-[0.25em] text-ivory/40 sm:text-right">
                {rsvp.deadline ? `Kindly reply by ${formatLongDate(rsvp.deadline)}` : "Your reply is sent on WhatsApp"}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center gap-2 text-xs text-[#e07a8e]"
        >
          <AlertCircle className="size-3.5" aria-hidden="true" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="eyebrow text-gold/90">
          {label} {optional && <span className="normal-case tracking-normal text-ivory/40">(optional)</span>}
        </label>
        {aside}
      </div>
      {children}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}
