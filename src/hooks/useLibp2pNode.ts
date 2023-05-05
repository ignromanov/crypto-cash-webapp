import {
  createLibp2pNode,
  getFileFromIPFS,
  libp2pNode,
} from "@/services/libp2p";
import { SecretCodeData } from "@/types/codes";
import { getProofByLeaves } from "@/utils/merkleTree";
import { useCallback, useEffect } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";

const createNode = async () => {
  if (libp2pNode) return;
  await createLibp2pNode();
};

const useLibp2pNode = (updateExecStatus: UpdateExecStatus) => {
  useEffect(() => {
    createNode();

    return () => {
      (async () => {
        await libp2pNode?.stop();
      })();
    };
  }, []);

  const getMerkleProofByCodeData = useCallback(
    async (data: SecretCodeData) => {
      updateExecStatus({
        message: "Getting proof from IPFS...",
        pending: true,
      });

      try {
        const merkleTreeLeaves = (await getFileFromIPFS(data.cid)) as string[];
        if (!merkleTreeLeaves) throw new Error("No proof found!");

        const proof = getProofByLeaves(merkleTreeLeaves, [
          data.code,
          data.amount,
        ]);

        if (proof.length === 0) throw new Error("Proof length is 0.");

        updateExecStatus({
          message: "The proof has been received successfully!",
          pending: false,
          success: true,
        });
        return proof;
      } catch (error) {
        console.error("Error getting Merkle proof:", error);
        updateExecStatus({
          message: "No proof found!",
          pending: false,
          success: false,
        });
        return null;
      }
    },
    [updateExecStatus]
  );

  return { libp2pNode, getMerkleProofByCodeData };
};

export { useLibp2pNode };
