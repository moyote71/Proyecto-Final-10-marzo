import WishList from "../models/wishList.js";

/* =========================
   GET USER WISHLIST
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
   ADD PRODUCT
========================= */
export const addToWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;

    let wishlist = await WishList.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await WishList.create({
        user: req.user.id,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (p) => p.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Producto ya en wishlist" });
    }

    wishlist.products.push({ product: productId });

    await wishlist.save();

    const populated = await WishList.findOne({ user: req.user.id })
      .populate("products.product");

    res.status(201).json(populated.products);
  } catch (error) {
    next(error);
  }
};

/* =========================
   REMOVE PRODUCT
========================= */
export const removeFromWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await WishList.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );

    await wishlist.save();

    res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};