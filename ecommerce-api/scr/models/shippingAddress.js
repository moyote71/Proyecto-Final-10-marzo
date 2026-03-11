import mongoose from 'mongoose';

const shippigAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
        min: 4,
        max: 6,
    },
});

const shippigAddress = mongoose.model('shippigAddress', shippigAddressSchema);

module.exports = shippigAddress; 