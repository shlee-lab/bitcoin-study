"use client";

import type { ReactNode } from "react";

export function Reflection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6 pt-2">
      <header className="space-y-2.5 pb-3 border-b border-accent2/30">
        <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-accent2/90">
          <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
          생각해보기
        </div>
        <h3 className="text-[22px] font-medium text-text leading-[1.3] tracking-tight max-w-prose">
          {title}
        </h3>
      </header>
      <div className="text-[15px] text-text/80 leading-[1.75] space-y-4 max-w-prose">
        {children}
      </div>
    </section>
  );
}

// Reflection 내부에서 sub-section 을 이룰 때 쓰는 표준 컴포넌트.
// border-l 같은 nested chrome 없이 hairline rule + h4 로 처리.
export function ReflectionPart({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pt-5 mt-1 border-t border-edge/60 space-y-3">
      <h4 className="text-[17px] font-medium text-text leading-snug max-w-prose">
        {title}
      </h4>
      <div className="text-[15px] text-text/80 leading-[1.75] space-y-3 max-w-prose">
        {children}
      </div>
    </section>
  );
}

// 본 단락 다음에 던지는 follow-up 질문 한 줄. ‘Reflection · 생각해보기’ 안에서
// 다시 ‘생각해볼 거리:’ 라고 라벨 붙이는 nested 느낌을 피하려고 별도 컴포넌트로.
export function Probe({ children }: { children: ReactNode }) {
  return (
    <div className="pt-3 space-y-2 max-w-prose">
      <div className="text-[15px] font-medium text-accent2 leading-snug">
        한 걸음 더
      </div>
      <div className="text-[14px] text-text/75 leading-[1.75]">{children}</div>
    </div>
  );
}

// 외부 자료, 검색 키워드, 비교 사례처럼 본문 밖으로 더 이어지는 포인터.
export function Reading({
  label = "더 찾아볼 것",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-3 space-y-2 max-w-prose">
      <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#cdb7ff] leading-snug">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b58cff]" />
        {label}
      </div>
      <div className="text-[14px] text-text/65 leading-[1.75]">{children}</div>
    </div>
  );
}

export function ResourceLabel({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "warn" | "muted";
}) {
  const color =
    tone === "warn"
      ? "text-[#f76b6b]"
      : tone === "muted"
        ? "text-muted"
        : "text-accent";
  return (
    <div className={`text-[13px] font-semibold leading-snug ${color} shrink-0 pt-0.5`}>
      {children}
    </div>
  );
}

// border-l-2 ‘side-rail callout’ 의 캐노니컬 컴포넌트.
// Stepper 본문 안에서 한 단락을 강조할 때 (정의, 경고, 보조 설명 등).
// Reflection 안에서 쓰지 말 것 (Reflection 안은 ReflectionPart / Probe / Reading 사용).
type CalloutTone = "info" | "accent" | "warn" | "neutral";

const CALLOUT_BORDER: Record<CalloutTone, string> = {
  info: "border-accent2/50",
  accent: "border-accent/55",
  warn: "border-[#f76b6b]/55",
  neutral: "border-edge",
};

export function Callout({
  title,
  tone = "info",
  children,
}: {
  title?: string;
  tone?: CalloutTone;
  children: ReactNode;
}) {
  return (
    <div className={`border-l-2 ${CALLOUT_BORDER[tone]} pl-5 py-1 space-y-2`}>
      {title && (
        <h4 className="text-[17px] font-medium text-text leading-snug">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
