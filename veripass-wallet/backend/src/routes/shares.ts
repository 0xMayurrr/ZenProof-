import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { credentialId, expiresIn } = req.body;
    const shareId = crypto.randomUUID();
    res.json({ shareId, url: `${process.env.APP_URL}/verify?share=${shareId}` });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    res.json([]);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
