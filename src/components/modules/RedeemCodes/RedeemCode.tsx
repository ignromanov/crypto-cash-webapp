import { Badge } from "@/components/elements/Badge";
import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { Libp2pNodeSwitcher } from "@/components/elements/Libp2pNodeSwitcher";
import { Card } from "@/components/layouts/Card";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import useExecStatus from "@/hooks/useExecStatus";
import { useLibp2pNode } from "@/hooks/useLibp2pNode";
import { CodeData, Keccak256Hash } from "@/types/codes";
import { parseCodeData } from "@/utils/converters";
import { generateQrCodeImage } from "@/utils/qrCode";
import { formatEther } from "ethers/lib/utils";
import Image from "next/image";
import React, { useCallback, useState } from "react";

const RedeemCode: React.FC = () => {
  const [dataToRedeem, setDataToRedeem] = useState<CodeData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isCodeCommitted, setIsCodeCommitted] = useState(false);
  const [isCodeRevealed, setIsCodeRevealed] = useState(false);
  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();
  const hasMerkleProof = !!dataToRedeem?.merkleProof;

  const { libp2pNode, getMerkleProofByData } = useLibp2pNode(updateExecStatus);
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
  }, [clearExecStatus, dataToRedeem, handleCommit]);

  const handleRevealWrapper = useCallback(async () => {
    clearExecStatus();
    const success = await handleReveal(dataToRedeem);
    setIsCodeRevealed(success);
  }, [clearExecStatus, dataToRedeem, handleReveal]);

  const handleQrCodeTextChange = useCallback(
    async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

        const redeemedLeaves = await filterRedeemedLeaves([parsedData.leaf]);
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

  const handleRetrieveProof = useCallback(async () => {
    if (!dataToRedeem) return;

    const proof = await getMerkleProofByData(dataToRedeem);

    const data: CodeData = {
      ...dataToRedeem,
      merkleProof: proof as Keccak256Hash[],
    };
    setDataToRedeem(data);
  }, [dataToRedeem, getMerkleProofByData]);

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">Redeem Code</h2>
      <div className="mb-4">
        <label htmlFor="qrCodeText" className="block text-sm font-medium mb-2">
          Enter QR Code
        </label>
        <textarea
          id="qrCodeText"
          onChange={handleQrCodeTextChange}
          className="w-full p-2"
        />
      </div>
      <div className="mb-4 relative flex items-center justify-center">
        {qrCodeImage ? (
          <Image
            src={qrCodeImage}
            alt={`QR Code`}
            width="0"
            height="0"
            sizes="100vw"
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
            caption={`Amount: ${formatEther(dataToRedeem.amount)}`}
            status={null}
          />
          <Badge
            caption={hasMerkleProof ? "Proofed" : "No Proof"}
            status={hasMerkleProof}
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
      <div className="flex items-center justify-center">
        <Libp2pNodeSwitcher libp2pNode={libp2pNode} />
        <button
          onClick={handleRetrieveProof}
          disabled={!dataToRedeem || hasMerkleProof}
        >
          {"Retrieve Merkle Proof"}
        </button>
      </div>
      <button
        className={"mt-4"}
        onClick={handleCommitWrapper}
        disabled={!dataToRedeem || isCodeCommitted || !hasMerkleProof}
      >
        Commit Code
      </button>
      <button
        className={"mt-4"}
        onClick={handleRevealWrapper}
        disabled={!isCodeCommitted || isCodeRevealed || !hasMerkleProof}
      >
        Reveal Code
      </button>

      <ExecStatusDisplay execStatus={execStatus} />
    </Card>
  );
};

export { RedeemCode };
