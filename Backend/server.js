import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
// const port = 4000;
const PORT = process.env.PORT || 4000; // port for live host on render

// middleware
app.use(express.json());
app.use(cors());

// Db Connection
connectDB();

// api endpoint
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

// for render live host
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
