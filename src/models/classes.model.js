import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    classCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // Reference to the Teacher model
      required: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject", // Reference to the Subject model
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Class = mongoose.model("Class", classSchema);

export { Class };
