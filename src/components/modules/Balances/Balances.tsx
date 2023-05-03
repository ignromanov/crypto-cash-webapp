import { Card } from "@/components/layouts/Card";
import {
  codesFactoryContractAddress,
} from "@/contracts/codesFactory";
import useCSHContract from "@/hooks/useCSHContract";
import useCodesFactoryContract from "@/hooks/useCodeFactoryContract";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";

const Balances: React.FC = () => {
  const account = useAddress();
  const signer = useSigner();
  // TODO: waiting for Metamask ext fix
  // const isMismatched = useNetworkMismatch();
  const isMismatched = false;

  const [ethBalance, setEthBalance] = useState("");
  const [CSHTokenBalance, setCSHTokenBalance] = useState("");
  const [codesFactoryTokenBalance, setCodesFactoryTokenBalance] = useState("");
  const [merkleRoots, setMerkleRoots] = useState<string[]>([]);

  const { fetchTokenBalance } = useCSHContract();
  const { fetchMerkleRoots } = useCodesFactoryContract()

  useEffect(() => {
    if (!signer || !account || isMismatched) {
      return;
    }

    const fetchData = async () => {
      // Get Ether balance
      const ethBalance = await signer.getBalance();
      setEthBalance(formatEther(ethBalance));

      // Get CSHToken balance
      const cSHTokenBalance = await fetchTokenBalance();
      setCSHTokenBalance(cSHTokenBalance);

      // Get CodesFactory token balance
      const codesFactoryTokenBalance = await fetchTokenBalance(
        codesFactoryContractAddress
      );
      setCodesFactoryTokenBalance(codesFactoryTokenBalance);

      // Get Merkle roots
      const merkleRoots = await fetchMerkleRoots();
      setMerkleRoots(merkleRoots);
    };

    fetchData();

    // update Data every 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [signer, account, isMismatched, fetchTokenBalance, fetchMerkleRoots]);

  return (
    <Card>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
        <p className="text-base mb-6">
          Welcome to the CryptoCash Platform, a blockchain-based payment
          solution designed for developing countries, leveraging token-based
          transactions with secret codes. Our platform empowers users to create
          and redeem secret codes tied to specific amounts of tokens, providing
          a seamless, secure, and user-friendly experience. Explore our
          easy-to-use interface and discover the power of fast and affordable
          transactions using QR codes and secure code generation and redemption
          on the blockchain.
        </p>
      </div>
      <div className="p-4 bg-gray-100 rounded-t-md">
        <h2 className="text-2xl font-semibold mb-4">Balances</h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-base">Ethers:</p>
          <p className="text-base font-medium">{ethBalance}</p>
          <p className="text-base">CSH Tokens:</p>
          <p className="text-base font-medium">{CSHTokenBalance}</p>
          <p className="text-base">CodesFactory CSH Tokens:</p>
          <p className="text-base font-medium">{codesFactoryTokenBalance}</p>
        </div>
      </div>

      {merkleRoots.length > 0 && (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Merkle Roots</h2>
          <ul className="list-disc list-inside">
            {merkleRoots.map((root, index) => (
              <li key={index} className="text-base my-1">
                <span className="font-medium">{index}:</span> {root}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
export { Balances };
