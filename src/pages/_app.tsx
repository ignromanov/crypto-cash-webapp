import { MainLayout } from "@/components/layouts/MainLayout";
import { environmentChainId } from "@/constants";
import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from "@vercel/analytics/react";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  const projectName = "CryptoCash Platform";

  return (
    <>
      <ThirdwebProvider activeChain={environmentChainId}>
        <MainLayout projectName={projectName}>
          <Component {...pageProps} />
        </MainLayout>
      </ThirdwebProvider>
      <Analytics />
    </>
  );
}

export default App;
