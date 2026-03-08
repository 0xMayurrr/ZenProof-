import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  issuer: { type: String, required: true },
  issuerDID: { type: String, required: true },
  status: { type: String, enum: ['verified', 'pending', 'revoked'], default: 'pending' },
  issueDate: { type: Date, default: Date.now },
  expiryDate: Date,
  credentialData: { type: Object, required: true },
  blockchainTxHash: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Credential', credentialSchema);
