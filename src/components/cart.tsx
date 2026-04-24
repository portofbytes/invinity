"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import type { Wine } from "@/data/wines";
import { BottleArt } from "./bottle";

type CartLine = {
  slug: string;
  name: string;
  cuveeLabel?: string;
  vintage: string;
  price: number;
  qty: number;
  collection: Wine["collection"];
  styleShort: string;
};

function BottleArtMini({ line }: { line: CartLine }) {
  return (
    <BottleArt
      wine={{
        name: line.name,
        cuveeLabel: line.cuveeLabel,
        vintage: line.vintage,
        collection: line.collection,
        styleShort: line.styleShort,
      }}
      width="52%"
      flat
    />
  );
}
type CartState = {
  lines: CartLine[];
  subtotal: number;
  add: (w: Wine, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const Ctx = createContext<CartState | null>(null);
const KEY = "invinity.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const add = useCallback((w: Wine, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === w.slug);
      if (existing) return prev.map((l) => (l.slug === w.slug ? { ...l, qty: l.qty + qty } : l));
      return [
        ...prev,
        {
          slug: w.slug,
          name: w.name,
          cuveeLabel: w.cuveeLabel,
          vintage: w.vintage,
          price: w.price,
          qty,
          collection: w.collection,
          styleShort: w.styleShort,
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const setQty = useCallback(
    (slug: string, qty: number) =>
      setLines((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, qty) } : l))),
    []
  );
  const clear = useCallback(() => setLines([]), []);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);

  return (
    <Ctx.Provider value={{ lines, subtotal, add, remove, setQty, clear, open, setOpen }}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartTrigger() {
  const ctx = useContext(Ctx);
  const count = ctx?.lines.reduce((s, l) => s + l.qty, 0) ?? 0;
  return (
    <button
      onClick={() => ctx?.setOpen(true)}
      className="nav-link focus-ring"
      aria-label={`Cart, ${count} items`}
    >
      Cart ({String(count).padStart(2, "0")})
    </button>
  );
}

function CartDrawer() {
  const { lines, subtotal, remove, setQty, open, setOpen } = useCart();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[60]"
          style={{ background: "color-mix(in oklab, var(--graphite) 55%, transparent)", animation: "invinity-fade-in 380ms var(--ease-out-quiet)" }}
        />
        <Dialog.Content
          aria-label="Cart"
          className="fixed inset-y-0 right-0 z-[61] w-full md:w-[480px] surface-paper flex flex-col"
          style={{ animation: "invinity-slide-in-right 520ms var(--ease-reveal)" }}
        >
        <div className="flex items-center justify-between px-8 py-7">
          <Dialog.Title className="eyebrow">Your Selection</Dialog.Title>
          <Dialog.Close asChild>
            <button className="nav-link focus-ring" aria-label="Close cart">Close ×</button>
          </Dialog.Close>
        </div>
        <hr className="divider-hair mx-8" />
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="serif display-l">A quiet cellar.</p>
              <p className="body mt-4">
                Nothing has been set aside yet. Browse <Link className="link-quiet" href="/wines" onClick={() => setOpen(false)}>the wines</Link> to begin.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {lines.map((l) => (
                <li key={l.slug} className="py-6 border-b rule-hair flex gap-6">
                  <div className="relative w-20 h-24 flex-shrink-0 surface-chalk overflow-hidden flex items-end justify-center">
                    <BottleArtMini line={l} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="serif" style={{ fontSize: 20, lineHeight: 1.2 }}>
                        {l.name}
                      </p>
                      <p className="meta mt-1">
                        {l.cuveeLabel ? `${l.cuveeLabel} · ` : ""}
                        {l.vintage}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center gap-3">
                        <button
                          aria-label="Decrease"
                          onClick={() => setQty(l.slug, l.qty - 1)}
                          className="w-7 h-7 border rule-hair focus-ring"
                        >
                          −
                        </button>
                        <span className="meta" aria-live="polite">
                          {l.qty}
                        </span>
                        <button
                          aria-label="Increase"
                          onClick={() => setQty(l.slug, l.qty + 1)}
                          className="w-7 h-7 border rule-hair focus-ring"
                        >
                          +
                        </button>
                        <button onClick={() => remove(l.slug)} className="nav-link ml-3">
                          Remove
                        </button>
                      </div>
                      <span className="serif" style={{ fontSize: 18 }}>
                        ${(l.price * l.qty).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-8 py-8 border-t rule-hair">
          <div className="flex items-center justify-between mb-2">
            <span className="meta">Subtotal</span>
            <span className="serif" style={{ fontSize: 22 }}>
              ${subtotal.toFixed(0)}
            </span>
          </div>
          <p className="meta mb-6">Shipping and pickup are finalized at the house shop.</p>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="btn btn-solid w-full"
            aria-disabled={lines.length === 0}
            style={{ pointerEvents: lines.length === 0 ? "none" : "auto", opacity: lines.length === 0 ? 0.4 : 1 }}
          >
            Review selection
          </Link>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
