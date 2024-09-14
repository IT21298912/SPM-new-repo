// const express = require('express');
// const PostController = require('../controllers/postController');

// const router = express.Router();

// // Post routes
// router.post('/posts', PostController.createPost);
// router.get('/posts', PostController.getAllPosts);
// router.get('/posts/:id', PostController.getPostById);
// router.put('/posts/:id', PostController.updatePost);
// router.delete('/posts/:id', PostController.deletePost);

// // Implement other post-related routes as needed

// module.exports = router;


const express = require('express');
const PostController = require('../controllers/postController');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/posts', authenticate(['admin']), PostController.createPost);
router.get('/posts', authenticate(['admin', 'user']), PostController.getAllPosts);
router.get('/posts/:id', authenticate(['admin', 'user']), PostController.getPostById);
router.put('/posts/:id', authenticate(['admin']), PostController.updatePost);
router.delete('/posts/:id', authenticate(['admin']), PostController.deletePost);

module.exports = router;

