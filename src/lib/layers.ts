import type { PrimitiveId } from "./primitives";

export type LayerId =
  | "S0"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9"
  | "S10"
  | "S11"
  | "S12"
  | "S13";

export type Layer = {
  id: LayerId;
  parentId: LayerId | null;
  title: string;
  subtitle: string;
  oneLiner: string;
  childIds: LayerId[];
  references?: LayerId[];
  primitives?: PrimitiveId[];
};

export const LAYERS: Record<LayerId, Layer> = {
  S0: {
    id: "S0",
    parentId: null,
    title: "Alice → Bob",
    subtitle: "S0",
    oneLiner: "Alice 가 Bob 에게 1 BTC 를 보내려는 장면에서 시작한다. 이 한 건의 송금이 지갑, 트랜잭션, 블록, 노드를 차례로 불러낸다.",
    childIds: ["S1"],
  },
  S1: {
    id: "S1",
    parentId: "S0",
    title: "Keys & Address",
    subtitle: "S1",
    oneLiner: "Alice 가 자기 BTC 를 쓸 수 있다는 사실은 어떻게 증명될까? 주소, 공개키, 비밀키가 만드는 소유권 구조를 먼저 본다.",
    childIds: ["S2"],
    primitives: ["public-key"],
  },
  S2: {
    id: "S2",
    parentId: "S1",
    title: "Seed & Wallet Types",
    subtitle: "S2",
    oneLiner: "실제 지갑은 키 하나만 들고 있지 않다. 시드 문구에서 여러 주소를 만들고, 소프트웨어·하드웨어·수탁 지갑이 키를 다르게 보관한다.",
    childIds: ["S3"],
    primitives: ["seed-derivation"],
  },
  S3: {
    id: "S3",
    parentId: "S2",
    title: "Transaction",
    subtitle: "S3",
    oneLiner: "Alice 는 Bob 에게 얼마를 보내고, 남은 돈은 어디로 돌려받을지 정해야 한다. 그 내용을 서명해 네트워크에 내보내는 메시지가 트랜잭션이다.",
    childIds: ["S4"],
    primitives: ["signature", "script"],
  },
  S4: {
    id: "S4",
    parentId: "S3",
    title: "UTXO",
    subtitle: "S4",
    oneLiner: "비트코인은 계좌 잔액에서 숫자를 빼지 않는다. Alice 가 가진 ‘아직 쓰지 않은 출력’들을 골라 쓰고, Bob 과 Alice 에게 새 출력들을 만든다.",
    childIds: ["S5"],
  },
  S5: {
    id: "S5",
    parentId: "S4",
    title: "Block",
    subtitle: "S5",
    oneLiner: "Alice 의 트랜잭션이 오래 남는 기록이 되려면 블록에 들어가야 한다. 블록은 여러 거래를 묶고, 그 묶음의 요약을 헤더에 남긴다.",
    childIds: ["S6"],
    primitives: ["hash", "merkle"],
  },
  S6: {
    id: "S6",
    parentId: "S5",
    title: "Network",
    subtitle: "S6",
    oneLiner: "Alice 가 만든 트랜잭션은 중앙 서버로 가지 않는다. 노드들이 서로 알려 주고 다시 검증하면서, 같은 거래와 블록을 네트워크 전체로 퍼뜨린다.",
    childIds: ["S7"],
    primitives: ["p2p"],
  },
  S7: {
    id: "S7",
    parentId: "S6",
    title: "Blockchain",
    subtitle: "S7",
    oneLiner: "Alice 의 거래가 들어간 블록 위로 새 블록들이 계속 쌓이면 기록을 되돌리기 어려워진다. 블록들이 어떻게 한 줄의 역사로 연결되는지 본다.",
    childIds: ["S8"],
  },
  S8: {
    id: "S8",
    parentId: "S7",
    title: "PoW Mining",
    subtitle: "S8",
    oneLiner: "다음 블록을 누가 만들지는 관리자가 정하지 않는다. 채굴자들이 해시 퍼즐을 풀며 경쟁하고, 먼저 조건을 만족한 블록이 후보가 된다.",
    childIds: ["S9"],
    primitives: ["difficulty"],
  },
  S9: {
    id: "S9",
    parentId: "S8",
    title: "Mining Strategy",
    subtitle: "S9",
    oneLiner: "현실의 채굴자는 혼자 움직이지 않는다. 풀, 보상 배분, 블록 템플릿 같은 구조가 어떤 거래를 먼저 담을지와 채굴자의 행동을 바꾼다.",
    childIds: ["S10"],
    references: ["S6", "S8"],
  },
  S10: {
    id: "S10",
    parentId: "S9",
    title: "Node Structure",
    subtitle: "S10",
    oneLiner: "노드는 Alice 의 거래를 기억만 하는 프로그램이 아니다. UTXO 셋, 블록 인덱스, mempool 같은 데이터 구조로 ‘지금 무엇이 유효한가’를 관리한다.",
    childIds: ["S11"],
    primitives: ["leveldb"],
  },
  S11: {
    id: "S11",
    parentId: "S10",
    title: "Node Operation",
    subtitle: "S11",
    oneLiner: "Alice 의 트랜잭션이나 새 블록이 도착하면 노드는 무엇부터 확인할까? 서명, 잠금 조건, UTXO, 작업증명을 검증하고 자기 상태를 갱신하는 순서를 본다.",
    childIds: ["S12"],
  },
  S12: {
    id: "S12",
    parentId: "S11",
    title: "Scalability",
    subtitle: "S12",
    oneLiner: "Alice 가 이런 송금을 커피값처럼 자주, 빠르게 보낼 수 있을까? 블록 크기와 생성 간격이 만드는 병목, 그리고 Lightning 같은 확장 선택을 본다.",
    childIds: ["S13"],
    references: ["S5", "S6"],
  },
  S13: {
    id: "S13",
    parentId: "S12",
    title: "Privacy",
    subtitle: "S13",
    oneLiner: "Alice 의 송금 기록은 어디까지 추적될까? 비트코인은 익명 화폐라기보다 공개 장부 위의 가명 시스템에 가깝고, 주소 사용 방식에 따라 프라이버시가 크게 달라진다.",
    childIds: [],
    references: ["S4", "S6"],
  },
};

export const LAYER_ORDER: LayerId[] = [
  "S0", "S1", "S2", "S3", "S4", "S5",
  "S6", "S7", "S8", "S9", "S10", "S11",
  "S12", "S13",
];

export function pathTo(id: LayerId): LayerId[] {
  const path: LayerId[] = [];
  let cur: LayerId | null = id;
  while (cur) {
    path.unshift(cur);
    cur = LAYERS[cur].parentId;
  }
  return path;
}

export function gateKey(parentId: LayerId, childId: LayerId): string {
  return `gate:${parentId}>${childId}`;
}
