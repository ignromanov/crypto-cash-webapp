import {
  ConnectWallet,
  useAddress,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Props } from "./Header.types";

const activeChain = parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN || "1");

const Header: React.FC<Props> = ({ projectName }) => {
  const address = useAddress(); // Get connected wallet address
  const switchChain = useSwitchChain(); // Switch to desired chain
  const isMismatched = useNetworkMismatch(); // Detect if user is connected to the wrong network

  useEffect(() => {
    // Check if the user is connected to the wrong network
    if (isMismatched) {
      switchChain(activeChain); // the chain you want here
    }
  }, [address, isMismatched, switchChain]); // This above block gets run every time "address" changes (e.g. when the user connects)

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt={`${projectName} Logo`}
            className="h-10 mr-2"
            height={40}
            width={100}
          />
        </Link>
        <ConnectWallet theme={"light"} />
      </div>
    </header>
  );
};

export { Header };
