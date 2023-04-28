import { NetworkMismatchModal } from "@/components/elements/NetworkMismatchModal";
import { Header } from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import { environmentChainId } from "@/constants";
import { useActiveChain } from "@thirdweb-dev/react";
import Head from "next/head";
import React from "react";
import { Props } from "./Layout.types";

const MainLayout: React.FC<Props> = ({ projectName, children }) => {
  const activeChain = useActiveChain();
  const isMismatched = environmentChainId !== activeChain?.chainId;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{projectName}</title>
      </Head>
      <Header projectName={projectName} />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-auto">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">
          {isMismatched ? (
            <NetworkMismatchModal />
          ) : (
            <main className="flex-1 p-4">{children}</main>
          )}
        </main>
      </div>
    </div>
  );
};

export { MainLayout };
