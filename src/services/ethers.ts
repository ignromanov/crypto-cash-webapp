import { Signer } from "ethers";

const signMessage = async (signer: Signer | undefined, message: string) => {
  if (!signer) {
    return "";
  }
  const signature = await signer.signMessage(message);
  return signature;
};

export { signMessage };
