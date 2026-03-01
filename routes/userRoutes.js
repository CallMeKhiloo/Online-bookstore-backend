const express = require('express');
const { userController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  registerValidation,
  loginValidation,
  updateProfileSchema,
  adminUpdateUserSchema,
} = require('../validations/auth.validation');

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

router.get('/verify-email/:token', async (req, res, next) => {
  const [error] = await asyncWrapper(userController.verifyEmail(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    message: 'Email verified successfully.',
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

/**
 * @swagger
 * /users:
 * get:
 * summary: Get all users (Admin only)
 * tags: [Auth]
 */
router.get(
  '/',
  protect, // 1. Check if they are logged in
  restrictTo('Admin'), // 2. Check if their role is exactly 'Admin'
  async (req, res, next) => {
    const [error, users] = await asyncWrapper(userController.getAllUsers(req));

    if (error) return next(error);

    res.status(200).json({
      status: 'successful',
      results: users.length, // Helpful for debugging
      data: users,
    });
  },
);

router.delete('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error] = await asyncWrapper(userController.deleteUser(req));
  if (error) return next(error);
  res.status(204).json({ status: 'successful', data: null });
});

router.patch('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.updateUser(req));
  if (error) return next(error);
  res.status(200).json({ status: 'successful', data: user });
});

/**
 * @swagger
 * /users/admin/create:
 *   post:
 *     summary: Admin creates a new user (can set role)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/admin/create',
  protect,
  restrictTo('Admin'),
  async (req, res, next) => {
    const [error, user] = await asyncWrapper(userController.createUser(req));
    if (error) return next(error);
    res.status(201).json({
      status: 'successful',
      data: user,
    });
  },
);

router.get('/profile', protect, async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.getMe(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data: user,
  });
});

router.get('/', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, users] = await asyncWrapper(userController.getAllUsers(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: users.length,
    data: users,
  });
});

router.get('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.getUserById(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data: user,
  });
});

router.patch(
  '/:id',
  protect,
  restrictTo('Admin'),
  validate(adminUpdateUserSchema),
  async (req, res, next) => {
    const [error, updatedUser] = await asyncWrapper(
      userController.updateUserById(req),
    );

    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      data: updatedUser,
    });
  },
);

router.delete('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, user] = await asyncWrapper(userController.deleteUserById(req));

  if (error) return next(error);
  res.sendStatus(204);
});

module.exports = router;
