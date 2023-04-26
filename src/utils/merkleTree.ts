import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { parseBigIntValue } from "./converters";

const stringifyJson = (json: object) => {
  return JSON.stringify(json);
};

const loadMerkleTree = (merkleDump: object | string) => {
  const merkleDumpString =
    typeof merkleDump === "string" ? merkleDump : stringifyJson(merkleDump);

  return StandardMerkleTree.load(
    JSON.parse(merkleDumpString, parseBigIntValue)
  );
};

const getMerkleTree = (leaves: [string, bigint][]) => {
  const merkleTree = StandardMerkleTree.of(leaves, ["bytes32", "uint256"]);
  return merkleTree;
};

const generateMerkleTree = (secretCodes: string[], amount: bigint) => {
  const leaves = secretCodes.map((code) => [code, amount] as [string, bigint]);
  const merkleTree = getMerkleTree(leaves);
  return merkleTree;
};

export { generateMerkleTree, getMerkleTree, loadMerkleTree };
