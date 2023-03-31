import mongoose, { Schema } from "mongoose";
import { ICodesTree } from "./CodesTreeModel.types";

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
    type: String,
    required: true,
  },
  merkleDump: {
    type: String,
    required: true,
  },
  secretCodes: [
    {
      type: String,
      required: true,
    },
  ],
});

CodesTreeSchema.index({ merkleRootIndex: 1, secretCodes: 1 });

const CodesTreeModel =
  mongoose.models.CodesTree ||
  mongoose.model<ICodesTree>("CodesTree", CodesTreeSchema);

export default CodesTreeModel;
