const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [5, 'minimum number of character for category name is 5'],
    maxLength: [20, 'maximum number of character for category name is 20'],
    unique: true
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;  