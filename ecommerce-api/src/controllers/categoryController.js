  import Category from "../models/category.js";

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  /* ========================= */
  export async function getCategories(req, res, next) {
    try {
      const categories = await Category.find()
        .populate("parentCategory")
        .sort({ name: 1 });

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  /* ========================= */
  export async function getCategoryById(req, res, next) {
    try {
      const category = await Category.findById(req.params.id).populate(
        "parentCategory"
      );

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  /* ========================= */
  export async function createCategory(req, res, next) {
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
  }

  /* ========================= */
  export async function updateCategory(req, res, next) {
    try {
      const { name, description, parentCategory, imageURL } = req.body;
      const idCategory = req.params.id;

      const updateData = {};

      if (name !== undefined) {
        updateData.name = name;
        updateData.slug = slugify(name);
      }

      if (description !== undefined) updateData.description = description;
      if (parentCategory !== undefined)
        updateData.parentCategory = parentCategory;
      if (imageURL !== undefined) updateData.imageURL = imageURL;

      const updatedCategory = await Category.findByIdAndUpdate(
        idCategory,
        updateData,
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  /* ========================= */
  export async function deleteCategory(req, res, next) {
    try {
      const deleted = await Category.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /* ========================= */
  export async function searchCategory(req, res, next) {
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
  }