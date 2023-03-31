import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/layouts/Card";
import { generateQrCodeImage } from "@/utils/qrCode";
import { useMetamask } from "@/hooks/useMetamask";
import axios from "axios";
import { ethers, keccak256 } from "ethers";
import {
  codesFactoryContractAbi,
  codesFactoryContractAddress,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";
import useApiStatus from "@/hooks/useApiStatus";
import { ApiStatusDisplay } from "@/components/elements/ApiStatusDisplay";
import { calculateHash, generateRandomNonce } from "@/utils/secretCodes";
import { parseBigIntValue } from "@/utils/revealBigInt";
import { DataToRedeem } from "./RedeemCode.types";

const RedeemCode: React.FC = () => {
  const { provider, signer } = useMetamask();
  const [apiStatus, updateApiStatus, clearApiStatus] = useApiStatus();
  const codesFactoryContractRef = useRef<CodesFactoryContractType | null>(null);

  const [dataToRedeem, setDataToRedeem] = useState<DataToRedeem | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [isCommitted, setIsCommitted] = useState(false);

  useEffect(() => {
    codesFactoryContractRef.current = new ethers.BaseContract(
      codesFactoryContractAddress,
      codesFactoryContractAbi,
      signer
    ) as unknown as CodesFactoryContractType;
  }, [signer]);

  const handleQrCodeTextChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = event.target.value;
    try {
      const qrCodeImage = await generateQrCodeImage(data);
      setQrCodeImage(qrCodeImage);

      const parsedData: DataToRedeem = JSON.parse(data, parseBigIntValue);
      // parsedData.secretCodeBytes = decodeBase64(parsedData.secretCode);
      setDataToRedeem(parsedData);

      setIsCommitted(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommit = useCallback(async () => {
    if (!dataToRedeem) {
      return;
    }

    try {
      const { secretCode } = dataToRedeem;

      const nonce = generateRandomNonce();
      const commitment = calculateHash(secretCode, nonce);

      const storageKey = `commitment_nonce_${keccak256(secretCode)}`;
      localStorage.setItem(storageKey, nonce.toString());

      clearApiStatus();
      updateApiStatus({
        ...apiStatus,
        pending: true,
        message: "Sending commit transaction...",
      });

      const commitTx = await codesFactoryContractRef.current!.commitCode(
        commitment
      );

      updateApiStatus({
        ...apiStatus,
        message: "Waiting for transaction confirmation...",
      });

      // Wait for the transaction to be confirmed
      await commitTx.wait();

      setIsCommitted(true);
      updateApiStatus({
        pending: false,
        success: true,
        message: "QR code commited successfully!",
      });
    } catch (error) {
      console.error(error);
      updateApiStatus({
        pending: false,
        success: false,
        message: "Error commiting code!",
      });
    }
  }, [dataToRedeem]);

  const handleReveal = useCallback(async () => {
    if (!dataToRedeem) {
      return;
    }

    try {
      clearApiStatus();
      updateApiStatus({
        ...apiStatus,
        pending: true,
        message: "Fetching Merkle proof...",
      });

      let {
        // secretCodeBytes,
        secretCode,
        merkleProof,
        merkleRootIndex,
        amount,
      } = dataToRedeem;

      const nonceStorageKey = `commitment_nonce_${keccak256(secretCode)}`;
      const storedNonce = localStorage.getItem(nonceStorageKey);
      if (!storedNonce) {
        updateApiStatus({
          pending: false,
          success: false,
          message: "Nonce not found. Please commit the code first.",
        });
        return;
      }

      // Request Merkle proof from the server if not provided
      if (!merkleProof) {
        const response = await axios.get("/api/get-merkle-proof", {
          params: { secretCode, merkleRootIndex },
        });

        if (response.status === 200) {
          merkleProof = response.data.merkleProof;
        } else {
          updateApiStatus({
            pending: false,
            success: false,
            message: "Error fetching Merkle proof",
          });
          return;
        }
      }

      updateApiStatus({
        ...apiStatus,
        message: "Sending redeem transaction...",
      });

      // Call the redeemCode function on the contract
      const redeemTx = await codesFactoryContractRef.current!.revealCode(
        merkleRootIndex,
        secretCode,
        // @ts-ignore
        amount,
        BigInt(storedNonce),
        merkleProof
      );

      updateApiStatus({
        ...apiStatus,
        message: "Waiting for transaction confirmation...",
      });

      // Wait for the transaction to be confirmed
      await redeemTx.wait();

      localStorage.removeItem(nonceStorageKey);

      updateApiStatus({
        pending: false,
        success: true,
        message: "QR code revealed successfully!",
      });
    } catch (error) {
      console.error(error);
      updateApiStatus({
        pending: false,
        success: false,
        message: "Error redeeming QR code!",
      });
    }
  }, [dataToRedeem]);

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
        className={`w-full px-4 py-2 ${
          !dataToRedeem || isCommitted ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleCommit}
        disabled={!dataToRedeem || isCommitted}
      >
        Commit Code
      </button>
      <button
        className={`w-full px-4 py-2 mt-4 rounded-md ${
          !isCommitted ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleReveal}
        disabled={!isCommitted}
      >
        Reveal Code
      </button>
      <ApiStatusDisplay apiStatus={apiStatus} />
    </Card>
  );
};
export { RedeemCode };
