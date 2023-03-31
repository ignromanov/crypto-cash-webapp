import React, { useState } from "react";
import useApiStatus from "@/hooks/useApiStatus";
import axios from "axios";
import { ApiStatusDisplay } from "@/components/elements/ApiStatusDisplay";
import { useMetamask } from "@/hooks/useMetamask";
import { Card } from "@/components/layouts/Card";
import { getMessageToSign } from "@/utils/secretCodes";
import { formatEther, parseEther } from "ethers";

const GenerateCodes: React.FC = () => {
  const { provider } = useMetamask();
  const [numberOfCodes, setNumberOfCodes] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [apiStatus, updateApiStatus, clearApiStatus] = useApiStatus();

  async function signMessage(message: string) {
    if (!provider) {
      return "";
    }
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  }

  async function sendRequest(amount: BigInt, numberOfCodes: string) {
    const timestamp = Date.now();
    const messageToSign = getMessageToSign(amount, numberOfCodes, timestamp);
    const signature = await signMessage(messageToSign);

    const response = await axios.post("/api/generate-codes", {
      // @ts-ignore
      amount: formatEther(amount),
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
      const response = await sendRequest(parseEther(amount), numberOfCodes);
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
            className="w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount per Code
          </label>
          <input
            type="number"
            id="amount"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2"
          />
        </div>
        <button className="w-full px-4 py-2">Generate Secret Codes</button>
        <ApiStatusDisplay apiStatus={apiStatus} />
      </form>
    </Card>
  );
};

export { GenerateCodes };
