"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import { NavPanel } from "./nav-panel";
import { CartTrigger } from "./cart";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 btn btn-solid">
        Skip to content
      </a>
      <header
        className="sticky top-0 z-40"
        style={{
          background: scrolled
            ? "color-mix(in oklab, var(--chalk) 92%, transparent)"
            : "var(--chalk)",
          backdropFilter: scrolled ? "saturate(140%) blur(8px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(140%) blur(8px)" : "none",
          borderBottom: scrolled
            ? "1px solid color-mix(in oklab, var(--graphite) 10%, transparent)"
            : "1px solid transparent",
          transition: "background 500ms var(--ease-out-quiet), border-color 500ms var(--ease-out-quiet)",
        }}
      >
        <div className="container-page">
          <div
            className="flex items-center justify-between"
            style={{ height: scrolled ? 64 : 84, transition: "height 500ms var(--ease-out-quiet)" }}
          >
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              aria-expanded={open}
              className="nav-link focus-ring"
            >
              <span className="inline-flex items-center gap-3">
                <span aria-hidden className="inline-block" style={{ width: 22, borderTop: "1px solid currentColor" }} />
                Menu
              </span>
            </button>

            <Link href="/" className="focus-ring" aria-label={`${site.name} home`}>
              <span className="serif" style={{ fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase" }}>
                Invinity
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
                {nav.primary.slice(0, 4).map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <CartTrigger />
            </div>
          </div>
        </div>
      </header>
      <NavPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
