const express = require('express');
const { issueCredential, revokeCredential, getMyCredentials, getIssuedCredentials, getCredentialById } = require('../controllers/credentialController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/issue', protect, upload.single('document'), issueCredential);
router.put('/revoke/:id', protect, revokeCredential);
router.get('/issued', protect, getIssuedCredentials);
router.get('/', protect, getMyCredentials);
router.get('/:id', protect, getCredentialById);

module.exports = router;
