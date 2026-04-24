import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res, next) {
  try {
    const userId = req.user.userId;

    const { products, shippingAddress, paymentMethod, shippingCost = 0 } =
      req.body;

    if (!products || products.length === 0) {
      return res.status(422).json({ message: "Cart empty" });
    }

    const populatedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: "Not enough stock",
        });
      }

      populatedProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const subtotal = populatedProducts.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      products: populatedProducts,
      shippingAddress,
      paymentMethod,
      shippingCost,
      totalPrice: subtotal + shippingCost,
      status: "pending",
      paymentStatus: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export {
  createOrder,
};