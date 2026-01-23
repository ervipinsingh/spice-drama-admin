import mongoose from "mongoose";
import readline from "readline";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify question function
const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createFirstAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/admin-app",
    );

    console.log("✅ Connected to MongoDB");

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("⚠️ Admin user already exists!");
      console.log(`Username: ${adminExists.username}`);
      console.log(`Email: ${adminExists.email}`);
      rl.close();
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log("\n📝 Create First Admin User:\n");

    const username = await question("Enter admin username: ");
    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password: ");

    const admin = new User({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      role: "admin",
    });

    await admin.save();

    console.log("\n✅ First admin user created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log("\n🔐 Keep these credentials safe!");

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

createFirstAdmin();
