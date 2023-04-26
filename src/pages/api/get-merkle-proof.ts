import CodesTreeModel from "@/models/CodesTreeModel";
import { ICodesTree } from "@/models/CodesTreeModel.types";
import connectToDatabase from "@/services/mongoose";
import { loadMerkleTree } from "@/utils/merkleTree";
import type { NextApiRequest, NextApiResponse } from "next";

const getMerkleProof = async (req: NextApiRequest, res: NextApiResponse) => {
  const { merkleRootIndex, secretCode } = req.query;

  if (typeof merkleRootIndex !== "string" || typeof secretCode !== "string") {
    res.status(400).json({
      message:
        "Invalid request parameters: merkleRootIndex & secretCode & amount must be strings.",
    });
    return;
  }

  try {
    await connectToDatabase();
    const codesTree: ICodesTree | null = await CodesTreeModel.findOne({
      merkleRootIndex: parseInt(merkleRootIndex),
    });

    if (!codesTree) {
      res.status(404).json({ message: "Merkle root not found." });
      return;
    }

    const merkleTree = loadMerkleTree(codesTree.merkleDump);
    const leafIndex = codesTree.secretCodes.indexOf(secretCode);

    if (leafIndex === -1) {
      res
        .status(404)
        .json({ message: "Secret code not found in the Merkle tree." });
      return;
    }

    const merkleProof = merkleTree.getProof(leafIndex);

    res.status(200).json({ merkleProof });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching Merkle proof." });
  }
};

export default getMerkleProof;
