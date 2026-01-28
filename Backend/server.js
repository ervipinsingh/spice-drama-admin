import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4000;

/* ---------------- TRUST PROXY (RENDER) ---------------- */
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
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- DB ---------------- */
connectDB();

/* ---------------- STATIC ---------------- */
app.use("/images", express.static("uploads"));

/* ---------------- ROUTES ---------------- */
// 🔓 TEMP PUBLIC (for testing)
// ⚠️ JWT lagne ke baad protect karna
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "dashboard-backend" });
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Dashboard backend running on port ${PORT}`);
});
