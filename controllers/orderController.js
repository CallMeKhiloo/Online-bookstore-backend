const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Book = require('../models/bookModel');
const customError = require('../helpers/customError');

// User views their own order history
const getUserOrders = async (req) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate('items.book')
    .populate('user', 'firstName lastName email')
    .sort('-createdAt');

  if (!orders || orders.length === 0) {
    return {
      message: 'No orders found for this user',
      orders: [],
      total: 0,
    };
  }

  return {
    message: 'Orders retrieved successfully',
    orders,
    total: orders.length,
  };
};

// User views a specific order
const getUserOrder = async (req) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate('items.book')
    .populate('user', 'firstName lastName email');

  if (!order) {
    throw new customError(
      'Order not found or you do not have permission to view this order',
      404
    );
  }

  return order;
};

// Admin views all orders
const getAllOrders = async (req) => {
  const { status, paymentStatus, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status) filter.orderStatus = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const orders = await Order.find(filter)
    .populate('items.book')
    .populate('user', 'firstName lastName email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalOrders = await Order.countDocuments(filter);

  return {
    message: 'All orders retrieved successfully',
    data: orders,
    pagination: {
      total: totalOrders,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(totalOrders / limit),
    },
  };
};

// Admin views orders for a specific user
const getUserOrdersAdmin = async (req) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const orders = await Order.find({ user: userId })
    .populate('items.book')
    .populate('user', 'firstName lastName email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (!orders || orders.length === 0) {
    return {
      message: 'No orders found for this user',
      orders: [],
      total: 0,
    };
  }

  const totalOrders = await Order.countDocuments({ user: userId });

  return {
    message: 'User orders retrieved successfully',
    data: orders,
    total: totalOrders,
  };
};

// Admin updates order status
const updateOrderStatus = async (req) => {
  const { orderId } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(orderId);

  if (!order) throw new customError('Order not found', 404);

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  await order.populate('items.book');
  await order.populate('user', 'firstName lastName email');

  return order;
};

// User creates order from cart with transaction support
const createOrder = async (req) => {
  const userId = req.user._id;
  const { shippingDetails, paymentMethod, items } = req.body;
  const session = await Order.startSession();
  session.startTransaction();

  try {
    let itemsToOrder = [];
    let totalAmount = 0;

    // If items are provided in request, use those
    if (items && items.length > 0) {
      for (const item of items) {
        const book = await Book.findById(item.book).session(session);
        if (!book) throw new customError(`Book with ID ${item.book} not found`, 404);

        itemsToOrder.push({
          book: item.book,
          quantity: item.quantity,
          price: book.price,
        });

        totalAmount += book.price * item.quantity;
      }
    } else {
      // Otherwise, pull from user's cart
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new customError('Cart is empty. Add items before placing an order.', 400);
      }

      itemsToOrder = cart.items;
      totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Clear cart within transaction
      cart.items = [];
      await cart.save({ session });
    }

    // Create order within transaction
    const order = await Order.create(
      [
        {
          user: userId,
          items: itemsToOrder,
          shippingDetails,
          paymentMethod,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Populate after transaction is committed
    await order[0].populate('items.book');
    await order[0].populate('user', 'firstName lastName email');

    return order[0];
  } catch (error) {
    // Rollback transaction on any error
    await session.abortTransaction();
    session.endSession();
    throw new customError(error.message || 'Failed to create order', error.statusCode || 500);
  }
};

module.exports = {
  getUserOrders,
  getUserOrder,
  getAllOrders,
  getUserOrdersAdmin,
  updateOrderStatus,
  createOrder,
};
