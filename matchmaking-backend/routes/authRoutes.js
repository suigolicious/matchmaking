router.post("/profile", upload.single("profileImage"), async (req, res) => {
  const { name, age, gender } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Update user profile
      user.name = name;
      user.age = age;
      user.gender = gender;
      if (profileImage) {
          user.profileImage = profileImage;
      }
      user.profileComplete = true;
      await user.save();

      res.json({ message: "Profile updated successfully" });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});
