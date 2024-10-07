import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";

configDotenv();

const createAccount = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required! Check once again.",
      });
    }

    const isUserExisted = await User.findOne({ email });
    if (isUserExisted) {
      return res.status(400).json({
        success: false,
        message: "The user already exists.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "The password could not be hashed.",
      });
    }

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate the access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN,{
      expiresIn: "72h", // You can adjust the expiry time
    });

    // Return success response along with the token
    return res.status(200).json({
      accessToken, // Include the token in the response
      user,
      success: true,
      message: "User is created (Signed Up).",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "SignUp failed.",
    });
  }
};

// if you send the token in the create Account then you don't need to do login for the user seperately
// but i will  send the token when the user is logged in

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Check if the password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT payload
    const payload = {
      email: user.email,
      id: user._id,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "72h", // Token expires in 72 hours
    });

    // Convert user to object and remove sensitive fields
    user = user.toObject();
    delete user.password; // Remove password from user object before sending it
    user.token = token; // Add token to user object

    return res.status(200).json({
      success: true,
      token, // Send token in the response
      message: "Login successful",
      user, // Optionally return user details (without sensitive data)
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed due to server error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    // Assuming req.user contains the decoded token
    const { id } = req.user;
    console.log('User from token:', req.user);

    // Fetch user by their ID
    const user = await User.findById(id);

    // Check if user was found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        _id: user._id,
      },
      success: true,
      message: "User found",
    });
  } catch (error) {
    console.error("Error finding user:", error.message);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Error retrieving user",
    });
  }
};

export { createAccount, loginController, getUser };
