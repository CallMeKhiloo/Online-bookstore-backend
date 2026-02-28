const Users = require('../models/userModel');
const customError = require('../helpers/customError');

const getMe = async (req) => {
  const user = await Users.findById(req.user._id);
  return user;
};

const createUser = async (req) => {
  const data = req.body;
  console.log(data);
  const user = await Users.create(data);

  if (!user) throw new customError('Failed to create user', 500);
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
  const user = await Users.findOne({ email: body.email });

  if (!user) throw new customError('User name or password is not correct', 401);

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

// Delete a user by ID
const deleteUser = async (req) => {
  const user = await Users.findByIdAndDelete(req.params.id);
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  createUser,
  login,
  updateMe,
  getAllUsers,
  deleteUser,
  getMe,
  getUserById,
  updateUserById,
};
