import React, { FormEvent, useState } from "react";
import useApiStatus from "@/hooks/useApiStatus";
import axios from "axios";
import ApiStatusDisplay from "../../elements/ApiStatusDisplay";
import { useMetamask } from "@/hooks/useMetamask";
import Card from "@/components/layouts/Card";

const QRCodesGenerate = () => {
  const { provider, account } = useMetamask();
  const [numberOfCodes, setNumberOfCodes] = useState("");
  const [amount, setAmount] = useState("");
  const [apiStatus, updateApiStatus, clearApiStatus] = useApiStatus();

  function getMessageToSign(
    amount: string,
    numberOfCodes: string,
    timestamp: number
  ) {
    return `Generate Codes Request\nAmount: ${amount}\nNumber of Codes: ${numberOfCodes}\nTimestamp: ${timestamp}`;
  }

  async function signMessage(message: string) {
    if (!provider) {
      return "";
    }
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  }

  async function sendRequest(amount: string, numberOfCodes: string) {
    const timestamp = Date.now();
    const messageToSign = getMessageToSign(amount, numberOfCodes, timestamp);
    const signature = await signMessage(messageToSign);

    const response = await axios.post("/api/generate-codes", {
      amount,
      numberOfCodes,
      signature,
      timestamp,
    });

    return response;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearApiStatus();
    updateApiStatus({ ...apiStatus, pending: true });

    try {
      const response = await sendRequest(amount, numberOfCodes);
      if (response.status === 201) {
        updateApiStatus({
          pending: false,
          success: true,
          message: `Secret codes generated successfully with RootIndex: ${response.data.merkleRootIndex}!`,
        });
      }
    } catch (error) {
      updateApiStatus({
        pending: false,
        success: false,
        message: "Error generating secret codes!",
      });
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Generate Secret Codes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="numOfCodes"
            className="block text-sm font-medium mb-2"
          >
            Number of Secret Codes
          </label>
          <input
            type="number"
            id="numOfCodes"
            value={numberOfCodes}
            onChange={(e) => setNumberOfCodes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount per Code
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md">
          Generate Secret Codes
        </button>
        <ApiStatusDisplay apiStatus={apiStatus} />
      </form>
    </Card>
  );
};

export default QRCodesGenerate;
