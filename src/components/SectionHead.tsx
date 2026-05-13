"use client";

import type { ReactNode } from "react";

export function SectionHead({
  eyebrow,
  title,
  hint,
  tone = "accent2",
}: {
  eyebrow?: string;
  title: ReactNode;
  hint?: ReactNode;
  tone?: "accent" | "accent2" | "muted";
}) {
  const eyebrowColor =
    tone === "accent"
      ? "text-accent"
      : tone === "muted"
        ? "text-muted"
        : "text-accent2/85";
  return (
    <div className="space-y-1.5 mb-3">
      {eyebrow && (
        <div
          className={`text-[13px] font-semibold ${eyebrowColor}`}
        >
          {eyebrow}
        </div>
      )}
      <div className="text-[17px] font-medium text-text leading-snug">
        {title}
      </div>
      {hint && (
        <div className="text-[13px] text-text/70 leading-relaxed max-w-prose pt-0.5">
          {hint}
        </div>
      )}
    </div>
  );
}
