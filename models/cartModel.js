const mongoose = require('mongoose');
const slugify = require('slugify');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'user must belong to a review'],
  },
  product: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'product must belong to a product'],
      },
      qty: {
        type: Number,
        required: [true, 'product must have qty'],
      },
    },
  ],
});

cartSchema.pre(/^find/, function () {
  this.populate({
    path: 'product.item',
    select: 'name price image _id',
  });
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
