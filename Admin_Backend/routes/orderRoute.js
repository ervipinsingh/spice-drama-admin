import express from "express";
import { isAuthenticated, hasRole } from "../middleware/auth.js"; // Use Admin auth
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ADMIN ROUTES - For admin panel to manage orders

// List all orders - Any authenticated admin can view
orderRouter.get("/list", isAuthenticated, listOrders);

// Update order status - Only super_admin and admin can update
orderRouter.post("/status", hasRole("super_admin", "admin"), updateStatus);

// CUSTOMER ROUTES - Keep these if needed for customer app
// (These might not be needed in Admin_Backend, only in main Backend)
// orderRouter.post("/place", authMiddleware, placeOrder);
// orderRouter.post("/userorders", authMiddleware, userOrders);

export default orderRouter;
