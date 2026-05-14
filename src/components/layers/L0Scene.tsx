"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gateKey } from "@/lib/layers";
import { Reflection } from "../Reflection";
import type { LayerProps } from "../LayerStack";

type FieldKey = "from" | "to" | "amount" | "sign";

type FieldDef = {
  key: FieldKey;
  label: string;
  koLabel: string;
  cta: string;
  primary: string;
  secondary?: string;
  placeholder: string;
  whyTitle: string;
  whyBody: React.ReactNode;
  deepLink: string;
};

const FIELDS: FieldDef[] = [
  {
    key: "from",
    label: "From",
    koLabel: "발신자",
    cta: "Alice의 주소",
    primary: "Alice의 주소",
    secondary: "bc1qy2u5g8wzdkpgr96fkr5j7lr3dqp4hagnks3l8c",
    placeholder: "발신자",
    whyTitle: "주소는 ‘이름’ 이 아니라 키쌍에서 나온 문자열",
    whyBody: (
      <>
        Alice 라는 사람이 따로 등록되는 게 아니다. 대표적인 P2WPKH 주소에서는
        ECDSA 키쌍의 <span className="text-text">공개키 해시</span> 에
        네트워크 정보와 체크섬을 붙인 문자열이 주소다. 그에 대응되는 비밀키를
        가진 사람만 그 주소의 자금을 쓸 수 있다.
      </>
    ),
    deepLink: "S1 · Keys & Address",
  },
  {
    key: "to",
    label: "To",
    koLabel: "수신자",
    cta: "Bob의 주소",
    primary: "Bob의 주소",
    secondary: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    placeholder: "수신자",
    whyTitle: "받는 사람이 자기 주소를 미리 알려줘야 한다",
    whyBody: (
      <>
        Bob 이 송금자에게 자기 주소를 미리 알려줘야 한다. 한 사람이 여러
        주소를 만들어 쓰는 게 보통이다 (프라이버시 + 회계). 같은 키쌍에서{" "}
        <span className="text-text">결정론적으로 무수히 파생</span> 할 수
        있다.
      </>
    ),
    deepLink: "S2 · Seed & Wallet Types",
  },
  {
    key: "amount",
    label: "Amount",
    koLabel: "금액",
    cta: "1 BTC",
    primary: "1.0000 BTC",
    placeholder: "금액",
    whyTitle: "Alice 가 정말로 1 BTC 를 갖고 있는지 시스템은 어떻게 확인할까?",
    whyBody: (
      <>
        그건 보장되지 않는다. <span className="text-text">시스템이 직접 검증한다</span>.
        비트코인은 ‘잔액’ 이 아니라 ‘아직 안 쓴 출력’ (UTXO) 들의 모음을 본다.
        Alice 가 풀 수 있는 UTXO 합이 1 BTC + 수수료 이상이어야 통과한다.
      </>
    ),
    deepLink: "S4 · UTXO",
  },
  {
    key: "sign",
    label: "Signature",
    koLabel: "서명",
    cta: "Alice의 서명",
    primary: "Alice의 서명",
    secondary: "3044 02 20 5d4e8c2a1b…",
    placeholder: "도장",
    whyTitle: "‘서명’ = Alice 만 만들 수 있고, 누구든 검증 가능한 도장",
    whyBody: (
      <>
        Alice 의 비밀키만이 이 메시지에 대한 유효한 서명을 만들 수 있다.
        그러나 누구든 Alice 의 공개키로{" "}
        <span className="text-text">진짜인지 검증</span>할 수 있다. 한 메시지에
        만든 서명은 그 트랜잭션 한 건에만 유효하며 다른 곳에 재사용할 수 없다.
      </>
    ),
    deepLink: "S3 · Transaction · ECDSA",
  },
];

const VIEW_W = 720;
const VIEW_H = 160;
const ALICE_X = 110;
const BOB_X = 610;
const Y = 80;

export function L0Scene({ onEnter }: LayerProps) {
  const [filled, setFilled] = useState<Set<FieldKey>>(new Set());
  const [activeDetail, setActiveDetail] = useState<FieldKey | null>(null);
  const [coinFlying, setCoinFlying] = useState(false);
  const [bobFlash, setBobFlash] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);
  const postRef = useRef<HTMLDivElement | null>(null);

  const allFilled = FIELDS.every((f) => filled.has(f.key));
  const detailField = FIELDS.find((f) => f.key === activeDetail) ?? null;
  const nextKey: FieldKey | null =
    FIELDS.find((f) => !filled.has(f.key))?.key ?? null;

  function clickField(key: FieldKey) {
    // 이미 채워진 칸은 자유롭게 detail 재선택 가능
    if (filled.has(key)) {
      setActiveDetail(key);
      return;
    }
    // 미채움 칸은 ‘다음 차례’ 만 클릭 허용
    if (key !== nextKey) return;
    setFilled((s) => {
      const next = new Set(s);
      next.add(key);
      return next;
    });
    setActiveDetail(key);
  }

  function broadcast() {
    if (!allFilled || coinFlying || broadcasted) return;
    setCoinFlying(true);
    setTimeout(() => {
      setBobFlash(true);
      setCoinFlying(false);
      setBroadcasted(true);
      setTimeout(() => setBobFlash(false), 500);
    }, 1300);
  }

  useEffect(() => {
    if (broadcasted) {
      requestAnimationFrame(() => {
        postRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [broadcasted]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 pt-12 pb-3 shrink-0">
        <div className="text-[12px] text-muted font-medium">
          S0
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-semibold leading-[1.12] tracking-tight mt-3">
          Alice → Bob
        </h1>
        <p className="text-[17px] text-text/70 mt-3 max-w-2xl leading-[1.65]">
          비트코인 송금은 결국 한 통의{" "}
          <span className="text-text">서명된 메시지</span>를 만드는 일이다. 그
          메시지에는 보내는 사람, 받는 사람, 금액, 서명이 들어간다. 아래의
          ‘?’ 칸을 하나씩 눌러 각 요소가 왜 필요한지 확인해보자.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 pt-4 pb-6 shrink-0 flex justify-center">
        <Scene
          filled={filled}
          coinFlying={coinFlying}
          bobFlash={bobFlash}
          allFilled={allFilled}
          broadcasted={broadcasted}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] gap-5">
          <ExploreGrid
            filled={filled}
            nextKey={nextKey}
            activeDetail={activeDetail}
            onFieldClick={clickField}
            canBroadcast={allFilled}
            broadcasted={broadcasted}
            onBroadcast={broadcast}
          />
          <DetailPanel field={detailField} />
        </div>

        <AnimatePresence>
          {broadcasted && (
            <motion.div
              ref={postRef}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <PostBroadcast
                onEnter={() => onEnter("S1", gateKey("S0", "S1"))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Scene({
  filled,
  coinFlying,
  bobFlash,
  allFilled,
  broadcasted,
}: {
  filled: Set<FieldKey>;
  coinFlying: boolean;
  bobFlash: boolean;
  allFilled: boolean;
  broadcasted: boolean;
}) {
  const hasFrom = filled.has("from");
  const hasTo = filled.has("to");
  const hasAmount = filled.has("amount");
  const hasSign = filled.has("sign");

  const aliceColor = hasFrom ? "#5b8def" : "#3a3f4a";
  const bobColor =
    broadcasted || bobFlash
      ? "#f7931a"
      : hasTo
        ? "#5b8def"
        : "#3a3f4a";

  const lineColor = broadcasted
    ? "#f7931a55"
    : hasFrom && hasTo
      ? "#5b8def55"
      : "#2a2f3a";

  const middleLabel = broadcasted
    ? "✓ sent"
    : allFilled
      ? "ready to send"
      : hasAmount
        ? "1 BTC"
        : "?";

  const middleColor =
    broadcasted || allFilled
      ? "#f7931a"
      : hasAmount
        ? "#f7931abb"
        : "#5a6070";

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}`, maxWidth: 560 }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.line
          x1={ALICE_X + 52}
          y1={Y}
          x2={BOB_X - 52}
          y2={Y}
          animate={{ stroke: lineColor }}
          transition={{ duration: 0.3 }}
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
        <motion.text
          x={(ALICE_X + BOB_X) / 2}
          y={Y - 18}
          textAnchor="middle"
          fontSize="14"
          animate={{ fill: middleColor }}
          transition={{ duration: 0.3 }}
          fontFamily="JetBrains Mono"
        >
          {middleLabel}
        </motion.text>
        <AnimatePresence>
          {coinFlying && (
            <motion.circle
              key="coin"
              initial={{ cx: ALICE_X + 52, cy: Y, opacity: 0 }}
              animate={{ cx: BOB_X - 52, cy: Y, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: [0.4, 0, 0.6, 1] }}
              r="7"
              fill="#f7931a"
            />
          )}
        </AnimatePresence>
      </svg>
      <Avatar
        x={ALICE_X}
        name="Alice"
        color={aliceColor}
        active={hasFrom}
        seal={hasSign}
      />
      <Avatar
        x={BOB_X}
        name="Bob"
        color={bobColor}
        scale={bobFlash ? 1.08 : 1}
        active={hasTo || broadcasted}
      />
    </div>
  );
}

function ExploreGrid({
  filled,
  nextKey,
  activeDetail,
  onFieldClick,
  canBroadcast,
  broadcasted,
  onBroadcast,
}: {
  filled: Set<FieldKey>;
  nextKey: FieldKey | null;
  activeDetail: FieldKey | null;
  onFieldClick: (key: FieldKey) => void;
  canBroadcast: boolean;
  broadcasted: boolean;
  onBroadcast: () => void;
}) {
  const nextField = nextKey ? FIELDS.find((f) => f.key === nextKey) : null;
  return (
    <div className="space-y-4 h-fit">
      <ProgressStrip filled={filled} />
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <FieldCard
            key={f.key}
            field={f}
            filled={filled.has(f.key)}
            isNext={!filled.has(f.key) && f.key === nextKey}
            disabled={!filled.has(f.key) && f.key !== nextKey}
            highlighted={activeDetail === f.key}
            onClick={() => onFieldClick(f.key)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="text-[13px] text-muted">
          {broadcasted
            ? "전송 완료"
            : canBroadcast
              ? "네 칸 모두 채워짐 · 송금 준비 완료"
              : nextField
                ? (
                    <>
                      다음 · <span className="text-accent">{nextField.koLabel}</span> 칸을 눌러보자
                    </>
                  )
                : ""}
        </div>
        <button
          type="button"
          onClick={onBroadcast}
          disabled={!canBroadcast || broadcasted}
          className={`font-mono text-[13px] px-5 py-2 border uppercase tracking-[0.16em] transition-colors ${
            canBroadcast && !broadcasted
              ? "border-accent bg-accent text-bg hover:bg-accent/90"
              : "border-edge bg-bg/40 text-muted cursor-not-allowed"
          }`}
        >
          ▶ Send
        </button>
      </div>
    </div>
  );
}

function ProgressStrip({ filled }: { filled: Set<FieldKey> }) {
  return (
    <div className="border border-edge bg-surface/30 px-3 py-2.5 space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[11px] tracking-[0.14em] text-muted">
          진행 · {filled.size} / {FIELDS.length}
        </div>
        <div className="font-mono text-[11px] text-muted/70 tracking-wide">
          {FIELDS.map((f) => (filled.has(f.key) ? "■" : "□")).join(" ")}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {FIELDS.map((f) => (
          <span
            key={f.key}
            className={`flex-1 h-1 transition-colors ${
              filled.has(f.key) ? "bg-accent" : "bg-edge"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FieldCard({
  field,
  filled,
  isNext,
  disabled,
  highlighted,
  onClick,
}: {
  field: FieldDef;
  filled: boolean;
  isNext: boolean;
  disabled: boolean;
  highlighted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative border text-left min-h-[156px] p-4 transition-all duration-200 flex flex-col gap-2.5 ${
        highlighted
          ? "border-accent bg-accent/[0.05]"
          : filled
            ? "border-edge bg-bg hover:border-accent/45 cursor-pointer"
            : isNext
              ? "border-accent/70 bg-accent/[0.04] hover:bg-accent/[0.08] cursor-pointer"
              : "border-edge/30 bg-bg/30 opacity-40 cursor-not-allowed"
      }`}
    >
      {isNext && (
        <div className="absolute -top-[9px] left-3 px-1.5 py-0.5 bg-bg border border-accent text-accent font-mono text-[10px] tracking-[0.16em]">
          NEXT
        </div>
      )}
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[14px] font-medium text-text/90">
          {field.koLabel}
        </div>
        <div className="font-mono text-[11px] tracking-[0.14em] text-muted/85 uppercase">
          {field.label}
        </div>
      </div>
      <div className="flex-1 flex items-start">
        {filled ? (
          <FieldValue field={field} highlighted={highlighted} />
        ) : isNext ? (
          <PulsingMark />
        ) : (
          <DimMark />
        )}
      </div>
    </button>
  );
}

function FieldValue({
  field,
  highlighted,
}: {
  field: FieldDef;
  highlighted: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-1 w-full"
    >
      <div
        className={`text-[15px] font-medium leading-snug ${
          highlighted ? "text-accent" : "text-text"
        }`}
      >
        {field.primary}
      </div>
      {field.secondary && (
        <div className="font-mono text-[11.5px] text-muted/85 break-all leading-snug">
          {field.secondary}
        </div>
      )}
    </motion.div>
  );
}

function PulsingMark() {
  return (
    <motion.div
      animate={{ opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="text-[44px] text-accent font-mono leading-none"
    >
      ?
    </motion.div>
  );
}

function DimMark() {
  return (
    <div className="text-[44px] text-muted/25 font-mono leading-none">?</div>
  );
}

function DetailPanel({ field }: { field: FieldDef | null }) {
  return (
    <div className="border border-edge bg-surface/20 flex flex-col h-full min-h-[300px]">
      <div className="px-5 py-3.5 border-b border-edge flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-baseline gap-2.5 min-w-0">
          {field ? (
            <>
              <span className="font-mono text-[11px] tracking-[0.18em] text-accent2/80 uppercase shrink-0">
                {field.label}
              </span>
              <span className="text-muted/40 shrink-0">·</span>
              <span className="text-[13px] text-text/85">무엇인가</span>
            </>
          ) : (
            <span className="text-[13px] text-text/75">각 칸에 대한 설명</span>
          )}
        </div>
        {field && (
          <div className="text-[11px] text-accent2/85 font-mono shrink-0">
            ↓ {field.deepLink}
          </div>
        )}
      </div>
      <div className="px-5 py-5 flex-1 relative">
        <AnimatePresence mode="wait">
          {field ? (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-3"
            >
              <h3 className="text-[17px] font-medium text-text leading-snug">
                {field.whyTitle}
              </h3>
              <div className="text-[14px] text-text/75 leading-[1.75]">
                {field.whyBody}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-[14px] text-text/75 leading-[1.75]">
                왼쪽의 ‘?’ 칸 하나를 골라 눌러보자. 그 칸이 무엇이고 왜 필요한지
                여기에 펼쳐진다.
              </p>
              <p className="text-[13px] text-muted/85 leading-[1.7]">
                위의 그림은 클릭할 때마다 한 부분씩 살아난다. 네 칸을 다 채우면
                메시지가 완성되어 송금 버튼이 켜진다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PostBroadcast({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="space-y-5 pt-6 border-t border-edge">
      <div>
        <div className="text-[13px] text-text/70 font-medium mb-1.5">
          송금 후, 남은 문제
        </div>
        <p className="text-base text-text/90 leading-relaxed">
          네 칸을 채워 메시지 한 통을 만들었다. 하지만 이 메시지가 실제
          비트코인 네트워크에서 받아들여지려면 아직 세 가지 질문을 통과해야
          한다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Question
          n="01"
          q="정말 Alice 가 만든 서명일까?"
          a="공개키로 검증, 비밀키 없으면 못 만든다"
          to="S1 · ECDSA"
        />
        <Question
          n="02"
          q="Alice 가 1 BTC 를 정말 갖고 있을까?"
          a="UTXO 셋 안의 안 쓴 출력 합계"
          to="S4 UTXO"
        />
        <Question
          n="03"
          q="같은 코인을 두 곳에 동시에 못 쓰게 막을 방법은?"
          a="네트워크가 Longest chain rule 로 한 체인에 수렴"
          to="S6 · S7"
        />
      </div>

      <Reflection title="왜 비트코인은 개발되었을까?">
        <p>
          화폐는 늘 어떤 약속 위에 있었다. 그 기준이 금이든, 정부의 법정화폐든,
          국제 결제 질서든, 결국 사람들은 그 약속을 관리하는 주체를 믿어야
          했다.
        </p>
        <MoneyTimeline />
        <p>
          그렇다면 ‘아무도 안 믿어도 되는 화폐’ 는 가능할까? 1980 ~ 1990
          년대의 <span className="text-text">cypherpunk</span> 들이 그 질문에
          매달렸다. David Chaum 의 DigiCash, Wei Dai 의 b-money, Nick Szabo
          의 bit gold, Adam Back 의 Hashcash. 모두 같은 벽 앞에서 멈췄다.
        </p>
        <p>
          그 벽은{" "}
          <span className="text-text">이중지출 (double-spending)</span> 이었다.
          ‘같은 동전이 두 곳에서 동시에 쓰이지 않는다’ 는 보장은, 누군가가 거래
          순서를 한 줄로 정리해 줘야 가능하다. 그 ‘누군가’ 를 없애면 ‘무엇이
          먼저 쓰였는가’ 라는 사실 자체가 흔들린다. 오랫동안 풀리지 않은
          문제로 남아 있었다.
        </p>
        <p>
          2008 년 10 월 31 일,{" "}
          <span className="text-text">Satoshi Nakamoto</span> 라는 익명의
          인물이 cypherpunk 메일링 리스트에 9 페이지짜리 백서를 올린다. 중앙
          기관 없이도 모두가 같은 거래 순서를 보게 만드는 규칙. 작업증명
          (proof-of-work) 과 Longest chain rule (정확히는 누적 작업량이 가장 큰
          체인 선택). 그 위에서, 어디에도 묶이지
          않은 첫 화폐가 처음으로 가능해졌다.
        </p>
        <p className="text-text/60">
          이 질문에 대한 답이 이후 단계에서 하나씩 열린다. 지갑 (S1) 에서
          시작해 마이닝 (S8), 노드 운영 (S11), 확장성 (S12), 프라이버시 (S13)
          까지 이어진다.
        </p>
        <Whitepaper />
      </Reflection>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="text-sm text-muted">
          출발은 <span className="text-accent">‘지갑’</span> 부터.
        </div>
        <motion.button
          layoutId={gateKey("S0", "S1")}
          onClick={onEnter}
          animate={{
            borderColor: ["#1c1f27", "#f7931a", "#1c1f27"],
            transition: {
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="rounded-sm bg-bg border border-edge p-4 text-left hover:border-accent transition-colors min-w-[260px]"
        >
          <div className="text-xs text-muted font-mono">S1</div>
          <div className="text-base font-medium mt-0.5">Keys & Address</div>
          <div className="text-xs text-muted mt-1">
            키와 주소는 정확히 무엇인가 →
          </div>
        </motion.button>
      </div>
    </div>
  );
}

function MoneyTimeline() {
  const eras: {
    when: string;
    name: string;
    desc: string;
    tone?: "warn" | "accent";
  }[] = [
    {
      when: "1870 – 1944",
      name: "금 본위 (Gold Standard)",
      desc: "종이돈을 일정량의 금으로 바꿀 수 있다는 약속이었다. 화폐는 곧 ‘금에 묶인 영수증’ 이었다.",
    },
    {
      when: "1944 – 1971",
      name: "Bretton Woods",
      desc: "미국 달러는 금에, 다른 나라 통화는 달러에 묶였다. 세계 화폐의 닻이 사실상 미국으로 옮겨졌다.",
    },
    {
      when: "1971",
      name: "닉슨 쇼크",
      desc: "미국이 일방적으로 달러–금 태환을 중단했다. 화폐가 처음으로 ‘무’ 에 닻을 내린다 (fiat).",
      tone: "warn",
    },
    {
      when: "1973 ~",
      name: "오일머니 (Petrodollar)",
      desc: "사우디 석유 결제를 달러로만 하기로 합의했다. 무에서 풀린 달러를 ‘석유’ 수요와 다시 연결해 신용을 보강한 구조다.",
    },
    {
      when: "1990s ~",
      name: "디지털",
      desc: "은행·카드사 컴퓨터 안의 숫자가 된다. 모든 ‘돈’ 이 누군가의 장부 한 줄로 남는다.",
    },
    {
      when: "2009 ~",
      name: "비트코인",
      desc: "정부·기업·금속·석유 어디에도 묶여 있지 않다. 발행 규칙과 합의 메커니즘만으로 굴러간다.",
      tone: "accent",
    },
  ];
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-x-auto">
      <div className="grid grid-cols-1 sm:min-w-[560px] sm:grid-cols-[100px_140px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
        <div>시기</div>
        <div>체제</div>
        <div>무엇에 묶여 있었나</div>
      </div>
      <div className="divide-y divide-edge text-sm">
        {eras.map((e) => {
          const color =
            e.tone === "warn"
              ? "text-[#f76b6b]"
              : e.tone === "accent"
                ? "text-accent"
                : "text-text/85";
          return (
            <div
              key={e.name}
              className="grid grid-cols-1 sm:min-w-[560px] sm:grid-cols-[100px_140px_1fr] gap-3 px-4 py-2.5 items-baseline"
            >
              <div className="font-mono text-[13px] text-muted">{e.when}</div>
              <div className={`font-mono text-[13px] ${color}`}>{e.name}</div>
              <div className="text-[13px] text-text/85 leading-relaxed">
                {e.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Whitepaper() {
  return (
    <a
      href="https://bitcoin.org/bitcoin.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="block border-l-2 border-accent/50 pl-4 py-1 hover:bg-accent/[0.08] transition-colors p-4 group"
    >
      <div className="flex items-start gap-3">
        <PaperGlyph />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-accent mb-1">
            비트코인 백서 · 2008-10-31
          </div>
          <div className="text-[15px] font-medium text-text leading-snug">
            “Bitcoin: A Peer-to-Peer Electronic Cash System”
          </div>
          <div className="text-[13px] text-muted leading-relaxed mt-1">
            저자: Satoshi Nakamoto · 9 페이지 · cypherpunk 메일링 리스트에 첫 공개
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-mono text-accent2 group-hover:text-accent">
            bitcoin.org/bitcoin.pdf ↗
          </div>
        </div>
      </div>
    </a>
  );
}

function PaperGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 text-accent shrink-0 mt-0.5"
    >
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
      <line x1="9" y1="12" x2="16" y2="12" />
      <line x1="9" y1="15" x2="16" y2="15" />
      <line x1="9" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function Question({
  n,
  q,
  a,
  to,
}: {
  n: string;
  q: string;
  a: string;
  to: string;
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 p-4 space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="text-xs text-muted font-mono">{n}</div>
        <div className="text-xs text-muted font-mono">→ {to}</div>
      </div>
      <div className="text-sm text-text/90 leading-relaxed">{q}</div>
      <div className="text-[13px] text-accent2 leading-relaxed">{a}</div>
    </div>
  );
}

function Avatar({
  x,
  name,
  color,
  scale = 1,
  active = false,
  seal = false,
}: {
  x: number;
  name: string;
  color: string;
  scale?: number;
  active?: boolean;
  seal?: boolean;
}) {
  const xPct = (x / VIEW_W) * 100;
  const yPct = (Y / VIEW_H) * 100;
  return (
    <div
      className="absolute"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          className="relative w-16 h-16 rounded-full bg-bg flex items-center justify-center"
          style={{ borderWidth: 1.5, borderStyle: "solid" }}
          animate={{ borderColor: color }}
          transition={{ duration: 0.3 }}
        >
          <UserIcon color={color} />
          <AnimatePresence>
            {seal && <SignatureSeal />}
          </AnimatePresence>
        </motion.div>
        <motion.div
          className="text-[13px] font-mono tracking-wide"
          animate={{ color: active ? "rgba(238,238,238,0.85)" : "rgba(238,238,238,0.32)" }}
          transition={{ duration: 0.3 }}
        >
          {name}
        </motion.div>
      </motion.div>
    </div>
  );
}

function UserIcon({ color }: { color: string }) {
  return (
    <motion.svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ stroke: color }}
      transition={{ duration: 0.3 }}
    >
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 19.5c0-3.6 3.1-5.8 7-5.8s7 2.2 7 5.8" />
    </motion.svg>
  );
}

function SignatureSeal() {
  return (
    <motion.div
      key="seal"
      initial={{ opacity: 0, scale: 1.8, rotate: -28 }}
      animate={{ opacity: 1, scale: 1, rotate: -10 }}
      exit={{ opacity: 0, scale: 0.7, rotate: -28 }}
      transition={{ type: "spring", stiffness: 320, damping: 16, mass: 0.6 }}
      className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-bg flex items-center justify-center"
      style={{
        boxShadow:
          "0 0 0 1.5px #f7931a, 0 0 0 4px rgba(247,147,26,0.18)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="9" cy="10" r="1.1" fill="#f7931a" />
        <circle cx="15" cy="10" r="1.1" fill="#f7931a" />
        <path
          d="M 8 14 Q 12 18 16 14"
          stroke="#f7931a"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
