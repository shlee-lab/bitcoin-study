"use client";

import { useEffect, useState } from "react";
import { LayerShell } from "../LayerShell";
import { Reflection, Probe, Reading, Callout } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L10Scalability(props: LayerProps) {
  return (
    <LayerShell
      id="S12"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "병목의 정체",
                subtitle: "블록 공간과 생성 간격이 만드는 한계",
                body: <Bottleneck />,
              },
              {
                title: "두 가지 확장 방향",
                subtitle: "L1을 키울 것인가, L2로 옮길 것인가",
                body: <TwoApproaches />,
              },
              {
                title: "비트코인의 선택",
                subtitle: "보수적 L1 + 채널 기반 L2",
                body: <BitcoinScalingChoice />,
              },
              {
                title: "Payment channel",
                subtitle: "두 사람이 여러 번 거래하는 방법",
                body: <PaymentChannel />,
              },
              {
                title: "Lightning Network",
                subtitle: "채널 그래프와 라우팅",
                level: "deep",
                body: <LightningNetwork />,
              },
              {
                title: "HTLC · 라우팅 안전 장치",
                subtitle: "Hashed Time-Locked Contract",
                level: "deep",
                body: <HTLCSection />,
              },
              {
                title: "다른 생태계의 답",
                subtitle: "빠른 L1, Rollup, Sharding",
                level: "case",
                body: <OtherEcosystems />,
              },
              {
                title: "생각해보기",
                subtitle: "저렴하고 빠른 암호화폐, 카드 결제를 대체할 수 있을까?",
                body: <PaymentRailsReflection />,
              },
            ]}
          />
        </div>
      }
    />
  );
}

function Bottleneck() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        블록의 느린 생성과 작은 크기에서 이러한 병목이 생긴다. Alice → Bob 한
        건의 송금은 안전하지만, 전 세계가 매일 카드처럼 결제하기엔 메인 체인이
        느리고 좁다. 핵심은 숫자 암기가 아니라{" "}
        <span className="text-text">기반 체인이 의도적으로 희소한 공간</span>
        이라는 점이다.
      </p>
      <div className="border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 px-4 py-2 border-b border-edge text-[12px] font-medium text-muted">
          <div>한계</div>
          <div>의미</div>
        </div>
        <div className="divide-y divide-edge text-[14px]">
          <Row label="작은 블록" body="한 번에 담을 수 있는 거래 수가 제한된다." />
          <Row label="느린 간격" body="새 블록은 평균 10 분마다 하나씩 나온다." />
          <Row label="낮은 처리량" body="메인 체인만으로는 카드 네트워크 같은 대량 결제를 감당하기 어렵다." />
          <Row label="수수료 변동" body="거래가 몰리면 블록 공간 경매가 치열해져 작은 결제가 경제적으로 맞지 않을 수 있다." />
        </div>
      </div>
      <p className="text-[15px] text-text/75 leading-[1.7]">
        문제는 두 층이다. 첫째,{" "}
        <span className="text-text">처리량의 절대값</span> 자체가
        전세계 결제로 쓰기엔 작다. 둘째,{" "}
        <span className="text-text">수수료의 변동성</span> 이 더 심각하다.
        평상시엔 괜찮다가 mempool 이 막히는 순간 작은 송금이 경제적으로
        맞지 않을 수 있다.
      </p>
      <p className="text-[15px] text-text/75 leading-[1.7]">
        이 한계는 우연이 아니라{" "}
        <span className="text-text">의도된 보수성</span> 이다. 블록을 키우면
        노드 운영 부담이 ↑ → 누가 자기 노드를 돌릴 수 있는가가 좁아진다 (S6 ·
        S10). 비트코인은 ‘일반 사용자가 자기 노드로 검증할 수 있다’ 를 보안의
        기둥으로 보기 때문에, L1 확장에 보수적이다.
      </p>
      <p className="text-[15px] text-text/85 leading-[1.7]">
        그럼 같은 보안을 유지하면서 처리량은 늘리고 수수료는 안정시킬 수
        있을까? 비트코인의 답은{" "}
        <span className="text-text">Layer 2 (L2)</span> 다.
      </p>
    </section>
  );
}

function TwoApproaches() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        처리량을 늘리는 방법은 크게 두 가지다. 첫째, 기반 체인 자체를 키워 더
        많은 거래를 직접 담는다. 둘째, 기반 체인은 보수적으로 두고 반복 결제는
        위층으로 옮긴다. 비트코인의 확장 논쟁은 대부분 이 두 선택의
        트레이드오프에서 출발한다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-muted">
            L1 확장
          </div>
          <h3 className="text-[16px] font-medium text-text">
            블록을 키우거나 자주 만들기
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            블록 크기 ↑ 또는 블록 간격 ↓ 로 처리량을 직접 늘린다. 노드 운영
            비용도 함께 늘어난다.
          </p>
          <div className="text-[13px] text-text/55 pt-2 leading-relaxed">
            예 · 2017 년 분기로 등장한 Bitcoin Cash (32 MB 블록), Bitcoin SV.
          </div>
        </div>
        <div className="border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent">
            L2 · Layer 2
          </div>
          <h3 className="text-[16px] font-medium text-text">
            체인 위에 올린 두 번째 층
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            대부분의 거래를 오프체인으로 옮긴다. 메인 체인은 ‘진입·이탈’ 만
            기록한다. 메인 체인의 보수성과 빠른 결제를 함께 얻는다.
          </p>
          <div className="text-[13px] text-text/55 pt-2 leading-relaxed">
            예 · Lightning Network (가장 활성), Liquid (sidechain), statechain.
          </div>
        </div>
      </div>
      <div className="border border-edge bg-surface/30 overflow-x-auto">
        <div className="grid grid-cols-1 sm:min-w-[680px] sm:grid-cols-[120px_1fr_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>선택</div>
          <div>장점</div>
          <div>단점</div>
        </div>
        <div className="divide-y divide-edge text-[13px]">
          <TradeoffRow
            name="L1 확장"
            good="사용자 입장에선 단순하다. 모든 거래가 같은 체인에 직접 기록되고 별도 채널·라우팅을 배울 필요가 적다."
            bad="블록·대역폭·저장 비용이 커져 풀 노드 운영자가 줄 수 있다. 검증 접근성이 낮아지면 탈중앙성이 약해진다."
          />
          <TradeoffRow
            name="L2 확장"
            good="기반 체인은 작고 검증 가능하게 유지하면서 반복 결제를 빠르고 싸게 처리할 수 있다."
            bad="채널 유동성, 라우팅 실패, 온라인 상태, 지갑 UX 같은 새 복잡성이 생긴다."
          />
        </div>
      </div>
    </section>
  );
}

function BitcoinScalingChoice() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        비트코인의 주류 선택은{" "}
        <span className="text-text">‘L1 은 보수적으로, 확장은 L2 로’</span> 다.
        이유는 단순하다. 비트코인 L1 은 결제 앱이라기보다 전 세계가 검증할 수
        있는 최종 정산층에 가깝다. 이 층이 너무 무거워지면 “누구나 자기 노드로
        검증한다”는 보안 가정이 약해진다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ChoicePoint
          title="L1"
          body="작고 보수적으로 유지한다. 모든 사람이 직접 검증할 수 있는 기반층이라는 성격을 지킨다."
        />
        <ChoicePoint
          title="Lightning"
          body="자주 일어나는 소액 결제는 채널 위에서 처리한다. 온체인은 채널 열기·닫기와 분쟁 해결에 쓴다."
        />
        <ChoicePoint
          title="트레이드오프"
          body="결제 UX 는 좋아지지만 채널 유동성, 라우팅, 지갑 운영 방식이라는 새 학습 비용이 생긴다."
        />
      </div>
      <p className="text-[15px] text-text/75 leading-[1.7]">
        그래서 다음 흐름은 자연스럽게 이어진다. 먼저 채널 하나가 어떻게 온체인
        안전장치 위에서 여러 번 결제할 수 있는지 보고, 그 다음 여러 채널이
        연결된 Lightning Network 와 HTLC 를 본다.
      </p>
    </section>
  );
}

function PaymentChannel() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        L2 로 옮긴다는 말은 “거래를 장부 밖에서 임의로 처리한다”는 뜻이
        아니다. 먼저 온체인에 안전장치를 세워 두고, 그 안에서 여러 번 정산표를
        갱신한다. Lightning 의 기본 단위는{" "}
        <span className="text-text">payment channel</span> 이다. 두 사람이
        ‘앞으로 자주 주고받을 것’ 을 알고 있을 때, 매번 온체인에 쓰는 대신
        딱 두 번만 쓴다 · <span className="text-text">채널 열기</span> 와{" "}
        <span className="text-text">채널 닫기</span>.
      </p>
      <ChannelDiagram />
      <ol className="space-y-2 text-[14px] text-text/85 leading-[1.7] list-none">
        <li>
          <span className="text-muted font-mono text-xs mr-2">①</span> Alice 와
          Bob 이 <span className="text-text">2-of-2 multisig</span> 주소에 자금을
          예치한다 (온체인 tx 1).
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">②</span> 채널
          안에서는 <span className="text-text">commitment tx</span> 만 서로
          서명해 교환한다. 온체인엔 안 올린다. 이론상 횟수 제한 없이 갱신할 수 있다.
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">③</span> 채널을
          닫을 때 마지막 상태를 온체인에 올려 자금을 회수 (온체인 tx 2).
        </li>
      </ol>
      <Callout>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          한 채널 = 온체인 2 건 + 그 사이 무제한 오프체인 거래. 결제 자체는
          서명 교환만 하면 끝나고, 밀리초 단위로 확정된다. 채널 안 수수료는{" "}
          <span className="text-text">사실상 0 이다</span>.
        </p>
      </Callout>
      <div className="border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>개념</div>
          <div>실제로 의미하는 것</div>
        </div>
        <div className="divide-y divide-edge">
          <Row
            label="채널 잔액"
            body="채널 안의 돈은 한쪽이 전부 갖는 게 아니라 Alice 쪽 잔액과 Bob 쪽 잔액으로 나뉜다. 결제는 이 비율을 바꾸는 일이다."
          />
          <Row
            label="commitment tx"
            body="매 갱신마다 ‘지금 닫으면 이렇게 나눈다’ 는 최신 정산표를 서로 서명해 둔다. 평소에는 체인에 올리지 않는다."
          />
          <Row
            label="강제 종료"
            body="상대가 사라져도 마지막 정직한 상태를 온체인에 올려 채널을 닫을 수 있다. 그래서 완전히 신뢰 기반은 아니다."
          />
        </div>
      </div>
      <p className="text-[14px] text-text/65 leading-[1.7]">
        상대가 ‘옛 상태’ 를 몰래 온체인에 올리지 못하게 막는 장치가 있다 ·{" "}
        <span className="text-text">penalty mechanism</span>. 부정한 옛 상태를
        게시한 쪽은 채널의 자금 전체를 잃는다. 그래서 양측 모두 마지막 정직한
        상태로만 채널을 닫는다.
      </p>
    </section>
  );
}

function LightningNetwork() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        Payment channel 만으로는 Alice 와 Bob 처럼 직접 채널을 연 두 사람의
        문제만 풀린다. 그런데 Alice 가 모든 상대와 직접 채널을 열 수는 없다.
        100 명과 거래하면 채널 100 개에 자금이 나뉘어 묶인다.{" "}
        <span className="text-text">Lightning Network</span> 는 채널들을
        그래프로 연결해, 직접 채널이 없는 상대에게도 보낼 수 있게 한다.
      </p>
      <NetworkDiagram />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-edge bg-surface/30 p-5 space-y-2">
          <div className="text-[14px] font-semibold text-accent">
            실제로 쓰이는 곳
          </div>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            카페·콘텐츠·게임·거래소 출금처럼 작은 금액을 빠르게 보내는 용도에
            맞다. 온체인은 몇 분에서 몇십 분을 기다리지만, Lightning 결제는
            보통 지갑에서 QR invoice 를 스캔하고 거의 즉시 성공/실패가 나온다.
          </p>
        </div>
        <div className="border border-edge bg-surface/30 p-5 space-y-2">
          <div className="text-[14px] font-semibold text-accent">
            온체인과 다른 점
          </div>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            블록에 매번 기록되는 송금이 아니라, 이미 열린 채널들의 잔액 상태를
            바꾸는 결제다. 그래서 빠르고 싸지만, 채널 유동성·라우팅 경로·온라인
            상태 같은 새 제약이 생긴다.
          </p>
        </div>
      </div>
      <p className="text-[14px] text-text/75 leading-[1.7]">
        Alice → Carol → David → Bob 의 다단계 라우팅. 각 노드는 자기가 받은
        만큼을 자기 다음 채널로 다음 노드에게 보낸다. 마지막에 자금이 Bob 에게
        도착하면 경로 위의 모든 채널 상태가 한 번에 갱신된다.
      </p>
      <div className="border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>구성 요소</div>
          <div>왜 중요한가</div>
        </div>
        <div className="divide-y divide-edge">
          <Row
            label="invoice"
            body="받는 사람이 금액, 목적지, 만료 시간, 결제 해시를 담아 만든 청구서다. 보내는 지갑은 이 정보를 보고 경로를 찾는다."
          />
          <Row
            label="liquidity"
            body="채널에 돈이 있어도 방향이 맞아야 한다. Alice 쪽에서 Bob 쪽으로 보낼 수 있는 여유가 있어야 결제가 성공한다."
          />
          <Row
            label="routing fee"
            body="중간 노드는 자기 채널 유동성을 빌려주는 대가로 아주 작은 수수료를 받는다. 경로가 길거나 유동성이 부족하면 실패할 수 있다."
          />
          <Row
            label="지갑 방식"
            body="직접 채널을 관리하는 non-custodial 지갑과, 사용 편의성을 위해 사업자에게 맡기는 custodial 지갑이 있다. 편할수록 신뢰가 늘어난다."
          />
        </div>
      </div>
      <Callout tone="warn" title="Lightning 은 비트코인을 대체하는 체인이 아니다">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          Lightning 은 별도 코인이나 sidechain 이 아니라 비트코인 위에 얹은
          결제 네트워크다. 최종 안전장치는 여전히 온체인 채널 열기·닫기와
          비트코인 스크립트다. 그래서 대규모 저축은 온체인 보관, 자주 쓰는
          소액은 Lightning 지갑이라는 식으로 역할을 나누는 경우가 많다.
        </p>
      </Callout>
      <p className="text-[14px] text-text/65 leading-[1.7]">
        그런데 중간 노드가 자기 채널은 갱신했는데 다음 노드가 안 갚으면 어떻게
        될까? 도중에 라우팅이 깨지면? 이걸 안전하게 묶어 주는 장치가 HTLC 다.
      </p>
    </section>
  );
}

function HTLCSection() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        여러 채널을 거쳐 결제하려면 새 문제가 생긴다. 중간 노드는 자기 다음
        채널로 돈을 내보냈는데, 앞 단계에서 돈을 받지 못하면 손해를 본다.{" "}
        <span className="text-text">HTLC (Hashed Time-Locked Contract)</span>{" "}
        는 이 위험을 막는 비트코인 스크립트다. 자금이 경로 위로 ‘잠금’ 되었다가
        비밀 공개와 함께 ‘역전파’ 되어 정산되는 흐름을 애니메이션으로 본다.
      </p>
      <HTLCDiagram />
      <p className="text-[15px] text-text/85 leading-[1.7]">
        잠금 조건은 두 개를 같이 건다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-edge bg-surface/30 p-5 space-y-2">
          <div className="text-[14px] font-semibold text-accent2 leading-snug">
            해시 잠금
          </div>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            Bob 이 처음에 비밀값 s 를 만들고, 그 해시 H(s) 를 invoice 에 넣어
            보낸다. 각 HTLC 는 “H(s) 에 맞는 원래 값 s 를 보여주면 자금을
            가져갈 수 있다”는 조건으로 잠긴다. 결제가 성공하면 s 가 Bob →
            David → Carol → Alice 방향으로 역전파되고, 각 노드는 그 값을 알게
            되는 순간 자기 앞 단계의 자금을 회수한다.
          </p>
        </div>
        <div className="border border-edge bg-surface/30 p-5 space-y-2">
          <div className="text-[14px] font-semibold text-accent2 leading-snug">
            시간 잠금
          </div>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            정해진 시간 안에 s 가 나타나지 않으면 자금은 보내는 쪽으로 환불된다.
            timeout 은 뒤 hop 일수록 짧다 (Alice 쪽 3 시간 → Bob 쪽 1 시간).
            그래서 라우팅이 중간에 깨져도 자금이 영구히 묶이지 않는다.
          </p>
        </div>
      </div>
      <p className="text-[14px] text-text/65 leading-[1.7]">
        결과적으로 모든 중간 노드는 ‘앞에서 받은 금액 ≥ 뒤로 내준 금액 +
        수수료’ 가 수학적으로 보장된다. 누구도 자기 자금을 잃지 않는다.
      </p>
    </section>
  );
}

function HTLCDiagram() {
  // 6 steps
  // 0: invoice 전달 (Bob → Alice 로 H(s))
  // 1: A→C HTLC 잠금
  // 2: C→D HTLC 잠금
  // 3: D→B HTLC 잠금 (모든 hop 잠긴 상태)
  // 4: Bob 이 s 공개 · D→B 정산
  // 5: s 역전파 · C→D, A→C 정산 완료
  const TOTAL = 6;
  const STEP_MS = 2600;
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (paused) return;
    if (step >= TOTAL - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, paused]);

  const W = 620;
  const H = 250;
  const NODES = [
    { x: 70, name: "Alice" },
    { x: 230, name: "Carol" },
    { x: 390, name: "David" },
    { x: 550, name: "Bob" },
  ];
  const nodeY = 110;

  type HopState = "idle" | "locked" | "settled";
  function hopState(i: number): HopState {
    // hop indexes: 0 = A-C, 1 = C-D, 2 = D-B
    if (step <= 0) return "idle";
    if (step === 1) return i === 0 ? "locked" : "idle";
    if (step === 2) return i <= 1 ? "locked" : "idle";
    if (step === 3) return "locked";
    if (step === 4) return i === 2 ? "settled" : "locked";
    return "settled";
  }

  const stepDesc = [
    "Bob 이 비밀 s 와 그 해시 H(s) 를 만든다. invoice 로 H(s) 를 Alice 에게 전달. 이 시점에서 s 는 Bob 만 안다.",
    "Alice → Carol · 1 BTC + 수수료를 HTLC 에 잠근다. 조건: H(s) 의 preimage 를 보이면 가져갈 수 있다. 3 시간 뒤 timeout 시 Alice 에게 환불된다.",
    "Carol → David · 같은 H(s) 로 다음 hop HTLC 를 잠근다 (timeout 2 시간). Carol 은 자기 자금을 묶었지만, ‘s 가 나타나면 앞 hop 에서 회수 가능’ 이라는 보장이 있다.",
    "David → Bob · 마지막 hop HTLC (timeout 1 시간). 이제 경로 위 모든 자금이 H(s) 로 묶인 상태.",
    "Bob 이 s 를 공개하며 David 의 HTLC 를 청구. David 는 그 순간 s 를 알게 된다.",
    "David 가 s 로 Carol 의 HTLC 를 청구 → Carol 이 s 로 Alice 의 HTLC 청구. 모든 hop 이 정산되며 자금이 실제로 경로 전체를 통과했다.",
  ];

  return (
    <div className="border border-edge bg-surface/30 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[13px] font-semibold text-text/82 leading-snug">
          HTLC · 잠금 전파 + 비밀 역전파 (시뮬레이션)
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 transition-colors ${
                  i < step
                    ? "bg-muted/60"
                    : i === step
                      ? "bg-accent"
                      : "bg-edge"
                }`}
              />
            ))}
          </div>
          <span className="text-muted ml-1.5">
            {step + 1} / {TOTAL}
          </span>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="text-muted hover:text-text border border-edge hover:border-accent/60 px-2 py-1 uppercase tracking-[0.16em] transition-colors"
            disabled={step >= TOTAL - 1}
          >
            {paused ? "▶ play" : "⏸ pause"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setPaused(true);
            }}
            className="text-muted hover:text-text border border-edge hover:border-accent/60 px-2 py-1 uppercase tracking-[0.16em] transition-colors"
          >
            ↻ replay
          </button>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="htlcArrLock"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#f7931a" />
          </marker>
          <marker
            id="htlcArrSettle"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5b8def" />
          </marker>
          <marker
            id="htlcArrFade"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5b8def" />
          </marker>
        </defs>

        {/* base channel lines (always faint) */}
        {NODES.slice(0, -1).map((n, i) => (
          <line
            key={`base${i}`}
            x1={n.x + 14}
            y1={nodeY}
            x2={NODES[i + 1].x - 14}
            y2={nodeY}
            stroke="#2a2f3a"
            strokeWidth="1"
          />
        ))}

        {/* invoice line · step 0 only · Bob → Alice 위쪽 */}
        <FadeG visible={step === 0}>
          <line
            x1={NODES[3].x - 8}
            y1={45}
            x2={NODES[0].x + 8}
            y2={45}
            stroke="#5b8def"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            markerEnd="url(#htlcArrFade)"
            opacity={0.85}
          />
          <text
            x={(NODES[0].x + NODES[3].x) / 2}
            y={35}
            textAnchor="middle"
            fontSize="11"
            fill="#5b8def"
            fontFamily="JetBrains Mono"
          >
            invoice · H(s)
          </text>
        </FadeG>

        {/* hops · forward locks (top) and backward settles (bottom) */}
        {NODES.slice(0, -1).map((n, i) => {
          const next = NODES[i + 1];
          const mid = (n.x + next.x) / 2;
          const state = hopState(i);
          const locked = state === "locked" || state === "settled";
          const settled = state === "settled";
          return (
            <g key={`hop${i}`}>
              {/* lock arrow forward · 잠긴 동안 보이고, settled 시 dim */}
              <FadeG visible={locked}>
                <line
                  x1={n.x + 14}
                  y1={nodeY - 16}
                  x2={next.x - 14}
                  y2={nodeY - 16}
                  stroke="#f7931a"
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                  markerEnd="url(#htlcArrLock)"
                  opacity={settled ? 0.25 : 1}
                  style={{ transition: "opacity 400ms ease-out" }}
                />
                <rect
                  x={mid - 42}
                  y={nodeY - 52}
                  width={84}
                  height={22}
                  fill="#0d0f14"
                  stroke="#f7931a"
                  strokeWidth="1"
                  opacity={settled ? 0.25 : 1}
                  style={{ transition: "opacity 400ms ease-out" }}
                />
                <text
                  x={mid}
                  y={nodeY - 37}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill="#f7931a"
                  fontFamily="Inter, ui-sans-serif, sans-serif"
                  fontWeight="600"
                  opacity={settled ? 0.4 : 1}
                  style={{ transition: "opacity 400ms ease-out" }}
                >
                  H(s) 잠금
                </text>
              </FadeG>
              {/* settle arrow backward */}
              <FadeG visible={settled}>
                <line
                  x1={next.x - 14}
                  y1={nodeY + 16}
                  x2={n.x + 14}
                  y2={nodeY + 16}
                  stroke="#5b8def"
                  strokeWidth="1.6"
                  markerEnd="url(#htlcArrSettle)"
                />
                <rect
                  x={mid - 48}
                  y={nodeY + 28}
                  width={96}
                  height={22}
                  fill="#0d0f14"
                  stroke="#5b8def"
                  strokeWidth="1"
                />
                <text
                  x={mid}
                  y={nodeY + 43}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill="#5b8def"
                  fontFamily="Inter, ui-sans-serif, sans-serif"
                  fontWeight="600"
                >
                  s 공개 · 정산
                </text>
              </FadeG>
            </g>
          );
        })}

        {/* nodes · 마지막에 그려서 위에 */}
        {NODES.map((n, i) => {
          // Bob 은 시작부터 s 보유자라 강조, 나머지는 settled 후 s 보유
          const knowsSecret =
            i === 3 ||
            (i === 2 && step >= 4) ||
            (i === 1 && step >= 5) ||
            (i === 0 && step >= 5);
          const stroke = knowsSecret ? "#f7931a" : "#5b8def";
          return (
            <g key={n.name}>
              <circle
                cx={n.x}
                cy={nodeY}
                r={12}
                fill="#0d0f14"
                stroke={stroke}
                strokeWidth="1.6"
                style={{ transition: "stroke 400ms ease-out" }}
              />
              <text
                x={n.x}
                y={nodeY + 5}
                textAnchor="middle"
                fontSize="10"
                fill={stroke}
                fontFamily="JetBrains Mono"
                fontWeight="500"
                style={{ transition: "fill 400ms ease-out" }}
              >
                {knowsSecret ? "s" : ""}
              </text>
              <text
                x={n.x}
                y={nodeY + 86}
                textAnchor="middle"
                fontSize="11"
                fill="#a0a8b8"
                fontFamily="JetBrains Mono"
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="text-[14px] text-text/85 leading-[1.75] min-h-[60px] border-t border-edge/60 pt-3">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent mr-2">
          step {step + 1}
        </span>
        {stepDesc[step]}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-muted/90 pt-2 border-t border-edge/40">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-accent" />
          <span>잠금 (forward, H(s) 조건)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-accent2" />
          <span>정산 (backward, s 공개)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full border border-accent" />
          <span>s 를 아는 노드</span>
        </div>
      </div>
    </div>
  );
}

function FadeG({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-out",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {children}
    </g>
  );
}

function OtherEcosystems() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        비트코인은 보수적인 L1 위에 Lightning 을 얹는 길을 택했다. 하지만
        “일상 결제처럼 빠르고 저렴한 경험”이라는 목표는 다른 생태계도 똑같이
        추구한다. 비교를 위해 대표적인 세 답을 함께 보자.
      </p>

      <div className="space-y-4">
        <div className="border border-edge bg-surface/30 p-5 space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[16px] font-medium text-text">
              ① 새로운 빠른 L1
            </h3>
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              parallel exec + fast BFT
            </span>
          </div>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            처음부터 ‘빠른 합의 + 병렬 실행’ 을 목표로 설계된 체인들. 비트코인의
            보수성을 포기하는 대신 처리량을 끌어올린다.
          </p>
          <div className="border border-edge bg-bg/40 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
              <div>체인</div>
              <div>기술 핵심 + 실측 / 이론치</div>
            </div>
            <div className="divide-y divide-edge text-[13px]">
              <ChainRow
                name="Solana"
                tech="PoH (Proof of History) + Tower BFT, 단일 leader 가 순서 매기고 검증자가 검증. 실측 약 3,000 ~ 4,000 TPS, 블록 약 400 ms."
              />
              <ChainRow
                name="Aptos / Sui"
                tech="Move 언어 + Block-STM 병렬 실행. 충돌 없는 tx 들은 동시 처리. 이론치 수만 TPS 주장 (실측은 더 낮음)."
              />
              <ChainRow
                name="Avalanche"
                tech="여러 subnet 으로 분할 + Snowman 합의. subnet 별 독립 TPS, 메인넷 ~ 1,000 TPS."
              />
            </div>
          </div>
          <p className="text-[13px] text-muted/85 leading-[1.7]">
            트레이드오프는 분명하다. 검증 비용이 커지면 노드 운영 비용도 커지고,
            자기 노드로 직접 검증하기 위한 진입 장벽도 높아진다. S6 의 ‘분산성
            vs 처리량’ 논쟁이 다시 나타나는 지점이다.
          </p>
        </div>

        <div className="border border-edge bg-surface/30 p-5 space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[16px] font-medium text-text">
              ② Rollup (이더리움 L2)
            </h3>
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              batch + prove on L1
            </span>
          </div>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            대부분의 실행은 오프체인에서, 한 묶음의 결과만 L1 에 기록. L1 의
            보안을 빌리면서 수천 건의 tx 비용을 1 건에 압축한다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-edge bg-bg/40 p-4 space-y-2">
              <div className="font-mono text-[11px] tracking-[0.14em] text-accent2/85 uppercase">
                Optimistic Rollup
              </div>
              <p className="text-[13px] text-text/80 leading-[1.7]">
                결과를 일단 믿고 올린다. 7 일 ‘fraud proof’ 기간 동안 누구든
                도전할 수 있다. Optimism · Arbitrum · Base.
              </p>
            </div>
            <div className="border border-edge bg-bg/40 p-4 space-y-2">
              <div className="font-mono text-[11px] tracking-[0.14em] text-accent2/85 uppercase">
                ZK Rollup
              </div>
              <p className="text-[13px] text-text/80 leading-[1.7]">
                결과의 ‘유효성 증명’ (zk-SNARK / STARK) 을 같이 올린다.
                finality 가 즉시 확정되고 도전 기간이 없다. zkSync · Polygon
                zkEVM · Starknet · Scroll.
              </p>
            </div>
          </div>
          <p className="text-[13px] text-muted/85 leading-[1.7]">
            결과적으로 한 건의 수수료는 L1 의 약 1/10 ~ 1/100 수준으로 낮아지고,
            블록 시간은 초 단위가 된다. 카드 결제에 가까운 UX 를 현실적으로 만들기
            시작한 접근이다.
          </p>
        </div>

        <div className="border border-edge bg-surface/30 p-5 space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[16px] font-medium text-text">
              ③ Sharding
            </h3>
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              split state / data
            </span>
          </div>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            네트워크 전체가 모든 일을 똑같이 처리하는 대신, 상태나 데이터를 여러
            조각 (shard) 으로 나눈다. 각 검증자는 일부 조각만 처리하고, 전체
            시스템은 병렬로 더 많은 일을 처리한다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-edge bg-bg/40 p-4 space-y-2">
              <div className="text-[13px] font-semibold text-accent2">
                실행 샤딩
              </div>
              <p className="text-[13px] text-text/80 leading-[1.7]">
                계정·컨트랙트 실행 자체를 여러 shard 로 나눈다. 처리량은 커지지만
                shard 사이 메시지와 보안 설계가 복잡해진다.
              </p>
            </div>
            <div className="border border-edge bg-bg/40 p-4 space-y-2">
              <div className="text-[13px] font-semibold text-accent2">
                데이터 샤딩
              </div>
              <p className="text-[13px] text-text/80 leading-[1.7]">
                실행은 rollup 이 맡고, L1 은 rollup 데이터가 공개되어 있는지만
                보장한다. 이더리움의 danksharding 로드맵은 이 방향에 가깝다.
              </p>
            </div>
          </div>
          <p className="text-[13px] text-muted/85 leading-[1.7]">
            병렬성은 커지지만 “모든 노드가 모든 것을 직접 검증한다”는 단순성은
            줄어든다. 데이터 가용성, shard 간 통신, validator 샘플링 같은 새
            문제가 생긴다.
          </p>
        </div>
      </div>

      <div className="border border-edge bg-surface/30 overflow-x-auto">
        <div className="grid grid-cols-1 sm:min-w-[680px] sm:grid-cols-[120px_1fr_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>방식</div>
          <div>좋은 점</div>
          <div>감수하는 점</div>
        </div>
        <div className="divide-y divide-edge text-[13px]">
          <TradeoffRow
            name="빠른 L1"
            good="사용자 경험이 단순하고 빠르다. 앱 개발자는 하나의 빠른 체인 위에서 바로 만든다."
            bad="검증 비용과 하드웨어 요구가 커질 수 있다. 네트워크 장애나 중앙화 리스크가 커질 수 있다."
          />
          <TradeoffRow
            name="Rollup"
            good="L1 보안을 일부 빌리면서 실행 비용을 크게 낮춘다. 앱 생태계를 L2 로 확장하기 좋다."
            bad="브릿지, sequencer, 출금 지연, 증명 시스템 같은 추가 신뢰·운영 문제가 생긴다."
          />
          <TradeoffRow
            name="Sharding"
            good="일을 병렬화해 전체 처리량과 데이터 수용량을 키울 수 있다."
            bad="설계가 매우 복잡해지고, shard 간 통신과 데이터 가용성 보장이 어려워진다."
          />
        </div>
      </div>

      <Callout>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          비트코인은 ‘L1 은 보수, 확장은 채널 기반 L2 (Lightning)’ 의 길을, 다른
          생태계는 ‘빠른 L1’, ‘rollup’, ‘sharding’ 같은 길을 택했다. 같은 문제에
          대한 서로 다른 답이고, 각각 다른 트레이드오프를 짊어진다.
        </p>
      </Callout>
    </section>
  );
}

function PaymentRailsReflection() {
  return (
    <Reflection title="저렴하고 빠른 암호화폐가 등장했다. 카드 결제를 대체할 수 있을까?">
      <p>
        Solana, Base, zkSync 같은 체인 위에서는 한 건 송금이 1 초 안에 확정되고
        비용은 센트 단위다. Solana 위의 USDC 송금, Base 위의 결제 dApp 은 이미
        카드 결제와 비슷한 UX 를 제공한다. 그러면 Visa, Mastercard, ACH, 은행
        wire 같은 ‘기존 결제 망’ 은 이제 필요 없는 인프라가 되는 걸까?
      </p>
      <p>
        현실은 더 복잡하다. 기존 결제 망이 여전히 존재하는 이유는 단순히
        ‘구식이라서’ 가 아니다.
      </p>
      <ul className="space-y-1.5 mt-1">
        <li>
          <span className="text-text">Chargeback · 분쟁 해결</span> · 카드사는
          사기·미배송 시 사용자 보호로 결제를 되돌릴 수 있다. 비트코인·체인
          위에선 이런 안전망이 프로토콜에 없다. 사용자가 직접 책임.
        </li>
        <li>
          <span className="text-text">규제·KYC·AML</span> · 카드망은
          금융기관으로서 정부 감독 안에 있다. 이것은 비용이면서 동시에 사용자
          보호 장치이기도 하다. ‘은행 계좌 동결’ 같은 일이 가능한 이유도 여기에
          있다.
        </li>
        <li>
          <span className="text-text">법정통화 안정성</span> · 결제는 가치 저장이
          아니다. 1 만 원짜리를 ‘오늘의 BTC 가격’ 으로 받는 가게는 거의 없다.
          stablecoin 이 그 간극을 메우고 있지만, 그것도 발행자 (Circle, Tether)
          에 대한 신뢰가 전제되어야 한다.
        </li>
        <li>
          <span className="text-text">호환성 · 점진 이행</span> · 전 세계 결제
          인프라가 하루아침에 새 레일로 옮겨가지 않는다. Visa 본인이 USDC 결제
          파일럿을 하고 있다는 점 자체가 ‘대체’ 가 아니라 ‘공존·통합’ 이 현실적
          시나리오임을 보여준다.
        </li>
      </ul>
      <Probe>
        ‘기술적으로 더 빠르고 싸다’ 가 ‘대체된다’ 와 같지 않다. 결제 망은
        기술뿐 아니라 법·신뢰·소비자 보호의 묶음. 빠른 체인이 카드망의 어느
        부분을 진짜로 대체할 수 있고, 어느 부분은 오히려 카드망이 답을 더 잘
        하고 있을까? 그리고 ‘체인 위 결제 + 카드망의 보호’ 가 결합된 미래는
        어떤 모양일까?
      </Probe>
      <Reading label="관련 사례">
        Visa B2B Connect, Circle Cross-Chain Transfer Protocol, PayPal PYUSD,
        Stripe 의 USDC 결제 베타. ‘카드사와 stablecoin 의 hybrid’ 를 향한 실제
        움직임을 보여주는 사례다.
      </Reading>
      <Reading label="보충 맥락">
        Lightning 과 rollup 의 공통 약점은 자기 보관과 일상 결제 UX 를 동시에
        만족시키기 어렵다는 점이다. Custodial Lightning 지갑
        (Wallet of Satoshi, Phoenix, ZBD) 의 폭발적 성장이 그 증거다. 사용성과
        자기 보관 사이의 트레이드오프가 드러난다.
      </Reading>
    </Reflection>
  );
}

function ChainRow({ name, tech }: { name: string; tech: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className="font-mono text-[13px] text-accent/85">{name}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{tech}</div>
    </div>
  );
}

function TradeoffRow({
  name,
  good,
  bad,
}: {
  name: string;
  good: string;
  bad: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:min-w-[680px] sm:grid-cols-[120px_1fr_1fr] gap-3 px-4 py-3 items-start">
      <div className="font-mono text-[13px] text-accent/85">{name}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{good}</div>
      <div className="text-[13px] text-text/65 leading-relaxed">{bad}</div>
    </div>
  );
}

function ChoicePoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-edge bg-surface/30 p-4 space-y-2">
      <div className="text-[13px] font-semibold text-accent2">{title}</div>
      <p className="text-[13px] text-text/78 leading-[1.7]">{body}</p>
    </div>
  );
}

function Row({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className="font-mono text-[13px] text-accent/80">{label}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{body}</div>
    </div>
  );
}

function ChannelDiagram() {
  return (
    <div className="border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 460 130"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx={70} cy={65} r="10" fill="none" stroke="#5b8def" strokeWidth="1.5" />
        <text x={70} y={92} textAnchor="middle" fontSize="11" fill="#aaa" fontFamily="JetBrains Mono">Alice</text>
        <circle cx={390} cy={65} r="10" fill="none" stroke="#5b8def" strokeWidth="1.5" />
        <text x={390} y={92} textAnchor="middle" fontSize="11" fill="#aaa" fontFamily="JetBrains Mono">Bob</text>
        <line x1={84} y1={65} x2={376} y2={65} stroke="#f7931a" strokeWidth="1.6" strokeDasharray="2 4" />
        <text x={230} y={45} textAnchor="middle" fontSize="11" fill="#f7931a" fontFamily="JetBrains Mono">
          2-of-2 channel
        </text>
        <text x={230} y={86} textAnchor="middle" fontSize="10.5" fill="#7a8190" fontFamily="JetBrains Mono">
          오프체인 갱신 (서명만 교환)
        </text>
      </svg>
    </div>
  );
}

function NetworkDiagram() {
  return (
    <div className="border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 460 180"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <Edge x1={66} y1={86} x2={154} y2={54} />
        <Edge x1={66} y1={94} x2={154} y2={126} />
        <Edge x1={186} y1={50} x2={274} y2={50} />
        <Edge x1={186} y1={130} x2={274} y2={130} />
        <Edge x1={170} y1={66} x2={170} y2={114} />
        <Edge x1={306} y1={54} x2={394} y2={86} />
        <Edge x1={306} y1={126} x2={394} y2={94} />
        <path
          d="M 66 86 L 154 50 L 274 50 L 394 86"
          stroke="#f7931a"
          strokeWidth="1.8"
          fill="none"
        />
        <Node x={50} y={90} label="Alice" />
        <Node x={170} y={50} label="Carol" />
        <Node x={170} y={130} label="Eve" />
        <Node x={290} y={50} label="David" />
        <Node x={290} y={130} label="Frank" />
        <Node x={410} y={90} label="Bob" accent />
      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        Alice → Carol → David → Bob. 오렌지가 활성 라우트. 직접 채널 없이도
        다단계 경로로 자금이 흐른다.
      </div>
    </div>
  );
}

function Node({
  x,
  y,
  label,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={9}
        fill="#0d0e10"
        stroke={accent ? "#f7931a" : "#5b8def"}
        strokeWidth="1.4"
      />
      <text
        x={x}
        y={y + 22}
        textAnchor="middle"
        fontSize="11"
        fill="#aaa"
        fontFamily="JetBrains Mono"
      >
        {label}
      </text>
    </g>
  );
}

function Edge({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#2a2f3a"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
  );
}
