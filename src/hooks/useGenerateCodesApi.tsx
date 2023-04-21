import {
  ApiGenerateCodesResponseData,
  GenerateCodesResponseData,
} from "@/components/modules/GenerateCodes";
import { getMessageToSign } from "@/utils/secretCodes";
import axios from "axios";
import { useCallback } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";
import { ResponseError } from "@/types/api";
import { handleApiError } from "@/utils/api";
import { useSigner } from "@thirdweb-dev/react";
import { formatEther } from "ethers/lib/utils";
import Link from "next/link";
import { ipfsGatewayUrl } from "@/constants";

const useGenerateCodesApi = (updateExecStatus: UpdateExecStatus) => {
  const signer = useSigner();

  const sendRequest = useCallback(
    async (amount: bigint, numberOfCodes: string) => {
      const signMessage = async (message: string) => {
        if (!signer) {
          return "";
        }
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

        const statusMessage = (
          <span>
            Secret codes generated successfully with Merkle Root Index: [
            {responseData.merkleRootIndex}] and
            <br />
            Merkle Tree IPFS CID:{" "}
            <Link href={ipfsGatewayUrl + responseData.ipfsCid}>
              {responseData.ipfsCid}
            </Link>
          </span>
        );
        updateExecStatus({
          pending: false,
          success: true,
          message: statusMessage,
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
    [signer, updateExecStatus]
  );

  return { sendRequest };
};

export default useGenerateCodesApi;
