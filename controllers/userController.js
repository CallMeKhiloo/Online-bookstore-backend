const Users = require('../models/userModel');

const createUser = async (req) => {
  const data = req.body;
  const user = await Users.create(data);
  return user;
};

module.exports = {
  createUser,
};
