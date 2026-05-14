import Link from "next/link";

const ETH_ADDRESS = "0xE644aDac6b5cB18EFa46d84c5Bcf52357812F406";

const options = [
  {
    id: "A",
    name: "차분한 완료 화면",
    bestFor: "가장 권장",
    summary:
      "완주를 인정하되 과장하지 않고, 다음 콘텐츠 예고와 홈 복귀를 정돈해서 보여준다.",
    pros: ["신뢰감이 높음", "본문 톤과 잘 맞음", "실제 배포용으로 바로 쓰기 좋음"],
    cons: ["강한 축하감은 약함"],
    preview: <CalmCompletion />,
  },
  {
    id: "B",
    name: "다음 코스 예고형",
    bestFor: "확장 로드맵 강조",
    summary:
      "Bitcoin 코스를 끝낸 뒤 Ethereum, Smart Contract, Consensus 로 이어지는 학습 경로를 더 강하게 보여준다.",
    pros: ["사이트 확장 방향이 선명함", "재방문 유도에 좋음", "다음 주제가 기억에 남음"],
    cons: ["완료 메시지보다 로드맵이 더 크게 보일 수 있음"],
    preview: <RoadmapCompletion />,
  },
  {
    id: "C",
    name: "실무 진입형",
    bestFor: "학습 성취감 강조",
    summary:
      "이제 무엇을 설명할 수 있는지 명확히 짚고, 연구·실무로 가려면 어떤 학습이 더 필요한지 안내한다.",
    pros: ["학습자가 얻은 것을 분명히 알 수 있음", "과장 없이 성취감을 줌", "다음 행동이 구체적"],
    cons: ["텍스트가 조금 더 많음"],
    preview: <PracticeCompletion />,
  },
];

export default function CompletionOptionsPage() {
  return (
    <main className="min-h-screen px-6 sm:px-10 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center border border-edge bg-surface/30 text-muted hover:text-accent hover:border-accent/60 transition-colors"
              aria-label="홈으로 돌아가기"
              title="홈으로 돌아가기"
            >
              <HomeIcon />
            </Link>
            <Link
              href="/learn"
              className="text-[13px] font-medium text-muted hover:text-accent transition-colors"
            >
              학습 페이지 보기
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-[13px] font-semibold text-accent">
              Completion screen options
            </div>
            <h1 className="text-[34px] sm:text-[48px] font-semibold leading-[1.08] tracking-tight">
              학습 완료 화면을
              <br />
              어떻게 마무리할까?
            </h1>
            <p className="text-[15px] sm:text-[16px] text-text/70 leading-[1.75] max-w-2xl">
              마지막 버튼은 “고생하셨습니다”보다 한 단계 더 설계되어야 합니다.
              학습자가 무엇을 이해했는지 인정하고, 다음 콘텐츠가 Ethereum 과
              Consensus 중심으로 확장될 예정임을 자연스럽게 예고하며, 홈 복귀와
              후원 정보를 부담 없이 보여주는 방향으로 비교합니다.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {options.map((option) => (
            <OptionCard key={option.id} option={option} />
          ))}
        </section>

        <section className="border-t border-edge pt-7">
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8">
            <div className="text-[16px] font-semibold text-text">
              추천
            </div>
            <div className="space-y-3">
              <p className="text-[15px] text-text/75 leading-[1.75] max-w-3xl">
                실제 적용은 <span className="text-text font-medium">A안</span>이
                가장 안정적입니다. 완료 메시지는 짧게 두고, 다음 콘텐츠 예고는
                한 문장으로 제한하는 편이 좋습니다. 후원 정보는 별도 카드가
                아니라 작은 하단 영역으로 배치해야 학습 성취감을 방해하지
                않습니다.
              </p>
              <div className="text-[14px] text-text/60 leading-[1.7]">
                버튼 문구는 <span className="text-text">학습 완료</span>가 가장
                좋습니다. “실무에 전혀 문제없다”는 식의 문장은 피하고,
                “개념적으로 설명할 수 있는 수준” 정도가 정확합니다.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function OptionCard({
  option,
}: {
  option: {
    id: string;
    name: string;
    bestFor: string;
    summary: string;
    pros: string[];
    cons: string[];
    preview: React.ReactNode;
  };
}) {
  return (
    <article className="border border-edge bg-surface/25">
      <div className="p-5 space-y-4 border-b border-edge">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex h-8 w-8 items-center justify-center border border-edge bg-bg text-[14px] font-semibold text-accent">
            {option.id}
          </div>
          <div className="text-[12px] font-medium text-muted">
            {option.bestFor}
          </div>
        </div>
        <div>
          <h2 className="text-[19px] font-semibold text-text tracking-tight">
            {option.name}
          </h2>
          <p className="text-[14px] text-text/68 leading-[1.65] mt-2">
            {option.summary}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 text-[13px] leading-[1.6]">
          <PointList title="장점" items={option.pros} />
          <PointList title="주의" items={option.cons} muted />
        </div>
      </div>
      <div className="p-4 bg-bg/35">{option.preview}</div>
    </article>
  );
}

function PointList({
  title,
  items,
  muted,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="border-t border-edge/60 pt-3">
      <div className={`text-[13px] font-semibold ${muted ? "text-muted" : "text-accent2"}`}>
        {title}
      </div>
      <ul className="mt-1.5 space-y-1 text-text/62">
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </div>
  );
}

function CalmCompletion() {
  return (
    <CompletionFrame>
      <div className="space-y-5">
        <CompletionBadge text="Bitcoin Study 완료" />
        <div className="space-y-3">
          <h3 className="text-[26px] font-semibold leading-tight text-text">
            여기까지 따라왔다면 Bitcoin 의 핵심 구조를 설명할 수 있습니다.
          </h3>
          <p className="text-[14px] text-text/70 leading-[1.7]">
            주소, 서명, 트랜잭션, 블록, 채굴, 노드, 확장성, 프라이버시가 하나의
            송금 안에서 어떻게 연결되는지 확인했습니다.
          </p>
        </div>
        <NextNotice compact />
        <CompletionActions />
        <SupportMini />
      </div>
    </CompletionFrame>
  );
}

function RoadmapCompletion() {
  return (
    <CompletionFrame>
      <div className="space-y-5">
        <CompletionBadge text="다음 콘텐츠 예고" />
        <div className="space-y-3">
          <h3 className="text-[26px] font-semibold leading-tight text-text">
            다음은 Ethereum 과 Consensus 로 확장됩니다.
          </h3>
          <p className="text-[14px] text-text/70 leading-[1.7]">
            Bitcoin 을 기준점으로 삼아 account model, smart contract, PoS, BFT,
            validator, 신생 체인의 설계 선택을 비교할 예정입니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <RoadmapItem title="Ethereum" text="Account model, gas, EVM" />
          <RoadmapItem title="Smart Contract" text="Token, DeFi, security issues" />
          <RoadmapItem title="Consensus" text="PoS, BFT, validator design" />
        </div>
        <CompletionActions />
        <SupportMini />
      </div>
    </CompletionFrame>
  );
}

function PracticeCompletion() {
  return (
    <CompletionFrame>
      <div className="space-y-5">
        <CompletionBadge text="학습 완료" />
        <div className="space-y-3">
          <h3 className="text-[26px] font-semibold leading-tight text-text">
            이제 Bitcoin 을 연구하거나 실무에서 읽어낼 기본 언어가 생겼습니다.
          </h3>
          <p className="text-[14px] text-text/70 leading-[1.7]">
            바로 전문가가 된다는 뜻은 아닙니다. 다만 논문, 구현 문서, 지갑 UX,
            규제 논의를 읽을 때 핵심 질문을 놓치지 않을 준비가 된 상태입니다.
          </p>
        </div>
        <div className="border border-edge bg-bg/35 p-3 text-[13px] text-text/70 leading-[1.65]">
          다음 실습으로는 직접 노드 실행, 지갑 백업, mempool 관찰, Lightning
          결제, block explorer 분석이 좋습니다.
        </div>
        <NextNotice />
        <CompletionActions />
        <SupportMini />
      </div>
    </CompletionFrame>
  );
}

function CompletionFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[560px] border border-edge bg-surface/35 p-5 sm:p-6 flex items-stretch">
      <div className="w-full flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

function CompletionBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-accent">
      <span className="h-2 w-2 rounded-full bg-accent" />
      {text}
    </div>
  );
}

function NextNotice({ compact }: { compact?: boolean }) {
  return (
    <div className="border-l-2 border-accent/70 pl-4">
      <div className="text-[14px] font-semibold text-text">
        다음 콘텐츠는 준비 중입니다
      </div>
      <p className={`text-[13px] text-text/65 leading-[1.65] ${compact ? "mt-1" : "mt-1.5"}`}>
        Ethereum 과 Consensus 중심의 주제를 추후 추가할 예정입니다.
      </p>
    </div>
  );
}

function CompletionActions() {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-accent text-bg px-4 py-2 text-[14px] font-medium hover:bg-accent/90 transition-colors"
      >
        <HomeIcon small />
        홈으로 돌아가기
      </Link>
      <Link
        href="/learn"
        className="inline-flex items-center border border-edge px-4 py-2 text-[14px] font-medium text-text/78 hover:text-text hover:border-accent/60 transition-colors"
      >
        다시 둘러보기
      </Link>
    </div>
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

function RoadmapItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-edge bg-bg/35 px-3 py-2">
      <div className="text-[13px] font-semibold text-text">{title}</div>
      <div className="text-[12px] text-text/58 mt-0.5">{text}</div>
    </div>
  );
}

function HomeIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 19;
  return (
    <svg
      width={size}
      height={size}
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
