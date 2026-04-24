"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart";
import { FulfillmentSelector, PickupConfirmation, ShippingNote, useFulfillment } from "@/components/fulfillment";
import { startCheckout } from "@/app/actions/checkout";

export default function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  const fulfillment = useFulfillment();
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const checkout = () => {
    setErr(null);
    startTransition(async () => {
      const r = await startCheckout(lines.map((l) => ({ sku: l.slug, qty: l.qty })));
      if (r.ok) {
        if (r.mode === "live") window.location.href = r.url;
        else setErr("Commerce is in stub mode. Set NEXT_PUBLIC_SQUARESPACE_STORE_URL to open the shop.");
      } else {
        setErr(r.error);
      }
    });
  };

  if (lines.length === 0) {
    return (
      <section className="container-page" style={{ paddingBlock: "var(--space-192)" }}>
        <div className="max-w-[560px] reveal">
          <p className="eyebrow mb-4">Your selection</p>
          <h1 className="serif display-l">A quiet cellar.</h1>
          <p className="body-l mt-6">Nothing has been set aside yet.</p>
          <p className="mt-10">
            <Link href="/wines" className="btn btn-solid">See the wines</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
      <p className="eyebrow mb-4">Your selection</p>
      <h1 className="serif h1 mb-12">Review &amp; checkout.</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-7">
          <ul>
            {lines.map((l) => (
              <li key={l.slug} className="py-8 border-b rule-hair grid grid-cols-[80px_1fr_auto] gap-6 items-start">
                <div className="relative w-20 h-24 surface-paper overflow-hidden">
                  <span className="bottle-silhouette" style={{ width: "38%" }} />
                </div>
                <div>
                  <p className="serif" style={{ fontSize: 22 }}>{l.name}{l.cuveeLabel ? ` — ${l.cuveeLabel}` : ""}</p>
                  <p className="meta mt-1">Vintage {l.vintage}</p>
                  <div className="mt-4 inline-flex items-center gap-3">
                    <button aria-label="Decrease" className="w-8 h-8 border rule-hair focus-ring" onClick={() => setQty(l.slug, l.qty - 1)}>−</button>
                    <span className="meta">{l.qty}</span>
                    <button aria-label="Increase" className="w-8 h-8 border rule-hair focus-ring" onClick={() => setQty(l.slug, l.qty + 1)}>+</button>
                    <button onClick={() => remove(l.slug)} className="nav-link ml-3">Remove</button>
                  </div>
                </div>
                <p className="serif" style={{ fontSize: 22 }}>${(l.price * l.qty).toFixed(0)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="md:col-span-4 md:col-start-9 surface-paper p-10 self-start">
          <p className="eyebrow mb-4">How to receive it</p>
          <FulfillmentSelector value={fulfillment.value} onChange={fulfillment.setValue} />
          {fulfillment.value === "pickup" ? <PickupConfirmation /> : <ShippingNote />}

          <hr className="divider-hair my-8" />
          <div className="flex items-center justify-between">
            <span className="eyebrow">Subtotal</span>
            <span className="serif" style={{ fontSize: 28 }}>${subtotal.toFixed(0)}</span>
          </div>
          <p className="meta mt-2">Checkout, payment, and tax are handled by the house shop.</p>
          <button onClick={checkout} disabled={pending} className="btn btn-solid w-full mt-8">
            {pending ? "Opening the shop…" : "Continue to the house shop"}
          </button>
          {err && <p className="meta mt-3" role="alert" style={{ color: "var(--oxide)" }}>{err}</p>}
          <p className="mt-4">
            <Link href="/wines" className="link-quiet">Continue browsing the cellar</Link>
          </p>
        </aside>
      </div>
    </section>
  );
}
