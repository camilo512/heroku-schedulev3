const bcryp = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

//Models
const { User } = require('../models/user.model');
const { Repair } = require('../models/reparir.model');
const { Comment } = require('../models/comment.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { storage } = require('../utils/firebase');

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

  // Map async: you will use this techinque evertyme thah you need some async operations inside of an array
  const usersPromises = users.map(async user => {
    // Create firebase img ref and get the full path
    const imgRef = ref(storage, user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    // Update  the user's profileImgUrl property
    user.profileImgUrl = url;
    return user;
  });

  // Resolve every promise that map gave us ([Promise { <pending> }])
  const usersResolved = await Promise.all(usersPromises);

  res.status(200).json({
    users: usersResolved,
  });
});

const getUsersId = catchAsync(async (req, res, next) => {
  const { userId } = req;
  // const { id } = req.params;
  // const userId = await User.findOne({ where: { id } });

  //Get url from Firebase
  const imgRef = ref(storage, userId.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  userId.profileImgUrl = url;

  res.status(200).json({
    userId,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  //   console.log(req.body.name)

  const { name, email, password, role, profileImgUrl, status } = req.body;

  // console.log(req.file);
  // console.table(req.body);

  const imgRef = ref(storage, `users/${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  console.log(imgUploaded);

  //bycrip
  const salt = await bcryp.genSalt(12);
  const hashPassword = await bcryp.hash(password, salt);

  // INSERT INTO ...
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
    profileImgUrl: imgUploaded.metadata.fullPath,
    status,
  });

  newUser.password = undefined;

  res.status(201).json({ status: 'sucess', newUser });
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
