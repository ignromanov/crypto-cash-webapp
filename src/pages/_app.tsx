import "@/styles/globals.css";
import { Layout } from "@/components/layouts/Layout";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import type { AppProps } from "next/app";
import React from "react";

function App({ Component, pageProps }: AppProps) {
  const projectName = "CryptoCash Platform";
  const activeChain = process.env.NEXT_PUBLIC_ACTIVE_CHAIN;

  return (
    <ThirdwebProvider activeChain={activeChain}>
      <Layout projectName={projectName}>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  );
}

export default App;
