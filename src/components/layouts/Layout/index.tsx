import { useMetamask } from "@/hooks/useMetamask";
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

type Props = {
  projectName: string;
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ projectName, children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header projectName={projectName} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="container mx-auto px-4 py-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
