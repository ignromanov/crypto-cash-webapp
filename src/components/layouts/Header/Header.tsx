import { environmentChainId } from "@/constants";
import {
  ConnectWallet,
  useActiveChain,
  useAddress,
  useSwitchChain,
} from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Props } from "./Header.types";

const Header: React.FC<Props> = ({ projectName }) => {
  const activeChain = useActiveChain();
  const address = useAddress();
  const switchChain = useSwitchChain();
  const isMismatched = environmentChainId !== activeChain?.chainId;

  useEffect(() => {
    if (address && isMismatched) {
      switchChain(environmentChainId);
    }
  }, [address, isMismatched, switchChain]);

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="ml-4 mr-8 px-4 flex justify-between items-center">
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
