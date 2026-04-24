"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { notices } from "@/data/notices";

const KEY = "invinity.age.v1";

export function AgeGate({ minimumAge }: { minimumAge: number }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {}
  }, []);

  if (!mounted) return null;

  const accept = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} modal>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[100] surface-graphite grain"
          style={{ background: "var(--graphite)" }}
        />
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed inset-0 z-[101] flex items-center justify-center surface-graphite grain"
        >
          <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-10 items-center w-full">
            <div className="md:col-span-7 md:col-start-3 text-center">
              <p className="eyebrow" style={{ color: "var(--champagne)" }}>
                {site.name}
              </p>
              <Dialog.Title className="serif display-l mt-6" style={{ color: "var(--chalk)" }}>
                {notices.ageGate.headline}
              </Dialog.Title>
              <Dialog.Description className="body-l mt-6 mx-auto max-w-[46ch]" style={{ color: "color-mix(in oklab, var(--chalk) 78%, transparent)" }}>
                {notices.ageGate.body.replace("legal drinking age", `legal drinking age (${minimumAge}+)`)}
              </Dialog.Description>
              <div className="mt-12 flex flex-wrap gap-4 justify-center items-center">
                <button onClick={accept} className="btn btn-invert">
                  {notices.ageGate.acceptLabel(minimumAge)}
                </button>
                <a
                  href={notices.ageGate.leaveHref}
                  className="nav-link"
                  style={{ color: "color-mix(in oklab, var(--chalk) 60%, transparent)" }}
                >
                  {notices.ageGate.leaveLabel}
                </a>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
