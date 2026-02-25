const Joi = require('joi');

// Custom regex to strictly validate MongoDB ObjectIds
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base':
      'Invalid ID format. Must be a valid MongoDB ObjectId.',
  });

const createBookSchema = Joi.object({
  name: Joi.string().min(5).max(20).required(),
  cover: Joi.string().required(),
  price: Joi.number().min(0.01).required(),

  // Stock is optional in the request because your DB has a default: 1.
  stock: Joi.number().integer().min(1).optional(),

  author: objectIdSchema.required(),
  category: objectIdSchema.required(),
});

const updateBookSchema = Joi.object({
  name: Joi.string().min(5).max(20),
  cover: Joi.string(),
  price: Joi.number().min(0.01),
  stock: Joi.number().integer().min(1),
  author: objectIdSchema,
  category: objectIdSchema,
}).min(1); // Ensures the user sends at least ONE field to update

module.exports = {
  createBookSchema,
  updateBookSchema,
};
