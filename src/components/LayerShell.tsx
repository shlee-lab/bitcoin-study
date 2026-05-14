"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LAYERS, gateKey, type LayerId } from "@/lib/layers";
import { useNav, type LayerProps } from "./LayerStack";

const ETH_ADDRESS = "0xE644aDac6b5cB18EFa46d84c5Bcf52357812F406";

export function LayerShell({
  id,
  onEnter,
  body,
  showCompletion,
}: {
  id: LayerId;
  onEnter: LayerProps["onEnter"];
  body?: React.ReactNode;
  showCompletion?: boolean;
}) {
  const layer = LAYERS[id];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="w-full max-w-[760px] mx-auto px-6 sm:px-10 py-12 sm:py-14">
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="space-y-3"
        >
          <div className="text-[13px] text-muted font-semibold">
            {layer.subtitle}
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-semibold leading-[1.12] tracking-tight">
            {layer.title}
          </h1>
          <p className="text-[17px] text-text/70 leading-[1.65] pt-1">
            {layer.oneLiner}
          </p>
        </motion.header>

        {body && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.3 }}
            className="mt-14"
          >
            {body}
          </motion.div>
        )}

        {layer.childIds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.3 }}
            className="mt-20"
          >
            <div className="text-[13px] text-text/70 font-medium mb-5">
              다음 단계
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {layer.childIds.map((childId) => {
                const child = LAYERS[childId];
                const key = gateKey(id, childId);
                return (
                  <motion.button
                    key={childId}
                    layoutId={key}
                    onClick={() => onEnter(childId, key)}
                    className="group rounded-sm border border-edge bg-surface/25 hover:bg-surface/55 hover:border-accent/45 transition-all px-5 py-5 text-left"
                  >
                    <div className="text-[13px] text-muted font-medium">
                      {child.subtitle}
                    </div>
                    <div className="text-[16px] font-medium mt-1.5 text-text group-hover:text-accent transition-colors">
                      {child.title}
                    </div>
                    <div className="text-[14px] text-text/65 mt-2 leading-[1.6]">
                      {child.oneLiner}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        )}

        {layer.references && layer.references.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.3 }}
            className="mt-14"
          >
            <div className="text-[13px] text-text/70 font-medium mb-3">
              함께 보면 좋은 단계
            </div>
            <div className="flex flex-wrap gap-2">
              {layer.references.map((refId) => (
                <span
                  key={refId}
                  className="text-[12px] text-text/65 border border-edge rounded-sm px-2.5 py-1"
                >
                  {LAYERS[refId].subtitle} · {LAYERS[refId].title}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {showCompletion ? <CompletionPanel /> : null}
        <Pager />
      </div>
    </div>
  );
}

function Pager() {
  const { currentId, currentIdx, total, prevId, nextId, goTo } = useNav();
  const current = LAYERS[currentId];
  const prev = prevId ? LAYERS[prevId] : null;
  const next = nextId ? LAYERS[nextId] : null;
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="mt-20 pt-5 border-t border-edge flex items-center justify-between gap-4"
    >
      {prev ? (
        <button
          type="button"
          onClick={() => goTo(prev.id)}
          className="text-[12px] text-text/65 hover:text-text transition-colors truncate"
        >
          ← {prev.subtitle} · {prev.title}
        </button>
      ) : (
        <span />
      )}
      <span className="text-[12px] text-muted/70 shrink-0">
        {current.subtitle} · {currentIdx + 1}/{total}
      </span>
      {next ? (
        <button
          type="button"
          onClick={() => goTo(next.id)}
          className="text-[12px] text-accent/85 hover:text-accent transition-colors truncate"
        >
          {next.subtitle} · {next.title} →
        </button>
      ) : (
        <span />
      )}
    </motion.nav>
  );
}

function CompletionPanel() {
  const { goTo } = useNav();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48, duration: 0.3 }}
      className="mt-20 border-y border-edge bg-bg/20 py-6 space-y-5"
    >
      <div className="px-1 space-y-4">
        <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-accent">
          <span className="h-2 w-2 rounded-full bg-accent" />
          학습 완료
        </div>
        <div className="space-y-3">
          <h2 className="text-[24px] sm:text-[28px] font-semibold leading-tight text-text">
            여기까지 따라왔다면 Bitcoin 의 핵심 구조를 설명할 수 있습니다.
          </h2>
          <p className="text-[15px] text-text/70 leading-[1.75]">
            주소, 서명, 트랜잭션, 블록, 채굴, 노드, 확장성, 프라이버시가 하나의
            송금 안에서 어떻게 연결되는지 확인했습니다. 다음 콘텐츠는 Ethereum 과
            Consensus 중심의 주제로 추후 추가할 예정입니다.
          </p>
        </div>
      </div>

      <SupportMini />

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 border border-accent/70 px-3.5 text-[14px] font-medium text-accent hover:bg-accent hover:text-bg transition-colors"
        >
          <HomeIcon />
          홈으로 돌아가기
        </Link>
        <button
          type="button"
          onClick={() => goTo("S0")}
          className="inline-flex h-10 items-center border border-edge px-3.5 text-[14px] font-medium text-text/68 hover:text-text hover:border-edge/90 transition-colors"
        >
          처음부터 다시 보기
        </button>
      </div>
    </motion.section>
  );
}

function SupportMini() {
  return (
    <div className="border-t border-edge pt-4">
      <div className="flex items-start gap-3">
        <CoffeeMini />
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-text/85">
            도움이 되었다면 커피 한 잔으로 응원할 수 있습니다
          </div>
          <div className="text-[12px] text-muted mt-0.5">
            Ethereum / ERC-20
          </div>
          <div className="text-[12px] text-text/62 break-all mt-2">
            {ETH_ADDRESS}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

function CoffeeMini() {
  return (
    <div
      aria-hidden="true"
      className="h-10 w-10 shrink-0 rounded-md bg-[#f3efe4] flex items-center justify-center shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M9 10h13l-1.2 16H10.2L9 10Z" fill="#0f7a55" />
        <path d="M8.2 7.5h14.6l-.45 4H8.65l-.45-4Z" fill="#e8dcc6" />
        <path d="M10 5.5h11.2l.45 2H9.55l.45-2Z" fill="#f7f2e8" />
        <circle cx="16" cy="17.2" r="4.2" fill="#f7f2e8" />
        <path
          d="M13.9 17.7c1.4 1.1 2.8 1.1 4.2 0"
          stroke="#0f7a55"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M14.2 15.4h.01M17.8 15.4h.01"
          stroke="#0f7a55"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
