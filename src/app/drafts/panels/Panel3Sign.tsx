// Panel 3: 트랜잭션에 서명. 비유 · 트랜잭션 종이가 뜨고
// 비밀키로 봉인 (왁스 스탬프). 한 컷의 ‘의식’ 처럼.

const W = 900;
const H = 540;

export function Panel3Sign() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="p3bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#1a1f2e" />
          <stop offset="100%" stopColor="#0a0c14" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="url(#p3bg)" />

      {/* 그리드 floor (아주 약하게) */}
      <g opacity="0.15">
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1={W / 2 - 400 + i * 100}
            y1={420}
            x2={W / 2 - 200 + i * 50}
            y2={540}
            stroke="#5b8def"
            strokeWidth="0.4"
          />
        ))}
        <line x1={50} y1={420} x2={W - 50} y2={420} stroke="#5b8def" strokeWidth="0.5" />
      </g>

      {/* 떠있는 트랜잭션 종이 (큰 가운데) */}
      <g transform={`translate(${W / 2} 220)`}>
        {/* 종이 그림자 */}
        <rect x={-160} y={-110} width={320} height={250} rx={4} fill="#000" opacity="0.5" transform="translate(8 12)" />
        {/* 종이 본체 */}
        <rect x={-160} y={-110} width={320} height={250} rx={2} fill="#f5ecd9" stroke="#3a2e1a" strokeWidth="1.5" />
        {/* 종이 안 텍스트 (트랜잭션 필드들) */}
        <text x={-140} y={-78} fontSize="11" fill="#3a2e1a" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="3">
          TRANSACTION
        </text>
        <line x1={-140} y1={-66} x2={140} y2={-66} stroke="#3a2e1a" strokeWidth="0.5" />

        <text x={-140} y={-44} fontSize="9" fill="#7a5e30" fontFamily="ui-monospace, monospace">FROM</text>
        <text x={-100} y={-44} fontSize="9" fill="#3a2e1a" fontFamily="ui-monospace, monospace">bc1qy2u5g8...3l8c</text>

        <text x={-140} y={-24} fontSize="9" fill="#7a5e30" fontFamily="ui-monospace, monospace">TO</text>
        <text x={-100} y={-24} fontSize="9" fill="#3a2e1a" fontFamily="ui-monospace, monospace">bc1qw508d6...3t4</text>

        <text x={-140} y={-4} fontSize="9" fill="#7a5e30" fontFamily="ui-monospace, monospace">AMOUNT</text>
        <text x={-100} y={-4} fontSize="11" fill="#3a2e1a" fontFamily="ui-monospace, monospace" fontWeight="700">₿ 1.00000000</text>

        <text x={-140} y={16} fontSize="9" fill="#7a5e30" fontFamily="ui-monospace, monospace">FEE</text>
        <text x={-100} y={16} fontSize="9" fill="#3a2e1a" fontFamily="ui-monospace, monospace">0.0001 BTC · ~ 12 sat/vB</text>

        <text x={-140} y={36} fontSize="9" fill="#7a5e30" fontFamily="ui-monospace, monospace">UTXO</text>
        <text x={-100} y={36} fontSize="9" fill="#3a2e1a" fontFamily="ui-monospace, monospace">5d4e8c...2a1b · 1.4 BTC</text>

        {/* 점선 separator */}
        <line x1={-140} y1={56} x2={140} y2={56} stroke="#3a2e1a" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* 빈 서명 영역 */}
        <text x={-140} y={76} fontSize="9" fill="#7a5e30" fontFamily="ui-monospace, monospace">SIGNATURE</text>
        <rect x={-140} y={84} width={280} height={42} fill="none" stroke="#3a2e1a" strokeWidth="0.6" strokeDasharray="2 3" />
        <text x={0} y={108} textAnchor="middle" fontSize="9" fill="#a89870" fontFamily="ui-monospace, monospace" fontStyle="italic">
          (waiting for signature...)
        </text>
      </g>

      {/* 비밀키 (종이 위로 손이 가져옴) */}
      <g transform="translate(620 380)">
        {/* 손 */}
        <path
          d="M 0 60 Q 0 0 30 -10 Q 60 -16 90 -10 L 110 0 L 120 20 L 116 36 L 100 40 L 84 32 Q 70 26 56 30 L 40 40 L 30 60 Z"
          fill="#f0d4b6"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 검지/엄지 디테일 */}
        <line x1={108} y1={2} x2={120} y2={20} stroke="#3a2e1a" strokeWidth="1.2" />

        {/* 키 (손에 들고있음) */}
        <g transform="translate(56 -34)" filter="">
          {/* 키 spike & 황금 발광 */}
          <circle cx={20} cy={-2} r={20} fill="#f7931a" opacity="0.18" />
          <circle cx={20} cy={-2} r={11} fill="none" stroke="#ffd58a" strokeWidth="2.6" />
          <circle cx={20} cy={-2} r={4} fill="#ffd58a" />
          <line x1={28} y1={-2} x2={68} y2={-2} stroke="#ffd58a" strokeWidth="2.6" strokeLinecap="round" />
          <line x1={56} y1={-2} x2={56} y2={6} stroke="#ffd58a" strokeWidth="2.6" strokeLinecap="round" />
          <line x1={62} y1={-2} x2={62} y2={8} stroke="#ffd58a" strokeWidth="2.6" strokeLinecap="round" />
          <line x1={68} y1={-2} x2={68} y2={6} stroke="#ffd58a" strokeWidth="2.6" strokeLinecap="round" />
        </g>

        {/* 라벨 */}
        <text x={60} y={86} textAnchor="middle" fontSize="10" fill="#ffd58a" fontFamily="ui-monospace, monospace" letterSpacing="1.5">
          PRIVATE KEY · d
        </text>
      </g>

      {/* 서명되는 흐름 · 키에서 종이 서명 영역으로 빛 줄기 */}
      <path
        d="M 670 358 Q 600 320 540 312"
        fill="none"
        stroke="#ffd58a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      {/* 서명 영역에 떨어지는 빛 spark */}
      <g transform="translate(450 312)">
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const r1 = 6, r2 = 16;
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={Math.cos(rad) * r1}
              y1={Math.sin(rad) * r1}
              x2={Math.cos(rad) * r2}
              y2={Math.sin(rad) * r2}
              stroke="#ffd58a"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.8"
            />
          );
        })}
        <circle r={5} fill="#ffd58a" />
      </g>

      {/* 좌측 · ECDSA 수식이 뒤에 떠있음 (장식) */}
      <g transform="translate(50 260)" opacity="0.55">
        <text fontSize="11" fill="#5b8def" fontFamily="ui-monospace, monospace">
          k ← rand
        </text>
        <text y={18} fontSize="11" fill="#5b8def" fontFamily="ui-monospace, monospace">
          R = k · G
        </text>
        <text y={36} fontSize="11" fill="#5b8def" fontFamily="ui-monospace, monospace">
          r = R.x mod n
        </text>
        <text y={54} fontSize="11" fill="#ffd58a" fontFamily="ui-monospace, monospace">
          s = k⁻¹(H(m) + r·d) mod n
        </text>
        <text y={72} fontSize="10" fill="#5b8def" fontFamily="ui-monospace, monospace" opacity="0.7">
          → sig (r, s)
        </text>
      </g>

      {/* 좌하단 · 캡션 */}
      <g transform="translate(20 510)">
        <rect width={300} height={20} fill="#f5ecd9" stroke="#1a1a1a" strokeWidth="1.2" />
        <text x={150} y={14} textAnchor="middle" fontSize="11" fill="#1a1a1a" fontFamily="Georgia, serif" fontStyle="italic">
          비밀키 d 만이 그 봉인을 만들 수 있다.
        </text>
      </g>

      {/* 우측 화살표 (다음 패널 hint) */}
      <g transform={`translate(${W - 120} 240)`} opacity="0.55">
        <text fontSize="10" fill="#a0a8b8" fontFamily="ui-monospace, monospace" letterSpacing="2">
          NEXT
        </text>
        <text y={14} fontSize="9" fill="#7a8190" fontFamily="ui-monospace, monospace">
          BROADCAST
        </text>
        <text y={26} fontSize="14" fill="#5b8def" fontFamily="ui-monospace, monospace">→</text>
      </g>
    </svg>
  );
}
