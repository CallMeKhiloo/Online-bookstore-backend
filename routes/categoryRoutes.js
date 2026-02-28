const express = require('express');
const { categoryController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validations/category.validation');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 len:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(
    categoryController.getAllCategories(req),
  );
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data,
  });
});

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryBody'
 *     responses:
 *       201:
 *         description: Category created
 *       500:
 *         description: Server error
 */

// admin-restricted
router.post(
  '/',
  protect,
  restrictTo('Admin'),
  validate(createCategorySchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      categoryController.createCategory(req),
    );
    if (error) return next(error);
    res.status(201).json({
      status: 'successful',
      len: 1,
      data,
    });
  },
);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *       500:
 *         description: Not found or server error
 */

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.getCategory(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: 1,
    data,
  });
});

/**
 * @swagger
 * /category/{id}/books:
 *   get:
 *     summary: Get all books belonging to a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of books in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 len:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Category not found or server error
 */

router.get('/:id/books', async (req, res, next) => {
  const [error, data] = await asyncWrapper(
    categoryController.getBooksByCategory(req),
  );
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data,
  });
});

/**
 * @swagger
 * /category/{id}:
 *   patch:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryBody'
 *     responses:
 *       200:
 *         description: Category updated
 *       500:
 *         description: Server error
 */

// admin-restricted
router.patch(
  '/:id',
  protect,
  restrictTo('Admin'),
  validate(updateCategorySchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      categoryController.updateCategory(req),
    );
    if (error) return next(error);
    res.status(204).send();
  },
);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category (Admin only) — blocked if books are assigned
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted
 *       500:
 *         description: Cannot delete — books still assigned, or server error
 */

// admin-restricted
router.delete('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, data] = await asyncWrapper(
    categoryController.deleteCategory(req),
  );
  if (error) return next(error);
  res.status(204).send();
});

module.exports = router;
