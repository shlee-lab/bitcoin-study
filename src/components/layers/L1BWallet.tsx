"use client";

import Image from "next/image";
import { LayerShell } from "../LayerShell";
import { PrimitivePanel } from "../PrimitivePanel";
import { Reflection, ReflectionPart, Probe } from "../Reflection";
import { SectionHead } from "../SectionHead";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L1BWallet(props: LayerProps) {
  return (
    <LayerShell
      id="S2"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "시드 문구에서 모든 키가 나온다",
                subtitle: "BIP39 + BIP32",
                body: (
                  <Section
                    heading="실제 지갑은 키 한 개로 끝나지 않는다"
                    sub={
                      <>
                        앞 단계의 ‘비밀키 한 개 → 주소 한 개’ 는 단순화된
                        모형이다. 실제 사용자는 수십·수백 개 주소를 만들 수 있고,
                        그 모든 키는 한 줄의 시드 문구에서 결정론적으로 파생된다.{" "}
                        <Term id="bip39">BIP39</Term> +{" "}
                        <Term id="bip32">BIP32</Term> +{" "}
                        <Term id="bip44">BIP44</Term> 조합 (
                        <Term id="bip">BIP 가 뭐?</Term>) 이 사실상의 표준이다.
                      </>
                    }
                  >
                    <PrimitivePanel ids={["seed-derivation"]} />
                  </Section>
                ),
              },
              {
                title: "키를 어디에 둘 것인가",
                subtitle: "소프트웨어 지갑 vs 하드웨어 지갑",
                body: <WalletMainTypes />,
              },
              {
                title: "누가 서명 권한을 갖는가",
                subtitle: "멀티시그와 수탁형 지갑",
                body: <WalletAdvancedTypes />,
              },
              {
                title: "지갑 종류 한눈에 비교",
                body: (
                  <Section
                    heading="지갑 종류 한눈에 비교"
                    sub="핵심 축은 세 가지다. 키가 어디에 있는가, 네트워크에 연결되는가, 최종 서명 권한을 누가 갖는가."
                  >
                    <ComparisonTable />
                  </Section>
                ),
              },
              {
                title: "생각해보기", subtitle: "신원이 256-bit 숫자 1 개라는 것",
                body: (
                  <Reflection title="‘신원’ 의 정의가 바뀌면 어떤 일이 일어나는가">
                    <p>
                      은행 계좌는 신분증·서명·전화번호로 본인을 증명한다.
                      누군가 도와줄 수 있다. 본인 확인 절차로 비밀번호도 재발급
                      받고, 도난당한 카드도 정지시키고, 사망 시 상속도 이뤄진다.
                    </p>
                    <p>
                      비트코인의 ‘본인’ 은{" "}
                      <span className="text-text">무작위 256-bit 숫자 1 개</span>{" "}
                      를 아는가 모르는가로 결정된다. 잃으면 끝이고, 남이 알면
                      도난당한다. 도와줄 사람이 없다. 한편 누구도 막을 수도 없다.
                    </p>
                    <Probe>
                      자기 자산의 통제권을 100% 자기 책임으로 갖는다는 게 더
                      자유로운가, 더 위험한가? 외부 기관에 ‘기댄다’ 가 보호일
                      수도, 통제일 수도 있다. 어떤 시스템이 진짜 ‘내 돈’ 인가?
                    </Probe>
                  </Reflection>
                ),
              },
              {
                title: "생각해보기", subtitle: "양자 컴퓨터가 비밀키를 푼다면",
                body: <QuantumReflection />,
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

function WalletMainTypes() {
  return (
    <section className="space-y-4">
      <SectionHead
        eyebrow="실제 지갑 종류 ①"
        title="키가 어디에 있나 · 소프트웨어 vs 하드웨어"
        hint={
          <>
            먼저 볼 축은 키의 위치다. 키가{" "}
            <span className="text-text">인터넷에 연결된 디바이스</span> 안에 있냐
            (<span className="text-text">소프트웨어 지갑</span>),{" "}
            <span className="text-text">오프라인 매체</span> 에 있냐 (
            <span className="text-text">하드웨어 지갑</span>)를 구분한다. 그다음
            서명 권한을 나눌지, 제3자에게 맡길지를 별도의 축으로 본다.
          </>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MAIN_TYPES.map((w) => (
          <WalletCard key={w.kind} {...w} />
        ))}
      </div>
    </section>
  );
}

function WalletAdvancedTypes() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <SectionHead
          eyebrow="별개의 축"
          title="Multi-signature · 서명을 N 명 중 M 명에게"
          hint="지갑 ‘종류’ 가 아니라 ‘서명 규칙’. 소프트웨어 / 하드웨어 어느 쪽에든 얹어 쓸 수 있다."
        />
        <MultisigCard />
      </div>

      <div className="space-y-3">
        <SectionHead
          eyebrow="참고"
          title="Custodial · 엄밀히는 자기 지갑이 아님"
          hint="키를 남이 들고 있는 형태. 사용 편의는 좋지만 위 두 분류와 본질이 다르다."
          tone="muted"
        />
        <WalletCard compact {...CUSTODIAL} />
      </div>
    </section>
  );
}

type Brand = { name: string; iconify?: string };

type WalletType = {
  kind: string;
  badge: "cold" | "hot" | "custodial" | "advanced" | "legacy";
  Icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  detail: string;
  brands: Brand[];
  caution?: string;
};

const MAIN_TYPES: WalletType[] = [
  {
    kind: "Software wallet",
    badge: "hot",
    Icon: SoftwareIcon,
    tagline: "범용 디바이스 (폰·PC·브라우저) 안에 키. 그 위 앱이 직접 서명.",
    detail:
      "OS 보안 영역 (iOS Keychain / Android Keystore / 디스크 암호화) 에 저장. 사용자가 즉시 서명·송금이 가능해 일상 결제 UX 가 좋다. 다만 OS·브라우저가 인터넷에 연결돼 있어 멀웨어·피싱 노출 면이 넓다.",
    brands: [
      { name: "Sparrow" },
      { name: "Electrum" },
      { name: "BlueWallet" },
    ],
    caution: "큰 금액은 하드웨어 지갑으로 옮기는 게 일반. 일상용 소액에 적합.",
  },
  {
    kind: "Hardware wallet",
    badge: "cold",
    Icon: HardwareIcon,
    tagline: "키가 인터넷과 단절된 별도 매체에 있다. 서명도 그 안에서만 이뤄진다.",
    detail:
      "USB/NFC 같은 전용 디바이스. 비밀키는 기기 안에 머물고, 서명도 그 안에서 일어난다. 일부 제품은 secure element 같은 보안 칩을 쓴다. 호스트 PC 가 감염되어도 키 자체는 노출되지 않는다. 같은 ‘offline 매체’ 분류의 옛날 변종이 paper wallet (디바이스 없이 종이에 키를 적은 것) 이다. 인쇄·필사 과정의 위험 때문에 지금은 거의 쓰이지 않는다.",
    brands: [
      { name: "Trezor", iconify: "simple-icons:trezor" },
      { name: "Ledger Nano" },
      { name: "ColdCard" },
    ],
    caution: "분실·고장에 대비한 시드 문구 백업이 함께 살아 있어야 의미가 있다.",
  },
];

const CUSTODIAL: WalletType = {
  kind: "Custodial (거래소)",
  badge: "custodial",
  Icon: CustodialIcon,
  tagline: "내 키를 남(거래소·핀테크) 이 갖고 있다.",
  detail:
    "비트코인 시스템 입장에선 그 회사가 ‘진짜 소유자’. 사용자는 회사 장부의 엔트리를 갖는 셈. ‘not your keys, not your coins.’ Mt.Gox, FTX 등 사례 다수.",
  brands: [
    { name: "Coinbase", iconify: "simple-icons:coinbase" },
    { name: "Binance", iconify: "simple-icons:binance" },
    { name: "Upbit · Bithumb" },
  ],
  caution: "학습 후 자가 보관 (소프트웨어/하드웨어 지갑) 으로 옮겨가는 흐름 권장.",
};

function WalletCard({
  kind,
  badge,
  Icon,
  tagline,
  detail,
  brands,
  caution,
  compact,
}: WalletType & { compact?: boolean }) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-sm border border-edge bg-bg p-2 text-text/85">
          <Icon className={compact ? "w-8 h-8" : "w-10 h-10"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className={compact ? "text-base font-medium" : "text-lg font-medium"}>
              {kind}
            </div>
            <Badge badge={badge} />
          </div>
          <div className="text-sm text-muted leading-relaxed mt-1">
            {tagline}
          </div>
        </div>
      </div>
      <div className="text-[15px] text-text/85 leading-[1.7]">{detail}</div>
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {brands.map((b) => (
            <BrandChip key={b.name} {...b} />
          ))}
        </div>
      )}
      {caution && (
        <div className="text-xs text-[#f7931a]/85 leading-relaxed border-t border-edge pt-2.5 mt-auto">
          ⚠ {caution}
        </div>
      )}
    </div>
  );
}

function MultisigCard() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-sm border border-edge bg-bg p-2 text-text/85">
          <MultisigIcon className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-lg font-medium">Multi-signature (M-of-N)</div>
            <Badge badge="advanced" />
          </div>
          <div className="text-sm text-muted leading-relaxed mt-1">
            지갑 ‘종류’ 가 아니라 ‘서명 규칙’. 소프트웨어 / 하드웨어 어느 쪽에든
            얹어 쓸 수 있는 별개 축.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3">
        <div className="text-[15px] text-text/85 leading-[1.7]">
          기본 지갑은 1-of-1 (한 키 = 한 서명). Multi-sig 는{" "}
          <code className="font-mono text-accent">M-of-N</code>: N 개 키 중 M
          개 서명이 모여야 풀림. 흔한 조합은 2-of-3, 3-of-5. 키 한 개를 잃어도,
          한 개가 도난당해도 자금 안전.
        </div>
        <MultisigDiagram />
      </div>

      <div className="rounded-sm border border-edge bg-surface/40 p-3 text-sm leading-relaxed">
        <span className="text-muted">예시 셋업: </span>
        <span className="text-text">2-of-3, 키 종류·장소 분산</span>
        <ul className="mt-1.5 space-y-0.5 text-[13px] text-text/85">
          <li>· 키 1 = ColdCard (집 금고)</li>
          <li>· 키 2 = Trezor (회사)</li>
          <li>· 키 3 = Sparrow 소프트웨어 지갑 (다른 가족 PC)</li>
        </ul>
        <div className="text-[13px] text-muted mt-1.5">
          하나를 잃거나 한 곳이 털려도 자금은 안전하다. 두 곳이 동시에
          침해되는 일은 사실상 어렵다.
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          { name: "Casa" },
          { name: "Unchained" },
          { name: "Sparrow + 여러 하드웨어 지갑" },
        ].map((b) => (
          <BrandChip key={b.name} name={b.name} />
        ))}
      </div>

      <div className="text-xs text-[#f7931a]/85 leading-relaxed border-t border-edge pt-2.5">
        ⚠ 키들을 다른 장소·다른 종류로 진짜 분산해야 의미가 있다. 한 컴퓨터에
        다 두면 multi-sig 가 아니라 그냥 복잡한 single-sig.
      </div>
    </div>
  );
}

function MultisigDiagram() {
  return (
    <div className="rounded-sm border border-edge bg-surface/40 p-3">
      <svg
        viewBox="0 0 200 140"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="msArrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto"
          >
            <path d="M0,0 L10,5 S0,10 z" fill="#7a8190" />
          </marker>
        </defs>
        <KeyNode x={30} y={28} active />
        <KeyNode x={100} y={28} active />
        <KeyNode x={170} y={28} active={false} />
        <text x={30} y={50} textAnchor="middle" fontSize="10" fill="#5b8def" fontFamily="JetBrains Mono">sign</text>
        <text x={100} y={50} textAnchor="middle" fontSize="10" fill="#5b8def" fontFamily="JetBrains Mono">sign</text>
        <text x={170} y={50} textAnchor="middle" fontSize="10" fill="#5a6070" fontFamily="JetBrains Mono">(idle)</text>

        <line x1={30} y1={62} x2={95} y2={92} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#msArrow)" />
        <line x1={100} y1={62} x2={100} y2={92} stroke="#7a8190" strokeWidth="0.8" markerEnd="url(#msArrow)" />

        <rect x={70} y={92} width={60} height={26} fill="#0d0f14" stroke="#f7931a" strokeWidth="1" />
        <text x={100} y={109} textAnchor="middle" fontSize="11" fill="#f7931a" fontFamily="JetBrains Mono">2 of 3 ✓</text>
        <text x={100} y={132} textAnchor="middle" fontSize="9" fill="#5a6070" fontFamily="JetBrains Mono">tx unlocked</text>
      </svg>
    </div>
  );
}

function KeyNode({ x, y, active }: { x: number; y: number; active: boolean }) {
  const stroke = active ? "#5b8def" : "#3a3f4a";
  const fill = active ? "#5b8def15" : "#0d0f14";
  return (
    <g>
      <rect x={x - 14} y={y - 12} width={28} height={24} fill={fill} stroke={stroke} strokeWidth="1" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill={active ? "#5b8def" : "#5a6070"} fontFamily="JetBrains Mono">key</text>
    </g>
  );
}

function BrandChip({ name, iconify }: Brand) {
  const url = iconify
    ? iconify.startsWith("simple-icons:")
      ? `https://api.iconify.design/${iconify}.svg?color=%23a0a8b8`
      : `https://api.iconify.design/${iconify}.svg`
    : null;
  return (
    <span className="inline-flex items-center gap-1.5 border border-edge bg-bg/60 rounded px-2 py-1 text-xs">
      {url ? (
        <Image src={url} alt="" width={14} height={14} unoptimized className="opacity-95" />
      ) : (
        <span className="w-3 h-3 rounded-sm border border-edge bg-surface/50 inline-block" />
      )}
      <span className="font-mono text-text/85">{name}</span>
    </span>
  );
}

function Badge({ badge }: { badge: WalletType["badge"] }) {
  const styles: Record<WalletType["badge"], { label: string; cls: string }> = {
    cold: { label: "cold", cls: "border-accent2/40 text-accent2 bg-accent2/10" },
    hot: { label: "hot", cls: "border-accent/40 text-accent bg-accent/10" },
    custodial: { label: "custodial", cls: "border-[#f76b6b]/40 text-[#f76b6b] bg-[#f76b6b]/10" },
    advanced: { label: "advanced", cls: "border-text/30 text-text/85 bg-text/5" },
    legacy: { label: "legacy", cls: "border-muted/40 text-muted bg-muted/5" },
  };
  const s = styles[badge];
  return (
    <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ComparisonTable() {
  type Row = { kind: string; location: string; online: string; yours: string; recovery: string };
  const rows: Row[] = [
    { kind: "Software", location: "폰 / PC / 브라우저", online: "온라인", yours: "내가", recovery: "시드 문구" },
    { kind: "Hardware", location: "전용 기기 / 보안 칩", online: "오프라인", yours: "내가", recovery: "시드 문구" },
    { kind: "Hardware (paper, legacy)", location: "종이", online: "오프라인", yours: "내가", recovery: "그 종이" },
    { kind: "Multi-sig (위 둘에 얹음)", location: "여러 곳 분산", online: "혼합", yours: "내가 (분산)", recovery: "N 개 중 M 개 키만 모이면 OK" },
    { kind: "Custodial", location: "남의 서버", online: "온라인", yours: "남이", recovery: "회사 계정 복구" },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge text-[14px] font-semibold text-text/80">한눈에 비교</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[13px] font-semibold text-muted border-b border-edge">
              <Th>종류</Th>
              <Th>키 위치</Th>
              <Th>네트워크</Th>
              <Th>서명 권한</Th>
              <Th>복원</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {rows.map((r) => (
              <tr key={r.kind}>
                <Td bold>{r.kind}</Td>
                <Td>{r.location}</Td>
                <Td><Net value={r.online} /></Td>
                <Td><Custody value={r.yours} /></Td>
                <Td>{r.recovery}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-2 font-normal">{children}</th>;
}

function Td({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <td className={`px-4 py-2 align-top ${bold ? "font-medium text-text" : "text-text/85"}`}>
      {children}
    </td>
  );
}

function Net({ value }: { value: string }) {
  const tone = value === "오프라인" ? "text-accent2" : value === "온라인" ? "text-accent" : "text-muted";
  return <span className={tone}>{value}</span>;
}

function Custody({ value }: { value: string }) {
  const tone = value.startsWith("남이") ? "text-[#f76b6b]" : "text-text/85";
  return <span className={tone}>{value}</span>;
}

function HardwareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="6" width="16" height="13" rx="1.5" />
      <rect x="6.5" y="9" width="11" height="5" rx="0.5" />
      <circle cx="9" cy="17" r="0.6" fill="currentColor" />
      <circle cx="15" cy="17" r="0.6" fill="currentColor" />
      <path d="M11 6V4h2v2" />
    </svg>
  );
}

function SoftwareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="14" height="11" rx="1.5" />
      <line x1="6" y1="18" x2="12" y2="18" />
      <line x1="9" y1="15" x2="9" y2="18" />
      <rect x="13" y="9" width="9" height="13" rx="1.5" />
      <line x1="16" y1="20" x2="19" y2="20" />
      <text x="17.5" y="17.2" textAnchor="middle" fontSize="5" stroke="none" fill="currentColor" fontFamily="JetBrains Mono">₿</text>
    </svg>
  );
}

function CustodialIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V9.5L12 5l7 4.5V21" />
      <line x1="9" y1="13" x2="9" y2="21" />
      <line x1="15" y1="13" x2="15" y2="21" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
    </svg>
  );
}

function MultisigIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <line x1="7.4" y1="7.4" x2="11" y2="16.5" />
      <line x1="16.6" y1="7.4" x2="13" y2="16.5" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <text x="12" y="11.5" textAnchor="middle" fontSize="4" stroke="none" fill="currentColor" fontFamily="JetBrains Mono">2/3</text>
    </svg>
  );
}

function QuantumReflection() {
  return (
    <Reflection title="양자 컴퓨터가 ECDSA 를 깨면, 비트코인은 무사할까">
      <p>
        비트코인 주소의 안전성은{" "}
        <span className="text-text">
          ‘공개키 Q 에서 비밀키 d 를 거꾸로 풀 수 없다’
        </span>{" "}
          는 한 가지 가정 (ECDLP, 이산로그) 에 전적으로 기대고 있다. 고전 컴퓨터로는
          사실상 풀 수 없고, 우주 수명 안에 끝낼 수 있는 계산이 아니다. 하지만
          충분히 큰 양자 컴퓨터가 있다면 이 문제는 다항 시간에 풀릴 수 있다.
      </p>

      <ReflectionPart title="왜 양자 컴퓨터는 가능한가 · Shor 알고리즘">
        <p>
          1994 년 Peter Shor 가 정리한 양자 알고리즘. 큰 수 인수분해와{" "}
          <span className="text-text">이산로그</span> 를 모두 다항 시간에 푼다.
          ECDSA 의 ECDLP 도 그 한 사례다. 그래서 RSA, ECDSA, DH 처럼 현재 널리
          쓰이는 비대칭 암호는 충분히 강한 양자 컴퓨터 앞에서 같은 종류의 위험을
          갖는다.
        </p>
        <p className="text-text/65">
          반대로{" "}
          <span className="text-text">대칭 암호 (AES) 와 해시 (SHA-256)</span>{" "}
          은 양자 컴퓨터로도 키 길이를 두 배로 늘리는 정도의 약화 (Grover) 만
          있을 뿐 살아남는다. 즉 비트코인의 ‘마이닝 / 블록 해시’ 부분은 비교적
          안전하다. 비트코인에서 더 직접적인 위험은 채굴이 아니라 서명과 주소
          체계 쪽에 있다.
        </p>
      </ReflectionPart>

      <ReflectionPart title="그럼 곧 깨질까 · 물리 한계라는 벽">
        <p>
          오늘 IBM · Google 의 양자 칩은{" "}
          <span className="text-text">약 1,000 개의 noisy qubit</span> 수준이다.
          2048-bit RSA 를 깨려면 추정상{" "}
          <span className="text-text">수천만 ~ 수억 개의 ‘논리 qubit’</span>{" "}
          (오류 정정 후 깨끗한 큐비트) 이 필요하고, 그러려면 noisy qubit 은
          십억 개 단위로 필요하다. 두 자릿수 차이가 아니라 6–8 자릿수 차이다.
        </p>
        <p className="text-text/65">
          이걸 단순히 ‘더 만들면 된다’ 로 해결할 수 없는 이유는{" "}
          <span className="text-text">decoherence · 열소음 · 오류율</span>{" "}
          같은 물리 한계 때문이다. qubit 을 늘릴수록 오류가 기하급수적으로 누적되어,
          오류 정정에 드는 자원이 또 폭발한다. 무어의 법칙처럼 매 2 년마다 두 배가
          되는 영역이 아니라, 매 단계마다 새 물리 발견이 필요한 영역이다.
        </p>
        <p className="text-text/65">
          업계 전망의 중앙값은 ECDSA 를 실제로 깨는 양자 컴퓨터가{" "}
          <span className="text-text">2040 ~ 2050 이후 (혹은 영영)</span>. 일부
          비관론자는 “물리적으로 그 규모는 절대 불가능” 이라고 본다. 다만 정보
          기관이 지금부터 트래픽을 저장해 두었다가 미래에 푸는 ‘harvest now,
          decrypt later’ 위협은 이미 현재형.
        </p>
      </ReflectionPart>

      <ReflectionPart title="그래도 PQC (post-quantum cryptography) 가 있다">
        <p>
          2016 년부터 NIST 가 양자 컴퓨터로도 못 푸는 새 비대칭 알고리즘들을
          공모·표준화 중. 2024 년 첫 표준 3 종 확정. lattice 기반의{" "}
          <span className="text-text">CRYSTALS-Kyber</span> (키 교환),{" "}
          <span className="text-text">CRYSTALS-Dilithium</span> (서명), 해시
          기반의 <span className="text-text">SPHINCS+</span> (서명). 수학적
          근거가 ECDLP 와 무관해 Shor 가 안 통한다.
        </p>
        <p className="text-text/65">
          비트코인 입장에선 ‘soft fork 로 새 서명 방식 추가 → 이전 주소들이
          새 PQC 주소로 옮길 시간 충분’ 이 표준 시나리오. Schnorr (BIP340) 가
          이미 Taproot 에 들어왔고, 그 위에 lattice 서명을 얹는 BIP 들이 학계
          / Bitcoin 메일링 리스트에서 활발히 논의 중. 실제 양자 컴퓨터가
          위협이 되기 한참 전에 마이그레이션할 시간이 있다는 것이 다수 의견이다.
        </p>
      </ReflectionPart>

      <ReflectionPart title="정리">
        <p>
          위협은 이론상 실재한다. 그러나 수십 년 단위의 시간축, 양자 하드웨어의
          물리적 한계, PQC 표준화의 진행 상황을 함께 보면 ‘비트코인이 곧
          쓸모없어진다’ 는 시나리오는 과장에 가깝다. 다만{" "}
          <span className="text-text">
            ‘잠자는’ 옛 주소 (재사용된 pubkey 가 노출된 주소)
          </span>{" "}
          는 실제 위협이 가까워졌을 때 가장 먼저 위험해질 수 있다. 그래서 지금
          할 수 있는 실용적인 대응은 주소를 매번 새로 쓰는 습관을 유지하고,
          양자 공격이 현실적인 위험이 되기 전에 자금을 PQC 기반 주소로 옮길
          준비를 하는 것이다.
        </p>
      </ReflectionPart>
    </Reflection>
  );
}
