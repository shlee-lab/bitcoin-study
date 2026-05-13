"use client";

import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

type Step = {
  n: string;
  title: string;
  desc: string;
  value: string;
  valueLabel: string;
  transform?: string;
  transformNote?: string;
};

const STEPS: Step[] = [
  {
    n: "①",
    title: "Private key (d)",
    desc: "무작위 256-bit 정수. 단 하나의 비밀.",
    value: "a3f4e271b8d59c0a6ef24d8b31cc7e95a124f6e3b08c4d712e9a35b7c80f1d6e",
    valueLabel: "64 hex · 32 bytes",
    transform: "Q = d · G",
    transformNote: "secp256k1 곡선 위 점 곱셈",
  },
  {
    n: "②",
    title: "Public key (Q)",
    desc: "private 에서 곡선 곱셈으로 파생되는 곡선 위 점.",
    value: "029b2f76c41ae07a4f5a6e8c7d3b91e2f854c28a5d0f3a16b9c7d4e10f8a2b5c63",
    valueLabel: "33 bytes compressed (02 || X)",
    transform: "RIPEMD160( SHA256( Q ) )",
    transformNote: "두 해시를 연달아 적용해 짧게 줄임",
  },
  {
    n: "③",
    title: "Public key hash",
    desc: "공개키를 안전하게 짧게 줄인 20 byte 다이제스트.",
    value: "751e76e8199196d454941c45d1b3a323f1433bd6",
    valueLabel: "20 bytes · 40 hex",
    transform: "Bech32 ( witness v0 || hash )",
    transformNote: "사람이 다루기 좋은 인코딩 + 체크섬",
  },
  {
    n: "④",
    title: "Address",
    desc: "외부에 공개해도 되는 ‘별명’. 자금을 받을 때 상대에게 알려주는 문자열이다.",
    value: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    valueLabel: "Bech32 · SegWit P2WPKH (mainnet)",
  },
];

export function L1Wallet(props: LayerProps) {
  return (
    <LayerShell
      id="S1"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "주소와 비밀키", subtitle: "지갑이 가진 두 가지",
                body: <IntroPair />,
              },
              {
                title: "주소와 비밀키는 어떻게 이어지나",
                subtitle: "trap-door 함수",
                body: <TrapdoorIntro />,
              },
              {
                title: "공개키 암호 자세히",
                body: <PrimitivePanel ids={["public-key"]} />,
              },
              {
                title: "비트코인의 4 단계 주소 파생",
                level: "deep",
                body: (
                  <Section
                    heading="비트코인이 만드는 실제 주소 · 4 단계"
                    sub={
                      <>
                        앞서 본 <Term id="trap-door">trap-door</Term> 함수 (
                        <Term id="ecdsa">ECDSA</Term> /{" "}
                        <Term id="secp256k1">secp256k1</Term>) 가 실제로 어떻게
                        적용되어 주소까지 가는지. 이 과정에 한 가지 새 도구가
                        들어온다 · <span className="text-text">해시 함수</span>.
                        공개키 자체를 노출하지 않고 ‘공개키의 지문’ 만 주소로
                        쓰기 위해서다.
                      </>
                    }
                  >
                    <Pipeline />
                    <EthereumAddressCompare />
                    <PrimitivePanel ids={["hash"]} />
                  </Section>
                ),
              },
              {
                title: "시드와 실제 지갑으로 넘어가기",
                subtitle: "키 하나에서 지갑 전체로",
                level: "guide",
                body: (
                  <section className="space-y-3">
                    <p className="text-[17px] text-text/85 leading-[1.7]">
                      여기까지는{" "}
                      <span className="text-text">‘비밀키 1 개 → 주소 1 개’</span>
                      의 단순화된 모형. 실제 지갑은 한 줄의 시드 문구에서
                      수십·수백 개의 키를 결정론적으로 만들고, 그 키들을 어디에
                      두느냐 (폰 / 전용 기기 / 분산) 에 따라 종류가 갈린다.
                    </p>
                    <p className="text-[15px] text-text/70 leading-[1.7]">
                      다음 섹션 (S2 · Seed & Wallet Types) 에서 이어진다.
                    </p>
                  </section>
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

function IntroPair() {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <p className="text-[17px] text-text/80 leading-[1.75]">
          S0 에서 Alice 는 송금 메시지를 만들었다. 하지만 보내려면 먼저
          비트코인을 쓸 권한을 보관하는 도구가 필요하다. 그게{" "}
          <span className="text-text">지갑</span>이다. 다만 비트코인 지갑은
          카드와 현금이 들어 있는 실물 지갑과 다르다.
        </p>
        <p className="text-[15px] text-text/75 leading-[1.7]">
          지갑 안에는 사실{" "}
          <span className="text-text">돈 자체가 들어 있지 않다</span>. 돈은
          공개 장부에 기록되어 있고, 지갑은 그 돈을 쓸 수 있는 권한을 보관한다.
          더 정확한 비유는 다음과 같다.
        </p>
      </div>

      <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 px-4 py-2 border-b border-edge text-[12px] font-medium text-muted">
          <div>친숙한 것</div>
          <div>비트코인의 대응</div>
        </div>
        <div className="divide-y divide-edge text-[14px]">
          <AnalogyRow
            real="은행 계좌번호"
            crypto="주소 (address). 받는 사람이 외부에 공개하는 식별자, 누구든 거기로 송금 가능."
          />
          <AnalogyRow
            real="ATM 카드 + 비밀번호"
            crypto="비밀키 (private key). 내 계좌의 돈을 쓰려면 반드시 알아야 하는 비밀. 분실/도난 시 통제권 상실."
          />
          <AnalogyRow
            real="은행 시스템 (장부)"
            crypto="블록체인. 모든 잔액·이력이 기록되어 있는 ‘공유 장부’."
          />
          <AnalogyRow
            real="가죽 지갑 (현금이 들어있음)"
            crypto="해당 없음. 비트코인 지갑은 ‘돈을 담는 그릇’ 이 아니라 ‘열쇠를 보관하는 도구’ 다."
          />
        </div>
      </div>

      <p className="text-[15px] text-text/75 leading-[1.7]">
        결국 비트코인 지갑이 가진 건 단 두 가지.{" "}
        <span className="text-text">주소</span> 와{" "}
        <span className="text-text">비밀키</span>. 은행에선 분리된 두 정보 (계좌번호
        / 카드 비밀번호) 가, 비트코인에선{" "}
        <span className="text-text">수학적으로 한 쌍으로 묶인 짝꿍</span> 이
        된다는 게 핵심 차이.
      </p>

      <div className="space-y-3 pt-3 border-t border-edge/60">
        <h2 className="text-[20px] font-medium tracking-tight">
          그 한 쌍을 자세히
        </h2>
        <p className="text-[15px] text-text/70 leading-[1.7]">
          외부에 공개해 자금을 받는{" "}
          <span className="text-text">주소</span>, 그리고 그 자금을 풀 권한인{" "}
          <span className="text-text">비밀키</span>. 비밀키 하나만 정해지면 그에
          대응하는 공개키와 대표적 수신 주소가 결정된다 (반대 방향은 사실상
          불가능).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent2">
            public
          </div>
          <div className="text-base font-medium">주소 (address)</div>
          <div className="font-mono text-sm text-accent break-all">
            bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4
          </div>
          <div className="text-sm text-muted leading-relaxed pt-1">
            외부 공유 가능. 자금을 받는 목적지 문자열. 한 사용자가 여러 개를
            만들어 쓰는 것이 일반적이다 (프라이버시 + 회계).
          </div>
        </div>
        <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-2.5">
          <div className="text-[14px] font-semibold text-accent">
            private
          </div>
          <div className="text-base font-medium">비밀키 (private key)</div>
          <div className="font-mono text-sm text-muted/70 tracking-wider select-none">
            ●●●●●●●● ●●●●●●●● ●●●●●●●● ●●●●●●●●
          </div>
          <div className="text-sm text-muted leading-relaxed pt-1">
            절대 노출 금지. 무작위 256-bit 숫자. 이걸 아는 사람만 그 주소의
            자금을 쓸 수 있고, 잃으면 복구 경로가 없다.
          </div>
        </div>
      </div>
    </section>
  );
}

function TrapdoorIntro() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight">
          그 한 쌍은 어떻게 만들어질까
        </h2>
        <p className="text-[17px] text-text/70 leading-[1.7] mt-1.5 max-w-2xl">
          핵심 아이디어:{" "}
          <span className="text-text">한 방향으로만 쉽게 가는 함수</span>. 비밀
          숫자에서 공개 정보를 만드는 건 빠르고, 거꾸로 공개 정보에서 비밀을
          역산하는 건 사실상 불가능. ‘<Term id="trap-door">trap-door 함수</Term>’.
        </p>
      </div>

      <TrapdoorDiagram />

      <p className="text-[17px] text-text/85 leading-[1.7] max-w-2xl">
        비트코인이 쓰는 그 함수의 정체와 안전성을 살펴본다.
      </p>
    </section>
  );
}

function TrapdoorDiagram() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 480 110"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="tdArrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 S0,10 z" fill="#7a8190" />
          </marker>
          <marker
            id="tdBack"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 S0,10 z" fill="#3a3f4a" />
          </marker>
        </defs>
        <rect
          x={40}
          y={20}
          width={120}
          height={36}
         
          fill="none"
          stroke="#5b8def"
          strokeWidth="1"
        />
        <text
          x={100}
          y={37}
          textAnchor="middle"
          fontSize="13"
          fill="#5b8def"
          fontFamily="JetBrains Mono"
        >
          비밀 숫자
        </text>
        <text
          x={100}
          y={50}
          textAnchor="middle"
          fontSize="11"
          fill="#a0a8b8"
          fontFamily="JetBrains Mono"
        >
          d
        </text>

        <line
          x1={168}
          y1={38}
          x2={312}
          y2={38}
          stroke="#7a8190"
          strokeWidth="1.2"
          markerEnd="url(#tdArrow)"
        />
        <text
          x={240}
          y={30}
          textAnchor="middle"
          fontSize="11"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          forward (fast)
        </text>

        <rect
          x={320}
          y={20}
          width={120}
          height={36}
         
          fill="none"
          stroke="#f7931a"
          strokeWidth="1"
        />
        <text
          x={380}
          y={37}
          textAnchor="middle"
          fontSize="13"
          fill="#f7931a"
          fontFamily="JetBrains Mono"
        >
          공개 정보
        </text>
        <text
          x={380}
          y={50}
          textAnchor="middle"
          fontSize="11"
          fill="#a0a8b8"
          fontFamily="JetBrains Mono"
        >
          Q (→ 주소)
        </text>

        <line
          x1={312}
          y1={78}
          x2={168}
          y2={78}
          stroke="#3a3f4a"
          strokeWidth="1"
          strokeDasharray="4 4"
          markerEnd="url(#tdBack)"
        />
        <text
          x={240}
          y={97}
          textAnchor="middle"
          fontSize="12"
          fill="#a0a8b8"
          fontFamily="JetBrains Mono"
        >
          inverse  ·  사실상 불가능
        </text>
      </svg>
    </div>
  );
}

function Pipeline() {
  return (
    <div className="space-y-2">
      {STEPS.map((step, i) => {
        const isLast = i === STEPS.length - 1;
        return (
          <div key={i}>
            <StepCard step={step} />
            {!isLast && step.transform && (
              <Arrow
                fn={step.transform}
                note={step.transformNote ?? ""}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function EthereumAddressCompare() {
  return (
    <div className="rounded-sm border border-edge bg-surface/25 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b58cff]" />
        <h3 className="text-[15px] font-medium text-text">
          <Term id="ethereum-address">Ethereum 주소</Term>
        </h3>
      </div>
      <p className="text-[14px] text-text/72 leading-[1.75]">
        Rabby 나 MetaMask 같은 Ethereum 지갑에서 보는{" "}
        <code className="font-mono text-text">0x...</code> 주소는 Bitcoin 주소가
        아니라 Ethereum 주소다. 둘 다 지갑이 seed/private key 에서 공개키를
        만들고, 그 공개키를 해시해 주소를 만든다는 큰 흐름은 비슷하다. 다만
        Bitcoin 은 <code className="font-mono">bc1...</code> 같은 별도 인코딩과
        강한 체크섬을 붙이고, Ethereum 은 해시 결과의 마지막 20 byte 를{" "}
        <code className="font-mono">0x</code> 뒤 40 자리 16진수로 보여준다.
      </p>
      <div className="rounded-sm border border-edge/80 bg-bg/35 px-3 py-2">
        <code className="font-mono text-[13px] text-text/82 break-all">
          0xE644aDac6b5cB18EFa46d84c5Bcf52357812F406
        </code>
      </div>
      <p className="text-[13px] text-text/55 leading-relaxed">
        대소문자가 섞여 보이는 것은 장식이 아니다. EIP-55 방식의 체크섬 표기라,
        주소를 잘못 옮겨 적었을 때 일부 오류를 잡아낼 수 있다. 모두 소문자로
        써도 주소 값은 같지만, 체크섬 보호는 약해진다.
      </p>
    </div>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 px-4 py-3.5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-accent text-sm">{step.n}</span>
        <span className="text-sm font-medium">{step.title}</span>
        <span className="text-xs text-muted ml-auto font-mono">
          {step.valueLabel}
        </span>
      </div>
      <div className="text-[13px] text-muted mt-1.5 leading-relaxed">
        {step.desc}
      </div>
      <div className="mt-2.5 font-mono text-[13px] text-text/85 break-all leading-relaxed">
        {step.value}
      </div>
    </div>
  );
}

function Arrow({ fn, note }: { fn: string; note: string }) {
  return (
    <div className="flex items-center gap-3 pl-7 py-1">
      <div className="text-muted text-sm leading-none">↓</div>
      <div className="font-mono text-[13px] text-accent2">{fn}</div>
      <div className="text-xs text-muted">{note}</div>
    </div>
  );
}

function AnalogyRow({
  real,
  crypto,
}: {
  real: string;
  crypto: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 px-4 py-3 items-baseline">
      <div className="text-[13px] text-text/85 font-medium">{real}</div>
      <div className="text-[13px] text-text/75 leading-[1.65]">{crypto}</div>
    </div>
  );
}
