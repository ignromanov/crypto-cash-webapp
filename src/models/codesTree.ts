import mongoose, { Schema, Document } from "mongoose";

export interface ICodesTree extends Document {
  merkleRoot: string;
  merkleRootIndex: number;
  merkleLeaves: string[];
  codes: Array<{
    secretCode: string;
    amount: number;
  }>;
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
  merkleLeaves: [
    {
      type: String,
      required: true,
    },
  ],
  codes: [
    {
      secretCode: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

CodesTreeSchema.index({ merkleRootIndex: 1, "codes.secretCode": 1 });

export const CodesTree =
  mongoose.models.CodesTree ||
  mongoose.model<ICodesTree>("CodesTree", CodesTreeSchema);
