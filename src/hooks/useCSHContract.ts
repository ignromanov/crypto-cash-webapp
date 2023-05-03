import {
  CSHTokenType,
  cSHTokenContractAbi,
  cSHTokenContractAddress,
} from "@/contracts/cSHToken";
import { handleApiError } from "@/utils/api";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";

const useCSHContract = (updateExecStatus?: UpdateExecStatus) => {
  const isMismatched = false;
  const account = useAddress();
  const signer = useSigner();

  const [cryptoCashContract, setCryptoCashContract] =
    useState<CSHTokenType | null>(null);

  useEffect(() => {
    if (!signer || isMismatched) {
      setCryptoCashContract(null);
      return;
    }

    const cryptoCashContractInstance: CSHTokenType = new ethers.BaseContract(
      cSHTokenContractAddress,
      cSHTokenContractAbi,
      signer
    );
    setCryptoCashContract(cryptoCashContractInstance);
  }, [signer, isMismatched]);

  const transferTokens = useCallback(
    async (recipient: string, amount: string): Promise<boolean> => {
      if (!cryptoCashContract || !updateExecStatus) {
        return false;
      }

      updateExecStatus({
        pending: true,
        message: "Preparing data for a transaction...",
      });

      try {
        const transferTx = await cryptoCashContract.transfer(
          recipient,
          ethers.utils.parseUnits(amount, 18)
        );

        updateExecStatus({
          message: "Waiting for the transaction confirmation...",
        });

        await transferTx.wait();
      } catch (error) {
        const errorMessage = handleApiError(error);
        updateExecStatus({
          pending: false,
          success: false,
          message: `Error transferring tokens! ${errorMessage}`,
        });
        return false;
      }

      updateExecStatus({
        pending: false,
        success: true,
        message: "Tokens transferred successfully!",
      });
      return true;
    },
    [cryptoCashContract, updateExecStatus]
  );

  const fetchTokenBalance = useCallback(
    async (accountToUse: string = account!) => {
      if (!cryptoCashContract || !accountToUse) return "0";

      try {
        const balance = await cryptoCashContract.balanceOf(accountToUse);
        return ethers.utils.formatUnits(balance, 18);
      } catch (error) {
        console.error("Error fetching token balance:", error);
        return "0";
      }
    },
    [cryptoCashContract, account]
  );

  return {
    transferTokens,
    fetchTokenBalance,
  };
};

export default useCSHContract;
