const { Repair } = require('../models/reparir.model');

const repairExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repairId = await Repair.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });

    if (!repairId) {
      return res.status(404).json({
        status: 'error',
        message: 'Repair not found given that id',
      });
    }
    req.repairId = repairId;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { repairExists };
