import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/layouts/Card";
import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { generateQrCodeImage } from "@/utils/qrCode";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import useExecStatus from "@/hooks/useExecStatus";
import { formatEther, parseEther } from "ethers";
import { Badge } from "@/components/elements/Badge";
import { CodeData } from "@/types/codes";
import { parseCodeData } from "@/utils/convertCodeData";

const RedeemCode: React.FC = () => {
  const [dataToRedeem, setDataToRedeem] = useState<CodeData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isCodeCommitted, setIsCodeCommitted] = useState(false);
  const [isCodeRevealed, setIsCodeRevealed] = useState(false);
  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();

  const {
    handleCommit,
    handleReveal,
    filterRedeemedLeaves,
    filterCommitedCodes,
  } = useCodesFactoryContract(updateExecStatus);

  const handleCommitWrapper = useCallback(async () => {
    clearExecStatus();
    const success = await handleCommit(dataToRedeem);
    setIsCodeCommitted(success);
  }, [dataToRedeem, handleCommit]);

  const handleRevealWrapper = useCallback(async () => {
    clearExecStatus();
    const success = await handleReveal(dataToRedeem);
    setIsCodeRevealed(success);
  }, [dataToRedeem, handleReveal]);

  const handleQrCodeTextChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const data = event.target.value;
      if (!data) {
        setQrCodeImage(null);
        setDataToRedeem(null);
        setIsCodeCommitted(false);
        setIsCodeRevealed(false);
      }
      try {
        const qrCodeImage = await generateQrCodeImage(data);
        setQrCodeImage(qrCodeImage);

        const parsedData = parseCodeData(data);
        setDataToRedeem(parsedData);

        const redeemedLeaves = await filterRedeemedLeaves([
          parsedData.leafHash,
        ]);
        const isCodeRedeemed = redeemedLeaves.length === 1;

        const commitedCodes = await filterCommitedCodes([parsedData]);
        const isCodeCommitted = commitedCodes.length === 1;

        setIsCodeCommitted(isCodeRedeemed || isCodeCommitted);
        setIsCodeRevealed(isCodeRedeemed);
      } catch (error) {
        console.error(error);
      }
    },
    [filterRedeemedLeaves, filterCommitedCodes]
  );

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">Redeem Code</h2>
      <div className="mb-4">
        <label htmlFor="qrCodeText" className="block text-sm font-medium mb-2">
          Enter QR Code
        </label>
        <input
          type="text"
          id="qrCodeText"
          onChange={handleQrCodeTextChange}
          className="w-full p-2"
        />
      </div>
      <div className="mb-4 relative flex items-center justify-center">
        {qrCodeImage ? (
          <img
            src={qrCodeImage}
            alt={`QR Code`}
            className="w-auto h-1/2 object-contain"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 text-lg">No QR Code</span>
          </div>
        )}
      </div>
      {dataToRedeem && (
        <div className="mb-4 flex items-center justify-center space-x-4 ">
          <Badge
            //@ts-ignore
            caption={`Amount: ${formatEther(dataToRedeem.amount)}`}
            status={null}
          />
          <Badge
            caption={isCodeCommitted ? "Committed" : "Not Committed"}
            status={isCodeCommitted}
          />
          <Badge
            caption={isCodeRevealed ? "Redeemed" : "Not Redeemed"}
            status={isCodeRevealed}
          />
        </div>
      )}

      <button
        className={`${
          !dataToRedeem || isCodeCommitted
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={handleCommitWrapper}
        disabled={!dataToRedeem || isCodeCommitted}
      >
        Commit Code
      </button>
      <button
        className={`mt-4 ${
          !isCodeCommitted || isCodeRevealed
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={handleRevealWrapper}
        disabled={!isCodeCommitted || isCodeRevealed}
      >
        Reveal Code
      </button>

      <ExecStatusDisplay execStatus={execStatus} />
    </Card>
  );
};

export { RedeemCode };
