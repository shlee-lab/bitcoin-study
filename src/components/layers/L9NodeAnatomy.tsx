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
                title: "생각해보기", subtitle: "비트코인은 탈중앙화된 시스템인데 코드는 누가 관리할까?",
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
    <Reflection title="비트코인은 탈중앙화된 시스템인데 코드는 누가 관리할까?">
      <p>
        비트코인은 탈중앙화된 시스템이라고 한다. 하지만 실제 네트워크가 따르는
        규칙은 결국 소프트웨어 코드로 구현된다. 현재 그 사실상의 표준 구현체는{" "}
        <span className="text-text">Bitcoin Core</span> 이고, 대부분의 풀 노드는
        이 코드를 기준으로 합의 규칙을 검증한다.
      </p>
      <p>
        여기서 긴장이 생긴다. 누구나 코드를 읽고, fork 하고, 다른 구현체를 만들
        수 있다. 그러나 Bitcoin Core 와 100% 같은 규칙으로 동작하지 않으면 같은
        체인에 머물 수 없다. btcd, libbitcoin 같은 대체 구현체가 있어도 실제 운영
        세계에서는 Bitcoin Core 의 동작을 정확히 복제해야 하는 압력이 크다.
      </p>
      <p>
        코드 관리도 완전히 흩어져 있지는 않다. Bitcoin Core 저장소에 직접 commit
        할 수 있는 maintainer 는 소수이고, 정기 contributor 도 넓은 대중이라기보다
        비교적 작은 전문가 집단이다. 표면적으로는 <Term id="bip">BIP</Term> 절차와
        공개 PR 리뷰가 열려 있지만, 어떤 변경이 실제 release 에 포함될지는 이 작은
        개발 생태계의 검토와 보수적 판단에 크게 의존한다.
      </p>
      <p>
        이더리움은 이 문제에 다른 방식으로 대응한다. 실행 client 와 합의 client 를
        여러 개 유지하고, 한 구현체에 지분이 과도하게 몰리지 않도록 client diversity
        를 강조한다. 반면 비트코인은 다중 client 보다{" "}
        <span className="text-text">단일 표준 구현의 예측 가능성</span> 을 더
        중시해 왔다. 이것은 장점이기도 하고 위험이기도 하다.
      </p>
      <Probe>
        만약 Bitcoin Core 에 치명적 버그가 있다면 어떻게 될까? 2018 년
        <span className="text-text"> CVE-2018-17144</span> 는 특정 조건에서
        같은 input 을 두 번 쓰는 트랜잭션을 놓칠 수 있었던 버그였다. 악용됐다면
        발행 한도 자체가 흔들릴 수 있었다. 다행히 패치 전에 발견됐지만, 이 사건은
        단일 구현의 안정성과 다중 구현의 다양성 사이에 실제 트레이드오프가 있음을
        보여준다.
      </Probe>
      <Probe>
        “Don’t trust, verify” 는 코드에도 적용될 수 있을까? 노드 운영자는 이론상
        자신이 돌릴 버전을 선택하지만, 실제로는 누군가의 코드 리뷰와 release 를
        신뢰하게 된다. 이것은 비트코인의 결함일까, 아니면 보수적으로 천천히 변하는
        시스템이 감수해야 하는 현실일까?
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
          <code className="font-mono text-text">mempool</code>. 이것을 어떻게
          나눠뒀는가가 ‘추상과 구현의 차이’ 를 이해하는 핵심이다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent2 leading-snug">
            네트워크 위
          </div>
          <h3 className="text-[18px] font-medium text-text leading-snug">
            블록체인
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            합의의 추상 자료구조. 한 블록이{" "}
            <code className="font-mono text-text">prev_hash</code> 로 직전
            블록을 가리키는 <span className="text-text">linked chain</span> 이다.
            S7 에서 본 구조가 곧 비트코인이 합의를 표현하는 방식이다.
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
            노드는 그 체인을 그대로 ‘이어진 자료구조’ 로 저장하지 않는다.
            매 블록마다 수천 번 조회·갱신이 일어나니, 그렇게 두면 너무 느림.
            그래서 효율을 위해{" "}
            <span className="text-text">key-value DB 두 개</span> 와{" "}
            <span className="text-text">flat 파일</span> 로 분해 저장.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
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
          <span className="text-text">체인 형태</span> 가 의미 있다 · prev_hash
          한 줄로 거꾸로 거슬러 올라가 변조 불가능을 보장.
          그러나 한 노드 안에선 그 추상을 그대로 메모리/디스크에 둘 이유가 없다.
          노드가 매 순간 묻는 질문은 ‘이 UTXO 가 아직 살아있나?’ 같은{" "}
          <span className="text-text">key-value lookup</span> 이다. 그래서 LevelDB 가
          그 역할을 맡는다.
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
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 px-4 py-3 items-baseline">
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
          S1 ~ S9 에서는 비트코인이 작동하기 위해 필요한 개념적 구성을 확인했다.
          그럼 그 추상적인 개념들이 실제로{" "}
          <span className="text-text">컴퓨터 한 대 위에서 무엇이 어떻게
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

      <div className="space-y-3">
        <BridgeCard
          concept="UTXO set"
          implementation="ChainState"
          body="노드는 ‘지금 쓸 수 있는 output’ 만 따로 모아 둔다. 새 tx 가 오면 이 저장소를 보고 input 이 실제로 남아 있는지 확인한다."
        />
        <BridgeCard
          concept="블록 검증"
          implementation="Validator"
          body="블록이 도착하면 곧바로 체인에 붙지 않는다. Validator 가 헤더, 작업증명, tx, script, signature 를 차례로 검사하고, 하나라도 실패하면 버린다."
        />
        <BridgeCard
          concept="네트워크 전파"
          implementation="P2P stack"
          body="노드는 다른 노드에게 새 tx 나 블록이 있다는 사실을 알리고, 필요한 데이터만 요청해 받는다. inv, getdata, block 같은 짧은 메시지가 이 일을 한다."
        />
        <BridgeCard
          concept="처음 실행할 때의 검증"
          implementation="Initial Block Download"
          body="노드는 남이 준 잔액표를 믿지 않는다. genesis block 부터 현재까지 직접 다시 계산해서 자기 ChainState 를 만든다."
        />
        <BridgeCard
          concept="대기 중인 트랜잭션"
          implementation="Mempool"
          body="아직 블록에 들어가지 않은 tx 는 임시 공간에 머문다. 채굴자는 여기서 fee 가 높은 tx 부터 블록 후보에 넣는다."
        />
      </div>

      <p className="text-[14px] text-text/65 leading-[1.7]">
        S10 에선 노드의 <span className="text-text">정적 구조</span> 만 본다.
        어떤 모듈이 있고, 추상 ‘블록체인’ 이 실제 노드 안에선 어떤 모양인지.
        그 구조 위에서 노드가 어떻게 ‘살아 움직이는지’ 는 S11.
      </p>
    </section>
  );
}

function BridgeCard({
  concept,
  implementation,
  body,
}: {
  concept: string;
  implementation: string;
  body: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <div className="text-[16px] font-medium text-text leading-snug">
          {concept}
        </div>
        <div className="text-[13px] font-medium text-accent2 leading-snug">
          노드 안에서는 {implementation}
        </div>
      </div>
      <p className="text-[14px] text-text/78 leading-[1.7]">{body}</p>
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
        <RowLabel y={14} text="외부 연결" />
        <RowLabel y={86} text="검증" />
        <RowLabel y={176} text="현재 상태" />
        <RowLabel y={276} text="영구 저장" />

        {/* Row 1 · 외부 */}
        <Box x={40} y={22} w={140} title="Network" />
        <Box x={420} y={22} w={140} title="RPC clients" />

        {/* Row 2 · 검증 */}
        <Box x={40} y={104} w={140} title="P2P stack" tone="accent2" />
        <Box x={230} y={104} w={140} title="Validator" tone="accent" />
        <Box x={420} y={104} w={140} title="RPC server" tone="accent2" />

        {/* 외부 ↔ 검증 · 박스 가장자리에서 시작·끝, 양방향은 x offset */}
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
      fontSize="12"
      fill="#a0a8b8"
      fontFamily="Inter, system-ui, sans-serif"
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
          이 그림은 노드 한 대가 외부 메시지를 받고, 검증하고, 자기 상태를
          업데이트한 뒤, 필요한 데이터는 디스크에 남기는 흐름을 보여준다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <RowExplain
          label="외부 연결"
          tone="muted"
          body="다른 풀 노드와는 P2P 로 통신하고, 지갑이나 bitcoin-cli 같은 도구는 RPC 로 접속한다. 노드는 이 두 통로를 통해 tx 와 블록을 받는다."
        />
        <RowExplain
          label="검증"
          tone="accent2"
          body="Validator 는 노드의 판단 담당이다. 받은 tx 나 블록이 합의 규칙을 만족하는지 확인하고, 통과한 것만 다음 단계로 넘긴다."
        />
        <RowExplain
          label="현재 상태"
          tone="muted"
          body="ChainState, Block index, Mempool 은 노드가 지금 알고 있는 상태다. Validator 는 검증할 때 이 자료들을 읽고, 새 블록이 확정되면 내용을 갱신한다."
        />
        <RowExplain
          label="영구 저장"
          tone="muted"
          body="Block files 는 블록 본체를 디스크에 저장한다. Wallet 은 선택 모듈이지만, 켜져 있다면 키와 내 거래 기록을 보관한다."
        />
      </div>

      <div className="space-y-2 pt-1">
        <h4 className="text-[16px] font-medium text-text leading-snug">
          어떤 흐름으로 움직이나
        </h4>
        <div className="space-y-3">
          <div>
            <div className="text-[15px] font-medium text-accent2 leading-snug mb-1.5">
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
            <div className="text-[15px] font-medium text-accent leading-snug mb-1.5">
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

      <p className="text-[14px] text-text/65 leading-[1.7]">
        실선 화살표는 메시지가 실제로 오가는 길이고, 점선은 Validator 가 검증 중에
        읽거나 갱신하는 내부 상태를 뜻한다. Block files 와 Wallet 은 노드를 껐다
        켜도 남아야 하는 데이터라 별도의 저장 영역으로 표시했다.
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
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-1.5">
      <div className={`text-[15px] font-medium leading-snug ${color}`}>
        {label}
      </div>
      <div className="text-[14px] text-text/78 leading-[1.7]">{body}</div>
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
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_140px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>구성 요소</div>
        <div>역할</div>
        <div>연결 레이어</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {components.map((c) => (
          <div
            key={c.name}
            className="grid grid-cols-1 sm:grid-cols-[120px_1fr_140px] gap-3 px-4 py-2.5 items-baseline"
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
