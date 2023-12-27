/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js";
// eslint-disable-next-line no-unused-vars
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to validate an email address
function isValidEmail(email) {
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

// registerUser controller
const registerController = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Details is required");
  }

  // validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }

  const existingUser = await User.findOne({ email, username });
  if (existingUser) {
    throw new ApiError(409, "user with email or username is already exist ");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { createdUser }, "User Create successfully"));
 
     res.redirect("/profile");
});

 const loginController = asyncHandler(async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation on email and password
    if (!(username || email) || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide either username or email along with the password.",
      });
    }
 console.log(email);
 console.log(password);
    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    let existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is not registered",
      });
    }

    // Verify password & generate a JWT token
    const isPasswordValid = await existingUser.isPasswordCorrect(password);


    if (isPasswordValid) {
      const payload = {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });

      existingUser = existingUser.toObject();
      existingUser.token = token;
      existingUser.password = undefined;

      const options = {
        expires: new Date(Date.now() + 50 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, // Set to true if your application is served over HTTPS
        sameSite: "Strict", // Adjust based on your needs
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        existingUser,
        message: "User is logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid password",
      });
    }

     res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "User cannot be login, please try again later",
    });
  }
});

export { registerController, loginController };
