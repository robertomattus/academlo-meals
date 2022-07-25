const { Reviews } = require('../models/reviews.model');
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const reviewExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Reviews.findOne({ where: { id } });

  if (!review) {
    return next(new AppError('Review not found', 403));
  }

  req.review = review;

  next();
});

module.exports = { reviewExist };
