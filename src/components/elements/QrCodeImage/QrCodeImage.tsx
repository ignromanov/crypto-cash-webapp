import Image from "next/image";
import React from "react";

const QrCodeImage: React.FC<{ image: string | null }> = React.memo(
  ({ image }) => (
    <div className="mb-4 relative flex items-center justify-center">
      {image ? (
        <Image
          src={image}
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
  )
);
QrCodeImage.displayName = "QrCodeImage";

export { QrCodeImage };
