import Link from "next/link";

export default function LicensePage() {
  return (
    <main className="min-h-screen px-6 sm:px-10 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-4">
          <Link
            href="/"
            className="inline-flex text-[13px] text-muted hover:text-accent transition-colors"
          >
            ← 홈으로
          </Link>
          <div>
            <div className="text-[13px] font-semibold text-accent">
              License
            </div>
            <h1 className="text-[34px] sm:text-[44px] font-semibold leading-tight tracking-tight mt-3">
              CC BY-NC 4.0
            </h1>
          </div>
          <p className="text-[16px] text-text/72 leading-[1.75] max-w-2xl">
            Bitcoin Study 의 교육 콘텐츠는 Creative Commons
            Attribution-NonCommercial 4.0 International License 로 배포합니다.
            출처를 표시하면 공유와 수정이 가능하지만, 상업적 이용은 별도 허가가
            필요합니다.
          </p>
        </header>

        <section className="border-y border-edge py-7 space-y-5">
          <h2 className="text-[20px] font-semibold text-text">
            사내 교육에서 가능한 사용
          </h2>
          <ul className="space-y-2 text-[15px] text-text/78 leading-[1.75]">
            <li>· 사내 메신저, 위키, LMS 에 원문 링크 공유</li>
            <li>· 내부 교육 세션에서 화면 공유 또는 일부 인용</li>
            <li>· 출처와 원문 URL 을 표시한 내부용 요약·발췌 자료 작성</li>
          </ul>
        </section>

        <section className="space-y-5">
          <h2 className="text-[20px] font-semibold text-text">
            별도 문의가 필요한 사용
          </h2>
          <ul className="space-y-2 text-[15px] text-text/78 leading-[1.75]">
            <li>· 유료 강의, 유료 리포트, 상업 교육상품에 포함</li>
            <li>· 회사 로고를 붙인 외부 배포용 파생 자료 제작</li>
            <li>· 원문 전체 또는 상당 부분을 복제한 공개 재배포</li>
          </ul>
        </section>

        <section className="rounded-sm border border-edge bg-surface/30 p-5 space-y-3">
          <h2 className="text-[18px] font-semibold text-text">
            권장 출처 표기
          </h2>
          <div className="text-[14px] text-text/75 leading-[1.75]">
            Bitcoin Study, by Suhyeon Lee. Licensed under CC BY-NC 4.0.
            <br />
            https://bitcoin-study.vercel.app/
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-[13px]">
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent2 hover:text-accent transition-colors"
          >
            CC BY-NC 4.0 요약 ↗
          </a>
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/legalcode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent2 hover:text-accent transition-colors"
          >
            Legal code ↗
          </a>
          <a
            href="https://github.com/shlee-lab/bitcoin-study/blob/main/LICENSE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent2 hover:text-accent transition-colors"
          >
            GitHub LICENSE ↗
          </a>
        </div>
      </div>
    </main>
  );
}
