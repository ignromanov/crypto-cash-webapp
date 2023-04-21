import pinataSDK, { PinataPinOptions } from "@pinata/sdk";
import { ICodesTree } from "@/models/CodesTreeModel.types";

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_API_SECRET = process.env.PINATA_API_SECRET || "";

let pinata: pinataSDK | null = null;

async function connectToPinata(): Promise<pinataSDK> {
  if (pinata) {
    return pinata;
  }

  pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);
  await pinata.testAuthentication();

  return pinata;
}

async function pinMerkleTreeToIPFS(
  codesTreeToInsert: Partial<ICodesTree>
): Promise<string> {
  // connect to Pinata
  const pinata = await connectToPinata();

  const { merkleRoot, merkleRootIndex, merkleDump } = codesTreeToInsert;
  const pinName =
    "CSH Tree [" +
    merkleRootIndex +
    "] " +
    merkleRoot?.substring(0, 7) +
    "..." +
    merkleRoot?.substring(merkleRoot.length - 5);

  const options: PinataPinOptions = {
    pinataMetadata: {
      name: pinName,
      merkleRoot: merkleRoot || "",
      merkleRootIndex: merkleRootIndex || "",
    },
    pinataOptions: {
      cidVersion: 1,
      wrapWithDirectory: true,
    },
  };

  // pin MerkleDump to IPFS
  const result = await pinata.pinJSONToIPFS(
    JSON.parse(merkleDump || ""),
    options
  );
  return result.IpfsHash;
}

export { connectToPinata, pinMerkleTreeToIPFS as pinMerkleTreeToPinata };
