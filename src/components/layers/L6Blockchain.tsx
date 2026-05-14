"use client";

import { LayerShell } from "../LayerShell";
import { Reflection, Probe, Reading, Callout } from "../Reflection";
import { SectionHead } from "../SectionHead";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L6Blockchain(props: LayerProps) {
  return (
    <LayerShell
      id="S7"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "블록을 잇는다", subtitle: "prev_block_hash 라는 자물쇠",
                body: (
                  <section className="space-y-4">
                    <p className="text-[17px] text-text/80 leading-[1.75]">
                      S5 에서 한 블록의 안을, S6 에서 그 블록이 네트워크에
                      퍼지는 모양을 봤다. 그런데 ‘블록 한 개’ 가 가십으로 모두
                      에게 전해진다고 끝이 아니다. 시간이 지나며{" "}
                      <span className="text-text">블록이 계속 추가되는데</span>,
                      그 블록들이 어떻게 한 줄로 묶여 ‘되돌릴 수 없게’ 되는가.
                      이렇게 이어진 블록들의 사슬을{" "}
                      <span className="text-text">블록체인</span> 이라고 부른다.
                    </p>
                    <p className="text-[15px] text-text/70 leading-[1.7]">
                      열쇠는 헤더 안의 한 필드,{" "}
                      <code className="font-mono text-text">
                        prev_block_hash
                      </code>
                      . 각 블록이 직전 블록의 헤더 해시를 자기 안에 박아 두는
                      덕에, 한 군데를 건드리면 그 뒤로 모든 블록이 같이 무효화
                      된다.
                    </p>
                    <ChainViz />
                    <GenesisPrimer />
                    <div className="rounded-sm border border-edge bg-surface/20 p-4 text-sm leading-relaxed">
                      <h4 className="text-[16px] font-medium text-accent2 leading-snug mb-2">
                        왜 변조 불가?
                      </h4>
                      <p>
                        만약 누군가 블록 N 의 트랜잭션 한 줄을 바꾸면 → 머클
                        루트가 달라지고 → 헤더 해시가 달라진다. 그 해시는 블록
                        N+1 의{" "}
                        <code className="font-mono">prev_block_hash</code> 에
                        박혀있으므로 N+1 도 같이 다시 채굴해야 하고, 그렇게 N+2,
                        N+3 … 까지 모두 다시 해야 한다.
                      </p>
                      <p className="mt-2">
                        현재 정직한 네트워크가 1 시간 동안 새 블록 6 개를
                        만든다고 할 때, 과거 100 블록 전을 바꾸려면 정직한
                        네트워크보다{" "}
                        <span className="text-text">압도적으로 빠르게</span>{" "}
                        100 개가 넘는 블록을 다시 만들어야 한다. 현실적으로는
                        불가능에 가깝다.
                      </p>
                    </div>
                  </section>
                ),
              },
              {
                title: "Double-spending", subtitle: "‘같은 코인 두 번 쓰기’ 가 왜 어려운가",
                body: <DoubleSpending />,
              },
              {
                title: "Confirmation 깊이",
                subtitle: "안전하다는 말의 확률적 의미",
                body: (
                  <Section
                    heading="확정성은 확률적 · confirmation 깊이"
                    sub="‘몇 confirmation 이면 안전한가’ 의 답은 ‘얼마짜리 거래냐’ 에 따라 달라진다. 깊이는 곧 reorg 가 일어날 확률을 누른다."
                  >
                    <ConfirmTable />
                  </Section>
                ),
              },
              {
                title: "생각해보기", subtitle: "Bitcoin ATM 의 인출 과정",
                level: "think",
                body: <BitcoinATMReflection />,
              },
              {
                title: "Fork",
                subtitle: "일시적 분기와 규칙 변경",
                body: (
                  <Section
                    heading="fork · 사슬이 갈라지는 두 가지 경우"
                    sub="fork 는 한 단어지만 맥락이 둘이다. 하나는 전파 지연 때문에 같은 높이에 두 블록 후보가 생기는 일시적 fork 다. 다른 하나는 검증 규칙 자체가 바뀌어 네트워크가 다른 규칙을 따르게 되는 protocol fork 다."
                  >
                    <ForkScenario />
                  </Section>
                ),
              },
              {
                title: "Longest chain rule",
                subtitle: "통용 표현과 실제 규칙의 차이",
                body: <MostWorkRule />,
              },
              {
                title: "51% 공격", subtitle: "실제 비용은 얼마나 드나",
                level: "basic",
                body: <FiftyOnePercent />,
              },
              {
                title: "가장 유명한 hard fork", subtitle: "이더리움 DAO 해킹 (2016)",
                level: "case",
                body: (
                  <Section
                    heading="가장 유명한 hard fork · 이더리움의 DAO 해킹 (2016)"
                    sub="비트코인 사례는 아니지만, ‘체인의 사회적 합의로 hard fork 가 발동된’ 사상 가장 큰 사건. 비트코인이 ‘코드는 곧 법’ 원칙을 더 단단히 가져가게 만든 분기점이기도 하다."
                  >
                    <DAOHack />
                  </Section>
                ),
              },
              {
                title: "생각해보기", subtitle: "영원히 기록되는 화폐의 무게",
                body: (
                  <Reflection title="잊힐 권리가 없는 시스템">
                    <p>
                      비트코인의 모든 트랜잭션은 영구히 공개된다. 한 번 on-chain
                      에 들어가면 누구든 언제든 조회할 수 있다. 변조 불가의 양면이다.
                      검열 저항인 동시에 프라이버시 약화이기도 하다.
                    </p>
                    <p>
                      체인 분석 (chain analysis) 회사들은 휴리스틱 (예: ‘같은 tx
                      의 input 들은 한 사람’) 으로 주소를 묶고 사용자를 식별한다.
                      현금은 잊힐 수 있지만 비트코인은 그럴 수 없다.
                    </p>
                    <Probe>
                      ‘투명성’ 과 ‘프라이버시’ 는 보통 트레이드오프로 그려진다.
                      비트코인은 극단적 투명성 쪽을 택했다. 그래서 CoinJoin,
                      Lightning, Taproot 같은 프라이버시 도구가 후행으로 등장했다.
                      여기서는 영구 기록의 문제만 짚고, 구체적인 추적법과 방어
                      도구는 S13 Privacy 에서 따로 다룬다. 영원한 기록이 약속하는
                      것 (변경 불가) 과 빼앗는 것 (사적 영역) 이 어떤 균형을
                      이뤄야 할까?
                    </Probe>
                    <Reading label="S13 에서 다시 볼 사례">
                      Zcash (zk-SNARK 기반 프라이버시 코인), Monero (ring
                      signatures), Bitcoin 의 Silent Payments (
                      <Term id="bip352">BIP352</Term>) 는 S13 에서 더 자세히
                      비교한다. 같은 PoW 위에서도 프라이버시 수준은 설계 선택이다.
                    </Reading>
                    <Reading label="검색 키워드">
                      ‘영원한 기록’ 자체를 완화하려는 학술 연구 키워드.{" "}
                      <span className="text-text">redactable blockchain</span>{" "}
                      (chameleon hash 로 일부 데이터를 ‘권한자’ 가 사후 수정
                      가능, Ateniese et al. 2017),{" "}
                      <span className="text-text">retractable / mutable
                      blockchain</span>, GDPR 의 ‘잊힐 권리’ 와 immutable
                      ledger 의 충돌 등으로 검색하면 관련 연구를 더 찾아볼 수 있다.
                      다만 이런 메커니즘은 ‘누구의 권한으로 지우나’ 라는 새로운
                      중심을 도입한다. 그래서 비트코인 메인넷에는 채택되지 않는다.
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

function DoubleSpending() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          ‘같은 코인 두 번 쓰기’ 가 왜 어려운가
        </h2>
        <p className="text-[15px] text-text/70 leading-[1.7] mt-2 max-w-2xl">
          비트코인이 풀고자 한 가장 본질적 문제. 디지털 데이터는 ‘복사’ 가
          공짜라서, 별도 규칙이 없으면 같은 코인 정보를 두 사람에게 동시에 보내고 둘 다
          속일 수 있다. 비트코인은 이걸 두 단계로 막는다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent2 leading-snug">
            ① UTXO 모델
          </div>
          <div className="text-[16px] font-medium text-text leading-snug">
            한 UTXO 는 ‘단 한 번’ 만 input 으로 쓸 수 있다
          </div>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            S4 에서 본 그 모양. Alice 가 같은 UTXO 로 Bob 에게 송금하는 tx 를
            만들고 동시에 Carol 에게 송금하는 tx 를 만들면, 둘 다 같은
            (txid, vout) 을 가리킨다. 노드는 둘 중 하나만 받는다 (먼저 본 거,
            또는 fee 가 더 높은 거 · 정책에 따라).
          </p>
        </div>
        <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent leading-snug">
            ② Longest chain rule
          </div>
          <div className="text-[16px] font-medium text-text leading-snug">
            ‘블록에 들어간 tx’ 가 ‘블록에 안 들어간 tx’ 를 이긴다
          </div>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            Alice 가 두 tx 를 다른 노드들에 동시에 뿌리면 노드별로 ‘본 게
            다를’ 수도 있다. 결국 어느 한쪽이 채굴자가 만든 블록에 담겨
            confirm 되면, 다른 하나는 영원히 mempool 을 떠돌다 만료된다.
            그래서 ‘몇 블록 깊이로 묻혔는가’ 가 곧{" "}
            <span className="text-text">실용적 안전성</span>.
          </p>
        </div>
      </div>

      <Callout title="0-confirmation 결제의 위험">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          ‘기다리지 않고 바로 받기’ 는 카페 한 잔 같은 미세 거래에서나 안전.
          공격 시나리오: Alice 가 카페에 ‘커피 한 잔’ tx 를 보내 점원 화면에
          뜨자마자 (mempool 에만 있음) 음료를 받고 나간다. 동시에 같은 UTXO 를
          쓰는 ‘자기 다른 주소로 보내는’ 더 높은 fee 의 tx 를 채굴자에게 직접
          전달한다. 채굴자는 fee 가 높은 쪽을 블록에 넣는다 →{" "}
          <span className="text-text">double-spend 성공</span>.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          이걸 막으려면 ‘블록에 묻힐 때까지 기다리기’. 다음 단계의 confirmation
          깊이가 그 ‘얼마나 기다려야 하나’ 의 답.
        </p>
      </Callout>
    </section>
  );
}

function BitcoinATMReflection() {
  return (
    <Reflection title="Bitcoin ATM 에선 인출이 어떻게 일어나나?">
      <p>
        길거리에서 보이는 Bitcoin ATM 은 현금을 비트코인으로 바꾸거나,
        비트코인을 현금으로 바꾸는 기계다. 위에서 confirmation 깊이를 봤다면
        자연스럽게 한 가지 질문이 생긴다. ATM 은 이 대기 시간을 어떻게 처리할까?
      </p>
      <p>
        실제로 써보면 당연하게도 즉시 입금이나 즉시 인출이 되지 않는다. 보통은
        다음 순서로 진행된다.
      </p>
      <ul className="space-y-1.5 text-[14px] text-text/80 leading-[1.7] pl-4 list-disc">
        <li>
          현금 → BTC 매수: 사용자가 자기 지갑 주소를{" "}
          <span className="text-text">QR 코드</span> 로 ATM 카메라에 보여준다.
          현금을 넣으면 ATM 운영사가 자기 hot wallet 에서 그 주소로 송금하는 tx
          를 브로드캐스트한다. 사용자는{" "}
          <span className="text-text">자기 지갑 앱에서 confirmation 을 직접
          기다린다</span> (보통 1 ~ 3 confirmation, ATM 자리에서 즉시 떠나도
          상관없다).
        </li>
        <li>
          BTC → 현금 인출은 더 까다롭다. 사용자가 ATM 의 receive 주소로 송금 tx
          를 브로드캐스트하면 ATM 은{" "}
          <span className="text-text">최소 confirmation (보통 1 ~ 6) 까지
          기다린다</span>. 그 후에 현금이 나온다. 그래서 길게는 30 ~ 60 분까지
          ATM 앞에서 기다리거나 다시 와야 한다. ‘즉시 인출’ 이라는 표시는
          현실에서는 ‘confirmation 이 빠른 작은 액수’ 에 한정된다.
        </li>
      </ul>
      <p>
        그리고 한 가지 더 · ATM 운영사들은 보통{" "}
        <span className="text-text">제재 주소 / 의심 주소 blacklist</span> (
        Chainalysis, TRM Labs 같은 컴플라이언스 회사 데이터) 를 연동한다. 어떤
        주소에서 들어온 비트코인은 받아주지 않거나, 큰 액수에 KYC (신분증
        스캔) 를 강제한다. 즉 ATM 으로 ‘세탁된 검은 돈을 자유롭게 현금화’ 하는
        시나리오는 생각보다 잘 안 통한다.
      </p>
      <Probe>
        그 결과 개인 사이의 대면 OTC (Over-the-Counter) 거래 · 모르는 사람과
        만나서 현금과 비트코인을 직접 교환 · 가 일정 규모 활발한 것으로
        추정된다 (정확한 통계는 익명 시장의 본질상 잡히지 않는다). ‘투명한
        장부 + 익명 키’ 라는 비트코인 설계가 바깥 세계 (현금 ↔ 가상자산) 와
        만나는 지점에서 어떤 회색 공간을 만드는가.
      </Probe>
      <Reading label="참고 사이트">
        <a
          href="https://coinatmradar.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent2 hover:text-accent border-b border-dotted border-accent2/40 hover:border-accent/60 transition-colors"
        >
          coinatmradar.com
        </a>{" "}
        · 전 세계 Bitcoin ATM 위치/운영사 지도. 미국 / 유럽이 압도적이고,
        운영사 별로 confirmation 정책·blacklist 정책이 다르다.
      </Reading>
    </Reflection>
  );
}

function ChainViz() {
  const blocks = [
    { h: 99, hash: "0a3f1c", prev: "…" },
    { h: 100, hash: "8e2b54", prev: "0a3f1c" },
    { h: 101, hash: "44d97e", prev: "8e2b54" },
    { h: 102, hash: "7c0e91", prev: "44d97e" },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 overflow-x-auto">
      <div className="flex items-stretch gap-3 min-w-max">
        {blocks.map((b, i) => (
          <div key={b.h} className="flex items-center gap-3">
            <div className="rounded-sm border border-edge bg-surface/40 px-3 py-2.5 min-w-[140px]">
              <div className="text-xs text-muted font-mono">block #{b.h}</div>
              <div className="font-mono text-[13px] text-accent mt-1.5">
                hash {b.hash}
              </div>
              <div className="font-mono text-xs text-muted mt-1">
                prev {b.prev}
              </div>
            </div>
            {i < blocks.length - 1 && (
              <div className="flex flex-col items-center text-muted">
                <div className="font-mono text-xs">prev</div>
                <div className="text-lg leading-none">←</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-[13px] text-muted mt-3 text-center leading-relaxed">
        각 블록의 prev_block_hash 가 직전 블록의 헤더 해시. 한 곳을 건드리면
        뒤로 모두 무효화된다.
      </div>
    </div>
  );
}

function ConfirmTable() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_140px] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>confirmations</div>
        <div>실용 권장</div>
        <div className="text-right">평균 대기시간</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        <ConfirmRow n={0} use="mempool 에서 보인 상태만 확인한다. 카페 결제처럼 되돌릴 유인이 작은 미세 거래에서만 현실적이다." wait="0" />
        <ConfirmRow n={1} use="소액 결제에 쓰인다. 1 블록 reorg 는 드물지만 가능성은 남아 있다." wait="≈ 10 분" />
        <ConfirmRow n={3} use="중액. 거래소 입금 기준이 보통 여기 근처" wait="≈ 30 분" tone="accent2" />
        <ConfirmRow n={6} use="큰 액수. ‘Bitcoin 표준 finality’ 로 인용되는 깊이" wait="≈ 60 분" tone="accent" />
        <ConfirmRow n={100} use="coinbase tx (채굴 보상) 가 사용 가능해지는 깊이. 매우 안전" wait="≈ 17 시간" />
      </div>
      <div className="px-4 py-2.5 border-t border-edge text-[13px] text-muted leading-relaxed">
        n confirmations 후 reorg 확률은 공격자 hashrate 가 q (정직한 1−q
        대비) 일 때 대략 (q/1−q)ⁿ. q = 0.1 이면 6 confirmation 후 reorg 확률 ≈
        0.024%, q = 0.3 이면 약 14%.
      </div>
    </div>
  );
}

function ConfirmRow({
  n,
  use,
  wait,
  tone,
}: {
  n: number;
  use: string;
  wait: string;
  tone?: "accent" | "accent2";
}) {
  const color =
    tone === "accent"
      ? "text-accent"
      : tone === "accent2"
        ? "text-accent2"
        : "text-text/85";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_140px] gap-3 px-4 py-2.5 items-baseline">
      <div className={`font-mono text-sm ${color}`}>{n}</div>
      <div className="text-text/85 leading-relaxed">{use}</div>
      <div className="text-right font-mono text-[13px] text-muted">{wait}</div>
    </div>
  );
}

function ForkScenario() {
  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-4">
        <SectionHead
          eyebrow="일시적 fork"
          title="같은 높이에 두 후보가 생기는 경우"
        />
        <svg
          viewBox="0 0 540 220"
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="forkArrow"
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

          <BlockNode x={20} y={90} h="N" />
          <BlockNode x={150} y={40} h="N+1 (A)" tone="accent2" />
          <BlockNode x={150} y={140} h="N+1 (B)" tone="muted" />
          <BlockNode x={290} y={40} h="N+2 (A)" tone="accent2" />
          <BlockNode x={430} y={40} h="N+3 (A)" tone="accent" />

          <line x1={100} y1={102} x2={150} y2={52} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#forkArrow)" />
          <line x1={100} y1={102} x2={150} y2={152} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#forkArrow)" strokeDasharray="3 3" />
          <line x1={230} y1={52} x2={290} y2={52} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#forkArrow)" />
          <line x1={370} y1={52} x2={430} y2={52} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#forkArrow)" />

          <text x={190} y={184} fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">
            stale branch
          </text>
          <text x={350} y={20} fontSize="12" fill="#a0a8b8" fontFamily="JetBrains Mono">
            longest-work chain
          </text>
        </svg>
        <div className="text-[15px] text-text/85 leading-[1.7]">
          두 채굴자가 같은 prev (블록 N) 를 기반으로 거의 동시에 블록을 만들면
          잠시 두 갈래 (A, B) 가 공존한다. 다음 블록 N+2 가 한쪽 위에 쌓이는 순간
          그쪽이 ‘longest-work chain’ 이 되고, 다른 갈래는 버려진다 (
          <Term id="orphan-block">stale block / orphan</Term>). 그 안의
          트랜잭션은 mempool 로 돌아가 다음 블록에 다시 들어갈 수 있다.
        </div>
      </div>

      <div className="space-y-3">
        <SectionHead
          eyebrow="protocol fork"
          title="검증 규칙이 바뀌면 soft fork 와 hard fork 로 나뉜다"
        />
        <ForkTypes />
      </div>
    </div>
  );
}

function BlockNode({
  x,
  y,
  h,
  tone,
}: {
  x: number;
  y: number;
  h: string;
  tone?: "accent" | "accent2" | "muted";
}) {
  const stroke =
    tone === "accent"
      ? "#f7931a"
      : tone === "accent2"
        ? "#5b8def"
        : tone === "muted"
          ? "#3a3f4a"
          : "#7a8190";
  const fill =
    tone === "accent"
      ? "#f7931a18"
      : tone === "accent2"
        ? "#5b8def18"
        : tone === "muted"
          ? "#0d0f14"
          : "#0d0f14";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={80}
        height={24}
       
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <text
        x={x + 40}
        y={y + 16}
        textAnchor="middle"
        fontSize="11"
        fill="#e6e8ec"
        fontFamily="JetBrains Mono"
      >
        {h}
      </text>
    </g>
  );
}

function ForkTypes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <ForkTypeCard
        kind="Soft fork"
        line="새 규칙이 ‘기존 유효한 블록의 부분집합’ 만 유효로 만든다."
        ex={
          <>
            SegWit (<Term id="bip141">BIP141</Term>), Taproot (
            <Term id="bip341">BIP341</Term>)
          </>
        }
        compat="구버전 노드도 새 블록을 ‘유효하다고’ 받아들임. 채굴자만 새 규칙 따름. backward-compatible."
        tone="accent2"
      />
      <ForkTypeCard
        kind="Hard fork"
        line="새 규칙이 기존엔 무효였던 블록을 유효하게 한다 (혹은 그 반대)."
        ex="Bitcoin Cash 분리 (2017), Bitcoin SV (2018)"
        compat="구버전 노드는 새 블록을 거부 → 사슬이 영구히 둘로 갈림. NOT backward-compatible."
        tone="accent"
      />
    </div>
  );
}

function ForkTypeCard({
  kind,
  line,
  ex,
  compat,
  tone,
}: {
  kind: string;
  line: string;
  ex: React.ReactNode;
  compat: string;
  tone: "accent" | "accent2";
}) {
  const stroke = tone === "accent" ? "border-accent/40 bg-accent/5" : "border-accent2/40 bg-accent2/5";
  const heading = tone === "accent" ? "text-accent" : "text-accent2";
  return (
    <div className={`rounded-sm border ${stroke} p-4 space-y-2`}>
      <div className={`text-[15px] font-semibold ${heading} leading-snug`}>
        {kind}
      </div>
      <div className="text-[15px] text-text/85 leading-[1.7]">{line}</div>
      <div className="text-[13px] text-muted">예: {ex}</div>
      <div className="text-[13px] text-muted leading-relaxed border-t border-edge pt-2">
        {compat}
      </div>
    </div>
  );
}

function GenesisPrimer() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge">
        <div className="text-[13px] font-semibold text-accent2 leading-snug">
          Genesis block · 사슬의 기준점
        </div>
        <div className="text-[13px] text-muted mt-1 leading-relaxed">
          모든 블록은 직전 블록의 해시를 가리키지만, 첫 블록만은 예외다.
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-[14px] text-text/85 leading-[1.7]">
          <span className="text-text">Genesis block</span> 은 비트코인 사슬의 첫
          블록, 즉 block height 0 이다. 이전 블록이 없으므로{" "}
          <code className="font-mono text-text">prev_block_hash</code> 는 0 으로
          채워진다. 모든 노드는 이 블록을 출발점으로 삼아 그 뒤에 붙은 블록들이
          유효한지 검증한다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2.5 text-[13px]">
          <span className="text-muted">생성 시점</span>
          <span className="font-mono text-text/85">2009-01-03 18:15:05 UTC</span>
          <span className="text-muted">coinbase 메시지</span>
          <span className="text-accent2 break-words leading-relaxed">
            “The Times 03/Jan/2009 Chancellor on brink of second bailout for
            banks”
          </span>
        </div>
        <p className="text-[13px] text-muted leading-relaxed">
          이 신문 헤드라인은 그 블록이 2009 년 1 월 3 일 이후 만들어졌다는
          타임스탬프 증거이면서, 은행 시스템 위기라는 시대적 맥락을 남긴
          메시지로 읽힌다.
        </p>
      </div>
    </div>
  );
}

function DAOHack() {
  const timeline = [
    {
      when: "2016-04",
      what: "The DAO 출범. 이더리움 위 분산 투자펀드 스마트 컨트랙트. 약 1억 5천만 달러 (당시 ETH 의 14%) 모금.",
    },
    {
      when: "2016-06-17",
      what: "공격자가 ‘재진입 (reentrancy) 버그’ 를 악용해 DAO 컨트랙트에서 약 360만 ETH (당시 약 5천만 달러) 를 자기 ‘child DAO’ 로 빼냄.",
      tone: "bad" as const,
    },
    {
      when: "2016-06 ~ 07",
      what: "이더리움 커뮤니티 분열. ‘hard fork 로 도난 자금을 원위치 시키자’ vs ‘체인의 불변성 (immutability) 이 더 중요하다’.",
    },
    {
      when: "2016-07-20",
      what: "block #1 920 000 에서 hard fork 적용. 도난 자금이 회수 가능한 별도 컨트랙트로 옮겨짐. 다수 hashrate 와 거래소가 fork 사슬을 ‘ETH’ 로 채택.",
      tone: "accent" as const,
    },
    {
      when: "2016-07 ~",
      what: "fork 를 거부하고 원래 사슬을 그대로 유지한 소수파가 ‘Ethereum Classic (ETC)’ 으로 분리. 두 체인이 영구히 공존.",
      tone: "accent2" as const,
    },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>시점</div>
          <div>사건</div>
        </div>
        <div className="divide-y divide-edge text-sm">
          {timeline.map((t, i) => {
            const color =
              t.tone === "bad"
                ? "text-[#f76b6b]"
                : t.tone === "accent"
                  ? "text-accent"
                  : t.tone === "accent2"
                    ? "text-accent2"
                    : "text-muted";
            return (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 px-4 py-2.5 items-baseline"
              >
                <div className={`font-mono text-[13px] ${color}`}>{t.when}</div>
                <div className="text-text/85 leading-relaxed">{t.what}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-sm border border-edge bg-surface/20 p-4 space-y-2">
          <h4 className="text-[16px] font-medium text-accent2 leading-snug">
            이게 왜 hard fork 일까?
          </h4>
          <p className="text-text/85 leading-relaxed">
            특정 블록 높이 이후, 도난당한 ETH 의 잔액을 강제로 옮기는 새 검증
            규칙이 도입됐다. 구버전 노드는 이 ‘비정상적’ 잔액 변경을 거부하므로
            새 규칙을 따르는 사슬과 기존 규칙을 따르는 사슬이 영구적으로 갈라진다.
          </p>
        </div>
        <div className="rounded-sm border border-edge bg-surface/20 p-4 space-y-2">
          <h4 className="text-[16px] font-medium text-accent2 leading-snug">
            비트코인이 다르게 가는 이유
          </h4>
          <p className="text-text/85 leading-relaxed">
            비트코인 커뮤니티는 “코드는 곧 법, 사회적 개입으로 자금을 되돌리지
            않는다” 의 신념이 강하다. 그래서 비슷한 사고가 일어나도 hard fork
            로 ‘구제’ 하지 않는다는 것이 사실상의 규범에 가깝다. 2016 DAO fork
            는 이 원칙을 어디까지 적용해야 하는지, 그리고 code as law 가 사용자
            보호와 충돌할 때 어느 쪽을 우선해야 하는지 묻는 대표 사례다.
          </p>
        </div>
      </div>
    </div>
  );
}

function MostWorkRule() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">Longest chain rule · 정확히는 most-work chain</h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-1.5 max-w-2xl">
          비트코인의 포크 선택 규칙은 흔히{" "}
          <span className="text-text">Longest chain rule</span> 이라고 소개된다.
          다만 여기서 ‘longest’ 는 단순히 블록 개수가 많다는 뜻이 아니다. 실제 규칙은{" "}
          <span className="text-text">‘쌓인 작업량 (cumulative work) 이 가장 많은 사슬’</span>{" "}
          이다. 둘이 보통은 같지만, 난이도가 다른 두 갈래가 만나면 결과가
          달라진다.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3 text-sm leading-relaxed">
        <p>
          블록 헤더의 <code className="font-mono">bits</code> 필드는 그 블록을
          만들 때의 target 을 압축한 값. 거기서{" "}
          <code className="font-mono">work = 2²⁵⁶ / target</code> 으로 한 블록의
          기여 작업량이 나온다. 사슬의 work 는 그 값들의 누적합이다. 노드는 두
          후보 사슬 중 work 누적합이 큰 쪽을 택한다.
        </p>
        <p className="text-text/70">
          이 차이가 드러나는 시나리오: 어떤 채굴자가 난이도 조정 직전에 다수
          블록을 빠르게 캐서 길이는 길지만 work 합이 더 작은 사슬을 만들었다면,
          정직한 다수가 따르는 더 짧지만 누적 작업량이 큰 사슬에 진다. ‘길이’ 와
          ‘누적 작업량’ 을 구분하는 것이 의도적 공격을 막는 핵심이다.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 p-4">
        <SectionHead
          eyebrow="구체적 예시"
          title="높이 vs work · 둘이 다를 수 있다"
        />
        <div className="border border-edge/70 bg-bg/40 divide-y divide-edge/70">
          <div className="hidden md:grid grid-cols-[0.9fr_1fr_1fr_1fr_1fr] gap-3 px-3 py-2 text-[13px] font-semibold text-muted">
            <div>사슬</div>
            <div>길이 (높이)</div>
            <div>평균 difficulty</div>
            <div>총 work</div>
            <div>노드 선택?</div>
          </div>
          <WorkRow chain="사슬 A" height="100 블록" difficulty="1.0×" work="100 W" selected />
          <WorkRow chain="사슬 B" height="102 블록" difficulty="0.9×" work="91.8 W" />
        </div>
        <div className="text-[13px] text-muted mt-3 leading-relaxed">
          fork 가 여러 번 이어지면 더 많은 블록을 가진 갈래가 눈에 띌 수 있다.
          그러나 노드는 블록 개수만 보지 않는다. 위 예시에서는 B 가 더 길지만
          누적 work 가 적기 때문에 A 를 ‘진짜’ 사슬로 본다.
        </div>
      </div>
    </section>
  );
}

function WorkRow({
  chain,
  height,
  difficulty,
  work,
  selected,
}: {
  chain: string;
  height: string;
  difficulty: string;
  work: string;
  selected?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1fr_1fr_1fr_1fr] gap-2.5 md:gap-3 px-3 py-3 text-sm">
      <div className="font-medium text-text/85">{chain}</div>
      <MobileCell label="길이">{height}</MobileCell>
      <MobileCell label="평균 difficulty">{difficulty}</MobileCell>
      <MobileCell label="총 work">{work}</MobileCell>
      <div className="flex items-baseline justify-between gap-3 md:block">
        <span className="md:hidden text-[12px] font-semibold text-muted">노드 선택</span>
        <span className={selected ? "text-accent" : "text-[#f76b6b]"}>
          {selected ? "채택" : "무시"}
        </span>
      </div>
    </div>
  );
}

function MobileCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 md:block font-mono text-text/85">
      <span className="md:hidden font-sans text-[12px] font-semibold text-muted">
        {label}
      </span>
      <span>{children}</span>
    </div>
  );
}

function FiftyOnePercent() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          ‘51% 공격’ 이 실제로 무엇이고 얼마나 비싼가
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-1.5 max-w-2xl">
          공격자가 정직한 네트워크보다 빠르게 사슬을 키우면, 자기에게 유리한
          버전 (예: 자기가 보낸 송금 취소) 으로 사슬을 ‘갈아치울’ 수 있다.
          하지만 ‘빠르게’ 가 무엇을 의미하는지 구체적으로 보면, 비용이 천문학적
          이라는 게 드러난다.
        </p>
      </div>

      <Callout tone="accent" title="51% 그 자체는 의미가 없다 · 진짜 노리는 건 double-spending">
        <p className="text-[15px] text-text/80 leading-[1.7]">
          ‘다수 hashrate 를 모았다’ 는 사실 자체로는 돈이 되지 않는다. 51% 가
          ‘공격’ 이 되는 건 그 자원을 써서{" "}
          <span className="text-text">fork 를 유도</span> 하고, 그 fork 위에서{" "}
          <span className="text-text">double-spending</span> 같이 ‘이미 보낸
          트랜잭션을 없던 일로’ 만들어 거래소·결제처를 속여 자금을 빼낼 때다.
          전형적인 시나리오는 이렇다. 공격자는 거래소에 BTC 를 입금하고,
          confirmation 을 받은 뒤 코인이나 현금을 인출한다. 동시에 그 입금 거래가
          들어간 블록보다 앞선 지점에서 비밀 fork 를 키워 두었다가 공개한다.
          노드들이 work 가 더 많은 공격자 사슬로 reorg 하면, 원래 입금 트랜잭션은
          사라지고 거래소는 코인을 받은 적이 없는 상태가 된다. 결과적으로 공격자는
          같은 자금을 두 번 쓴 효과를 얻는다.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          즉 51% 공격은 수단이고, 실제 수익은 그 위에서 일어나는 사기에서
          발생한다. 그래서 공격 비용과 ‘속여낼 수 있는 액수’ 를 비교하는 것이
          안전성 분석의 핵심이다.
        </p>
      </Callout>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-edge font-mono text-[13px] text-muted">
          공격 시나리오 단계
        </div>
        <div className="divide-y divide-edge text-sm">
          <AttackStep
            n="①"
            what="공격자가 ‘되돌리고 싶은 거래’ 가 든 블록보다 한 블록 위에서 비밀 사슬 시작"
          />
          <AttackStep
            n="②"
            what="공개 블록이 6 confirmation 깊이까지 묻혀가는 동안, 비밀 사슬을 더 빨리 키워야 함 (work 누적합이 더 커지도록)"
          />
          <AttackStep
            n="③"
            what="공격자 사슬을 일제히 공개 → 노드들이 ‘work 가 더 많은’ 새 사슬로 reorg → 원래 거래가 사라짐"
          />
        </div>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
        <SectionHead
          eyebrow="구체적 비용 (2026 기준 대략)"
          title="‘51% 를 한 시간 빌리려면?’"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-[14px] font-semibold text-accent2">전체 hashrate</div>
            <div className="text-text/85 leading-relaxed">
              비트코인 네트워크는 약{" "}
              <span className="font-mono text-accent">1 ZH/s</span> (10²¹ hashes/sec).
              51% 를 차지하려면 약{" "}
              <span className="font-mono text-accent">500 EH/s</span> 의 ASIC 이
              필요하다.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[14px] font-semibold text-accent2">하드웨어 비용</div>
            <div className="text-text/85 leading-relaxed">
              최신 ASIC (Antminer S21 ≈ 200 TH/s) 기준 약{" "}
              <span className="font-mono text-accent">250 만 대</span>. 시장 가격
              총합 약{" "}
              <span className="font-mono text-accent">$100 억</span>. 공급도 부족.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[14px] font-semibold text-accent2">전기 비용 / 시간</div>
            <div className="text-text/85 leading-relaxed">
              150 TWh/년 × 51% ≈{" "}
              <span className="font-mono text-accent">9 GW</span> 의 즉시 전력.
              한 시간만 돌려도{" "}
              <span className="font-mono text-accent">$500 K +</span> 전기료.
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[14px] font-semibold text-accent2">기회 비용</div>
            <div className="text-text/85 leading-relaxed">
              51% 를 합법 채굴에 쓰면 시간당 약 50 BTC 보상 (≈{" "}
              <span className="font-mono text-accent">$3 M</span>) 을 정직하게 벌
              수 있다. 공격은 그 수익도 포기해야 한다.
            </div>
          </div>
        </div>
      </div>

      <div className="border-l-2 border-accent2/50 pl-4 py-1.5 text-sm leading-relaxed space-y-2">
        <div className="text-[14px] font-semibold text-accent2">
          공격이 성공해도 더 큰 함정
        </div>
        <p>
          공격이 알려지면 그 체인의 가격이 폭락. 공격자가 갖고 있던 ASIC·잔여
          코인·미래 채굴 수입 모두 가치 손실. ‘공격이 성공하면 공격 대상 자체가
          무가치해진다’ 는 자기 무력화 구조가 PoW 의 게임 이론적 안전성의 핵심이다.
        </p>
        <p className="text-text/70">
          단, 이 ‘일반적으로 적자’ 결론은 합리 가정 하에서의 것이지 절대 안전
          보증은 아니다. 계산이 뒤집히는 시나리오들: ① 공격자가 ASIC 을 이미
          가라앉은 비용 (sunk cost) 으로 갖고 있어 한계비용만 들임, ② BTC 가격
          하락에 대해 선물·옵션 short 으로 미리 헤지, ③ 국가급 행위자처럼
          ‘수익’ 이 아니라 ‘체인 자체에 피해’ 가 목적인 경우.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          실제로 일어난 51% 시도 · 비트코인 본체는 한 번도 없음 · 작은 PoW 체인들의 사례
        </div>
        <div className="divide-y divide-edge text-sm">
          <AttackCase
            when="2018-05"
            chain="Bitcoin Gold (BTG)"
            what="비트코인 하드포크 알트코인. 공격자가 거래소들에 BTG 입금 → confirm 받고 다른 코인으로 환전·출금 → 그 입금 트랜잭션이 사라지도록 fork 를 공개. 추정 손실 ≈ $18 M."
          />
          <AttackCase
            when="2019-01 · 2020-08"
            chain="Ethereum Classic (ETC)"
            what="이더리움의 (DAO 분기 이전) 원본 사슬. 두 번 큰 공격. 2020-08 에는 한 달 사이 세 차례 reorg, 거래소들에서 합산 ≈ $5.6 M 손실."
          />
          <AttackCase
            when="2020-01"
            chain="Bitcoin Gold (BTG · 2 차)"
            what="2018 사고 후 다시. 14, 15 블록 깊이의 reorg. 손실 규모는 전보다 작았지만 (≈ $70K), ‘작은 SHA-3 변형 PoW 체인은 NiceHash 같은 hashrate 시장에서 잠시 빌려도 51% 가능’ 을 다시 입증."
          />
          <AttackCase
            when="2025"
            chain="Monero (XMR) · Qubic 사건"
            what="Qubic 이라는 ‘useful PoW’ 프로젝트가 자신들의 컴퓨트 풀로 Monero 채굴에 진입, 한때 majority hashrate 에 도달했다고 주장. 실제로 deep reorg 가 관측됐는지는 논쟁 중. ‘외부에서 다른 목적으로 모인 컴퓨트가 PoW 체인을 위협할 수 있다’ 의 새 케이스로 인용된다."
            tone="warn"
          />
        </div>
        <div className="px-4 py-2.5 border-t border-edge text-[12px] text-muted leading-relaxed">
          공통 패턴 · ‘작은 hashrate 의 PoW 체인’ + ‘충분히 크고 confirmation
          이 적은 거래소 입금’. 비트코인 메인넷이 한 번도 당하지 않은 건 이 둘이
          모두 만족되지 않기 때문 (전 세계 hashrate 의 51% 를 빌리는 건 사실상
          불가능 + 큰 거래소들은 1+ 시간 confirmation 요구).
        </div>
      </div>
    </section>
  );
}

function AttackCase({
  when,
  chain,
  what,
  tone,
}: {
  when: string;
  chain: string;
  what: string;
  tone?: "warn";
}) {
  const chainColor = tone === "warn" ? "text-[#f76b6b]" : "text-accent";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[100px_160px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className="font-mono text-[12px] text-muted">{when}</div>
      <div className={`font-mono text-[13px] ${chainColor}`}>{chain}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{what}</div>
    </div>
  );
}

function AttackStep({ n, what }: { n: string; what: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[40px_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className="font-mono text-accent text-sm">{n}</div>
      <div className="text-text/85 leading-relaxed">{what}</div>
    </div>
  );
}
