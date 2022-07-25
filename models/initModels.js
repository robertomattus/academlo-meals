const initModels = () => {
  const { Meals } = require('./meals.model');
  const { Orders } = require('./orders.model');
  const { Restaurants } = require('./restaurants.model');
  const { Reviews } = require('./reviews.model');
  const { Users } = require('./users.model');

  Restaurants.hasMany(Reviews, { foreignKey: 'restaurantId' });
  Reviews.belongsTo(Restaurants);

  Restaurants.hasMany(Meals, { foreignKey: 'restaurantId' });
  Meals.belongsTo(Restaurants);

  Users.hasMany(Reviews, { foreignKey: 'userId' });
  Reviews.belongsTo(Users);

  Users.hasMany(Orders, { foreignKey: 'userId' });
  Orders.belongsTo(Users);

  Meals.hasOne(Orders, { foreignKey: 'mealId' });
  Orders.belongsTo(Meals);
};

module.exports = { initModels };
