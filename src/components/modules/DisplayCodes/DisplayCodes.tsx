import React, { useCallback, useEffect, useState } from "react";
import useExecStatus from "@/hooks/useExecStatus";
import axios from "axios";
import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { Card } from "@/components/layouts/Card";
import { generateQrCodeImage } from "@/utils/qrCode";
import { Badge } from "@/components/elements/Badge";
import { CodeData, Keccak256Hash } from "@/types/codes";
import {
  ApiGetCodesResponseData,
  GetCodesResponseData,
} from "./DisplayCodes.types";
import { ResponseError } from "@/types/api";
import { parseCodeData, stringifyCodeData } from "@/utils/convertCodeData";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";

const DisplayCodes: React.FC = () => {
  const [merkleRootIndex, setMerkleRootIndex] = useState("");
  const [includeProof, setIncludeProof] = useState(false);
  const [codesData, setCodesData] = useState<CodeData[]>([]);
  const [redeemedLeaves, setRedeemedLeaves] = useState<Keccak256Hash[]>([]);
  const [qrCodesImages, setQrCodesImages] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [merkleRoots, setMerkleRoots] = useState<string[]>([]);

  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();
  const { filterRedeemedLeaves, fetchMerkleRoots } =
    useCodesFactoryContract(updateExecStatus);

  useEffect(() => {
    const fetch = async () => {
      const merkleRoots = await fetchMerkleRoots();
      setMerkleRoots(merkleRoots);
    };
    fetch();
  }, [fetchMerkleRoots]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCodesData([]);
    setQrCodesImages([]);
    clearExecStatus();

    updateExecStatus({ pending: true, message: "Fetching codes..." });

    try {
      const response = await axios.get<ApiGetCodesResponseData>(
        "/api/get-codes",
        {
          params: { merkleRootIndex, includeProof },
        }
      );

      if (response.status !== 200) {
        throw Error((response.data as ResponseError).error);
      }

      const responseData = response.data as GetCodesResponseData;
      const codesData = responseData.codesData.map(parseCodeData);
      setCodesData(codesData);
      setAmount(responseData.amount);

      const images = await Promise.all(
        responseData.codesData.map(generateQrCodeImage)
      );
      setQrCodesImages(images);
      const redeemedLeaves = await filterRedeemedLeaves(
        codesData.map(({ leafHash }) => leafHash)
      );
      setRedeemedLeaves(redeemedLeaves);

      updateExecStatus({
        pending: false,
        success: true,
        message: "QR codes fetched successfully!",
      });
    } catch (error) {
      updateExecStatus({
        pending: false,
        success: false,
        message: `Error fetching QR codes! ${error}`,
      });
    }
  };

  const handleQrCodeClick = useCallback(
    async (codeIndex: number) => {
      try {
        await navigator.clipboard.writeText(
          stringifyCodeData(codesData[codeIndex])
        );
        updateExecStatus({
          pending: false,
          success: true,
          message: "QR code data copied to clipboard",
        });
      } catch (error) {
        updateExecStatus({
          pending: false,
          success: false,
          message: "Failed to copy QR code to clipboard",
        });
      }
    },
    [codesData]
  );

  const renderQrCodeImage = (qrCodeImage: string, index: number) => {
    const isCodeRedeemed = redeemedLeaves.includes(codesData[index].leafHash);

    return (
      <div
        key={index}
        className="bg-gray-100 p-4 rounded-lg hover:cursor-pointer"
        onClick={() => handleQrCodeClick(index)}
      >
        <div className="relative">
          <img
            src={qrCodeImage}
            alt={`QR Code ${index + 1}`}
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge
              caption={isCodeRedeemed ? "Redeemed" : "Not Redeemed"}
              status={isCodeRedeemed}
              textSize="text-xs"
            />
          </div>
        </div>
      </div>
    );
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
            Choose Merkle Tree
          </label>
          <select
            id="merkleRootIndex"
            value={merkleRootIndex}
            onChange={(e) => setMerkleRootIndex(e.target.value)}
            className="w-full p-2"
          >
            {merkleRoots.map((rootCode, index) => (
              <option value={index}>{`${index}) ${rootCode}`}</option>
            ))}
          </select>
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

        <button>Fetch QR Codes</button>
        <ExecStatusDisplay execStatus={execStatus} />
      </form>

      {codesData.length > 0 && (
        <p className="mt-6">
          <Badge caption={`Amount of Code: ${amount}`} status={null} />
        </p>
      )}

      {qrCodesImages.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {qrCodesImages.map(renderQrCodeImage)}
        </div>
      )}
    </Card>
  );
};

export { DisplayCodes };
