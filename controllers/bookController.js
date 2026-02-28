const Book = require('../models/bookModel');

const getAllBooks = async (req) => {
  const { category, author, minPrice, maxPrice, search, sort = '-createdAt', page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (author) filter.author = author;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  if (search) filter.name = { $regex: search, $options: 'i' };

  // sort param: e.g. '-createdAt', 'ratingsAverage', 'name', '-name'
  const sortObj = {};
  const sortFields = sort.split(',');
  sortFields.forEach((f) => {
    if (f.startsWith('-')) sortObj[f.slice(1)] = -1;
    else sortObj[f] = 1;
  });

  const books = await Book.find(filter)
    .populate('author')
    .populate('category')
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  return books;
};

const createBook = async (req) => {
  const body = req.body;
  const newBook = await Book.create(body);
  return newBook;
};

const getBook = async (req) => {
  const book = await Book.findById(req.params.id).populate('author').populate('category');
  if (!book) throw new Error('can not find book: id is not valid');
  return book;
};

const updateBook = async (req) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!book) throw new Error('can not update book: id is not valid');
  return book;
}

const deleteBook = async (req) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) throw new Error('can not delete book: id is not valid');
  return book;
}


module.exports = {
  getAllBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook
};