import Link from "next/link";
import { LAYERS, LAYER_ORDER as ORDER } from "@/lib/layers";

const CURRENT_IDX = 5;
const CURRENT = LAYERS[ORDER[CURRENT_IDX]];

export default function NavOptionsPage() {
  return (
    <main className="min-h-screen px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-14">
        <header className="space-y-3">
          <div className="text-[12px] tracking-[0.12em] font-mono text-accent">
            Nav options · 골라
          </div>
          <h1 className="text-[32px] font-semibold leading-tight">
            Stage 사이를 어떻게 이동할까?
          </h1>
          <p className="text-[14px] text-text/70 leading-[1.7] max-w-2xl">
            지금은 본문 안 CTA 로 한 칸 앞, ESC 로 한 칸 뒤만 이동. Stage 사이를
            점프하거나 순차 이동할 수 있는 네비를 추가한다면 어떤 모양이 좋을지
            4 안. 아래 미리보기는 모두 ‘현재 = S5 Block’ 가정.
          </p>
          <div className="text-[12px] text-muted pt-2 flex gap-4">
            <Link href="/" className="hover:text-accent">← Home</Link>
            <Link href="/learn" className="hover:text-accent">/learn</Link>
          </div>
        </header>

        <Option
          tag="A"
          name="하단 점 레일"
          flow="자유 점프"
          desc="화면 하단 중앙에 떠있는 12 개의 작은 점. 현재 stage 는 accent 로 채워지고 hover 시 라벨 툴팁. 클릭으로 자유 점프."
          pros={["컨텐츠를 거의 가리지 않음", "12 개가 한 줄에 들어감", "진행도 직관적"]}
          cons={["hover 전엔 어떤 stage 가 어딘지 모름", "터치 디바이스에서 hover 약함"]}
          mockup={<MockA />}
        />

        <Option
          tag="B"
          name="상단 세그먼트 바"
          flow="자유 점프"
          desc="Header 바로 아래 12 칸 가로 세그먼트. 각 칸에 S0 / S1 / … 같은 subtitle 표시. 현재 = accent 채움. 클릭으로 자유 점프."
          pros={["항상 라벨 보임", "현재 위치 + 진행도 동시", "터치 친화적"]}
          cons={["세로 공간 차지", "subtitle 만으론 의미 적음 (S3, S4 만 봐선 무엇인지 모름)"]}
          mockup={<MockB />}
        />

        <Option
          tag="C"
          name="Footer pager (← / →)"
          flow="순차"
          desc="각 layer 본문 끝에 ‘이전 / 다음’ 두 개 큰 버튼. 가운데 ‘S5 · 6/12’ 진행 표시. 책처럼 순차 이동만."
          pros={["다음 단계 제목까지 미리 보임", "강한 ‘앞으로 진행’ 신호", "구현 단순"]}
          cons={["멀리 점프 불가", "스크롤해야 등장"]}
          mockup={<MockC />}
        />

        <Option
          tag="D"
          name="Header inline + 드롭다운"
          flow="순차 + 점프"
          desc="Breadcrumb 옆에 ‹ / › prev/next 버튼과 ‘…’ 버튼. ‘…’ 누르면 12 stage 리스트 popover 가 떠서 자유 점프. 두 흐름 모두 지원."
          pros={["가장 컴팩트", "순차와 점프 모두 자연스럽게 지원", "기존 header 와 합쳐짐"]}
          cons={["popover 가 한 단계 더 필요", "구현 복잡"]}
          mockup={<MockD />}
        />

        <footer className="pt-8 border-t border-edge text-[12px] text-muted">
          마음에 드는 안 알려주면 LayerStack 에 박아둘게.
        </footer>
      </div>
    </main>
  );
}

function Option({
  tag, name, flow, desc, pros, cons, mockup,
}: {
  tag: string;
  name: string;
  flow: string;
  desc: string;
  pros: string[];
  cons: string[];
  mockup: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3 border-b border-edge pb-3">
        <span className="font-mono text-[12px] tracking-[0.12em] text-accent">
          option {tag}
        </span>
        <h2 className="text-[20px] font-medium tracking-tight">{name}</h2>
        <span className="text-[11px] font-mono text-muted ml-auto">{flow}</span>
      </div>
      <p className="text-[14px] text-text/80 leading-[1.7] max-w-2xl">{desc}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
        <List label="장점" items={pros} tone="accent2" />
        <List label="단점" items={cons} tone="muted" />
      </div>
      <div className="pt-2">{mockup}</div>
    </section>
  );
}

function List({
  label, items, tone,
}: {
  label: string;
  items: string[];
  tone: "accent2" | "muted";
}) {
  return (
    <div>
      <div
        className={`font-mono text-[11px] uppercase tracking-[0.16em] mb-1 ${
          tone === "accent2" ? "text-accent2" : "text-muted"
        }`}
      >
        {label}
      </div>
      <ul className="space-y-1 text-[13px] text-text/80 leading-[1.6]">
        {items.map((x) => (
          <li key={x} className="flex gap-2">
            <span
              className={
                tone === "accent2" ? "text-accent2/70" : "text-muted/60"
              }
            >
              ·
            </span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockHeader() {
  return (
    <div className="border-b border-edge px-4 py-2 flex items-center gap-2 text-[11px] font-mono">
      <span className="text-muted/70">S0</span>
      <span className="text-muted/40">›</span>
      <span className="text-muted/70">…</span>
      <span className="text-muted/40">›</span>
      <span className="text-text">
        {CURRENT.subtitle} {CURRENT.title}
      </span>
      <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-muted/60">
        esc ↑
      </span>
    </div>
  );
}

function MockBody() {
  return (
    <div className="px-4 pt-5 pb-12 space-y-2 min-h-[160px]">
      <div className="h-3 w-2/3 rounded bg-text/10" />
      <div className="h-2 w-full rounded bg-text/5" />
      <div className="h-2 w-11/12 rounded bg-text/5" />
      <div className="h-2 w-full rounded bg-text/5" />
      <div className="h-2 w-3/4 rounded bg-text/5" />
      <div className="h-2 w-5/6 rounded bg-text/5" />
    </div>
  );
}

function MockA() {
  return (
    <div className="rounded-md border border-edge bg-bg overflow-hidden relative">
      <MockHeader />
      <MockBody />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-2 rounded-full bg-surface ring-1 ring-edge flex items-center gap-2">
        {ORDER.map((id, i) => {
          const active = i === CURRENT_IDX;
          const visited = i < CURRENT_IDX;
          return (
            <span
              key={id}
              title={`${LAYERS[id].subtitle} · ${LAYERS[id].title}`}
              className="block"
            >
              <span
                className={`block rounded-full transition ${
                  active
                    ? "w-2.5 h-2.5 bg-accent"
                    : visited
                      ? "w-1.5 h-1.5 bg-text/45"
                      : "w-1.5 h-1.5 bg-text/15"
                }`}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MockB() {
  return (
    <div className="rounded-md border border-edge bg-bg overflow-hidden">
      <MockHeader />
      <div className="border-b border-edge px-2 py-1 flex items-stretch gap-px bg-surface/40">
        {ORDER.map((id, i) => {
          const active = i === CURRENT_IDX;
          const visited = i < CURRENT_IDX;
          return (
            <div
              key={id}
              className={`flex-1 px-1 py-1.5 text-center font-mono text-[10px] rounded-sm transition ${
                active
                  ? "bg-accent/15 text-accent"
                  : visited
                    ? "text-text/70"
                    : "text-muted/60"
              }`}
            >
              {LAYERS[id].subtitle}
            </div>
          );
        })}
      </div>
      <MockBody />
    </div>
  );
}

function MockC() {
  const prev = LAYERS[ORDER[CURRENT_IDX - 1]];
  const next = LAYERS[ORDER[CURRENT_IDX + 1]];
  return (
    <div className="rounded-md border border-edge bg-bg overflow-hidden">
      <MockHeader />
      <MockBody />
      <div className="border-t border-edge px-4 py-3 grid grid-cols-3 gap-3 items-center bg-surface/30">
        <div className="text-left">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70">
            ← 이전
          </div>
          <div className="text-[12px] text-text/85 mt-0.5 truncate">
            {prev.subtitle} · {prev.title}
          </div>
        </div>
        <div className="text-center font-mono text-[11px] text-muted">
          {CURRENT.subtitle} · {CURRENT_IDX + 1} / {ORDER.length}
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            다음 →
          </div>
          <div className="text-[12px] text-text/85 mt-0.5 truncate">
            {next.subtitle} · {next.title}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockD() {
  const prev = LAYERS[ORDER[CURRENT_IDX - 1]];
  const next = LAYERS[ORDER[CURRENT_IDX + 1]];
  return (
    <div className="rounded-md border border-edge bg-bg overflow-hidden relative">
      <div className="border-b border-edge px-4 py-2 flex items-center gap-2 text-[11px] font-mono">
        <span className="text-muted/60">S0 › … ›</span>
        <span className="text-text">
          {CURRENT.subtitle} {CURRENT.title}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="px-1.5 py-0.5 text-muted hover:text-text"
            title={prev.title}
            type="button"
          >
            ‹
          </button>
          <button
            className="px-1.5 py-0.5 text-muted hover:text-text"
            title={next.title}
            type="button"
          >
            ›
          </button>
          <button
            className="px-1.5 py-0.5 text-muted hover:text-text ring-1 ring-edge rounded text-[12px]"
            type="button"
          >
            …
          </button>
        </div>
      </div>
      <MockBody />
      <div className="absolute right-3 top-9 w-56 rounded-md border border-edge bg-surface shadow-lg p-1.5 space-y-px">
        <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70 border-b border-edge mb-1">
          jump to stage
        </div>
        {ORDER.map((id, i) => {
          const active = i === CURRENT_IDX;
          return (
            <div
              key={id}
              className={`px-2 py-1 rounded text-[12px] flex items-center gap-2 ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-text/75 hover:bg-text/5"
              }`}
            >
              <span className="font-mono text-muted/70 w-8">
                {LAYERS[id].subtitle}
              </span>
              <span className="truncate">{LAYERS[id].title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
