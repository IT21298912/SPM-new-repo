// const express = require('express');
// const CommentController = require('../controllers/commentController');
// const router = express.Router();

// // Comment routes
// router.post('/posts/:postId/comments', CommentController.createComment);
// router.get('/posts/:postId/comments', CommentController.getCommentsForPost);
// router.get('/comments/:commentId', CommentController.getCommentById);
// router.put('/comments/:commentId', CommentController.updateComment);
// router.delete('/comments/:commentId', CommentController.deleteComment);

// // Implement other comment-related routes as needed

// module.exports = router;


const express = require('express');
const CommentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();

// Comment routes
router.post('/posts/:postId/comments', authenticate(['admin', 'user']), CommentController.createComment);
router.get('/posts/:postId/comments', authenticate(['admin', 'user']), CommentController.getCommentsForPost);
router.get('/comments/:commentId', authenticate(['admin', 'user']), CommentController.getCommentById);
router.put('/comments/:commentId', authenticate(['admin']), CommentController.updateComment);
router.delete('/comments/:commentId', authenticate(['admin']), CommentController.deleteComment);

module.exports = router;
