"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="container-page" style={{ paddingBlock: "var(--space-192)" }}>
      <div className="max-w-[560px] reveal is-in">
        <p className="eyebrow mb-4">Out of stride</p>
        <h1 className="serif display-l">Something went quiet.</h1>
        <p className="body-l mt-6 max-w-[52ch]">
          This page could not be loaded just now. The error has been recorded.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <button className="btn btn-solid" onClick={reset}>Try again</button>
          <Link href="/" className="link-quiet">Return to the house →</Link>
        </div>
      </div>
    </section>
  );
}
