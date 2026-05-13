"use client";

import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Reflection, Probe, Reading, Callout } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L9NodeAnatomy(props: LayerProps) {
  return (
    <LayerShell
      id="S10"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "이론에서 실제 구현으로",
                subtitle: "추상적인 개념은 노드 안에서 어떻게 살아 있나",
                body: <Opening />,
              },
              {
                title: "노드의 모듈 지도",
                subtitle: "각 단계는 어떤 부품으로 구현되는가",
                body: (
                  <Section
                    heading="노드 한 대 안에는 여러 모듈이 함께 돌아간다"
                    sub="S1 ~ S9 의 각 추상이 ‘어느 모듈’ 의 책임으로 구현되는지. ‘무엇이 어디에 살고 누구와 대화하는지’ 만 봐도 충분하다."
                  >
                    <ComponentMap />
                    <ComponentMapGuide />
                    <ComponentTable />
                  </Section>
                ),
              },
              {
                title: "개념과 구현의 차이",
                subtitle: "블록체인은 합의의 단위이고, 디스크의 모양은 다르다",
                body: <NetworkVsStorage />,
              },
              {
                title: "생각해보기", subtitle: "단일 구현이라는 역설",
                body: (
                  <Reflection title="탈중앙 시스템인데 코드는 한 군데?">
                    <p>
                      비트코인은 ‘탈중앙’ 이라고 한다. 그러나 실제 표준 코드는
                      사실상 단 하나의 구현체 (Bitcoin Core) 다. 그 코드의 동작이
                      곧 합의 규칙의 정의다. 다른 구현체 (btcd, libbitcoin) 가
                      있지만 Bitcoin Core 와 100% 일치를 유지하기 위해 끊임없이
                      그 동작을 복제하려 한다.
                    </p>
                    <p>
                      모범 사례로 자주 언급되는 건{" "}
                      <span className="text-text">이더리움</span>. Ethereum
                      Foundation 은 의도적으로{" "}
                      <span className="text-text">client diversity</span> 를
                      목표로 잡고, 한 구현체에 hashrate/지분이 몰리지 않도록
                      여러 client 를 직접 그랜트로 후원한다. 실행 client 만 해도
                      Geth (Go), Nethermind (.NET), Besu (Java), Erigon (Go),
                      Reth (Rust), 합의 client 도 Lighthouse, Prysm, Teku,
                      Nimbus, Lodestar 다섯. ‘한 client 에 치명적 버그가 있어도
                      네트워크의 절반 이상이 그 영향을 안 받게’ 라는 기준. 비트
                      코인엔 이더리움만큼 강한 다중 클라이언트 문화가 없고,
                      결과적으로 Bitcoin Core 가 노드 소프트웨어의 사실상 표준
                      위치를 차지한다.
                    </p>
                    <Probe>
                      만약 그 Bitcoin Core 에 치명적 버그가 있다면? 2018 년{" "}
                      <span className="text-text">CVE-2018-17144</span>{" "}
                      (‘inflation bug’) 는 같은 input 을 두 번 쓰는 트랜잭션을
                      검증 단계에서 거부해야 하는데 일정 조건에서 그 검사를
                      건너뛰는 버그였다. 악용됐다면 한 UTXO 를 여러 번 소비해
                      ‘없는 코인’ 을 만들 수 있었음 → 21 M 발행 한도가 무너지는
                      인플레이션. 다행히 패치 전에 발견·수정. 이 사건이 던진
                      질문은: ‘단일 구현의 단일점 실패’ vs ‘다양한 구현 사이에서
                      합의가 갈라질 위험’ 중 어느 쪽이 더 나은 트레이드오프인가?
                    </Probe>
                    <Reading label="검토 질문">
                      ‘Don’t trust, verify’ 라는 비트코인의 모토가 코드 자체에
                      는 어떻게 적용되나? 결국 누군가는 Core 코드를 신뢰해야
                      한다. 코드 리뷰는 누가? Reproducible build 는 어떻게?
                      자가 검증의 한계가 어디서 멈추는가.
                    </Reading>
                  </Reflection>
                ),
              },
              {
                title: "생각해보기", subtitle: "Bitcoin Core 거버넌스의 허점",
                body: <GovernanceReflection />,
              },
            ]}
          />
        </div>
      }
    />
  );
}

function GovernanceReflection() {
  return (
    <Reflection title="‘프로토콜은 누가 쓰는가’ · 거버넌스의 중앙화 허점">
      <p>
        비트코인 프로토콜은 백서가 아니라 코드로 정의된다. 그 코드의 사실상
        표준이 Bitcoin Core 라는 한 저장소이고, 그 저장소에 직접 commit 할 수
        있는 사람은 단{" "}
        <span className="text-text">5 명 안팎의 maintainers</span> 다. 표면적으론{" "}
        <Term id="bip">BIP</Term> 절차가 열려 있지만, 어떤 PR 이 merge 되고
        어떤 BIP 가 release 에 포함될지의 게이트키핑은 이 소수가 사실상 쥐고
        있다.
      </p>
      <p>
        Bitcoin 코드 작성 풀도 좁다. 정기 contributor 는 수십 명 수준이고, 그
        다수가 (Chaincode Labs, Spiral, Brink, Block 등) 특정 후원처에
        의존한다는 점이 또 다른 층위다. 즉 ‘탈중앙 시스템의 프로토콜’ 이 실제론{" "}
        <span className="text-text">상대적으로 작은 코드·사람 풀에 묶여 있다</span>.
      </p>
      <p>
        Probe: ‘노드 운영자가 어느 버전을 돌릴지로 투표한다’ 는 명제는 이론상
        맞지만, 대체 client 의 성숙도가 낮으면 실질 선택지가 없다. 결국 ‘Core
        가 release 하면 따라간다’ 가 default 가 된다. 이게 ‘탈중앙’ 의 운영적
        한계다.
      </p>
      <Probe>
        Bitcoin 의 거버넌스가 ‘소수 maintainers + 후원 의존 contributor + 사실상
        단일 client’ 라는 점은 51% 같은 채굴 공격보다 더 큰 장기 위험인가?
        아니면 ‘느린·보수적 변경’ 이 오히려 안전성의 일부인가?
      </Probe>
      <Reading label="참고 논문">
        Bitcoin 의 ‘탈중앙도’ 를 학술적으로 분해 평가한 초기 작업으로 Arthur
        Gervais, Ghassan O. Karame, Vedran Capkun, Srdjan Capkun 의{" "}
        <a
          href="https://ieeexplore.ieee.org/document/6824541"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent2 hover:text-accent border-b border-dotted border-accent2/40 hover:border-accent/60 transition-colors"
        >
          <em className="text-text/85">“Is Bitcoin a Decentralized Currency?”</em>
        </a>
        {" "}(IEEE Security & Privacy Magazine, vol. 12 no. 3, May–June 2014).
        채굴·서비스·코드·프로토콜 차원에서 ‘어디가 얼마나 중앙화되어 있는지’
        를 케이스별로 짚는다. 코드·결정권 집중을 한 축으로 평가한 대표 문헌.
      </Reading>
    </Reflection>
  );
}

function NetworkVsStorage() {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <h2 className="text-[20px] font-medium tracking-tight">
          같은 정보, 두 모습
        </h2>
        <p className="text-[17px] text-text/80 leading-[1.75]">
          ‘블록체인’ 이라는 하나의 추상이 실제 노드 안에선 어떤 모양인가. 한
          노드의 디스크엔 크게 네 군데에 비트코인의 ‘상태’ 가 흩어져 있다 ·{" "}
          <code className="font-mono text-text">chainstate/</code> (UTXO 셋),{" "}
          <code className="font-mono text-text">blocks/</code> (원시 블록 본체),{" "}
          <code className="font-mono text-text">blocks/index/</code> (어느
          블록이 어느 파일·어느 위치에 있나의 인덱스), 그리고 휘발성{" "}
          <code className="font-mono text-text">mempool</code>. 이걸 어떻게
          나눠뒀는가가 ‘추상 vs 구현’ 의 핵심.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent2 leading-snug">
            네트워크 위
          </div>
          <h3 className="text-[18px] font-medium text-text leading-snug">
            블록체인 (사슬)
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            합의의 추상 자료구조. 한 블록이{" "}
            <code className="font-mono text-text">prev_hash</code> 로 직전
            블록을 가리키는 <span className="text-text">linked chain</span>.
            S7 에서 본 그 모양 그대로. 이게 ‘비트코인이 무엇인가’ 의 정의.
          </p>
        </div>
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent leading-snug">
            실제 디스크 위
          </div>
          <h3 className="text-[18px] font-medium text-text leading-snug">
            DB (LevelDB 두 개 + flat 파일)
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            노드는 그 사슬을 그대로 ‘이어진 자료구조’ 로 저장하지 않는다.
            매 블록마다 수천 번 조회·갱신이 일어나니, 그렇게 두면 너무 느림.
            그래서 효율을 위해{" "}
            <span className="text-text">key-value DB 두 개</span> 와{" "}
            <span className="text-text">flat 파일</span> 로 분해 저장.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>저장소</div>
          <div>무엇이 들어 있나 · 왜 이 형태인가</div>
        </div>
        <div className="divide-y divide-edge text-[14px]">
          <Stratum
            name="ChainState"
            kind="key-value DB"
            body="현재 ‘안 쓴 UTXO’ 들의 키-값. (txid, vout) → output. 매 블록마다 수천 개 항목을 추가·삭제하므로 빠른 lookup 이 결정적이라 DB."
          />
          <Stratum
            name="Block index"
            kind="key-value DB"
            body="block_hash → 그 블록의 헤더와 원시 본체의 위치. 검증 중 ‘이 prev_hash 가 어느 블록인가’ 같은 조회가 빈번해 DB."
          />
          <Stratum
            name="Block files"
            kind="flat 바이너리"
            body="원시 블록 본체 (헤더 + 모든 tx). 한 번 쓰고 거의 안 바뀌는 append-only 데이터라 DB 대신 flat 파일로 디스크 절약."
          />
          <Stratum
            name="Mempool"
            kind="in-memory"
            body="아직 블록에 안 들어간 검증된 tx 들. 휘발성이라 노드가 켜져 있는 동안만 의미가 있다."
          />
        </div>
      </div>

      <Callout title="왜 이 분리가 중요한가">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          ‘블록체인’ 이라는 하나의 추상이 실제론 두 가지 책임으로 갈라진다.
          네트워크 위에선 합의 (consensus) 의 단위로서{" "}
          <span className="text-text">사슬 형태</span> 가 의미 있다 · prev_hash
          한 줄로 거꾸로 거슬러 올라가 변조 불가능을 보장.
          그러나 한 노드 안에선 그 추상을 그대로 메모리/디스크에 둘 이유가 없다.
          노드가 매 순간 묻는 질문은 ‘이 UTXO 가 아직 살아있나?’ 같은{" "}
          <span className="text-text">key-value lookup</span>. 그래서 LevelDB 가
          그 일을 맡는다.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          요약: <span className="text-text">‘블록체인 = 합의의 추상’</span>,{" "}
          <span className="text-text">‘LevelDB + flat 파일 = 노드의 효율적
          저장’</span>. 네트워크에선 같은 데이터, 디스크에선 다른 모양.
        </p>
      </Callout>

      <PrimitivePanel ids={["leveldb"]} />
    </section>
  );
}

function Stratum({
  name,
  kind,
  body,
}: {
  name: string;
  kind: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className="space-y-0.5">
        <div className="font-mono text-[13px] text-text/85">{name}</div>
        <div className="font-mono text-[11px] text-accent2/85 uppercase tracking-[0.14em]">
          {kind}
        </div>
      </div>
      <div className="text-[13px] text-text/80 leading-[1.65]">{body}</div>
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

function Opening() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[17px] text-text/80 leading-[1.7]">
          S1 ~ S9 까지 ‘비트코인이 어떻게 작동 가능한가’ 의 수학·암호·게임이론
          그림을 봤다. 그럼 그 모든 추상적인 개념이 실제로{" "}
          <span className="text-text">컴퓨터 한 대 위에선 뭐가 어떻게
          돌아가는가?</span>
        </p>
        <h2 className="text-xl font-medium leading-snug pt-3">
          추상적인 개념에서 구체적인 구현으로 · 노드 한 대 안의 모양
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2 max-w-2xl">
          여기선 그 그림이 어떤{" "}
          <span className="text-text">파일·디렉토리·프로세스·메모리</span>{" "}
          의 모양으로 살아 있는지를 본다. 추상적인 개념에서 구체적인 구현으로
          내려가는 마지막 한 칸.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-[180px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>이론 (앞 레이어)</div>
          <div>실제 (이 레이어에서 본다)</div>
        </div>
        <div className="divide-y divide-edge text-sm">
          <BridgeRow
            theory="‘UTXO 셋’"
            real="현재 안 쓴 출력들의 키-값 저장소. 매 블록마다 수천 개 항목 추가·삭제."
          />
          <BridgeRow
            theory="‘블록이 사슬에 추가된다’"
            real="여러 단계의 검증을 차례로 통과해야 노드가 받아들인다. 한 단계라도 실패하면 거부된다."
          />
          <BridgeRow
            theory="‘노드가 다른 노드에 전파’"
            real="짧은 메시지 (inv → getdata → block) 가 ‘있어 / 줘 / 받아’ 로 흐름."
          />
          <BridgeRow
            theory="‘처음 시작하면 자기가 검증’"
            real="첫 실행 시 0 번 블록부터 끝까지 다시 검증해 자기만의 상태를 짓는다."
          />
          <BridgeRow
            theory="‘mempool’"
            real="아직 블록에 안 들어간 tx 들을 메모리에 모아두는 자리. fee 순으로 정렬."
          />
        </div>
      </div>

      <p className="text-[14px] text-text/65 leading-[1.7]">
        S10 에선 노드의 <span className="text-text">정적 구조</span> 만 본다.
        어떤 모듈이 있고, 추상 ‘블록체인’ 이 실제 노드 안에선 어떤 모양인지.
        그 구조 위에서 노드가 어떻게 ‘살아 움직이는지’ 는 S11.
      </p>
    </section>
  );
}

function BridgeRow({ theory, real }: { theory: string; real: string }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className="font-mono text-[13px] text-accent2">{theory}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{real}</div>
    </div>
  );
}

function ComponentMap() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 600 360"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="cmpArrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#a0a8b8" />
          </marker>
        </defs>

        {/* Row labels · 행 사이 vertical gap 에 배치, 박스와 겹치지 않게 */}
        <RowLabel y={14} text="외부" />
        <RowLabel y={86} text="입출력" />
        <RowLabel y={176} text="상태" />
        <RowLabel y={276} text="영구" />

        {/* Row 1 · 외부 */}
        <Box x={40} y={22} w={140} title="Network" />
        <Box x={420} y={22} w={140} title="RPC clients" />

        {/* Row 2 · 입출력 */}
        <Box x={40} y={104} w={140} title="P2P stack" tone="accent2" />
        <Box x={230} y={104} w={140} title="Validator" tone="accent" />
        <Box x={420} y={104} w={140} title="RPC server" tone="accent2" />

        {/* 외부 ↔ 입출력 · 박스 가장자리에서 시작·끝, 양방향은 x offset */}
        <Arrow from={[103, 62]} to={[103, 104]} />
        <Arrow from={[117, 104]} to={[117, 62]} />
        <Arrow from={[483, 62]} to={[483, 104]} />
        <Arrow from={[497, 104]} to={[497, 62]} />

        {/* P2P ↔ Validator · 양방향은 y offset */}
        <Arrow from={[180, 119]} to={[230, 119]} />
        <Arrow from={[230, 129]} to={[180, 129]} />

        {/* RPC server ↔ Validator */}
        <Arrow from={[420, 119]} to={[370, 119]} />
        <Arrow from={[370, 129]} to={[420, 129]} />

        {/* Row 3 · 상태 */}
        <Box x={40} y={194} w={140} title="Mempool" />
        <Box x={230} y={194} w={140} title="ChainState" />
        <Box x={420} y={194} w={140} title="Block index" />

        {/* Validator ↔ 상태 (양방향 점선) */}
        <DashLine from={[110, 194]} to={[280, 144]} />
        <DashLine from={[300, 194]} to={[300, 144]} />
        <DashLine from={[490, 194]} to={[320, 144]} />

        {/* Row 4 · 영구 */}
        <Box x={40} y={294} w={250} title="Block files" />
        <Box x={310} y={294} w={250} title="Wallet (옵션)" />
      </svg>
      <div className="mt-3 text-[12px] text-muted leading-relaxed">
        실선 = 데이터 흐름 · 점선 = 검증기와 상태의 읽기·쓰기 의존
      </div>
    </div>
  );
}

function RowLabel({ y, text }: { y: number; text: string }) {
  return (
    <text
      x={20}
      y={y}
      fontSize="11"
      fill="#a0a8b8"
      fontFamily="JetBrains Mono"
      fontWeight="500"
    >
      {text}
    </text>
  );
}

function Box({
  x,
  y,
  w,
  title,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  tone?: "accent" | "accent2";
}) {
  const stroke =
    tone === "accent"
      ? "#f7931a"
      : tone === "accent2"
        ? "#5b8def"
        : "#7a8190";
  const textColor =
    tone === "accent"
      ? "#f7931a"
      : tone === "accent2"
        ? "#5b8def"
        : "#e6e8ec";
  const h = 40;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#0d0f14"
        stroke={stroke}
        strokeWidth="1.2"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="13"
        fill={textColor}
        fontFamily="JetBrains Mono"
        fontWeight="500"
      >
        {title}
      </text>
    </g>
  );
}

function Arrow({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="#a0a8b8"
      strokeWidth="1"
      markerEnd="url(#cmpArrow)"
    />
  );
}

function DashLine({
  from,
  to,
}: {
  from: [number, number];
  to: [number, number];
}) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="#7a8190"
      strokeWidth="0.9"
      strokeDasharray="3 4"
      opacity="0.7"
    />
  );
}

function ComponentMapGuide() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-[16px] font-medium text-text leading-snug">
          그림을 읽는 법
        </h4>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          노드 안의 모듈들을 네 가지 책임으로 행 (row) 을 나눠 그렸다. 위에서
          아래로 갈수록 ‘바깥 세상 → 짧게 살아 있는 상태 → 영구히 디스크에
          남는 것’ 순서.
        </p>
      </div>

      <div className="border border-edge divide-y divide-edge">
        <RowExplain
          label="외부"
          tone="muted"
          body="노드 입장에서 ‘바깥 세상’. 다른 풀 노드들 (네트워크 너머) 과 RPC 로 접속해 오는 클라이언트 (지갑, bitcoin-cli 같은 명령줄 도구) 두 종류. 노드는 이 둘과 직접 메시지를 주고받는다."
        />
        <RowExplain
          label="입출력"
          tone="accent2"
          body="외부 메시지를 받아 내부로 통역하고, 내부 결정을 외부로 내보내는 모듈들. P2P stack 이 네트워크 측, RPC server 가 클라이언트 측. 가운데 Validator 는 양쪽에서 받은 ‘이거 받아도 되나?’ 의 모든 판단을 한다 (노드의 두뇌)."
        />
        <RowExplain
          label="상태"
          tone="muted"
          body="노드가 ‘지금 무엇이 사실인지’ 를 기억하는 자료구조. ChainState (현재 안 쓴 UTXO 셋), Block index (블록 헤더와 위치의 색인), Mempool (아직 블록에 안 들어간 검증된 tx 들). Validator 는 이 셋을 모두 읽고, 새 블록이 들어오면 셋 모두에 변경을 가한다."
        />
        <RowExplain
          label="영구"
          tone="muted"
          body="디스크에 사실상 영원히 쌓이는 데이터. Block files (블록 본체 모음) 와 Wallet (옵션, 키와 트랜잭션 기록). 이게 ‘노드를 껐다 켜도 잃지 않는’ 자산."
        />
      </div>

      <div className="space-y-2 pt-1">
        <h4 className="text-[16px] font-medium text-text leading-snug">
          어떤 흐름으로 움직이나
        </h4>
        <div className="space-y-3">
          <div>
            <div className="text-[13px] font-mono text-accent2 mb-1">
              새 트랜잭션이 도착할 때
            </div>
            <p className="text-[14px] text-text/80 leading-[1.7]">
              네트워크 (또는 사용자의 지갑) → P2P stack / RPC server 가 받음 →
              Validator 로 넘김 → ChainState 와 비교해 ‘input UTXO 가 실제로
              안 쓰였나, 서명 맞나, fee 음수 아니나’ 등을 검증 → 통과하면{" "}
              <span className="text-text">Mempool 에 추가</span> 하고 이웃 노드
              들에 다시 가십.
            </p>
          </div>
          <div>
            <div className="text-[13px] font-mono text-accent mb-1">
              새 블록이 도착할 때
            </div>
            <p className="text-[14px] text-text/80 leading-[1.7]">
              P2P stack 이 블록 받음 → Validator 가 헤더·tx·script·signature 모두
              검증 → 통과 시 (a) 안의 tx 들의 input UTXO 를{" "}
              <span className="text-text">ChainState 에서 제거</span>, 새 output
              들을 추가 (b){" "}
              <span className="text-text">Block index 에 새 블록 위치 기록</span>{" "}
              (c) 본체를 <span className="text-text">Block files 에 append</span>{" "}
              (d) <span className="text-text">Mempool 에서 이미 포함된 tx 제거</span>{" "}
              (e) 이웃 노드들에 ‘이거 받았어’ 가십. 한 사이클.
            </p>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-text/65 leading-[1.7]">
        그래서 그림의 화살표 의미 · 실선 (외부 ↔ 입출력, 입출력 ↔ Validator) 은
        직접적인 메시지 흐름. 점선 (Validator ↔ 상태) 은 ‘검증 중에 읽고
        결과로 쓴다’ 는 의존 관계. 영구 (Block files / Wallet) 는 상태 모듈
        들이 디스크에 보존하는 결과물이라 화살표를 그리진 않았다.
      </p>
    </div>
  );
}

function RowExplain({
  label,
  tone,
  body,
}: {
  label: string;
  tone?: "accent2" | "muted";
  body: string;
}) {
  const color = tone === "accent2" ? "text-accent2" : "text-accent";
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className={`text-[13px] font-semibold ${color}`}>
        {label}
      </div>
      <div className="text-[13px] text-text/80 leading-[1.65]">{body}</div>
    </div>
  );
}

function ComponentTable() {
  const components = [
    {
      name: "P2P stack",
      role: "다른 노드와 연결, inv/getdata/block/tx 같은 짧은 메시지 송수신",
      bind: "S6 Network",
    },
    {
      name: "Validator",
      role: "헤더·tx·script 검증, 합의 규칙 적용. 노드의 ‘두뇌’",
      bind: "S5 Block · S7 Blockchain",
    },
    {
      name: "Mempool",
      role: "아직 블록에 안 들어간 검증된 tx 풀, fee 정렬",
      bind: "S3 Transaction",
    },
    {
      name: "ChainState",
      role: "현재 UTXO 셋. (txid, vout) → output 의 키-값 저장",
      bind: "S4 UTXO",
    },
    {
      name: "Block index",
      role: "지금까지 본 모든 블록의 헤더와 위치 인덱스",
      bind: "S7 Blockchain",
    },
    {
      name: "Block files",
      role: "원시 블록 데이터. 블록 본체가 영구히 보관되는 곳",
      bind: "S5 Block",
    },
    {
      name: "Wallet (옵션)",
      role: "키와 트랜잭션 기록. 코어 노드와 분리된 모듈",
      bind: "S1 Wallet",
    },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-[120px_1fr_140px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>구성 요소</div>
        <div>역할</div>
        <div>연결 레이어</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {components.map((c) => (
          <div
            key={c.name}
            className="grid grid-cols-[120px_1fr_140px] gap-3 px-4 py-2.5 items-baseline"
          >
            <div className="font-mono text-[13px] text-text/85">{c.name}</div>
            <div className="text-[13px] text-text/70 leading-relaxed">{c.role}</div>
            <div className="font-mono text-[12px] text-muted">{c.bind}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
