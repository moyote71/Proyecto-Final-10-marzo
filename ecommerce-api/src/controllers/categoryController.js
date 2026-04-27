import Category from "../models/category.js";
import Product from "../models/product.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory")
      .sort({ name: 1 });

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory"
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: category._id });

    res.status(200).json({
      category,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory, imageURL } = req.body;

    const newCategory = new Category({
      name,
      slug: slugify(name),
      description,
      parentCategory: parentCategory || null,
      imageURL: imageURL || "https://placehold.co/800x600.png",
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory, imageURL } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }

    if (description !== undefined) updateData.description = description;
    if (parentCategory !== undefined)
      updateData.parentCategory = parentCategory;
    if (imageURL !== undefined) updateData.imageURL = imageURL;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const searchCategory = async (req, res, next) => {
  try {
    const { q, parentCategory, sort, order, page = 1, limit = 10 } =
      req.query;

    const filters = {};

    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (parentCategory) {
      filters.parentCategory = parentCategory;
    }

    const sortOptions = {};
    sortOptions[sort || "name"] = order === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const categories = await Category.find(filters)
      .populate("parentCategory")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(filters);

    res.status(200).json({
      categories,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
};