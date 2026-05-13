// Panel 4: 서명된 트랜잭션이 P2P 네트워크에 퍼진다.
// Alice 폰이 가운데, 거기서 동심원 파동이 노드들로 전파.

const W = 900;
const H = 540;

export function Panel4Network() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="p4bg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%"  stopColor="#1a2a3a" />
          <stop offset="100%" stopColor="#08090f" />
        </radialGradient>
        <radialGradient id="p4Wave" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"  stopColor="#5b8def" stopOpacity="0" />
          <stop offset="80%" stopColor="#5b8def" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5b8def" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#p4bg)" />

      {/* 별 / 깊이 */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 73) % W + ((i * 17) % 30);
        const y = ((i * 41) % H);
        return <circle key={i} cx={x} cy={y} r={0.6} fill="#5b8def" opacity={0.25 + ((i * 7) % 30) / 100} />;
      })}

      {/* 동심원 파동 (Alice 폰에서 출발) */}
      {[60, 120, 180, 240, 300, 360].map((r, i) => (
        <circle
          key={i}
          cx={W / 2}
          cy={H / 2 + 10}
          r={r}
          fill="none"
          stroke="#5b8def"
          strokeWidth={1.6 - i * 0.18}
          opacity={0.55 - i * 0.07}
        />
      ))}

      {/* 노드들 (대륙 모양처럼 무작위 배치) */}
      {(() => {
        const nodes: { x: number; y: number; r: number; lit?: boolean }[] = [
          // cluster 1 (좌상)
          { x: 130, y: 110, r: 6, lit: true },
          { x: 80, y: 160, r: 5 },
          { x: 180, y: 80, r: 4 },
          { x: 220, y: 140, r: 5, lit: true },
          // cluster 2 (우상)
          { x: 730, y: 90, r: 5, lit: true },
          { x: 800, y: 130, r: 6 },
          { x: 680, y: 150, r: 4 },
          { x: 850, y: 80, r: 5, lit: true },
          // cluster 3 (좌하)
          { x: 90, y: 380, r: 5, lit: true },
          { x: 150, y: 430, r: 4 },
          { x: 220, y: 380, r: 6, lit: true },
          { x: 60, y: 430, r: 4 },
          // cluster 4 (우하)
          { x: 760, y: 380, r: 5 },
          { x: 820, y: 430, r: 6, lit: true },
          { x: 700, y: 440, r: 4 },
          // 중앙 sub
          { x: 320, y: 220, r: 4 },
          { x: 580, y: 230, r: 4, lit: true },
          { x: 320, y: 350, r: 4 },
          { x: 580, y: 360, r: 5, lit: true },
        ];
        return (
          <g>
            {/* 노드 간 연결 (가까운 점끼리 + 일부 longer) */}
            {nodes.flatMap((a, i) =>
              nodes.slice(i + 1).map((b, j) => {
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d > 200) return null;
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#5b8def"
                    strokeWidth="0.5"
                    opacity={0.4 - d / 600}
                  />
                );
              }),
            )}
            {/* 노드 */}
            {nodes.map((n, i) => (
              <g key={i}>
                {n.lit && <circle cx={n.x} cy={n.y} r={n.r + 8} fill="#5b8def" opacity="0.18" />}
                <circle cx={n.x} cy={n.y} r={n.r} fill="#0a0c14" stroke="#5b8def" strokeWidth="1.4" />
                {n.lit && <circle cx={n.x} cy={n.y} r={n.r - 2.5} fill="#5b8def" />}
              </g>
            ))}

            {/* 노드에서 노드로 흐르는 작은 패킷 (트랜잭션 복사본) */}
            {[
              { x: 280, y: 180, c: "#5b8def" },
              { x: 380, y: 230, c: "#5b8def" },
              { x: 470, y: 270, c: "#5b8def" },
              { x: 540, y: 310, c: "#5b8def" },
              { x: 620, y: 280, c: "#5b8def" },
              { x: 250, y: 340, c: "#5b8def" },
              { x: 460, y: 380, c: "#5b8def" },
              { x: 700, y: 250, c: "#5b8def" },
            ].map((p, i) => (
              <rect
                key={i}
                x={p.x - 4}
                y={p.y - 4}
                width={8}
                height={8}
                fill="none"
                stroke="#ffd58a"
                strokeWidth="1.2"
                opacity="0.85"
                transform={`rotate(45 ${p.x} ${p.y})`}
              />
            ))}
          </g>
        );
      })()}

      {/* 가운데: Alice 폰 (작은 스마트폰 silhouette) */}
      <g transform={`translate(${W / 2 - 26} ${H / 2 - 52})`}>
        {/* 폰 글로우 */}
        <circle cx={26} cy={62} r={50} fill="url(#p4Wave)" />
        {/* 폰 */}
        <rect width={52} height={104} rx={8} fill="#0e0d0a" stroke="#ffd58a" strokeWidth="1.6" />
        <rect x={4} y={10} width={44} height={84} rx={2} fill="#5b8def" />
        <text x={26} y={48} textAnchor="middle" fontSize="9" fill="#fff" fontFamily="ui-monospace, monospace">SENT</text>
        <text x={26} y={62} textAnchor="middle" fontSize="14" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="700">₿1.0</text>
        <text x={26} y={76} textAnchor="middle" fontSize="6" fill="#fff" fontFamily="ui-monospace, monospace">▶ broadcast</text>
        {/* 발광 점 */}
        <circle cx={26} cy={108} r={3} fill="#ffd58a" />
      </g>

      {/* INV / GETDATA / TX 라벨 (가십 메시지 종류) */}
      <g fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="1.5">
        <g transform="translate(330 200)" fill="#5b8def" opacity="0.85">
          <text>inv</text>
        </g>
        <g transform="translate(560 200)" fill="#5b8def" opacity="0.85">
          <text>getdata</text>
        </g>
        <g transform="translate(420 380)" fill="#ffd58a" opacity="0.95">
          <text>tx</text>
        </g>
        <g transform="translate(220 250)" fill="#5b8def" opacity="0.6">
          <text>inv</text>
        </g>
        <g transform="translate(680 360)" fill="#5b8def" opacity="0.6">
          <text>inv</text>
        </g>
      </g>

      {/* 좌상단 라벨 */}
      <g transform="translate(40 40)">
        <text fontSize="11" fill="#5b8def" fontFamily="ui-monospace, monospace" letterSpacing="2">
          P2P GOSSIP
        </text>
        <text y={16} fontSize="9" fill="#a0a8b8" fontFamily="ui-monospace, monospace">
          neighbor → neighbor
        </text>
        <text y={28} fontSize="9" fill="#a0a8b8" fontFamily="ui-monospace, monospace">
          ~6 hops, 전 세계 ~10 sec
        </text>
      </g>

      {/* 우상단 시간 표시 */}
      <g transform={`translate(${W - 40} 40)`} textAnchor="end">
        <text fontSize="11" fill="#ffd58a" fontFamily="ui-monospace, monospace" letterSpacing="2">
          T + 10 s
        </text>
        <text y={16} fontSize="9" fill="#a0a8b8" fontFamily="ui-monospace, monospace">
          mempool 합류 중
        </text>
      </g>

      {/* 캡션 */}
      <g transform="translate(20 510)">
        <rect width={400} height={20} fill="#fff" stroke="#1a1a1a" strokeWidth="1.2" />
        <text x={200} y={14} textAnchor="middle" fontSize="11" fill="#1a1a1a" fontFamily="Georgia, serif" fontStyle="italic">
          서명된 트랜잭션이 이웃 노드로, 다시 그들의 이웃으로.
        </text>
      </g>
    </svg>
  );
}
