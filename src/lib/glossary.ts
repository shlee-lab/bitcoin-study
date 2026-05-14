export type GlossaryEntry = {
  term: string;
  def: string;
  bip?: {
    number: number;
    title?: string;
    proposed?: string;
    status?: "Final" | "Active" | "Draft" | "Proposed" | "Replaced" | "Withdrawn";
    activated?: string;
    url?: string;
  };
  link?: { label: string; url: string };
};

export const GLOSSARY: Record<string, GlossaryEntry> = {
  "finite-field": {
    term: "유한체 (finite field, 𝔽ₚ)",
    def: "원소가 유한히 많은 집합 위에 덧셈·곱셈을 정의한 수학 구조. 비트코인 secp256k1 곡선은 큰 소수 p ≈ 2²⁵⁶ 위 𝔽ₚ 에서 정의된다.",
  },
  "bip": {
    term: "BIP (Bitcoin Improvement Proposal)",
    def: "비트코인 프로토콜에 추가/변경을 제안하는 공식 문서. 누구나 GitHub bitcoin/bips 저장소에 PR 로 제안 → 커뮤니티 토론 → 번호 부여 (Draft) → 구현·테스트 → 채택 시 'Final' 또는 'Active'. 강제력은 없고 사실상의 표준 (de facto). 소프트포크는 보통 95% 마이너 신호로 활성화된다. 다른 체인도 거의 같은 패턴이다. 이더리움은 EIP (Ethereum Improvement Proposal), Cardano 는 CIP, Solana 는 SIMD 등. 자료를 검색할 때 ‘체인 이름 + IP’ 형태로 나오는 게 보통이다.",
    link: {
      label: "github.com/bitcoin/bips",
      url: "https://github.com/bitcoin/bips",
    },
  },
  "orphan-block": {
    term: "Orphan / stale block",
    def: "거의 동시에 두 블록이 발견되어 잠시 fork 가 생긴 뒤, 다른 갈래가 더 많은 작업을 쌓아 선택되면서 버려진 블록. 그 블록 안의 일반 트랜잭션은 보통 mempool 로 돌아가 다음 블록에 다시 들어갈 수 있다.",
  },
  "bip39": {
    term: "BIP39",
    def: "12-24 영어 단어로 seed entropy 를 표현하고 다시 64-byte seed 로 변환하는 표준. 거의 모든 지갑이 채택. 공식 BIP 상태는 여전히 Proposed (Final 로 승격된 적 없음) 인데, 이는 비트코인에서 흔한 패턴이다. 사실상 표준 (de facto) 과 공식 상태 (de jure) 가 분리되어 있다. 같은 이유로 BIP44 (derivation path 표준) 도 Proposed 그대로.",
    bip: {
      number: 39,
      title: "Mnemonic code for generating deterministic keys",
      proposed: "2013-09",
      status: "Proposed",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki",
    },
  },
  "bip32": {
    term: "BIP32",
    def: "seed 에서 master key 를, master key 에서 자식 키들을 결정론적으로 파생하는 트리 구조. HD wallet 의 토대.",
    bip: {
      number: 32,
      title: "Hierarchical Deterministic Wallets",
      proposed: "2012-02",
      status: "Final",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki",
    },
  },
  "bip44": {
    term: "BIP44",
    def: "m/44'/coin'/account'/change/index 형태의 derivation path 표준. 지갑 간 호환성의 핵심.",
    bip: {
      number: 44,
      title: "Multi-Account Hierarchy for Deterministic Wallets",
      proposed: "2014-04",
      status: "Final",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki",
    },
  },
  "bip141": {
    term: "BIP141 (SegWit)",
    def: "서명 데이터를 트랜잭션 본체에서 ‘witness’ 영역으로 분리. malleability 해결 + 블록 무게 (weight) 단위 도입.",
    bip: {
      number: 141,
      title: "Segregated Witness (Consensus layer)",
      proposed: "2015-12",
      status: "Final",
      activated: "2017-08",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki",
    },
  },
  "bip340": {
    term: "BIP340 (Schnorr)",
    def: "secp256k1 위 Schnorr 서명 표준. ECDSA 보다 단순하고 합산 가능 (key/signature aggregation).",
    bip: {
      number: 340,
      title: "Schnorr Signatures for secp256k1",
      proposed: "2020-01",
      status: "Final",
      activated: "2021-11",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki",
    },
  },
  "bip341": {
    term: "BIP341 (Taproot)",
    def: "Schnorr 서명 + 머클화된 script tree 잠금 패턴. 단일 서명·다중 서명·복잡한 script 가 외부에선 시각적으로 같게 보여 프라이버시 ↑.",
    bip: {
      number: 341,
      title: "Taproot: SegWit version 1 spending rules",
      proposed: "2020-01",
      status: "Final",
      activated: "2021-11",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki",
    },
  },
  "bip125": {
    term: "BIP125 (RBF)",
    def: "Replace-By-Fee. 같은 input 을 쓰면서 fee 만 올린 새 트랜잭션을 보내면 mempool 에서 교체된다.",
    bip: {
      number: 125,
      title: "Opt-in Full Replace-by-Fee Signaling",
      proposed: "2015-12",
      status: "Final",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki",
    },
  },
  "bip173": {
    term: "BIP173 (Bech32)",
    def: "SegWit v0 주소 인코딩 (bc1q…). base32 알파벳 + BCH 코드 기반 강한 체크섬으로 오타 탐지.",
    bip: {
      number: 173,
      title: "Base32 address format for native v0-16 witness outputs",
      proposed: "2017-03",
      status: "Final",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki",
    },
  },
  "bip352": {
    term: "BIP352 (Silent Payments)",
    def: "받는 쪽 주소를 매번 새로 만들지 않고도, 송금자 측 계산만으로 매 송금마다 새 주소를 도출. 체인 분석에 의한 ‘같은 사람이 받은 돈 합산’ 을 어렵게 한다.",
    bip: {
      number: 352,
      title: "Silent Payments",
      proposed: "2023-03",
      status: "Draft",
      url: "https://github.com/bitcoin/bips/blob/master/bip-0352.mediawiki",
    },
  },
  ecdsa: {
    term: "ECDSA",
    def: "Elliptic Curve Digital Signature Algorithm. 타원곡선 위에서 동작하는 디지털 서명 방식. 비트코인의 표준 서명 알고리즘.",
  },
  secp256k1: {
    term: "secp256k1",
    def: "비트코인이 사용하는 특정 타원곡선 매개변수. 곡선 식은 y² = x³ + 7, 256-bit 소수 p 위 𝔽ₚ, 약 2²⁵⁶ 개의 점.",
  },
  ecdlp: {
    term: "ECDLP",
    def: "Elliptic Curve Discrete Log Problem. Q = d·G 에서 Q 와 G 만 보고 d 를 찾는 문제. 양자컴퓨터 없이는 사실상 불가능.",
  },
  "trap-door": {
    term: "trap-door 함수",
    def: "정방향은 누구든 빠르게 계산되지만, 역방향은 비밀(trap-door) 을 가진 사람만 빠르게 풀 수 있는 일방향 함수. 공개키 암호의 토대.",
  },
  "one-way": {
    term: "one-way 함수",
    def: "정방향은 빠르고, 역방향은 누구도 사실상 못 푸는 일방향 함수. trap-door 와 달리 비밀이 없어도 어렵다. 해시 함수가 이쪽.",
  },
  pbkdf2: {
    term: "PBKDF2",
    def: "Password-Based Key Derivation Function 2. 비밀번호 같은 약한 입력을 반복 hashing 으로 강한 키로 늘리는 표준. BIP39 가 2048 rounds 사용.",
  },
  "hmac-sha512": {
    term: "HMAC-SHA512",
    def: "Hash-based Message Authentication Code 의 SHA-512 버전. 키와 메시지에서 짧은 인증 태그를 만든다. BIP32 의 자식 키 파생에 사용.",
  },
  "sha-256": {
    term: "SHA-256",
    def: "Secure Hash Algorithm, 256-bit 출력. 임의 길이 입력을 32 byte 다이제스트로 매핑. 비트코인의 작업증명·트랜잭션 ID·주소 파생 등에 광범위하게 쓰임.",
  },
  "ripemd-160": {
    term: "RIPEMD-160",
    def: "RACE Integrity Primitives Evaluation Message Digest, 160-bit 출력. 비트코인 주소 파생에서 SHA-256 결과를 한 번 더 해시해 더 짧게 만든다.",
  },
  "double-sha256": {
    term: "double-SHA256",
    def: "SHA-256 을 두 번 연달아 적용. SHA256(SHA256(x)). 비트코인 블록 헤더 해시·트랜잭션 ID 등에 사용.",
  },
  "merkle-damgard": {
    term: "Merkle-Damgard construction",
    def: "긴 메시지를 일정 크기 블록으로 나눈 뒤, 압축 함수의 결과를 다음 블록의 입력으로 이어 붙여 최종 해시를 만드는 고전적 해시 함수 구조. SHA-256 이 이 계열이다. 최종 해시가 내부 상태처럼 드러나기 때문에 length-extension attack 을 고려해야 한다.",
  },
  bech32: {
    term: "Bech32",
    def: "BIP173 의 주소 인코딩. SegWit v0 주소 (bc1q…) 에 사용. base32 알파벳 + BCH 코드 기반 강한 체크섬으로 오타 방지.",
  },
  "ethereum-address": {
    term: "Ethereum 주소",
    def: "Ethereum 계열 주소는 보통 0x 로 시작하는 40자리 16진수 문자열이다. 공개키를 Keccak-256 으로 해시한 뒤 마지막 20 byte 를 주소로 쓴다. 대소문자가 섞인 표기는 EIP-55 체크섬으로, 잘못 입력한 주소를 일부 탐지하기 위한 장치다.",
  },
  "base58check": {
    term: "Base58Check",
    def: "옛날 비트코인 주소 인코딩 (1…, 3…). base58 + 4 byte 체크섬. SegWit 이후엔 Bech32 가 표준.",
  },
  "hd-wallet": {
    term: "HD wallet",
    def: "Hierarchical Deterministic wallet. 한 seed 에서 트리 구조로 모든 자식 키를 결정론적으로 파생. BIP32 가 정의.",
  },
  utxo: {
    term: "UTXO",
    def: "Unspent Transaction Output. 아직 다른 트랜잭션의 input 으로 쓰이지 않은 출력. 비트코인의 ‘잔액’ 은 곧 사용자가 풀 수 있는 UTXO 의 합.",
  },
  tx: {
    term: "tx · transaction",
    def: "트랜잭션(transaction)의 짧은 표기. 비트코인에서 송금은 ‘잔액 숫자 수정’ 이 아니라, 이전 UTXO 를 input 으로 소비하고 새 output 을 만드는 서명된 데이터 구조다.",
  },
  input: {
    term: "input",
    def: "트랜잭션이 소비하려는 이전 output 참조. 보통 (txid, vout) 으로 어느 UTXO 를 쓰는지 가리키고, 그 UTXO 를 풀 권한을 증명하는 서명/증거를 포함한다.",
  },
  output: {
    term: "output",
    def: "트랜잭션이 새로 만드는 자금 조각. 금액과 잠금 조건(scriptPubKey)을 가진다. 아직 쓰이지 않은 output 이 UTXO 가 된다.",
  },
  fee: {
    term: "fee · transaction fee",
    def: "수수료. 비트코인 트랜잭션에는 별도 fee 필드가 없고, input 합계 - output 합계가 자동으로 채굴자 수수료가 된다. 블록 공간이 제한되어 있어 사용자는 더 빨리 포함되기 위해 수수료로 경쟁한다.",
  },
  fallback: {
    term: "폴백 (fallback)",
    def: "기본 방법이 실패하거나 조건에 맞지 않을 때 대신 쓰는 예비 경로. 예를 들어 지갑이 수수료와 잔돈을 줄이는 최적의 UTXO 조합을 먼저 찾고, 실패하면 더 단순한 선택 알고리즘으로 넘어갈 수 있다.",
  },
  script: {
    term: "Script",
    def: "비트코인의 잠금/해제 미니 언어. output 의 scriptPubKey 가 ‘어떤 조건이면 쓸 수 있는가’를 잠그고, input 의 scriptSig/witness 가 그 조건을 만족한다는 증거를 제공한다.",
  },
  txid: {
    term: "txid · transaction id",
    def: "트랜잭션 식별자. 직렬화된 트랜잭션 데이터를 double-SHA256 한 값이다. 다른 트랜잭션이 특정 output 을 input 으로 가리킬 때 사용한다.",
  },
  p2pkh: {
    term: "P2PKH",
    def: "Pay-to-PubKey-Hash. 가장 흔했던 잠금 패턴. 이 hash 에 맞는 pubkey 와 그 키로 만든 sig 를 가진 사람만 풀 수 있다.",
  },
  p2wpkh: {
    term: "P2WPKH",
    def: "Pay-to-Witness-PubKey-Hash. P2PKH 의 SegWit v0 버전. 서명을 witness 영역으로 빼서 malleability 차단 + 블록 무게 계산 변경.",
  },
  p2sh: {
    term: "P2SH",
    def: "Pay-to-Script-Hash. ‘이 해시에 맞는 script 를 갖고 그 script 를 만족시키면 풀린다’. 임의 잠금 조건을 짧은 주소로 표현.",
  },
  p2tr: {
    term: "P2TR (Taproot)",
    def: "BIP341 의 잠금 패턴. Schnorr 서명 + 머클화된 script 트리. 평소엔 단일 서명처럼 보이고, 복잡한 조건은 필요할 때만 노출.",
  },
  pow: {
    term: "PoW · Proof of Work",
    def: "작업 증명. 정해진 난이도의 해시 퍼즐을 푼 채굴자가 다음 블록을 만들 권한을 가진다. ‘들인 계산량’ 자체가 체인의 보안.",
  },
  "merkle-tree": {
    term: "머클 트리 (Merkle tree)",
    def: "많은 데이터를 둘씩 묶어 해시하고, 그 결과를 다시 둘씩 묶어 해시해 올라가는 구조. 맨 위의 루트 한 값만 고정해도, 아래 데이터 중 하나라도 바뀌면 루트가 달라진다. 그래서 블록 안의 많은 트랜잭션을 짧은 값 하나로 대표할 수 있다.",
  },
  "merkle-root": {
    term: "머클 루트 (merkle root)",
    def: "머클 트리의 가장 위에 있는 최종 해시. 비트코인 블록 헤더에 들어가며, 그 블록 안의 모든 트랜잭션 목록을 대표하는 짧은 약속 역할을 한다.",
  },
  mempool: {
    term: "mempool",
    def: "각 노드의 메모리에 있는 ‘아직 블록에 안 들어간 트랜잭션 풀’. 채굴자는 여기서 수수료가 높은 것부터 골라 블록에 담는다.",
  },
  coinbase: {
    term: "coinbase tx",
    def: "블록의 첫 트랜잭션. input 이 없고, 새로 발행되는 코인 (block subsidy) + 블록 안 다른 tx 들의 수수료를 채굴자에게 지급. 이전 거래 이력이 없는 새 코인이라 ‘깨끗한 코인’ 으로 여겨져, 일부 시장에서는 프리미엄이 붙어 거래되기도 한다.",
  },
  "lsm-tree": {
    term: "LSM tree",
    def: "Log-Structured Merge tree. 쓰기는 메모리 + append-only log 로 빠르게, 백그라운드에서 디스크 SSTable 들을 합쳐 정리하는 구조.",
  },
  wal: {
    term: "WAL · Write-Ahead Log",
    def: "쓰기를 디스크에 append-only 로 먼저 기록해, 정전 등 실패에서 일관 상태를 복원할 수 있게 하는 장치.",
  },
  sstable: {
    term: "SSTable",
    def: "Sorted String Table. LSM 의 디스크 저장 단위. 키가 정렬된 immutable 파일. 작은 SSTable 여러 개가 점차 큰 것으로 합쳐진다 (compaction).",
  },
  malleability: {
    term: "transaction malleability",
    def: "서명을 살짝 바꿔도 검증은 통과하면서 트랜잭션 ID(txid) 가 바뀌는 약점. SegWit 이 서명을 witness 로 빼서 해결.",
  },
  avalanche: {
    term: "avalanche effect",
    def: "입력 1 비트만 바꿔도 출력 비트의 절반쯤이 무작위로 뒤집히는 성질. 좋은 해시 함수의 핵심 요건.",
  },
  "birthday-paradox": {
    term: "birthday paradox",
    def: "n 개 가능한 값 중 같은 값을 가진 두 항목을 찾는 일은 약 √n 번이면 50% 확률. ‘같은 출력 두 입력 찾기 (collision)’ 비용 추정에 쓰임.",
  },
  "preimage-resistance": {
    term: "preimage resistance",
    def: "출력 y 가 주어졌을 때 H(x)=y 인 입력 x 를 찾기 어려움. 좋은 해시 함수의 첫 번째 보안 요건.",
  },
  "collision-resistance": {
    term: "collision resistance",
    def: "H(x) = H(y) 인 서로 다른 x, y 를 찾기 어려움. 두 번째 보안 요건. 출력 비트가 n 일 때 약 2^(n/2) 시도 필요.",
  },
  "computationally-infeasible": {
    term: "computationally infeasible",
    def: "이론적으로는 가능하지만, 현존하는 모든 컴퓨팅 자원을 동원해도 우주 수명 안에 끝낼 수 없는 계산. ‘못 한다’ 와 실용적으로 같음.",
  },
  hardened: {
    term: "hardened derivation",
    def: "BIP32 자식 키 파생에서 인덱스 ≥ 2³¹ 사용. ‘부모 public key + chain code’ 만으로는 자식 키를 만들 수 없게 하는 추가 보안 layer.",
  },
  segwit: {
    term: "SegWit · Segregated Witness",
    def: "BIP141 의 업그레이드. 서명 데이터를 트랜잭션 본체에서 ‘witness’ 영역으로 분리. malleability 해결 + 블록 무게 계산 변경.",
  },
  schnorr: {
    term: "Schnorr signature",
    def: "ECDSA 보다 단순하고 합산 가능한(aggregatable) 서명 방식. Taproot (BIP340/341) 가 도입.",
  },
  spv: {
    term: "SPV · Simplified Payment Verification",
    def: "라이트 클라이언트가 전체 블록을 받지 않고 헤더 + merkle proof 만으로 자기 트랜잭션 포함 여부를 검증하는 방식. 사토시 백서 8 절.",
  },
  generator: {
    term: "generator point G",
    def: "secp256k1 곡선 위의 고정된 한 점. 모든 public key 는 어떤 정수 d 에 대해 d·G. 모든 사용자가 같은 G 를 쓴다.",
  },
  asic: {
    term: "ASIC",
    def: "Application-Specific Integrated Circuit. 한 가지 일만 (예: SHA-256) 극도로 빠르게 하도록 만든 전용 칩. 비트코인 채굴 하드웨어의 표준.",
  },
  nonce: {
    term: "nonce (number used once)",
    def: "맥락에 따라 두 가지 의미. ① 채굴: 블록 헤더의 4 byte 정수. 채굴자가 바꿔가며 헤더 해시가 target 미만이 될 때까지 시도. ② ECDSA 서명: 서명마다 새로 고르는 무작위 정수 k. 같은 k 로 두 번 서명하면 비밀키 d 가 평범한 나눗셈으로 복원 (자산 도난).",
  },
  target: {
    term: "target",
    def: "블록 헤더 해시가 그 이하여야 유효한 256-bit 임계값. 작을수록 어려움. 헤더의 4 byte ‘bits’ 필드로 압축 저장된다.",
  },
  "selfish-mining": {
    term: "selfish mining",
    def: "찾은 블록을 곧장 공개하지 않고 비밀 체인을 키우다 전략적으로 던져 정직한 네트워크 작업을 헛수고로 만드는 채굴 전략. 임계 hashrate (≈25-33%) + 강한 연결성 필요.",
  },
  mmic: {
    term: "MMIC · Myopic Miner Incentive Compatibility",
    def: "블록 생산자가 현재 블록의 직접 수익만 보고 행동하더라도, 프로토콜이 의도한 방식대로 tx 를 포함하는 것이 최선이 되는 성질. 수수료 메커니즘이 채굴자나 validator 의 조작 유인을 얼마나 줄이는지 볼 때 쓰인다.",
  },
  "oca-proofness": {
    term: "OCA-proofness · Off-Chain Agreement-proofness",
    def: "사용자와 블록 생산자가 프로토콜 밖에서 별도 계약이나 뇌물을 주고받아도, 정해진 수수료 규칙을 우회해 더 이득을 보기 어려운 성질. 블록체인 수수료 시장의 담합 저항성을 설명할 때 쓰인다.",
  },
  lamport: {
    term: "Leslie Lamport",
    def: "분산 시스템 이론의 거장. ‘Time, Clocks, and the Ordering of Events’ (1978), Paxos 합의 알고리즘, 그리고 1982 년 Byzantine Generals Problem 이 모두 그의 작업이다. 2013 년 Turing Award 수상. 부수적으로 · 학계에서 수식을 보기 좋게 조판하기 위해 만든 매크로 패키지가 바로 LaTeX (Lamport TeX) 다. 분산 합의를 모르는 사람도 그가 만든 LaTeX 로 논문을 쓰고 있는 셈이다.",
    link: {
      label: "lamport.azurewebsites.net",
      url: "https://lamport.azurewebsites.net/",
    },
  },
  "test-of-time": {
    term: "Test of Time award",
    def: "주요 학술 컨퍼런스가 ‘발표 후 충분한 시간이 흐른 뒤에도 분야에 큰 영향을 남긴 논문’ 에게 주는 상. 보통 10 년 전후의 옛 논문을 대상으로, 그 동안의 후속 연구·실무 영향을 평가해 매년 한두 편 선정. ‘즉시 화제’ 와 다른 ‘세월이 검증한 가치’ 가 기준. SIGCOMM, SIGMOD, USENIX Security, Financial Cryptography (FC) 등 거의 모든 메이저 학회에 존재.",
  },
  flp: {
    term: "FLP impossibility (1985)",
    def: "Fischer · Lynch · Paterson, ‘Impossibility of Distributed Consensus with One Faulty Process’. 비동기 (메시지 지연 상한 없음) 환경에서, 단 한 노드라도 죽을 수 있으면, 모든 결정론적 합의 프로토콜은 영원히 결정 못 내리는 실행 시나리오를 갖는다는 정리. 즉 ‘완벽한 100% 결정성 + 비동기 + 장애 허용’ 셋을 동시에 만족하는 알고리즘은 없다. 비잔틴 합의도 이 벽 위에서 설계되며, 비트코인은 ‘결정성’ 을 ‘확률적 finality’ 로 바꿔 우회.",
    link: {
      label: "Fischer, Lynch, Paterson 1985 (PDF)",
      url: "https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf",
    },
  },
  "zk-snark": {
    term: "zk-SNARK",
    def: "Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. 어떤 명제 (예: ‘나는 이 자금을 쓸 권한이 있다’) 가 참임을 증명하면서, 그 명제를 참으로 만드는 비밀 (witness) 은 노출하지 않는 짧고 검증이 빠른 암호 증명. Zcash 가 ‘송신자·수신자·금액’ 을 가린 채 거래 유효성을 증명하는 데 사용. ‘zero-knowledge’ 는 정보가 새지 않음, ‘succinct’ 는 증명이 짧음 (수백 byte), ‘non-interactive’ 는 한 번 보내고 끝.",
  },
  "trusted-setup": {
    term: "trusted setup",
    def: "초기 SNARK 시스템에서 공개 파라미터를 만드는 의식 (ceremony). 만약 그 과정에서 생성된 ‘toxic waste’ (랜덤 비밀) 가 유출되면 가짜 증명을 만들 수 있어, 발행 한도를 우회한 위조가 가능. 다자 참여 (multi-party computation) 로 ‘한 명만 정직하면 안전’ 보장을 만든다. Zcash 의 Sapling, Sprout 가 사용. 최신 Halo / Halo 2 는 setup 자체가 필요 없는 방식.",
  },
  "ring-signature": {
    term: "ring signature",
    def: "여러 명의 공개키로 ‘ring’ 을 만들고, 그 중 한 명의 비밀키로 서명. 외부에서는 ring 안의 누가 진짜 서명자인지 구분할 수 없다. Monero 가 송금 input 마다 진짜 input 1 개 + 가짜 decoy N-1 개를 묶어 익명 집합을 만드는 데 사용. CryptoNote 프로토콜 (2013) 기반.",
  },
  "stealth-address": {
    term: "stealth address",
    def: "수신자가 정적 공개키 하나만 외부에 공개해도, 발신자가 매 거래마다 그 키에서 새로운 일회용 출력 주소를 파생할 수 있게 하는 기법. 같은 사람에게 보낸 여러 송금이 체인에서 서로 묶이지 않는다. Monero 가 기본값으로 사용, 비트코인의 Silent Payments (BIP352) 가 같은 아이디어의 다른 구현.",
  },
  ringct: {
    term: "RingCT · Ring Confidential Transactions",
    def: "Monero 2017 년 도입. ring signature 로 송신자를, stealth address 로 수신자를 가리는 위에, Pedersen commitment 으로 금액 자체도 가린다. 입출력 합이 0 이라는 것은 증명되지만 개별 금액은 보이지 않음. 송신자·수신자·금액 셋 모두 가린 첫 실용 시스템.",
  },
  "pedersen-commitment": {
    term: "Pedersen commitment",
    def: "값을 숨긴 채 약속하는 암호 기법. C = aG + rH 형태로, 값 a 와 랜덤 r 을 결합해 단 하나의 점 C 만 공개. 누구도 a 를 추측할 수 없지만, 나중에 a, r 을 공개하면 C 가 검증된다. 핵심 성질 · 두 commitment 의 덧셈이 값의 덧셈과 같다 (homomorphic). 그래서 ‘입력 합 = 출력 합’ 같은 등식이 값을 가린 채 검증 가능.",
  },
  halo: {
    term: "Halo / Halo 2",
    def: "Electric Coin Company (Zcash) 의 후속 ZK 시스템. trusted setup 자체를 제거. 재귀적 (recursive) 증명을 사용해, 한 증명 안에서 ‘이전 증명들이 모두 유효함’ 까지 함께 증명한다. Zcash 가 2022 년 NU5 업그레이드에서 채택해 setup ceremony 없이 운영.",
  },
  zcash: {
    term: "Zcash",
    def: "2016 년 출시. Zerocash (Sasson et al., IEEE S&P 2014) 프로토콜 기반의 zk-SNARK 프라이버시 코인. 두 종류 주소를 가진다 · t-address (투명, 비트코인 호환) / z-address (shielded, 영지식). 사용자가 선택한다. 실제로는 거래소·지갑 호환성 때문에 대부분 t-address 로 거래되어, shielded pool 사용률이 낮다.",
    link: {
      label: "Sasson et al., Zerocash 2014",
      url: "https://www.ieee-security.org/TC/SP2014/papers/Zerocash_c_DecentralizedAnonymousPaymentsfromBitcoin.pdf",
    },
  },
  monero: {
    term: "Monero",
    def: "2014 년 출시. CryptoNote 프로토콜 (2013) 기반. ring signature + stealth address + RingCT 를 결합해 송신자·수신자·금액 모두를 기본값으로 가린다. 비트코인과 달리 프라이버시가 옵션이 아니라 강제. Bytecoin 의 fair-launch 분기로 시작.",
  },
  aml: {
    term: "AML · Anti-Money Laundering",
    def: "자금 세탁 방지 규제의 묶음. 금융 기관이 고객 신원을 검증 (KYC) 하고, 의심 거래를 정부에 보고 (SAR) 하고, 일정 금액 이상의 거래 정보를 기록·전달하도록 강제한다. 1970 년대 미국 Bank Secrecy Act 에서 출발해 1989 년 FATF 설립으로 국제 표준화되었다. 가상자산 거래소도 ‘금융 기관’ 으로 분류되면서 같은 의무가 적용된다.",
  },
  fatf: {
    term: "FATF · Financial Action Task Force",
    def: "1989 년 G7 이 설립한 정부간 기구. 자금 세탁·테러 자금·대량살상무기 자금 방지에 관한 국제 표준 (Recommendations) 을 만들고, 회원국의 이행도를 상호 평가한다. 권고 자체에는 법적 강제력이 없지만, 비준수 시 ‘grey list / black list’ 에 등재되어 국제 금융 접근성이 제약된다. 2019 년에는 권고 16 (Travel Rule) 을 가상자산에도 적용했다.",
    link: {
      label: "fatf-gafi.org",
      url: "https://www.fatf-gafi.org/",
    },
  },
  "travel-rule": {
    term: "Travel Rule",
    def: "FATF 권고 16번. 1,000 USD (또는 EUR) 이상의 가상자산 송금에서, VASP (가상자산 사업자) 가 송신자와 수신자의 신원 정보 (이름, 주소, 계좌번호 등) 를 상대 VASP 에 함께 전달해야 한다는 규정이다. 원래 은행간 wire transfer 의 규정을 가상자산에 그대로 적용한 것이다. EU 의 MiCA / TFR, 한국의 특정금융정보법, 미국 FinCEN 가이드가 모두 이 권고를 국내법으로 흡수했다.",
  },
  vasp: {
    term: "VASP · Virtual Asset Service Provider",
    def: "가상자산을 ‘업으로’ 다루는 사업자. 거래소, 보관 서비스 (custodian), 가상자산 발행자 등이 해당된다. FATF 가 2019 년에 정의했다. 각국 규제 (FinCEN MSB, 한국 가상자산사업자, EU MiCA 등) 는 VASP 분류에 AML/KYC/Travel Rule 의무를 부과한다.",
  },
  ofac: {
    term: "OFAC · Office of Foreign Assets Control",
    def: "미국 재무부 산하의 해외 자산 통제실. 미국 외교·안보 정책 위반 (테러 지원국, 적국, 마약·인신매매 조직 등) 자산을 제재하고 SDN 리스트로 관리한다. 미국인이나 미국 영토 안에서의 거래에 강제력을 가진다. 2022 년에 Tornado Cash 컨트랙트 주소를 SDN 에 직접 등재한 것이 첫 사례다.",
    link: {
      label: "treasury.gov/ofac",
      url: "https://ofac.treasury.gov/",
    },
  },
  "sdn-list": {
    term: "SDN list · Specially Designated Nationals",
    def: "OFAC 가 관리하는 제재 대상 명단. 등재되면 미국인이 그 대상과 거래하는 것 자체가 형사 처벌 대상이 된다. 전통적으로는 개인·기업·선박이 등재되었으나, 2022 년 Tornado Cash 의 스마트 컨트랙트 주소가 추가되면서 ‘재산 없는 코드’ 가 등재 가능한지에 대한 헌법 소송이 발생했다.",
  },
  mixer: {
    term: "Mixer · 자금 섞기",
    def: "여러 사용자의 입금을 풀에 모았다가 (delay + 무작위 매칭으로) 다시 출금한다. 외부 관찰자가 입금과 출금을 연결하기 어렵게 만든다. 비트코인의 CoinJoin (Wasabi, JoinMarket) 과 이더리움의 Tornado Cash 가 대표적이다. 합법적 사용 (프라이버시 보호) 과 자금 세탁 도구 양쪽 모두로 작동한다.",
  },
  "tornado-cash": {
    term: "Tornado Cash",
    def: "2019 년 출시된 이더리움 위의 zk-SNARK 기반 mixer. 사용자가 ETH 를 컨트랙트에 예치하고, 일정 시간 뒤 ZK 증명과 함께 다른 주소로 출금하면 입출금이 끊긴다. 2022 년 8 월 미국 OFAC 가 컨트랙트 주소를 SDN 리스트에 직접 추가했다 (스마트 컨트랙트에 대한 첫 제재). 2024 년 11 월 5th Circuit 항소법원 (Van Loon v. Treasury) 이 ‘재산권 없는 코드는 IEEPA 의 property 정의에 해당하지 않는다’ 고 판결한 뒤 일부 제재가 해제되었다. 개발자 형사 사건은 별개로 진행 중이다.",
  },
  chainalysis: {
    term: "Chainalysis",
    def: "2014 년 설립된 블록체인 분석 회사. 공개 체인 데이터에 휴리스틱·머신 러닝을 적용해 주소들을 ‘같은 사용자’ 로 묶고, 거래소·법 집행 기관에 제공한다. Reactor (조사 도구), KYT (실시간 모니터링) 가 주력 제품이다. 2020 년 Monero ring 휴리스틱 공격 발표 등 프라이버시 코인 분석 연구도 일부 내놓았다.",
  },
};
