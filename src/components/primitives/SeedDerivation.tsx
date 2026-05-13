"use client";

import { Term } from "../Term";

export const SeedDerivationMeta = {
  id: "seed-derivation" as const,
  title: "Seed phrase & key derivation (BIP39 + BIP32)",
  oneLiner: "12-24 단어 한 줄에서 시작해 결정론적으로 무한히 많은 키를 만든다.",
};

export function SeedDerivationBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        지금까지 본 ‘비밀키 한 개 → 주소 한 개’ 는 단순화된 모형. 실제
        지갑은 한 시드 문구에서 출발해 트리 모양으로 자식 키를 무한히 만들어낸다.
        그래서 <span className="text-text">한 줄의 백업</span> 으로 모든 자금이
        복원된다. Sparrow, Electrum, Ledger, Trezor 같은 비트코인 지갑들은 같은{" "}
        <Term id="bip">BIP</Term> 표준{" "}
        <Term id="bip39">
          <code className="font-mono text-accent">BIP39</code>
        </Term>{" "}
        +{" "}
        <Term id="bip32">
          <code className="font-mono text-accent">BIP32</code>
        </Term>{" "}
        를 따른다.
      </p>

      <Section
        title={
          <>
            ① <Term id="bip39">BIP39</Term> · 12 또는 24 단어로 entropy 표현
          </>
        }
      >
        <Bip39Example />
        <p>
          단어 사전은 영어 2048 개 (
          <code className="font-mono">log₂ 2048 = 11</code> bit / 단어). 그래서:
        </p>
        <BitMath />
      </Section>

      <Section title="② Seed → master key (PBKDF2 + HMAC-SHA512)">
        <SeedFlow />
        <p className="text-sm text-muted">
          <Term id="pbkdf2">PBKDF2</Term> 의 2048 rounds 는 brute-force
          비용을 의도적으로 키운다. 만약{" "}
          <code className="font-mono">passphrase</code> (BIP39 의 25 번째
          단어) 를 더 입력하면 같은 12 단어라도 완전히 다른 seed 가
          만들어진다 (추가 보안 layer).
        </p>
      </Section>

      <Section
        title={
          <>
            ③ <Term id="bip32">BIP32</Term> · 한 부모 키에서 자식 키를 결정론적으로
          </>
        }
      >
        <DerivationTree />
        <p>
          각 자식 키는{" "}
          <code className="font-mono">
            child ={" "}
            <Term id="hmac-sha512">HMAC-SHA512</Term>(parent_chain_code,
            parent_pubkey ‖ index)
          </code>{" "}
          식으로 계산. 같은 부모 + 같은 index → 항상 같은 자식. 인덱스가
          다르면 전혀 다른 키.
        </p>
      </Section>

      <Section
        title={
          <>
            ④ Derivation path 표준 (<Term id="bip44">BIP44</Term>)
          </>
        }
      >
        <PathExample />
      </Section>

      <Section title="⑤ 왜 모든 지갑이 이걸 쓰는가">
        <ul className="space-y-1.5 text-sm">
          <Bullet>
            <span className="text-text">한 시드 문구만 백업.</span> 기기 망가져도
            12 단어만 살아 있으면 다른 지갑에서 복원.
          </Bullet>
          <Bullet>
            <span className="text-text">호환성.</span> Sparrow 의 시드 문구를
            다른 비트코인 지갑에 입력해도 같은 주소들이 복원된다 (단, 같은
            derivation path 를 쓸 때).
          </Bullet>
          <Bullet>
            <span className="text-text">프라이버시.</span> 매 트랜잭션마다 새
            주소를 생성해서 한 사람이 받은 금액을 외부에서 합산하기 어렵게.
          </Bullet>
          <Bullet>
            <span className="text-text">계정 분리.</span> 같은 지갑 안에서 여러
            account 를 따로 운영 (개인용/사업용 등).
          </Bullet>
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-1 h-4 rounded-sm bg-accent2" />
        <div className="text-[14px] font-medium text-text">{title}</div>
      </div>
      {children}
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

const TEST_WORDS = [
  "river",
  "orange",
  "glass",
  "planet",
  "silver",
  "market",
  "winter",
  "canvas",
  "rocket",
  "forest",
  "paper",
  "demo-only",
];

function Bip39Example() {
  return (
    <div className="space-y-3">
      <div className="border-l-2 border-[#f76b6b] bg-[#f76b6b]/[0.06] p-4 space-y-2">
        <div className="text-[14px] font-medium text-[#f76b6b] leading-snug">
          ⚠ 화면용 더미 시드 문구 · 실제 지갑에서 복원되지 않음
        </div>
        <p className="text-[13px] text-text/85 leading-[1.7]">
          아래 단어들은 BIP39 흐름을 설명하기 위한 더미 예시다. 일부러 실제
          지갑에서 복원 가능한 mnemonic 으로 맞추지 않았다. 공개된 테스트 벡터나
          인터넷에 올라온 시드 문구를 실제 지갑에 넣는 순간, 그 지갑은 사실상
          누구나 열 수 있는 지갑이 된다.
        </p>
        <p className="text-[13px] text-text/85 leading-[1.7]">
          넓혀 말해 <span className="text-text">인터넷·블로그·튜토리얼·YouTube·
          ChatGPT 화면</span> 어디에든 공개된 시드 문구는 그 순간{" "}
          <span className="text-text">‘공유 자산’</span> 으로 간주된다. 실제
          지갑의 시드 문구는 직접 생성한 직후 종이에 손으로 적고 화면에
          남기지 않는 것이 표준이다. 절대로 누군가에게 보여주거나 입력하라고
          시키지 않는다. 정상적인 지원·서비스라면 절대 그걸 요구하지 않는다.
        </p>
      </div>
      <div className="border border-edge bg-surface/30 p-4 space-y-3">
        <div className="text-[13px] text-muted font-semibold">
          더미 시드 문구 · 12 단어 (복원 불가)
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono text-sm">
          {TEST_WORDS.map((w, i) => (
            <div
              key={i}
              className="border border-edge bg-bg/60 px-2.5 py-1.5 flex items-baseline gap-2"
            >
              <span className="text-xs text-muted">{i + 1}.</span>
              <span className="text-text/85">{w}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted leading-relaxed">
          실제 BIP39 mnemonic 은 2048단어 사전에서 고른 단어와 checksum 이 함께
          맞아야 한다. 같은 유효 mnemonic 은 호환 지갑 어디에서든 같은 master
          seed 와 주소들을 복원한다. 그래서 실제 시드 문구는 곧 자산이다.
        </div>
      </div>

      <BrainWalletCase />
    </div>
  );
}

function BrainWalletCase() {
  return (
    <div className="border border-[#f76b6b]/40 bg-[#f76b6b]/[0.04] p-5 space-y-3">
      <div className="flex items-baseline gap-2 flex-wrap">
        <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#cdb7ff]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b58cff]" />
          사례 · 관련 연구
        </div>
        <h4 className="text-[16px] font-medium text-text leading-snug">
          “Cracking Cryptocurrency Brainwallets” · DEF CON 23 (2015)
        </h4>
      </div>

      <p className="text-[14px] text-text/85 leading-[1.7]">
        Ryan Castellucci 가 만든{" "}
        <a
          href="https://github.com/ryancdotorg/brainflayer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent2 hover:text-accent border-b border-dotted border-accent2/40 hover:border-accent/60 transition-colors font-mono"
        >
          brainflayer
        </a>{" "}
        는{" "}
        <span className="text-text">brain wallet</span> · ‘외우기 쉬운 문장을
        해시해 비밀키로 쓰는’ 자가-생성 지갑 · 을 대규모로 brute-force 하는
        도구. 발표 당시 GitHub 코드와 Twitter timeline, 유명 영문 명언집, song
        lyrics, Bitcoin 메일링 리스트의 영어 문장까지 사전으로 돌려 수만 개의
        brain wallet 을 깨고 그 안의 자금 흐름을 추적했다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
        <div className="border border-edge bg-surface/40 p-3 space-y-1.5">
          <div className="text-[13px] font-semibold text-muted">
            관측 결과
          </div>
          <ul className="space-y-1 text-text/85 leading-[1.7]">
            <li>· brain wallet 에 BTC 가 들어오는 즉시 자동 인출 봇 가동 중</li>
            <li>· ‘password’, ‘bitcoin’, 영문 명언, song lyric 류는 분 단위로 털림</li>
            <li>· 본인이 “남들은 안 떠올릴 문구” 라고 믿는 것조차 대부분 깨짐</li>
          </ul>
        </div>
        <div className="border border-edge bg-surface/40 p-3 space-y-1.5">
          <div className="text-[13px] font-semibold text-muted">
            왜 이렇게 약한가
          </div>
          <ul className="space-y-1 text-text/85 leading-[1.7]">
            <li>· 사람이 떠올리는 문장의 실효 엔트로피는 보통 30-40 bit 미만</li>
            <li>· 30 bit 면 2³⁰ ≈ 10 억 회 · 노트북으로 분 단위 brute-force</li>
            <li>· 반면 표준 BIP39 12 단어 = 128 bit · 같은 brute-force 가 우주 시간</li>
          </ul>
        </div>
      </div>

      <div className="text-[13px] text-text/75 leading-[1.7] border-t border-[#f76b6b]/20 pt-3">
        교훈 · ‘직접 생각해서 만든 시드 문구’ 같은 자작 보안은 어떤 형태든{" "}
        <span className="text-text">반드시 털린다</span>. 공격자는 24/7 자동화된
        스크립트로 새 주소를 스캔하고 약한 키를 즉시 인출한다. 자기 손으로 키를
        만들거나, 사람이 외우기 쉬운 입력을 비밀로 쓰는 어떤 방식이든 안전하지
        않다. 표준 BIP39 단어 시드 문구는{" "}
        <span className="text-text">제대로 만들어진 RNG</span> (지갑 앱·하드웨어
        지갑이 내부에서 생성) 에서 나와야 한다.{" "}
        <a
          href="https://www.youtube.com/watch?v=foil0hzl4Pg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent2 hover:text-accent border-b border-dotted border-accent2/40 hover:border-accent/60 transition-colors"
        >
          DEF CON 23 발표 영상 ↗
        </a>
      </div>
    </div>
  );
}

function BitMath() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 font-mono text-[13px] space-y-2 leading-relaxed">
      <div>
        <span className="text-muted">12 단어:</span> 12 × 11 bit ={" "}
        <span className="text-accent">132 bit</span> ={" "}
        <span className="text-text">128 bit entropy + 4 bit checksum</span>
      </div>
      <div>
        <span className="text-muted">24 단어:</span> 24 × 11 bit ={" "}
        <span className="text-accent">264 bit</span> ={" "}
        <span className="text-text">256 bit entropy + 8 bit checksum</span>
      </div>
      <div className="text-xs text-muted pt-1">
        checksum = entropy 를 SHA256 한 결과의 앞 N bit. 단어 하나만 잘못 적어도
        검증 실패.
      </div>
    </div>
  );
}

function SeedFlow() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 480 220"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="seedArrow"
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

        <FlowBox x={140} y={10} w={200} h={36} title="12 단어 시드 문구" sub="river orange glass … demo-only" tone="accent2" />

        <line
          x1={240}
          y1={50}
          x2={240}
          y2={86}
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#seedArrow)"
        />
        <text
          x={250}
          y={70}
          fontSize="11"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          PBKDF2-HMAC-SHA512
        </text>
        <text
          x={250}
          y={82}
          fontSize="10"
          fill="#5a6070"
          fontFamily="JetBrains Mono"
        >
          2048 rounds
        </text>

        <FlowBox x={140} y={92} w={200} h={36} title="64-byte seed" sub="hex string · 512 bit" />

        <line
          x1={240}
          y1={132}
          x2={240}
          y2={168}
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#seedArrow)"
        />
        <text
          x={250}
          y={146}
          fontSize="11"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          HMAC-SHA512
        </text>
        <text
          x={250}
          y={158}
          fontSize="10"
          fill="#5a6070"
          fontFamily="JetBrains Mono"
        >
          key: Bitcoin seed
        </text>

        <FlowBox x={20} y={174} w={200} h={36} title="master key (32 B)" sub="m → 모든 자식 키의 출발점" tone="accent" />
        <FlowBox x={260} y={174} w={200} h={36} title="chain code (32 B)" sub="자식 키 파생 시 같이 쓰임" />
      </svg>
    </div>
  );
}

function FlowBox({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  tone?: "accent" | "accent2";
}) {
  const stroke =
    tone === "accent" ? "#f7931a" : tone === "accent2" ? "#5b8def" : "#3a3f4a";
  const fill =
    tone === "accent"
      ? "#f7931a15"
      : tone === "accent2"
        ? "#5b8def15"
        : "#0d0f14";
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
        y={y + 16}
        textAnchor="middle"
        fontSize="12"
        fill="#e6e8ec"
        fontFamily="JetBrains Mono"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + 30}
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

function DerivationTree() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 font-mono text-[13px] leading-[1.7]">
      <div>
        <span className="text-accent">m</span>{" "}
        <span className="text-muted">(master extended key)</span>
      </div>
      <div className="pl-4">
        <span className="text-muted">└─</span> m/44<span className="text-accent">'</span>{" "}
        <span className="text-muted">(purpose · BIP44)</span>
      </div>
      <div className="pl-8">
        <span className="text-muted">└─</span> m/44'/0<span className="text-accent">'</span>{" "}
        <span className="text-muted">(coin = BTC mainnet)</span>
      </div>
      <div className="pl-12">
        <span className="text-muted">└─</span> m/44'/0'/0<span className="text-accent">'</span>{" "}
        <span className="text-muted">(account 0)</span>
      </div>
      <div className="pl-16">
        <span className="text-muted">├─</span> m/44'/0'/0'/0{" "}
        <span className="text-muted">(receive chain)</span>
      </div>
      <div className="pl-20">
        <span className="text-muted">├─</span> m/44'/0'/0'/0/0 →{" "}
        <span className="text-accent">bc1q…</span>{" "}
        <span className="text-muted">첫 수신 주소</span>
      </div>
      <div className="pl-20">
        <span className="text-muted">├─</span> m/44'/0'/0'/0/1 →{" "}
        <span className="text-text/80">bc1q…</span>{" "}
        <span className="text-muted">두 번째 수신 주소</span>
      </div>
      <div className="pl-20">
        <span className="text-muted">└─</span>{" "}
        <span className="text-muted">… 무한히</span>
      </div>
      <div className="pl-16">
        <span className="text-muted">└─</span> m/44'/0'/0'/1{" "}
        <span className="text-muted">(change chain · 잔돈 받는 주소들)</span>
      </div>
    </div>
  );
}

function PathExample() {
  const parts: { label: string; desc: string }[] = [
    { label: "44'", desc: "purpose, BIP44 표준" },
    { label: "0'", desc: "coin type, 0 = BTC mainnet" },
    { label: "0'", desc: "account, 사용자 내부 분리" },
    { label: "0", desc: "change, 0 = 수신 / 1 = 잔돈" },
    { label: "0", desc: "address index, 0, 1, 2 …" },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-3">
      <div className="font-mono text-base text-text/85 text-center py-2">
        m / 44<span className="text-accent">'</span> / 0
        <span className="text-accent">'</span> / 0
        <span className="text-accent">'</span> / 0 / 0
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {parts.map((p, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-3 px-3 py-2 rounded border border-edge bg-bg/60"
          >
            <div className="font-mono text-accent2">{p.label}</div>
            <div className="text-text/85 text-[13px]">{p.desc}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted leading-relaxed pt-1">
        <code className="font-mono text-text">'</code> 는{" "}
        <Term id="hardened">hardened</Term> (정수 ≥ 2³¹). hardened 자식은
        부모 공개키를 알아도 자식 키를 만들 수 없다 (보안 계층 추가).
      </div>
    </div>
  );
}
