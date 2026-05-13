const OPTIONS = [
  {
    src: "/og/flow.svg",
    title: "Flow",
    note: "Alice의 송금 흐름을 가장 직접적으로 보여주는 버전",
  },
  {
    src: "/og/layers.svg",
    title: "Layers",
    note: "한 번의 송금 안에 여러 레이어가 쌓인다는 메시지",
  },
  {
    src: "/og/minimal.svg",
    title: "Minimal",
    note: "가장 단정한 대표 이미지. 작은 미리보기에서 잘 읽힘",
  },
  {
    src: "/og/technical.svg",
    title: "Technical",
    note: "개발자/기술 독자에게 더 강하게 보이는 버전",
  },
];

export default function OgOptionsPage() {
  return (
    <main className="min-h-screen bg-bg text-text px-5 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <div className="text-[13px] font-semibold text-accent">OG Image Options</div>
          <h1 className="text-[30px] font-semibold tracking-tight">대표 이미지 시안</h1>
          <p className="text-[15px] text-text/65 leading-relaxed max-w-2xl">
            URL을 공유했을 때 카드에 보이는 1200×630 Open Graph 이미지 후보입니다.
            실제 적용 전 작은 미리보기에서도 제목이 읽히는지 비교합니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OPTIONS.map((option) => (
            <section key={option.src} className="space-y-3">
              <img
                src={option.src}
                alt={`${option.title} OG image option`}
                className="w-full aspect-[1200/630] border border-edge bg-surface object-cover"
              />
              <div>
                <h2 className="text-[17px] font-semibold text-text">{option.title}</h2>
                <p className="text-[14px] text-text/62 leading-relaxed mt-1">{option.note}</p>
                <a
                  href={option.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-2 text-[13px] font-medium text-accent2 hover:text-accent border-b border-dotted border-accent2/40"
                >
                  원본 열기
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
