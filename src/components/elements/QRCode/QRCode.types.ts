import { UpdateExecStatus } from "@/hooks/useExecStatus.types";

interface QrCodeProps {
  dataStr: string | null;
  updateExecStatus: UpdateExecStatus;
  children?: React.ReactNode;
}

interface QrCodeRedeemBadgeProps {
  dataStr: string | null;
  index: number;
  isCodeRedeemed: boolean;
  updateExecStatus: UpdateExecStatus;
}

export type { QrCodeProps, QrCodeRedeemBadgeProps };
