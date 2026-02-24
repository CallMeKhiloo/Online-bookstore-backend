const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
    const validationError = new Error(`Validation error: ${errorMessage}`);
    return next(validationError);
  }

  req.body = value;
  //   console.log(value);
  next();
};

module.exports = validate;
