import QrCodesDisplay from "@/components/modules/QRCodesDisplay";
import QRCodesGenerate from "@/components/modules/QRCodesGenerate";

const QrCodeGenerationPage = () => {
  return (
    <>
      <QRCodesGenerate />
      <QrCodesDisplay />
    </>
  );
};

export default QrCodeGenerationPage;
