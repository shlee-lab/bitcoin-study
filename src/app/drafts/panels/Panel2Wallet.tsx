// Panel 2: Alice 가 지갑 앱을 열어 잔액·주소를 본다.
// 폰 클로즈업 + 손이 폰을 잡고있는 모습.

const W = 900;
const H = 540;

export function Panel2Wallet() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* 카페 테이블 위 부드러운 톤 */}
        <radialGradient id="p2bg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%"  stopColor="#e8d8b4" />
          <stop offset="100%" stopColor="#a89870" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#p2bg)" />

      {/* 테이블 wood grain hint */}
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M 0 ${80 + i * 80} Q ${W / 2} ${80 + i * 80 + (i % 2 === 0 ? -10 : 10)} ${W} ${80 + i * 80}`}
          fill="none"
          stroke="#7a6442"
          strokeWidth="0.6"
          opacity="0.3"
        />
      ))}

      {/* Alice 의 두 손 (폰 잡고) */}
      {/* 왼손 (폰 왼쪽 받침) */}
      <g transform="translate(160 320)">
        <path
          d="M 0 200 Q 0 80 30 60 Q 60 40 110 50 L 130 60 L 140 80 L 140 100 L 130 110 L 110 110 L 100 100 Q 90 90 70 90 Q 50 90 40 110 L 40 200 Z"
          fill="#f0d4b6"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 손가락 디테일 */}
        <line x1={130} y1={60} x2={140} y2={80} stroke="#3a2e1a" strokeWidth="1.2" />
        <line x1={120} y1={62} x2={134} y2={78} stroke="#3a2e1a" strokeWidth="0.8" />
        <line x1={108} y1={68} x2={120} y2={84} stroke="#3a2e1a" strokeWidth="0.8" />
      </g>

      {/* 오른손 (폰 화면 위 검지) */}
      <g transform="translate(580 320)">
        <path
          d="M 200 200 Q 200 80 170 60 Q 140 40 90 50 L 70 60 L 60 80 L 60 110 L 70 120 L 90 120 L 100 110 Q 110 100 130 100 Q 150 100 160 120 L 160 200 Z"
          fill="#f0d4b6"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 검지 (화면을 향해 뻗음) */}
        <path
          d="M 70 60 Q 50 30 20 28 Q 0 30 -8 50 Q -10 70 6 80 L 50 80 Z"
          fill="#f0d4b6"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 손톱 */}
        <ellipse cx={2} cy={36} rx={5} ry={3} fill="#fff" opacity="0.5" stroke="#3a2e1a" strokeWidth="0.6" />
      </g>

      {/* 폰 (가운데 큼) */}
      <g transform="translate(280 90)">
        {/* 폰 외곽 */}
        <rect width={340} height={420} rx={36} fill="#1a1a1a" stroke="#0e0d0a" strokeWidth="2.5" />
        {/* 화면 */}
        <rect x={14} y={48} width={312} height={356} rx={4} fill="#f8f4ed" />

        {/* 노치 */}
        <rect x={140} y={20} width={60} height={16} rx={8} fill="#0e0d0a" />
        {/* 카메라 */}
        <circle cx={154} cy={28} r={3} fill="#3a3f4a" />

        {/* 상단 status bar */}
        <text x={28} y={66} fontSize="10" fill="#1a1a1a" fontFamily="ui-monospace, monospace">9:41</text>
        <g transform="translate(280 60)">
          <rect width={14} height={6} fill="#1a1a1a" />
          <rect x={16} y={1} width={4} height={4} fill="#1a1a1a" />
        </g>

        {/* 앱 헤더 */}
        <text x={28} y={102} fontSize="11" fill="#7a6442" fontFamily="ui-monospace, monospace" letterSpacing="2">
          BITCOIN WALLET
        </text>
        <line x1={28} y1={110} x2={312} y2={110} stroke="#1a1a1a" strokeWidth="0.4" opacity="0.3" />

        {/* 잔액 */}
        <text x={28} y={140} fontSize="9" fill="#7a6442" fontFamily="ui-monospace, monospace">BALANCE</text>
        <text x={28} y={186} fontSize="44" fill="#0e0d0a" fontFamily="Georgia, serif" fontWeight="700">
          ₿ 1.4521
        </text>
        <text x={28} y={206} fontSize="11" fill="#7a6442" fontFamily="ui-monospace, monospace">≈ $63,420</text>

        {/* 주소 */}
        <rect x={28} y={228} width={284} height={42} rx={4} fill="#ede1c7" stroke="#1a1a1a" strokeWidth="0.6" />
        <text x={36} y={246} fontSize="8" fill="#7a6442" fontFamily="ui-monospace, monospace">YOUR ADDRESS</text>
        <text x={36} y={262} fontSize="10" fill="#0e0d0a" fontFamily="ui-monospace, monospace">
          bc1qy2u5g8wzdkpgr96fkr5j7lr3dq...
        </text>

        {/* SEND / RECEIVE 버튼 */}
        <rect x={28} y={290} width={134} height={48} rx={4} fill="#f7931a" stroke="#1a1a1a" strokeWidth="1.5" />
        <text x={95} y={320} textAnchor="middle" fontSize="14" fill="#0e0d0a" fontFamily="Inter, sans-serif" fontWeight="700">
          ▲ SEND
        </text>

        <rect x={178} y={290} width={134} height={48} rx={4} fill="#f8f4ed" stroke="#1a1a1a" strokeWidth="1.5" />
        <text x={245} y={320} textAnchor="middle" fontSize="14" fill="#0e0d0a" fontFamily="Inter, sans-serif" fontWeight="700">
          ▼ RECEIVE
        </text>

        {/* 트랜잭션 history hint */}
        <text x={28} y={364} fontSize="9" fill="#7a6442" fontFamily="ui-monospace, monospace">RECENT</text>
        <line x1={28} y1={372} x2={312} y2={372} stroke="#1a1a1a" strokeWidth="0.3" opacity="0.3" />
        <text x={28} y={388} fontSize="10" fill="#0e0d0a" fontFamily="ui-monospace, monospace">+0.012 · 어제</text>
        <text x={300} y={388} textAnchor="end" fontSize="10" fill="#3a8a3a" fontFamily="ui-monospace, monospace">received</text>
      </g>

      {/* 손가락이 SEND 버튼을 향함 · 살짝 누르는 효과 */}
      <circle cx={395} cy={400} r={20} fill="none" stroke="#f7931a" strokeWidth="1.5" opacity="0.7" />
      <circle cx={395} cy={400} r={28} fill="none" stroke="#f7931a" strokeWidth="1" opacity="0.4" />

      {/* Caption */}
      <g transform="translate(20 510)">
        <rect width={260} height={20} fill="#fff" stroke="#1a1a1a" strokeWidth="1.2" />
        <text x={130} y={14} textAnchor="middle" fontSize="11" fill="#1a1a1a" fontFamily="Georgia, serif" fontStyle="italic">
          앱이 잔액과 자기 주소를 보여준다.
        </text>
      </g>

      {/* 사이드 라벨 */}
      <g transform="translate(720 110)">
        <line x1={0} y1={50} x2={-90} y2={28} stroke="#1a1a1a" strokeWidth="0.6" />
        <text x={4} y={36} fontSize="10" fill="#1a1a1a" fontFamily="ui-monospace, monospace" letterSpacing="1.4">
          · 잔액 = 자기 UTXO 의 합
        </text>
        <text x={4} y={52} fontSize="9" fill="#5a4520" fontFamily="ui-monospace, monospace">  &nbsp; (S3)</text>
      </g>

      <g transform="translate(720 230)">
        <line x1={0} y1={20} x2={-72} y2={20} stroke="#1a1a1a" strokeWidth="0.6" />
        <text x={4} y={20} fontSize="10" fill="#1a1a1a" fontFamily="ui-monospace, monospace" letterSpacing="1.4">
          · 주소 = pubkey hash
        </text>
        <text x={4} y={36} fontSize="9" fill="#5a4520" fontFamily="ui-monospace, monospace">  &nbsp; (S1a)</text>
      </g>

      <g transform="translate(80 380)">
        <line x1={140} y1={20} x2={210} y2={20} stroke="#1a1a1a" strokeWidth="0.6" />
        <text fontSize="10" fill="#1a1a1a" fontFamily="ui-monospace, monospace" letterSpacing="1.4">
          · 시드는 보안 영역에 (S1b)
        </text>
      </g>
    </svg>
  );
}
