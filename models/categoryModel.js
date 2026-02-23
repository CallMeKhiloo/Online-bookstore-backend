const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, 'minimum number of character for category name is 3'],
    maxLength: [20, 'maximum number of character for category name is 20'],
    unique: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;  