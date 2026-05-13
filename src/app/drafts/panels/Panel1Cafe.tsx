// Panel 1: 카페. Alice 가 폰을 들고 있고, Bob 이 마주 앉아있다.
// 큰 flat color 면 + 솔리드 실루엣. 얼굴 디테일 최소화.

const W = 900;
const H = 540;

export function Panel1Cafe() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* 카페 따뜻한 배경 */}
        <linearGradient id="p1bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#d6c9a8" />
          <stop offset="60%" stopColor="#c8b894" />
          <stop offset="100%" stopColor="#9a8866" />
        </linearGradient>
      </defs>

      {/* 벽 + 바닥 */}
      <rect width={W} height={H} fill="url(#p1bg)" />
      <rect y={400} width={W} height={140} fill="#7a6442" />
      <line x1={0} y1={400} x2={W} y2={400} stroke="#3a2e1a" strokeWidth="1.4" />

      {/* 창문 (벽에 액자처럼) */}
      <g transform="translate(60 70)">
        <rect width={150} height={90} fill="#7fb3d0" stroke="#3a2e1a" strokeWidth="1.5" />
        <line x1={75} y1={0} x2={75} y2={90} stroke="#3a2e1a" strokeWidth="1.5" />
        <line x1={0} y1={45} x2={150} y2={45} stroke="#3a2e1a" strokeWidth="1.5" />
        <circle cx={120} cy={20} r={9} fill="#fff5c8" />
      </g>

      {/* 메뉴판 */}
      <g transform="translate(720 60)">
        <rect width={130} height={170} fill="#1a1a1a" />
        <text x={65} y={28} textAnchor="middle" fontSize="13" fill="#f0e2c4" fontFamily="Georgia, serif" letterSpacing="2">MENU</text>
        <line x1={20} y1={38} x2={110} y2={38} stroke="#f0e2c4" strokeWidth="0.4" />
        <text x={20} y={58} fontSize="9" fill="#f0e2c4" fontFamily="ui-monospace, monospace">ESPRESSO</text>
        <text x={110} y={58} textAnchor="end" fontSize="9" fill="#f0e2c4" fontFamily="ui-monospace, monospace">₿ .00003</text>
        <text x={20} y={76} fontSize="9" fill="#f0e2c4" fontFamily="ui-monospace, monospace">LATTE</text>
        <text x={110} y={76} textAnchor="end" fontSize="9" fill="#f0e2c4" fontFamily="ui-monospace, monospace">₿ .00005</text>
        <text x={20} y={94} fontSize="9" fill="#f0e2c4" fontFamily="ui-monospace, monospace">CAKE</text>
        <text x={110} y={94} textAnchor="end" fontSize="9" fill="#f0e2c4" fontFamily="ui-monospace, monospace">₿ .00012</text>
        <text x={20} y={132} fontSize="8" fill="#a89870" fontFamily="ui-monospace, monospace">PAY WITH</text>
        <text x={20} y={148} fontSize="11" fill="#f7931a" fontFamily="ui-monospace, monospace">▲ BITCOIN</text>
      </g>

      {/* 테이블 (가운데) */}
      <g>
        <ellipse cx={W / 2} cy={420} rx={210} ry={28} fill="#3a2e1a" />
        <ellipse cx={W / 2} cy={414} rx={210} ry={26} fill="#5a4a2e" />
        <line x1={W / 2 - 200} y1={414} x2={W / 2 - 200} y2={500} stroke="#3a2e1a" strokeWidth="6" />
        <line x1={W / 2 + 200} y1={414} x2={W / 2 + 200} y2={500} stroke="#3a2e1a" strokeWidth="6" />
      </g>

      {/* Alice (좌측, 파란 톤) */}
      <g transform="translate(180 220)">
        {/* 머리 */}
        <circle cx={50} cy={50} r={42} fill="#f0d4b6" stroke="#3a2e1a" strokeWidth="1.5" />
        {/* 단발머리 */}
        <path
          d="M 8 50 Q 10 8 50 6 Q 90 8 92 50 L 92 70 Q 84 64 76 64 L 76 50 Q 60 36 36 38 L 24 56 L 24 64 Q 16 64 8 70 Z"
          fill="#2a1f12"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 눈 */}
        <ellipse cx={36} cy={56} rx={2} ry={3} fill="#1a1a1a" />
        <ellipse cx={64} cy={56} rx={2} ry={3} fill="#1a1a1a" />
        {/* 입 (살짝 미소) */}
        <path d="M 42 70 Q 50 74 58 70" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
        {/* 볼 */}
        <circle cx={28} cy={68} r={3.5} fill="#e88a8a" opacity="0.55" />
        <circle cx={72} cy={68} r={3.5} fill="#e88a8a" opacity="0.55" />

        {/* 목 + 몸 (블루 셔츠) */}
        <rect x={42} y={92} width={16} height={14} fill="#f0d4b6" stroke="#3a2e1a" strokeWidth="1.5" />
        <path
          d="M 0 200 Q 0 130 32 110 L 68 110 Q 100 130 100 200 Z"
          fill="#5b8def"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 옷깃 */}
        <path d="M 30 110 L 50 130 L 70 110" fill="none" stroke="#3a2e1a" strokeWidth="1.5" />

        {/* 팔 (오른쪽, 폰 든 모습) */}
        <path
          d="M 70 130 Q 100 140 130 160 Q 138 168 134 178"
          fill="#5b8def"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 70 130 Q 100 140 130 160 Q 138 168 134 178 L 138 158 Q 110 138 80 120 Z"
          fill="#5b8def"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* 손 (폰 들고) */}
        <ellipse cx={134} cy={186} rx={14} ry={10} fill="#f0d4b6" stroke="#3a2e1a" strokeWidth="1.5" />

        {/* 폰 */}
        <g transform="translate(122 162)">
          <rect width={36} height={56} rx={5} fill="#1a1a1a" stroke="#3a2e1a" strokeWidth="1.4" />
          <rect x={3} y={6} width={30} height={42} rx={1.5} fill="#5b8def" />
          <text x={18} y={22} textAnchor="middle" fontSize="6" fill="#fff" fontFamily="ui-monospace, monospace">SEND</text>
          <text x={18} y={32} textAnchor="middle" fontSize="9" fill="#fff" fontFamily="ui-monospace, monospace" fontWeight="700">₿ 1.0</text>
          <text x={18} y={42} textAnchor="middle" fontSize="5.5" fill="#fff" fontFamily="ui-monospace, monospace">▶ TAP</text>
        </g>
      </g>

      {/* Bob (우측, 오렌지 톤) */}
      <g transform="translate(580 220)">
        <circle cx={70} cy={50} r={42} fill="#f0d4b6" stroke="#3a2e1a" strokeWidth="1.5" />
        {/* 짧은 머리 + 안경 */}
        <path
          d="M 28 32 Q 40 12 70 8 Q 100 12 112 32 L 112 50 L 100 50 Q 96 38 70 36 Q 44 38 40 50 L 28 50 Z"
          fill="#2a1f12"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 안경 */}
        <circle cx={56} cy={56} r={9} fill="none" stroke="#1a1a1a" strokeWidth="1.4" />
        <circle cx={84} cy={56} r={9} fill="none" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1={65} y1={56} x2={75} y2={56} stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1={47} y1={56} x2={42} y2={54} stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1={93} y1={56} x2={98} y2={54} stroke="#1a1a1a" strokeWidth="1.4" />
        {/* 눈 */}
        <ellipse cx={56} cy={56} rx={1.6} ry={2} fill="#1a1a1a" />
        <ellipse cx={84} cy={56} rx={1.6} ry={2} fill="#1a1a1a" />
        {/* 입 */}
        <path d="M 60 74 Q 70 76 80 74" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />

        {/* 목 + 몸 (오렌지 후드) */}
        <rect x={62} y={92} width={16} height={14} fill="#f0d4b6" stroke="#3a2e1a" strokeWidth="1.5" />
        <path
          d="M 20 200 Q 20 130 52 110 L 88 110 Q 120 130 120 200 Z"
          fill="#f7931a"
          stroke="#3a2e1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 후드 끈 */}
        <line x1={65} y1={114} x2={65} y2={150} stroke="#3a2e1a" strokeWidth="1.2" />
        <line x1={75} y1={114} x2={75} y2={150} stroke="#3a2e1a" strokeWidth="1.2" />
        <circle cx={65} cy={152} r={2} fill="#3a2e1a" />
        <circle cx={75} cy={152} r={2} fill="#3a2e1a" />

        {/* 왼팔 (커피잔) */}
        <path
          d="M 22 130 Q -2 156 -8 178 Q -8 188 -2 192"
          fill="#f7931a"
          stroke="#3a2e1a"
          strokeWidth="1.5"
        />
        <ellipse cx={-4} cy={194} rx={14} ry={10} fill="#f0d4b6" stroke="#3a2e1a" strokeWidth="1.5" />
        {/* 커피잔 */}
        <g transform="translate(-26 188)">
          <rect width={26} height={20} rx={2} fill="#fff" stroke="#3a2e1a" strokeWidth="1.4" />
          <ellipse cx={13} cy={2} rx={13} ry={3} fill="#5a3a1a" stroke="#3a2e1a" strokeWidth="1" />
          <path d="M 26 6 Q 34 6 34 12 Q 34 18 26 18" fill="none" stroke="#3a2e1a" strokeWidth="1.4" />
        </g>
      </g>

      {/* 코인 (Alice 폰 → Bob 사이 공중) */}
      <g transform="translate(490 320)">
        <circle r={28} fill="#ffd58a" opacity="0.5" />
        <circle r={20} fill="#f7931a" stroke="#3a2e1a" strokeWidth="1.5" />
        <text textAnchor="middle" y={7} fontSize="22" fill="#3a2e1a" fontFamily="Inter, sans-serif" fontWeight="700">₿</text>
        {/* 움직임 라인 */}
        <line x1={-30} y1={-12} x2={-44} y2={-16} stroke="#3a2e1a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1={-30} y1={0} x2={-50} y2={0} stroke="#3a2e1a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1={-30} y1={12} x2={-44} y2={16} stroke="#3a2e1a" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Speech bubbles */}
      <g transform="translate(285 130)">
        <path
          d="M 0 30 Q 0 0 30 0 L 200 0 Q 230 0 230 30 L 230 56 Q 230 70 220 72 L 50 72 L 30 92 L 36 72 Q 0 70 0 56 Z"
          fill="#fff"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <text x={115} y={32} textAnchor="middle" fontSize="14" fill="#1a1a1a" fontFamily="Georgia, serif" fontWeight="600">
          커피 한 잔 사 줄게.
        </text>
        <text x={115} y={54} textAnchor="middle" fontSize="13" fill="#3a2e1a" fontFamily="Georgia, serif">
          1 BTC 보내면 돼?
        </text>
      </g>

      <g transform="translate(490 420)">
        <path
          d="M 0 22 Q 0 0 22 0 L 140 0 Q 162 0 162 22 L 162 42 Q 162 50 154 52 L 132 52 L 122 64 L 124 52 L 22 52 Q 0 50 0 42 Z"
          fill="#fff"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <text x={81} y={32} textAnchor="middle" fontSize="13" fill="#1a1a1a" fontFamily="Georgia, serif">
          내 주소 알려줄게.
        </text>
      </g>

      {/* 패널 자막 */}
      <g transform="translate(20 510)">
        <rect width={170} height={20} fill="#fff" stroke="#1a1a1a" strokeWidth="1.2" />
        <text x={85} y={14} textAnchor="middle" fontSize="11" fill="#1a1a1a" fontFamily="Georgia, serif" fontStyle="italic">
          어느 카페, 평일 오후
        </text>
      </g>
    </svg>
  );
}
