import {
  CodesFactoryContractType,
  codesFactoryContractAbi,
  codesFactoryContractAddress,
} from "@/contracts/codesFactory";
import { CodeData, Keccak256Hash } from "@/types/codes";
import { handleApiError } from "@/utils/api";
import { calculateHash, generateRandomNonce } from "@/utils/secretCodes";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";

const useCodesFactoryContract = (updateExecStatus?: UpdateExecStatus) => {
  // TODO: waiting for Metamask ext fix
  // const isMismatched = useNetworkMismatch();
  const isMismatched = false;
  const account = useAddress();
  const signer = useSigner();

  const [codesFactoryContract, setCodesFactoryContract] =
    useState<CodesFactoryContractType | null>(null);

  useEffect(() => {
    if (!signer || isMismatched || !updateExecStatus) {
      setCodesFactoryContract(null);
      return;
    }

    const codesFactoryContract: CodesFactoryContractType =
      new ethers.BaseContract(
        codesFactoryContractAddress,
        codesFactoryContractAbi,
        signer
      );
    setCodesFactoryContract(codesFactoryContract);
  }, [signer, isMismatched]);

  const handleCommit = useCallback(
    async (dataToRedeem: CodeData | null): Promise<boolean> => {
      if (!dataToRedeem || !codesFactoryContract || !updateExecStatus) {
        return false;
      }

      updateExecStatus({
        pending: true,
        message: "Preparing data for a transaction...",
      });

      try {
        const { code, amount } = dataToRedeem;

        const nonce = generateRandomNonce();
        const commitment = calculateHash(code, nonce);
        const storageKey = `commitment_nonce_${calculateHash(code, amount)}`;
        localStorage.setItem(storageKey, nonce.toString());

        // send commit transaction
        const commitTx = await codesFactoryContract.commitCode(commitment);

        // Wait for the transaction to be confirmed
        updateExecStatus({
          message: "Waiting for the transaction confirmation...",
        });
        await commitTx.wait();
      } catch (error) {
        const errorMessage = handleApiError(error);
        updateExecStatus({
          pending: false,
          success: false,
          message: `Error commiting code! ${errorMessage}`,
        });
        return false;
      }

      updateExecStatus({
        pending: false,
        success: true,
        message: "The code commited successfully!",
      });
      return true;
    },
    [codesFactoryContract, updateExecStatus]
  );

  const handleReveal = useCallback(
    async (dataToRedeem: CodeData | null): Promise<boolean> => {
      if (!dataToRedeem || !codesFactoryContract || !updateExecStatus) {
        return false;
      }

      updateExecStatus({
        pending: true,
        message: "Preparing data for a transaction...",
      });

      try {
        const { code, rootIndex, amount, merkleProof } = dataToRedeem;
        if (!merkleProof) throw new Error("Merkle proof not found.");

        // get commitment nonce
        const nonceStorageKey = `commitment_nonce_${calculateHash(
          code,
          amount
        )}`;
        const storedNonce = localStorage.getItem(nonceStorageKey);
        if (!storedNonce) {
          throw new Error("Nonce not found. Please commit the code first.");
        }

        // call the redeemCode function on the contract
        const redeemTx = await codesFactoryContract.revealCode(
          rootIndex,
          code,
          amount,
          BigInt(storedNonce),
          merkleProof
        );

        // Wait for the transaction to be confirmed
        updateExecStatus({
          message: "Waiting for the transaction confirmation...",
        });
        await redeemTx.wait();

        localStorage.removeItem(nonceStorageKey);
      } catch (error) {
        const errorMessage = handleApiError(error);
        updateExecStatus({
          pending: false,
          success: false,
          message: `Error redeeming code! ${errorMessage}`,
        });
        return false;
      }

      updateExecStatus({
        pending: false,
        success: true,
        message: "The code revealed successfully!",
      });
      return true;
    },
    [codesFactoryContract, updateExecStatus]
  );

  const filterRedeemedLeaves = useCallback(
    async (leaves: Keccak256Hash[]): Promise<Keccak256Hash[]> => {
      if (!codesFactoryContract || !leaves.length) return [];

      const redeemedLeaves = (await codesFactoryContract.getRedeemedLeaves(
        leaves
      )) as Keccak256Hash[];

      return redeemedLeaves;
    },
    [codesFactoryContract]
  );

  const filterCommitedCodes = useCallback(
    async (codesData: CodeData[]): Promise<CodeData[]> => {
      if (!codesData.length || !codesFactoryContract || !account) return [];

      const commitments = await codesFactoryContract.getUserCommitments(
        account
      );
      if (!commitments.length) return [];

      const commitedCodes = codesData.filter((code) => {
        const nonceStorageKey = `commitment_nonce_${calculateHash(
          code.code,
          code.amount
        )}`;

        const storedNonce = localStorage.getItem(nonceStorageKey);
        if (!storedNonce) return false;

        return commitments.includes(storedNonce);
      });

      return commitedCodes;
    },
    [codesFactoryContract, account]
  );

  const fetchMerkleRoots = useCallback(async () => {
    if (!codesFactoryContract) return [];

    const merkleRoots = await codesFactoryContract.getMerkleRoots();
    return merkleRoots;
  }, [codesFactoryContract]);

  return {
    handleCommit,
    handleReveal,
    filterRedeemedLeaves,
    filterCommitedCodes,
    fetchMerkleRoots,
  };
};

export default useCodesFactoryContract;
