const catchAsync = require('./catchAsync');
const apiError = require('../utils/apiError');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.createOrder = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const order = await Order.create(req.body);
  res.status(200).json({
    status: 'success',
    order,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    order,
  });
});
exports.createSession = catchAsync(async (req, res, next) => {
  const cartData = await Cart.findById(req.params.cartId);
  let items = [];
  let price = 0;
  cartData.product.forEach((element) => {
    items.push({
      name: element.item.name,
      amount: element.item.price * 100,
      currency: 'INR',
      quantity: element.qty,
      images: [
        `https://ama-zon.herokuapp.com/img/product/${element.item.image}`,
      ],
    });
    price += element.item.price * element.qty;
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}?user=${
      req.user._id
    }&cart=${cartData._id}&price=${price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    line_items: items,
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  const user = req.query.user;
  const cart = req.query.cart;
  const price = req.query.price;
  console.log(user + ' ' + cart);
  if (!user || !cart) {
    return next();
  }
  const items = await Cart.findById(cart);
  await Order.create({ user, product: items.product, TotalPrice: price });
  await Cart.findByIdAndDelete(cart);
  let url = req.originalUrl.split('?');

  res.redirect('/success');
});
