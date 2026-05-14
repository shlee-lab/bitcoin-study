"use client";

import { Term } from "../Term";

export const MerkleMeta = {
  id: "merkle" as const,
  title: "머클 트리 (Merkle tree)",
  oneLiner: "많은 트랜잭션을 루트 한 값으로 묶고, 일부만으로 포함 여부를 증명하는 구조.",
};

export function MerkleBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        블록에는 수천 건의 트랜잭션이 들어갈 수 있다. 그런데 블록 헤더에는 그
        목록 전체를 다 넣을 수 없다. 필요한 것은{" "}
        <span className="text-text">“이 목록이 바로 그 목록이다”</span> 라고
        대표해줄 짧은 값 하나다. 머클 트리는 트랜잭션들을 둘씩 묶어 해시하고,
        그 결과를 또 둘씩 묶어 해시해 마지막 루트 하나를 만든다.
      </p>

      <p>
        좋은 점은 두 가지다. 첫째, 트랜잭션 하나만 바뀌어도 루트가 바뀌므로
        변조를 바로 잡아낼 수 있다. 둘째, 어떤 트랜잭션이 블록 안에 들어 있다는
        사실을 증명할 때 목록 전체를 다 받을 필요가 없다. 옆가지 몇 개만 받아도
        루트를 다시 계산해 확인할 수 있다.
      </p>

      <Section title="① 짝지어 올라간다">
        <MerkleViz />
        <p className="text-sm text-muted">
          홀수 개일 때는 마지막 잎을 자기 자신과 짝지어 채운다 (비트코인 방식).
          이렇게 둘씩 묶어 해시하는 과정을 반복하면 마지막에 한 값만 남고,
          그 값이 <code className="font-mono">root</code> 가 된다.
        </p>
        <FormulaBox>
          <div>
            <span className="text-muted">leaf (i):</span>{" "}
            <span className="text-accent">L_i = H(tx_i)</span>
          </div>
          <div>
            <span className="text-muted">internal node:</span>{" "}
            <span className="text-accent">
              N = H( left ‖ right )
            </span>
          </div>
          <div>
            <span className="text-muted">root:</span>{" "}
            <span className="text-accent">M = H(N_left ‖ N_right)</span>
          </div>
          <div className="text-[12px] text-muted pt-2">
            아래 식은 정확한 계산 방식이다. 처음 읽을 때는 “둘씩 묶어 해시해
            루트까지 올라간다” 는 구조만 잡아도 충분하다.
          </div>
          <div className="text-[12px] text-muted pt-1">
            비트코인은 <code className="font-mono">H = double-SHA256</code>.
            따라서 정확히는 <code className="font-mono">M = SHA256(SHA256(left ‖ right))</code>.
            <code className="font-mono">‖</code> 는 학계 표준의{" "}
            <span className="text-text">byte 연결 (concatenation)</span> 기호다.
          </div>
        </FormulaBox>
      </Section>

      <Section title="② 멤버십 증명 · 작은 ‘영수증’ 으로 충분하다">
        <p>
          tx₂ 가 이 트리 안에 있다는 걸 증명하려면 트리 전체가 아니라 두 개만
          있으면 된다:{" "}
          <code className="font-mono text-accent2">L₁</code>{" "}과{" "}
          <code className="font-mono text-accent2">N₂</code>. 이걸 ‘merkle path
          (또는 proof)’ 라 부른다.
        </p>
        <ProofTrace />
        <p className="text-sm text-muted">
          N = 4 일 땐 path 길이 2. N = 1024 면 10. N = 1,000,000 이어도 20.
          가벼운 라이트 클라이언트(<Term id="spv">SPV</Term>)가 전체 블록을
          받지 않고도 자기 트랜잭션의 포함 여부를 검증할 수 있는 토대.
        </p>
      </Section>

      <Section title="③ 비트코인 블록 헤더의 merkle_root">
        <p>
          블록 헤더 80 byte 중 32 byte 가 merkle root. 한 블록에 트랜잭션이
          수천 건이라도, 헤더 한 필드가 그 모두를 묶는 약속이 된다. 그 root 가
          블록 ID(=헤더 해시) 안에 박혀 작업 증명이 보호하므로, root 만 정직하면
          그 안의 어떤 tx 도 위조 불가.
        </p>
      </Section>
    </div>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-edge bg-surface/30 p-4 font-mono text-[13px] space-y-1.5 leading-relaxed">
      {children}
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

function MerkleViz() {
  const W = 480;
  const H = 240;
  const leaves = [
    { x: 60, y: 200, label: "tx₁", h: "L₁ = H(tx₁)" },
    { x: 180, y: 200, label: "tx₂", h: "L₂ = H(tx₂)", highlight: true },
    { x: 300, y: 200, label: "tx₃", h: "L₃ = H(tx₃)" },
    { x: 420, y: 200, label: "tx₄", h: "L₄ = H(tx₄)" },
  ];
  const mid = [
    { x: 120, y: 120, label: "N₁ = H(L₁‖L₂)" },
    { x: 360, y: 120, label: "N₂ = H(L₃‖L₄)", proof: true },
  ];
  const root = { x: 240, y: 40, label: "root = H(N₁‖N₂)" };

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <line x1={leaves[0].x} y1={leaves[0].y - 14} x2={mid[0].x} y2={mid[0].y + 14} stroke="#3a3f4a" strokeWidth="1" />
        <line x1={leaves[1].x} y1={leaves[1].y - 14} x2={mid[0].x} y2={mid[0].y + 14} stroke="#3a3f4a" strokeWidth="1" />
        <line x1={leaves[2].x} y1={leaves[2].y - 14} x2={mid[1].x} y2={mid[1].y + 14} stroke="#3a3f4a" strokeWidth="1" />
        <line x1={leaves[3].x} y1={leaves[3].y - 14} x2={mid[1].x} y2={mid[1].y + 14} stroke="#3a3f4a" strokeWidth="1" />
        <line x1={mid[0].x} y1={mid[0].y - 14} x2={root.x} y2={root.y + 14} stroke="#3a3f4a" strokeWidth="1" />
        <line x1={mid[1].x} y1={mid[1].y - 14} x2={root.x} y2={root.y + 14} stroke="#3a3f4a" strokeWidth="1" />

        <Node x={root.x} y={root.y} text="root" sub={root.label} tone="root" />
        <Node x={mid[0].x} y={mid[0].y} text="N₁" sub="H(L₁‖L₂)" tone="proof-sibling" />
        <Node x={mid[1].x} y={mid[1].y} text="N₂" sub="H(L₃‖L₄)" tone="proof-needed" />

        {leaves.map((l, i) => (
          <Node
            key={i}
            x={l.x}
            y={l.y}
            text={l.label}
            sub={`L${["₁", "₂", "₃", "₄"][i]}`}
            tone={l.highlight ? "target" : i === 0 ? "proof-needed" : "leaf"}
          />
        ))}
      </svg>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <Legend color="#f7931a" label="증명할 잎 (tx₂)" />
        <Legend color="#5b8def" label="필요한 형제 (proof)" />
        <Legend color="#3a3f4a" label="잎" />
        <Legend color="#7a8190" label="중간/루트" />
      </div>
    </div>
  );
}

function Node({
  x,
  y,
  text,
  sub,
  tone,
}: {
  x: number;
  y: number;
  text: string;
  sub?: string;
  tone: "leaf" | "target" | "proof-needed" | "proof-sibling" | "root";
}) {
  const stroke =
    tone === "target"
      ? "#f7931a"
      : tone === "proof-needed"
        ? "#5b8def"
        : tone === "proof-sibling"
          ? "#5b8def"
          : "#3a3f4a";
  const fill =
    tone === "target"
      ? "#f7931a18"
      : tone === "proof-needed" || tone === "proof-sibling"
        ? "#5b8def15"
        : "#101218";
  const w = 88;
  const h = 28;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
       
        fill={fill}
        stroke={stroke}
        strokeWidth="1.2"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="12"
        fill="#e6e8ec"
        fontFamily="JetBrains Mono"
      >
        {text}
      </text>
      {sub && (
        <text
          x={x}
          y={y + h / 2 + 13}
          textAnchor="middle"
          fontSize="9.5"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-muted truncate">{label}</span>
    </div>
  );
}

function ProofTrace() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 font-mono text-[13px] space-y-1.5 leading-relaxed">
      <div className="text-muted">tx₂ 가 root 에 포함되는지 검증:</div>
      <div>
        <span className="text-muted">1.</span> L₂&apos; = H(tx₂)
      </div>
      <div>
        <span className="text-muted">2.</span> N₁&apos; ={" "}
        <span className="text-accent2">H(L₁ ‖ L₂&apos;)</span>{" "}
        <span className="text-muted">← L₁ 만 받으면 충분</span>
      </div>
      <div>
        <span className="text-muted">3.</span> root&apos; ={" "}
        <span className="text-accent2">H(N₁&apos; ‖ N₂)</span>{" "}
        <span className="text-muted">← N₂ 만 받으면 충분</span>
      </div>
      <div className="text-accent pt-1">
        4. root&apos; == 헤더의 merkle_root ? → 진짜 포함된 트랜잭션
      </div>
    </div>
  );
}
