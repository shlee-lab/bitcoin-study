"use client";

import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Reflection, Probe, Reading } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

const HEADER_FIELDS = [
  {
    name: "version",
    sample: "0x20000000",
    desc: "프로토콜 버전 비트, 소프트포크 신호용으로도 쓰임",
    bytes: 4,
  },
  {
    name: "prev_block_hash",
    sample: "00000000000000000005c4…f0d8e1",
    desc: "이전 블록 헤더의 double-SHA256. 사슬을 만드는 연결고리",
    bytes: 32,
    accent: true,
  },
  {
    name: "merkle_root",
    sample: "4a5b9c…7d2e3f",
    desc: "이 블록의 트랜잭션들을 쌍으로 해시해 올라간 머클 트리의 루트",
    bytes: 32,
  },
  {
    name: "timestamp",
    sample: "1709913600",
    desc: "Unix epoch 초. 노드들의 합의 가능한 범위 안에서만 허용",
    bytes: 4,
  },
  {
    name: "bits",
    sample: "0x17034219",
    desc: "현재 난이도 목표값 (target). 헤더 해시가 이 값보다 작아야 유효",
    bytes: 4,
    accent: true,
  },
  {
    name: "nonce",
    sample: "2 893 471 102",
    desc: "채굴자가 바꿔가며 헤더 해시를 target 미만으로 떨어뜨릴 때까지 시도하는 값",
    bytes: 4,
    accent: true,
  },
];

export function L4Block(props: LayerProps) {
  return (
    <LayerShell
      id="S5"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "블록이란", subtitle: "트랜잭션을 담는 그릇",
                body: (
                  <section className="space-y-5">
                    <p className="text-[17px] text-text/80 leading-[1.75]">
                      Alice 가 UTXO 를 사용하기로 서명한 트랜잭션은{" "}
                      <span className="text-text">어디에 보관될까?</span> S3 ~ S4
                      에선 ‘메시지가 만들어지는 모양’ 만 봤다. 만들어진 그
                      메시지는 네트워크에 잠시 떠다니다 (mempool), 누군가가
                      <span className="text-text"> 한 묶음으로 봉인한 단위</span>
                      에 담겨 영구히 기록된다. 그 묶음이 바로{" "}
                      <span className="text-text">블록</span> 이다. 여러 블록이
                      다시{" "}
                      <span className="text-text">암호학적으로 연결되어 하나의 사슬을 이루면</span>{" "}
                      그것이 블록체인이 된다 (두 단계 뒤 S7).
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <Stage label="트랜잭션" sub="S3" tone="muted" current={false} />
                      <Stage label="블록" sub="S5" tone="accent" current />
                      <Stage label="블록체인" sub="S7" tone="muted" current={false} />
                    </div>

                    <p className="text-[16px] text-text/75 leading-[1.7]">
                      여기 S5 에서는 ‘한 블록 안’ 을 본다. 블록이 어떻게
                      구성되어 있으며, 그 구조가 왜 변조 불가능성과 PoW 의
                      토대가 되는지 확인한다.
                    </p>

                    <BlockSplitDiagram />

                    <p className="text-[15px] text-text/70 leading-[1.7]">
                      한 블록은 크게 두 부분이다.{" "}
                      <span className="text-text">헤더</span> 는 이 블록의 지문을
                      만드는 작은 요약이고, <span className="text-text">바디</span>
                      는 실제 트랜잭션 목록이다. 채굴의 작업 증명도, 다음 블록과의
                      연결도 모두 헤더를 기준으로 이뤄진다.
                    </p>

                    <p className="text-[15px] text-text/65 leading-[1.7]">
                      다음에는 두 가지 장치를 차례로 살펴본다. 첫째, 헤더가 어떻게
                      블록 전체의 지문이 되는지 본다. 둘째, 수천 건의 트랜잭션을
                      어떻게 짧은 약속으로 묶는지 본다.
                    </p>
                  </section>
                ),
              },
              {
                title: "블록 헤더",
                subtitle: "80 byte짜리 블록의 지문",
                level: "deep",
                body: (
                  <Part
                    n="Part 1"
                    title="헤더 · 80 byte, 블록의 지문"
                    sub="‘이 블록을 가리킨다’ 라는 모든 행위의 기준점. 채굴 작업 증명도 헤더 해시에 걸리고, 다음 블록의 prev_block_hash 도 이 값. 그래서 hash 함수가 무엇이고 왜 변조 불가능한지를 먼저 짚는다."
                  >
                    <HeaderTable />
                    <PrimitivePanel ids={["hash"]} />
                  </Part>
                ),
              },
              {
                title: "트랜잭션 목록과 머클 트리",
                body: (
                  <Part
                    n="Part 2"
                    title="트랜잭션 목록 · 루트 한 값으로 묶기"
                    sub={
                      <>
                        블록 안에는 많은 트랜잭션이 들어 있지만, 헤더에는 그 목록
                        전체가 아니라 <Term id="merkle-root">머클 루트</Term> 한
                        값만 들어간다. 그 루트를 만드는 구조가{" "}
                        <Term id="merkle-tree">머클 트리</Term>다.
                      </>
                    }
                  >
                    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-edge font-mono text-[13px] text-muted">
                        transactions · N
                      </div>
                      <div className="p-4 space-y-2 text-sm">
                        <TxRow
                          idx={0}
                          label="coinbase"
                          desc="채굴 보상 + 수수료를 채굴자 주소로 보내는 특별한 첫 트랜잭션"
                        />
                        <TxRow
                          idx={1}
                          label="tx · 7b3a4f…"
                          desc="Alice → Bob 1 BTC (앞서 본 그것)"
                        />
                        <TxRow
                          idx={2}
                          label="tx · 91c0e6…"
                          desc="다른 누군가의 트랜잭션"
                        />
                        <div className="text-xs text-muted font-mono pt-1">
                          …
                        </div>
                      </div>
                    </div>
                    <PrimitivePanel ids={["merkle"]} />
                  </Part>
                ),
              },
              {
                title: "블록 공간의 다른 쓰임",
                subtitle: "NFT, Lightning, 메타 프로토콜",
                level: "case",
                body: (
                  <Part
                    n="Part 3"
                    title="block space 의 또 다른 사용 · 결제 외의 것들"
                    sub="‘블록 공간’ 은 단순 결제 외에도 다양한 용도로 쓰여 왔다. 비트코인 위에 자산·이름·예술품을 새기려는 시도들. 그 결과물은 늘 ‘영구 저장 비용 vs 표현력’ 의 트레이드오프 위에 놓인다."
                  >
                    <BlockSpaceUses />
                  </Part>
                ),
              },
              {
                title: "생각해보기", subtitle: "1 MB 의 정치학",
                body: (
                  <Reflection title="블록 크기가 결정한 비트코인의 정체성">
                    <p>
                      2017 년 비트코인은 둘로 갈라졌다. ‘블록 크기를 늘리자’
                      (Bitcoin Cash) vs ‘기반 계층은 작게, 그 위에 Lightning
                      같은 2계층으로 확장’ (Bitcoin). 같은 코드, 같은 출발점에서
                      나왔지만 디자인 철학은 정반대였다.
                    </p>
                    <p>
                      블록이 커지면 처리량이 늘고 사용자 수수료는 낮아질 수 있다.
                      그러나 노드 운영 비용도 함께 커진다. 그 결과 풀 노드를
                      운영할 수 있는 사람이 줄어들고, 네트워크가 소수 대형 노드에
                      의존할 위험이 커진다.
                    </p>
                    <p>
                      블록이 작으면 일반 사용자도 풀 노드를 운영하기 쉽고 분산성을
                      유지하기 유리하다. 대신 기반 계층의 처리량이 제한되고,
                      수수료 시장과 2계층 확장에 더 의존하게 된다.
                    </p>
                    <Probe>
                      ‘분산성’ 이 정확히 무엇인가? 노드 수? 채굴자 수? 누가
                      검증할 수 있는가? 비트코인은 ‘일반 사용자가 자기 노드를
                      돌릴 수 있는 한계’ 를 분산성의 척도로 본다. 그래서 1 MB
                      라는 작은 숫자가 단순한 성능 설정이 아니라 핵심 제약이 된다.
                    </Probe>
                    <Reading label="관련 사례">
                      ordinals/inscriptions 가 2023 년 블록을 가득 채우면서
                      평균 fee 가 5–20× 치솟은 사건. ‘블록 공간이 누구의 것이냐’
                      라는 논쟁의 또 다른 형태였다.
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

function BlockSpaceUses() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <UseCard
          name="OP_RETURN"
          since="2014~ (Core 0.9)"
          summary="트랜잭션 output 에 최대 80 byte 임의 데이터를 넣을 수 있는 비-소비 출력. UTXO 셋을 더럽히지 않는 ‘공식’ 데이터 첨부 방식."
          examples="타임스탬프 (OpenTimestamps), 메모, 자산 발행 (Counterparty, Omni / USDT-Omni 의 출발점)"
        />
        <UseCard
          name="Ordinals · 비트코인 NFT"
          since="2023~ (Casey Rodarmor)"
          summary="개별 satoshi 에 일련번호를 매기고, 그 sat 을 보내는 트랜잭션의 witness 영역에 이미지·텍스트·HTML 을 새겨 (inscribe) ‘NFT 처럼’ 만든다."
          examples="이미지 inscriptions, ‘비트코인 펑크’ 컬렉션, on-chain 게임"
          tone="accent"
        />
        <UseCard
          name="BRC-20"
          since="2023~"
          summary="ordinals 위에 JSON 텍스트로 ‘토큰 발행/이체’ 규약을 흉내낸 메타 프로토콜. 비트코인 자체는 모르고, 외부 인덱서가 해석. fungible 토큰 흉내."
          examples="$ORDI, $SATS 등 밈 토큰 다수"
        />
        <UseCard
          name="Runes"
          since="2024 (Halving)"
          summary="Casey 가 ordinals 의 한계 (UTXO 부풀림) 를 보완하려 발표한 새 fungible 토큰 표준. OP_RETURN 기반이라 UTXO 셋에 남기는 부담이 상대적으로 작다."
          examples="UNCOMMON•GOODS 등"
        />
        <UseCard
          name="Lightning channel funding"
          since="2018~ (BOLT)"
          summary="2-of-2 multisig output 으로 채널을 ‘열고’, 채널 안에선 무수한 오프체인 결제. 채널 ‘닫을’ 때만 블록에 기록 → 비트코인이 정산 계층 역할."
          examples="Lightning Network: 일상 소액 결제"
          tone="accent2"
        />
        <UseCard
          name="Atomic swap · HTLC"
          since="2017~"
          summary="해시 기반 시간 잠금 (Hashed Timelock Contract) 으로 두 체인 간 신뢰 없이 자산을 교환한다. 한쪽이 비밀을 공개하면 다른 쪽도 같은 비밀로 자금을 풀 수 있다."
          examples="BTC ↔ LTC 교환, Lightning 결제 라우팅의 토대"
        />
        <UseCard
          name="Stamps"
          since="2023~"
          summary="ordinals 와 달리 출력 자체에 base64 데이터를 박는다. UTXO 셋에 영구히 남아 ‘진짜로 영원’ 한 데이터지만, 그래서 더 비싸고 노드 부담 ↑."
          examples="‘Bitcoin Stamps (SRC-20)’ 같은 시도"
          tone="warn"
        />
        <UseCard
          name="Counterparty · Omni (옛날)"
          since="2014~"
          summary="OP_RETURN 위에 자산 발행/이체를 정의한 1세대 메타 프로토콜. USDT 가 처음엔 Omni (BTC 위) 에서 시작."
          examples="Tether USDT (초기), Counterparty 토큰들"
        />
      </div>
      <div className="rounded-sm border border-edge bg-surface/20 p-3.5 text-sm leading-relaxed">
        <h4 className="text-[16px] font-medium text-accent2 leading-snug mb-2">
          공통 트레이드오프
        </h4>
        <p className="text-text/85">
          이 모든 용도는 ‘블록 공간 = 영구 분산 저장소’ 라는 비트코인의 강점을
          빌린다. 하지만 그 공간은 비싸고 (모든 풀 노드가 영구 보관), 채굴자
          fee 시장에서 결제 트랜잭션과 경쟁한다. ordinals 붐 때 평균 수수료가
          평소의 5–20× 까지 치솟은 것이 대표적인 예다.
        </p>
        <p className="text-muted mt-2">
          이것이 ‘좋은 사용’ 인지에 대해서는 의견이 갈린다. 어떤 사람은 수수료
          시장을 키워 장기 보안에 도움이 된다고 보고, 어떤 사람은 결제 본연의
          용도를 방해하는 spam 이라고 본다. 비트코인 프로토콜은 데이터를
          받아들일 뿐이며, 그 데이터의 ‘의미’ 는 외부 해석에 달려 있다.
        </p>
      </div>
    </div>
  );
}

function UseCard({
  name,
  since,
  summary,
  examples,
  tone,
}: {
  name: string;
  since: string;
  summary: string;
  examples: string;
  tone?: "accent" | "accent2" | "warn";
}) {
  const border =
    tone === "accent"
      ? "border-accent/40"
      : tone === "accent2"
        ? "border-accent2/40"
        : tone === "warn"
          ? "border-[#f7931a]/30"
          : "border-edge";
  const heading =
    tone === "accent"
      ? "text-accent"
      : tone === "accent2"
        ? "text-accent2"
        : tone === "warn"
          ? "text-[#f7931a]"
          : "text-text/85";
  return (
    <div className={`rounded-sm border ${border} bg-surface/30 p-4 space-y-2`}>
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div className={`text-[15px] font-semibold ${heading} leading-snug`}>
          {name}
        </div>
        <div className="text-xs text-muted font-mono">{since}</div>
      </div>
      <div className="text-[15px] text-text/85 leading-[1.7]">{summary}</div>
      <div className="text-xs text-muted font-mono pt-1 border-t border-edge">
        예: {examples}
      </div>
    </div>
  );
}

function Part({
  n,
  title,
  sub,
  children,
}: {
  n: string;
  title: string;
  sub: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="border-l-2 border-accent/60 pl-4">
        <div className="text-[13px] text-muted font-semibold">
          {n}
        </div>
        <h2 className="text-lg font-medium mt-1">{title}</h2>
        <p className="text-[15px] text-text/70 leading-[1.7] mt-2">
          {sub}
        </p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function HeaderTable() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge flex items-baseline justify-between">
        <div className="font-mono text-[13px] text-muted">block header</div>
        <div className="font-mono text-xs text-muted">80 bytes total</div>
      </div>
      <div className="divide-y divide-edge">
        {HEADER_FIELDS.map((f) => (
          <div key={f.name} className="px-4 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={`font-mono text-sm ${
                  f.accent ? "text-accent" : "text-text/85"
                }`}
              >
                {f.name}
              </span>
              <span className="font-mono text-xs text-muted">
                {f.bytes} byte
              </span>
            </div>
            <div className="font-mono text-[13px] text-text/80 mt-1 break-all">
              {f.sample}
            </div>
            <div className="text-[13px] text-muted mt-1 leading-relaxed">
              {f.desc}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-edge bg-bg/30 font-mono text-[13px] text-muted">
        block_id ={" "}
        <span className="text-accent">double-SHA256</span>(header) ={" "}
        <span className="text-text/80">000000…0a3f1c</span>
      </div>
    </div>
  );
}

function TxRow({
  idx,
  label,
  desc,
}: {
  idx: number;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-muted w-6 shrink-0">
        #{idx}
      </span>
      <span className="font-mono text-[13px] text-text/85 shrink-0">{label}</span>
      <span className="text-[13px] text-muted">{desc}</span>
    </div>
  );
}

function Stage({
  label,
  sub,
  tone,
  current,
}: {
  label: string;
  sub: string;
  tone: "muted" | "accent";
  current: boolean;
}) {
  const c =
    current ? "text-accent" : tone === "muted" ? "text-text/65" : "text-text/85";
  return (
    <div
      className={`relative py-3 ${
        current ? "bg-accent/5 border-b-2 border-accent" : "border-b border-edge/60"
      }`}
    >
      <div className={`text-[14px] font-medium ${c}`}>{label}</div>
      <div className="text-[12px] font-medium text-muted/85 mt-1">
        {sub}
      </div>
      {current && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[12px] font-semibold text-accent bg-bg px-2">
          여기
        </div>
      )}
    </div>
  );
}

function BlockSplitDiagram() {
  // 더 다듬은 단면도 · header 위에 prev←hash, body 안 tx 들이 merkle 로 모이고,
  // 블록 우측에서 "이 블록의 hash" 가 다음 블록으로 넘어가는 흐름까지 hint.
  const W = 720;
  const H = 320;
  return (
    <div className="rounded-sm border border-edge bg-surface/30 px-5 pt-4 pb-3">
      <div className="text-[13px] font-semibold text-muted mb-3">
        Block · cross-section
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker
            id="bsArr"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#7a8190" />
          </marker>
          <linearGradient id="bsHeaderBg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5b8def" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#5b8def" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="bsBodyBg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f7931a" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f7931a" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* prev block · 좌측 그림자 */}
        <rect x={6} y={70} width={70} height={180} fill="#0d0f14" stroke="#3a3f4a" strokeWidth="0.8" />
        <text x={41} y={170} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">
          prev
        </text>
        <text x={41} y={184} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">
          block
        </text>

        {/* prev → header arrow (prev_hash 연결) */}
        <line x1={76} y1={108} x2={120} y2={108} stroke="#5b8def" strokeWidth="1" markerEnd="url(#bsArr)" opacity="0.7" />
        <text x={98} y={102} textAnchor="middle" fontSize="11" fill="#5b8def" fontFamily="JetBrains Mono">
          prev_hash
        </text>

        {/* 가운데 ‘이 블록’ */}
        <g>
          <rect x={120} y={70} width={500} height={180} fill="none" stroke="#a0a8b8" strokeWidth="1.6" />

          {/* HEADER 영역 */}
          <rect x={120} y={70} width={500} height={70} fill="url(#bsHeaderBg)" stroke="#5b8def" strokeWidth="1" />
          <text x={134} y={92} fontSize="11" fill="#5b8def" fontFamily="JetBrains Mono" letterSpacing="1.5">
            HEADER · 80 BYTE
          </text>
          {/* 6 필드를 작은 셀로 */}
          {[
            { x: 134, label: "version" },
            { x: 210, label: "prev_hash" },
            { x: 296, label: "merkle_root" },
            { x: 388, label: "time" },
            { x: 444, label: "bits" },
            { x: 498, label: "nonce" },
          ].map((f, i) => (
            <g key={i}>
              <rect x={f.x} y={104} width={f.label.length * 6.6 + 12} height={22} fill="#0a0c14" stroke="#5b8def" strokeWidth="0.6" opacity="0.85" />
              <text x={f.x + (f.label.length * 6.6 + 12) / 2} y={119} textAnchor="middle" fontSize="9.5" fill="#5b8def" fontFamily="JetBrains Mono">
                {f.label}
              </text>
            </g>
          ))}

          {/* BODY 영역 */}
          <rect x={120} y={140} width={500} height={110} fill="url(#bsBodyBg)" stroke="#f7931a" strokeWidth="1" />
          <text x={134} y={162} fontSize="11" fill="#f7931a" fontFamily="JetBrains Mono" letterSpacing="1.5">
            BODY · TRANSACTION LIST
          </text>

          {/* tx 들 */}
          {[
            { x: 134, label: "coinbase", solid: true },
            { x: 196, label: "tx 1" },
            { x: 252, label: "tx 2" },
            { x: 308, label: "tx 3" },
            { x: 364, label: "tx 4" },
            { x: 420, label: "tx 5" },
            { x: 476, label: "tx 6" },
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x} 178)`}>
              <rect
                width={50}
                height={28}
               
                fill={t.solid ? "#f7931a" : "#0a0c14"}
                stroke="#f7931a"
                strokeWidth={t.solid ? 0 : 0.8}
                opacity={t.solid ? 1 : 0.85}
              />
              <text
                x={25}
                y={18}
                textAnchor="middle"
                fontSize="9"
                fill={t.solid ? "#0a0c14" : "#f7931a"}
                fontFamily="JetBrains Mono"
                fontWeight={t.solid ? 600 : 400}
              >
                {t.label}
              </text>
            </g>
          ))}
          <text x={538} y={196} fontSize="10" fill="#f7931a" fontFamily="JetBrains Mono" opacity="0.85">
            ⋯ 수천 건
          </text>
          <text x={134} y={228} fontSize="9.5" fill="#f7931a" fontFamily="JetBrains Mono" opacity="0.7">
            coinbase first · tx list
          </text>

          {/* 헤더와 바디를 잇는 점선 (merkle_root 가 body 의 모든 tx 를 묶음) */}
          <path
            d="M 350 126 L 320 178"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="0.8"
            strokeDasharray="3 3"
            markerEnd="url(#bsArr)"
          />
          <text x={358} y={156} fontSize="11" fill="#a78bfa" fontFamily="JetBrains Mono">
            merkle_root 가 body 전체를 묶음
          </text>
        </g>

        {/* 우측: 다음 block 으로 hash 가 넘어감 */}
        <line x1={620} y1={108} x2={664} y2={108} stroke="#f7931a" strokeWidth="1" markerEnd="url(#bsArr)" opacity="0.7" />
        <text x={642} y={102} textAnchor="middle" fontSize="11" fill="#f7931a" fontFamily="JetBrains Mono">
          this hash
        </text>
        <rect x={668} y={70} width={48} height={180} fill="#0d0f14" stroke="#3a3f4a" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x={692} y={170} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">
          next
        </text>
      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        블록 body 는 평균 약 1 MB 의 트랜잭션 목록이고, 첫 tx 는 항상 coinbase
        (채굴 보상) 이다.
      </div>
    </div>
  );
}
