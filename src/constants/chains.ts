const ENVIRONMENT_CHAIN_ID: number = parseInt(
  process.env.NEXT_PUBLIC_ACTIVE_CHAIN || "1337"
);

const SUPPORTED_CHAINS: Record<number, string> = {
  1: "Ethereum Mainnet",
  137: "Polygon Mainnet",
  1337: "Localhost 8545",
  31337: "Hardhat",
  80001: "Polygon Mumbai",
} as const;

export { ENVIRONMENT_CHAIN_ID, SUPPORTED_CHAINS };
