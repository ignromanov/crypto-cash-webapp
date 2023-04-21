import { CodeData } from "@/types/codes";
import { useCallback, useState } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";
import { getSecretCodes } from "@/services/api";

const useGetSecretCodesApi = (updateExecStatus: UpdateExecStatus) => {
  const [codesData, setCodesData] = useState<CodeData[]>([]);
  const [amount, setAmount] = useState("");

  const sendRequest = useCallback(
    async (merkleRootCode: string, includeProof: boolean) => {
      setCodesData([]);
      setAmount("");

      const { amount, codesDataStr, codesData } = await getSecretCodes(
        merkleRootCode,
        includeProof,
        updateExecStatus
      );

      setCodesData(codesData);
      setAmount(amount);

      return { codesDataStr, codesData };
    },
    [updateExecStatus]
  );

  return { codesData, amount, sendRequest };
};

export default useGetSecretCodesApi;
