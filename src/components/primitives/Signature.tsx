"use client";

import { Term } from "../Term";

export const SignatureMeta = {
  id: "signature" as const,
  title: "Digital signature (ECDSA)",
  oneLiner: "메시지 + 비밀키 → 서명. 누구든 공개키로 검증 가능.",
};

export function SignatureBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        Public-key 의 <Term id="trap-door">trap-door</Term> 가 ‘서명할
        권한’을 만든다. 비밀키 d 가 있는 사람만 메시지에 자기 ‘도장’을 찍을
        수 있고, 누구든 공개키 Q 로 그 도장이 진짜인지 검증한다. 비트코인
        트랜잭션은 이 서명으로 ‘이 자금을 풀 권한이 나에게 있다’를 증명한다.
      </p>

      <Section title="① 두 동작 · Sign / Verify">
        <SignVerifyDiagram />
        <p className="text-sm text-muted">
          서명 자체에 메시지는 들어있지 않다. 검증자는 메시지, 공개키, 서명 셋을
          모두 알아야 검증할 수 있고 결과는 true/false 둘 중 하나뿐이다.
        </p>
      </Section>

      <Section title="② ECDSA 내부 (간략)">
        <p>
          서명은 두 정수 <code className="font-mono">(r, s)</code> 로
          이루어진다. 서명할 때 무작위{" "}
          <Term id="nonce">nonce</Term>{" "}
          <code className="font-mono">k</code> 를 골라:
        </p>
        <FormulaBox>
          <div>
            <span className="text-muted">1.</span>{" "}
            R = k · G,{" "}
            <span className="text-accent">r = R.x mod n</span>
          </div>
          <div>
            <span className="text-muted">2.</span>{" "}
            <span className="text-accent">
              s = k⁻¹ · (H(msg) + r · d) mod n
            </span>
          </div>
          <div className="text-muted mt-2">서명 = (r, s)</div>
        </FormulaBox>
      </Section>

      <Section title="③ nonce 재사용은 곧 비밀키 누출">
        <p>
          ECDSA 의 보안은{" "}
          <span className="text-text">매 서명마다 새로운, 진짜 무작위 k</span>{" "}
          에 전적으로 의존한다. 같은 k 를 두 번만 써도 비밀키 d 가 평범한
          나눗셈으로 복원된다. ‘무작위성이 한 번 어긋나면 → 자산 전부 도난’.
        </p>

        <div className="rounded-sm border border-[#f76b6b]/40 bg-[#f76b6b]/[0.04] p-5 space-y-3">
          <h4 className="text-[16px] font-medium text-[#f76b6b] leading-snug">
            왜 한 번이면 끝나는가 · 대수적 도출
          </h4>
          <p className="text-[14px] text-text/85 leading-[1.7]">
            같은 k 로 두 메시지 m₁, m₂ 에 서명한 두 서명{" "}
            <code className="font-mono">(r, s₁), (r, s₂)</code> 가 있다고 하자
            (r 이 같은 건 k 가 같다는 뜻).
          </p>
          <FormulaBox>
            <div>
              s₁ = k⁻¹ (H(m₁) + r·d) mod n
            </div>
            <div>
              s₂ = k⁻¹ (H(m₂) + r·d) mod n
            </div>
            <div className="pt-2 text-muted">
              두 식을 빼서 d 를 분리:
            </div>
            <div>
              <span className="text-accent">
                k = (H(m₁) − H(m₂)) / (s₁ − s₂) mod n
              </span>
            </div>
            <div>
              <span className="text-accent">
                d = (s₁·k − H(m₁)) / r mod n
              </span>
            </div>
          </FormulaBox>
          <p className="text-[13px] text-text/70 leading-[1.65]">
            모듈러 역원 두 번이면 끝. 서명 두 개만 공개되어 있으면 누구든 d 를
            복원할 수 있다. 그 주소의 모든 자금에 즉시 접근.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[16px] font-medium text-text leading-snug">
            실제 사고들
          </h4>
          <Incident
            year="2010"
            title="Sony PS3 마스터 키 노출"
            body="Sony 가 PS3 펌웨어 서명에 매번 같은 k 를 썼다. 해킹 그룹 fail0verflow 가 발견 → 마스터 비밀키 추출 → 수정된 펌웨어를 정식 서명처럼 만들어 jailbreak 가능. Sony 의 가장 큰 보안 사고 중 하나."
          />
          <Incident
            year="2013-08"
            title="Android Bitcoin Wallet 일제 도난"
            body="Android 의 java.security.SecureRandom 버그로 일부 기기에서 같은 k 가 반복 생성. 거래소 BlockChain.info 등 Bitcoin 지갑 앱들이 영향. 약 55 BTC ($5,700 당시) 를 누군가가 자동 스크립트로 즉시 인출. 사후 RFC 6979 채택의 직접 계기."
          />
          <Incident
            year="2014~"
            title="크고 작은 ECDSA fault-injection 공격"
            body="HSM·하드웨어 지갑에 전압·클록 글리치를 주입해 의도적으로 같은 k 를 강제하는 연구. 키 추출 가능성 보고 다수."
          />
        </div>

        <div className="rounded-sm border border-accent/40 bg-accent/[0.04] p-5 space-y-3">
          <h4 className="text-[16px] font-medium text-accent leading-snug">
            현대 비트코인의 답 · RFC 6979 (deterministic nonce)
          </h4>
          <p className="text-[14px] text-text/85 leading-[1.7]">
            k 를 ‘난수 생성기’ 에 의지하지 않고{" "}
            <span className="text-text">k = HMAC-SHA256(d, H(m))</span> 식으로
            결정론적으로 도출. 같은 메시지 + 같은 키 = 같은 k 가 나오지만, 다른
            메시지엔 항상 다른 k. 난수 생성기 결함이 있어도 영향 없음. Bitcoin
            Core, libsecp256k1, 거의 모든 modern 지갑이 채택. Schnorr (BIP340) 는
            아예 nonce 결정성을 사양에 박아 두었다.
          </p>
        </div>
      </Section>

      <Section title="④ Verify">
        <FormulaBox>
          <div>w = s⁻¹ mod n</div>
          <div>u₁ = H(msg) · w mod n</div>
          <div>u₂ = r · w mod n</div>
          <div>P = u₁ · G + u₂ · Q</div>
          <div className="text-accent mt-1">P.x ≡ r (mod n) 이면 valid</div>
        </FormulaBox>
        <p className="text-sm text-muted">
          d 없이 P.x 를 r 에 맞추는 건{" "}
          <Term id="ecdlp">ECDLP</Term> 를 푸는 것과 동치이므로 사실상
          불가능.
        </p>
      </Section>

      <Section title="⑤ 비트코인에서 무엇이 서명되나">
        <p>
          input 마다 한 서명. 서명되는 메시지는 ‘이 트랜잭션 자체’. 단,
          서명 필드를 비운 채 직렬화한 뒤{" "}
          <Term id="double-sha256">
            <code className="font-mono">double-SHA256</code>
          </Term>{" "}
          한 값. 서명을 다른 트랜잭션에 옮기면 그쪽 메시지 해시가 달라지므로
          검증이 실패한다. 서명은 그 트랜잭션 하나에만 유효.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
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

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 font-mono text-[13px] space-y-1.5 leading-relaxed">
      {children}
    </div>
  );
}

function Incident({
  year,
  title,
  body,
}: {
  year: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-l-2 border-[#f76b6b]/40 pl-5 py-1 space-y-1.5">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-mono text-[12px] tracking-[0.1em] text-[#f76b6b]">
          {year}
        </span>
        <h4 className="text-[16px] font-medium text-text leading-snug">{title}</h4>
      </div>
      <p className="text-[14px] text-text/75 leading-[1.7]">{body}</p>
    </div>
  );
}

function SignVerifyDiagram() {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 480 200"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="sigArrow"
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

        <text
          x="120"
          y="20"
          textAnchor="middle"
          fontSize="11"
          fill="#5b8def"
          fontFamily="JetBrains Mono"
          fontWeight="500"
        >
          SIGN (Alice)
        </text>
        <Pill x={50} y={45} w={60} h={26} text="msg" tone="muted" />
        <Pill x={130} y={45} w={60} h={26} text="d (priv)" tone="warn" />
        <Box x={70} y={92} w={100} h={32} text="Sign()" tone="accent2" />
        <Pill x={80} y={150} w={80} h={28} text="sig (r, s)" tone="accent" />
        <line
          x1="80"
          y1="71"
          x2="100"
          y2="92"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />
        <line
          x1="160"
          y1="71"
          x2="140"
          y2="92"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />
        <line
          x1="120"
          y1="124"
          x2="120"
          y2="150"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />

        <line
          x1="240"
          y1="20"
          x2="240"
          y2="180"
          stroke="#1c1f27"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        <text
          x="360"
          y="20"
          textAnchor="middle"
          fontSize="11"
          fill="#f7931a"
          fontFamily="JetBrains Mono"
          fontWeight="500"
        >
          VERIFY (everyone)
        </text>
        <Pill x={270} y={45} w={50} h={26} text="msg" tone="muted" />
        <Pill x={335} y={45} w={50} h={26} text="sig" tone="accent" />
        <Pill x={400} y={45} w={50} h={26} text="Q" tone="accent" />
        <Box x={310} y={92} w={100} h={32} text="Verify()" tone="accent2" />
        <Pill x={320} y={150} w={80} h={28} text="true / false" />
        <line
          x1="295"
          y1="71"
          x2="335"
          y2="92"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />
        <line
          x1="360"
          y1="71"
          x2="360"
          y2="92"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />
        <line
          x1="425"
          y1="71"
          x2="385"
          y2="92"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />
        <line
          x1="360"
          y1="124"
          x2="360"
          y2="150"
          stroke="#7a8190"
          strokeWidth="1"
          markerEnd="url(#sigArrow)"
        />
      </svg>
    </div>
  );
}

function Pill({
  x,
  y,
  w,
  h,
  text,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  tone?: "muted" | "accent" | "accent2" | "warn";
}) {
  const stroke =
    tone === "accent"
      ? "#f7931a"
      : tone === "accent2"
        ? "#5b8def"
        : tone === "warn"
          ? "#f76b6b"
          : "#3a3f4a";
  const fill =
    tone === "accent"
      ? "#f7931a18"
      : tone === "accent2"
        ? "#5b8def18"
        : tone === "warn"
          ? "#f76b6b18"
          : "#101218";
  const textColor =
    tone === "accent"
      ? "#f7931a"
      : tone === "accent2"
        ? "#5b8def"
        : tone === "warn"
          ? "#f76b6b"
          : "#e6e8ec";
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
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="11"
        fill={textColor}
        fontFamily="JetBrains Mono"
      >
        {text}
      </text>
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  text,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  tone?: "accent2";
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
       
        fill="#0d0f14"
        stroke={tone === "accent2" ? "#5b8def" : "#3a3f4a"}
        strokeWidth="1.2"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        fill="#e6e8ec"
        fontFamily="JetBrains Mono"
      >
        {text}
      </text>
    </g>
  );
}
