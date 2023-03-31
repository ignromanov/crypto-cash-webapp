import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/layouts/Card";
import useMetamask from "@/hooks/useMetamask";
import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { DataToRedeem } from "./RedeemCode.types";
import { generateQrCodeImage } from "@/utils/qrCode";
import { parseBigIntValue } from "@/utils/revealBigInt";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import useExecStatus from "@/hooks/useExecStatus";

const RedeemCode: React.FC = () => {
  const [dataToRedeem, setDataToRedeem] = useState<DataToRedeem | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isCommitted, setIsCommitted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();

  const { handleCommit, handleReveal } = useCodesFactoryContract(
    dataToRedeem,
    updateExecStatus
  );

  const handleCommitWrapper = useCallback(async () => {
    clearExecStatus();
    const success = await handleCommit();
    setIsCommitted(success);
  }, [handleCommit]);

  const handleRevealWrapper = useCallback(async () => {
    clearExecStatus();
    const success = await handleReveal();
    setIsRevealed(success);
  }, [handleReveal]);

  const handleQrCodeTextChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const data = event.target.value;
      if (!data) {
        setQrCodeImage(null);
        setDataToRedeem(null);
        setIsCommitted(false);
        setIsRevealed(false);
      }
      try {
        const qrCodeImage = await generateQrCodeImage(data);
        setQrCodeImage(qrCodeImage);

        const parsedData: DataToRedeem = JSON.parse(data, parseBigIntValue);
        setDataToRedeem(parsedData);

        setIsCommitted(false);
        setIsRevealed(false);
      } catch (error) {
        console.error(error);
      }
    },
    []
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
            className="w-1/2 h-auto object-contain"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 text-lg">No QR Code</span>
          </div>
        )}
      </div>

      <button
        className={`${
          !dataToRedeem || isCommitted ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleCommitWrapper}
        disabled={!dataToRedeem || isCommitted}
      >
        Commit Code
      </button>
      <button
        className={`mt-4 ${
          !isCommitted || isRevealed ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleRevealWrapper}
        disabled={!isCommitted || isRevealed}
      >
        Reveal Code
      </button>

      <ExecStatusDisplay execStatus={execStatus} />
    </Card>
  );
};

export { RedeemCode };
