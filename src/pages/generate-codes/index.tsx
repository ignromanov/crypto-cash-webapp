import QrCodesDisplay from "@/components/modules/QRCodesDisplay";
import QRCodesGenerate from "@/components/modules/QRCodesGenerate";

const QrCodeGenerationPage = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <QRCodesGenerate />
      <QrCodesDisplay />
    </div>
  );
};

export default QrCodeGenerationPage;
