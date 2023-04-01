import { CodeData } from "@/types/codes";
import { formatEther, parseEther } from "ethers";

const stringifyBigIntValue = (_: string, value: any) =>
  typeof value === "bigint" ? `BIGINT::${formatEther(value)}` : value;

const parseBigIntValue = (key: string, value: any) => {
  if (typeof value === "string" && value.startsWith("BIGINT::")) {
    return parseEther(value.substring(8));
  }
  return value;
};

const stringifyCodeData = (codeData: CodeData): string =>
  JSON.stringify(codeData, stringifyBigIntValue);
const parseCodeData = (codeDataStr: string): CodeData =>
  JSON.parse(codeDataStr, parseBigIntValue);

export {
  stringifyCodeData,
  parseCodeData,
  stringifyBigIntValue,
  parseBigIntValue,
};
