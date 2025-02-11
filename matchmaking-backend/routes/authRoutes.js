const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error("Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed."), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Route: Check if phone number exists & create a new user if not
router.post("/check-phone", async (req, res) => {
  console.log("Received request to /check-phone"); // Debugging log

  const { phone } = req.body;
  console.log("Phone received:", phone); // Debugging log

  try {
      if (!phone) {
          console.error("❌ Phone number is missing in the request");
          return res.status(400).json({ error: "Phone number is required" });
      }

      let user = await User.findOne({ phone });
      console.log("User found:", user); // Debugging log

      if (user) {
          // User exists → Generate JWT token
          const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

          return res.json({
              exists: true,
              profileComplete: user.profileComplete,
              token,
          });
      } else {
          // Create a new user if not found
          console.log("Creating new user...");
          const newUser = new User({ phone, profileComplete: false });
          await newUser.save();
          console.log("New user created:", newUser);

          // Ensure the user was created successfully before issuing a JWT
          if (!newUser || !newUser._id) {
              console.error("❌ Failed to create a new user.");
              return res.status(500).json({ error: "Failed to create new user" });
          }

          // Generate JWT token for the new user
          const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "7d" });

          return res.json({
              exists: false,
              profileComplete: false,
              token,
          });
      }
  } catch (error) {
      console.error("❌ Error in /check-phone:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
});


// Profile Update Route
router.post("/profile", upload.single("profileImage"), async (req, res) => {
  const { name, age, gender } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      let user = await User.findById(decoded.id);

      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      // Validate required fields
      if (!name || !age || !gender || !profileImage) {
          return res.status(400).json({ error: "All fields, including profile picture, are required." });
      }

      // Update user profile
      user.name = name;
      user.age = age;
      user.gender = gender;
      user.profileImage = profileImage;
      user.profileComplete = true;
      await user.save();

      res.json({ message: "Profile updated successfully." });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;

