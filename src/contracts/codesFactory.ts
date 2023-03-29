import { ethers, JsonRpcProvider } from "ethers";
import { CodesFactory } from "../../../backend/types/contracts/CodesFactory";
import CodesFactoryArtifact from "../../../backend/artifacts/contracts/CodesFactory.sol/CodesFactory.json";

const codesFactoryContractAddress =
  process.env.NEXT_PUBLIC_CODES_CONTRACT_ADDRESS || "";
const CodesFactoryArtifactAbi = CodesFactoryArtifact.abi;

export type CodesFactoryContractType = CodesFactory;

export { codesFactoryContractAddress, CodesFactoryArtifactAbi };
