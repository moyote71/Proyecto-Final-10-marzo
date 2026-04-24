const router = express.Router();

router.get("/", authMiddleware, isAdmin, getPaymentMethods);

router.get("/default", authMiddleware, getDefaultPaymentMethod);

router.get("/me", authMiddleware, getPaymentMethodsByUser);

router.get("/:id", authMiddleware, [mongoIdValidation("id")], validate, getPaymentMethodById);

router.post("/", authMiddleware, validate, createPaymentMethod);

router.patch("/:id/set-default", authMiddleware, validate, setDefaultPaymentMethod);

router.patch("/:id/deactivate", authMiddleware, validate, deactivatePaymentMethod);

router.put("/:id", authMiddleware, validate, updatePaymentMethod);

router.delete("/:id", authMiddleware, validate, deletePaymentMethod);

export default router;