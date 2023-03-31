import { Document } from "mongoose";

export interface ICodesTree extends Document {
  merkleRoot: string;
  merkleRootIndex: number;
  amount: string;
  merkleDump: string;
  secretCodes: string[];
}
