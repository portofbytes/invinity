"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { notices } from "@/data/notices";

const KEY = "invinity.cookies.v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);
  if (!show) return null;
  const accept = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  };
  return (
    <div
      role="region"
      aria-label="Cookies"
      className="fixed z-[70] left-4 right-4 md:left-auto md:right-6 bottom-6 md:max-w-md surface-chalk"
      style={{ border: "1px solid color-mix(in oklab, var(--graphite) 18%, transparent)", boxShadow: "0 24px 48px rgba(20,25,22,0.18)" }}
    >
      <div className="p-6">
        <p className="eyebrow mb-2">{notices.cookie.eyebrow}</p>
        <p className="body">
          {notices.cookie.body}{" "}
          <Link href="/privacy" className="link-quiet">{notices.cookie.privacyLinkLabel}</Link>
        </p>
        <div className="mt-5 flex items-center gap-4">
          <button onClick={accept} className="btn btn-solid">{notices.cookie.cta}</button>
        </div>
      </div>
    </div>
  );
}
