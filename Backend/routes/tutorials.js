// const router = require("express").Router();
// const multer = require('multer');
// const path = require('path');



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'TuteFiles'); // Store uploaded files in the "uploads" directory
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, 'pdf-' + uniqueSuffix + fileExtension);
//   },
// });

// const upload = multer({ storage });

// const {
//   createTutorial,
//   getAllTutorials,
//   getTutorialById,
//   updateTutorialById,
//   deleteTutorialById,
// } = require('../controllers/tutorialController');

// // Create a new tutorial with file upload
// router.post('/create', upload.single('pdf'), createTutorial);

// // Get all tutorials
// router.get('/allT', getAllTutorials);

// // Get a specific tutorial by ID
// router.get('/getT/:id', getTutorialById);

// // Update a tutorial by ID
// router.put('/updateT/:id', updateTutorialById);

// // Delete a tutorial by ID
// router.delete('/deleteT/:id', deleteTutorialById);


// module.exports = router;

const express = require("express");
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'TuteFiles'); // Store uploaded files in the "TuteFiles" directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'pdf-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

const {
  createTutorial,
  getAllTutorials,
  getTutorialById,
  updateTutorialById,
  deleteTutorialById,
} = require('../controllers/tutorialController');

router.post('/create', authenticate(['admin']), upload.single('pdf'), createTutorial);
router.get('/allT', authenticate(['admin', 'user']), getAllTutorials);
router.get('/getT/:id', authenticate(['admin', 'user']), getTutorialById);
router.put('/updateT/:id', authenticate(['admin']), updateTutorialById);
router.delete('/deleteT/:id', authenticate(['admin']), deleteTutorialById);

module.exports = router;
