import Link from "next/link";
import { LAYERS, LAYER_ORDER } from "@/lib/layers";
import { Support } from "@/components/Support";

export default function Home() {
  const lastLayerId = LAYER_ORDER[LAYER_ORDER.length - 1];

  return (
    <main className="min-h-screen px-6 sm:px-10 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-16">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[13px] font-semibold text-accent">
              Bitcoin Study
            </div>
            <div className="rounded-sm border border-edge bg-surface/35 px-2 py-0.5 text-[12px] font-medium text-text/58">
              Beta version
            </div>
          </div>
          <h1 className="text-[40px] sm:text-[52px] font-semibold leading-[1.05] tracking-tight">
            Alice 는 Bob 에게
            <br />
            비트코인을{" "}
            <span className="text-accent">어떻게 보낼까?</span>
          </h1>
          <p className="text-[16px] text-text/70 leading-[1.7] max-w-xl pt-2">
            비트코인을 추상적인 개념 목록으로 외우지 않고, Alice 가 Bob 에게
            1 BTC 를 보내는 한 장면에서 출발해 끝까지 따라갑니다. 주소, 서명,
            트랜잭션, 블록, 채굴, 노드, 확장성, 프라이버시가 그 송금 안에서
            어떤 역할을 하는지 차례로 확인합니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-md bg-accent text-bg px-5 py-2.5 text-[14px] font-medium hover:bg-accent/90 transition-colors"
            >
              Alice의 송금 따라가기
            </Link>
          </div>
        </header>

        <section className="border-y border-edge py-7">
          <div className="grid grid-cols-1 sm:grid-cols-[116px_1fr] gap-4 sm:gap-8">
            <div className="text-[16px] font-semibold text-text leading-snug">
              학습 TIP
            </div>
            <div className="space-y-5">
              <p className="text-[15px] text-text/72 leading-[1.75] max-w-2xl">
                처음에는 모든 설명을 다 읽지 않아도 됩니다.{" "}
                <span className="text-text/92 font-medium">기초</span>와{" "}
                <span className="text-text/92 font-medium">안내</span>만
                따라가면 Alice 의 송금이 어떤 순서로 완성되는지 먼저 잡을 수
                있습니다. 심화 내용은 흐름을 한 번 본 뒤, 궁금한 단계에서
                돌아와 읽는 편이 좋습니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[13px] leading-relaxed">
                <GuideLine
                  tags={[
                    { label: "기초", tone: "basic" },
                    { label: "안내", tone: "guide" },
                  ]}
                  title="먼저 따라갈 흐름"
                  text="다음 단계 이해에 필요한 핵심 설명과 연결"
                />
                <GuideLine
                  tags={[
                    { label: "심화", tone: "deep" },
                    { label: "사례", tone: "case" },
                    { label: "질문", tone: "think" },
                  ]}
                  title="나중에 펼쳐볼 내용"
                  text="내부 원리, 실제 사건, 설계 선택과 트레이드오프"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-edge pb-3">
            <div className="text-[13px] font-semibold text-muted">
              {LAYER_ORDER.length} 단계
            </div>
            <div className="text-[12px] text-muted/60">
              S0 → {lastLayerId}
            </div>
          </div>

          <ol className="space-y-0 divide-y divide-edge/60">
            {LAYER_ORDER.map((id) => {
              const layer = LAYERS[id];
              return (
                <li key={id}>
                  <Link
                    href={`/learn?at=${id}`}
                    className="grid grid-cols-[56px_1fr_auto] items-center gap-5 py-5 group"
                  >
                    <div className="w-12 h-12 border border-edge bg-bg flex items-center justify-center font-mono text-[14px] font-medium tracking-wide text-accent/85 group-hover:bg-accent group-hover:text-bg group-hover:border-accent transition-colors">
                      {layer.subtitle}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[16px] font-medium text-text/90 group-hover:text-text transition-colors">
                        {layer.title}
                      </div>
                      <div className="text-[13px] text-text/55 leading-relaxed mt-1">
                        {layer.oneLiner}
                      </div>
                    </div>
                    <div className="text-muted/60 group-hover:text-accent group-hover:translate-x-1 transition-all">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="13 6 19 12 13 18" />
                      </svg>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="border-t border-edge pt-7">
          <div className="grid grid-cols-1 sm:grid-cols-[116px_1fr] gap-4 sm:gap-8">
            <div className="text-[16px] font-semibold text-text leading-snug">
              다음 코스 (예정)
            </div>
            <div className="space-y-3">
              <p className="text-[15px] text-text/70 leading-[1.75] max-w-2xl">
                지금 코스는 비트코인 한 건의 송금이 실제로 처리되는 과정을
                끝까지 따라가는 비트코인 원리 편입니다. 이후 업데이트에서는
                Bitcoin 을 기준점으로 삼아, Ethereum 이 왜 ‘잔액 장부와 실행
                환경’ 을 선택했는지부터 smart contract 앱과 신생 체인의 합의
                설계까지 비교하는 블록체인 일반 코스를 추가할 예정입니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]">
                <NextCourseItem title="Ethereum" text="Account model, gas, EVM이 만드는 실행 환경" />
                <NextCourseItem title="Smart Contract" text="Token, DeFi, NFT, security issues" />
                <NextCourseItem title="Consensus" text="PoS, BFT, validator, high-throughput chain" />
              </div>
            </div>
          </div>
        </section>

        <Support />

        <footer className="pt-10 border-t border-edge flex items-center justify-between gap-4">
          <div className="text-[12px] text-muted/60">
            S0 → {lastLayerId}
          </div>
        </footer>
      </div>
    </main>
  );
}

type TagTone = "basic" | "deep" | "case" | "think" | "guide";

function GuideLine({
  tags,
  title,
  text,
}: {
  tags: { label: string; tone: TagTone }[];
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-edge/70 pt-3 space-y-2">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {tags.map((tag) => (
          <TagLabel key={tag.label} label={tag.label} tone={tag.tone} />
        ))}
      </div>
      <div>
        <div className="text-text/82 font-medium">{title}</div>
        <div className="text-text/55 mt-0.5">{text}</div>
      </div>
    </div>
  );
}

function TagLabel({
  label,
  tone,
}: {
  label: string;
  tone: TagTone;
}) {
  const cls = {
    basic: "bg-[#5b8def]",
    guide: "bg-[#48b37f]",
    deep: "bg-[#f7931a]",
    case: "bg-[#b58cff]",
    think: "bg-[#f16d7a]",
  }[tone];
  const text = {
    basic: "text-[#8fb1ff]",
    guide: "text-[#78d7a8]",
    deep: "text-[#ffb657]",
    case: "text-[#cdb7ff]",
    think: "text-[#ff9aa3]",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cls}`} />
      {label}
    </span>
  );
}

function NextCourseItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-edge/70 pt-3">
      <div className="text-[13px] font-medium text-text/82">{title}</div>
      <div className="text-[13px] text-text/55 leading-relaxed mt-0.5">
        {text}
      </div>
    </div>
  );
}
