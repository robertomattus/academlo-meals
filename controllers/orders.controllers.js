//models
const { Orders } = require('../models/orders.model');
const { Meals } = require('../models/meals.model');
const { Restaurants } = require('../models/restaurants.model');
//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const createAOrder = catchAsync(async (req, res, next) => {
  const { sessionUser, meal } = req;
  const { mealId, quantity } = req.body;

  const totalPrice = meal.price * quantity;

  const order = await Orders.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  res.status(200).json({
    status: 'success',
    order,
  });
});
const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Orders.findAll({
    where: { userId: sessionUser.id, status: 'active' },
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
    return new AppError('You dont have active orders', 400);
  }

  res.status(200).json({
    status: 'success',
    orders,
  });
});
const editOrderStatus = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'order completed',
  });
});
const cancelOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'success',
    message: 'order cancelled',
  });
});

module.exports = { createAOrder, getAllOrders, editOrderStatus, cancelOrder };
