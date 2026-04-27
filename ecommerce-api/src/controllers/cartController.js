import Cart from "../models/cart.js";
import Product from "../models/product.js";

/* =========================
   GET ALL CARTS (ADMIN)
========================= */
async function getCarts(req, res, next) {
  try {
    const carts = await Cart.find()
      .populate("user")
      .populate("products.product");

    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
}

/* =========================
   GET CART BY ID (ADMIN)
========================= */
async function getCartById(req, res, next) {
  try {
    const { id } = req.params;

    const cart = await Cart.findById(id)
      .populate("user")
      .populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

/* =========================
   GET CART BY USER (TOKEN SAFE)
========================= */
async function getCartByUser(req, res, next) {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [],
      });
    }

    return res.status(200).json({
      user: userId,
      products: cart.products || [],
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   CREATE CART
========================= */
async function createCart(req, res, next) {
  try {
    const { user, products = [] } = req.body;

    const newCart = await Cart.create({
      user,
      products,
    });

    await newCart.populate("user");
    await newCart.populate("products.product");

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
}

/* =========================
   ADD PRODUCT (TOKEN SAFE)
========================= */
async function addProductToCart(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      const index = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (index >= 0) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate("products.product");

    res.status(200).json({
      user: userId,
      products: cart.products,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   UPDATE ITEM (TOKEN SAFE)
========================= */
async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("products.product");

    res.status(200).json({
      user: userId,
      products: cart.products,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   REMOVE ITEM (TOKEN SAFE)
========================= */
async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("products.product");

    res.status(200).json({
      user: userId,
      products: cart.products,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   CLEAR CART (FIX 500 ERROR)
========================= */
async function clearCartItems(req, res, next) {
  try {
    console.log("🟡 CLEAR CART HIT");
    console.log("USER:", req.user);

    const userId = req.user?.userId;

    if (!userId) {
      console.log("❌ NO USER ID");
      return res.status(401).json({ message: "No userId in token" });
    }

    const cart = await Cart.findOne({ user: userId });

    console.log("CART FOUND:", cart);

    if (!cart) {
      return res.status(200).json({
        user: userId,
        products: [],
      });
    }

    cart.products = [];

    await cart.save();

    console.log("✅ CART CLEARED");

    return res.status(200).json({
      user: userId,
      products: [],
    });

  } catch (error) {
    console.error("🔥 CLEAR CART ERROR:", error);
    next(error);
  }
}

/* =========================
   UPDATE CART
========================= */
async function updateCart(req, res, next) {
  try {
    const { id } = req.params;
    const { user, products } = req.body;

    if (user === undefined && products === undefined) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const updateData = {};
    if (user !== undefined) updateData.user = user;
    if (products !== undefined) updateData.products = products;

    const updatedCart = await Cart.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user")
      .populate("products.product");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
}

/* =========================
   DELETE CART
========================= */
async function deleteCart(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCartItems,
};