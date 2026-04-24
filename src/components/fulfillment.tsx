"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { shipping } from "@/data/shipping";

export type Fulfillment = "pickup" | "ship";

export function FulfillmentSelector({
  value,
  onChange,
}: {
  value: Fulfillment;
  onChange: (v: Fulfillment) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Fulfillment" className="grid grid-cols-2 gap-3">
      <Option id="pickup" current={value} onChange={onChange} title="Pickup" note={`Estate · ${site.address.city}, ${regionAbbr(site.address.region)}`} />
      <Option id="ship" current={value} onChange={onChange} title="Ship" note={shippingRegions()} />
    </div>
  );
}

function Option({
  id,
  current,
  onChange,
  title,
  note,
}: {
  id: Fulfillment;
  current: Fulfillment;
  onChange: (v: Fulfillment) => void;
  title: string;
  note: string;
}) {
  const active = current === id;
  return (
    <label
      className="focus-ring block cursor-pointer p-5"
      style={{
        border: "1px solid color-mix(in oklab, var(--graphite) 14%, transparent)",
        background: active ? "var(--chalk)" : "transparent",
        outline: active ? "1px solid var(--graphite)" : "1px solid transparent",
        outlineOffset: 2,
        transition: "outline 200ms var(--ease-out-quiet), background 200ms var(--ease-out-quiet)",
      }}
    >
      <input
        type="radio"
        name="fulfillment"
        value={id}
        checked={active}
        onChange={() => onChange(id)}
        className="sr-only"
      />
      <p className="serif" style={{ fontSize: 20, lineHeight: 1.2 }}>{title}</p>
      <p className="meta mt-1">{note}</p>
    </label>
  );
}

export function PickupConfirmation() {
  return (
    <div className="surface-chalk p-6 mt-4" style={{ border: "1px solid color-mix(in oklab, var(--graphite) 14%, transparent)" }}>
      <p className="eyebrow mb-3">Pickup at the house</p>
      <p className="body">
        {shipping.pickupNote.replace("No phone tag.", "")}at{" "}
        <span className="serif" style={{ fontSize: 18 }}>{site.address.line1}, {site.address.city}</span>. No phone tag.
      </p>
      <details className="mt-4">
        <summary className="nav-link focus-ring">Add a note for pickup (optional)</summary>
        <div className="mt-4">
          <label htmlFor="pickup-note">Notes</label>
          <textarea id="pickup-note" rows={2} placeholder="A preferred window, a gift, a quiet arrival." />
        </div>
      </details>
    </div>
  );
}

export function ShippingNote() {
  return (
    <div className="surface-chalk p-6 mt-4" style={{ border: "1px solid color-mix(in oklab, var(--graphite) 14%, transparent)" }}>
      <p className="eyebrow mb-3">Shipping</p>
      <ul className="flex flex-col gap-2 body">
        {shipping.rules.map((r) => (
          <li key={r.region} className="flex gap-3">
            <span aria-hidden style={{ color: "var(--champagne)" }}>—</span>
            <span>{r.region}: {r.fee.toLowerCase()} on {r.threshold}.</span>
          </li>
        ))}
      </ul>
      <p className="meta mt-4">{shipping.adultSignature}</p>
    </div>
  );
}

export function useFulfillment() {
  const [value, setValue] = useState<Fulfillment>("ship");
  return { value, setValue };
}

function regionAbbr(region: string): string {
  return region === "British Columbia" ? "BC" : region === "Alberta" ? "AB" : region;
}

function shippingRegions(): string {
  const regions = shipping.rules.map((r) => regionAbbr(r.region)).filter((r, i, arr) => arr.indexOf(r) === i);
  return `${regions.join(" & ")} · courier`;
}
