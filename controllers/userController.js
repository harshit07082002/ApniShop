const User = require('./../models/userModel');
const catchAsync = require('./catchAsync');

const filterObject = (object) => {
  const res = {};
  const key = Object.keys(object).forEach((el) => {
    if (el !== 'password' && el !== 'confirmPassword' && el !== 'role') {
      res[el] = object[el];
    }
  });
  return res;
};

exports.showAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: true });
  res.status(200).json({
    status: 'success',
    length: users.length,
    data: {
      users,
    },
  });
});

exports.editUser = catchAsync(async (req, res, next) => {
  const filter = filterObject(req.body);

  const user = await User.findByIdAndUpdate(req.user._id, filter, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      runValidators: false,
    }
  );

  res.status(200).json({
    status: 'success',
    user,
  });
});
