import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { parseBigIntValue } from "./converters";
import { calculateHash } from "./secretCodes";

const loadMerkleTree = (merkleDump: object | string) => {
  if (!merkleDump) {
    throw new Error("Invalid Merkle dump provided");
  }

  const merkleDumpString =
    typeof merkleDump === "string" ? merkleDump : JSON.stringify(merkleDump);

  return StandardMerkleTree.load(
    JSON.parse(merkleDumpString, parseBigIntValue)
  );
};

const getMerkleTree = (leaves: [string, bigint][]) => {
  if (!leaves || !Array.isArray(leaves) || leaves.length === 0) {
    throw new Error("Invalid leaves provided");
  }

  return StandardMerkleTree.of(leaves, ["bytes32", "uint256"]);
};

const generateMerkleTree = (secretCodes: string[], amount: bigint) => {
  if (!secretCodes || !Array.isArray(secretCodes) || secretCodes.length === 0) {
    throw new Error("Invalid secret codes provided");
  }

  if (!amount) {
    throw new Error("Invalid amount provided");
  }

  const leaves = secretCodes.map((code) => [code, amount] as [string, bigint]);
  return getMerkleTree(leaves);
};

const parentIndex = (i: number) => Math.floor((i - 1) / 2);
const siblingIndex = (i: number) => i - (-1) ** (i % 2);

const getProofByLeaves = (
  leaves: string[],
  [code, amount]: [string, bigint]
) => {
  if (!leaves || !Array.isArray(leaves) || leaves.length === 0) {
    throw new Error("Invalid leaves provided");
  }

  if (!code || !amount) {
    throw new Error("Invalid code or amount provided");
  }

  const leafHash = calculateHash(code, amount);
  let leafIndex = leaves.findIndex((leaf) => leaf === leafHash);

  if (leafIndex === -1) {
    throw new Error("Leaf not found in the provided leaves");
  }

  const proof = [];
  while (leafIndex > 0) {
    proof.push(leaves[siblingIndex(leafIndex)]);
    leafIndex = parentIndex(leafIndex);
  }
  return proof;
};

export { generateMerkleTree, getMerkleTree, getProofByLeaves, loadMerkleTree };
