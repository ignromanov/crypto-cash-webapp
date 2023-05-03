import { ENVIRONMENT_CHAIN_ID, SUPPORTED_CHAINS } from "@/constants/chains";
import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";

const NetworkMismatchModal: React.FC = () => {
  const chainName = SUPPORTED_CHAINS[ENVIRONMENT_CHAIN_ID] || "Unknown";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full ">
      <div className="bg-black opacity-50 absolute inset-0" />
      <div className="bg-white p-10 rounded shadow-lg z-10 max-w-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">
          Unsupported Blockchain Network
        </h3>
        <p className="mb-4">
          You are currently connected to an unsupported blockchain network.
          Please switch to the <strong>{chainName}</strong> network to continue
          using the application.
        </p>
        <ConnectWallet theme={"light"} />
      </div>
    </div>
  );
};

export { NetworkMismatchModal };
