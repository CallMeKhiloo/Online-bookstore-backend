const express = require('express');
const { reviewController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createReviewSchema,
  updateReviewSchema,
} = require('../validations/review.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book review management
 */

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews (optionally filter by book ID)
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: book
 *         schema:
 *           type: string
 *         description: Filter reviews by a specific Book ID
 *     responses:
 *       200:
 *         description: List of reviews
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
 *                     type: object
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book
 *               - rating
 *             properties:
 *               book:
 *                 type: string
 *                 description: The ID of the book being reviewed
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       500:
 *         description: Server error or duplicate review
 */

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(reviewController.getAllReviews(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data,
  });
});

router.post(
  '/',
  protect,
  validate(createReviewSchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      reviewController.createReview(req),
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
 * /review/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 *   patch:
 *     summary: Update a review (Only the author or Admin can do this)
 *     tags: [Reviews]
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
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Forbidden - Not the author
 *   delete:
 *     summary: Delete a review (Only the author or Admin can do this)
 *     tags: [Reviews]
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
 *         description: Review deleted successfully
 *       403:
 *         description: Forbidden - Not the author
 */

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(reviewController.getReview(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: 1,
    data,
  });
});

router.patch(
  '/:id',
  protect,
  validate(updateReviewSchema),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      reviewController.updateReview(req),
    );
    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      len: 1,
      data,
    });
  },
);

router.delete('/:id', protect, async (req, res, next) => {
  const [error, data] = await asyncWrapper(reviewController.deleteReview(req));
  if (error) return next(error);
  res.status(204).send();
});

module.exports = router;
