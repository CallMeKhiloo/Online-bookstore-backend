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
    DOB: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
  },
  { timestamps: true },
);

// document middlewares
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return next(); // don't hash if password hasn't changed
  this.password = await bcrypt.hash(this.password, 10); // async in order not to block the event loop
});

const user = mongoose.model('User', userSchema);
module.exports = user;
