/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("🔵 Login request received");
  console.log("📝 Username:", username);
  console.log("🔍 Searching for user...");

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ User found:", {
      id: user._id,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    });

    // Check if user is active
    if (user.isActive === false) {
      console.log("🚫 User is blocked");
      return res.status(403).json({ error: "User is blocked" });
    }

    console.log("🔐 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ Password matched!");
    console.log("🎫 Generating token...");

    const token = generateToken(user);

    console.log("✅ Token generated successfully");
    console.log("📤 Sending response...");

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    console.log("✅ Login successful for user:", user.username);
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});
