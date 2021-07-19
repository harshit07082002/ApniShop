const catchAsync = require('./catchAsync');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const apiError = require('./../utils/apiError');
const { promisify } = require('util');

//Sign jwt

const signJWT = (id, res, req) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log('inside');
  const user = await User.create(req.body);
  console.log(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token: signJWT(user._id, res, req),
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  // Check if email and password is there

  if (!req.body.email || !req.body.password)
    return next(new apiError('no email or password', 404));

  // Check if the email exist

  const user = await User.findOne({ email: req.body.email }).select(
    '+password active'
  );

  if (user == undefined || user.active == false)
    return next(new apiError('no Account found', 404));

  // Check the Password

  if (!(await user.checkPassword(req.body.password, user.password)))
    return next(new apiError('Wrong password', 400));

  // Send the response

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Check if token is present or not

  if (!req.headers.authorization)
    return next(new apiError('Not login please login', 403));

  const token = req.headers.authorization.split(' ')[1];

  if (!token || token == null || token == '')
    return next(new apiError('Not login please login', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id).select('+role');

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  //Check if user has changed the password or not

  if (user.checkPasswordChange(decode.iat))
    return next(new apiError('Password Changed Login Again', 400));

  // Send the response

  req.user = user;
  return next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  if (
    !req.body.password ||
    !req.body.confirmPassword ||
    !req.body.currentPassword
  ) {
    return next(new apiError('please enter the full details', 400));
  }

  if (!req.headers.authorization)
    return next(new apiError('Not login please login', 403));

  const token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new apiError('Not login please login', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id).select('+password');

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  if (!(await user.checkPassword(req.body.currentPassword, user.password)))
    return next(new apiError('Wrong password!!', 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new apiError('Please enter the email', 400));

  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new apiError('No user found', 404));

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.params.token) return next(new apiError('No token!!', 403));

  const token = req.params.token;

  if (!token) return next(new apiError('Not Token', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id).select('+password');

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});

exports.restrictTo = (req, res, next) => {
  if (!req.user) {
    return next(
      new apiError('You are not login Please login to continue', 400)
    );
  }
  if (req.user.active === 'false')
    return next(new apiError('User Deleted', 404));
  if (req.user.role === 'admin') return next();
  else {
    return next(new apiError('You do not have access', 400));
  }
};

exports.checkLogin = async (req, res, next) => {
  try {
    if (!req.cookies) {
      // console.log('inside');
      return next();
    }
    let token;
    token = req.cookies.jwt;

    if (token) {
      //check if the token is valid or not
      const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      //check if user is present

      const user = await User.findById(decode.id).select('+role');
      if (!user) {
        return next();
      }

      //check if password has been changed or not

      if (user.checkPasswordChange(decode.iat)) {
        return next();
      }
      res.locals.user = user;
      req.user = user;
      return next();
    } else {
      return next();
    }
  } catch {
    return next();
  }
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
