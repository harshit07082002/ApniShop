const express = require('express');
const controller = require('../controllers/orderController');
const authController = require('./../controllers/authController');

router = express.Router();

router
  .route('/checkout-session/:cartId')
  .get(authController.protect, controller.createSession);

router.route('/').post(authController.protect, controller.createOrder);

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo,
    controller.deleteOrder
  )
  .patch(
    authController.protect,
    authController.restrictTo,
    controller.updateOrder
  );

module.exports = router;
