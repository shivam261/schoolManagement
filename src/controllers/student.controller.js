import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.model.js";
const generateAccessAndRefreshTokens = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};
const registerStudent = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    grade,
    email,

    adhaarNumber,
    address,
    guardianName,
    guardianContact,
    password,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !grade ||
    !email ||
    !adhaarNumber ||
    !address ||
    !address.street ||
    !address.city ||
    !address.state ||
    !address.zipCode ||
    !guardianName ||
    !guardianContact ||
    !password
  ) {
    throw new ApiError(400, " some fields are missing in register student ");
  }

  const existedStudent = await Student.findOne({ adhaarNumber });
  if (existedStudent) {
    throw new ApiError(409, " student already exist in database ");
  }
  const student = await Student.create({
    firstName,
    lastName,
    dateOfBirth,
    grade,
    email,

    adhaarNumber,
    address,
    guardianName,
    guardianContact,
    password,
  });

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(401, " could not save student  ");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdStudent, "student created successfully"));
});
const removeStudent = asyncHandler(async (req, res) => {
  const { adhaarNumber, email } = req.body;

  if (!adhaarNumber || !email) {
    throw new ApiError(
      400,
      "Adhaar number and email are required to remove a student"
    );
  }

  const student = await Student.findOne({ adhaarNumber, email });
  if (!student) {
    throw new ApiError(
      404,
      "Student not found with the provided Adhaar number and email"
    );
  }

  await Student.deleteOne({ _id: student._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Student removed successfully"));
});
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-password -refreshToken");

  if (!students || students.length === 0) {
    throw new ApiError(404, "No students found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const {  currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(
      400,
      "Email, current password, and new password are required"
    );
  }

  const student = await Student.findById(req.student._id);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const isMatch = await student.isPasswordCorrect(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }
  student.password = newPassword;
  await student.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});
const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!email || !password) {
    throw new ApiError(404, null, " fields are missing ");
  }
  const isValidPassword = await student.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, null, "incorrect password");
  }
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    student._id
  );
  const loggedInStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInStudent, " you are logged in "));
});
const logoutStudent = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(
    req.student._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, " student logged out"));
});
export {
  registerStudent,
  removeStudent,
  getAllStudents,
  changePassword,
  loginStudent,
  logoutStudent,
};
