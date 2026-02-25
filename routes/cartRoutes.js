const express = require('express');
const { cartController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
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
 */
router.post('/add', protect, validate(addToCartSchema), async (req, res, next) => {
  const [error, cart] = await asyncWrapper(cartController.addToCart(req));

  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    data: cart,
  });
});

/**
 * @swagger
 * /cart/remove/{bookId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
