import { useCallback } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";
import { useSigner } from "@thirdweb-dev/react";
import { createSecretCodes } from "../services/api";
import { getMessageToSign } from "@/utils/secretCodes";
import { signMessage } from "@/services/ethers";

const useCreateSecretCodesApi = (updateExecStatus: UpdateExecStatus) => {
  const signer = useSigner();

  const sendRequest = useCallback(
    (amount: bigint, numberOfCodes: string) => {
      const sendRequest = async () => {
        updateExecStatus({
          pending: true,
          message: "Signing message...",
        });

        // sign request message by owner
        const timestamp = Date.now();
        const messageToSign = getMessageToSign(
          amount,
          numberOfCodes,
          timestamp
        );
        const signature = await signMessage(signer, messageToSign);

        await createSecretCodes(
          amount,
          numberOfCodes,
          signature,
          timestamp,
          updateExecStatus
        );
      };

      sendRequest();
    },
    [signer, updateExecStatus]
  );

  return { sendRequest };
};

export default useCreateSecretCodesApi;
