import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  codesFactoryContractAbi,
  codesFactoryContractAddress,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";
import { Card } from "@/components/layouts/Card";
import {
  cSHTokenContractAddress,
  cSHTokenContractAbi,
  CSHTokenType,
} from "@/contracts/cSHToken";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { formatEther } from "ethers/lib/utils";

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

  useEffect(() => {
    if (!signer || !account || isMismatched) {
      return;
    }

    const fetchData = async () => {
      const cSHTokenContractRead: CSHTokenType = new ethers.BaseContract(
        cSHTokenContractAddress,
        cSHTokenContractAbi,
        signer
      );
      const codesFactoryContractRead: CodesFactoryContractType =
        new ethers.BaseContract(
          codesFactoryContractAddress,
          codesFactoryContractAbi,
          signer
        );

      // Get Ether balance
      const ethBalance = await signer.getBalance();
      setEthBalance(formatEther(ethBalance));

      // Get CSHToken balance
      const cSHTokenBalance = await cSHTokenContractRead.balanceOf(account);
      setCSHTokenBalance(formatEther(cSHTokenBalance));

      // Get CodesFactory token balance
      const codesFactoryTokenBalance = await cSHTokenContractRead.balanceOf(
        codesFactoryContractAddress
      );
      setCodesFactoryTokenBalance(formatEther(codesFactoryTokenBalance));

      // Get Merkle roots
      const merkleRoots = await codesFactoryContractRead.getMerkleRoots();
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
  }, [signer, account, isMismatched]);

  return (
    <Card>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
        <p className="text-base mb-6">
          Welcome to the CryptoCash Platform, a secure and innovative solution
          for generating and redeeming token-based codes. Our platform empowers
          users to create secret codes tied to specific amounts of tokens,
          providing a seamless and user-friendly experience. Explore our
          easy-to-use interface and discover the power of secure code generation
          and redemption on the blockchain.
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
    </Card>
  );
};
export { Balances };
