import PaymentMethod from "../models/paymentMethod.js";

export const getPaymentMethodsByUser = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find({
      user: req.user.userId,
    });

    res.json(methods);
  } catch (error) {
    next(error);
  }
};

export const getDefaultPaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.findOne({
      user: req.user.userId,
      isDefault: true,
    });

    res.json(method || null);
  } catch (error) {
    next(error);
  }
};

export const createPaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json(method);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(method);
  } catch (error) {
    next(error);
  }
};

export const deletePaymentMethod = async (req, res, next) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};