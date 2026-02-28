const Author = require('../models/authorModel');
const Book = require('../models/bookModel');
const customError = require('../helpers/customError');

const getAllAuthors = async (req) => {
  const authors = await Author.find();
  return authors;
};

const createAuthor = async (req) => {
  const body = req.body;
  const newAuthor = await Author.create(body);
  return newAuthor;
};

const getAuthor = async (req) => {
  const author = await Author.findById(req.params.id);
  if (!author) throw new customError('can not find author: id is not valid', 404);
  return author;
};

const getBooksByAuthor = async (req) => {
  const author = await Author.findById(req.params.id);
  if (!author) throw new customError('can not find author to show his books: id is not valid', 404);
  const books = await Book.find({author: req.params.id}).populate('author').populate('category');
  return books;
}

const updateAuthor = async (req) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
  if (!author) throw new customError('can not update author: id is not valid', 404);
  return author;
}

const deleteAuthor = async (req) => {
  const author = await Author.findById(req.params.id);
  if (!author) throw new customError('can not delete author: id is not valid', 404);
  
  const booksNo = await Book.countDocuments({author: req.params.id});
  if (booksNo > 0) throw new customError('can not delete this author, it has books assigned to it', 400);
  await Author.findByIdAndDelete(req.params.id);
  return author;
}


module.exports = {
  getAllAuthors,
  createAuthor,
  getAuthor,
  getBooksByAuthor,
  updateAuthor,
  deleteAuthor
};