import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    adhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhaar number"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
      admin.password =await bcrypt.hash(admin.password, salt);

    return next();
  } catch (error) {

    return next(error);
  }
});
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const Admin = mongoose.model("Admin", adminSchema);
