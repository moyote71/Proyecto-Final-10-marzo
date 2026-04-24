import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        postalCode: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

/* =========================
   EVITAR MÚLTIPLES DEFAULT
========================= */
shippingAddressSchema.pre("save", async function (next) {
    if (this.isDefault) {
        await mongoose.model("ShippingAddress").updateMany(
            { user: this.user },
            { isDefault: false }
        );
    }
    next();
});

const ShippingAddress = mongoose.model(
    "ShippingAddress",
    shippingAddressSchema
);

export default ShippingAddress;