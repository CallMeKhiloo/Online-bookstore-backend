const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
    },
    dob: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'banned'],
      default: 'active',
    },
  },
  { timestamps: true },
);

// instance methods
userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { userId: this._id, role: this.role }, // i sent the role in order to check instantly if a route is for an admin
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

// document middlewares
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return next(); // don't hash if password hasn't changed
  this.password = await bcrypt.hash(this.password, 10); // async in order not to block the event loop
});

const user = mongoose.model('User', userSchema);
module.exports = user;
