/* eslint-disable no-undef */
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extract jwt token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json(new ApiError(400, "Token is missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to the request object
    req.existingUser = decoded;

    next();
  } catch (error) {
    // Pass the error to the error-handling middleware
    next(new ApiError(401, "Invalid Access Token"));
  }
});


export default verifyJWT