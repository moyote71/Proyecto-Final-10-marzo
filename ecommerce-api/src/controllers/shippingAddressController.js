import ShippingAddress from "../models/shippingAddress.js";

/* =========================
   GET USER ADDRESSES
========================= */
export async function getShippingAddresses(req, res, next) {
  try {
    const addresses = await ShippingAddress.find({
      user: req.user.userId,
    });

    res.json(addresses);
  } catch (error) {
    next(error);
  }
}

/* =========================
   DEFAULT
========================= */
export async function getDefaultShippingAddress(req, res, next) {
  try {
    const address = await ShippingAddress.findOne({
      user: req.user.userId,
      isDefault: true,
    });

    res.json(address || null);
  } catch (error) {
    next(error);
  }
}

/* =========================
   CREATE
========================= */
export async function createShippingAddress(req, res, next) {
  try {
    const address = await ShippingAddress.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
}

/* =========================
   UPDATE
========================= */
export async function updateShippingAddress(req, res, next) {
  try {
    const updated = await ShippingAddress.findByIdAndUpdate(
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
export async function deleteShippingAddress(req, res, next) {
  try {
    await ShippingAddress.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
}