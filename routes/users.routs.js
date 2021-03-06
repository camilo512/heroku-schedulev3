const express = require('express');
const utils = require('pg/lib/utils');

//Middlewear
const {
  userExists,
  protectToken,
  protectEmployee,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controller
const {
  getAllUsers,
  createUser,
  getUsersId,
  updateUser,
  deleteUser,
  login,
  checkToken,
} = require('../controller/user.controller');

//Utils
const { upload } = require('../utils/multer');

const router = express.Router();

router.post(
  '/',
  upload.single('profileImg'),
  createUserValidations,
  checkValidations,
  createUser
);
router.post('/login', login);

// Apply protectoken middleware
router.use(protectToken);

//http://localhost:4001/api/v1/users
router.get('/', protectEmployee, getAllUsers);

router.get('/check-token', checkToken);

//http://localhost:4001/api/v1/users/id
router
  .route('/:id')
  .get(protectEmployee, userExists, getUsersId)
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
