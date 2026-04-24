"use client";

import { useState, useTransition } from "react";
import { notices } from "@/data/notices";
import { sendContact, requestExperience, subscribeReleaseList } from "@/app/actions/forms";

type FormState = "idle" | "submitting" | "success" | "error";

function formData(form: HTMLFormElement): Record<string, string> {
  const data = new FormData(form);
  const out: Record<string, string> = {};
  for (const [k, v] of data.entries()) out[k] = String(v);
  return out;
}

export function ReleaseList({ invert = false }: { invert?: boolean }) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = formData(e.currentTarget);
    setState("submitting");
    setError(null);
    startTransition(async () => {
      const r = await subscribeReleaseList({ email: data["release-email"] });
      if (r.ok) setState("success");
      else {
        setState("error");
        setError(r.error);
      }
    });
  };

  if (state === "success") {
    return (
      <p className="serif" style={{ fontSize: 22, color: invert ? "var(--chalk)" : "var(--graphite)" }}>
        {notices.releaseList.successLine}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-4">
      <div className="flex-1">
        <label htmlFor="release-email" style={{ color: invert ? "color-mix(in oklab, var(--chalk) 65%, transparent)" : undefined }}>
          Email
        </label>
        <input
          id="release-email"
          name="release-email"
          type="email"
          required
          placeholder="you@somewhere.com"
          style={invert ? { color: "var(--chalk)", borderColor: "color-mix(in oklab, var(--chalk) 35%, transparent)" } : undefined}
        />
      </div>
      <button
        disabled={pending}
        className="btn"
        style={invert ? { color: "var(--chalk)", borderColor: "var(--chalk)" } : undefined}
      >
        {pending ? "Sending…" : "Join"}
      </button>
      {error && <p className="meta" role="alert" style={{ color: "var(--oxide)" }}>{error}</p>}
    </form>
  );
}

export function ExperienceRequest() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = formData(e.currentTarget);
    setState("submitting");
    setError(null);
    startTransition(async () => {
      const r = await requestExperience(data);
      if (r.ok) setState("success");
      else {
        setState("error");
        setError(r.error);
      }
    });
  };

  if (state === "success") {
    return (
      <div className="py-12">
        <p className="serif display-l">Your request has been received.</p>
        <p className="body-l mt-4 max-w-[52ch]">
          We&rsquo;ll write personally within seventy-two hours to confirm the date and settle the quiet details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
      <div><label htmlFor="name">Name</label><input id="name" name="name" required /></div>
      <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
      <div><label htmlFor="phone">Phone (optional)</label><input id="phone" name="phone" type="tel" /></div>
      <div><label htmlFor="party">Party size</label><input id="party" name="party" type="number" min={1} max={40} defaultValue={10} required /></div>
      <div><label htmlFor="window">Preferred month or date window</label><input id="window" name="window" type="text" placeholder="June — July 2026" required /></div>
      <div>
        <label htmlFor="member">Membership</label>
        <select id="member" name="member" defaultValue="none">
          <option value="none">Not a member</option>
          <option value="orca">Orca</option>
          <option value="chinook">Chinook</option>
        </select>
      </div>
      <div className="md:col-span-2"><label htmlFor="notes">Notes (dietary, occasion, quiet details)</label><textarea id="notes" name="notes" rows={4} /></div>
      <div className="md:col-span-2 mt-4 flex items-center gap-6">
        <button disabled={pending} className="btn btn-solid">{pending ? "Sending…" : "Send request"}</button>
        <p className="meta">We reply within seventy-two hours.</p>
        {error && <p className="meta" role="alert" style={{ color: "var(--oxide)" }}>{error}</p>}
      </div>
    </form>
  );
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = formData(e.currentTarget);
    setState("submitting");
    setError(null);
    startTransition(async () => {
      const r = await sendContact({
        name: data["c-name"],
        email: data["c-email"],
        subject: data["c-subject"],
        message: data["c-msg"],
      });
      if (r.ok) setState("success");
      else {
        setState("error");
        setError(r.error);
      }
    });
  };

  if (state === "success") return <p className="serif display-l">Your note has been received.</p>;

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <div><label htmlFor="c-name">Name</label><input id="c-name" name="c-name" required /></div>
      <div><label htmlFor="c-email">Email</label><input id="c-email" name="c-email" type="email" required /></div>
      <div className="md:col-span-2"><label htmlFor="c-subject">Subject</label><input id="c-subject" name="c-subject" required /></div>
      <div className="md:col-span-2"><label htmlFor="c-msg">Message</label><textarea id="c-msg" name="c-msg" rows={6} required /></div>
      <div className="md:col-span-2">
        <button disabled={pending} className="btn btn-solid">{pending ? "Sending…" : "Send"}</button>
        {error && <p className="meta mt-3" role="alert" style={{ color: "var(--oxide)" }}>{error}</p>}
      </div>
    </form>
  );
}
