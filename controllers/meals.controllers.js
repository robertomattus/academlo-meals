//Model
const { Meals } = require('../models/meals.model');
const { Restaurants } = require('../models/restaurants.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const createMeal = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, price } = req.body;

  const newMeal = await Meals.create({
    name,
    price,
    restaurantId: restaurant.id,
  });

  res.status(201).json({
    status: 'success',
    newMeal,
  });
});

const allMeals = catchAsync(async (req, res, next) => {
  const data = await Meals.findAll({
    where: { status: 'active' },
    include: [
      {
        model: Restaurants,
        required: false,
        where: { status: 'active' },
        attributes: ['name', 'address'],
      },
    ],
  });

  data.map((dataValues) => {
    if (dataValues.dataValues.restaurant === null) {
      dataValues.dataValues.restaurant =
        'restaurant not available at this moment';
    }
  });

  res.status(200).json({
    status: 'success',
    data,
  });
});

const mealsById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  const data = await Meals.findOne({
    where: { status: 'active', id: meal.id },
    include: [
      {
        model: Restaurants,
        required: false,
        where: { status: 'active' },
        attributes: ['name', 'address'],
      },
    ],
  });

  if (!data) {
    return new AppError('Please check Meal Id again', 400);
  }

  if (data.dataValues.restaurant === null) {
    data.dataValues.restaurant = 'restaurant not available at this moment';
  }

  res.status(200).json({
    status: 'success',
    data,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({
    name,
    price,
  });

  res.status(204).json({});
});

const deletMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({
    status: 'deleted',
  });

  res.status(200).json({
    status: 'success',
  });
});

module.exports = {
  createMeal,
  allMeals,
  mealsById,
  updateMeal,
  deletMeal,
};
