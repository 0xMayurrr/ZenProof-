const express = require('express');
const { getNonce, verifySignature, getMe, login, signup, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/nonce', getNonce);
router.post('/verify', verifySignature);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/search', protect, require('../controllers/authController').searchUser);

module.exports = router;
