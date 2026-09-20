import mongoose from 'mongoose';

const TempRoomNoSchema = new mongoose.Schema({
  roomNo: {  type: String, required: true,unique: true },
  createByUserId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
  createBySessionId:{ type: String , required: false},
},{ timestamps: true });

// TTL updatedAt 到期后 MongoDB 自动删除文档 (20分钟后)
TempRoomNoSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60*20 });

export default mongoose.model('temp_room_no', TempRoomNoSchema);