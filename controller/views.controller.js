const path = require('path');

//Models
const { Repair } = require('../models/reparir.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');

const renderIndex = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({ where: { status: 'active' } });

  res.status(200).render('index', {
    title: 'Title coming from controller',
    repairs,
  });
});

module.exports = { renderIndex };
