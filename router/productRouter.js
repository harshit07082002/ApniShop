const express = require('express');
const controller = require('../controllers/ProductController');
const reveiwRouter = require('./reviewRouter');
const authController = require('./../controllers/authController');

Productrouter = express.Router();

Productrouter.route('/')
  .post(
    authController.protect,
    authController.restrictTo,
    controller.uploadPhoto,
    controller.addProduct
  )
  .get(controller.getAllProducts);

Productrouter.use('/:Id/reviews', reveiwRouter);

Productrouter.route('/:query').get(controller.getProducts);

Productrouter.route('/id/:id')
  .get(controller.getSpecificProduct)
  .patch(
    authController.protect,
    authController.restrictTo,
    controller.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo,
    controller.deleteProduct
  );

module.exports = Productrouter;
