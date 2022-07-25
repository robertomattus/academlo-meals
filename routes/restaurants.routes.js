const express = require('express');

const restaurantRouter = express.Router();

const {
  restaurantExist,
} = require('../middlewares/restaurantExist.middleware');
const { reviewExist } = require('../middlewares/reviewExist.middleware');
const {
  protectSession,
  verifyUserRol,
  verifyUserAccount,
  verifySameSession,
} = require('../middlewares/auth.middleware');
const {
  createRestaurantValidators,
} = require('../middlewares/validations.middleware');

const {
  newRestaurant,
  allRestaurant,
  restaurantById,
  updateRestaurant,
  deletRestaurant,
  newReviewRestaurant,
  updateReview,
  deleteReview,
} = require('../controllers/restaurants.controllers');

restaurantRouter.get('/', allRestaurant);
restaurantRouter.get('/:id', restaurantExist, restaurantById);

restaurantRouter.use(protectSession);

restaurantRouter.post('/', createRestaurantValidators, newRestaurant);

restaurantRouter.post('/reviews/:restaurantId', newReviewRestaurant);
restaurantRouter.patch(
  '/reviews/:id',
  reviewExist,
  verifySameSession,
  updateReview
);
restaurantRouter.delete(
  '/reviews/:id',
  reviewExist,
  verifySameSession,
  deleteReview
);

restaurantRouter
  .use('/:id', restaurantExist)
  .route('/:id')
  .patch(verifyUserRol, updateRestaurant)
  .delete(verifyUserRol, deletRestaurant);

module.exports = { restaurantRouter };
