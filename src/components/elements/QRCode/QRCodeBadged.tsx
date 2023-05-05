import React from "react";
import { Badge } from "../Badge";
import { QRCode } from "./QRCode";
import { QrCodeRedeemBadgeProps } from "./QrCode.types";

const QrCodeRedeemBadge: React.FC<QrCodeRedeemBadgeProps> = React.memo(
  ({ dataStr, isCodeRedeemed, updateExecStatus }) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <QRCode dataStr={dataStr} updateExecStatus={updateExecStatus}>
          <Badge
            caption={isCodeRedeemed ? "Redeemed" : "Not Redeemed"}
            status={isCodeRedeemed}
            textSize="text-xs"
          />
        </QRCode>
      </div>
    );
  }
);
QrCodeRedeemBadge.displayName = "QrCodeRedeemBadge";

export { QrCodeRedeemBadge };
