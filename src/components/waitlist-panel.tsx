"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useTransition } from "react";
import type { Wine } from "@/data/wines";
import { joinWaitlist } from "@/app/actions/forms";

export function WaitlistPanel({ wine, trigger }: { wine: Wine; trigger: React.ReactNode }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("submitting");
    setError(null);
    startTransition(async () => {
      const r = await joinWaitlist({
        email: String(form.get("waitlist-email") ?? ""),
        wine: `${wine.name}${wine.cuveeLabel ? ` — ${wine.cuveeLabel}` : ""} · ${wine.vintage}`,
        qty: form.get("waitlist-qty") ? Number(form.get("waitlist-qty")) : undefined,
        note: String(form.get("waitlist-note") ?? ""),
      });
      if (r.ok) setState("success");
      else { setState("error"); setError(r.error); }
    });
  };

  return (
    <Dialog.Root
      onOpenChange={(o) => {
        if (o) {
          setState("idle");
          setStep(1);
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[60]"
          style={{ background: "color-mix(in oklab, var(--graphite) 55%, transparent)", animation: "invinity-fade-in 380ms var(--ease-out-quiet)" }}
        />
        <Dialog.Content
          aria-label={`Join the waitlist for ${wine.name}`}
          className="fixed inset-y-0 right-0 z-[61] w-full md:w-[520px] surface-paper flex flex-col"
          style={{ animation: "invinity-slide-in-right 520ms var(--ease-reveal)" }}
        >
          <div className="flex items-center justify-between px-8 py-7">
            <Dialog.Title className="eyebrow">Notification list</Dialog.Title>
            <Dialog.Close asChild>
              <button className="nav-link focus-ring" aria-label="Close">Close ×</button>
            </Dialog.Close>
          </div>
          <hr className="divider-hair mx-8" />

          <div className="flex-1 overflow-y-auto px-8 py-10">
            {state === "success" ? (
              <div>
                <p className="serif display-l">You&rsquo;re on the list.</p>
                <p className="body-l mt-5">
                  We&rsquo;ll write when the next disgorgement of {wine.name}
                  {wine.cuveeLabel ? ` — ${wine.cuveeLabel}` : ""} is on the table.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-6">
                <div>
                  <h2 className="serif h1">
                    {wine.name}
                    {wine.cuveeLabel ? ` — ${wine.cuveeLabel}` : ""}
                  </h2>
                  <p className="meta mt-2">Vintage {wine.vintage}</p>
                  <Dialog.Description className="body mt-4">
                    This cuvée is rested. Leave your email and we&rsquo;ll write personally when the next
                    release is disgorged — usually once or twice a year.
                  </Dialog.Description>
                </div>

                {step === 1 && (
                  <>
                    <div>
                      <label htmlFor="waitlist-email">Email</label>
                      <input id="waitlist-email" name="waitlist-email" type="email" required />
                    </div>
                    <div className="mt-2 flex items-center gap-6">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="btn btn-solid"
                      >
                        Continue
                      </button>
                      <button
                        type="submit"
                        className="nav-link focus-ring"
                        disabled={pending}
                      >
                        Skip, just notify me
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label htmlFor="waitlist-qty">Preferred quantity (optional)</label>
                      <input id="waitlist-qty" name="waitlist-qty" type="number" min={1} max={24} placeholder="3" />
                    </div>
                    <div>
                      <label htmlFor="waitlist-note">A note to the house (optional)</label>
                      <textarea id="waitlist-note" name="waitlist-note" rows={3} />
                    </div>
                    <div className="mt-2 flex items-center gap-6">
                      <button type="submit" className="btn btn-solid" disabled={pending}>
                        {state === "submitting" ? "Sending…" : "Add me to the list"}
                      </button>
                      <button type="button" onClick={() => setStep(1)} className="nav-link">
                        Back
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
