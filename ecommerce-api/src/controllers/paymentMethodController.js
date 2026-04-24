import PaymentMethod from "../models/paymentMethod.js";

/* =========================
   GET USER PAYMENT METHODS
========================= */
export async function getPaymentMethodsByUser(req, res, next) {
  try {
    const userId = req.user.userId;

    const methods = await PaymentMethod.find({ user: userId });

    res.json(methods);
  } catch (error) {
    next(error);
  }
}

/* =========================
   GET DEFAULT
========================= */
export async function getDefaultPaymentMethod(req, res, next) {
  try {
    const method = await PaymentMethod.findOne({
      user: req.user.userId,
      isDefault: true,
    });

    res.json(method || null);
  } catch (error) {
    next(error);
  }
}

/* =========================
   CREATE
========================= */
export async function createPaymentMethod(req, res, next) {
  try {
    const method = await PaymentMethod.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json(method);
  } catch (error) {
    next(error);
  }
}

/* =========================
   UPDATE
========================= */
export async function updatePaymentMethod(req, res, next) {
  try {
    const updated = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

/* =========================
   DELETE
========================= */
export async function deletePaymentMethod(req, res, next) {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
}

/* =========================
   EXPORTS LIMPIOS
========================= */
export {
  getPaymentMethodsByUser,
  getDefaultPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};