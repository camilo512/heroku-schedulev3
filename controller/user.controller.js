const bcryp = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
//Models
const { User } = require('../models/user.model');
const { Repair } = require('../models/reparir.model');
const { Comment } = require('../models/comment.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const bcrypt = require('bcryptjs/dist/bcrypt');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [
      { model: Repair },
      {
        model: Comment,
        include: [{ model: Repair, include: [{ model: User }] }],
      },
    ],
  });

  res.status(200).json({
    users,
  });
});

const getUsersId = catchAsync(async (req, res, next) => {
  const { userId } = req;
  // const { id } = req.params;
  // const userId = await User.findOne({ where: { id } });

  res.status(200).json({
    userId,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  //   console.log(req.body.name)

  const { name, email, password, role, status } = req.body;

  //bycrip
  const salt = await bcryp.genSalt(12);
  const hashPassword = await bcryp.hash(password, salt);

  // INSERT INTO ...
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
    status,
  });

  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { name } = req.body;

  await userId.update({ name });
  res.status(200).json({ status: 'Success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req;
  //delete from...
  //await user.destroy();
  await userId.update({ status: 'deleted' });
  res.status(200).json({ status: 'Success' });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //validate that user exists with given email
  const user = await User.findOne({ where: { email, status: 'active' } });

  // compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }
  // generate JWT

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;
  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllUsers,
  createUser,
  getUsersId,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
