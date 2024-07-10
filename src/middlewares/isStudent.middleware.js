import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isStudent = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      throw new ApiError(401, "User is not authorized as a student");
    }
    req.student = student;
    next();
  } catch (error) {
    next(error);
  }
});

export { isStudent };
