const express = require('express');
const controller = require('./../controllers/viewController');
const authControoler = require('./../controllers/authController');
const orderController = require('../controllers/orderController');
viewRouter = express.Router();

viewRouter.use(authControoler.checkLogin);

viewRouter.route('/reviews/:id').get(controller.showReviews);
viewRouter.route('/addReview/:id').get(controller.addReview);
viewRouter
  .route('/')
  .get(orderController.createOrderCheckout, controller.homePage);
viewRouter.get('/product/:slug', controller.Search);
viewRouter.route('/signup').get(controller.signup);
viewRouter.route('/signin').get(controller.signin);
viewRouter.route('/item/:id').get(controller.showProduct);
viewRouter.route('/cart').get(controller.CartShow);
viewRouter.route('/orders').get(controller.ShowOrders);
viewRouter.route('/success').get(controller.successPage);
viewRouter.route('/profile').get(controller.Profile);
viewRouter.route('/profile/security').get(controller.security);
viewRouter
  .route('/profile/AllOrders')
  .get(authControoler.restrictTo, controller.allOrders);
module.exports = viewRouter;
