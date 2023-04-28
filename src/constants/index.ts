const environmentChainId = parseInt(
  process.env.NEXT_PUBLIC_ACTIVE_CHAIN || "1337"
);

const supportedChains: Record<number, string> = {
  1: "Ethereum Mainnet",
  137: "Polygon Mainnet",
  1337: "Localhost 8545",
  31337: "Hardhat",
  80001: "Polygon Mumbai",
};

const ipfsGatewayUrl = "https://w3s.link/ipfs/";

export { supportedChains, environmentChainId, ipfsGatewayUrl };
