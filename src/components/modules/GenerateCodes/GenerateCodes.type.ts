import { ResponseError } from "@/types/api";

type GenerateCodesRequestBody = {
  amount: string;
  numberOfCodes: string;
  signature: string;
  timestamp: number;
};

type GenerateCodesResponseData = {
  merkleRootIndex: string;
};

type ApiGenerateCodesResponseData = GenerateCodesResponseData | ResponseError;

export type {
  GenerateCodesRequestBody,
  ApiGenerateCodesResponseData,
  GenerateCodesResponseData,
};
