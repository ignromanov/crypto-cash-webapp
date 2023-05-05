import { getSecretCodes } from "@/services/api";
import { SecretCodeData } from "@/types/codes";
import { useCallback, useState } from "react";
import { UpdateExecStatus } from "./useExecStatus.types";

const useGetSecretCodesApi = (updateExecStatus: UpdateExecStatus) => {
  const [codesData, setCodesData] = useState<SecretCodeData[]>([]);
  const [codesDataStr, setCodesDataStr] = useState<string[]>([]);
  const [amount, setAmount] = useState("");

  const sendRequest = useCallback(
    async (merkleRootCode: string, includeProof: boolean) => {
      setCodesData([]);
      setCodesDataStr([]);
      setAmount("");

      const { amount, codesDataStr, codesData } = await getSecretCodes(
        merkleRootCode,
        includeProof,
        updateExecStatus
      );

      setCodesData(codesData);
      setCodesDataStr(codesDataStr);
      setAmount(amount);

      return { codesDataStr, codesData };
    },
    [updateExecStatus]
  );

  return { codesData, codesDataStr, amount, sendRequest };
};

export default useGetSecretCodesApi;
