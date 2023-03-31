import {
  AbiCoder,
  BytesLike,
  concat,
  hexlify,
  keccak256,
  randomBytes,
} from "ethers";
import { DataHexString } from "ethers/types/utils/data";

function getMessageToSign(
  amount: BigInt,
  numberOfCodes: string,
  timestamp: number
) {
  return `Generate Codes Request\nAmount: ${amount}\nNumber of Codes: ${numberOfCodes}\nTimestamp: ${timestamp}`;
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

function calculateHash(code: BytesLike, number: BigInt): string {
  const abiCoder = AbiCoder.defaultAbiCoder();
  const encoded = abiCoder.encode(["bytes32", "uint256"], [code, number]);
  const keccak256Encoded = keccak256(encoded);
  return keccak256(concat([keccak256Encoded]));
}

export {
  generateSecretCodes,
  generateRandomNonce,
  calculateHash,
  getMessageToSign,
};
