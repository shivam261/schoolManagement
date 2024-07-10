import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
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
    fees: {
      type: Number,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
    },
    availableCapacity: {
      type: Number,
    },
    students: [
      {
        children: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Class = mongoose.model("Class", classSchema);

export { Class };
