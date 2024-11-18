const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const cloudinary = require("../config/cloudinaryConfig"); // Import Cloudinary configuration

const prisma = new PrismaClient();

// Validation schema for user registration
const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(50).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(10).max(255).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
    address: Joi.string().max(255).required(),
    phoneNumber: Joi.string().max(15).required(),
    photoUrl: Joi.string().max(1024).optional(),
  });
  return schema.validate(data);
};

// Validation schema for user login
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required(),
  });
  return schema.validate(data);
};

// Validation schema for user update
const validateUpdate = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(50).optional(),
    email: Joi.string().email().max(255).optional(),
    password: Joi.string().min(10).max(255).optional(),
    address: Joi.string().max(255).optional(),
    phoneNumber: Joi.string().max(15).optional(),
    photoUrl: Joi.string().max(1024).optional(),
  });
  return schema.validate(data);
};

// Create a new user
const createNewUser = async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { username, email, password, address, phoneNumber, photoUrl } =
      req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).send("Email already in use");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        photoUrl: photoUrl || "",
        userType: "CUSTOMER",
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, userType: newUser.userType },
      "your_secret_key",
      { expiresIn: "7h" }
    );

    res.status(201).send({ user: newUser, token });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).send("Username already in use");
    }
    console.error("Error creating user:", err);
    res.status(500).send("Server error");
  }
};
// Login a user
const loginUser = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({
        status: "error",
        code: "VALIDATION_ERROR",
        message: error.details[0].message,
      });

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({
        status: "error",
        code: "INVALID_CREDENTIALS",
        message: "Email or password is incorrect",
      });

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        status: "error",
        code: "ACCOUNT_BANNED",
        message:
          "Your account has been banned. Please contact support for assistance.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        code: "INVALID_CREDENTIALS",
        message: "Email or password is incorrect",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      "your_secret_key",
      { expiresIn: "7h" }
    );

    res.status(200).json({
      status: "success",
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({
      status: "error",
      code: "SERVER_ERROR",
      message: "An error occurred while processing your request",
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        phoneNumber: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Server error");
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userId = req.params.userId;
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    if (updateData.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: updateData.email,
          NOT: { id: parseInt(userId) },
        },
      });
      if (existingUser) return res.status(400).send("Email already in use");
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        phoneNumber: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).send("Username already in use");
    }
    if (err.code === "P2025") {
      return res.status(404).send("User not found");
    }
    console.error("Error updating user:", err);
    res.status(500).send("Server error");
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await prisma.user.delete({ where: { id: parseInt(userId) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).send("User not found");
    }
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profile_photos", // Optional: Set a folder for user photos
    });

    // Retrieve Cloudinary URL
    const photoUrl = result.secure_url;

    const userId = req.params.userId;

    // Update the user's profile with the new photo URL
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { photoUrl },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        phoneNumber: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return the updated user profile with the new photo URL
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });

    // Optionally, remove the local file after upload to Cloudinary
    const fs = require("fs");
    fs.unlinkSync(req.file.path); // Delete the local file
  } catch (err) {
    console.error("Error updating profile photo:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

module.exports = {
  createNewUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  updateProfilePhoto,
};
