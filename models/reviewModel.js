const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
    comment: {
      type: String,
      minLength: [10, 'Comment must be at least 10 characters'],
      maxLength: [500, 'Comment cannot exceed 500 characters'],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole number between 1 and 5',
      },
    },
  },
  { timestamps: true },
);

// --- Average CALCULATOR (Aggregation Pipeline) ---
reviewSchema.statics.calcAverageRatings = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }, // Step 1: Find all reviews for THIS specific book
    },
    {
      $group: {
        _id: '$book', // Step 2: Group them all together
        nRating: { $sum: 1 }, // Step 3: Add 1 for every review found (Quantity)
        avgRating: { $avg: '$rating' }, // Step 4: Mathematically average the 'rating' field
      },
    },
  ]);

  // Save the calculated math directly into the Book model
  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // If the last review was deleted, reset the book to 0
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// --- Mongoose Middleware
// Fires AFTER a brand new review is created
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.book);
});

// Fires AFTER a review is updated or deleted
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.book);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
