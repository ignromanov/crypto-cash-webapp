type HashBrand = {
  readonly __hashBrand: unique symbol;
};

type Keccak256Hash = string & HashBrand;

interface CodeData {
  rootIndex: string;
  code: string;
  amount: bigint;
  cid: string;
  leaf: Keccak256Hash;
  merkleProof?: Keccak256Hash[];
}

export type { Keccak256Hash, CodeData };
