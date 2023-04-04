import "@/styles/globals.css";
import { Layout } from "@/components/layouts/Layout";

import type { AppProps } from "next/app";
import React from "react";

function App({ Component, pageProps }: AppProps) {
  const projectName = "CryptoCash Platform";

  return (
    <Layout projectName={projectName}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
