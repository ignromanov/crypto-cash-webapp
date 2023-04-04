import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { DataHexString } from "ethers/types/utils/data";
import { parseBigIntValue } from "./convertCodeData";

function loadMerkleTree(merkleDump: string) {
  const merkleTree = StandardMerkleTree.load(
    JSON.parse(merkleDump, parseBigIntValue)
  );
  return merkleTree;
}

function getMerkleTree(leaves: [DataHexString, bigint][]) {
  const merkleTree = StandardMerkleTree.of(leaves, ["bytes32", "uint256"]);
  return merkleTree;
}

function generateMerkleTree(secretCodes: string[], amount: bigint) {
  const leaves = secretCodes.map(
    (code) => [code, amount] as [DataHexString, bigint]
  );
  const merkleTree = getMerkleTree(leaves);
  return merkleTree;
}

export { generateMerkleTree, getMerkleTree, loadMerkleTree };
