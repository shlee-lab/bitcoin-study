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
    oneLiner: "비트코인 전체를 추상 개념으로 시작하지 않는다. Alice 가 Bob 에게 1 BTC 를 보내는 한 장면에서 출발해, 필요한 질문을 하나씩 연다.",
    childIds: ["S1"],
  },
  S1: {
    id: "S1",
    parentId: "S0",
    title: "Keys & Address",
    subtitle: "S1",
    oneLiner: "송금을 시작하려면 먼저 ‘누가 쓸 수 있는가’가 정해져야 한다. 그래서 첫 단계는 지갑, 주소, 비밀키가 만드는 소유권 구조다.",
    childIds: ["S2"],
    primitives: ["public-key"],
  },
  S2: {
    id: "S2",
    parentId: "S1",
    title: "Seed & Wallet Types",
    subtitle: "S2",
    oneLiner: "주소와 비밀키의 원리를 봤다면, 이제 실제 지갑이 그 키들을 어떻게 만들고 보관하는지 볼 차례다. 시드 문구와 지갑 종류로 넘어간다.",
    childIds: ["S3"],
    primitives: ["seed-derivation"],
  },
  S3: {
    id: "S3",
    parentId: "S2",
    title: "Transaction",
    subtitle: "S3",
    oneLiner: "키를 가진 Alice 는 이제 네트워크에 보낼 메시지를 만들어야 한다. 그 메시지가 트랜잭션이고, 여기서 송금의 내용과 조건이 정해진다.",
    childIds: ["S4"],
    primitives: ["signature", "script"],
  },
  S4: {
    id: "S4",
    parentId: "S3",
    title: "UTXO",
    subtitle: "S4",
    oneLiner: "트랜잭션을 만들려면 Alice 가 실제로 무엇을 쓸 수 있는지 알아야 한다. 비트코인은 잔액 숫자가 아니라 아직 쓰지 않은 출력들을 확인한다.",
    childIds: ["S5"],
  },
  S5: {
    id: "S5",
    parentId: "S4",
    title: "Block",
    subtitle: "S5",
    oneLiner: "Alice 의 트랜잭션은 혼자 떠다니는 메시지로 끝나지 않는다. 네트워크가 오래 보존할 기록이 되려면 여러 거래와 함께 블록에 묶여야 한다.",
    childIds: ["S6"],
    primitives: ["hash", "merkle"],
  },
  S6: {
    id: "S6",
    parentId: "S5",
    title: "Network",
    subtitle: "S6",
    oneLiner: "블록과 트랜잭션이 있어도 중앙 서버가 받아 주는 구조는 아니다. 이제 메시지가 노드 사이를 어떻게 퍼지고, 왜 모두가 같은 사실에 도달하는지 본다.",
    childIds: ["S7"],
    primitives: ["p2p"],
  },
  S7: {
    id: "S7",
    parentId: "S6",
    title: "Blockchain",
    subtitle: "S7",
    oneLiner: "네트워크에 퍼진 블록들은 서로 독립된 파일이 아니라 한 줄의 역사로 연결된다. 이제 그 연결이 왜 되돌리기 어려운 기록을 만드는지 본다.",
    childIds: ["S8"],
  },
  S8: {
    id: "S8",
    parentId: "S7",
    title: "PoW Mining",
    subtitle: "S8",
    oneLiner: "체인이 이어지려면 누군가 다음 블록을 만들어야 한다. 그 권한을 중앙 운영자가 아니라 작업증명 경쟁으로 정하는 방식이 채굴이다.",
    childIds: ["S9"],
    primitives: ["difficulty"],
  },
  S9: {
    id: "S9",
    parentId: "S8",
    title: "Mining Strategy",
    subtitle: "S9",
    oneLiner: "작업증명은 단순한 계산 경쟁처럼 보이지만, 현실의 채굴자는 풀과 보상 구조 안에서 움직인다. 이제 그 전략적 행동과 한계를 본다.",
    childIds: ["S10"],
    references: ["S6", "S8"],
  },
  S10: {
    id: "S10",
    parentId: "S9",
    title: "Node Structure",
    subtitle: "S10",
    oneLiner: "합의, 채굴, 네트워크를 개념으로 봤다면 이제 실제 노드 안으로 들어간다. 추상적인 블록체인이 프로그램과 데이터베이스에서 어떤 모양인지 본다.",
    childIds: ["S11"],
    primitives: ["leveldb"],
  },
  S11: {
    id: "S11",
    parentId: "S10",
    title: "Node Operation",
    subtitle: "S11",
    oneLiner: "노드의 부품을 봤다면 이제 그 부품들이 움직이는 순서를 볼 차례다. 새 트랜잭션과 블록이 들어올 때 노드가 무엇을 검증하는지 따라간다.",
    childIds: ["S12"],
  },
  S12: {
    id: "S12",
    parentId: "S11",
    title: "Scalability",
    subtitle: "S12",
    oneLiner: "지금까지는 비트코인이 어떻게 동작하고 왜 안전한지 살펴봤다. 이제 실제 현금이나 카드 결제처럼 매일 쓸 수 있는지, 그 병목과 비트코인의 확장 선택을 본다.",
    childIds: ["S13"],
    references: ["S5", "S6"],
  },
  S13: {
    id: "S13",
    parentId: "S12",
    title: "Privacy",
    subtitle: "S13",
    oneLiner: "확장성 다음에는 공개 장부가 남기는 흔적을 봐야 한다. Bitcoin 은 흔히 대중에게 익명 화폐로 알려져 있지만, 실제로는 가명성의 시스템에 가깝다.",
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
