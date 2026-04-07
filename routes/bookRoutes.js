const express = require('express');
const { bookController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect, restrictTo } = require('../middlewares/auth');

const validate = require('../middlewares/validate');
const {
  createBookSchema,
  updateBookSchema,
} = require('../validations/book.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Get all books (paginated, filterable, searchable)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search books by name (case-insensitive)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 len:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 */

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.getAllBooks(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.totalBooks,
    data: data.books,
  });
});

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Create a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookBody'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Server error
 */
router.post('/', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.createBook(req));
  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    len: 1,
    data,
  });
});

/**
 * @swagger
 * /book/latest:
 *   get:
 *     summary: Get the latest 10 books added to the store
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of latest 10 books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 len:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 */
router.get('/latest', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.getLatestBooks(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data,
  });
});

/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       500:
 *         description: Book not found or server error
 */

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.getBook(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: 1,
    data,
  });
});

/**
 * @swagger
 * /book/{id}:
 *   patch:
 *     summary: Update a book by ID (Admin only)
 *     tags: [Books]
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
 *             $ref: '#/components/schemas/BookBody'
 *     responses:
 *       204:
 *         description: Book updated successfully
 *       500:
 *         description: Server error
 */

// admin-restricted
router.patch(
  '/:id',
  protect,
  restrictTo('Admin'),
  validate(updateBookSchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(bookController.updateBook(req));
    if (error) return next(error);
    res.status(204).send();
  },
);

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Delete a book by ID (Admin only)
 *     tags: [Books]
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
 *         description: Book deleted successfully
 *       500:
 *         description: Server error
 */

// admin-restricted
router.delete('/:id', protect, restrictTo('Admin'), async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.deleteBook(req));
  if (error) return next(error);
  res.status(204).send();
});

module.exports = router;
