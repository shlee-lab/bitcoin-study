"use client";

import { useState } from "react";
import Link from "next/link";

// 4 가지 인터랙티브 click-driven S0 intro 후보.
// 모두 같은 data · 다른 framing 과 mechanic.

const FIELDS = [
  {
    key: "from" as const,
    cta: "Alice 의 주소",
    value: "Alice",
    hint: "bc1q...x7kv8f3t4",
    why: "대표적 P2WPKH 주소에서는 ECDSA 공개키 해시를 인코딩한 문자열이 주소. 'Alice' 라는 이름이 따로 등록되지 않는다.",
    q: "누가 보내나?",
  },
  {
    key: "to" as const,
    cta: "Bob 의 주소",
    value: "Bob",
    hint: "bc1q...kv8f3t4w",
    why: "받는 사람이 미리 자기 주소를 공유. 한 사람이 보통 여러 주소를 만들어 쓴다 (프라이버시).",
    q: "누구에게?",
  },
  {
    key: "amount" as const,
    cta: "1 BTC",
    value: "1.0000 BTC",
    hint: undefined,
    why: "시스템은 Alice 의 키로 풀 수 있는 UTXO 합이 1 BTC + 수수료 이상인지 확인한다.",
    q: "얼마?",
  },
  {
    key: "sig" as const,
    cta: "Alice 의 서명",
    value: "Alice 의 서명",
    hint: "3044 02 20 5d4e8c…",
    why: "비밀키만 만들 수 있는 도장. 누구든 공개키로 진짜인지 검증 가능. 이 트랜잭션 한 건에만 유효.",
    q: "진짜 Alice 가 보내는 게 맞아?",
  },
];

type FieldKey = (typeof FIELDS)[number]["key"];

export default function IntroOptionsPage() {
  return (
    <main className="min-h-screen px-6 sm:px-10 py-12">
      <div className="max-w-3xl mx-auto space-y-14">
        <header className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.18em] font-mono text-accent">
            S0 intro 재구성 · 4 안 비교 (인터랙티브)
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight leading-tight">
            클릭으로 한 칸씩 진행
          </h1>
          <p className="text-[14px] text-text/65 leading-[1.7] max-w-2xl">
            각 옵션을 직접 눌러 보고 어느 흐름이 자연스러운지 판단. 4 칸의 의미
            는 같음 (From · To · Amount · Signature). 다른 건 framing 과 클릭
            mechanic.
          </p>
          <div className="text-[12px] text-muted pt-2 flex gap-4">
            <Link href="/" className="hover:text-accent">
              ← Home
            </Link>
            <Link href="/learn?at=S0" className="hover:text-accent">
              현재 S0
            </Link>
          </div>
        </header>

        <OptionWrap
          tag="1"
          name="조립 (assemble)"
          summary="‘송금 한 통’ 을 함께 조립. 빈 칸을 차례로 클릭, 각 칸 옆에 ‘무엇이고 왜 필요한지’ 가 펼쳐짐."
        >
          <Option1Assemble />
        </OptionWrap>

        <OptionWrap
          tag="2"
          name="질문 여정"
          summary="송금이 성립하려면 4 질문에 답이 있어야 한다. 한 질문씩 펼쳐 답을 보고 ‘왜 이 질문이 필요한가’ 를 같이."
        >
          <Option2Journey />
        </OptionWrap>

        <OptionWrap
          tag="3"
          name="편지 봉인"
          summary="비트코인 송금 = 한 통의 편지. 발신자·수신자·내용 채우고 마지막에 봉인. 봉인 클릭에 인장 찍히는 효과."
        >
          <Option3Letter />
        </OptionWrap>

        <OptionWrap
          tag="4"
          name="자유 탐색 (revealed only)"
          summary="4 칸이 처음부터 보이지만 모두 ‘?’ 상태. 호기심대로 클릭해 열기. 순서 강제 없음."
        >
          <Option4Free />
        </OptionWrap>

        <footer className="pt-10 border-t border-edge text-[12px] text-muted">
          마음에 드는 옵션 알려주면 S0 에 적용. 둘 조합도 가능 (예: 1 의 mechanic
          + 3 의 봉투 비주얼).
        </footer>
      </div>
    </main>
  );
}

function OptionWrap({
  tag,
  name,
  summary,
  children,
}: {
  tag: string;
  name: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-baseline gap-3 border-b border-edge pb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          option {tag}
        </span>
        <h2 className="text-[20px] font-medium tracking-tight">{name}</h2>
      </div>
      <p className="text-[14px] text-text/75 leading-[1.7] max-w-2xl">
        {summary}
      </p>
      <div className="border border-edge bg-bg p-6 sm:p-8">{children}</div>
    </section>
  );
}

function useStep() {
  const [filled, setFilled] = useState<Set<FieldKey>>(new Set());
  const [active, setActive] = useState<FieldKey | null>(null);
  function fill(k: FieldKey) {
    setFilled((s) => new Set(s).add(k));
    setActive(k);
  }
  function reset() {
    setFilled(new Set());
    setActive(null);
  }
  return { filled, active, fill, reset, all: filled.size === FIELDS.length };
}

/* === Option 1 · 조립 (assemble) === */
function Option1Assemble() {
  const { filled, active, fill, reset, all } = useStep();
  const nextIdx = FIELDS.findIndex((f) => !filled.has(f.key));
  const nextKey = nextIdx >= 0 ? FIELDS[nextIdx].key : null;
  const activeField = FIELDS.find((f) => f.key === active);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-[28px] font-semibold leading-tight tracking-tight">
          Alice → Bob
        </h3>
        <p className="text-[16px] text-text/70 leading-[1.65] max-w-xl">
          ‘송금 한 통’ 을 함께 조립해보자. 한 칸씩 클릭하면 그 칸이 무엇인지
          오른쪽에서 풀어준다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-edge">
          <div className="px-4 py-2 border-b border-edge flex items-baseline justify-between">
            <div className="font-mono text-[11px] tracking-[0.14em] text-muted">
              transaction
            </div>
            <div className="font-mono text-[11px] text-muted">
              {filled.size} / {FIELDS.length}
            </div>
          </div>
          {FIELDS.map((f) => {
            const isFilled = filled.has(f.key);
            const isNext = nextKey === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  if (isFilled) setActiveField(f.key);
                  else if (isNext) fill(f.key);
                }}
                disabled={!isFilled && !isNext}
                className={`w-full text-left px-4 py-3 border-b border-edge last:border-b-0 transition-colors ${
                  active === f.key ? "bg-accent/10" : ""
                } ${
                  isFilled
                    ? "hover:bg-surface/40"
                    : isNext
                      ? "hover:bg-accent/10 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="grid grid-cols-[80px_1fr] gap-3 items-baseline">
                  <div className="font-mono text-[12px] text-muted">
                    {f.key}
                  </div>
                  {isFilled ? (
                    <div>
                      <div className="text-[15px] text-text font-medium">
                        {f.value}
                      </div>
                      {f.hint && (
                        <div className="font-mono text-[11px] text-muted break-all">
                          {f.hint}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`text-[14px] ${isNext ? "text-accent" : "text-muted/60"}`}
                    >
                      {isNext ? `+ ${f.cta} 추가` : "·"}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="border border-edge p-4 min-h-[180px]">
          {activeField ? (
            <div className="space-y-2">
              <div className="font-mono text-[11px] tracking-[0.14em] text-accent">
                {activeField.key}
              </div>
              <p className="text-[14px] text-text/85 leading-[1.7]">
                {activeField.why}
              </p>
            </div>
          ) : (
            <div className="text-[13px] text-muted leading-[1.7]">
              왼쪽 칸을 클릭하면 그게 무엇이고 왜 필요한지가 여기에 나온다.
            </div>
          )}
        </div>
      </div>

      <Footer all={all} reset={reset} label="send" />
    </div>
  );

  // helper · clicking already-filled row re-activates detail
  function setActiveField(k: FieldKey) {
    fill(k);
  }
}

/* === Option 2 · 질문 여정 === */
function Option2Journey() {
  const { filled, fill, reset, all } = useStep();
  const nextIdx = FIELDS.findIndex((f) => !filled.has(f.key));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-[28px] font-semibold leading-tight tracking-tight">
          Alice → Bob
        </h3>
        <p className="text-[16px] text-text/70 leading-[1.65] max-w-xl">
          비트코인 송금이 성립하려면 네 가지 질문에 답이 모두 있어야 한다. 한
          질문씩 답을 열어 보자.
        </p>
      </div>

      <div className="space-y-3">
        {FIELDS.map((f, i) => {
          const opened = filled.has(f.key);
          const isNext = nextIdx === i;
          return (
            <div
              key={f.key}
              className={`border ${opened ? "border-edge" : isNext ? "border-accent/50" : "border-edge"}`}
            >
              <button
                type="button"
                onClick={() => isNext && fill(f.key)}
                disabled={!isNext}
                className={`w-full text-left px-5 py-4 grid grid-cols-[32px_1fr_auto] gap-4 items-baseline ${
                  isNext
                    ? "hover:bg-accent/5 cursor-pointer"
                    : opened
                      ? ""
                      : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="font-mono text-[13px] text-muted">{i + 1}</div>
                <div className="text-[16px] font-medium text-text/90">
                  {f.q}
                </div>
                <div
                  className={`text-[11px] uppercase tracking-[0.16em] font-mono ${
                    opened
                      ? "text-muted"
                      : isNext
                        ? "text-accent"
                        : "text-muted/40"
                  }`}
                >
                  {opened ? "✓" : isNext ? "click" : "·"}
                </div>
              </button>
              {opened && (
                <div className="px-5 pb-4 pl-[60px] space-y-1.5 border-t border-edge/60 pt-3 bg-surface/20">
                  <div className="text-[16px] text-accent font-medium">
                    → {f.value}
                  </div>
                  <div className="text-[13px] text-text/70 leading-[1.7]">
                    {f.why}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Footer all={all} reset={reset} label="모든 답 확인 → 송금" />
    </div>
  );
}

/* === Option 3 · 편지 봉인 === */
function Option3Letter() {
  const { filled, fill, reset, all } = useStep();
  const nextIdx = FIELDS.findIndex((f) => !filled.has(f.key));
  const nextKey = nextIdx >= 0 ? FIELDS[nextIdx].key : null;
  const sigOpened = filled.has("sig");

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-[28px] font-semibold leading-tight tracking-tight">
          Alice → Bob
        </h3>
        <p className="text-[16px] text-text/70 leading-[1.65] max-w-xl">
          비트코인 송금은 결국 한 통의 편지. 발신자·수신자·내용을 적고 마지막에
          봉인. 봉인이 찍혀야 진짜 효력을 갖는다.
        </p>
      </div>

      <div className="border-2 border-edge bg-surface/10">
        {FIELDS.map((f) => {
          const isFilled = filled.has(f.key);
          const isNext = nextKey === f.key;
          const isSeal = f.key === "sig";
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => isNext && fill(f.key)}
              disabled={!isNext && !isFilled}
              className={`w-full text-left px-5 py-4 border-b-2 border-edge last:border-b-0 transition-colors ${
                isSeal && isFilled ? "bg-accent/[0.06]" : ""
              } ${
                isNext
                  ? "hover:bg-accent/5 cursor-pointer"
                  : isFilled
                    ? ""
                    : "opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="space-y-1">
                <div
                  className={`font-mono text-[11px] tracking-[0.16em] ${
                    isSeal ? "text-accent" : "text-muted"
                  }`}
                >
                  {isSeal ? "◆ 봉인 · seal" : labelFor(f.key)}
                </div>
                {isFilled ? (
                  <div className="space-y-0.5">
                    <div
                      className={`text-[16px] font-medium ${isSeal ? "text-accent" : "text-text"}`}
                    >
                      {isSeal ? `${f.value} ◆` : f.value}
                    </div>
                    {f.hint && (
                      <div
                        className={`font-mono text-[12px] break-all ${
                          isSeal ? "text-accent/70" : "text-muted"
                        }`}
                      >
                        {f.hint}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`text-[14px] ${isNext ? "text-accent" : "text-muted/50"}`}
                  >
                    {isNext
                      ? isSeal
                        ? "+ 봉인 찍기"
                        : `+ ${f.cta} 적기`
                      : "·"}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {sigOpened && (
        <div className="text-[13px] text-text/70 leading-[1.7] border-l-2 border-accent/60 pl-4 py-1">
          봉인이 찍혔다. 이제 누구든 ‘이 편지가 진짜 Alice 가 쓴 거고 변조되지
          않았다’ 를 검증할 수 있다. 이 봉인이 비트코인의 ‘서명’ 이다. S3
          에서 깊이 본다.
        </div>
      )}

      <Footer all={all} reset={reset} label="편지 발송" />
    </div>
  );
}

function labelFor(k: FieldKey) {
  switch (k) {
    case "from":
      return "from · 발신자";
    case "to":
      return "to · 수신자";
    case "amount":
      return "payload · 편지 내용";
    case "sig":
      return "seal · 봉인";
  }
}

/* === Option 4 · 자유 탐색 === */
function Option4Free() {
  const { filled, active, fill, reset, all } = useStep();
  const activeField = FIELDS.find((f) => f.key === active);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-[28px] font-semibold leading-tight tracking-tight">
          Alice → Bob
        </h3>
        <p className="text-[16px] text-text/70 leading-[1.65] max-w-xl">
          송금 한 통은 네 부분으로 이루어진다. 아무 ‘?’ 나 눌러 호기심대로
          열어 보자. 순서는 상관없다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map((f) => {
            const isFilled = filled.has(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => fill(f.key)}
                className={`border p-4 text-left min-h-[120px] transition-colors ${
                  active === f.key ? "border-accent" : "border-edge"
                } ${isFilled ? "" : "hover:border-accent/60 cursor-pointer"}`}
              >
                <div className="space-y-2">
                  <div className="font-mono text-[11px] tracking-[0.14em] text-muted">
                    {f.key}
                  </div>
                  {isFilled ? (
                    <div className="space-y-0.5">
                      <div className="text-[15px] text-text font-medium leading-snug">
                        {f.value}
                      </div>
                      {f.hint && (
                        <div className="font-mono text-[11px] text-muted break-all">
                          {f.hint}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[32px] text-muted/40 font-mono leading-none pt-2">
                      ?
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="border border-edge p-4 min-h-[180px]">
          {activeField ? (
            <div className="space-y-2">
              <div className="font-mono text-[11px] tracking-[0.14em] text-accent">
                {activeField.q}
              </div>
              <div className="text-[15px] text-text font-medium">
                → {activeField.value}
              </div>
              <p className="text-[13px] text-text/70 leading-[1.7]">
                {activeField.why}
              </p>
            </div>
          ) : (
            <div className="text-[13px] text-muted leading-[1.7]">
              왼쪽 ‘?’ 칸을 아무거나 눌러봐. 그게 무엇인지 여기서 풀린다.
            </div>
          )}
        </div>
      </div>

      <Footer all={all} reset={reset} label="모두 열기 → 송금" />
    </div>
  );
}

function Footer({
  all,
  reset,
  label,
}: {
  all: boolean;
  reset: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        type="button"
        onClick={reset}
        className="text-[12px] font-mono text-muted hover:text-text border border-edge hover:border-accent/60 px-2 py-1 transition-colors uppercase tracking-[0.16em]"
      >
        ↻ reset
      </button>
      <button
        type="button"
        disabled={!all}
        className={`font-mono text-[13px] px-5 py-2 border transition-colors uppercase tracking-[0.16em] ${
          all
            ? "border-accent bg-accent text-bg hover:bg-accent/90"
            : "border-edge bg-bg/40 text-muted cursor-not-allowed"
        }`}
      >
        ▶ {label}
      </button>
    </div>
  );
}
