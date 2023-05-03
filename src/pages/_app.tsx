import { MainLayout } from "@/components/layouts/MainLayout";
import { ENVIRONMENT_CHAIN_ID } from "@/constants/chains";
import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import React from "react";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const projectName = "CryptoCash Platform";

  return (
    <>
      <ThirdwebProvider activeChain={ENVIRONMENT_CHAIN_ID}>
        <MainLayout projectName={projectName}>
          <Component {...pageProps} />
        </MainLayout>
      </ThirdwebProvider>
      <Analytics />
    </>
  );
};

export default App;
