import {
  ApiGenerateCodesResponseData,
  GenerateCodesResponseData,
} from "@/components/modules/GenerateCodes";
import axios from "axios";
import { UpdateExecStatus } from "../hooks/useExecStatus.types";
import { ResponseError } from "@/types/api";
import { handleApiError } from "@/utils/api";
import { formatEther } from "ethers/lib/utils";
import Link from "next/link";
import { ipfsGatewayUrl } from "@/constants";
import {
  ApiGetCodesResponseData,
  GetCodesResponseData,
} from "@/components/modules/DisplayCodes";
import { parseCodeData } from "@/utils/converters";

const createSecretCodes = async (
  amount: bigint,
  numberOfCodes: string,
  signature: string,
  timestamp: number,
  updateExecStatus: UpdateExecStatus
): Promise<void> => {
  updateExecStatus({
    pending: true,
    message: "Sending request...",
  });

  try {
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
};

const getSecretCodes = async (
  merkleRootCode: string,
  includeProof: boolean,
  updateExecStatus: UpdateExecStatus
) => {
  updateExecStatus({ pending: true, message: "Fetching codes..." });

  try {
    const response = await axios.get<ApiGetCodesResponseData>(
      "/api/get-codes",
      {
        params: { merkleRootCode, includeProof },
      }
    );

    if (response.status !== 200) {
      throw Error((response.data as ResponseError).message);
    }

    const responseData = response.data as GetCodesResponseData;
    const codesData = responseData.codesData.map(parseCodeData);

    updateExecStatus({
      pending: false,
      success: true,
      message: "QR codes fetched successfully!",
    });

    return {
      amount: responseData.amount,
      codesDataStr: responseData.codesData,
      codesData,
    };
  } catch (error) {
    const errorMessage = handleApiError(error);
    updateExecStatus({
      pending: false,
      success: false,
      message: `Error fetching QR codes! ${errorMessage}`,
    });
  }

  return {
    amount: "",
    codesDataStr: [],
    codesData: [],
  };
};

export { createSecretCodes, getSecretCodes };
