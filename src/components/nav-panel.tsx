"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { nav, site } from "@/data/site";

export function NavPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{
            background: "color-mix(in oklab, var(--graphite) 70%, transparent)",
            animation: "invinity-fade-in 420ms var(--ease-out-quiet)",
          }}
        />
        <Dialog.Content
          aria-label="Site navigation"
          className="fixed inset-y-0 left-0 z-[55] w-full md:w-[560px] surface-chalk grain overflow-y-auto"
          style={{ animation: "invinity-slide-in-left 560ms var(--ease-reveal)" }}
        >
          <div className="px-8 md:px-12 py-8 flex items-center justify-between">
            <span className="eyebrow">The House</span>
            <Dialog.Close asChild>
              <button aria-label="Close navigation" className="nav-link focus-ring">
                <span className="inline-flex items-center gap-3">
                  Close
                  <span aria-hidden style={{ fontSize: 16 }}>×</span>
                </span>
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <nav aria-label="Primary" className="px-8 md:px-12 pt-6 pb-12">
            <ul className="flex flex-col gap-6">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="serif block focus-ring"
                    style={{ fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <hr className="divider-hair my-10" />
            <ul className="flex flex-col gap-3">
              {nav.secondary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose} className="nav-link focus-ring">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-8 md:px-12 pb-12 mt-4">
            <hr className="divider-hair mb-8" />
            <div className="grid grid-cols-1 gap-2">
              <p className="meta">{site.address.line1}</p>
              <p className="meta">
                {site.address.city}, {site.address.region}
              </p>
              <p className="meta">
                <a className="link-quiet" href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <p className="meta">
                <a className="link-quiet" href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>{site.phone}</a>
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
