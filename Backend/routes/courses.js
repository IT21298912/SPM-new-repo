const express = require("express");
const { authenticate } = require('../middleware/auth.middleware');
const {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
} = require('../controllers/courseController');

const router = express.Router();

router.post('/add', authenticate(['admin']), addCourse);
router.get('/getCourses', authenticate(['admin', 'user']), getCourses);
router.get('/get/:courseid', authenticate(['admin', 'user']), getCourseById);
router.put('/update/:courseid', authenticate(['admin']), updateCourse);
router.delete('/delete/:courseid', authenticate(['admin']), deleteCourse);

module.exports = router;