import { NextApiRequest, NextApiResponse } from "next";
import CodesTreeModel from "@/models/CodesTreeModel";
import { ICodesTree } from "@/models/CodesTreeModel.types";
import connectToDatabase from "@/services/mongoose";
import { loadMerkleTree } from "@/utils/merkleTree";
import { CodeData, Keccak256Hash } from "@/types/codes";
import {
  ApiGetCodesResponseData,
  GetCodesResponseData,
} from "@/components/modules/DisplayCodes";
import { stringifyCodeData } from "@/utils/convertCodeData";
import { parseEther, formatEther } from "ethers/lib/utils";

async function getCodes(
  req: NextApiRequest,
  res: NextApiResponse<ApiGetCodesResponseData>
) {
  const { merkleRootCode, includeProof } = req.query;
  const withProof = includeProof === "true";

  if (typeof merkleRootCode !== "string") {
    res.status(400).json({
      message: "Invalid request parameters: merkleRootCode must be a string.",
    });
    return;
  }

  await connectToDatabase();

  const codesTree: ICodesTree | null = await CodesTreeModel.findOne({
    merkleRoot: merkleRootCode,
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          amount,
          merkleRootIndex: codesTree.merkleRootIndex,
          leafHash,
        };

        if (withProof) {
          const merkleProof = merkleTree.getProof(index) as Keccak256Hash[];
          codeData["merkleProof"] = merkleProof;
        }

        return stringifyCodeData(codeData);
      })
    );

    const response: GetCodesResponseData = {
      codesData,
      amount: formatEther(amount),
    };

    res.status(200).json(response);
  } else {
    res.status(404).json({ message: "Merkle root index not found." });
  }
}

export default getCodes;
