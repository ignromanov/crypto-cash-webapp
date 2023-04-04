import { BaseContract } from "ethers";
// import { CodesFactory } from "../../../backend/types/contracts/CodesFactory";
import CodesFactoryArtifact from "./CodesFactory.json";

const codesFactoryContractAddress =
  process.env.NEXT_PUBLIC_CODES_CONTRACT_ADDRESS || "";
const codesFactoryContractAbi = CodesFactoryArtifact.abi;

export type CodesFactoryContractType = BaseContract;
export { codesFactoryContractAddress, codesFactoryContractAbi };
