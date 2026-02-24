const express = require('express');
const { authorController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

/**
 * @swagger
 * /author:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors
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
 *                     $ref: '#/components/schemas/Author'
 */

const validate = require('../middlewares/validate');
const {
  createAuthorSchema,
  updateAuthorSchema,
} = require('../validations/author.validation');

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.getAllAuthors(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data,
  });
});

/**
 * @swagger
 * /author:
 *   post:
 *     summary: Create a new author (Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorBody'
 *     responses:
 *       201:
 *         description: Author created
 *       500:
 *         description: Server errors
 */

// Admin-restricted
router.post(
  '/',
  protect,
  restrictTo('Admin'),
  validate(createAuthorSchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      authorController.createAuthor(req),
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
 * /author/{id}:
 *   get:
 *     summary: Get a single author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author found
 *       500:
 *         description: Not found or server error
 */

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.getAuthor(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: 1,
    data,
  });
});

/**
 * @swagger
 * /author/{id}/books:
 *   get:
 *     summary: Get all books by a specific author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: List of books by this author
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
 *         description: Author not found or server error
 */

router.get(
  '/:id/books',
  protect,
  restrictTo('Admin'),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      authorController.getBooksByAuthor(req),
    );
    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      len: data.length,
      data,
    });
  },
);

/**
 * @swagger
 * /author/{id}:
 *   patch:
 *     summary: Update an author (Admin only)
 *     tags: [Authors]
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
 *             $ref: '#/components/schemas/AuthorBody'
 *     responses:
 *       204:
 *         description: Author updated
 *       500:
 *         description: Server error
 */

// Admin-restricted
router.patch(
  '/:id',
  protect,
  restrictTo('Admin'),
  validate(updateAuthorSchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      authorController.updateAuthor(req),
    );
    if (error) return next(error);
    res.status(204).send();
  },
);

/**
 * @swagger
 * /author/{id}:
 *   delete:
 *     summary: Delete an author (Admin only) — blocked if books are assigned
 *     tags: [Authors]
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
 *         description: Author deleted
 *       500:
 *         description: Cannot delete — books still assigned, or server error
 */

// Admin-restricted
router.delete('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.deleteAuthor(req));
  if (error) return next(error);
  res.status(204).send();
});

module.exports = router;
