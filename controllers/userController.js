const Users = require('../models/userModel');

const getMe = async (req) => {
  const user = await Users.findById(req.user._id);
  return user;
};

const createUser = async (req) => {
  const data = req.body;
  console.log(data);
  const user = await Users.create(data);
  return user;
};

const login = async (req) => {
  const body = req.body;
  const user = await Users.findOne({ email: body.email });

  if (!user) throw new Error('User name or passowrd is not correct');

  const isValidPassword = await user.verifyPassword(body.password);
  if (!isValidPassword) throw new Error('User name or passowrd is not correct');

  return user.generateJWT();
};

const updateMe = async (req) => {
  const updatedUser = await Users.findByIdAndUpdate(req.user._id, req.body, {
    returnDocument: 'after', // to return the updated doc
    runValidators: true,
  });

  return updatedUser;
};

const getAllUsers = async (req) => {
  // .select('-password') ensures we never accidentally send hashes to the frontend
  const users = await Users.find().select('-password');
  return users;
};

// Delete a user by ID
const deleteUser = async (req) => {
  const user = await Users.findByIdAndDelete(req.params.id);
  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (req) => {
  const { id } = req.params;
  const updatedUser = await Users.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};

module.exports = {
  createUser,
  login,
  updateMe,
  getAllUsers,
  deleteUser,
  updateUser,
  getMe,
};
