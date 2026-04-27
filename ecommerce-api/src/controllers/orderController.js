import Order from "../models/order.js";
import Product from "../models/product.js";

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.productId")
      .populate("shippingAddress")
      .populate("paymentMethod")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ORDER BY ID
========================= */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.productId")
      .populate("shippingAddress")
      .populate("paymentMethod");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET MY ORDERS (USER LOGGED IN)
========================= */
export const getOrdersByUser = async (req, res, next) => {
  try {
    // 🔥 FIX: evitar acceso sin token
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user.userId })
      .populate("products.productId")
      .populate("shippingAddress")
      .populate("paymentMethod")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, paymentMethod, shippingCost = 0 } =
      req.body;

    if (!products?.length) {
      return res.status(422).json({ message: "Cart is empty" });
    }

    const items = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
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
      user: req.user.userId,
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

/* =========================
   UPDATE ORDER STATUS (ADMIN)
========================= */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE PAYMENT STATUS
========================= */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

/* =========================
   CANCEL ORDER
========================= */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel order" });
    }

    // restaurar stock
    await Promise.all(
      order.products.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        })
      )
    );

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE ORDER
========================= */
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};