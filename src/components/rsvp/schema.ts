import { z } from "zod";
import { wedding } from "@/config/wedding";

const max = wedding.rsvp.maxAttendees;

export const rsvpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(80, "Please keep your name under 80 characters."),
    attending: z.enum(["yes", "no"], { error: "Please let us know whether you can join us." }),
    attendees: z
      .number({ error: "Please choose how many will attend." })
      .int()
      .min(0)
      .max(max, `Each reply can include up to ${max} guests.`),
    message: z.string().trim().max(500, "Please keep your message under 500 characters."),
  })
  .refine((d) => d.attending !== "yes" || d.attendees >= 1, {
    path: ["attendees"],
    error: "Please choose how many will attend.",
  });

export type RsvpFormInput = z.input<typeof rsvpSchema>;
export type RsvpFormValues = z.output<typeof rsvpSchema>;
