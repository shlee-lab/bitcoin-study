"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GLOSSARY } from "@/lib/glossary";

// 부모 overflow:hidden 컨테이너에 잘리지 않도록 popup 을 document.body 에 portal 로 렌더.
// 위치는 anchor 의 viewport 좌표를 기준으로 fixed 로 계산.

const POPUP_WIDTH = 352; // 22rem
const POPUP_GAP = 8;

type PopupPos = { left: number; top: number; placement: "below" | "above" };

export function Term({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<PopupPos | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const entry = GLOSSARY[id];

  useEffect(() => {
    setMounted(true);
  }, []);

  // 열릴 때 + viewport 변화 시 위치 재계산
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    function place() {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const safeW = Math.min(POPUP_WIDTH, vw - 32); // viewport 폭 안의 실효 popup 폭
      // 가로 · 기본은 anchor.left 에서 시작. 우측 공간 부족하면 anchor.right 에 우측 정렬, 그래도 모자라면 viewport 우측 padding 으로 클램프
      let left: number;
      if (r.left + safeW <= vw - 16) {
        left = r.left;
      } else {
        left = r.right - safeW;
      }
      if (left < 16) left = 16;
      if (left + safeW > vw - 16) left = vw - 16 - safeW;
      // 세로 · 기본 anchor 아래, 공간 부족하고 위 공간 있으면 위로
      const spaceBelow = vh - r.bottom;
      const placement: "below" | "above" =
        spaceBelow < 220 && r.top > 220 ? "above" : "below";
      const top =
        placement === "below" ? r.bottom + POPUP_GAP : r.top - POPUP_GAP;
      setPos({ left, top, placement });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t)) return;
      if (popupRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!entry) return <>{children}</>;

  return (
    <>
      <span
        ref={anchorRef}
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className={`cursor-help border-b border-dotted transition-colors ${
          open
            ? "border-accent2 text-accent2"
            : "border-muted/50 hover:border-accent2/80 hover:text-text"
        }`}
      >
        {children}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={popupRef}
                initial={{ opacity: 0, y: pos.placement === "below" ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: pos.placement === "below" ? 4 : -4 }}
                transition={{ duration: 0.14 }}
                style={{
                  position: "fixed",
                  left: pos.left,
                  top: pos.placement === "below" ? pos.top : undefined,
                  bottom:
                    pos.placement === "above"
                      ? window.innerHeight - pos.top
                      : undefined,
                  width: POPUP_WIDTH,
                  maxWidth: "calc(100vw - 2rem)",
                  zIndex: 100,
                }}
                className="bg-surface ring-1 ring-edge p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="text-[13px] text-accent2/90 font-semibold mb-2">
                  {entry.term}
                </div>
                <div className="text-[14px] text-text/85 leading-[1.65]">
                  {entry.def}
                </div>
                {entry.bip && (
                  <div className="mt-3 pt-3 border-t border-edge/70">
                    {entry.bip.title && (
                      <div className="text-[13px] text-text/80 leading-relaxed italic">
                        “{entry.bip.title}”
                      </div>
                    )}
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 mt-2 text-[12px]">
                      {entry.bip.proposed && (
                        <>
                          <span className="text-muted font-mono">proposed</span>
                          <span className="text-text/75 font-mono">
                            {entry.bip.proposed}
                          </span>
                        </>
                      )}
                      {entry.bip.activated && (
                        <>
                          <span className="text-muted font-mono">activated</span>
                          <span className="text-accent font-mono">
                            {entry.bip.activated}
                          </span>
                        </>
                      )}
                      {entry.bip.status && (
                        <>
                          <span className="text-muted font-mono">status</span>
                          <span className="text-text/75 font-mono">
                            {entry.bip.status}
                          </span>
                        </>
                      )}
                    </div>
                    {entry.bip.url && (
                      <a
                        href={entry.bip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-3 text-[12px] text-accent hover:text-accent/80 font-mono break-all"
                      >
                        bip-{String(entry.bip.number).padStart(3, "0")}
                        <span className="text-accent/70">↗</span>
                      </a>
                    )}
                  </div>
                )}
                {entry.link && !entry.bip && (
                  <a
                    href={entry.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-3 text-[12px] text-accent hover:text-accent/80 font-mono break-all"
                  >
                    {entry.link.label}
                    <span className="text-accent/70">↗</span>
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
