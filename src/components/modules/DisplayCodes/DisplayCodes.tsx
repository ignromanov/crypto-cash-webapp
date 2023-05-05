import { Badge } from "@/components/elements/Badge";
import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { QrCodeRedeemBadge } from "@/components/elements/QRCode";
import { Card } from "@/components/layouts/Card";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import useExecStatus from "@/hooks/useExecStatus";
import useGetSecretCodesApi from "@/hooks/useGetSecretCodesApi";
import React, { useCallback, useEffect, useState } from "react";

const DisplayCodes: React.FC = () => {
  const [merkleRootCode, setMerkleRootCode] = useState("");
  const [includeProof, setIncludeProof] = useState(false);
  const [redeemedLeaves, setRedeemedLeaves] = useState<string[]>([]);
  const [merkleRoots, setMerkleRoots] = useState<string[]>([]);

  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();
  const { filterRedeemedLeaves, fetchMerkleRoots } =
    useCodesFactoryContract(updateExecStatus);
  const { codesData, codesDataStr, amount, sendRequest } =
    useGetSecretCodesApi(updateExecStatus);

  useEffect(() => {
    const fetch = async () => {
      const merkleRoots = await fetchMerkleRoots();
      setMerkleRoots(merkleRoots);
    };

    fetch();
    const intervalId = setInterval(fetch, 5000);
    return () => clearInterval(intervalId);
  }, [fetchMerkleRoots]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!merkleRootCode) {
        updateExecStatus({
          message: "Specify the required parameters",
          pending: false,
          success: false,
        });
        return;
      }
      clearExecStatus();

      const { codesData } = await sendRequest(merkleRootCode, includeProof);

      const redeemedLeaves = await filterRedeemedLeaves(
        codesData.map(({ leaf }) => leaf)
      );
      setRedeemedLeaves(redeemedLeaves);

      updateExecStatus({
        pending: false,
        success: true,
        message: "QR codes fetched successfully!",
      });
    },
    [
      merkleRootCode,
      clearExecStatus,
      sendRequest,
      includeProof,
      filterRedeemedLeaves,
      updateExecStatus,
    ]
  );

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Display QR Codes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="merkleRootIndex"
            className="block text-sm font-medium mb-2"
          >
            Merkle Tree Root
          </label>
          <select
            id="merkleRootIndex"
            value={merkleRootCode}
            onChange={(e) => setMerkleRootCode(e.target.value)}
            className="w-full p-2"
          >
            <option value="">Select a Merkle Root</option>
            {merkleRoots.map((rootCode, index) => (
              <option
                value={rootCode}
                key={rootCode}
              >{`${index}) ${rootCode}`}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="includeProof"
            checked={includeProof}
            onChange={(e) => setIncludeProof(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="includeProof" className="text-sm font-medium">
            Include Merkle Proof
          </label>
        </div>

        <button disabled={!merkleRootCode}>Fetch QR Codes</button>
        <ExecStatusDisplay execStatus={execStatus} />
      </form>

      {codesData.length > 0 && (
        <p className="mt-6">
          <Badge caption={`Amount of Code: ${amount}`} status={null} />
        </p>
      )}

      {codesDataStr.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {codesDataStr.map((dataStr, index) => {
            const isCodeRedeemed = redeemedLeaves.includes(
              codesData[index].leaf
            );
            return (
              <QrCodeRedeemBadge
                key={index}
                dataStr={dataStr}
                index={index}
                isCodeRedeemed={isCodeRedeemed}
                updateExecStatus={updateExecStatus}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
};

export { DisplayCodes };
