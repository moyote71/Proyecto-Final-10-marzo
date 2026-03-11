import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    immageURL: {
        type: String,
        trim: true,
        default: 'https://placehold.co/800x600.png',
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    }
});

const category = mongoose.model('Category', categorySchema);

module.exports = category; 