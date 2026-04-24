// Email adapter — server-only.
//
// Use this for form confirmations and concierge follow-ups. In stub mode we
// log and return ok; in live mode we hit Resend. Never import Resend directly
// elsewhere — the standards check will fail the build.

import "server-only";
import { integrations, serverEnv } from "@/lib/env";

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export type EmailResult =
  | { ok: true; id: string; mode: "live" | "stub" }
  | { ok: false; error: string };

export interface EmailAdapter {
  mode: "live" | "stub";
  send(msg: EmailMessage): Promise<EmailResult>;
}

const stub: EmailAdapter = {
  mode: "stub",
  async send(msg) {
    // eslint-disable-next-line no-console
    console.warn(
      `[email:stub] to=${msg.to} subject=${JSON.stringify(msg.subject)} — configure RESEND_API_KEY to send for real.`
    );
    return { ok: true, mode: "stub", id: `stub-${Date.now()}` };
  },
};

const live: EmailAdapter = {
  mode: "live",
  async send(msg) {
    const env = serverEnv();
    if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
      return { ok: false, error: "Resend is not configured." };
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), integrations.email.timeoutMs);
    try {
      const res = await fetch(integrations.email.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: msg.to,
          subject: msg.subject,
          html: msg.html,
          reply_to: msg.replyTo,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) return { ok: false, error: `Resend HTTP ${res.status}` };
      const json = (await res.json()) as { id?: string };
      return { ok: true, mode: "live", id: json.id ?? "unknown" };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Email request failed." };
    } finally {
      clearTimeout(timer);
    }
  },
};

export const email: EmailAdapter = integrations.email.mode() === "live" ? live : stub;
