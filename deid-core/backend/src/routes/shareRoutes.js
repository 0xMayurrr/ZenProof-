const express = require('express');
const { createShare, getShares, revokeShare, accessShare } = require('../controllers/shareController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createShare);
router.get('/', protect, getShares);
router.delete('/:id', protect, revokeShare);
router.get('/access/:token', accessShare); // Public

module.exports = router;
