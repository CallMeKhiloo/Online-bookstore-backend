const express = require('express');
const { orderController } = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require('../validations/order.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order (from cart or provided items)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer']
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  protect,
  validate(createOrderSchema),
  async (req, res, next) => {
    const [error, order] = await asyncWrapper(
      orderController.createOrder(req),
    );

    if (error) return next(error);
    res.status(201).json({
      status: 'successful',
      data: order,
    });
  },
);

/**
 * @swagger
 * /order/my-orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-orders', protect, async (req, res, next) => {
  const [error, data] = await asyncWrapper(orderController.getUserOrders(req));

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data,
  });
});

/**
 * @swagger
 * /order/my-orders/{orderId}:
 *   get:
 *     summary: Get specific order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/my-orders/:orderId', protect, async (req, res, next) => {
  const [error, order] = await asyncWrapper(
    orderController.getUserOrder(req),
  );

  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    data: order,
  });
});

/**
 * @swagger
 * /order/admin/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: ['Pending', 'Completed', 'Failed', 'Refunded']
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: All orders retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get(
  '/admin/all',
  protect,
  restrictTo('Admin'),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(orderController.getAllOrders(req));

    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      data,
    });
  },
);

/**
 * @swagger
 * /order/admin/user/{userId}:
 *   get:
 *     summary: Get orders for a specific user (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: User's orders retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get(
  '/admin/user/:userId',
  protect,
  restrictTo('Admin'),
  async (req, res, next) => {
    const [error, data] = await asyncWrapper(
      orderController.getUserOrdersAdmin(req),
    );

    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      data,
    });
  },
);

/**
 * @swagger
 * /order/admin/update/{orderId}:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
 *               paymentStatus:
 *                 type: string
 *                 enum: ['Pending', 'Completed', 'Failed', 'Refunded']
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/admin/update/:orderId',
  protect,
  restrictTo('Admin'),
  validate(updateOrderStatusSchema),
  async (req, res, next) => {
    const [error, order] = await asyncWrapper(
      orderController.updateOrderStatus(req),
    );

    if (error) return next(error);
    res.status(200).json({
      status: 'successful',
      data: order,
    });
  },
);

module.exports = router;
