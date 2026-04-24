import Order from "../models/order.js";
import Product from "../models/product.js";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { products, shippingAddress, paymentMethod, shippingCost = 0 } =
      req.body;

    if (!products || products.length === 0) {
      return res.status(422).json({ message: "Cart is empty" });
    }

    const items = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      items.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const subtotal = items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      products: items,
      shippingAddress,
      paymentMethod,
      shippingCost,
      totalPrice: subtotal + shippingCost,
      status: "pending",
      paymentStatus: "pending",
    });

    const populated = await order.populate([
      "products.productId",
      "shippingAddress",
      "paymentMethod",
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};