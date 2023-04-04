import type { NextApiRequest, NextApiResponse } from "next";
import CodesTreeModel from "@/models/CodesTreeModel";
import { ICodesTree } from "@/models/CodesTreeModel.types";
import { generateMerkleTree } from "@/utils/merkleTree";
import {
  generateSecretCodes,
  getMessageToSign,
  verifySignature,
} from "@/utils/secretCodes";
import connectToDatabase from "@/utils/mongoose";
import { ethers, JsonRpcProvider, parseEther } from "ethers";
import {
  codesFactoryContractAddress,
  codesFactoryContractAbi,
  CodesFactoryContractType,
} from "@/contracts/codesFactory";
import { stringifyBigIntValue } from "@/utils/convertCodeData";
import {
  ApiGenerateCodesResponseData,
  GenerateCodesRequestBody,
} from "@/components/modules/GenerateCodes";

function getCodesFactoryContract() {
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY || "",
    provider
  );

  const codesFactoryContractWrite = new ethers.BaseContract(
    codesFactoryContractAddress,
    codesFactoryContractAbi,
    signer
  ) as unknown as CodesFactoryContractType;

  return codesFactoryContractWrite;
}

async function generateCodes(
  req: NextApiRequest,
  res: NextApiResponse<ApiGenerateCodesResponseData>
) {
  await connectToDatabase();

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const {
    amount: amountStr,
    numberOfCodes,
    signature,
    timestamp,
  } = req.body as GenerateCodesRequestBody;

  // Check if the request has all the required fields
  if (!amountStr || !numberOfCodes || !signature || !timestamp) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  // Check if the timestamp is recent (e.g., within the last 5 minutes)
  const currentTime = Date.now();
  if (currentTime - timestamp > 5 * 60 * 1000) {
    res.status(400).json({ message: "Timestamp is too old." });
    return;
  }

  // Create the message to verify
  const amount = parseEther(amountStr);
  const message = getMessageToSign(amount, numberOfCodes, timestamp);

  // Verify the signature
  const isValid = await verifySignature(message, signature);

  if (!isValid) {
    res.status(403).json({ message: "Invalid signature." });
    return;
  }

  // Generate secret codes and Merkle tree
  const secretCodes = generateSecretCodes(parseInt(numberOfCodes));
  const merkleTree = generateMerkleTree(secretCodes, amount);
  const merkleDump = JSON.stringify(merkleTree.dump(), stringifyBigIntValue);

  // Store secret codes and associated data in MongoDB
  const codesTreeToInsert: Partial<ICodesTree> = {
    merkleRoot: merkleTree.root,
    amount: amountStr,
    merkleDump,
    secretCodes,
  };

  try {
    // Call the addMerkleRoot function from the CodesFactory contract
    const codesFactoryContractWrite = getCodesFactoryContract();
    const addMerkleRootTx = await codesFactoryContractWrite.addMerkleRoot(
      merkleTree.root,
      numberOfCodes,
      amount
    );
    const txReceipt = await addMerkleRootTx.wait();

    if (txReceipt.status !== 1) {
      res
        .status(500)
        .json({ message: "Failed to add Merkle root to the contract." });
      return;
    }

    // Get the Merkle tree index from the transaction event
    // TODO: waiting for ethers v6 supporting
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    codesTreeToInsert.merkleRootIndex = Number(txReceipt.logs[1].args[0]);

    // Save the Merkle tree root and codes in the database
    const insertedCodesTree = await CodesTreeModel.create(codesTreeToInsert);
    res
      .status(201)
      .json({ merkleRootIndex: insertedCodesTree.merkleRootIndex });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error storing secret codes tree in database." });
  }
}

export default generateCodes;
