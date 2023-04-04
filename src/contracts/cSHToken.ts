import { BaseContract } from "ethers";
// import { CSHToken } from "../../../backend/types/contracts/CSHToken";
import CSHTokenJsonArtifact from "./CSHToken.json";

const cSHTokenContractAddress =
  process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || "";
const cSHTokenContractAbi = CSHTokenJsonArtifact.abi;

export type CSHTokenType = BaseContract;
export { cSHTokenContractAddress, cSHTokenContractAbi };
