import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

/* ---------------- CONFIG ---------------- */
const app = express();
const PORT = process.env.PORT || 4000;

/* ---------------- TRUST PROXY ---------------- */
app.set("trust proxy", 1);

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://spice-drama-admin.vercel.app",
  "https://spice-drama.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

/* ---------------- BODY PARSERS ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- DB CONNECTION ---------------- */
connectDB();

/* ---------------- ROUTES ---------------- */
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "dashboard-backend",
    time: new Date().toISOString(),
  });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
