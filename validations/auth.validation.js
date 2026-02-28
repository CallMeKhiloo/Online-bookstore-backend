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

  dob: Joi.date().iso().less('now').optional(),

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

// Schema for Updating User Profile
const updateProfileSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address.',
  }),

  firstName: Joi.string().min(3).max(15),

  lastName: Joi.string().min(3).max(15),

  dob: Joi.date().iso().less('now'),

  // SECURITY: Prevent privilege escalation. Even if they are just updating
  // their name, we must block any sneaky attempts to change their role to 'Admin'.
  role: Joi.forbidden().messages({
    'any.unknown': 'You are not allowed to modify the role field.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'You must provide at least one field to update.',
  });

const adminUpdateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address.',
  }),

  firstName: Joi.string().min(3).max(15),

  lastName: Joi.string().min(3).max(15),

  dob: Joi.date().iso().less('now'),

  role: Joi.string().valid('User', 'Admin').messages({
    'any.only': 'Role must be either User or Admin.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'You must provide at least one field to update.',
  });

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileSchema,
  adminUpdateUserSchema,
};
