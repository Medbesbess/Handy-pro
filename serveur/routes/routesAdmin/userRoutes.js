const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../../controllers/ControllerAdmin/userController");
const { verifyToken, adminOnly } = require("../../middleware/authMiddleware");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/admin/login", userController.login);
router.post("/admin/signup", userController.adminSignup);
router.get(
  "/admin/profile",
  verifyToken,
  adminOnly,
  userController.getAdminProfile
);
router.get(
  "/admin/notifications",
  verifyToken,
  adminOnly,
  userController.getAdminNotifications
);

router.put(
  "/admin/profile",
  verifyToken,
  adminOnly,
  upload.single("photo"),
  userController.updateAdminProfile
);

// Protected admin routes
router.get("/:role", userController.getAllUsers);
router.delete("/admin/delete-category/:id", userController.deleteCategory);
router.post("/admin/add-category", userController.createCategory);
router.put("/admin/update-category/:id", userController.updateCategory);
router.delete("/admin/delete-user/:id", userController.deleteUser);
router.put("/admin/ban-user/:id", userController.banUser);
router.put("/admin/valid-provider/:id", userController.validProvider);

module.exports = router;
