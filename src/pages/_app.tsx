import "@/styles/globals.css";
import Layout from "@/components/Layout";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  const projectName = "CryptoCash";

  return (
    <Layout projectName={projectName}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
