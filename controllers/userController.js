const User = require('./../models/userModel');
const catchAsync = require('./catchAsync');
const multer = require('multer');
const apiError = require('../utils/apiError');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new apiError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  let filter = filterObject(req.body);
  if (req.file && req.file.filename) filter['photo'] = req.file.filename;
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
