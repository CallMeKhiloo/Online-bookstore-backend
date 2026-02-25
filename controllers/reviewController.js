const Review = require('../models/reviewModel');

// Create a Review
const createReview = async (req) => {
  // Extract the user ID from the authentication token (attached by the `protect` middleware)
  const userId = req.user._id;

  // Check if this user has already reviewed this before  or not
  const existingReview = await Review.findOne({
    user: userId,
    book: req.body.book,
  });

  if (existingReview) {
    throw new Error(
      'You have already reviewed this book. Please update your existing review instead.',
    );
  }

  const reviewData = {
    ...req.body,
    user: userId,
  };

  const newReview = await Review.create(reviewData);
  return newReview;
};

// Get All Reviews
const getAllReviews = async (req) => {
  const filter = {};
  if (req.query.book) {
    filter.book = req.query.book;
  }

  const reviews = await Review.find(filter).populate(
    'user',
    'firstName lastName',
  );
  return reviews;
};

// Get a Single Review
const getReview = async (req) => {
  const review = await Review.findById(req.params.id).populate(
    'user',
    'firstName lastName',
  );

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};

// Update a Review (Security Check Required)
const updateReview = async (req) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new Error('Review not found');
  }

  // SECURITY FIREWALL: Ensure the logged-in user actually owns this review.
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'Admin'
  ) {
    throw new Error('You do not have permission to edit this review.');
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }, // Returns the newly updated document
  );

  return updatedReview;
};

// Delete a Review
const deleteReview = async (req) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new Error('Review not found');
  }

  // SECURITY FIREWALL: Same check as the update controller
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'Admin'
  ) {
    throw new Error('You do not have permission to delete this review.');
  }

  await Review.findByIdAndDelete(req.params.id);
  return null;
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
};
