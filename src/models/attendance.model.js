import mongoose, { Schema } from "mongoose";
const studentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Subject model
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});
const attendanceSchema = new Schema({
  grade: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  sheet: [studentSchema],
  takenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher", // Reference to the Subject model
    required: true,
  },
});
