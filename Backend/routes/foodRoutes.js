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

/* ---------------- MULTER + CLOUDINARY CONFIG ---------------- */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "food-items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ---------------- ROUTES ---------------- */

// ADD FOOD (admin & super_admin)
foodRouter.post(
  "/add",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  upload.single("image"),
  addFood,
);

// LIST FOOD (any authenticated admin)
foodRouter.get("/list", isAuthenticated, listFood);

// REMOVE FOOD (admin & super_admin)
foodRouter.post(
  "/remove",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  removeFood,
);

// GET SINGLE FOOD (for edit)
foodRouter.get("/single/:id", isAuthenticated, getSingleFood);

// UPDATE FOOD (admin & super_admin)
foodRouter.put(
  "/update/:id",
  isAuthenticated,
  hasRole("super_admin", "admin"),
  upload.single("image"),
  updateFood,
);

export default foodRouter;
