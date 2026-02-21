const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minLength: [5, 'minimum number of character for author name is 5'],
    maxLength: [20, 'maximum number of character for author name is 20']
  },
  bio: {
    type: String,
    // min: [5, 'maximum number of character is 5'],
    maxLength: [50, 'maximum number of character for bio is 50']    
  }
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;