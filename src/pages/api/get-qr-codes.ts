import { NextApiRequest, NextApiResponse } from "next";
import { MerkleTree } from "merkletreejs";
import { ICodesTree, CodesTree } from "@/models/codesTree";
import { bufferify } from "@/utils/bufferify";
import { generateQrCode } from "@/utils/generateQrCode";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { merkleRootIndex, includeProof } = req.query;
  const withProof = includeProof === "true";

  if (typeof merkleRootIndex === "string") {
    const codesTree: ICodesTree | null = await CodesTree.findOne({
      merkleRootIndex,
    });

    if (codesTree) {
      const merkleTree = new MerkleTree(
        codesTree.merkleLeaves.map(bufferify),
        bufferify,
        { isBitcoinTree: true }
      );

      const qrCodes = await Promise.all(
        codesTree.codes.map(async (code, index) => {
          const data: any = {
            merkleRootIndex,
            secretCode: code.secretCode,
            amount: code.amount,
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

      res.status(200).json(qrCodes);
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
