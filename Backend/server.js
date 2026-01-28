import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 10000;

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* TRUST PROXY */
app.set("trust proxy", 1);

/* CORS */
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
  }),
);

/* BODY PARSERS */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* DB */
connectDB();

/* ROUTES */
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/* HEALTH */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* GLOBAL ERROR */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

/* SERVER */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
