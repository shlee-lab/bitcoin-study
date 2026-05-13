"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type StepLevel = "basic" | "deep" | "case" | "think" | "guide";

export type Step = {
  title: string;
  subtitle?: string;
  level?: StepLevel;
  body: React.ReactNode;
};

export function Stepper({ steps }: { steps: Step[] }) {
  const [revealed, setRevealed] = useState(() => readStepParam(steps.length));
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const hasMore = revealed < steps.length;
  const next = hasMore ? steps[revealed] : null;

  function advance() {
    const target = revealed;
    setRevealed((r) => {
      const nextRevealed = Math.min(r + 1, steps.length);
      writeStepParam(nextRevealed);
      return nextRevealed;
    });
    requestAnimationFrame(() => {
      const el = refs.current[target];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  useEffect(() => {
    setRevealed(readStepParam(steps.length));
  }, [steps.length]);

  useEffect(() => {
    function onPopState() {
      setRevealed(readStepParam(steps.length));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [steps.length]);

  return (
    <div className="space-y-12">
      {steps.slice(0, revealed).map((s, i) => (
        <motion.div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          initial={i === 0 ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="space-y-4"
        >
          <StepHeader step={s} index={i} total={steps.length} />
          {s.body}
        </motion.div>
      ))}
      {next && (
        <motion.button
          key={`next-${revealed}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.25 }}
          onClick={advance}
          className="group w-full max-w-2xl text-left flex flex-col sm:flex-row sm:items-baseline gap-2.5 sm:gap-5 py-4 pr-2 border-t border-edge hover:border-accent2/60 transition-colors"
        >
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase shrink-0 sm:w-16 pt-0.5">
            {String(revealed + 1).padStart(2, "0")}
            <span className="text-muted/50"> / {String(steps.length).padStart(2, "0")}</span>
          </span>
          <span className="flex-1 min-w-0 space-y-0.5">
            <span className="flex items-center gap-2 flex-wrap">
              <LevelBadge level={levelOf(next)} />
              <span className="text-[16px] font-semibold text-text/90 group-hover:text-text transition-colors leading-snug">
                {displayTitle(next)}
              </span>
            </span>
            {displaySubtitle(next) && (
              <span className="block text-[13px] text-text/55 leading-relaxed">
                {displaySubtitle(next)}
              </span>
            )}
          </span>
          <span className="text-muted/60 group-hover:text-accent2 transition-colors text-base leading-none shrink-0 pt-1">
            →
          </span>
        </motion.button>
      )}
    </div>
  );
}

function StepHeader({
  step,
  index,
  total,
}: {
  step: Step;
  index: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted">
        {String(index + 1).padStart(2, "0")}
        <span className="text-muted/45"> / {String(total).padStart(2, "0")}</span>
      </span>
      <LevelBadge level={levelOf(step)} />
      <span className="text-[16px] font-semibold text-text/86 leading-snug">
        {displayTitle(step)}
      </span>
    </div>
  );
}

function LevelBadge({ level }: { level: StepLevel }) {
  const meta: Record<StepLevel, { label: string; dot: string; text: string }> = {
    basic: {
      label: "기초",
      dot: "bg-[#5b8def]",
      text: "text-[#8fb1ff]",
    },
    deep: {
      label: "심화",
      dot: "bg-[#f7931a]",
      text: "text-[#ffb657]",
    },
    case: {
      label: "사례",
      dot: "bg-[#b58cff]",
      text: "text-[#cdb7ff]",
    },
    think: {
      label: "질문",
      dot: "bg-[#f16d7a]",
      text: "text-[#ff9aa3]",
    },
    guide: {
      label: "안내",
      dot: "bg-[#48b37f]",
      text: "text-[#78d7a8]",
    },
  };
  const m = meta[level];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold leading-none ${m.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function displayTitle(step: Step) {
  if (step.title === "생각해보기" && step.subtitle) return step.subtitle;
  return step.title;
}

function displaySubtitle(step: Step) {
  if (step.title === "생각해보기") return undefined;
  return step.subtitle;
}

function levelOf(step: Step): StepLevel {
  return step.level ?? inferLevel(step.title, step.subtitle);
}

function inferLevel(title: string, subtitle?: string): StepLevel {
  const text = `${title} ${subtitle ?? ""}`;
  if (/^다음$|다음으로|이어지는/.test(title)) return "guide";
  if (/생각해보기/.test(text)) return "think";
  if (
    /사례|역사|Genesis|DAO|ATM|Tornado|외부 압력|프라이버시 코인|다른 생태계|block space|Part 3|가장 유명한|Bitcoin Core 거버넌스|관련 연구|관련 논문|논문|DEF CON|Black Hat|Cracking Cryptocurrency|Samourai|OFAC|Travel Rule|Stripe|USDC/.test(
      text,
    )
  ) {
    return "case";
  }
  if (
    /자세히|정확한|전력|Energy|Coin selection|Dust|Tainting|Mixing|ZKP|Soft fork|Hard fork|P2P 메시지|target|해시 선택|Selfish|Block withholding|Feather|사회적 합의|Taproot|Silent Payments|HTLC|Rollup|구현의 차이|단일 구현|Multi-sig|Custodial|smart contract|EVM|LevelDB/.test(
      text,
    )
  ) {
    return "deep";
  }
  return "basic";
}

function readStepParam(max: number) {
  if (typeof window === "undefined") return 1;
  const raw = new URLSearchParams(window.location.search).get("step");
  const parsed = raw ? Number.parseInt(raw, 10) : 1;
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(parsed, 1), max);
}

function writeStepParam(step: number) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (step <= 1) {
    url.searchParams.delete("step");
  } else {
    url.searchParams.set("step", String(step));
  }
  window.history.replaceState(null, "", url.toString());
}
