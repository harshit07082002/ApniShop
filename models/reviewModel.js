const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    max: 5,
    min: 1,
    required: [true, 'Please add rating'],
  },
  review: {
    type: String,
    required: [true, 'Please write review'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'user must belong to a review'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'product must belong to a product'],
  },
});

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

reviewSchema.statics.calcAverageRatings = async function (Id) {
  const stats = await this.aggregate([
    {
      $match: { product: Id },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(Id, {
      totalRatings: Math.floor(stats[0].nRating),
      avgRating: Math.floor(stats[0].avgRating),
    });
  } else {
    await Product.findByIdAndUpdate(Id, {
      totalRatings: 0,
      avgRating: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
