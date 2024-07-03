// Import necessary modules and Student model
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";

// Auth middleware for students
const authStudent = async (req, res, next) => {
  try {
    // Assuming you have a way to identify the authenticated user, e.g., from JWT token
    const userId = req.user.id; // Assuming user id is stored in req.user from authentication middleware

    // Find student by userId
    const student = await Student.findOne({ userId });
    if (!student) {
      // If not a student, throw an error or handle as needed
      throw new ApiError(401, "User is not authorized as a student");
    }

    // If the user is a student, add student object to req
    req.student = student;
    next();
  } catch (error) {
    next(error); // Pass any caught errors to the error handling middleware
  }
};

export { authStudent };
