"use client";

import { LayerShell } from "../LayerShell";
import { Reflection, Probe, Reading, Callout } from "../Reflection";
import { Stepper } from "../Stepper";
import type { LayerProps } from "../LayerStack";

export function L9BNodeOperation(props: LayerProps) {
  return (
    <LayerShell
      id="S11"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "정적 구조에서 동적 흐름으로",
                subtitle: "노드는 언제 무엇을 검증하는가",
                body: <Bridge />,
              },
              {
                title: "노드의 두 모드",
                subtitle: "처음 켜질 때와 이후 매 블록마다",
                body: <NodeTwoModes />,
              },
              {
                title: "Alice의 1 BTC가 지나온 길",
                subtitle: "지갑부터 노드 검증까지 한 번에 묶기",
                body: <CrossLayerRecap />,
              },
              {
                title: "생각해보기", subtitle: "내 노드를 직접 돌리는가, 누구의 노드를 신뢰하는가",
                body: (
                  <Reflection title="‘Don’t trust, verify’ 의 운영적 의미">
                    <p>
                      비트코인의 슬로건 ‘Don’t trust, verify’ 는 멋있지만 실천은
                      어렵다. 진짜로 자기 비트코인을 검증하려면 풀 노드 (≈ 750
                      GB · 24시간 켜둠 · 안정적 인터넷) 를 직접 돌려야 한다.
                      그렇지 않으면 거래소·블록 익스플로러·SPV 서버의 답을
                      ‘믿을 수밖에’ 없다.
                    </p>
                    <p>
                      자기 노드를 돌리지 않을 때 일어나는 일들. ‘내 잔액’ 이라
                      보는 숫자는 누군가의 서버가 알려준 것. 그 서버가 거짓을
                      말하거나, 검열을 당하거나, 다운되면 내 ‘비트코인 사용
                      경험’ 도 같이 무너진다. 시스템은 분산이지만 내 사용은
                      그렇지 않을 수 있다는 역설.
                    </p>
                    <Probe>
                      비트코인의 ‘분산성’ 은 채굴자 분포가 아니라{" "}
                      <span className="text-text">검증자 분포</span> 가
                      결정한다. 그런데 풀 노드 운영의 진입 장벽이 점점 높아지면
                      (디스크 가격 하락 속도 vs UTXO 셋 성장, 대역폭 요구 ↑) 이
                      ‘일반 사용자도 자기 노드를 돌릴 수 있다’ 가 무너질 수
                      있다. ‘노드 운영의 접근성’ 이 비트코인의 미래에 어떤
                      의미인가?
                    </Probe>
                    <Reading label="실습 키워드">
                      Pruned node (~ 5 GB 만으로 자가 검증 가능), Umbrel ·
                      Start9 같은 ‘플러그앤플레이 노드’ 프로젝트, 라즈베리파이
                      + 외장 SSD 조합. ‘비트코인을 자기 손으로 검증’ 의 진입
                      장벽을 낮추려는 흐름.
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

function Bridge() {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <p className="text-[17px] text-text/80 leading-[1.75]">
          S10 에서 노드의 <span className="text-text">정적 구조</span> 를 봤다.
          어떤 모듈이 있고, 추상 ‘블록체인’ 이 디스크 위 어떤 모양으로 나뉘는지. 이번 단계에선 그 구조 위에서 노드가{" "}
          <span className="text-text">살아 움직이는 모습</span> 을 본다. 노드가
          하는 일은 두 가지로 압축된다. 그 위에 마지막으로 Alice 의 1 BTC 가
          코스 전체를 어떻게 통과했는지의 capstone 을 함께 본다.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>동작</div>
          <div>언제 / 무엇 / 얼마나 자주</div>
        </div>
        <div className="divide-y divide-edge text-[14px]">
          <Op
            name="처음 검증"
            sub="initial sync"
            when="노드를 처음 켰을 때"
            what="0 번 블록부터 현재까지 모든 과거를 받아 자기 손으로 검증, 자기 UTXO 셋을 짓는다"
            cadence="한 번"
          />
          <Op
            name="새 블록 검증"
            sub="continuous"
            when="새 블록이 도착할 때마다"
            what="여러 검증을 차례로 적용. 한 단계라도 실패하면 거부, 모두 통과하면 UTXO 셋 갱신 + 이웃에 가십"
            cadence="평균 ~ 10 분에 한 번, 영구히"
            tone="accent"
          />
        </div>
      </div>

      <p className="text-[14px] text-text/65 leading-[1.7]">
        이 두 동작이 ‘노드가 살아있다’ 의 운영적 정의다. IBD 는 한 번 끝나면
        Validation 만 무한 반복되는 일상으로 들어간다.
      </p>
    </section>
  );
}

function Op({
  name,
  sub,
  when,
  what,
  cadence,
  tone,
}: {
  name: string;
  sub: string;
  when: string;
  what: string;
  cadence: string;
  tone?: "accent";
}) {
  const c = tone === "accent" ? "text-accent" : "text-accent2";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 px-4 py-3 items-start">
      <div className="space-y-0.5">
        <div className={`text-[15px] font-medium leading-snug ${c}`}>{name}</div>
        <div className="text-[13px] text-muted">
          {sub}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="text-[13px] text-text/85 leading-[1.65]">
          <span className="text-muted">언제:</span> {when}
        </div>
        <div className="text-[13px] text-text/85 leading-[1.65]">
          <span className="text-muted">무엇:</span> {what}
        </div>
        <div className="text-[13px] text-text/65 leading-[1.65]">
          <span className="text-muted">주기:</span> {cadence}
        </div>
      </div>
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

function NodeTwoModes() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/80 leading-[1.7]">
        켜진 노드가 하는 일은 결국 두 가지로 압축된다. 처음 한 번 ‘과거 전체를
        다시 검증’ 하고, 그 후 ‘새 블록이 올 때마다 검증해서 자기 상태를 갱신’
        한다. 두 모드의 본질은 같다 ·{" "}
        <span className="text-text">자기 손으로 검증한 것만 받아들임</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent2 leading-snug">
            모드 1 · 처음 켜질 때
          </div>
          <h3 className="text-[18px] font-medium text-text leading-snug">
            0 번 블록부터 다시 검증
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            노드를 처음 돌리면 다른 노드로부터 모든 과거 블록을 받아 0 번부터
            지금까지 자기 손으로 검증한다. 이 과정으로 자기만의 UTXO 셋을 짓고,
            그 다음부터는 새 블록만 검증하면 된다. ‘Don’t trust, verify’ 가
            처음 발동되는 순간 · 누군가의 상태를 베끼는 게 아니라 자기가 만든다.
          </p>
        </div>

        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent leading-snug">
            모드 2 · 새 블록이 올 때
          </div>
          <h3 className="text-[18px] font-medium text-text leading-snug">
            ~ 10 분마다 검증 한 사이클
          </h3>
          <p className="text-[14px] text-text/75 leading-[1.7]">
            네트워크가 살아 있는 동안 끊임없이 반복되는 노드의 핵심 동작. 새
            블록이 도착하면 여러 검증을 차례로 적용하고, 한 단계라도 실패하면
            거부. 통과하면 자기 UTXO 셋을 갱신하고 다른 노드들에 가십 시작.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-3">
        <h4 className="text-[16px] font-medium text-accent2 leading-snug">
          새 블록이 올 때 노드가 확인하는 것
        </h4>
        <p className="text-[14px] text-text/75 leading-[1.7]">
          정확한 단계 수와 순서는 구현 디테일이지만, 개념적으로 묶으면 다섯
          가지를 본다. <span className="text-text">하나라도 실패하면 블록
          전체 거부</span>.
        </p>
        <ul className="space-y-1.5 text-[14px] text-text/80 leading-[1.7] pl-4 list-disc marker:text-muted">
          <li>
            <span className="text-text">헤더 유효성</span> · PoW (해시가 target
            미만) + prev_hash 가 알려진 블록 + timestamp 합리성
          </li>
          <li>
            <span className="text-text">블록 형식 + merkle root</span> · 크기
            한도 안에 있고, merkle root 가 안의 tx 들과 실제로 일치
          </li>
          <li>
            <span className="text-text">각 tx 의 input 이 살아있는가</span> ·
            모든 input 이 자기 UTXO 셋에 ‘안 쓴 출력’ 으로 존재
          </li>
          <li>
            <span className="text-text">script + 서명</span> · 잠금이 실제로
            풀림 (scriptSig + scriptPubKey 실행), 서명이 메시지와 pubkey 에 맞음
          </li>
          <li>
            <span className="text-text">coinbase 와 fee 산수</span> · 첫 tx 는
            coinbase, 보상 = subsidy + fees 가 정확
          </li>
        </ul>
        <p className="text-[13px] text-text/65 leading-[1.7]">
          모두 통과하면 UTXO 셋 갱신 (input 제거, output 추가) → 자기 mempool 에서
          포함된 tx 제거 → 이웃 노드들에 ‘새 블록 있어’ 가십으로 이어진다. 이것이
          한 검증 사이클이다.
          전 세계의 모든 풀 노드가 같은 검증을 똑같이 적용하기 때문에 ‘무엇이
          유효한 블록인가’ 의 정의가 전체 네트워크에서 일치한다.
        </p>
      </div>
    </section>
  );
}

function CrossLayerRecap() {
  const stages: { when: string; layer: string; what: string }[] = [
    {
      when: "T+0",
      layer: "S1 / S2",
      what: "Alice 의 지갑이 비밀키로 트랜잭션의 input 들에 서명. 시드 문구에서 파생된 잔돈 주소도 미리 결정.",
    },
    {
      when: "T+0",
      layer: "S3 / S4",
      what: "지갑이 자기 UTXO 셋에서 1.4 BTC 짜리 한 장을 골라 input 으로, output 두 개 (Bob 1.0, Alice 잔돈 0.3999) + 차액 0.0001 BTC fee 의 직렬화된 tx 생성.",
    },
    {
      when: "T+1s",
      layer: "S6",
      what: "지갑이 자기 노드에 tx 를 넘김 → 노드가 검증 → mempool 에 추가 → 이웃 노드들에 ‘이거 있어’ 가십 시작.",
    },
    {
      when: "T+10s",
      layer: "S6",
      what: "가십이 몇 hop 안에 전 세계 노드 수만 대에 도달. 각 노드가 자기 UTXO 셋으로 다시 검증하고 자기 mempool 에도 추가.",
    },
    {
      when: "T+10min",
      layer: "S5 / S8",
      what: "어느 채굴자가 mempool 에서 fee 높은 tx 들을 골라 블록 candidate 작성. ASIC 들이 nonce 를 바꿔가며 SHA-256 시도. 약 10 분 후 어느 ASIC 이 target 미만의 hash 발견.",
    },
    {
      when: "T+10min+ε",
      layer: "S6 / S7",
      what: "채굴자가 새 블록을 브로드캐스트하면 가십으로 전 세계에 전파된다. 각 노드가 검증 (헤더, tx, script, 서명, UTXO 갱신) 을 통과시키면 자기 best chain 에 추가하고, Alice 의 tx 는 이제 ‘1 confirmation’ 이 된다.",
    },
    {
      when: "T+1h",
      layer: "S7",
      what: "그 위로 5 블록이 더 쌓이면 6 confirmation 에 도달한다. 이 시점부터는 실용적으로 finality 에 가깝다. reorg 하려면 정직 hashrate 를 압도하는 자원이 필요하다.",
    },
    {
      when: "T+∞",
      layer: "S10 / S11",
      what: "그 블록 데이터는 모든 풀 노드의 디스크에 영구히 자리잡음. 각 노드의 UTXO 셋에선 Alice 의 1.4 BTC UTXO 가 사라지고 Bob 의 1.0 BTC + Alice 잔돈 0.3999 BTC 가 새로 등록. 채굴자는 coinbase 로 받은 3.125 BTC + 모든 fee 를 받음.",
    },
  ];
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          한 송금이 모든 단계를 어떻게 통과하는가
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-1.5 max-w-2xl">
          이 학습의 처음부터 끝을 한 흐름으로. Alice 의 1 BTC 송금이 S1 부터
          S10 까지 무슨 일을 거치는지, 시간축으로 정렬한 종합 정리.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[80px_70px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>시간</div>
          <div>단계</div>
          <div>무슨 일</div>
        </div>
        <div className="divide-y divide-edge text-sm">
          {stages.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[80px_70px_1fr] gap-3 px-4 py-3 items-baseline"
            >
              <div className="font-mono text-[13px] text-accent">{s.when}</div>
              <div className="font-mono text-[13px] text-accent2">{s.layer}</div>
              <div className="text-[13px] text-text/85 leading-relaxed">
                {s.what}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Callout title="무엇을 본 셈인가">
        <p className="text-[15px] text-text/85 leading-[1.7]">
          ‘송금’ 이라는 한 줄 동작이 실제론 키 파생, 서명, UTXO 선택, 직렬화,
          P2P 전파, 검증, ASIC 의 SHA-256 시도, 합의 규칙 적용, 모든 노드의
          상태 갱신의 오케스트라. 어느 한 컴포넌트도 신뢰받는 중심이 없고,
          모두가 서로를 검증함으로써 시스템 전체의 신뢰가 만들어진다.
        </p>
        <p className="text-[14px] text-text/65 leading-[1.7]">
          ‘비트코인은 어떻게 작동하는가’ 의 답은 이 한 흐름이다. 더 깊이 가려면
          Bitcoin Core 소스를 직접 읽거나, 노드를 자기 디바이스에서 돌려보는 것.
        </p>
      </Callout>
    </section>
  );
}
