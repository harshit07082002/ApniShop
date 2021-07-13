const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const reveiwRouter = express.Router({ mergeParams: true });

reveiwRouter
  .route('/')
  .post(authController.protect, reviewController.createReview)
  .get(reviewController.showAllReviews);

reveiwRouter
  .route('/:reviewID')
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

module.exports = reveiwRouter;
