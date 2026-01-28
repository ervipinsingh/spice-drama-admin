import foodModel from "../models/foodModel.js";
import fs from "fs";

// ADD FOOD (already working)
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // BASIC VALIDATION
    if (!name || !price || !category) {
      return res.json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    // SAFE IMAGE HANDLING
    const image_filename = req.file ? req.file.filename : "";

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: image_filename,
    });

    await food.save();

    res.json({
      success: true,
      message: "Food added successfully",
    });
  } catch (error) {
    console.error("ADD FOOD ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding food",
    });
  }
};

// LIST FOOD
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// REMOVE FOOD
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    // remove image
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// GET SINGLE FOOD (FOR EDIT)
const getSingleFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food" });
  }
};

// UPDATE FOOD (EDIT MODE)
const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // If new image uploaded → delete old image
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      food.image = req.file.filename;
    }

    // Update fields
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
