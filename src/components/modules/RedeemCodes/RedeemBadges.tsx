import { Badge } from "@/components/elements/Badge";
import { formatEther } from "ethers/lib/utils";
import React from "react";
import { RedeemBadgesProps } from "./RedeemCode.types";

const RedeemBadges: React.FC<RedeemBadgesProps> = React.memo(
  ({ hasMerkleProof, isCodeCommitted, isCodeRevealed, amount }) => (
    <div className="mb-4 flex items-center justify-center space-x-4 ">
      <Badge caption={`Amount: ${formatEther(amount)}`} status={null} />
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
  )
);

RedeemBadges.displayName = "RedeemBadges";

export { RedeemBadges };
