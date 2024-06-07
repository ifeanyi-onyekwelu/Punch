import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImageUrl: string;
  referralCode: string;
  referralLink: string;
  refreshToken: string;
  active: boolean;
  deleted: boolean;
  role: number[];
}

/**
 * Roles and meaning
 * 5501 -> User
 * 2219 -> Admin
 * 7689 -> Staff
 */
const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    profileImageUrl: String,
    referralCode: String,
    referralLink: String,
    refreshToken: String,
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    role: [{ type: Number, default: 5051 }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

export default mongoose.model<IUser>("User", userSchema);
