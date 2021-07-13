const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must add their name'],
  },
  email: {
    type: String,
    required: [true, 'user must add their email Address'],
    unique: [true, 'email should be unique'],
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'not a valid role',
    },
    default: 'user',
    select: false,
  },
  address: {
    type: String,
    required: [true, 'user must add their address'],
  },
  pincode: {
    type: String,
    required: [true, 'user must add their pincode'],
    maxlength: 6,
    minlength: 6,
  },
  password: {
    type: String,
    required: [true, 'Add password'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'add confirm password'],
    validate: {
      validator: function () {
        if (this.password === this.confirmPassword) return true;
        return false;
      },
      message: 'Password and ConfirmPassword does not match',
    },
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  passwordChangedDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  } else {
    this.passwordChangedDate = Date.now() - 1000;
    next();
  }
});

userSchema.methods.checkPassword = async function (userPass, realPass) {
  return await bcrypt.compare(userPass, realPass);
};

userSchema.methods.checkPasswordChange = function (tokenTime) {
  if (this.passwordChangedDate) {
    const time = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
    return tokenTime < time;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
