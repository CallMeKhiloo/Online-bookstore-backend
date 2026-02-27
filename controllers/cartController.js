const Cart = require('../models/cartModel');
const Book = require('../models/bookModel');

// Add item to cart or update quantity
const addToCart = async (req) => {
  const userId = req.user._id;
  const { book, quantity } = req.body;

  // Verify book exists and get its price
  const bookData = await Book.findById(book);
  if (!bookData) throw new Error('Book not found. Invalid book ID.');

  // Find or create cart for user
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: userId,
      items: [
        {
          book,
          quantity,
          price: bookData.price,
        },
      ],
    });
  } else {
    // Check if book already in cart
    const existingItem = cart.items.find(
      (item) => item.book.toString() === book,
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        book,
        quantity,
        price: bookData.price,
      });
    }

    await cart.save();
  }

  // Populate book details before returning
  await cart.populate('items.book');
  
  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    ...cart.toObject(),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};

// Remove item from cart
const removeFromCart = async (req) => {
  const userId = req.user._id;
  const { bookId } = req.params;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error('Cart not found for this user.');

  // Filter out the book from items
  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

  await cart.save();

  await cart.populate('items.book');
  
  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    ...cart.toObject(),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};

// View user's cart
const viewCart = async (req) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId })
    .populate('items.book')
    .populate('user');

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({
      user: userId,
      items: [],
    });
    await cart.populate('items.book');
    await cart.populate('user');
  }

  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    ...cart.toObject(),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};

// Clear entire cart
const clearCart = async (req) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error('Cart not found for this user.');

  cart.items = [];
  await cart.save();

  return {
    ...cart.toObject(),
    totalPrice: 0,
  };
};

// Update item quantity
const updateItemQuantity = async (req) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error('Cart not found for this user.');

  const item = cart.items.find((i) => i.book.toString() === bookId);

  if (!item) throw new Error('Item not found in cart.');

  item.quantity = quantity;
  await cart.save();

  await cart.populate('items.book');
  
  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    ...cart.toObject(),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};

module.exports = {
  addToCart,
  removeFromCart,
  viewCart,
  clearCart,
  updateItemQuantity,
};
