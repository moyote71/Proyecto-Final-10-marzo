import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            quantity: {
                type: Nummber,
                required: true,
                min: 1
            },
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 