"use client";

import { LayerShell } from "../LayerShell";
import { Reflection, Probe, Reading, Callout } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L3UTXO(props: LayerProps) {
  return (
    <LayerShell
      id="S4"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "UTXO란 무엇인가",
                subtitle: "Alice의 1 BTC 송금으로 보기",
                body: (
                  <section className="space-y-4">
                    <p className="text-[17px] text-text/80 leading-[1.7]">
                      S3 에서 트랜잭션이 1.4 BTC UTXO 한 덩어리를 통째로 ‘소비’ 하고
                      두 개의 새 UTXO 를 만드는 모양을 봤다. 그런데 그{" "}
                      <span className="text-text">‘UTXO’</span> 가 정확히 뭔가?
                      왜 비트코인은 ‘잔액 한 칸’ 이 아니라 이런 영수증 모음으로
                      돈을 표현할까?
                    </p>
                    <p className="text-[17px] text-text/70 leading-[1.7]">
                      <span className="text-text">UTXO 는 실제 화폐 (지폐·동전) 와 비슷하다.</span>{" "}
                      10 달러 지폐로 7 달러를 내면 점원이 3 달러를 ‘거스름돈’
                      으로 돌려준다. 그 3 달러가 바로 새로 생긴 UTXO. 그리고{" "}
                      세상의 동전들이 매일 어딘가에 떨어져 사라지듯, 비트코인엔{" "}
                      너무 작아 ‘쓰는 것보다 수수료가 더 큰’ 동전 (사실상 사라진{" "}
                      UTXO) 이 누적된다 (이걸{" "}
                      <span className="text-text">dust</span> 라 한다).
                    </p>
                    <p className="text-[17px] text-text/70 leading-[1.7]">
                      그래서 비트코인엔 ‘잔액’ 같은 단일 숫자가 없다. 대신{" "}
                      <span className="text-text">UTXO</span> (
                      <em className="text-text/85">unspent transaction output</em>
                      ) 의 모음만 있다. ‘Alice 의 잔액’ 은 곧 ‘Alice 의 키로 풀
                      수 있는 UTXO 들의 합계’ 의 줄임말일 뿐.
                    </p>
                    <Example />
                    <Callout title="왜 잔액이 아니라 UTXO 인가?">
                      <ul className="space-y-1.5 text-[15px] leading-[1.7]">
                        <Bullet>
                          각 UTXO 는{" "}
                          <span className="text-text">
                            한 번 쓰이면 다시 쓸 수 없다 (영구 소멸).
                          </span>{" "}
                          두 번 쓰이는 일을 막기가 단순해진다 (double-spending
                          방지).
                        </Bullet>
                        <Bullet>
                          계정 모델은 “현재 누가 얼마” 라는 전역 상태가
                          필요하지만, UTXO 모델은 각 출력의 존재만 확인하면
                          된다. 검증이 더 국소적이다.
                        </Bullet>
                        <Bullet>
                          노드는 모든 UTXO 를 메모리/LevelDB 에 보관하고, 새
                          트랜잭션이 들어오면 그게 가리키는 출력이 진짜 ‘안 쓴’
                          상태인지만 본다.
                        </Bullet>
                      </ul>
                    </Callout>
                  </section>
                ),
              },
              {
                title: "왜 잔액 모델을 쓰지 않았나",
                subtitle: "Account model과 UTXO model",
                body: (
                  <Section
                    heading="왜 ‘잔액’ 이 아니라 ‘UTXO’ 인가"
                    sub="비트코인이 UTXO 라는 영수증 모델을 택한 이유는, 그 선택이 검증·동시성·프라이버시 같은 시스템의 다른 모든 부분에 차이를 만들기 때문이다."
                  >
                    <ModelCompare />
                  </Section>
                ),
              },
              {
                title: "Coin selection · 어떤 UTXO 를 쓸까",
                level: "deep",
                body: (
                  <Section
                    heading="Coin selection · 어떤 UTXO 를 쓸까"
                    sub="output 금액과 fee 만큼 input 합계가 충분한 UTXO 부분집합을 고르는 문제. 지갑마다 알고리즘이 다르고, 선택이 fee · 프라이버시에 영향."
                  >
                    <CoinSelection />
                  </Section>
                ),
              },
              {
                title: "UTXO 그래프 · 출력이 다음 입력이 된다",
                body: (
                  <Section
                    heading="UTXO 그래프 · 출력이 다음 입력이 된다"
                    sub="모든 트랜잭션은 다른 트랜잭션의 출력을 input 으로 가리킨다. 그래서 비트코인의 거래 기록은 본질적으로 출발점 (coinbase) 에서 뻗어나온 거대한 directed graph."
                  >
                    <UtxoGraph />
                  </Section>
                ),
              },
              {
                title: "Dust · 너무 작아서 못 쓰는 UTXO",
                level: "deep",
                body: (
                  <Section
                    heading="Dust · 너무 작아서 못 쓰는 UTXO"
                    sub="UTXO 액수가 너무 작으면 input 으로 쓸 때 드는 fee 가 그 액수보다 커서 ‘쓰는 게 손해’ 가 된다. 이런 UTXO 를 dust 라 부른다."
                  >
                    <DustExplain />
                  </Section>
                ),
              },
              {
                title: "UTXO 셋의 현실",
                subtitle: "모든 노드가 보관하는 1억 개 이상의 영수증",
                level: "deep",
                body: <UtxoSetReality />,
              },
              {
                title: "프라이버시", subtitle: "UTXO 그래프와 체인 분석",
                level: "case",
                body: <UtxoPrivacy />,
              },
              {
                title: "Tainting · Mixing · ZKP", subtitle: "추적과 우회의 줄다리기",
                level: "deep",
                body: <TrackingAndObfuscation />,
              },
              {
                title: "생각해보기", subtitle: "왜 이더리움은 다른 길을 갔나",
                body: (
                  <Reflection title="UTXO vs Account, 데이터 모델이 만드는 다른 세계">
                    <p>
                      비트코인은 UTXO 모델이다. 단순하고 검증이 국소적이다 (이
                      출력이 쓰였나만 보면 된다). 그러나 ‘조건부 계약 (smart
                      contract)’ 같은 복잡한 로직에는 잘 맞지 않는다.
                    </p>
                    <p>
                      이더리움은 account 모델이다. ‘현재 잔액’ 이 명시 필드로 있고,
                      컨트랙트가 그것을 자유롭게 갱신한다. 표현력은 높지만 그만큼
                      전역 상태 의존이 커서 검증이 무겁다. DAO 해킹·재진입 버그처럼
                      복잡성에서 오는 위험도 함께 온다.
                    </p>
                    <Probe>
                      ‘디지털 화폐’ 라는 같은 목표를 두고 비트코인은 단순함을,
                      이더리움은 표현력을 택했다. 같은 결제 시스템이라도 데이터
                      모델을 어떻게 고르는지에 따라 가능한 것과 불가능한 것이
                      달라진다. 단순함 자체가 보안 자산이라는 주장과, 단순함이 곧
                      한계라는 주장. 어느 쪽이 옳을까?
                    </Probe>
                    <Reading label="검색 키워드">
                      Cardano 의 eUTXO (extended UTXO), 비트코인의 covenants
                      제안 (CTV/APO) 은 이 두 모델을 섞으려는 시도들.
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

function Example() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge font-mono text-[13px] text-muted">
        Alice 가 Bob 에게 1 BTC 를 보낼 때
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 p-4 items-center">
        <Side
          title="Alice 가 갖고 있던 UTXO 셋"
          subtitle="합계 = 1.5 BTC"
          items={[
            { tag: "utxo a · 0.5", coin: "0.50000000" },
            { tag: "utxo b · 0.3", coin: "0.30000000" },
            { tag: "utxo c · 0.7", coin: "0.70000000" },
          ]}
          tone="muted"
        />

        <div className="flex md:flex-col items-center justify-center gap-1 text-muted">
          <div className="text-xs font-mono">spend</div>
          <div className="text-2xl">→</div>
          <div className="text-xs font-mono">create</div>
        </div>

        <Side
          title="새로 생기는 UTXO 셋"
          subtitle="합계 = 1.4999 BTC (수수료 0.0001)"
          items={[
            { tag: "→ Bob · 1.0", coin: "1.00000000", highlight: true },
            { tag: "→ Alice 잔돈 · 0.5", coin: "0.49990000" },
          ]}
        />
      </div>

      <div className="px-4 py-2.5 border-t border-edge text-[13px] text-muted leading-relaxed">
        Alice 의 0.5 + 0.7 = 1.2 BTC 를 다 ‘끌어다’ input 으로 넣고, output 두
        개를 새로 만든다. ‘거스름돈’ 도 결국 자기 자신에게 보내는 새 UTXO 다.
        부스러기 동전을 한꺼번에 내고 잔돈을 따로 받는 식이다.
      </div>
    </div>
  );
}

function Side({
  title,
  subtitle,
  items,
  tone,
}: {
  title: string;
  subtitle: string;
  items: { tag: string; coin: string; highlight?: boolean }[];
  tone?: "muted";
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-muted">
        {title}
      </div>
      <div className="text-[13px] text-muted mt-1 mb-2.5">{subtitle}</div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div
            key={i}
            className={`rounded border ${
              it.highlight ? "border-accent/60 bg-accent/5" : "border-edge bg-bg/60"
            } px-3 py-2 flex items-baseline justify-between`}
          >
            <span className="text-xs text-muted font-mono">{it.tag}</span>
            <span
              className={`font-mono text-[13px] ${
                it.highlight
                  ? "text-accent"
                  : tone === "muted"
                    ? "text-text/70"
                    : "text-text/85"
              }`}
            >
              {it.coin}
            </span>
          </div>
        ))}
      </div>
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

function ModelCompare() {
  return (
    <div className="space-y-5">
      <p className="text-[15px] text-text/75 leading-[1.7]">
        이더리움이 쓰는{" "}
        <span className="text-text">계정 모델 (account model)</span> 은 ‘잔액
        숫자를 갱신’ 한다. 비트코인은{" "}
        <span className="text-text">UTXO 모델</span>: ‘옛 영수증 소비 + 새
        영수증 발행’. 같은 ‘1 BTC 송금’ 이라도 데이터 모델이 완전히 다르고,
        그 선택이 시스템의 다른 모든 부분 (검증·프라이버시·동시성·표현력) 에
        영향을 준다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ModelCard
          title="Account model"
          examples="이더리움, 솔라나, 대부분 web2"
          bullets={[
            "전역 상태: { Alice: 1.5, Bob: 0.0 }",
            "송금 = 두 셀 동시 갱신 (Alice -= 1, Bob += 1)",
            "‘잔액’ 이 명시적 필드",
            "재실행 가능 (replay) 위험 → nonce 필요",
          ]}
          tone="muted"
        />
        <ModelCard
          title="UTXO model"
          examples="비트코인, 라이트코인, Cardano (eUTXO)"
          bullets={[
            "전역 상태: 모든 UTXO 의 셋",
            "송금 = ‘이 출력을 풀고, 새 출력 만들기’",
            "잔액은 따로 없음. UTXO 합계가 곧 잔액",
            "한 번 쓴 출력은 set 에서 빠짐 → double-spend 단순 방지",
          ]}
          tone="accent"
        />
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-[140px_1fr_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>축</div>
          <div className="text-text/85">UTXO (비트코인)</div>
          <div className="text-muted">계정 (이더리움)</div>
        </div>
        <div className="divide-y divide-edge text-sm">
          <CompareRow
            axis="기본 단위"
            utxo="‘영수증 한 장’ 단위. 합쳐 갖되 한 장 단위로 소비."
            account="주소별 잔액 숫자 한 칸. 더하기·빼기."
          />
          <CompareRow
            axis="동시성"
            utxo="서로 다른 UTXO 를 쓰는 두 송금은 충돌이 없어 병렬 검증 쉬움."
            account="같은 계정에서 동시에 두 송금이 일어나면 nonce 순서가 강제로 묶임."
          />
          <CompareRow
            axis="프라이버시"
            utxo="매 송금마다 새 주소(=새 UTXO 위치) 를 만드는 게 자연스러움. 외부에서 한 사람의 잔액을 합산하기 어려움."
            account="주소가 곧 잔액 통장. 외부에서 쉽게 한 사람의 모든 활동을 추적."
          />
          <CompareRow
            axis="상태 검증"
            utxo="‘이 UTXO 는 아직 안 쓰였다’ 만 보면 된다 → 가벼운 set 자료구조."
            account="모든 계정의 현재 잔액 + nonce 트리를 유지해야 한다 → 무거운 글로벌 상태."
          />
          <CompareRow
            axis="programmability"
            utxo="단순 잠금/풀기 (script) 위주. 상태가 적어 안전성 검증이 쉬움."
            account="EVM 같은 풀 프로그래머블 가상머신. 표현력 ↑ 대신 복잡한 상태 충돌 위험."
          />
        </div>
      </div>

      <Callout title="요약">
        <p className="text-[15px] text-text/80 leading-[1.7]">
          비트코인은 ‘돈으로서의 단순함·검증 용이성·프라이버시’ 를 우선했고, UTXO
          가 그 선택을 떠받친다. 표현력은 의도적으로 줄였다.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          단점: 트랜잭션이 일반적으로 더 크고 (input 여러 개를 합쳐야 할 때),
          coin selection 알고리즘이 복잡하다. 이 트레이드오프를 받아들인 결정이다.
        </p>
      </Callout>
    </div>
  );
}

function CompareRow({
  axis,
  utxo,
  account,
}: {
  axis: string;
  utxo: string;
  account: string;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr_1fr] gap-3 px-4 py-3 items-baseline">
      <div className="text-[13px] text-muted font-mono">{axis}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{utxo}</div>
      <div className="text-[13px] text-muted leading-relaxed">{account}</div>
    </div>
  );
}

function ModelCard({
  title,
  examples,
  bullets,
  tone,
}: {
  title: string;
  examples: string;
  bullets: string[];
  tone: "muted" | "accent";
}) {
  const border =
    tone === "accent" ? "border-accent/40 bg-accent/5" : "border-edge bg-bg/40";
  const heading = tone === "accent" ? "text-accent" : "text-text/85";
  return (
    <div className={`rounded-sm border  p-4 space-y-2.5`}>
      <div className={`font-mono text-[13px] ${heading} uppercase tracking-wider`}>
        {title}
      </div>
      <div className="text-xs text-muted">{examples}</div>
      <ul className="space-y-1.5 text-sm text-text/85 leading-relaxed">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-muted mt-1">·</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CoinSelection() {
  return (
    <div className="space-y-3">
      <p className="text-[15px] text-text/85 leading-[1.7]">
        예시: 0.7 BTC 를 보내야 하고 fee 0.0001 BTC. 가용 UTXO 들 중 합계 ≥
        0.7001 이 되는 부분집합 골라야 함.
      </p>
      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_120px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>전략</div>
          <div>고른 UTXO</div>
          <div className="text-right">잔돈 / 결과</div>
        </div>
        <div className="divide-y divide-edge text-sm">
          <SelectionRow
            name="largest-first"
            picks="1.0 BTC 한 개"
            result="잔돈 0.2999 BTC, input 1 개라 fee ↓"
          />
          <SelectionRow
            name="branch-and-bound"
            picks="0.5 + 0.2 = 0.7 BTC"
            result="잔돈 (거의) 없음, 정확히 맞춤. 효율 ↑"
            tone="accent"
          />
          <SelectionRow
            name="smallest-first"
            picks="0.05 + 0.1 + 0.2 + … 합쳐서 0.7"
            result="UTXO 다 합쳐 dust 정리, 그러나 input 많아 fee ↑↑"
          />
        </div>
      </div>
      <div className="text-[15px] text-text/70 leading-[1.7]">
        Bitcoin Core 는 BnB (branch-and-bound) 를 우선 시도, 실패 시 SRD
        (single random draw) 같은 <Term id="fallback">폴백 (fallback)</Term> 사용.
        트레이드오프: fee, 잔돈 dust 발생,
        그리고{" "}
        <span className="text-text">
          여러 input 을 한 tx 에 묶으면 ‘이 주소들이 같은 사람’ 이 외부에 노출
        </span>{" "}
        (heuristic 1: common-input-ownership).
      </div>
    </div>
  );
}

function SelectionRow({
  name,
  picks,
  result,
  tone,
}: {
  name: string;
  picks: string;
  result: string;
  tone?: "accent";
}) {
  const color = tone === "accent" ? "text-accent" : "text-text/85";
  return (
    <div className="grid grid-cols-[120px_1fr_120px] gap-3 px-4 py-2.5 items-baseline">
      <div className={`font-mono text-[13px] ${color}`}>{name}</div>
      <div className="text-text/85">{picks}</div>
      <div className="text-right text-[13px] text-muted">{result}</div>
    </div>
  );
}

function UtxoGraph() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <svg
        viewBox="0 0 600 240"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="utxoArrow"
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

        <TxBlob x={20} y={100} title="tx₁" sub="coinbase" tone="accent" />
        <TxBlob x={220} y={30} title="tx₂" sub="Alice → Bob" />
        <TxBlob x={220} y={170} title="tx₃" sub="Carol → Alice" />
        <TxBlob x={460} y={100} title="tx₄" sub="Alice → Dave" tone="accent2" />

        <Edge from={[140, 116]} to={[220, 50]} label="50 BTC" labelOffsetY={-6} />
        <Edge from={[140, 124]} to={[220, 190]} label="50 BTC" labelOffsetY={12} />
        <Edge from={[340, 50]} to={[460, 116]} label="0.5 BTC" labelOffsetY={-6} />
        <Edge from={[340, 190]} to={[460, 124]} label="0.3 BTC" labelOffsetY={12} />
      </svg>
      <p className="text-[15px] text-text/70 leading-[1.7]">
        모든 화살표 = ‘이전 트랜잭션 출력 → 다음 트랜잭션 input’. 가장 왼쪽 끝은
        항상 <Term id="coinbase">coinbase tx</Term> (새로 발행되는 코인의 출처).
        UTXO 셋 = 이 그래프에서 ‘아직 다음 input 이 가리키지 않은’ 잎 노드들.
      </p>
    </div>
  );
}

function TxBlob({
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
  const w = 120;
  const h = 40;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
       
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={y + 17}
        textAnchor="middle"
        fontSize="13"
        fill="#e6e8ec"
        fontFamily="JetBrains Mono"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + 31}
        textAnchor="middle"
        fontSize="10"
        fill="#7a8190"
        fontFamily="JetBrains Mono"
      >
        {sub}
      </text>
    </g>
  );
}

function Edge({
  from,
  to,
  label,
  labelOffsetY = 0,
}: {
  from: [number, number];
  to: [number, number];
  label: string;
  labelOffsetY?: number;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + labelOffsetY;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#7a8190"
        strokeWidth="0.9"
        markerEnd="url(#utxoArrow)"
      />
      <rect
        x={mx - 24}
        y={my - 9}
        width={48}
        height={14}
       
        fill="#08090b"
      />
      <text
        x={mx}
        y={my + 1}
        textAnchor="middle"
        fontSize="10"
        fill="#a0a8b8"
        fontFamily="JetBrains Mono"
      >
        {label}
      </text>
    </g>
  );
}

function DustExplain() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <DustCard
          state="원래 가진 UTXO"
          value="546 sat"
          note="UTXO 1 개 (작은 코인 부스러기)"
        />
        <DustCard
          state="이걸 input 으로 쓸 때 드는 fee"
          value="크게 증가"
          note="혼잡하면 작은 UTXO 자체보다 쓰는 비용이 더 커질 수 있다"
          tone="warn"
        />
        <DustCard
          state="실제 받을 수 있는 가치"
          value="≈ 0"
          note="쓰는 순간 손해라 사실상 경제적으로 죽은 출력"
          tone="warn"
        />
      </div>
      <div className="text-[15px] text-text/70 leading-[1.7]">
        그래서 노드는 ‘dust 한도’ 미만의 출력을 만드는 트랜잭션을 표준 정책으로
        받지 않거나, 일부 지갑은 dust UTXO 를 ‘없는 셈’ 친다. 거래소 입금에서
        가끔 발생하는 ‘잔액 안 잡힘’ 의 원인이기도 함.
      </div>

      <div className="border-t border-edge pt-4 space-y-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent2">
          UTXO 만의 문제? · 아니다
        </div>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          ‘dust’ 는 UTXO 모델의 부산물처럼 보이지만, 사실은 모든 암호화폐가
          공유하는 문제다. Ethereum 같은{" "}
          <span className="text-text">상태(account) 기반</span> 체인에서도
          지갑을 ‘완전히 비우는’ 마지막 송금을 보내려면, 그 송금 자체의{" "}
          <span className="text-text">가스비</span> 를 계산해서 잔액에서 빼고
          보내야 한다. 그런데 가스 가격은 블록마다 출렁이고, 트랜잭션이 멤풀에
          앉아 있는 동안에도 변동. 정확히 0 으로 맞추기가 사실상 불가능하다.
          항상 작은 잔돈이 남는다.
        </p>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          그 잔돈을 ‘마저 옮길까?’ 시도하면 → 옮기는 비용이 잔돈보다 크고 →
          옮기지 않으면 영원히 그 주소에 묶임. UTXO 든 account 든 같은 결말.
        </p>
        <p className="text-[15px] text-text/70 leading-[1.7]">
          그래서 모든 암호화폐는 시간이 갈수록{" "}
          <span className="text-text">총 발행량 (supply) 과 실질 유통량의 차이</span>{" "}
          가 벌어진다. ‘쓸 수 있는 코인’ 이 사라지는 두 경로:
        </p>
        <ul className="space-y-1.5 text-[14px] text-text/75 leading-[1.7] pl-4 list-disc">
          <li>
            <span className="text-text">Dust</span> · 옮기는 비용이 가치를 넘어
            영구히 주소에 묶임
          </li>
          <li>
            <span className="text-text">키 분실</span> · 시드 유실, HW (하드웨어
            지갑) 사망, 오타 송금 (받는 주소를 한 글자 잘못 입력 → 비트코인은
            은행 같은 ‘취소’ 가 없고, 그 주소의 비밀키를 누군가 갖고 있을 확률은
            사실상 0 이라 영영 잠김). Chainalysis 추정 기준 BTC 의 약{" "}
            <span className="text-text">17 ~ 23%</span> 가 5 년 이상 움직이지 않은
            ‘잠재적 분실’ 분류
          </li>
        </ul>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          그래서 명목 발행량 21 M BTC 가 곧 ‘실제로 유통 가능한 코인’ 의 상한은
          아니다. 시간이 지날수록 그 둘의 간격은 벌어진다. Ethereum 이나 다른
          체인도 규모만 다를 뿐 같은 현상이 반복된다.
        </p>
      </div>
    </div>
  );
}

function DustCard({
  state,
  value,
  note,
  tone,
}: {
  state: string;
  value: string;
  note: string;
  tone?: "warn";
}) {
  const color = tone === "warn" ? "text-[#f76b6b]" : "text-text/85";
  return (
    <div className="rounded-sm border border-edge bg-surface/40 p-3 space-y-1">
      <div className="text-xs text-muted">{state}</div>
      <div className={`font-mono text-base ${color}`}>{value}</div>
      <div className="text-xs text-muted">{note}</div>
    </div>
  );
}

function UtxoSetReality() {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          전 세계 모든 풀 노드가 같은 ‘영수증 더미’ 를 들고 있다
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2">
          한 시점에 비트코인 네트워크에 살아있는 UTXO 의 수와 그것이 차지하는
          디스크 용량을 본다. 이게 곧 ‘노드 운영 비용’ 이고, 누가 노드를
          돌릴 수 있는가 (즉 분산도) 의 척도가 된다.
        </p>
      </div>

      <div className="text-[13px] font-semibold text-muted/75">
        snapshot · 2024 기준 대략
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat label="UTXO 개수" value="~ 1.5 억" sub="매년 ~10% 성장" />
        <Stat label="ChainState 크기" value="~ 12 GB" sub="LevelDB 디스크 · serialized" />
        <Stat label="블록당 평균 변화" value="+2,000 ~ +5,000" sub="새 UTXO 생성 / 소비" />
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-3">
        <h4 className="text-[17px] font-medium text-text leading-snug">
          왜 이게 분산도의 척도인가
        </h4>
        <p className="text-[15px] text-text/85 leading-[1.7]">
          모든 풀 노드는 이 UTXO 셋 전체를 메모리/디스크에 갖고, 새 트랜잭션이
          들어올 때마다 ‘이 input 이 가리키는 UTXO 가 셋에 있는가’ 를 즉시 본다.
          셋이 커질수록 노드 운영 비용 ↑ → 운영자 수 ↓ → 분산성 ↓.
        </p>
        <p className="text-[14px] text-text/70 leading-[1.7]">
          그래서 ‘UTXO 부풀림 (UTXO bloat)’ 은 비트코인 커뮤니티가 진지하게
          신경 쓰는 주제. 두 종류의 ‘잘 안 움직이는 UTXO’ 가 특히 비판받는다.
          첫째는 위에서 본{" "}
          <span className="text-text">dust output</span> (옮기는 비용 &gt; 가치
          → 영영 안 쓰임). 둘째는{" "}
          <span className="text-text">ordinals</span> (2023 년 등장한 ‘비트코인
          NFT’. 개별 satoshi 한 알에 이미지·텍스트를 새겨 넣는 방식. NFT 처럼
          ‘옮기지 않고 보관’ 하는 게 목적이라 새 UTXO 가 만들어지기만 하고
          소비되지 않는다). 이런 UTXO 가 늘면 모든 풀 노드가 영구히 그
          데이터를 메모리·디스크에 들고 있어야 해서, 노드 운영 비용이 한 방향
          으로만 올라간다. 자세한 내용은 다음 단계 (S5 Block) 의 ‘블록 공간의
          용도’ 에서 다룬다.
        </p>
      </div>

      <UtxoSizeChart />
    </section>
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
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-1.5">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </div>
      <div className="font-mono text-[20px] text-accent">{value}</div>
      <div className="text-[12px] text-text/65 leading-relaxed">{sub}</div>
    </div>
  );
}

function UtxoSizeChart() {
  // approximate growth points
  const points = [
    { y: 2012, count: 0.5, size: 0.1 },
    { y: 2014, count: 5, size: 0.5 },
    { y: 2016, count: 25, size: 1.5 },
    { y: 2018, count: 55, size: 3.5 },
    { y: 2020, count: 80, size: 5 },
    { y: 2022, count: 120, size: 8 },
    { y: 2024, count: 150, size: 12 },
  ];
  const W = 540;
  const H = 220;
  const pad = { l: 40, r: 60, t: 24, b: 36 };
  const xScale = (y: number) => pad.l + ((y - 2012) / (2024 - 2012)) * (W - pad.l - pad.r);
  const yMax = 160;
  const yScale = (v: number) => H - pad.b - (v / yMax) * (H - pad.t - pad.b);

  const countPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.y).toFixed(1)} ${yScale(p.count).toFixed(1)}`).join(" ");
  const sizePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.y).toFixed(1)} ${yScale(p.size * 10).toFixed(1)}`).join(" ");

  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-3">
        UTXO 개수 vs ChainState 크기 (2012–2024, 대략)
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* axes */}
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="#3a3f4a" strokeWidth="1" />
        <line x1={pad.l} y1={H - pad.b} x2={pad.l} y2={pad.t} stroke="#3a3f4a" strokeWidth="1" />

        {/* gridlines + y-axis labels (count, left axis) */}
        {[40, 80, 120, 160].map((v) => (
          <g key={v}>
            <line x1={pad.l} y1={yScale(v)} x2={W - pad.r} y2={yScale(v)} stroke="#1c1f27" strokeWidth="0.6" strokeDasharray="2 4" />
            <text x={pad.l - 6} y={yScale(v) + 3} textAnchor="end" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">{v}M</text>
          </g>
        ))}

        {/* x-axis labels */}
        {points.map((p, i) => (
          <text key={i} x={xScale(p.y)} y={H - pad.b + 16} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">
            {p.y}
          </text>
        ))}

        {/* lines */}
        <path d={countPath} stroke="#5b8def" strokeWidth="1.8" fill="none" />
        <path d={sizePath} stroke="#f7931a" strokeWidth="1.8" fill="none" />

        {/* dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={xScale(p.y)} cy={yScale(p.count)} r={3} fill="#5b8def" />
            <circle cx={xScale(p.y)} cy={yScale(p.size * 10)} r={3} fill="#f7931a" />
          </g>
        ))}

        {/* legend · 차트 안 좌상단 */}
        <g transform={`translate(${pad.l + 12}, ${pad.t + 6})`}>
          <circle cx={0} cy={0} r={3.5} fill="#5b8def" />
          <text x={9} y={4} fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">UTXO 개수 (M)</text>
          <circle cx={0} cy={20} r={3.5} fill="#f7931a" />
          <text x={9} y={24} fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">크기 (GB × 10)</text>
        </g>
      </svg>
      <div className="text-[12px] text-text/65 mt-2 leading-relaxed">
        2024 시점 약 1.5 억 UTXO, 12 GB. 매년 ~10% 성장하지만 디스크는 더 빨리
        커지진 않음 (압축·정리 효과).
      </div>
    </div>
  );
}

function UtxoPrivacy() {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          UTXO 그래프는 영원히 공개된다
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2">
          모든 트랜잭션은 이전 트랜잭션의 출력을 input 으로 가리킨다. 그래서 모든
          UTXO 는{" "}
          <span className="text-text">출발점 (coinbase) 으로 거슬러 올라가는 거대한 directed graph</span>{" "}
          에 속한다. 그 그래프 자체는 영원히 공개되어 있어, 누구든 분석할 수 있다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PrivacyRisk
          n="①"
          title="Common-input heuristic"
          body="한 트랜잭션의 input 들이 모두 ‘같은 사람 소유’ 라는 가정. 한 사람이 여러 UTXO 를 합쳐 썼다는 사실 자체가 ‘이 주소들은 같은 지갑’ 의 강한 단서."
        />
        <PrivacyRisk
          n="②"
          title="Address reuse"
          body="같은 주소를 두 번 이상 받는 데 쓰면, 그 모든 거래가 한 사람으로 묶임. 새 송금마다 새 주소 (BIP32 derivation) 를 쓰는 게 첫 단계 프라이버시 보호."
        />
        <PrivacyRisk
          n="③"
          title="Change detection"
          body="송금 출력과 잔돈 출력 두 개 중 ‘잔돈은 보통 더 작은 쪽 / 라운드 넘버 아닌 쪽’ 이라는 휴리스틱. 패턴이 잡히면 추적이 한 단계 깊어짐."
        />
        <PrivacyRisk
          n="④"
          title="거래소 입출금"
          body="알려진 거래소 주소로 들어가는 UTXO 는 ‘KYC 된 사람’ 으로 분류. Chainalysis 같은 회사들이 수십억 달러 규모의 주소 라벨링을 운영."
        />
      </div>

      <div className="rounded-sm border border-accent/40 bg-accent/[0.04] p-5 space-y-3">
        <h4 className="text-[17px] font-medium text-accent leading-snug">
          방어 도구들
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
          <div className="space-y-1">
            <div className="text-text font-medium">CoinJoin</div>
            <div className="text-text/70 leading-[1.6]">
              여러 사람이 한 트랜잭션을 같이 만들어, common-input heuristic 을
              깬다. Wasabi, Whirlpool 등이 구현.
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-text font-medium">새 주소 생성</div>
            <div className="text-text/70 leading-[1.6]">
              매 송금마다 새 BIP32 derivation 주소. address reuse 자체를
              차단. 거의 모든 modern 지갑이 기본.
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-text font-medium">Lightning · Silent Payment</div>
            <div className="text-text/70 leading-[1.6]">
              off-chain 결제로 on-chain 흔적 자체를 줄임. BIP352 의 silent
              payment 는 받는 쪽 주소 노출 없이도 송금.
            </div>
          </div>
        </div>
      </div>

      <Callout title="핵심 트레이드오프">
        <p className="text-[15px] text-text/80 leading-[1.7]">
          UTXO 모델은 매 트랜잭션 새 출력을 만들기 때문에 ‘주소 재사용’ 자체가
          기본값 아닌 선택. account 모델 (이더리움) 과 비교해 프라이버시 측면
          여지가 더 크지만, 그래도 영구 공개의 본질은 그대로.
        </p>
      </Callout>
    </section>
  );
}

function PrivacyRisk({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[#f76b6b]">{n}</span>
        <span className="text-[15px] font-medium text-text">{title}</span>
      </div>
      <div className="text-[14px] text-text/80 leading-[1.65]">{body}</div>
    </div>
  );
}

function TrackingAndObfuscation() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          추적과 우회 · 같은 그래프 위 두 진영
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-2">
          UTXO 그래프가 영구 공개라는 사실 위에서, 두 방향의 기술이 동시에
          발전한다. <span className="text-text">한쪽은 ‘추적’</span>{" "}
          (chain analysis 회사들), <span className="text-text">다른 쪽은 ‘우회’</span>{" "}
          (mixer, ZKP, off-chain). 그 사이의 줄다리기가 비트코인 프라이버시의
          현재 모습.
        </p>
      </div>

      {/* ① TAINTING */}
      <div className="space-y-4">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ① Tainting · 자금에 ‘오염 라벨’ 을 매기는 추적법
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          체인 분석사가 어떤 UTXO 를 ‘위험 출처’ (해킹·랜섬·다크넷) 로 표시하면,
          그 UTXO 가 input 으로 들어가는 모든 후속 트랜잭션의 output 들에도
          오염이 ‘전파’ 된다. 그 라벨이 어디까지 따라붙는지가 곧 추적의 본질.
        </p>

        <TaintGraph />

        <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
          <div className="grid grid-cols-[140px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
            <div>전파 모델</div>
            <div>‘이 output 에 오염이 얼마나 묻었나’ 의 계산법</div>
          </div>
          <div className="divide-y divide-edge text-[14px]">
            <TaintRow
              name="FIFO"
              body="먼저 들어온 input 의 BTC 가 먼저 나간 output 으로 갔다고 가정. ‘선입선출’ 식 추적."
            />
            <TaintRow
              name="Haircut"
              body="모든 output 에 input 의 오염을 액수 비례로 균등 분배. 가장 보수적이라 한 번 섞이면 모두에 오염이 묻음 → 거의 모든 BTC 가 ‘약한 오염’ 으로 분류되는 부작용."
            />
            <TaintRow
              name="Poison"
              body="오염된 input 이 한 방울이라도 섞이면 모든 output 을 100% 오염으로 본다. 가장 공격적이다. 거래소가 입금 거부에 자주 사용한다."
              tone="warn"
            />
          </div>
        </div>

        <Callout tone="warn" title="fungibility (대체가능성) 의 위협">
          <p className="text-[15px] text-text/80 leading-[1.7]">
            이론상 모든 1 BTC 는 같다 (fungible). 하지만 거래소가 ‘오염된 1 BTC’
            입금을 거부하면 같은 액면이 다른 가치를 갖는다. 이게 비트코인
            보유자들이 ‘mixer 가 도덕적이냐 아니냐’ 보다도 fungibility 보호
            차원에서 mixing 을 옹호하는 이유다.
          </p>
        </Callout>
      </div>

      {/* ② MIXING */}
      <div className="space-y-4">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ② 여러 입력·여러 출력 · 방향성 그 자체를 잃게 만들기
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          한 트랜잭션에 여러 사람의 input 과 같은 액수의 output 들이 섞이면,
          외부에서 ‘어느 input 이 어느 output 으로 갔는지’ 매핑이 모호해진다.
          common-input heuristic 이 깨지고 그래프 위에서 ‘갈래 (split)’ 가
          발생한다.
        </p>

        <CoinJoinDiagram />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2">
            <h4 className="text-[16px] font-medium text-accent2">
              CoinJoin (Wasabi · Whirlpool · JoinMarket)
            </h4>
            <p className="text-[14px] text-text/75 leading-[1.7]">
              여러 사용자가 같이 한 트랜잭션을 만든다. equal-output 으로 정규화:
              모든 output 이 같은 액수라야 매핑이 진짜로 모호해짐. anonymity set
              크기 = 같이 섞인 사용자 수.
            </p>
          </div>
          <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2">
            <h4 className="text-[16px] font-medium text-accent2">
              PayJoin (BIP78)
            </h4>
            <p className="text-[14px] text-text/75 leading-[1.7]">
              송금자와 수신자가 함께 트랜잭션을 만들어, 외부에선 ‘일반 송금’ 처럼
              보이지만 input 에 양쪽 자금이 모두 들어 있다. common-input
              heuristic 이 거짓 양성을 낸다.
            </p>
          </div>
        </div>

        <Callout tone="warn" title="한계">
          <p className="text-[14px] text-text/75 leading-[1.7]">
            equal-output 자체가 패턴이라, chain analysis 가 ‘이 트랜잭션은 CoinJoin’
            이라고 일단 분류할 수 있다. 그 후엔 timing·IP·후속 송금의 합산
            패턴 등 메타데이터로 잘게 분리된다. 또한 mixing 한 자금만 따로
            거래소에서 거부당하기도 한다. 익명성이 곧 사용 거부와 거래되는
            셈이다.
          </p>
        </Callout>
      </div>

      {/* ③ ETHEREUM / TORNADO CASH / ZKP */}
      <div className="space-y-4">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ③ 이더리움 익명 트랜잭션 사례 · Tornado Cash
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          비트코인은 기반 계층에 mixing 이 없고, 위에 CoinJoin 같은 ‘약한
          우회’ 가 얹힌다. 이더리움은 스마트 컨트랙트 위에서{" "}
          <span className="text-text">암호학적으로 강한 mixing</span> 을 만들 수
          있었고, 그 대표가 2019 년 출범한 Tornado Cash.
        </p>

        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-3">
          <h4 className="text-[16px] font-medium text-accent leading-snug">
            Tornado Cash 메커니즘 (한 줄 요약)
          </h4>
          <ol className="space-y-2 text-[14px] text-text/80 leading-[1.7]">
            <li>
              <span className="font-mono text-muted mr-2">1.</span>
              사용자 A 가 컨트랙트에 1 ETH 입금. 동시에 비밀{" "}
              <code className="font-mono text-text">commitment = hash(secret, nullifier)</code>{" "}
              만 공개.
            </li>
            <li>
              <span className="font-mono text-muted mr-2">2.</span>
              컨트랙트는 모든 commitment 들을 Merkle tree 에 모은다 (anonymity
              pool).
            </li>
            <li>
              <span className="font-mono text-muted mr-2">3.</span>
              사용자 A 가 임의의 새 주소에서 1 ETH 인출 시 zk-SNARK proof 를
              제출. “나는 pool 안 어떤 commitment 의 secret 을 안다” 만 증명되고,{" "}
              <span className="text-text">어느 commitment 인지는 공개하지 않음</span>.
            </li>
            <li>
              <span className="font-mono text-muted mr-2">4.</span>
              <code className="font-mono text-text">nullifier</code> 만 공개되어
              double-withdraw 차단. 그 외엔 입금-인출 사이 on-chain 연결고리를
              직접 드러내지 않는다.
            </li>
          </ol>
        </div>

        <div className="rounded-sm border border-edge bg-surface/20 p-5 space-y-3">
          <h4 className="text-[16px] font-medium text-text leading-snug">
            왜 비트코인은 같은 방식을 쓰기 어렵나
          </h4>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            비트코인의 script 는 의도적으로{" "}
            <span className="text-text">Turing-incomplete</span>. zk-SNARK
            검증 로직 같은 거대한 연산을 넣을 수 없다. 같은 효과를 보려면 또
            다른 기반 계층 변경 (covenants, BIP352 silent payment 등) 이
            필요하고, 채택 보수성이 강해 진행이 느림. 보안·단순성을 우선한
            대가의 한 면.
          </p>
        </div>

        <Callout tone="warn" title="완벽한 mixer 도 메타데이터로 일부 추적된다">
          <ul className="space-y-2 text-[14px] text-text/80 leading-[1.7]">
            <li>
              <span className="text-muted">·</span>{" "}
              <span className="text-text">Timing</span>: Tornado 입금 5 분 뒤
              같은 액수 인출 → 사실상 같은 사람으로 추정.
            </li>
            <li>
              <span className="text-muted">·</span>{" "}
              <span className="text-text">Gas 출처</span>: 새 주소가 GAS 가
              없는데 Tornado 인출을 어떻게 했나? 누가 GAS 를 보내줬는지 보면
              연결된다.
            </li>
            <li>
              <span className="text-muted">·</span>{" "}
              <span className="text-text">후속 패턴</span>: 인출 후 같은
              거래소·같은 디파이로 들어가면 KYC 와 다시 묶임.
            </li>
          </ul>
          <p className="text-[14px] text-text/65 leading-[1.7] pt-2 border-t border-edge/60">
            ‘완벽한 익명성’ 은 알고리즘만의 문제가 아니다. 사용자 측의 운영 보안
            (timing 분리, 별도 GAS 출처, 인출 후 다른 네트워크 사용 등) 이
            동반되어야 비로소 의미가 있다. 프라이버시는{" "}
            <span className="text-text">‘plausible deniability’</span> 가 실용
            목표.
          </p>
        </Callout>
      </div>

      {/* ④ 미국 OFAC 제재 + 코드 자유 논쟁 */}
      <div className="space-y-4">
        <h3 className="text-[18px] font-medium text-text leading-snug">
          ④ 2022 OFAC 제재 · 소스코드를 제재한다는 사상 초유의 일
        </h3>
        <p className="text-[15px] text-text/80 leading-[1.7]">
          체인 분석으로도 못 잡는 자금 흐름이 있다는 게 명확해지자, 미국은 한
          단계 더 나갔다. ‘사용자’ 가 아니라{" "}
          <span className="text-text">‘소스코드 그 자체’</span> 를 제재 대상으로
          삼은 것.
        </p>

        <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
          <div className="grid grid-cols-[100px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
            <div>시점</div>
            <div>사건</div>
          </div>
          <div className="divide-y divide-edge text-[14px]">
            <SanctionRow
              when="2022-08-08"
              what="미국 재무부 OFAC 가 Tornado Cash 컨트랙트 주소들을 SDN 리스트에 추가. 미국인의 그 컨트랙트 사용 금지. 사상 처음으로 ‘사용자’ 가 아니라 ‘스마트 컨트랙트’ 자체가 제재 대상."
            />
            <SanctionRow
              when="2022-08-12"
              what="GitHub 가 Tornado Cash 저장소를 takedown 하고 개발자 계정을 정지시켰다. ‘오픈소스 코드도 제재 대상이 될 수 있다’ 는 신호로 읽혔다."
              tone="warn"
            />
            <SanctionRow
              when="2022-08-26"
              what="네덜란드가 핵심 개발자 Alexey Pertsev 를 체포했다. 죄목은 ‘mixer 운영 방조’. 코드 작성·배포 자체가 형사 책임이 될 수 있을까."
              tone="warn"
            />
            <SanctionRow
              when="2023-09"
              what="Coinbase 등이 EFF 와 함께 OFAC 를 상대로 소송. 헌법 1 수정 (표현의 자유) 침해 주장."
            />
            <SanctionRow
              when="2024-11"
              what="제 5 순회 항소법원이 OFAC 의 제재가 위법이라고 판결했다. ‘Tornado Cash 의 immutable smart contract 는 IEEPA 가 정의하는 property 에 해당하지 않는다’ 가 핵심 논거다."
              tone="ok"
            />
            <SanctionRow
              when="2025-03"
              what="OFAC 가 Tornado Cash 를 SDN 에서 제거했다. 그러나 Pertsev 형사 사건은 별개로 진행 중이다."
              tone="ok"
            />
          </div>
        </div>

        <Callout tone="accent" title="생각해볼 문제">
          <p className="text-[15px] text-text/80 leading-[1.7]">
            <span className="text-text">소스코드는 표현(speech)인가, 도구(weapon)인가?</span>{" "}
            누군가 GitHub 에 올린 ‘mixer 코드’ 가 범죄에 쓰였다면, 그 코드를 짠
            사람에게 책임이 있나? 1990 년대 ‘PGP 암호화 코드를 종이책으로
            출판하면 수출 통제 위반인가’ 논쟁의 디지털 버전.
          </p>
          <p className="text-[14px] text-text/70 leading-[1.7]">
            더 어려운 질문: 비트코인 코어 자체가 어떤 합법성 회색지대를 만든다면,
            그 코어 코드도 같은 논리로 제재할 수 있나? 노드 운영자, 채굴자,
            지갑 개발자, 거래소 가운데 어느 단계에서 ‘책임’ 이 시작되는가? 분산
            시스템에서 ‘제재 대상’ 을 정의할 수 있나?
          </p>
          <p className="text-[14px] text-text/65 leading-[1.7]">
            법적 쟁점으로 더 볼 것: EFF 의 “Code is speech” 입장, Bernstein v. United
            States (1996) PGP 판결, Coin Center 의 OFAC 소송 문서.
          </p>
        </Callout>
      </div>
    </section>
  );
}

function TaintRow({
  name,
  body,
  tone,
}: {
  name: string;
  body: string;
  tone?: "warn";
}) {
  const cls = tone === "warn" ? "text-[#f76b6b]" : "text-accent2";
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className={`font-mono text-[13px] ${cls}`}>{name}</div>
      <div className="text-[14px] text-text/80 leading-[1.65]">{body}</div>
    </div>
  );
}

function TaintGraph() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg viewBox="0 0 540 230" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="taintArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#5a6070" />
          </marker>
        </defs>
        {/* tainted source */}
        <rect x={20} y={50} width={100} height={42} fill="#f76b6b22" stroke="#f76b6b" strokeWidth="1.4" />
        <text x={70} y={70} textAnchor="middle" fontSize="11" fill="#f76b6b" fontFamily="JetBrains Mono">tainted</text>
        <text x={70} y={84} textAnchor="middle" fontSize="9" fill="#f76b6b" fontFamily="JetBrains Mono">(해킹 출처)</text>

        {/* clean source */}
        <rect x={20} y={118} width={100} height={36} fill="#0d0f14" stroke="#5a6070" strokeWidth="1" />
        <text x={70} y={140} textAnchor="middle" fontSize="11" fill="#7a8190" fontFamily="JetBrains Mono">clean</text>

        {/* tx node */}
        <rect x={190} y={86} width={80} height={36} fill="#0d0f14" stroke="#5a6070" strokeWidth="1" strokeDasharray="3 3" />
        <text x={230} y={108} textAnchor="middle" fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">tx</text>

        <line x1={120} y1={71} x2={188} y2={96} stroke="#f76b6b" strokeWidth="1.1" markerEnd="url(#taintArr)" />
        <line x1={120} y1={136} x2={188} y2={112} stroke="#5a6070" strokeWidth="1" markerEnd="url(#taintArr)" />

        {/* outputs · 3 개 박스 */}
        <rect x={340} y={32} width={120} height={36} fill="#f76b6b15" stroke="#f76b6b" strokeWidth="1" />
        <text x={400} y={54} textAnchor="middle" fontSize="11" fill="#f76b6b" fontFamily="JetBrains Mono">output 1 (오염 ↑)</text>

        <rect x={340} y={86} width={120} height={36} fill="#f76b6b15" stroke="#f76b6b" strokeWidth="1" strokeDasharray="3 3" />
        <text x={400} y={108} textAnchor="middle" fontSize="11" fill="#f76b6b" fontFamily="JetBrains Mono">output 2 (오염 ?)</text>

        <rect x={340} y={140} width={120} height={36} fill="#f76b6b15" stroke="#f76b6b" strokeWidth="1" strokeDasharray="3 3" />
        <text x={400} y={162} textAnchor="middle" fontSize="11" fill="#f76b6b" fontFamily="JetBrains Mono">output 3 (오염 ?)</text>

        <line x1={270} y1={104} x2={338} y2={50} stroke="#f76b6b" strokeWidth="1.1" markerEnd="url(#taintArr)" />
        <line x1={270} y1={104} x2={338} y2={104} stroke="#5a6070" strokeWidth="0.9" strokeDasharray="2 3" markerEnd="url(#taintArr)" />
        <line x1={270} y1={104} x2={338} y2={158} stroke="#5a6070" strokeWidth="0.9" strokeDasharray="2 3" markerEnd="url(#taintArr)" />

      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        FIFO · Haircut · Poison 중 어떤 모델로 추적하느냐가 핵심이다.
      </div>
    </div>
  );
}

function CoinJoinDiagram() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg viewBox="0 0 540 240" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="cjArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#5a6070" />
          </marker>
        </defs>

        {/* inputs (3 users, 1 BTC each) */}
        {[
          { y: 30, name: "Alice", color: "#5b8def" },
          { y: 100, name: "Bob", color: "#f7931a" },
          { y: 170, name: "Carol", color: "#a78bfa" },
        ].map((u, i) => (
          <g key={i}>
            <rect x={20} y={u.y} width={110} height={36} fill={`${u.color}15`} stroke={u.color} strokeWidth="1.2" />
            <text x={75} y={u.y + 16} textAnchor="middle" fontSize="11" fill={u.color} fontFamily="JetBrains Mono">{u.name} input</text>
            <text x={75} y={u.y + 28} textAnchor="middle" fontSize="9" fill="#7a8190" fontFamily="JetBrains Mono">1.0 BTC</text>
          </g>
        ))}

        {/* center mixer */}
        <rect x={210} y={94} width={120} height={48} fill="#0d0f14" stroke="#7a8190" strokeWidth="1.2" strokeDasharray="3 3" />
        <text x={270} y={114} textAnchor="middle" fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">CoinJoin tx</text>
        <text x={270} y={130} textAnchor="middle" fontSize="9" fill="#5a6070" fontFamily="JetBrains Mono">3 in / 3 out</text>

        {/* outputs (3 equal outputs - which goes to whom?) */}
        {[
          { y: 30, label: "out a · 1.0 BTC" },
          { y: 100, label: "out b · 1.0 BTC" },
          { y: 170, label: "out c · 1.0 BTC" },
        ].map((o, i) => (
          <g key={i}>
            <rect x={400} y={o.y} width={120} height={36} fill="#0d0f14" stroke="#5a6070" strokeWidth="1" />
            <text x={460} y={o.y + 22} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">{o.label}</text>
          </g>
        ))}

        {/* arrows from inputs to mixer */}
        {[48, 118, 188].map((y, i) => (
          <line key={i} x1={130} y1={y} x2={208} y2={118} stroke="#5a6070" strokeWidth="0.8" markerEnd="url(#cjArr)" />
        ))}

        {/* arrows from mixer to outputs (uncertainty) */}
        {[48, 118, 188].map((y, i) => (
          <line key={i} x1={330} y1={118} x2={398} y2={y} stroke="#5a6070" strokeWidth="0.6" strokeDasharray="2 3" markerEnd="url(#cjArr)" />
        ))}

      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        외부 관찰자는 어느 input 이 어느 output 으로 갔는지 알기 어렵다.
      </div>
    </div>
  );
}

function SanctionRow({
  when,
  what,
  tone,
}: {
  when: string;
  what: string;
  tone?: "warn" | "ok";
}) {
  const cls =
    tone === "warn" ? "text-[#f76b6b]" : tone === "ok" ? "text-accent2" : "text-muted";
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className={`font-mono text-[12px] ${cls}`}>{when}</div>
      <div className="text-[14px] text-text/80 leading-[1.65]">{what}</div>
    </div>
  );
}
