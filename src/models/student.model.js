// studentModel.mjs
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new Schema(
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
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    age: {
      type: Number,
    },
    grade: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    className: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    rollNumber: {
      type: String,

      sparse: true, // Allows null/undefined values
    },
    adhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhaar number"],
    },
    scholarship: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    fees: {
      type: Number,
      min: 0,
    },
    dueFees: {
      type: Number,
      default: 0,
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
    guardianName: {
      type: String,
      required: true,
    },
    guardianContact: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Virtual property to calculate age based on date of birth
/* studentSchema.virtual("age").get(function () {
  const dob = this.dateOfBirth;
  if (!dob) return null;

  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return (this.age = Math.abs(ageDate.getUTCFullYear() - 1970));
}); */

// Method to hash the password before saving
studentSchema.pre("save", async function (next) {
  const student = this;
  if (!student.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(student.password, salt);
    student.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to check if the password is correct
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
studentSchema.methods.generateAccessToken = function () {
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
studentSchema.methods.generateRefreshToken = function () {
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

export const Student = mongoose.model("Student", studentSchema);
