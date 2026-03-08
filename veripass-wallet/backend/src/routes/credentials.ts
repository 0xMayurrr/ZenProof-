import express from 'express';
import Credential from '../models/Credential.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.userId });
    res.json(credentials);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const credential = await Credential.findOne({ _id: req.params.id, userId: req.userId });
    if (!credential) return res.status(404).json({ error: 'Not found' });
    res.json(credential);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { credentialData } = req.body;
    res.json({ verified: true, credentialData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
