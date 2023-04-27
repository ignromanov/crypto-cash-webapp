import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { Libp2pNodeSwitcher } from "@/components/elements/Libp2pNodeSwitcher";
import { QrCodeImage } from "@/components/elements/QrCodeImage";
import { Card } from "@/components/layouts/Card";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import useExecStatus from "@/hooks/useExecStatus";
import { useLibp2pNode } from "@/hooks/useLibp2pNode";
import { CodeData, Keccak256Hash } from "@/types/codes";
import { parseCodeData } from "@/utils/converters";
import { generateQrCodeImage } from "@/utils/qrCode";
import React, { useCallback, useState } from "react";
import { RedeemBadges } from "./RedeemBadges";

const RedeemCode: React.FC = () => {
  const [dataToRedeem, setDataToRedeem] = useState<CodeData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isCodeCommitted, setIsCodeCommitted] = useState(false);
  const [isCodeRevealed, setIsCodeRevealed] = useState(false);
  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();
  const hasMerkleProof = !!dataToRedeem?.merkleProof;

  const { libp2pNode, getMerkleProofByCodeData } =
    useLibp2pNode(updateExecStatus);
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

    const proof = await getMerkleProofByCodeData(dataToRedeem);

    const data: CodeData = {
      ...dataToRedeem,
      merkleProof: proof as Keccak256Hash[],
    };
    setDataToRedeem(data);
  }, [dataToRedeem, getMerkleProofByCodeData]);

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
      <QrCodeImage image={qrCodeImage} />
      {dataToRedeem && (
        <RedeemBadges
          hasMerkleProof={hasMerkleProof}
          isCodeCommitted={isCodeCommitted}
          isCodeRevealed={isCodeRevealed}
          amount={dataToRedeem.amount}
        />
      )}
      <div className="flex items-center justify-center">
        <Libp2pNodeSwitcher libp2pNode={libp2pNode} />
        <button
          onClick={handleRetrieveProof}
          disabled={!dataToRedeem || hasMerkleProof}
        >
          Retrieve Merkle Proof
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
