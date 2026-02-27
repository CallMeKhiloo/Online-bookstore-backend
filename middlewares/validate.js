const validate = (schema) => {
  return (req, res, next) => {
    // abortEarly: false ensures Joi checks the ENTIRE payload and returns all errors at once,
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);

      return res.status(400).json({
        success: false,
        errors: errorMessages,
      });
    }

    next();
  };
};

module.exports = validate;
