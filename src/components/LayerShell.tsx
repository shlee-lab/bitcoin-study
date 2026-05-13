"use client";

import { motion } from "framer-motion";
import { LAYERS, gateKey, type LayerId } from "@/lib/layers";
import { useNav, type LayerProps } from "./LayerStack";

export function LayerShell({
  id,
  onEnter,
  body,
}: {
  id: LayerId;
  onEnter: LayerProps["onEnter"];
  body?: React.ReactNode;
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
