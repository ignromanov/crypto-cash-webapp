import { useCallback, useEffect, useRef, useState } from "react";
import { ethers, keccak256 } from "ethers";
import {
  codesFactoryContractAbi,
  codesFactoryContractAddress,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";
import useMetamask from "./useMetamask";
import { DataToRedeem } from "@/components/modules/RedeemCodes";
import { generateRandomNonce, calculateHash } from "@/utils/secretCodes";
import axios from "axios";
import { ExecStatus } from "./useExecStatus.types";

const useCodesFactoryContract = (
  dataToRedeem: DataToRedeem | null,
  updateExecStatus: (status: Partial<ExecStatus>) => void
) => {
  const { signer } = useMetamask();
  const codesFactoryContractRef = useRef<CodesFactoryContractType | null>(null);

  useEffect(() => {
    codesFactoryContractRef.current = new ethers.BaseContract(
      codesFactoryContractAddress,
      codesFactoryContractAbi,
      signer
    ) as unknown as CodesFactoryContractType;
  }, [signer]);

  const requestMerkleProof = useCallback(
    async (secretCode: string, merkleRootIndex: string) => {
      const response = await axios.get("/api/get-merkle-proof", {
        params: { secretCode, merkleRootIndex },
      });

      if (response.status === 200) {
        return response.data.merkleProof;
      } else {
        throw Error("Error fetching Merkle proof");
      }
    },
    []
  );

  const handleCommit = useCallback(async (): Promise<boolean> => {
    if (!dataToRedeem) {
      return false;
    }

    updateExecStatus({
      pending: true,
      message: "Preparing data for a transaction...",
    });

    try {
      const { secretCode } = dataToRedeem;

      const nonce = generateRandomNonce();
      const commitment = calculateHash(secretCode, nonce);
      const storageKey = `commitment_nonce_${keccak256(secretCode)}`;
      localStorage.setItem(storageKey, nonce.toString());

      // send commit transaction
      const commitTx = await codesFactoryContractRef.current!.commitCode(
        commitment
      );

      // Wait for the transaction to be confirmed
      updateExecStatus({
        message: "Waiting for the transaction confirmation...",
      });
      await commitTx.wait();
    } catch (error) {
      console.error(error);
      updateExecStatus({
        pending: false,
        success: false,
        message: "Error commiting code!",
      });
      return false;
    }

    updateExecStatus({
      pending: false,
      success: true,
      message: "The code commited successfully!",
    });
    return true;
  }, [dataToRedeem, updateExecStatus]);

  const handleReveal = useCallback(async (): Promise<boolean> => {
    if (!dataToRedeem) {
      return false;
    }

    updateExecStatus({
      pending: true,
      message: "Preparing data for a transaction...",
    });

    try {
      let { secretCode, merkleProof, merkleRootIndex, amount } = dataToRedeem;

      // get commitment nonce
      const nonceStorageKey = `commitment_nonce_${keccak256(secretCode)}`;
      const storedNonce = localStorage.getItem(nonceStorageKey);
      if (!storedNonce) {
        throw new Error("Nonce not found. Please commit the code first.");
      }

      // request Merkle proof from the server if not provided
      if (!merkleProof) {
        merkleProof = await requestMerkleProof(secretCode, merkleRootIndex);
      }

      // call the redeemCode function on the contract
      const redeemTx = await codesFactoryContractRef.current!.revealCode(
        merkleRootIndex,
        secretCode,
        // @ts-ignore
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
      console.error(error);
      updateExecStatus({
        pending: false,
        success: false,
        message: "Error redeeming code!",
      });
      return false;
    }

    updateExecStatus({
      pending: false,
      success: true,
      message: "The code revealed successfully!",
    });
    return true;
  }, [dataToRedeem, updateExecStatus]);

  return {
    handleCommit,
    handleReveal,
  };
};

export default useCodesFactoryContract;
