"use client";

import { Term } from "../Term";

export const ScriptMeta = {
  id: "script" as const,
  title: "Script · 잠금/해제 미니 언어",
  oneLiner: "스택 기반 단순 언어. scriptPubKey 가 잠그고 scriptSig 가 푼다.",
};

export function ScriptBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        <Term id="utxo">UTXO</Term> 의 잠금은 일반 ‘주소 비교’ 가 아니라,
        작은 스크립트가 진실로 평가되는지 검증하는 방식. 트랜잭션 output 이
        잠금(script
        <code className="font-mono">PubKey</code>)을 정의하고, 이걸 쓰는
        input 이 푸는 증거(<code className="font-mono">scriptSig</code>)를
        제공한다. 두 스크립트를 이어 실행해 스택 끝에 ‘참’ 이 남으면 검증
        성공.
      </p>

      <Section title="① 가장 흔한 패턴 · P2PKH">
        <PatternBox
          termId="p2pkh"
          name="P2PKH (Pay-to-PubKey-Hash)"
          locker="OP_DUP OP_HASH160 <pubkeyhash> OP_EQUALVERIFY OP_CHECKSIG"
          unlocker="<sig> <pubkey>"
          desc="Alice 의 주소 = pubkeyhash. 이 주소로 받은 자금을 풀려면 그에 대응되는 pubkey 와 그 키로 만든 sig 를 제출해야 한다."
        />
      </Section>

      <Section title="② 스택 실행 추적 · 한 단계씩">
        <ExecTrace />
        <p className="text-sm text-muted">
          마지막에 스택에 <code className="font-mono">true</code> (정확히는 0
          이 아닌 값) 가 남으면 잠금 해제 성공. 한 OP 라도 거짓이거나 OP_VERIFY
          가 실패하면 즉시 invalid.
        </p>
      </Section>

      <Section title="③ 다른 흔한 패턴들">
        <OtherPatterns />
      </Section>

      <Section title="④ Script 의 의도된 한계">
        <p>
          반복문 없음, 함수 없음, Turing-incomplete. 일부러 표현력을 줄여 ‘각
          OP 의 비용이 정확히 예측 가능 + 무한 루프 불가능’ 을 보장. 이게
          이더리움처럼 임의 코드를 실행하는 모델과의 큰 차이.
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

function PatternBox({
  termId,
  name,
  locker,
  unlocker,
  desc,
}: {
  termId?: string;
  name: string;
  locker: string;
  unlocker: string;
  desc: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge font-mono text-[13px] text-accent2">
        {termId ? <Term id={termId}>{name}</Term> : name}
      </div>
      <div className="px-4 py-3 space-y-2.5">
        <div>
          <div className="text-xs text-muted font-mono mb-0.5">
            scriptPubKey (잠금, output 에 박힘)
          </div>
          <div className="font-mono text-[13px] text-accent break-all">
            {locker}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted font-mono mb-0.5">
            scriptSig (해제, 다음 input 에서 제공)
          </div>
          <div className="font-mono text-[13px] text-text/85 break-all">
            {unlocker}
          </div>
        </div>
        <div className="text-[13px] text-muted leading-relaxed pt-1">
          {desc}
        </div>
      </div>
    </div>
  );
}

type Step = {
  op: string;
  desc: string;
  stack: string[];
  invalid?: boolean;
};

function ExecTrace() {
  const steps: Step[] = [
    { op: "<sig>", desc: "scriptSig: sig 를 스택에 push", stack: ["<sig>"] },
    { op: "<pubkey>", desc: "scriptSig: pubkey 를 push", stack: ["<sig>", "<pubkey>"] },
    { op: "OP_DUP", desc: "스택 맨 위를 복제", stack: ["<sig>", "<pubkey>", "<pubkey>"] },
    { op: "OP_HASH160", desc: "맨 위에 RIPEMD160(SHA256(x)) 적용", stack: ["<sig>", "<pubkey>", "<H160(pubkey)>"] },
    { op: "<pubkeyhash>", desc: "잠금에 박힌 기대 hash 를 push", stack: ["<sig>", "<pubkey>", "<H160(pubkey)>", "<expected>"] },
    { op: "OP_EQUALVERIFY", desc: "두 값이 같으면 둘 다 pop, 다르면 즉시 fail", stack: ["<sig>", "<pubkey>"] },
    { op: "OP_CHECKSIG", desc: "sig 와 pubkey 로 서명 검증, 결과(0/1) push", stack: ["true"] },
  ];

  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1.4fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>op</div>
        <div>설명</div>
        <div>stack (after)</div>
      </div>
      <div className="divide-y divide-edge">
        {steps.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1.4fr] gap-3 px-4 py-2 items-start"
          >
            <div className="font-mono text-[13px] text-accent">{s.op}</div>
            <div className="text-[13px] text-text/85 leading-relaxed">
              {s.desc}
            </div>
            <div className="flex flex-wrap gap-1">
              {s.stack.map((it, j) => {
                const isTop = j === s.stack.length - 1;
                const isResult = it === "true";
                return (
                  <span
                    key={j}
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded border ${
                      isResult
                        ? "border-accent/60 bg-accent/10 text-accent"
                        : isTop
                          ? "border-accent2/50 text-accent2"
                          : "border-edge text-text/65"
                    }`}
                  >
                    {it}
                  </span>
                );
              })}
              {s.stack.length === 0 && (
                <span className="text-xs text-muted">(empty)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OtherPatterns() {
  const items: { termId?: string; name: string; desc: React.ReactNode; lock: string }[] = [
    {
      termId: "p2wpkh",
      name: "P2WPKH (SegWit v0)",
      desc: (
        <>
          P2PKH 의 <Term id="segwit">SegWit</Term> 버전. 서명을 ‘witness’
          영역으로 빼서 블록 무게 계산을 다르게 하고{" "}
          <Term id="malleability">malleability</Term> 를 막음.
        </>
      ),
      lock: "OP_0 <pubkeyhash>",
    },
    {
      termId: "p2sh",
      name: "P2SH (Pay-to-Script-Hash)",
      desc: "‘이 해시에 맞는 script 를 가진 사람이 그 script 를 만족시키면 풀린다’. 임의 잠금 조건을 외부 사용자가 짧은 주소 안에 숨길 수 있게 함.",
      lock: "OP_HASH160 <scripthash> OP_EQUAL",
    },
    {
      name: "Multisig",
      desc: "M-of-N 서명이 모이면 풀림. 공동 계정이나 콜드 키 분산에 쓰임.",
      lock: "<M> <pub1> <pub2> … <pubN> <N> OP_CHECKMULTISIG",
    },
    {
      termId: "p2tr",
      name: "P2TR (Taproot)",
      desc: (
        <>
          <Term id="schnorr">Schnorr 서명</Term> + 머클화된 script 트리.
          평소엔 단일 서명처럼 보이고, 복잡한 조건도 필요할 때만 노출.
        </>
      ),
      lock: "OP_1 <taproot output key>",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((it) => (
        <div
          key={it.name}
          className="rounded-sm border border-edge bg-surface/30 p-3.5"
        >
          <h4 className="text-[16px] font-medium text-accent2 leading-snug mb-2">
            {it.termId ? <Term id={it.termId}>{it.name}</Term> : it.name}
          </h4>
          <div className="text-[13px] text-text/85 leading-relaxed mb-2">
            {it.desc}
          </div>
          <div className="font-mono text-xs text-muted break-all">
            {it.lock}
          </div>
        </div>
      ))}
    </div>
  );
}
