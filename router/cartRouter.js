const express = require('express');
const controller = require('../controllers/cartController');
const reveiwRouter = require('./reviewRouter');
const authController = require('./../controllers/authController');

router = express.Router();

router
  .route('/')
  .post(authController.protect, controller.addToCart)
  .delete(authController.protect, controller.deleteFromCart)
  .get(authController.protect, controller.getCartProduct)
  .patch(authController.protect, controller.updateQTY);

module.exports = router;
