export interface DataToRedeem {
  secretCode: string;
  secretCodeBytes: Uint8Array;
  merkleProof: string[];
  merkleRootIndex: string;
  amount: BigInt;
}
