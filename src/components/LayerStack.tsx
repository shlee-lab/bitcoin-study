"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LAYERS, LAYER_ORDER, pathTo, gateKey, type LayerId } from "@/lib/layers";

export type LayerProps = {
  onEnter: (childId: LayerId, sourceKey?: string) => void;
};

type StackEntry = { layerId: LayerId; sourceKey?: string };

type NavContextValue = {
  currentId: LayerId;
  currentIdx: number;
  total: number;
  prevId: LayerId | null;
  nextId: LayerId | null;
  goTo: (id: LayerId) => void;
};

const NavContext = createContext<NavContextValue | null>(null);

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside LayerStack");
  return ctx;
}

function LayerLoading() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 text-[14px] text-muted">
      섹션을 불러오는 중...
    </div>
  );
}

const REGISTRY: Record<LayerId, React.ComponentType<LayerProps>> = {
  S0: dynamic(() => import("./layers/L0Scene").then((m) => m.L0Scene), { loading: LayerLoading }),
  S1: dynamic(() => import("./layers/L1Wallet").then((m) => m.L1Wallet), { loading: LayerLoading }),
  S2: dynamic(() => import("./layers/L1BWallet").then((m) => m.L1BWallet), { loading: LayerLoading }),
  S3: dynamic(() => import("./layers/L2Transaction").then((m) => m.L2Transaction), { loading: LayerLoading }),
  S4: dynamic(() => import("./layers/L3UTXO").then((m) => m.L3UTXO), { loading: LayerLoading }),
  S5: dynamic(() => import("./layers/L4Block").then((m) => m.L4Block), { loading: LayerLoading }),
  S6: dynamic(() => import("./layers/L5Network").then((m) => m.L5Network), { loading: LayerLoading }),
  S7: dynamic(() => import("./layers/L6Blockchain").then((m) => m.L6Blockchain), { loading: LayerLoading }),
  S8: dynamic(() => import("./layers/L7Mining").then((m) => m.L7Mining), { loading: LayerLoading }),
  S9: dynamic(() => import("./layers/L8GameTheory").then((m) => m.L8GameTheory), { loading: LayerLoading }),
  S10: dynamic(() => import("./layers/L9NodeAnatomy").then((m) => m.L9NodeAnatomy), { loading: LayerLoading }),
  S11: dynamic(() => import("./layers/L9BNodeOperation").then((m) => m.L9BNodeOperation), { loading: LayerLoading }),
  S12: dynamic(() => import("./layers/L10Scalability").then((m) => m.L10Scalability), { loading: LayerLoading }),
  S13: dynamic(() => import("./layers/L11Privacy").then((m) => m.L11Privacy), { loading: LayerLoading }),
};

function isLayerId(v: string | null): v is LayerId {
  return !!v && v in LAYERS;
}

export function LayerStack() {
  const searchParams = useSearchParams();
  const initialAt = searchParams.get("at");
  const [stack, setStack] = useState<StackEntry[]>(() => {
    if (isLayerId(initialAt)) {
      return pathTo(initialAt).map((id) => ({ layerId: id }));
    }
    return [{ layerId: "S0" }];
  });
  const current = stack[stack.length - 1];
  const Component = REGISTRY[current.layerId];

  function enter(childId: LayerId, sourceKey?: string) {
    const key = sourceKey ?? gateKey(current.layerId, childId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("step");
      window.history.replaceState(null, "", url.toString());
    }
    setStack((s) => [...s, { layerId: childId, sourceKey: key }]);
  }

  function goTo(targetId: LayerId) {
    if (targetId === current.layerId) return;
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("step");
      window.history.replaceState(null, "", url.toString());
    }
    setStack(pathTo(targetId).map((id) => ({ layerId: id })));
  }

  const currentIdx = LAYER_ORDER.indexOf(current.layerId);
  const prevId = currentIdx > 0 ? LAYER_ORDER[currentIdx - 1] : null;
  const nextId =
    currentIdx >= 0 && currentIdx < LAYER_ORDER.length - 1
      ? LAYER_ORDER[currentIdx + 1]
      : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("step");
          window.history.replaceState(null, "", url.toString());
        }
        setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 현재 섹션을 URL ?at= 에 동기화 (replace, scroll 유지, Next 라우터 트리거 안 함)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("at") !== current.layerId) {
      url.searchParams.set("at", current.layerId);
      window.history.replaceState(null, "", url.toString());
    }
  }, [current.layerId]);

  // 사용자가 브라우저 뒤로/앞으로 가면 stack 도 따라가도록
  useEffect(() => {
    function onPop() {
      const at = new URLSearchParams(window.location.search).get("at");
      if (isLayerId(at)) {
        setStack(pathTo(at).map((id) => ({ layerId: id })));
      } else {
        setStack([{ layerId: "S0" }]);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <NavContext.Provider
      value={{
        currentId: current.layerId,
        currentIdx,
        total: LAYER_ORDER.length,
        prevId,
        nextId,
        goTo,
      }}
    >
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-edge backdrop-blur-sm bg-bg/80 sticky top-0 z-20">
          <StageBar currentId={current.layerId} goTo={goTo} />
        </header>
        <div className="flex-1 relative overflow-hidden bg-bg min-h-[640px]">
          <LayoutGroup id="layer-stack">
            <AnimatePresence>
              <motion.div
                key={current.layerId}
                layoutId={current.sourceKey}
                transition={{ type: "spring", stiffness: 240, damping: 30 }}
                className="absolute inset-0 bg-bg overflow-hidden flex flex-col"
              >
                <Component onEnter={enter} />
              </motion.div>
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </div>
    </NavContext.Provider>
  );
}

function StageBar({
  currentId,
  goTo,
}: {
  currentId: LayerId;
  goTo: (id: LayerId) => void;
}) {
  const currentIdx = LAYER_ORDER.indexOf(currentId);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateFades() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  // 활성 셀 바뀌면 view 안으로 자동 스크롤 + fade 재계산
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLButtonElement>(
      `[data-stage-idx="${currentIdx}"]`,
    );
    if (btn) {
      btn.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
      });
    }
    // smooth scroll 완료 직후 fade 갱신
    const t = setTimeout(updateFades, 350);
    return () => clearTimeout(t);
  }, [currentIdx]);

  // 마운트·리사이즈 시 fade 초기 계산
  useEffect(() => {
    updateFades();
    window.addEventListener("resize", updateFades);
    return () => window.removeEventListener("resize", updateFades);
  }, []);

  // 마우스 X 위치 비례 horizontal scroll (양쪽 10% 는 dead zone)
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const t = Math.max(0, Math.min(1, (ratio - 0.1) / 0.8));
    el.scrollLeft = t * max;
  }

  return (
    <div className="flex items-stretch min-w-0">
      <Link
        href="/"
        aria-label="홈으로 돌아가기"
        title="홈으로 돌아가기"
        className="shrink-0 w-11 sm:w-12 border-r border-edge text-text/62 hover:text-text hover:bg-surface/40 transition-colors flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      </Link>
      <div className="relative flex-1 min-w-0">
      {/* 좌측 fade · 스크롤 가능할 때만 */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-bg to-bg/0 transition-opacity duration-200 ${
          canLeft ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* 우측 fade */}
      <div
        aria-hidden
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg to-bg/0 transition-opacity duration-200 ${
          canRight ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={scrollerRef}
        onMouseMove={onMouseMove}
        onScroll={updateFades}
        className="px-4 sm:px-6 flex items-stretch gap-px overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {LAYER_ORDER.map((id, i) => {
          const layer = LAYERS[id];
          const active = id === currentId;
          const visited = i < currentIdx;
          return (
            <button
              key={id}
              type="button"
              data-stage-idx={i}
              onClick={() => goTo(id)}
              title={`${layer.subtitle} · ${layer.title}`}
              className={`flex-1 min-w-[3.25rem] px-1 py-2.5 text-center font-mono text-[11px] tracking-wide transition border-b-2 whitespace-nowrap ${
                active
                  ? "text-accent border-accent"
                  : visited
                    ? "text-text/60 hover:text-text border-transparent"
                    : "text-muted/50 hover:text-text/80 border-transparent"
              }`}
            >
              {layer.subtitle}
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
