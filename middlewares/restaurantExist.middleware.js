const { Restaurants } = require('../models/restaurants.model');
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const restaurantExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { meal } = req;

  const restaurant = await Restaurants.findOne({
    where: { id: id || meal.restaurantId, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('Restaurant not found or not active', 403));
  }

  next();
});

module.exports = { restaurantExist };
