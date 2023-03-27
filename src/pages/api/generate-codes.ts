import type { NextApiRequest, NextApiResponse } from "next";
import { CodesTree, ICodesTree } from "@/models/codesTree";
import {
  generateSecretCodes,
  generateMerkleTreeAndProofs as generateMerkleTree,
} from "@/utils/merkleGenerator";
import connectToDatabase from "@/utils/mongoose";
import codesFactory from "@/contracts/codesFactory";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { numberOfCodes, amount } = req.body;

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
      const addMerkleRootTx = await codesFactory.addMerkleRoot(merkleRoot);
      const txReceipt = await addMerkleRootTx.wait();

      if (txReceipt.status !== 1) {
        throw new Error("Failed to add Merkle root to the contract");
      }

      // Get the Merkle tree index from the transaction event
      codesTreeToInsert.merkleRootIndex = Number(txReceipt.logs[0].args[0]);

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
