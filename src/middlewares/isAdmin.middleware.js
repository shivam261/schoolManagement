import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Admin} from "../models/admin.model.js";
const isAdmin = asyncHandler(async ( req, res, next) => {
    try{
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "unauthorized request");
        }
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "no decoded token");
        }

        const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");
        if (!admin) {
            throw new ApiError(401, "admin not found ");
        }
        req.admin = admin;
        next();
    }catch (error){
        next(error);
    }

});
export  {isAdmin};
