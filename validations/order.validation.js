const Joi = require('joi');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Schema for a user placing a new order
const createOrderSchema = Joi.object({
  // If your checkout flow sends items directly (instead of pulling from the Cart database),
  // we validate the book ID and quantity here. Notice we DO NOT validate price here!
  items: Joi.array()
    .items(
      Joi.object({
        book: Joi.string().pattern(objectIdRegex).required().messages({
          'string.pattern.base': 'Invalid Book ID format.',
          'any.required': 'Book ID is required.',
        }),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .optional(),

  shippingDetails: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),

  paymentMethod: Joi.string()
    .valid('Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer')
    .required()
    .messages({
      'any.only': 'Invalid payment method selected.',
    }),

  // Explicitly forbid the client from sending these fields.
  user: Joi.forbidden(),
  orderStatus: Joi.forbidden(),
  paymentStatus: Joi.forbidden(),
  totalAmount: Joi.forbidden(),
});

// Schema for an Admin updating the status of an order
const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string().valid(
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ),
  paymentStatus: Joi.string().valid(
    'Pending',
    'Completed',
    'Failed',
    'Refunded',
  ),
})
  .min(1)
  .messages({
    'object.min':
      'You must provide either orderStatus or paymentStatus to update.',
  });

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
