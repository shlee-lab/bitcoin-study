"use client";

import { Term } from "../Term";

export const DifficultyMeta = {
  id: "difficulty" as const,
  title: "Difficulty adjustment",
  oneLiner: "평균 블록 간격을 10 분 근처로 유지하기 위해 매 2016 블록마다 target 재조정.",
};

export function DifficultyBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        채굴자가 늘면 블록이 더 빨리 만들어지고, 줄면 늦어진다. 그런데 비트코인은
        평균 10 분 간격을 유지해야 한다. 그래서 매{" "}
        <code className="font-mono">2016 블록 (≈ 2 주)</code> 마다 모든 노드가
        같은 공식으로 ‘난이도 (target)’ 를 재조정한다.
      </p>

      <Section title="① target · 헤더 해시가 작아야 하는 그 값">
        <p>
          채굴 조건은{" "}
          <code className="font-mono text-accent">
            <Term id="double-sha256">double-SHA256</Term>(header) &lt;{" "}
            <Term id="target">target</Term>
          </code>
          . target 이 작을수록 헤더 해시가 거기까지 떨어질 확률이 작다 → 더
          어렵다. target 은 헤더의 4 byte 짜리{" "}
          <code className="font-mono">bits</code> 필드로 압축 저장된다.
        </p>
        <BitsExample />
      </Section>

      <Section title="② 재조정 공식 · 2016 블록마다">
        <FormulaBox>
          <div>
            <span className="text-muted">expected =</span> 2016 × 10 분 ={" "}
            <span className="text-text">1 209 600 초 (2 주)</span>
          </div>
          <div>
            <span className="text-muted">actual =</span> 직전 2016 블록의 실제
            걸린 시간
          </div>
          <div className="text-accent pt-1">
            new_target = old_target × actual / expected
          </div>
          <div className="text-[13px] text-muted pt-2">
            actual 은 [expected/4, expected×4] 로 잘림 (최대 4× 변동 제한).
          </div>
        </FormulaBox>
      </Section>

      <Section title="③ 작은 예시 · 직관 잡기">
        <AdjustmentExamples />
      </Section>

      <Section title="④ 다른 체인은 어떻게 조정할까?">
        <p>
          비트코인처럼 2016 블록 단위로 난이도를 조정하는 방식만 있는 것은 아니다.
          Monero 는 매 블록 최근 구간을 다시 보며 난이도를 조정해 해시레이트
          변화에 빠르게 반응하고, Ethereum 도 PoW 시절에는 거의 매 블록 난이도를
          다시 계산했다.
        </p>
        <ChainComparison />
        <p className="text-sm text-muted">
          조정 주기가 짧으면 네트워크 상황을 빨리 반영해 블록 간격이 오래 흔들리지
          않는다는 장점이 있다. 반대로 조정 규칙이 너무 민감하거나 예측 가능하면,
          블록 공개를 늦추는 전략이나 timestamp 를 이용한 전략이 난이도 변화와
          결합될 수 있다. 뒤의 게임이론 섹션에서 다룰 selfish mining 은 이런
          “채굴자가 정직하게 바로 공개하지 않을 때” 생기는 인센티브 문제를 다룬다.
        </p>
      </Section>

      <Section title="⑤ 왜 4× 제한?">
        <p>
          누군가 갑자기 hashrate 를 100× 늘렸다고 거짓말 하는 헤더를 만들기
          어렵게 만든다. 그리고 한 사이클에서 너무 큰 변화는 시스템 안정성에도
          위험하다. 4× cap 은 이런 급격한 변화를 막는 안전 장치다.
        </p>
        <p className="text-sm text-muted">
          참고로, 매 블록의 timestamp 는 노드들이 각자 약간의 허용 범위 안에서만
          받는다. 미래로 너무 멀거나, 직전 11 블록 중앙값보다 과거인 블록은
          거부된다.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-1 h-4 rounded-sm bg-accent2" />
        <div className="text-[14px] font-medium text-text">{title}</div>
      </div>
      {children}
    </div>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 font-mono text-[13px] space-y-1.5 leading-relaxed">
      {children}
    </div>
  );
}

function BitsExample() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <div className="text-xs text-muted font-mono">
        bits = 0x17034219 (4 byte) → target (32 byte)
      </div>
      <div className="font-mono text-[13px] space-y-1">
        <div>
          <span className="text-muted">exponent</span> = 0x17 = 23
        </div>
        <div>
          <span className="text-muted">mantissa</span> = 0x034219
        </div>
        <div className="text-accent">
          target = 0x034219 × 256^(23 − 3)
        </div>
        <div className="text-text/85 break-all">
          = 0x0000000000000000 0003421900000000 00000000…
        </div>
      </div>
      <div className="text-[13px] text-muted">
        ‘앞에 0 이 몇 개’ 인지를 보면 target 의 크기를 직관적으로 이해할 수
        있다. 0 이 한 자리 더 늘 때마다 평균적으로 약 16배 어려워진다.
      </div>
    </div>
  );
}

function AdjustmentExamples() {
  const cases: { label: string; actual: string; ratio: string; effect: string; tone: "ok" | "harder" | "easier" }[] = [
    {
      label: "정시",
      actual: "≈ 14 일",
      ratio: "1.00",
      effect: "변화 없음",
      tone: "ok",
    },
    {
      label: "빨랐음 (해시레이트 ↑)",
      actual: "10 일",
      ratio: "0.71",
      effect: "target × 0.71 → 약 1.4× 어려워짐",
      tone: "harder",
    },
    {
      label: "느렸음 (해시레이트 ↓)",
      actual: "20 일",
      ratio: "1.43",
      effect: "target × 1.43 → 약 1.4× 쉬워짐",
      tone: "easier",
    },
    {
      label: "극단",
      actual: "1 일 (cap 적용)",
      ratio: "0.25",
      effect: "최대 4× 어려워짐 (cap)",
      tone: "harder",
    },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-x-auto">
      <div className="grid grid-cols-1 sm:min-w-[520px] sm:grid-cols-[120px_100px_80px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>case</div>
        <div>actual</div>
        <div className="text-right">ratio</div>
        <div>effect</div>
      </div>
      <div className="divide-y divide-edge">
        {cases.map((c, i) => {
          const color =
            c.tone === "harder"
              ? "text-[#f76b6b]"
              : c.tone === "easier"
                ? "text-accent2"
                : "text-muted";
          return (
            <div
              key={i}
              className="grid grid-cols-1 sm:min-w-[520px] sm:grid-cols-[120px_100px_80px_1fr] gap-3 px-4 py-2 items-baseline"
            >
              <div className="text-sm">{c.label}</div>
              <div className="font-mono text-[13px] text-text/85">{c.actual}</div>
              <div className={`text-right font-mono text-[13px] ${color}`}>
                {c.ratio}
              </div>
              <div className="text-[13px] text-text/85">{c.effect}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChainComparison() {
  const rows = [
    {
      chain: "Bitcoin",
      interval: "2016 블록마다",
      point: "느리지만 단순하고 예측 가능하다. 급격한 변화는 4× cap 으로 제한한다.",
    },
    {
      chain: "Monero",
      interval: "매 블록 조정",
      point: "최근 블록 구간을 반영해 해시레이트 변화에 빠르게 반응한다. 대신 조정 규칙의 세부 설계가 더 중요해진다.",
    },
    {
      chain: "Ethereum PoW",
      interval: "거의 매 블록 조정",
      point: "블록 간격을 빠르게 보정했다. PoW 시절에는 난이도 폭탄 같은 별도 규칙도 함께 있었다.",
    },
  ];

  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="hidden sm:grid grid-cols-[130px_140px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>체인</div>
        <div>조정 주기</div>
        <div>핵심</div>
      </div>
      <div className="divide-y divide-edge">
        {rows.map((row) => (
          <div
            key={row.chain}
            className="grid grid-cols-1 sm:grid-cols-[130px_140px_1fr] gap-1.5 sm:gap-3 px-4 py-3"
          >
            <div className="font-medium text-text">{row.chain}</div>
            <div className="text-[13px] text-accent2">{row.interval}</div>
            <div className="text-[13px] text-text/78 leading-relaxed">
              {row.point}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
