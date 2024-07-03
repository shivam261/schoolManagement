import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Optionally, you can add more fields such as code, credits, etc.
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Subject = mongoose.model("Subject", subjectSchema);

export { Subject };
