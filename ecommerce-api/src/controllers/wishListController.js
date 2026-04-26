import WishList from "../models/wishList.js";

/* =========================
   GET USER WISHLIST
========================= */
export const getMyWishList = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    let wishlist = await WishList.findOne({ user: userId })
      .populate("products.product");

    if (!wishlist) {
      wishlist = await WishList.create({
        user: userId,
        products: [],
      });
    }

    return res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

/* =========================
   ADD PRODUCT
========================= */
export const addToWishList = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!productId) {
      return res.status(400).json({ message: "productId requerido" });
    }

    let wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await WishList.create({
        user: userId,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (p) => p?.product?.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Producto ya en wishlist" });
    }

    wishlist.products.push({ product: productId });

    await wishlist.save();

    const populated = await WishList.findOne({ user: userId })
      .populate("products.product");

    return res.status(201).json(populated.products);
  } catch (error) {
    next(error);
  }
};

/* =========================
   REMOVE PRODUCT
========================= */
export const removeFromWishList = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    let wishlist = await WishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p?.product?.toString() !== productId
    );

    await wishlist.save();

    return res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};