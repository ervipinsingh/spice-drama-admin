import express from "express";
import multer from "multer";
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

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

// GET SINGLE FOOD (FOR EDIT)
foodRouter.get("/single/:id", getSingleFood);

// UPDATE FOOD (EDIT MODE)
foodRouter.put("/update/:id", upload.single("image"), updateFood);

export default foodRouter;
