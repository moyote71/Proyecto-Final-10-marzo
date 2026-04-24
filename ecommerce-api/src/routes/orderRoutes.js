const router = express.Router();

/* ADMIN */
router.get("/", authMiddleware, isAdmin, getOrders);

/* USER */
router.get("/me", authMiddleware, (req, res, next) => {
  req.params.userId = req.user.userId;
  next();
}, getOrdersByUser);

/* GET BY ID */
router.get("/:id", authMiddleware, [mongoIdValidation("id")], validate, getOrderById);

/* CREATE */
router.post(
  "/",
  authMiddleware,
  [
    bodyMongoIdValidation("shippingAddress"),
    bodyMongoIdValidation("paymentMethod"),
    shippingCostValidation(),
  ],
  validate,
  createOrder
);

/* CANCEL */
router.patch("/:id/cancel", authMiddleware, isAdmin, validate, cancelOrder);

/* STATUS */
router.patch("/:id/status", authMiddleware, isAdmin, validate, updateOrderStatus);

/* PAYMENT STATUS */
router.patch("/:id/payment-status", authMiddleware, isAdmin, validate, updatePaymentStatus);

/* UPDATE */
router.put("/:id", authMiddleware, isAdmin, validate, updateOrder);

/* DELETE */
router.delete("/:id", authMiddleware, isAdmin, validate, deleteOrder);

export default router;