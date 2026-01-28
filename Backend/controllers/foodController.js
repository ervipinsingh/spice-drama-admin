import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

/* ---------------- ADD FOOD ---------------- */
const addFood = async (req, res) => {
  try {
    console.log("🔥 ADD FOOD API HIT");
    console.log("📦 req.file =", req.file); // 🔥 MAIN DEBUG

    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    if (!req.file) {
      return res.json({
        success: false,
        message: "Image is required",
      });
    }

    console.log("🌐 IMAGE PATH =", req.file.path); // 🔥 SHOULD BE CLOUDINARY URL

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: req.file.path, // ✅ CLOUDINARY URL
    });

    await food.save();

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

/* ---------------- LIST FOOD ---------------- */
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

/* ---------------- REMOVE FOOD ---------------- */
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (food.image) {
      const publicId = food.image.split("/").pop().split(".")[0];
      console.log("🗑️ Deleting Cloudinary image:", publicId);
      await cloudinary.uploader.destroy(`food-items/${publicId}`);
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

/* ---------------- GET SINGLE FOOD ---------------- */
const getSingleFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food" });
  }
};

/* ---------------- UPDATE FOOD ---------------- */
const updateFood = async (req, res) => {
  try {
    console.log("🔥 UPDATE FOOD API HIT");
    console.log("📦 req.file =", req.file); // 🔥 DEBUG

    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (req.file) {
      if (food.image) {
        const publicId = food.image.split("/").pop().split(".")[0];
        console.log("🗑️ Deleting old image:", publicId);
        await cloudinary.uploader.destroy(`food-items/${publicId}`);
      }
      console.log("🌐 NEW IMAGE PATH =", req.file.path);
      food.image = req.file.path;
    }

    food.name = req.body.name ?? food.name;
    food.description = req.body.description ?? food.description;
    food.category = req.body.category ?? food.category;
    food.price = req.body.price ?? food.price;

    await food.save();

    res.json({
      success: true,
      message: "Food updated successfully",
      data: food,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, getSingleFood, updateFood };
