// import { CSHToken } from "../../../backend/types/contracts/CSHToken";
import CSHTokenJsonArtifact from "./CSHToken.json";

const cSHTokenContractAddress =
  process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || "";
const cSHTokenContractAbi = CSHTokenJsonArtifact.abi;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CSHTokenType = any;
export { cSHTokenContractAddress, cSHTokenContractAbi };
