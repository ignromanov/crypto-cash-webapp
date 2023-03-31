import { StMadToken } from "../../../backend/types/contracts/StMadToken";
import StMadTokenJsonArtifact from "../../../backend/artifacts/contracts/stMadToken.sol/stMadToken.json";

const stMadTokenContractAddress =
  process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || "";
const stMadTokenContractAbi = StMadTokenJsonArtifact.abi;

export { stMadTokenContractAddress, stMadTokenContractAbi };

export type StMadTokenType = StMadToken;
