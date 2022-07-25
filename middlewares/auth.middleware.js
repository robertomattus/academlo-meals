const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//models
const { Users } = require('../models/users.model');

//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Invalid session', 403));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await Users.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(new AppError('The owner of this token its not active', 403));
  }

  req.sessionUser = user;
  next();
});

const verifyUserAccount = (req, res, next) => {
  const { sessionUser, user, review } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
};

const verifySameSession = (req, res, next) => {
  const { sessionUser, order } = req;
  console.log(order);

  if (sessionUser.id !== order.userId) {
    return next(new AppError('You do not have access for this action', 403));
  }
  next();
};

const verifyUserRol = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.rol !== 'admin') {
    return next(
      new AppError('you dont have permission to complete this action', 403)
    );
  }

  next();
};

module.exports = {
  protectSession,
  verifyUserAccount,
  verifyUserRol,
  verifySameSession,
};
