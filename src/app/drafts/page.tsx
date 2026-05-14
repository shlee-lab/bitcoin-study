import { Panel1Cafe } from "./panels/Panel1Cafe";
import { Panel2Wallet } from "./panels/Panel2Wallet";
import { Panel3Sign } from "./panels/Panel3Sign";
import { Panel4Network } from "./panels/Panel4Network";

export const metadata = { title: "Manhwa storyboard" };

export default function DraftsPage() {
  return (
    <main className="min-h-screen px-6 sm:px-10 py-12 sm:py-16">
      <div className="max-w-[900px] mx-auto space-y-12">
        <header className="space-y-2">
          <div className="text-[12px] uppercase tracking-[0.2em] font-mono text-muted">
            Storyboard · 4 panels
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight">
            만화처럼 · 장면별로 한 칸씩
          </h1>
          <p className="text-[14px] text-text/65 leading-[1.7] max-w-2xl">
            한 컷 마스터가 아니라 패널별 일러스트. 각 섹션이 한 패널에
            대응되고, 인물·상황·소품이 그 장면을 직접 보여줍니다. 4 패널 먼저
            그렸으니 톤이 맞으면 나머지 7 ~ 8 개 더 그릴게요.
          </p>
        </header>

        <Panel n="01" title="Alice 가 Bob 에게 1 BTC 를 보내기로 한다" sub="S0">
          <Panel1Cafe />
        </Panel>

        <Panel n="02" title="Alice 가 지갑 앱을 연다" sub="S1 · S2">
          <Panel2Wallet />
        </Panel>

        <Panel n="03" title="비밀키로 트랜잭션에 서명" sub="S3">
          <Panel3Sign />
        </Panel>

        <Panel n="04" title="서명된 트랜잭션이 네트워크에 퍼진다" sub="S6">
          <Panel4Network />
        </Panel>

        <div className="text-[14px] text-text/60 leading-[1.7] pt-6 border-t border-edge">
          이 톤이 맞으면 다음 패널들도 같은 스타일로 그립니다 (mempool 대기 ·
          채굴자 발견 · 블록 연결 · 노드 검증 · Bob 의 알림 등). 어색한
          요소 짚어주세요.
        </div>
      </div>
    </main>
  );
}

function Panel({
  n,
  title,
  sub,
  children,
}: {
  n: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-4">
        <span className="text-[12px] font-mono text-accent">[ {n} ]</span>
        <span className="text-[12px] uppercase tracking-[0.16em] font-mono text-muted">
          {sub}
        </span>
        <span className="text-[15px] text-text/85 font-medium">{title}</span>
      </div>
      <div className="rounded-sm border border-edge overflow-hidden">{children}</div>
    </section>
  );
}
