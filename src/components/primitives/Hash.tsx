"use client";

import { Term } from "../Term";

export const HashMeta = {
  id: "hash" as const,
  title: "Hash function",
  oneLiner: "임의 길이 입력 → 고정 길이 출력. 한 방향, 사실상 역산 불가능.",
};

export function HashBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-6">
      <p>
        <Term id="sha-256">
          <code className="font-mono text-accent">SHA-256</code>
        </Term>{" "}
        은 임의 길이의 입력을{" "}
        <span className="font-mono">256-bit (32 byte)</span> 출력으로
        매핑한다. 가능한 출력 수는{" "}
        <span className="font-mono">2²⁵⁶ ≈ 1.16 × 10⁷⁷</span> . 관측 가능한
        우주의 원자 수보다 큰 공간.
      </p>

      <Section title="① 작은 변화도 출력은 완전히 달라진다 (avalanche)">
        <Compare
          rows={[
            {
              input: '"hello"',
              hash: "2cf24dba 5fb0a30e 26e83b2a c5b9e29e 1b161e5c 1fa7425e 73043362 938b9824",
            },
            {
              input: '"Hello"',
              hash: "185f8db3 2271fe25 f561a6fc 938b2e26 4306ec30 4eda5180 07d17648 26381969",
            },
          ]}
        />
        <p className="text-xs text-muted">
          한 글자, 사실 1 byte 만 다른데 출력은 두 값 사이에 어떤 패턴도 없다.
          이게 입력의 어떤 정보도 출력으로 새지 않게 만든다.
        </p>
      </Section>

      <Section title="② 작은 해시로 직관 잡기 · 16 buckets 게임">
        <p>
          256-bit 출력이 너무 커서 와닿지 않으면, 한 자리(4 bit, 16 종류)로 줄여
          보자.{" "}
          <code className="font-mono">SHA-256(x) mod 16</code> 은 SHA-256 출력의
          마지막 hex 한 자리. 입력 8 개를 그 16 buckets 에 던져보면:
        </p>
        <SamplesTable />
        <BucketViz />
        <p>
          8 개만 던졌는데 벌써 충돌 2 개{" "}
          (<span className="text-accent font-mono">9</span>: 0, Hello /{" "}
          <span className="text-accent font-mono">b</span>: 1, a). 이게{" "}
          <Term id="birthday-paradox">
            <span className="text-text">birthday paradox</span>
          </Term>{" "}
          의 정체: <code className="font-mono">m</code> 개 buckets 에 입력을
          무작위로 던지면 약 <code className="font-mono">√m</code> 번이면
          충돌 확률이 50% 를 넘는다. 16 → √16 = 4 번 즈음.
        </p>
        <p className="text-sm text-muted">
          출력이 작을수록 공간이 빽빽해서 충돌이 쉽고, 클수록 한산해서 어렵다.
          실제 SHA-256 은 buckets 가{" "}
          <code className="font-mono">2²⁵⁶</code> 개. 다음 ③, ④ 에서 그 규모로
          가면 어떤 일이 벌어지는지.
        </p>
      </Section>

      <Section title="③ 출력에서 입력을 역산하는 것 · computationally infeasible">
        <p>
          SHA-256 출력 하나가 주어졌을 때, 그 출력을 만드는 입력 <code className="font-mono">x</code> 를
          찾으려면 평균적으로 <span className="font-mono">2²⁵⁵ ≈ 5.8 × 10⁷⁶</span>{" "}
          번을 직접 해보아야 한다.
        </p>
        <ScaleBox
          rows={[
            ["비트코인 네트워크 전체 해시레이트", "≈ 10²¹ H/s"],
            ["평균 시도 횟수", "2²⁵⁵ ≈ 5.8 × 10⁷⁶"],
            ["걸리는 시간", "≈ 3 × 10⁴⁸ 년"],
            ["우주 나이", "≈ 1.4 × 10¹⁰ 년"],
            ["→ 우주 나이의 약", "2 × 10³⁸ 배"],
          ]}
          highlightLast
        />
        <p className="text-xs text-muted">
          “못 한다”가 아니라 “할 수는 있는데 우주 안에서 끝낼 수 없다.” 이것이{" "}
          <Term id="computationally-infeasible">
            <span className="text-text">computationally infeasible</span>
          </Term>{" "}
          의 본질이다.
        </p>
      </Section>

      <Section title="④ 충돌의 실제 비용 (위 ② 의 일반화)">
        <p>
          서로 다른 <code className="font-mono">x ≠ y</code> 인데{" "}
          <code className="font-mono">H(x) = H(y)</code> 인 쌍을 찾는 일을{" "}
          <em>collision</em>{" "}
          이라 한다. 생일 역설(birthday paradox)에 의해{" "}
          <span className="font-mono">2¹²⁸</span> 번이면 충분한데, 이마저도:
        </p>
        <ScaleBox
          rows={[
            ["시도 횟수", "2¹²⁸ ≈ 3.4 × 10³⁸"],
            ["같은 해시레이트로 걸리는 시간", "≈ 1.8 × 10¹⁰ 년"],
            ["우주 나이의", "약 1.3 배"],
          ]}
        />
      </Section>

      <Section title="⑤ 정리 · 세 가지 표준 보안 성질">
        <p>
          위 ③ ④ 의 직관을 학계 표준 용어로 정리하면, 암호학적 해시 함수는 보통
          이 세 성질을 만족해야 한다. n-bit 출력을 가진 해시 함수에 대해 brute-
          force 의 점근 비용도 함께.
        </p>
        <PropertyTable
          rows={[
            {
              name: "pre-image resistance",
              ko: "역상 저항성",
              def: (
                <>
                  주어진 <code className="font-mono">y</code> 에 대해{" "}
                  <code className="font-mono">H(x) = y</code> 가 되는{" "}
                  <code className="font-mono">x</code> 를 찾는 것이 어려워야 함
                </>
              ),
              cost: "2ⁿ",
              sha: "2²⁵⁶",
            },
            {
              name: "2nd pre-image resistance",
              ko: "제 2 역상 저항성",
              def: (
                <>
                  주어진 <code className="font-mono">x₁</code> 에 대해{" "}
                  <code className="font-mono">x₂ ≠ x₁</code> 이면서{" "}
                  <code className="font-mono">H(x₂) = H(x₁)</code> 인{" "}
                  <code className="font-mono">x₂</code> 를 찾기 어려움
                </>
              ),
              cost: "2ⁿ",
              sha: "2²⁵⁶",
            },
            {
              name: "collision resistance",
              ko: "충돌 저항성",
              def: (
                <>
                  <code className="font-mono">x₁ ≠ x₂</code> 인데{" "}
                  <code className="font-mono">H(x₁) = H(x₂)</code> 인 어떤 쌍을
                  찾기 어려움 (입력 자유)
                </>
              ),
              cost: "2^(n/2)",
              sha: "2¹²⁸",
              note: "birthday bound",
            },
          ]}
        />
        <p className="text-[13px] text-text/65 leading-relaxed">
          충돌 저항성이 가장 약한 성질이다 (입력을 둘 다 자유롭게 고를 수 있어
          더 쉽다). 그래서 같은 n 비트 해시에서 collision 비용이 2^(n/2),
          pre-image 비용이 2ⁿ. 학술 논문에서는 이 세 성질을 줄여{" "}
          <code className="font-mono">PRE</code> ·{" "}
          <code className="font-mono">SEC</code> ·{" "}
          <code className="font-mono">CR</code> 로 표기하는 일이 흔하다.
        </p>
      </Section>

      <Section title="⑥ One-way vs Trap-door · 한 가족의 두 갈래">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FamilyBox
            termId="one-way"
            kind="one-way"
            line="누구든 H(x) 는 빠르고, H⁻¹ 은 사실상 불가능."
            note="비밀이 없다. 모두에게 같은 어려움."
            example="Hash function · SHA-256, RIPEMD-160"
          />
          <FamilyBox
            termId="trap-door"
            kind="trap-door"
            line="정방향은 빠르고, 역방향은 어렵다. 단, 비밀 s 가 있는 사람만 거꾸로 빠르다."
            note="비밀 키가 trap-door."
            example="Public-key crypto · ECDSA, RSA"
          />
        </div>
        <p className="text-xs text-muted">
          비트코인은 둘 다 쓴다. 해시로 주소·블록을 묶고, trap-door (ECDSA) 로
          “이 자금을 풀 권한” 을 증명한다.
        </p>
      </Section>

      <Section title="⑦ 비트코인은 어떻게 쓰나">
        <ul className="space-y-1.5 text-sm">
          <Bullet>
            블록 헤더의 작업 증명:{" "}
            <code className="font-mono text-accent">
              <Term id="double-sha256">double-SHA256</Term>(header) &lt;{" "}
              <Term id="target">target</Term>
            </code>
          </Bullet>
          <Bullet>
            트랜잭션·블록 ID:{" "}
            <code className="font-mono text-accent">
              double-SHA256(payload)
            </code>
          </Bullet>
          <Bullet>
            주소 파생:{" "}
            <code className="font-mono text-accent">
              <Term id="ripemd-160">RIPEMD160</Term>( SHA256( pubkey ) )
            </code>
          </Bullet>
          <Bullet>
            <Term id="merkle-root">머클 루트</Term>: 트랜잭션들을 쌍으로
            해시해 올라가는 트리. 한 트랜잭션의 존재 증명을 작은 데이터로
            가능하게.
          </Bullet>
        </ul>
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

function Compare({
  rows,
}: {
  rows: { input: string; hash: string }[];
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 divide-y divide-edge font-mono text-[13px]">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[100px_1fr] gap-3 px-3 py-2.5">
          <div className="text-muted">{r.input}</div>
          <div
            className="text-accent break-all leading-relaxed"
            style={{ wordBreak: "break-word" }}
          >
            {r.hash}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScaleBox({
  rows,
  highlightLast = false,
}: {
  rows: [string, string][];
  highlightLast?: boolean;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 divide-y divide-edge text-[13px]">
      {rows.map(([label, value], i) => {
        const last = i === rows.length - 1;
        return (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto] gap-4 px-3 py-2.5"
          >
            <div className={last && highlightLast ? "text-text" : "text-muted"}>
              {label}
            </div>
            <div
              className={`font-mono ${
                last && highlightLast ? "text-accent text-sm" : "text-text/85"
              }`}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PropertyTable({
  rows,
}: {
  rows: {
    name: string;
    ko: string;
    def: React.ReactNode;
    cost: string;
    sha: string;
    note?: string;
  }[];
}) {
  return (
    <div className="border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-[180px_1fr_100px_100px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>성질</div>
        <div>정의</div>
        <div className="text-right">n-bit 비용</div>
        <div className="text-right">SHA-256</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {rows.map((r) => (
          <div
            key={r.name}
            className="grid grid-cols-[180px_1fr_100px_100px] gap-3 px-4 py-3 items-baseline"
          >
            <div className="space-y-0.5">
              <div className="font-mono text-[13px] text-text/90">{r.name}</div>
              <div className="text-[12px] text-muted">{r.ko}</div>
            </div>
            <div className="text-[13px] text-text/80 leading-[1.65]">
              {r.def}
            </div>
            <div className="text-right font-mono text-[13px] text-accent2">
              {r.cost}
            </div>
            <div className="text-right space-y-0.5">
              <div className="font-mono text-[13px] text-accent">{r.sha}</div>
              {r.note && (
                <div className="font-mono text-[10px] text-muted">{r.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FamilyBox({
  termId,
  kind,
  line,
  note,
  example,
}: {
  termId: string;
  kind: string;
  line: string;
  note: string;
  example: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-3.5 space-y-2">
      <h4 className="text-[16px] font-medium text-accent2 leading-snug">
        <Term id={termId}>{kind}</Term>
      </h4>
      <div className="text-sm">{line}</div>
      <div className="text-[13px] text-muted">{note}</div>
      <div className="text-[13px] text-text/70">예: {example}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-muted mt-1">·</span>
      <span>{children}</span>
    </li>
  );
}

const HASH_SAMPLES = [
  { input: '""',      tail: "7852b855", nib: 0x5 },
  { input: '"0"',     tail: "27fb57e9", nib: 0x9 },
  { input: '"1"',     tail: "b7875b4b", nib: 0xb },
  { input: '"a"',     tail: "afee48bb", nib: 0xb },
  { input: '"abc"',   tail: "f20015ad", nib: 0xd },
  { input: '"hello"', tail: "938b9824", nib: 0x4 },
  { input: '"Hello"', tail: "26381969", nib: 0x9 },
  { input: '"test"',  tail: "b0f00a08", nib: 0x8 },
];

function SamplesTable() {
  const counts = HASH_SAMPLES.reduce<Record<number, number>>((m, s) => {
    m[s.nib] = (m[s.nib] ?? 0) + 1;
    return m;
  }, {});
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-[80px_1fr_70px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>input</div>
        <div>SHA-256 (last 8 hex)</div>
        <div className="text-right">mod 16</div>
      </div>
      <div className="divide-y divide-edge">
        {HASH_SAMPLES.map((s, i) => {
          const collides = (counts[s.nib] ?? 0) > 1;
          const head = s.tail.slice(0, -1);
          const last = s.tail.slice(-1);
          return (
            <div
              key={i}
              className="grid grid-cols-[80px_1fr_70px] gap-3 px-4 py-1.5 items-baseline"
            >
              <div className="font-mono text-sm text-text/85">{s.input}</div>
              <div className="font-mono text-[13px] text-text/65">
                <span className="text-muted">…</span>
                {head}
                <span className={collides ? "text-accent" : "text-text/85"}>
                  {last}
                </span>
              </div>
              <div
                className={`text-right font-mono text-sm ${
                  collides ? "text-accent" : "text-muted"
                }`}
              >
                {s.nib.toString(16)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BucketViz() {
  const buckets: string[][] = Array.from({ length: 16 }, () => []);
  for (const s of HASH_SAMPLES) {
    buckets[s.nib].push(s.input.replace(/"/g, "") || "∅");
  }

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <div className="text-xs text-muted font-mono mb-3">
        16 buckets · 어디로 떨어졌나
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
      >
        {buckets.map((items, i) => {
          const collision = items.length > 1;
          return (
            <div
              key={i}
              className="flex flex-col items-stretch min-w-0 gap-1"
            >
              <div className="min-h-[64px] flex flex-col-reverse gap-1 justify-start items-stretch">
                {items.map((it, j) => (
                  <div
                    key={j}
                    title={it}
                    className={`text-[10px] font-mono px-1 py-1 rounded border text-center truncate ${
                      collision
                        ? "bg-accent/15 border-accent/50 text-accent"
                        : "bg-bg border-edge text-text/75"
                    }`}
                  >
                    {it}
                  </div>
                ))}
              </div>
              <div
                className={`text-xs font-mono text-center pt-1 border-t ${
                  collision
                    ? "text-accent border-accent/50"
                    : "text-muted border-edge"
                }`}
              >
                {i.toString(16)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
