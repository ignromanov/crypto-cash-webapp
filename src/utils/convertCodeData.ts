import { CodeData } from "@/types/codes";
import { formatEther, parseEther } from "ethers/lib/utils";

const stringifyBigIntValue = (_: string, value: unknown) =>
  typeof value === "bigint" ? `BIGINT::${formatEther(value)}` : value;

const parseBigIntValue = (key: string, value: unknown) => {
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
