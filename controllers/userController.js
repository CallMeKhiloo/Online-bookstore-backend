const Users = require('../models/userModel');
const customError = require('../helpers/customError');
const sendVerificationEmail = require('../utils/email');

const getMe = async (req) => {
  const user = await Users.findById(req.user._id);
  return user;
};

const createUser = async (req) => {
  const user = new Users(req.body);

  const verificationToken = user.generateVerificationToken();
  await user.save(); // call DB once

  await sendVerificationEmail({
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.BACK_END_URL}/users/verify-email/${verificationToken}`,
  });

  return user;
};

const getAllUsers = async (req) => {
  const users = await Users.find();
  return users;
};

const getUserById = async (req) => {
  const user = await Users.findById(req.params.id);

  if (!user) throw new customError('User not found', 404);
  return user;
};

const updateUserById = async (req) => {
  const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after', // to return the updated doc
    runValidators: true,
  });

  if (!updatedUser) throw new customError('User not found', 404);
  return updatedUser;
};

const login = async (req) => {
  const body = req.body;
  const user = await Users.findOne({ email: body.email }).select('+password');

  if (!user) throw new customError('User name or password is not correct', 401);

  if (!user.isVerified)
    throw new customError('Please verify your email before logging in', 401);

  const isValidPassword = await user.verifyPassword(body.password);
  if (!isValidPassword)
    throw new customError('User name or password is not correct', 401);

  return user.generateJWT();
};

const updateMe = async (req) => {
  const updatedUser = await Users.findByIdAndUpdate(req.user._id, req.body, {
    returnDocument: 'after', // to return the updated doc
    runValidators: true,
  });

  if (!updatedUser) throw new customError('User not found', 404);

  return updatedUser;
};

const deleteUserById = async (req) => {
  const deletedUser = await Users.findByIdAndDelete(req.params.id);

  if (!deletedUser) throw new customError('User not found', 404);
  return deletedUser;
};

const verifyEmail = async (req) => {
  const { token } = req.params;

  const user = await Users.findOne({
    verificationToken: token,
    verificationTokenExpiresAt: { $gt: Date.now() },
  }).select('+verificationToken +verificationTokenExpiresAt');

  if (!user)
    throw new customError('Invalid or expired verification token', 400);

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return user;
};

module.exports = {
  createUser,
  login,
  updateMe,
  getAllUsers,
  getMe,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyEmail,
};
