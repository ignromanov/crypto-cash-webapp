import useMetamask from "@/hooks/useMetamask";
import Link from "next/link";
import React from "react";
import { Props } from "./Header.types";
import Image from "next/image";

const Header: React.FC<Props> = ({ projectName }) => {
  const { account } = useMetamask();

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt={`${projectName} Logo`}
            className="h-10 mr-2"
          />
        </Link>
        <div className="text-lg font-medium">
          <span className="text-sm mr-2">Connected account:</span>
          <span className="text-xs bg-cryptocash-secondary rounded-md px-2 py-1 text-cryptocash-tetriary">
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : "Not Connected"}
          </span>
        </div>
      </div>
    </header>
  );
};

export { Header };
