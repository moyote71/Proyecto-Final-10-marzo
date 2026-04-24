import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
    unique: true,
    index: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  imageURL: {
    type: String,
    trim: true,
    default: "https://placehold.co/800x600.png",
  },

  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

// AUTO SLUG
categorySchema.pre("save", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

export default mongoose.model("Category", categorySchema);