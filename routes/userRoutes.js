const express = require('express');
const { userController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect, restrictTo } = require('../middlewares/auth');

// Import from auth.validation.js
const {
  registerValidation,
  loginValidation,
  updateProfileSchema,
} = require('../validations/auth.validation');

// Import the generic validate middleware
const validate = require('../middlewares/validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/signup', validate(registerValidation), async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.createUser(req));

  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    data: user,
  });
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login and get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *           example:
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful — returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       500:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: unsuccessful
 *               message: User name or password is not correct
 */

router.post('/login', validate(loginValidation), async (req, res, next) => {
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
