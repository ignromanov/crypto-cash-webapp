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
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-auto">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
