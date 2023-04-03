import { CSHToken } from "../../../backend/types/contracts/CSHToken";
import CSHTokenJsonArtifact from "../../../backend/artifacts/contracts/CSHToken.sol/CSHToken.json";

const cSHTokenContractAddress =
  process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || "";
const cSHTokenContractAbi = CSHTokenJsonArtifact.abi;

export { cSHTokenContractAddress, cSHTokenContractAbi };

export type CSHTokenType = CSHToken;
