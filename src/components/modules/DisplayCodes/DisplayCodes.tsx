import React, { useCallback, useEffect, useState } from "react";
import useExecStatus from "@/hooks/useExecStatus";
import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { Card } from "@/components/layouts/Card";
import { generateQrCodeImage } from "@/utils/qrCode";
import { Badge } from "@/components/elements/Badge";
import { Keccak256Hash } from "@/types/codes";
import { stringifyCodeData } from "@/utils/convertCodeData";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import useGetCodesApi from "@/hooks/useGetCodesApi";
import Image from "next/image";

const DisplayCodes: React.FC = () => {
  const [merkleRootCode, setMerkleRootCode] = useState("");
  const [includeProof, setIncludeProof] = useState(false);
  const [redeemedLeaves, setRedeemedLeaves] = useState<Keccak256Hash[]>([]);
  const [qrCodesImages, setQrCodesImages] = useState<string[]>([]);
  const [merkleRoots, setMerkleRoots] = useState<string[]>([]);

  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();
  const { filterRedeemedLeaves, fetchMerkleRoots } =
    useCodesFactoryContract(updateExecStatus);
  const { codesData, amount, requestCodes } = useGetCodesApi(updateExecStatus);

  useEffect(() => {
    const fetch = async () => {
      const merkleRoots = await fetchMerkleRoots();
      setMerkleRoots(merkleRoots);
    };
    fetch();

    // update MerkleRoots every 5 seconds
    const intervalId = setInterval(() => {
      fetch();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMerkleRoots]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!merkleRootCode) {
        updateExecStatus({
          message: "Specify the required parameters",
          pending: false,
          success: false,
        });
        return;
      }
      setQrCodesImages([]);
      clearExecStatus();

      const { codesDataStr, codesData } = await requestCodes(
        merkleRootCode,
        includeProof
      );

      const images = await Promise.all(codesDataStr.map(generateQrCodeImage));
      setQrCodesImages(images);

      const redeemedLeaves = await filterRedeemedLeaves(
        codesData.map(({ leafHash }) => leafHash)
      );
      setRedeemedLeaves(redeemedLeaves);
    },
    [
      merkleRootCode,
      clearExecStatus,
      requestCodes,
      includeProof,
      filterRedeemedLeaves,
      updateExecStatus,
    ]
  );

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
        console.error(error);
        updateExecStatus({
          pending: false,
          success: false,
          message: "Failed to copy QR code to clipboard",
        });
      }
    },
    [codesData, updateExecStatus]
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
          <Image
            src={qrCodeImage}
            alt={`QR Code ${index + 1}`}
            width="0"
            height="0"
            sizes="100vw"
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
            Merkle Tree Root
          </label>
          <select
            id="merkleRootIndex"
            value={merkleRootCode}
            onChange={(e) => setMerkleRootCode(e.target.value)}
            className="w-full p-2"
          >
            <option value="">Select a Merkle Root</option>
            {merkleRoots.map((rootCode, index) => (
              <option
                value={rootCode}
                key={rootCode}
              >{`${index}) ${rootCode}`}</option>
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

        <button disabled={!merkleRootCode}>Fetch QR Codes</button>
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
