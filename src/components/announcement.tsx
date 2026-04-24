"use client";

import { useEffect, useState } from "react";

const KEY = "invinity.announcement.v1";

export function AnnouncementStrip({
  message,
  href,
  id,
  dismissible = true,
}: {
  message: string;
  href?: string;
  id: string;
  dismissible?: boolean;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    try {
      if (!dismissible) return setShown(true);
      const dismissed = localStorage.getItem(KEY) === id;
      setShown(!dismissed);
    } catch {
      setShown(true);
    }
  }, [dismissible, id]);

  if (!shown) return null;

  const dismiss = () => {
    try { localStorage.setItem(KEY, id); } catch {}
    setShown(false);
  };

  const body = (
    <span style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
      {message}
    </span>
  );

  return (
    <div
      role="region"
      aria-label="Announcement"
      style={{
        background: "var(--graphite)",
        color: "var(--chalk)",
      }}
    >
      <div className="container-page">
        <div className="flex items-center justify-between gap-6" style={{ minHeight: 40 }}>
          <div className="flex-1 text-center">
            {href ? (
              <a href={href} className="link-quiet" style={{ color: "var(--chalk)", borderColor: "color-mix(in oklab, var(--chalk) 40%, transparent)" }}>
                {body}
              </a>
            ) : (
              body
            )}
          </div>
          {dismissible && (
            <button
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="focus-ring"
              style={{ color: "color-mix(in oklab, var(--chalk) 65%, transparent)", fontSize: 16, lineHeight: 1, padding: 8 }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
