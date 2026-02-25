const Joi = require('joi');

const createAuthorSchema = Joi.object({
  name: Joi.string().min(5).max(20).required(),
  bio: Joi.string().max(50).allow('').optional(),
});

const updateAuthorSchema = Joi.object({
  name: Joi.string().min(5).max(20),
  bio: Joi.string().max(50).allow(''),
}).min(1);

module.exports = {
  createAuthorSchema,
  updateAuthorSchema,
};
