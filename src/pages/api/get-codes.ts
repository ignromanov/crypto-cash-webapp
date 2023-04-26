import {
  ApiGetCodesResponseData,
  GetCodesResponseData,
} from "@/components/modules/DisplayCodes";
import CodesTreeModel from "@/models/CodesTreeModel";
import { ICodesTree } from "@/models/CodesTreeModel.types";
import connectToDatabase from "@/services/mongoose";
import { CodeData, Keccak256Hash } from "@/types/codes";
import { stringifyCodeData } from "@/utils/converters";
import { loadMerkleTree } from "@/utils/merkleTree";
import { formatEther, parseEther } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

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
    const cid = codesTree.ipfsCid;

    const codesData = await Promise.all(
      codesTree.secretCodes.map(async (code, index) => {
        const leaf = merkleTree.leafHash([code, amount]) as Keccak256Hash;
        const codeData: CodeData = {
          rootIndex: codesTree.merkleRootIndex,
          code,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          amount,
          leaf,
          cid,
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
