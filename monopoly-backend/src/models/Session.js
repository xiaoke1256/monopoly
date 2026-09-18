import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: false },
  roomNo: {  type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// TTL 索引：expiresAt 到期后 MongoDB 自动删除文档
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Session', SessionSchema);
