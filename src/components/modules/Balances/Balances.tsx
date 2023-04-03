import React, { useState, useEffect } from "react";
import { ethers, formatEther } from "ethers";
import useMetamask from "@/hooks/useMetamask";
import {
  codesFactoryContractAbi,
  codesFactoryContractAddress,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";
import {
  stMadTokenContractAbi,
  stMadTokenContractAddress,
  StMadTokenType,
} from "@/contracts/stMadToken";
import { Card } from "@/components/layouts/Card";

const Balances: React.FC = () => {
  const { account, provider } = useMetamask();
  const [ethBalance, setEthBalance] = useState("");
  const [stMadTokenBalance, setStMadTokenBalance] = useState("");
  const [codesFactoryTokenBalance, setCodesFactoryTokenBalance] = useState("");
  const [merkleRoots, setMerkleRoots] = useState<string[]>([]);

  useEffect(() => {
    if (!provider || !account) {
      return;
    }

    const fetchData = async () => {
      const signer = await provider.getSigner();

      const stMadTokenContractRead = new ethers.BaseContract(
        stMadTokenContractAddress,
        stMadTokenContractAbi,
        signer
      ) as unknown as StMadTokenType;
      const codesFactoryContractRead = new ethers.BaseContract(
        codesFactoryContractAddress,
        codesFactoryContractAbi,
        signer
      ) as unknown as CodesFactoryContractType;

      // Get Ether balance
      const ethBalance = await provider.getBalance(account);
      setEthBalance(formatEther(ethBalance));

      // Get stMadToken balance
      const stMadTokenBalance = await stMadTokenContractRead.balanceOf(account);
      // @ts-ignore
      setStMadTokenBalance(formatEther(stMadTokenBalance));

      // Get CodesFactory token balance
      const codesFactoryTokenBalance = await stMadTokenContractRead.balanceOf(
        codesFactoryContractAddress
      );
      // @ts-ignore
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
  }, [provider, account]);

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
          <p className="text-base">stMad Tokens:</p>
          <p className="text-base font-medium">{stMadTokenBalance}</p>
          <p className="text-base">CodesFactory stMad Tokens:</p>
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
