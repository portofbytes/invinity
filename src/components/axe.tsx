"use client";

// Dev-only accessibility scanner. axe-core runs in the browser and logs WCAG
// violations to the console as the user navigates. Zero cost in production.

import { useEffect } from "react";

export function Axe() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;
    // Dynamic import so the axe bundle is never served in production.
    (async () => {
      try {
        const axe = (await import("@axe-core/react")).default;
        const React = await import("react");
        const ReactDOM = await import("react-dom");
        // Delay so initial paint is not slowed by the first audit.
        axe(React, ReactDOM, 1000, {
          rules: [
            // Allow decorative grain/image plates to lack alt text.
            { id: "region", enabled: true },
          ],
        });
      } catch {
        // Silent — development aid only.
      }
    })();
  }, []);
  return null;
}
