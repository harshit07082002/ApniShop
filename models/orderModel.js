const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
        default: 1,
      },
    },
  ],
  status: {
    type: String,
    enum: ['Success', 'In progress'],
    default: 'In progress',
  },
  TotalPrice: {
    type: Number,
    required: [true, 'Please add Price'],
  },
  OrderDate: {
    type: Date,
    default: Date.now(),
  },
});

orderSchema.pre(/^find/, function () {
  this.populate({
    path: 'product.item',
    select: 'name price image _id',
  });
  this.populate({
    path: 'user',
  });
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
