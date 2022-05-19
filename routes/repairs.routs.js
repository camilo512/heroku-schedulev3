const express = require('express');

//Middleweareas
const { repairExists } = require('../middlewares/repairs.middlewares');
const {
  createRepairValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');
const {
  protectToken,
  protectEmployee,
} = require('../middlewares/users.middlewares');

// Controller
const {
  createRepairs,
  getAllRepairs,
  getRepairId,
  updateRepair,
  deleteRepair,
  getMyRepairsPending,
  getUsersRepairs,
  getMyRepairsCompleted,
} = require('../controller/repair.controller');

const router = express.Router();
router.use(protectToken);

//http://localhost:4001/api/v1/repairs
router.get('/', protectEmployee, getAllRepairs);
router.post('/', createRepairValidations, checkValidations, createRepairs);

router.get('/me/pending', getMyRepairsPending);
router.get('/me/completed', getMyRepairsCompleted);
router.get('/profile/:id', protectEmployee, getUsersRepairs);

router
  .route('/:id')
  .get(protectEmployee, repairExists, getRepairId)
  .patch(protectEmployee, repairExists, updateRepair)
  .delete(protectEmployee, repairExists, deleteRepair);

module.exports = { repairsRouter: router };
