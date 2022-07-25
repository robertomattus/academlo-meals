const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Models
const { Users } = require('../models/users.model');
const { Orders } = require('../models/orders.model');
const { Restaurants } = require('../models/restaurants.model');
const { Meals } = require('../models/meals.model');

//utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

dotenv.config({ path: './config.env' });

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, rol } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = await Users.create({
    name: username,
    email,
    password: hashPassword,
    rol,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    newUser,
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email, status: 'active' } });

  if (!user) {
    return new AppError('Credentials are not valid', 400);
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return new AppError('Credentials are not valid', 400);
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});
const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  await user.update({ name: username, email });
  res.status(201).json({ status: 'success' });
});
const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({
    status: 'success',
  });
});

const getAllUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Orders.findAll({
    where: { userId: sessionUser.id },
    attributes: ['id', 'mealId', 'totalPrice', 'quantity', 'status'],
    include: [
      {
        model: Meals,
        attributes: ['name', 'price'],
        include: [
          { model: Restaurants, attributes: ['name', 'address', 'rating'] },
        ],
      },
    ],
  });

  if (!orders) {
    return new AppError('This user do not have any orders yet', 400);
  }

  res.status(200).json({
    status: 'success',
    orders,
  });
});
const getUserOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;
  const orders = await Orders.findAll({
    where: { id, userId: sessionUser.id },
    order: [['id', 'ASC']],
  });

  if (!orders) {
    return new AppError('Check Order ID', 400);
  }

  res.status(200).json({
    status: 'success',
    orders,
  });
});

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser,
  getAllUserOrders,
  getUserOrderById,
};
