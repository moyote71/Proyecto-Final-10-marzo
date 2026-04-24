import Order from "../models/order.js";
import Product from "../models/product.js";

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
async function getOrders(req, res, next) {
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
}

/* =========================
   GET ORDER BY ID
========================= */
async function getOrderById(req, res, next) {
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
}

/* =========================
   GET MY ORDERS (USER)
========================= */
async function getOrdersByUser(req, res, next) {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId })
      .populate("products.productId")
      .populate("shippingAddress")
      .populate("paymentMethod")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

/* =========================
   CREATE ORDER (FIXED)
========================= */
async function createOrder(req, res, next) {
  try {
    const user = req.user.userId;

    const {
      products,
      shippingAddress,
      paymentMethod,
      shippingCost = 0,
    } = req.body;

    // 🔥 VALIDACIÓN SIMPLE (evita 422)
    if (!products?.length) {
      return res.status(422).json({ message: "No products" });
    }

    const stockChecks = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          return { error: "Product not found" };
        }

        if (product.stock < item.quantity) {
          return { error: "Insufficient stock" };
        }

        return { product };
      })
    );

    const errors = stockChecks.filter((e) => e.error);

    if (errors.length) {
      return res.status(400).json({ message: "Stock error", errors });
    }

    const normalizedProducts = stockChecks.map((item, i) => ({
      productId: item.product._id,
      quantity: products[i].quantity,
      price: item.product.price,
    }));

    const subtotal = normalizedProducts.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      user,
      products: normalizedProducts,
      shippingAddress,
      paymentMethod,
      shippingCost,
      totalPrice: subtotal + shippingCost,
      status: "pending",
      paymentStatus: "pending",
    });

    const populated = await order.populate([
      "products.productId",
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
}

/* =========================
   UPDATE ORDER
========================= */
async function updateOrder(req, res, next) {
  try {
    const allowed = ["status", "paymentStatus", "shippingCost"];
    const update = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    )
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
}

/* =========================
   CANCEL ORDER
========================= */
async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        message: "Order cannot be cancelled",
      });
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
    order.paymentStatus =
      order.paymentStatus === "paid" ? "refunded" : "failed";

    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
}

/* =========================
   STATUS UPDATES
========================= */
async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
}

/* =========================
   DELETE ORDER
========================= */
async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "cancelled") {
      return res.status(400).json({
        message: "Only cancelled orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};