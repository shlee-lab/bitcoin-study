import { HashBody, HashMeta } from "@/components/primitives/Hash";
import { PublicKeyBody, PublicKeyMeta } from "@/components/primitives/PublicKey";
import {
  SignatureBody,
  SignatureMeta,
} from "@/components/primitives/Signature";
import { MerkleBody, MerkleMeta } from "@/components/primitives/Merkle";
import { P2PBody, P2PMeta } from "@/components/primitives/P2P";
import { LevelDBBody, LevelDBMeta } from "@/components/primitives/LevelDB";
import {
  DifficultyBody,
  DifficultyMeta,
} from "@/components/primitives/Difficulty";
import { ScriptBody, ScriptMeta } from "@/components/primitives/Script";
import {
  SeedDerivationBody,
  SeedDerivationMeta,
} from "@/components/primitives/SeedDerivation";

export type PrimitiveId =
  | "hash"
  | "public-key"
  | "signature"
  | "merkle"
  | "p2p"
  | "leveldb"
  | "difficulty"
  | "script"
  | "seed-derivation";

export type Primitive = {
  id: PrimitiveId;
  title: string;
  oneLiner: string;
  Body: React.ComponentType;
};

export const PRIMITIVES: Record<PrimitiveId, Primitive> = {
  hash: { ...HashMeta, Body: HashBody },
  "public-key": { ...PublicKeyMeta, Body: PublicKeyBody },
  signature: { ...SignatureMeta, Body: SignatureBody },
  merkle: { ...MerkleMeta, Body: MerkleBody },
  p2p: { ...P2PMeta, Body: P2PBody },
  leveldb: { ...LevelDBMeta, Body: LevelDBBody },
  difficulty: { ...DifficultyMeta, Body: DifficultyBody },
  script: { ...ScriptMeta, Body: ScriptBody },
  "seed-derivation": { ...SeedDerivationMeta, Body: SeedDerivationBody },
};
