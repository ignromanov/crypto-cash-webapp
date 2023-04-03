import {
  ApiGetCodesResponseData,
  GetCodesResponseData,
} from "@/components/modules/DisplayCodes";
import { ResponseError } from "@/types/api";
import { CodeData } from "@/types/codes";
import { parseCodeData } from "@/utils/convertCodeData";
import axios from "axios";
import { useCallback, useState } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";
import { handleApiError } from "@/utils/api";

const useGetCodesApi = (updateExecStatus: UpdateExecStatus) => {
  const [codesData, setCodesData] = useState<CodeData[]>([]);
  const [amount, setAmount] = useState("");

  const requestCodes = useCallback(
    async (merkleRootCode: string, includeProof: boolean) => {
      setCodesData([]);
      setAmount("");

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
        setCodesData(codesData);
        setAmount(responseData.amount);

        updateExecStatus({
          pending: false,
          success: true,
          message: "QR codes fetched successfully!",
        });

        return { codesDataStr: responseData.codesData, codesData };
      } catch (error) {
        const errorMessage = handleApiError(error);
        updateExecStatus({
          pending: false,
          success: false,
          message: `Error fetching QR codes! ${errorMessage}`,
        });
      }

      return { codesDataStr: [], codesData: [] };
    },
    [updateExecStatus]
  );

  return { codesData, amount, requestCodes };
};

export default useGetCodesApi;
