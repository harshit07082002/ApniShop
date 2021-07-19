const catchAsync = require('./catchAsync');
const Product = require('../models/productModel');

exports.addProduct = catchAsync(async (req, res, next) => {
  req.body.about.replace('\\n', '\n');
  console.log(req.body.about);
  const data = await Product.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      product: data,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const data = await Product.find();
  res.status(200).json({
    status: 'success',
    length: data.length,
    data: {
      products: data,
    },
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const query = req.params.query;

  const data = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  // Sending Response

  res.status(200).json({
    status: 'success',
    length: data.length,
    data: {
      products: data,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      product: data,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
  });
});
exports.getSpecificProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});
