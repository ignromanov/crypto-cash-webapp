import { NextApiRequest, NextApiResponse } from "next";
import CodesTreeModel from "@/models/CodesTreeModel";
import { ICodesTree } from "@/models/CodesTreeModel.types";
import connectToDatabase from "@/utils/mongoose";
import { loadMerkleTree } from "@/utils/merkleTree";
import { decodeBase64, formatEther, parseEther } from "ethers";
import { stringifyBigIntValue } from "@/utils/revealBigInt";

async function getQrCodes(req: NextApiRequest, res: NextApiResponse) {
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

    const qrCodesData = await Promise.all(
      codesTree.secretCodes.map(async (secretCode, index) => {
        const leafHash = merkleTree.leafHash([secretCode, amount]);
        const qrCodeData: any = {
          merkleRootIndex,
          secretCode,
          amount,
          leafHash,
        };

        if (withProof) {
          const merkleProof = merkleTree.getProof(index);
          qrCodeData["merkleProof"] = merkleProof;
        }

        return JSON.stringify(qrCodeData, stringifyBigIntValue);
      })
    );

    const response = { qrCodesData, amount: formatEther(amount) };

    res.status(200).json(response);
  } else {
    res.status(404).json({ error: "Merkle root index not found" });
  }
}

export default getQrCodes;
