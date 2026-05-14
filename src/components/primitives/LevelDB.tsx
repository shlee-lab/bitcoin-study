"use client";

import { Term } from "../Term";

export const LevelDBMeta = {
  id: "leveldb" as const,
  title: "LevelDB · key-value store",
  oneLiner: "LSM 기반 KV 저장소. 비트코인 노드의 ChainState 와 Block index 가 여기 산다.",
};

export function LevelDBBody() {
  return (
    <div className="text-sm leading-relaxed text-text/90 space-y-7">
      <p>
        Bitcoin Core 가 디스크에 저장하는 두 핵심 자료구조 (현재 모든{" "}
        <Term id="utxo">UTXO</Term> 셋, 그리고 지금까지 본 모든 블록의
        헤더+위치 인덱스) 가 모두 LevelDB. RDBMS 가 아니라 KV(key-value) 인
        이유, 그리고 어떻게 빠른지.
      </p>

      <Section title="① 두 LevelDB 의 데이터 모델">
        <KvExample />
      </Section>

      <Section title="② 왜 SQL 이 아니라 LevelDB 인가">
        <ReasonGrid />
      </Section>

      <Section title="③ 노드가 종료될 때">
        <p>
          ChainState 는 메모리 캐시 + 디스크 LevelDB 가 함께 있어, 정상 종료
          시에는 메모리 상태를 디스크로 flush 한 뒤 종료된다. 비정상 종료 (전원 끔 등)
          후 재시작할 때는{" "}
          <span className="text-text">undo data</span> 로 마지막 일관 상태까지
          되감거나 (rollback), 일정 깊이부터 재검증해 일관성을 회복한다.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-1 h-4 rounded-sm bg-accent2" />
        <div className="text-[14px] font-medium text-text">{title}</div>
      </div>
      {children}
    </div>
  );
}

function KvExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <DbCard
        name="ChainState"
        purpose="현재 안 쓴 UTXO 들"
        keyExample="C 7b3a4f…e90d:0"
        keyDesc="key = 'C' prefix + txid + vout (33 byte)"
        valueExample={[
          ["amount", "1.0000 BTC"],
          ["scriptPubKey", "OP_0 <pubkeyhash>"],
          ["height", "812 345"],
        ]}
      />
      <DbCard
        name="Block index"
        purpose="모든 블록의 헤더 + 디스크 위치"
        keyExample="b 000000…0a3f1c"
        keyDesc="key = 'b' prefix + block_hash"
        valueExample={[
          ["header", "version | prev | merkle | …"],
          ["height", "812 345"],
          ["file", "blk00345.dat @ offset 1234"],
        ]}
      />
    </div>
  );
}

function DbCard({
  name,
  purpose,
  keyExample,
  keyDesc,
  valueExample,
}: {
  name: string;
  purpose: string;
  keyExample: string;
  keyDesc: string;
  valueExample: [string, string][];
}) {
  return (
    <div className="rounded-sm border border-edge bg-surface/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-edge flex items-baseline justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-accent border border-accent/40 rounded px-1.5 py-0.5">
          LevelDB
        </span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="text-[13px] text-muted">{purpose}</div>
        <div>
          <div className="text-xs text-muted font-mono mb-1">key</div>
          <div className="font-mono text-[13px] text-accent2 break-all">
            {keyExample}
          </div>
          <div className="text-xs text-muted mt-1">{keyDesc}</div>
        </div>
        <div>
          <div className="text-xs text-muted font-mono mb-1">value</div>
          <div className="rounded border border-edge bg-bg/60 p-2.5 font-mono text-[12px] space-y-1">
            {valueExample.map(([k, v], i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-2">
                <span className="text-muted">{k}</span>
                <span className="text-text/85 break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReasonGrid() {
  const items: { title: string; body: React.ReactNode }[] = [
    {
      title: "단순 access pattern",
      body:
        "outpoint 으로 lookup, write 도 outpoint 단위. JOIN, 트랜잭션 ACID, 복잡한 쿼리가 필요 없다.",
    },
    {
      title: "높은 쓰기 빈도",
      body: (
        <>
          블록 하나당 수천 UTXO 가 추가/삭제. SQL 의 인덱스 유지 비용이 부담.{" "}
          <Term id="lsm-tree">LSM</Term> 의 sequential 쓰기가 더 적합.
        </>
      ),
    },
    {
      title: "Embed 가능한 라이브러리",
      body:
        "별도 DB 서버 안 띄우고 노드 프로세스 안에서 직접 호출. 운영 단순 + latency ↓.",
    },
    {
      title: "코드와 함께 검증된 조합",
      body:
        "구글이 만든 표준 라이브러리. Bitcoin Core 가 오랜 시간 검증해온 조합이라 ‘안전한 default’.",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-sm border border-edge bg-surface/30 p-3.5"
        >
          <h4 className="text-[16px] font-medium text-accent2 leading-snug mb-2">
            {it.title}
          </h4>
          <div className="text-sm text-text/85 leading-relaxed">{it.body}</div>
        </div>
      ))}
    </div>
  );
}
