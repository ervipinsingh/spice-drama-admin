import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { hasRole } from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ================= USER =================
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

// ================= ADMIN =================
orderRouter.get("/list", hasRole("super_admin", "admin"), listOrders);
orderRouter.post("/status", hasRole("super_admin", "admin"), updateStatus);

export default orderRouter;
