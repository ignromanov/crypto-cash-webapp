import { ResponseError } from "@/types/api";

type GetCodesResponseData = {
  codesData: string[];
  amount: string;
};

type ApiGetCodesResponseData = GetCodesResponseData | ResponseError;

export type { ApiGetCodesResponseData, GetCodesResponseData };
