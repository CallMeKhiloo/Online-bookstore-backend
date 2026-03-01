const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const customError = require('../helpers/customError');

const protect = async (req, res, next) => {
  // 401 -> unauthorized
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      throw new customError('You are not logged in! Please log in to get access.', 401);

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await Users.findById(payload.userId);
    if (!currentUser)
      throw new customError('The user belonging to this token no longer exists.', 401);

    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo = (...roles) => {
  // 403 -> forbidden
  /* 
  restrictTo will be executed when server starts,
  then the returned function will execute whenever this middleware is used
  when there is a call to this specific route
  */
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new customError(
        'You do not have permission to perform this action',
        403
      );
      return next(error);
    }

    next();
  };
};

module.exports = { protect, restrictTo };
