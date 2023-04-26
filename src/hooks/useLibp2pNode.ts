import {
  libp2pNode,
  createLibp2pNode,
  getFileFromIPFS,
} from "@/services/libp2p";
import { CodeData } from "@/types/codes";
import { loadMerkleTree } from "@/utils/merkleTree";
import { useCallback, useEffect } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";

const useLibp2pNode = (updateExecStatus: UpdateExecStatus) => {
  useEffect(() => {
    const startNode = async () => {
      if (libp2pNode) return;
      await createLibp2pNode();
    };

    startNode();

    return () => {
      libp2pNode?.stop();
    };
  }, []);

  const getMerkleProofByData = useCallback(
    async (data: CodeData) => {
      updateExecStatus({
        message: "Getting proof from IPFS...",
        pending: true,
      });

      const merkleTreeDump = await getFileFromIPFS(data.cid);
      if (!merkleTreeDump) return;

      const merkleTree = loadMerkleTree(merkleTreeDump);
      const proof = merkleTree.getProof([data.code, data.amount]);

      if (proof.length === 0) {
        console.error("No proof found");
        return;
      }

      updateExecStatus({
        message: "The proof has been received successfully!",
        pending: false,
        success: true,
      });

      return proof;
    },
    [updateExecStatus]
  );

  return { libp2pNode, getMerkleProofByData };
};

export { useLibp2pNode };
