// teacherModel.mjs
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const classSchema = new Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // Reference to the Subject model
    required: true,
  },
  toClass: {
    type: Schema.Types.ObjectId,
    ref: "Grade",
    required: true,
  },
});

const teacherSchema = new Schema(
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
    adhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhaar number"],
    },
    salary: {
      type: Number,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    classesTaught: [classSchema],
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

teacherSchema.pre("save", async function (next) {
  const teacher = this;
  if (!teacher.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(teacher.password, salt);
    teacher.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to check if the password is correct
teacherSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
teacherSchema.methods.generateAccessToken = function () {
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
teacherSchema.methods.generateRefreshToken = function () {
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

export const Teacher = mongoose.model("Teacher", teacherSchema);
