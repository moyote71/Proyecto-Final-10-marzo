import ShippingAddress from "../models/shippingAddress.js";

/* =========================
   GET ALL USER ADDRESSES
========================= */
export const getShippingAddresses = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const addresses = await ShippingAddress.find({ user: userId });

        res.json(addresses);
    } catch (error) {
        next(error);
    }
};

/* =========================
   GET DEFAULT ADDRESS
========================= */
export const getDefaultShippingAddress = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const address = await ShippingAddress.findOne({
            user: userId,
            isDefault: true,
        });

        if (!address) {
            return res.status(404).json({ message: "No default address" });
        }

        res.json(address);
    } catch (error) {
        next(error);
    }
};

/* =========================
   CREATE ADDRESS
========================= */
export const createShippingAddress = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const newAddress = await ShippingAddress.create({
            ...req.body,
            user: userId,
        });

        res.status(201).json(newAddress);
    } catch (error) {
        next(error);
    }
};

/* =========================
   UPDATE ADDRESS
========================= */
export const updateShippingAddress = async (req, res, next) => {
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

        /* Si se marca como default */
        if (req.body.isDefault) {
            await ShippingAddress.updateMany(
                {
                    user: updated.user,
                    _id: { $ne: updated._id },
                },
                { isDefault: false }
            );
        }

        res.json(updated);
    } catch (error) {
        next(error);
    }
};

/* =========================
   DELETE ADDRESS
========================= */
export const deleteShippingAddress = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await ShippingAddress.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address deleted" });
    } catch (error) {
        next(error);
    }
};