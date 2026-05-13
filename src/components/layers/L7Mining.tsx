"use client";

import { useState } from "react";
import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Reflection, Probe, Reading, Callout, ResourceLabel } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L7Mining(props: LayerProps) {
  return (
    <LayerShell
      id="S8"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "PoW 는 ‘투표 규칙’", subtitle: "one-CPU-one-vote",
                body: (
                  <section className="space-y-5">
                    <p className="text-[17px] text-text/80 leading-[1.75]">
                      S7 에서 블록들이{" "}
                      <span className="text-text">prev_hash 로 이어져</span>{" "}
                      변조 불가능한 사슬이 된다는 걸 봤다. 그런데 그 사슬 끝에{" "}
                      <span className="text-text">새 블록을 누가, 어떤 자격으로</span>{" "}
                      추가하는가? PoW 는 겉보기엔 ‘퍼즐 풀기 게임’ 처럼
                      보이지만, 본질은{" "}
                      <span className="text-text">‘어떤 블록을 다음 블록으로 받아들일지 투표하는 규칙’</span>{" "}
                      이다.
                    </p>

                    <Whitepaper />

                    <p className="text-[16px] text-text/80 leading-[1.7]">
                      문제는 ‘1 인 1 표’ 가 인터넷에선 안 통한다는 점. IP 는 얼마든
                      위조할 수 있으니까 (S6 의 sybil 공격). 그래서 사토시는 한
                      CPU 가 ‘할 수 있는 일’ 을 표로 본다.{" "}
                      <span className="text-text">한 시간에 더 많은 해시를 계산한 CPU 가 더 많은 표를 가진다</span>.
                      그런데 ‘CPU 가 일을 얼마나 했는지’ 는 어떻게 측정할까?{" "}
                      <span className="text-text">확률</span> 로 측정한다.
                    </p>

                    <ToyHashExample />

                    <p className="text-[15px] text-text/75 leading-[1.7]">
                      아래 미니 채굴기는 이 과정을 작게 축소한 실험이다. 실제
                      SHA-256 공간을 0-99 눈금으로 줄여, 채굴자가 무엇을 반복하는지
                      보여준다. 채굴 시도를 누를 때마다 블록 헤더의 작은 입력값이
                      바뀌고 새 해시 후보가 나온다. 그 값이 target 왼쪽에 들어오면
                      블록을 찾은 것으로 본다.
                    </p>

                    <MiniMiner />

                    <p className="text-[15px] text-text/75 leading-[1.7]">
                      실제 비트코인은 훨씬 큰 해시 공간에서 같은 게임을 한다.
                      목표가 어려워질수록 한 번의 시도가 맞을 확률은 급격히
                      작아지고, 전 세계 채굴 장비가 계속 시도해도 평균 10 분에
                      블록 하나가 나오도록 난이도가 조정된다. 이제 비트코인의
                      실제 조건으로 확장해보자.
                    </p>

                    <Puzzle />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <Note title="조정 · 늘 10분 정도가 되도록">
                        난이도는 매 2016 블록 (약 2주) 마다 자동으로 다시
                        맞춰진다. 직전 구간의 평균 블록 간격이 10분보다 짧았으면
                        target 을 낮춰 더 어렵게 만들고, 길었으면 target 을 높인다.
                      </Note>
                      <Note title="보상 · 두 갈래로 들어옴">
                        <div>
                          ·{" "}
                          <span className="text-text">block subsidy</span>:
                          새로 발행되는 코인. 21 만 블록 (약 4년) 마다 반으로
                          줄어든다. 현재 보상은 3.125 BTC.
                        </div>
                        <div className="mt-1.5">
                          · <span className="text-text">tx fees</span>: 블록 안
                          트랜잭션의 inputs − outputs 합계.
                        </div>
                      </Note>
                      <Note title="hashrate · 끊임없는 시도 횟수">
                        네트워크 전체가 1 초에 엄청난 수의 해시를 시도한다.
                        지금은 일반 컴퓨터가 아니라 <Term id="asic">ASIC</Term>
                        이라는 전용 칩이 이 일을 거의 전담한다.
                      </Note>
                      <Note title="왜 SHA-256 인가?">
                        <Term id="avalanche">avalanche</Term> ·{" "}
                        <Term id="one-way">one-way</Term> 성질이 ‘우연히 맞히는
                        것 외엔 방법이 없다’ 를 보장. 미리 계산해놓을 수 없고,
                        단축 경로도 없다.
                      </Note>
                    </div>
                    <div className="rounded-sm border border-edge bg-surface/20 p-4 text-sm leading-relaxed">
                      <h4 className="text-[16px] font-medium text-accent2 leading-snug mb-2">
                        ‘작업 증명’ 이 증명하는 것
                      </h4>
                      누군가 이 블록 헤더에 평균적으로{" "}
                      <span className="text-text">엄청난 양의 시도</span> 를
                      들였다는 사실이다. target 이 작을수록 (= 어려울수록) 평균
                      시도 수는 기하급수적으로 늘어난다. 그 ‘들인 시도’ 가 곧
                      사슬의 뒷받침이 된다.
                    </div>
                  </section>
                ),
              },
              {
                title: "해시 선택의 깊이", subtitle: "왜 double-SHA256? Ethereum 은 왜 다른가",
                level: "deep",
                body: <HashChoice />,
              },
              {
                title: "채굴자는 누구인가",
                subtitle: "솔로 채굴과 풀 채굴",
                body: (
                  <Section
                    heading="채굴자는 누구이고 어떻게 채굴하나 · 풀과 솔로"
                    sub="2009 년엔 사토시가 노트북 CPU 로도 캐낼 수 있었다. 지금은 산업 단위. 거의 모든 채굴이 ‘pool’ 에서 일어난다."
                  >
                    <PoolDiagram />
                  </Section>
                ),
              },
              {
                title: "Halving",
                subtitle: "보상이 줄어드는 일정",
                body: (
                  <Section
                    heading="Halving · 보상 반감 일정"
                    sub="block subsidy 는 21 만 블록 (약 4 년) 마다 반으로 줄어든다. 총 발행량은 약 2100 만 BTC 에서 점근. 2140 년경 마지막 코인 발행."
                  >
                    <HalvingSchedule />
                    <SupplyCurve />
                    <SupplyReflection />
                  </Section>
                ),
              },
              {
                title: "Energy",
                subtitle: "비트코인의 전력 사용",
                level: "case",
                body: (
                  <Section
                    heading="Energy · 비트코인 전력 사용"
                    sub="‘들인 작업 = 안전’ 이지만 그 작업은 진짜 전력을 소모한다. 규모와 종류를 정직하게."
                  >
                    <EnergyContext />
                  </Section>
                ),
              },
              {
                title: "Target과 난이도 조정",
                level: "deep",
                body: (
                  <Section
                    heading="target 의 정확한 정의와 자동 조정 규칙"
                    sub="‘target 이 작을수록 어렵다’ 정도만 봤는데, 그 값이 어떻게 정해지고 시간에 따라 어떻게 자동 조정되는지."
                  >
                    <PrimitivePanel ids={["difficulty"]} />
                  </Section>
                ),
              },
              {
                title: "역사적 reorg 사례", subtitle: "채굴 경쟁의 비정상 사건들",
                level: "case",
                body: (
                  <Section
                    heading="역사적 reorg 사례"
                    sub="채굴 경쟁이 ‘비정상’ 으로 흘러 깊은 reorg 가 일어났던 몇 안 되는 사례. 모두 악의적 51% 공격이 아니라 버그·운영 사고였다."
                  >
                    <ReorgHistory />
                  </Section>
                ),
              },
              {
                title: "생각해보기", subtitle: "에너지가 곧 안전이라는 등식",
                body: (
                  <Reflection title="‘낭비’ 와 ‘보안’ 사이 · 공짜 점심은 없다">
                    <p>
                      PoW 비판자: “비트코인은 한 나라 (≈ 아르헨티나) 만큼의
                      전기를 먹는다. 명백한 낭비.”
                    </p>
                    <p>
                      PoW 옹호자: “그 전기가 곧 보안이다. 51% 로 사슬을
                      되감으려면 같은 전기를 다시 들여야 한다. 보안은 ‘이미
                      들인 비용을 되돌릴 수 없다’ 는 사실에서 나온다.” 이걸
                      줄이면 곧 보안이 줄어든다.
                    </p>
                    <p>
                      PoS (Proof of Stake) 는 전기를 쓰지 않는 대신 보안이 ‘큰
                      지분 보유자’ 에게 의존한다. 누가 이미 많은 지분을 갖고
                      있는지가 의사결정 권한에도 영향을 준다. 전기를 아끼는 대신
                      다른 신뢰 가정을 받아들이는 선택이며, 공짜 해결책은 아니다.
                    </p>
                    <Probe>
                      에너지를 안 쓰면서 PoW 와 같은 객관적 보안을 주는 모델이
                      가능할까? 만약 불가능하다면, 비트코인이 쓰는 전력은 ‘낭비’
                      일까 ‘비용’ 일까? 같은 양의 전기를 디지털 화폐의 보안에 쓰는
                      게 금을 캐는 것보다 더 나쁠까?
                    </Probe>
                    <Reading label="쟁점 키워드">
                      채굴이 점차 잉여 전력 (gas flaring, hydro-spill) 으로
                      옮겨가는 현상. 그리드의 ‘마지막 소비자’ 역할로 신재생
                      에너지 경제성을 개선한다는 주장과 그 반론.
                    </Reading>
                  </Reflection>
                ),
              },
              {
                title: "생각해보기", subtitle: "block subsidy 가 0 이 되면?",
                body: <PostSubsidyReflection />,
              },
            ]}
          />
        </div>
      }
    />
  );
}

function ReorgHistory() {
  const events = [
    {
      date: "2010-08",
      desc: "‘value overflow incident’ · 한 트랜잭션이 184 억 BTC 를 만드는 버그를 악용한 사건. 사토시가 직접 패치한 뒤 53 블록 reorg 로 그 트랜잭션을 무효화했다.",
      depth: "53 blocks",
    },
    {
      date: "2013-03",
      desc: "Bitcoin Core 0.7 / 0.8 의 BDB 락 차이로 두 사슬이 6 시간 동안 분기했다. 0.8 → 0.7 다운그레이드 권장으로 봉합되었다.",
      depth: "24 blocks",
    },
    {
      date: "2015-07",
      desc: "‘SPV mining’ 사고. soft fork 가 활성화된 직후, 일부 풀이 새 블록 본체를 다 받아 검증하지 않고 (헤더만 보고) 그 위에 빈 블록을 쌓아 채굴했다. 그런데 그 모-블록이 새 규칙을 어긴 invalid 블록이라 결국 6 블록이 무효화 (reorg) 되었다. 속도 욕심으로 검증을 생략한 결과 잘못된 사슬에 hashrate 가 낭비된 사례다.",
      depth: "6 blocks",
    },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr_100px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>시점</div>
        <div>사건</div>
        <div className="text-right">깊이</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {events.map((e) => (
          <div
            key={e.date}
            className="grid grid-cols-1 sm:grid-cols-[100px_1fr_100px] gap-3 px-4 py-2.5 items-baseline"
          >
            <div className="font-mono text-[13px] text-muted">{e.date}</div>
            <div className="text-text/85 leading-relaxed">{e.desc}</div>
            <div className="text-right font-mono text-[13px] text-accent">
              {e.depth}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-edge text-[13px] text-muted leading-relaxed">
        깊은 reorg 는 매우 드물다. 1-2 블록짜리 자연 fork 는 종종 생기지만,
        그때 빠진 일반 트랜잭션은 보통 mempool 로 돌아가 다음 블록에 다시
        들어간다.
      </div>
    </div>
  );
}

function Section({
  heading,
  sub,
  children,
}: {
  heading: string;
  sub?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">{heading}</h2>
        {sub && (
          <p className="text-[15px] text-text/70 leading-[1.7] mt-2">
            {sub}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

type MineAttempt = {
  nonce: number;
  hashHex: string;
  value: number;
  won: boolean;
};

function MiniMiner() {
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [attempts, setAttempts] = useState<MineAttempt[]>([]);
  const [nonce, setNonce] = useState(0);

  const target = {
    easy: 24,
    normal: 10,
    hard: 4,
  }[difficulty];
  const latest = attempts[0];

  function tryNonce() {
    const nextNonce = nonce + 1;
    const value = Math.floor(Math.random() * 100);
    const won = value < target;
    setNonce(nextNonce);
    setAttempts((prev) => [
      {
        nonce: nextNonce,
        hashHex: fakeHash(nextNonce, value),
        value,
        won,
      },
      ...prev,
    ].slice(0, 6));
  }

  function reset(nextDifficulty = difficulty) {
    setDifficulty(nextDifficulty);
    setAttempts([]);
    setNonce(0);
  }

  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-edge flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[14px] font-semibold text-muted">
            미니 채굴기
          </div>
          <div className="text-[18px] text-text/90 font-medium mt-1 leading-snug">
            반복 시도해서 target 아래의 해시 찾기
          </div>
          <div className="text-[14px] text-text/62 leading-relaxed mt-1">
            실제 SHA-256 공간을 0-99 숫자 눈금으로 줄인 축약 모델입니다.
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {(["easy", "normal", "hard"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => reset(d)}
              className={`px-3 py-2 text-[12px] font-semibold border transition-colors ${
                difficulty === d
                  ? "border-accent text-accent bg-accent/10"
                  : "border-edge text-muted hover:text-text hover:border-accent/50"
              }`}
            >
              {d === "easy" ? "쉬움" : d === "normal" ? "보통" : "어려움"}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_170px] gap-4">
          <div className="space-y-3">
            <div className="h-7 relative rounded-sm bg-bg/60 border border-edge overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-accent/15 border-r border-accent/70"
                style={{ width: `${target}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-px bg-accent"
                style={{ left: `${target}%` }}
              />
              {latest && (
                <div
                  className={`absolute top-1/2 h-4 w-4 -mt-2 -ml-2 rounded-full border ${
                    latest.won
                      ? "bg-accent border-accent"
                      : "bg-surface border-muted"
                  }`}
                  style={{ left: `${latest.value}%` }}
                />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] gap-x-3 gap-y-1.5 text-[14px] font-mono">
              <div className="text-muted">target</div>
              <div className="text-accent">{target.toString().padStart(2, "0")} / 100 미만</div>
              <div className="text-muted">최근 시도</div>
              <div className={latest?.won ? "text-accent" : "text-text/80"}>
                {latest
                  ? `${latest.value.toString().padStart(2, "0")} / 100`
                  : "아직 시도 없음"}
              </div>
              <div className="text-muted">채굴 시도</div>
              <div className="text-text/80">{nonce.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex md:flex-col gap-2">
            <button
              type="button"
              onClick={tryNonce}
              className="flex-1 rounded-sm bg-accent text-bg px-4 py-3 text-[15px] font-semibold hover:bg-accent/90 transition-colors"
            >
              채굴 시도
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-sm border border-edge text-muted px-4 py-3 text-[15px] font-medium hover:text-text hover:border-accent/60 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-edge bg-bg/50 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-[76px_1fr_76px] gap-3 px-3 py-2.5 border-b border-edge text-[13px] font-semibold text-muted">
            <div>시도</div>
            <div>hash 후보</div>
            <div className="text-right">결과</div>
          </div>
          <div className="divide-y divide-edge min-h-[112px]">
            {attempts.length === 0 ? (
              <div className="px-3 py-4 text-[14px] text-muted">
                버튼을 눌러 채굴 시도를 시작한다.
              </div>
            ) : (
              attempts.map((a) => (
                <div
                  key={a.nonce}
                  className="grid grid-cols-1 sm:grid-cols-[76px_1fr_76px] gap-3 px-3 py-2.5 items-center text-[13px] font-mono"
                >
                  <div className="text-muted">{a.nonce}</div>
                  <div className="text-text/75 truncate">{a.hashHex}</div>
                  <div className={`text-right ${a.won ? "text-accent" : "text-muted"}`}>
                    {a.won ? "성공" : "큼"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Callout title={latest?.won ? "블록 발견" : "검증은 쉽고, 찾기는 어렵다"} tone={latest?.won ? "accent" : "info"}>
          <p className="text-[15px] text-text/80 leading-[1.7]">
            {latest?.won
              ? `${latest.nonce} 번째 채굴 시도에서 target 보다 작은 해시가 나왔다. 다른 노드는 같은 입력으로 한 번만 해시를 계산해 조건을 바로 검증할 수 있다. 계속 시도하면 다음 블록 후보를 또 찾는 과정이 된다.`
              : "채굴자는 target 아래의 해시가 나올 때까지 입력값을 바꿔가며 반복한다. 성공 확률은 target 이 작아질수록 낮아진다."}
          </p>
        </Callout>
      </div>
    </div>
  );
}

function fakeHash(nonce: number, value: number) {
  let seed = (nonce * 2654435761 + value * 1013904223) >>> 0;
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    out += seed.toString(16).padStart(8, "0");
  }
  return `${out.slice(0, 8)}...${out.slice(-12)}`;
}

function Puzzle() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge font-mono text-[13px] text-muted">
        proof-of-work · 헤더 해시가 target 보다 작아야 함
      </div>
      <div className="p-4 space-y-3 font-mono text-[13px]">
        <div className="text-muted">목표</div>
        <div className="rounded border border-edge bg-bg/60 p-3">
          <div>
            <span className="text-accent">
              <Term id="double-sha256">double-SHA256</Term>
            </span>
            (header) &lt;{" "}
            <span className="text-accent2">
              <Term id="target">target</Term>
            </span>
          </div>
        </div>

        <div className="text-muted">target 예시 (어떤 블록의)</div>
        <div className="rounded border border-edge bg-bg/60 p-3 text-text/85 break-all">
          0000000000000000 0000034219000000…
          <div className="text-xs text-muted mt-1">
            앞에 0 이 많을수록 어려움. 한 자리 추가될 때마다 약 2× 어려워짐.
          </div>
        </div>

        <div className="text-muted">
          시도 · <Term id="nonce">nonce</Term> 만 바꿔가며 반복
        </div>
        <div className="rounded border border-edge bg-bg/60 p-3 space-y-1">
          <div className="text-text/85">
            nonce=0 → hash 91a4… <span className="text-muted">(target 보다 큼)</span>
          </div>
          <div className="text-text/85">
            nonce=1 → hash 5d2e… <span className="text-muted">(target 보다 큼)</span>
          </div>
          <div className="text-text/85">
            nonce=2 → hash 7f1c… <span className="text-muted">(target 보다 큼)</span>
          </div>
          <div className="text-muted">… 수십억 번 …</div>
          <div className="text-accent">
            nonce=2 893 471 102 → hash 0000000000000000 …a3f1c{" "}
            <span className="text-muted">(성공, target 이하)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Note({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Callout title={title}>
      <div className="text-[15px] text-text/80 leading-[1.7]">{children}</div>
    </Callout>
  );
}

function PoolDiagram() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <svg
        viewBox="0 0 480 200"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="poolArrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 S0,10 z" fill="#7a8190" />
          </marker>
        </defs>

        <PoolBox x={20} y={30} title="Miner A" sub="1 PH/s" />
        <PoolBox x={20} y={84} title="Miner B" sub="3 PH/s" />
        <PoolBox x={20} y={138} title="Miner C" sub="0.5 PH/s" />
        <text x={70} y={185} textAnchor="middle" fontSize="14" fill="#5a6070" fontFamily="JetBrains Mono">⋮</text>

        <rect x={180} y={70} width={120} height={48} fill="#5b8def15" stroke="#5b8def" strokeWidth="1.2" />
        <text x={240} y={90} textAnchor="middle" fontSize="12" fill="#5b8def" fontFamily="JetBrains Mono">
          Pool server
        </text>
        <text x={240} y={106} textAnchor="middle" fontSize="10" fill="#7a8190" fontFamily="JetBrains Mono">
          stratum protocol
        </text>

        <line x1={120} y1={46} x2={180} y2={88} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#poolArrow)" />
        <line x1={120} y1={100} x2={180} y2={94} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#poolArrow)" />
        <line x1={120} y1={154} x2={180} y2={100} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#poolArrow)" />

        <PoolBox x={350} y={45} title="블록 발견" sub="3.125 BTC + fees" tone="accent" />
        <line x1={300} y1={94} x2={350} y2={70} stroke="#f7931a" strokeWidth="1" markerEnd="url(#poolArrow)" />

        <PoolBox x={350} y={120} title="기여 비례 분배" sub="proportional" tone="accent2" />
        <line x1={300} y1={94} x2={350} y2={140} stroke="#5b8def" strokeWidth="1" markerEnd="url(#poolArrow)" />
      </svg>
      <p className="text-[15px] text-text/85 leading-[1.7]">
        hashrate 가 작은 채굴자가 혼자 채굴하면 보상이 너무 불규칙하다. 평균
        계산으로는 언젠가 블록을 찾더라도, 실제로는 몇 년 동안 아무 보상도
        못 받을 수 있다. 그래서 채굴자들은 풀에 참여하고, 풀이 블록을 찾으면
        각자의 hashrate 기여도에 따라 보상을 나눠 받는다 (PPS, PPLNS 등). 단점은
        큰 풀에 hashrate 가 과도하게 모이면 51% 위험이 커진다는 점이다.
      </p>
    </div>
  );
}

function PoolBox({
  x,
  y,
  title,
  sub,
  tone,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  tone?: "accent" | "accent2";
}) {
  const stroke =
    tone === "accent" ? "#f7931a" : tone === "accent2" ? "#5b8def" : "#3a3f4a";
  const fill =
    tone === "accent"
      ? "#f7931a18"
      : tone === "accent2"
        ? "#5b8def18"
        : "#0d0f14";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={100}
        height={32}
       
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <text
        x={x + 50}
        y={y + 14}
        textAnchor="middle"
        fontSize="11"
        fill="#e6e8ec"
        fontFamily="JetBrains Mono"
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + 50}
          y={y + 26}
          textAnchor="middle"
          fontSize="9"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function HalvingSchedule() {
  const halvings = [
    { era: "0", year: "2009-2012", subsidy: "50 BTC" },
    { era: "1", year: "2012-2016", subsidy: "25 BTC" },
    { era: "2", year: "2016-2020", subsidy: "12.5 BTC" },
    { era: "3", year: "2020-2024", subsidy: "6.25 BTC" },
    { era: "4", year: "2024-2028", subsidy: "3.125 BTC", current: true },
    { era: "5", year: "2028-2032", subsidy: "1.5625 BTC" },
    { era: "…", year: "≈ 2140", subsidy: "≈ 0 (마지막 satoshi)" },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[60px_180px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>era</div>
        <div>기간</div>
        <div>block subsidy</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {halvings.map((h) => (
          <div
            key={h.era}
            className={`grid grid-cols-1 sm:grid-cols-[60px_180px_1fr] gap-3 px-4 py-2.5 items-baseline ${
              h.current ? "bg-accent/5" : ""
            }`}
          >
            <div className="font-mono text-[13px] text-muted">{h.era}</div>
            <div className="font-mono text-[13px] text-text/85">{h.year}</div>
            <div
              className={`font-mono text-sm ${
                h.current ? "text-accent" : "text-text/85"
              }`}
            >
              {h.subsidy}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-edge text-[13px] text-muted leading-relaxed">
        총 발행량은 50 + 25 + 12.5 + … 의 등비수열이라 약 21 백만 BTC 에 점근.
        시간이 갈수록 채굴자 수입에서 block subsidy 의 비중은 줄고{" "}
        <span className="text-text">tx fees</span> 의 비중이 커진다.
      </div>
    </div>
  );
}

function SupplyCurve() {
  // (year, cumulative supply M, era 시작 직후 subsidy)
  // 각 halving 시점의 누적 발행량 = 등비수열 합 × 210000 블록
  const halvingPoints: { year: number; supply: number; subsidy: string }[] = [
    { year: 2009.0, supply: 0, subsidy: "50" },
    { year: 2012.92, supply: 10.5, subsidy: "25" },
    { year: 2016.55, supply: 15.75, subsidy: "12.5" },
    { year: 2020.36, supply: 18.375, subsidy: "6.25" },
    { year: 2024.30, supply: 19.6875, subsidy: "3.125" },
    { year: 2028.30, supply: 20.34375, subsidy: "1.5625" },
    { year: 2032.30, supply: 20.671875, subsidy: "0.78" },
    { year: 2036.30, supply: 20.8359, subsidy: "0.39" },
    { year: 2040.30, supply: 20.918, subsidy: "0.195" },
    { year: 2050, supply: 20.979, subsidy: "≈ 0.05" },
  ];

  const W = 600;
  const H = 270;
  const pad = { l: 50, r: 24, t: 30, b: 42 };
  const xMin = 2009;
  const xMax = 2050;
  const yMax = 21;

  const xScale = (year: number) =>
    pad.l + ((year - xMin) / (xMax - xMin)) * (W - pad.l - pad.r);
  const yScale = (supply: number) =>
    H - pad.b - (supply / yMax) * (H - pad.t - pad.b);

  const pathD = halvingPoints
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.year).toFixed(1)} ${yScale(p.supply).toFixed(1)}`,
    )
    .join(" ");

  // Filled area underneath the curve (subtle)
  const areaD =
    pathD +
    ` L ${xScale(halvingPoints[halvingPoints.length - 1].year).toFixed(1)} ${(H - pad.b).toFixed(1)}` +
    ` L ${xScale(halvingPoints[0].year).toFixed(1)} ${(H - pad.b).toFixed(1)} Z`;

  // 'now' marker · 2026 시점, supply 추정
  const now = { year: 2026.5, supply: 19.85 };

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 mt-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-3">
        총 발행량 곡선 · halving 마다 기울기가 절반으로 꺾이며 21 M 에 점근
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* y gridlines + labels */}
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={v}>
            <line
              x1={pad.l}
              y1={yScale(v)}
              x2={W - pad.r}
              y2={yScale(v)}
              stroke="#1c1f27"
              strokeWidth="0.6"
              strokeDasharray="2 4"
            />
            <text
              x={pad.l - 8}
              y={yScale(v) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#a0a8b8"
              fontFamily="JetBrains Mono"
            >
              {v} M
            </text>
          </g>
        ))}

        {/* 21M asymptote */}
        <line
          x1={pad.l}
          y1={yScale(21)}
          x2={W - pad.r}
          y2={yScale(21)}
          stroke="#f7931a"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity={0.7}
        />
        <text
          x={W - pad.r}
          y={yScale(21) - 6}
          textAnchor="end"
          fontSize="11"
          fill="#f7931a"
          fontFamily="JetBrains Mono"
          fontWeight="500"
        >
          21 M (cap)
        </text>

        {/* x-axis line */}
        <line
          x1={pad.l}
          y1={H - pad.b}
          x2={W - pad.r}
          y2={H - pad.b}
          stroke="#7a8190"
          strokeWidth="1"
        />
        {/* y-axis line */}
        <line
          x1={pad.l}
          y1={pad.t}
          x2={pad.l}
          y2={H - pad.b}
          stroke="#7a8190"
          strokeWidth="1"
        />

        {/* x-axis labels (halving years) */}
        {[2009, 2012, 2016, 2020, 2024, 2028, 2032, 2040, 2050].map((year) => (
          <text
            key={year}
            x={xScale(year)}
            y={H - pad.b + 18}
            textAnchor="middle"
            fontSize="11"
            fill="#a0a8b8"
            fontFamily="JetBrains Mono"
          >
            {year}
          </text>
        ))}

        {/* halving vertical guides */}
        {halvingPoints.slice(1, -1).map((p, i) => (
          <line
            key={i}
            x1={xScale(p.year)}
            y1={yScale(p.supply)}
            x2={xScale(p.year)}
            y2={H - pad.b}
            stroke="#5b8def"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            opacity={0.45}
          />
        ))}

        {/* area fill */}
        <path d={areaD} fill="#f7931a" opacity={0.08} />

        {/* supply curve */}
        <path d={pathD} stroke="#f7931a" strokeWidth="1.8" fill="none" />

        {/* halving dots · 라벨은 표에 이미 있어 안 붙임 */}
        {halvingPoints.map((p, i) => (
          <circle
            key={i}
            cx={xScale(p.year)}
            cy={yScale(p.supply)}
            r={3.5}
            fill="#f7931a"
          />
        ))}

        {/* now marker · 시각 마커만, 텍스트 라벨은 차트 밖 캡션에 */}
        <line
          x1={xScale(now.year)}
          y1={yScale(now.supply)}
          x2={xScale(now.year)}
          y2={H - pad.b}
          stroke="#5b8def"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <circle
          cx={xScale(now.year)}
          cy={yScale(now.supply)}
          r={5}
          fill="none"
          stroke="#5b8def"
          strokeWidth="1.6"
        />
      </svg>
      <div className="text-[12px] text-text/70 mt-3 leading-relaxed">
        <span className="inline-flex items-center gap-1.5 align-middle">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-accent2" />
          <span className="text-accent2 font-semibold">파란 마커</span>
        </span>{" "}
        = 2026 년 기준 약 19.8 M BTC, 한도의 94 % 이상. 절반 이상이{" "}
        <span className="text-text">첫 halving 전 (2009-2012)</span> 에
        발행됐다. 2050 년이면 약 20.98 M 으로 사실상 21 M 에 가까워진다.{" "}
        <span className="text-text">2140 ‘마지막 sat’</span> 시점은 형식적
        완료 시점에 가깝고, 발행 인플레이션은 그 훨씬 전부터 거의 0 에 가까워진다.
      </div>
    </div>
  );
}

function SupplyReflection() {
  return (
    <Reflection title="왜 총 공급량을 21 M 으로 묶었을까 · 반감기는 또 왜?">
      <p>
        주류 화폐 정책은 보통 낮고 안정적인 인플레이션을 목표로 한다. 중앙은행은
        경기와 물가에 맞춰 통화량과 금리를 조절한다. 비트코인은 반대 방향을
        택했다. 발행 곡선을 코드에 박아 두고{" "}
        <span className="text-text">누구도 임의로 못 늘리게</span> 한다.
        사토시의 설계 의도는 ‘예측 가능한 발행이 곧 신뢰의 기반’ 이라는
        것이다. 발행 정책에 의지가 끼어들 수 없어야 ‘진짜 디지털 금’ 이라고
        본 것이다.
      </p>
      <p>
        왜 ‘반감기 (halving)’ 라는 모양일까? 그냥 일정 시점에 갑자기 발행을
        멈추면 그 직전·직후 채굴 인센티브가 단절된다. 등비수열 (50 → 25 →
        12.5 → … ) 은 <span className="text-text">단계적으로 줄어드는 감소</span> 다.
        채굴자가 4 년 단위로 적응할 시간이 있고, 새 코인은 점점 희소해지지만
        한순간에 보상이 끊기는 cliff 는 없다. 수학적으로 50 × (1 + 1/2 + 1/4 + … ) ×
        210 000 = 21 000 000 에 수렴한다.
      </p>
      <p>
        21 M 이라는 숫자 자체는 임의값이다. 사토시가 ‘블록당 50 BTC × 210
        000 × 등비수열’ 을 골랐고, 그 결과가 우연히 21 M 에 가깝게 떨어졌을
        뿐이다. ‘24 M’ 이나 ‘100 M’ 이었어도 본질은 같았을 것이다. 핵심은
        숫자가 아니라{" "}
        <span className="text-text">사전에 정해져 있다는 사실 그 자체</span>
        다.
      </p>
      <Probe>
        총 공급량이 ‘제한되어야 한다’ 는 게 자명한가? 디플레이션 압력 (보유
        하는 게 항상 이득) 은 결제 화폐로는 안 맞는다는 비판 (Krugman 등) 도
        오래 있다. 한편 인플레이션 통화 (USD, KRW) 도 ‘조용히 가치 빼앗기’ 의
        한 형태이고, 누가 그 권한을 쥐느냐의 문제이기도 하다. ‘발행 정책 =
        정치’ 라는 명제를 받아들이면, 비트코인은 그 정치를 ‘없음’ 으로 고정한
        셈이다.
      </Probe>
      <Reading label="비교 사례">
        Monero 의 <span className="text-text">tail emission</span> (∞ 미래에도
        블록당 0.6 XMR 발행 · ‘채굴자 인센티브를 영구히 유지’ 가 목표),
        Ethereum 의 issuance 정책 변경 (PoS 전환 후 ‘ultrasound money’ 마케팅),
        Milton Friedman 의{" "}
        <em className="text-text/85">k-percent rule</em> (통화 공급을 일정
        비율로만 늘리자는 1960 년대 제안). 비트코인의 ‘0% 영구 인플레이션’ 은
        이 흐름의 극단점.
      </Reading>
    </Reflection>
  );
}

function EnergyContext() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <div className="text-[13px] font-semibold text-muted/75">
        snapshot · 2026 기준 대략
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <Stat label="네트워크 hashrate" value="≈ 1 ZH/s" sub="10²¹ H/s" />
        <Stat label="연간 전력 사용" value="≈ 150 TWh" sub="아르헨티나 1 국 수준" />
        <Stat label="재생에너지 비중" value="≈ 50–60%" sub="추정치, 변동 큼" />
      </div>
      <p className="text-[15px] text-text/85 leading-[1.7]">
        이 ‘들인 에너지 = 보안’ 이라는 게 PoW 의 본질이라 줄이는 건 곧 보안을
        포기하는 셈. 한편 전력원 자체를 재생에너지·잉여 가스 (flared gas) 로
        옮기려는 흐름이 있고, 그래서 ‘얼마 쓰냐’ 와 ‘무엇을 쓰냐’ 는 별개의
        논쟁.
      </p>
      <p className="text-[13px] text-muted leading-relaxed">
        대안 합의 모델 (PoS) 은 전력 소모는 거의 없지만 ‘지분이 곧 권력’ 이라는
        다른 트레이드오프를 가진다 (이더리움의 경로). 비트코인은 PoW 를 지키는
        쪽을 택했다.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/40 p-3 space-y-1">
      <div className="text-[13px] font-semibold text-muted">
        {label}
      </div>
      <div className="font-mono text-base text-accent">{value}</div>
      <div className="text-xs text-muted">{sub}</div>
    </div>
  );
}

function PostSubsidyReflection() {
  return (
    <Reflection title="block subsidy 가 0 이 되면, 비트코인은 자기 보안을 유지할 수 있을까">
      <p>
        현재 채굴자 수입의 대부분은 block subsidy, 즉 새로 발행되는 코인에서
        나온다. 이 보상은 반감을 거듭해 약 2140 년 0 으로 수렴한다. 그때는 채굴
        보안의 100% 가{" "}
        <span className="text-text">트랜잭션 수수료</span> 에 의존한다. 비트코인
        디자인 중 가장 자주 의심받는 가설.
      </p>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[100px_120px_140px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>시점</div>
          <div>subsidy / 블록</div>
          <div>fee 비중 (현재)</div>
          <div>채굴자 수입의 변화</div>
        </div>
        <div className="divide-y divide-edge text-[13px]">
          <PostRow t="2024" subsidy="3.125 BTC" fee="변동" change="현재 구간. fee 비중은 블록 공간 수요가 몰릴 때 크게 오른다." />
          <PostRow t="2032" subsidy="0.78 BTC" fee="?" change="subsidy 가 2024 년의 1/4 로 줄어든다. 보안을 유지하려면 fee 비중이 커져야 한다." />
          <PostRow t="2048" subsidy="≈ 0.05 BTC" fee="?" change="subsidy 가 사실상 의미 없는 수준" tone="warn" />
          <PostRow t="2140" subsidy="0" fee="100%" change="subsidy 끝. fee 만으로 hashrate 를 유지" tone="bad" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
          <h4 className="text-[15px] font-medium text-accent2 leading-snug">
            낙관 시나리오
          </h4>
          <p className="text-[14px] text-text/80 leading-[1.65]">
            트랜잭션 수요가 충분히 커지면 fee 가 hashrate 를 떠받칠 수 있다.
            Lightning 채널 정산, inscriptions, 기관 결제처럼 블록 공간을 두고
            경쟁하는 수요가 늘어나면 fee 시장이 커진다. BTC 가격이 오르면 작은
            BTC 단위의 fee 도 달러 기준으로는 의미 있는 보상이 된다.
          </p>
        </div>
        <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
          <h4 className="text-[15px] font-medium text-[#f76b6b] leading-snug">
            비관 시나리오
          </h4>
          <p className="text-[14px] text-text/80 leading-[1.65]">
            fee 시장이 약하면 hashrate 가 줄고, 51% 공격 비용도 함께 낮아질 수
            있다. 학계 일부는 ‘fee 만으로는 안정적인 hashrate 가 유지되지 않는다’
            는 동적 모델을 제시한다.
          </p>
        </div>
      </div>

      {/* 학술 논문 · Carlsten 2016 (instability 측 입장) */}
      <a
        href="https://www.cs.princeton.edu/~arvindn/publications/mining_CCS.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-sm border border-accent/40 bg-accent/[0.04] hover:bg-accent/[0.08] transition-colors p-5 group space-y-3"
      >
        <div className="flex items-start gap-3">
          <ResourceLabel>논문</ResourceLabel>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-medium text-text leading-snug">
              “On the Instability of Bitcoin Without the Block Reward”
            </div>
            <div className="text-[13px] text-text/70 mt-1.5">
              Miles Carlsten, Harry Kalodner, S. Matthew Weinberg, Arvind
              Narayanan · ACM CCS 2016
            </div>
          </div>
        </div>

        <blockquote className="text-[13px] text-text/80 leading-[1.7] italic border-l-2 border-accent/40 pl-3 ml-1">
          “We argue that without a block reward, mining of new blocks degenerates
          into a game in which miners can profitably deviate from the prescribed
          protocol. …”
        </blockquote>

        <div className="text-[13px] text-text/75 leading-[1.7]">
          <span className="text-text font-medium">함축</span>: subsidy 가 사라져
          블록 보상이 ‘앞 블록 한 개에 들어 있는 fee’ 만 남으면, 채굴자에게는
          정직하게 다음 블록을 쌓는 것보다{" "}
          <span className="text-text">앞 블록을 fork 해서 그 fee 를 다시
          가져가는 것</span>{" "}
          이 더 이득인 상황이 생긴다. 같은 모델 안에서 selfish mining,
          undercutting, lazy mining 이 모두 합리적인 전략이 될 수 있다. 따라서
          fee-only 비트코인은 ‘구조적으로 불안정한 게임’ 으로 빠질 수 있다.
        </div>

        <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono text-accent2 group-hover:text-accent">
          cs.princeton.edu · CCS 2016 ↗
        </div>
      </a>

      <Callout title="참고: ‘selfish mining’ 은 다음 단계 (S9) 의 주제">
        <p className="text-[14px] text-text/75 leading-[1.7]">
          위 논문에 등장하는{" "}
          <span className="text-text">selfish mining</span> 같은 채굴 전략은 다음
          S9 (채굴 경쟁) 에서 게임 이론적으로 자세히 다룬다. 여기선{" "}
          <span className="text-text">‘정직한 채굴이 아닌 다른 전략이 합리적이 될 수 있다’</span>{" "}
          는 사실만 이해하면 충분하다.
        </p>
      </Callout>

      <Probe>
        위 논문은 ‘불안정’ 쪽이지만, 시간 (116 년) 과 시장 적응 가능성을 봤을 때
        비관이 옳다고 단정할 수 있나? 비트코인이 ‘자기 보안 모델 자체에 풀리지
        않은 가설’ 을 품고 있다는 사실을 어떻게 받아들여야 하는가. 결함인가,
        미래에 풀 수 있는 미해결 문제인가, 아니면 PoW 자체의 본질적 한계인가?
      </Probe>
      <Reading label="참고 논문">
        Eric Budish (Chicago Booth) 의{" "}
        <em className="text-text/85">“The Economic Limits of Bitcoin and the Blockchain”</em>{" "}
        (NBER 2018) 도 비슷한 관점에서 채굴 인센티브의 거시 한계를 다룬다.
        ‘fee 만으로 충분하다’ 는 반대 입장의 정식 학술 논문은 의외로 드물다
        (대부분 업계 측 백서·블로그).
      </Reading>
    </Reflection>
  );
}

function PostRow({
  t,
  subsidy,
  fee,
  change,
  tone,
}: {
  t: string;
  subsidy: string;
  fee: string;
  change: string;
  tone?: "warn" | "bad";
}) {
  const color =
    tone === "bad"
      ? "text-[#f76b6b]"
      : tone === "warn"
        ? "text-accent"
        : "text-text/85";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[100px_120px_140px_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className="font-mono text-[12px] text-muted">{t}</div>
      <div className={`font-mono text-[13px] ${color}`}>{subsidy}</div>
      <div className="font-mono text-[12px] text-muted">{fee}</div>
      <div className="text-[13px] text-text/80 leading-[1.65]">{change}</div>
    </div>
  );
}

function Whitepaper() {
  return (
    <a
      href="https://bitcoin.org/bitcoin.pdf#page=3"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-sm border border-accent/40 bg-accent/[0.04] hover:bg-accent/[0.08] transition-colors p-5 group"
    >
      <div className="flex items-start gap-4">
        <div className="font-mono text-[12px] tracking-[0.12em] text-accent shrink-0 pt-0.5">
          백서 인용
        </div>
        <div className="flex-1 min-w-0">
          <blockquote className="text-[16px] text-text/90 leading-[1.65] italic">
            “The proof-of-work also solves the problem of determining
            representation in majority decision making …{" "}
            <span className="not-italic text-text font-medium">
              one-CPU-one-vote
            </span>
            . The majority decision is represented by the longest chain, which
            has the greatest proof-of-work effort invested in it.”
          </blockquote>
          <div className="text-[13px] text-text/65 mt-2 leading-relaxed">
            · Satoshi Nakamoto,{" "}
            <span className="text-text/85">
              “Bitcoin: A Peer-to-Peer Electronic Cash System”
            </span>
            , §4 Proof-of-Work, 2008.
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-mono text-accent2 group-hover:text-accent">
            bitcoin.org/bitcoin.pdf · §4 ↗
          </div>
        </div>
      </div>
    </a>
  );
}

function ToyHashExample() {
  // 16-bit hash 가정. target 의 앞 4 bit 가 0 이어야 한다고 하자.
  // 그러면 한 시도가 맞을 확률 = 2^(-4) = 1/16.
  // 작은 표로 시도들 보여주고 hit/miss 표시.
  const trials: { nonce: number; hash: string; hit: boolean }[] = [
    { nonce: 0, hash: "1010 1100 0011 1011", hit: false },
    { nonce: 1, hash: "0110 1001 1110 0010", hit: false },
    { nonce: 2, hash: "1101 0010 0111 1001", hit: false },
    { nonce: 3, hash: "0011 0101 0010 1101", hit: false },
    { nonce: 4, hash: "1001 1101 0110 0010", hit: false },
    { nonce: 5, hash: "0000 1011 0110 1010", hit: true },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-4">
      <div className="space-y-2">
        <div className="text-[14px] font-semibold text-accent2">
          장난감 예시 · 16-bit 공간
        </div>
        <h4 className="text-[17px] font-medium text-text leading-snug">
          ‘이 가짜 해시 함수의 출력이 16 bit 라고 치자’
        </h4>
        <p className="text-[14px] text-text/75 leading-[1.7]">
          규칙은 단 하나:{" "}
          <span className="text-text">출력의 앞 4 bit 가 0 이면 성공</span>. 다른
          규칙은 없다. 이 4 bit 가 ‘난이도’ 에 해당. 한 시도가 성공할 확률은{" "}
          <code className="font-mono text-accent">2⁻⁴ = 1/16</code> ≈ 6.25%.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-bg/60 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_60px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>nonce</div>
          <div>hash (16-bit)</div>
          <div className="text-right">결과</div>
        </div>
        <div className="divide-y divide-edge text-[13px]">
          {trials.map((t, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 sm:grid-cols-[60px_1fr_60px] gap-3 px-4 py-2 items-baseline ${
                t.hit ? "bg-accent/[0.06]" : ""
              }`}
            >
              <div className="font-mono text-text/85">{t.nonce}</div>
              <div
                className={`font-mono ${
                  t.hit ? "text-accent" : "text-text/85"
                }`}
              >
                <span
                  className={t.hit ? "text-accent" : "text-[#f76b6b]"}
                  style={{ fontWeight: t.hit ? 700 : 400 }}
                >
                  {t.hash.slice(0, 4)}
                </span>
                {t.hash.slice(4)}
              </div>
              <div
                className={`text-right font-mono ${
                  t.hit ? "text-accent" : "text-muted"
                }`}
              >
                {t.hit ? "✓ HIT" : "miss"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
        <ToyStat label="한 시도 성공률" value="1/16" sub="≈ 6.25%" />
        <ToyStat label="평균 시도 횟수" value="~16 번" sub="첫 hit 까지" />
        <ToyStat label="더 어렵게 하려면" value="앞 0 을 더" sub="8 bit → 1/256, 12 bit → 1/4096 …" />
      </div>

      <div className="mt-2">
        <Callout title="핵심: 시도 횟수 = ‘투표 수’">
          <p className="text-[14px] text-text/75 leading-[1.7]">
            A 의 CPU 가 초당 1,000 번 시도, B 가 초당 100 번 시도.{" "}
            <span className="text-text">A 가 먼저 hit 할 확률이 ≈ 10 배 높다</span>{" "}
            (초당 시도 수에 비례). 그래서 ‘1 분 동안 누가 다음 블록을 만드는가’
            는 정확히 ‘초당 시도 수 (= 해시 파워, hashrate)’ 비율의 추첨.
          </p>
          <p className="text-[14px] text-text/65 leading-[1.7]">
            이게 바로 사토시가 말한{" "}
            <span className="text-text">one-CPU-one-vote</span> 의 운영적 의미다.
            ‘1 표’ 의 단위는 ‘초당 한 번의 SHA-256 시도’ 다. 위조 불가능한 자원
            (전기 + ASIC) 으로 측정되는 표.
          </p>
        </Callout>
      </div>
    </div>
  );
}

function ToyStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/40 p-3 space-y-1">
      <div className="text-[12px] font-semibold text-muted">
        {label}
      </div>
      <div className="font-mono text-[18px] text-accent">{value}</div>
      <div className="text-[12px] text-text/65 leading-relaxed">{sub}</div>
    </div>
  );
}

function HashChoice() {
  return (
    <section className="space-y-7">
      <div className="space-y-2">
        <p className="text-[17px] text-text/80 leading-[1.75]">
          비트코인은 SHA-256 을 한 번도 아니고{" "}
          <span className="text-text">두 번 (double-SHA256)</span> 적용한다. 이게
          왜? 이더리움은 같은 PoW 시기에도 다른 해시 (Keccak / Ethash) 를 썼다.
          왜? 두 선택의 차이가 곧 ‘어떤 채굴 생태계를 원하는가’ 의 디자인 결정.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ① 왜 SHA-256 을 두 번 거는가
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          SHA-256 은{" "}
          <span className="text-text">Merkle–Damgård</span> 구조다. 이 구조엔
          유명한 약점이 하나 있다.{" "}
          <span className="text-text">length-extension attack</span>.
        </p>
        <LengthExtensionDiagram />
        <p className="text-[14px] text-text/75 leading-[1.7]">
          공격: H(m) 과 m 의 길이만 알면, m 을 모르고도{" "}
          <code className="font-mono text-text">H(m ‖ padding ‖ x)</code> 를
          계산할 수 있다. 해시 함수의 ‘내부 상태’ 가 H(m) 자체이기 때문에 그
          상태에서 이어서 계속 압축할 수 있다. 비트코인의 헤더 해시·트랜잭션
          ID 에 이 약점이 직접 위협이 되는 경우는 드물지만, ‘방어 심층화
          (defense in depth)’ 가 사토시의 선택이었다.
        </p>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          해결책은 단순하다.{" "}
          <span className="text-text">한 번 더 해시</span>:{" "}
          <code className="font-mono text-accent">SHA256(SHA256(x))</code>. 바깥
          해시의 입력은 고정 32 byte 라 이어서 늘릴 게 없다 → 공격 무력화. 또
          만약 SHA-256 자체에 미발견 약점이 생겨도 두 번 거는 게 추가 완충.
          2008 년의 보수적 엔지니어링 선택.
        </p>
      </div>

      <div className="space-y-3 border-t border-edge/60 pt-6">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ② Ethereum 은 왜 Keccak-256 (한 번) 으로 충분한가
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          이더리움 (2015 출시) 은 이 시점에 등장한 새 해시 패밀리{" "}
          <span className="text-text">Keccak</span> 을 채택했다. Keccak 은
          Merkle–Damgård 가 아니라{" "}
          <span className="text-text">sponge construction</span> 기반.
        </p>
        <p className="text-[14px] text-text/75 leading-[1.7]">
          sponge 는 ‘입력을 흡수 → 내부 상태를 비밀로 유지 → 출력만 짜냄
          (squeeze)’. 출력이 내부 상태 그대로 노출되지 않아 length-extension
          공격이 구조적으로 불가능. 그래서 한 번만 적용해도 안전.
        </p>
        <p className="text-[14px] text-text/75 leading-[1.7]">
          참고: 이더리움이 쓰는 건 정확히는 NIST 가 표준화한 SHA-3 이 아니라{" "}
          <span className="text-text">‘original Keccak’</span> (NIST 공모 제출
          버전). 직접 원인은 타이밍 · 이더리움 Yellow Paper (2014) 가 SHA-3
          표준 확정 (FIPS 202, 2015-08) 보다 먼저 작성됐다. 그 결과 padding 한
          바이트가 미묘하게 달라 두 해시는 같은 입력에 다른 출력을 낸다 (혼동
          주의).
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          맥락: 2013 년 Snowden 폭로 + Dual_EC_DRBG (NIST 표준에 NSA 백도어가
          심어져 있었음이 확인된 사건) 로 NIST 표준화 과정 자체에 대한 신뢰가
          크게 손상된 시기였다. NIST 는 SHA-3 화 과정에서 보안 파라미터를 줄이려
          했다가 암호 커뮤니티 반발로 철회하기도 했다 (최종적으로는 padding 만
          변경). 학계 다수는 그 변경이 백도어는 아닌 걸로 보지만, ‘NIST 가
          손댄 버전보다 경쟁 원본을 쓰자’ 는 분위기가 광범위했다. 비트코인이{" "}
          <Term id="secp256k1">secp256k1</Term> 을 채택하면서 NIST 의 P-256 (
          ‘설명되지 않은 상수’) 을 피한 것과 같은 정신. 이더리움이 표준 SHA-3 이
          확정된 뒤에도 original Keccak 을 그대로 유지한 데는 이런 배경이
          있었다는 게 일반적 해석.
        </p>
      </div>

      <div className="space-y-3 border-t border-edge/60 pt-6">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ③ 같은 점: 곡선은 둘 다 secp256k1
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          흔한 오해. 이더리움이 ‘다른 곡선’ 을 쓴다고 알려져 있는데 사실 둘은{" "}
          <span className="text-text">같은 타원곡선 secp256k1</span> 을 쓴다.
          이더리움이 비트코인의 곡선 선택을 그대로 가져왔다.
        </p>
        <p className="text-[14px] text-text/75 leading-[1.7]">
          왜 secp256k1 인가? NIST 가 표준화한{" "}
          <span className="text-text">P-256 (secp256r1)</span> 은 매개변수에
          ‘설명 안 되는 magic number’ 가 있어서 NSA 가 백도어를 박았을 수
          있다는 의심이 학계에 퍼져 있었다. secp256k1 은 매개변수가 깔끔하고
          (a=0, b=7) 출처도 단순해서 그런 의심이 적다. 사토시가 P-256 대신
          이걸 쓴 이유. 비탈릭도 같은 판단.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          진짜 다른 건 <span className="text-text">‘주소 파생’ 방식</span>:
          비트코인은{" "}
          <code className="font-mono text-accent">
            RIPEMD160(SHA256(pubkey))
          </code>{" "}
          → bc1q… , 이더리움은{" "}
          <code className="font-mono text-accent">
            keccak256(pubkey)[12:32]
          </code>{" "}
          → 0x… . 같은 키쌍에서 두 체인의 주소가 다르게 나온다.
        </p>
      </div>

      <div className="space-y-3 border-t border-edge/60 pt-6">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ④ 그리고 채굴 알고리즘 · ASIC vs memory-hard
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          비트코인은 ‘퍼즐 = 단순히 SHA-256 을 두 번 빠르게 계산’. 단순하고
          메모리가 거의 필요 없어, 같은 회로를 수천만 개 박아 넣은 전용 칩{" "}
          <span className="text-text">ASIC</span> 이 압도적으로 빠르다.
        </p>

        <AsicMemoryCompare />

        <p className="text-[14px] text-text/75 leading-[1.7]">
          이더리움 (Merge 이전) 은 이걸 의도적으로 피했다. PoW 알고리즘으로{" "}
          <span className="text-text">Ethash</span> 를 만들었고, 그 핵심은{" "}
          <span className="text-text">memory-hardness</span>: 매 시도마다 약 4
          GB 짜리 데이터셋 (DAG) 의 임의 위치를 여러 번 읽어와야 함. ASIC 으로
          전용 칩을 만들어도 메모리 대역폭이 병목이 되어, GPU 와의 효율 격차가
          작게 유지되도록 설계.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          그래서 이더리움은 PoW 시기 내내 GPU 채굴이 주력이었고, 개인도 RTX
          카드 같은 범용 GPU 로 참여할 수 있었다. 반면 비트코인은 2013 년 이후
          ASIC 중심으로 산업화되었다. 두 디자인은 ‘채굴의 산업화’ 와 ‘일반 사용자
          채굴’ 사이에서 서로 다른 답을 택한 셈이다. 이더리움은 2022 년 PoS 로
          전환하며 이 게임 자체를 끝냈다.
        </p>
      </div>
    </section>
  );
}

function LengthExtensionDiagram() {
  // 작은 도식 · Merkle-Damgård 의 압축 함수가 chain 으로 이어지는 모습
  const W = 720;
  const H = 200;
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <div className="text-[13px] font-semibold text-muted mb-3">
        Merkle–Damgård · length-extension 가능
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="leArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#7a8190" />
          </marker>
        </defs>

        {/* IV 시작 */}
        <rect x={20} y={70} width={50} height={40} fill="#0a0c14" stroke="#5a6070" strokeWidth="1" />
        <text x={45} y={94} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">IV</text>

        {/* compression boxes · m1, m2, m3 */}
        {["m₁", "m₂", "m₃ ‖ pad"].map((m, i) => {
          const x = 90 + i * 130;
          return (
            <g key={i}>
              <line x1={x - 20} y1={90} x2={x} y2={90} stroke="#7a8190" strokeWidth="1" markerEnd="url(#leArr)" />
              {/* message block label */}
              <text x={x + 30} y={50} textAnchor="middle" fontSize="11" fill="#5b8def" fontFamily="JetBrains Mono">{m}</text>
              <line x1={x + 30} y1={56} x2={x + 30} y2={70} stroke="#5b8def" strokeWidth="1" markerEnd="url(#leArr)" />
              <rect x={x} y={70} width={60} height={40} fill="#1a2030" stroke="#5b8def" strokeWidth="1.2" />
              <text x={x + 30} y={94} textAnchor="middle" fontSize="11" fill="#5b8def" fontFamily="JetBrains Mono">f</text>
            </g>
          );
        })}

        {/* H(m) 출력 */}
        <line x1={460} y1={90} x2={490} y2={90} stroke="#f7931a" strokeWidth="1.4" markerEnd="url(#leArr)" />
        <rect x={490} y={70} width={70} height={40} fill="#f7931a18" stroke="#f7931a" strokeWidth="1.4" />
        <text x={525} y={94} textAnchor="middle" fontSize="11" fill="#f7931a" fontFamily="JetBrains Mono">H(m)</text>

        {/* 공격자: H(m) 을 다시 IV 처럼 재사용 */}
        <line x1={560} y1={90} x2={580} y2={90} stroke="#f76b6b" strokeWidth="1" markerEnd="url(#leArr)" strokeDasharray="3 3" />
        <text x={580} y={48} fontSize="10" fill="#f76b6b" fontFamily="JetBrains Mono">attacker’s x</text>
        <line x1={605} y1={56} x2={605} y2={70} stroke="#f76b6b" strokeWidth="1" markerEnd="url(#leArr)" strokeDasharray="3 3" />
        <rect x={580} y={70} width={50} height={40} fill="#1a0d12" stroke="#f76b6b" strokeWidth="1.2" strokeDasharray="3 3" />
        <text x={605} y={94} textAnchor="middle" fontSize="11" fill="#f76b6b" fontFamily="JetBrains Mono">f</text>

        <line x1={630} y1={90} x2={650} y2={90} stroke="#f76b6b" strokeWidth="1" markerEnd="url(#leArr)" strokeDasharray="3 3" />
        <rect x={650} y={70} width={60} height={40} fill="#f76b6b18" stroke="#f76b6b" strokeWidth="1.2" strokeDasharray="3 3" />
        <text x={680} y={94} textAnchor="middle" fontSize="10" fill="#f76b6b" fontFamily="JetBrains Mono">H(m‖x)</text>

      </svg>
      <div className="mt-3 space-y-1 text-[12px] text-text/70 leading-relaxed">
        <div>공격자는 m 을 몰라도 H(m) 을 ‘이어서’ 압축할 수 있다.</div>
        <div>
          Bitcoin 은 <span className="text-accent">SHA256(SHA256(x))</span> 를
          써서 바깥 해시 입력을 32 byte 로 고정한다.
        </div>
        <div>
          Ethereum 의 Keccak 은 sponge 구조라 출력이 내부 상태와 분리된다.
        </div>
      </div>
    </div>
  );
}

function AsicMemoryCompare() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-x-auto">
      <div className="grid grid-cols-1 sm:min-w-[640px] sm:grid-cols-[140px_1fr_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>축</div>
        <div className="text-accent">Bitcoin · SHA-256</div>
        <div className="text-accent2">Ethereum · Ethash (PoW 시기)</div>
      </div>
      <div className="divide-y divide-edge text-[14px]">
        <CmpRow
          axis="병목"
          a="ASIC 의 게이트 수 (compute-bound)"
          b="GPU/RAM 의 메모리 대역폭 (memory-bound)"
        />
        <CmpRow
          axis="필요한 메모리"
          a="거의 0 (해시 함수 자체만 캐시에)"
          b="DAG ~4 GB 가 시작, 매년 커짐"
        />
        <CmpRow
          axis="ASIC 우위"
          a="GPU 대비 ~10⁵ 배 이상"
          b="GPU 대비 대략 2-5 배 수준"
        />
        <CmpRow
          axis="개인 채굴 가능성"
          a="2013 이후 사실상 0"
          b="Merge (2022) 까지 GPU 로 가능"
        />
      </div>
      <div className="sm:min-w-[640px] px-4 py-2.5 border-t border-edge text-[12px] text-text/60 leading-[1.7]">
        <span className="text-text/80">ASIC</span> = Application-Specific
        Integrated Circuit. 한 가지 작업 (SHA-256) 만 극도로 빠르게 하도록 만든
        전용 칩. 일반 GPU 가 분당 수십억 시도면 ASIC 은 분당 수천조 시도.
        <span className="text-text/80"> · memory-hard</span> = 매 시도마다 큰
        메모리에서 의사난수 위치를 읽어와야 해서, 단순 회로 복제로는 가속이
        안 되는 알고리즘.
      </div>
    </div>
  );
}

function CmpRow({
  axis,
  a,
  b,
}: {
  axis: string;
  a: string;
  b: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:min-w-[640px] sm:grid-cols-[140px_1fr_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className="font-mono text-[12px] text-muted">{axis}</div>
      <div className="text-[13px] text-text/85 leading-[1.65]">{a}</div>
      <div className="text-[13px] text-text/85 leading-[1.65]">{b}</div>
    </div>
  );
}
