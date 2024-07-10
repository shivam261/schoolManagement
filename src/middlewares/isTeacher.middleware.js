import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const isTeacher = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const teacher = await Teacher.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!teacher) {
      throw new ApiError(401, "User is not authorized as a teacher");
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    next(error);
  }
});

export { isTeacher };
