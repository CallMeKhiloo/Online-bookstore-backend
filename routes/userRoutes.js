const express = require('express');
const { userController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect, restrictTo } = require('../middlewares/auth');
const {
  signupSchema,
  loginSchema,
  updateProfileSchema,
} = require('../validations/userValidation');
const validate = require('../middlewares/validation');

const router = express.Router();

router.post('/signup', validate(signupSchema), async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.createUser(req));

  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    data: user,
  });
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  const [error, token] = await asyncWrapper(userController.login(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    token,
  });
});

router.patch(
  '/profile',
  protect,
  validate(updateProfileSchema),
  async (req, res, next) => {
    const [error, updatedUser] = await asyncWrapper(
      userController.updateMe(req),
    );

    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      data: updatedUser,
    });
  },
);

module.exports = router;
