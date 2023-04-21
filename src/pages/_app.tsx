import "@/styles/globals.css";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import type { AppProps } from "next/app";
import React from "react";

function App({ Component, pageProps }: AppProps) {
  const projectName = "CryptoCash Platform";
  const activeChain = process.env.NEXT_PUBLIC_ACTIVE_CHAIN;

  return (
    <ThirdwebProvider activeChain={activeChain}>
      <MainLayout projectName={projectName}>
        <Component {...pageProps} />
      </MainLayout>
    </ThirdwebProvider>
  );
}

export default App;
