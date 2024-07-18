import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subject } from "../models/subject.model.js";
import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Grade } from "../models/classes.model.js";
const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};
const addSubject = asyncHandler(async (req, res) => {
  const { name, subjectCode } = req.body;
  if (!name || !subjectCode) {
    throw new ApiError(401, "some fields are missing in subject");
  }
  const existedSubject = await Subject.findOne({ subjectCode });
  if (existedSubject) {
    throw new ApiError(409, "subject already exist");
  }
  const subject = await Subject.create({
    name,
    subjectCode,
  });
  const createdSubject = await Subject.findById(subject._id);
  if (!createdSubject) {
    throw new ApiError(501, "subject was not added");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdSubject, "subject added successfully "));
});

const removeSubject = asyncHandler(async (req, res) => {
  const { subjectCode } = req.body;
  if (!subjectCode) {
    throw new ApiError(401, "subjectCode field is missing");
  }
  const subject = await Subject.findOne({ subjectCode });
  if (!subject) {
    throw new ApiError(404, "subject not found");
  }
  await Subject.deleteOne({ subjectCode });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "subject removed", "subject removed successfully")
    );
});

const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  if (!subjects) {
    throw new ApiError(404, "No subjects found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects retrieved successfully"));
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, dateOfBirth, email, password, adhaarNumber } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !email ||
    !password ||
    !adhaarNumber
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingAdmin = await Admin.findOne({
    $or: [{ email }, { adhaarNumber }],
  });
  if (existingAdmin) {
    throw new ApiError(
      409,
      "Admin with the provided email or Aadhaar number already exists"
    );
  }
  const admin = await Admin.create({
    firstName,
    lastName,
    dateOfBirth,
    email,
    password,
    adhaarNumber,
  });
  const createdAdmin = await Admin.findOne({ email }).select(
    "-password -refreshToken"
  );
  if (!createdAdmin) {
    throw new ApiError(404, "Admin with the provided email does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdAdmin, "Admin added successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(401, "Email field is required");
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(401, "Admin with the provided email does not exist");
  }
  const isValidPassword = await admin.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id
  );
  const options = {
    httponly: true,
    secure: process.env.PRODUCTION === "production",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, null, " admin logged in"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const options = {
    httponly: true,
    secure: process.env.PRODUCTION === "production",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, " admin logged out"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(401, "All fields are required");
  }

  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    throw new ApiError(401, "Admin with the provided ID does not exist");
  }

  const isValidPassword = await admin.isPasswordCorrect(currentPassword);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid current password");
  }

  admin.password = newPassword;
  await admin.save();

  // const updatedAdmin = await Admin.findById(req.admin._id).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Password changed successfully"));
});

const addClass = asyncHandler(async (req, res) => {
  const { className, classTeacher, fees, totalCapacity, students } = req.body;
  if (!students) {
    throw new ApiError(401, "students are required");
  }
  if (!className || !classTeacher || !fees || !totalCapacity) {
    throw new ApiError(401, "All fields are required");
  }
  const existedClass = await Grade.findOne({ className });
  if (existedClass) {
    throw new ApiError(401, "already exists");
  }
  const createdClass = await Grade.create({
    className,
    classTeacher,
    fees,
    totalCapacity,
    students,
  });
  if (!createdClass) {
    throw new ApiError(401, "class not created");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdClass, "Class created "));
});
const getClasses = asyncHandler(async (req, res) => {
  const classes = await Grade.find();
  if (!classes) {
    throw new ApiError(401, "no class found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, classes, "these are the clasess"));
});
const addStudentInClass = asyncHandler(async (req, res) => {
  const { studentId, gradeId } = req.body;
  if (!studentId) {
    throw new ApiError(401, "Student id is required");
  }
  if (!gradeId) {
    throw new ApiError(401, "Grade id is required");
  }
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(401, "could not find any student with this studentId");
  }

  const grade = await Grade.findById(gradeId);

  if (!grade) {
    throw new ApiError(401, "class not found");
  }
  student.className = grade._id;
  student.dueFees = grade.fees;
  await student.save();
  const existingStudent = grade.students.find(
    (existingStudentId) => existingStudentId.toString() === studentId
  );

  if (existingStudent) {
    throw new ApiError(409, "Student already exists in the grade");
  }

  grade.students.push(studentId);

  await grade.save();
  return res
    .status(200)
    .json(new ApiResponse(200, grade, "Student added successfully"));
});
const feePayment = asyncHandler(async (req, res) => {
  const { amount, adhaarNumber } = req.body;
  if (!amount || !adhaarNumber) {
    throw new ApiError(401, "feilds are missing");
  }
  if (amount <= 0) {
    throw new ApiError(401, "amount cannot be zero");
  }
  try {
    const student = await Student.findOne({ adhaarNumber }).select(
      "-password -refreshToken -address"
    );
    student.dueFees = student.dueFees - amount;
    student.fees += amount;
    await student.save({ validateBeforeSave: false });
    return res.status(201).json(new ApiResponse(201, null, "Fees Paid"));
  } catch (error) {
    throw new ApiError(500, "server side error (database)");
  }
});
const scholarship = asyncHandler(async (req, res) => {
  const { amount, studentId } = req.body;
  if (!amount || !studentId) {
    throw new ApiError(401, "feilds are missing");
  }
  if (amount <= 0) {
    throw new ApiError(401, "amount cannot be zero");
  }
  try {
    const student = await Student.findById(studentId).select(
      "-password -refreshToken -address"
    );
    student.scholarship = amount;
    student.dueFees -= amount;
    await student.save({ validateBeforeSave: false });
    return res
      .status(201)
      .json(new ApiResponse(201, null, "Scholarship provided"));
  } catch (error) {
    throw new ApiError(500, "server side error (database)");
  }
});
export {
  addSubject,
  removeSubject,
  getAllSubjects,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  changePassword,
  addClass,
  getClasses,
  addStudentInClass,
  feePayment,
  scholarship,
};
