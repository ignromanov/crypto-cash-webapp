import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMetamask } from "@/hooks/useMetamask";
import Layout from "@/components/layouts/Layout";
import {
  CodesFactoryArtifactAbi,
  codesFactoryContractAddress,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";
import {
  stMadTokenContractAbi,
  stMadTokenContractAddress,
  StMadTokenType,
} from "@/contracts/stMadToken";
import Card from "@/components/layouts/Card";

const Balances = () => {
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
        CodesFactoryArtifactAbi,
        signer
      ) as unknown as CodesFactoryContractType;

      // Get Ether balance
      const ethBalance = await provider.getBalance(account);
      setEthBalance(ethBalance.toString());

      // Get stMadToken balance
      const stMadTokenBalance = await stMadTokenContractRead.balanceOf(account);
      setStMadTokenBalance(stMadTokenBalance.toString());

      // Get CodesFactory token balance
      const codesFactoryTokenBalance = await stMadTokenContractRead.balanceOf(
        codesFactoryContractAddress
      );
      setCodesFactoryTokenBalance(codesFactoryTokenBalance.toString());

      // Get Merkle roots
      // Replace this with the actual method to fetch Merkle roots
      const merkleRoots = await codesFactoryContractRead.getMerkleRoots();
      setMerkleRoots(merkleRoots);
    };

    fetchData();
  }, [provider, account]);

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">Balances</h2>
      <p className="text-base mb-2">Ether balance: {ethBalance}</p>
      <p className="text-base mb-2">stMadToken balance: {stMadTokenBalance}</p>
      <p className="text-base mb-6">
        CodesFactory token balance: {codesFactoryTokenBalance}
      </p>

      <h2 className="text-2xl font-semibold mb-4">Merkle Roots</h2>
      <ul className="list-disc list-inside">
        {merkleRoots.map((root, index) => (
          <li key={index} className="text-base my-1">
            {index}: {root}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Balances;
