import React, { useState } from "react";
import useApiStatus from "../../../hooks/useApiStatus";
import axios from "axios";
import ApiStatusDisplay from "../../elements/ApiStatusDisplay";

const QrCodesDisplay = () => {
  const [merkleRootIndex, setMerkleRootIndex] = useState("");
  const [includeProof, setIncludeProof] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [apiStatus, updateApiStatus, clearApiStatus] = useApiStatus();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearApiStatus();
    updateApiStatus({ ...apiStatus, pending: true });

    try {
      const response = await axios.get("/api/get-qr-codes", {
        params: { merkleRootIndex, includeProof },
      });

      if (response.status === 200) {
        setQrCodes(response.data);
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
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
            className="w-full p-2 border border-gray-300 rounded"
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
        <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md">
          Fetch QR Codes
        </button>
        <ApiStatusDisplay apiStatus={apiStatus} />
      </form>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {qrCodes.map((qrCode, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            {/* Replace with the appropriate QR code component */}
            <img
              src={qrCode}
              alt={`QR Code ${index + 1}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QrCodesDisplay;
