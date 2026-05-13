import Image from "next/image";
import Link from "next/link";

const OPTIONS = [
  {
    id: "a-glyph",
    name: "A · ₿ glyph",
    desc: "고전 비트코인 심볼. 가장 직관적이고 즉시 인식됨. 단점: 흔함.",
  },
  {
    id: "b-layers",
    name: "B · 동심원 layers",
    desc: "3 겹 동심원 (회색/파랑/주황). 사이트의 ‘레이어 줌인’ 메타포 직접 반영.",
  },
  {
    id: "c-network",
    name: "C · 네트워크 노드",
    desc: "4 모서리 노드 + 중앙 허브. 분산 합의 / 가십 메타포.",
  },
  {
    id: "d-blocks",
    name: "D · 블록 스택",
    desc: "3 블록이 계단식으로 쌓이는 형태. 블록체인 직접 표현.",
  },
  {
    id: "e-nested",
    name: "E · 중첩 사각",
    desc: "3 겹 사각 (회색/파랑/주황). 추상→구체 드릴다운의 도식화.",
  },
];

export default function IconsPage() {
  return (
    <main className="min-h-screen p-8 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="text-sm text-muted hover:text-text font-mono"
          >
            ← 홈
          </Link>
          <h1 className="text-2xl font-semibold mt-4">Favicon 후보</h1>
          <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
            5 종 SVG. 큰 미리보기 + 작은 (16px / 32px) 실제 크기. 어느 게
            마음에 드는지 골라줘 (예: “B 로 가자”). 그러면 그 파일을{" "}
            <code className="font-mono text-text">/favicon.svg</code> 로
            연결할게.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className="rounded-xl border border-edge bg-bg/40 p-5 space-y-4"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-sm text-accent2">{opt.name}</div>
                <a
                  href={`/favicons/${opt.id}.svg`}
                  className="text-xs text-muted hover:text-text font-mono"
                >
                  /favicons/{opt.id}.svg
                </a>
              </div>

              <div className="flex items-end gap-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-center w-24 h-24 rounded-md bg-bg border border-edge">
                    <Image
                      src={`/favicons/${opt.id}.svg`}
                      alt={opt.name}
                      width={80}
                      height={80}
                      unoptimized
                    />
                  </div>
                  <div className="text-[11px] text-muted font-mono text-center">
                    80px
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-bg border border-edge">
                    <Image
                      src={`/favicons/${opt.id}.svg`}
                      alt={opt.name}
                      width={32}
                      height={32}
                      unoptimized
                    />
                  </div>
                  <div className="text-[11px] text-muted font-mono text-center">
                    32px
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-bg border border-edge">
                    <Image
                      src={`/favicons/${opt.id}.svg`}
                      alt={opt.name}
                      width={16}
                      height={16}
                      unoptimized
                    />
                  </div>
                  <div className="text-[11px] text-muted font-mono text-center">
                    16px (탭)
                  </div>
                </div>
              </div>

              <div className="text-sm text-text/85 leading-relaxed">
                {opt.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-edge bg-bg/30 p-4 text-sm text-muted leading-relaxed">
          어느 게 마음에 드는지 답해 줘. 골라지면{" "}
          <code className="font-mono text-text">app/icon.svg</code> 또는{" "}
          <code className="font-mono text-text">app/layout.tsx</code> 의 메타에
          연결해서 실제 브라우저 탭에 적용함.
        </div>
      </div>
    </main>
  );
}
