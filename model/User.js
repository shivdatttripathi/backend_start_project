import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    passowrd: {
      type: String,
      minLengh: 8,
    },
    role: {
      enum: ["admin", "user"],
      default: user,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifcationToken: {
      type: String,
    },
    resetPassowrdToken: {
      type: String,
    },
    resetPassowrdExpire: {
      type: Date,
    },
  },
  {
    timestamps,
  }
);
const user = mongoose.model("User", UserSchema);
