const Product = require('../models/productModel');
const catchAsync = require('./catchAsync');
const commaNumber = require('comma-number');
const apiError = require('../utils/apiError');
const Review = require('../models/reviewModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

const checkTitle = (title, limit = 20) => {
  if (title.length > limit) {
    const ar = title.split(' ');
    let a = 0;
    const newAr = [];
    for (var i = 0; i < ar.length; i++) {
      a += ar[i].length;
      if (a <= limit) {
        newAr.push(ar[i]);
      } else break;
    }
    return `${newAr.join(' ')} ...`;
  }
  return title;
};

exports.homePage = catchAsync(async (req, res, next) => {
  //Electronics Items

  const electronics = await Product.find({
    productType: 'Electronics',
  }).limit(6);

  //Clothing Items

  const clothes = await Product.find({ productType: 'Shoes & Clothing' }).limit(
    6
  );
  const groceries = await Product.find({ productType: 'Groceries' }).limit(6);

  //Change Name and Price

  electronics.forEach((element) => {
    element.name = checkTitle(element.name);
    element.price1 = commaNumber(element.price);
  });

  clothes.forEach((element) => {
    element.name = checkTitle(element.name);
    element.price1 = commaNumber(element.price);
  });
  groceries.forEach((element) => {
    element.name = checkTitle(element.name);
    element.price1 = commaNumber(element.price);
  });

  let cart = undefined;
  let count = 0;
  if (req.user) cart = await Cart.findOne({ user: req.user._id });
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }
  //Render The Page

  res.status(200).render('home', {
    title: 'ApniShop',
    electronics,
    clothes,
    groceries,
    count,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  let cart = undefined;

  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }
  res.status(200).render('signup', {
    title: 'signup',
    count,
  });
});
exports.signin = catchAsync(async (req, res, next) => {
  let cart = undefined;

  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }

  res.status(200).render('signin', {
    title: 'signin',
    count,
  });
});

exports.Search = catchAsync(async (req, res, next) => {
  const query = req.params.slug;
  const data = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  data.forEach((el) => {
    el.price1 = commaNumber(el.price);
  });
  let cart = undefined;

  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }

  res.status(200).render('search', {
    title: query,
    data,
    slug: query,
    count,
  });
});
exports.showProduct = catchAsync(async (req, res, next) => {
  const query = req.params.id;
  const data = await Product.findById(query);
  const review = await Review.find({ product: query }).limit(5);
  data.price1 = commaNumber(data.price);
  let cart = undefined;
  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }
  let flag = false;
  const addReview = await Order.find({ user: req.user });
  addReview.forEach((element) => {
    element.product.forEach((e) => {
      console.log(e.item + ' ' + query);
      if (e.item.id == query) flag = true;
    });
  });

  res.status(200).render('product', {
    title: query,
    data,
    review,
    count,
    flag,
  });
});
exports.showReviews = catchAsync(async (req, res, next) => {
  const query = req.params.id;
  const review = await Review.find({ product: query });
  const data = await Product.findById(query);
  let cart = undefined;

  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }

  res.status(200).render('allReviews', {
    title: query,
    review,
    data,
    count,
  });
});
exports.addReview = catchAsync(async (req, res, next) => {
  const query = req.params.id;
  const data = await Product.findById(query);
  console.log(query);
  let cart = undefined;

  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }

  res.status(200).render('createReview', {
    title: query,
    data,
    count,
  });
});

exports.CartShow = catchAsync(async (req, res, next) => {
  let cart = undefined;

  if (req.user) cart = await Cart.findOne({ user: req.user._id });

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
      Price += cart.product[i].qty * cart.product[i].item.price;
      cart.product[i].price = commaNumber(cart.product[i].item.price);
    }
  }
  const TotalPrice = commaNumber(Price);

  res.status(200).render('cart', {
    title: 'query',
    count,
    cart,
    TotalPrice,
  });
});

exports.ShowOrders = catchAsync(async (req, res, next) => {
  let cart = undefined;
  let orders = undefined;
  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });

    orders = await Order.find({ user: req.user._id }).sort([['OrderDate', -1]]);
  }
  console.log('inside3');

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    console.log(cart);
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
    }
  }
  console.log('inside2');

  if (orders) {
    orders.forEach((e) => {
      e.product.forEach((element) => {
        element.price1 = commaNumber(element.item.price * element.qty);
      });
    });
  }
  console.log('inside1');

  const TotalPrice = commaNumber(Price);
  console.log('inside');

  res.status(200).render('orders', {
    title: 'query',
    count,
    cart,
    TotalPrice,
    orders,
  });
});
exports.successPage = catchAsync(async (req, res, next) => {
  let cart = undefined;
  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  }

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
      Price += cart.product[i].qty * cart.product[i].item.price;
      cart.product[i].price = commaNumber(cart.product[i].item.price);
    }
  }
  res.status(200).render('success', {
    title: 'query',
    count,
    cart,
  });
});

exports.Profile = catchAsync(async (req, res, next) => {
  let cart = undefined;
  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  }

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
      Price += cart.product[i].qty * cart.product[i].item.price;
      cart.product[i].price = commaNumber(cart.product[i].item.price);
    }
  }

  if (!req.user) {
    res.redirect('/signin');
  }

  res.status(200).render('profile', {
    title: 'query',
    count,
    cart,
    user: req.user,
  });
});
exports.security = catchAsync(async (req, res, next) => {
  let cart = undefined;
  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  }

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
      Price += cart.product[i].qty * cart.product[i].item.price;
      cart.product[i].price = commaNumber(cart.product[i].item.price);
    }
  }

  if (!req.user) {
    res.redirect('/signin');
  }

  res.status(200).render('security', {
    title: 'query',
    count,
    cart,
    user: req.user,
  });
});
exports.allOrders = catchAsync(async (req, res, next) => {
  let cart = undefined;
  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  }

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
      Price += cart.product[i].qty * cart.product[i].item.price;
      cart.product[i].price = commaNumber(cart.product[i].item.price);
    }
  }

  if (!req.user) {
    res.redirect('signin');
  }
  const orders = await Order.find({ status: 'In progress' }).sort([
    ['OrderDate', -1],
  ]);
  if (orders) {
    orders.forEach((e) => {
      e.product.forEach((element) => {
        element.price1 = commaNumber(element.item.price * element.qty);
      });
    });
  }
  res.status(200).render('approveOrders', {
    title: 'query',
    count,
    cart,
    orders,
  });
});
exports.addOrders = catchAsync(async (req, res, next) => {
  let cart = undefined;
  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id });
  }

  let count = 0;
  let Price = 0;
  if (cart == undefined) count = 0;
  else {
    for (let i = 0; i < cart.product.length; i++) {
      count += cart.product[i].qty;
      Price += cart.product[i].qty * cart.product[i].item.price;
      cart.product[i].price = commaNumber(cart.product[i].item.price);
    }
  }

  if (!req.user) {
    res.redirect('signin');
  }

  res.status(200).render('addProduct', {
    title: 'query',
    count,
    cart,
  });
});
