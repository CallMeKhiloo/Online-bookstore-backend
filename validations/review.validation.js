const Joi = require('joi');

// Regex for MongoDB ObjectId validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Schema for creating a new review
const createReviewSchema = Joi.object({
  book: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'Invalid Book ID format.',
    'any.required': 'Book ID is required to leave a review.',
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number.',
    'number.integer': 'Rating must be a whole number.',
    'number.min': 'Rating must be at least 1 star.',
    'number.max': 'Rating cannot exceed 5 stars.',
    'any.required': 'Rating is required.',
  }),

  comment: Joi.string().min(10).max(500).optional().messages({
    'string.min': 'Comment must be at least 10 characters long.',
    'string.max': 'Comment cannot exceed 500 characters.',
  }),

  // The user ID must come from the auth token in the controller.
  user: Joi.forbidden().messages({
    'any.unknown': 'You cannot manually set the user ID for a review.',
  }),
});

// Schema for updating an existing review
const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).messages({
    'number.base': 'Rating must be a number.',
    'number.integer': 'Rating must be a whole number.',
    'number.min': 'Rating must be at least 1 star.',
    'number.max': 'Rating cannot exceed 5 stars.',
  }),

  comment: Joi.string().min(10).max(500).messages({
    'string.min': 'Comment must be at least 10 characters long.',
    'string.max': 'Comment cannot exceed 500 characters.',
  }),

  // You cannot change which book the review belongs to,
  book: Joi.forbidden(),
  user: Joi.forbidden(),
})
  .min(1)
  .messages({
    'object.min':
      'You must provide either a new rating or a new comment to update.',
  });

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
