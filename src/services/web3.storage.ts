import { jsonToFilelike } from "@/utils/converters";
import { Web3Storage } from "web3.storage";

const web3StorageApiToken = process.env.WEB3_STORAGE_API_TOKEN;
let web3StorageClient: Web3Storage | null = null;

const getWeb3StorageClient = () => {
  if (!web3StorageClient && web3StorageApiToken) {
    web3StorageClient = new Web3Storage({ token: web3StorageApiToken });
  }

  if (!web3StorageClient) {
    throw new Error("No API token found");
  }

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

const uploadMerkleLeavesToWeb3Storage = async (
  merkleLeaves: string[],
  merkleRootIndex: string
): Promise<string> => {
  if (merkleLeaves.length === 0) throw new Error("No leaves found");

  const merkleRoot = merkleLeaves[0];
  const fileName = `${merkleRoot}.json`;
  const pinName = `CSH Tree [${merkleRootIndex}] 
    ${merkleRoot.slice(0, 7)}...${merkleRoot.slice(-5)}`;

  const merkleTreeCid = await uploadToWeb3Storage(
    JSON.stringify(merkleLeaves),
    fileName,
    pinName
  );

  return merkleTreeCid;
};

export { uploadMerkleLeavesToWeb3Storage };
