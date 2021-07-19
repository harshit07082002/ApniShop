const catchAsync = require('./catchAsync');
const Product = require('../models/productModel');
const multer = require('multer');
const apiError = require('../utils/apiError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/product');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `product-${req.body.name}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new apiError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single('photo');

exports.addProduct = catchAsync(async (req, res, next) => {
  console.log(req.file);
  req.body.image = req.file.filename;
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
