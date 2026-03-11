import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema({
    user: {
        type: mmongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mmongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            addedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
});

const wishList = mongoose.model('wishList', wishListSchema);

module.exports = wishList; 
