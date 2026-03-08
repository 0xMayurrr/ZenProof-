const express = require('express');
const { verifyCredentialObj } = require('../controllers/verifyController');

const router = express.Router();

router.get('/:credentialHash', verifyCredentialObj);

module.exports = router;
