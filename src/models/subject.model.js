import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Subject = mongoose.model("Subject", subjectSchema);

export { Subject };
