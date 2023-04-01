import { NextApiRequest, NextApiResponse } from "next";
import CodesTreeModel from "@/models/CodesTreeModel";
import { ICodesTree } from "@/models/CodesTreeModel.types";
import connectToDatabase from "@/utils/mongoose";
import { loadMerkleTree } from "@/utils/merkleTree";
import { formatEther, parseEther } from "ethers";
import { CodeData, Keccak256Hash } from "@/types/codes";
import { ApiGetCodesResponseData } from "@/components/modules/DisplayCodes";
import { stringifyCodeData } from "@/utils/convertCodeData";

async function getCodes(
  req: NextApiRequest,
  res: NextApiResponse<ApiGetCodesResponseData>
) {
  const { merkleRootIndex, includeProof } = req.query;
  const withProof = includeProof === "true";

  if (typeof merkleRootIndex !== "string") {
    res.status(400).json({
      error: "Invalid request parameters: merkleRootIndex must be a string",
    });
    return;
  }

  await connectToDatabase();

  const codesTree: ICodesTree | null = await CodesTreeModel.findOne({
    merkleRootIndex: parseInt(merkleRootIndex),
  });

  if (codesTree) {
    const merkleTree = loadMerkleTree(codesTree.merkleDump);
    const amount = parseEther(codesTree.amount);

    const codesData = await Promise.all(
      codesTree.secretCodes.map(async (secretCode, index) => {
        const leafHash = merkleTree.leafHash([
          secretCode,
          amount,
        ]) as Keccak256Hash;
        const codeData: CodeData = {
          secretCode,
          amount,
          merkleRootIndex,
          leafHash,
        };

        if (withProof) {
          const merkleProof = merkleTree.getProof(index) as Keccak256Hash[];
          codeData["merkleProof"] = merkleProof;
        }

        return stringifyCodeData(codeData);
      })
    );

    const response = {
      status: "success" as const,
      codesData,
      amount: formatEther(amount),
    };

    res.status(200).json(response);
  } else {
    res.status(404).json({ error: "Merkle root index not found" });
  }
}

export default getCodes;
