import { DisplayQRCodes } from "@/components/modules/DisplayQRCodes";
import { GenerateCodes } from "@/components/modules/GenerateCodes";

export default () => {
  return (
    <>
      <GenerateCodes />
      <DisplayQRCodes />
    </>
  );
};
