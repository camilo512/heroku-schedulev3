const express = require('express');

//Middlewares

const {
  protectToken,
  protectEmployee,
} = require('../middlewares/users.middlewares');
const { commentsExists } = require('../middlewares/comments.middlewares');
const {
  createCommentsValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controller
const {
  getAllComments,
  createComments,
  getACommentsById,
  updateComment,
  deleteComment,
} = require('../controller/comments.controller');

const router = express.Router();

// Apply protectoken middleware
router.use(protectToken);

//GET all comments
router.get('/', protectEmployee, getAllComments);

//POST /repairId Create Comment
router.post(
  '/:repairId',
  protectEmployee,
  createCommentsValidations,
  checkValidations,
  createComments
);

//GET /:id comment by id
//PATCH /id Update comment
//DELETE /:id delete comment (status:deleted)
router
  .use('/:id', commentsExists, protectEmployee)
  .route('/:id')
  .get(getACommentsById)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = { commentsRouter: router };
