"use client";

import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Reflection, Probe, Callout } from "../Reflection";
import { SectionHead } from "../SectionHead";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L2Transaction(props: LayerProps) {
  return (
    <LayerShell
      id="S3"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "1.4 BTC에서 1 BTC를 보내면",
                subtitle: "트랜잭션의 직관",
                body: <SplitIntuition />,
              },
              {
                title: "트랜잭션의 구조", subtitle: "한 통의 서명된 메시지",
                body: (
                  <section className="space-y-4">
                    <p className="text-[17px] text-text/70 leading-[1.7]">
                      트랜잭션은 한 통의{" "}
                      <span className="text-text">서명된 메시지</span>다. 내용은
                      단순하다. “이전 출력 X 를 풀어서, 이만큼은 Bob 에게 보내고
                      나머지는 나에게 거슬러 준다. 그 증거로 Alice 의 서명을
                      붙인다.”
                    </p>
                    <Callout>
                      <p className="text-[14px] text-text/75 leading-[1.7]">
                        input 이 가리키는 ‘이전 출력’ 이 바로{" "}
                        <Term id="utxo">UTXO</Term>다. 정확한 모델은 S4 에서
                        풀고, 여기서는 ‘쓸 수 있는 한 덩어리의 자금’ 으로 보고
                        메시지 구조에 집중한다.
                      </p>
                    </Callout>
                    <TermPrimer />
                    <TxCard />
                    <div className="text-sm space-y-3">
                      <Note title="input · 어디서 가져오는가">
                        이전 트랜잭션의 한 출력을 가리키는 참조{" "}
                        <code className="font-mono">(prev_txid, vout)</code> +
                        그걸 풀 자격을 증명하는 서명.{" "}
                        <span className="text-muted">
                          (어떻게 “출력” 이 “자금” 인지는 다음 레이어{" "}
                          <Term id="utxo">UTXO</Term>)
                        </span>
                      </Note>
                      <Note title="output · 어디로 보내는가">
                        새 주소(대표적 P2WPKH 에서는 공개키 해시) + 금액. 이 출력은 받는 사람이
                        나중에 자기 트랜잭션의 input 으로 가리킬 때 비로소
                        ‘쓰인다’.
                      </Note>
                      <Note title="fee · 어떻게 산정되는가">
                        <code className="font-mono">
                          fee = sum(inputs) − sum(outputs)
                        </code>{" "}
                        명시적인 필드는 없다. 입출력의 차액이 곧 채굴자에게 가는 수수료다.
                      </Note>
                      <Note title="txid · 트랜잭션의 지문">
                        직렬화된 트랜잭션을{" "}
                        <Term id="double-sha256">
                          <code className="font-mono">double-SHA256</code>
                        </Term>{" "}
                        한 값. 다른 트랜잭션이 “이 출력을 가리키려” 할 때 쓰는
                        식별자.
                      </Note>
                    </div>
                  </section>
                ),
              },
              {
                title: "서명과 잠금은 어떻게 작동하나",
                level: "deep",
                body: (
                  <Section
                    heading="서명과 잠금/풀기는 어떻게 동작하나"
                    sub="핵심은 ‘누가 이 output 을 쓸 수 있는가’를 잠그고, 나중에 input 이 그 조건을 풀 증거를 제시한다는 점이다."
                  >
                    <PrimitivePanel ids={["signature", "script"]} />
                  </Section>
                ),
              },
              {
                title: "트랜잭션의 생애",
                subtitle: "생성부터 확인까지",
                body: (
                  <Section
                    heading="트랜잭션의 한 생애"
                    sub="트랜잭션을 만들었다고 바로 최종 결제가 되는 것은 아니다. 어느 지점부터 안전한 결제로 볼지 판단하는 것이 실전의 핵심이다."
                  >
                    <Lifecycle />
                  </Section>
                ),
              },
              {
                title: "수수료는 누가, 어떻게 결정하나",
                body: <FeeStory />,
              },
              {
                title: "트랜잭션 형식의 변화",
                subtitle: "Legacy / SegWit / Taproot",
                level: "deep",
                body: (
                  <Section
                    heading="트랜잭션 종류 · 잠금 형식"
                    sub="모든 트랜잭션은 같은 큰 구조를 갖지만, 잠금과 해제 방식은 시간에 따라 진화했다. 새 형식일수록 수수료 효율, 기능, 보안이 개선된다."
                  >
                    <TxTypes />
                  </Section>
                ),
              },
              {
                title: "생각해보기", subtitle: "되돌릴 수 없는 거래의 양면",
                body: (
                  <Reflection title="비트코인 거래는 환불이 가능할까?">
                    <p>
                      신용카드는 사기 발견 시{" "}
                      <span className="text-text">chargeback</span> (지급 취소)
                      가능. 거래소·플랫폼도 정책으로 환불·복구 처리. 즉 누군가
                      뒤에서 ‘되돌릴 수 있는 권한’ 을 갖고 있다.
                    </p>
                    <p>
                      비트코인은 엄밀히 말하면 ‘영구’ 가 아니다. 가장 무거운
                      사슬 (most-work chain) 이 항상 진실이고, 누군가가 정직한
                      네트워크보다 더 많은 작업을 들여 다른 사슬을 키우면 깊은
                      블록도 이론상 reorg 된다. 다만 confirmation 깊이가 깊어질
                      수록 그게 일어날 확률이 기하급수적으로 작아져서, 6
                      confirmation 즈음부턴 ‘실용적으로’ 영구라고 합의해 쓰는
                      것뿐. 즉{" "}
                      <span className="text-text">절대적 finality 가 아니라 확률적 finality</span>.
                      이건{" "}
                      <span className="text-text">검열 저항</span> 의 토대이지만,
                      잘못 보낸 송금은 회수할 수 없고 사기 피해도 외부의 도움을 받을 수 없다.
                    </p>
                    <Probe>
                      누군가가 되돌릴 수 있다는 건 누군가가 막을 수 있다는 것과
                      같다. 자유와 보호는 같은 코인의 양면. 어떤 사용 맥락에서
                      어느 쪽을 골라야 하나? Lightning 의 channel close, 거래소
                      보관, multisig 같은 도구가 그 사이의 절충안.
                    </Probe>
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

function TermPrimer() {
  const terms = [
    {
      id: "tx",
      label: "TX",
      full: "transaction",
      body: "송금 한 건을 담은 서명된 데이터 구조. 이전 UTXO 를 쓰고 새 output 을 만든다.",
    },
    {
      id: "input",
      label: "input",
      full: "spend reference",
      body: "어디서 돈을 가져오는지 가리킨다. 보통 이전 txid 와 output 번호(vout)를 참조한다.",
    },
    {
      id: "output",
      label: "output",
      full: "new coin fragment",
      body: "어디로 돈을 보낼지 적는다. 금액과 잠금 조건을 가진 새 UTXO 후보.",
    },
    {
      id: "fee",
      label: "fee",
      full: "transaction fee",
      body: "별도 필드가 아니라 input 합계에서 output 합계를 뺀 차액. 채굴자가 가져간다.",
    },
    {
      id: "script",
      label: "script",
      full: "lock / unlock rule",
      body: "output 을 잠그는 조건과 input 이 내는 증거. ‘이 키로 서명했는가’를 검증한다.",
    },
    {
      id: "txid",
      label: "txid",
      full: "transaction id",
      body: "트랜잭션의 지문. 다른 트랜잭션이 특정 output 을 가리킬 때 쓰는 ID.",
    },
  ];

  return (
    <div className="rounded-sm border border-edge bg-surface/20 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-medium text-text">
          처음 만나는 트랜잭션 약어
        </h3>
        <div className="text-[12px] text-muted">
          처음 한 번만 읽어두기
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:[&>*:nth-child(n+3)]:border-t md:[&>*:nth-child(odd)]:border-r divide-edge">
        {terms.map((t) => (
          <div key={t.id} className="p-3.5 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <Term id={t.id}>
                <span className="font-mono text-[13px] text-accent">
                  {t.label}
                </span>
              </Term>
              <span className="font-mono text-[11px] text-muted">
                {t.full}
              </span>
            </div>
            <p className="text-[13px] text-text/75 leading-relaxed">
              {t.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TxCard() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge flex items-center justify-between">
        <div className="font-mono text-[13px] text-muted">transaction</div>
        <div className="font-mono text-xs text-muted">txid 7b3a4f…e90d</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-edge">
        <div className="p-4 space-y-3">
          <div className="text-[13px] font-semibold text-muted">
            inputs · 1
          </div>
          <div className="rounded border border-edge bg-bg/60 p-3 space-y-1.5">
            <Line label="prev_txid" value="5d4e8c…2a1b" />
            <Line label="vout" value="0" />
            <Line label="signature" value="3044 02 20 …" tone="accent" />
            <Line label="pubkey" value="029b2f…b5c63" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-[13px] font-semibold text-muted">
            outputs · 2
          </div>
          <div className="rounded border border-edge bg-bg/60 p-3">
            <div className="text-xs text-muted">to · Bob</div>
            <div className="font-mono text-[13px] text-text/85 break-all">
              bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4
            </div>
            <div className="font-mono text-accent text-sm mt-1">1.0000 BTC</div>
          </div>
          <div className="rounded border border-edge bg-bg/60 p-3">
            <div className="text-xs text-muted">to · Alice (잔돈)</div>
            <div className="font-mono text-[13px] text-text/85 break-all">
              bc1qx7s2k3jrft6n0…5dq3
            </div>
            <div className="font-mono text-text/85 text-sm mt-1">0.3999 BTC</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-edge font-mono text-[13px] text-muted flex items-center gap-3">
        <span>fee</span>
        <span className="text-text/85">0.0001 BTC</span>
        <span className="text-muted/70">= inputs − outputs</span>
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "accent";
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-baseline">
      <div className="text-xs text-muted font-mono">{label}</div>
      <div
        className={`font-mono text-[13px] break-all ${
          tone === "accent" ? "text-accent" : "text-text/85"
        }`}
      >
        {value}
      </div>
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

const STAGES: {
  name: string;
  who: string;
  desc: string;
  reversible: string;
  tone?: "accent" | "accent2";
}[] = [
  {
    name: "construct",
    who: "지갑",
    desc: "input 으로 쓸 UTXO 를 고르고 (coin selection), output 을 만들고, fee 를 정한다. 아직 서명 없음.",
    reversible: "취소 자유",
    tone: "accent2",
  },
  {
    name: "sign",
    who: "지갑",
    desc: "각 input 마다 비밀키로 서명을 만들어 첨부. 이 시점부터 트랜잭션은 ‘완성된 메시지’.",
    reversible: "키 없으면 변경 불가",
  },
  {
    name: "broadcast",
    who: "지갑 → 네트워크",
    desc: "P2P 메시지로 한 노드에게 보냄. 그 노드가 검증 통과하면 mempool 에 올리고 이웃에게 전파.",
    reversible: "이론상 RBF 가능",
  },
  {
    name: "mempool",
    who: "전 세계 노드",
    desc: "각 노드가 자기 mempool 에 보관. 채굴자는 수수료 수익이 큰 트랜잭션부터 골라 블록 후보로.",
    reversible: "확인 0",
  },
  {
    name: "mined",
    who: "채굴자",
    desc: "어느 채굴자가 이 트랜잭션을 담은 블록의 PoW 를 풀어 네트워크에 broadcast 한다. 이게 첫 ‘confirmation = 1’.",
    reversible: "reorg 가능 (낮은 확률)",
    tone: "accent",
  },
  {
    name: "confirmed",
    who: "시간",
    desc: "그 블록 위에 6 개 블록이 더 쌓이면 통상 ‘final’ 로 간주한다. 다만 most-work chain rule 때문에 이론상 reorg 는 항상 가능하다. 깊이가 깊을수록 그 확률이 기하급수적으로 작아질 뿐이다 (확률적 finality).",
    reversible: "확률적 영구 (S7 참조)",
    tone: "accent",
  },
];

function Lifecycle() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[100px_120px_1fr_120px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>단계</div>
        <div>주체</div>
        <div>무슨 일</div>
        <div className="text-right">되돌릴 수 있나</div>
      </div>
      <div className="divide-y divide-edge">
        {STAGES.map((s, i) => {
          const color =
            s.tone === "accent"
              ? "text-accent"
              : s.tone === "accent2"
                ? "text-accent2"
                : "text-text/85";
          return (
            <div
              key={s.name}
              className="grid grid-cols-1 sm:grid-cols-[100px_120px_1fr_120px] gap-3 px-4 py-2.5 items-baseline"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-mono text-sm ${color}`}>{s.name}</span>
              </div>
              <div className="text-[13px] text-muted">{s.who}</div>
              <div className="text-[15px] text-text/85 leading-[1.7]">
                {s.desc}
              </div>
              <div className="text-right text-[13px] text-muted">
                {s.reversible}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeeStory() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">수수료는 누가 결정하는가</h2>
        <p className="text-[15px] text-text/70 leading-[1.7] mt-2">
          비트코인에는 정해진 송금 가격이 없다. 블록에 들어갈 수 있는 공간은
          제한되어 있고, 사용자는 그 공간을 차지하기 위해 수수료를 제시한다.
          채굴자는 보상이 큰 거래부터 담으려 하므로, 수수료는 자연스럽게{" "}
          <span className="text-text">블록 공간 경매</span>처럼 움직인다.
        </p>
      </div>

      <FeeStep
        n="①"
        title="송금자가 수수료를 제시한다"
        body={
          <>
            지갑의 ‘일반 / 빠름 / 즉시’ 같은 선택지는 결국 “얼마나 빨리 블록에
            들어가고 싶은가”를 고르는 기능이다. 금액이 1 BTC 든 100 BTC 든
            핵심은 송금액이 아니라 트랜잭션이 차지하는 공간과 제시한 수수료다.
          </>
        }
      />
      <FeeStep
        n="②"
        title="채굴자는 더 높은 보상을 주는 거래를 고른다"
        body={
          <>
            블록에는 담을 수 있는 데이터 한도가 있다. 채굴자는 그 한도 안에서
            자기 수익이 커지는 조합을 고른다. 그래서 수수료가 낮은 거래는
            mempool 에 오래 남고, 높은 거래는 더 빨리 블록에 들어갈 가능성이
            커진다.
          </>
        }
      />
      <FeeStep
        n="③"
        title="혼잡하면 경매 가격이 오른다"
        body={
          <>
            한산할 때는 낮은 수수료도 다음 블록에 들어갈 수 있다. 반대로 거래가
            몰리면 다음 블록 자리를 두고 경쟁이 붙는다. 사용자는 더 내고 빨리
            들어가거나, 덜 내고 기다리는 선택을 한다.
          </>
        }
      />

      <SectionHead
        eyebrow="비트코인"
        title="단위는 나중에 봐도 된다"
        hint={
          <>
            실제 지갑과 블록 탐색기는 보통 <code className="font-mono">sat/vB</code>
            라는 단위를 쓴다. 지금은 “공간당 가격” 정도로만 이해하면 충분하다.
            실시간 혼잡도는{" "}
            <a
              href="https://mempool.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent2 hover:text-accent font-mono"
            >
              mempool.space ↗
            </a>{" "}
            에서 확인할 수 있다.
          </>
        }
      />

      <div className="rounded-sm border border-edge bg-surface/25 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr] gap-3 px-4 py-2 border-b border-edge text-[12px] font-medium text-muted">
          <div>체인</div>
          <div>사용자가 내는 것</div>
          <div>누가 받는가</div>
        </div>
        <div className="divide-y divide-edge text-sm">
          <FeeCompareRow
            chain="Bitcoin"
            paid="트랜잭션 수수료"
            receiver="블록을 만든 채굴자"
            note="블록 공간 경매. 수수료는 input 합계와 output 합계의 차액으로 생긴다."
          />
          <FeeCompareRow
            chain="Ethereum"
            paid="base fee + priority fee"
            receiver="base fee 는 소각, priority fee 는 검증자"
            note="EIP-1559 이후 기본 수수료는 네트워크가 자동 산정하고 태운다. 사용자는 빨리 처리되도록 우선수수료를 얹는다."
            tone="accent"
          />
        </div>
      </div>

      <Callout title="이더리움은 왜 소각을 넣었나">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          비트코인은 사용자가 제시한 수수료가 블록 생산자에게 간다. 이더리움은
          EIP-1559 이후 수수료를 둘로 나눴다. 네트워크 혼잡도에 따라 자동으로
          정해지는 <span className="text-text">base fee</span> 는 소각되고,
          블록에 더 빨리 포함되도록 얹는{" "}
          <span className="text-text">priority fee</span> 만 검증자에게 간다.
          목적은 수수료 예측 가능성을 높이고, 블록 생산자가 기본 수수료를 직접
          조작해 가져가는 유인을 줄이는 것이다.
        </p>
      </Callout>

      <SectionHead
        eyebrow="실수했을 때"
        title="너무 낮게 적었다면 · RBF / CPFP"
        hint="이미 mempool 에 들어간 내 트랜잭션 fee 를 사후에 올리는 두 가지 길."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
          <div className="text-[13px] font-medium text-accent2">RBF · Replace-By-Fee</div>
          <div className="text-[15px] text-text/85 leading-[1.7]">
            같은 input 을 쓰면서 fee 만 올린 새 트랜잭션을 다시 broadcast. mempool
            에서 옛 버전이 새 버전으로 교체. 단, 송금 시 RBF 신호가 켜져 있어야 함
            (<Term id="bip125">BIP125</Term>).
          </div>
        </div>
        <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
          <div className="text-[13px] font-medium text-accent2">CPFP · Child-Pays-For-Parent</div>
          <div className="text-[15px] text-text/85 leading-[1.7]">
            느려터진 부모 트랜잭션을 ‘output’ 으로 받는 사람이 그것을 input 으로
            한 자식 트랜잭션을 만들면서 fee 를 크게 적는다. 채굴자는 둘을 묶어
            처리해야 하므로, 묶음 전체의 수수료 매력이 올라가 부모도 빨리
            들어간다.
          </div>
        </div>
      </div>

      <Reflection title="‘블록 크기 한도’ 가 곧 fee 의 원인">
        <p>
          만약 블록 크기 한도가 없었다면 채굴자는 모든 트랜잭션을 다 담을 수
          있어 수수료가 0 에 수렴했을 것. 한도가 있으니 ‘공간’ 이 희소 자원이
          되고, 그 위에 시장이 형성된다.
        </p>
        <p className="text-text/70">
          그런데 채굴 보상은 4 년마다 반감해 결국 0 에 수렴한다 (~ 2140 년). 그
          시점엔 채굴 보안의 거의 100% 가 수수료 시장에 의존. 트랜잭션 수요가
          충분히 클까? 이게 비트코인의 장기 보안 가설이고, S8 / S9 에서 다시
          만난다.
        </p>
      </Reflection>
    </section>
  );
}

function FeeStep({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-accent text-sm">{n}</span>
        <span className="text-[15px] font-medium text-text">{title}</span>
      </div>
      <div className="text-sm text-text/85 leading-relaxed mt-2 ml-7">
        {body}
      </div>
    </div>
  );
}

function FeeCompareRow({
  chain,
  paid,
  receiver,
  note,
  tone,
}: {
  chain: string;
  paid: string;
  receiver: string;
  note: string;
  tone?: "accent";
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr] gap-3 px-4 py-3 items-start">
      <div className={tone === "accent" ? "text-accent" : "text-accent2"}>
        {chain}
      </div>
      <div>
        <div className="text-text/85">{paid}</div>
        <div className="text-[13px] text-muted leading-relaxed mt-1">{note}</div>
      </div>
      <div className="text-text/72 leading-relaxed">{receiver}</div>
    </div>
  );
}

function TxTypes() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr_90px] gap-3 px-4 py-2 border-b border-edge text-[12px] font-medium text-muted">
        <div>형식</div>
        <div>무엇이 달라졌나</div>
        <div>주소 모습</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        <TxTypeRow
          name="Legacy P2PKH"
          term="p2pkh"
          prefix="1…"
          note="초기 비트코인의 기본 형식. 지금도 이해할 가치는 있지만 새 지갑의 기본 선택지는 아니다."
        />
        <TxTypeRow
          name="SegWit P2WPKH"
          term="p2wpkh"
          prefix="bc1q…"
          note={
            <>
              2017 년 도입. 서명 데이터를 분리해 수수료 효율을 높이고,
              트랜잭션 변조성 문제를 줄였다.
            </>
          }
        />
        <TxTypeRow
          name="Taproot P2TR"
          term="p2tr"
          prefix="bc1p…"
          note={
            <>
              2021 년 도입. 복잡한 조건부 지출도 평범한 서명처럼 보이게 만들어
              효율과 프라이버시를 함께 개선했다.
            </>
          }
          highlight
        />
      </div>
    </div>
  );
}

function TxTypeRow({
  name,
  term,
  prefix,
  note,
  highlight,
}: {
  name: string;
  term: string;
  prefix: string;
  note: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[130px_1fr_90px] gap-3 px-4 py-3 items-baseline ${
        highlight ? "bg-accent/5" : ""
      }`}
    >
      <div>
        <div className={`font-mono text-sm ${highlight ? "text-accent" : "text-text/85"}`}>
          <Term id={term}>{name}</Term>
        </div>
      </div>
      <div className="text-[13px] text-text/70 leading-relaxed">{note}</div>
      <div className="font-mono text-[13px] text-muted">{prefix}</div>
    </div>
  );
}

function SplitIntuition() {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <p className="text-[17px] text-text/80 leading-[1.75]">
          앞 단계에서 본 <span className="text-text">지갑 (S1 · S2)</span>{" "}
          은 키와 주소를 갖고 있었다. 이제 그 지갑으로 ‘무엇을 보내는가’.
          그게 <span className="text-text">트랜잭션</span> · 한 통의 서명된
          메시지. 그런데 이 메시지가 은행 송금처럼 ‘잔액에서 1 빼기’ 가
          아니다. 직관부터.
        </p>
        <h2 className="text-[20px] font-medium tracking-tight pt-2">
          Alice 가 1.4 BTC 를 갖고 1 BTC 를 Bob 에게 보내려면?
        </h2>
        <p className="text-[15px] text-text/70 leading-[1.7]">
          은행 계좌라면 ‘1 빼고 0.4 남기기’ 한 줄 갱신. 비트코인은 그게 안 된다.
          Alice 가 가진 1.4 BTC 는 한 덩어리의{" "}
          <span className="text-text">‘영수증’</span> (UTXO) 이라서, 부분 사용이
          불가능. 통째로 ‘소비’ 하고{" "}
          <span className="text-text">새 영수증 두 장</span> 을 만들어 다시 쪼갠다.
        </p>
      </div>

      <SplitDiagram />

      <div className="rounded-sm border border-edge bg-surface/30 p-4 text-sm text-text/85 leading-relaxed space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-accent font-mono mt-0.5">·</span>
          <span>
            <span className="text-text">Input 은 한 덩어리.</span> 1.4 BTC UTXO
            전체가 ‘소비됨’ 으로 표시된다. 부분 차감이 아니다.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-accent font-mono mt-0.5">·</span>
          <span>
            <span className="text-text">Output 두 개가 새로 생긴다.</span> 1 BTC
            는 Bob 에게, 0.3999 BTC 는 Alice 자기 자신 (잔돈). 이 둘이 곧 새
            UTXO.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-accent font-mono mt-0.5">·</span>
          <span>
            <span className="text-text">차액 = 수수료.</span> input 합 − output
            합 = 0.0001 BTC 가 그대로 채굴자에게 (별도 fee 필드 없음).
          </span>
        </div>
      </div>

      <p className="text-[14px] text-text/65 leading-[1.7]">
        ‘UTXO 가 정확히 무엇이고 왜 이렇게 설계됐나’ 는 다음 단계 (S4 UTXO)
        에서 본다. 여기서는 ‘트랜잭션이 한 통의 서명된 메시지로서 어떤 모양인지’
        에 집중.
      </p>
    </section>
  );
}

function SplitDiagram() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg viewBox="0 0 540 220" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker
            id="splitArrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 S0,10 z" fill="#7a8190" />
          </marker>
        </defs>

        {/* Input */}
        <rect
          x={20}
          y={80}
          width={140}
          height={60}
         
          fill="#5b8def15"
          stroke="#5b8def"
          strokeWidth="1"
        />
        <text x={90} y={102} textAnchor="middle" fontSize="11" fill="#7a8190" fontFamily="JetBrains Mono">
          input · UTXO
        </text>
        <text x={90} y={120} textAnchor="middle" fontSize="15" fill="#5b8def" fontFamily="JetBrains Mono">
          1.4000 BTC
        </text>
        <text x={90} y={134} textAnchor="middle" fontSize="9" fill="#5a6070" fontFamily="JetBrains Mono">
          (Alice 소유)
        </text>

        {/* Center node · transaction */}
        <rect
          x={210}
          y={92}
          width={80}
          height={36}
         
          fill="#0d0f14"
          stroke="#5a6070"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x={250} y={114} textAnchor="middle" fontSize="11" fill="#a0a8b8" fontFamily="JetBrains Mono">
          tx
        </text>

        {/* Outputs (3) */}
        <rect x={340} y={20} width={180} height={48} fill="#f7931a15" stroke="#f7931a" strokeWidth="1" />
        <text x={350} y={38} fontSize="10" fill="#7a8190" fontFamily="JetBrains Mono">output · UTXO → Bob</text>
        <text x={350} y={58} fontSize="14" fill="#f7931a" fontFamily="JetBrains Mono">1.0000 BTC</text>

        <rect x={340} y={84} width={180} height={48} fill="#5b8def10" stroke="#5b8def" strokeWidth="1" strokeDasharray="3 3" />
        <text x={350} y={102} fontSize="10" fill="#7a8190" fontFamily="JetBrains Mono">output · UTXO → Alice (잔돈)</text>
        <text x={350} y={122} fontSize="14" fill="#5b8def" fontFamily="JetBrains Mono">0.3999 BTC</text>

        <rect x={340} y={148} width={180} height={42} fill="none" stroke="#5a6070" strokeWidth="1" />
        <text x={350} y={166} fontSize="10" fill="#7a8190" fontFamily="JetBrains Mono">fee → 채굴자 (별도 필드 없음)</text>
        <text x={350} y={184} fontSize="13" fill="#a0a8b8" fontFamily="JetBrains Mono">0.0001 BTC</text>

        {/* Arrows */}
        <line x1={162} y1={110} x2={208} y2={110} stroke="#7a8190" strokeWidth="1.2" markerEnd="url(#splitArrow)" />
        <line x1={290} y1={104} x2={338} y2={44} stroke="#7a8190" strokeWidth="1.2" markerEnd="url(#splitArrow)" />
        <line x1={290} y1={110} x2={338} y2={108} stroke="#7a8190" strokeWidth="1.2" markerEnd="url(#splitArrow)" />
        <line x1={290} y1={118} x2={338} y2={168} stroke="#5a6070" strokeWidth="1" strokeDasharray="2 3" markerEnd="url(#splitArrow)" />

        <text x={270} y={210} textAnchor="middle" fontSize="11" fill="#5a6070" fontFamily="JetBrains Mono">
          input = outputs + fee
        </text>
      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        1.4 BTC input 은 1.0 BTC 송금, 0.3999 BTC 잔돈, 0.0001 BTC fee 로 나뉜다.
      </div>
    </div>
  );
}
