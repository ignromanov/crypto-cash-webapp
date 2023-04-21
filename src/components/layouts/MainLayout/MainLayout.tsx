import React from "react";
import { Header } from "@/components/layouts/Header";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Props } from "./Layout.types";
import Head from "next/head";

const MainLayout: React.FC<Props> = ({ projectName, children }) => {
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
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export { MainLayout };
