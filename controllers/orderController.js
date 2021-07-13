const catchAsync = require('./catchAsync');
const apiError = require('../utils/apiError');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
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
    success_url: `${req.protocol}://${req.get('host')}/success`,
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

const createOrderCheckout = async (session) => {
  const cart = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const items = await Cart.findById(cart);
  await Order.create({ user, product: items.product });
  await Cart.findByIdAndDelete(cart);
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  console.log('inside');
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createOrderCheckout(event.data.object);

  res.status(200).json({ received: true });
};
