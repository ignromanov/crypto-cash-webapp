import { ExecStatusDisplay } from "@/components/elements/ExecStatusDisplay";
import { Card } from "@/components/layouts/Card";
import useCSHContract from "@/hooks/useCSHContract";
import useExecStatus from "@/hooks/useExecStatus";
import { useAddress } from "@thirdweb-dev/react";
import React, { useCallback, useEffect, useState } from "react";

const TransferCSH: React.FC = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const account = useAddress();
  const [execStatus, updateExecStatus, clearExecStatus] = useExecStatus();
  const { transferTokens, fetchTokenBalance } = useCSHContract(updateExecStatus);

  useEffect(() => {
    const fetchBalance = async () => {
      const fetchedBalance = await fetchTokenBalance();
      setBalance(fetchedBalance);
    };

    if (account) {
      fetchBalance();
    }
  }, [account, fetchTokenBalance]);

  const handleTransfer = useCallback(async () => {
    clearExecStatus();
    const success = await transferTokens(recipient, amount);
    if (success) {
      const updatedBalance = await fetchTokenBalance();
      setBalance(updatedBalance);
    }
  }, [clearExecStatus, transferTokens, recipient, amount, fetchTokenBalance]);

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">Transfer CryptoCash Token</h2>
      <p className="my-2">Current balance: {balance} CSH</p>
      <div className="mb-4">
        <label htmlFor="recipient" className="block text-sm font-medium mb-2">
          Recipient address
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium mb-2">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2"
        />
      </div>
      <button
        className={"mt-4"}
        onClick={handleTransfer}
        disabled={!recipient || !amount}
      >
        Transfer
      </button>
      <ExecStatusDisplay execStatus={execStatus} />
    </Card>
  );
};

export { TransferCSH };
