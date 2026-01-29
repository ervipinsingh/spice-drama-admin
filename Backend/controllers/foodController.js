import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ================= CLOUDINARY UPLOAD HELPER ================= */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "food-items" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* ================= ADD FOOD ================= */
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // 🔥 upload image to cloudinary
    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    const food = await foodModel.create({
      name,
      description,
      price,
      category,
      image: uploadedImage.secure_url, // ✅ FULL URL
    });

    res.json({
      success: true,
      message: "Food added successfully",
      data: food,
    });
  } catch (error) {
    console.error("ADD FOOD ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding food",
    });
  }
};

/* ================= LIST FOOD ================= */
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

/* ================= REMOVE FOOD ================= */
const removeFood = async (req, res) => {
  try {
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

/* ================= GET SINGLE FOOD ================= */
const getSingleFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food" });
  }
};

/* ================= UPDATE FOOD ================= */
const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // upload new image if provided
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      food.image = uploadedImage.secure_url;
    }

    food.name = req.body.name;
    food.description = req.body.description;
    food.category = req.body.category;
    food.price = req.body.price;

    await food.save();

    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, getSingleFood, updateFood };
