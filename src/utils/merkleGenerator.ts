import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethereumjs-util";
import crypto from "crypto";
import { SECRET_CODE_LENGTH } from "@/constants/secredCodes";

function generateSecretCodes(count: number): string[] {
  const codes: string[] = [];
  const byteLength = Math.ceil(SECRET_CODE_LENGTH / 2);

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(byteLength).toString("hex");
    codes.push(code);
  }

  return codes;
}

function generateMerkleTreeAndProofs(secretCodes: string[], amount: number) {
  const leaves = secretCodes.map((code, index) => {
    const data = `${code}:${amount}`;
    return keccak256(Buffer.from(data));
  });

  const merkleTree = new MerkleTree(leaves, keccak256);
  return merkleTree;
}

export { generateSecretCodes, generateMerkleTreeAndProofs };
