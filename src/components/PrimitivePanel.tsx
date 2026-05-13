"use client";

import { PRIMITIVES, type PrimitiveId } from "@/lib/primitives";

export function PrimitivePanel({ ids }: { ids: PrimitiveId[] }) {
  if (ids.length === 0) return null;
  return (
    <div className="space-y-7">
      {ids.map((id) => {
        const p = PRIMITIVES[id];
        return (
          <article
            key={id}
            className="rounded-sm border border-edge bg-surface/20 overflow-hidden"
          >
            <header className="px-5 py-3 border-b border-edge bg-bg/40">
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-base font-medium">{p.title}</div>
                <div className="text-[13px] text-muted">
                  핵심 개념
                </div>
              </div>
              <div className="text-sm text-muted mt-0.5 leading-relaxed">
                {p.oneLiner}
              </div>
            </header>
            <div className="px-5 py-5">
              <p.Body />
            </div>
          </article>
        );
      })}
    </div>
  );
}
