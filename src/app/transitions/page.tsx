"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";

const VARIANTS = [
  {
    id: "shared",
    title: "Shared-element zoom",
    desc: "클릭한 객체가 자라서 다음 레이어 컨테이너가 됨 · 공간 연속성",
  },
  {
    id: "scale",
    title: "Simple scale",
    desc: "전체 화면이 줌인 · 클릭 위치 정보는 사라짐",
  },
  {
    id: "slide",
    title: "Slide",
    desc: "다음 레이어가 옆에서 들어옴 · 페이지 이동 느낌",
  },
  {
    id: "fade",
    title: "Fade",
    desc: "크로스페이드 · 공간감 거의 없음",
  },
] as const;

type Kind = (typeof VARIANTS)[number]["id"];

const OBJECTS = [
  { id: "node", label: "Node", hint: "네트워크의 한 점" },
  { id: "block", label: "Block", hint: "체인의 한 칸" },
  { id: "tx", label: "Tx", hint: "한 건의 트랜잭션" },
];

export default function TransitionsPage() {
  const [variantIdx, setVariantIdx] = useState(0);
  const variant = VARIANTS[variantIdx];

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-edge px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-muted hover:text-text transition-colors"
        >
          ← 홈
        </Link>
        <div className="text-xs text-muted text-center">
          전이 메타포 비교 · 같은 시나리오를 4가지 방식으로 체험
        </div>
        <div className="w-12" />
      </header>

      <nav className="flex border-b border-edge">
        {VARIANTS.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setVariantIdx(i)}
            className={`flex-1 py-3 px-4 text-left transition-colors border-b-2 ${
              i === variantIdx
                ? "text-text border-accent bg-surface/40"
                : "text-muted border-transparent hover:text-text"
            }`}
          >
            <div className="text-sm font-medium">{v.title}</div>
            <div className="text-[11px] text-muted mt-0.5 leading-tight">
              {v.desc}
            </div>
          </button>
        ))}
      </nav>

      <div className="flex-1 relative overflow-hidden bg-bg min-h-[560px]">
        <DemoStage key={variant.id} kind={variant.id} />
      </div>

      <footer className="border-t border-edge px-6 py-3 text-center text-xs text-muted">
        객체 클릭 → 다음 레이어 진입. ESC 또는 ← back 으로 돌아오기.
      </footer>
    </main>
  );
}

function DemoStage({ kind }: { kind: Kind }) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const props: StageProps = {
    selected,
    onSelect: setSelected,
    onBack: () => setSelected(null),
  };

  if (kind === "shared") return <SharedElementStage {...props} />;
  if (kind === "scale") return <ScaleStage {...props} />;
  if (kind === "slide") return <SlideStage {...props} />;
  return <FadeStage {...props} />;
}

type StageProps = {
  selected: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
};

function PlainLayerA({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="w-full max-w-3xl">
        <div className="text-xs text-muted uppercase tracking-wider mb-6 text-center">
          Layer A · 객체 선택
        </div>
        <div className="grid grid-cols-3 gap-6">
          {OBJECTS.map((o) => (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              className="aspect-square rounded-xl bg-surface border border-edge p-6 flex flex-col items-start justify-between hover:border-accent transition-colors text-left"
            >
              <span className="text-2xl font-medium">{o.label}</span>
              <span className="text-xs text-muted">{o.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlainLayerB({ id, onBack }: { id: string; onBack: () => void }) {
  const obj = OBJECTS.find((o) => o.id === id)!;
  return (
    <div className="absolute inset-6 rounded-xl bg-surface border border-edge p-8 flex flex-col">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-muted hover:text-text transition-colors"
        >
          ← back
        </button>
        <div className="text-xs text-muted uppercase tracking-wider">
          Layer B · {obj.label} 내부
        </div>
        <div className="w-10" />
      </div>
      <div className="text-3xl font-medium mt-6">{obj.label}</div>
      <div className="mt-6 grid grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded bg-bg border border-edge"
          />
        ))}
      </div>
      <div className="mt-auto text-xs text-muted pt-6">
        ({obj.label} 안에 들어 있는 더 작은 단위들 · placeholder)
      </div>
    </div>
  );
}

// 1. Shared-element zoom
function SharedElementStage({ selected, onSelect, onBack }: StageProps) {
  return (
    <LayoutGroup id="shared-stage">
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="w-full max-w-3xl">
          <div className="text-xs text-muted uppercase tracking-wider mb-6 text-center">
            Layer A · 객체 선택
          </div>
          <div className="grid grid-cols-3 gap-6">
            {OBJECTS.map((o) => (
              <motion.button
                key={o.id}
                layoutId={`shared-${o.id}`}
                onClick={() => onSelect(o.id)}
                animate={{
                  opacity: selected && selected !== o.id ? 0.12 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="aspect-square rounded-xl bg-surface border border-edge p-6 flex flex-col items-start justify-between hover:border-accent text-left"
              >
                <span className="text-2xl font-medium">{o.label}</span>
                <span className="text-xs text-muted">{o.hint}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected}
            layoutId={`shared-${selected}`}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute inset-6 rounded-xl bg-surface border border-edge p-8 flex flex-col z-10"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="text-sm text-muted hover:text-text transition-colors"
              >
                ← back
              </button>
              <div className="text-xs text-muted uppercase tracking-wider">
                Layer B · {OBJECTS.find((o) => o.id === selected)?.label} 내부
              </div>
              <div className="w-10" />
            </div>
            <div className="text-3xl font-medium mt-6">
              {OBJECTS.find((o) => o.id === selected)?.label}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.25 }}
              className="mt-6 grid grid-cols-6 gap-3"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded bg-bg border border-edge"
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.2 }}
              className="mt-auto text-xs text-muted pt-6"
            >
              ({OBJECTS.find((o) => o.id === selected)?.label} 안에 들어 있는 더 작은 단위들 · placeholder)
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

// 2. Simple scale
function ScaleStage({ selected, onSelect, onBack }: StageProps) {
  return (
    <AnimatePresence mode="wait">
      {!selected ? (
        <motion.div
          key="A"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <PlainLayerA onSelect={onSelect} />
        </motion.div>
      ) : (
        <motion.div
          key="B"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <PlainLayerB id={selected} onBack={onBack} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 3. Slide
function SlideStage({ selected, onSelect, onBack }: StageProps) {
  return (
    <AnimatePresence mode="wait">
      {!selected ? (
        <motion.div
          key="A"
          initial={{ x: "-25%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-25%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <PlainLayerA onSelect={onSelect} />
        </motion.div>
      ) : (
        <motion.div
          key="B"
          initial={{ x: "25%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "25%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <PlainLayerB id={selected} onBack={onBack} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 4. Fade
function FadeStage({ selected, onSelect, onBack }: StageProps) {
  return (
    <AnimatePresence mode="wait">
      {!selected ? (
        <motion.div
          key="A"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <PlainLayerA onSelect={onSelect} />
        </motion.div>
      ) : (
        <motion.div
          key="B"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <PlainLayerB id={selected} onBack={onBack} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
