"use client";

// Global error boundary — rendered when the root layout itself throws.
// Keep this minimal: it must not rely on anything in the layout.

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Keep a breadcrumb for the server logs / error-tracking provider.
    // Replace with Sentry/PostHog in v2.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F4F0E8",
          color: "#232320",
          fontFamily: "Georgia, serif",
          padding: 32,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6A6A60" }}>
            The house apologises
          </p>
          <h1 style={{ fontSize: 48, lineHeight: 1.08, marginTop: 16 }}>Something went quiet.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#4B4B47", marginTop: 16 }}>
            An error has prevented this page from loading. We&rsquo;ve made a note.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 32,
              padding: "14px 24px",
              border: "1px solid #232320",
              background: "#232320",
              color: "#F4F0E8",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
