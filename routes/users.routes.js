const express = require('express');

const usersRouter = express.Router();

const {
  createUser,
  login,
  updateUser,
  deleteUser,
  getAllUserOrders,
  getUserOrderById,
} = require('../controllers/users.controllers');

const {
  protectSession,
  verifyUserAccount,
} = require('../middlewares/auth.middleware');
const {
  createUserValidators,
} = require('../middlewares/validations.middleware');

const { userExist } = require('../middlewares/userExist.middleware');

usersRouter.post('/signup', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/orders', getAllUserOrders);

usersRouter.get('/orders/:id', getUserOrderById);

usersRouter
  .use('/:id', userExist)
  .route('/:id')
  .patch(verifyUserAccount, updateUser)
  .delete(verifyUserAccount, deleteUser);

module.exports = { usersRouter };
