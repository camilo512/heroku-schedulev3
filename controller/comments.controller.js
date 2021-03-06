//Models
const { Comment } = require('../models/comment.model');

// utils
const { catchAsync } = require('../utils/catchAsync');

const getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({ where: { status: 'active' } });

  res.status(200).json({ comments });
});

const createComments = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { repairId } = req.params;
  const { sessionUser } = req;

  const newComment = await Comment.create({
    text,
    userId: sessionUser.id,
    repairId,
  });

  res.status(201).json({ newComment });
});

const getACommentsById = catchAsync(async (req, res, next) => {
  const { comment } = req;

  res.status(200).json({ comment });
});

const updateComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { comment } = req;

  await comment.update({ text });

  res.status(200).json({ status: 'success' });
});
const deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllComments,
  createComments,
  getACommentsById,
  updateComment,
  deleteComment,
};
