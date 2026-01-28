import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import {
  addFood,
  listFood,
  removeFood,
  getSingleFood,
  updateFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

/* ---------------- ENSURE UPLOADS FOLDER EXISTS ---------------- */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("uploads folder created");
}

/* ---------------- MULTER CONFIG ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
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
