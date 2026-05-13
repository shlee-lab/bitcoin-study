"use client";

import { useState } from "react";

const ETH_ADDRESS = "0xE644aDac6b5cB18EFa46d84c5Bcf52357812F406";

export function Support() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(ETH_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard access can fail in restricted contexts.
    }
  }

  return (
    <section className="pt-10 border-t border-edge">
      <div className="grid grid-cols-1 sm:grid-cols-[116px_1fr] gap-3 sm:gap-8">
        <div className="text-[16px] font-semibold text-text leading-snug">
          후원
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CoffeeIcon />
            <div>
              <div className="text-[15px] font-medium text-text/88">
                Buy me a coffee
              </div>
              <div className="text-[13px] text-text/55">
                Ethereum / ERC-20
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <code className="font-mono text-[13px] text-text/82 break-all">
              {ETH_ADDRESS}
            </code>
            <button
              type="button"
              onClick={copyAddress}
              className="text-[12px] font-medium text-muted hover:text-text border border-edge hover:border-accent/60 rounded-sm px-2 py-1 transition-colors"
            >
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoffeeIcon() {
  return (
    <div
      aria-hidden="true"
      className="w-11 h-11 rounded-md bg-[#f3efe4] flex items-center justify-center shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]"
    >
      <svg
        width="31"
        height="31"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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
