"use client";

import { useMemo } from "react";
import { Term } from "../Term";

export const PublicKeyMeta = {
  id: "public-key" as const,
  title: "Public-key cryptography",
  oneLiner: "한 쌍의 키, trap-door 함수. 비밀을 가진 사람만 역방향으로 풀 수 있다.",
};

export function PublicKeyBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        비트코인은 타원곡선 서명{" "}
        <Term id="ecdsa">
          <code className="font-mono text-accent">ECDSA</code>
        </Term>{" "}
        를 곡선{" "}
        <Term id="secp256k1">
          <code className="font-mono text-accent">secp256k1</code>
        </Term>{" "}
        위에서 사용한다. 그 곡선은 단 하나의 식으로 정의된다:{" "}
        <code className="font-mono text-accent2">y² = x³ + 7</code>.
      </p>

      <Section title="① 그 곡선 보기">
        <CurvePlain />
        <p className="text-sm text-muted">
          이 그림은 실수 위에서 그린 모양. 비트코인은 같은 식을 거대한{" "}
          <Term id="finite-field">
            <span className="font-mono">유한체 𝔽ₚ</span>
          </Term>{" "}
          위에서 쓴다 (p ≈ 2²⁵⁶). 식은 같고, 점들이 ‘곡선’이 아닌 흩어진 점
          집합이 될 뿐이다.
        </p>
      </Section>

      <Section title="② 곡선 위의 ‘덧셈’ · 두 점에서 새 점 만들기">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CurveAdd />
          <CurveDouble />
        </div>
        <p>
          <span className="text-text">덧셈 P + Q</span>: 두 점을 잇는 직선이
          곡선과 한 번 더 만난다 (R&apos;). 그걸 x축 기준으로 뒤집은 점이{" "}
          <code className="font-mono text-accent">P + Q</code>.
        </p>
        <p>
          <span className="text-text">배가 2P</span> (= P + P): 한 점만 있을
          땐 그 점에서의 접선이 곡선과 다시 만나는 곳을 잡고, 같은 식으로 뒤집는다.
        </p>
        <p className="text-sm text-muted">
          이 두 연산만 있으면{" "}
          <code className="font-mono">k · G = G + G + … + G</code> (k 번 더하기)
          가 정의된다. 이게 ‘점 곱셈 (scalar multiplication)’.
        </p>
      </Section>

      <Section title="③ 작은 예시 · 같은 식, 작은 유한체에서 직접 계산">
        <p>
          비트코인의 진짜 곡선은 너무 커서 손으로 못 본다. 같은 식{" "}
          <code className="font-mono">y² = x³ + 7</code> 를 아주 작은{" "}
          <Term id="finite-field">유한체</Term>{" "}
          <code className="font-mono">𝔽₁₇</code> (mod 17) 에서 보면 모든 게
          종이 위에 들어온다.
        </p>
        <DoublingWalkthrough />
        <FieldGrid />
        <MultiplesTable />
        <p className="text-sm text-muted">
          이 작은 곡선엔 전체 점이 18 개뿐이다 (무한원점 O 포함). 그래서{" "}
          <code className="font-mono">Q = (10, 15)</code> 를 보고도 “d = 7
          이군” 을 시도 7 번 안에 알아낼 수 있다. 비트코인의 진짜 곡선엔 점이
          약 2²⁵⁶ 개. 같은 ‘맞춰보기’ 가 우주 시간 안에 끝나지 않는다.
        </p>
      </Section>

      <Section title="④ 비대칭성 (trap-door)">
        <p>
          <code className="font-mono">d → Q = d·G</code> 는 점 덧셈 약 256
          번이면 끝난다 (double-and-add). 거꾸로{" "}
          <code className="font-mono">Q → d</code> 는{" "}
          <Term id="ecdlp">ECDLP (이산 로그 문제)</Term> 라 부르며, 양자
          컴퓨터 없이는{" "}
          <Term id="computationally-infeasible">사실상 불가능</Term>.
        </p>
        <p>
          이 ‘거꾸로 가는 비밀’ 이 곧{" "}
          <Term id="trap-door">trap-door</Term>. 비밀키를 가진 사람만
          그 trap-door 를 통과해서 서명을 만들 수 있고, 누구든 공개키
          만으로 그 서명이 진짜인지 검증할 수 있다.
        </p>
      </Section>

      <Section title="⑤ Sign / Verify">
        <SignFlow />
        <p className="text-sm text-muted">
          서명은 메시지마다 새로 만든다. 같은 키로 다른 메시지에 서명하면 전혀
          다른 서명이 나오므로, 한 서명을 다른 트랜잭션에 재사용할 수 없다.
        </p>
      </Section>

      <Section title="⑥ 대표적 주소는 공개키 해시에서 출발한다">
        <div className="rounded-sm border border-edge bg-surface/30 p-3.5 font-mono text-[13px] leading-relaxed text-text/85">
          <span className="text-muted">address = </span>
          <span className="text-accent">Base58Check</span>(
          <span className="text-muted">version</span> ‖{" "}
          <span className="text-accent">RIPEMD160</span>(
          <span className="text-accent">SHA256</span>(<span>Q</span>)))
        </div>
        <p className="text-sm text-muted">
          P2PKH/P2WPKH 계열 주소는 공개키 자체를 바로 쓰지 않고, 해시로 짧게
          줄인 뒤 체크섬과 네트워크 정보를 붙여 만든다.{" "}
          <code className="font-mono">1Bv…</code>,{" "}
          <code className="font-mono">bc1q…</code> 같은 문자열은 자금을 받을
          조건을 사람이 다루기 좋은 형태로 인코딩한 목적지다.
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

const PLOT = {
  W: 400,
  H: 220,
  cx: 130,
  cy: 110,
  sx: 50,
  sy: 17,
};

function toX(x: number): number {
  return PLOT.cx + x * PLOT.sx;
}
function toY(y: number): number {
  return PLOT.cy - y * PLOT.sy;
}

function useCurvePath() {
  return useMemo(() => {
    const steps = 80;
    const xMin = -Math.cbrt(7);
    const xMax = 3;
    const top: string[] = [];
    const bot: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      const ySq = x * x * x + 7;
      const y = Math.sqrt(Math.max(0, ySq));
      top.push(`${i === 0 ? "M" : "L"} ${toX(x).toFixed(2)} ${toY(y).toFixed(2)}`);
      bot.push(`${i === 0 ? "M" : "L"} ${toX(x).toFixed(2)} ${toY(-y).toFixed(2)}`);
    }
    return { topPath: top.join(" "), botPath: bot.join(" ") };
  }, []);
}

function CurveBase({ children }: { children?: React.ReactNode }) {
  const { topPath, botPath } = useCurvePath();
  return (
    <svg
      viewBox={`0 0 ${PLOT.W} ${PLOT.H}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1={0}
        y1={PLOT.cy}
        x2={PLOT.W}
        y2={PLOT.cy}
        stroke="#2a2f3a"
        strokeWidth="0.7"
      />
      <line
        x1={PLOT.cx}
        y1={0}
        x2={PLOT.cx}
        y2={PLOT.H}
        stroke="#2a2f3a"
        strokeWidth="0.7"
      />
      <text
        x={PLOT.W - 6}
        y={PLOT.cy - 4}
        textAnchor="end"
        fontSize="12"
        fill="#a0a8b8"
        fontFamily="JetBrains Mono"
        fontWeight="500"
      >
        x
      </text>
      <text
        x={PLOT.cx + 4}
        y={14}
        fontSize="12"
        fill="#a0a8b8"
        fontFamily="JetBrains Mono"
        fontWeight="500"
      >
        y
      </text>
      <path d={topPath} stroke="#5b8def" strokeWidth="1.4" fill="none" />
      <path d={botPath} stroke="#5b8def" strokeWidth="1.4" fill="none" />
      {children}
    </svg>
  );
}

function CurvePlain() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-3">
      <CurveBase>
        <text
          x={PLOT.W - 8}
          y={PLOT.H - 8}
          textAnchor="end"
          fontSize="11"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          y² = x³ + 7
        </text>
      </CurveBase>
    </div>
  );
}

function CurveAdd() {
  // P=(-1.5, 1.904), Q=(1, 2.828) on real curve
  const P = { x: -1.5, y: 1.904 };
  const Q = { x: 1, y: 2.828 };
  // slope λ = (2.828 - 1.904) / (1 - (-1.5)) = 0.370
  // x_R' = λ² - x_P - x_Q = 0.137 + 1.5 - 1 = 0.637
  const Rx = 0.636;
  const Ry = 2.694; // y on the line at Rx
  const Rrefl = -Ry;

  // Extend the line through P and Q both directions for visual
  const ext1 = { x: -1.9, y: 1.904 + 0.37 * (-1.9 - -1.5) };
  const ext2 = { x: Rx + 0.05, y: Ry + 0.37 * 0.05 };

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-3">
      <div className="text-xs text-muted font-mono mb-1.5 px-1">
        addition · P + Q = R
      </div>
      <CurveBase>
        <line
          x1={toX(ext1.x)}
          y1={toY(ext1.y)}
          x2={toX(ext2.x)}
          y2={toY(ext2.y)}
          stroke="#7a8190"
          strokeWidth="0.7"
          strokeDasharray="3 3"
        />
        <line
          x1={toX(Rx)}
          y1={toY(Ry)}
          x2={toX(Rx)}
          y2={toY(Rrefl)}
          stroke="#3a3f4a"
          strokeWidth="0.7"
          strokeDasharray="2 2"
        />
        <Dot x={P.x} y={P.y} label="P" />
        <Dot x={Q.x} y={Q.y} label="Q" />
        <Dot x={Rx} y={Ry} label="R'" tone="muted" />
        <Dot x={Rx} y={Rrefl} label="R = P+Q" tone="accent" />
      </CurveBase>
    </div>
  );
}

function CurveDouble() {
  // P = (1, 2.828)
  const P = { x: 1, y: 2.828 };
  // λ = 3·1 / (2·2.828) = 0.530
  // x_2P' = λ² - 2x_P = 0.281 - 2 = -1.719
  const Rx = -1.719;
  const Ry = 1.387;
  const Rrefl = -Ry;

  const ext1 = { x: P.x + 0.4, y: P.y + 0.53 * 0.4 };
  const ext2 = { x: Rx - 0.1, y: Ry - 0.53 * 0.1 };

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-3">
      <div className="text-xs text-muted font-mono mb-1.5 px-1">
        doubling · 2P (tangent at P)
      </div>
      <CurveBase>
        <line
          x1={toX(ext1.x)}
          y1={toY(ext1.y)}
          x2={toX(ext2.x)}
          y2={toY(ext2.y)}
          stroke="#7a8190"
          strokeWidth="0.7"
          strokeDasharray="3 3"
        />
        <line
          x1={toX(Rx)}
          y1={toY(Ry)}
          x2={toX(Rx)}
          y2={toY(Rrefl)}
          stroke="#3a3f4a"
          strokeWidth="0.7"
          strokeDasharray="2 2"
        />
        <Dot x={P.x} y={P.y} label="P" />
        <Dot x={Rx} y={Ry} label="R'" tone="muted" />
        <Dot x={Rx} y={Rrefl} label="2P" tone="accent" />
      </CurveBase>
    </div>
  );
}

function Dot({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone?: "muted" | "accent";
}) {
  const fill =
    tone === "accent" ? "#f7931a" : tone === "muted" ? "#3a3f4a" : "#e6e8ec";
  const labelFill = tone === "accent" ? "#f7931a" : "#e6e8ec";
  return (
    <g>
      <circle cx={toX(x)} cy={toY(y)} r="3.2" fill={fill} />
      <text
        x={toX(x) + 6}
        y={toY(y) - 4}
        fontSize="10"
        fill={labelFill}
        fontFamily="JetBrains Mono"
      >
        {label}
      </text>
    </g>
  );
}

function DoublingWalkthrough() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <div className="text-[13px] text-muted font-mono">
        2G 계산 · 곡선 y² = x³ + 7 (mod 17), G = (15, 13)
      </div>
      <div className="font-mono text-[13px] space-y-2">
        <Step
          n="1"
          formula="λ = 3·x₁² / (2·y₁) mod 17"
          calc="= (3 · 225) / (2 · 13) mod 17"
          calc2="= (3 · 4) / (26 mod 17) = 12 / 9 mod 17"
          result="= 12 · 9⁻¹ = 12 · 2 = 24 mod 17 = 7"
        />
        <Step
          n="2"
          formula="x₃ = λ² − 2·x₁ mod 17"
          calc="= 49 − 30 mod 17 = 19 mod 17"
          result="= 2"
        />
        <Step
          n="3"
          formula="y₃ = λ·(x₁ − x₃) − y₁ mod 17"
          calc="= 7·(15 − 2) − 13 mod 17"
          calc2="= 91 − 13 = 78 mod 17"
          result="= 10"
        />
      </div>
      <div className="text-sm pt-1">
        <span className="font-mono text-accent">2G = (2, 10)</span>{" "}
        <span className="text-muted">
          확인: 10² = 100 ≡ 15 (mod 17), 2³ + 7 = 15. ✓
        </span>
      </div>
    </div>
  );
}

function Step({
  n,
  formula,
  calc,
  calc2,
  result,
}: {
  n: string;
  formula: string;
  calc: string;
  calc2?: string;
  result: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[18px_1fr] gap-2">
      <div className="text-muted">{n}.</div>
      <div className="space-y-0.5">
        <div className="text-text/85">{formula}</div>
        <div className="text-text/65">{calc}</div>
        {calc2 && <div className="text-text/65">{calc2}</div>}
        <div className="text-accent">{result}</div>
      </div>
    </div>
  );
}

const ALL_POINTS: [number, number][] = [
  [1, 5], [1, 12],
  [2, 7], [2, 10],
  [3, 0],
  [5, 8], [5, 9],
  [6, 6], [6, 11],
  [8, 3], [8, 14],
  [10, 2], [10, 15],
  [12, 1], [12, 16],
  [15, 4], [15, 13],
];

const WALK: { p: [number, number]; k: string }[] = [
  { p: [15, 13], k: "G" },
  { p: [2, 10], k: "2G" },
  { p: [8, 3], k: "3G" },
  { p: [12, 1], k: "4G" },
  { p: [6, 6], k: "5G" },
  { p: [5, 8], k: "6G" },
  { p: [10, 15], k: "7G = Q" },
];

function FieldGrid() {
  const W = 380;
  const H = 380;
  const padL = 38;
  const padR = 18;
  const padT = 18;
  const padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const scale = Math.min(innerW / 16, innerH / 16);
  const toPx = (x: number, y: number): [number, number] => [
    padL + x * scale,
    padT + (16 - y) * scale,
  ];

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <div className="text-xs text-muted font-mono mb-2">
        finite-field walk · 𝔽₁₇ 위 18 개 점 중 G 에서 출발한 k·G 의 궤적
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="walkArrow"
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

        {Array.from({ length: 17 }).map((_, i) => {
          const [x1] = toPx(i, 0);
          const [, y2] = toPx(0, 16);
          return (
            <g key={`g${i}`}>
              <line
                x1={x1}
                y1={padT}
                x2={x1}
                y2={H - padB}
                stroke="#161821"
                strokeWidth="0.5"
              />
              <line
                x1={padL}
                y1={y2 + i * scale}
                x2={W - padR}
                y2={y2 + i * scale}
                stroke="#161821"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {[0, 4, 8, 12, 16].map((i) => {
          const [tx] = toPx(i, 0);
          const [, ty] = toPx(0, i);
          return (
            <g key={`tk${i}`}>
              <text
                x={tx}
                y={H - padB + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#a0a8b8"
                fontFamily="JetBrains Mono"
              >
                {i}
              </text>
              <text
                x={padL - 8}
                y={ty + 4}
                textAnchor="end"
                fontSize="11"
                fill="#a0a8b8"
                fontFamily="JetBrains Mono"
              >
                {i}
              </text>
            </g>
          );
        })}

        <line
          x1={padL}
          y1={H - padB}
          x2={W - padR}
          y2={H - padB}
          stroke="#3a3f4a"
          strokeWidth="0.8"
        />
        <line
          x1={padL}
          y1={padT}
          x2={padL}
          y2={H - padB}
          stroke="#3a3f4a"
          strokeWidth="0.8"
        />

        {ALL_POINTS.map(([x, y], i) => {
          const [px, py] = toPx(x, y);
          return <circle key={i} cx={px} cy={py} r="2.6" fill="#3a3f4a" />;
        })}

        {WALK.slice(0, -1).map((step, i) => {
          const [x1, y1] = toPx(step.p[0], step.p[1]);
          const [x2, y2] = toPx(WALK[i + 1].p[0], WALK[i + 1].p[1]);
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const startGap = 6;
          const endGap = 8;
          return (
            <line
              key={i}
              x1={x1 + ux * startGap}
              y1={y1 + uy * startGap}
              x2={x2 - ux * endGap}
              y2={y2 - uy * endGap}
              stroke="#7a8190"
              strokeWidth="0.9"
              strokeOpacity={0.65}
              markerEnd="url(#walkArrow)"
            />
          );
        })}

        {WALK.map((step, i) => {
          const [px, py] = toPx(step.p[0], step.p[1]);
          const isStart = i === 0;
          const isEnd = i === WALK.length - 1;
          const fill = isStart ? "#5b8def" : isEnd ? "#f7931a" : "#e6e8ec";
          const labelColor = isStart
            ? "#5b8def"
            : isEnd
              ? "#f7931a"
              : "#e6e8ec";
          const offsetX = isEnd ? 8 : 6;
          const offsetY = isEnd ? -6 : -7;
          return (
            <g key={`w${i}`}>
              <circle cx={px} cy={py} r="4.5" fill={fill} />
              <text
                x={px + offsetX}
                y={py + offsetY}
                fontSize="11"
                fill={labelColor}
                fontFamily="JetBrains Mono"
                fontWeight="500"
              >
                {step.k}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
        <Legend color="#3a3f4a" label="곡선 위 18 개 점" />
        <Legend color="#5b8def" label="시작점 G" />
        <Legend color="#f7931a" label="공개키 Q = 7·G" />
      </div>
      <div className="mt-3 text-sm text-muted leading-relaxed">
        d=7 일 때 Q 는 (10, 15). 점 곱셈은 곡선 위를 ‘예측 불가능하게’ 도약한다.
        Q 만 보고 d 를 추측하려면 결국 1·G, 2·G, … 다 해 봐야 한다.
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-muted truncate">{label}</span>
    </div>
  );
}

function MultiplesTable() {
  const rows: { k: string; dec: string; hex: string }[] = [
    { k: "1·G", dec: "(15, 13)", hex: "(0f, 0d)" },
    { k: "2·G", dec: "(2, 10)", hex: "(02, 0a)" },
    { k: "3·G", dec: "(8, 3)", hex: "(08, 03)" },
    { k: "4·G", dec: "(12, 1)", hex: "(0c, 01)" },
    { k: "5·G", dec: "(6, 6)", hex: "(06, 06)" },
    { k: "6·G", dec: "(5, 8)", hex: "(05, 08)" },
    { k: "7·G", dec: "(10, 15)", hex: "(0a, 0f)" },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2 border-b border-edge font-mono text-[13px] text-muted">
        scalar multiples · k·G mod 17
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-y divide-edge">
        {rows.map((r, i) => {
          const isQ = i === 6;
          return (
            <div
              key={i}
              className={`px-3 py-2.5 ${isQ ? "bg-accent/5" : ""}`}
            >
              <div className="font-mono text-xs text-muted">{r.k}</div>
              <div
                className={`font-mono text-[13px] ${
                  isQ ? "text-accent" : "text-text/85"
                }`}
              >
                {r.dec}
              </div>
              <div className="font-mono text-[11px] text-muted/80 mt-0.5">
                {r.hex}
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-2.5 border-t border-edge text-sm text-text/85 leading-relaxed">
        <div>
          <span className="text-muted">예: </span>비밀키{" "}
          <span className="font-mono text-accent2">d = 7 = 0x07</span> (1 byte) →{" "}
          <span className="font-mono text-accent">
            Q = 7·G = (10, 15) = (0x0a, 0x0f)
          </span>{" "}
          (2 byte).
        </div>
        <div className="text-muted text-[13px] mt-1">
          비트코인의 진짜 곡선은 같은 식, 같은 연산. 다만 좌표가 32 byte (64
          hex) 정수. 길어질 뿐 구조는 그대로.
        </div>
      </div>
    </div>
  );
}

function SignFlow() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 font-mono text-[13px] space-y-2">
      <div>
        <span className="text-muted">Alice (서명자):</span>{" "}
        <span className="text-accent">sig</span> ={" "}
        <span className="text-accent2">Sign</span>(msg, <span>d</span>)
      </div>
      <div>
        <span className="text-muted">누구든 (검증자):</span>{" "}
        <span className="text-accent2">Verify</span>(msg,{" "}
        <span className="text-accent">sig</span>, <span>Q</span>) →{" "}
        <span className="text-text">true / false</span>
      </div>
      <div className="text-xs text-muted leading-relaxed pt-1">
        msg 는 트랜잭션의 직렬화된 형태. <span className="text-text">d</span>{" "}
        없이 <span className="text-accent">sig</span> 를 만들 수 없고,{" "}
        <span className="text-text">Q</span> 만으로{" "}
        <span className="text-accent">sig</span> 가 진짜인지 누구나 확인 가능.
      </div>
    </div>
  );
}
