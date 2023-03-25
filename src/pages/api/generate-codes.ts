import type { NextApiRequest, NextApiResponse } from "next";
import { CodesTree, ICodesTree } from "@/models/codesTree";
import {
  generateSecretCodes,
  generateMerkleTreeAndProofs,
} from "@/utils/merkleGenerator";
import connectToDatabase from "@/utils/mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { numberOfCodes, amount } = req.body;

    // Generate secret codes and Merkle tree
    const secretCodes = generateSecretCodes(numberOfCodes);
    const { merkleTree, merkleProofs } = generateMerkleTreeAndProofs(
      secretCodes,
      amount
    );
    const merkleRoot = merkleTree.getHexRoot();

    // Store secret codes and associated data in MongoDB
    const codesTreeToInsert = {
      merkleRoot,
      merkleLeaves: merkleTree.getHexLeaves(),
      codes: secretCodes.map((secretCode, index) => ({
        secretCode,
        amount,
      })),
    } as ICodesTree;

    try {
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
