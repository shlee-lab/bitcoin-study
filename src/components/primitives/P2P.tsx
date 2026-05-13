"use client";

import { Term } from "../Term";

export const P2PMeta = {
  id: "p2p" as const,
  title: "P2P protocol",
  oneLiner: "노드끼리 짧은 메시지로 가십. inv / getdata / tx / block.",
};

export function P2PBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        비트코인엔 중앙 서버가 없다. 각 노드가 다른 노드 8 ~ 125 개와 TCP 로
        연결을 유지하며 짧은 메시지를 주고받는다. 새 트랜잭션·블록은 그 연결을
        타고 가십(gossip)으로 퍼진다.
      </p>

      <Section title="① 핸드셰이크 + 전파의 한 사이클">
        <Handshake />
      </Section>

      <Section title="② 주요 메시지 종류">
        <MsgTable />
      </Section>

      <Section title="③ ‘inv → getdata → 본체’ 의 이유">
        <p>
          노드 A 가 새 블록을 받았을 때 100 명의 이웃에게 곧바로 블록
          전체(수 MB) 를 보내면 트래픽이 폭증. 대신 32 byte 짜리{" "}
          <code className="font-mono">inv</code> ‘나 이거 있다’ 만 먼저
          보내고, 이미 갖고 있지 않은 노드만{" "}
          <code className="font-mono">getdata</code> 로 본체를 요청한다. 같은
          블록을 두 번 받지 않게 하는 영리한 절약 장치다. 새 트랜잭션도 같은 식으로 들어와{" "}
          <Term id="mempool">mempool</Term> 에 합류한다.
        </p>
      </Section>

      <Section title="④ 어떻게 처음 이웃을 찾나">
        <p>
          노드가 처음 켜질 땐 DNS seed (몇 개의 잘 알려진 도메인) 를 조회해 IP
          목록을 받는다. 이후엔{" "}
          <code className="font-mono">addr</code> 메시지로 서로 알고 있는 다른
          노드 주소를 교환하며 점점 ‘아는 노드 풀’을 키운다.
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

function Handshake() {
  const steps: { from: "A" | "B"; label: string; phase: string; tone?: string }[] = [
    { from: "A", label: "version", phase: "handshake" },
    { from: "B", label: "version", phase: "handshake" },
    { from: "B", label: "verack", phase: "handshake" },
    { from: "A", label: "verack", phase: "handshake" },
    { from: "A", label: "inv (block 0a3f1c…)", phase: "gossip", tone: "accent" },
    { from: "B", label: "getdata (block 0a3f1c…)", phase: "gossip", tone: "accent" },
    { from: "A", label: "block (header + tx 목록)", phase: "gossip", tone: "accent" },
  ];
  const stepH = 30;
  const W = 480;
  const H = 60 + steps.length * stepH + 20;
  const lifelineLeft = 80;
  const lifelineRight = 400;

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker
            id="p2pArrow"
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

        <NodeHead x={lifelineLeft} y={20} label="Node A" tone="accent2" />
        <NodeHead x={lifelineRight} y={20} label="Node B" tone="accent2" />

        <line
          x1={lifelineLeft}
          y1={42}
          x2={lifelineLeft}
          y2={H - 10}
          stroke="#1c1f27"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1={lifelineRight}
          y1={42}
          x2={lifelineRight}
          y2={H - 10}
          stroke="#1c1f27"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {steps.map((step, i) => {
          const y = 60 + i * stepH;
          const fromX = step.from === "A" ? lifelineLeft : lifelineRight;
          const toX = step.from === "A" ? lifelineRight : lifelineLeft;
          const stroke = step.tone === "accent" ? "#f7931a" : "#7a8190";
          const labelColor = step.tone === "accent" ? "#f7931a" : "#e6e8ec";
          return (
            <g key={i}>
              <line
                x1={fromX + (step.from === "A" ? 8 : -8)}
                y1={y}
                x2={toX + (step.from === "A" ? -8 : 8)}
                y2={y}
                stroke={stroke}
                strokeWidth="1"
                markerEnd="url(#p2pArrow)"
              />
              <text
                x={(fromX + toX) / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="11"
                fill={labelColor}
                fontFamily="JetBrains Mono"
              >
                {step.label}
              </text>
            </g>
          );
        })}

        <text
          x={W / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize="10"
          fill="#5a6070"
          fontFamily="JetBrains Mono"
        >
          handshake → gossip
        </text>
      </svg>
    </div>
  );
}

function NodeHead({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: "accent2";
}) {
  const w = 80;
  const h = 24;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
       
        fill="#0d0f14"
        stroke={tone === "accent2" ? "#5b8def" : "#3a3f4a"}
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="11"
        fill="#5b8def"
        fontFamily="JetBrains Mono"
      >
        {label}
      </text>
    </g>
  );
}

function MsgTable() {
  const rows: { name: string; dir: string; desc: string; size: string }[] = [
    { name: "version", dir: "양방향", desc: "프로토콜 버전, 서비스 비트, 시작 블록 높이 교환", size: "~100 byte" },
    { name: "verack", dir: "양방향", desc: "version 잘 받았다 응답", size: "24 byte" },
    { name: "inv", dir: "양방향", desc: "‘이 해시 갖고 있다’ 알림 (tx / block)", size: "~50 byte / 항목" },
    { name: "getdata", dir: "응답", desc: "inv 본 게 없으면 ‘본체 줘’ 요청", size: "~50 byte / 항목" },
    { name: "tx", dir: "본체 전달", desc: "트랜잭션 직렬화 본체", size: "~250 byte+" },
    { name: "block", dir: "본체 전달", desc: "블록 (헤더 + tx 목록)", size: "~1 MB" },
    { name: "addr", dir: "양방향", desc: "‘내가 아는 다른 노드들’ 주소 공유", size: "~30 byte / 항목" },
    { name: "ping/pong", dir: "양방향", desc: "연결 살아있나 확인", size: "32 byte" },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-x-auto">
      <div className="grid min-w-[620px] grid-cols-[100px_80px_1fr_90px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>name</div>
        <div>direction</div>
        <div>역할</div>
        <div className="text-right">size</div>
      </div>
      <div className="divide-y divide-edge">
        {rows.map((r) => (
          <div
            key={r.name}
            className="grid min-w-[620px] grid-cols-[100px_80px_1fr_90px] gap-3 px-4 py-2 items-baseline"
          >
            <div className="font-mono text-sm text-accent">{r.name}</div>
            <div className="text-[13px] text-muted">{r.dir}</div>
            <div className="text-[13px] text-text/85 leading-relaxed">{r.desc}</div>
            <div className="text-right font-mono text-[13px] text-muted">
              {r.size}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
