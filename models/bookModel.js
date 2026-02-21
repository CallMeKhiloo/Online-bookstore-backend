const mongoose = require('mongoose');
// const Category = require('./categoryModel');
// const Author = require('./authorModel');


const bookSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [5, 'minimum number of character for book name is 5'],
    maxLength: [20, 'maximum number of character for book name is 20'],
    required: true,
    unique: true,
    index :true
},
  cover: {
    type: String,
    required: true
},
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Book price must be a positive number greater than 0']
},
  stock: {
    type: Number,
    required: true,
    min: [1, 'Stock must be at least 1'],
    validate: {
        validator: Number.isInteger,
        message: 'is not a valid integer. Stock cannot have decimals.'
    },
    default: 1
},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
    index: true
},
  catefory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
}
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;