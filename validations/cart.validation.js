const Joi = require('joi');

// Regex to validate that the provided ID is a valid MongoDB ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Schema for adding an item to the cart
const addToCartSchema = Joi.object({
  book: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'Invalid Book ID format.',
    'any.required': 'Book ID is required to add an item to the cart.',
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be a valid integer.',
    'number.min': 'Quantity must be at least 1.',
    'any.required': 'Quantity is required.',
  }),
});

// Schema for updating the quantity of an existing cart item
const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be a valid integer.',
    'number.min': 'Quantity must be at least 1.',
    'any.required': 'Quantity is required to update the cart.',
  }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};
