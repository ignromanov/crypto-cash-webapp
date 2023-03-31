import React, { useEffect, useState } from "react";
import useApiStatus from "@/hooks/useApiStatus";
import axios from "axios";
import { ApiStatusDisplay } from "@/components/elements/ApiStatusDisplay";
import { Card } from "@/components/layouts/Card";
import { generateQrCodeImage } from "@/utils/qrCode";

const DisplayQRCodes: React.FC = () => {
  const [merkleRootIndex, setMerkleRootIndex] = useState("");
  const [includeProof, setIncludeProof] = useState(false);
  const [qrCodesData, setQrCodesData] = useState<string[]>([]);
  const [qrCodesImages, setQrCodesImages] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [apiStatus, updateApiStatus, clearApiStatus] = useApiStatus();

  useEffect(() => {
    async function generateQRCodeImages() {
      const images = await Promise.all(qrCodesData.map(generateQrCodeImage));
      setQrCodesImages(images);
    }

    if (qrCodesData.length > 0) {
      generateQRCodeImages();
    }
  }, [qrCodesData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearApiStatus();
    updateApiStatus({ ...apiStatus, pending: true });

    try {
      const response = await axios.get("/api/get-qr-codes", {
        params: { merkleRootIndex, includeProof },
      });

      if (response.status === 200) {
        setQrCodesData(response.data.qrCodesData);
        setAmount(response.data.amount);

        updateApiStatus({
          pending: false,
          success: true,
          message: "QR codes fetched successfully!",
        });
      }
    } catch (error) {
      updateApiStatus({
        pending: false,
        success: false,
        message: "Error fetching QR codes!",
      });
    }
  };

  const handleQrCodeClick = async (qrCodeData: string) => {
    try {
      await navigator.clipboard.writeText(qrCodeData);
      alert("QR code data copied to clipboard");
    } catch (error) {
      alert("Failed to copy QR code to clipboard");
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Display QR Codes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="merkleRootIndex"
            className="block text-sm font-medium mb-2"
          >
            Merkle Root Index
          </label>
          <input
            type="number"
            id="merkleRootIndex"
            value={merkleRootIndex}
            onChange={(e) => setMerkleRootIndex(e.target.value)}
            className="w-full p-2"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="includeProof"
            checked={includeProof}
            onChange={(e) => setIncludeProof(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="includeProof" className="text-sm font-medium">
            Include Merkle Proof
          </label>
        </div>
        <button className="w-full px-4 py-2">Fetch QR Codes</button>
        <ApiStatusDisplay apiStatus={apiStatus} />
      </form>
      {qrCodesData.length > 0 && (
        <p className="mt-4">
          Amount: <strong>{amount}</strong>
        </p>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {qrCodesImages.map((qrCodeImage, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg hover:cursor-pointer"
            onClick={() => handleQrCodeClick(qrCodesData[index])}
          >
            <img
              src={qrCodeImage}
              alt={`QR Code ${index + 1}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export { DisplayQRCodes };
