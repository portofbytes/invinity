import { z } from "zod";
import { email } from "@/integrations/email";
import { site } from "@/data/site";
import { rateLimit } from "@/lib/rate-limit";

// Shared output shape so client components don't need to know the transport.
export type ActionResult = { ok: true; mode: "live" | "stub" } | { ok: false; error: string };

function parse<T>(schema: z.ZodType<T>, data: unknown): T | { _error: string } {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  return { _error: r.error.issues.map((i) => i.message).join("; ") };
}

async function throttle(bucket: Parameters<typeof rateLimit>[0]): Promise<ActionResult | null> {
  const r = await rateLimit(bucket);
  if (r.ok) return null;
  return { ok: false, error: `Too many requests. Please try again in ${r.retryAfterSeconds}s.` };
}

const ReleaseListInput = z.object({ email: z.email() });
export async function subscribeReleaseList(raw: unknown): Promise<ActionResult> {
  const t = await throttle("form");
  if (t) return t;
  const input = parse(ReleaseListInput, raw);
  if ("_error" in input) return { ok: false, error: input._error };
  const r = await email.send({
    to: site.email,
    subject: `Release list signup: ${input.email}`,
    html: `<p>${input.email} joined the release list.</p>`,
    replyTo: input.email,
  });
  return r.ok ? { ok: true, mode: r.mode } : { ok: false, error: r.error };
}

const ExperienceRequestInput = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional().default(""),
  party: z.coerce.number().int().positive(),
  window: z.string().min(1),
  notes: z.string().optional().default(""),
  member: z.string().optional().default("none"),
});
export async function requestExperience(raw: unknown): Promise<ActionResult> {
  const t = await throttle("form");
  if (t) return t;
  const input = parse(ExperienceRequestInput, raw);
  if ("_error" in input) return { ok: false, error: input._error };
  const lines = [
    `<p><strong>${input.name}</strong> — ${input.email}${input.phone ? ` · ${input.phone}` : ""}</p>`,
    `<p>Party of ${input.party}, window ${input.window}. Membership: ${input.member}.</p>`,
    input.notes ? `<p>${input.notes}</p>` : "",
  ].join("");
  const r = await email.send({
    to: site.email,
    subject: `Experience request — ${input.name}`,
    html: lines,
    replyTo: input.email,
  });
  return r.ok ? { ok: true, mode: r.mode } : { ok: false, error: r.error };
}

const ContactInput = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});
export async function sendContact(raw: unknown): Promise<ActionResult> {
  const t = await throttle("form");
  if (t) return t;
  const input = parse(ContactInput, raw);
  if ("_error" in input) return { ok: false, error: input._error };
  const r = await email.send({
    to: site.email,
    subject: `Contact: ${input.subject}`,
    html: `<p><strong>${input.name}</strong> — ${input.email}</p><p>${input.message}</p>`,
    replyTo: input.email,
  });
  return r.ok ? { ok: true, mode: r.mode } : { ok: false, error: r.error };
}

const WaitlistInput = z.object({
  email: z.email(),
  wine: z.string().min(1),
  qty: z.coerce.number().int().optional(),
  note: z.string().optional().default(""),
});
export async function joinWaitlist(raw: unknown): Promise<ActionResult> {
  const t = await throttle("waitlist");
  if (t) return t;
  const input = parse(WaitlistInput, raw);
  if ("_error" in input) return { ok: false, error: input._error };
  const r = await email.send({
    to: site.email,
    subject: `Waitlist: ${input.wine}`,
    html: `<p>${input.email} wants the next release of ${input.wine}${input.qty ? ` (x${input.qty})` : ""}.</p>${input.note ? `<p>${input.note}</p>` : ""}`,
    replyTo: input.email,
  });
  return r.ok ? { ok: true, mode: r.mode } : { ok: false, error: r.error };
}
