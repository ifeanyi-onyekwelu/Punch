import { isValid } from "date-fns";
import mongoose, { Schema } from "mongoose";

interface IToken {
  user: mongoose.Schema.Types.ObjectId;
  token: number;
  isValid: boolean;
}

const tokenSchema = new Schema<IToken>(
  {
    user: mongoose.Schema.Types.ObjectId,
    token: String,
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IToken>("Token", tokenSchema);
