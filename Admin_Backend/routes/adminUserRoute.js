import express from "express";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import {
  listUsers,
  deleteUser,
  getUserDetails,
  banUser,
  unbanUser,
} from "../controllers/adminUserController.js";

const adminUserRouter = express.Router();

// List all users - Any authenticated admin can view
adminUserRouter.get("/list", listUsers);

// Get single user details
adminUserRouter.get("/details/:id", getUserDetails);

// Delete user - Only super_admin can delete
adminUserRouter.delete("/delete/:id", hasRole("super_admin"), deleteUser);

// Ban/Unban user - super_admin and admin can ban
adminUserRouter.post("/ban/:id", hasRole("super_admin", "admin"), banUser);
adminUserRouter.post("/unban/:id", hasRole("super_admin", "admin"), unbanUser);

export default adminUserRouter;
