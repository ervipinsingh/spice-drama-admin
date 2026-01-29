import foodModel from "../models/foodModel.js";

/* ================= ADD FOOD ================= */
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

    // CLOUDINARY IMAGE URL
    const imageUrl = req.file ? req.file.path : "";

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: imageUrl, // ✅ SAVE FULL URL
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

    // ❌ No fs.unlink (Cloudinary handles storage)
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

    // If new image uploaded → replace URL
    if (req.file) {
      food.image = req.file.path; // ✅ Cloudinary URL
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
