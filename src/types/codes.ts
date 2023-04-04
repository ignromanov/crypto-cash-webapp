type HashBrand = {
  readonly __hashBrand: unique symbol;
};

type Keccak256Hash = string & HashBrand;

interface CodeData {
  secretCode: string;
  amount: bigint;
  merkleRootIndex: string;
  leafHash: Keccak256Hash;
  merkleProof?: Keccak256Hash[];
}

export type { Keccak256Hash, CodeData };
