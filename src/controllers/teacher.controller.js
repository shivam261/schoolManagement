import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";

const generateAccessAndRefreshTokens = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, "Student not found");
    }

    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    teacher.refreshToken = refreshToken;
    await teacher.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};
const registerTeacher = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    adhaarNumber,
    salary,
    address,
    classesTaught,
    qualification,
    experience,
    password,
    mobileNumber,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !email ||
    !adhaarNumber ||
    !salary ||
    !address ||
    !address.street ||
    !address.city ||
    !address.state ||
    !address.zipCode ||
    !qualification ||
    !experience ||
    !password ||
    !mobileNumber
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  const existingTeacher = await Teacher.findOne({ email });
  if (existingTeacher) {
    throw new ApiError(409, "Teacher already exists (email)");
  }

  const teacher = await Teacher.create({
    firstName,
    lastName,
    dateOfBirth,
    email,
    adhaarNumber,
    salary,
    address,
    qualification,
    experience,
    password,
    mobileNumber,
  });

  const createdTeacher = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );

  if (!createdTeacher) {
    throw new ApiError(500, "Failed to register teacher");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdTeacher, "teacher created"));
});
const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find().select("-password -refreshToken");

  if (!teachers || teachers.length === 0) {
    throw new ApiError(404, "No teachers found");
  }

  res.status(200).json({
    success: true,
    data: teachers,
    message: "Teachers retrieved successfully",
  });
});
const removeTeacher = asyncHandler(async (req, res) => {
  const { adhaarNumber, email } = req.body;
  if (!adhaarNumber || !email) {
    throw new ApiError(400, null, " missing fields");
  }
  const teacher = await Teacher.findOneAndDelete({ adhaarNumber, email });
  if (!teacher) {
    throw new ApiError(404, null, "Teacher not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, teacher, " teacher deleted successfully"));
});
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword ) {
    throw new ApiError(400, null, "missing fields");
  }
  const teacher = await Teacher.findById(req.teacher._id);
  const isValidPassword = await teacher.isPasswordCorrect(currentPassword);
  if (!isValidPassword) {
    throw new ApiError(401, null, "incorrect password");
  }
  teacher.password = newPassword;
  await teacher.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "password changed successfully"));
});
const loginTeacher = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });

  if (!email || !password) {
    throw new ApiError(404, null, "Fields are missing");
  }

  if (!teacher) {
    throw new ApiError(404, null, "Teacher not found");
  }

  const isValidPassword = await teacher.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, null, "Incorrect password");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    teacher._id
  );

  const loggedInTeacher = await Teacher.findById(teacher._id).select(
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
    .json(new ApiResponse(200, loggedInTeacher, "You are logged in"));
});
const logoutTeacher = asyncHandler(async (req, res) => {
  await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      $unset: { refreshToken: 1 },
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
    .json(new ApiResponse(200, null, " teacher logged out"));
});
export {
  registerTeacher,
  getAllTeachers,
  removeTeacher,
  changePassword,
  loginTeacher,
  logoutTeacher,
};
