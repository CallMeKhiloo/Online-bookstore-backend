const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
}); // No .min(1) needed here since there is only one field anyway

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
