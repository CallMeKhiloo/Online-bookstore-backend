const Joi = require('joi');

// Schema for User Registration
const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),

  passwordConfirm: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match.',
  }),

  firstName: Joi.string().min(3).max(15).required(),

  lastName: Joi.string().min(3).max(15).required(),

  DOB: Joi.date().iso().less('now').optional(),

  // SECURITY: We explicitly forbid 'role' during normal registration.
  // The database will naturally fall back to the default ('User').
  role: Joi.forbidden().messages({
    'any.unknown': 'You are not allowed to set the role field.',
  }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerValidation,
  loginValidation,
};
