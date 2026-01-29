import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import {
  addFood,
  listFood,
  removeFood,
  getSingleFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

/* ================= MULTER + CLOUDINARY ================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "food-items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

// ADD FOOD
foodRouter.post(
  "/add",
  isAuthenticated,
  hasRole("admin", "super_admin"),
  upload.single("image"),
  addFood,
);

// LIST FOOD
foodRouter.get("/list", isAuthenticated, listFood);

// REMOVE FOOD
foodRouter.post(
  "/remove",
  isAuthenticated,
  hasRole("admin", "super_admin"),
  removeFood,
);

// GET SINGLE FOOD
foodRouter.get("/single/:id", isAuthenticated, getSingleFood);

// UPDATE FOOD
foodRouter.put(
  "/update/:id",
  isAuthenticated,
  hasRole("admin", "super_admin"),
  upload.single("image"),
  updateFood,
);

export default foodRouter;
