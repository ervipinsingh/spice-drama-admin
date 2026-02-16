import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

/* ---------------- DB ---------------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: [
      "https://spicedrama.com",
      "https://www.spicedrama.com",
      "https://spicedrama.com/admin",
      "https://spice-drama-admin.vercel.app",
    ],
    credentials: true,
  }),
);


/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Admin backend running on port ${PORT}`));
