const Review = require('../models/reviewModel');
const catchAsync = require('./catchAsync');
const apiError = require('../utils/apiError');
const Order = require('../models/orderModel');

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const prevReview = await Review.find({
    $and: [{ user: req.body.user }, { product: req.body.product }],
  });

  let flag = false;
  const addReview = await Order.find({ user: req.user });
  addReview.forEach((element) => {
    element.product.forEach((e) => {
      if (e.item.id == req.body.product) flag = true;
    });
  });

  if (!flag) {
    return next(
      new apiError('You do not have permission to review this product', 400)
    );
  }

  if (prevReview.length == 0) {
    const review = await Review.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } else {
    return next(new apiError('You already reviewed this product'));
  }
});

exports.showAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.Id });
  res.status(200).json({
    status: 'success',
    length: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const userId = await Review.findById(req.params.reviewID);
  const str = JSON.stringify(userId.user._id);

  if (
    str.substring(1, str.length - 1) == req.user._id ||
    req.user.role == 'admin'
  ) {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewID,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } else return next(new apiError('Do not have permission', 400));
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const userId = await Review.findById(req.params.reviewID);
  const str = JSON.stringify(userId.user._id);

  if (
    str.substring(1, str.length - 1) == req.user._id ||
    req.user.role == 'admin'
  ) {
    await Review.findByIdAndDelete(req.params.reviewID);
    res.status(200).json({
      status: 'success',
    });
  } else return next(new apiError('Do not have permission', 400));
});
