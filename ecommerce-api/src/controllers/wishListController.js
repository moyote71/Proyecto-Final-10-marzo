import WishList from "../models/wishList.js";

/* =========================
   GET
========================= */
export const getMyWishList = async (req, res, next) => {
  try {
    let wishlist = await WishList.findOne({ user: req.user.id })
      .populate("products.product");

    if (!wishlist) {
      wishlist = await WishList.create({
        user: req.user.id,
        products: [],
      });
    }

    res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

/* =========================
   ADD
========================= */
export const addToWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId requerido" });
    }

    let wishlist = await WishList.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await WishList.create({
        user: req.user.id,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (p) => p.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ message: "Ya está en wishlist" });
    }

    wishlist.products.push({ product: productId });

    await wishlist.save();

    const updated = await WishList.findOne({ user: req.user.id })
      .populate("products.product");

    res.status(201).json(updated.products);
  } catch (error) {
    console.log("WISHLIST ERROR:", error);
    next(error);
  }
};

/* =========================
   REMOVE
========================= */
export const removeFromWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await WishList.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist no existe" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );

    await wishlist.save();

    const updated = await WishList.findOne({ user: req.user.id })
      .populate("products.product");

    res.json(updated.products);
  } catch (error) {
    next(error);
  }
};