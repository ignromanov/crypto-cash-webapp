import { ICodesTree } from "@/models/CodesTreeModel.types";
import { jsonToFilelike } from "@/utils/converters";
import { Web3Storage } from "web3.storage";

const web3StorageApiToken = process.env.WEB3_STORAGE_API_TOKEN;
let web3StorageClient: Web3Storage | null = null;

const getWeb3StorageClient = () => {
  if (web3StorageClient) {
    return web3StorageClient;
  }

  if (!web3StorageApiToken) {
    throw new Error("No API token found");
  }

  web3StorageClient = new Web3Storage({ token: web3StorageApiToken });
  return web3StorageClient;
};

const uploadToWeb3Storage = async (
  stringifiedJson: string,
  fileName: string,
  pinName: string
): Promise<string> => {
  const client = getWeb3StorageClient();

  const files = [jsonToFilelike({ data: stringifiedJson, name: fileName })];
  const cid = await client.put(files, {
    wrapWithDirectory: false,
    name: pinName,
  });
  return cid;
};

const uploadMerkleTreeToWeb3Storage = async (
  codesTreeToInsert: Partial<ICodesTree>
): Promise<string> => {
  const { merkleRoot, merkleRootIndex, merkleDump } = codesTreeToInsert;
  const fileName = merkleRoot + ".json";
  const pinName =
    "CSH Tree [" +
    merkleRootIndex +
    "] " +
    merkleRoot?.substring(0, 7) +
    "..." +
    merkleRoot?.substring(merkleRoot.length - 5);

  const merkleTreeCid = await uploadToWeb3Storage(
    merkleDump || "",
    fileName,
    pinName
  );

  return merkleTreeCid;
};

export { uploadMerkleTreeToWeb3Storage };
