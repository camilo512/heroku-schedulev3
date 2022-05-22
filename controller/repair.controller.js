const { ref, uploadBytes } = require('firebase/storage');
//Models
const { Repair } = require('../models/reparir.model');
const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const { RepairImg } = require('../models/reapairImgs.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const { async } = require('@firebase/util');

const getAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    include: [
      { model: RepairImg },
      { model: User, attributes: { exclude: ['password'] } },
      {
        model: Comment,
        // where: { status: 'active' },
        include: [{ model: User, attributes: ['id', 'name'] }],
      },
    ],
  });
  res.status(200).json({
    repairs,
  });
});

const getRepairId = catchAsync(async (req, res, next) => {
  const { repairId } = req;
  // const { id } = req.params;
  // const repairId = await Repair.findOne({ where: { id } });

  if (!repairId) {
    return res.status(404).json({
      status: 'error',
      message: 'Repair not found given that id',
    });
  }

  res.status(200).json({
    repairId,
  });
});

const createRepairs = catchAsync(async (req, res) => {
  //   console.log(req.body.name)

  const { date, computerNumber, observations, status, userId } = req.body;
  const { sessionUser } = req;

  const newRepair = await Repair.create({
    date,
    computerNumber,
    observations,
    status,
    userId: sessionUser.id,
  });

  console.log(req.files);

  // Map through the files and upload them to firebase
  const repairImgsPromises = req.files.map(async file => {
    // Create img ref
    const imgRef = ref(storage, `repairs/${file.originalname}`);
    // Use upload bytes
    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    // Create a new RepairImg instance (repairImg.create)
    return await RepairImg.create({
      repairId: newRepair.id,
      repairImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  // Resolve the pending
  await Promise.all(repairImgsPromises);

  res.status(201).json({ status: 'Sucess', newRepair });
});

const updateRepair = catchAsync(async (req, res) => {
  const { repairId } = req;
  const { status } = req.body;

  await repairId.update({ status });
  res.status(200).json({ status: 'completed' });
});

const deleteRepair = catchAsync(async (req, res) => {
  const { repairId } = req;

  await repairId.update({ status: 'cancelled' });
  res.status(200).json({ status: 'Success' });
});

const getUsersRepairs = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { userId } = req;
  // const { id } = req.params;
  // const repairId = await Repair.findOne({ where: { id } });

  if (!userId) {
    return res.status(404).json({
      status: 'error',
      message: 'Repair not found given that id',
    });
  }

  const repairs = await Repair.findAll({
    where: { userId: id },
    include: [{ model: User, attributes: { exclude: ['password'] } }],
  });

  res.status(200).json({ repairs });
});

const getMyRepairsPending = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const repairs = await Repair.findAll({
    where: { userId: sessionUser.id, status: 'pending' },
    include: [
      {
        model: User,
        attributes: { exclude: ['password'] },
      },
    ],
  });

  res.status(200).json({ repairs });
});

const getMyRepairsCompleted = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const repairs = await Repair.findAll({
    where: { userId: sessionUser.id, status: 'completed' },
    include: [
      {
        model: User,
        attributes: { exclude: ['password'] },
      },
    ],
  });

  res.status(200).json({ repairs });
});

module.exports = {
  getAllRepairs,
  createRepairs,
  getRepairId,
  updateRepair,
  deleteRepair,
  getUsersRepairs,
  getMyRepairsPending,
  getMyRepairsCompleted,
};
