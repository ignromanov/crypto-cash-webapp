import { Keccak256Hash } from "@/types/codes";
import { BytesLike } from "ethers";
import {
  concat,
  defaultAbiCoder,
  hexlify,
  keccak256,
  randomBytes,
  verifyMessage,
} from "ethers/lib/utils";

const getMessageToSign = (
  amount: bigint,
  numberOfCodes: string,
  timestamp: number
) => {
  return `Generate Codes Request\nAmount: ${amount}\nNumber of Codes: ${numberOfCodes}\nTimestamp: ${timestamp}`;
};

const verifySignature = async (message: string, signature: string) => {
  const recoveredAddress = verifyMessage(message, signature);
  const contractOwner = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || "";
  return recoveredAddress === contractOwner;
};

const generateSecretCodes = (count: number): string[] => {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code: string = hexlify(randomBytes(32));
    codes.push(code);
  }

  return codes;
};

const generateRandomNonce = (): bigint => {
  const randomArray = randomBytes(8);
  const view = new DataView(randomArray.buffer, 0);
  const randomInt = view.getBigUint64(0, true);
  return randomInt;
};

const calculateHash = (code: BytesLike, number: bigint): Keccak256Hash => {
  const encoded = defaultAbiCoder.encode(
    ["bytes32", "uint256"],
    [code, number]
  );
  const keccak256Encoded = keccak256(encoded);
  return keccak256(concat([keccak256Encoded])) as Keccak256Hash;
};

export {
  generateSecretCodes,
  generateRandomNonce,
  calculateHash,
  getMessageToSign,
  verifySignature,
};
