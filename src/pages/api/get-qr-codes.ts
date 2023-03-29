import { NextApiRequest, NextApiResponse } from "next";
import { MerkleTree } from "merkletreejs";
import { ICodesTree, CodesTree } from "@/models/codesTree";
import { bufferify } from "@/utils/bufferify";
import { generateQrCode } from "@/utils/generateQrCode";
import connectToDatabase from "@/utils/mongoose";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { merkleRootIndex, includeProof } = req.query;
  const withProof = includeProof === "true";

  if (typeof merkleRootIndex === "string") {
    await connectToDatabase();

    const codesTree: ICodesTree | null = await CodesTree.findOne({
      merkleRootIndex: Number(merkleRootIndex),
    });

    if (codesTree) {
      const merkleTree = new MerkleTree(
        codesTree.merkleLeaves.map(bufferify),
        bufferify,
        { isBitcoinTree: true }
      );
      const amount = codesTree.amount;

      const qrCodes = await Promise.all(
        codesTree.secretCodes.map(async (code, index) => {
          const data: any = {
            merkleRootIndex,
            secretCode: code,
            amount,
          };

          if (withProof) {
            const merkleProof = merkleTree
              .getProof(bufferify(codesTree.merkleLeaves[index]))
              .map(({ position, data }) => ({
                position,
                data: data.toString("hex"),
              }));

            data["merkleProof"] = merkleProof;
          }

          const qrCode = await generateQrCode(JSON.stringify(data));
          return qrCode;
        })
      );

      const response = { qrCodes, amount };

      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Merkle root index not found" });
    }
  } else {
    res.status(400).json({
      error: "Invalid request parameters: merkleRootIndex must be a string",
    });
  }
}

export default handler;
