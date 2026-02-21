const Users = require('../models/userModel');

const createUser = async (req) => {
  const data = req.body;
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

module.exports = {
  createUser,
  login,
};
