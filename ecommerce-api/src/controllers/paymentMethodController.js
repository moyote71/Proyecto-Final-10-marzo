import PaymentMethod from "../models/paymentMethod.js";

/* =========================
   GET METHODS BY USER
========================= */
export const getPaymentMethodsByUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const methods = await PaymentMethod.find({ user: userId });

    res.json(methods);
  } catch (error) {
    next(error);
  }
};


export const deactivatePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET DEFAULT
========================= */
export const getDefaultPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const method = await PaymentMethod.findOne({
      user: userId,
      isDefault: true,
    });

    res.json(method || null);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL (ADMIN)
========================= */
export const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find().populate("user");
    res.json(methods);
  } catch (error) {
    next(error);
  }
};

/* =========================
   CREATE
========================= */
export const createPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const newMethod = await PaymentMethod.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json(newMethod);
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE
========================= */
export const updatePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
export const deletePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentMethod.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* =========================
   SET DEFAULT
========================= */
export const setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await PaymentMethod.updateMany(
      { user: userId },
      { isDefault: false }
    );

    const updated = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

