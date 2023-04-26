import { AdminAlert } from "@/components/elements/AdminAlert";
import { DisplayCodes } from "@/components/modules/DisplayCodes";
import { GenerateCodes } from "@/components/modules/GenerateCodes";
import React from "react";

const GenerateCodesPage: React.FC = () => {
  return (
    <>
      <AdminAlert />
      <GenerateCodes />
      <DisplayCodes />
    </>
  );
};

export default GenerateCodesPage;
