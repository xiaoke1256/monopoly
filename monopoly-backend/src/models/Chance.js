import mongoose from 'mongoose';

const ChanceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    mapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Map', required: true },
    description: { type: String, required: true },
    payAmount: { type: Number, default: null },
    payFromType: { type: String, enum: ['all', 'you','min-cash','max-cash','min-property','max-property'], default: 'you' },/* 指玩家 */
    moveTo: { type: Number, default: null },
});

export default mongoose.model('Chance', ChanceSchema);