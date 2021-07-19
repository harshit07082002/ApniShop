const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const apiError = require('../utils/apiError');

userRouter = express.Router();

userRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo,
    userController.showAllUsers
  );
userRouter.route('/signin').post(authController.signin);
userRouter.route('/signup').post(authController.signup);
userRouter.route('/logout').get(authController.logout);
userRouter
  .route('/updateMe')
  .patch(
    authController.protect,
    userController.uploadPhoto,
    userController.resizeUserPhoto,
    userController.editUser
  );
userRouter.route('/me').get(authController.protect, userController.me);
userRouter.route('/changePassword').post(authController.changePassword);
userRouter.route('/resetPassword/:token').post(authController.resetPassword);
userRouter.route('/forgotPassword').post(authController.forgotPassword);
userRouter
  .route('/deleteUser')
  .delete(authController.protect, userController.deleteUser);
userRouter.use('*', (req, res, next) => {
  next(new apiError('Bad url', 404));
});

module.exports = userRouter;
