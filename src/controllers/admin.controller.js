import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subject } from "../models/subject.model.js";
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
export { addSubject, removeSubject, getAllSubjects };
