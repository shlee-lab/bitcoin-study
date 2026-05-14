"use client";

import { useEffect, useState } from "react";
import { LayerShell } from "../LayerShell";
import { Reflection, Probe, Reading, Callout, ResourceLabel } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L8GameTheory(props: LayerProps) {
  return (
    <LayerShell
      id="S9"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "마이닝 풀",
                subtitle: "pooled mining, share, 풀 시장 분포",
                body: (
                  <section className="space-y-5">
                    <p className="text-[17px] text-text/80 leading-[1.75]">
                      S8 에서 ‘퍼즐을 푸는 자가 다음 블록을 만든다’ 는 PoW 의
                      메커니즘을 봤다. 그런데 실제론 거의 모든 채굴자가{" "}
                      <span className="text-text">혼자 채굴하지 않는다</span>. 여러
                      채굴자가 해시레이트를 한곳에 모아 보상을 나눠 받는 방식을{" "}
                      <span className="text-text">pooled mining</span> 이라고 하고,
                      이때 운영되는 조직이나 서비스가{" "}
                      <span className="text-text">마이닝 풀 (mining pool)</span> 이다.
                      채굴자는 풀에 share 를 제출하고, 풀이 찾은 블록 보상을 비율대로
                      나눠 받는다. 이 구조가 만드는 전략적 행동 (selfish mining,
                      block withholding, 51%) 과 그 한계가 이 단계의 주제다.
                    </p>
                    <PooledMining />
                  </section>
                ),
              },
              {
                title: "Selfish mining",
                subtitle: "찾은 블록을 바로 공개하는 게 항상 최선일까?",
                level: "deep",
                body: (
                  <Section
                    heading="② 찾은 블록을 바로 공개하는 게 최선일까?"
                    sub="블록을 찾으면 즉시 공개하는 것이 당연해 보인다. 하지만 일정 조건에서는 블록 공개를 늦추는 편이 더 큰 이익을 만들 수 있다. 그 전략이 selfish mining 이다."
                  >
                    <SelfishDiagram />
                    <SelfishMechanic />
                    <SelfishCitations />
                  </Section>
                ),
              },
              {
                title: "Block withholding",
                subtitle: "풀 내부 방해 공작",
                level: "deep",
                body: (
                  <Section
                    heading="③ Block withholding (BWH) · 풀 내부 방해 공작"
                    sub="채굴자가 풀에 가입한 뒤, 부분 작업(share)은 정상 제출하면서도 실제 유효 블록을 찾으면 풀에 알리지 않는 공격이다. 풀의 기대 수익을 낮춰 채굴자 이탈을 유도한다."
                  >
                    <BWHMechanic />
                  </Section>
                ),
              },
              {
                title: "Feather forking",
                subtitle: "약한 검열 시도",
                level: "deep",
                body: (
                  <Section
                    heading="④ Feather forking · 약한 검열 시도"
                    sub="hashrate 가 적은 채굴자도 ‘이 트랜잭션이 들어간 블록 위에는 쌓지 않겠다’ 고 선언할 수 있다. 위협이 충분하면 다른 채굴자도 그 트랜잭션을 피하게 되고, 약한 형태의 검열이 생긴다."
                  >
                    <FeatherFork />
                  </Section>
                ),
              },
              {
                title: "사회적 합의",
                subtitle: "코드 밖에서 결정되는 것들",
                level: "case",
                body: (
                  <>
                    <Section
                      heading="⑤ 사회적 합의 계층 · 코드 밖의 결정"
                      sub="합의 규칙이 바뀌는 일은 결국 노드 운영자들의 선택이다. 채굴자 hashrate 다수가 아니라, 무엇을 유효한 블록으로 받아들일지 정하는 검증 노드들이 마지막 결정권을 가진다."
                    >
                      <SocialLayer />
                    </Section>
                    <div className="rounded-sm border border-edge bg-surface/20 p-4 text-sm leading-relaxed mt-6">
                      <h4 className="text-[16px] font-medium text-accent2 leading-snug mb-2">
                        왜 ‘정직’ 이 균형인가
                      </h4>
                      <p>
                        모든 합리적 채굴자가 정직을 선택할 때, 누구도
                        일방적으로 전략을 바꿔 더 큰 이득을 얻을 수 없다 (Nash
                        equilibrium). 위 ②~⑤ 의 어느 전략도 보통 조건에서는
                        정직하게 채굴하는 것보다 기대 수익이 낮거나, 시도하는 순간 자기
                        자산 가치를 함께 갉아먹는다.
                      </p>
                      <p className="mt-2 text-muted">
                        핵심은 ‘선의’ 가 아니라{" "}
                        <span className="text-text">‘이기심’</span> 에 기댄
                        설계라는 것. 정직이 코드로 강제되는 게 아니라{" "}
                        <span className="text-text">경제적으로 강제된다</span>.
                      </p>
                    </div>
                  </>
                ),
              },
              {
                title: "생각해보기", subtitle: "이기심에서 나온 정직, 다른 곳에도 적용될까?",
                body: (
                  <Reflection title="incentive-compatible design 의 일반성">
                    <p>
                      비트코인은 ‘참여자가 자기 이익만 추구해도 시스템 전체엔
                      바람직한 결과가 나오게’ 설계됐다. 게임이론 용어로{" "}
                      <span className="text-text">incentive-compatible</span>.
                      선의에 기대지 않는 시스템.
                    </p>
                    <p>
                      이 패턴은 다른 분산 시스템에서도 보인다: Tor 의 relay
                      운영자, BitTorrent 의 tit-for-tat, 위키의 reputation,
                      Stack Overflow 의 점수 시스템. 모두 ‘자기 이익 → 공공선’
                      의 채널을 만든 설계.
                    </p>
                    <Probe>
                      같은 원리를 어디에 더 적용할 수 있을까? 콘텐츠 모더레이션?
                      AI 학습 데이터 라벨링? 평판 시스템? 한 가지 함정 · 이기심
                      에 기댄 설계는 ‘이기심이 합리적일 때’ 만 작동한다. 비합리적
                      행위자 (이념적 공격, 정부 개입) 앞에선 어떤가?
                    </Probe>
                    <Reading label="이론 배경">
                      Mechanism Design (노벨 경제학상 2007), Hurwicz · Maskin
                      · Myerson · 비트코인이 가져다 쓴 그 이론적 토대.
                    </Reading>
                  </Reflection>
                ),
              },
            ]}
          />
        </div>
      }
    />
  );
}

function PooledMining() {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          왜 풀에 모이는가 · variance 해소
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          한 채굴자가 1 PH/s 로 솔로 채굴하면, 전 세계가 1 ZH/s 라는 가정에서
          점유율은 0.0001 % 에 불과하다. 평균적으로 블록 하나를 찾는 데 약{" "}
          <span className="text-text">19 년</span> 이 걸린다. 분산이 너무 커서 ‘운 좋으면
          매주, 운 나쁘면 30 년’ 의 도박이 된다. 풀에 참여하면 풀 전체로는 자주
          (수 시간마다) 블록을 찾고, 채굴자는 자기 hashrate 비율대로 보상을
          정산받는다.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
        <h4 className="text-[16px] font-medium text-accent2 leading-snug">
          Share = partial PoW · 어떻게 ‘일 했다’ 를 증명하나
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="text-[13px] font-semibold text-muted">
              full PoW · 진짜 블록
            </div>
            <p className="text-[14px] text-text/85 leading-[1.7]">
              헤더 해시가{" "}
              <span className="text-text">네트워크 target</span> 미만이어야
              유효하다. 실제 네트워크 target 은 매우 낮아서, 전 세계 채굴기가
              합쳐도 평균 10 분에 한 번만 성공한다.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[13px] font-semibold text-accent2">
              partial PoW · share
            </div>
            <p className="text-[14px] text-text/85 leading-[1.7]">
              풀은 ‘share difficulty’ 라는 훨씬 낮은 target 을 따로 둔다.
              채굴자가 그 낮은 target 미만의 해시를 찾을 때마다 share 로
              제출한다. share 는 통계적으로 ‘일하고 있다’ 는 증거이고, 보상
              분배의 회계 단위가 된다.
            </p>
          </div>
        </div>
        <p className="text-[14px] text-text/70 leading-[1.7]">
          비유하자면, 큰 금괴는 한 달에 한 번 나오지만 그 사이에도 광부가
          실제로 일하고 있음을 작은 자갈 (share) 로 계속 증명하는 구조다.
          자갈 개수에 비례해 일당을 나누고, 큰 금괴 (= 진짜 블록) 가 나오면
          그 시점의 보상이 풀 전체에 배분된다. share 자체는 비트코인
          네트워크에는 의미가 없고, 풀 내부 회계에만 쓰인다.
        </p>
        <p className="text-[13px] text-muted leading-[1.7]">
          대표적인 분배 모델: <span className="text-text">PPS</span> (Pay Per Share,
          share 마다 고정 지급, 풀이 운의 변동성을 흡수) ·{" "}
          <span className="text-text">PPLNS</span> (Pay Per Last N Shares,
          최근 N 개 share 에 비례, 채굴자가 변동성 일부 부담) ·{" "}
          <span className="text-text">FPPS</span> (PPS + 평균 fee 까지 포함).
        </p>
      </div>

      <PoolMarketShare />

      <Callout title="해시파워는 채굴자에게, 블록 템플릿은 풀에게">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          여기에는 중요한 비대칭이 있다. 채굴자는 전기와 장비로 해시파워를
          제공하지만, 보통 어떤 트랜잭션을 블록에 넣을지는 풀 운영자가 만든{" "}
          <span className="text-text">블록 템플릿</span> 이 정한다. 풀은 후보
          블록의 머클 루트가 들어간 작업을 채굴자에게 보내고, 채굴자는 그 위에서
          nonce 를 바꿔 유효한 해시를 찾는다.
        </p>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          그래서 해시파워는 전 세계 채굴자에게 흩어져 있어도,{" "}
          <span className="text-text">거래 선택과 검열의 실무 권한</span> 은
          풀에 모일 수 있다. 2022~2023 년 일부 미국 풀이 OFAC 제재 관련
          트랜잭션을 제외한 블록을 만든 일이 이 문제를 드러냈다.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          대응 방향은 채굴자가 직접 블록 템플릿을 고를 수 있게 만드는 것이다.
          예를 들면 <span className="text-text">Stratum V2</span> (풀과 채굴기
          사이의 통신 프로토콜 개선안), OCEAN 풀, Datum (OCEAN), BetterHash
          같은 시도가 있다. 목표는 모두 ‘템플릿 결정권을 채굴자에게 돌려주기’ 에
          가깝다.
        </p>
      </Callout>
    </div>
  );
}

function PoolMarketShare() {
  // 출처: Hashrate Index pool data, 2026-05-14 확인. 변동이 큰 스냅샷으로만 사용.
  const pools = [
    { name: "Foundry USA", share: 32.6 },
    { name: "AntPool", share: 16.1 },
    { name: "F2Pool", share: 10.4 },
    { name: "SpiderPool", share: 9.8 },
    { name: "ViaBTC", share: 8.5 },
    { name: "MARA Pool", share: 6.2 },
    { name: "기타", share: 16.4 },
  ];
  const total = pools.reduce((s, p) => s + p.share, 0);
  const top3 = pools.slice(0, 3).reduce((s, p) => s + p.share, 0);

  const W = 540;
  const H = 70;
  const pl = 0;
  const pr = 0;
  const innerW = W - pl - pr;

  let acc = 0;
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-[16px] font-medium text-text leading-snug">
          비트코인 채굴 풀 시장 점유율
        </h4>
        <span className="text-[13px] font-semibold text-muted/70">
          snapshot · 2026-05-14
        </span>
      </div>

      {/* 누적 막대 */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        {pools.map((p, i) => {
          const w = (p.share / total) * innerW;
          const x = pl + acc;
          acc += w;
          const fill =
            i === 0
              ? "#f7931a"
              : i === 1
                ? "#f7931ad0"
                : i === 2
                  ? "#5b8def"
                  : i === 3
                    ? "#5b8defb0"
                    : i === 4
                      ? "#5b8def80"
                      : i === 5
                        ? "#a0a8b8"
                        : "#3a3f4a";
          return (
            <rect
              key={p.name}
              x={x}
              y={20}
              width={w}
              height={30}
              fill={fill}
              stroke="#0d0f14"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px]">
        {pools.map((p, i) => {
          const swatch =
            i === 0
              ? "#f7931a"
              : i === 1
                ? "#f7931ad0"
                : i === 2
                  ? "#5b8def"
                  : i === 3
                    ? "#5b8defb0"
                    : i === 4
                      ? "#5b8def80"
                      : i === 5
                        ? "#a0a8b8"
                        : "#3a3f4a";
          return (
            <div key={p.name} className="flex items-center gap-2.5">
              <span
                className="inline-block w-2.5 h-2.5 shrink-0"
                style={{ backgroundColor: swatch }}
              />
              <span className="font-mono text-text/85 truncate">{p.name}</span>
              <span className="font-mono text-muted ml-auto">~ {p.share.toFixed(1)} %</span>
            </div>
          );
        })}
      </div>

      <div className="text-[13px] text-text/70 leading-[1.7] pt-1 border-t border-edge/60">
        상위 3 개 풀의 합산 점유율은{" "}
        <span className="text-accent font-medium">~ {top3.toFixed(1)} %</span> 다. 큰 풀
        몇 곳이 담합하면 51% 시나리오가 현실적인 위험으로 바뀐다. 그래서
        ‘채굴 분권 = 풀 분권’ 으로 보는 시각이 흔하지만, 위에서 본 것처럼{" "}
        <span className="text-text">hashrate 는 채굴자 (전 세계 ASIC 운영자) 가
        갖고</span> 풀은 ‘템플릿 + 보상 정산’ 만 한다는 비대칭이 있어 그렇게
        단순하지 않다.
      </div>
      <a
        href="https://hashrateindex.com/hashrate/pools"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-[12px] text-muted hover:text-accent2 border-b border-dotted border-muted/40 hover:border-accent2/60 transition-colors"
      >
        출처: Hashrate Index pool data ↗
      </a>
    </div>
  );
}

function SelfishCitations() {
  return (
    <div className="space-y-3 mt-2">
      <div className="text-[14px] font-semibold text-accent">
        참고 논문 / 사례
      </div>

      <PaperCite
        href="https://arxiv.org/abs/1311.0243"
        title="“Majority is not Enough: Bitcoin Mining is Vulnerable”"
        authors={
          <>
            Ittay Eyal, Emin Gün Sirer · Financial Cryptography 2014
          </>
        }
        body={
          <>
            Selfish mining 을 처음 제안한 논문. 이로써 PoW 채굴이{" "}
            <span className="text-text">incentive compatible 하지 않다</span>
            는 것을 보였다. 즉 ‘다수 hashrate 만 정직하면 안전하다’ 는 가정이
            성립하지 않고, 더 작은 점유에서도 비대칭 수익이 가능하다는 뜻이다.
            발표 후 10 년 넘게 분야의 표준 출발점으로 인용되고 있다.
          </>
        }
      />

      <PaperCite
        href="https://eprint.iacr.org/2015/796"
        title="“Optimal Selfish Mining Strategies in Bitcoin”"
        authors={
          <>
            Ayelet Sapirshtein, Yonatan Sompolinsky, Aviv Zohar · Financial
            Cryptography 2016
          </>
        }
        body={
          <>
            기본형 selfish mining 위에서, 채굴 전략을{" "}
            <span className="text-text">MDP (Markov Decision Process)</span> 로
            모델링하여 수학적으로 ‘최적’ 인 전략을 계산해 보였다. 그 결과 더
            낮은 α (약 23.21 % 부근) 에서도 이득이 가능하다는 것을 정량화했다.
            학계에서 selfish mining 분석의 표준 후속 결과로 다뤄진다.
          </>
        }
      />

      <PaperCite
        href="https://arxiv.org/abs/2512.01437"
        title="“Inside Qubic’s Selfish Mining Campaign on Monero: Evidence, Tactics, and Limits”"
        authors={<>Suhyeon Lee, Hyeongyeong Kim · arXiv 2025</>}
        body={
          <>
            Qubic 이 Monero (RandomX) 에서 벌였다고 주장한 selfish mining
            캠페인을 노드 데이터와 Qubic pool API 로 재구성한 분석. 논문은
            Qubic 의 평균 hashrate 점유율을 23-34 % 구간으로 추정하며, 지속적인
            51 % 통제는 관측되지 않았다고 본다. ‘외부 목적의 컴퓨트가 PoW 체인에
            들어올 수 있다’ 는 위협 모델은 의미가 있지만, 고전적 selfish mining
            모델이 예측하는 수익성은 확인되지 않았다는 쪽에 가깝다.
          </>
        }
        tone="warn"
      />
    </div>
  );
}

function PaperCite({
  href,
  title,
  authors,
  body,
  tone,
}: {
  href: string;
  title: string;
  authors: React.ReactNode;
  body: React.ReactNode;
  tone?: "warn";
}) {
  const borderColor =
    tone === "warn" ? "border-[#f76b6b]/40" : "border-accent/40";
  const bgColor =
    tone === "warn" ? "bg-[#f76b6b]/[0.04]" : "bg-accent/[0.04]";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-sm border ${borderColor} ${bgColor} hover:bg-opacity-100 transition-colors p-4 group`}
    >
      <div className="flex items-start gap-3">
        <ResourceLabel tone={tone === "warn" ? "warn" : "accent"}>
          {tone === "warn" ? "사례" : "논문"}
        </ResourceLabel>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="text-[15px] font-medium text-text leading-snug">
            {title}
          </div>
          <div className="text-[13px] text-text/70 leading-relaxed">
            {authors}
          </div>
          <div className="text-[13px] text-text/75 leading-[1.7] pt-1">
            {body}
          </div>
          <div className="text-[11px] font-mono text-accent2 group-hover:text-accent pt-0.5">
            {new URL(href).hostname} ↗
          </div>
        </div>
      </div>
    </a>
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

function SelfishDiagram() {
  // 시뮬레이션 5 단계
  // 0: 시작 · 공개된 공통 조상만
  // 1: 공격자가 N+1' 을 비밀로 채굴
  // 2: 정직이 N+1 채굴 · 공격자도 N+2' 까지 비밀로 (lead 2)
  // 3: 정직이 N+2 채굴 · 공격자도 N+3' 비밀 (lead 2 유지)
  // 4: 공격자 체인 공개 → 정직 N+1, N+2 무효화
  const TOTAL = 5;
  const STEP_MS = 2200;
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (paused) return;
    if (step >= TOTAL - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, paused]);

  const W = 620;
  const H = 240;

  // 단계별 visibility
  const v = {
    secret1: step >= 1,
    honest1: step >= 2,
    secret2: step >= 2,
    honest2: step >= 3,
    secret3: step >= 3,
    revealed: step >= 4,
  };

  const stepDesc = [
    "시작. block N 은 이미 모두가 알고 있는 공개 공통 조상이다. 정직 네트워크와 공격자는 이 블록 위에서 다음 블록을 두고 경쟁한다.",
    "공격자가 N+1' 을 먼저 찾았다. 그러나 공개하지 않고 숨김 (private lead 1).",
    "정직이 N+1 을 공개. 동시에 공격자는 비밀로 N+2' 까지 키움 (private lead 2).",
    "정직이 N+2 추가. 공격자도 N+3' 비밀 채굴 · 여전히 더 길다.",
    "공격자가 비밀 체인을 한꺼번에 broadcast. most-work 규칙으로 공격자 체인이 채택되고, 정직 N+1·N+2 는 orphan 이 된다.",
  ];

  return (
    <div className="border border-edge bg-surface/30 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[14px] font-semibold text-muted">
          Selfish mining · 두 체인의 경쟁 (시뮬레이션)
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 transition-colors ${
                  i < step
                    ? "bg-muted/60"
                    : i === step
                      ? "bg-accent"
                      : "bg-edge"
                }`}
              />
            ))}
          </div>
          <span className="text-muted ml-1.5">
            {step + 1} / {TOTAL}
          </span>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="text-muted hover:text-text border border-edge hover:border-accent/60 px-2 py-1 uppercase tracking-[0.16em] transition-colors"
            disabled={step >= TOTAL - 1}
          >
            {paused ? "▶ play" : "⏸ pause"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setPaused(true);
            }}
            className="text-muted hover:text-text border border-edge hover:border-accent/60 px-2 py-1 uppercase tracking-[0.16em] transition-colors"
          >
            ↻ replay
          </button>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="smArr"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#a0a8b8" />
          </marker>
          <marker
            id="smArrFade"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#7a8190" />
          </marker>
        </defs>

        {/* row labels */}
        <text
          x={16}
          y={30}
          fontSize="13"
          fill="#a0a8b8"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="500"
        >
          공개 체인
        </text>
        <text
          x={16}
          y={140}
          fontSize="13"
          fill="#a0a8b8"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="500"
        >
          공격자 비밀 fork
        </text>

        {/* 공통 ancestor */}
        <ChainBlock x={60} y={48} label="block N" tone="muted" />

        {/* honest blocks · 무효화는 revealed 시점에 strike + opacity */}
        <FadeGroup visible={v.honest1}>
          <ChainBlock
            x={200}
            y={48}
            label="N+1"
            tone="accent2"
            faded={v.revealed}
          />
          <line
            x1={130}
            y1={63}
            x2={200}
            y2={63}
            stroke="#a0a8b8"
            strokeWidth="1"
            markerEnd="url(#smArr)"
            opacity={v.revealed ? 0.4 : 1}
          />
        </FadeGroup>
        <FadeGroup visible={v.honest2}>
          <ChainBlock
            x={320}
            y={48}
            label="N+2"
            tone="accent2"
            faded={v.revealed}
          />
          <line
            x1={270}
            y1={63}
            x2={320}
            y2={63}
            stroke="#a0a8b8"
            strokeWidth="1"
            markerEnd="url(#smArr)"
            opacity={v.revealed ? 0.4 : 1}
          />
        </FadeGroup>

        {/* secret blocks · revealed 시점부터 dashed → solid 효과는 옵션, 여기선 dashed 유지 */}
        <FadeGroup visible={v.secret1}>
          <ChainBlock
            x={200}
            y={154}
            label="N+1'"
            tone="warn"
            dashed={!v.revealed}
            highlight={v.revealed}
          />
          <line
            x1={130}
            y1={78}
            x2={200}
            y2={169}
            stroke={v.revealed ? "#f7931a" : "#7a8190"}
            strokeWidth="1"
            strokeDasharray={v.revealed ? "" : "4 3"}
            markerEnd={`url(#${v.revealed ? "smArr" : "smArrFade"})`}
          />
        </FadeGroup>
        <FadeGroup visible={v.secret2}>
          <ChainBlock
            x={320}
            y={154}
            label="N+2'"
            tone="warn"
            dashed={!v.revealed}
            highlight={v.revealed}
          />
          <line
            x1={270}
            y1={169}
            x2={320}
            y2={169}
            stroke={v.revealed ? "#f7931a" : "#7a8190"}
            strokeWidth="1"
            strokeDasharray={v.revealed ? "" : "4 3"}
            markerEnd={`url(#${v.revealed ? "smArr" : "smArrFade"})`}
          />
        </FadeGroup>
        <FadeGroup visible={v.secret3}>
          <ChainBlock
            x={440}
            y={154}
            label="N+3'"
            tone="warn"
            dashed={!v.revealed}
            highlight={v.revealed}
          />
          <line
            x1={390}
            y1={169}
            x2={440}
            y2={169}
            stroke={v.revealed ? "#f7931a" : "#7a8190"}
            strokeWidth="1"
            strokeDasharray={v.revealed ? "" : "4 3"}
            markerEnd={`url(#${v.revealed ? "smArr" : "smArrFade"})`}
          />
        </FadeGroup>

        {/* revealed 시점 markup · 정직 블록 strike + orphan 라벨 + 공격자 채택 라벨 */}
        <FadeGroup visible={v.revealed}>
          <line
            x1={196}
            y1={63}
            x2={274}
            y2={63}
            stroke="#f76b6b"
            strokeWidth="1.4"
          />
          <line
            x1={316}
            y1={63}
            x2={394}
            y2={63}
            stroke="#f76b6b"
            strokeWidth="1.4"
          />
          <text
            x={335}
            y={26}
            textAnchor="middle"
            fontSize="11"
            fill="#f76b6b"
            fontFamily="JetBrains Mono"
            fontWeight="500"
          >
            orphan
          </text>
          <text
            x={535}
            y={114}
            textAnchor="middle"
            fontSize="11"
            fill="#f7931a"
            fontFamily="JetBrains Mono"
            fontWeight="500"
          >
            공격자 체인
          </text>
          <text
            x={535}
            y={128}
            textAnchor="middle"
            fontSize="11"
            fill="#f7931a"
            fontFamily="JetBrains Mono"
            fontWeight="500"
          >
            공개 · 채택
          </text>
        </FadeGroup>
      </svg>

      <div className="text-[13px] text-text/85 leading-[1.7] min-h-[44px] border-t border-edge/60 pt-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mr-2">
          step {step + 1}
        </span>
        {stepDesc[step]}
      </div>
    </div>
  );
}

function FadeGroup({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {children}
    </g>
  );
}

function ChainBlock({
  x,
  y,
  label,
  tone,
  dashed,
  faded,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  tone?: "muted" | "accent2" | "warn";
  dashed?: boolean;
  faded?: boolean;
  highlight?: boolean;
}) {
  const stroke =
    tone === "accent2" ? "#5b8def" : tone === "warn" ? "#f76b6b" : "#7a8190";
  const textColor =
    tone === "accent2" ? "#5b8def" : tone === "warn" ? "#f76b6b" : "#a0a8b8";
  const w = 70;
  const h = 30;
  // highlight (공격자 체인 공개 채택 시점) 일 때 fill 살짝 채우기, faded (orphan 정직 블록) 일 때 opacity ↓
  const opacity = faded ? 0.4 : 1;
  const fill = highlight ? "#f7931a18" : "#0d0f14";
  const finalStroke = highlight ? "#f7931a" : stroke;
  const finalTextColor = highlight ? "#f7931a" : textColor;
  return (
    <g
      style={{
        opacity,
        transition: "opacity 400ms ease-out",
      }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={finalStroke}
        strokeWidth="1.2"
        strokeDasharray={dashed ? "4 3" : undefined}
        style={{
          transition:
            "stroke 400ms ease-out, fill 400ms ease-out, stroke-dasharray 400ms ease-out",
        }}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        fill={finalTextColor}
        fontFamily="JetBrains Mono"
        fontWeight="500"
        style={{ transition: "fill 400ms ease-out" }}
      >
        {label}
      </text>
    </g>
  );
}

function SelfishMechanic() {
  return (
    <div className="border border-edge bg-surface/30 p-4 space-y-4">
      <div className="text-[15px] text-text/85 leading-[1.7]">
        보통은 hashrate 비중이 α 인 채굴자가 전체 보상도 α 만큼 기대한다.
        selfish mining 은 일정 조건에서 그 비율보다 더 많은 보상을 노리는
        전략이다. S7 에서 본 fork 와 orphan 상황을 우연한 사고가 아니라 의도적
        전략으로 이용하는 경우라고 보면 된다. 핵심 흐름:
      </div>
      <ol className="space-y-1.5 text-sm text-text/85 leading-relaxed list-none">
        <li>
          <span className="text-muted font-mono text-xs mr-2">1.</span> 새 블록을
          찾으면 공개하지 않는다. 정직 네트워크는 아직 모르는 옛 블록 위에서
          계속 채굴한다.
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">2.</span> 정직
          네트워크가 따라붙어 두 체인의 길이가 같아지려는 순간 비공개 체인을
          공개한다. 그러면 most-work 규칙에 따라 공격자 체인이 채택될 수 있다.
        </li>
        <li>
          <span className="text-muted text-xs mr-2">3.</span> 공격자
          블록은 모두 살아남고, 정직 채굴자가 만든 일부 블록은{" "}
          <Term id="orphan-block">orphan</Term> 으로 버려진다. 그 결과 공격자의
          보상 비중이 α 를 넘어설 수 있다.
        </li>
      </ol>

      <Callout tone="accent" title="왜 정직보다 더 받는가 · 두 갈래의 이득">
        <div className="space-y-2">
          <h5 className="text-[15px] font-medium text-accent2 leading-snug">
            ① 상대방의 채굴 이득을 무효화한다
          </h5>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            공격자 체인이 채택되는 순간 정직 채굴자가 같은 시간 동안 찾았던
            블록 (위 그림의 N+1, N+2) 은 모두{" "}
            <Term id="orphan-block">orphan</Term> 이 된다. 그 안에 있던{" "}
            <span className="text-text">coinbase + fee 보상</span> 은
            정직 채굴자 지갑에 잠시 잡혔다가 reorg 시 사라진다. 정직 채굴자가
            전기·ASIC 을 들여 한 일이 ‘없던 일’ 이 되는 셈. 같은 기간에 공격자가
            가져가는 절대 보상은 늘고, 정직이 가져가는 절대 보상은 줄어든다 ·
            전체 보상 파이는 같지만 공격자의 비율 점유는{" "}
            <span className="text-text">α 보다 커진다</span>.
          </p>
        </div>
        <div className="space-y-2 pt-1">
          <h5 className="text-[15px] font-medium text-accent2 leading-snug">
            ② 난이도 조절이 공격자에게 유리하게 움직인다
          </h5>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            비트코인은 매 2016 블록마다 ‘그 2016 개를 만드는 데 걸린 실제
            시간’ 으로 다음 시기 난이도를 조절한다 (10 분에 한 개 유지). selfish
            mining 이 일어나면 일부 hashrate 가 ‘나중에 버려질 체인’ 에 낭비되므로
            최종 채택되는 체인의 진행 속도가 실제로 느려지고, 다음 epoch 에서{" "}
            <span className="text-text">난이도가 낮춰진다</span>. 낮아진 난이도
            아래서는 같은 hashrate 로 더 많은 블록을 만들 수 있다. 공격자는 이미
            자기 보상 비율도 올렸기 때문에, 절대 보상과 시간당 보상 모두 정직
            채굴 기준보다 커질 수 있다.
          </p>
        </div>
      </Callout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm pt-1">
        <div className="border border-edge bg-surface/40 p-3">
          <div className="text-[13px] text-muted font-semibold mb-1">
            전략이 이득이 되는 조건
          </div>
          <ul className="space-y-1 text-[13px] text-text/85 leading-relaxed">
            <li>· α ≥ 약 25 %, 또는 강한 네트워크 연결성 (γ ≈ 1)</li>
            <li>· 다른 채굴자들은 같은 전략을 쓰지 않고, 대응 패치도 들어오지 않음</li>
          </ul>
        </div>
        <div className="border border-edge bg-surface/40 p-3">
          <div className="text-[13px] text-muted font-semibold mb-1">
            현실의 카운터
          </div>
          <ul className="space-y-1 text-[13px] text-text/85 leading-relaxed">
            <li>· 정직 채굴자가 동일 높이의 두 후보 중 먼저 본 쪽을 우선함</li>
            <li>· 풀들이 자체 모니터링으로 비정상 패턴 탐지</li>
            <li>· 의심받는 풀에 hashrate 를 보내지 않는 사회적 압력</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BWHMechanic() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-sm border border-edge bg-surface/40 p-3">
          <div className="text-[13px] text-muted font-semibold mb-1">
            메커니즘
          </div>
          <ul className="space-y-1 text-[13px] text-text/85 leading-relaxed">
            <li>· 공격자 풀 X 가 자기 hashrate 일부를 풀 Y 에 위장 가입시킨다</li>
            <li>· Y 에 share 만 제출하고, 유효 블록은 의도적으로 버린다</li>
            <li>· Y 의 평균 수익률이 낮아져 채굴자들이 다른 풀로 이탈한다</li>
            <li>· X 는 자기 풀 점유율을 상대적으로 키울 수 있다</li>
          </ul>
        </div>
        <div className="rounded-sm border border-edge bg-surface/40 p-3">
          <div className="text-[13px] text-muted font-semibold mb-1">
            왜 위험한가
          </div>
          <ul className="space-y-1 text-[13px] text-text/85 leading-relaxed">
            <li>· 풀 간 ‘죄수의 딜레마’ 형. 모두 BWH 를 하면 모두 손해</li>
            <li>· 전체 hashrate 자체에는 영향이 작지만, 풀 시장의 신뢰를 손상시킴</li>
            <li>· 2014 년 Eligius 풀이 BWH 공격받았다고 발표한 사례</li>
          </ul>
        </div>
      </div>
      <div className="text-[13px] text-muted leading-relaxed">
        근본 해결책은 어렵다. 일부 풀은 ‘oblivious shares’ 처럼 채굴자가 블록
        발견 여부를 미리 알 수 없게 하는 완화책을 검토해왔다. 학술적으로도
        계속 분석되는 주제다.
      </div>
    </div>
  );
}

function FeatherFork() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3 text-sm">
      <div className="text-text/85 leading-relaxed">
        공격자 hashrate α 가 51% 에 훨씬 못 미쳐도, 다른 채굴자에게{" "}
        <span className="text-text">위협</span> 으로 작용해 검열을 강제할 수
        있다는 아이디어다 (Miller, 2013).
      </div>
      <ol className="space-y-1.5 text-[13px] text-text/85 leading-relaxed list-none border-l-2 border-edge pl-4">
        <li>
          <span className="text-muted text-xs mr-2">1.</span> 공격자가
          공개 선언: ‘트랜잭션 T 가 들어간 블록 위에는 쌓지 않고, 그 블록을
          추월하려 시도하겠다’.
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">2.</span> 다른
          채굴자는 자기 블록이 무효화될까 봐 T 를 뺀 블록을 만들고, T 는 계속
          밀릴 수 있다.
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">3.</span> α 가
          10% 안팎의 hashrate 라도 기대 손실 위협이 충분하면 작동할 수 있다.
        </li>
      </ol>
      <div className="text-[13px] text-muted leading-relaxed">
        실제 관측 사례는 거의 없다. 한 채굴자가 이런 선언을 해도 다른 채굴자가
        따라주지 않을 가능성이 크고, 발각되면 평판 손실이 즉시 발생한다. 그래서
        주로 이론적 위협으로 거론된다.
      </div>
    </div>
  );
}

function SocialLayer() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3 text-sm">
      <p className="text-text/85 leading-relaxed">
        2017 년 ‘블록 크기 전쟁’ 이 대표적. 블록 크기를 늘리려는 진영 vs SegWit
        + 2계층으로 가려는 진영. 채굴자·노드 운영자·거래소·사용자가 각자 어떤
        규칙을 따를지 선택했고, 결국 한쪽 (Bitcoin) 과 다른 쪽 (Bitcoin Cash) 이
        분리되었다.
      </p>
      <p className="text-muted leading-relaxed">
        교훈: 비트코인의 합의 규칙은 ‘다수 hashrate’ 가 아니라 ‘노드 운영자들이
        무엇을 거부할지’ 가 결정한다. 채굴자는 ‘블록 만드는 권한’ 만 갖고,
        ‘무엇이 유효한 블록인지’ 는 검증 노드가 결정한다. 그래서 풀 노드를
        직접 돌리는 것이 시스템 안전에 본질적이다.
      </p>
    </div>
  );
}
