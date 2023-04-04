import React from "react";
import { AdminAlert } from "@/components/elements/AdminAlert";
import { DisplayCodes } from "@/components/modules/DisplayCodes";
import { GenerateCodes } from "@/components/modules/GenerateCodes";

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
