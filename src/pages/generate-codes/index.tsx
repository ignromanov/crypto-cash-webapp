import { AdminAlert } from "@/components/elements/AdminAlert";
import { DisplayCodes } from "@/components/modules/DisplayCodes";
import { GenerateCodes } from "@/components/modules/GenerateCodes";

export default () => {
  return (
    <>
      <AdminAlert />
      <GenerateCodes />
      <DisplayCodes />
    </>
  );
};
