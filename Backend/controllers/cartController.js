import userModel from "../models/userModel.js";

/* ---------------- ADD TO CART ---------------- */
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({
        success: false,
        message: "userId and itemId are required",
      });
    }

    const userData = await userModel.findById(userId);

    // 🔥 USER NOT FOUND SAFETY
    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log("ADD TO CART ERROR 👉", error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

/* ---------------- REMOVE FROM CART ---------------- */
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({
        success: false,
        message: "userId and itemId are required",
      });
    }

    const userData = await userModel.findById(userId);

    // 🔥 USER NOT FOUND SAFETY
    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log("REMOVE CART ERROR 👉", error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

/* ---------------- GET CART ---------------- */
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: true,
        cartData: {}, // guest user safe
      });
    }

    const userData = await userModel.findById(userId);

    // 🔥 USER NOT FOUND SAFETY
    if (!userData) {
      return res.json({
        success: true,
        cartData: {},
      });
    }

    res.json({
      success: true,
      cartData: userData.cartData || {},
    });
  } catch (error) {
    console.log("GET CART ERROR 👉", error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
