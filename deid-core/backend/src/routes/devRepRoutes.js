const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();
const devRepController = require('../controllers/devRepController');

router.post('/update', protect, devRepController.updateDevRepScore);
router.get('/:walletAddress', devRepController.getDevRepScore);

module.exports = router;
