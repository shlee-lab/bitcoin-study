"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Reflection, Probe, Reading, Callout, ResourceLabel } from "../Reflection";
import { SectionHead } from "../SectionHead";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

const VIEW_W = 720;
const VIEW_H = 380;

type Node = { id: string; x: number; y: number; label: string };

const NODES: Node[] = [
  { id: "n0", x: 360, y: 190, label: "N0" },
  { id: "n1", x: 180, y: 100, label: "N1" },
  { id: "n2", x: 540, y: 100, label: "N2" },
  { id: "n3", x: 110, y: 250, label: "N3" },
  { id: "n4", x: 610, y: 250, label: "N4" },
  { id: "n5", x: 290, y: 320, label: "N5" },
  { id: "n6", x: 430, y: 320, label: "N6" },
];

const EDGES: [string, string][] = [
  ["n0", "n1"],
  ["n0", "n2"],
  ["n0", "n5"],
  ["n0", "n6"],
  ["n1", "n2"],
  ["n1", "n3"],
  ["n2", "n4"],
  ["n3", "n5"],
  ["n4", "n6"],
  ["n5", "n6"],
];

const NODE_BY_ID: Record<string, Node> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

type Pulse = { id: string; from: string; to: string; ttl: number };

export function L5Network(props: LayerProps) {
  return (
    <LayerShell
      id="S6"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "출발점",
                subtitle: "익숙한 서버 구조와 무엇이 다른가",
                body: <SystemContrast />,
              },
              {
                title: "분산과 탈중앙",
                subtitle: "비슷해 보이지만 같지 않은 말",
                body: <DistVsDecent />,
              },
              {
                title: "분산 네트워크는 왜 어려운가",
                body: <DistributedThesis />,
              },
              {
                title: "비잔틴 장군 문제 (1982)", subtitle: "Lamport·Shostak·Pease 의 고전",
                level: "case",
                body: <ByzantineGenerals />,
              },
              {
                title: "왜 노드가 많아야 하는가",
                body: <WhyManyNodes />,
              },
              {
                title: "가십 시뮬레이션", subtitle: "메시지가 퍼지는 모습",
                body: (
                  <section className="space-y-5">
                    <p className="text-[17px] text-text/70 leading-[1.7]">
                      위 명제들이 실제 네트워크에선 어떻게 구현되나. 수만 대의
                      노드가 서로에게{" "}
                      <code className="font-mono text-text">inv</code> /{" "}
                      <code className="font-mono text-text">getdata</code> /{" "}
                      <code className="font-mono text-text">block</code> 같은
                      짧은 메시지를 주고받으며 가십(gossip) 으로 새 블록을
                      퍼뜨린다.
                    </p>
                    <NetworkAnim
                      onClickNode={(key) => props.onEnter("S7", key)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <Note title="왜 가십?">
                        모든 노드가 모든 노드와 직접 연결되어 있지 않아도 된다.
                        이웃 몇 명에게만 알리면, 그들이 또 자기 이웃에게.
                        빠르고, 한 노드가 죽어도 네트워크는 계속 돈다 (
                        <span className="text-text">fault tolerance</span>).
                      </Note>
                      <Note title="뭘 주고받나">
                        새 트랜잭션 (mempool 으로), 새 블록, 그리고 “나 이거 갖고
                        있다, 필요해?” 라는 inv 알림. 작은 메시지로 큰 동기화를
                        만든다.
                      </Note>
                    </div>
                  </section>
                ),
              },
              {
                title: "노드 종류", subtitle: "Full / Pruned / SPV / Mining",
                body: (
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-[20px] font-medium tracking-tight">
                        노드 종류 · 같은 네트워크의 다른 역할
                      </h2>
                      <p className="text-[15px] text-text/70 leading-[1.7] mt-2">
                        노드는 모두 같은 모습이 아니다. 디스크·대역폭·CPU 자원에
                        따라 다른 역할을 맡고, 다른 보안·프라이버시 수준을
                        가진다.
                      </p>
                    </div>
                    <NodeKinds />
                  </section>
                ),
              },
              {
                title: "P2P 메시지 자세히", subtitle: "version / inv / getdata / block",
                level: "deep",
                body: (
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-[20px] font-medium tracking-tight">
                        위 시각화의 메시지는 정확히 무엇인가
                      </h2>
                      <p className="text-[15px] text-text/70 leading-[1.7] mt-2">
                        노드가 켜지고, 이웃을 찾고, 새 블록을 가십으로 퍼뜨리는
                        일련의 메시지 종류와 흐름.
                      </p>
                    </div>
                    <PrimitivePanel ids={["p2p"]} />
                  </section>
                ),
              },
              {
                title: "생각해보기", subtitle: "노드 100 만 개 vs 1000 개",
                body: (
                  <Reflection title="‘내가 노드를 돌린다’ 가 왜 정치적 행위인가">
                    <p>
                      한 정부가 비트코인을 진짜로 막을 수 있을까? 가능한 모든 IP
                      를 차단하면? 비트코인은 Tor·I2P 위에서도 돌고, 위성으로도
                      블록을 받고, mesh network 로도 전파된다. 노드가 많을수록
                      그 차단은 어려워진다.
                    </p>
                    <p>
                      반대로 노드가 적으면? 정부·기업이 ‘진짜 사슬’ 의 정의를
                      바꾸는 압력을 가하기 쉬워진다. 분산성은 단순히 채굴자 분포
                      가 아니라{" "}
                      <span className="text-text">검증자 분포</span> 의 문제.
                    </p>
                    <Probe>
                      ‘Don’t trust, verify’. 신뢰하지 말고 직접 검증해라. 풀
                      노드를 돌리는 사람만 진짜로 비트코인을 검증한다 (지갑·
                      거래소는 누군가의 노드를 신뢰하는 것). 노드 운영이
                      어려워질수록 비트코인은 점점 ‘은행’ 에 가까워진다.
                      어디까지가 ‘분산 시스템’ 이고 어디부터는 아닌가?
                    </Probe>
                    <Reading label="검색 키워드">
                      Eclipse attack (한 노드를 악의적 peer 로 포위해 가짜
                      사슬을 보여주기), Erlay (P2P 트래픽 효율 개선 제안).
                      분산 네트워크 자체의 보안성도 활발한 연구 영역.
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

function NodeKinds() {
  const kinds = [
    {
      name: "Full node",
      role: "모든 블록을 받아 자기가 직접 검증, 모든 UTXO 셋 보유",
      disk: "≈ 750 GB",
      privacy: "최상",
      use: "Bitcoin Core 기본. 자가 보관·검증의 표준",
      tone: "accent" as const,
    },
    {
      name: "Pruned node",
      role: "전부 검증하지만 오래된 블록 본체는 버려 디스크 절약",
      disk: "≈ 5 GB +",
      privacy: "최상",
      use: "디스크 작은 PC/라즈베리파이로 노드 운영",
    },
    {
      name: "Archival node",
      role: "Full + 모든 historical block 영구 보관, 인덱싱까지",
      disk: "≈ 1 TB+",
      privacy: "최상",
      use: "explorer, 거래소, 분석 회사",
    },
    {
      name: "SPV / light client",
      role: "헤더만 받고 본인 트랜잭션은 merkle proof 로 검증",
      disk: "≈ 80 MB",
      privacy: "낮음 (이웃 노드에 자기 주소 노출)",
      use: "모바일 지갑, 일상 결제용",
      tone: "accent2" as const,
    },
    {
      name: "Mining node",
      role: "Full node + 블록 candidate 만들고 ASIC 에 PoW 의뢰",
      disk: "≈ 750 GB",
      privacy: "최상",
      use: "채굴 풀 운영자, 솔로 채굴자",
    },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_100px_120px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>종류</div>
        <div>역할</div>
        <div>디스크</div>
        <div>프라이버시</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {kinds.map((k) => {
          const color =
            k.tone === "accent"
              ? "text-accent"
              : k.tone === "accent2"
                ? "text-accent2"
                : "text-text/85";
          return (
            <div
              key={k.name}
              className="grid grid-cols-1 sm:grid-cols-[140px_1fr_100px_120px] gap-3 px-4 py-2.5 items-baseline"
            >
              <div>
                <div className={`font-mono text-[13px] ${color}`}>{k.name}</div>
                <div className="text-xs text-muted mt-0.5">{k.use}</div>
              </div>
              <div className="text-[13px] text-text/85 leading-relaxed">
                {k.role}
              </div>
              <div className="font-mono text-[13px] text-muted">{k.disk}</div>
              <div className="text-[13px] text-muted">{k.privacy}</div>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-2.5 border-t border-edge text-[13px] text-muted leading-relaxed">
        디스크 수치는 2026 기준 대략. ‘비트코인을 쓴다’ 와 ‘비트코인을 검증한다’ 는 다른 일. 가장 강한 프라이버시
        + 검열 저항은 자기 풀/프루닝 노드에 자기 지갑을 연결하는 조합이다.
      </div>
    </div>
  );
}

function NetworkAnim({ onClickNode }: { onClickNode: (key: string) => void }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [flashes, setFlashes] = useState<Record<string, number>>({});
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function emit(from: string, ttl: number, exclude?: string) {
      if (!aliveRef.current) return;
      const neighbors: string[] = [];
      for (const [a, b] of EDGES) {
        if (a === from && b !== exclude) neighbors.push(b);
        else if (b === from && a !== exclude) neighbors.push(a);
      }
      if (neighbors.length === 0) return;

      const newPulses: Pulse[] = neighbors.map((to) => ({
        id: `${from}>${to}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        from,
        to,
        ttl,
      }));
      setPulses((p) => [...p, ...newPulses]);

      newPulses.forEach((pulse) => {
        const arrival = setTimeout(() => {
          if (!aliveRef.current) return;
          setPulses((ps) => ps.filter((p) => p.id !== pulse.id));
          setFlashes((f) => ({ ...f, [pulse.to]: (f[pulse.to] ?? 0) + 1 }));
          const fade = setTimeout(() => {
            if (!aliveRef.current) return;
            setFlashes((f) => {
              const next = { ...f };
              const val = (next[pulse.to] ?? 1) - 1;
              if (val <= 0) delete next[pulse.to];
              else next[pulse.to] = val;
              return next;
            });
          }, 380);
          timeouts.push(fade);
          if (pulse.ttl > 1) emit(pulse.to, pulse.ttl - 1, pulse.from);
        }, 800);
        timeouts.push(arrival);
      });
    }

    function tick() {
      const origin = NODES[Math.floor(Math.random() * NODES.length)];
      emit(origin.id, 2);
    }

    const startup = setTimeout(tick, 500);
    const interval = setInterval(tick, 2400);
    timeouts.push(startup);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-3">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {EDGES.map(([a, b], i) => {
            const A = NODE_BY_ID[a];
            const B = NODE_BY_ID[b];
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="#1c1f27"
                strokeWidth="1.2"
              />
            );
          })}
          <AnimatePresence>
            {pulses.map((pulse) => {
              const A = NODE_BY_ID[pulse.from];
              const B = NODE_BY_ID[pulse.to];
              return (
                <motion.circle
                  key={pulse.id}
                  initial={{ cx: A.x, cy: A.y, opacity: 0 }}
                  animate={{ cx: B.x, cy: B.y, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "linear" }}
                  r="4.5"
                  fill="#f7931a"
                />
              );
            })}
          </AnimatePresence>
        </svg>
        <div className="absolute inset-0">
          {NODES.map((node) => {
            const key = `S5:node:${node.id}`;
            return (
              <NodeButton
                key={node.id}
                node={node}
                flashing={!!flashes[node.id]}
                layoutId={key}
                onClick={() => onClickNode(key)}
              />
            );
          })}
        </div>
      </div>
      <div className="px-1 pt-2 text-xs text-muted text-center font-mono">
        주황 점 = 가십 메시지 · 노드 클릭 → 모든 노드가 합의하는 사슬(S7)로
      </div>
    </div>
  );
}

function NodeButton({
  node,
  flashing,
  layoutId,
  onClick,
}: {
  node: Node;
  flashing: boolean;
  layoutId: string;
  onClick: () => void;
}) {
  const xPct = (node.x / VIEW_W) * 100;
  const yPct = (node.y / VIEW_H) * 100;
  return (
    <div
      className="absolute"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.button
        layoutId={layoutId}
        onClick={onClick}
        style={{ borderWidth: 1.5, borderStyle: "solid" }}
        className="w-12 h-12 rounded-full bg-bg flex items-center justify-center text-xs font-mono"
        animate={{
          borderColor: flashing ? "#f7931a" : "#2a2f3a",
          color: flashing ? "#e6e8ec" : "#7a8190",
          scale: flashing ? 1.08 : 1,
        }}
        whileHover={{ borderColor: "#f7931a", scale: 1.04 }}
        transition={{ duration: 0.2 }}
      >
        {node.label}
      </motion.button>
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

function DistributedThesis() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">왜 ‘분산 네트워크’ 인가</h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-1.5 max-w-2xl">
          앞 레이어들 (지갑·트랜잭션·UTXO·블록) 은 <em>혼자서도</em> 수학적으로
          만들 수 있다. 그러나 ‘이게 진짜 비트코인의 한 부분’ 이 되려면 한 가지가
          더 필요하다. 모르는 사람 수만 명이{" "}
          <span className="text-text">같은 사실</span> 에 동의해야 한다는 것.
          중앙 서버 없이.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ThesisCard
          n="①"
          title="중심이 없다"
          body="DNS seed 와 peer-to-peer 만으로 노드들이 서로를 찾는다. 비트코인 본부는 없다. 임의의 한 노드를 제거한다고 네트워크가 멈추지 않는다."
        />
        <ThesisCard
          n="②"
          title="이웃을 못 믿는다"
          body="연결된 peer 가 가짜 블록·잘못된 트랜잭션·낡은 데이터를 보낼 수 있다. 그래서 모든 노드는 모든 메시지를 자기가 다시 검증한다. ‘trust nothing, verify everything.’"
        />
        <ThesisCard
          n="③"
          title="합의 = 다수가 같은 사슬"
          body="같은 규칙 (consensus rules) 을 따르는 노드들이 같은 사슬에 도달한다. 룰이 다르면 다른 사슬로 갈라진다. 그게 fork. 이걸 안전하게 하는 게 다음 레이어들의 일."
          tone="accent"
        />
      </div>

      <div className="border-l-2 border-accent2/50 pl-4 py-1.5 text-sm leading-relaxed">
        <SectionHead
          eyebrow="문제의 본질"
          title="신뢰할 수 없는 참가자들 사이에서 합의를 어떻게 만드나"
          hint={
            <>
              컴퓨터 과학에선 이걸 60 년째 연구해 왔다. 비트코인의 답이 등장한
              건 2008 년. 그 이전엔 ‘신뢰 없는 환경에서 분산 합의는 불가능에
              가까운 어려운 문제’ 라고 여겨졌다 (FLP impossibility, CAP theorem
              등). 다음 단계에서 그 고전적 문제 (비잔틴 장군) 부터.
            </>
          }
        />
      </div>
    </section>
  );
}

function ThesisCard({
  n,
  title,
  body,
  tone,
}: {
  n: string;
  title: string;
  body: string;
  tone?: "accent";
}) {
  const accentClass = tone === "accent" ? "text-accent" : "text-accent2";
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono ${accentClass}`}>{n}</span>
        <span className="text-[15px] font-medium text-text">{title}</span>
      </div>
      <div className="text-[13px] text-text/85 leading-relaxed">{body}</div>
    </div>
  );
}

function ByzantineGenerals() {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">비잔틴 장군 문제</h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2">
          분산 시스템이 풀어야 할{" "}
          <span className="text-text">‘악의적 참가자가 섞여 있는 환경에서의 합의’</span>{" "}
          문제의 원형. 비트코인이 등장하기 전엔 이 문제 자체가 ‘풀 수 없거나, 풀려도
          상상하기 어려운’ 영역이었다.
        </p>
      </div>

      <CityScene />

      <div className="space-y-4">
        <CalloutBlock label="상황">
          비잔틴 군대가 한 도시를 포위했다. 장군들은 각자 떨어진 진영에 있고,
          전령(messenger) 으로만 통신할 수 있다. 모두가 ‘공격’ 또는 ‘퇴각’ 중
          하나의 같은 결정에 도달해야 이긴다. 흩어져 행동하면 진다.
        </CalloutBlock>
        <CalloutBlock label="문제" tone="warn">
          장군 중 일부가{" "}
          <span className="text-[#f76b6b]">배신자 (Byzantine)</span>. 다른
          장군에게 거짓을 전달하거나, 사람마다 다른 메시지를 보낼 수 있다.
          전령이 늦거나 잡히기도 한다. 이런 환경에서 ‘충성스러운 장군들끼리는
          모두 같은 결정에 도달’ 할 수 있나?
        </CalloutBlock>
        <CalloutBlock label="고전 결과 (Lamport et al., 1982)">
          메시지에 서명이 없는 모델에선{" "}
          <span className="text-text">전체의 1/3 미만만 배신자</span> 일 때만
          합의 가능 (3f+1 정리). 서명을 추가하면 더 많은 배신자도 견딘다.
          그러나 모든 답은 ‘메시지를 여러 라운드 주고받기’ 라는 비싼 통신을
          요구했다. 수만 명 규모로는 사실상 불가능. 게다가{" "}
          <Term id="flp">FLP</Term> 결과까지 합치면, 비동기 환경에서 단 한 명만
          장애가 나도 결정론적 합의는 못 끝날 수 있다는 게 증명되어 있었다.
        </CalloutBlock>
      </div>

      <a
        href="https://lamport.azurewebsites.net/pubs/byz.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-sm border border-accent/40 bg-accent/[0.04] hover:bg-accent/[0.08] transition-colors p-5 group"
      >
        <div className="flex items-start gap-4">
          <ResourceLabel>논문</ResourceLabel>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-medium text-text leading-snug">
              “The Byzantine Generals Problem”
            </div>
            <div className="text-[14px] text-text/70 mt-1.5 leading-relaxed">
              <Term id="lamport">Leslie Lamport</Term>, Robert Shostak, Marshall
              Pease · ACM TOPLAS, 1982
            </div>
            <div className="text-[13px] text-muted leading-relaxed mt-2">
              이 논문이 워낙 유명해진 덕에, 분산 시스템 연구에선 ‘악의적으로
              임의의 거짓·모순 행동을 하는 노드’ 를{" "}
              <span className="text-text">Byzantine node</span> 라고 부르는 것이
              표준 용어로 자리 잡았다 (단순히 ‘crash 해서 죽는’ 노드와 구분).
              이후 모든 BFT (Byzantine Fault Tolerant) 알고리즘 이름이 여기서
              왔다.
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-mono text-accent2 group-hover:text-accent">
              lamport.azurewebsites.net/pubs/byz.pdf ↗
            </div>
          </div>
        </div>
      </a>

      <ByzantineDiagram />

      <div className="rounded-sm border border-accent/50 bg-accent/[0.05] p-5 space-y-4">
        <div>
          <div className="font-mono text-[12px] tracking-[0.12em] text-accent mb-2">
            비트코인의 답 · 26 년 뒤
          </div>
          <h3 className="text-[18px] font-medium text-text leading-snug">
            메시지로 합의하지 말고, 작업증명으로 결정하자
          </h3>
        </div>
        <p className="text-[15px] text-text/85 leading-[1.7]">
          장군들이 라운드마다 메시지를 주고받는 대신{" "}
          <span className="text-text">계산 비용 (proof-of-work)</span> 을 매개로
          합의를 만든다. 매 ~10 분마다 ‘퍼즐을 가장 먼저 푼 장군’ 의 결정을 모두가
          따른다. 배신자가 결정을 뒤집으려면 정직한 다수보다 더 큰 계산력을 가져야 한다. 즉 거짓이 곧 비용을 부른다.
        </p>
        <p className="text-[15px] text-text/85 leading-[1.7]">
          이걸 <span className="text-text">Nakamoto consensus</span> 라고 부른다.
          비잔틴 합의의 ‘메시지 라운드’ 를 ‘에너지 라운드’ 로 바꾼 셈.
          전통 BFT 처럼 정확한 100% 결정성은 포기하지만 (확률적 finality), 그
          대가로 수만 명 규모로 확장되는 첫 합의 시스템이 된다.
        </p>
        <p className="text-[14px] text-text/70 leading-[1.7]">
          이 모델의 보안 한계: 정직한 채굴자의 hashrate 합이 50% 를 넘는 한 안전.
          이 ‘50% 가정’ 이 비트코인 보안의 핵심 가설. PoW 자체는 다음 두 레이어
          (S7 사슬 / S8 채굴) 에서 자세히.
        </p>
      </div>
    </section>
  );
}

function CalloutBlock({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: "warn";
  children: React.ReactNode;
}) {
  const border = tone === "warn" ? "border-[#f76b6b]/50" : "border-accent2/50";
  return (
    <div className={`border-l-2 ${border} pl-5 py-1 space-y-2`}>
      <h4 className="text-[17px] font-medium text-text leading-snug">
        {label}
      </h4>
      <div className="text-[15px] text-text/80 leading-[1.7]">{children}</div>
    </div>
  );
}

function CityScene() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 600 240"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 하늘 / 지면 그라디언트 */}
        <defs>
          <linearGradient id="csSky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a0c14" />
            <stop offset="100%" stopColor="#161821" />
          </linearGradient>
          <linearGradient id="csGround" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1c1f27" />
            <stop offset="100%" stopColor="#0d0f14" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={600} height={170} fill="url(#csSky)" />
        <rect x={0} y={170} width={600} height={70} fill="url(#csGround)" />

        {/* 달 */}
        <circle cx={520} cy={40} r={14} fill="#e6e8ec" opacity={0.9} />
        <circle cx={524} cy={36} r={10} fill="#0a0c14" opacity={0.55} />

        {/* 별 */}
        {[
          [60, 30], [110, 50], [180, 25], [250, 45], [430, 30], [470, 60], [560, 80],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.2} fill="#e6e8ec" opacity={0.7} />
        ))}

        {/* 가운데: 성벽 + 도시 */}
        <g transform="translate(225 80)">
          {/* 도시 (성벽 안 건물 실루엣) */}
          <rect x={20} y={28} width={20} height={62} fill="#2a2f3a" />
          <rect x={50} y={20} width={30} height={70} fill="#2a2f3a" />
          <rect x={88} y={32} width={22} height={58} fill="#2a2f3a" />
          <rect x={118} y={24} width={20} height={66} fill="#2a2f3a" />
          {/* 깃발 (방어자) */}
          <line x1={65} y1={20} x2={65} y2={4} stroke="#a0a8b8" strokeWidth="1" />
          <path d="M65 4 L78 8 L65 12 Z" fill="#5b8def" />

          {/* 성벽 */}
          <rect x={0} y={66} width={150} height={28} fill="#3a3f4a" stroke="#7a8190" strokeWidth="1" />
          {/* crenellations · 성가퀴 */}
          {[0, 18, 36, 54, 72, 90, 108, 126].map((dx, i) => (
            <rect key={i} x={dx + 4} y={56} width={10} height={10} fill="#3a3f4a" stroke="#7a8190" strokeWidth="1" />
          ))}
          {/* 성문 */}
          <rect x={66} y={74} width={18} height={20} fill="#0d0f14" stroke="#7a8190" strokeWidth="1" />
          {/* 라벨 */}
          <text x={75} y={108} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">
            target city
          </text>
        </g>

        {/* 장군 무리 (왼쪽) */}
        <g transform="translate(40 130)">
          <General color="#5b8def" label="G1" />
          <g transform="translate(46 8)">
            <General color="#5b8def" label="G2" />
          </g>
          <g transform="translate(20 38)">
            <General color="#5b8def" label="G3" />
          </g>
        </g>

        {/* 장군 무리 (오른쪽) */}
        <g transform="translate(490 130)">
          <General color="#5b8def" label="G4" />
          <g transform="translate(40 10)">
            <General color="#f76b6b" label="G5" traitor />
          </g>
          <g transform="translate(10 40)">
            <General color="#5b8def" label="G6" />
          </g>
        </g>

        {/* 말풍선들 */}
        <Bubble x={50} y={88} text="공격?" tone="accent2" />
        <Bubble x={530} y={88} text="퇴각?" tone="accent2" />
        <Bubble x={365} y={210} text="너희는 공격, 너희는 퇴각" tone="warn" pointerUp />

      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        충성스러운 장군 5 명과 배신자 1 명이 모두 같은 결정에 도달할 수 있는지
        묻는 고전적 합의 문제다.
      </div>
    </div>
  );
}

function General({
  color,
  label,
  traitor,
}: {
  color: string;
  label: string;
  traitor?: boolean;
}) {
  return (
    <g>
      {/* 몸통 (망토) */}
      <path d="M0 18 L-7 28 L7 28 Z" fill={color} opacity={0.85} />
      {/* 머리 */}
      <circle cx={0} cy={12} r={5} fill="#e6e8ec" stroke={color} strokeWidth="1.2" />
      {/* 투구 깃털 */}
      <line x1={0} y1={7} x2={0} y2={2} stroke={color} strokeWidth="1.4" />
      <circle cx={0} cy={1.5} r={1.2} fill={color} />
      {traitor && (
        <text x={0} y={-4} textAnchor="middle" fontSize="9" fill="#f76b6b" fontFamily="JetBrains Mono">
          ✗
        </text>
      )}
      <text x={0} y={40} textAnchor="middle" fontSize="9" fill={color} fontFamily="JetBrains Mono" fontWeight="500">
        {label}
      </text>
    </g>
  );
}

function Bubble({
  x,
  y,
  text,
  tone,
  pointerUp,
}: {
  x: number;
  y: number;
  text: string;
  tone: "accent2" | "warn";
  pointerUp?: boolean;
}) {
  const w = text.length * 7 + 14;
  const stroke = tone === "warn" ? "#f76b6b" : "#5b8def";
  const fill = tone === "warn" ? "#f76b6b18" : "#5b8def18";
  const textColor = tone === "warn" ? "#f76b6b" : "#5b8def";
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 10}
        width={w}
        height={18}
        rx={9}
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <text x={x} y={y + 3} textAnchor="middle" fontSize="10" fill={textColor} fontFamily="JetBrains Mono">
        {text}
      </text>
      {/* pointer */}
      {pointerUp ? (
        <path d={`M ${x - 5} ${y - 10} L ${x} ${y - 16} L ${x + 5} ${y - 10} Z`} fill={fill} stroke={stroke} strokeWidth="1" />
      ) : (
        <path d={`M ${x - 5} ${y + 8} L ${x} ${y + 14} L ${x + 5} ${y + 8} Z`} fill={fill} stroke={stroke} strokeWidth="1" />
      )}
    </g>
  );
}

function ByzantineDiagram() {
  const R = 20;
  const generals = [
    { x: 100, y: 70, name: "G1", honest: true },
    { x: 340, y: 70, name: "G2", honest: false },
    { x: 380, y: 170, name: "G3", honest: true },
    { x: 220, y: 235, name: "G4", honest: true },
    { x: 60, y: 170, name: "G5", honest: true },
  ];

  // 한 점에서 다른 점으로 향하는 선분을 양 끝 원 (반지름 R) 만큼 잘라낸다
  function trim(a: { x: number; y: number }, b: { x: number; y: number }) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: a.x + ux * R,
      y1: a.y + uy * R,
      x2: b.x - ux * R,
      y2: b.y - uy * R,
    };
  }

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg viewBox="0 0 440 290" className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* edges between all (원 가장자리에서 끝나도록 trim) */}
        {generals.flatMap((a, i) =>
          generals.slice(i + 1).map((b, j) => {
            const traitor = !a.honest || !b.honest;
            const seg = trim(a, b);
            return (
              <line
                key={`${i}-${j}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={traitor ? "#f76b6b66" : "#2a2f3a"}
                strokeWidth={traitor ? "1" : "0.8"}
                strokeDasharray={traitor ? "3 3" : ""}
              />
            );
          }),
        )}

        {/* generals */}
        {generals.map((g) => (
          <g key={g.name}>
            <circle
              cx={g.x}
              cy={g.y}
              r={R}
              fill={g.honest ? "#5b8def22" : "#f76b6b22"}
              stroke={g.honest ? "#5b8def" : "#f76b6b"}
              strokeWidth="1.4"
            />
            <text x={g.x} y={g.y + 4} textAnchor="middle" fontSize="12" fill={g.honest ? "#5b8def" : "#f76b6b"} fontFamily="JetBrains Mono" fontWeight="500">
              {g.name}
            </text>
            {!g.honest && (
              <text x={g.x} y={g.y - 28} textAnchor="middle" fontSize="10" fill="#f76b6b" fontFamily="JetBrains Mono">
                배신자
              </text>
            )}
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(20,272)">
          <circle cx={6} cy={0} r={4} fill="#5b8def22" stroke="#5b8def" strokeWidth="1" />
          <text x={16} y={4} fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">충성</text>
          <circle cx={70} cy={0} r={4} fill="#f76b6b22" stroke="#f76b6b" strokeWidth="1" />
          <text x={80} y={4} fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">배신</text>
          <line x1={140} y1={0} x2={170} y2={0} stroke="#f76b6b66" strokeWidth="1" strokeDasharray="3 3" />
          <text x={178} y={4} fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">거짓 전령</text>
        </g>
      </svg>
    </div>
  );
}

function WhyManyNodes() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">노드 수가 보안이다</h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-1.5 max-w-2xl">
          비트코인의 ‘분산성’ 은 단순한 멋·이상이 아니다. 노드 수와 분포 자체가
          공격 비용·검열 비용·재해 회복력의 척도다. 노드가 100 만 대일 때와 1000
          대일 때의 비트코인은 본질적으로 다르다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ThreatCard
          name="Sybil 공격"
          short="가짜 신원 다수로 네트워크 점령"
          body="공격자가 IP·peer 슬롯을 대량 생성해 ‘다수’ 처럼 보이려는 시도. 비트코인은 합의가 IP 수가 아니라 hashrate 에 종속이라 sybil 자체가 합의 결과를 못 바꾼다. 다만 P2P 라우팅·peer discovery 단계는 영향을 받는다."
        />
        <ThreatCard
          name="Eclipse 공격"
          short="한 노드를 가짜 peer 로 둘러싸기"
          body="피해자 노드의 8 개 outbound + 117 개 inbound 슬롯을 공격자 IP 로 모두 차지하면, 그 노드는 ‘공격자 우주’ 에서 살게 된다. 가짜 사슬·이중지출이 가능. 노드 수가 많고 IP 다양성이 클수록 어려워짐."
        />
        <ThreatCard
          name="국가급 검열"
          short="ISP·국경에서 트래픽 차단"
          body="중국 GFW 처럼 비트코인 P2P 포트(8333)를 차단하면? Tor·I2P 위 노드, 위성 (Blockstream Satellite), 메시 네트워크 (Goldfish/LoRa) 가 우회 경로. 노드 분포가 한 나라·한 ISP 에 몰리면 한 정부가 사슬을 잘라낼 수 있다."
          tone="accent"
        />
        <ThreatCard
          name="단일점 실패"
          short="허브가 죽으면 같이 죽는다"
          body="아키텍처가 ‘몇 개의 큰 노드 + 많은 작은 client’ 라면, 큰 노드 운영자에 모든 권력. 비트코인은 의도적으로 ‘작은 노드 라즈베리파이로도 가능’ 한 자원 한도 (블록 1MB, UTXO 적당히) 안에서 설계되었다."
        />
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-edge font-mono text-[13px] text-muted">
          노드 수 × 결과 (대략)
        </div>
        <div className="divide-y divide-edge text-sm">
          <NodeCountRow
            n="~ 1,000"
            outcome="중앙화 클러스터에 가까움. 정부·대기업이 마음먹으면 사슬 통제 가능. ‘은행과 다를 게 없는’ 시스템."
            tone="bad"
          />
          <NodeCountRow
            n="~ 50,000"
            outcome="현재 비트코인 (대략). 운영 비용이 낮아 개인이 쉽게 합류. 다양한 국가·ISP·플랫폼."
            tone="ok"
          />
          <NodeCountRow
            n="100 만 +"
            outcome="실질적으로 검열·차단 불가능. 단점은 P2P 트래픽 폭증, 그래서 Erlay/Compact Blocks 같은 효율 개선이 활발."
            tone="good"
          />
        </div>
      </div>

      <div className="rounded-sm border border-edge bg-surface/20 p-4 text-sm text-text/85 leading-relaxed space-y-1.5">
        <div className="text-[13px] text-accent2 font-semibold">
          주의 · 채굴자 분포 vs 검증자 분포
        </div>
        <p>
          ‘채굴자가 많다’ 와 ‘노드 (검증자) 가 많다’ 는 다른 분포다. 채굴 hashrate
          가 한 풀에 몰려도, 풀 노드를 돌리는 사람이 많으면 그 풀이 룰 위반 블록을
          뿌려도 모두가 거부한다. 즉{" "}
          <span className="text-text">검증자 다수성이 채굴자 집중을 견제</span>한다.
        </p>
        <p className="text-text/70">
          그래서 Bitcoin Core 의 자원 한도 정책 (작은 블록, ‘너의 라즈베리파이로도
          돌릴 수 있어야 한다’) 는 단순한 보수성이 아니라 보안 정책이다.
        </p>
      </div>
    </section>
  );
}

function ThreatCard({
  name,
  short,
  body,
  tone,
}: {
  name: string;
  short: string;
  body: string;
  tone?: "accent";
}) {
  const accentClass = tone === "accent" ? "text-accent" : "text-accent2";
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <span className={`text-[15px] font-semibold ${accentClass} leading-snug`}>
          {name}
        </span>
      </div>
      <div className="text-[14px] font-medium text-text">{short}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{body}</div>
    </div>
  );
}

function NodeCountRow({
  n,
  outcome,
  tone,
}: {
  n: string;
  outcome: string;
  tone: "bad" | "ok" | "good";
}) {
  const color =
    tone === "bad" ? "text-[#f76b6b]" : tone === "good" ? "text-accent" : "text-accent2";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className={`font-mono text-[14px] ${color}`}>{n}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{outcome}</div>
    </div>
  );
}

function SystemContrast() {
  return (
    <section className="space-y-7">
      <div>
        <p className="text-[17px] text-text/80 leading-[1.7]">
          비트코인 백서의 제목은{" "}
          <span className="text-text">‘Bitcoin: A Peer-to-Peer Electronic Cash System’</span>{" "}
          (Satoshi Nakamoto, 2008). 우리는 지금까지 이 제목의 뒷부분 ·{" "}
          <span className="text-text">electronic cash</span> · ‘전자 현금이
          어떻게 서명되고 (S3) 기록되는지 (S4 ~ S5)’ 를 봤다. 이제 앞부분 ·{" "}
          <span className="text-text">peer-to-peer</span> · ‘그게 도대체 어떤
          네트워크 위에서 일어나는가’ 를 본다. 중앙 서버 한 대가 진실을
          발표하면 끝나는 시스템이 아니어서, 이 단계가 비트코인의 가장 어려운
          문제다.
        </p>
        <h2 className="text-[20px] font-medium tracking-tight pt-3">우리가 익숙한 시스템은 어떤 모습인가</h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2">
          은행, 카드사, 거래소: 모두 한 가운데 있는{" "}
          <span className="text-text">서버 (와 그것을 운영하는 회사)</span> 가
          ‘진실의 출처’ 다. 우리는 그 회사를 신뢰하기로 합의해서 시스템이 굴러간다.
          비트코인은 정확히 그 ‘진실의 한 출처’ 가 없는 환경에서 같은 일을 해내려고
          한다.
        </p>
      </div>

      <SystemDiagram />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContrastCard
          mode="중앙 시스템 (client–server)"
          examples="은행, Slack, Gmail"
          truth="‘진실’ = 본부 서버의 DB 기록"
          fail="서버 죽으면 시스템 정지"
          censor="회사가 계정 정지 → 즉시 차단"
          tone="muted"
        />
        <ContrastCard
          mode="분산 시스템 (peer-to-peer)"
          examples="비트코인, BitTorrent, Tor, mesh net"
          truth="‘진실’ = 다수 노드의 합의된 사슬"
          fail="노드 일부 죽어도 계속 동작"
          censor="모든 노드를 동시에 막아야 차단 가능"
          tone="accent"
        />
      </div>

      <Callout title="핵심 전환">
        <p className="text-[15px] text-text/80 leading-[1.7]">
          ‘누구를 믿을 것인가’ 가 사라지고{" "}
          <span className="text-text">‘다수의 합의된 기록을 어떻게 만드냐’</span>{" "}
          가 새 문제로 등장. 그 문제는 사실 컴퓨터과학이 60 년 째 풀어온 고전적
          난제. 이걸 비트코인은 새로운 방식으로 풀었다.
        </p>
      </Callout>
    </section>
  );
}

function SystemDiagram() {
  // 두 점 사이 선분을 양 끝 반지름만큼 잘라낸다 (원/사각형 가장자리에서 시작·끝)
  function trim(
    a: { x: number; y: number; r: number },
    b: { x: number; y: number; r: number },
  ) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: a.x + ux * a.r,
      y1: a.y + uy * a.r,
      x2: b.x - ux * b.r,
      y2: b.y - uy * b.r,
    };
  }

  // LEFT: client-server. server 중심 (130, 108), 사각형이지만 trim 용 반지름 ≈ 26
  const server = { x: 130, y: 108, r: 26 };
  const clients = [
    { x: 40, y: 40, r: 11 },
    { x: 220, y: 40, r: 11 },
    { x: 40, y: 180, r: 11 },
    { x: 220, y: 180, r: 11 },
    { x: 10, y: 110, r: 11 },
    { x: 250, y: 110, r: 11 },
  ];

  // RIGHT: peer-to-peer · 메시 노드들
  const peers = [
    { x: 330, y: 50 },
    { x: 410, y: 40 },
    { x: 490, y: 50 },
    { x: 320, y: 110 },
    { x: 410, y: 110 },
    { x: 500, y: 110 },
    { x: 330, y: 170 },
    { x: 410, y: 180 },
    { x: 490, y: 170 },
  ].map((p) => ({ ...p, r: 11 }));

  const meshEdges: [number, number][] = [
    [0, 1], [1, 2], [0, 3], [2, 5],
    [3, 4], [4, 5], [3, 6], [5, 8],
    [6, 7], [7, 8], [1, 4], [4, 7],
  ];

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-5">
      <svg viewBox="0 0 540 240" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="sysArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#7a8190" />
          </marker>
        </defs>

        {/* === LEFT: client-server === */}
        <text x={130} y={22} textAnchor="middle" fontSize="13" fill="#a0a8b8" fontFamily="JetBrains Mono" fontWeight="500">
          중앙 (client–server)
        </text>

        {/* 선이 먼저 (클라이언트 → 서버), 원/사각형이 위에 덮음 */}
        {clients.map((c, i) => {
          const seg = trim(c, server);
          return (
            <line
              key={i}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="#5a6070"
              strokeWidth="0.8"
              markerEnd="url(#sysArr)"
            />
          );
        })}

        {/* 클라이언트 원들 (선 위로) */}
        {clients.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={9} fill="#0d0f14" stroke="#7a8190" strokeWidth="1" />
        ))}

        {/* 서버 박스 (선 위로) */}
        <rect x={100} y={90} width={60} height={36} fill="#0d0f14" stroke="#a0a8b8" strokeWidth="1.4" />
        <text x={130} y={113} textAnchor="middle" fontSize="12" fill="#e6e8ec" fontFamily="JetBrains Mono">server</text>

        {/* 캡션 (선 영역에서 충분히 떨어진 자리) */}
        <text x={130} y={222} textAnchor="middle" fontSize="11" fill="#7a8190" fontFamily="JetBrains Mono">
          단일 진실 출처
        </text>

        {/* divider */}
        <line x1={278} y1={20} x2={278} y2={222} stroke="#1c1f27" strokeWidth="1" strokeDasharray="3 4" />

        {/* === RIGHT: peer-to-peer === */}
        <text x={410} y={22} textAnchor="middle" fontSize="13" fill="#5b8def" fontFamily="JetBrains Mono" fontWeight="500">
          분산 (peer-to-peer)
        </text>

        {/* mesh edges 먼저 (trim 으로 원 가장자리에서) */}
        {meshEdges.map(([i, j], k) => {
          const seg = trim(peers[i], peers[j]);
          return (
            <line
              key={k}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="#5b8def"
              strokeWidth="0.8"
              opacity={0.55}
            />
          );
        })}

        {/* peer 원들 (선 위로) */}
        {peers.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={10} fill="#5b8def22" stroke="#5b8def" strokeWidth="1.2" />
        ))}

        <text x={410} y={222} textAnchor="middle" fontSize="11" fill="#7a8190" fontFamily="JetBrains Mono">
          모두가 검증·전파
        </text>
      </svg>
    </div>
  );
}

function ContrastCard({
  mode,
  examples,
  truth,
  fail,
  censor,
  tone,
}: {
  mode: string;
  examples: string;
  truth: string;
  fail: string;
  censor: string;
  tone: "muted" | "accent";
}) {
  const accent = tone === "accent" ? "text-accent" : "text-muted";
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-3">
      <div className={`text-[13px] font-semibold ${accent}`}>
        {mode}
      </div>
      <div className="text-[14px] text-text/85 leading-[1.65]">
        <span className="text-muted">예:</span> {examples}
      </div>
      <div className="space-y-2 pt-1 border-t border-edge/70">
        <Row label="진실의 출처" body={truth} />
        <Row label="장애" body={fail} />
        <Row label="검열" body={censor} />
      </div>
    </div>
  );
}

function Row({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 text-[13px]">
      <div className="text-muted font-mono">{label}</div>
      <div className="text-text/85 leading-[1.6]">{body}</div>
    </div>
  );
}

function DistVsDecent() {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">‘분산 (distributed)’ 과 ‘탈중앙 (decentralized)’ 은 다르다</h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2">
          영어 토론에서 종종 같이 쓰이지만, 시스템 디자인 관점에선 서로 다른
          축이다. 두 축을 분리하면 비트코인이 정확히 어디에 자리 잡았는지가 보인다.
        </p>
      </div>

      <AxisDiagram />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <h3 className="text-[18px] font-medium text-accent2">
            distributed <span className="text-text/70 font-normal">· 분산</span>
          </h3>
          <div className="text-[15px] text-text font-medium leading-snug">
            여러 컴퓨터가 일을 나눠 처리한다
          </div>
          <p className="text-[14px] text-text/70 leading-[1.7]">
            구글 검색은 수만 대 서버에 ‘분산’ 되어 있지만, 그 모든 서버는 한
            회사 (Google) 에 속한다. 운영·결정·이익이 한 곳에 집중. 분산은
            아키텍처 속성.
          </p>
        </div>
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <h3 className="text-[18px] font-medium text-accent">
            decentralized <span className="text-text/70 font-normal">· 탈중앙</span>
          </h3>
          <div className="text-[15px] text-text font-medium leading-snug">
            결정권·소유권이 다수 주체에 흩어져 있다
          </div>
          <p className="text-[14px] text-text/70 leading-[1.7]">
            한 사람·한 조직이 시스템을 일방적으로 멈추거나 규칙을 바꿀 수 없음.
            Bitcoin Core 코드는 누구나 fork 할 수 있고, 노드 운영자 다수가 어떤
            버전을 돌릴지 ‘투표’ 한다. 거버넌스 속성.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>시스템</div>
          <div>분산도</div>
          <div>탈중앙도</div>
        </div>
        <div className="divide-y divide-edge text-[14px]">
          <DDRow name="은행 본점 1 대 서버" dist="0" decent="0" />
          <DDRow name="구글 클라우드" dist="높음" decent="0" />
          <DDRow name="이메일 (SMTP)" dist="높음" decent="중간" />
          <DDRow name="비트코인" dist="높음" decent="높음" tone="accent" />
        </div>
      </div>

      <Callout title="왜 둘 다 필요한가">
        <p className="text-[15px] text-text/80 leading-[1.7]">
          분산만 있고 탈중앙이 없으면 (= 큰 회사의 분산 시스템) 결국 그 회사가
          멈추거나 규칙을 바꾸면 끝난다. 탈중앙만 있고 분산이 없으면 (= 종이 합의)
          확장되지 않는다. 비트코인은 두 축을 동시에 노린다. 그 어려움이 곧 다음
          단계 (비잔틴 장군) 의 주제다.
        </p>
      </Callout>

      <a
        href="https://medium.com/@VitalikButerin/the-meaning-of-decentralization-a0c92b76a274"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-sm border border-accent/40 bg-accent/[0.04] hover:bg-accent/[0.08] transition-colors p-4 group"
      >
        <div className="flex items-start gap-3">
          <div className="font-mono text-[12px] tracking-[0.12em] text-accent shrink-0 pt-0.5">
            읽어볼 거리
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] text-text/90 leading-[1.55] font-medium">
              Vitalik Buterin · ‘The Meaning of Decentralization’
            </div>
            <p className="text-[13px] text-text/65 mt-1 leading-[1.6]">
              이더리움 창시자가 2017 년 Medium 에 쓴 짧은 에세이. ‘탈중앙’ 을{" "}
              <span className="text-text/85">architectural / political / logical</span>{" "}
              세 축으로 분리해 정의. 위 표의 ‘분산 vs 탈중앙’ 분리가 왜 의미
              있는지 더 깊이 다룬다.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-mono text-accent2 group-hover:text-accent">
              medium.com/@VitalikButerin ↗
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

function AxisDiagram() {
  // 차트 영역: x = 90 ~ 580, y = 70 ~ 360
  const PL = 90;
  const PR = 580;
  const PT = 70;
  const PB = 360;

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-5">
      <svg viewBox="0 0 620 410" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="axArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#a0a8b8" />
          </marker>
        </defs>

        {/* gridlines */}
        {[140, 215, 290].map((y) => (
          <line key={`gh${y}`} x1={PL} y1={y} x2={PR - 10} y2={y} stroke="#1c1f27" strokeWidth="0.6" strokeDasharray="2 4" />
        ))}
        {[210, 335, 460].map((x) => (
          <line key={`gv${x}`} x1={x} y1={PT} x2={x} y2={PB - 10} stroke="#1c1f27" strokeWidth="0.6" strokeDasharray="2 4" />
        ))}

        {/* axes */}
        <line x1={PL} y1={PB} x2={PR + 10} y2={PB} stroke="#a0a8b8" strokeWidth="1.4" markerEnd="url(#axArr)" />
        <line x1={PL} y1={PB} x2={PL} y2={PT - 10} stroke="#a0a8b8" strokeWidth="1.4" markerEnd="url(#axArr)" />

        {/* === axis titles === */}
        {/* X axis title · 차트 아래 가운데 */}
        <text x={(PL + PR) / 2} y={PB + 38} textAnchor="middle" fontSize="14" fill="#e6e8ec" fontFamily="JetBrains Mono" fontWeight="600">
          분산도 (distribution)
        </text>

        {/* Y axis title · 세로로 회전, 왼쪽 바깥에 충분한 여유 */}
        <text
          x={28}
          y={(PT + PB) / 2}
          textAnchor="middle"
          fontSize="14"
          fill="#e6e8ec"
          fontFamily="JetBrains Mono"
          fontWeight="600"
          transform={`rotate(-90 28 ${(PT + PB) / 2})`}
        >
          탈중앙도 (decentralization)
        </text>

        {/* axis tick labels */}
        <text x={PL} y={PB + 18} textAnchor="middle" fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">low</text>
        <text x={PR} y={PB + 18} textAnchor="middle" fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">high</text>
        <text x={PL - 12} y={PB + 4} textAnchor="end" fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">low</text>
        <text x={PL - 12} y={PT + 4} textAnchor="end" fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">high</text>

        {/* === 사분면 라벨 · Bitcoin 점이 있는 우상단은 비워둠 === */}
        <text x={PL + 14} y={PT + 18} fontSize="11" fill="#7a8190" fontFamily="JetBrains Mono" fontStyle="italic">
          탈중앙은 강하나 규모 어려움
        </text>
        <text x={PR - 14} y={PB - 12} textAnchor="end" fontSize="11" fill="#7a8190" fontFamily="JetBrains Mono" fontStyle="italic">
          큰 회사의 분산 인프라
        </text>

        {/* === 비-블록체인 anchor === */}
        <Dot cx={140} cy={325} r={5} kind="muted" />
        <DotLabel x={140} y={325} dx={11} dy={4} text="은행 1 대 서버" />

        <Dot cx={520} cy={325} r={5} kind="muted" />
        <DotLabel x={520} y={325} dx={-11} dy={4} text="Google Cloud" anchor="end" />

        <Dot cx={420} cy={230} r={5} kind="muted" />
        <DotLabel x={420} y={230} dx={11} dy={4} text="이메일 (SMTP)" />

        <Dot cx={170} cy={120} r={5} kind="muted" />
        <DotLabel x={170} y={120} dx={11} dy={4} text="종이 회의 합의" />

        {/* === 블록체인 === */}
        {/* 중앙화 쪽 */}
        <Dot cx={235} cy={305} r={6} kind="warn" />
        <DotLabel x={235} y={305} dx={11} dy={4} text="Ripple (XRP)" tone="warn" />

        <Dot cx={275} cy={265} r={6} kind="warn" />
        <DotLabel x={275} y={265} dx={11} dy={4} text="BSC (21 validator)" tone="warn" />

        {/* 중간 */}
        <Dot cx={385} cy={195} r={6} kind="muted2" />
        <DotLabel x={385} y={195} dx={11} dy={4} text="Solana" tone="muted2" />

        <Dot cx={465} cy={135} r={6} kind="accent2" />
        <DotLabel x={465} y={135} dx={11} dy={4} text="Ethereum (PoS)" tone="accent2" />

        {/* Bitcoin · 강조 */}
        <Dot cx={530} cy={92} r={9} kind="accent" />
        <DotLabel x={530} y={92} dx={-14} dy={4} text="Bitcoin" tone="accent" anchor="end" big />
      </svg>
      <div className="mt-3 text-[13px] text-text/70 leading-relaxed">
        <span className="text-text">분산도</span> = 노드가 지리·운영자별로
        얼마나 흩어져 있나.{" "}
        <span className="text-text">탈중앙도</span> = 권한이 한 주체에 묶여
        있지 않나 (규칙 결정·검증·자금). 둘은 다른 축.{" "}
        <span className="text-text/85">Ripple, BSC</span> 처럼 ‘수십 개 노드가
        있지만 한 회사가 통제’ 하는 체인은 분산은 약간, 탈중앙은 거의 0.
      </div>
    </div>
  );
}

function Dot({
  cx,
  cy,
  r,
  kind,
}: {
  cx: number;
  cy: number;
  r: number;
  kind: "muted" | "muted2" | "accent" | "accent2" | "warn";
}) {
  const stroke =
    kind === "accent"
      ? "#f7931a"
      : kind === "accent2"
        ? "#5b8def"
        : kind === "warn"
          ? "#f76b6b"
          : kind === "muted2"
            ? "#a0a8b8"
            : "#5a6070";
  const fill =
    kind === "accent"
      ? "#f7931a30"
      : kind === "accent2"
        ? "#5b8def25"
        : kind === "warn"
          ? "#f76b6b25"
          : "#1c1f27";
  return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={kind === "accent" ? 2 : 1.4} />;
}

function DotLabel({
  x,
  y,
  dx,
  dy,
  text,
  tone,
  anchor,
  big,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  text: string;
  tone?: "accent" | "accent2" | "warn" | "muted2";
  anchor?: "start" | "end" | "middle";
  big?: boolean;
}) {
  const fill =
    tone === "accent"
      ? "#f7931a"
      : tone === "accent2"
        ? "#5b8def"
        : tone === "warn"
          ? "#f76b6b"
          : tone === "muted2"
            ? "#a0a8b8"
            : "#a0a8b8";
  return (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor ?? "start"}
      fontSize={big ? 13 : 12}
      fontWeight={big ? 600 : 400}
      fill={fill}
      fontFamily="JetBrains Mono"
    >
      {text}
    </text>
  );
}

function Quadrant({
  cx,
  cy,
  label,
  tone,
  big,
  labelLeft,
}: {
  cx: number;
  cy: number;
  label: string;
  tone: "muted" | "accent";
  big?: boolean;
  labelLeft?: boolean;
}) {
  const stroke = tone === "accent" ? "#f7931a" : "#5a6070";
  const fill = tone === "accent" ? "#f7931a25" : "#1c1f27";
  const r = big ? 10 : 6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={big ? 2 : 1} />
      <text
        x={labelLeft ? cx - 14 : cx + 14}
        y={cy + 4}
        textAnchor={labelLeft ? "end" : "start"}
        fontSize="11"
        fill={tone === "accent" ? "#f7931a" : "#a0a8b8"}
        fontFamily="JetBrains Mono"
      >
        {label}
      </text>
    </g>
  );
}

function DDRow({
  name,
  dist,
  decent,
  tone,
}: {
  name: string;
  dist: string;
  decent: string;
  tone?: "accent";
}) {
  const cls = tone === "accent" ? "text-accent" : "text-text/85";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className={`font-mono text-[13px] ${cls}`}>{name}</div>
      <div className="text-[13px] text-text/85">{dist}</div>
      <div className="text-[13px] text-text/85">{decent}</div>
    </div>
  );
}
