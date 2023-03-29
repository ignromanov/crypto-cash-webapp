import type { NextApiRequest, NextApiResponse } from "next";
import { CodesTree, ICodesTree } from "@/models/codesTree";
import {
  generateSecretCodes,
  generateMerkleTreeAndProofs as generateMerkleTree,
} from "@/utils/merkleGenerator";
import connectToDatabase from "@/utils/mongoose";
import { ethers, JsonRpcProvider, verifyMessage } from "ethers";
import {
  codesFactoryContractAddress,
  CodesFactoryArtifactAbi,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";

async function verifySignature(message: string, signature: string) {
  const recoveredAddress = verifyMessage(message, signature);
  const contractOwner = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || "";
  return recoveredAddress === contractOwner;
}

function getCodesFactoryContract() {
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY || "",
    provider
  );

  const codesFactoryContractWrite = new ethers.BaseContract(
    codesFactoryContractAddress,
    CodesFactoryArtifactAbi,
    signer
  ) as unknown as CodesFactoryContractType;

  return codesFactoryContractWrite;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { amount, numberOfCodes, signature, timestamp } = req.body;

    // Check if the request has all the required fields
    if (!amount || !numberOfCodes || !signature || !timestamp) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if the timestamp is recent (e.g., within the last 5 minutes)
    const currentTime = Date.now();
    if (currentTime - timestamp > 5 * 60 * 1000) {
      res.status(400).json({ error: "Timestamp is too old" });
      return;
    }

    // Create the message to verify
    const message = `Generate Codes Request\nAmount: ${amount}\nNumber of Codes: ${numberOfCodes}\nTimestamp: ${timestamp}`;

    // Verify the signature
    const isValid = await verifySignature(message, signature);

    if (!isValid) {
      res.status(403).json({ error: "Invalid signature" });
      return;
    }

    // Generate secret codes and Merkle tree
    const secretCodes = generateSecretCodes(numberOfCodes);
    const merkleTree = generateMerkleTree(secretCodes, amount);
    const merkleRoot = merkleTree.getHexRoot();

    // Store secret codes and associated data in MongoDB
    const codesTreeToInsert = {
      merkleRoot,
      amount,
      merkleLeaves: merkleTree.getHexLeaves(),
      secretCodes,
    } as ICodesTree;

    try {
      // Call the addMerkleRoot function from the CodesFactory contract
      const codesFactoryContractWrite = getCodesFactoryContract();
      const addMerkleRootTx = await codesFactoryContractWrite.addMerkleRoot(
        merkleRoot,
        numberOfCodes,
        amount
      );
      const txReceipt = await addMerkleRootTx.wait();

      if (txReceipt.status !== 1) {
        throw new Error("Failed to add Merkle root to the contract");
      }

      // Get the Merkle tree index from the transaction event
      codesTreeToInsert.merkleRootIndex = Number(txReceipt.logs[1].args[0]);

      // Save the Merkle tree root and codes in the database
      const insertedCodesTree = await CodesTree.create(codesTreeToInsert);
      res.status(201).json(insertedCodesTree);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error storing secret codes tree in database" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default handler;
