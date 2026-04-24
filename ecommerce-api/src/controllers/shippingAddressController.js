import ShippingAddress from "../models/shippingAddress.js";

/* =========================
   GET ALL (ADMIN)
========================= */
export async function getShippingAddresses(req, res, next) {
    try {
        const addresses = await ShippingAddress.find().populate("user");
        res.json(addresses);
    } catch (error) {
        next(error);
    }
}

/* =========================
   GET BY USER
========================= */
export async function getShippingAddressesByUser(req, res, next) {
    try {
        const userId = req.user.userId;

        const addresses = await ShippingAddress.find({ user: userId });

        res.json(addresses);
    } catch (error) {
        next(error);
    }
}

/* =========================
   DEFAULT ADDRESS
========================= */
export async function getDefaultShippingAddress(req, res, next) {
    try {
        const userId = req.user.userId;

        const address = await ShippingAddress.findOne({
            user: userId,
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
        const userId = req.user.userId;

        const newAddress = await ShippingAddress.create({
            ...req.body,
            user: userId,
        });

        res.status(201).json(newAddress);
    } catch (error) {
        next(error);
    }
}

/* =========================
   UPDATE
========================= */
export async function updateShippingAddress(req, res, next) {
    try {
        const { id } = req.params;

        const updated = await ShippingAddress.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Address not found" });
        }

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
        const { id } = req.params;

        const deleted = await ShippingAddress.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        next(error);
    }
}