import { Keccak256Hash } from "@/types/codes";
import {
  AbiCoder,
  BytesLike,
  concat,
  hexlify,
  keccak256,
  randomBytes,
  verifyMessage,
} from "ethers";
import { DataHexString } from "ethers/types/utils/data";

function getMessageToSign(
  amount: BigInt,
  numberOfCodes: string,
  timestamp: number
) {
  return `Generate Codes Request\nAmount: ${amount}\nNumber of Codes: ${numberOfCodes}\nTimestamp: ${timestamp}`;
}

async function verifySignature(message: string, signature: string) {
  const recoveredAddress = verifyMessage(message, signature);
  const contractOwner = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || "";
  return recoveredAddress === contractOwner;
}

function generateSecretCodes(count: number): DataHexString[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code: DataHexString = hexlify(randomBytes(32));
    codes.push(code);
  }

  return codes;
}

function generateRandomNonce(): BigInt {
  const randomArray = randomBytes(8);
  const view = new DataView(randomArray.buffer, 0);
  const randomInt = view.getBigUint64(0, true);
  return randomInt;
}

function calculateHash(code: BytesLike, number: BigInt): Keccak256Hash {
  const abiCoder = AbiCoder.defaultAbiCoder();
  const encoded = abiCoder.encode(["bytes32", "uint256"], [code, number]);
  const keccak256Encoded = keccak256(encoded);
  return keccak256(concat([keccak256Encoded])) as Keccak256Hash;
}

export {
  generateSecretCodes,
  generateRandomNonce,
  calculateHash,
  getMessageToSign,
  verifySignature,
};
