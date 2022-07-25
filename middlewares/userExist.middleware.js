const { Users } = require('../models/users.model');
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const userExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findOne({ where: { id } });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;

  next();
});
module.exports = { userExist };
