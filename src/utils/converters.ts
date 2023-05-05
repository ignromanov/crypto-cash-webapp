import { formatEther, parseEther } from "ethers/lib/utils";
import { Filelike } from "web3.storage";
import { JsonObject } from "./converters.types";

const stringifyBigIntValue = (_: string, value: unknown) =>
  typeof value === "bigint" ? `BIGINT::${formatEther(value)}` : value;

const parseBigIntValue = (key: string, value: unknown) => {
  if (typeof value === "string" && value.startsWith("BIGINT::")) {
    return parseEther(value.substring(8));
  }
  return value;
};

const stringifyCodeData = <T>(codeData: T): string =>
  JSON.stringify(codeData, stringifyBigIntValue);
const parseCodeData = <T>(codeDataStr: string): T =>
  JSON.parse(codeDataStr, parseBigIntValue);

const jsonToFilelike = (json: JsonObject): Filelike => {
  // Create a ReadableStream from the data in the JSON object
  const data = new TextEncoder().encode(json.data);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });

  const filelike: Filelike = {
    name: json.name,
    stream: () => stream,
  };

  return filelike;
};

export {
  jsonToFilelike,
  stringifyCodeData,
  parseCodeData,
  stringifyBigIntValue,
  parseBigIntValue,
};
