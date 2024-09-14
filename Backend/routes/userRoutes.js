const express = require('express');
const { register, login, getDetails, updateUser, deleteUser, checkOldPassword, sendVerificationKey, changePassword, getUsers } = require('../controllers/auth.controllers');
const { authenticate, googleAuthenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/profile', authenticate(), getDetails);
router.put('/updateUser', authenticate(['admin', 'user']), updateUser);
router.post('/deleteUser', authenticate(['admin']), deleteUser);
router.post('/resetPassword', authenticate(), checkOldPassword);
router.post('/sendVerificationCode', authenticate(), sendVerificationKey);
router.post('/changePassword', authenticate(), changePassword);
router.post('/getAllUsers', authenticate(['admin']), getUsers);

module.exports = router;

