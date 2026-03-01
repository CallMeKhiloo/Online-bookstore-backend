const Category = require('../models/categoryModel');
const Book = require('../models/bookModel');
const customError = require('../helpers/customError');

const getAllCategories = async (req) => {
  const categories = await Category.find();
  return categories;
};

const createCategory = async (req) => {
  const body = req.body;
  const newCategory = await Category.create(body);
  return newCategory;
};

const getCategory = async (req) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new customError('can not find category: id is not valid', 404);
  return category;
};

const getBooksByCategory = async (req) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new customError('can not find category to show its books: id is not valid', 404);
  const books = await Book.find({category: req.params.id}).populate('author').populate('category');
  return books;
}

const updateCategory = async (req) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
  if (!category) throw new customError('can not update category: id is not valid', 404);
  return category;
}

const deleteCategory = async (req) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new customError('can not delete category: id is not valid', 404);

  const booksNo = await Book.countDocuments({category: req.params.id});
  if (booksNo > 0) throw new customError('can not delete this category, it has books assigned to it', 400);

  await Category.findByIdAndDelete(req.params.id);
  return category;
}


module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  getBooksByCategory,
  updateCategory,
  deleteCategory
};