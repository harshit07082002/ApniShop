const catchAsync = require('./catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const apiError = require('../utils/apiError');

exports.addToCart = catchAsync(async (req, res, next) => {
  const itemsInCart = await Cart.findOne({ user: req.user._id });
  if (itemsInCart == null) {
    req.body.user = req.user._id;
    const cart = await Cart.create(req.body);
  } else {
    const product = itemsInCart.product;

    product.push({
      item: req.body.product[0].item,
      qty: req.body.product[0].qty,
    });

    const items = await Cart.findByIdAndUpdate(itemsInCart._id, {
      product,
    });
  }
  const cart = await Cart.findOne({ user: req.user._id });
  res.status(200).json({
    status: 'success',
    cart,
  });
});

exports.deleteFromCart = catchAsync(async (req, res, next) => {
  const itemsInCart = await Cart.find({ user: req.user._id });

  if (itemsInCart.length == 0) {
    res.status.json({
      status: 'success',
    });
  } else {
    const productId = req.body.product;
    const product = itemsInCart[0].product;
    product.forEach((element, index) => {
      if (element._id == productId) {
        product.splice(index, 1);
      }
    });

    if (product.length == 0) {
      await Cart.findOneAndDelete({ user: req.user._id });
    } else {
      await Cart.findByIdAndUpdate(itemsInCart[0]._id, {
        product,
      });
    }

    res.status(200).json({
      status: 'success',
    });
  }
});

exports.getCartProduct = catchAsync(async (req, res, next) => {
  const itemsInCart = await Cart.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      itemsInCart,
    },
  });
});

exports.updateQTY = catchAsync(async (req, res, next) => {
  const itemsInCart = await Cart.findOne({ user: req.user._id });

  itemsInCart.product.forEach((element) => {
    if (element._id == req.body.product) {
      element.qty = req.body.qty;
    }
  });
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      product: itemsInCart.product,
    }
  );
  res.status(200).json({
    status: 'success',
  });
});
