import { MainLayout } from "@/components/layouts/MainLayout";
import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import type { AppProps } from "next/app";

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
