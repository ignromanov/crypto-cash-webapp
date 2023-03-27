import mongoose, { Schema, Document } from "mongoose";

export interface ICodesTree extends Document {
  merkleRoot: string;
  merkleRootIndex: number;
  amount: number;
  merkleLeaves: string[];
  secretCodes: string[];
}

const CodesTreeSchema = new Schema({
  merkleRoot: {
    type: String,
    required: true,
  },
  merkleRootIndex: {
    type: Number,
    required: true,
    default: -1,
  },
  amount: {
    type: Number,
    required: true,
  },
  merkleLeaves: [
    {
      type: String,
      required: true,
    },
  ],
  secretCodes: [
    {
      type: String,
      required: true,
    },
  ],
});

CodesTreeSchema.index({ merkleRootIndex: 1, "codes.secretCode": 1 });

export const CodesTree =
  mongoose.models.CodesTree ||
  mongoose.model<ICodesTree>("CodesTree", CodesTreeSchema);
