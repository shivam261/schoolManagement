// Import necessary modules and models
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/ApiError.js";

// Middleware for teacher authentication
const authTeacher = async (req, res, next) => {
  try {
    // Assuming you have a way to identify the authenticated user, e.g., from JWT token
    const userId = req.user.id; // Assuming user id is stored in req.user from authentication middleware

    // Check if the user is a teacher
    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      // If not a teacher, throw an error or handle as needed
      throw new ApiError(401, "User is not authorized as a teacher");
    }

    // If the user is a teacher, add teacher object to req
    req.teacher = teacher;
    next();
  } catch (error) {
    next(error); // Pass any caught errors to the error handling middleware
  }
};

export { authTeacher };
