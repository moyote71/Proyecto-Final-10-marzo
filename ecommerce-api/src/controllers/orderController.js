import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

/* =========================
   CHECKOUT (🔥 CORE)
========================= */
export async function checkout(req, res, next) {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 🔥 VALIDAR + SNAPSHOT + STOCK
    for (const item of cart.products) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          message: "Invalid product in cart",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const subtotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.imagesUrl?.[0],
        quantity: item.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // 🔥 DESCONTAR STOCK (CRÍTICO)
    for (const item of cart.products) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 🔥 CREAR ORDEN
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    // 🔥 LIMPIAR CARRITO
    cart.products = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   GET MY ORDERS
========================= */
export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

/* =========================
   GET ORDER BY ID
========================= */
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

/* =========================
   ADMIN: UPDATE STATUS
========================= */
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      message: "Order updated",
      order,
    });
  } catch (error) {
    next(error);
  }
}