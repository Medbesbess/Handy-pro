const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/authorizeUser");
const upload = require("../middleware/uploadMiddleware"); // Import upload middleware

const {
  createNewUser,
  loginUser,
  updateUser,
  getUserProfile,
  deleteUser,
  updateProfilePhoto,
} = require("../controllers/userController");

// Public routes
router.post("/create", createNewUser);
router.post("/login", loginUser);

// Protected routes
router.put("/update/:userId", authorizeUser, updateUser);
router.get("/profile/:userId", authorizeUser, getUserProfile);
router.post(
  "/profile/photo/:userId",
  authorizeUser,
  upload.single("photo"),
  updateProfilePhoto
);

router.delete("/delete/:userId", authorizeUser, deleteUser);

module.exports = router;
