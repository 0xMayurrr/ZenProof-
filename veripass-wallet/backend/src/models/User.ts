import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['individual', 'issuer', 'admin'], default: 'individual' },
  did: { type: String, required: true, unique: true },
  walletAddress: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
