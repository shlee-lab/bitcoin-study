"use client";

import { useEffect, useRef, useState } from "react";
import { LAYERS, type LayerId } from "@/lib/layers";

const KEEP_TAIL = 2; // 마지막 N 개는 항상 보임
const KEEP_HEAD = 1; // 처음 1 개 (root) 도 항상 보임
const COLLAPSE_ABOVE = 4; // 경로 길이가 이보다 길면 중간 접음

export function Breadcrumb({
  path,
  onJump,
}: {
  path: LayerId[];
  onJump: (id: LayerId) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 새 경로로 이동하면 다시 접힘
  useEffect(() => {
    setExpanded(false);
  }, [path.length]);

  // 외부 클릭 시 expanded 상태 닫기
  useEffect(() => {
    if (!expanded) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [expanded]);

  const shouldCollapse = path.length > COLLAPSE_ABOVE && !expanded;
  const visible: (LayerId | "ellipsis")[] = shouldCollapse
    ? [
        ...path.slice(0, KEEP_HEAD),
        "ellipsis",
        ...path.slice(path.length - KEEP_TAIL),
      ]
    : path;
  const hiddenCount = path.length - KEEP_HEAD - KEEP_TAIL;

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <nav className="flex items-center gap-1.5 text-sm whitespace-nowrap overflow-hidden">
        {visible.map((item, i) => {
          if (item === "ellipsis") {
            return (
              <div key="ellipsis" className="flex items-center gap-1.5 shrink-0">
                <span className="text-edge select-none">/</span>
                <button
                  onClick={() => setExpanded(true)}
                  className="text-muted hover:text-text transition-colors px-1 rounded hover:bg-edge/40"
                  title={`${hiddenCount} 개 숨김 · 펼치기`}
                >
                  ⋯
                </button>
              </div>
            );
          }
          const isLast = i === visible.length - 1;
          const layer = LAYERS[item];
          // 가운데 항목은 짧은 형태 (subtitle 만), 처음/끝은 풀 라벨
          const isEdge = i === 0 || isLast;
          return (
            <div key={item} className="flex items-center gap-1.5 shrink-0">
              {i > 0 && <span className="text-edge select-none">/</span>}
              {isLast ? (
                <span className="text-text font-medium">
                  <span className="text-muted mr-1.5">{layer.subtitle}</span>
                  {layer.title}
                </span>
              ) : isEdge ? (
                <button
                  onClick={() => onJump(item)}
                  className="text-muted hover:text-text transition-colors"
                >
                  <span className="mr-1.5">{layer.subtitle}</span>
                  {layer.title}
                </button>
              ) : (
                <button
                  onClick={() => onJump(item)}
                  className="text-muted hover:text-text transition-colors"
                  title={`${layer.subtitle} ${layer.title}`}
                >
                  {layer.subtitle}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
