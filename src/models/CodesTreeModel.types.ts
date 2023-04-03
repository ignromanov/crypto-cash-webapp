import { Document } from "mongoose";

export interface ICodesTree extends Document {
  merkleRoot: string;
  merkleRootIndex: string;
  amount: string;
  merkleDump: string;
  secretCodes: string[];
}
