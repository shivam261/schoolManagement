import mongoose, { Schema } from "mongoose";
const studentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});
const attendanceSchema = new Schema({
  grade: {
    type: Schema.Types.ObjectId,
    ref: "Grade",
    required: true,
  },

  sheet: [studentSchema],
  takenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher", // Reference to the Subject model
    required: true,
  },
},{timestamps: true});
