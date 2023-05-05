import { generateQrCodeImage } from "@/utils/qrCode";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QrCodeProps } from "./QrCode.types";

const QRCode: React.FC<QrCodeProps> = React.memo(
  ({ dataStr, updateExecStatus, children }) => {
    const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(!!dataStr);

    useEffect(() => {
      const fetchQrCode = async () => {
        if (!dataStr) {
          setQrCodeImage(null);
          return;
        }

        setIsLoading(true);
        setQrCodeImage(null);

        try {
          const generatedQrCodeImage = await generateQrCodeImage(dataStr);
          setQrCodeImage(generatedQrCodeImage);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setQrCodeImage(null);
          setIsLoading(false);
        }
      };

      fetchQrCode();
    }, [dataStr]);

    const handleQrCodeClick = useCallback(async () => {
      if (!dataStr) return;

      try {
        await navigator.clipboard.writeText(dataStr);
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
    }, [dataStr, updateExecStatus]);

    const QRCodeImage = useMemo(() => {
      if (!qrCodeImage) return null;

      return (
        <div
          className="relative hover:cursor-pointer"
          onClick={handleQrCodeClick}
        >
          <Image
            src={qrCodeImage}
            alt={`QR Code`}
            width="0"
            height="0"
            sizes="100vw"
            className="w-auto h-1/2 object-contain"
          />
          {children && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {children}
            </div>
          )}
        </div>
      );
    }, [children, handleQrCodeClick, qrCodeImage]);

    const EmptyQRCode = useMemo(() => {
      return (
        <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-lg">No QR Code</span>
        </div>
      );
    }, []);

    const LoadingQRCode = useMemo(() => {
      return (
        <div className="w-auto h-1/2 relative bg-gray-300 rounded">
          <div className="w-full aspect-square flex items-center justify-center">
            <span className="text-gray-600 text-sm m-2">
              Loading QR Code...
            </span>
          </div>
        </div>
      );
    }, []);

    return (
      <div className="relative flex items-center justify-center">
        {qrCodeImage ? QRCodeImage : isLoading ? LoadingQRCode : EmptyQRCode}
      </div>
    );
  }
);
QRCode.displayName = "QRCode";

export { QRCode };
