const express = require('express');
const { cartController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  addToCartSchema,
  updateCartItemSchema,
} = require('../validations/cart.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: View user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           book:
 *                             type: object
 *                           quantity:
 *                             type: number
 *                           price:
 *                             type: number
 *                     totalPrice:
 *                       type: number
 *       401:
 *         description: Unauthorized - Login required
 *       500:
 *         description: Server error
 */
router.get('/', protect, async (req, res, next) => {
  const [error, cart] = await asyncWrapper(cartController.viewCart(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data: cart,
  });
});

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart or update quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *                 description: Book ID (MongoDB ObjectId)
 *                 example: 65d7f8e9a1b2c3d4e5f6g7h8
 *               quantity:
 *                 type: number
 *                 description: Quantity to add
 *                 example: 2
 *             required:
 *               - book
 *               - quantity
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or book not found
 *       401:
 *         description: Unauthorized - Login required
 *       500:
 *         description: Server error
 */
router.post(
  '/add',
  protect,
  validate(addToCartSchema),
  async (req, res, next) => {
    const [error, cart] = await asyncWrapper(cartController.addToCart(req));

    if (error) return next(error);
    res.status(201).json({
      status: 'successful',
      data: cart,
    });
  },
);

/**
 * @swagger
 * /cart/remove/{bookId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to remove from cart
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - Login required
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */
router.delete('/remove/:bookId', protect, async (req, res, next) => {
  const [error, cart] = await asyncWrapper(cartController.removeFromCart(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data: cart,
  });
});

/**
 * @swagger
 * /cart/update/{bookId}:
 *   patch:
 *     summary: Update quantity of item in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to update quantity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: New quantity
 *                 example: 5
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Login required
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/update/:bookId',
  protect,
  validate(updateCartItemSchema),
  async (req, res, next) => {
    const [error, cart] = await asyncWrapper(
      cartController.updateItemQuantity(req),
    );

    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      data: cart,
    });
  },
);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear entire shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: successful
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - Login required
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.delete('/clear', protect, async (req, res, next) => {
  const [error, cart] = await asyncWrapper(cartController.clearCart(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data: cart,
  });
});

module.exports = router;
