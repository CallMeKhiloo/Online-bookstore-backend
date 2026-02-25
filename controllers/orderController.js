const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Book = require('../models/bookModel');

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
    throw new Error(
      'Order not found or you do not have permission to view this order',
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

  if (!order) throw new Error('Order not found');

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  await order.populate('items.book');
  await order.populate('user', 'firstName lastName email');

  return order;
};

// User creates order from cart
const createOrder = async (req) => {
  const userId = req.user._id;
  const { shippingDetails, paymentMethod, items } = req.body;

  let itemsToOrder = [];
  let totalAmount = 0;

  // If items are provided in request, use those
  if (items && items.length > 0) {
    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) throw new Error(`Book with ID ${item.book} not found`);

      itemsToOrder.push({
        book: item.book,
        quantity: item.quantity,
        price: book.price,
      });

      totalAmount += book.price * item.quantity;
    }
  } else {
    // Otherwise, pull from user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty. Add items before placing an order.');
    }

    itemsToOrder = cart.items;
    totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Clear cart after order creation
    cart.items = [];
    await cart.save();
  }

  const order = await Order.create({
    user: userId,
    items: itemsToOrder,
    shippingDetails,
    paymentMethod,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  });

  await order.populate('items.book');
  await order.populate('user', 'firstName lastName email');

  return order;
};

module.exports = {
  getUserOrders,
  getUserOrder,
  getAllOrders,
  getUserOrdersAdmin,
  updateOrderStatus,
  createOrder,
};
