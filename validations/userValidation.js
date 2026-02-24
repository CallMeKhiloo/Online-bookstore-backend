const joi = require('joi');

const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  firstName: joi.string().min(3).max(15).required(),
  lastName: joi.string().min(3).max(15).required(),
  dob: joi.date().less('now'),
  role: joi.string().valid('User', 'Admin').default('User'),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const updateProfileSchema = joi
  .object({
    firstName: joi.string().min(3).max(15),
    lastName: joi.string().min(3).max(15),
    dob: joi.date().less('now'),
  })
  .min(1);

module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema,
};
