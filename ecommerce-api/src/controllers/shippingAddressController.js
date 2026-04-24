import ShippingAddress from "../models/shippingAddress.js";

/* =========================
   GET BY USER (FIXED)
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
   DEFAULT (FIXED)
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
   CREATE (FIXED)
========================= */
export async function createShippingAddress(req, res, next) {
  try {
    const newAddress = await ShippingAddress.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    next(error);
  }
}