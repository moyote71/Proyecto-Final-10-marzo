import WishList from "../models/wishList.js";

/* =========================
   GET WISHLIST
========================= */
export const getMyWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;

    let wishlist = await WishList.findOne({ user: userId })
      .populate("products.product");

    if (!wishlist) {
      wishlist = await WishList.create({
        user: userId,
        products: [],
      });
    }

    res.json(wishlist.products);
  } catch (error) {
    console.error("WISHLIST GET ERROR:", error);
    next(error);
  }
};

/* =========================
   ADD PRODUCT
========================= */
export const addToWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { productId } = req.body;

    let wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await WishList.create({
        user: userId,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (p) => p.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ message: "Ya existe en wishlist" });
    }

    wishlist.products.push({ product: productId });

    await wishlist.save();

    const populated = await WishList.findOne({ user: userId })
      .populate("products.product");

    res.status(201).json(populated.products);
  } catch (error) {
    console.error("WISHLIST ADD ERROR:", error);
    next(error);
  }
};

/* =========================
   REMOVE PRODUCT
========================= */
export const removeFromWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { productId } = req.params;

    const wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist no encontrada" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );

    await wishlist.save();

    res.json(wishlist.products);
  } catch (error) {
    console.error("WISHLIST REMOVE ERROR:", error);
    next(error);
  }
};