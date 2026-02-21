const express = require('express');
const { userController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.createUser(req));

  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    data: user,
  });
});

router.post('/login', async (req, res, next) => {
  const [error, token] = await asyncWrapper(userController.login(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    token,
  });
});

module.exports = router;
