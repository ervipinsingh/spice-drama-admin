import express from "express";
import multer from "multer";
import { isAuthenticated, hasRole } from "../middleware/auth.js"; // Import your auth middleware
import {
  addFood,
  listFood,
  removeFood,
  getSingleFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

// Image store engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes - Protected with authentication

// Add Food - Only super_admin and admin can add
foodRouter.post(
  "/add",
  hasRole("super_admin", "admin"),
  upload.single("image"),
  addFood,
);

// List Food - Any authenticated admin can view
foodRouter.get("/list", isAuthenticated, listFood);

// Remove Food - Only super_admin and admin can remove
foodRouter.post("/remove", hasRole("super_admin", "admin"), removeFood);

// Get Single Food - Any authenticated admin can view (for edit form)
foodRouter.get("/single/:id", isAuthenticated, getSingleFood);

// Update Food - Only super_admin and admin can update
foodRouter.put(
  "/update/:id",
  hasRole("super_admin", "admin"),
  upload.single("image"),
  updateFood,
);

export default foodRouter;
