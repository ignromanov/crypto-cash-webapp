import {
  ApiGenerateCodesResponseData,
  GenerateCodesResponseData,
} from "@/components/modules/GenerateCodes";
import { getMessageToSign } from "@/utils/secretCodes";
import axios from "axios";
import { useCallback } from "react";
import useMetamask from "./useMetamask";
import { UpdateExecStatus } from "./useExecStatus.types";
import { ResponseError } from "@/types/api";
import { formatEther } from "ethers";
import { handleApiError } from "@/utils/api";

const useGenerateCodesApi = (updateExecStatus: UpdateExecStatus) => {
  const { provider } = useMetamask();

  const sendRequest = useCallback(
    async (amount: bigint, numberOfCodes: string) => {
      const signMessage = async (message: string) => {
        if (!provider) {
          return "";
        }
        const signer = await provider.getSigner();
        const signature = await signer.signMessage(message);
        return signature;
      };

      updateExecStatus({
        pending: true,
        message: "Generating secret codes...",
      });

      try {
        const timestamp = Date.now();
        const messageToSign = getMessageToSign(
          amount,
          numberOfCodes,
          timestamp
        );
        const signature = await signMessage(messageToSign);

        const response = await axios.post<ApiGenerateCodesResponseData>(
          "/api/generate-codes",
          {
            // TODO: waiting for ethers v6 supporting
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            amount: formatEther(amount),
            numberOfCodes,
            signature,
            timestamp,
          }
        );

        if (response.status !== 201) {
          throw Error((response.data as ResponseError).message);
        }
        const responseData = response.data as GenerateCodesResponseData;

        updateExecStatus({
          pending: false,
          success: true,
          message: `Secret codes generated successfully with RootIndex: ${responseData.merkleRootIndex}!`,
        });
      } catch (error) {
        const errorMessage = handleApiError(error);
        updateExecStatus({
          pending: false,
          success: false,
          message: `Error generating secret codes! ${errorMessage}`,
        });
      }
    },
    [provider, updateExecStatus]
  );

  return { sendRequest };
};

export default useGenerateCodesApi;
