type HashBrand = {
  readonly __hashBrand: unique symbol;
};

type Keccak256Hash = string & HashBrand;

interface SecretCodeData {
  rootIndex: string;
  code: string;
  amount: bigint;
  cid: string;
  leaf: Keccak256Hash;
  merkleProof?: Keccak256Hash[];
}

export type { Keccak256Hash, SecretCodeData, BillCodeData };
