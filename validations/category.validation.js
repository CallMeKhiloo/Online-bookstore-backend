const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
